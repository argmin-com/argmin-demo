#!/usr/bin/env bash
set -euo pipefail

PORT="${ACI_DEMO_PORT:-8010}"
BASE_URL="${ACI_DEMO_BASE_URL:-http://127.0.0.1:${PORT}}"

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required to reset the demo runtime." >&2
  exit 1
fi

echo "Resetting Argmin demo runtime at ${BASE_URL}"

reset_payload="$(curl -fsS -X POST "${BASE_URL}/v1/demo/reset" \
  -H "Content-Type: application/json" \
  -d '{}')"

curl -fsS "${BASE_URL}/health" >/dev/null
curl -fsS "${BASE_URL}/ready" >/dev/null
curl -fsS "${BASE_URL}/v1/attribution/customer-support-bot" >/dev/null

python3 - "$reset_payload" <<'PY'
import json
import sys

payload = json.loads(sys.argv[1])
print("Reset complete")
print(f"- token: {payload.get('reset_token', 'unknown')}")
print(f"- reference_time: {payload.get('reference_time', 'unknown')}")
print(f"- seeded_entries: {payload.get('seeded_entries', 0)}")
print(f"- scenarios: {len(payload.get('scenario_ids', []))}")
print(f"- demo_accounts: {len(payload.get('demo_accounts', []))}")
print(f"- mode: {payload.get('interceptor_mode', 'unknown')}")
PY
