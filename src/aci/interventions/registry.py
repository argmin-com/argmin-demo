"""Intervention lifecycle registry for recommendation state management."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from datetime import UTC, datetime
from threading import Lock
from typing import Literal, Protocol, cast

import structlog

from aci.optional_deps import RedisPackageError, load_sync_redis

logger = structlog.get_logger()
RedisMembers = set[str] | set[bytes]
SEEDED_INTERVENTION_UPDATED_AT = datetime(2026, 2, 28, 17, 0, tzinfo=UTC)


class SupportsRedisInterventions(Protocol):
    def get(self, key: str) -> str | bytes | None: ...
    def set(self, key: str, value: str) -> bool | None: ...
    def delete(self, *keys: str) -> int: ...
    def sadd(self, key: str, *values: str) -> int: ...
    def smembers(self, key: str) -> RedisMembers: ...
    def ping(self) -> bool: ...
    def close(self) -> None: ...


InterventionStatus = Literal[
    "recommended",
    "review",
    "approved",
    "implemented",
    "dismissed",
]


@dataclass(slots=True, frozen=True)
class InterventionTransition:
    """Immutable audit entry for one intervention lifecycle mutation."""

    from_status: InterventionStatus
    to_status: InterventionStatus
    actor: str
    note: str
    changed_at: datetime = field(default_factory=lambda: datetime.now(UTC))


@dataclass(slots=True)
class InterventionRecord:
    """Single optimization recommendation with lifecycle metadata."""

    intervention_id: str
    title: str
    intervention_type: str
    team: str
    detail: str
    savings_usd_month: float
    confidence_pct: float
    risk: str
    equivalence_mode: str
    equivalence_status: str
    category: str
    threshold_condition: str
    rule_condition: str
    status: InterventionStatus = "recommended"
    updated_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    updated_by: str = "system"
    update_note: str = ""
    history: list[InterventionTransition] = field(default_factory=list)


@dataclass(slots=True)
class InterventionSummary:
    """Aggregated intervention metrics used for dashboards."""

    total_count: int
    recommended_count: int
    review_count: int
    approved_count: int
    implemented_count: int
    dismissed_count: int
    total_potential_usd: float
    captured_savings_usd: float
    open_potential_usd: float


class InterventionRegistry:
    """In-memory registry with bounded, explicit transition semantics."""

    _ALLOWED_STATUS: tuple[InterventionStatus, ...] = (
        "recommended",
        "review",
        "approved",
        "implemented",
        "dismissed",
    )
    _ALLOWED_TRANSITIONS: dict[InterventionStatus, tuple[InterventionStatus, ...]] = {
        "recommended": ("review", "approved", "dismissed"),
        "review": ("recommended", "approved", "dismissed"),
        "approved": ("review", "implemented", "dismissed"),
        "implemented": ("dismissed",),
        "dismissed": ("review",),
    }

    def __init__(
        self,
        interventions: list[InterventionRecord] | None = None,
        *,
        redis_url: str | None = None,
        redis_prefix: str = "aci:interventions",
        redis_client: SupportsRedisInterventions | None = None,
    ) -> None:
        self._lock = Lock()
        self._records: dict[str, InterventionRecord] = {}
        self._redis = (
            redis_client
            if redis_client is not None
            else (
                cast(
                    "SupportsRedisInterventions",
                    load_sync_redis("Redis interventions backend").from_url(
                        redis_url,
                        decode_responses=True,
                    ),
                )
                if redis_url
                else None
            )
        )
        self._redis_prefix = redis_prefix
        if self._redis is not None:
            self._load_from_redis()
        if interventions:
            for record in interventions:
                self._add_or_replace(record, persist=self._redis is None or not self._records)

    @classmethod
    def with_seed_data(
        cls,
        *,
        redis_url: str | None = None,
        redis_prefix: str = "aci:interventions",
        redis_client: SupportsRedisInterventions | None = None,
    ) -> InterventionRegistry:
        """Bootstrap deterministic records for local runtime and demos."""
        registry = cls(redis_url=redis_url, redis_prefix=redis_prefix, redis_client=redis_client)
        if registry.list_records():
            return registry
        registry.reset_to_seed_data()
        return registry

    def reset_to_seed_data(self) -> None:
        """Restore the deterministic local/demo intervention baseline."""
        self.clear()
        for record in self._seed_records():
            self._add_or_replace(record, persist=True)

    @staticmethod
    def _seed_records() -> list[InterventionRecord]:
        return [
            InterventionRecord(
                intervention_id="INT-401",
                title="Route fallback traffic from gpt-4o to gpt-4o-mini",
                intervention_type="Model Routing",
                team="Product",
                detail=(
                    "2.1M fallback requests analyzed. "
                    "97.3% quality parity in Mode 2a shadow evaluation."
                ),
                savings_usd_month=31_200.0,
                confidence_pct=94.0,
                risk="low",
                equivalence_mode="Empirical (Mode 2a)",
                equivalence_status="verified",
                category="Model over-provisioning",
                threshold_condition="2.1M monthly fallback requests and 72% cost differential",
                rule_condition="Cost differential > 50% and equivalence confidence >= 0.93",
                status="recommended",
                updated_at=SEEDED_INTERVENTION_UPDATED_AT,
            ),
            InterventionRecord(
                intervention_id="INT-402",
                title="Apply input-token guardrail to analytics-batch",
                intervention_type="Token Governance",
                team="ML Engineering",
                detail=(
                    "95th percentile prompt size is 4.2K. "
                    "Capping at 3.5K removes outlier spend."
                ),
                savings_usd_month=14_800.0,
                confidence_pct=89.0,
                risk="medium",
                equivalence_mode="Policy floor",
                equivalence_status="conditional",
                category="Prompt inefficiency",
                threshold_condition="p95 input tokens exceed floor by >20%",
                rule_condition="Recommend compaction when p95 > 4K",
                status="review",
                updated_at=SEEDED_INTERVENTION_UPDATED_AT,
            ),
            InterventionRecord(
                intervention_id="INT-403",
                title="Enable semantic cache for deterministic support prompts",
                intervention_type="Semantic Cache",
                team="Customer Engineering",
                detail="Cache hit rate stabilized at 38% with no measurable quality drop.",
                savings_usd_month=10_200.0,
                confidence_pct=92.0,
                risk="low",
                equivalence_mode="Empirical (Mode 2a)",
                equivalence_status="verified",
                category="Duplicate requests",
                threshold_condition="Semantic duplicate ratio > 30%",
                rule_condition="Enable cache when duplicate ratio >= 0.30",
                status="implemented",
                updated_at=SEEDED_INTERVENTION_UPDATED_AT,
            ),
            InterventionRecord(
                intervention_id="INT-404",
                title="Restrict staging model allowlist to low-cost equivalents",
                intervention_type="Policy Enforcement",
                team="Platform Engineering",
                detail="Staging traffic uses production-tier models without quality benefit.",
                savings_usd_month=22_800.0,
                confidence_pct=87.0,
                risk="medium",
                equivalence_mode="Policy (Mode 1)",
                equivalence_status="policy",
                category="Staging and dev sprawl",
                threshold_condition=">25% staging requests use frontier-tier models",
                rule_condition="Apply staging allowlist when non-prod frontier usage > 20%",
                status="recommended",
                updated_at=SEEDED_INTERVENTION_UPDATED_AT,
            ),
        ]

    def list_records(self, status: str | None = None) -> list[InterventionRecord]:
        """Return records sorted by monthly savings descending."""
        with self._lock:
            records = list(self._records.values())

        if status is not None:
            self._validate_status(status)
            records = [record for record in records if record.status == status]

        return sorted(records, key=lambda record: record.savings_usd_month, reverse=True)

    def summary(self) -> InterventionSummary:
        """Return aggregate lifecycle counts and dollar impact metrics."""
        records = self.list_records()

        recommended_count = sum(record.status == "recommended" for record in records)
        review_count = sum(record.status == "review" for record in records)
        approved_count = sum(record.status == "approved" for record in records)
        implemented_count = sum(record.status == "implemented" for record in records)
        dismissed_count = sum(record.status == "dismissed" for record in records)

        total_potential_usd = sum(record.savings_usd_month for record in records)
        captured_savings_usd = sum(
            record.savings_usd_month
            for record in records
            if record.status in {"approved", "implemented"}
        )
        open_potential_usd = sum(
            record.savings_usd_month
            for record in records
            if record.status in {"recommended", "review"}
        )

        return InterventionSummary(
            total_count=len(records),
            recommended_count=recommended_count,
            review_count=review_count,
            approved_count=approved_count,
            implemented_count=implemented_count,
            dismissed_count=dismissed_count,
            total_potential_usd=total_potential_usd,
            captured_savings_usd=captured_savings_usd,
            open_potential_usd=open_potential_usd,
        )

    def transition(
        self,
        intervention_id: str,
        next_status: InterventionStatus,
        *,
        actor: str = "api",
        note: str = "",
    ) -> InterventionRecord:
        """Transition recommendation to a new lifecycle state."""
        self._validate_status(next_status)

        with self._lock:
            record = self._records.get(intervention_id)
            if record is None:
                raise KeyError(f"Unknown intervention_id: {intervention_id}")

            actor_name = actor.strip() or "api"
            note_text = note.strip()
            if next_status != record.status:
                allowed = self._ALLOWED_TRANSITIONS.get(record.status, ())
                if next_status not in allowed:
                    raise ValueError(
                        f"Invalid transition from {record.status!r} to {next_status!r}"
                    )
            if next_status in {"dismissed", "implemented"} and not note_text:
                raise ValueError(f"note is required when transitioning to '{next_status}'")

            previous_status = record.status
            record.status = next_status
            record.updated_at = datetime.now(UTC)
            record.updated_by = actor_name
            record.update_note = note_text
            record.history.append(
                InterventionTransition(
                    from_status=previous_status,
                    to_status=next_status,
                    actor=actor_name,
                    note=note_text,
                    changed_at=record.updated_at,
                )
            )
            self._persist_record(record)
            logger.info(
                "intervention.transition",
                intervention_id=intervention_id,
                from_status=previous_status,
                to_status=next_status,
                actor=actor_name,
            )

            return record

    def get_history(self, intervention_id: str) -> list[InterventionTransition]:
        record = self.get(intervention_id)
        if record is None:
            raise KeyError(f"Unknown intervention_id: {intervention_id}")
        return list(record.history)

    def get(self, intervention_id: str) -> InterventionRecord | None:
        if self._redis is not None:
            record = self._load_record(intervention_id)
            if record is not None:
                with self._lock:
                    self._records[intervention_id] = record
                return record
        with self._lock:
            return self._records.get(intervention_id)

    def _validate_status(self, status: str) -> None:
        if status not in self._ALLOWED_STATUS:
            allowed = ", ".join(self._ALLOWED_STATUS)
            raise ValueError(f"Invalid intervention status '{status}'. Allowed: {allowed}")

    def clear(self) -> None:
        with self._lock:
            self._records.clear()
        if self._redis is not None:
            self._clear_redis()

    def durable_backend_healthy(self) -> bool:
        if self._redis is None:
            return True
        try:
            return bool(self._redis.ping())
        except RedisPackageError as exc:
            logger.warning("interventions.redis_unavailable", error=str(exc))
            return False

    def close(self) -> None:
        if self._redis is not None:
            self._redis.close()

    def _ids_key(self) -> str:
        return f"{self._redis_prefix}:ids"

    def _record_key(self, intervention_id: str) -> str:
        return f"{self._redis_prefix}:record:{intervention_id}"

    def _add_or_replace(self, record: InterventionRecord, *, persist: bool) -> None:
        with self._lock:
            self._records[record.intervention_id] = record
        if persist:
            self._persist_record(record)

    def _persist_record(self, record: InterventionRecord) -> None:
        if self._redis is None:
            return
        payload = _record_to_payload(record)
        try:
            self._redis.set(
                self._record_key(record.intervention_id),
                json.dumps(payload, sort_keys=True),
            )
            self._redis.sadd(self._ids_key(), record.intervention_id)
        except RedisPackageError as exc:
            logger.warning("interventions.redis_persist_failed", error=str(exc))

    def _load_record(self, intervention_id: str) -> InterventionRecord | None:
        assert self._redis is not None
        try:
            raw = self._redis.get(self._record_key(intervention_id))
        except RedisPackageError as exc:
            logger.warning("interventions.redis_load_failed", error=str(exc))
            return None
        if raw is None:
            return None
        return _payload_to_record(json.loads(_decode(raw)))

    def _load_all_records(self) -> list[InterventionRecord]:
        assert self._redis is not None
        try:
            ids = sorted(_decode(item) for item in self._redis.smembers(self._ids_key()))
        except RedisPackageError as exc:
            logger.warning("interventions.redis_load_failed", error=str(exc))
            return list(self._records.values())

        records: list[InterventionRecord] = []
        for intervention_id in ids:
            record = self._load_record(intervention_id)
            if record is not None:
                records.append(record)
        return records

    def _load_from_redis(self) -> None:
        with self._lock:
            self._records = {
                record.intervention_id: record for record in self._load_all_records()
            }

    def _clear_redis(self) -> None:
        assert self._redis is not None
        try:
            ids = sorted(_decode(item) for item in self._redis.smembers(self._ids_key()))
            keys = [self._record_key(intervention_id) for intervention_id in ids]
            if keys:
                self._redis.delete(*keys)
            self._redis.delete(self._ids_key())
        except RedisPackageError as exc:
            logger.warning("interventions.redis_clear_failed", error=str(exc))


def _record_to_payload(record: InterventionRecord) -> dict[str, object]:
    payload = asdict(record)
    payload["updated_at"] = record.updated_at.isoformat()
    payload["history"] = [
        {
            "from_status": item.from_status,
            "to_status": item.to_status,
            "actor": item.actor,
            "note": item.note,
            "changed_at": item.changed_at.isoformat(),
        }
        for item in record.history
    ]
    return payload


def _payload_to_record(payload: dict[str, object]) -> InterventionRecord:
    history_payload = payload.get("history", [])
    history: list[InterventionTransition] = []
    if isinstance(history_payload, list):
        for item in history_payload:
            if not isinstance(item, dict):
                continue
            history.append(
                InterventionTransition(
                    from_status=cast(
                        "InterventionStatus",
                        str(item.get("from_status", "recommended")),
                    ),
                    to_status=cast(
                        "InterventionStatus",
                        str(item.get("to_status", "recommended")),
                    ),
                    actor=str(item.get("actor", "system")),
                    note=str(item.get("note", "")),
                    changed_at=datetime.fromisoformat(
                        str(item.get("changed_at")),
                    ).astimezone(UTC),
                )
            )

    return InterventionRecord(
        intervention_id=str(payload.get("intervention_id", "")),
        title=str(payload.get("title", "")),
        intervention_type=str(payload.get("intervention_type", "")),
        team=str(payload.get("team", "")),
        detail=str(payload.get("detail", "")),
        savings_usd_month=_payload_float(payload.get("savings_usd_month", 0.0)),
        confidence_pct=_payload_float(payload.get("confidence_pct", 0.0)),
        risk=str(payload.get("risk", "")),
        equivalence_mode=str(payload.get("equivalence_mode", "")),
        equivalence_status=str(payload.get("equivalence_status", "")),
        category=str(payload.get("category", "")),
        threshold_condition=str(payload.get("threshold_condition", "")),
        rule_condition=str(payload.get("rule_condition", "")),
        status=cast("InterventionStatus", str(payload.get("status", "recommended"))),
        updated_at=datetime.fromisoformat(str(payload.get("updated_at"))).astimezone(UTC),
        updated_by=str(payload.get("updated_by", "system")),
        update_note=str(payload.get("update_note", "")),
        history=history,
    )


def _decode(value: str | bytes) -> str:
    if isinstance(value, bytes):
        return value.decode("utf-8")
    return value


def _payload_float(value: object) -> float:
    return float(str(value))
