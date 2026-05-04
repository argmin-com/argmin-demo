#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
VENV_DIR="${ACI_DEMO_VENV_DIR:-${REPO_ROOT}/.venv}"
DEPS_STAMP="${VENV_DIR}/.argmin-demo-dev-deps.sha256"

fail() {
  echo "Local validation failed: $*" >&2
  exit 1
}

on_error() {
  local status=$?
  echo "Local validation failed near line ${BASH_LINENO[0]}: ${BASH_COMMAND}" >&2
  exit "${status}"
}
trap on_error ERR

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

cd "${REPO_ROOT}"

for required_file in pyproject.toml requirements-dev.lock; do
  if [[ ! -f "${required_file}" ]]; then
    fail "required file is missing: ${required_file}. Run validation from a complete clone."
  fi
done

if [[ "${ACI_VALIDATE_SKIP_PREFLIGHT:-0}" != "1" ]]; then
  ACI_PREFLIGHT_PROFILE=validate ACI_PREFLIGHT_REQUIRE_PORT_FREE=1 "${SCRIPT_DIR}/preflight_local.sh"
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required to validate the repo." >&2
  exit 1
fi
require_python312 python3

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
