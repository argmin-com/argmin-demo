# Argmin

Decision-time AI cost governance platform for enterprise AI spend attribution, intervention, and governance.

## Why This Exists

Enterprise AI spend is visible at cloud-account granularity but usually not attributable to the team/workload level needed for governance, chargeback, and intervention. Argmin closes that gap by combining:

- Immutable multi-source event ingestion.
- Heuristic reconciliation with calibrated confidence.
- Materialized O(1) attribution index for hot-path decisions.
- Safe interception with strict fail-open semantics.

## Demo First (Recommended)

### Run locally (30-second path)

Prerequisites:

- Python `3.12+`
- `bash`

Get into the repository root first.

If you cloned the repository:

```bash
git clone https://github.com/argmin-com/argmin-demo.git
cd argmin-demo
```

If you downloaded the ZIP from GitHub:

```bash
cd /path/to/where/you/unzipped/argmin-demo
```

You are in the correct directory if `ls` shows files such as:

- `README.md`
- `pyproject.toml`
- `scripts/`
- `frontend/`

```bash
./scripts/run_demo.sh
```

Open the demo:

- `http://localhost:8000/platform/`

If port `8000` is occupied:

```bash
ACI_DEMO_PORT=8010 ./scripts/run_demo.sh
```

Then open `http://localhost:8010/platform/`.

If you prefer not to `cd` into the repo first, you can also launch it with an
absolute path:

```bash
/absolute/path/to/argmin-demo/scripts/run_demo.sh
```

`./scripts/run_demo.sh` launches the explicit `demo` profile:

- single worker
- in-memory graph/event/index backends
- deterministic startup seeding
- auth bypass enabled only for the demo profile

The dashboard and control-plane views are populated on startup. Use **Reset Demo**
in the Guided Demo drawer to restore the baseline presentation state, or
**Initialize Demo** if you want to reseed backend demo data during a walkthrough.
If the local demo runtime is unavailable during initialization, the walkthrough
continues on deterministic local demo data so the story still plays cleanly.

In the UI:

1. Open **Guided Demo** from the top bar.
2. Click **Start 90-sec Walkthrough**.
3. Narrate the walkthrough in the same six-step order the UI uses:
   - Overview
   - Employee Adoption
   - Request Proof
   - Interventions
   - Forecasting
   - Governance
4. If the forecast API is unavailable, the Forecasting view continues using a
   local directional estimate derived from the demo dataset and scenario
   assumptions.
5. Use the persistent audience lens and active-context ribbons to keep the same
   request, team, model, and intervention visible as you move between views.
6. Navigate the left rail across:
   - Overview
   - Employee Adoption
   - Models
   - Teams
   - Manual Mapping
   - Interventions
   - Forecasting
   - Governance
   - Integrations
   - Request Proof
   - Glossary
   - FAQ

For the API-level walkthrough, use [docs/demo-guide.md](docs/demo-guide.md).
For the view-by-view demo reference, see [docs/demo-feature-matrix.md](docs/demo-feature-matrix.md).
For policy semantics and enforcement behavior, see [docs/policy-reference.md](docs/policy-reference.md).
For ingestion contracts and examples, see [docs/ingestion-reference.md](docs/ingestion-reference.md).
For automated end-to-end demo verification, run `./scripts/smoke_demo.sh`.

## Runtime Profiles

### Demo profile

- Launcher: `./scripts/run_demo.sh`
- Compose: `docker compose -f docker-compose.demo.yml up --build`
- Backend selection:
  - `ACI_GRAPH_BACKEND=memory`
  - `ACI_EVENT_BUS_BACKEND=memory`
  - `ACI_INDEX_BACKEND=memory`
  - `ACI_INTERCEPTOR_CIRCUIT_STATE_BACKEND=local`

This is the recommended profile because it is deterministic,
single-process, and pre-seeded.

### Shared-backend profile

- Compose: `docker compose up --build`
- Backend selection:
  - `ACI_GRAPH_BACKEND=neo4j`
  - `ACI_EVENT_BUS_BACKEND=kafka`
  - `ACI_INDEX_BACKEND=redis`
  - `ACI_INTERCEPTOR_CIRCUIT_STATE_BACKEND=redis`

This path exercises the durable/shared topology. It is the right local profile for validating
backend wiring rather than for the shortest-path demo.

## Platform Architecture

The architecture is easiest to read in two layers:

- the core attribution and decision-time path
- the surrounding platform services that make the product operationally useful

### Core Attribution and Decision-Time Path

This is the data plane that turns raw enterprise telemetry into a low-latency
decision surface for interception and reporting.

```mermaid
flowchart LR
  S["Data Sources<br/>Billing / SCM / CI-CD / Identity / Runtime"] --> I["Ingestion"]
  I --> K[("Event Bus")]
  K --> H["Reconciliation (HRE)"]
  H --> G[("Graph Store (Tier 1)<br/>Authoritative Attribution Graph")]
  G --> M["Materialization"]
  M --> R[("Attribution Index (Tier 2)")]
  R --> X["Interception<br/>Decision-time governance"]
  R --> Y["Reporting / Dashboards / Exports"]
```

### Platform Services

The same core data plane also feeds the pricing, analytics, planning,
intervention, and integration surfaces that appear in the product runtime.

```mermaid
flowchart LR
  S["Data Sources<br/>Billing / SCM / CI-CD / Identity / Runtime"] --> I["Ingestion"]
  I --> K[("Event Bus")]
  K --> H["Reconciliation (HRE)"]
  H --> G[("Graph Store (Tier 1)<br/>Authoritative Attribution Graph")]
  G --> M["Materialization"]
  M --> R[("Attribution Index (Tier 2)")]

  R --> X["Interception<br/>Decision-time governance"]
  R --> Y["Reporting / Dashboards / Exports"]

  P["Policy Engine"] --> X
  G --> C["Pricing + Reconciliation"]
  R --> A["Adoption Analytics"]
  C --> F["Forecasting"]
  R --> V["Intervention Registry"]
  V --> N["Notification Hub / Integrations"]
  A --> Y
  C --> Y
  F --> Y
  V --> Y
```

## Technical Guarantees

- Interceptor never performs synchronous graph traversal or remote policy RPC on the hot path.
- Fail-open behavior protects application availability under timeout/error conditions.
- Schema validation occurs before events enter the append-only bus.
- Policy and intervention decisions emit immutable audit events.
- Shared-backend mode supports Kafka, Redis, and Neo4j adapters behind explicit config.
- Pricing rules, reconciliation records, and intervention lifecycle state can run
  in memory for demo use or on Redis-backed durable storage for multi-pod runtime.

## API Surface

### Public operational endpoints

- `GET /`
- `GET /health`
- `GET /live`
- `GET /ready`
- `GET /metrics`
- `GET /metrics/prometheus`

### Authenticated API endpoints (`/v1/*`)

- `POST /v1/events/ingest`
- `POST /v1/events/ingest/batch`
- `POST /v1/intercept`
- `POST /v1/trac`
- `POST /v1/policy/evaluate`
- `POST /v1/demo/bootstrap` (non-production only)
- `POST /v1/demo/mode` (non-production only)
- `GET /v1/attribution/{workload_id}`
- `POST /v1/attribution/manual`
- `GET /v1/index/lookup?key=...`
- `GET /v1/index/stats`
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

## Security Posture

Implemented controls include:

- JWT auth on `/v1/*` (issuer/audience/scope/tenant validation).
- Additional mutation scopes for pricing catalog writes, intervention lifecycle
  changes, and live outbound notification delivery.
- Startup-time guardrails preventing unsafe production config.
- Ingestion rate limiting and batch-size bounds.
- Durable-bus idempotency with tenant-scoped dedup keys.
- HTTPS allowlisting and private-target blocking for live webhook delivery.
- Kubernetes security baseline (`runAsNonRoot`, dropped capabilities, read-only root filesystem, probes, PDBs, network policies).
- Dependency and static-analysis gates in CI (ruff, strict mypy, pytest, CodeQL, dependency review).

See:

- [SECURITY.md](SECURITY.md)
- [docs/architecture.md](docs/architecture.md)
- [docs/policy-reference.md](docs/policy-reference.md)
- [docs/ingestion-reference.md](docs/ingestion-reference.md)
- [docs/releasing.md](docs/releasing.md)

## Performance and Validation

- Latency and fail-open validation suite: `tests/glass_jaw/`
- Unit/integration coverage across API, event bus, graph, policy, interception, and regression controls.

Run quality gates locally:

```bash
ruff check src tests
mypy src tests --strict
pytest -q
```

## CI/CD and Release Workflows

GitHub Actions workflows under `.github/workflows/`:

- `ci.yml`: lint, strict mypy, dependency review, lockfile consistency, unit/integration/latency tests, Docker smoke, and SBOM artifact.
- `codeql.yml`: static analysis.
- `dependency-review.yml`: dependency risk gate on PRs.
- `cache-hygiene.yml`: periodic cache maintenance.
- `release.yml`: manual SemVer release dispatch — quality gate, artifact assembly, immutable tag creation, and GitHub release publication.

For the release operator guide, see [docs/releasing.md](docs/releasing.md).

## Repository Layout

```text
src/aci/
  api/            FastAPI service and auth middleware
  core/           Event bus, orchestration, schema validation
  hre/            Heuristic reconciliation engine
  graph/          Graph store abstraction
  index/          Materialization and serving index
  interceptor/    Fail-open gateway and circuit breaker
  policy/         Governance policy engine
  trac/           TRAC calculations
  equivalence/    Model equivalence verification
  benchmark/      Federated benchmarking protocol
  models/         Domain models

frontend/         Investor-facing demo UI
k8s/base/         Reference Kubernetes manifests
infra/onboarding/ CloudFormation/Terraform onboarding templates
docs/             Technical documentation
tests/            Unit, integration, and latency/fail-open validation suites
wiki-src/         GitHub wiki source
```

## Wiki

- [wiki-src/Home.md](wiki-src/Home.md)
- [wiki-src/Technical-Architecture.md](wiki-src/Technical-Architecture.md)
- [wiki-src/Security-and-Trust-Boundary.md](wiki-src/Security-and-Trust-Boundary.md)
- [wiki-src/Operations-and-Deployment.md](wiki-src/Operations-and-Deployment.md)
- [wiki-src/Technical-Due-Diligence-Guide.md](wiki-src/Technical-Due-Diligence-Guide.md)
