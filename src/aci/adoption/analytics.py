"""Employee AI adoption analytics across teams, business units, and organizations."""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass, field
from datetime import UTC, date, datetime, timedelta
from threading import RLock
from typing import TYPE_CHECKING, Literal, Protocol, cast

import structlog

from aci.optional_deps import RedisPackageError, load_sync_redis

if TYPE_CHECKING:
    from aci.models.events import DomainEvent

logger = structlog.get_logger()

ScopeType = Literal["organization", "business_unit", "team"]


class SupportsRedisAdoption(Protocol):
    def get(self, key: str) -> str | bytes | None: ...
    def set(self, key: str, value: str) -> bool | None: ...
    def ping(self) -> bool: ...
    def close(self) -> None: ...


@dataclass(slots=True)
class EmployeeDirectoryRecord:
    """Resolved employee directory metadata used for adoption rollups."""

    employee_id: str
    name: str = ""
    email: str = ""
    title: str = ""
    team_id: str = ""
    team_name: str = ""
    business_unit_id: str = ""
    business_unit_name: str = ""
    organization_id: str = ""
    organization_name: str = ""
    eligible_for_ai: bool = True
    last_identity_login_at: datetime | None = None
    updated_at: datetime = field(default_factory=lambda: datetime.now(UTC))


@dataclass(slots=True)
class DailyUsageRollup:
    """One employee-day aggregate of AI activity."""

    day: str
    requests: int = 0
    spend_usd: float = 0.0
    governed_requests: int = 0
    intervention_requests: int = 0
    input_tokens: int = 0
    output_tokens: int = 0
    model_counts: dict[str, int] = field(default_factory=dict)
    entry_point_counts: dict[str, int] = field(default_factory=dict)


@dataclass(frozen=True)
class AdoptionSummary:
    eligible_employees: int
    active_employees_7d: int
    active_employees_30d: int
    adoption_penetration_pct: float
    repeat_user_rate_pct: float
    power_user_rate_pct: float
    governed_usage_pct: float
    intervention_rate_pct: float
    requests_30d: int
    spend_30d_usd: float
    spend_per_active_employee_usd: float
    requests_per_active_employee: float
    growth_vs_prior_pct: float


@dataclass(frozen=True)
class AdoptionScopeBreakdown:
    scope_type: ScopeType
    scope_id: str
    label: str
    eligible_employees: int
    active_employees_30d: int
    adoption_penetration_pct: float
    growth_vs_prior_pct: float
    requests_30d: int
    spend_30d_usd: float
    governed_usage_pct: float
    top_entry_point: str


@dataclass(frozen=True)
class AdoptionTopEmployee:
    employee_id: str
    name: str
    title: str
    team_name: str
    business_unit_name: str
    requests_30d: int
    spend_30d_usd: float
    governed_usage_pct: float
    last_active_at: datetime | None
    adoption_stage: str
    top_model: str
    top_entry_point: str


@dataclass(frozen=True)
class AdoptionMixRecord:
    label: str
    requests: int
    spend_usd: float
    pct_of_requests: float


@dataclass(frozen=True)
class AdoptionTrendPoint:
    label: str
    active_employees: int
    requests: int
    spend_usd: float
    governed_usage_pct: float


@dataclass(frozen=True)
class AdoptionExecutiveLens:
    audience: str
    headline: str
    detail: str
    metric_label: str
    metric_value: str


@dataclass(frozen=True)
class AdoptionDashboard:
    generated_at: datetime
    scope_type: ScopeType
    scope_id: str
    scope_label: str
    parent_scope_label: str | None
    window_days: int
    summary: AdoptionSummary
    child_scopes: list[AdoptionScopeBreakdown]
    top_employees: list[AdoptionTopEmployee]
    model_mix: list[AdoptionMixRecord]
    entry_point_mix: list[AdoptionMixRecord]
    trend: list[AdoptionTrendPoint]
    executive_lenses: list[AdoptionExecutiveLens]


@dataclass(frozen=True)
class AdoptionHierarchyTeam:
    team_id: str
    team_name: str
    eligible_employees: int


@dataclass(frozen=True)
class AdoptionHierarchyBusinessUnit:
    business_unit_id: str
    business_unit_name: str
    eligible_employees: int
    teams: list[AdoptionHierarchyTeam]


@dataclass(frozen=True)
class AdoptionHierarchyOrganization:
    organization_id: str
    organization_name: str
    eligible_employees: int
    business_units: list[AdoptionHierarchyBusinessUnit]


@dataclass(frozen=True)
class AdoptionHierarchy:
    organization: AdoptionHierarchyOrganization
    default_scope_type: ScopeType
    default_scope_id: str


@dataclass(slots=True)
class _EmployeeWindowAggregate:
    employee: EmployeeDirectoryRecord
    requests_current: int = 0
    requests_last_7d: int = 0
    requests_previous: int = 0
    spend_current: float = 0.0
    governed_current: int = 0
    intervention_current: int = 0
    last_active_at: datetime | None = None
    model_counts: Counter[str] = field(default_factory=Counter)
    entry_point_counts: Counter[str] = field(default_factory=Counter)


@dataclass(slots=True)
class _MonthlyTrendBucket:
    label: str
    active_employees: int = 0
    requests: int = 0
    spend_usd: float = 0.0
    governed_requests: int = 0


class AdoptionAnalytics:
    """Hierarchy-aware employee adoption analytics service."""

    def __init__(
        self,
        *,
        retention_days: int = 180,
        repeat_user_request_threshold: int = 5,
        power_user_request_threshold: int = 20,
        redis_url: str | None = None,
        redis_prefix: str = "aci:adoption",
        redis_client: SupportsRedisAdoption | None = None,
    ) -> None:
        self._lock = RLock()
        self._employees: dict[str, EmployeeDirectoryRecord] = {}
        self._daily_usage: dict[str, dict[str, DailyUsageRollup]] = {}
        self._retention_days = retention_days
        self._repeat_user_request_threshold = repeat_user_request_threshold
        self._power_user_request_threshold = power_user_request_threshold
        self._redis_prefix = redis_prefix
        self._redis = (
            redis_client
            if redis_client is not None
            else (
                cast(
                    "SupportsRedisAdoption",
                    load_sync_redis("Redis adoption backend").from_url(
                        redis_url,
                        decode_responses=True,
                    ),
                )
                if redis_url
                else None
            )
        )
        self._durable_errors = 0
        self._reference_time: datetime | None = None
        if self._redis is not None:
            self._load_from_redis()

    @property
    def employee_count(self) -> int:
        with self._lock:
            return len(self._employees)

    def clear(self) -> None:
        with self._lock:
            self._employees.clear()
            self._daily_usage.clear()
            self._reference_time = None
        self._persist()

    def set_reference_time(self, reference_time: datetime | None) -> None:
        """Pin dashboard windows for deterministic demo/test baselines."""
        with self._lock:
            self._reference_time = (
                reference_time.astimezone(UTC) if reference_time is not None else None
            )

    def close(self) -> None:
        if self._redis is not None:
            self._redis.close()

    def durable_backend_healthy(self) -> bool:
        if self._redis is None:
            return True
        try:
            return bool(self._redis.ping())
        except RedisPackageError:
            self._durable_errors += 1
            return False

    def _clock_now(self) -> datetime:
        with self._lock:
            if self._reference_time is not None:
                return self._reference_time
        return datetime.now(UTC)

    def _today(self) -> date:
        return self._clock_now().date()

    def upsert_employee(
        self,
        *,
        employee_id: str,
        name: str = "",
        email: str = "",
        title: str = "",
        team_id: str = "",
        team_name: str = "",
        business_unit_id: str = "",
        business_unit_name: str = "",
        organization_id: str = "",
        organization_name: str = "",
        eligible_for_ai: bool = True,
        last_identity_login_at: datetime | None = None,
    ) -> EmployeeDirectoryRecord:
        normalized_employee_id = _normalize_employee_id(employee_id, email=email)
        if not normalized_employee_id:
            msg = "employee_id or email is required"
            raise ValueError(msg)

        with self._lock:
            record = self._employees.get(normalized_employee_id)
            if record is None:
                record = EmployeeDirectoryRecord(employee_id=normalized_employee_id)
                self._employees[normalized_employee_id] = record
            self._merge_employee_record(
                record,
                name=name,
                email=email,
                title=title,
                team_id=team_id,
                team_name=team_name,
                business_unit_id=business_unit_id,
                business_unit_name=business_unit_name,
                organization_id=organization_id,
                organization_name=organization_name,
                eligible_for_ai=eligible_for_ai,
                last_identity_login_at=last_identity_login_at,
            )
        self._persist()
        return record

    def record_identity_login(self, event: DomainEvent) -> None:
        attrs = event.attributes
        employee_id = _normalize_employee_id(
            str(attrs.get("person_id") or attrs.get("employee_id") or ""),
            email=str(attrs.get("user_email") or attrs.get("email") or ""),
        )
        if not employee_id:
            return
        self.upsert_employee(
            employee_id=employee_id,
            name=str(attrs.get("person_name") or attrs.get("employee_name") or ""),
            email=str(attrs.get("user_email") or attrs.get("email") or ""),
            title=str(attrs.get("employee_title") or attrs.get("title") or ""),
            team_id=str(attrs.get("team_id") or ""),
            team_name=str(attrs.get("team_name") or ""),
            business_unit_id=str(attrs.get("business_unit_id") or ""),
            business_unit_name=str(attrs.get("business_unit_name") or ""),
            organization_id=str(attrs.get("organization_id") or ""),
            organization_name=str(attrs.get("organization_name") or ""),
            eligible_for_ai=bool(attrs.get("eligible_for_ai", True)),
            last_identity_login_at=event.event_time,
        )

    def handle_org_change(self, event: DomainEvent) -> None:
        attrs = event.attributes
        employee_id = _normalize_employee_id(
            str(attrs.get("person_id") or ""),
            email=str(attrs.get("user_email") or attrs.get("email") or ""),
        )
        if not employee_id:
            return
        self.upsert_employee(
            employee_id=employee_id,
            name=str(attrs.get("person_name") or attrs.get("employee_name") or ""),
            email=str(attrs.get("user_email") or attrs.get("email") or ""),
            title=str(attrs.get("employee_title") or attrs.get("title") or ""),
            team_id=str(attrs.get("new_team") or attrs.get("team_id") or ""),
            team_name=str(
                attrs.get("new_team_name")
                or attrs.get("team_name")
                or attrs.get("new_team")
                or ""
            ),
            business_unit_id=str(attrs.get("business_unit_id") or ""),
            business_unit_name=str(attrs.get("business_unit_name") or ""),
            organization_id=str(attrs.get("organization_id") or ""),
            organization_name=str(attrs.get("organization_name") or ""),
            eligible_for_ai=bool(attrs.get("eligible_for_ai", True)),
        )

    def handle_team_membership(self, event: DomainEvent) -> None:
        attrs = event.attributes
        employee_id = _normalize_employee_id(
            str(attrs.get("person_id") or ""),
            email=str(attrs.get("user_email") or attrs.get("email") or ""),
        )
        if not employee_id:
            return
        if str(attrs.get("action") or "added").lower() == "removed":
            self.upsert_employee(
                employee_id=employee_id,
                name=str(attrs.get("person_name") or attrs.get("employee_name") or ""),
                email=str(attrs.get("user_email") or attrs.get("email") or ""),
                title=str(attrs.get("employee_title") or attrs.get("title") or ""),
                team_id="",
                team_name="",
                business_unit_id=str(attrs.get("business_unit_id") or ""),
                business_unit_name=str(attrs.get("business_unit_name") or ""),
                organization_id=str(attrs.get("organization_id") or ""),
                organization_name=str(attrs.get("organization_name") or ""),
                eligible_for_ai=bool(attrs.get("eligible_for_ai", True)),
            )
            return
        self.upsert_employee(
            employee_id=employee_id,
            name=str(attrs.get("person_name") or attrs.get("employee_name") or ""),
            email=str(attrs.get("user_email") or attrs.get("email") or ""),
            title=str(attrs.get("employee_title") or attrs.get("title") or ""),
            team_id=str(attrs.get("team_id") or ""),
            team_name=str(attrs.get("team_name") or attrs.get("team_id") or ""),
            business_unit_id=str(attrs.get("business_unit_id") or ""),
            business_unit_name=str(attrs.get("business_unit_name") or ""),
            organization_id=str(attrs.get("organization_id") or ""),
            organization_name=str(attrs.get("organization_name") or ""),
            eligible_for_ai=bool(attrs.get("eligible_for_ai", True)),
        )

    def handle_inference_request(self, event: DomainEvent) -> None:
        attrs = event.attributes
        self.record_inference_activity(
            occurred_at=event.event_time,
            employee_id=str(attrs.get("person_id") or attrs.get("employee_id") or ""),
            email=str(attrs.get("user_email") or attrs.get("email") or ""),
            employee_name=str(attrs.get("person_name") or attrs.get("employee_name") or ""),
            title=str(attrs.get("employee_title") or attrs.get("title") or ""),
            team_id=str(attrs.get("team_id") or ""),
            team_name=str(attrs.get("team_name") or ""),
            business_unit_id=str(attrs.get("business_unit_id") or ""),
            business_unit_name=str(attrs.get("business_unit_name") or ""),
            organization_id=str(attrs.get("organization_id") or ""),
            organization_name=str(attrs.get("organization_name") or ""),
            model=str(attrs.get("model") or ""),
            provider=str(attrs.get("provider") or ""),
            entry_point=str(attrs.get("entry_point") or attrs.get("service_name") or "api"),
            cost_usd=_as_float(attrs.get("cost_usd")),
            input_tokens=_as_int(attrs.get("input_tokens")),
            output_tokens=_as_int(attrs.get("output_tokens")),
            governed=bool(attrs.get("governed", False)),
            intervention_applied=bool(attrs.get("intervention_applied", False)),
            eligible_for_ai=bool(attrs.get("eligible_for_ai", True)),
        )

    def record_inference_activity(
        self,
        *,
        occurred_at: datetime,
        employee_id: str = "",
        email: str = "",
        employee_name: str = "",
        title: str = "",
        team_id: str = "",
        team_name: str = "",
        business_unit_id: str = "",
        business_unit_name: str = "",
        organization_id: str = "",
        organization_name: str = "",
        model: str = "",
        provider: str = "",
        entry_point: str = "api",
        cost_usd: float = 0.0,
        input_tokens: int = 0,
        output_tokens: int = 0,
        governed: bool = False,
        intervention_applied: bool = False,
        eligible_for_ai: bool = True,
    ) -> None:
        normalized_employee_id = _normalize_employee_id(employee_id, email=email)
        if not normalized_employee_id:
            logger.debug("adoption.inference_ignored", reason="missing_employee_identity")
            return

        timestamp = occurred_at.astimezone(UTC)
        day_key = timestamp.date().isoformat()
        model_label = _normalize_model_label(provider, model)
        normalized_entry_point = _normalize_entry_point(entry_point)

        with self._lock:
            profile = self._employees.get(normalized_employee_id)
            if profile is None:
                profile = EmployeeDirectoryRecord(employee_id=normalized_employee_id)
                self._employees[normalized_employee_id] = profile
            self._merge_employee_record(
                profile,
                name=employee_name,
                email=email,
                title=title,
                team_id=team_id,
                team_name=team_name,
                business_unit_id=business_unit_id,
                business_unit_name=business_unit_name,
                organization_id=organization_id,
                organization_name=organization_name,
                eligible_for_ai=eligible_for_ai,
            )

            employee_days = self._daily_usage.setdefault(normalized_employee_id, {})
            rollup = employee_days.get(day_key)
            if rollup is None:
                rollup = DailyUsageRollup(day=day_key)
                employee_days[day_key] = rollup
            rollup.requests += 1
            rollup.spend_usd += max(cost_usd, 0.0)
            rollup.governed_requests += int(governed)
            rollup.intervention_requests += int(intervention_applied)
            rollup.input_tokens += max(input_tokens, 0)
            rollup.output_tokens += max(output_tokens, 0)
            if model_label:
                rollup.model_counts[model_label] = rollup.model_counts.get(model_label, 0) + 1
            if normalized_entry_point:
                rollup.entry_point_counts[normalized_entry_point] = (
                    rollup.entry_point_counts.get(normalized_entry_point, 0) + 1
                )

            self._prune_locked(reference_day=timestamp.date())

        self._persist()

    def record_daily_usage(
        self,
        *,
        day: date | datetime,
        employee_id: str = "",
        email: str = "",
        employee_name: str = "",
        title: str = "",
        team_id: str = "",
        team_name: str = "",
        business_unit_id: str = "",
        business_unit_name: str = "",
        organization_id: str = "",
        organization_name: str = "",
        requests: int,
        spend_usd: float,
        governed_requests: int = 0,
        intervention_requests: int = 0,
        input_tokens: int = 0,
        output_tokens: int = 0,
        model_counts: dict[str, int] | None = None,
        entry_point_counts: dict[str, int] | None = None,
        eligible_for_ai: bool = True,
    ) -> None:
        normalized_employee_id = _normalize_employee_id(employee_id, email=email)
        if not normalized_employee_id:
            msg = "employee_id or email is required"
            raise ValueError(msg)
        if requests < 0:
            raise ValueError("requests must be >= 0")

        resolved_day = day.date() if isinstance(day, datetime) else day
        day_key = resolved_day.isoformat()

        with self._lock:
            profile = self._employees.get(normalized_employee_id)
            if profile is None:
                profile = EmployeeDirectoryRecord(employee_id=normalized_employee_id)
                self._employees[normalized_employee_id] = profile
            self._merge_employee_record(
                profile,
                name=employee_name,
                email=email,
                title=title,
                team_id=team_id,
                team_name=team_name,
                business_unit_id=business_unit_id,
                business_unit_name=business_unit_name,
                organization_id=organization_id,
                organization_name=organization_name,
                eligible_for_ai=eligible_for_ai,
            )

            employee_days = self._daily_usage.setdefault(normalized_employee_id, {})
            rollup = employee_days.get(day_key)
            if rollup is None:
                rollup = DailyUsageRollup(day=day_key)
                employee_days[day_key] = rollup
            rollup.requests += requests
            rollup.spend_usd += max(spend_usd, 0.0)
            rollup.governed_requests += max(governed_requests, 0)
            rollup.intervention_requests += max(intervention_requests, 0)
            rollup.input_tokens += max(input_tokens, 0)
            rollup.output_tokens += max(output_tokens, 0)
            for label, count in (model_counts or {}).items():
                if count > 0:
                    rollup.model_counts[label] = rollup.model_counts.get(label, 0) + count
            for label, count in (entry_point_counts or {}).items():
                if count > 0:
                    rollup.entry_point_counts[label] = (
                        rollup.entry_point_counts.get(label, 0) + count
                    )

            self._prune_locked(reference_day=resolved_day)

        self._persist()

    def hierarchy(self) -> AdoptionHierarchy:
        with self._lock:
            employees = list(self._employees.values())

        organization_id, organization_name = self._resolve_default_organization(employees)
        business_units = self._business_units_for_organization(employees, organization_id)
        organization = AdoptionHierarchyOrganization(
            organization_id=organization_id,
            organization_name=organization_name,
            eligible_employees=sum(1 for employee in employees if employee.eligible_for_ai),
            business_units=business_units,
        )
        return AdoptionHierarchy(
            organization=organization,
            default_scope_type="organization",
            default_scope_id=organization.organization_id,
        )

    def dashboard(
        self,
        *,
        scope_type: ScopeType = "organization",
        scope_id: str | None = None,
        window_days: int = 30,
    ) -> AdoptionDashboard:
        if window_days <= 0:
            msg = "window_days must be > 0"
            raise ValueError(msg)

        with self._lock:
            employees = list(self._employees.values())
            usage = {
                employee_id: dict(days)
                for employee_id, days in self._daily_usage.items()
            }

        resolved_scope_id, scope_label, parent_scope_label = self._resolve_scope(
            employees,
            scope_type=scope_type,
            scope_id=scope_id,
        )
        in_scope = [
            employee
            for employee in employees
            if _employee_matches_scope(employee, scope_type, resolved_scope_id)
        ]
        aggregates = self._aggregate_employees(in_scope, usage, window_days=window_days)
        summary = self._build_summary(in_scope, aggregates, window_days=window_days)
        child_scopes = self._build_child_scope_breakdowns(
            employees,
            usage,
            scope_type=scope_type,
            scope_id=resolved_scope_id,
            window_days=window_days,
        )
        top_employees = self._build_top_employees(aggregates)
        model_mix = self._build_mix_records(aggregates, field_name="model_counts")
        entry_point_mix = self._build_mix_records(aggregates, field_name="entry_point_counts")
        trend = self._build_trend(in_scope, usage)
        executive_lenses = self._build_executive_lenses(
            scope_label=scope_label,
            window_days=window_days,
            summary=summary,
            child_scopes=child_scopes,
            model_mix=model_mix,
        )

        return AdoptionDashboard(
            generated_at=self._clock_now(),
            scope_type=scope_type,
            scope_id=resolved_scope_id,
            scope_label=scope_label,
            parent_scope_label=parent_scope_label,
            window_days=window_days,
            summary=summary,
            child_scopes=child_scopes,
            top_employees=top_employees,
            model_mix=model_mix,
            entry_point_mix=entry_point_mix,
            trend=trend,
            executive_lenses=executive_lenses,
        )

    def _merge_employee_record(
        self,
        record: EmployeeDirectoryRecord,
        *,
        name: str,
        email: str,
        title: str,
        team_id: str,
        team_name: str,
        business_unit_id: str,
        business_unit_name: str,
        organization_id: str,
        organization_name: str,
        eligible_for_ai: bool,
        last_identity_login_at: datetime | None = None,
    ) -> None:
        normalized_team_name = team_name.strip() or team_id.strip()
        normalized_team_id = _normalize_scope_id(team_id, normalized_team_name, prefix="team")
        normalized_business_unit_name = business_unit_name.strip()
        normalized_business_unit_id = _normalize_scope_id(
            business_unit_id,
            normalized_business_unit_name,
            prefix="bu",
        )
        normalized_organization_name = organization_name.strip() or "NovaTech Industries"
        normalized_organization_id = _normalize_scope_id(
            organization_id,
            normalized_organization_name,
            prefix="org",
        )

        if name.strip():
            record.name = name.strip()
        if email.strip():
            record.email = email.strip().lower()
        if title.strip():
            record.title = title.strip()
        if normalized_team_id:
            record.team_id = normalized_team_id
        if normalized_team_name:
            record.team_name = normalized_team_name
        if normalized_business_unit_id:
            record.business_unit_id = normalized_business_unit_id
        if normalized_business_unit_name:
            record.business_unit_name = normalized_business_unit_name
        if normalized_organization_id:
            record.organization_id = normalized_organization_id
        if normalized_organization_name:
            record.organization_name = normalized_organization_name
        record.eligible_for_ai = bool(eligible_for_ai)
        if last_identity_login_at is not None:
            record.last_identity_login_at = last_identity_login_at.astimezone(UTC)
        record.updated_at = self._clock_now()

    def _prune_locked(self, *, reference_day: date) -> None:
        cutoff = (reference_day - timedelta(days=self._retention_days)).isoformat()
        for employee_id in list(self._daily_usage.keys()):
            kept = {
                day_key: rollup
                for day_key, rollup in self._daily_usage[employee_id].items()
                if day_key >= cutoff
            }
            if kept:
                self._daily_usage[employee_id] = kept
            else:
                self._daily_usage.pop(employee_id, None)

    def _aggregate_employees(
        self,
        employees: list[EmployeeDirectoryRecord],
        usage: dict[str, dict[str, DailyUsageRollup]],
        *,
        window_days: int,
    ) -> list[_EmployeeWindowAggregate]:
        today = self._today()
        current_start = today - timedelta(days=window_days - 1)
        prior_start = current_start - timedelta(days=window_days)
        prior_end = current_start - timedelta(days=1)
        recent_7d_start = today - timedelta(days=6)

        aggregates: list[_EmployeeWindowAggregate] = []
        for employee in employees:
            aggregate = _EmployeeWindowAggregate(employee=employee)
            for day_key, rollup in usage.get(employee.employee_id, {}).items():
                rollup_day = date.fromisoformat(day_key)
                if rollup_day < prior_start:
                    continue
                if current_start <= rollup_day <= today:
                    aggregate.requests_current += rollup.requests
                    aggregate.spend_current += rollup.spend_usd
                    aggregate.governed_current += rollup.governed_requests
                    aggregate.intervention_current += rollup.intervention_requests
                    aggregate.model_counts.update(rollup.model_counts)
                    aggregate.entry_point_counts.update(rollup.entry_point_counts)
                    if rollup_day >= recent_7d_start:
                        aggregate.requests_last_7d += rollup.requests
                    aggregate.last_active_at = _max_dt(
                        aggregate.last_active_at,
                        datetime.combine(rollup_day, datetime.min.time(), tzinfo=UTC),
                    )
                elif prior_start <= rollup_day <= prior_end:
                    aggregate.requests_previous += rollup.requests
            aggregates.append(aggregate)
        return aggregates

    def _build_summary(
        self,
        employees: list[EmployeeDirectoryRecord],
        aggregates: list[_EmployeeWindowAggregate],
        *,
        window_days: int,
    ) -> AdoptionSummary:
        del window_days
        eligible = sum(1 for employee in employees if employee.eligible_for_ai)
        active_30d = sum(aggregate.requests_current > 0 for aggregate in aggregates)
        active_7d = sum(aggregate.requests_last_7d > 0 for aggregate in aggregates)
        repeat_users = sum(
            aggregate.requests_current >= self._repeat_user_request_threshold
            for aggregate in aggregates
        )
        power_users = sum(
            aggregate.requests_current >= self._power_user_request_threshold
            for aggregate in aggregates
        )
        requests_current = sum(aggregate.requests_current for aggregate in aggregates)
        spend_current = sum(aggregate.spend_current for aggregate in aggregates)
        governed_current = sum(aggregate.governed_current for aggregate in aggregates)
        intervention_current = sum(aggregate.intervention_current for aggregate in aggregates)
        prior_active = sum(aggregate.requests_previous > 0 for aggregate in aggregates)

        return AdoptionSummary(
            eligible_employees=eligible,
            active_employees_7d=active_7d,
            active_employees_30d=active_30d,
            adoption_penetration_pct=_pct(active_30d, eligible),
            repeat_user_rate_pct=_pct(repeat_users, active_30d),
            power_user_rate_pct=_pct(power_users, active_30d),
            governed_usage_pct=_pct(governed_current, requests_current),
            intervention_rate_pct=_pct(intervention_current, requests_current),
            requests_30d=requests_current,
            spend_30d_usd=round(spend_current, 2),
            spend_per_active_employee_usd=(
                round(spend_current / active_30d, 2) if active_30d else 0.0
            ),
            requests_per_active_employee=(
                round(requests_current / active_30d, 1) if active_30d else 0.0
            ),
            growth_vs_prior_pct=(
                _pct(active_30d - prior_active, prior_active)
                if prior_active
                else (100.0 if active_30d > 0 else 0.0)
            ),
        )

    def _build_child_scope_breakdowns(
        self,
        employees: list[EmployeeDirectoryRecord],
        usage: dict[str, dict[str, DailyUsageRollup]],
        *,
        scope_type: ScopeType,
        scope_id: str,
        window_days: int,
    ) -> list[AdoptionScopeBreakdown]:
        child_scopes: list[tuple[ScopeType, str, str]] = []
        if scope_type == "organization":
            for business_unit in self._business_units_for_organization(employees, scope_id):
                child_scopes.append(
                    (
                        "business_unit",
                        business_unit.business_unit_id,
                        business_unit.business_unit_name,
                    )
                )
        elif scope_type == "business_unit":
            for team in self._teams_for_business_unit(employees, scope_id):
                child_scopes.append(("team", team.team_id, team.team_name))

        breakdowns: list[AdoptionScopeBreakdown] = []
        for child_scope_type, child_scope_id, label in child_scopes:
            in_scope = [
                employee
                for employee in employees
                if _employee_matches_scope(employee, child_scope_type, child_scope_id)
            ]
            aggregates = self._aggregate_employees(in_scope, usage, window_days=window_days)
            summary = self._build_summary(in_scope, aggregates, window_days=window_days)
            top_entry_point = self._build_mix_records(aggregates, field_name="entry_point_counts")
            breakdowns.append(
                AdoptionScopeBreakdown(
                    scope_type=child_scope_type,
                    scope_id=child_scope_id,
                    label=label,
                    eligible_employees=summary.eligible_employees,
                    active_employees_30d=summary.active_employees_30d,
                    adoption_penetration_pct=summary.adoption_penetration_pct,
                    growth_vs_prior_pct=summary.growth_vs_prior_pct,
                    requests_30d=summary.requests_30d,
                    spend_30d_usd=summary.spend_30d_usd,
                    governed_usage_pct=summary.governed_usage_pct,
                    top_entry_point=top_entry_point[0].label if top_entry_point else "n/a",
                )
            )
        return sorted(
            breakdowns,
            key=lambda item: (item.active_employees_30d, item.requests_30d, item.label),
            reverse=True,
        )

    def _build_top_employees(
        self,
        aggregates: list[_EmployeeWindowAggregate],
    ) -> list[AdoptionTopEmployee]:
        ranked = sorted(
            [aggregate for aggregate in aggregates if aggregate.requests_current > 0],
            key=lambda aggregate: (aggregate.requests_current, aggregate.spend_current),
            reverse=True,
        )[:10]
        employees: list[AdoptionTopEmployee] = []
        for aggregate in ranked:
            top_model = (
                aggregate.model_counts.most_common(1)[0][0]
                if aggregate.model_counts
                else "n/a"
            )
            top_entry_point = (
                aggregate.entry_point_counts.most_common(1)[0][0]
                if aggregate.entry_point_counts
                else "n/a"
            )
            employees.append(
                AdoptionTopEmployee(
                    employee_id=aggregate.employee.employee_id,
                    name=aggregate.employee.name or aggregate.employee.employee_id,
                    title=aggregate.employee.title or "Individual Contributor",
                    team_name=aggregate.employee.team_name or "Unassigned Team",
                    business_unit_name=(
                        aggregate.employee.business_unit_name or "Unassigned Business Unit"
                    ),
                    requests_30d=aggregate.requests_current,
                    spend_30d_usd=round(aggregate.spend_current, 2),
                    governed_usage_pct=_pct(
                        aggregate.governed_current,
                        aggregate.requests_current,
                    ),
                    last_active_at=aggregate.last_active_at,
                    adoption_stage=_adoption_stage(
                        aggregate.requests_current,
                        self._repeat_user_request_threshold,
                        self._power_user_request_threshold,
                    ),
                    top_model=top_model,
                    top_entry_point=top_entry_point,
                )
            )
        return employees

    def _build_mix_records(
        self,
        aggregates: list[_EmployeeWindowAggregate],
        *,
        field_name: Literal["model_counts", "entry_point_counts"],
    ) -> list[AdoptionMixRecord]:
        totals: Counter[str] = Counter()
        spend_by_label: defaultdict[str, float] = defaultdict(float)
        total_requests = sum(aggregate.requests_current for aggregate in aggregates)
        for aggregate in aggregates:
            counter = getattr(aggregate, field_name)
            totals.update(counter)
            if aggregate.requests_current <= 0:
                continue
            blended_cost = aggregate.spend_current / aggregate.requests_current
            for label, count in counter.items():
                spend_by_label[label] += blended_cost * count
        return [
            AdoptionMixRecord(
                label=label,
                requests=count,
                spend_usd=round(spend_by_label[label], 2),
                pct_of_requests=_pct(count, total_requests),
            )
            for label, count in totals.most_common(6)
        ]

    def _build_trend(
        self,
        employees: list[EmployeeDirectoryRecord],
        usage: dict[str, dict[str, DailyUsageRollup]],
    ) -> list[AdoptionTrendPoint]:
        del employees
        today = self._today()
        start = today.replace(day=1) - timedelta(days=150)
        monthly: dict[str, _MonthlyTrendBucket] = {}

        for _employee_id, days in usage.items():
            employee_seen_in_month: defaultdict[str, bool] = defaultdict(bool)
            for day_key, rollup in days.items():
                rollup_day = date.fromisoformat(day_key)
                if rollup_day < start:
                    continue
                month_key = rollup_day.strftime("%Y-%m")
                bucket = monthly.setdefault(
                    month_key,
                    _MonthlyTrendBucket(label=rollup_day.strftime("%b")),
                )
                if not employee_seen_in_month[month_key] and rollup.requests > 0:
                    bucket.active_employees += 1
                    employee_seen_in_month[month_key] = True
                bucket.requests += rollup.requests
                bucket.spend_usd += rollup.spend_usd
                bucket.governed_requests += rollup.governed_requests

        points: list[AdoptionTrendPoint] = []
        for month_key in sorted(monthly.keys())[-6:]:
            bucket = monthly[month_key]
            points.append(
                AdoptionTrendPoint(
                    label=bucket.label,
                    active_employees=bucket.active_employees,
                    requests=bucket.requests,
                    spend_usd=round(bucket.spend_usd, 2),
                    governed_usage_pct=_pct(
                        bucket.governed_requests,
                        bucket.requests,
                    ),
                )
            )
        return points

    def _build_executive_lenses(
        self,
        *,
        scope_label: str,
        window_days: int,
        summary: AdoptionSummary,
        child_scopes: list[AdoptionScopeBreakdown],
        model_mix: list[AdoptionMixRecord],
    ) -> list[AdoptionExecutiveLens]:
        most_active_scope = child_scopes[0].label if child_scopes else scope_label
        top_model = model_mix[0].label if model_mix else "n/a"
        return [
            AdoptionExecutiveLens(
                audience="CEO",
                headline=(
                    f"{scope_label} has {summary.active_employees_30d} active AI "
                    f"employees across the last {window_days} days."
                ),
                detail=(
                    f"Adoption penetration is {summary.adoption_penetration_pct:.1f}%. "
                    f"The most active operating area is {most_active_scope}."
                ),
                metric_label="Adoption penetration",
                metric_value=f"{summary.adoption_penetration_pct:.1f}%",
            ),
            AdoptionExecutiveLens(
                audience="CFO",
                headline=(
                    "Spend per active employee is "
                    f"${summary.spend_per_active_employee_usd:,.0f} with "
                    f"{summary.governed_usage_pct:.1f}% governed usage."
                ),
                detail=(
                    "This shows whether adoption is broad and controlled, or "
                    "concentrated in a small set of expensive users."
                ),
                metric_label=f"{window_days}d spend",
                metric_value=f"${summary.spend_30d_usd:,.0f}",
            ),
            AdoptionExecutiveLens(
                audience="COO",
                headline=(
                    f"Repeat usage is {summary.repeat_user_rate_pct:.1f}% of active "
                    "employees, indicating whether AI is embedded in recurring workflows."
                ),
                detail=(
                    "Intervention signals touched "
                    f"{summary.intervention_rate_pct:.1f}% of observed requests, "
                    "showing where operating friction or policy correction still exists."
                ),
                metric_label="Repeat usage rate",
                metric_value=f"{summary.repeat_user_rate_pct:.1f}%",
            ),
            AdoptionExecutiveLens(
                audience="CTO",
                headline=(
                    f"The leading model family is {top_model}, and power users account "
                    f"for {summary.power_user_rate_pct:.1f}% of active employees."
                ),
                detail=(
                    "This helps separate broad employee adoption from concentrated "
                    "experimentation on a narrow platform surface."
                ),
                metric_label="Growth vs prior period",
                metric_value=f"{summary.growth_vs_prior_pct:+.1f}%",
            ),
        ]

    def _business_units_for_organization(
        self,
        employees: list[EmployeeDirectoryRecord],
        organization_id: str,
    ) -> list[AdoptionHierarchyBusinessUnit]:
        business_units: dict[str, list[EmployeeDirectoryRecord]] = defaultdict(list)
        for employee in employees:
            if employee.organization_id == organization_id:
                business_units[employee.business_unit_id or "bu:unassigned"].append(employee)

        items: list[AdoptionHierarchyBusinessUnit] = []
        for business_unit_id, members in business_units.items():
            business_unit_name = next(
                (
                    employee.business_unit_name
                    for employee in members
                    if employee.business_unit_name
                ),
                "Unassigned Business Unit",
            )
            teams = self._teams_for_business_unit(members, business_unit_id)
            items.append(
                AdoptionHierarchyBusinessUnit(
                    business_unit_id=business_unit_id,
                    business_unit_name=business_unit_name,
                    eligible_employees=sum(member.eligible_for_ai for member in members),
                    teams=teams,
                )
            )
        return sorted(items, key=lambda item: item.eligible_employees, reverse=True)

    def _teams_for_business_unit(
        self,
        employees: list[EmployeeDirectoryRecord],
        business_unit_id: str,
    ) -> list[AdoptionHierarchyTeam]:
        teams: dict[str, list[EmployeeDirectoryRecord]] = defaultdict(list)
        for employee in employees:
            if employee.business_unit_id == business_unit_id:
                teams[employee.team_id or "team:unassigned"].append(employee)
        items = [
            AdoptionHierarchyTeam(
                team_id=team_id,
                team_name=next(
                    (member.team_name for member in members if member.team_name),
                    "Unassigned Team",
                ),
                eligible_employees=sum(member.eligible_for_ai for member in members),
            )
            for team_id, members in teams.items()
        ]
        return sorted(items, key=lambda item: item.eligible_employees, reverse=True)

    def _resolve_default_organization(
        self,
        employees: list[EmployeeDirectoryRecord],
    ) -> tuple[str, str]:
        for employee in employees:
            if employee.organization_id:
                return (
                    employee.organization_id,
                    employee.organization_name or employee.organization_id,
                )
        return "org:default", "Organization"

    def _resolve_scope(
        self,
        employees: list[EmployeeDirectoryRecord],
        *,
        scope_type: ScopeType,
        scope_id: str | None,
    ) -> tuple[str, str, str | None]:
        hierarchy = self.hierarchy()
        if scope_type == "organization":
            resolved_scope_id = scope_id or hierarchy.organization.organization_id
            return resolved_scope_id, hierarchy.organization.organization_name, None
        if scope_type == "business_unit":
            for business_unit in hierarchy.organization.business_units:
                if business_unit.business_unit_id == (scope_id or business_unit.business_unit_id):
                    return (
                        business_unit.business_unit_id,
                        business_unit.business_unit_name,
                        hierarchy.organization.organization_name,
                    )
            if hierarchy.organization.business_units:
                business_unit = hierarchy.organization.business_units[0]
                return (
                    business_unit.business_unit_id,
                    business_unit.business_unit_name,
                    hierarchy.organization.organization_name,
                )
            return "bu:unassigned", "Business Unit", hierarchy.organization.organization_name
        for employee in employees:
            if employee.team_id == scope_id and employee.team_id:
                return (
                    employee.team_id,
                    employee.team_name or employee.team_id,
                    employee.business_unit_name or None,
                )
        for business_unit in hierarchy.organization.business_units:
            if business_unit.teams:
                team = business_unit.teams[0]
                return team.team_id, team.team_name, business_unit.business_unit_name
        return "team:unassigned", "Team", None

    def _persist(self) -> None:
        if self._redis is None:
            return
        snapshot = {
            "employees": [
                self._serialize_employee(employee)
                for employee in self._employees.values()
            ],
            "daily_usage": {
                employee_id: [self._serialize_rollup(rollup) for rollup in days.values()]
                for employee_id, days in self._daily_usage.items()
            },
        }
        try:
            self._redis.set(self._snapshot_key(), json.dumps(snapshot, separators=(",", ":")))
        except RedisPackageError as exc:
            self._durable_errors += 1
            logger.warning("adoption.persist_failed", error=str(exc))

    def _load_from_redis(self) -> None:
        if self._redis is None:
            return
        try:
            raw = self._redis.get(self._snapshot_key())
        except RedisPackageError as exc:
            self._durable_errors += 1
            logger.warning("adoption.load_failed", error=str(exc))
            return
        if not raw:
            return
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError as exc:
            logger.warning("adoption.snapshot_invalid", error=str(exc))
            return
        for employee_payload in payload.get("employees", []):
            employee = self._deserialize_employee(employee_payload)
            self._employees[employee.employee_id] = employee
        for employee_id, rollups in payload.get("daily_usage", {}).items():
            day_map: dict[str, DailyUsageRollup] = {}
            for rollup_payload in rollups:
                rollup = self._deserialize_rollup(rollup_payload)
                day_map[rollup.day] = rollup
            if day_map:
                self._daily_usage[employee_id] = day_map

    def _serialize_employee(self, employee: EmployeeDirectoryRecord) -> dict[str, object]:
        payload = asdict(employee)
        if employee.last_identity_login_at is not None:
            payload["last_identity_login_at"] = employee.last_identity_login_at.isoformat()
        if employee.updated_at is not None:
            payload["updated_at"] = employee.updated_at.isoformat()
        return payload

    def _deserialize_employee(self, payload: dict[str, object]) -> EmployeeDirectoryRecord:
        return EmployeeDirectoryRecord(
            employee_id=str(payload.get("employee_id") or ""),
            name=str(payload.get("name") or ""),
            email=str(payload.get("email") or ""),
            title=str(payload.get("title") or ""),
            team_id=str(payload.get("team_id") or ""),
            team_name=str(payload.get("team_name") or ""),
            business_unit_id=str(payload.get("business_unit_id") or ""),
            business_unit_name=str(payload.get("business_unit_name") or ""),
            organization_id=str(payload.get("organization_id") or ""),
            organization_name=str(payload.get("organization_name") or ""),
            eligible_for_ai=bool(payload.get("eligible_for_ai", True)),
            last_identity_login_at=_parse_dt(payload.get("last_identity_login_at")),
            updated_at=_parse_dt(payload.get("updated_at")) or datetime.now(UTC),
        )

    def _serialize_rollup(self, rollup: DailyUsageRollup) -> dict[str, object]:
        return asdict(rollup)

    def _deserialize_rollup(self, payload: dict[str, object]) -> DailyUsageRollup:
        return DailyUsageRollup(
            day=str(payload.get("day") or ""),
            requests=_as_int(payload.get("requests")),
            spend_usd=_as_float(payload.get("spend_usd")),
            governed_requests=_as_int(payload.get("governed_requests")),
            intervention_requests=_as_int(payload.get("intervention_requests")),
            input_tokens=_as_int(payload.get("input_tokens")),
            output_tokens=_as_int(payload.get("output_tokens")),
            model_counts={
                str(key): _as_int(value)
                for key, value in cast(
                    "dict[str, object]",
                    payload.get("model_counts") or {},
                ).items()
            },
            entry_point_counts={
                str(key): _as_int(value)
                for key, value in cast(
                    "dict[str, object]",
                    payload.get("entry_point_counts") or {},
                ).items()
            },
        )

    def _snapshot_key(self) -> str:
        return f"{self._redis_prefix}:snapshot"


def _normalize_employee_id(employee_id: str, *, email: str = "") -> str:
    identifier = employee_id.strip().lower()
    if identifier:
        return identifier
    return email.strip().lower()


def _normalize_scope_id(explicit_id: str, label: str, *, prefix: str) -> str:
    if explicit_id.strip():
        return explicit_id.strip().lower()
    if label.strip():
        slug = "-".join(part for part in _slugify(label).split("-") if part)
        return f"{prefix}:{slug}" if slug else ""
    return ""


def _slugify(value: str) -> str:
    normalized = "".join(ch.lower() if ch.isalnum() else "-" for ch in value.strip())
    while "--" in normalized:
        normalized = normalized.replace("--", "-")
    return normalized.strip("-")


def _normalize_model_label(provider: str, model: str) -> str:
    model_name = model.strip()
    if not model_name:
        return ""
    provider_name = provider.strip()
    return f"{provider_name} / {model_name}" if provider_name else model_name


def _normalize_entry_point(entry_point: str) -> str:
    normalized = entry_point.strip()
    return normalized or "api"


def _pct(numerator: int | float, denominator: int | float) -> float:
    if denominator <= 0:
        return 0.0
    return round((float(numerator) / float(denominator)) * 100.0, 1)


def _adoption_stage(requests: int, repeat_threshold: int, power_threshold: int) -> str:
    if requests >= power_threshold:
        return "Power user"
    if requests >= repeat_threshold:
        return "Embedded"
    if requests > 0:
        return "Exploring"
    return "Inactive"


def _employee_matches_scope(
    employee: EmployeeDirectoryRecord,
    scope_type: ScopeType,
    scope_id: str,
) -> bool:
    if scope_type == "organization":
        return employee.organization_id == scope_id
    if scope_type == "business_unit":
        return employee.business_unit_id == scope_id
    return employee.team_id == scope_id


def _parse_dt(value: object) -> datetime | None:
    if not value:
        return None
    if isinstance(value, datetime):
        return value.astimezone(UTC)
    try:
        return datetime.fromisoformat(str(value)).astimezone(UTC)
    except ValueError:
        return None


def _as_int(value: object) -> int:
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    if isinstance(value, str):
        try:
            return int(float(value))
        except ValueError:
            return 0
    return 0


def _as_float(value: object) -> float:
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return float(value)
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return 0.0
    return 0.0


def _max_dt(left: datetime | None, right: datetime | None) -> datetime | None:
    if left is None:
        return right
    if right is None:
        return left
    return left if left >= right else right
