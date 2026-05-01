# Technical Due Diligence Guide

This page summarizes the primary technical signals for architecture quality, execution rigor, and production readiness.

## Assessment Guide

1. Verify deterministic hot-path behavior in the interceptor.
2. Validate fail-open semantics under timeout/error scenarios.
3. Confirm strict schema validation before event-bus ingress.
4. Inspect security controls (auth, tenancy, infrastructure baselines).
5. Review quality gates and test coverage depth.

## What to Inspect First

- API and runtime composition: `src/aci/api/app.py`
- Interceptor safety model: `src/aci/interceptor/gateway.py`
- Event integrity and durability model: `src/aci/core/event_bus.py`
- Strict payload contracts: `src/aci/core/event_schema.py`
- Materialized index serving model: `src/aci/index/materializer.py`

## Demonstration Path

1. Launch the stack and open `/platform/`.
2. Open **Guided Demo** and use **Start 90-sec Walkthrough** to step through the
   default investor walkthrough.
3. Walk the core story in-product:
   - Overview
   - Employee Adoption
   - Request Proof
   - Interventions
   - Forecasting
   - Governance
4. Use the individual drawer scenarios to inspect the three live proof points:
   - Enriched request
   - Policy-driven soft stop
   - Fail-open on unknown workload
5. Cross-check with `GET /v1/dashboard/overview`, `GET /metrics`, and `GET /metrics/prometheus`.

Notes:
- Use **Reset Demo** to restore the presentation state.
- Use **Initialize Demo** only when you want to reseed backend demo data.
- If initialization fails, the guided walkthrough continues on deterministic
  local demo data so the product story still completes coherently.
- Forecasting remains usable even if the live planning endpoint is unavailable
  because the UI falls back to a local directional estimate.

## Strength Signals

- Clear separation between asynchronous reconciliation and decision-time interception.
- Explicitly bounded behavior around headers, token budgets, and rate limits.
- Durable-bus + deduplication semantics with DLQ and lag instrumentation.
- Strict CI profile (`ruff`, strict `mypy`, tests, static/dependency analysis).

## Deployment Considerations

- Environment-specific integrations (cloud/IdP connectors) are deployment-context dependent.
- Production secrets/KMS integration should be validated in target customer environments.
- Capacity and SLO posture should be validated with design-partner traffic envelopes.
