# Demo Dataset Schema

`frontend/data/demo_dataset.json` is the canonical synthetic operating dataset for the investor demo UI.

## Demo-Only Boundary

`frontend/data/demo_dataset.json` is a `DEMO_ONLY_SYNTHETIC_FIXTURE`. It is not
customer telemetry, production billing, production IAM, cloud inventory, or
connector output. The top-level `meta.demo_only` flag and `meta.demo_only_notice`
must remain present so reviewers cannot confuse this file with a production read
model or export.

## Top-Level Keys

- `meta`: demo-only flags, tenant, environment labels, watermark, default mode, and presentation metadata
- `overview`: executive summary metrics and spend trend points
- `adoption`: hierarchy, dashboard snapshots, and workflow-level adoption maps
  for organization, business-unit, and team views
- `teams`: business teams with budgets, spend, trends, and optimization signals
- `models`: active model families with provider, spend, latency, request volume, and optimization metadata
- `enterprise_market_signals`: investor-facing market context used on the Models page
- `enterprise_model_landscape`: investor-facing reference set describing the broader multi-model estate represented in the demo
- `enterprise_ai_platforms`: common enterprise AI access platforms and control planes
- `enterprise_ai_stack`: layered enterprise architecture reference used in the product demo
- `interventions`: recommended or active optimization actions
- `attribution_requests`: request-level evidence chains used by Request Proof
- `governance`: deployment modes, policy summaries, fail-open matrix, and trust-boundary copy
- `manual_mapping`: unresolved or operator-corrected ownership mappings
- `integrations`: connected systems, routes, scenarios, and delivery history
- `coverage`: pathway-class coverage, capture feasibility, blind spots,
  degraded states, agent lineage, and local scenario-harness proof
- `exports`: finance export preview data, including event-time/current-state
  ownership views, FOCUS-compatible column posture, allocation-only rows, and
  unknown spend exclusions
- `energy_efficiency`: advisory model energy transparency data, including
  star ratings, kWh estimates, carbon estimates, optimization deltas, and
  explicit `Unrated` / `null` handling for unknown models
- `admin`: local customer-admin simulation data for RBAC, account lifecycle,
  read-only integration posture, scoped diagnostics, audited operations, and
  customer-visible append-only audit events
- `design_partner_brief`: customer-facing pilot narrative, readiness pillars,
  buyer-role map, proof moments, success metrics, open questions, and recording
  talk track used by the Partner Brief page
- `glossary`: categorized terminology entries
- `faq`: categorized question-and-answer content
- `demo_scenarios`: guided demo request payloads and labels
- `forecast_scenarios`: scenario definitions used by Forecasting
- `prd_traceability`: source-document proof data for PRD Proof, including
  journeys, decision surfaces, RAIL stages, invariants, pathway coverage, and
  requirement coverage rows

## Key Conventions

- All records are synthetic and presentation-safe.
- Currency values are stored in USD unless a field explicitly says otherwise.
- Percentages use `_pct` suffixes.
- Monetary run-rate or monthly values use `_usd` or `_usd_month`.
- Team records use canonical `team-*` identifiers and should carry
  `business_unit_id`, `business_unit_name`, `cost_center`, and
  `service_owner_email` so UI drill-downs, finance exports, and workflow maps
  tell the same ownership story.
- Lists rendered in the UI should be safe for direct display, but frontend code still escapes dynamic values before insertion.
- `overview.total_spend_usd` is expected to reconcile to the sum of `teams[].spend_usd`
  and `models[].spend_usd` for the same 30-day window.
- `overview.requests_30d` is expected to reconcile to the sum of
  `models[].requests` for the same 30-day window.
- `attribution_requests` should include multiple request examples so Request
  Proof can show both high-confidence and review-required cases, including
  staged replay and evidence-quality summaries.
- `adoption.workflow_map.workflows[]` should remain broad enough to show
  workflow, service, capability, insertion point, evidence, and decision owner
  variation across business units and teams. Workflow `team_id` and
  `team_name` values should map back to top-level `teams[]` records.
- `manual_mapping` should contain enough evidence and ownership metadata to
  show before/after impact on confidence, budget ownership, intervention
  priority, and forecast reserve.
- `interventions` should be rich enough to support operational detail cards such
  as baseline cost, savings, effort, evidence, and forecast effect.
- `coverage.summary.classified_pathways` should reconcile to
  `coverage.pathways.length` so the pathway truth map does not claim coverage
  that is not visible in the local UI.
- `integrations.scenarios[]` should remain runnable without cloud credentials;
  if the live runtime is unavailable, the frontend simulates a local handoff
  record from this deterministic dataset.
- `integrations.recent_deliveries[].delivery_id` should include the same
  `YYYYMMDD` date as `sent_at` so local handoff history reads as a coherent
  timeline rather than a mixed synthetic epoch.

## Fields Used Directly By The UI

Examples of high-impact fields that should remain stable:

- `meta.environment_label`
- `meta.tenant_profile_label`
- `overview.total_spend_usd`
- `overview.attribution_coverage_pct`
- `teams[].optimization_potential_usd`
- `adoption.workflow_map.summary.*`
- `adoption.workflow_map.workflows[]`
- `adoption.workflow_map.capabilities[]`
- `adoption.workflow_map.services[]`
- `models[].provider`
- `models[].energy_status`
- `models[].kwh_per_1k_requests`
- `enterprise_market_signals[].label`
- `enterprise_model_landscape[].provider`
- `enterprise_ai_platforms[].name`
- `enterprise_ai_stack[].layer`
- `interventions[].status`
- `attribution_requests[].confidence`
- `integrations.summary.*`
- `coverage.summary.*`
- `coverage.pathways[]`
- `coverage.blind_spots[]`
- `coverage.agent_lineage`
- `coverage.scenario_results[]`
- `exports.summary.*`
- `exports.rows[]`
- `exports.allocation_splits[]`
- `energy_efficiency.summary.*`
- `energy_efficiency.models[]`
- `energy_efficiency.recommendations[]`
- `admin.summary.*`
- `admin.accounts[]` including synthetic admin, manager, user, auditor, and
  operator personas used by the local role-based experience switcher
- `admin.operations[]`
- `admin.audit_log[]`
- `design_partner_brief.thesis.*`
- `design_partner_brief.readiness_pillars[]`
- `design_partner_brief.pilot_stages[]`
- `design_partner_brief.buyer_roles[]`
- `design_partner_brief.proof_moments[]`
- `design_partner_brief.success_metrics[]`
- `design_partner_brief.open_questions[]`
- `design_partner_brief.demo_script[]`
- `prd_traceability.journeys[]`
- `prd_traceability.requirement_matrix[]`
- `glossary[].term`
- `faq[].items[]`

## Change Guidance

- Prefer additive changes to preserve demo continuity.
- Keep all example identities and addresses synthetic, using `.example` domains where relevant.
- If a new UI surface is added, document the new top-level or nested object here at the same time.
- Keep PRD Proof rows explicit enough for a presenter to answer where a
  requirement appears without opening the source documents during a recording.
