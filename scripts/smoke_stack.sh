#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PROJECT_NAME="${ACI_STACK_PROJECT:-argmin-demo-stack-smoke}"
BASE_URL="${ACI_STACK_BASE_URL:-http://127.0.0.1:8000}"
CURL_CONNECT_TIMEOUT="${ACI_CURL_CONNECT_TIMEOUT:-2}"
CURL_MAX_TIME="${ACI_CURL_MAX_TIME:-10}"
CURL_OPTS=(-fsS --connect-timeout "${CURL_CONNECT_TIMEOUT}" --max-time "${CURL_MAX_TIME}")

export ACI_NEO4J_PASSWORD="${ACI_NEO4J_PASSWORD:-dev-local-password}"

fail() {
  echo "Shared-backend smoke failed: $*" >&2
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    docker compose -p "${PROJECT_NAME}" logs --tail=120 aci >&2 || true
  fi
  exit 1
}

on_error() {
  local status=$?
  fail "command failed near line ${BASH_LINENO[0]}: ${BASH_COMMAND}"
  exit "${status}"
}
trap on_error ERR

validate_project_name() {
  if [[ ! "${PROJECT_NAME}" =~ ^[a-z0-9][a-z0-9_-]*$ ]]; then
    fail "ACI_STACK_PROJECT must be a Docker Compose project name using lowercase letters, digits, dashes, or underscores; got '${PROJECT_NAME}'."
  fi
}

cleanup() {
  if [[ "${ACI_STACK_KEEP_RUNNING:-0}" != "1" ]]; then
    docker compose -p "${PROJECT_NAME}" down -v >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

cd "${REPO_ROOT}"
validate_project_name

ACI_PREFLIGHT_PROFILE=shared-backend ACI_PREFLIGHT_REQUIRE_PORT_FREE=1 "${SCRIPT_DIR}/preflight_local.sh" \
  || fail "shared-backend prerequisite check failed"

if ! command -v docker >/dev/null 2>&1; then
  fail "docker is required"
fi

if ! docker compose version >/dev/null 2>&1; then
  fail "docker compose is required"
fi

if ! command -v curl >/dev/null 2>&1; then
  fail "curl is required"
fi

docker compose -p "${PROJECT_NAME}" up -d --build || fail "docker compose up failed"

ready=0
for ((attempt = 1; attempt <= 90; attempt += 1)); do
  if curl "${CURL_OPTS[@]}" "${BASE_URL}/ready" >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 2
done
if [[ "${ready}" != "1" ]]; then
  fail "readiness endpoint did not become ready"
fi

curl "${CURL_OPTS[@]}" "${BASE_URL}/health" >/dev/null || fail "health endpoint failed"
curl "${CURL_OPTS[@]}" "${BASE_URL}/ready" >/dev/null || fail "readiness endpoint failed"

curl "${CURL_OPTS[@]}" -X POST "${BASE_URL}/v1/demo/bootstrap" >/dev/null \
  || fail "demo bootstrap failed"
curl "${CURL_OPTS[@]}" "${BASE_URL}/v1/attribution/customer-support-bot" >/dev/null \
  || fail "seeded attribution lookup failed"

INTERCEPT_RESPONSE="$(curl "${CURL_OPTS[@]}" -X POST "${BASE_URL}/v1/intercept" \
  -H 'Content-Type: application/json' \
  -d '{
    "request_id": "shared-stack-smoke-enriched-1",
    "model": "gpt-4o-mini",
    "provider": "openai",
    "service_name": "customer-support-bot",
    "input_tokens": 600,
    "max_tokens": 300,
    "estimated_cost_usd": 0.003,
    "environment": "staging"
  }')" || fail "intercept endpoint failed"

printf '%s\n' "${INTERCEPT_RESPONSE}" \
  | grep -q '"outcome":"enriched"\|"outcome":"soft_stopped"\|"outcome":"redirected"' \
  || fail "intercept response did not contain an expected outcome"

echo "Shared-backend smoke passed against ${BASE_URL}"
