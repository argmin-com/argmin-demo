# Demo-Only Boundaries

This repository is optimized for a credible local Argmin demo. Some surfaces are
intentionally synthetic, mocked, local-only, or presenter-controlled. They are
marked with `DEMO_ONLY_*` comments or metadata so they are not confused with
production implementation.

## Boundary Map

| Surface | Marker | Purpose | Production replacement |
|---|---|---|---|
| Deterministic seed module | `DEMO_ONLY_FIXTURE` in `src/aci/demo/seeder.py` | Seeds synthetic workloads, employees, events, integrations, interventions, and demo personas | Real tenant ingestion, connector backfills, identity sync, migrations, and durable stores |
| Demo control endpoints | `DEMO_ONLY_CONTROL_ENDPOINT` on `/v1/demo/bootstrap`, `/v1/demo/reset`, and `/v1/demo/mode` | Lets presenters reseed and switch local demo modes | Deployment workflow, production data lifecycle controls, and operator-approved rollbacks |
| Demo startup autoseed | `DEMO_ONLY_AUTO_SEED` in `src/aci/api/runtime.py` | Loads fixed synthetic state only when `ACI_ENVIRONMENT=demo` | Customer-specific bootstrap and ingestion pipeline |
| Auth bypass | `DEMO_ONLY_FAKE_AUTH_BOUNDARY` in `src/aci/api/auth.py` and `scripts/run_demo.sh` | Allows local presenter personas without SSO credentials | JWT validation, tenant-scoped RBAC, customer IdP/SCIM, and audited session management |
| Local adapters | `DEMO_ONLY_LOCAL_ADAPTER_BOUNDARY` in `scripts/run_demo.sh` | Forces memory/local graph, event bus, index, pricing, reconciliation, interventions, adoption, and circuit state | Redis, Kafka, graph database, durable state, cloud networking, and production observability |
| Frontend shell | `DEMO_ONLY_FRONTEND_SURFACE` in `frontend/assets/app.js` | Uses deterministic local data, persona simulation, and controlled API fallbacks | Production frontend backed by authenticated APIs and tenant-specific read models |
| Persona controls | `DEMO_ONLY_FAKE_AUTH_PERSONAS` in `frontend/assets/app.js` | Demonstrates role-specific menus and workflows without touching IAM | Production RBAC claims, policy evaluation, SSO groups, SCIM records, and audit trails |
| Frontend fixture | `DEMO_ONLY_SYNTHETIC_FIXTURE` in `frontend/data/demo_dataset.json` | Supplies presentation-safe dummy operating data | Production read models from real telemetry, billing, identity, connector, and governance sources |
| Startup/reset scripts | `DEMO_ONLY_LAUNCHER` and `DEMO_ONLY_RESET` in `scripts/` | One-command local startup and presenter recovery | Production deployment, incident recovery, backup/restore, and rollback procedures |

## Safety Rules

- Demo-only code must not require production credentials or cloud access.
- Demo-only launchers must refuse `production` and `staging` environments.
- Demo-only fixtures must remain synthetic and must carry explicit metadata.
- Demo-only fake auth must stay gated to local/dev/test/demo environments.
- Demo-only outbound integrations must remain simulated unless a developer
  deliberately enables live delivery in a non-production environment.
- Any production implementation that replaces a demo-only surface should add a
  separate production path instead of silently reusing the demo shortcut.

## Review Checklist

Before presenting or shipping changes, verify:

- `rg -n "DEMO_ONLY_"` shows markers on fixtures, fake auth, local adapters,
  frontend mocks, demo control endpoints, and startup/reset scripts.
- `./scripts/smoke_demo.sh` still passes without cloud credentials.
- The frontend fixture still has `meta.demo_only: true`.
- Production/staging still cannot call `/v1/demo/bootstrap`, `/v1/demo/reset`,
  or `/v1/demo/mode`.

## Deferred Production Issues

These issues track production-quality replacements for the intentional demo-only
shortcuts above:

| Production work | Issue |
|---|---|
| Replace demo fixtures with tenant ingestion pipelines | [#1](https://github.com/argmin-com/argmin-demo/issues/1) |
| Implement tenant IAM, SSO, SCIM, and RBAC enforcement | [#2](https://github.com/argmin-com/argmin-demo/issues/2) |
| Promote durable runtime stores with migrations and replay tests | [#3](https://github.com/argmin-com/argmin-demo/issues/3) |
| Add approved live notification delivery paths | [#4](https://github.com/argmin-com/argmin-demo/issues/4) |
| Replace static UI fixture with runtime-backed product read models | [#5](https://github.com/argmin-com/argmin-demo/issues/5) |
