# Frontend Demo

Canonical demo UI:

- `frontend/index.html`
- `frontend/assets/app.css`
- `frontend/assets/app.js`
- `frontend/assets/fonts/`
- `frontend/data/demo_dataset.json`
- `frontend/data/SCHEMA.md`
- `frontend/vendor/chart.umd.min.js`

This is the only supported frontend demo surface in the repository. The demo runs
from a local synthetic dataset and selectively enriches live state from the API
when the runtime is available.

The investor demo UI is intentionally self-contained and deterministic. It uses
plain HTML, CSS, and JavaScript so the presentation surface remains portable,
offline-friendly, and easy to inspect during technical diligence. It also starts
in local-data mode instead of making live API calls before the presenter asks
for them.

The dataset intentionally represents a multi-model enterprise estate rather than
only one or two providers. The demo surfaces OpenAI, Anthropic, Google, Meta,
Mistral, Cohere, Alibaba, DeepSeek, IBM, and AWS model families because large
enterprises typically mix frontier, open-weight, and platform-native models in
one operating stack.

The Models page frames those providers in the broader enterprise context:

- market adoption signals that explain why multi-model governance matters now
- dominant enterprise AI access platforms such as Azure OpenAI, AWS Bedrock,
  Google Vertex AI, Snowflake Cortex AI, Copilot, Databricks AI, and OpenAI Enterprise
- the canonical five-layer enterprise AI stack: data, AI infrastructure,
  model/inference, agent, and application layers

The PRD Proof page maps the attached Argmin artifacts into an operator-visible
requirements proof. It shows source documents, PRD user journeys, decision
surface trust states, the RAIL/HRE pipeline, pathway coverage, invariants, and
the local page that demonstrates each major requirement.

Served by FastAPI at:

- `http://localhost:8000/platform/`

## Quick Start

From repo root:

```bash
./scripts/run_demo.sh
```

Custom port:

```bash
ACI_DEMO_PORT=8010 ./scripts/run_demo.sh
```

The launcher uses the dedicated `demo` runtime profile, installs
`requirements-demo.lock` instead of the full production lock, runs the API from
`src/` directly, and auto-seeds the backend state. The seed baseline is fixed to
a synthetic February 2026 operating period with predictable demo accounts,
stable workflow scenarios, simulated notifications, and repeatable mock
responses.

To restore a running demo to that known state:

```bash
./scripts/reset_demo.sh
```

To reset both browser session state and backend runtime state in one load, open:

- `http://localhost:8000/platform/?reset=1`

Optional live API auth token:

- set `window.__ACI_API_TOKEN__` before the app initializes, or
- store the bearer token in `sessionStorage` as `aci_demo_api_token`

This is only needed if the local backend is configured to require auth for demo UI calls.

## Primary Walkthrough

1. Open `http://localhost:8000/platform/`
2. Open **Guided Demo** (top bar, right side)
3. Click **Start Full Walkthrough**
4. Review:
   - Overview (financial summary and organizational spend)
   - PRD Proof (source-document requirements, trust states, and proof map)
   - Coverage (pathway classes, blind spots, degraded states, and agent lineage)
   - Employee Adoption (organization, business-unit, team, workflow, service, and capability adoption)
   - Request Proof (request-level evidence, decision replay, and evidence quality)
   - Exports (chargeback-ready, provisional, allocated, and unknown rows)
   - Interventions (stateful lifecycle, methodology, effort, and forecast effect)
   - Energy (model energy ratings, kWh estimates, carbon estimates, and Unrated states)
   - Forecasting (scenario-based planning views, compare mode, and driver breakdown)
   - Governance (modes, policies, fail-open matrix, and policy simulation)
   - Admin (RBAC, scoped diagnostics, audited operations, and trust-boundary posture)

Then use the left rail for drill-down surfaces that extend the same story:

- Manual Mapping (ownership correction with before/after business effect)
- Models and Teams (model-family and organizational optimization context)
- Integrations (owned downstream workflow routing and delivery auditability)

Use **Reset Demo** to restore the presentation state. Use **Initialize Demo**
only when you want to reseed backend state during a session. If initialization
fails, the guided walkthrough continues on deterministic local demo data rather
than collapsing into repeated runtime errors.

The demo also exposes:

- an active-context ribbon so the current team, request, model, intervention,
  scenario, and mode stay visible while navigating
- an audience-lens ribbon (`Executive`, `Finance`, `Platform`, `Security`) that
  reframes the same data for different buyer or operator perspectives
- exportable operating artifacts from Interventions, Exports, Forecasting, and Governance

## Demo Guarantees

- Persistent `SIMULATED DATA` watermark
- Session-persistent intervention status transitions
- Presentation layer stays focused on attribution, interventions, forecasting, and governance
- Request-level technical detail isolated to Request Proof + Guided Demo
- Vendored Chart.js so the demo remains portable in restricted-network environments
- Local font assets so the demo renders consistently offline and across locked-down enterprise machines
- Local forecast estimation fallback so the planning view still works when the live forecast API is unavailable
- Documented dataset schema for maintainers in `frontend/data/SCHEMA.md`
- Externalized CSS and JavaScript so the demo can run under a stricter CSP than an all-inline page
- Local dataset fallback so the presentation layer remains coherent when live API calls are unavailable
- Reconciled overview totals so the executive summary, model totals, and team totals all represent the same 30-day operating window
- PRD/spec traceability so each major visible claim maps back to a source-document requirement and an interactive local surface

## Keyboard Shortcuts

- `G` toggles the Guided Demo drawer
- `M` toggles the deployment mode menu
- `/` focuses the active search box on the Glossary or FAQ page
