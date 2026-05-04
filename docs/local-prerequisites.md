# Local Prerequisites

This repo has two local runtime paths:

- `demo`: the recommended laptop demo. It is Python-only, memory-backed, and
  deterministic.
- `shared-backend`: an optional Docker Compose stack that exercises local Redis,
  Kafka, and Neo4j adapters for parity testing.

Run the automated preflight before setup:

```bash
./scripts/preflight_local.sh
```

For the optional shared-backend stack:

```bash
ACI_PREFLIGHT_PROFILE=shared-backend ./scripts/preflight_local.sh
```

## Requirement Matrix

| Category | `demo` profile | `shared-backend` profile | Automation |
|---|---|---|---|
| OS | macOS, Linux, or WSL2. Native Windows shells are not supported for repo scripts. | Same. Docker Desktop or Docker Engine must also support Linux containers. | `scripts/preflight_local.sh` checks `uname`. |
| Shell | `bash` for all scripts. | Same. | Script shebangs and preflight verify bash execution. |
| Python | Python `3.12+`. | Python `3.12+` if running host validation scripts; Docker image also installs Python runtime. | Preflight checks `python3`, version, `venv`, and `pip`. |
| Python package manager | `python3 -m pip`; dependencies are installed from `requirements-demo.lock` into `.venv`. | `python3 -m pip` for host validation; container dependencies come from `requirements.lock`. | Preflight checks pip; launch/validation scripts cache lockfile installs. |
| Node.js | Not required. The UI is plain HTML, CSS, and JavaScript with vendored assets. | Not required. | Preflight confirms no `package.json` exists; if one is added later it requires Node and a lockfile package manager. |
| JavaScript package manager | Not required. No `npm`, `pnpm`, or `yarn` install is needed. | Not required. | Preflight reports this explicitly unless a future JS package manifest appears. |
| Docker | Not required for the 30-second demo. | Required: Docker CLI, Docker Compose v2 plugin, and a reachable daemon. | Preflight treats Docker as optional for `demo` and required for `shared-backend`. |
| Database and queues | No external database, queue, cache, or object store. The graph, event bus, index, pricing, reconciliation, interventions, adoption, and circuit state use memory/local backends. | Local Docker Compose services: Redis `6379`, Kafka `9092`, Neo4j browser `7474`, Neo4j Bolt `7687`. No cloud database credentials are required. | Preflight documents the active backend mode and validates Compose rendering for `shared-backend`. |
| Browser | A modern evergreen browser. The UI is served at `/platform/` and uses local assets only. | Same. | Preflight checks for an OS browser opener when possible and warns if the URL must be opened manually. Set `ACI_PREFLIGHT_STRICT_BROWSER=1` to fail instead of warn. |
| Ports | `ACI_DEMO_PORT`, default `8000` for `start_demo.sh` and `run_demo.sh`; smoke default is `8010`. | Compose maps API `8000`, Redis `6379`, Kafka `9092`, Neo4j `7474` and `7687`. | Preflight checks required ports are free unless `ACI_PREFLIGHT_REQUIRE_PORT_FREE=0`. |
| Network access | First dependency install needs package-index access unless `.venv` is already populated. Runtime demo uses local data and simulated notifications. | Docker image pulls/builds need registry access unless images are cached. Runtime services are local. | Launch scripts reuse dependency stamps; notification live network is forced off in demo. |

## Preflight Profiles

| Command | What it checks |
|---|---|
| `./scripts/preflight_local.sh` | Demo profile prerequisites and default demo port `8000`. |
| `ACI_PREFLIGHT_PROFILE=smoke-demo ./scripts/preflight_local.sh` | Smoke-test profile and default smoke port `8010`. |
| `ACI_PREFLIGHT_PROFILE=validate ./scripts/preflight_local.sh` | Local lint/type/test prerequisites. If `ACI_VALIDATE_SMOKE=1`, it also checks the smoke port. |
| `ACI_PREFLIGHT_PROFILE=shared-backend ./scripts/preflight_local.sh` | Docker, Compose, daemon reachability, Compose config, and shared-backend ports. |
| `ACI_PREFLIGHT_PROFILE=all ./scripts/preflight_local.sh` | Demo, smoke, and shared-backend prerequisites together. |

## Port Overrides

For the primary demo:

```bash
ACI_DEMO_PORT=8010 ./scripts/start_demo.sh
```

For smoke validation:

```bash
ACI_DEMO_PORT=8026 ./scripts/smoke_demo.sh
```

The shared-backend Compose file currently maps fixed local ports. Stop
conflicting local services before running `./scripts/smoke_stack.sh`.

## Setup Commands

Recommended local demo:

```bash
./scripts/start_demo.sh
```

The script runs preflight, installs locked demo dependencies, starts the local
API/UI, resets seeded data, opens the browser, and prints synthetic demo login
personas.

Full local quality gate:

```bash
./scripts/validate_local.sh
```

Quality gate plus end-to-end demo smoke on a non-default port:

```bash
ACI_VALIDATE_SMOKE=1 ACI_DEMO_PORT=8026 ./scripts/validate_local.sh
```

The smoke path includes the golden demo checks for login personas, navigation,
seeded dummy data, mock API success states, presenter-critical workflows, and a
controlled failure response.

Optional shared-backend parity smoke:

```bash
ACI_PREFLIGHT_PROFILE=shared-backend ./scripts/preflight_local.sh
./scripts/smoke_stack.sh
```

## Intentional Non-Requirements

- No production credentials.
- No cloud database, queue, object storage, secret manager, or identity provider.
- No Node build.
- No browser extension.
- No Docker requirement for the default demo path.
