from __future__ import annotations

from datetime import UTC, datetime, timedelta

from aci.adoption.analytics import AdoptionAnalytics
from aci.models.events import DomainEvent, EventType


def test_adoption_dashboard_rolls_up_org_bu_and_team_metrics() -> None:
    analytics = AdoptionAnalytics(retention_days=120)
    today = datetime.now(UTC).date()
    analytics.record_daily_usage(
        day=today,
        employee_id="alex.rivera",
        email="alex.rivera@novatech.example",
        employee_name="Alex Rivera",
        title="Engineering Manager",
        team_id="team-platform-engineering",
        team_name="Platform Engineering",
        business_unit_id="bu-product-platform",
        business_unit_name="Product and Platform",
        organization_id="org-novatech",
        organization_name="NovaTech Industries",
        requests=18,
        spend_usd=72.0,
        governed_requests=16,
        intervention_requests=2,
        model_counts={"Google / gemini-2.0-flash": 18},
        entry_point_counts={"developer-copilot": 18},
    )
    analytics.record_daily_usage(
        day=today - timedelta(days=14),
        employee_id="maya.ford",
        email="maya.ford@novatech.example",
        employee_name="Maya Ford",
        title="Customer Success Manager",
        team_id="team-customer-engineering",
        team_name="Customer Engineering",
        business_unit_id="bu-customer-operations",
        business_unit_name="Customer Operations",
        organization_id="org-novatech",
        organization_name="NovaTech Industries",
        requests=9,
        spend_usd=21.5,
        governed_requests=9,
        intervention_requests=0,
        model_counts={"OpenAI / gpt-4o-mini": 9},
        entry_point_counts={"support-copilot": 9},
    )

    hierarchy = analytics.hierarchy()
    assert hierarchy.organization.organization_id == "org-novatech"
    assert len(hierarchy.organization.business_units) == 2

    dashboard = analytics.dashboard(scope_type="organization", scope_id="org-novatech")
    assert dashboard.summary.active_employees_30d == 2
    assert dashboard.summary.requests_30d == 27
    assert dashboard.child_scopes[0].scope_type == "business_unit"
    assert dashboard.top_employees[0].employee_id == "alex.rivera"

    bu_dashboard = analytics.dashboard(
        scope_type="business_unit",
        scope_id="bu-product-platform",
    )
    assert bu_dashboard.summary.active_employees_30d == 1
    assert bu_dashboard.child_scopes[0].scope_id == "team-platform-engineering"


def test_adoption_service_consumes_org_and_inference_events() -> None:
    analytics = AdoptionAnalytics(retention_days=120)
    timestamp = datetime.now(UTC)

    analytics.handle_org_change(
        DomainEvent(
            event_type=EventType.ORG_CHANGE,
            subject_id="person:samira.khan",
            attributes={
                "person_id": "samira.khan",
                "person_name": "Samira Khan",
                "user_email": "samira.khan@novatech.example",
                "employee_title": "Finance Director",
                "new_team": "team-finance-systems",
                "new_team_name": "Finance Systems",
                "business_unit_id": "bu-finance-and-ops",
                "business_unit_name": "Finance and Operations",
                "organization_id": "org-novatech",
                "organization_name": "NovaTech Industries",
            },
            event_time=timestamp,
            source="unit-test",
            idempotency_key="org-samira-khan",
            tenant_id="tenant-a",
        )
    )
    analytics.handle_inference_request(
        DomainEvent(
            event_type=EventType.INFERENCE_REQUEST,
            subject_id="req-samira-1",
            attributes={
                "model": "gpt-4o-mini",
                "provider": "openai",
                "request_id": "req-samira-1",
                "person_id": "samira.khan",
                "person_name": "Samira Khan",
                "user_email": "samira.khan@novatech.example",
                "employee_title": "Finance Director",
                "team_id": "team-finance-systems",
                "team_name": "Finance Systems",
                "business_unit_id": "bu-finance-and-ops",
                "business_unit_name": "Finance and Operations",
                "organization_id": "org-novatech",
                "organization_name": "NovaTech Industries",
                "entry_point": "finance-ops-assistant",
                "cost_usd": 4.2,
                "input_tokens": 1200,
                "output_tokens": 400,
                "governed": True,
                "intervention_applied": True,
            },
            event_time=timestamp,
            source="unit-test",
            idempotency_key="req-samira-1",
            tenant_id="tenant-a",
        )
    )

    dashboard = analytics.dashboard(scope_type="team", scope_id="team-finance-systems")
    assert dashboard.summary.active_employees_30d == 1
    assert dashboard.summary.governed_usage_pct == 100.0
    assert dashboard.summary.intervention_rate_pct == 100.0
    assert dashboard.entry_point_mix[0].label == "finance-ops-assistant"


def test_adoption_dashboard_defaults_to_first_available_scope() -> None:
    analytics = AdoptionAnalytics(retention_days=120)
    analytics.upsert_employee(
        employee_id="riley.quinn",
        name="Riley Quinn",
        email="riley.quinn@novatech.example",
        title="Operations Analyst",
        team_id="team-operations",
        team_name="Operations",
        business_unit_id="bu-finance-and-ops",
        business_unit_name="Finance and Operations",
        organization_id="org-novatech",
        organization_name="NovaTech Industries",
    )

    dashboard = analytics.dashboard(scope_type="business_unit")
    assert dashboard.scope_id == "bu-finance-and-ops"
    assert dashboard.scope_label == "Finance and Operations"
