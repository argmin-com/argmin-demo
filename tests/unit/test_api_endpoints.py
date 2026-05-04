from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import TYPE_CHECKING, Any, cast

import pytest
from fastapi.testclient import TestClient
from jwt import encode
from pydantic import SecretStr

from aci.api.app import (
    AdoptionDashboardResponse,
    AdoptionHierarchyResponse,
    DemoModeRequest,
    IntegrationOverviewResponse,
    InterceptRequest,
    InterventionTransitionRequest,
    ManualAttributionRequest,
    SlidingWindowRateLimiter,
    SpendForecastRequest,
    app,
    get_state,
)
from aci.interceptor.gateway import DeploymentMode
from aci.models.attribution import AttributionIndexEntry
from aci.models.carbon import EnforcementAction, PolicyDefinition, PolicyType

if TYPE_CHECKING:
    from collections.abc import Generator

REPO_ROOT = Path(__file__).resolve().parents[2]


def assert_operator_error_envelope(
    payload: dict[str, object],
    *,
    status_code: int,
) -> dict[str, object]:
    assert "detail" in payload
    error = payload["error"]
    assert isinstance(error, dict)
    assert error["message"]
    assert error["operator_guidance"]
    assert error["correlation_id"]
    assert error["status_code"] == status_code
    return error


@pytest.fixture(autouse=True)
def isolated_app_state() -> Generator[None, None, None]:
    app_state = get_state()
    interceptor = cast("Any", app_state.interceptor)
    original_environment = app_state.config.environment
    original_auth_enabled = app_state.config.auth.enabled
    original_allow_dev_bypass = app_state.config.auth.allow_dev_bypass
    original_algorithm = app_state.config.auth.jwt_algorithm
    original_secret = app_state.config.auth.jwt_hs256_secret
    original_issuer = app_state.config.auth.jwt_issuer
    original_audience = app_state.config.auth.jwt_audience
    original_required_scope = app_state.config.auth.required_scope
    original_tenant_claim = app_state.config.auth.tenant_claim
    original_runtime_role = app_state.runtime_role
    original_accepts_ingestion = app_state.accepts_ingestion
    original_accepts_interception = app_state.accepts_interception
    original_batch_limit = app_state.ingest_max_batch_size
    original_max_request_bytes = app_state.config.api_max_request_bytes
    original_trusted_proxy_cidrs = app_state.config.api_trusted_proxy_cidrs
    original_limiter = app_state.ingest_rate_limiter
    original_mode = app_state.interceptor.mode
    original_total_requests = interceptor.total_requests
    original_total_enriched = interceptor.total_enriched
    original_total_fail_open = interceptor.total_fail_open
    original_total_redirected = interceptor.total_redirected
    original_total_cache_misses = interceptor.total_cache_misses
    original_fail_open_alert_level = getattr(
        interceptor,
        "_fail_open_alert_level",
        "normal",
    )
    original_fail_open_window = list(getattr(interceptor, "_fail_open_window", []))

    app_state.index_store.clear()
    app_state.adoption.clear()
    if app_state.graph is not None:
        app_state.graph.clear()
    app_state.policy_engine.policies.clear()
    interceptor.total_requests = 0
    interceptor.total_enriched = 0
    interceptor.total_fail_open = 0
    interceptor.total_redirected = 0
    interceptor.total_cache_misses = 0
    if hasattr(interceptor, "_fail_open_window"):
        interceptor._fail_open_window.clear()
    if hasattr(interceptor, "_fail_open_alert_level"):
        interceptor._fail_open_alert_level = "normal"

    yield

    app_state.index_store.clear()
    app_state.adoption.clear()
    if app_state.graph is not None:
        app_state.graph.clear()
    app_state.policy_engine.policies.clear()
    app_state.config.environment = original_environment
    app_state.config.auth.enabled = original_auth_enabled
    app_state.config.auth.allow_dev_bypass = original_allow_dev_bypass
    app_state.config.auth.jwt_algorithm = original_algorithm
    app_state.config.auth.jwt_hs256_secret = original_secret
    app_state.config.auth.jwt_issuer = original_issuer
    app_state.config.auth.jwt_audience = original_audience
    app_state.config.auth.required_scope = original_required_scope
    app_state.config.auth.tenant_claim = original_tenant_claim
    app_state.runtime_role = original_runtime_role
    app_state.accepts_ingestion = original_accepts_ingestion
    app_state.accepts_interception = original_accepts_interception
    app_state.ingest_max_batch_size = original_batch_limit
    app_state.config.api_max_request_bytes = original_max_request_bytes
    app_state.config.api_trusted_proxy_cidrs = original_trusted_proxy_cidrs
    app_state.ingest_rate_limiter = original_limiter
    app_state.interceptor.mode = original_mode
    interceptor.total_requests = original_total_requests
    interceptor.total_enriched = original_total_enriched
    interceptor.total_fail_open = original_total_fail_open
    interceptor.total_redirected = original_total_redirected
    interceptor.total_cache_misses = original_total_cache_misses
    if hasattr(interceptor, "_fail_open_window"):
        interceptor._fail_open_window.clear()
        interceptor._fail_open_window.extend(original_fail_open_window)
    if hasattr(interceptor, "_fail_open_alert_level"):
        interceptor._fail_open_alert_level = original_fail_open_alert_level


def test_root_and_health_endpoints() -> None:
    with TestClient(app) as client:
        root = client.get("/")
        assert root.status_code == 200
        root_payload = root.json()
        assert root_payload["name"] == "Argmin Platform"
        assert root_payload["health_url"] == "/health"

        health = client.get("/health")
        assert health.status_code == 200
        health_payload = health.json()
        assert health_payload["status"] == "healthy"

        live = client.get("/live")
        assert live.status_code == 200
        assert live.json()["status"] == "alive"

        ready = client.get("/ready")
        assert ready.status_code == 200
        ready_payload = ready.json()
        assert ready_payload["status"] == "ready"
        assert all(ready_payload["checks"].values())

        prom = client.get("/metrics/prometheus")
        assert prom.status_code == 200
        assert "text/plain" in prom.headers["content-type"]
        assert "aci_interceptor_latency_p99" in prom.text


def test_root_redirects_browser_preview_to_platform_demo() -> None:
    with TestClient(app) as client:
        response = client.get(
            "/",
            headers={"Accept": "text/html,application/xhtml+xml"},
            follow_redirects=False,
        )

    assert response.status_code == 307
    assert response.headers["location"] == "/platform/"


def test_health_echoes_correlation_id_header() -> None:
    with TestClient(app) as client:
        response = client.get("/health", headers={"X-ACI-Correlation-Id": "corr-health-1"})

    assert response.status_code == 200
    assert response.headers["X-ACI-Correlation-Id"] == "corr-health-1"


def test_http_errors_include_operator_guidance_without_breaking_detail() -> None:
    with TestClient(app) as client:
        response = client.get(
            "/v1/attribution/missing-workload",
            headers={"X-ACI-Correlation-Id": "corr-http-1"},
        )

    assert response.status_code == 404
    payload = response.json()
    assert payload["detail"] == "Workload not found in attribution index"
    assert payload["error"]["message"] == "Workload not found in attribution index"
    assert_operator_error_envelope(payload, status_code=404)
    assert payload["error"]["correlation_id"] == "corr-http-1"
    assert "Traceback" not in response.text


def test_unhandled_api_errors_return_operator_safe_payload(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    app_state = get_state()

    def raise_unexpected_forecast_error(*args: object, **kwargs: object) -> object:
        raise RuntimeError('boom\nTraceback (most recent call last):\n  File "secret.py", line 1')

    monkeypatch.setattr(app_state.forecast, "forecast", raise_unexpected_forecast_error)

    with TestClient(app, raise_server_exceptions=False) as client:
        response = client.post(
            "/v1/forecast/spend",
            headers={"X-ACI-Correlation-Id": "corr-500-1"},
            json={
                "monthly_spend_usd": [412000, 489000, 567000, 634000],
                "horizon_months": 3,
            },
        )

    assert response.status_code == 500
    payload = response.json()
    assert payload["detail"] == "The demo API hit an unexpected local runtime error."
    assert payload["error"]["code"] == "local_runtime_error"
    assert_operator_error_envelope(payload, status_code=500)
    assert payload["error"]["correlation_id"] == "corr-500-1"
    assert "Traceback" not in response.text
    assert "secret.py" not in response.text
    assert "boom" not in response.text


def test_platform_demo_serves_csp_header_for_frame_ancestors() -> None:
    with TestClient(app) as client:
        response = client.get("/platform/")

    assert response.status_code == 200
    csp = response.headers["Content-Security-Policy"]
    assert "script-src 'self'" in csp
    assert "frame-ancestors 'none'" in csp
    assert response.headers["Cache-Control"] == "no-store, max-age=0"
    assert response.headers["Pragma"] == "no-cache"


def test_platform_demo_assets_are_versioned_and_cacheable() -> None:
    with TestClient(app) as client:
        html = client.get("/platform/")
        js = client.get("/platform/assets/app.js?v=20260309aa")
        dataset = client.get("/platform/data/demo_dataset.json?v=20260309aa")

    assert html.status_code == 200
    assert 'src="assets/app.js?v=20260309aa"' in html.text
    assert 'href="assets/app.css?v=20260309aa"' in html.text
    assert 'src="vendor/chart.umd.min.js?v=20260309aa"' in html.text
    assert js.status_code == 200
    assert js.headers["Cache-Control"] == "public, max-age=86400, immutable"
    assert "Pragma" not in js.headers
    assert dataset.status_code == 200
    assert dataset.headers["Cache-Control"] == "public, max-age=86400, immutable"


def test_event_ingest_is_idempotent_by_source_and_key() -> None:
    event_payload = {
        "event_type": "inference.request",
        "subject_id": "req-aci-1",
        "attributes": {
            "service_name": "customer-support-bot",
            "model": "gpt-4o-mini",
            "provider": "openai",
        },
        "event_time": datetime.now(UTC).isoformat(),
        "source": "unit-test",
        "idempotency_key": "req-aci-1",
    }

    with TestClient(app) as client:
        first = client.post("/v1/events/ingest", json=event_payload)
        second = client.post("/v1/events/ingest", json=event_payload)

        assert first.status_code == 200
        assert second.status_code == 200
        assert first.json()["accepted"] is True
        assert second.json()["accepted"] is False


def test_event_ingest_rejects_invalid_event_payload() -> None:
    invalid_payload = {
        "event_type": "inference.request",
        "subject_id": "req-bad-1",
        "attributes": {"provider": "openai"},  # Missing required "model".
        "event_time": datetime.now(UTC).isoformat(),
        "source": "unit-test",
        "idempotency_key": "req-bad-1",
    }

    with TestClient(app) as client:
        response = client.post("/v1/events/ingest", json=invalid_payload)
        assert response.status_code == 422
        assert "Invalid payload for event_type='inference.request'" in response.json()["detail"]


def test_event_ingest_rejects_excessive_json_depth() -> None:
    app_state = get_state()
    app_state.config.api_event_max_json_depth = 2
    payload = {
        "event_type": "resource.created",
        "subject_id": "resource-depth-1",
        "attributes": {
            "resource_arn": "arn:aws:sagemaker:us-east-1:123:endpoint/example",
            "cloud_provider": "aws",
            "tags": {"level1": {"level2": "too-deep"}},
        },
        "event_time": datetime.now(UTC).isoformat(),
        "source": "unit-test",
        "idempotency_key": "resource-depth-1",
    }

    with TestClient(app) as client:
        response = client.post("/v1/events/ingest", json=payload)

    assert response.status_code == 422
    assert "max depth" in response.json()["detail"]


def test_event_ingest_rejects_excessive_json_key_count() -> None:
    app_state = get_state()
    app_state.config.api_event_max_json_keys = 3
    payload = {
        "event_type": "resource.created",
        "subject_id": "resource-keys-1",
        "attributes": {
            "resource_arn": "arn:aws:sagemaker:us-east-1:123:endpoint/example",
            "cloud_provider": "aws",
            "tags": {
                "k1": "v1",
                "k2": "v2",
            },
        },
        "event_time": datetime.now(UTC).isoformat(),
        "source": "unit-test",
        "idempotency_key": "resource-keys-1",
    }

    with TestClient(app) as client:
        response = client.post("/v1/events/ingest", json=payload)

    assert response.status_code == 422
    assert "max key count" in response.json()["detail"]


def test_dashboard_overview_and_intercept_fail_open() -> None:
    with TestClient(app) as client:
        overview = client.get("/v1/dashboard/overview")
        assert overview.status_code == 200
        data = overview.json()
        assert "index_size" in data
        assert "interceptor_mode" in data
        assert "total_ai_spend_usd" in data
        assert "optimization_potential_usd" in data
        assert "spend_by_model" in data
        assert "spend_trend" in data

        intercept = client.post(
            "/v1/intercept",
            json={
                "request_id": "req-miss-1",
                "model": "gpt-4o",
                "provider": "openai",
                "service_name": "unknown-service",
                "api_key_id": "",
                "input_tokens": 120,
                "estimated_cost_usd": 0.012,
            },
        )
        assert intercept.status_code == 200
        assert intercept.json()["outcome"] == "fail_open"


def test_manual_attribution_endpoint_updates_index_and_publishes_correction() -> None:
    get_state().index_store.materialize(
        AttributionIndexEntry(
            workload_id="manual-map-svc",
            team_id="team-legacy",
            team_name="Legacy Team",
            cost_center_id="CC-1000",
            cost_center_name="Legacy Cost Center",
            confidence=0.61,
            confidence_tier="provisional",
            method_used="R3",
        )
    )

    with TestClient(app) as client:
        response = client.post(
            "/v1/attribution/manual",
            json={
                "workload_id": "manual-map-svc",
                "true_team_id": "team-finops",
                "true_team_name": "FinOps",
                "true_cost_center_id": "CC-9900",
                "true_cost_center_name": "Finance Control",
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["accepted"] is True
    assert payload["previous_team_id"] == "team-legacy"
    assert payload["updated_team_id"] == "team-finops"
    assert payload["confidence_after"] == 1.0
    assert payload["method_used"] == "MANUAL_CORRECTION"

    updated = get_state().index_store.lookup("manual-map-svc")
    assert updated is not None
    assert updated.team_id == "team-finops"
    assert updated.cost_center_id == "CC-9900"
    assert updated.method_used == "MANUAL_CORRECTION"


def test_demo_bootstrap_seeds_interceptable_workloads() -> None:
    app_state = get_state()
    app_state.config.environment = "development"

    with TestClient(app) as client:
        bootstrap = client.post("/v1/demo/bootstrap")
        assert bootstrap.status_code == 200
        payload = bootstrap.json()
        assert payload["seeded_entries"] >= 9
        assert "customer-support-bot" in payload["workloads"]
        assert "support-bot-staging" in payload["workloads"]

        intercept = client.post(
            "/v1/intercept",
            json={
                "request_id": "req-demo-1",
                "model": "gpt-4o-mini",
                "provider": "openai",
                "service_name": "customer-support-bot",
                "input_tokens": 500,
                "max_tokens": 300,
                "estimated_cost_usd": 0.002,
                "environment": "staging",
            },
        )
        assert intercept.status_code == 200
        assert intercept.json()["outcome"] != "fail_open"


def test_demo_bootstrap_seeds_manual_mapping_workloads_for_live_correction() -> None:
    app_state = get_state()
    app_state.config.environment = "development"

    with TestClient(app) as client:
        bootstrap = client.post("/v1/demo/bootstrap")
        assert bootstrap.status_code == 200

        correction = client.post(
            "/v1/attribution/manual",
            json={
                "workload_id": "support-bot-staging",
                "true_team_id": "team-platform-engineering",
                "true_team_name": "Platform Engineering",
                "true_cost_center_id": "CC-PLATFORM",
                "true_cost_center_name": "Platform Engineering",
                "actor": "unit-test",
                "note": "live manual correction parity check",
            },
        )

    assert correction.status_code == 200
    payload = correction.json()
    assert payload["updated_team_name"] == "Platform Engineering"
    assert payload["confidence_after"] == 1.0

    updated = app_state.index_store.lookup("support-bot-staging")
    assert updated is not None
    assert updated.team_name == "Platform Engineering"
    assert updated.method_used == "MANUAL_CORRECTION"


def test_demo_bootstrap_seeds_adoption_dashboard() -> None:
    app_state = get_state()
    app_state.config.environment = "development"

    with TestClient(app) as client:
        bootstrap = client.post("/v1/demo/bootstrap")
        assert bootstrap.status_code == 200

        hierarchy = client.get("/v1/adoption/hierarchy")
        assert hierarchy.status_code == 200
        hierarchy_payload = hierarchy.json()
        assert hierarchy_payload["organization"]["organization_name"] == "NovaTech Industries"
        assert hierarchy_payload["organization"]["business_units"]

        dashboard = client.get("/v1/adoption/dashboard")
        assert dashboard.status_code == 200
        dashboard_payload = dashboard.json()
        assert dashboard_payload["scope_type"] == "organization"
        summary = dashboard_payload["summary"]
        assert summary["eligible_employees"] == 812
        assert summary["active_employees_30d"] == 486
        assert 55 <= summary["adoption_penetration_pct"] <= 65
        assert 55 <= summary["repeat_user_rate_pct"] <= 80
        assert 10 <= summary["power_user_rate_pct"] <= 30
        assert dashboard_payload["executive_lenses"]
        assert dashboard_payload["top_employees"]


def test_demo_reset_restores_deterministic_runtime_baseline() -> None:
    app_state = get_state()
    app_state.config.environment = "demo"

    with TestClient(app) as client:
        first = client.post("/v1/demo/reset")
        assert first.status_code == 200
        first_payload = first.json()
        assert first_payload["reference_time"] == "2026-02-28T17:00:00+00:00"
        assert first_payload["reset_token"] == "argmin-demo-baseline-v1"
        assert len(first_payload["scenario_ids"]) == 8
        assert len(first_payload["demo_accounts"]) >= 6
        assert {"Admin", "Manager", "User", "Auditor"} <= {
            account["role"] for account in first_payload["demo_accounts"]
        }
        assert first_payload["events_published"] == 6

        mode = client.post("/v1/demo/mode", json={"mode": "active"})
        assert mode.status_code == 200
        assert app_state.interceptor.mode == DeploymentMode.ACTIVE

        correction = client.post(
            "/v1/attribution/manual",
            json={
                "workload_id": "support-bot-staging",
                "true_team_id": "team-platform-engineering",
                "true_team_name": "Platform Engineering",
                "true_cost_center_id": "CC-PLATFORM",
                "true_cost_center_name": "Platform Engineering",
                "actor": "unit-test",
                "note": "intentional mutation before reset",
            },
        )
        assert correction.status_code == 200
        assert correction.json()["event_id"] == (
            "evt-demo-manual-support-bot-staging-team-platform-engineering-cc-platform"
        )

        intervention = client.post(
            "/v1/interventions/INT-401/status",
            json={"status": "approved", "actor": "unit-test", "note": "mutation"},
        )
        assert intervention.status_code == 200
        assert intervention.json()["status"] == "approved"

        second = client.post("/v1/demo/reset")
        assert second.status_code == 200
        second_payload = second.json()
        assert second_payload == first_payload
        assert app_state.interceptor.mode.value == "advisory"

        attribution = client.get("/v1/attribution/support-bot-staging")
        assert attribution.status_code == 200
        attribution_payload = attribution.json()
        assert attribution_payload["team_name"] == "Customer Engineering"
        assert attribution_payload["method_used"] == "R5"

        summary = client.get("/v1/interventions/summary")
        assert summary.status_code == 200
        assert summary.json()["approved_count"] == 0

        deliveries = client.get("/v1/integrations/deliveries")
        assert deliveries.status_code == 200
        delivery_payload = deliveries.json()
        assert {item["scenario_id"] for item in delivery_payload} >= set(
            first_payload["scenario_ids"]
        )
        assert all(item["sent_at"].startswith("2026-02-28T17:") for item in delivery_payload)


def test_frontend_backend_contracts_match_demo_payloads_and_responses() -> None:
    app_state = get_state()
    app_state.config.environment = "demo"
    dataset = json.loads((REPO_ROOT / "frontend" / "data" / "demo_dataset.json").read_text())

    AdoptionHierarchyResponse.model_validate(dataset["adoption"]["hierarchy"])
    for dashboard in dataset["adoption"]["dashboards"].values():
        AdoptionDashboardResponse.model_validate(dashboard)
    IntegrationOverviewResponse.model_validate(dataset["integrations"])

    for key, scenario in dataset["demo_scenarios"].items():
        InterceptRequest.model_validate(
            {
                **scenario["payload"],
                "request_id": scenario["payload"].get("request_id", f"contract-{key}"),
            }
        )

    for mode in ("passive", "advisory", "active"):
        DemoModeRequest.model_validate({"mode": mode})
    for status in ("recommended", "review", "approved", "implemented", "dismissed"):
        InterventionTransitionRequest.model_validate(
            {"status": status, "actor": "demo-ui", "note": "contract check"}
        )

    monthly_spend = [
        float(point["total"]) * 1000.0
        for point in dataset["overview"]["spend_trend_k_usd"]
    ]
    SpendForecastRequest.model_validate(
        {"monthly_spend_usd": monthly_spend, "horizon_months": 3}
    )

    teams_by_name = {team["name"]: team for team in dataset["teams"]}
    for mapping in dataset["manual_mapping"]:
        if mapping["status"] == "deferred":
            continue
        resolved_team_name = (
            mapping.get("resolved_team")
            or mapping.get("suggested_owner")
            or mapping.get("current_owner")
        )
        team = teams_by_name.get(resolved_team_name)
        fallback_team_id = str(resolved_team_name).strip().lower().replace(" ", "-") or "unknown"
        team_id = team["id"] if team is not None else f"team-{fallback_team_id}"
        ManualAttributionRequest.model_validate(
            {
                "workload_id": mapping["workload_label"],
                "true_team_id": team_id,
                "true_team_name": resolved_team_name,
                "true_cost_center_id": f"CC-{str(team_id).upper()}",
                "true_cost_center_name": f"{resolved_team_name} Cost Center",
                "actor": "demo-ui",
                "note": f"Manual mapping {mapping['id']} resolved from the local demo UI.",
            }
        )

    with TestClient(app) as client:
        reset = client.post("/v1/demo/reset")
        assert reset.status_code == 200
        reset_payload = reset.json()
        datetime.fromisoformat(reset_payload["reference_time"])
        assert reset_payload["interceptor_mode"] in {"passive", "advisory", "active"}
        assert all(" " not in workload for workload in reset_payload["workloads"])

        hierarchy = client.get("/v1/adoption/hierarchy")
        assert hierarchy.status_code == 200
        AdoptionHierarchyResponse.model_validate(hierarchy.json())

        dashboard = client.get(
            "/v1/adoption/dashboard?scope=organization&scope_id=org-novatech&window_days=30"
        )
        assert dashboard.status_code == 200
        dashboard_payload = dashboard.json()
        AdoptionDashboardResponse.model_validate(dashboard_payload)
        datetime.fromisoformat(dashboard_payload["generated_at"])
        assert dashboard_payload["scope_type"] == "organization"
        assert dashboard_payload["summary"]["active_employees_30d"] > 0

        integrations = client.get("/v1/integrations/overview?limit=12")
        assert integrations.status_code == 200
        integration_payload = integrations.json()
        IntegrationOverviewResponse.model_validate(integration_payload)
        assert integration_payload["summary"]["live_delivery_mode"] in {"live", "simulated"}
        route_ids = {route["route_id"] for route in integration_payload["routes"]}
        for scenario in integration_payload["scenarios"]:
            assert scenario["route_id"] in route_ids

        scenario_id = integration_payload["scenarios"][0]["scenario_id"]
        dispatch = client.post(f"/v1/integrations/scenarios/{scenario_id}/dispatch", json={})
        assert dispatch.status_code == 200
        dispatch_payload = dispatch.json()
        assert dispatch_payload["scenario_id"] == scenario_id
        assert dispatch_payload["deliveries"]
        datetime.fromisoformat(dispatch_payload["deliveries"][0]["sent_at"])

        interventions = client.get("/v1/interventions")
        assert interventions.status_code == 200
        intervention_payload = interventions.json()
        valid_intervention_statuses = {
            "recommended",
            "review",
            "approved",
            "implemented",
            "dismissed",
        }
        assert {
            item["status"]
            for item in intervention_payload["interventions"]
        } <= valid_intervention_statuses
        for item in intervention_payload["interventions"]:
            datetime.fromisoformat(item["updated_at"])

        mode_response = client.post("/v1/demo/mode", json={"mode": "active"})
        assert mode_response.status_code == 200
        assert mode_response.json()["interceptor_mode"] == "active"

        intercept = client.post(
            "/v1/intercept",
            json={
                **dataset["demo_scenarios"]["enriched"]["payload"],
                "request_id": "contract-enriched",
            },
        )
        assert intercept.status_code == 200
        intercept_payload = intercept.json()
        assert intercept_payload["request_id"] == "contract-enriched"
        assert intercept_payload["outcome"] in {
            "enriched",
            "fail_open",
            "soft_stopped",
            "redirected",
            "timeout",
        }
        assert isinstance(intercept_payload["enrichment_headers"], dict)

        forecast = client.post(
            "/v1/forecast/spend",
            json={"monthly_spend_usd": monthly_spend, "horizon_months": 3},
        )
        assert forecast.status_code == 200
        forecast_payload = forecast.json()
        assert len(forecast_payload["points"]) == 3
        assert {
            "month_offset",
            "predicted_spend_usd",
            "lower_bound_usd",
            "upper_bound_usd",
        } <= set(forecast_payload["points"][0])


def test_adoption_dashboard_supports_scope_drilldown() -> None:
    app_state = get_state()
    app_state.adoption.upsert_employee(
        employee_id="riley.quinn",
        name="Riley Quinn",
        email="riley.quinn@novatech.example",
        title="Finance Systems Lead",
        team_id="team-finance-systems",
        team_name="Finance Systems",
        business_unit_id="bu-finance-and-ops",
        business_unit_name="Finance and Operations",
        organization_id="org-novatech",
        organization_name="NovaTech Industries",
    )
    app_state.adoption.record_daily_usage(
        day=datetime.now(UTC).date(),
        employee_id="riley.quinn",
        email="riley.quinn@novatech.example",
        employee_name="Riley Quinn",
        title="Finance Systems Lead",
        team_id="team-finance-systems",
        team_name="Finance Systems",
        business_unit_id="bu-finance-and-ops",
        business_unit_name="Finance and Operations",
        organization_id="org-novatech",
        organization_name="NovaTech Industries",
        requests=14,
        spend_usd=63.5,
        governed_requests=12,
        intervention_requests=1,
        model_counts={"OpenAI / gpt-4o-mini": 14},
        entry_point_counts={"finance-ops-assistant": 14},
    )

    with TestClient(app) as client:
        response = client.get(
            "/v1/adoption/dashboard",
            params={
                "scope": "business_unit",
                "scope_id": "bu-finance-and-ops",
                "window_days": 30,
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["scope_type"] == "business_unit"
    assert payload["scope_id"] == "bu-finance-and-ops"
    assert payload["summary"]["requests_30d"] == 14
    assert payload["child_scopes"][0]["scope_type"] == "team"


def test_demo_bootstrap_disabled_in_production() -> None:
    app_state = get_state()
    app_state.config.environment = "production"
    app_state.config.auth.enabled = False
    with TestClient(app) as client:
        response = client.post("/v1/demo/bootstrap")
        assert response.status_code == 403
        assert "disabled in production" in response.json()["detail"]


def test_demo_reset_disabled_in_production() -> None:
    app_state = get_state()
    app_state.config.environment = "production"
    app_state.config.auth.enabled = False
    with TestClient(app) as client:
        response = client.post("/v1/demo/reset")
        assert response.status_code == 403
        assert "disabled in production" in response.json()["detail"]


def test_demo_mode_endpoint_updates_interceptor_mode() -> None:
    app_state = get_state()
    app_state.config.environment = "demo"

    with TestClient(app) as client:
        response = client.post("/v1/demo/mode", json={"mode": "active"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["interceptor_mode"] == "active"
    assert app_state.interceptor.mode == DeploymentMode.ACTIVE


def test_intercept_endpoint_can_be_disabled_by_runtime_role_flag() -> None:
    app_state = get_state()
    app_state.accepts_interception = False
    with TestClient(app) as client:
        response = client.post(
            "/v1/intercept",
            json={
                "request_id": "req-role-off-1",
                "model": "gpt-4o",
            },
        )
        assert response.status_code == 503
        payload = response.json()
        assert "interceptor disabled" in payload["detail"]
        assert_operator_error_envelope(payload, status_code=503)


def test_gateway_runtime_restricts_non_intercept_v1_routes() -> None:
    app_state = get_state()
    app_state.runtime_role = "gateway"
    app_state.accepts_ingestion = False
    app_state.accepts_interception = True

    with TestClient(app) as client:
        response = client.get("/v1/dashboard/overview")
        assert response.status_code == 503
        payload = response.json()
        assert "runtime role 'gateway'" in payload["detail"]
        error = assert_operator_error_envelope(payload, status_code=503)
        assert error["code"] == "runtime_surface_unavailable"


def test_v1_endpoints_require_auth_outside_development() -> None:
    app_state = get_state()
    app_state.config.environment = "production"
    app_state.config.auth.enabled = True
    app_state.config.auth.jwt_algorithm = "HS256"
    app_state.config.auth.jwt_hs256_secret = SecretStr("unit-test-secret-unit-test-secret-32")
    app_state.config.auth.jwt_issuer = "aci-tests"
    app_state.config.auth.jwt_audience = "aci-api"
    app_state.config.auth.required_scope = "aci.api"
    app_state.config.auth.tenant_claim = "tenant_id"

    token = encode(
        {
            "sub": "svc-gateway",
            "iss": "aci-tests",
            "aud": "aci-api",
            "tenant_id": app_state.config.tenant_id,
            "scope": "aci.api",
            "iat": int(datetime.now(UTC).timestamp()),
            "exp": int((datetime.now(UTC) + timedelta(minutes=5)).timestamp()),
        },
        key="unit-test-secret-unit-test-secret-32",
        algorithm="HS256",
    )

    with TestClient(app) as client:
        unauthenticated = client.get("/v1/dashboard/overview")
        assert unauthenticated.status_code == 401
        error = assert_operator_error_envelope(unauthenticated.json(), status_code=401)
        assert error["code"] == "missing_bearer_token"

        authenticated = client.get(
            "/v1/dashboard/overview",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert authenticated.status_code == 200


def test_v1_endpoints_allow_auth_bypass_in_demo() -> None:
    app_state = get_state()
    app_state.config.environment = "demo"
    app_state.config.auth.enabled = True
    app_state.config.auth.allow_dev_bypass = True

    with TestClient(app) as client:
        response = client.get("/v1/dashboard/overview")
        assert response.status_code == 200


def test_event_batch_ingest_rejects_oversized_batches() -> None:
    app_state = get_state()
    app_state.ingest_max_batch_size = 1

    payload = {
        "events": [
            {
                "event_type": "inference.request",
                "subject_id": "req-batch-1",
                "attributes": {"model": "gpt-4o-mini", "provider": "openai"},
                "event_time": datetime.now(UTC).isoformat(),
                "source": "unit-test",
                "idempotency_key": "req-batch-1",
            },
            {
                "event_type": "inference.request",
                "subject_id": "req-batch-2",
                "attributes": {"model": "gpt-4o-mini", "provider": "openai"},
                "event_time": datetime.now(UTC).isoformat(),
                "source": "unit-test",
                "idempotency_key": "req-batch-2",
            },
        ]
    }

    with TestClient(app) as client:
        response = client.post("/v1/events/ingest/batch", json=payload)
        assert response.status_code == 413
        response_payload = response.json()
        assert "exceeds configured max" in response_payload["detail"]
        assert_operator_error_envelope(response_payload, status_code=413)


def test_event_batch_ingest_rejects_empty_batches() -> None:
    with TestClient(app) as client:
        response = client.post("/v1/events/ingest/batch", json={"events": []})

    assert response.status_code == 422
    assert response.json()["detail"][0]["type"] == "too_short"


def test_event_batch_ingest_reports_deduplicated_events() -> None:
    payload = {
        "events": [
            {
                "event_type": "inference.request",
                "subject_id": "req-batch-dedupe-1",
                "attributes": {"model": "gpt-4o-mini", "provider": "openai"},
                "event_time": datetime.now(UTC).isoformat(),
                "source": "unit-test-batch-contract",
                "idempotency_key": "req-batch-dedupe-1",
            },
            {
                "event_type": "inference.request",
                "subject_id": "req-batch-dedupe-duplicate",
                "attributes": {"model": "gpt-4o-mini", "provider": "openai"},
                "event_time": datetime.now(UTC).isoformat(),
                "source": "unit-test-batch-contract",
                "idempotency_key": "req-batch-dedupe-1",
            },
        ]
    }

    with TestClient(app) as client:
        response = client.post("/v1/events/ingest/batch", json=payload)

    assert response.status_code == 200
    assert response.json() == {"total": 2, "accepted": 1, "deduplicated": 1}


def test_event_ingest_rate_limit_is_enforced() -> None:
    app_state = get_state()
    app_state.ingest_rate_limiter = SlidingWindowRateLimiter(limit=1, window_seconds=60.0)

    payload_1 = {
        "event_type": "inference.request",
        "subject_id": "req-limit-1",
        "attributes": {"model": "gpt-4o-mini", "provider": "openai"},
        "event_time": datetime.now(UTC).isoformat(),
        "source": "unit-test",
        "idempotency_key": "req-limit-1",
    }
    payload_2 = {
        "event_type": "inference.request",
        "subject_id": "req-limit-2",
        "attributes": {"model": "gpt-4o-mini", "provider": "openai"},
        "event_time": datetime.now(UTC).isoformat(),
        "source": "unit-test",
        "idempotency_key": "req-limit-2",
    }

    with TestClient(app) as client:
        first = client.post("/v1/events/ingest", json=payload_1)
        second = client.post("/v1/events/ingest", json=payload_2)

        assert first.status_code == 200
        assert second.status_code == 429
        assert "rate limit exceeded" in second.json()["detail"]


def test_event_ingest_ignores_untrusted_forwarded_for_header() -> None:
    app_state = get_state()
    app_state.ingest_rate_limiter = SlidingWindowRateLimiter(limit=1, window_seconds=60.0)
    app_state.config.api_trusted_proxy_cidrs = ""

    payload = {
        "event_type": "inference.request",
        "subject_id": "req-forwarded-1",
        "attributes": {"model": "gpt-4o-mini", "provider": "openai"},
        "event_time": datetime.now(UTC).isoformat(),
        "source": "unit-test",
        "idempotency_key": "req-forwarded-1",
    }

    with TestClient(app) as client:
        first = client.post(
            "/v1/events/ingest",
            json=payload,
            headers={"X-Forwarded-For": "198.51.100.10"},
        )
        second = client.post(
            "/v1/events/ingest",
            json={**payload, "subject_id": "req-forwarded-2", "idempotency_key": "req-forwarded-2"},
            headers={"X-Forwarded-For": "203.0.113.9"},
        )

        assert first.status_code == 200
        assert second.status_code == 429


def test_event_ingest_rejects_oversized_request_body_before_parsing() -> None:
    app_state = get_state()
    app_state.config.api_max_request_bytes = 64

    oversized_body = "x" * 256

    with TestClient(app) as client:
        response = client.post(
            "/v1/events/ingest",
            content=oversized_body.encode(),
            headers={"Content-Type": "application/json"},
        )

    assert response.status_code == 413
    payload = response.json()
    assert "request body exceeds configured max" in payload["detail"]
    error = assert_operator_error_envelope(payload, status_code=413)
    assert error["code"] == "request_body_too_large"


def test_index_lookup_endpoint_contract() -> None:
    workload_id = "lookup-test-svc"
    get_state().index_store.materialize(
        AttributionIndexEntry(
            workload_id=workload_id,
            team_id="team-finops",
            team_name="FinOps",
            cost_center_id="CC-9900",
            confidence=0.91,
            confidence_tier="chargeback_ready",
            method_used="R1",
            model_allowlist=["gpt-4o-mini"],
            token_budget_input=1000,
        )
    )

    with TestClient(app) as client:
        response = client.get(f"/v1/index/lookup?key={workload_id}")
        assert response.status_code == 200
        payload = response.json()
        assert payload["key"] == workload_id
        assert payload["index_version"] >= 1
        assert payload["attribution"]["owner_id"] == "team-finops"
        assert payload["attribution"]["reason"] == "DIRECT_OWNER_MAPPING"
        assert payload["cache_ttl_ms"] == 60000
        assert len(payload["constraints"]) >= 1


def test_intercept_gate_returns_413_schema_for_input_token_limit() -> None:
    app_state = get_state()
    app_state.interceptor.mode = DeploymentMode.ACTIVE

    app_state.index_store.materialize(
        AttributionIndexEntry(
            workload_id="gate-test-svc",
            team_id="team-risk",
            team_name="Risk",
            cost_center_id="CC-2200",
            confidence=0.96,
            confidence_tier="chargeback_ready",
            method_used="R1",
            token_budget_input=100,
        )
    )

    with TestClient(app) as client:
        response = client.post(
            "/v1/intercept",
            json={
                "request_id": "req-gate-413",
                "model": "gpt-4o",
                "service_name": "gate-test-svc",
                "input_tokens": 250,
                "environment": "staging",
            },
        )
        assert response.status_code == 413
        payload = response.json()
        assert response.headers["X-ACI-Correlation-Id"]
        assert response.headers["X-ACI-Correlation-Id"] == payload["error"]["correlation_id"]
        assert payload["detail"] == payload["error"]["message"]
        assert_operator_error_envelope(payload, status_code=413)
        assert payload["error"]["type"] == "token_size_exceeded"
        assert payload["error"]["code"] == "token_size_exceeded"
        assert payload["error"]["policy_id"] == "token_budget_input"
        assert payload["error"]["request_id"] == "req-gate-413"
        assert payload["error"]["retry"] is False


def test_intercept_gate_returns_403_schema_for_cost_ceiling() -> None:
    app_state = get_state()
    app_state.interceptor.mode = DeploymentMode.ACTIVE

    app_state.index_store.materialize(
        AttributionIndexEntry(
            workload_id="gate-test-cost",
            team_id="team-finops",
            team_name="FinOps",
            cost_center_id="CC-9900",
            confidence=0.97,
            confidence_tier="chargeback_ready",
            method_used="R1",
            cost_ceiling_per_request_usd=0.001,
            approved_alternatives=["gpt-4o-mini"],
        )
    )

    with TestClient(app) as client:
        response = client.post(
            "/v1/intercept",
            json={
                "request_id": "req-gate-cost",
                "model": "gpt-4o",
                "service_name": "gate-test-cost",
                "estimated_cost_usd": 0.01,
                "environment": "staging",
            },
        )

    assert response.status_code == 403
    payload = response.json()
    assert payload["detail"] == payload["error"]["message"]
    assert_operator_error_envelope(payload, status_code=403)
    assert payload["error"]["type"] == "cost_approval_required"
    assert payload["error"]["code"] == "cost_approval_required"
    assert payload["error"]["policy_id"] == "cost_ceiling"
    assert payload["error"]["request_id"] == "req-gate-cost"
    assert payload["error"]["approved_alternatives"] == ["gpt-4o-mini"]


def test_policy_evaluate_endpoint_contract() -> None:
    policy = PolicyDefinition(
        policy_id="test-model-allowlist",
        policy_type=PolicyType.MODEL_ALLOWLIST,
        name="Test Allowlist",
        scope="global",
        enforcement=EnforcementAction.SOFT_STOP,
        parameters={"allowed_models": ["gpt-4o-mini"]},
    )
    app_state = get_state()
    app_state.policy_engine.register_policy(policy)

    with TestClient(app) as client:
        advisory = client.post(
            "/v1/policy/evaluate",
            json={
                "request_id": "req-policy-1",
                "env": "staging",
                "service_id": "svc-support",
                "model_requested": "gpt-4o",
                "attribution": {"confidence": 0.95},
                "signals": {"est_cost_usd": 3.2},
                "mode": "ADVISORY",
                "service_policy": {"active_lite_enabled": False, "allowed_actions": []},
            },
        )
        assert advisory.status_code == 200
        advisory_payload = advisory.json()
        assert advisory_payload["decision"] == "ADVISORY"
        assert advisory_payload["fail_open"] is False
        assert len(advisory_payload["advisories"]) >= 1
        assert advisory_payload["actions"] == []

        active_lite = client.post(
            "/v1/policy/evaluate",
            json={
                "request_id": "req-policy-2",
                "env": "staging",
                "service_id": "svc-support",
                "model_requested": "gpt-4o",
                "attribution": {"confidence": 0.95},
                "signals": {"est_cost_usd": 3.2},
                "mode": "ACTIVE_LITE",
                "service_policy": {
                    "active_lite_enabled": True,
                    "allowed_actions": ["MODEL_ROUTE"],
                },
            },
        )
        assert active_lite.status_code == 200
        active_payload = active_lite.json()
        assert active_payload["decision"] == "APPLY"
        assert active_payload["fail_open"] is False
        assert len(active_payload["actions"]) >= 1
