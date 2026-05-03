#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PORT="${ACI_DEMO_PORT:-8000}"
VENV_DIR="${ACI_DEMO_VENV_DIR:-${REPO_ROOT}/.venv}"
REQUIREMENTS_FILE="${ACI_DEMO_REQUIREMENTS_FILE:-requirements-demo.lock}"
DEPS_STAMP="${VENV_DIR}/.argmin-demo-deps.sha256"

require_python312() {
  local interpreter="$1"
  "${interpreter}" - <<'PY'
import sys

if sys.version_info < (3, 12):
    version = ".".join(str(part) for part in sys.version_info[:3])
    sys.stderr.write(f"Python 3.12+ is required; found Python {version}.\n")
    raise SystemExit(1)
PY
}

require_port_available() {
  local port="$1"
  python3 - "${port}" <<'PY'
import socket
import sys

port = int(sys.argv[1])
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind(("127.0.0.1", port))
    except OSError:
        sys.stderr.write(
            f"Port {port} is already in use. "
            f"Re-run with ACI_DEMO_PORT set to an available port.\n"
        )
        raise SystemExit(1)
PY
}

cd "${REPO_ROOT}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required to run the local demo." >&2
  exit 1
fi
require_python312 python3
require_port_available "${PORT}"

requested_environment="$(printf '%s' "${ACI_ENVIRONMENT:-demo}" | tr '[:upper:]' '[:lower:]')"
if [[ "${requested_environment}" == "production" || "${requested_environment}" == "staging" ]]; then
  echo "Refusing to run the local demo with ACI_ENVIRONMENT=${ACI_ENVIRONMENT}." >&2
  echo "The demo launcher is local-only and never connects to production/staging services." >&2
  exit 1
fi

if [[ ! -f "${VENV_DIR}/bin/activate" ]]; then
  if [[ -d "${VENV_DIR}" ]] && [[ -n "$(find "${VENV_DIR}" -mindepth 1 -maxdepth 1 -print -quit)" ]]; then
    echo "ACI_DEMO_VENV_DIR exists but is not a usable Python virtual environment: ${VENV_DIR}" >&2
    echo "Choose an empty directory, remove the partial directory, or set ACI_DEMO_VENV_DIR to a valid venv." >&2
    exit 1
  fi
  python3 -m venv "${VENV_DIR}"
fi

source "${VENV_DIR}/bin/activate"
require_python312 python

current_deps_hash="$(
  REQUIREMENTS_FILE="${REQUIREMENTS_FILE}" python - <<'PY'
from hashlib import sha256
import os
from pathlib import Path

digest = sha256()
for filename in (os.environ["REQUIREMENTS_FILE"], "pyproject.toml"):
    path = Path(filename)
    digest.update(filename.encode())
    digest.update(b"\0")
    digest.update(path.read_bytes())
print(digest.hexdigest())
PY
)"

if [[ "${ACI_DEMO_SKIP_INSTALL:-0}" != "1" ]]; then
  if [[ ! -f "${DEPS_STAMP}" ]] || [[ "$(cat "${DEPS_STAMP}")" != "${current_deps_hash}" ]]; then
    echo "Installing local demo dependencies..."
    python -m pip install --upgrade pip >/dev/null
    python -m pip install -r "${REQUIREMENTS_FILE}" >/dev/null
    printf '%s\n' "${current_deps_hash}" > "${DEPS_STAMP}"
  else
    echo "Local demo dependencies are up to date."
  fi
else
  echo "Skipping dependency installation because ACI_DEMO_SKIP_INSTALL=1."
fi

# Deterministic local-only runtime for demo mode. These are intentionally forced
# so shell-level cloud or shared-backend settings cannot leak into a laptop demo.
export ACI_ENVIRONMENT="demo"
export ACI_TENANT_ID="demo-local"
export ACI_RUNTIME_ROLE="all"
export ACI_UVICORN_WORKERS="${ACI_UVICORN_WORKERS:-1}"
export ACI_GRAPH_BACKEND="memory"
export ACI_EVENT_BUS_BACKEND="memory"
export ACI_INDEX_BACKEND="memory"
export ACI_PRICING_BACKEND="memory"
export ACI_RECONCILIATION_BACKEND="memory"
export ACI_INTERVENTIONS_BACKEND="memory"
export ACI_ADOPTION_BACKEND="memory"
export ACI_INTERCEPTOR_CIRCUIT_STATE_BACKEND="local"
export ACI_NOTIFICATION_LIVE_NETWORK="false"
export ACI_NOTIFICATION_ALLOW_PRIVATE_TARGETS="false"
export ACI_AUTH_ENABLED="true"
export ACI_AUTH_ALLOW_DEV_BYPASS="true"
export PYTHONPATH="${REPO_ROOT}/src${PYTHONPATH:+:${PYTHONPATH}}"

echo "ACI demo starting on http://localhost:${PORT}/platform/"
echo "ACI runtime profile: environment=${ACI_ENVIRONMENT} workers=${ACI_UVICORN_WORKERS} graph=${ACI_GRAPH_BACKEND} event_bus=${ACI_EVENT_BUS_BACKEND} index=${ACI_INDEX_BACKEND}"

if [[ "${ACI_DEMO_RELOAD:-0}" == "1" ]]; then
  uvicorn aci.api.app:app --host 0.0.0.0 --port "${PORT}" --reload
else
  uvicorn aci.api.app:app --host 0.0.0.0 --port "${PORT}"
fi
