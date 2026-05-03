#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PORT="${ACI_DEMO_PORT:-8000}"
BASE_URL="http://127.0.0.1:${PORT}"
PUBLIC_URL="http://localhost:${PORT}"
APP_URL="${PUBLIC_URL}/platform/?reset=1"
SERVER_LOG="${REPO_ROOT}/.demo-start-${PORT}.log"
PID_FILE="${REPO_ROOT}/.demo-start-${PORT}.pid"
OPEN_BROWSER="${ACI_START_OPEN_BROWSER:-1}"
DETACH="${ACI_START_DETACH:-0}"
DEMO_PASSWORD="${ACI_START_DEMO_PASSWORD:-argmin-demo-local}"
REUSED_EXISTING=0
SERVER_PID=""

fail() {
  echo "Demo startup failed: $*" >&2
  if [[ -f "${SERVER_LOG}" ]]; then
    echo "--- ${SERVER_LOG} ---" >&2
    tail -n 120 "${SERVER_LOG}" >&2
  fi
  exit 1
}

cleanup() {
  if [[ "${DETACH}" != "1" && "${REUSED_EXISTING}" != "1" ]]; then
    if [[ -n "${SERVER_PID}" ]] && kill -0 "${SERVER_PID}" 2>/dev/null; then
      kill "${SERVER_PID}" 2>/dev/null || true
      wait "${SERVER_PID}" 2>/dev/null || true
    fi
    rm -f "${PID_FILE}"
  fi
}
trap cleanup EXIT INT TERM

require_command() {
  local command_name="$1"
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    fail "${command_name} is required"
  fi
}

is_demo_healthy() {
  curl -fsS "${BASE_URL}/health" >/dev/null 2>&1
}

wait_for_endpoint() {
  local endpoint="$1"
  local label="$2"
  local attempts="${3:-90}"

  for _ in $(seq 1 "${attempts}"); do
    if curl -fsS "${BASE_URL}${endpoint}" >/dev/null 2>&1; then
      return 0
    fi
    if [[ -n "${SERVER_PID}" ]] && ! kill -0 "${SERVER_PID}" 2>/dev/null; then
      fail "server process exited before ${label} became ready"
    fi
    sleep 1
  done

  fail "${label} did not become ready at ${BASE_URL}${endpoint}"
}

open_demo_url() {
  if [[ "${OPEN_BROWSER}" != "1" ]]; then
    echo "Browser open skipped because ACI_START_OPEN_BROWSER=${OPEN_BROWSER}."
    return 0
  fi

  if command -v open >/dev/null 2>&1; then
    open "${APP_URL}" >/dev/null 2>&1 || echo "Could not open browser automatically."
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "${APP_URL}" >/dev/null 2>&1 || echo "Could not open browser automatically."
  elif command -v wslview >/dev/null 2>&1; then
    wslview "${APP_URL}" >/dev/null 2>&1 || echo "Could not open browser automatically."
  elif command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe Start-Process "${APP_URL}" >/dev/null 2>&1 \
      || echo "Could not open browser automatically."
  else
    echo "No browser opener found. Open ${APP_URL} manually."
  fi
}

print_startup_summary() {
  local reset_payload="$1"

  python3 - "${reset_payload}" "${PUBLIC_URL}" "${APP_URL}" "${DEMO_PASSWORD}" "${REUSED_EXISTING}" <<'PY'
import json
import sys

payload = json.loads(sys.argv[1])
public_url = sys.argv[2]
app_url = sys.argv[3]
password = sys.argv[4]
reused_existing = sys.argv[5] == "1"
accounts = [
    account
    for account in payload.get("demo_accounts", [])
    if str(account.get("status", "")).lower() == "active"
]

print("")
print("Argmin demo is ready.")
print(f"- app: {app_url}")
print(f"- API base: {public_url}")
print(f"- server: {'reused existing healthy process' if reused_existing else 'started new local process'}")
print(f"- reset token: {payload.get('reset_token', 'unknown')}")
print(f"- reference time: {payload.get('reference_time', 'unknown')}")
print(f"- seeded workloads: {payload.get('seeded_entries', 0)}")
print(f"- workflow scenarios: {len(payload.get('scenario_ids', []))}")
print("")
print("Demo login credentials")
print("- auth mode: local demo auth bypass is enabled; these are synthetic presenter personas")
print("- password for all active personas: " + password)
for account in accounts:
    email = account.get("email", "")
    name = account.get("name", "")
    role = account.get("role", "")
    if email:
        print(f"- {role}: {email} / {password} ({name})")
print("")
print("Presenter controls")
print("- open Guided Demo, then Start Full Walkthrough")
print("- Reset Demo restores browser and backend state")
PY
}

cd "${REPO_ROOT}"
require_command curl
require_command python3

if is_demo_healthy; then
  REUSED_EXISTING=1
  echo "Reusing healthy Argmin demo already running at ${BASE_URL}."
else
  ACI_PREFLIGHT_PROFILE=demo ACI_DEMO_PORT="${PORT}" "${SCRIPT_DIR}/preflight_local.sh"
  rm -f "${SERVER_LOG}" "${PID_FILE}"
  echo "Starting Argmin demo services on ${BASE_URL}..."
  if [[ "${DETACH}" == "1" ]]; then
    nohup env ACI_DEMO_PORT="${PORT}" ACI_DEMO_RELOAD=0 ACI_DEMO_SKIP_PREFLIGHT=1 \
      "${SCRIPT_DIR}/run_demo.sh" >"${SERVER_LOG}" 2>&1 </dev/null &
  else
    ACI_DEMO_PORT="${PORT}" ACI_DEMO_RELOAD=0 ACI_DEMO_SKIP_PREFLIGHT=1 \
      "${SCRIPT_DIR}/run_demo.sh" >"${SERVER_LOG}" 2>&1 &
  fi
  SERVER_PID=$!
  printf '%s\n' "${SERVER_PID}" > "${PID_FILE}"
  wait_for_endpoint "/health" "health endpoint"
fi

wait_for_endpoint "/ready" "readiness endpoint"
curl -fsS "${BASE_URL}/platform/" >/dev/null || fail "platform UI did not respond"

reset_payload="$(curl -fsS -X POST "${BASE_URL}/v1/demo/reset" \
  -H "Content-Type: application/json" \
  -d '{}')" || fail "demo reset/seed endpoint failed"

print_startup_summary "${reset_payload}"
open_demo_url

if [[ "${REUSED_EXISTING}" == "1" ]]; then
  echo "Existing server left running at ${APP_URL}."
  exit 0
fi

if [[ "${DETACH}" == "1" ]]; then
  echo "Server is running in the background with PID ${SERVER_PID}."
  echo "Log file: ${SERVER_LOG}"
  echo "Stop it with: kill ${SERVER_PID}"
  exit 0
fi

echo "Server log: ${SERVER_LOG}"
echo "Press Ctrl-C to stop the local demo."
wait "${SERVER_PID}"
