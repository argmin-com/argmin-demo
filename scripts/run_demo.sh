#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PORT="${ACI_DEMO_PORT:-8000}"
VENV_DIR="${ACI_DEMO_VENV_DIR:-${REPO_ROOT}/.venv}"
REQUIREMENTS_FILE="${ACI_DEMO_REQUIREMENTS_FILE:-requirements.lock}"
DEPS_STAMP="${VENV_DIR}/.argmin-demo-deps.sha256"

cd "${REPO_ROOT}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required to run the local demo." >&2
  exit 1
fi

if [[ ! -d "${VENV_DIR}" ]]; then
  python3 -m venv "${VENV_DIR}"
fi

source "${VENV_DIR}/bin/activate"

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
    python -m pip install --no-deps -e . >/dev/null
    printf '%s\n' "${current_deps_hash}" > "${DEPS_STAMP}"
  else
    echo "Local demo dependencies are up to date."
  fi
else
  echo "Skipping dependency installation because ACI_DEMO_SKIP_INSTALL=1."
fi

# Deterministic local runtime defaults for demo mode.
export ACI_ENVIRONMENT="${ACI_ENVIRONMENT:-demo}"
export ACI_RUNTIME_ROLE="${ACI_RUNTIME_ROLE:-all}"
export ACI_UVICORN_WORKERS="${ACI_UVICORN_WORKERS:-1}"
export ACI_GRAPH_BACKEND="${ACI_GRAPH_BACKEND:-memory}"
export ACI_EVENT_BUS_BACKEND="${ACI_EVENT_BUS_BACKEND:-memory}"
export ACI_INDEX_BACKEND="${ACI_INDEX_BACKEND:-memory}"
export ACI_INTERCEPTOR_CIRCUIT_STATE_BACKEND="${ACI_INTERCEPTOR_CIRCUIT_STATE_BACKEND:-local}"
export ACI_AUTH_ENABLED="${ACI_AUTH_ENABLED:-true}"
export ACI_AUTH_ALLOW_DEV_BYPASS="${ACI_AUTH_ALLOW_DEV_BYPASS:-true}"

echo "ACI demo starting on http://localhost:${PORT}/platform/"
echo "ACI runtime profile: environment=${ACI_ENVIRONMENT} workers=${ACI_UVICORN_WORKERS} graph=${ACI_GRAPH_BACKEND} event_bus=${ACI_EVENT_BUS_BACKEND} index=${ACI_INDEX_BACKEND}"

if [[ "${ACI_DEMO_RELOAD:-0}" == "1" ]]; then
  uvicorn aci.api.app:app --host 0.0.0.0 --port "${PORT}" --reload
else
  uvicorn aci.api.app:app --host 0.0.0.0 --port "${PORT}"
fi
