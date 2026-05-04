"""DEMO_ONLY_FIXTURE deterministic bootstrap for local walkthroughs.

This module seeds synthetic employees, workloads, events, integrations, and
demo personas. It is intentionally imported only by the dedicated demo runtime
path and non-production `/v1/demo/*` controls; production bootstrap and tenant
onboarding must use real ingestion, identity, and persistence paths instead.
"""

from __future__ import annotations

import calendar
from collections import Counter
from dataclasses import dataclass
from datetime import UTC, date, datetime, timedelta
from typing import TYPE_CHECKING

from aci.models.attribution import AttributionIndexEntry
from aci.models.events import DomainEvent, EventType
from aci.models.graph import EdgeType, GraphEdge, GraphNode, NodeType

if TYPE_CHECKING:
    from aci.api.runtime import AppState


DEMO_REFERENCE_TIME = datetime(2026, 2, 28, 17, 0, tzinfo=UTC)
DEMO_REFERENCE_DAY = DEMO_REFERENCE_TIME.date()
DEMO_SCENARIO_IDS = (
    "policy-breach",
    "intervention-approved",
    "pricing-drift",
    "executive-digest",
    "manual-mapping-dispute",
    "security-exception",
    "service-owner-scorecard",
    "energy-review",
)
DEMO_USER_ACCOUNTS = (
    {
        "name": "Maya Patel",
        "email": "maya.patel@novatech.example",
        "role": "Admin",
        "status": "Active",
    },
    {
        "name": "Ethan Chen",
        "email": "ethan.chen@novatech.example",
        "role": "FinOps",
        "status": "Active",
    },
    {
        "name": "Rina Alvarez",
        "email": "rina.alvarez@novatech.example",
        "role": "Engineer",
        "status": "Active",
    },
    {
        "name": "Devon Ross",
        "email": "devon.ross@novatech.example",
        "role": "Platform Engineering Viewer",
        "status": "Active",
    },
    {
        "name": "Priya Shah",
        "email": "priya.shah@novatech.example",
        "role": "Security Reviewer",
        "status": "Active",
    },
    {
        "name": "Samira Okafor",
        "email": "samira.okafor@novatech.example",
        "role": "Manager",
        "status": "Active",
    },
    {
        "name": "Noah Kim",
        "email": "noah.kim@novatech.example",
        "role": "User",
        "status": "Active",
    },
    {
        "name": "Priya Nair",
        "email": "priya.nair@novatech.example",
        "role": "Auditor",
        "status": "Active",
    },
    {
        "name": "Former Ops User",
        "email": "former.ops@novatech.example",
        "role": "Engineer",
        "status": "Deactivated",
    },
)


@dataclass(frozen=True)
class DemoBootstrapResult:
    seeded_entries: int
    workloads: list[str]
    events_published: int
    graph_nodes: int
    graph_edges: int
    reference_time: str
    scenario_ids: list[str]
    demo_accounts: list[dict[str, str]]


@dataclass(frozen=True)
class DemoAdoptionCohort:
    team_id: str
    team_name: str
    business_unit_id: str
    business_unit_name: str
    eligible_count: int
    active_count: int
    title: str
    entry_point: str
    model: str
    cost_per_request: float
    governed_pct: float
    intervention_pct: float


def demo_seed_entries() -> list[AttributionIndexEntry]:
    """Stable index entries used by the API demo and investor walkthroughs."""
    return [
        AttributionIndexEntry(
            workload_id="customer-support-bot",
            team_id="team-cs-platform",
            team_name="Customer Support Platform",
            cost_center_id="CC-1200",
            confidence=0.96,
            confidence_tier="chargeback_ready",
            method_used="R1",
            budget_remaining_usd=1850.0,
            budget_limit_usd=5000.0,
            model_allowlist=["gpt-4o-mini", "gemini-1.5-flash", "gpt-4o"],
            approved_alternatives=["gpt-4o-mini", "gemini-1.5-flash"],
            token_budget_output=800,
            token_budget_input=2400,
            cost_ceiling_per_request_usd=0.025,
        ),
        AttributionIndexEntry(
            workload_id="analytics-batch",
            team_id="team-data-science",
            team_name="Data Science",
            cost_center_id="CC-5100",
            confidence=0.93,
            confidence_tier="chargeback_ready",
            method_used="R2",
            budget_remaining_usd=620.0,
            budget_limit_usd=10000.0,
            model_allowlist=["gpt-4o", "gpt-4o-mini"],
            token_budget_output=1200,
            token_budget_input=3000,
            cost_ceiling_per_request_usd=0.008,
        ),
        AttributionIndexEntry(
            workload_id="code-intel-prod",
            team_id="team-platform-engineering",
            team_name="Platform Engineering",
            cost_center_id="CC-3100",
            confidence=0.95,
            confidence_tier="chargeback_ready",
            method_used="R1",
            budget_remaining_usd=2250.0,
            budget_limit_usd=7000.0,
            model_allowlist=["gemini-2.0-flash", "gemini-1.5-flash"],
            approved_alternatives=["gemini-1.5-flash"],
            token_budget_output=1500,
            token_budget_input=3500,
            cost_ceiling_per_request_usd=0.03,
        ),
        AttributionIndexEntry(
            workload_id="support-bot-staging",
            team_id="team-customer-engineering",
            team_name="Customer Engineering",
            cost_center_id="CC-CUST-ENG",
            cost_center_name="Customer Engineering",
            confidence=0.72,
            confidence_tier="provisional",
            method_used="R5",
            budget_remaining_usd=4100.0,
            budget_limit_usd=90000.0,
            model_allowlist=["gpt-4o-mini", "gpt-4o"],
            token_budget_output=900,
            token_budget_input=2500,
            cost_ceiling_per_request_usd=0.02,
        ),
        AttributionIndexEntry(
            workload_id="ml-evals-sandbox",
            team_id="team-research",
            team_name="Research",
            cost_center_id="CC-RESEARCH",
            cost_center_name="Research",
            confidence=0.68,
            confidence_tier="provisional",
            method_used="R6",
            budget_remaining_usd=3700.0,
            budget_limit_usd=60000.0,
            model_allowlist=["gpt-4o-mini", "claude-3.5-sonnet", "gemini-1.5-flash"],
            token_budget_output=1600,
            token_budget_input=4500,
            cost_ceiling_per_request_usd=0.04,
        ),
        AttributionIndexEntry(
            workload_id="product-roadmap-agent-prod",
            team_id="team-product",
            team_name="Product",
            cost_center_id="CC-PRODUCT",
            cost_center_name="Product",
            confidence=0.84,
            confidence_tier="chargeback_ready",
            method_used="R3",
            budget_remaining_usd=15800.0,
            budget_limit_usd=150000.0,
            model_allowlist=["gpt-4o-mini", "gpt-4o"],
            token_budget_output=1200,
            token_budget_input=4000,
            cost_ceiling_per_request_usd=0.025,
        ),
        AttributionIndexEntry(
            workload_id="shadow-ai-provider-card",
            team_id="team-unknown",
            team_name="UNKNOWN",
            cost_center_id="CC-UNKNOWN",
            cost_center_name="Unknown",
            confidence=0.37,
            confidence_tier="unresolved",
            method_used="R6",
            budget_remaining_usd=0.0,
            budget_limit_usd=0.0,
            model_allowlist=[],
            token_budget_output=500,
            token_budget_input=1500,
            cost_ceiling_per_request_usd=0.01,
        ),
        AttributionIndexEntry(
            workload_id="campaign-copilot-seat-activity",
            team_id="team-marketing",
            team_name="Marketing",
            cost_center_id="CC-MARKETING",
            cost_center_name="Marketing",
            confidence=0.69,
            confidence_tier="provisional",
            method_used="R5",
            budget_remaining_usd=9400.0,
            budget_limit_usd=45000.0,
            model_allowlist=["gpt-4o-mini"],
            token_budget_output=700,
            token_budget_input=1800,
            cost_ceiling_per_request_usd=0.012,
        ),
        AttributionIndexEntry(
            workload_id="analytics-batch-nightly",
            team_id="team-data-science",
            team_name="Data Science",
            cost_center_id="CC-5100",
            cost_center_name="Data Science",
            confidence=0.86,
            confidence_tier="chargeback_ready",
            method_used="R2",
            budget_remaining_usd=7200.0,
            budget_limit_usd=120000.0,
            model_allowlist=["gpt-4o-mini", "gemini-1.5-flash"],
            token_budget_output=1200,
            token_budget_input=3000,
            cost_ceiling_per_request_usd=0.008,
        ),
    ]


def _demo_accounts() -> list[dict[str, str]]:
    return [dict(account) for account in DEMO_USER_ACCOUNTS]


async def bootstrap_demo_state(
    app_state: AppState,
    *,
    reset_existing: bool = True,
) -> DemoBootstrapResult:
    """Seed deterministic graph and index state for demo/profile runs."""
    existing_size = app_state.index_store.size
    if not reset_existing and existing_size > 0 and app_state.adoption.employee_count > 0:
        graph_stats = (
            app_state.graph.get_stats()
            if app_state.graph is not None
            else {
                "total_nodes": 0,
                "total_edges": 0,
            }
        )
        current_workloads = [entry.workload_id for entry in demo_seed_entries()]
        return DemoBootstrapResult(
            seeded_entries=existing_size,
            workloads=current_workloads,
            events_published=0,
            graph_nodes=graph_stats["total_nodes"],
            graph_edges=graph_stats["total_edges"],
            reference_time=DEMO_REFERENCE_TIME.isoformat(),
            scenario_ids=list(DEMO_SCENARIO_IDS),
            demo_accounts=_demo_accounts(),
        )

    if reset_existing:
        app_state.index_store.clear()
        app_state.adoption.clear()
        app_state.notification_hub.clear()
        app_state.reconciliation.clear()
        app_state.pricing.reset_to_default_rules()
        app_state.intervention_registry.reset_to_seed_data()
        reset_metrics = getattr(app_state.interceptor, "reset_metrics", None)
        if callable(reset_metrics):
            reset_metrics()
        clear_event_bus = getattr(app_state.event_bus, "clear", None)
        if callable(clear_event_bus):
            clear_event_bus()
        if app_state.graph is not None:
            app_state.graph.clear()

    if app_state.graph is not None:
        _seed_graph(app_state)
    app_state.adoption.set_reference_time(DEMO_REFERENCE_TIME)
    _seed_adoption(app_state)

    events_published = 0
    if app_state.accepts_ingestion and app_state.config.event_bus_backend.lower() == "memory":
        result = await app_state.event_bus.publish_batch(
            _demo_events(app_state),
            dispatch=False,
        )
        events_published = result["published"]

    entries = demo_seed_entries()
    for entry in entries:
        app_state.index_store.materialize(entry, materialized_at=DEMO_REFERENCE_TIME)

    if reset_existing or not app_state.notification_hub.list_deliveries(limit=1):
        await _seed_integrations(app_state)

    graph_stats = (
        app_state.graph.get_stats()
        if app_state.graph is not None
        else {
            "total_nodes": 0,
            "total_edges": 0,
        }
    )
    return DemoBootstrapResult(
        seeded_entries=len(entries),
        workloads=[entry.workload_id for entry in entries],
        events_published=events_published,
        graph_nodes=graph_stats["total_nodes"],
        graph_edges=graph_stats["total_edges"],
        reference_time=DEMO_REFERENCE_TIME.isoformat(),
        scenario_ids=list(DEMO_SCENARIO_IDS),
        demo_accounts=_demo_accounts(),
    )


async def _seed_integrations(app_state: AppState) -> None:
    for index, scenario_id in enumerate(DEMO_SCENARIO_IDS):
        try:
            await app_state.notification_hub.dispatch_scenario(
                scenario_id,
                sent_at=DEMO_REFERENCE_TIME + timedelta(minutes=index),
            )
        except KeyError:
            continue


def _seed_graph(app_state: AppState) -> None:
    if app_state.graph is None:
        return

    seeded_at = DEMO_REFERENCE_TIME
    nodes = [
        GraphNode(
            node_id="team:team-cs-platform",
            node_type=NodeType.TEAM,
            label="Customer Support Platform",
        ),
        GraphNode(
            node_id="team:team-data-science",
            node_type=NodeType.TEAM,
            label="Data Science",
        ),
        GraphNode(
            node_id="team:team-platform-engineering",
            node_type=NodeType.TEAM,
            label="Platform Engineering",
        ),
        GraphNode(
            node_id="budget:CC-1200",
            node_type=NodeType.BUDGET,
            label="CC-1200",
        ),
        GraphNode(
            node_id="budget:CC-5100",
            node_type=NodeType.BUDGET,
            label="CC-5100",
        ),
        GraphNode(
            node_id="budget:CC-3100",
            node_type=NodeType.BUDGET,
            label="CC-3100",
        ),
        GraphNode(
            node_id="resource:customer-support-bot",
            node_type=NodeType.INFERENCE_ENDPOINT,
            label="customer-support-bot",
        ),
        GraphNode(
            node_id="resource:analytics-batch",
            node_type=NodeType.INFERENCE_ENDPOINT,
            label="analytics-batch",
        ),
        GraphNode(
            node_id="resource:code-intel-prod",
            node_type=NodeType.INFERENCE_ENDPOINT,
            label="code-intel-prod",
        ),
        GraphNode(
            node_id="repo:customer-support-platform",
            node_type=NodeType.REPOSITORY,
            label="customer-support-platform",
        ),
        GraphNode(
            node_id="repo:analytics-batch",
            node_type=NodeType.REPOSITORY,
            label="analytics-batch",
        ),
        GraphNode(
            node_id="repo:code-intelligence",
            node_type=NodeType.REPOSITORY,
            label="code-intelligence",
        ),
        GraphNode(
            node_id="person:alice.ng",
            node_type=NodeType.PERSON,
            label="alice.ng",
        ),
    ]
    for node in nodes:
        app_state.graph.upsert_node(node)

    edges = [
        GraphEdge.deterministic(
            edge_type=EdgeType.ATTRIBUTED_TO,
            from_id="resource:customer-support-bot",
            to_id="team:team-cs-platform",
            valid_from=seeded_at,
            source="demo",
        ),
        GraphEdge.deterministic(
            edge_type=EdgeType.ATTRIBUTED_TO,
            from_id="resource:analytics-batch",
            to_id="team:team-data-science",
            valid_from=seeded_at,
            source="demo",
        ),
        GraphEdge.deterministic(
            edge_type=EdgeType.ATTRIBUTED_TO,
            from_id="resource:code-intel-prod",
            to_id="team:team-platform-engineering",
            valid_from=seeded_at,
            source="demo",
        ),
        GraphEdge.deterministic(
            edge_type=EdgeType.OWNS_CODE,
            from_id="team:team-cs-platform",
            to_id="repo:customer-support-platform",
            valid_from=seeded_at,
            source="demo",
        ),
        GraphEdge.deterministic(
            edge_type=EdgeType.OWNS_CODE,
            from_id="team:team-data-science",
            to_id="repo:analytics-batch",
            valid_from=seeded_at,
            source="demo",
        ),
        GraphEdge.deterministic(
            edge_type=EdgeType.OWNS_CODE,
            from_id="team:team-platform-engineering",
            to_id="repo:code-intelligence",
            valid_from=seeded_at,
            source="demo",
        ),
        GraphEdge.deterministic(
            edge_type=EdgeType.BUDGETED_UNDER,
            from_id="team:team-cs-platform",
            to_id="budget:CC-1200",
            valid_from=seeded_at,
            source="demo",
        ),
        GraphEdge.deterministic(
            edge_type=EdgeType.BUDGETED_UNDER,
            from_id="team:team-data-science",
            to_id="budget:CC-5100",
            valid_from=seeded_at,
            source="demo",
        ),
        GraphEdge.deterministic(
            edge_type=EdgeType.BUDGETED_UNDER,
            from_id="team:team-platform-engineering",
            to_id="budget:CC-3100",
            valid_from=seeded_at,
            source="demo",
        ),
        GraphEdge.deterministic(
            edge_type=EdgeType.MEMBER_OF,
            from_id="person:alice.ng",
            to_id="team:team-platform-engineering",
            valid_from=seeded_at,
            source="demo",
        ),
    ]
    for edge in edges:
        app_state.graph.add_edge(edge)


def _demo_events(app_state: AppState) -> list[DomainEvent]:
    timestamp = DEMO_REFERENCE_TIME
    tenant_id = app_state.config.tenant_id
    return [
        DomainEvent(
            event_id="evt-demo-org-change-alice",
            event_type=EventType.ORG_CHANGE,
            subject_id="person:alice.ng",
            attributes={
                "person_id": "alice.ng",
                "person_name": "Alice Ng",
                "user_email": "alice.ng@novatech.example",
                "employee_title": "Director of Developer Productivity",
                "previous_team": "",
                "new_team": "team-platform-engineering",
                "new_team_name": "Platform Engineering",
                "business_unit_id": "bu-product-platform",
                "business_unit_name": "Product and Platform",
                "organization_id": "org-novatech",
                "organization_name": "NovaTech Industries",
                "eligible_for_ai": True,
                "effective_date": timestamp,
                "source_system": "demo-seeder",
            },
            event_time=timestamp,
            ingest_time=timestamp,
            source="demo-seeder",
            idempotency_key="demo-org-change-alice",
            tenant_id=tenant_id,
        ),
        DomainEvent(
            event_id="evt-demo-deployment-code-intel",
            event_type=EventType.DEPLOYMENT,
            subject_id="deploy:code-intel-prod",
            attributes={
                "service_name": "code-intel-prod",
                "repository": "code-intelligence",
                "commit_sha": "demo123",
                "deployer_identity": "alice.ng",
                "deploy_tool": "github-actions",
                "deploy_job_id": "deploy-code-intel-prod",
                "target_environment": "production",
                "target_resource_arn": "code-intel-prod",
                "timestamp": timestamp,
            },
            event_time=timestamp,
            ingest_time=timestamp,
            source="demo-seeder",
            idempotency_key="demo-deployment-code-intel",
            tenant_id=tenant_id,
        ),
        DomainEvent(
            event_id="evt-demo-billing-analytics-batch",
            event_type=EventType.BILLING_LINE_ITEM,
            subject_id="billing:analytics-batch",
            attributes={
                "cloud_provider": "aws",
                "account_id": "123456789012",
                "service": "bedrock",
                "resource_arn": "analytics-batch",
                "region": "us-west-2",
                "cost_usd": 183.42,
                "usage_quantity": 1.0,
                "usage_unit": "request",
                "tags": {"team": "team-data-science"},
            },
            event_time=timestamp,
            ingest_time=timestamp,
            source="demo-seeder",
            idempotency_key="demo-billing-analytics-batch",
            tenant_id=tenant_id,
        ),
        DomainEvent(
            event_id="evt-demo-inference-customer-support-bot",
            event_type=EventType.INFERENCE_REQUEST,
            subject_id="req-customer-support-bot",
            attributes={
                "model": "gpt-4o-mini",
                "provider": "openai",
                "service_name": "customer-support-bot",
                "request_id": "req-customer-support-bot",
                "person_id": "maya.ford",
                "person_name": "Maya Ford",
                "user_email": "maya.ford@novatech.example",
                "employee_title": "Customer Success Manager",
                "team_id": "team-customer-engineering",
                "team_name": "Customer Engineering",
                "business_unit_id": "bu-customer-operations",
                "business_unit_name": "Customer Operations",
                "organization_id": "org-novatech",
                "organization_name": "NovaTech Industries",
                "entry_point": "support-copilot",
                "governed": True,
                "input_tokens": 620,
                "output_tokens": 180,
                "latency_ms": 212.0,
                "cost_usd": 0.0032,
            },
            event_time=timestamp,
            ingest_time=timestamp,
            source="demo-seeder",
            idempotency_key="demo-inference-customer-support-bot",
            tenant_id=tenant_id,
        ),
        DomainEvent(
            event_id="evt-demo-inference-analytics-batch",
            event_type=EventType.INFERENCE_REQUEST,
            subject_id="req-analytics-batch",
            attributes={
                "model": "gpt-4o",
                "provider": "openai",
                "service_name": "analytics-batch",
                "request_id": "req-analytics-batch",
                "person_id": "owen.cole",
                "person_name": "Owen Cole",
                "user_email": "owen.cole@novatech.example",
                "employee_title": "Senior Data Scientist",
                "team_id": "team-data-science",
                "team_name": "Data Science",
                "business_unit_id": "bu-data-insights",
                "business_unit_name": "Data and Insights",
                "organization_id": "org-novatech",
                "organization_name": "NovaTech Industries",
                "entry_point": "analytics-studio",
                "governed": True,
                "intervention_applied": True,
                "input_tokens": 2600,
                "output_tokens": 900,
                "latency_ms": 481.0,
                "cost_usd": 0.014,
            },
            event_time=timestamp,
            ingest_time=timestamp,
            source="demo-seeder",
            idempotency_key="demo-inference-analytics-batch",
            tenant_id=tenant_id,
        ),
        DomainEvent(
            event_id="evt-demo-inference-code-intel-prod",
            event_type=EventType.INFERENCE_REQUEST,
            subject_id="req-code-intel-prod",
            attributes={
                "model": "gemini-2.0-flash",
                "provider": "google",
                "service_name": "code-intel-prod",
                "request_id": "req-code-intel-prod",
                "person_id": "alice.ng",
                "person_name": "Alice Ng",
                "user_email": "alice.ng@novatech.example",
                "employee_title": "Director of Developer Productivity",
                "team_id": "team-platform-engineering",
                "team_name": "Platform Engineering",
                "business_unit_id": "bu-product-platform",
                "business_unit_name": "Product and Platform",
                "organization_id": "org-novatech",
                "organization_name": "NovaTech Industries",
                "entry_point": "developer-copilot",
                "governed": True,
                "input_tokens": 1800,
                "output_tokens": 500,
                "latency_ms": 162.0,
                "cost_usd": 0.009,
            },
            event_time=timestamp,
            ingest_time=timestamp,
            source="demo-seeder",
            idempotency_key="demo-inference-code-intel-prod",
            tenant_id=tenant_id,
        ),
    ]


def _seed_adoption(app_state: AppState) -> None:
    employees = [
        {
            "employee_id": "alice.ng",
            "name": "Alice Ng",
            "email": "alice.ng@novatech.example",
            "title": "Director of Developer Productivity",
            "team_id": "team-platform-engineering",
            "team_name": "Platform Engineering",
            "business_unit_id": "bu-product-platform",
            "business_unit_name": "Product and Platform",
        },
        {
            "employee_id": "devon.ross",
            "name": "Devon Ross",
            "email": "devon.ross@novatech.example",
            "title": "Staff Platform Engineer",
            "team_id": "team-platform-engineering",
            "team_name": "Platform Engineering",
            "business_unit_id": "bu-product-platform",
            "business_unit_name": "Product and Platform",
        },
        {
            "employee_id": "nina.park",
            "name": "Nina Park",
            "email": "nina.park@novatech.example",
            "title": "ML Engineering Manager",
            "team_id": "team-ml-engineering",
            "team_name": "ML Engineering",
            "business_unit_id": "bu-product-platform",
            "business_unit_name": "Product and Platform",
        },
        {
            "employee_id": "owen.cole",
            "name": "Owen Cole",
            "email": "owen.cole@novatech.example",
            "title": "Senior Data Scientist",
            "team_id": "team-data-science",
            "team_name": "Data Science",
            "business_unit_id": "bu-data-insights",
            "business_unit_name": "Data and Insights",
        },
        {
            "employee_id": "kira.shah",
            "name": "Kira Shah",
            "email": "kira.shah@novatech.example",
            "title": "Principal Product Manager",
            "team_id": "team-product",
            "team_name": "Product",
            "business_unit_id": "bu-product-platform",
            "business_unit_name": "Product and Platform",
        },
        {
            "employee_id": "marco.diaz",
            "name": "Marco Diaz",
            "email": "marco.diaz@novatech.example",
            "title": "Senior Product Analyst",
            "team_id": "team-product",
            "team_name": "Product",
            "business_unit_id": "bu-product-platform",
            "business_unit_name": "Product and Platform",
        },
        {
            "employee_id": "maya.ford",
            "name": "Maya Ford",
            "email": "maya.ford@novatech.example",
            "title": "Customer Success Manager",
            "team_id": "team-customer-engineering",
            "team_name": "Customer Engineering",
            "business_unit_id": "bu-customer-operations",
            "business_unit_name": "Customer Operations",
        },
        {
            "employee_id": "soren.lee",
            "name": "Soren Lee",
            "email": "soren.lee@novatech.example",
            "title": "Support Automation Lead",
            "team_id": "team-customer-engineering",
            "team_name": "Customer Engineering",
            "business_unit_id": "bu-customer-operations",
            "business_unit_name": "Customer Operations",
        },
        {
            "employee_id": "helen.ward",
            "name": "Helen Ward",
            "email": "helen.ward@novatech.example",
            "title": "Security Operations Manager",
            "team_id": "team-security",
            "team_name": "Security",
            "business_unit_id": "bu-risk-and-trust",
            "business_unit_name": "Risk and Trust",
        },
        {
            "employee_id": "rafael.mora",
            "name": "Rafael Mora",
            "email": "rafael.mora@novatech.example",
            "title": "Threat Detection Engineer",
            "team_id": "team-security",
            "team_name": "Security",
            "business_unit_id": "bu-risk-and-trust",
            "business_unit_name": "Risk and Trust",
        },
        {
            "employee_id": "lena.price",
            "name": "Lena Price",
            "email": "lena.price@novatech.example",
            "title": "Finance Systems Director",
            "team_id": "team-finance-systems",
            "team_name": "Finance Systems",
            "business_unit_id": "bu-finance-and-ops",
            "business_unit_name": "Finance and Operations",
        },
        {
            "employee_id": "samir.bose",
            "name": "Samir Bose",
            "email": "samir.bose@novatech.example",
            "title": "Operations Program Manager",
            "team_id": "team-operations",
            "team_name": "Operations",
            "business_unit_id": "bu-finance-and-ops",
            "business_unit_name": "Finance and Operations",
        },
    ]
    reference_day = DEMO_REFERENCE_DAY
    month_multipliers = [0.72, 0.8, 0.88, 0.95, 1.02, 1.11]
    for employee in employees:
        app_state.adoption.upsert_employee(
            employee_id=employee["employee_id"],
            name=employee["name"],
            email=employee["email"],
            title=employee["title"],
            team_id=employee["team_id"],
            team_name=employee["team_name"],
            business_unit_id=employee["business_unit_id"],
            business_unit_name=employee["business_unit_name"],
            organization_id="org-novatech",
            organization_name="NovaTech Industries",
            eligible_for_ai=True,
        )

    seed_profiles: list[tuple[str, int, float, float, float, str, str]] = [
        ("alice.ng", 38, 14.2, 0.96, 0.08, "Google / gemini-2.0-flash", "developer-copilot"),
        ("devon.ross", 26, 7.4, 0.94, 0.04, "Google / gemini-2.0-flash", "developer-copilot"),
        ("nina.park", 29, 11.1, 0.92, 0.06, "OpenAI / gpt-4o", "model-eval-workbench"),
        ("owen.cole", 22, 9.6, 0.91, 0.11, "OpenAI / gpt-4o", "analytics-studio"),
        ("kira.shah", 31, 6.9, 0.89, 0.05, "OpenAI / gpt-4o-mini", "product-briefing-assistant"),
        ("marco.diaz", 18, 3.4, 0.88, 0.04, "OpenAI / gpt-4o-mini", "product-briefing-assistant"),
        ("maya.ford", 21, 4.5, 0.95, 0.03, "OpenAI / gpt-4o-mini", "support-copilot"),
        ("soren.lee", 24, 5.7, 0.96, 0.02, "Google / gemini-2.0-flash", "support-copilot"),
        ("helen.ward", 12, 4.8, 0.99, 0.12, "OpenAI / gpt-4o", "security-workbench"),
        ("rafael.mora", 17, 5.6, 0.99, 0.14, "OpenAI / gpt-4o", "security-workbench"),
        ("lena.price", 9, 2.7, 0.83, 0.01, "OpenAI / gpt-4o-mini", "finance-ops-assistant"),
        ("samir.bose", 11, 2.1, 0.79, 0.0, "OpenAI / gpt-4o-mini", "operations-briefing"),
    ]
    cohorts = (
        DemoAdoptionCohort(
            team_id="team-platform-engineering",
            team_name="Platform Engineering",
            business_unit_id="bu-product-platform",
            business_unit_name="Product and Platform",
            eligible_count=132,
            active_count=82,
            title="Platform Engineer",
            entry_point="developer-copilot",
            model="Google / gemini-2.0-flash",
            cost_per_request=3.4,
            governed_pct=0.93,
            intervention_pct=0.04,
        ),
        DemoAdoptionCohort(
            team_id="team-ml-engineering",
            team_name="ML Engineering",
            business_unit_id="bu-product-platform",
            business_unit_name="Product and Platform",
            eligible_count=104,
            active_count=64,
            title="ML Engineer",
            entry_point="model-eval-workbench",
            model="OpenAI / gpt-4o",
            cost_per_request=4.6,
            governed_pct=0.89,
            intervention_pct=0.07,
        ),
        DemoAdoptionCohort(
            team_id="team-product",
            team_name="Product",
            business_unit_id="bu-product-platform",
            business_unit_name="Product and Platform",
            eligible_count=82,
            active_count=54,
            title="Product Manager",
            entry_point="product-briefing-assistant",
            model="OpenAI / gpt-4o-mini",
            cost_per_request=1.6,
            governed_pct=0.84,
            intervention_pct=0.04,
        ),
        DemoAdoptionCohort(
            team_id="team-data-science",
            team_name="Data Science",
            business_unit_id="bu-data-insights",
            business_unit_name="Data and Insights",
            eligible_count=96,
            active_count=62,
            title="Data Scientist",
            entry_point="analytics-studio",
            model="OpenAI / gpt-4o",
            cost_per_request=4.2,
            governed_pct=0.87,
            intervention_pct=0.08,
        ),
        DemoAdoptionCohort(
            team_id="team-customer-engineering",
            team_name="Customer Engineering",
            business_unit_id="bu-customer-operations",
            business_unit_name="Customer Operations",
            eligible_count=158,
            active_count=102,
            title="Customer Engineer",
            entry_point="support-copilot",
            model="OpenAI / gpt-4o-mini",
            cost_per_request=1.3,
            governed_pct=0.91,
            intervention_pct=0.03,
        ),
        DemoAdoptionCohort(
            team_id="team-security",
            team_name="Security",
            business_unit_id="bu-risk-and-trust",
            business_unit_name="Risk and Trust",
            eligible_count=96,
            active_count=58,
            title="Security Analyst",
            entry_point="security-workbench",
            model="OpenAI / gpt-4o",
            cost_per_request=5.0,
            governed_pct=0.98,
            intervention_pct=0.1,
        ),
        DemoAdoptionCohort(
            team_id="team-finance-systems",
            team_name="Finance Systems",
            business_unit_id="bu-finance-and-ops",
            business_unit_name="Finance and Operations",
            eligible_count=84,
            active_count=42,
            title="Finance Systems Analyst",
            entry_point="finance-ops-assistant",
            model="OpenAI / gpt-4o-mini",
            cost_per_request=1.2,
            governed_pct=0.8,
            intervention_pct=0.02,
        ),
        DemoAdoptionCohort(
            team_id="team-operations",
            team_name="Operations",
            business_unit_id="bu-finance-and-ops",
            business_unit_name="Finance and Operations",
            eligible_count=60,
            active_count=22,
            title="Operations Analyst",
            entry_point="operations-briefing",
            model="OpenAI / gpt-4o-mini",
            cost_per_request=1.1,
            governed_pct=0.75,
            intervention_pct=0.01,
        ),
    )

    generated_profiles: list[tuple[str, int, float, float, float, str, str]] = []
    named_by_team = Counter(employee["team_id"] for employee in employees)
    for cohort in cohorts:
        named_count = named_by_team[cohort.team_id]
        active_to_add = max(cohort.active_count - named_count, 0)
        inactive_to_add = max(cohort.eligible_count - named_count - active_to_add, 0)
        team_slug = cohort.team_id.removeprefix("team-")

        for index in range(active_to_add):
            sequence = index + 1
            employee_id = f"{team_slug}.active.{sequence:03d}"
            employee_name = f"{cohort.team_name} User {sequence:03d}"
            employee = {
                "employee_id": employee_id,
                "name": employee_name,
                "email": f"{employee_id}@novatech.example",
                "title": cohort.title,
                "team_id": cohort.team_id,
                "team_name": cohort.team_name,
                "business_unit_id": cohort.business_unit_id,
                "business_unit_name": cohort.business_unit_name,
            }
            employees.append(employee)
            app_state.adoption.upsert_employee(
                employee_id=employee["employee_id"],
                name=employee["name"],
                email=employee["email"],
                title=employee["title"],
                team_id=employee["team_id"],
                team_name=employee["team_name"],
                business_unit_id=employee["business_unit_id"],
                business_unit_name=employee["business_unit_name"],
                organization_id="org-novatech",
                organization_name="NovaTech Industries",
                eligible_for_ai=True,
            )

            cycle = index % 20
            if cycle < 6:
                base_requests = 2 + (cycle % 2)
            elif cycle < 16:
                base_requests = 6 + (cycle % 5)
            else:
                base_requests = 24 + (cycle % 8)
            profile_cost = round(cohort.cost_per_request * (0.42 + ((index % 5) * 0.09)), 2)
            generated_profiles.append(
                (
                    employee_id,
                    base_requests,
                    profile_cost,
                    cohort.governed_pct,
                    cohort.intervention_pct,
                    cohort.model,
                    cohort.entry_point,
                )
            )

        for index in range(inactive_to_add):
            sequence = index + 1
            employee_id = f"{team_slug}.eligible.{sequence:03d}"
            employee = {
                "employee_id": employee_id,
                "name": f"{cohort.team_name} Eligible {sequence:03d}",
                "email": f"{employee_id}@novatech.example",
                "title": cohort.title,
                "team_id": cohort.team_id,
                "team_name": cohort.team_name,
                "business_unit_id": cohort.business_unit_id,
                "business_unit_name": cohort.business_unit_name,
            }
            employees.append(employee)
            app_state.adoption.upsert_employee(
                employee_id=employee["employee_id"],
                name=employee["name"],
                email=employee["email"],
                title=employee["title"],
                team_id=employee["team_id"],
                team_name=employee["team_name"],
                business_unit_id=employee["business_unit_id"],
                business_unit_name=employee["business_unit_name"],
                organization_id="org-novatech",
                organization_name="NovaTech Industries",
                eligible_for_ai=True,
            )

    seed_profiles.extend(generated_profiles)

    employee_lookup = {employee["employee_id"]: employee for employee in employees}
    for profile in seed_profiles:
        (
            employee_id,
            base_requests,
            cost_per_request,
            governed_pct,
            intervention_pct,
            primary_model,
            primary_entry_point,
        ) = profile
        employee = employee_lookup[employee_id]
        secondary_model = (
            "Google / gemini-1.5-flash" if "OpenAI" in primary_model else "OpenAI / gpt-4o-mini"
        )
        secondary_entry = "self-serve-chat"
        for months_back, multiplier in enumerate(reversed(month_multipliers)):
            requests = max(1, round(base_requests * multiplier))
            spend_usd = round(requests * cost_per_request, 2)
            governed_requests = round(requests * governed_pct)
            intervention_requests = round(requests * intervention_pct)
            primary_model_requests = max(1, round(requests * 0.74))
            primary_entry_requests = max(1, round(requests * 0.82))
            app_state.adoption.record_daily_usage(
                day=_month_anchor(reference_day, months_back),
                employee_id=employee_id,
                email=employee["email"],
                employee_name=employee["name"],
                title=employee["title"],
                team_id=employee["team_id"],
                team_name=employee["team_name"],
                business_unit_id=employee["business_unit_id"],
                business_unit_name=employee["business_unit_name"],
                organization_id="org-novatech",
                organization_name="NovaTech Industries",
                requests=requests,
                spend_usd=spend_usd,
                governed_requests=governed_requests,
                intervention_requests=intervention_requests,
                model_counts={
                    primary_model: primary_model_requests,
                    secondary_model: max(requests - primary_model_requests, 0),
                },
                entry_point_counts={
                    primary_entry_point: primary_entry_requests,
                    secondary_entry: max(requests - primary_entry_requests, 0),
                },
            )


def _month_anchor(reference_day: date, months_back: int) -> date:
    month_index = reference_day.month - months_back
    year = reference_day.year
    while month_index <= 0:
        year -= 1
        month_index += 12
    target_day = max(1, reference_day.day - 2) if months_back == 0 else 15
    last_day = calendar.monthrange(year, month_index)[1]
    return date(year, month_index, min(target_day, last_day))
