from __future__ import annotations

import json
from typing import TYPE_CHECKING

from aci.interceptor.circuit_breaker import (
    CircuitBreaker,
    CircuitBreakerState,
    CircuitState,
    RedisCircuitStateStore,
)

if TYPE_CHECKING:
    from _pytest.monkeypatch import MonkeyPatch


def test_opens_after_threshold_failures() -> None:
    cb = CircuitBreaker(failure_threshold=2, reset_timeout_s=1.0, half_open_max_probes=2)

    cb.record_failure()
    assert cb.state == CircuitState.CLOSED.value

    cb.record_failure()
    assert cb.state == CircuitState.OPEN.value
    assert cb.is_open is True


def test_half_open_limits_probe_requests(monkeypatch: MonkeyPatch) -> None:
    current_time = 100.0
    monkeypatch.setattr("aci.interceptor.circuit_breaker.time.time", lambda: current_time)
    cb = CircuitBreaker(failure_threshold=1, reset_timeout_s=0.01, half_open_max_probes=2)

    cb.record_failure()
    assert cb.state == CircuitState.OPEN.value

    current_time += 0.02

    # Two probes allowed.
    assert cb.is_open is False
    assert cb.is_open is False

    # Further requests are blocked until probes succeed or fail.
    assert cb.is_open is True


def test_successful_half_open_probes_close_circuit(monkeypatch: MonkeyPatch) -> None:
    current_time = 100.0
    monkeypatch.setattr("aci.interceptor.circuit_breaker.time.time", lambda: current_time)
    cb = CircuitBreaker(failure_threshold=1, reset_timeout_s=0.01, half_open_max_probes=2)

    cb.record_failure()
    current_time += 0.02

    assert cb.is_open is False
    cb.record_success()
    assert cb.state == CircuitState.HALF_OPEN.value

    assert cb.is_open is False
    cb.record_success()
    assert cb.state == CircuitState.CLOSED.value
    assert cb.is_open is False


def test_failed_half_open_probe_reopens_circuit(monkeypatch: MonkeyPatch) -> None:
    current_time = 100.0
    monkeypatch.setattr("aci.interceptor.circuit_breaker.time.time", lambda: current_time)
    cb = CircuitBreaker(failure_threshold=1, reset_timeout_s=0.01, half_open_max_probes=2)

    cb.record_failure()
    current_time += 0.02

    assert cb.is_open is False
    cb.record_failure()

    assert cb.state == CircuitState.OPEN.value
    assert cb.is_open is True


class _FakePipeline:
    def __init__(self, redis_client: _FakeRedis) -> None:
        self.redis_client = redis_client
        self.pending_key: str | None = None
        self.pending_value: str | None = None

    def __enter__(self) -> _FakePipeline:
        return self

    def __exit__(self, exc_type: object, exc: object, tb: object) -> None:
        self.reset()

    def watch(self, _key: str) -> None:
        return None

    def get(self, key: str) -> str | None:
        return self.redis_client.get(key)

    def multi(self) -> None:
        return None

    def set(self, key: str, value: str) -> None:
        self.pending_key = key
        self.pending_value = value

    def execute(self) -> None:
        if self.pending_key is not None and self.pending_value is not None:
            self.redis_client.data[self.pending_key] = self.pending_value

    def reset(self) -> None:
        self.pending_key = None
        self.pending_value = None


class _FakeRedis:
    def __init__(self) -> None:
        self.data: dict[str, str] = {}

    def get(self, key: str) -> str | None:
        return self.data.get(key)

    def set(
        self,
        key: str,
        value: str,
        *,
        nx: bool = False,
        px: int | None = None,
    ) -> bool:
        del px
        if nx and key in self.data:
            return False
        self.data[key] = value
        return True

    def pipeline(self) -> _FakePipeline:
        return _FakePipeline(self)

    def eval(self, script: str, numkeys: int, key: str, token: str) -> int:
        del script, numkeys
        if self.data.get(key) == token:
            self.data.pop(key, None)
            return 1
        return 0


def test_redis_state_store_serializes_mutations_with_lock() -> None:
    store = RedisCircuitStateStore("redis://example", "aci:test:circuit")
    fake_redis = _FakeRedis()
    store._redis = fake_redis  # type: ignore[assignment]

    def mutate_to_open(current: CircuitBreakerState) -> None:
        current.state = CircuitState.OPEN.value
        current.failure_count = 3

    state = store.mutate(mutate_to_open)

    assert state.state == CircuitState.OPEN.value
    assert state.failure_count == 3
    persisted = CircuitBreakerState(**json.loads(fake_redis.data["aci:test:circuit"]))
    assert persisted.state == CircuitState.OPEN.value
    assert "aci:test:circuit:lock" not in fake_redis.data
