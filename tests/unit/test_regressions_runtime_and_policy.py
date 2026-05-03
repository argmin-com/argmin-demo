from __future__ import annotations

import asyncio
import json
from datetime import UTC, datetime
from typing import Any, cast

import pytest

from aci.api.app import AppState, SlidingWindowRateLimiter
from aci.confidence.calibration import CalibrationEngine
from aci.config import AuthConfig, InterceptorConfig, PlatformConfig
from aci.core.event_bus import InMemoryEventBus
from aci.core.processor import AttributionProcessor
from aci.graph.store import GraphStore, InMemoryGraphStore, Neo4jGraphStore, build_graph_store
from aci.hre.engine import HeuristicReconciliationEngine
from aci.index.materializer import AttributionIndexStore, IndexMaterializer
from aci.interceptor.gateway import FailOpenInterceptor
from aci.interceptor.shadow_warming import ShadowWarmer
from aci.models.attribution import (
    AttributionIndexEntry,
    AttributionPathNode,
    AttributionResult,
    ExplanationArtifact,
)
from aci.models.carbon import EnforcementAction, PolicyDefinition, PolicyType
from aci.models.graph import EdgeProvenance, EdgeType, GraphEdge, GraphNode, NodeType
from aci.policy.engine import PolicyEngine


def test_build_context_supports_namespaced_resource_node_ids() -> None:
    graph = GraphStore()
    event_bus = InMemoryEventBus()
    materializer = IndexMaterializer(AttributionIndexStore())
    policy_engine = PolicyEngine()
    processor = AttributionProcessor(
        event_bus=event_bus,
        graph_store=graph,
        hre=HeuristicReconciliationEngine(),
        calibration=CalibrationEngine(),
        materializer=materializer,
        policy_engine=policy_engine,
    )

    team = GraphNode(node_id="team:ml-core", node_type=NodeType.TEAM, label="ML Core")
    graph.upsert_node(team)
    graph.add_edge(
        GraphEdge(
            edge_type=EdgeType.ATTRIBUTED_TO,
            from_id="resource:arn:aws:sagemaker:us-east-1:123:endpoint/fraud-v2",
            to_id=team.node_id,
            confidence=1.0,
            weight=1.0,
            valid_from=datetime.now(UTC),
            provenance=EdgeProvenance(source="test", method="R1"),
        )
    )

    ctx = processor._build_context(
        workload_id="arn:aws:sagemaker:us-east-1:123:endpoint/fraud-v2",
        event_time=datetime.now(UTC),
        tenant_id="tenant-a",
    )
    assert (
        ctx.identity_mappings["arn:aws:sagemaker:us-east-1:123:endpoint/fraud-v2"] == "team:ml-core"
    )


def test_build_context_preserves_fractional_direct_targets() -> None:
    graph = GraphStore()
    event_bus = InMemoryEventBus()
    materializer = IndexMaterializer(AttributionIndexStore())
    policy_engine = PolicyEngine()
    processor = AttributionProcessor(
        event_bus=event_bus,
        graph_store=graph,
        hre=HeuristicReconciliationEngine(),
        calibration=CalibrationEngine(),
        materializer=materializer,
        policy_engine=policy_engine,
    )

    team_a = GraphNode(node_id="team:alpha", node_type=NodeType.TEAM, label="Alpha")
    team_b = GraphNode(node_id="team:beta", node_type=NodeType.TEAM, label="Beta")
    graph.upsert_node(team_a)
    graph.upsert_node(team_b)
    graph.add_edge(
        GraphEdge(
            edge_type=EdgeType.ATTRIBUTED_TO,
            from_id="resource:shared-endpoint",
            to_id=team_a.node_id,
            confidence=0.92,
            weight=0.7,
            valid_from=datetime.now(UTC),
            provenance=EdgeProvenance(source="test", method="R1"),
        )
    )
    graph.add_edge(
        GraphEdge(
            edge_type=EdgeType.ATTRIBUTED_TO,
            from_id="resource:shared-endpoint",
            to_id=team_b.node_id,
            confidence=0.91,
            weight=0.3,
            valid_from=datetime.now(UTC),
            provenance=EdgeProvenance(source="test", method="R1"),
        )
    )

    ctx = processor._build_context(
        workload_id="shared-endpoint",
        event_time=datetime.now(UTC),
        tenant_id="tenant-a",
    )

    assert "shared-endpoint" not in ctx.identity_mappings
    assert ctx.proportional_users == {
        "team:alpha": pytest.approx(0.7),
        "team:beta": pytest.approx(0.3),
    }


def test_build_context_feeds_probabilistic_hre_context_from_graph_properties() -> None:
    graph = GraphStore()
    event_bus = InMemoryEventBus()
    processor = AttributionProcessor(
        event_bus=event_bus,
        graph_store=graph,
        hre=HeuristicReconciliationEngine(),
        calibration=CalibrationEngine(),
        materializer=IndexMaterializer(AttributionIndexStore()),
        policy_engine=PolicyEngine(),
    )
    observed_at = datetime.now(UTC)
    graph.upsert_node(
        GraphNode(
            node_id="resource:ambiguous-service",
            node_type=NodeType.INFERENCE_ENDPOINT,
            label="ambiguous-service",
            properties={
                "historical_attributions": [
                    {"team_id": "team:platform", "confidence": 0.61},
                    {"team_id": "team:platform", "confidence": 0.64},
                    {"team_id": "team:data", "confidence": 0.41},
                ],
                "temporal_events": [
                    {
                        "event_time": observed_at.isoformat(),
                        "entity_id": "team:platform",
                        "source": "deployment-fixture",
                    }
                ],
                "deployment_owners": [
                    {"entity_id": "person:alice", "observed_at": observed_at.isoformat()}
                ],
                "code_owners": ["team:platform"],
                "recent_users": [
                    {"entity_id": "person:alice", "observed_at": observed_at.isoformat()}
                ],
            },
        )
    )

    ctx = processor._build_context(
        workload_id="ambiguous-service",
        event_time=observed_at,
        tenant_id="tenant-a",
    )

    assert ("team:platform", 0.61) in ctx.historical_attributions
    assert ctx.temporal_events == [(observed_at, "team:platform", "deployment-fixture")]
    assert ctx.deployment_owners == [("person:alice", observed_at)]
    assert ctx.code_owners == ["team:platform"]
    assert ctx.recent_users == [("person:alice", observed_at)]


def test_build_context_derives_deployment_owner_from_incoming_graph_edges() -> None:
    graph = GraphStore()
    event_bus = InMemoryEventBus()
    processor = AttributionProcessor(
        event_bus=event_bus,
        graph_store=graph,
        hre=HeuristicReconciliationEngine(),
        calibration=CalibrationEngine(),
        materializer=IndexMaterializer(AttributionIndexStore()),
        policy_engine=PolicyEngine(),
    )
    observed_at = datetime.now(UTC)
    graph.upsert_node(
        GraphNode(
            node_id="resource:runtime-service",
            node_type=NodeType.INFERENCE_ENDPOINT,
            label="runtime-service",
        )
    )
    graph.upsert_node(
        GraphNode(
            node_id="deploy:runtime-service-42",
            node_type=NodeType.DEPLOYMENT,
            label="runtime-service-42",
        )
    )
    graph.upsert_node(GraphNode(node_id="person:bob", node_type=NodeType.PERSON, label="Bob"))
    graph.add_edge(
        GraphEdge(
            edge_type=EdgeType.TRIGGERS,
            from_id="deploy:runtime-service-42",
            to_id="resource:runtime-service",
            confidence=0.95,
            weight=1.0,
            valid_from=observed_at,
            provenance=EdgeProvenance(source="github-actions", method="R2"),
        )
    )
    graph.add_edge(
        GraphEdge(
            edge_type=EdgeType.DEPLOYED_BY,
            from_id="person:bob",
            to_id="deploy:runtime-service-42",
            confidence=0.92,
            weight=1.0,
            valid_from=observed_at,
            provenance=EdgeProvenance(source="github-actions", method="R5"),
        )
    )

    ctx = processor._build_context(
        workload_id="runtime-service",
        event_time=observed_at,
        tenant_id="tenant-a",
    )

    assert ctx.deployment_owners == [("person:bob", observed_at)]
    assert ctx.recent_users == [("person:bob", observed_at)]
    assert (observed_at, "person:bob", "github-actions") in ctx.temporal_events


def test_policy_engine_applies_team_specific_over_global() -> None:
    engine = PolicyEngine()

    engine.register_policy(
        PolicyDefinition(
            policy_id="allowlist-global",
            policy_type=PolicyType.MODEL_ALLOWLIST,
            name="Global Allowlist",
            scope="global",
            enforcement=EnforcementAction.SOFT_STOP,
            parameters={"allowed_models": ["gpt-4o-mini"]},
        )
    )
    engine.register_policy(
        PolicyDefinition(
            policy_id="allowlist-team-a",
            policy_type=PolicyType.MODEL_ALLOWLIST,
            name="Team A Allowlist",
            scope="team-a",
            enforcement=EnforcementAction.SOFT_STOP,
            parameters={"allowed_models": ["gemini-1.5-flash"]},
        )
    )

    assert engine.get_model_allowlist("team-a") == ["gemini-1.5-flash"]
    assert engine.get_model_allowlist("team-b") == ["gpt-4o-mini"]


def test_policy_engine_token_budgets_are_team_scoped() -> None:
    engine = PolicyEngine()
    engine.register_policy(
        PolicyDefinition(
            policy_id="tokens-global",
            policy_type=PolicyType.TOKEN_BUDGET,
            name="Global Token Budget",
            scope="global",
            enforcement=EnforcementAction.SOFT_STOP,
            parameters={"max_output_tokens": 1000, "max_input_tokens": 2000},
        )
    )
    engine.register_policy(
        PolicyDefinition(
            policy_id="tokens-team-a",
            policy_type=PolicyType.TOKEN_BUDGET,
            name="Team A Token Budget",
            scope="team-a",
            enforcement=EnforcementAction.SOFT_STOP,
            parameters={"max_output_tokens": 250, "max_input_tokens": 500},
        )
    )

    assert engine.get_token_budgets("team-a") == {
        "token_budget_output": 250,
        "token_budget_input": 500,
    }
    assert engine.get_token_budgets("team-b") == {
        "token_budget_output": 1000,
        "token_budget_input": 2000,
    }


def test_policy_engine_cost_ceiling_is_team_scoped() -> None:
    engine = PolicyEngine()
    engine.register_policy(
        PolicyDefinition(
            policy_id="cost-global",
            policy_type=PolicyType.COST_CEILING,
            name="Global Cost Ceiling",
            scope="global",
            enforcement=EnforcementAction.SOFT_STOP,
            parameters={"max_request_cost_usd": 0.08},
        )
    )
    engine.register_policy(
        PolicyDefinition(
            policy_id="cost-team-a",
            policy_type=PolicyType.COST_CEILING,
            name="Team A Cost Ceiling",
            scope="team-a",
            enforcement=EnforcementAction.SOFT_STOP,
            parameters={"max_request_cost_usd": 0.02},
        )
    )

    assert engine.get_cost_ceiling("team-a") == 0.02
    assert engine.get_cost_ceiling("team-b") == 0.08


def test_platform_config_rejects_disabled_auth_in_production() -> None:
    with pytest.raises(ValueError, match="auth.enabled must be true"):
        PlatformConfig(
            environment="production",
            graph_backend="neo4j",
            neo4j_password="strong-secret",
            auth=AuthConfig(
                enabled=False,
                allow_dev_bypass=False,
                jwt_algorithm="HS256",
                jwt_hs256_secret="really-strong-secret",
            ),
        )


def test_platform_config_rejects_unsupported_jwt_algorithm() -> None:
    with pytest.raises(ValueError, match="auth.jwt_algorithm must be one of"):
        PlatformConfig(
            auth=AuthConfig(
                enabled=True,
                allow_dev_bypass=True,
                jwt_algorithm="none",
            ),
        )


def test_platform_config_normalizes_jwt_algorithm_case() -> None:
    config = PlatformConfig(
        environment="demo",
        auth=AuthConfig(
            enabled=True,
            allow_dev_bypass=True,
            jwt_algorithm="hs256",
            jwt_hs256_secret="demo-secret-32-characters-minimum",
        ),
    )

    assert config.auth.jwt_algorithm == "HS256"


def test_platform_config_requires_public_key_for_asymmetric_jwt_algorithms() -> None:
    with pytest.raises(
        ValueError,
        match="auth.jwt_public_key_pem is required for asymmetric JWT algorithms",
    ):
        PlatformConfig(
            environment="production",
            runtime_role="processor",
            graph_backend="neo4j",
            neo4j_password="strong-secret",
            auth=AuthConfig(
                enabled=True,
                allow_dev_bypass=False,
                jwt_algorithm="ES256",
                jwt_public_key_pem="",
            ),
        )


def test_platform_config_requires_rediss_for_production_durable_backends() -> None:
    with pytest.raises(ValueError, match="redis_url must use rediss://"):
        PlatformConfig(
            environment="production",
            runtime_role="processor",
            graph_backend="neo4j",
            neo4j_password="strong-secret",
            index_backend="redis",
            redis_url="redis://cache.internal:6379/0",
            auth=AuthConfig(
                enabled=True,
                allow_dev_bypass=False,
                jwt_algorithm="HS256",
                jwt_hs256_secret="really-strong-secret",
            ),
        )

    config = PlatformConfig(
        environment="production",
        runtime_role="processor",
        graph_backend="neo4j",
        neo4j_password="strong-secret",
        index_backend="redis",
        redis_url="rediss://cache.internal:6379/0",
        auth=AuthConfig(
            enabled=True,
            allow_dev_bypass=False,
            jwt_algorithm="HS256",
            jwt_hs256_secret="really-strong-secret",
        ),
    )
    assert config.redis_url.startswith("rediss://")


def test_platform_config_requires_secure_noise_in_production() -> None:
    with pytest.raises(ValueError, match="fbp.use_secure_noise must be true"):
        PlatformConfig(
            environment="production",
            runtime_role="processor",
            graph_backend="neo4j",
            neo4j_password="strong-secret",
            fbp={"use_secure_noise": False},
            auth=AuthConfig(
                enabled=True,
                allow_dev_bypass=False,
                jwt_algorithm="HS256",
                jwt_hs256_secret="really-strong-secret",
            ),
        )


def test_platform_config_requires_notification_allowlist_for_live_network() -> None:
    with pytest.raises(ValueError, match="notifications.webhook_allowlist must be configured"):
        PlatformConfig(
            environment="production",
            runtime_role="processor",
            graph_backend="neo4j",
            neo4j_password="strong-secret",
            notifications={"live_network": True},
            auth=AuthConfig(
                enabled=True,
                allow_dev_bypass=False,
                jwt_algorithm="HS256",
                jwt_hs256_secret="really-strong-secret",
            ),
        )


def test_platform_config_rejects_private_notification_targets_in_production() -> None:
    with pytest.raises(ValueError, match="allow_private_targets"):
        PlatformConfig(
            environment="production",
            runtime_role="processor",
            graph_backend="neo4j",
            neo4j_password="strong-secret",
            notifications={
                "live_network": True,
                "webhook_allowlist": "notify.example.com",
                "allow_private_targets": True,
            },
            auth=AuthConfig(
                enabled=True,
                allow_dev_bypass=False,
                jwt_algorithm="HS256",
                jwt_hs256_secret="really-strong-secret",
            ),
        )


def test_platform_config_validates_policy_timeout_budget() -> None:
    with pytest.raises(
        ValueError,
        match="policy_timeout_ms must be less than or equal to timeout_ms",
    ):
        PlatformConfig(
            interceptor={"timeout_ms": 20, "policy_timeout_ms": 25},
        )


@pytest.mark.asyncio
async def test_shadow_warmer_bounds_tracked_refresh_state() -> None:
    warmer = ShadowWarmer(
        InterceptorConfig(
            shadow_warm_probability=1.0,
            shadow_warm_max_tracked_workloads=2,
        )
    )

    async def _refresh(_: str) -> None:
        return None

    assert await warmer.trigger_refresh("svc-a", _refresh) is True
    assert await warmer.trigger_refresh("svc-b", _refresh) is True
    assert await warmer.trigger_refresh("svc-c", _refresh) is True

    assert set(warmer._state.last_refresh) == {"svc-b", "svc-c"}


@pytest.mark.asyncio
async def test_shadow_warmer_times_out_stuck_refreshes() -> None:
    warmer = ShadowWarmer(
        InterceptorConfig(
            shadow_warm_probability=1.0,
            shadow_warm_timeout_s=0.01,
        )
    )

    async def _refresh(_: str) -> None:
        await asyncio.sleep(0.1)

    assert await warmer.trigger_refresh("svc-timeout", _refresh) is False
    assert "svc-timeout" not in warmer._state.in_progress


def test_platform_config_model_dump_redacts_secret_values() -> None:
    config = PlatformConfig(
        environment="production",
        runtime_role="processor",
        graph_backend="neo4j",
        neo4j_password="strong-secret",
        auth=AuthConfig(
            enabled=True,
            allow_dev_bypass=False,
            jwt_algorithm="HS256",
            jwt_hs256_secret="really-strong-secret",
        ),
    )

    dumped = config.model_dump()

    assert "strong-secret" not in str(dumped)
    assert "really-strong-secret" not in str(dumped)


def test_platform_config_allows_demo_profile_with_memory_backends() -> None:
    config = PlatformConfig(
        environment="demo",
        graph_backend="memory",
        event_bus_backend="memory",
        index_backend="memory",
        auth=AuthConfig(
            enabled=True,
            allow_dev_bypass=True,
            jwt_algorithm="HS256",
            jwt_hs256_secret="demo-secret-32-characters-minimum",
        ),
    )

    assert config.environment == "demo"
    assert config.graph_backend == "memory"


def test_platform_config_rejects_non_local_backends_in_demo() -> None:
    with pytest.raises(ValueError, match="demo environment must use local memory backends"):
        PlatformConfig(
            environment="demo",
            graph_backend="neo4j",
            neo4j_password="argmin-local-neo4j-password",
            auth=AuthConfig(
                enabled=True,
                allow_dev_bypass=True,
                jwt_algorithm="HS256",
                jwt_hs256_secret="argmin-local-demo-secret",
            ),
        )


def test_platform_config_rejects_live_notifications_in_demo() -> None:
    with pytest.raises(ValueError, match="demo environment cannot enable live outbound"):
        PlatformConfig(
            environment="demo",
            notifications={"live_network": True},
            auth=AuthConfig(
                enabled=True,
                allow_dev_bypass=True,
                jwt_algorithm="HS256",
                jwt_hs256_secret="argmin-local-demo-secret",
            ),
        )


def test_platform_config_rejects_dummy_secrets_in_production() -> None:
    with pytest.raises(ValueError, match="auth.jwt_hs256_secret"):
        PlatformConfig(
            environment="production",
            runtime_role="processor",
            graph_backend="neo4j",
            neo4j_password="strong-secret",
            auth=AuthConfig(
                enabled=True,
                allow_dev_bypass=False,
                jwt_algorithm="HS256",
                jwt_hs256_secret="replace-with-strong-secret",
            ),
        )

    with pytest.raises(ValueError, match="neo4j_password"):
        PlatformConfig(
            environment="production",
            runtime_role="processor",
            graph_backend="neo4j",
            neo4j_password="argmin-local-neo4j-password",
            auth=AuthConfig(
                enabled=True,
                allow_dev_bypass=False,
                jwt_algorithm="HS256",
                jwt_hs256_secret="really-strong-secret",
            ),
        )


def test_graph_store_factory_selects_configured_backend() -> None:
    memory_config = PlatformConfig(environment="demo", graph_backend="memory")
    neo4j_config = PlatformConfig(
        environment="production",
        runtime_role="processor",
        graph_backend="neo4j",
        neo4j_password="strong-secret",
        auth=AuthConfig(
            enabled=True,
            allow_dev_bypass=False,
            jwt_algorithm="HS256",
            jwt_hs256_secret="really-strong-secret",
        ),
    )

    assert isinstance(build_graph_store(memory_config), InMemoryGraphStore)
    assert isinstance(build_graph_store(neo4j_config), Neo4jGraphStore)


def test_route_key_cardinality_limit_prevents_template_set_growth() -> None:
    app_state = AppState()
    app_state._route_cardinality_limit = 2

    assert app_state.resolve_route_key("/v1/a", "svc-gateway") == "/v1/a"
    assert app_state.resolve_route_key("/v1/b", "svc-gateway") == "/v1/b"
    assert len(app_state._route_templates) == 2

    # Once limit is reached, route keys fall back and template cardinality remains bounded.
    assert app_state.resolve_route_key("/v1/c", "svc-gateway") == "SERVICE:svc-gateway"
    assert len(app_state._route_templates) == 2

    # For callers without service identity, return the normalized route but still avoid growth.
    assert app_state.resolve_route_key("/v1/d", "") == "/v1/d"
    assert len(app_state._route_templates) == 2


def test_gateway_runtime_skips_processor_only_components(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("ACI_RUNTIME_ROLE", "gateway")
    monkeypatch.setenv("ACI_ENVIRONMENT", "development")
    monkeypatch.setenv("ACI_GRAPH_BACKEND", "memory")
    monkeypatch.setenv("ACI_EVENT_BUS_BACKEND", "kafka")
    monkeypatch.setenv("ACI_INDEX_BACKEND", "memory")
    monkeypatch.setenv("ACI_REDIS_URL", "redis://localhost:6379/0")
    monkeypatch.setenv("ACI_INTERCEPTOR_SHADOW_EVENTS_ENABLED", "true")

    app_state = AppState()

    assert app_state.accepts_ingestion is False
    assert app_state.accepts_interception is True
    assert app_state.graph is None
    assert app_state.hre is None
    assert app_state.calibration is None
    assert app_state.event_bus.stats["backend"] == "kafka"
    assert app_state.event_bus.stats["consume_messages"] is False
    assert isinstance(app_state.interceptor, FailOpenInterceptor)
    assert app_state.interceptor._event_bus is app_state.event_bus


@pytest.mark.asyncio
async def test_demo_environment_auto_seeds_runtime_state(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("ACI_ENVIRONMENT", "demo")
    monkeypatch.setenv("ACI_RUNTIME_ROLE", "all")
    monkeypatch.setenv("ACI_GRAPH_BACKEND", "memory")
    monkeypatch.setenv("ACI_EVENT_BUS_BACKEND", "memory")
    monkeypatch.setenv("ACI_INDEX_BACKEND", "memory")
    monkeypatch.setenv("ACI_INTERCEPTOR_CIRCUIT_STATE_BACKEND", "local")

    app_state = AppState()
    await app_state.start()
    try:
        assert app_state.index_store.lookup("customer-support-bot") is not None
        assert app_state.index_store.size >= 3
        assert app_state.graph is not None
        assert app_state.graph.get_stats()["total_nodes"] >= 3
    finally:
        await app_state.stop()


@pytest.mark.asyncio
async def test_ingest_rate_limiter_cleans_stale_buckets() -> None:
    limiter = SlidingWindowRateLimiter(limit=1, window_seconds=0.001)
    limiter._cleanup_interval_ops = 1

    assert await limiter.allow("caller-a") is True
    await asyncio.sleep(0.01)

    # Trigger maintenance pass; stale caller-a bucket should be evicted.
    assert await limiter.allow("caller-b") is True
    assert "caller-a" not in limiter._events
    assert "caller-b" in limiter._events


@pytest.mark.asyncio
async def test_redis_token_bucket_rate_limiter_blocks_after_capacity(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    from aci.api.runtime import RedisTokenBucketRateLimiter

    class _FakeRedis:
        def __init__(self) -> None:
            self.state: dict[str, tuple[float, float]] = {}

        async def eval(
            self,
            _script: str,
            _numkeys: int,
            *keys_and_args: str,
        ) -> list[int | float | str]:
            (
                redis_key,
                capacity,
                refill_rate,
                now,
                requested,
                _ttl,
            ) = keys_and_args
            cap = float(capacity)
            refill = float(refill_rate)
            current = float(now)
            ask = float(requested)
            tokens, updated_at = self.state.get(redis_key, (cap, current))
            elapsed = max(0.0, current - updated_at)
            tokens = min(cap, tokens + (elapsed * refill))
            allowed = 0
            if tokens >= ask:
                tokens -= ask
                allowed = 1
            self.state[redis_key] = (tokens, current)
            return [allowed, tokens]

        async def aclose(self) -> None:
            return None

    fake_redis = _FakeRedis()
    limiter = RedisTokenBucketRateLimiter(
        redis_url="redis://localhost:6379/0",
        limit=1,
        redis_client=fake_redis,
    )

    assert await limiter.allow("caller-a") is True
    assert await limiter.allow("caller-a") is False
    await limiter.close()


def test_platform_config_rejects_wildcard_cors_with_credentials() -> None:
    with pytest.raises(
        ValueError,
        match="api_cors_allow_credentials cannot be true",
    ):
        PlatformConfig(
            api_cors_allowed_origins="*",
            api_cors_allow_credentials=True,
        )


def test_platform_config_requires_kafka_for_gateway_shadow_events_in_production() -> None:
    with pytest.raises(
        ValueError,
        match="event_bus_backend must be 'kafka' when shadow_events_enabled is true",
    ):
        PlatformConfig(
            environment="production",
            runtime_role="gateway",
            graph_backend="memory",
            event_bus_backend="memory",
            neo4j_password="strong-secret",
            redis_url="rediss://cache.internal:6379/0",
            auth=AuthConfig(
                enabled=True,
                allow_dev_bypass=False,
                jwt_algorithm="HS256",
                jwt_hs256_secret="really-strong-secret",
            ),
        )


def test_materializer_persists_input_token_budget_constraints() -> None:
    store = AttributionIndexStore()
    materializer = IndexMaterializer(store)
    result = AttributionResult(
        workload_id="svc-token-budget",
        attribution_path=[
            AttributionPathNode(
                layer="Service",
                node_id="svc-token-budget",
                node_label="svc-token-budget",
                confidence=0.93,
                method="R1",
                source="unit-test",
            )
        ],
        combined_confidence=0.93,
        explanation=ExplanationArtifact(
            attribution_id="attr-token-budget",
            target_entity="team:finops",
            confidence_score=0.93,
            method_used="R1",
        ),
    )

    entry = materializer.materialize_attribution(
        result,
        policies={
            "token_budget_input": 1200,
            "token_budget_output": 600,
        },
    )

    assert entry.token_budget_input == 1200
    assert entry.token_budget_output == 600


def test_materializer_persists_cost_ceiling_constraint() -> None:
    store = AttributionIndexStore()
    materializer = IndexMaterializer(store)
    result = AttributionResult(
        workload_id="svc-cost-cap",
        attribution_path=[
            AttributionPathNode(
                layer="Service",
                node_id="svc-cost-cap",
                node_label="svc-cost-cap",
                confidence=0.91,
                method="R1",
                source="unit-test",
            )
        ],
        combined_confidence=0.91,
        explanation=ExplanationArtifact(
            attribution_id="attr-cost-cap",
            target_entity="team:finops",
            confidence_score=0.91,
            method_used="R1",
        ),
    )

    entry = materializer.materialize_attribution(
        result,
        policies={"cost_ceiling_per_request_usd": 0.005},
    )
    assert entry.cost_ceiling_per_request_usd == 0.005


def test_index_store_writes_redis_ttl_when_enabled() -> None:
    class _FakeRedis:
        def __init__(self) -> None:
            self.calls: list[dict[str, Any]] = []

        def set(self, key: str, value: str, ex: int | None = None) -> bool:
            self.calls.append({"key": key, "value": value, "ex": ex})
            return True

    store = AttributionIndexStore(redis_ttl_seconds=123)
    fake = _FakeRedis()
    store._redis = cast("Any", fake)
    entry = AttributionIndexEntry(
        workload_id="svc-ttl",
        team_id="team-ttl",
        team_name="TTL Team",
        cost_center_id="CC-ttl",
        confidence=0.9,
        confidence_tier="chargeback_ready",
        method_used="R1",
    )

    store._write_durable_entry(entry)
    assert fake.calls and fake.calls[0]["ex"] == 123


def test_index_store_uses_versioned_environment_scoped_redis_keys() -> None:
    store = AttributionIndexStore(redis_environment="Demo Env")
    key = store._redis_key("customer-support-bot")

    assert key.startswith("aci:idx:v1:demo-env:")
    assert "customer-support-bot" not in key
    assert len(key.rsplit(":", 1)[-1]) == 26


def test_index_store_writes_hot_path_hash_fields_through_version_guard() -> None:
    class _FakeRedis:
        def __init__(self) -> None:
            self.script = ""
            self.args: tuple[object, ...] = ()
            self.keys: list[str] = []

        def eval(
            self,
            _script: str,
            _numkeys: int,
            key: str,
            *_args: object,
        ) -> int:
            self.script = _script
            self.args = _args
            self.keys.append(key)
            return 1

    store = AttributionIndexStore(redis_environment="demo")
    fake = _FakeRedis()
    store._redis = cast("Any", fake)
    entry = AttributionIndexEntry(
        workload_id="svc-index-contract",
        team_id="team-contract",
        team_name="Contract Team",
        cost_center_id="CC-contract",
        confidence=0.91,
        confidence_tier="chargeback_ready",
        method_used="R2+R5",
        service_name="svc-index-contract",
        person_id="person-owner",
        model_allowlist=["gpt-4o-mini"],
        token_budget_input=1200,
    )

    store._write_durable_entry(entry)

    assert fake.keys[0].startswith("aci:idx:v1:demo:")
    assert "incoming_version < current_version" in fake.script
    assert "while i <= #ARGV do" in fake.script
    hash_args = [str(arg) for arg in fake.args[4:]]
    mapping: dict[str, str] = dict(zip(hash_args[0::2], hash_args[1::2], strict=True))
    assert mapping["index_version"] == str(entry.version)
    assert mapping["owner_id"] == "person-owner"
    assert mapping["team_id"] == "team-contract"
    assert mapping["service_id"] == "svc-index-contract"
    assert mapping["conf"] == "0.910000"
    assert mapping["reason"] == "R2+R5"
    constraints = json.loads(mapping["constraints_json"])
    assert constraints["model_allowlist"] == ["gpt-4o-mini"]
    assert constraints["token_budget_input"] == 1200
