"""Static integration inventory used by API and demo surfaces."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class IntegrationSource:
    """Inbound or platform-adjacent integration available to ACI."""

    integration_id: str
    name: str
    category: str
    direction: str
    status: str
    system: str
    owner: str
    business_value: str
    primary_signals: tuple[str, ...]
    downstream_consumers: tuple[str, ...]


@dataclass(frozen=True)
class IntegrationRouteChannel:
    """One outbound channel used by a business workflow."""

    channel: str
    target: str
    purpose: str
    fallback: bool = False
    live_capable: bool = False


@dataclass(frozen=True)
class IntegrationRoute:
    """Operational handoff route for platform decisions and alerts."""

    route_id: str
    name: str
    workflow_name: str
    owner: str
    trigger: str
    expected_action: str
    business_outcome: str
    sla_target: str
    channels: tuple[IntegrationRouteChannel, ...]


@dataclass(frozen=True)
class IntegrationScenario:
    """Predefined scenario that proves a route end to end."""

    scenario_id: str
    title: str
    description: str
    route_id: str
    business_question: str
    expected_outcome: str
    event_type: str
    severity: str
    message_title: str
    message_detail: str
    metadata: dict[str, str]


def default_integration_sources() -> list[IntegrationSource]:
    """Return the integration inventory visible in the product UI."""
    return [
        IntegrationSource(
            integration_id="aws-cur",
            name="AWS Billing",
            category="Cost telemetry",
            direction="inbound",
            status="active",
            system="AWS CUR",
            owner="FinOps",
            business_value=(
                "Turns provider billing truth into reconciled unit economics "
                "and drift tracking."
            ),
            primary_signals=("line-item cost", "account", "service", "usage type"),
            downstream_consumers=(
                "Reconciliation ledger",
                "Forecasting",
                "Executive reporting",
            ),
        ),
        IntegrationSource(
            integration_id="aws-bedrock",
            name="AWS Bedrock Telemetry",
            category="Request telemetry",
            direction="inbound",
            status="active",
            system="Amazon Bedrock",
            owner="Platform Engineering",
            business_value=(
                "Captures live inference traffic so decisions can be attributed "
                "and governed at request time."
            ),
            primary_signals=("request metadata", "model", "token usage", "latency"),
            downstream_consumers=("HRE", "Attribution index", "Adoption analytics"),
        ),
        IntegrationSource(
            integration_id="aws-cloudtrail",
            name="AWS CloudTrail",
            category="Identity and control",
            direction="inbound",
            status="active",
            system="AWS CloudTrail",
            owner="Security Engineering",
            business_value=(
                "Links resource activity and service accounts back to "
                "accountable teams and operators."
            ),
            primary_signals=("assumed role", "principal", "resource access"),
            downstream_consumers=("Graph store", "Identity reconciliation"),
        ),
        IntegrationSource(
            integration_id="github-sdlc",
            name="GitHub",
            category="SDLC and deployment",
            direction="inbound",
            status="active",
            system="GitHub Webhooks and Actions",
            owner="Developer Platform",
            business_value=(
                "Connects code ownership, deployment events, and runtime "
                "services to the teams actually shipping AI systems."
            ),
            primary_signals=("push", "pull request", "workflow job", "deployment metadata"),
            downstream_consumers=("Graph store", "Manual mapping", "Interventions"),
        ),
        IntegrationSource(
            integration_id="okta",
            name="Okta",
            category="Workforce identity",
            direction="inbound",
            status="active",
            system="Okta System Log and SCIM",
            owner="IT and Identity",
            business_value=(
                "Keeps org structure, group changes, and workforce identity "
                "synchronized for adoption and ownership analytics."
            ),
            primary_signals=("login", "group membership", "SCIM profile changes"),
            downstream_consumers=("Adoption analytics", "Graph store", "Policy context"),
        ),
        IntegrationSource(
            integration_id="slack",
            name="Slack",
            category="Operational handoff",
            direction="outbound",
            status="active",
            system="Slack",
            owner="FinOps and Platform Operations",
            business_value=(
                "Pushes urgent budget, policy, and optimization signals into "
                "the channels where teams already triage work."
            ),
            primary_signals=("policy alerts", "intervention approvals", "digest summaries"),
            downstream_consumers=("FinOps war room", "Platform ops", "Executive staff"),
        ),
        IntegrationSource(
            integration_id="email",
            name="Email",
            category="Operational handoff",
            direction="outbound",
            status="active",
            system="SMTP / enterprise mail",
            owner="Finance and Operations",
            business_value=(
                "Provides auditable delivery for escalations, compliance "
                "summaries, and executive reporting cadences."
            ),
            primary_signals=(
                "executive digests",
                "fallback alerts",
                "approval notifications",
            ),
            downstream_consumers=("Executives", "Finance operations", "Compliance"),
        ),
        IntegrationSource(
            integration_id="webhook",
            name="Automation Webhook",
            category="Operational handoff",
            direction="outbound",
            status="active",
            system="ServiceNow / Jira / custom automation",
            owner="Platform Operations",
            business_value=(
                "Turns ACI outputs into downstream tickets, automation, and "
                "workflow execution without manual copying."
            ),
            primary_signals=("change request", "ticket creation", "automation trigger"),
            downstream_consumers=(
                "Service desk",
                "Change management",
                "Workflow automation",
            ),
        ),
    ]


def default_integration_routes() -> list[IntegrationRoute]:
    """Return the business workflow routes visible in the demo and API."""
    return [
        IntegrationRoute(
            route_id="policy-breach-escalation",
            name="Policy Breach Escalation",
            workflow_name="Guardrail Escalation",
            owner="FinOps duty manager",
            trigger="Budget ceiling, model allowlist, or confidence-floor violation",
            expected_action=(
                "Triage the request, confirm business owner, and either approve "
                "an exception or correct the route."
            ),
            business_outcome=(
                "High-risk spend is surfaced within minutes instead of being "
                "discovered at month end."
            ),
            sla_target="15 minutes",
            channels=(
                IntegrationRouteChannel(
                    channel="slack",
                    target="slack://ai-governance-war-room",
                    purpose="Primary escalation room for active incidents",
                ),
                IntegrationRouteChannel(
                    channel="email",
                    target="finops-leads@novatech.example",
                    purpose="Fallback escalation and audit trail",
                    fallback=True,
                ),
            ),
        ),
        IntegrationRoute(
            route_id="intervention-implementation",
            name="Intervention Implementation Handoff",
            workflow_name="Optimization Execution",
            owner="Developer Platform lead",
            trigger="Approved intervention transitions to implementation",
            expected_action=(
                "Create or update the engineering work item that executes the "
                "model-routing or caching change."
            ),
            business_outcome=(
                "Savings recommendations turn into tracked execution instead of "
                "remaining dashboard-only insight."
            ),
            sla_target="1 business day",
            channels=(
                IntegrationRouteChannel(
                    channel="webhook",
                    target="webhook://service-desk/aci-implementation",
                    purpose="Create or update downstream implementation workflow",
                ),
                IntegrationRouteChannel(
                    channel="slack",
                    target="slack://platform-ops",
                    purpose="Notify delivery owner",
                    fallback=True,
                ),
            ),
        ),
        IntegrationRoute(
            route_id="pricing-drift-review",
            name="Pricing Drift Review",
            workflow_name="Unit Economics Verification",
            owner="Platform economics lead",
            trigger="Synthetic cost estimate diverges materially from reconciled billing truth",
            expected_action=(
                "Review provider rule set, validate pricing drift, and update "
                "catalog or reconciliation logic."
            ),
            business_outcome=(
                "Forecasts and TRAC remain credible as provider pricing changes "
                "over time."
            ),
            sla_target="4 hours",
            channels=(
                IntegrationRouteChannel(
                    channel="slack",
                    target="slack://platform-economics",
                    purpose="Primary review channel",
                ),
                IntegrationRouteChannel(
                    channel="email",
                    target="platform-economics@novatech.example",
                    purpose="Escalation record and fallback",
                    fallback=True,
                ),
            ),
        ),
        IntegrationRoute(
            route_id="executive-adoption-digest",
            name="Executive Adoption Digest",
            workflow_name="Leadership Reporting",
            owner="Office of the CTO",
            trigger="Scheduled executive reporting cadence",
            expected_action=(
                "Review adoption breadth, governed-usage posture, and spend "
                "efficiency by org and business unit."
            ),
            business_outcome=(
                "Executives see whether AI adoption is broad, economically "
                "visible, and governable enough to scale."
            ),
            sla_target="Weekly",
            channels=(
                IntegrationRouteChannel(
                    channel="email",
                    target="exec-staff@novatech.example",
                    purpose="Primary executive digest delivery",
                ),
                IntegrationRouteChannel(
                    channel="slack",
                    target="slack://executive-ai-briefing",
                    purpose="Executive discussion thread",
                    fallback=True,
                ),
            ),
        ),
    ]


def default_integration_scenarios() -> list[IntegrationScenario]:
    """Return scenario runners that exercise the outbound workflows."""
    return [
        IntegrationScenario(
            scenario_id="policy-breach",
            title="Budget Breach Escalation",
            description=(
                "Demonstrates how a live policy violation is pushed into the "
                "operating channels that own triage."
            ),
            route_id="policy-breach-escalation",
            business_question=(
                "If a high-spend request violates policy, who gets notified and "
                "how fast can they act?"
            ),
            expected_outcome=(
                "FinOps and platform owners receive a routed escalation with "
                "enough context to approve, block, or remediate the request."
            ),
            event_type="policy_violation",
            severity="warning",
            message_title="Budget ceiling exceeded on customer-support-bot",
            message_detail=(
                "Support workflow request burst exceeded the configured "
                "per-request ceiling by 19%; exception review is required."
            ),
            metadata={
                "team": "Customer Support Platform",
                "policy_id": "POL-602",
                "workload_id": "customer-support-bot",
            },
        ),
        IntegrationScenario(
            scenario_id="intervention-approved",
            title="Approved Optimization Handoff",
            description=(
                "Shows how an approved optimization becomes an execution "
                "handoff instead of a passive dashboard card."
            ),
            route_id="intervention-implementation",
            business_question=(
                "Once leadership approves a savings recommendation, how does it "
                "turn into actual execution work?"
            ),
            expected_outcome=(
                "ACI emits a handoff that creates downstream implementation "
                "work and notifies the delivery owner."
            ),
            event_type="intervention_approved",
            severity="info",
            message_title="Approved intervention ready for execution",
            message_detail=(
                "The gpt-4o to gpt-4o-mini routing intervention was approved "
                "and should move into implementation tracking."
            ),
            metadata={
                "intervention_id": "INT-201",
                "team": "Platform Engineering",
                "estimated_savings_usd_month": "42000",
            },
        ),
        IntegrationScenario(
            scenario_id="pricing-drift",
            title="Pricing Drift Alert",
            description=(
                "Demonstrates how reconciliation drift is routed to the owner "
                "responsible for pricing accuracy."
            ),
            route_id="pricing-drift-review",
            business_question=(
                "If estimated and billed costs drift apart, how does the "
                "platform drive correction before planning is affected?"
            ),
            expected_outcome=(
                "Platform economics owners receive a drift review package and "
                "can update pricing or reconciliation logic quickly."
            ),
            event_type="pricing_drift_alert",
            severity="warning",
            message_title="Synthetic vs reconciled pricing drift crossed threshold",
            message_detail=(
                "Gemini request estimates are drifting 7.4% above billed cost "
                "over the last reconciliation window."
            ),
            metadata={
                "provider": "google",
                "service": "vertex-ai",
                "drift_pct": "7.4",
            },
        ),
        IntegrationScenario(
            scenario_id="executive-digest",
            title="Executive Adoption Digest",
            description=(
                "Shows the weekly leadership digest that turns telemetry into "
                "adoption and governance reporting."
            ),
            route_id="executive-adoption-digest",
            business_question=(
                "What does the executive staff see about enterprise AI "
                "adoption, control posture, and economic efficiency?"
            ),
            expected_outcome=(
                "Executives receive a structured digest summarizing adoption "
                "breadth, governed usage, and business-unit variation."
            ),
            event_type="executive_digest",
            severity="info",
            message_title="Weekly AI operating digest is ready",
            message_detail=(
                "Organization-wide adoption reached 59.9% of eligible "
                "employees, governed usage held above 82%, and Product and "
                "Platform remains the primary growth driver."
            ),
            metadata={
                "scope": "organization",
                "window_days": "30",
                "digest_type": "adoption_and_governance",
            },
        ),
    ]
