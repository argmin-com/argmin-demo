#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PORT="${ACI_DEMO_PORT:-8010}"
BASE_URL="http://127.0.0.1:${PORT}"
SERVER_LOG="${REPO_ROOT}/.demo-smoke-${PORT}.log"

fail() {
  echo "Demo smoke failed: $*" >&2
  if [[ -f "${SERVER_LOG}" ]]; then
    echo "--- ${SERVER_LOG} ---" >&2
    tail -n 120 "${SERVER_LOG}" >&2
  fi
  exit 1
}

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "${SERVER_PID}" 2>/dev/null; then
    kill "${SERVER_PID}" 2>/dev/null || true
    wait "${SERVER_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT

cd "${REPO_ROOT}"

ACI_PREFLIGHT_PROFILE=smoke-demo ACI_PREFLIGHT_REQUIRE_PORT_FREE=1 "${SCRIPT_DIR}/preflight_local.sh"

if ! command -v python3 >/dev/null 2>&1; then
  fail "python3 is required"
fi

if ! command -v curl >/dev/null 2>&1; then
  fail "curl is required"
fi

if ! python3 - "${PORT}" <<'PY'
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
  fail "port ${PORT} is already in use; set ACI_DEMO_PORT to an available port"
fi

ACI_DEMO_PORT="${PORT}" ACI_DEMO_RELOAD=0 ACI_DEMO_SKIP_PREFLIGHT=1 ./scripts/run_demo.sh >"${SERVER_LOG}" 2>&1 &
SERVER_PID=$!

for _ in {1..60}; do
  if curl -fsS "${BASE_URL}/health" >/dev/null 2>&1; then
    break
  fi
  if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
    fail "server process exited before health check passed"
  fi
  sleep 1
done

curl -fsS "${BASE_URL}/health" >/dev/null || fail "health endpoint did not become ready"
curl -fsS "${BASE_URL}/ready" >/dev/null || fail "readiness endpoint failed"
curl -fsS "${BASE_URL}/v1/dashboard/overview" >/dev/null || fail "dashboard endpoint failed"
curl -fsS "${BASE_URL}/v1/attribution/customer-support-bot" >/dev/null || fail "attribution endpoint failed"

INTERCEPT_RESPONSE="$(curl -fsS -X POST "${BASE_URL}/v1/intercept" \
  -H 'Content-Type: application/json' \
  -d '{
    "request_id": "demo-smoke-enriched-1",
    "model": "gpt-4o-mini",
    "provider": "openai",
    "service_name": "customer-support-bot",
    "input_tokens": 600,
    "max_tokens": 300,
    "estimated_cost_usd": 0.003,
    "environment": "staging"
  }')" || fail "intercept endpoint failed"

printf '%s\n' "${INTERCEPT_RESPONSE}" | grep -q '"outcome":"enriched"\|"outcome":"soft_stopped"\|"outcome":"redirected"' || fail "intercept response did not contain an expected outcome"

echo "Demo smoke passed against ${BASE_URL}"
