#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
VENV_DIR="${ACI_DEMO_VENV_DIR:-${REPO_ROOT}/.venv}"
DEPS_STAMP="${VENV_DIR}/.argmin-demo-dev-deps.sha256"

cd "${REPO_ROOT}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required to validate the repo." >&2
  exit 1
fi

if [[ ! -d "${VENV_DIR}" ]]; then
  python3 -m venv "${VENV_DIR}"
fi

source "${VENV_DIR}/bin/activate"

current_deps_hash="$(
  python - <<'PY'
from hashlib import sha256
from pathlib import Path

digest = sha256()
for filename in ("requirements-dev.lock", "pyproject.toml"):
    path = Path(filename)
    digest.update(filename.encode())
    digest.update(b"\0")
    digest.update(path.read_bytes())
print(digest.hexdigest())
PY
)"

if [[ ! -f "${DEPS_STAMP}" ]] || [[ "$(cat "${DEPS_STAMP}")" != "${current_deps_hash}" ]]; then
  echo "Installing local validation dependencies..."
  python -m pip install --upgrade pip >/dev/null
  python -m pip install -r requirements-dev.lock >/dev/null
  python -m pip install --no-deps -e . >/dev/null
  printf '%s\n' "${current_deps_hash}" > "${DEPS_STAMP}"
else
  echo "Local validation dependencies are up to date."
fi

echo "Running Ruff..."
ruff check src tests

echo "Running mypy..."
mypy src tests --strict

echo "Running unit tests..."
pytest tests/unit -q

if [[ "${ACI_VALIDATE_FULL:-0}" == "1" ]]; then
  echo "Running integration tests..."
  pytest tests/integration -q

  echo "Running glass-jaw tests..."
  pytest tests/glass_jaw -q
fi

if [[ "${ACI_VALIDATE_SMOKE:-0}" == "1" ]]; then
  echo "Running demo smoke..."
  ./scripts/smoke_demo.sh
fi
