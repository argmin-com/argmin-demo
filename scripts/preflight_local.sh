#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PROFILE="${ACI_PREFLIGHT_PROFILE:-${1:-demo}}"
REQUIRE_PORT_FREE="${ACI_PREFLIGHT_REQUIRE_PORT_FREE:-1}"
STRICT_BROWSER="${ACI_PREFLIGHT_STRICT_BROWSER:-0}"

failures=0
warnings=0

ok() {
  printf 'OK: %s\n' "$*"
}

warn() {
  warnings=$((warnings + 1))
  printf 'WARN: %s\n' "$*" >&2
}

fail() {
  failures=$((failures + 1))
  printf 'FAIL: %s\n' "$*" >&2
}

have_command() {
  command -v "$1" >/dev/null 2>&1
}

check_os() {
  local kernel
  kernel="$(uname -s 2>/dev/null || printf 'unknown')"
  case "${kernel}" in
    Darwin)
      ok "OS supported: macOS"
      ;;
    Linux)
      if grep -qi microsoft /proc/version 2>/dev/null; then
        ok "OS supported: Linux under WSL"
      else
        ok "OS supported: Linux"
      fi
      ;;
    *)
      fail "unsupported OS '${kernel}'. Use macOS, Linux, or WSL2 for local scripts."
      ;;
  esac
}

check_python() {
  if ! have_command python3; then
    fail "python3 is required; install Python 3.12 or newer."
    return
  fi

  if python3 - <<'PY'
import sys

if sys.version_info < (3, 12):
    version = ".".join(str(part) for part in sys.version_info[:3])
    raise SystemExit(f"Python 3.12+ is required; found Python {version}.")
PY
  then
    ok "$(python3 - <<'PY'
import sys

print(f"Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
PY
)"
  else
    fail "Python 3.12+ is required."
  fi

  if python3 -m venv --help >/dev/null 2>&1; then
    ok "python3 -m venv is available"
  else
    fail "python3 -m venv is required to create the local .venv."
  fi

  if python3 -m pip --version >/dev/null 2>&1; then
    ok "Python package manager available: python3 -m pip"
  else
    fail "python3 -m pip is required for locked dependency installation."
  fi
}

check_curl() {
  if have_command curl; then
    ok "curl is available for health checks, reset, and smoke tests"
  else
    fail "curl is required for reset and smoke verification scripts."
  fi
}

check_browser() {
  if have_command open || have_command xdg-open || have_command wslview || have_command powershell.exe; then
    ok "browser launch helper is available"
  elif [[ "${STRICT_BROWSER}" == "1" ]]; then
    fail "a modern browser is required; no command-line browser opener was found."
  else
    warn "a modern browser is required; no opener was found, so open the demo URL manually."
  fi
}

check_node_and_js_package_manager() {
  if [[ ! -f "${REPO_ROOT}/package.json" ]]; then
    ok "Node.js is not required: no package.json is present"
    ok "npm/pnpm/yarn are not required: frontend assets are vendored static files"
    return
  fi

  if have_command node; then
    ok "Node.js is available because package.json is present"
  else
    fail "package.json is present, so Node.js is required."
  fi

  if [[ -f "${REPO_ROOT}/pnpm-lock.yaml" ]]; then
    have_command pnpm && ok "pnpm is available" || fail "pnpm is required by pnpm-lock.yaml."
  elif [[ -f "${REPO_ROOT}/yarn.lock" ]]; then
    have_command yarn && ok "yarn is available" || fail "yarn is required by yarn.lock."
  elif [[ -f "${REPO_ROOT}/package-lock.json" ]]; then
    have_command npm && ok "npm is available" || fail "npm is required by package-lock.json."
  else
    warn "package.json is present without a recognized lockfile; pin npm/pnpm/yarn before adding a JS build."
  fi
}

check_required_files() {
  local file
  for file in pyproject.toml requirements-demo.lock requirements-dev.lock frontend/index.html frontend/data/demo_dataset.json; do
    if [[ -f "${REPO_ROOT}/${file}" ]]; then
      ok "required repo file exists: ${file}"
    else
      fail "required repo file is missing: ${file}"
    fi
  done
}

check_port_available() {
  local port="$1"
  local label="$2"

  if [[ "${REQUIRE_PORT_FREE}" != "1" ]]; then
    ok "port check skipped for ${label}:${port}"
    return
  fi

  if ! have_command python3; then
    warn "cannot check port ${port}; python3 is unavailable"
    return
  fi

  if python3 - "${port}" <<'PY'
import socket
import sys

port = int(sys.argv[1])
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind(("127.0.0.1", port))
    except OSError:
        raise SystemExit(1)
PY
  then
    ok "port ${port} is available for ${label}"
  else
    fail "port ${port} is already in use for ${label}; set the documented port override or stop the conflicting process."
  fi
}

check_demo_ports() {
  check_port_available "${ACI_DEMO_PORT:-8000}" "demo API and UI"
}

check_smoke_ports() {
  check_port_available "${ACI_DEMO_PORT:-8010}" "demo smoke API and UI"
}

check_shared_backend_ports() {
  check_port_available "8000" "shared-backend API"
  check_port_available "6379" "shared-backend Redis"
  check_port_available "7474" "shared-backend Neo4j browser"
  check_port_available "7687" "shared-backend Neo4j Bolt"
  check_port_available "9092" "shared-backend Kafka"
}

check_demo_databases() {
  ok "database dependency for demo profile: none; graph, event bus, index, pricing, reconciliation, interventions, adoption, and circuit state use local memory/local backends"
}

check_docker_optional_for_demo() {
  if have_command docker && docker compose version >/dev/null 2>&1; then
    ok "Docker Compose is available, but not required for the 30-second demo"
  else
    ok "Docker is not required for the 30-second demo"
  fi
}

check_shared_backend() {
  if ! have_command docker; then
    fail "Docker is required for the shared-backend profile."
    return
  fi
  ok "Docker CLI is available"

  if docker compose version >/dev/null 2>&1; then
    ok "Docker Compose plugin is available"
  else
    fail "Docker Compose v2 plugin is required for shared-backend profile."
    return
  fi

  if docker compose -f "${REPO_ROOT}/docker-compose.yml" config >/dev/null 2>&1; then
    ok "docker-compose.yml renders successfully"
  else
    fail "docker-compose.yml did not render; run 'docker compose -f docker-compose.yml config' for details."
  fi

  if docker info >/dev/null 2>&1; then
    ok "Docker daemon is reachable"
  else
    fail "Docker daemon is not reachable; start Docker Desktop or the Docker service."
  fi

  ok "database dependency for shared-backend profile: local Docker Compose services Redis, Kafka, and Neo4j"
}

run_profile() {
  case "${PROFILE}" in
    demo)
      check_demo_ports
      check_demo_databases
      check_docker_optional_for_demo
      ;;
    smoke-demo)
      check_smoke_ports
      check_demo_databases
      check_docker_optional_for_demo
      ;;
    validate)
      if [[ "${ACI_VALIDATE_SMOKE:-0}" == "1" ]]; then
        check_smoke_ports
      else
        ok "port check not required for validation without ACI_VALIDATE_SMOKE=1"
      fi
      check_demo_databases
      check_docker_optional_for_demo
      ;;
    shared-backend)
      check_shared_backend_ports
      check_shared_backend
      ;;
    all)
      check_demo_ports
      check_smoke_ports
      check_shared_backend_ports
      check_demo_databases
      check_shared_backend
      ;;
    *)
      fail "unknown preflight profile '${PROFILE}'. Use demo, smoke-demo, validate, shared-backend, or all."
      ;;
  esac
}

cd "${REPO_ROOT}"

printf 'Argmin local preflight profile: %s\n' "${PROFILE}"
check_os
ok "bash is available: ${BASH_VERSION%%(*}"
check_required_files
check_python
check_curl
check_browser
check_node_and_js_package_manager
run_profile

if (( failures > 0 )); then
  printf 'Preflight failed with %d failure(s) and %d warning(s).\n' "${failures}" "${warnings}" >&2
  exit 1
fi

printf 'Preflight passed with %d warning(s).\n' "${warnings}"
