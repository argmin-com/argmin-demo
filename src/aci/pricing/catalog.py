"""Versioned model-pricing catalog and deterministic cost estimation."""

from __future__ import annotations

import hashlib
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


class SupportsRedisPricing(Protocol):
    def get(self, key: str) -> str | bytes | None: ...
    def set(self, key: str, value: str) -> bool | None: ...
    def delete(self, *keys: str) -> int: ...
    def sadd(self, key: str, *values: str) -> int: ...
    def smembers(self, key: str) -> RedisMembers: ...
    def ping(self) -> bool: ...
    def close(self) -> None: ...


@dataclass(frozen=True)
class PricingRule:
    """Provider/model pricing rule effective from a timestamp."""

    provider: str
    model: str
    effective_from: datetime
    input_usd_per_1k_tokens: float
    output_usd_per_1k_tokens: float
    cached_input_usd_per_1k_tokens: float | None = None
    request_base_usd: float = 0.0
    source: str = "manual"
    provenance_ref: str = ""
    updated_by: str = "system"


@dataclass(frozen=True)
class PricingUsage:
    """Normalized token usage payload for a pricing estimate."""

    provider: str
    model: str
    input_tokens: int = 0
    output_tokens: int = 0
    cache_read_input_tokens: int = 0
    request_count: int = 1
    effective_at: datetime | None = None


@dataclass(frozen=True)
class CostEstimate:
    """Detailed cost estimate with token-level decomposition."""

    provider: str
    model: str
    rule_effective_from: datetime
    request_count: int
    input_cost_usd: float
    output_cost_usd: float
    cached_input_cost_usd: float
    request_base_cost_usd: float
    total_cost_usd: float


class PricingCatalog:
    """In-memory versioned pricing table with deterministic rule selection."""

    def __init__(
        self,
        *,
        redis_url: str | None = None,
        redis_prefix: str = "aci:pricing",
        redis_client: SupportsRedisPricing | None = None,
    ) -> None:
        self._rules: list[PricingRule] = []
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
            self._load_rules_from_redis()

    def register_rule(self, rule: PricingRule) -> None:
        """Register a pricing rule and keep the catalog sorted by effective time."""
        normalized = PricingRule(
            provider=rule.provider.strip().lower(),
            model=rule.model.strip(),
            effective_from=_aware(rule.effective_from),
            input_usd_per_1k_tokens=rule.input_usd_per_1k_tokens,
            output_usd_per_1k_tokens=rule.output_usd_per_1k_tokens,
            cached_input_usd_per_1k_tokens=rule.cached_input_usd_per_1k_tokens,
            request_base_usd=rule.request_base_usd,
            source=rule.source.strip().lower() or "manual",
            provenance_ref=rule.provenance_ref.strip(),
            updated_by=rule.updated_by.strip() or "system",
        )
        with self._lock:
            self._rules.append(normalized)
            self._rules.sort(
                key=lambda item: (
                    item.provider,
                    item.model,
                    item.effective_from,
                )
            )
            self._dedupe_rules()
            self._persist_rules()
        logger.info(
            "pricing.rule_registered",
            provider=normalized.provider,
            model=normalized.model,
            effective_from=normalized.effective_from.isoformat(),
            source=normalized.source,
        )

    def list_rules(
        self,
        provider: str | None = None,
        model: str | None = None,
    ) -> list[PricingRule]:
        """List pricing rules, optionally filtered by provider/model."""
        provider_filter = provider.strip().lower() if provider else None
        model_filter = model.strip() if model else None
        with self._lock:
            filtered = [
                rule
                for rule in self._rules
                if (provider_filter is None or rule.provider == provider_filter)
                and (model_filter is None or rule.model == model_filter)
            ]
        return list(filtered)

    def estimate(self, usage: PricingUsage) -> CostEstimate:
        """Estimate request cost from usage and provider/model versioned pricing."""
        if usage.request_count <= 0:
            msg = "request_count must be > 0"
            raise ValueError(msg)

        provider = usage.provider.strip().lower()
        model = usage.model.strip()
        effective_at = _aware(usage.effective_at) if usage.effective_at else datetime.now(UTC)
        rule = self._resolve_rule(provider, model, effective_at)

        if usage.input_tokens < 0 or usage.output_tokens < 0 or usage.cache_read_input_tokens < 0:
            msg = "token counts must be non-negative"
            raise ValueError(msg)

        cache_read = min(usage.cache_read_input_tokens, usage.input_tokens)
        billable_input = max(usage.input_tokens - cache_read, 0)
        cache_rate = (
            rule.cached_input_usd_per_1k_tokens
            if rule.cached_input_usd_per_1k_tokens is not None
            else rule.input_usd_per_1k_tokens
        )

        request_multiplier = float(usage.request_count)
        input_cost = (billable_input / 1000.0) * rule.input_usd_per_1k_tokens * request_multiplier
        cached_input_cost = (cache_read / 1000.0) * cache_rate * request_multiplier
        output_cost = (
            (usage.output_tokens / 1000.0) * rule.output_usd_per_1k_tokens * request_multiplier
        )
        base_cost = rule.request_base_usd * request_multiplier
        total_cost = input_cost + cached_input_cost + output_cost + base_cost

        estimate = CostEstimate(
            provider=provider,
            model=model,
            rule_effective_from=rule.effective_from,
            request_count=usage.request_count,
            input_cost_usd=input_cost,
            output_cost_usd=output_cost,
            cached_input_cost_usd=cached_input_cost,
            request_base_cost_usd=base_cost,
            total_cost_usd=total_cost,
        )
        logger.info(
            "pricing.estimate_computed",
            provider=provider,
            model=model,
            request_count=usage.request_count,
            total_cost_usd=estimate.total_cost_usd,
            snapshot_id=self.snapshot_id,
        )
        return estimate

    def _resolve_rule(self, provider: str, model: str, effective_at: datetime) -> PricingRule:
        with self._lock:
            candidates = [
                rule
                for rule in self._rules
                if rule.provider == provider
                and rule.model == model
                and rule.effective_from <= effective_at
            ]
        if not candidates:
            msg = f"no pricing rule available for provider={provider!r} model={model!r}"
            raise ValueError(msg)
        return max(candidates, key=lambda rule: rule.effective_from)

    @property
    def snapshot_id(self) -> str:
        """
        Deterministic pricing snapshot identifier for audit/headers (FR-110/ES 9.2).
        """
        with self._lock:
            rows = [
                {
                    "provider": rule.provider,
                    "model": rule.model,
                    "effective_from": rule.effective_from.isoformat(),
                    "input": rule.input_usd_per_1k_tokens,
                    "output": rule.output_usd_per_1k_tokens,
                    "cached_input": rule.cached_input_usd_per_1k_tokens,
                    "request_base": rule.request_base_usd,
                    "source": rule.source,
                    "provenance_ref": rule.provenance_ref,
                    "updated_by": rule.updated_by,
                }
                for rule in self._rules
            ]

        payload = json.dumps(rows, sort_keys=True, separators=(",", ":")).encode("utf-8")
        digest = hashlib.sha256(payload).hexdigest()[:12]
        return f"pricing-{digest}"

    @classmethod
    def with_default_rules(
        cls,
        *,
        redis_url: str | None = None,
        redis_prefix: str = "aci:pricing",
        redis_client: SupportsRedisPricing | None = None,
    ) -> PricingCatalog:
        """Factory with sensible defaults for demo and local validation."""
        catalog = cls(
            redis_url=redis_url,
            redis_prefix=redis_prefix,
            redis_client=redis_client,
        )
        if catalog.list_rules():
            return catalog
        anchor = datetime(2026, 1, 1, tzinfo=UTC)
        catalog.register_rule(
            PricingRule(
                provider="openai",
                model="gpt-4o",
                effective_from=anchor,
                input_usd_per_1k_tokens=0.0050,
                output_usd_per_1k_tokens=0.0150,
                source="seeded-defaults",
                provenance_ref="provider-benchmark-2026-01",
            )
        )
        catalog.register_rule(
            PricingRule(
                provider="openai",
                model="gpt-4o-mini",
                effective_from=anchor,
                input_usd_per_1k_tokens=0.00015,
                output_usd_per_1k_tokens=0.00060,
                source="seeded-defaults",
                provenance_ref="provider-benchmark-2026-01",
            )
        )
        catalog.register_rule(
            PricingRule(
                provider="google",
                model="gemini-2.0-flash",
                effective_from=anchor,
                input_usd_per_1k_tokens=0.0030,
                output_usd_per_1k_tokens=0.0150,
                cached_input_usd_per_1k_tokens=0.00030,
                source="seeded-defaults",
                provenance_ref="provider-benchmark-2026-01",
            )
        )
        catalog.register_rule(
            PricingRule(
                provider="google",
                model="gemini-1.5-flash",
                effective_from=anchor,
                input_usd_per_1k_tokens=0.00025,
                output_usd_per_1k_tokens=0.00125,
                cached_input_usd_per_1k_tokens=0.00003,
                source="seeded-defaults",
                provenance_ref="provider-benchmark-2026-01",
            )
        )
        catalog.register_rule(
            PricingRule(
                provider="aws-bedrock",
                model="amazon.nova-pro-v1:0",
                effective_from=anchor,
                input_usd_per_1k_tokens=0.0030,
                output_usd_per_1k_tokens=0.0150,
                source="seeded-defaults",
                provenance_ref="provider-benchmark-2026-01",
            )
        )
        return catalog

    def durable_backend_healthy(self) -> bool:
        if self._redis is None:
            return True
        try:
            return bool(self._redis.ping())
        except RedisError as exc:
            logger.warning("pricing.redis_unavailable", error=str(exc))
            return False

    def close(self) -> None:
        if self._redis is not None:
            self._redis.close()

    def _dedupe_rules(self) -> None:
        unique: dict[tuple[str, str, datetime], PricingRule] = {}
        for rule in self._rules:
            unique[(rule.provider, rule.model, rule.effective_from)] = rule
        self._rules = sorted(
            unique.values(),
            key=lambda item: (item.provider, item.model, item.effective_from),
        )

    def _rules_index_key(self) -> str:
        return f"{self._redis_prefix}:ids"

    def _rule_key(self, rule: PricingRule) -> str:
        ts = rule.effective_from.isoformat()
        return f"{self._redis_prefix}:rule:{rule.provider}:{rule.model}:{ts}"

    def _persist_rules(self) -> None:
        if self._redis is None:
            return
        try:
            current_keys = set()
            for rule in self._rules:
                key = self._rule_key(rule)
                current_keys.add(key)
                self._redis.set(key, json.dumps(_rule_to_payload(rule), sort_keys=True))
            existing_keys = {
                _decode(value) for value in self._redis.smembers(self._rules_index_key())
            }
            stale = [key for key in existing_keys if key and key not in current_keys]
            if stale:
                self._redis.delete(*stale)
            self._redis.delete(self._rules_index_key())
            if current_keys:
                self._redis.sadd(self._rules_index_key(), *sorted(current_keys))
        except RedisError as exc:
            logger.warning("pricing.redis_persist_failed", error=str(exc))

    def _load_rules_from_redis(self) -> None:
        assert self._redis is not None
        try:
            keys = sorted(_decode(value) for value in self._redis.smembers(self._rules_index_key()))
        except RedisError as exc:
            logger.warning("pricing.redis_load_failed", error=str(exc))
            return

        loaded: list[PricingRule] = []
        for key in keys:
            if not key:
                continue
            try:
                raw = self._redis.get(key)
            except RedisError as exc:
                logger.warning("pricing.redis_load_failed", error=str(exc))
                return
            if raw is None:
                continue
            loaded.append(_payload_to_rule(json.loads(_decode(raw))))

        with self._lock:
            self._rules = loaded
            self._dedupe_rules()


def _aware(value: datetime) -> datetime:
    """Normalize datetimes to timezone-aware UTC values."""
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)


def _rule_to_payload(rule: PricingRule) -> dict[str, object]:
    payload = asdict(rule)
    payload["effective_from"] = rule.effective_from.isoformat()
    return payload


def _payload_to_rule(payload: dict[str, object]) -> PricingRule:
    effective_from = payload.get("effective_from")
    return PricingRule(
        provider=str(payload.get("provider", "")),
        model=str(payload.get("model", "")),
        effective_from=_aware(datetime.fromisoformat(str(effective_from))),
        input_usd_per_1k_tokens=_payload_float(payload.get("input_usd_per_1k_tokens", 0.0)),
        output_usd_per_1k_tokens=_payload_float(payload.get("output_usd_per_1k_tokens", 0.0)),
        cached_input_usd_per_1k_tokens=(
            _payload_float(payload["cached_input_usd_per_1k_tokens"])
            if payload.get("cached_input_usd_per_1k_tokens") is not None
            else None
        ),
        request_base_usd=_payload_float(payload.get("request_base_usd", 0.0)),
        source=str(payload.get("source", "manual")),
        provenance_ref=str(payload.get("provenance_ref", "")),
        updated_by=str(payload.get("updated_by", "system")),
    )


def _decode(value: str | bytes) -> str:
    if isinstance(value, bytes):
        return value.decode("utf-8")
    return value


def _payload_float(value: object) -> float:
    return float(str(value))


def cast_supports_redis(client: SyncRedis) -> SupportsRedisPricing:
    return cast("SupportsRedisPricing", client)
