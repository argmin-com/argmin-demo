from __future__ import annotations

import json
from pathlib import Path
from typing import TYPE_CHECKING, Any, cast

import pytest
from fastapi.testclient import TestClient

from aci.api.app import app, get_state
from aci.interceptor.gateway import DeploymentMode

if TYPE_CHECKING:
    from collections.abc import Generator

REPO_ROOT = Path(__file__).resolve().parents[2]


@pytest.fixture(autouse=True)
def isolated_demo_runtime() -> Generator[None, None, None]:
    app_state = get_state()
    interceptor = cast("Any", app_state.interceptor)
    original_environment = app_state.config.environment
    original_auth_enabled = app_state.config.auth.enabled
    original_allow_dev_bypass = app_state.config.auth.allow_dev_bypass
    original_mode = app_state.interceptor.mode
    original_total_requests = interceptor.total_requests
    original_total_enriched = interceptor.total_enriched
    original_total_fail_open = interceptor.total_fail_open
    original_total_redirected = interceptor.total_redirected
    original_total_cache_misses = interceptor.total_cache_misses

    app_state.config.environment = "demo"
    app_state.config.auth.enabled = True
    app_state.config.auth.allow_dev_bypass = True

    yield

    app_state.index_store.clear()
    app_state.adoption.clear()
    app_state.notification_hub.clear()
    app_state.reconciliation.clear()
    app_state.pricing.reset_to_default_rules()
    app_state.intervention_registry.reset_to_seed_data()
    clear_event_bus = getattr(app_state.event_bus, "clear", None)
    if callable(clear_event_bus):
        clear_event_bus()
    if app_state.graph is not None:
        app_state.graph.clear()
    if hasattr(interceptor, "reset_metrics"):
        interceptor.reset_metrics()
    app_state.config.environment = original_environment
    app_state.config.auth.enabled = original_auth_enabled
    app_state.config.auth.allow_dev_bypass = original_allow_dev_bypass
    app_state.interceptor.mode = original_mode
    interceptor.total_requests = original_total_requests
    interceptor.total_enriched = original_total_enriched
    interceptor.total_fail_open = original_total_fail_open
    interceptor.total_redirected = original_total_redirected
    interceptor.total_cache_misses = original_total_cache_misses


@pytest.mark.smoke
def test_golden_demo_path_covers_accounts_navigation_workflows_and_failure() -> None:
    dataset = json.loads((REPO_ROOT / "frontend" / "data" / "demo_dataset.json").read_text())

    with TestClient(app, raise_server_exceptions=False) as client:
        platform = client.get("/platform/")
        app_js = client.get("/platform/assets/app.js?v=20260309aj")
        dataset_response = client.get("/platform/data/demo_dataset.json?v=20260309aj")

        assert platform.status_code == 200
        assert app_js.status_code == 200
        assert dataset_response.status_code == 200
        assert "Argmin | Decision-Time AI Cost Governance Demo" in platform.text
        assert 'data-action="start-walkthrough"' in platform.text
        assert 'id="recovery-banner"' in platform.text
        assert "const DEMO_PERSONAS = [" in app_js.text
        assert 'data-action="set-demo-persona"' in app_js.text
        for label in (
            "Overview",
            "Employee Adoption",
            "Request Proof",
            "Manual Mapping",
            "Interventions",
            "Forecasting",
            "Integrations",
            "Admin",
        ):
            assert label in app_js.text

        reset = client.post("/v1/demo/reset")
        assert reset.status_code == 200
        reset_payload = reset.json()
        assert reset_payload["reset_token"] == "argmin-demo-baseline-v1"
        assert reset_payload["reference_time"] == "2026-02-28T17:00:00+00:00"
        assert {"Admin", "Manager", "User", "Auditor"} <= {
            account["role"]
            for account in reset_payload["demo_accounts"]
            if account["status"].lower() == "active"
        }
        assert "customer-support-bot" in reset_payload["workloads"]
        assert "support-bot-staging" in reset_payload["workloads"]

        assert len(dataset_response.json()["teams"]) >= 6
        assert len(dataset_response.json()["models"]) >= 8
        assert len(dataset_response.json()["manual_mapping"]) >= 4
        assert len(dataset_response.json()["interventions"]) >= 4

        overview = client.get("/v1/dashboard/overview")
        assert overview.status_code == 200
        assert overview.json()["total_ai_spend_usd"] > 0

        hierarchy = client.get("/v1/adoption/hierarchy")
        assert hierarchy.status_code == 200
        assert hierarchy.json()["organization"]["organization_name"] == "NovaTech Industries"

        adoption = client.get(
            "/v1/adoption/dashboard",
            params={
                "scope": "organization",
                "scope_id": "org-novatech",
                "window_days": 30,
            },
        )
        assert adoption.status_code == 200
        adoption_summary = adoption.json()["summary"]
        assert adoption_summary["eligible_employees"] == 812
        assert adoption_summary["active_employees_30d"] == 486
        assert 55 <= adoption_summary["adoption_penetration_pct"] <= 65

        integrations = client.get("/v1/integrations/overview", params={"limit": 12})
        assert integrations.status_code == 200
        integration_payload = integrations.json()
        assert integration_payload["summary"]["live_delivery_mode"] == "simulated"
        scenario_id = integration_payload["scenarios"][0]["scenario_id"]
        dispatch = client.post(f"/v1/integrations/scenarios/{scenario_id}/dispatch", json={})
        assert dispatch.status_code == 200
        assert dispatch.json()["deliveries"]

        intercept = client.post(
            "/v1/intercept",
            json={
                **dataset["demo_scenarios"]["enriched"]["payload"],
                "request_id": "golden-smoke-enriched",
            },
        )
        assert intercept.status_code == 200
        assert intercept.json()["outcome"] in {"enriched", "redirected", "soft_stopped"}

        manual = client.post(
            "/v1/attribution/manual",
            json={
                "workload_id": "support-bot-staging",
                "true_team_id": "team-platform-engineering",
                "true_team_name": "Platform Engineering",
                "true_cost_center_id": "CC-PLATFORM",
                "true_cost_center_name": "Platform Engineering",
                "actor": "golden-smoke",
                "note": "Golden demo path verifies manual ownership correction.",
            },
        )
        assert manual.status_code == 200
        assert manual.json()["accepted"] is True
        assert manual.json()["confidence_after"] == 1.0

        app_state = get_state()
        assert app_state.interceptor.mode == DeploymentMode.ADVISORY
        intervention = client.post(
            "/v1/interventions/INT-401/status",
            json={
                "status": "approved",
                "actor": "golden-smoke",
                "note": "Golden demo path verifies intervention lifecycle.",
            },
        )
        assert intervention.status_code == 200
        assert intervention.json()["status"] == "approved"

        forecast = client.post(
            "/v1/forecast/spend",
            json={
                "monthly_spend_usd": [412000, 489000, 567000, 634000],
                "horizon_months": 3,
            },
        )
        assert forecast.status_code == 200
        assert len(forecast.json()["points"]) == 3

        failure = client.get("/v1/attribution/missing-golden-demo-workload")
        assert failure.status_code == 404
        failure_payload: dict[str, Any] = failure.json()
        assert failure_payload["detail"] == "Workload not found in attribution index"
        assert failure_payload["error"]["operator_guidance"]
        assert failure_payload["error"]["correlation_id"]
        assert failure_payload["error"]["status_code"] == 404
        assert "Traceback" not in failure.text
