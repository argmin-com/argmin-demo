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
        IntegrationSource(
            integration_id="azure-openai",
            name="Azure OpenAI",
            category="Request telemetry",
            direction="inbound",
            status="active",
            system="Azure Monitor / APIM",
            owner="Platform Engineering",
            business_value=(
                "Captures private-endpoint deployments, APIM route metadata, "
                "and Azure billing for GPT workloads."
            ),
            primary_signals=("deployment", "token usage", "AAD app"),
            downstream_consumers=("HRE", "Exports", "Policy simulation"),
        ),
        IntegrationSource(
            integration_id="gcp-vertex",
            name="Google Vertex AI",
            category="Request telemetry",
            direction="inbound",
            status="active",
            system="Vertex AI audit logs",
            owner="Data Platform",
            business_value=(
                "Connects Gemini usage to projects, service accounts, and "
                "model-router decisions."
            ),
            primary_signals=("project", "served model", "usage export"),
            downstream_consumers=("Coverage", "Energy", "Forecasting"),
        ),
        IntegrationSource(
            integration_id="snowflake-cortex",
            name="Snowflake Cortex",
            category="Data-platform AI",
            direction="inbound",
            status="active",
            system="Snowflake account usage",
            owner="Data Science",
            business_value=(
                "Shows warehouse-AI invocation, workspace ownership, and "
                "allocation caveats for finance review."
            ),
            primary_signals=("query tag", "warehouse cost", "user"),
            downstream_consumers=("Exports", "Adoption analytics", "Manual mapping"),
        ),
        IntegrationSource(
            integration_id="salesforce-einstein",
            name="Salesforce Einstein",
            category="Embedded SaaS AI",
            direction="inbound",
            status="active",
            system="Salesforce admin export",
            owner="Customer Operations",
            business_value=(
                "Provides case-workflow adoption signals and customer-operation "
                "AI coverage."
            ),
            primary_signals=("case ID", "agent activity", "license assignment"),
            downstream_consumers=("Adoption analytics", "Coverage", "Customer reports"),
        ),
        IntegrationSource(
            integration_id="servicenow",
            name="ServiceNow",
            category="Operational handoff",
            direction="outbound",
            status="active",
            system="ServiceNow Change",
            owner="Platform Operations",
            business_value=(
                "Turns approved optimization and governance actions into owned "
                "change records."
            ),
            primary_signals=("change request", "approval state", "owner"),
            downstream_consumers=("Change management", "Platform ops", "Audit"),
        ),
        IntegrationSource(
            integration_id="jira",
            name="Jira",
            category="Operational handoff",
            direction="outbound",
            status="active",
            system="Jira Cloud",
            owner="Engineering Operations",
            business_value=(
                "Routes implementation tasks and product gaps into delivery "
                "backlogs."
            ),
            primary_signals=("ticket", "assignee", "status"),
            downstream_consumers=("Engineering teams", "Product leads", "Delivery reporting"),
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
        IntegrationRoute(
            route_id="manual-mapping-review",
            name="Manual Mapping Review",
            workflow_name="Ownership Dispute Resolution",
            owner="FinOps attribution owner",
            trigger="Confidence below chargeback threshold or same-tier ownership conflict",
            expected_action="Confirm, reassign, or defer ownership with evidence.",
            business_outcome=(
                "Ambiguous spend becomes a tracked decision instead of a hidden "
                "dashboard assumption."
            ),
            sla_target="2 business days",
            channels=(
                IntegrationRouteChannel(
                    channel="jira",
                    target="jira://finops-attribution",
                    purpose="Create mapping review task",
                ),
                IntegrationRouteChannel(
                    channel="email",
                    target="finops-attribution@novatech.example",
                    purpose="Review digest and audit record",
                    fallback=True,
                ),
            ),
        ),
        IntegrationRoute(
            route_id="security-exception-review",
            name="Security Exception Review",
            workflow_name="Trust Boundary Review",
            owner="Security review delegate",
            trigger="Policy simulation returns exception-required state",
            expected_action=(
                "Approve, deny, or request additional evidence for the AI workflow."
            ),
            business_outcome=(
                "Policy exceptions stay auditable and inside customer-controlled review."
            ),
            sla_target="4 hours",
            channels=(
                IntegrationRouteChannel(
                    channel="slack",
                    target="slack://security-ai-review",
                    purpose="Reviewer triage thread",
                ),
                IntegrationRouteChannel(
                    channel="servicenow",
                    target="servicenow://change/ai-exceptions",
                    purpose="Exception record",
                    fallback=True,
                ),
            ),
        ),
        IntegrationRoute(
            route_id="service-owner-scorecard",
            name="Service Owner Scorecard",
            workflow_name="Team Operating Review",
            owner="Service owner",
            trigger="Weekly team-level adoption, cost, and governance summary",
            expected_action=(
                "Review spend, adoption, exceptions, and recommended optimizations."
            ),
            business_outcome=(
                "Teams see the exact workflows where AI is adopted and what "
                "actions are pending."
            ),
            sla_target="Weekly",
            channels=(
                IntegrationRouteChannel(
                    channel="email",
                    target="service-owners@novatech.example",
                    purpose="Team scorecard delivery",
                ),
                IntegrationRouteChannel(
                    channel="slack",
                    target="slack://service-owner-ai-scorecards",
                    purpose="Discussion thread",
                    fallback=True,
                ),
            ),
        ),
        IntegrationRoute(
            route_id="energy-efficiency-review",
            name="Energy Efficiency Review",
            workflow_name="Sustainability Advisory",
            owner="Platform sustainability lead",
            trigger=(
                "Energy-aware recommendation has cost and quality equivalence evidence"
            ),
            expected_action=(
                "Review advisory energy delta beside cost and quality before "
                "approving a route change."
            ),
            business_outcome=(
                "Energy is visible without overriding product quality, policy, or cost truth."
            ),
            sla_target="Monthly",
            channels=(
                IntegrationRouteChannel(
                    channel="email",
                    target="platform-sustainability@novatech.example",
                    purpose="Advisory review packet",
                ),
                IntegrationRouteChannel(
                    channel="jira",
                    target="jira://platform-economics/energy",
                    purpose="Follow-up task for telemetry gaps",
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
        IntegrationScenario(
            scenario_id="manual-mapping-dispute",
            title="Ownership Dispute Review",
            description=(
                "Shows how a provisional or conflicting owner becomes a tracked "
                "FinOps review task."
            ),
            route_id="manual-mapping-review",
            business_question=(
                "What happens when attribution is useful but not trustworthy "
                "enough for chargeback?"
            ),
            expected_outcome=(
                "FinOps receives a review task with confidence, candidates, and evidence."
            ),
            event_type="ownership_dispute",
            severity="warning",
            message_title="Manual mapping review required",
            message_detail=(
                "A shared service account has multiple plausible owners and "
                "requires human confirmation before chargeback."
            ),
            metadata={
                "mapping_id": "mm_001",
                "confidence_pct": "72",
                "candidate_count": "3",
            },
        ),
        IntegrationScenario(
            scenario_id="security-exception",
            title="Security Exception Review",
            description=(
                "Shows how a policy exception stays inside the customer trust boundary."
            ),
            route_id="security-exception-review",
            business_question=(
                "Can the product support governance without silently blocking "
                "production workflows?"
            ),
            expected_outcome=(
                "Security receives an auditable exception packet and the request "
                "remains labeled."
            ),
            event_type="security_exception",
            severity="warning",
            message_title="AI policy exception requires review",
            message_detail=(
                "A request is outside the standard policy bundle and requires "
                "security review before active enforcement."
            ),
            metadata={
                "policy_id": "POL-817",
                "trust_boundary": "customer-vpc",
                "request_id": "req_security_exception_204",
            },
        ),
        IntegrationScenario(
            scenario_id="service-owner-scorecard",
            title="Service Owner Scorecard",
            description=(
                "Shows a team-level operating packet with adoption, cost, "
                "governance, and recommendations."
            ),
            route_id="service-owner-scorecard",
            business_question=(
                "What exactly does a service owner receive about AI usage in "
                "their workflows?"
            ),
            expected_outcome=(
                "Owners receive a concise scorecard tied to workflows and pending actions."
            ),
            event_type="service_owner_scorecard",
            severity="info",
            message_title="Weekly service owner AI scorecard is ready",
            message_detail=(
                "Platform Engineering has three high-adoption workflows, two "
                "open interventions, and one provisional ownership item."
            ),
            metadata={
                "team": "Platform Engineering",
                "window_days": "30",
                "open_actions": "3",
            },
        ),
        IntegrationScenario(
            scenario_id="energy-review",
            title="Energy Advisory Review",
            description=(
                "Shows how an energy-aware recommendation is routed without greenwashing."
            ),
            route_id="energy-efficiency-review",
            business_question=(
                "How does energy data influence decisions when some model "
                "footprints are unknown?"
            ),
            expected_outcome=(
                "Platform economics sees advisory deltas and explicit Unrated/null fields."
            ),
            event_type="energy_efficiency_review",
            severity="info",
            message_title="Energy advisory review packet is ready",
            message_detail=(
                "A lower-energy candidate is available with equivalent quality, "
                "while unrated models remain explicitly marked as unknown."
            ),
            metadata={
                "decision_binding": "advisory",
                "unknowns": "preserved_as_null",
                "candidate_model": "gemini-1.5-flash",
            },
        ),
    ]
