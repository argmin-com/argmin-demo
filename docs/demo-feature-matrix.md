# Demo Surface Reference

This page describes what the public demo shows, how each view is meant to be
used in a live walkthrough, and which runtime surfaces back each part of the
presentation.

## Core Proof Points

| Proof point | What the demo shows | Where to show it |
|---|---|---|
| Request-level attribution | A single request can be tied to service, code, identity, organization, and budget owner with explicit confidence and evidence. | `Request Proof` |
| Decision-time governance | The platform can enrich, intervene, or fail open without blocking inference availability. | `Guided Demo`, `Governance`, `Interventions` |
| Financial actionability | Spend can be segmented by model, team, and scenario so optimization work becomes prioritizable rather than anecdotal. | `Overview`, `Models`, `Teams`, `Forecasting` |
| Workforce adoption clarity | Employee usage can be rolled up from team to business unit to organization with executive lenses for CEO, CFO, COO, and CTO reviewers. | `Employee Adoption`, `Overview` |

## View-by-View Surface Map

| View | Purpose | Backing surface |
|---|---|---|
| `Overview` | Show the aggregate business posture: spend, coverage, savings opportunity, and organizational distribution. | `frontend/index.html`, seeded demo dataset, optional `GET /v1/dashboard/overview` enrichment |
| `Employee Adoption` | Show how AI usage is spreading across teams, business units, and the parent organization, including governed usage, repeat usage, power-user concentration, and executive metrics. | `frontend/index.html`, seeded demo dataset, optional `GET /v1/adoption/hierarchy`, `GET /v1/adoption/dashboard` enrichment |
| `Models` | Compare model families on spend, request volume, latency, variance, optimization headroom, and enterprise model/platform context. | `frontend/index.html`, seeded demo dataset |
| `Teams` | Show ownership, budget posture, and optimization potential by business unit while preserving active team/model/request context. | `frontend/index.html`, seeded demo dataset |
| `Manual Mapping` | Demonstrate how an operator corrects ambiguous ownership and forces a recalculation into operating state, including visible before/after business effects. | `frontend/index.html`, `POST /v1/events/ingest`, processor correction flow |
| `Interventions` | Show optimization recommendations, status lifecycle, confidence, risk, baseline cost, implementation effort, linked evidence, and forecast effect. | `frontend/index.html`, seeded demo dataset, optional `GET /v1/interventions`, `POST /v1/interventions/{intervention_id}/status`, `POST /v1/interventions/cost-simulate` |
| `Forecasting` | Translate platform posture into planning scenarios across multiple horizons, compare mode, and assumptions/drivers, with a local directional estimate fallback if the live planning endpoint is unavailable. | `frontend/index.html`, seeded demo dataset, optional `POST /v1/forecast/spend` |
| `Governance` | Explain enforcement modes, active policies, fail-open posture, trust-boundary decisions, and request-level policy simulation. | `frontend/index.html`, policy engine and interceptor state |
| `Integrations` | Show how Argmin connects inbound enterprise systems to owned downstream business workflows, including scenario-driven handoffs and delivery auditability. | `frontend/index.html`, seeded demo dataset, optional `GET /v1/integrations/overview`, `POST /v1/integrations/scenarios/{scenario_id}/dispatch`, `POST /v1/integrations/notify`, `GET /v1/integrations/deliveries` |
| `Request Proof` | Walk one request through evidence, attribution, pricing, evidence quality, and staged decision replay in technical detail. | `frontend/index.html`, attribution/index/trac runtime |
| `Glossary` and `FAQ` | Give reviewers a self-serve vocabulary and methodology reference while staying inside the product surface. | `frontend/data/demo_dataset.json`, `frontend/index.html` |

## Presentation Aids

| Surface | Purpose |
|---|---|
| `Guided Demo` | Runs the automated 90-second walkthrough and the three live proof scenarios. |
| `Active-context ribbon` | Keeps the current request, team, model, intervention, scenario, and mode visible while navigating. |
| `Audience-lens ribbon` | Reframes the same operating data for executive, finance, platform, and security reviewers. |
| Export actions | Emit operating artifacts such as intervention briefs, planning packs, and governance exceptions from the relevant pages. |

## Supporting Runtime Capabilities

| Capability | How it appears in the repo |
|---|---|
| Deterministic demo runtime | `./scripts/run_demo.sh` launches the dedicated `demo` profile and auto-seeds state on startup. |
| Shared-backend local runtime | `docker-compose.yml` exercises Kafka, Redis, and Neo4j together for integration validation. |
| Pricing and reconciliation services | `/v1/pricing/*` and `/v1/finops/*` expose catalog, estimation, reconciliation, and drift summaries. |
| Identity / SCM / CI ingestion breadth | Okta, GitHub, AWS billing, CloudTrail, and Bedrock connectors normalize external payloads into domain events. |
| Durable index and replay posture | Redis-backed index materialization, idempotent event ingestion, DLQ routing, and lag/readiness instrumentation. |

## Demo Entry Points

- One-command launch: `./scripts/run_demo.sh`
- Browser: `http://localhost:8000/platform/`
- Guided walkthrough: open **Guided Demo**, click **Start 90-sec Walkthrough**
- Reset presentation state: **Reset Demo**
- Reseed backend demo state: **Initialize Demo**
- Walkthrough runtime behavior: if backend initialization is unavailable, the sequence continues on deterministic local demo data
