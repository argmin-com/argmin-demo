"""Optional dependency loaders for non-demo backends and heavy recalibration."""

from __future__ import annotations

from typing import Any

__all__ = [
    "Neo4jPackageError",
    "Neo4jServiceUnavailablePackageError",
    "OptionalDependencyError",
    "RedisPackageError",
    "RedisWatchPackageError",
    "load_aiokafka",
    "load_aiokafka_offset_metadata",
    "load_async_redis",
    "load_calibration_math",
    "load_httpx",
    "load_neo4j_graph_database",
    "load_sync_redis",
]


class OptionalDependencyError(RuntimeError):
    """Raised when a selected backend needs a package absent from the local demo lock."""


try:
    from redis.exceptions import RedisError as RedisPackageError
    from redis.exceptions import WatchError as RedisWatchPackageError
except ImportError:  # pragma: no cover - exercised by minimal local-demo installs.
    class RedisPackageError(Exception):  # type: ignore[no-redef]
        """Fallback used when the optional Redis package is not installed."""

    class RedisWatchPackageError(RedisPackageError):  # type: ignore[no-redef]
        """Fallback used when the optional Redis package is not installed."""


try:
    from neo4j.exceptions import Neo4jError as Neo4jPackageError
    from neo4j.exceptions import ServiceUnavailable as Neo4jServiceUnavailablePackageError
except ImportError:  # pragma: no cover - exercised by minimal local-demo installs.
    class Neo4jPackageError(Exception):  # type: ignore[no-redef]
        """Fallback used when the optional Neo4j package is not installed."""

    class Neo4jServiceUnavailablePackageError(Neo4jPackageError):  # type: ignore[no-redef]
        """Fallback used when the optional Neo4j package is not installed."""


def load_sync_redis(feature: str) -> Any:  # noqa: ANN401
    try:
        from redis import Redis as SyncRedis
    except ImportError as exc:
        raise _missing(feature, "redis") from exc
    return SyncRedis


def load_async_redis(feature: str) -> Any:  # noqa: ANN401
    try:
        from redis.asyncio import Redis as AsyncRedis
    except ImportError as exc:
        raise _missing(feature, "redis") from exc
    return AsyncRedis


def load_httpx(feature: str) -> Any:  # noqa: ANN401
    try:
        import httpx
    except ImportError as exc:
        raise _missing(feature, "httpx") from exc
    return httpx


def load_neo4j_graph_database(feature: str) -> Any:  # noqa: ANN401
    try:
        from neo4j import GraphDatabase
    except ImportError as exc:
        raise _missing(feature, "neo4j") from exc
    return GraphDatabase


def load_aiokafka(feature: str) -> tuple[Any, Any]:  # noqa: ANN401
    try:
        from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
    except ImportError as exc:
        raise _missing(feature, "aiokafka") from exc
    return AIOKafkaConsumer, AIOKafkaProducer


def load_aiokafka_offset_metadata(feature: str) -> Any:  # noqa: ANN401
    try:
        from aiokafka.structs import OffsetAndMetadata
    except ImportError as exc:
        raise _missing(feature, "aiokafka") from exc
    return OffsetAndMetadata


def load_calibration_math() -> tuple[Any, Any, Any]:  # noqa: ANN401
    try:
        import numpy as np_module
        from scipy.stats import ks_2samp
        from sklearn.isotonic import IsotonicRegression
    except ImportError as exc:
        raise _missing("confidence recalibration", "numpy, scipy, and scikit-learn") from exc
    return np_module, ks_2samp, IsotonicRegression


def _missing(feature: str, package: str) -> OptionalDependencyError:
    return OptionalDependencyError(
        f"{feature} requires optional package(s): {package}. "
        "Install requirements.lock or requirements-dev.lock before using this path."
    )
