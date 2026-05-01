# Demo Dataset Schema

`frontend/data/demo_dataset.json` is the canonical synthetic operating dataset for the investor demo UI.

## Top-Level Keys

- `meta`: tenant, environment labels, watermark, default mode, and presentation metadata
- `overview`: executive summary metrics and spend trend points
- `adoption`: hierarchy and dashboard snapshots for organization, business-unit, and team views
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
- `glossary`: categorized terminology entries
- `faq`: categorized question-and-answer content
- `demo_scenarios`: guided demo request payloads and labels
- `forecast_scenarios`: scenario definitions used by Forecasting

## Key Conventions

- All records are synthetic and presentation-safe.
- Currency values are stored in USD unless a field explicitly says otherwise.
- Percentages use `_pct` suffixes.
- Monetary run-rate or monthly values use `_usd` or `_usd_month`.
- Lists rendered in the UI should be safe for direct display, but frontend code still escapes dynamic values before insertion.
- `overview.total_spend_usd` is expected to reconcile to the sum of `teams[].spend_usd`
  and `models[].spend_usd` for the same 30-day window.
- `overview.requests_30d` is expected to reconcile to the sum of
  `models[].requests` for the same 30-day window.
- `attribution_requests` should include multiple request examples so Request
  Proof can show both high-confidence and review-required cases, including
  staged replay and evidence-quality summaries.
- `manual_mapping` should contain enough evidence and ownership metadata to
  show before/after impact on confidence, budget ownership, intervention
  priority, and forecast reserve.
- `interventions` should be rich enough to support operational detail cards such
  as baseline cost, savings, effort, evidence, and forecast effect.

## Fields Used Directly By The UI

Examples of high-impact fields that should remain stable:

- `meta.environment_label`
- `meta.tenant_profile_label`
- `overview.total_spend_usd`
- `overview.attribution_coverage_pct`
- `teams[].optimization_potential_usd`
- `models[].provider`
- `enterprise_market_signals[].label`
- `enterprise_model_landscape[].provider`
- `enterprise_ai_platforms[].name`
- `enterprise_ai_stack[].layer`
- `interventions[].status`
- `attribution_requests[].confidence`
- `integrations.summary.*`
- `glossary[].term`
- `faq[].items[]`

## Change Guidance

- Prefer additive changes to preserve demo continuity.
- Keep all example identities and addresses synthetic, using `.example` domains where relevant.
- If a new UI surface is added, document the new top-level or nested object here at the same time.
