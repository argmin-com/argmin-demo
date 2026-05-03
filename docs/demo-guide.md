# Demo Guide

This is the shortest technical path to validate the product and runtime during external review.

## Objective

Demonstrate that the platform can:

1. Attribute AI spend to the correct owner with defensible evidence.
2. Execute decision-time governance with fail-open guarantees.
3. Translate platform posture into operational and financial action.
4. Show where the attached PRD/spec/deck requirements appear in the local demo.

## Prerequisites

- Python 3.12+
- `pip`

Change into the repository root first.

If you cloned the repository:

```bash
git clone https://github.com/argmin-com/argmin-demo.git
cd argmin-demo
```

If you downloaded the ZIP from GitHub:

```bash
cd /path/to/where/you/unzipped/argmin-demo
```

## Run Local Demo

```bash
./scripts/run_demo.sh
```

Open:

- `http://localhost:8000/platform/`

The local launcher uses the dedicated `demo` runtime profile. It starts single-worker,
auto-seeds deterministic attribution/index state, and allows auth bypass only in `demo`.
It installs the minimal local-demo dependencies from `requirements-demo.lock` into
`.venv` on the first run, runs from `src/` directly, and reuses that environment
on later runs unless `requirements-demo.lock` or `pyproject.toml` changes. The
full `requirements.lock` remains available when you intentionally want the
production/shared-backend dependency set.

To restore an already running demo to the known seeded baseline:

```bash
./scripts/reset_demo.sh
```

The browser can also reset local session state and backend runtime state at
`http://localhost:8000/platform/?reset=1`.

## Recommended UI Flow

1. In the top bar, open **Guided Demo**.
2. Click **Start Full Walkthrough**.
3. Confirm the drawer shows the three decision-time proof points:
   - attributed request
   - policy intervention
   - fail-open safety

Use **Reset Demo** to restore the baseline presentation state. Use
**Initialize Demo** when you want to reseed backend demo data during the same
session. If initialization fails, the guided walkthrough continues on
deterministic local demo data so the product story remains intact.

Then walk views in this order:

1. **Overview**: financial summary, spend distributions, team attribution.
2. **PRD Proof**: source-document journeys, decision-surface trust states, RAIL/HRE stages, invariants, pathway caveats, and requirement coverage.
3. **Coverage**: explicit pathway classes, capture feasibility, blind spots, degraded states, scenario harness proof, and agent lineage gaps.
4. **Employee Adoption**: organization, business-unit, and team-level uptake with CEO/CFO/COO/CTO lenses.
5. **Request Proof**: request-level evidence trail, staged decision replay, evidence quality, cost explanation, and safety rationale.
6. **Exports**: finance-ready chargeback preview with event-time/current-state toggle, provisional rows, allocation-only rows, and unknown exclusions.
7. **Interventions**: approve/reject/dismiss lifecycle, operational evidence, implementation effort, and forecast effect.
8. **Energy**: model energy ratings, kWh estimates, carbon estimates, and explicit Unrated/null treatment for unknown models.
9. **Forecasting**: scenario-based planning horizons, compare mode, and assumptions/drivers broken into demand, model mix, governance drag, optimization capture, and unresolved attribution risk.
10. **Governance**: mode controls, active policies, fail-open posture, trust boundary notes, and a request-level policy simulator.
11. **Admin**: local simulation of RBAC, account lifecycle, read-only permissions, scoped diagnostics, and audited operations.
12. **Manual Mapping**: human correction flow with explicit before/after business impact, including confidence lift, owner reassignment, budget effect, intervention reprioritization, and planning delta.
13. **Models** and **Teams**: model-family and organizational optimization surfaces with the same active request/team/model context carried across pages.
14. **Integrations**: show connected enterprise systems, owned business handoff workflows, and scenario-driven downstream actions.
15. **Glossary / FAQ**: diligence-ready terminology and methodology references.

## Equivalent API Walkthrough

### 1) Restore deterministic demo entries

```bash
curl -s -X POST http://localhost:8000/v1/demo/reset | jq
```

The platform is already seeded on startup in demo mode; this endpoint restores
the fixed baseline, including seeded accounts, scenario IDs, simulated
integration deliveries, intervention status, event-log idempotency state, and
interceptor counters.

### 2) Enriched outcome

```bash
curl -s -X POST http://localhost:8000/v1/intercept \
  -H 'Content-Type: application/json' \
  -d '{
    "request_id": "demo-enriched-1",
    "model": "gpt-4o-mini",
    "provider": "openai",
    "service_name": "customer-support-bot",
    "input_tokens": 600,
    "max_tokens": 350,
    "estimated_cost_usd": 0.0032,
    "environment": "demo"
  }' | jq
```

### 3) Soft stop outcome

```bash
curl -s -X POST http://localhost:8000/v1/intercept \
  -H 'Content-Type: application/json' \
  -d '{
    "request_id": "demo-soft-stop-1",
    "model": "gpt-4o",
    "provider": "openai",
    "service_name": "analytics-batch",
    "input_tokens": 5200,
    "max_tokens": 1400,
    "estimated_cost_usd": 0.014,
    "environment": "demo"
  }' | jq
```

### 4) Fail-open outcome

```bash
curl -s -X POST http://localhost:8000/v1/intercept \
  -H 'Content-Type: application/json' \
  -d '{
    "request_id": "demo-fail-open-1",
    "model": "gpt-4o",
    "provider": "openai",
    "service_name": "unknown-service",
    "input_tokens": 400,
    "max_tokens": 300,
    "estimated_cost_usd": 0.004,
    "environment": "demo"
  }' | jq
```

## Operational Endpoints

- `GET /health`
- `GET /ready`
- `GET /metrics`
- `GET /metrics/prometheus`
- `GET /v1/dashboard/overview`
- `GET /v1/adoption/hierarchy`
- `GET /v1/adoption/dashboard`
- `GET /v1/pricing/catalog`
- `POST /v1/pricing/catalog`
- `POST /v1/pricing/estimate`
- `POST /v1/finops/synthetic`
- `POST /v1/finops/reconcile`
- `GET /v1/finops/drift`
- `POST /v1/forecast/spend`
- `GET /v1/interventions`
- `GET /v1/interventions/summary`
- `GET /v1/interventions/{intervention_id}/history`
- `POST /v1/interventions/{intervention_id}/status`
- `POST /v1/interventions/cost-simulate`
- `GET /v1/integrations/overview`
- `POST /v1/integrations/scenarios/{scenario_id}/dispatch`
- `POST /v1/integrations/notify`
- `GET /v1/integrations/deliveries`

Notes:
- `POST /v1/forecast/spend` is a directional planning endpoint backed by a
  simple linear trend model with residual-bounded intervals; it is intended for
  fast operator planning, not treasury-grade forecasting.
- If the live forecast endpoint is unavailable, the frontend falls back to a
  local directional estimate so the planning view remains usable during a demo.
- `POST /v1/pricing/catalog` and intervention status changes are authenticated
  mutation surfaces and can be bound to narrower service scopes than the base
  `/v1/*` read/write token.
- Live notification delivery remains opt-in. Production-like environments
  require HTTPS webhook targets, hostname allowlisting, and explicit scope.
- Event ingestion also enforces request-size, JSON-depth, and JSON-key-count
  bounds before malformed payloads can enter the append-only event log.

## Smoke Verification

Run the end-to-end local smoke test:

```bash
./scripts/smoke_demo.sh
```

For a quick reset of a running instance without starting a new server:

```bash
./scripts/reset_demo.sh
```
