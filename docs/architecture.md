# Architecture

## System Overview

The Argmin platform implements a six-phase data flow connecting passive enterprise signal
ingestion to decision-time AI inference intervention. The system operates within the
customer's VPC; raw telemetry never leaves the customer's trust boundary.

## Two-Tier Graph Architecture

**Tier 1: Authoritative Property Graph (Neo4j)**
Full property graph with time-versioned edges. Maintained asynchronously by the
reconciliation engine. Never queried on the decision-time critical path.
Supports point-in-time traversal for historical attribution reconstruction.

For local demos and tests, the same graph interface is backed by an explicit
`InMemoryGraphStore`. The demo profile does not pretend to be the production topology;
it uses the in-memory backend deliberately for deterministic local demonstrations.

**Tier 2: Precomputed Attribution Index (Redis + Local Process Cache)**
Flat, denormalized index entries optimized for O(1) hash lookups. Materialized
from Tier 1 by the index builder. This is the ONLY data structure the interceptor
reads at decision time.

## Data Flow Phases

### Phase 1: Ingestion
OTel-native passive ingestion from existing log pipelines (CloudWatch, Datadog,
cloud billing APIs). No bespoke host-level agents. Integration contract defines
minimum required fields, optional enrichment, and fallback behavior.

Before acceptance into the bus, events are validated against strict per-type schemas.
Malformed payloads are rejected at ingest-time (HTTP 422) and never enter replay history.
Ingress also enforces request-body, JSON-depth, and JSON-key-count bounds before the
payload is accepted into replayable state.

Connectors: AWS CUR, CloudTrail, Bedrock Telemetry, GitHub Webhooks, and Okta
identity feeds.

### Phase 2: Reconciliation (HRE)
The Heuristic Reconciliation Engine processes events and resolves entities across
disconnected enterprise systems. Six methods with calibrated confidence:

| Method | Strategy | Confidence Range | Example |
|--------|----------|------------------|---------|
| R1 | Direct identifier matching | 0.98-1.00 | API key in team registry |
| R2 | Temporal correlation | 0.70-0.95 | Deploy event 2min before traffic |
| R3 | Naming convention analysis | 0.60-0.90 | `nlp-experiment-7` matches NLP team repos |
| R4 | Historical pattern matching | 0.50-0.85 | Bayesian prior from past attributions |
| R5 | Service account resolution | 0.50-0.75 | Shared account with deployment owners |
| R6 | Proportional allocation | 0.30-0.65 | Fallback: split across known users |

Multiple signals are combined via modified noisy-OR with dependency penalties.
Combined confidence is capped at 0.95.

Execution safeguards:
- Time-bounded reconciliation with fallback result generation.
- Target-cluster fanout caps to prevent pathological combinatorics.
- Bounded historical sample windows.
- Short-lived result caching for bursty repeated entities.

### Phase 3: Attribution
Graph traversal from workload through the six-layer attribution chain:
Model -> Service -> Code -> Identity -> Organization -> Budget.

Fractional attribution: cost is treated as a fluid splitting across weighted edges
when multiple attribution paths exist.

### Phase 4: Materialization
The index builder transforms full attribution results into compact index entries
for O(1) serving. Entries are versioned (old entries superseded, not overwritten).
Incremental updates; full rebuild on backfill.

### Phase 5: Interception
Fail-open interceptor with 20ms timeout budget. Three deployment modes:
Passive (observe), Advisory (enrich headers), Active (modify/redirect).
Circuit breaker with probabilistic shadow warming for cache coherence.
Operationally, the interceptor also maintains a rolling fail-open alert window so
prolonged degraded enforcement becomes visible in health and dashboard surfaces
instead of remaining an implicit runtime tradeoff.

### Phase 6: Reporting
Dashboards, compliance exports, federated benchmarks with differential privacy.
This reporting layer now also includes workforce adoption analytics, with rollups
across team, business unit, and organization scopes so reviewers can inspect how
AI usage is spreading internally and where adoption quality differs from raw spend.

## Supporting Control-Plane Services

The API runtime also exposes a set of operator-facing support services that are
deliberately decoupled from the decision-time interceptor hot path:

- **Pricing Catalog**: versioned provider/model rate tables with deterministic
  snapshot IDs and provenance fields for audit.
- **Reconciliation Ledger**: synthetic-vs-reconciled request cost tracking with
  drift summaries by provider or service.
- **Adoption Analytics**: employee-level AI usage rollups and executive dashboards
  that aggregate active users, repeat usage, governed usage, entry-point mix, and
  spend-per-active-user across team, business-unit, and organization scopes.
- **Spend Forecast Engine**: lightweight linear-trend forecasting for planning
  views and scenario analysis.
- **Intervention Registry**: governed lifecycle for optimization
  recommendations, including explicit transition history.
- **Notification Hub**: simulated-by-default delivery for Slack, webhook, and
  email channels, with live delivery restricted by scope and HTTPS allowlisting.
  The integrations surface builds on this with explicit business workflow routes
  and named scenarios so downstream ownership, SLA, and expected action are part
  of the product contract rather than implicit transport details.

These services can run purely in memory for local demos or use Redis-backed
durable state for multi-pod environments.

## Event Sourcing

The event bus (Kafka) is the system of record. The graph is derived state that
can be rebuilt deterministically from the event log. This enables:
- Backfill when late-arriving events require recomputation
- Version replay across attribution logic variants
- Audit trail reconstruction for compliance

Operational safeguards:
- Redis-backed idempotency keys (TTL) for dedup durability.
- Dead-letter topic for poison events or handler failures.
- Consumer lag metrics exported for replay and processing SLO monitoring.

## Runtime Profiles

- `demo`: single-worker, in-memory graph/event/index backends with deterministic seeding.
- `development` via `docker-compose.yml`: shared-backend local stack using Neo4j + Kafka + Redis.
- `production/staging`: role-segregated gateway/processor deployments with explicit backend selection.

Production-specific guardrails:
- Continuous differential-privacy noise is disallowed; secure discrete noise is
  required for federated benchmarking.
- Live notification delivery requires HTTPS targets, hostname allowlisting, and
  production-safe network destinations.
- Oversized ingestion requests are rejected before request-body parsing to bound
  memory exposure.

## Confidence Governance

Empirical calibration via isotonic regression, per reconciliation method.
Three-tier calibration strategy based on ground truth sample count:
- >= 200 samples: full isotonic regression
- 50-199 samples: bootstrap confidence intervals
- < 50 samples: conservative warm-start defaults

Warm-start curves are derived from synthetic enterprise environments and
progressively replaced as customer-specific ground truth accumulates.

## TRAC Metric

The backend TRAC services currently compute:

Default MVP `TRAC(workload) = Billed Cost + Confidence Risk Premium`

Operationally, the current demo and investor-facing UI emphasize billed cost
and confidence risk premium because those are the most decision-relevant terms
for the walkthrough. The backend still retains optional sustainability-aware
decomposition primitives, but those are not surfaced in the current demo
experience.

## Security Model

- Designed for deployment within the customer trust boundary
- JWT-based service authentication on `/v1/*`
- Team-scoped attribution and policy context
- Correlation IDs propagate from inbound HTTP requests into decision-time audit
  events so request, policy, and intervention logs can be tied together.
- Non-root container execution with read-only root filesystem
- No secrets in images; injected at runtime
- Segmented gateway/processor deployments with default-deny network policies
- Gateway role restricted to decision-time interception and read-only index access
