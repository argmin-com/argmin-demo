"""Bifurcated synthetic vs reconciled cost tracking and drift reporting."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from threading import Lock
from typing import Protocol, cast

import structlog
from redis import Redis as SyncRedis
from redis.exceptions import RedisError

logger = structlog.get_logger()
RedisMembers = set[str] | set[bytes]


class SupportsRedisLedger(Protocol):
    def get(self, key: str) -> str | bytes | None: ...
    def set(self, key: str, value: str) -> bool | None: ...
    def delete(self, *keys: str) -> int: ...
    def sadd(self, key: str, *values: str) -> int: ...
    def smembers(self, key: str) -> RedisMembers: ...
    def ping(self) -> bool: ...
    def close(self) -> None: ...


@dataclass
class CostRecord:
    """Synthetic and reconciled cost record for a single request."""

    request_id: str
    service_name: str
    provider: str
    model: str
    synthetic_cost_usd: float
    synthetic_recorded_at: datetime
    reconciled_cost_usd: float | None = None
    reconciled_recorded_at: datetime | None = None
    reconciliation_source: str = ""

    @property
    def is_reconciled(self) -> bool:
        return self.reconciled_cost_usd is not None

    @property
    def drift_usd(self) -> float | None:
        if self.reconciled_cost_usd is None:
            return None
        return self.reconciled_cost_usd - self.synthetic_cost_usd

    @property
    def drift_pct(self) -> float | None:
        drift = self.drift_usd
        if drift is None:
            return None
        if self.synthetic_cost_usd == 0:
            return 0.0 if drift == 0 else 100.0
        return (drift / self.synthetic_cost_usd) * 100.0


@dataclass(frozen=True)
class CostDriftSummary:
    """Aggregated drift metrics for provider/service grouping."""

    group: str
    total_records: int
    reconciled_records: int
    unresolved_records: int
    synthetic_cost_usd: float
    reconciled_cost_usd: float
    absolute_drift_usd: float
    drift_pct: float


class ReconciliationLedger:
    """Thread-safe in-memory ledger for synthetic and reconciled request costs."""

    def __init__(
        self,
        *,
        redis_url: str | None = None,
        redis_prefix: str = "aci:reconciliation",
        redis_client: SupportsRedisLedger | None = None,
    ) -> None:
        self._records: dict[str, CostRecord] = {}
        self._lock = Lock()
        self._redis = (
            redis_client
            if redis_client is not None
            else (
                cast_supports_redis(
                    SyncRedis.from_url(redis_url, decode_responses=True),
                )
                if redis_url
                else None
            )
        )
        self._redis_prefix = redis_prefix
        if self._redis is not None:
            self._load_from_redis()

    def upsert_synthetic(
        self,
        *,
        request_id: str,
        service_name: str,
        provider: str,
        model: str,
        synthetic_cost_usd: float,
        recorded_at: datetime | None = None,
    ) -> CostRecord:
        """Insert or update synthetic cost estimate for a request."""
        timestamp = _aware(recorded_at) if recorded_at else datetime.now(UTC)
        normalized_provider = provider.strip().lower()
        with self._lock:
            current = self._records.get(request_id)
            if current is None:
                record = CostRecord(
                    request_id=request_id,
                    service_name=service_name.strip(),
                    provider=normalized_provider,
                    model=model.strip(),
                    synthetic_cost_usd=synthetic_cost_usd,
                    synthetic_recorded_at=timestamp,
                )
                self._records[request_id] = record
                self._persist_record(record)
                logger.info(
                    "reconciliation.synthetic_upserted",
                    request_id=request_id,
                    provider=normalized_provider,
                    service_name=service_name.strip(),
                )
                return record

            current.service_name = service_name.strip()
            current.provider = normalized_provider
            current.model = model.strip()
            current.synthetic_cost_usd = synthetic_cost_usd
            current.synthetic_recorded_at = timestamp
            self._persist_record(current)
            logger.info(
                "reconciliation.synthetic_upserted",
                request_id=request_id,
                provider=normalized_provider,
                service_name=service_name.strip(),
            )
            return current

    def reconcile(
        self,
        *,
        request_id: str,
        reconciled_cost_usd: float,
        source: str = "billing_api",
        recorded_at: datetime | None = None,
    ) -> CostRecord:
        """Attach billing-truth reconciled cost to an existing request record."""
        timestamp = _aware(recorded_at) if recorded_at else datetime.now(UTC)
        with self._lock:
            record = self._records.get(request_id)
            if record is None:
                msg = f"request_id={request_id!r} not found in synthetic ledger"
                raise ValueError(msg)
            record.reconciled_cost_usd = reconciled_cost_usd
            record.reconciled_recorded_at = timestamp
            record.reconciliation_source = source.strip()
            self._persist_record(record)
            logger.info(
                "reconciliation.record_reconciled",
                request_id=request_id,
                source=record.reconciliation_source,
                drift_usd=record.drift_usd,
            )
            return record

    def get(self, request_id: str) -> CostRecord | None:
        """Return one record if present."""
        if self._redis is not None:
            record = self._load_record(request_id)
            if record is not None:
                with self._lock:
                    self._records[request_id] = record
                return record
        with self._lock:
            record = self._records.get(request_id)
        return record

    def list_records(self) -> list[CostRecord]:
        """Return all records in insertion order."""
        if self._redis is not None:
            loaded = self._load_all_records()
            with self._lock:
                self._records = {record.request_id: record for record in loaded}
            return sorted(loaded, key=lambda record: record.synthetic_recorded_at)
        with self._lock:
            return sorted(self._records.values(), key=lambda record: record.synthetic_recorded_at)

    def clear(self) -> None:
        """Clear all records (used by deterministic tests/demo resets)."""
        with self._lock:
            self._records.clear()
        if self._redis is not None:
            self._clear_redis()

    def summarize_drift(self, group_by: str = "provider") -> list[CostDriftSummary]:
        """Return aggregated drift metrics grouped by provider or service."""
        if group_by not in {"provider", "service"}:
            msg = "group_by must be one of {'provider', 'service'}"
            raise ValueError(msg)

        with self._lock:
            records = list(self._records.values())

        buckets: dict[str, list[CostRecord]] = {}
        for record in records:
            key = record.provider if group_by == "provider" else record.service_name
            buckets.setdefault(key, []).append(record)

        summaries: list[CostDriftSummary] = []
        for key, items in buckets.items():
            total = len(items)
            reconciled = [item for item in items if item.is_reconciled]
            unresolved = total - len(reconciled)
            synth_total = sum(item.synthetic_cost_usd for item in items)
            reconciled_total = sum(item.reconciled_cost_usd or 0.0 for item in reconciled)
            absolute_drift = abs(reconciled_total - synth_total)
            drift_pct = 0.0
            if synth_total > 0:
                drift_pct = ((reconciled_total - synth_total) / synth_total) * 100.0

            summaries.append(
                CostDriftSummary(
                    group=key,
                    total_records=total,
                    reconciled_records=len(reconciled),
                    unresolved_records=unresolved,
                    synthetic_cost_usd=synth_total,
                    reconciled_cost_usd=reconciled_total,
                    absolute_drift_usd=absolute_drift,
                    drift_pct=drift_pct,
                )
            )

        summaries.sort(key=lambda summary: summary.absolute_drift_usd, reverse=True)
        return summaries

    def durable_backend_healthy(self) -> bool:
        if self._redis is None:
            return True
        try:
            return bool(self._redis.ping())
        except RedisError as exc:
            logger.warning("reconciliation.redis_unavailable", error=str(exc))
            return False

    def close(self) -> None:
        if self._redis is not None:
            self._redis.close()

    def _records_index_key(self) -> str:
        return f"{self._redis_prefix}:ids"

    def _record_key(self, request_id: str) -> str:
        return f"{self._redis_prefix}:record:{request_id}"

    def _persist_record(self, record: CostRecord) -> None:
        if self._redis is None:
            return
        payload = _record_to_payload(record)
        try:
            self._redis.set(
                self._record_key(record.request_id),
                json.dumps(payload, sort_keys=True),
            )
            self._redis.sadd(self._records_index_key(), record.request_id)
        except RedisError as exc:
            logger.warning("reconciliation.redis_persist_failed", error=str(exc))

    def _load_record(self, request_id: str) -> CostRecord | None:
        assert self._redis is not None
        try:
            raw = self._redis.get(self._record_key(request_id))
        except RedisError as exc:
            logger.warning("reconciliation.redis_load_failed", error=str(exc))
            return None
        if raw is None:
            return None
        return _payload_to_record(json.loads(_decode(raw)))

    def _load_all_records(self) -> list[CostRecord]:
        assert self._redis is not None
        try:
            ids = sorted(_decode(item) for item in self._redis.smembers(self._records_index_key()))
        except RedisError as exc:
            logger.warning("reconciliation.redis_load_failed", error=str(exc))
            return list(self._records.values())

        records: list[CostRecord] = []
        for request_id in ids:
            record = self._load_record(request_id)
            if record is not None:
                records.append(record)
        return records

    def _load_from_redis(self) -> None:
        with self._lock:
            self._records = {record.request_id: record for record in self._load_all_records()}

    def _clear_redis(self) -> None:
        assert self._redis is not None
        try:
            ids = sorted(_decode(item) for item in self._redis.smembers(self._records_index_key()))
            keys = [self._record_key(request_id) for request_id in ids]
            if keys:
                self._redis.delete(*keys)
            self._redis.delete(self._records_index_key())
        except RedisError as exc:
            logger.warning("reconciliation.redis_clear_failed", error=str(exc))


def _aware(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)


def _record_to_payload(record: CostRecord) -> dict[str, object]:
    payload = asdict(record)
    payload["synthetic_recorded_at"] = record.synthetic_recorded_at.isoformat()
    payload["reconciled_recorded_at"] = (
        record.reconciled_recorded_at.isoformat() if record.reconciled_recorded_at else None
    )
    return payload


def _payload_to_record(payload: dict[str, object]) -> CostRecord:
    reconciled_raw = payload.get("reconciled_recorded_at")
    return CostRecord(
        request_id=str(payload.get("request_id", "")),
        service_name=str(payload.get("service_name", "")),
        provider=str(payload.get("provider", "")),
        model=str(payload.get("model", "")),
        synthetic_cost_usd=_payload_float(payload.get("synthetic_cost_usd", 0.0)),
        synthetic_recorded_at=_aware(
            datetime.fromisoformat(str(payload["synthetic_recorded_at"])),
        ),
        reconciled_cost_usd=(
            _payload_float(payload["reconciled_cost_usd"])
            if payload.get("reconciled_cost_usd") is not None
            else None
        ),
        reconciled_recorded_at=(
            _aware(datetime.fromisoformat(str(reconciled_raw))) if reconciled_raw else None
        ),
        reconciliation_source=str(payload.get("reconciliation_source", "")),
    )


def _decode(value: str | bytes) -> str:
    if isinstance(value, bytes):
        return value.decode("utf-8")
    return value


def _payload_float(value: object) -> float:
    return float(str(value))


def cast_supports_redis(client: SyncRedis) -> SupportsRedisLedger:
    return cast("SupportsRedisLedger", client)
