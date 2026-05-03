from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING

import httpx
from fastapi.testclient import TestClient

import aci.integrations.notifications as notifications_module
from aci.api.app import app, get_state
from aci.integrations.notifications import NotificationHub, NotificationMessage
from aci.pricing.catalog import PricingUsage

if TYPE_CHECKING:
    import pytest


def test_pricing_catalog_estimate_with_cached_tokens() -> None:
    app_state = get_state()
    estimate = app_state.pricing.estimate(
        PricingUsage(
            provider="google",
            model="gemini-2.0-flash",
            input_tokens=3000,
            output_tokens=800,
            cache_read_input_tokens=1200,
            request_count=10,
        )
    )
    assert estimate.total_cost_usd > 0
    assert estimate.cached_input_cost_usd > 0
    assert estimate.input_cost_usd > estimate.cached_input_cost_usd


def test_finops_synthetic_reconcile_and_drift_endpoints() -> None:
    app_state = get_state()
    app_state.reconciliation.clear()
    with TestClient(app) as client:
        synthetic = client.post(
            "/v1/finops/synthetic",
            json={
                "request_id": "finops-req-1",
                "service_name": "analytics-batch",
                "provider": "openai",
                "model": "gpt-4o-mini",
                "input_tokens": 2400,
                "output_tokens": 900,
            },
        )
        assert synthetic.status_code == 200
        synthetic_payload = synthetic.json()
        assert synthetic_payload["request_id"] == "finops-req-1"
        assert synthetic_payload["synthetic_cost_usd"] > 0
        assert synthetic_payload["reconciled"] is False

        reconciled = client.post(
            "/v1/finops/reconcile",
            json={
                "request_id": "finops-req-1",
                "reconciled_cost_usd": synthetic_payload["synthetic_cost_usd"] * 0.92,
                "source": "aws_cur",
            },
        )
        assert reconciled.status_code == 200
        reconciled_payload = reconciled.json()
        assert reconciled_payload["drift_usd"] != 0
        assert reconciled_payload["source"] == "aws_cur"

        drift = client.get("/v1/finops/drift?group_by=provider")
        assert drift.status_code == 200
        rows = drift.json()
        assert rows
        assert rows[0]["group"] == "openai"
        assert rows[0]["reconciled_records"] >= 1
        assert rows[0]["window"] == "daily"
        assert rows[0]["threshold_pct"] == 3.0
        assert rows[0]["dashboard_annotation"] in {"reconciled", "unreconciled"}


def test_pricing_catalog_list_and_mutation_include_provenance() -> None:
    with TestClient(app) as client:
        listing = client.get("/v1/pricing/catalog?provider=openai&model=gpt-4o")
        assert listing.status_code == 200
        rows = listing.json()
        assert rows
        assert rows[0]["source"] == "seeded-defaults"
        assert rows[0]["provenance_ref"] == "provider-benchmark-2026-01"

        created = client.post(
            "/v1/pricing/catalog",
            json={
                "provider": "openai",
                "model": "gpt-4.1-mini",
                "effective_from": "2026-03-01T00:00:00Z",
                "input_usd_per_1k_tokens": 0.0012,
                "output_usd_per_1k_tokens": 0.0048,
                "cached_input_usd_per_1k_tokens": 0.0002,
                "request_base_usd": 0.0,
                "source": "provider-bulletin",
                "provenance_ref": "openai-price-sheet-2026-03",
                "updated_by": "finops-api",
            },
        )
        assert created.status_code == 200
        payload = created.json()
        assert payload["source"] == "provider-bulletin"
        assert payload["provenance_ref"] == "openai-price-sheet-2026-03"
        assert payload["updated_by"] == "finops-api"


def test_spend_forecast_endpoint() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/v1/forecast/spend",
            json={
                "monthly_spend_usd": [412000, 489000, 567000, 634000, 718000, 791000, 847000],
                "horizon_months": 3,
            },
        )
        assert response.status_code == 200
        payload = response.json()
        assert payload["trend_pct"] > 0
        assert len(payload["points"]) == 3
        assert payload["points"][0]["predicted_spend_usd"] > 0


def test_intervention_cost_simulation_endpoint() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/v1/interventions/cost-simulate",
            json={
                "service_id": "svc-copilot",
                "provider": "openai",
                "current_model": "gpt-4o",
                "avg_input_tokens": 1200,
                "avg_output_tokens": 400,
                "requests_per_day": 50000,
                "candidate_models": ["gpt-4o-mini"],
            },
        )
        assert response.status_code == 200
        payload = response.json()
        assert payload["projected_monthly_cost_usd"] > 0
        assert payload["candidates"]
        assert payload["candidates"][0]["model"] == "gpt-4o-mini"
        assert payload["candidates"][0]["monthly_savings_usd"] > 0


def test_notifications_endpoints_simulated_delivery() -> None:
    app_state = get_state()
    app_state.notification_hub.clear()
    with TestClient(app) as client:
        send = client.post(
            "/v1/integrations/notify",
            json={
                "event_type": "policy_violation",
                "title": "Budget ceiling exceeded",
                "detail": "Team Product exceeded staging threshold",
                "severity": "warning",
                "channels": ["slack", "email", "webhook"],
                "email_to": ["finops@example.com"],
            },
        )
        assert send.status_code == 200
        deliveries = send.json()
        assert len(deliveries) == 3
        assert all(item["status"] in {"simulated", "failed"} for item in deliveries)

        listed = client.get("/v1/integrations/deliveries?limit=10")
        assert listed.status_code == 200
        listed_payload = listed.json()
        assert len(listed_payload) >= 3
        assert listed_payload[-1]["route_id"] == ""


def test_notifications_endpoint_records_missing_channel_failure() -> None:
    app_state = get_state()
    app_state.notification_hub.clear()

    with TestClient(app) as client:
        response = client.post(
            "/v1/integrations/notify",
            json={
                "event_type": "policy_violation",
                "title": "Budget ceiling exceeded",
                "detail": "Team Product exceeded staging threshold",
                "severity": "warning",
                "channels": [],
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload == [
        {
            "delivery_id": payload[0]["delivery_id"],
            "channel": "unknown",
            "target": "notification://missing-channel",
            "status": "failed",
            "message": "at least one notification channel is required",
            "sent_at": payload[0]["sent_at"],
            "event_type": "policy_violation",
            "severity": "warning",
            "route_id": "",
            "route_name": "",
            "workflow_name": "",
            "audience": "",
            "business_outcome": "",
            "scenario_id": "",
        }
    ]


def test_notifications_endpoint_records_unsupported_channel_failure() -> None:
    app_state = get_state()
    app_state.notification_hub.clear()

    with TestClient(app) as client:
        response = client.post(
            "/v1/integrations/notify",
            json={
                "event_type": "policy_violation",
                "title": "Budget ceiling exceeded",
                "detail": "Team Product exceeded staging threshold",
                "severity": "warning",
                "channels": ["pagerduty"],
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 1
    assert payload[0]["channel"] == "pagerduty"
    assert payload[0]["target"] == "notification://unsupported/pagerduty"
    assert payload[0]["status"] == "failed"
    assert payload[0]["message"] == "unsupported notification channel 'pagerduty'"


def test_notifications_endpoint_simulates_ticketing_channels() -> None:
    app_state = get_state()
    app_state.notification_hub.clear()

    with TestClient(app) as client:
        response = client.post(
            "/v1/integrations/notify",
            json={
                "event_type": "ownership_dispute",
                "title": "Manual mapping review required",
                "detail": "Shared service account needs owner confirmation.",
                "severity": "warning",
                "channels": ["jira", "servicenow"],
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert {item["channel"] for item in payload} == {"jira", "servicenow"}
    assert all(item["status"] == "simulated" for item in payload)
    assert any(item["target"] == "jira://simulated" for item in payload)
    assert any(item["target"] == "servicenow://simulated" for item in payload)


class _FakeAsyncHTTPClient:
    def __init__(self) -> None:
        self.calls: list[tuple[str, dict[str, object]]] = []

    async def post(
        self,
        url: str,
        *,
        json: dict[str, object],
        headers: dict[str, str],
        timeout: float,
        follow_redirects: bool,
    ) -> httpx.Response:
        self.calls.append(
            (
                url,
                {
                    "json": json,
                    "headers": headers,
                    "timeout": timeout,
                    "follow_redirects": follow_redirects,
                },
            )
        )
        return httpx.Response(status_code=204)

    async def aclose(self) -> None:
        return None


def test_notifications_endpoints_support_live_async_delivery() -> None:
    app_state = get_state()
    original_hub = app_state.notification_hub
    fake_client = _FakeAsyncHTTPClient()
    app_state.notification_hub = NotificationHub(
        live_network=True,
        webhook_allowlist=["hooks.slack.com", "notify.example.com"],
        http_client=fake_client,
    )

    try:
        with TestClient(app) as client:
            send = client.post(
                "/v1/integrations/notify",
                json={
                    "event_type": "intervention_approved",
                    "title": "Route change approved",
                    "detail": "Product approved the gpt-4o-mini migration.",
                    "severity": "info",
                    "channels": ["slack", "webhook"],
                    "slack_webhook_url": "https://hooks.slack.com/services/T000/B000/SECRET",
                    "webhook_url": "https://notify.example.com/aci",
                },
            )
            assert send.status_code == 200
            deliveries = send.json()
            assert len(deliveries) == 2
            assert all(item["status"] == "sent" for item in deliveries)
            assert all("SECRET" not in item["target"] for item in deliveries)
            assert any(
                item["target"] == "https://hooks.slack.com/redacted"
                for item in deliveries
            )
            assert len(fake_client.calls) == 2
            assert any(
                call[0] == "https://hooks.slack.com/services/T000/B000/SECRET"
                for call in fake_client.calls
            )
    finally:
        asyncio.run(app_state.notification_hub.aclose())
        app_state.notification_hub = original_hub


def test_notifications_endpoint_redacts_simulated_webhook_targets() -> None:
    app_state = get_state()
    app_state.notification_hub.clear()

    with TestClient(app) as client:
        response = client.post(
            "/v1/integrations/notify",
            json={
                "event_type": "safety_check",
                "title": "Safety check",
                "detail": "Simulated delivery must not retain pasted webhook secrets.",
                "severity": "info",
                "channels": ["slack", "webhook"],
                "slack_webhook_url": "https://hooks.slack.com/services/T000/B000/SECRET",
                "webhook_url": "https://notify.example.com/aci/customer-secret",
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert {item["channel"] for item in payload} == {"slack", "webhook"}
    assert all(item["status"] == "simulated" for item in payload)
    assert all("SECRET" not in item["target"] for item in payload)
    assert all("customer-secret" not in item["target"] for item in payload)
    assert {
        "https://hooks.slack.com/redacted",
        "https://notify.example.com/redacted",
    } == {item["target"] for item in payload}


def test_notification_hub_simulated_delivery_does_not_load_httpx(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    def blocked_load_httpx(_feature: str) -> object:
        raise AssertionError("simulated local demo delivery must not load httpx")

    monkeypatch.setattr(notifications_module, "load_httpx", blocked_load_httpx)
    hub = NotificationHub(live_network=False)

    deliveries = asyncio.run(
        hub.send(
            message=NotificationMessage(
                event_type="local_demo",
                title="Local demo",
                detail="Simulated deliveries should stay dependency-light.",
            ),
            channels=["slack", "webhook"],
            slack_webhook_url="https://hooks.slack.com/services/T000/B000/SECRET",
            webhook_url="https://notify.example.com/aci/customer-secret",
        )
    )

    assert len(deliveries) == 2
    assert all(delivery.status == "simulated" for delivery in deliveries)
    assert {delivery.target for delivery in deliveries} == {
        "https://hooks.slack.com/redacted",
        "https://notify.example.com/redacted",
    }


def test_integrations_overview_and_scenario_dispatch_endpoints() -> None:
    app_state = get_state()
    app_state.notification_hub.clear()

    with TestClient(app) as client:
        dispatch = client.post("/v1/integrations/scenarios/policy-breach/dispatch")
        assert dispatch.status_code == 200
        dispatch_payload = dispatch.json()
        assert dispatch_payload["scenario_id"] == "policy-breach"
        assert dispatch_payload["route_id"] == "policy-breach-escalation"
        assert dispatch_payload["deliveries"]
        assert all(
            item["route_name"] == "Policy Breach Escalation"
            for item in dispatch_payload["deliveries"]
        )

        overview = client.get("/v1/integrations/overview?limit=10")
        assert overview.status_code == 200
        payload = overview.json()
        assert payload["summary"]["inbound_source_count"] >= 9
        assert payload["summary"]["outbound_route_count"] >= 8
        assert payload["summary"]["scenario_count"] >= 8
        assert payload["summary"]["recent_delivery_count"] >= 1
        assert any(item["integration_id"] == "azure-openai" for item in payload["sources"])
        assert any(item["integration_id"] == "servicenow" for item in payload["sources"])
        assert any(item["integration_id"] == "github-sdlc" for item in payload["sources"])
        assert any(item["route_id"] == "executive-adoption-digest" for item in payload["routes"])
        assert any(item["route_id"] == "manual-mapping-review" for item in payload["routes"])
        assert any(item["scenario_id"] == "pricing-drift" for item in payload["scenarios"])
        assert any(
            item["scenario_id"] == "manual-mapping-dispute" for item in payload["scenarios"]
        )
        assert any(
            item["route_id"] == "policy-breach-escalation"
            for item in payload["recent_deliveries"]
        )


def test_integrations_list_limits_are_bounded_and_contractual() -> None:
    app_state = get_state()
    app_state.notification_hub.clear()

    with TestClient(app) as client:
        first_dispatch = client.post("/v1/integrations/scenarios/policy-breach/dispatch")
        second_dispatch = client.post(
            "/v1/integrations/scenarios/manual-mapping-dispute/dispatch"
        )
        assert first_dispatch.status_code == 200
        assert second_dispatch.status_code == 200

        limited_deliveries = client.get("/v1/integrations/deliveries?limit=1")
        assert limited_deliveries.status_code == 200
        limited_payload = limited_deliveries.json()
        assert len(limited_payload) == 1
        assert {
            "delivery_id",
            "channel",
            "target",
            "status",
            "message",
            "sent_at",
            "event_type",
            "severity",
            "route_id",
            "route_name",
            "workflow_name",
            "audience",
            "business_outcome",
            "scenario_id",
        } <= limited_payload[0].keys()

        empty_page = client.get("/v1/integrations/deliveries?limit=0")
        assert empty_page.status_code == 200
        assert empty_page.json() == []

        limited_overview = client.get("/v1/integrations/overview?limit=1")
        assert limited_overview.status_code == 200
        overview_payload = limited_overview.json()
        assert len(overview_payload["recent_deliveries"]) == 1
        assert overview_payload["summary"]["recent_delivery_count"] > 1
        assert overview_payload["summary"]["inbound_source_count"] >= 9
        assert overview_payload["summary"]["outbound_route_count"] >= 8
        assert overview_payload["summary"]["scenario_count"] >= 8

        too_many_deliveries = client.get("/v1/integrations/deliveries?limit=101")
        too_many_overview = client.get("/v1/integrations/overview?limit=101")
        assert too_many_deliveries.status_code == 422
        assert too_many_overview.status_code == 422


def test_integrations_dispatch_ticketing_scenarios_are_simulated_handoffs() -> None:
    app_state = get_state()
    app_state.notification_hub.clear()

    with TestClient(app) as client:
        dispatch = client.post("/v1/integrations/scenarios/manual-mapping-dispute/dispatch")

    assert dispatch.status_code == 200
    payload = dispatch.json()
    assert payload["scenario_id"] == "manual-mapping-dispute"
    assert payload["route_id"] == "manual-mapping-review"
    assert {item["channel"] for item in payload["deliveries"]} == {"email", "jira"}
    assert any(
        item["target"] == "jira://finops-attribution"
        and item["status"] == "simulated"
        for item in payload["deliveries"]
    )


def test_integrations_dispatch_unknown_scenario_returns_not_found() -> None:
    with TestClient(app) as client:
        response = client.post("/v1/integrations/scenarios/does-not-exist/dispatch")
        assert response.status_code == 404
