#!/usr/bin/env bash
# DEMO_ONLY_RESET: clears generated local artifacts and reseeds synthetic demo
# state through `/v1/demo/reset`. This is not a production rollback, data
# deletion, tenant reset, or cloud recovery mechanism.
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PORT="${ACI_DEMO_PORT:-8010}"
BASE_URL="${ACI_DEMO_BASE_URL:-http://127.0.0.1:${PORT}}"
PUBLIC_URL="${ACI_DEMO_PUBLIC_URL:-http://localhost:${PORT}}"
APP_RESET_URL="${ACI_RESET_APP_URL:-${PUBLIC_URL}/platform/?reset=1}"
OPEN_BROWSER="${ACI_RESET_OPEN_BROWSER:-1}"
CLEAR_GENERATED="${ACI_RESET_CLEAR_GENERATED:-1}"
CURL_CONNECT_TIMEOUT="${ACI_CURL_CONNECT_TIMEOUT:-2}"
CURL_MAX_TIME="${ACI_CURL_MAX_TIME:-10}"
CURL_OPTS=(-fsS --connect-timeout "${CURL_CONNECT_TIMEOUT}" --max-time "${CURL_MAX_TIME}")

fail() {
  echo "Demo reset failed: $*" >&2
  exit 1
}

on_error() {
  local status=$?
  fail "command failed near line ${BASH_LINENO[0]}: ${BASH_COMMAND}"
  exit "${status}"
}
trap on_error ERR

validate_port_number() {
  local port="$1"
  if [[ ! "${port}" =~ ^[0-9]+$ ]] || (( port < 1 || port > 65535 )); then
    fail "ACI_DEMO_PORT must be a numeric TCP port from 1 to 65535; got '${port}'."
  fi
}

validate_bool() {
  local name="$1"
  local value="$2"
  if [[ "${value}" != "0" && "${value}" != "1" ]]; then
    fail "${name} must be 0 or 1; got '${value}'."
  fi
}

require_command() {
  local command_name="$1"
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    fail "${command_name} is required"
  fi
}

is_live_pid_file() {
  local pid_file="$1"
  local pid=""

  if [[ ! -f "${pid_file}" ]]; then
    return 1
  fi

  pid="$(tr -dc '0-9' < "${pid_file}" | head -c 20 || true)"
  [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null
}

clear_generated_state() {
  if [[ "${CLEAR_GENERATED}" != "1" ]]; then
    echo "Generated artifact cleanup skipped because ACI_RESET_CLEAR_GENERATED=${CLEAR_GENERATED}."
    return 0
  fi

  local removed=0
  local artifact
  local pid_file

  shopt -s nullglob

  for artifact in "${REPO_ROOT}"/.demo-smoke*.log; do
    rm -f "${artifact}"
    ((removed += 1))
  done

  for pid_file in "${REPO_ROOT}"/.demo-start-*.pid; do
    if is_live_pid_file "${pid_file}"; then
      echo "Preserving active server PID file: ${pid_file#${REPO_ROOT}/}"
      continue
    fi
    rm -f "${pid_file}"
    ((removed += 1))
  done

  for artifact in "${REPO_ROOT}"/.demo-start-*.log; do
    pid_file="${artifact%.log}.pid"
    if [[ -f "${pid_file}" ]] && is_live_pid_file "${pid_file}"; then
      echo "Preserving active server log: ${artifact#${REPO_ROOT}/}"
      continue
    fi
    rm -f "${artifact}"
    ((removed += 1))
  done

  shopt -u nullglob
  echo "Cleared ${removed} generated demo artifact(s)."
}

open_reset_url() {
  if [[ "${OPEN_BROWSER}" != "1" ]]; then
    echo "Browser reset skipped because ACI_RESET_OPEN_BROWSER=${OPEN_BROWSER}."
    return 0
  fi

  echo "Opening browser reset URL: ${APP_RESET_URL}"
  if command -v open >/dev/null 2>&1; then
    open "${APP_RESET_URL}" >/dev/null 2>&1 || echo "Could not open browser automatically."
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "${APP_RESET_URL}" >/dev/null 2>&1 || echo "Could not open browser automatically."
  elif command -v wslview >/dev/null 2>&1; then
    wslview "${APP_RESET_URL}" >/dev/null 2>&1 || echo "Could not open browser automatically."
  elif command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe Start-Process "${APP_RESET_URL}" >/dev/null 2>&1 \
      || echo "Could not open browser automatically."
  else
    echo "No browser opener found. Open ${APP_RESET_URL} manually."
  fi
}

cd "${REPO_ROOT}"
validate_port_number "${PORT}"
validate_bool "ACI_RESET_OPEN_BROWSER" "${OPEN_BROWSER}"
validate_bool "ACI_RESET_CLEAR_GENERATED" "${CLEAR_GENERATED}"
require_command curl
require_command python3

clear_generated_state

echo "Resetting Argmin demo runtime at ${BASE_URL}"

reset_payload="$(curl "${CURL_OPTS[@]}" -X POST "${BASE_URL}/v1/demo/reset" \
  -H "Content-Type: application/json" \
  -d '{}')" || fail "demo reset/seed endpoint failed at ${BASE_URL}/v1/demo/reset. Start the demo first with ./scripts/start_demo.sh."

curl "${CURL_OPTS[@]}" "${BASE_URL}/health" >/dev/null || fail "health endpoint failed after reset"
curl "${CURL_OPTS[@]}" "${BASE_URL}/ready" >/dev/null || fail "readiness endpoint failed after reset"
curl "${CURL_OPTS[@]}" "${BASE_URL}/platform/" >/dev/null || fail "platform UI did not respond after reset"
curl "${CURL_OPTS[@]}" "${BASE_URL}/v1/attribution/customer-support-bot" >/dev/null \
  || fail "seeded attribution check failed after reset"

python3 - "${reset_payload}" "${APP_RESET_URL}" <<'PY'
import json
import sys

payload = json.loads(sys.argv[1])
app_reset_url = sys.argv[2]
print("Reset complete")
print(f"- token: {payload.get('reset_token', 'unknown')}")
print(f"- reference_time: {payload.get('reference_time', 'unknown')}")
print(f"- seeded_entries: {payload.get('seeded_entries', 0)}")
print(f"- scenarios: {len(payload.get('scenario_ids', []))}")
print(f"- demo_accounts: {len(payload.get('demo_accounts', []))}")
print(f"- mode: {payload.get('interceptor_mode', 'unknown')}")
print(f"- browser_reset_url: {app_reset_url}")
print("- browser session reset: open URL clears Argmin demo session state and returns to Overview")
PY

open_reset_url
