#!/usr/bin/env python3
"""Golden-path smoke checks for the local Argmin demo.

The script intentionally uses only the Python standard library so it can run
from a clean clone after the demo launcher has installed the runtime deps.
"""

from __future__ import annotations

import json
import os
import sys
from dataclasses import dataclass
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

DEFAULT_TIMEOUT_SECONDS = 10.0


class SmokeTestError(AssertionError):
    """Raised when the golden demo path is not presentation-ready."""


@dataclass(frozen=True)
class HttpPayload:
    status: int
    content_type: str
    body: str

    def json(self) -> dict[str, Any]:
        try:
            payload = json.loads(self.body)
        except json.JSONDecodeError as exc:
            raise SmokeTestError(f"expected JSON response, got: {self.body[:300]}") from exc
        if not isinstance(payload, dict):
            raise SmokeTestError(f"expected JSON object response, got {type(payload).__name__}")
        return payload


def main() -> int:
    base_url = _base_url_from_args()
    timeout = float(os.environ.get("ACI_GOLDEN_SMOKE_TIMEOUT", DEFAULT_TIMEOUT_SECONDS))
    client = GoldenDemoClient(base_url=base_url, timeout=timeout)
    client.run()
    print(f"Golden demo smoke passed against {base_url}")
    return 0


def _base_url_from_args() -> str:
    if len(sys.argv) > 2:
        raise SmokeTestError("usage: smoke_golden_demo.py [base_url]")
    raw = sys.argv[1] if len(sys.argv) == 2 else os.environ.get("ACI_DEMO_BASE_URL", "")
    base_url = raw.strip().rstrip("/") or "http://127.0.0.1:8010"
    if not base_url.startswith(("http://127.0.0.1:", "http://localhost:")):
        raise SmokeTestError(
            "golden demo smoke is local-only; use http://127.0.0.1:<port> or "
            "http://localhost:<port>"
        )
    return base_url


class GoldenDemoClient:
    def __init__(self, *, base_url: str, timeout: float) -> None:
        self.base_url = base_url
        self.timeout = timeout

    def run(self) -> None:
        html, app_js, dataset = self._check_static_shell_and_navigation()
        reset_payload = self._check_demo_login_personas(app_js)
        self._check_seeded_data_visible(dataset, reset_payload)
        self._check_core_workflow_success_states(dataset)
        self._check_controlled_failure_state()

    def _request(
        self,
        method: str,
        path: str,
        *,
        payload: dict[str, Any] | None = None,
        expected_status: int = 200,
    ) -> HttpPayload:
        body = json.dumps(payload).encode("utf-8") if payload is not None else None
        headers = {"Accept": "application/json"}
        if body is not None:
            headers["Content-Type"] = "application/json"
        request = Request(
            f"{self.base_url}{path}",
            data=body,
            headers=headers,
            method=method,
        )
        try:
            with urlopen(request, timeout=self.timeout) as response:
                text = response.read().decode("utf-8", errors="replace")
                result = HttpPayload(
                    status=response.status,
                    content_type=response.headers.get("Content-Type", ""),
                    body=text,
                )
        except HTTPError as exc:
            text = exc.read().decode("utf-8", errors="replace")
            result = HttpPayload(
                status=exc.code,
                content_type=exc.headers.get("Content-Type", ""),
                body=text,
            )
        except URLError as exc:
            raise SmokeTestError(f"{method} {path} could not reach local demo: {exc}") from exc

        if result.status != expected_status:
            raise SmokeTestError(
                f"{method} {path} returned {result.status}; expected {expected_status}. "
                f"Body: {result.body[:500]}"
            )
        return result

    def _get_text(self, path: str) -> str:
        return self._request("GET", path).body

    def _get_json(self, path: str) -> dict[str, Any]:
        return self._request("GET", path).json()

    def _post_json(
        self,
        path: str,
        payload: dict[str, Any] | None = None,
        *,
        expected_status: int = 200,
    ) -> dict[str, Any]:
        return self._request(
            "POST",
            path,
            payload={} if payload is None else payload,
            expected_status=expected_status,
        ).json()

    def _check_static_shell_and_navigation(self) -> tuple[str, str, dict[str, Any]]:
        html = self._get_text("/platform/")
        app_js = self._get_text("/platform/assets/app.js?v=20260309e")
        dataset = self._get_json("/platform/data/demo_dataset.json?v=20260309e")

        _require("Argmin | Decision-Time AI Cost Governance Demo" in html, "platform title")
        _require('data-action="start-walkthrough"' in html, "walkthrough action")
        _require('data-action="open-drawer"' in html, "guided demo drawer action")
        _require('id="recovery-banner"' in html, "controlled recovery banner")
        _require("const DEMO_PERSONAS = [" in app_js, "demo persona registry")
        _require('data-action="set-demo-persona"' in app_js, "persona switch action")
        _require("renderControlledRecoveryState" in app_js, "controlled recovery renderer")

        for label in (
            "Overview",
            "Employee Adoption",
            "Request Proof",
            "Manual Mapping",
            "Interventions",
            "Forecasting",
            "Integrations",
            "Admin",
        ):
            _require(label in app_js, f"navigation label {label!r}")

        return html, app_js, dataset

    def _check_demo_login_personas(self, app_js: str) -> dict[str, Any]:
        reset_payload = self._post_json("/v1/demo/reset")
        accounts = _list_of_dicts(reset_payload, "demo_accounts")
        active_roles = {
            str(account.get("role"))
            for account in accounts
            if str(account.get("status", "")).lower() == "active"
        }
        active_emails = {
            str(account.get("email"))
            for account in accounts
            if str(account.get("status", "")).lower() == "active"
        }

        _require({"Admin", "Manager", "User", "Auditor"} <= active_roles, "login roles")
        _require("maya.patel@novatech.example" in active_emails, "admin demo login")
        _require("noah.kim@novatech.example" in active_emails, "user demo login")
        for persona_key in ("admin", "manager", "user", "auditor"):
            _require(f'key: "{persona_key}"' in app_js, f"{persona_key} persona key")

        _require(reset_payload.get("reset_token") == "argmin-demo-baseline-v1", "reset token")
        _require(
            reset_payload.get("reference_time") == "2026-02-28T17:00:00+00:00",
            "deterministic reference time",
        )
        return reset_payload

    def _check_seeded_data_visible(
        self,
        dataset: dict[str, Any],
        reset_payload: dict[str, Any],
    ) -> None:
        workloads = set(_string_list(reset_payload, "workloads"))
        _require("customer-support-bot" in workloads, "seeded customer-support-bot workload")
        _require("support-bot-staging" in workloads, "seeded manual mapping workload")
        _require(len(_list_of_dicts(dataset, "teams")) >= 6, "team fixture breadth")
        _require(len(_list_of_dicts(dataset, "models")) >= 8, "model fixture breadth")
        _require(len(_list_of_dicts(dataset, "manual_mapping")) >= 4, "manual mapping fixtures")
        _require(len(_list_of_dicts(dataset, "interventions")) >= 4, "intervention fixtures")

        adoption = _dict(dataset, "adoption")
        dashboards = _dict(adoption, "dashboards")
        _require(
            any(key.startswith("organization:") for key in dashboards),
            "organization adoption dashboard",
        )
        workflow_map = _dict(adoption, "workflow_map")
        workflows = _list_of_dicts(workflow_map, "workflows")
        _require(any(row.get("workflow_name") for row in workflows), "workflow adoption map")

        overview = self._get_json("/v1/dashboard/overview")
        _require(float(overview.get("total_ai_spend_usd", 0)) > 0, "overview spend")
        attribution = self._get_json("/v1/attribution/customer-support-bot")
        _require(
            attribution.get("team_id") == "team-cs-platform",
            "seeded attribution owner",
        )
        hierarchy = self._get_json("/v1/adoption/hierarchy")
        _require(
            hierarchy.get("organization", {}).get("organization_name") == "NovaTech Industries",
            "seeded adoption organization",
        )
        adoption_dashboard = self._get_json(
            "/v1/adoption/dashboard?scope=organization&scope_id=org-novatech&window_days=30"
        )
        _require(
            adoption_dashboard.get("summary", {}).get("active_employees_30d", 0) > 0,
            "adoption active employees",
        )

    def _check_core_workflow_success_states(self, dataset: dict[str, Any]) -> None:
        integrations = self._get_json("/v1/integrations/overview?limit=12")
        _require(
            integrations.get("summary", {}).get("live_delivery_mode") == "simulated",
            "simulated integration delivery mode",
        )
        scenarios = _list_of_dicts(integrations, "scenarios")
        _require(scenarios, "integration scenarios")
        scenario_id = str(scenarios[0].get("scenario_id"))
        dispatch = self._post_json(f"/v1/integrations/scenarios/{scenario_id}/dispatch")
        _require(dispatch.get("scenario_id") == scenario_id, "integration dispatch scenario")
        _require(_list_of_dicts(dispatch, "deliveries"), "integration dispatch deliveries")

        scenario_payload = _dict(_dict(dataset, "demo_scenarios"), "enriched").get("payload")
        _require(isinstance(scenario_payload, dict), "enriched scenario payload")
        intercept = self._post_json(
            "/v1/intercept",
            {
                **scenario_payload,
                "request_id": "golden-smoke-enriched",
            },
        )
        _require(intercept.get("request_id") == "golden-smoke-enriched", "intercept request id")
        _require(
            intercept.get("outcome") in {"enriched", "redirected", "soft_stopped"},
            "intercept success outcome",
        )

        manual = self._post_json(
            "/v1/attribution/manual",
            {
                "workload_id": "support-bot-staging",
                "true_team_id": "team-platform-engineering",
                "true_team_name": "Platform Engineering",
                "true_cost_center_id": "CC-PLATFORM",
                "true_cost_center_name": "Platform Engineering",
                "actor": "golden-smoke",
                "note": "Golden demo path verifies manual ownership correction.",
            },
        )
        _require(manual.get("accepted") is True, "manual mapping accepted")
        _require(manual.get("confidence_after") == 1.0, "manual mapping confidence")

        intervention = self._post_json(
            "/v1/interventions/INT-401/status",
            {
                "status": "approved",
                "actor": "golden-smoke",
                "note": "Golden demo path verifies intervention lifecycle.",
            },
        )
        _require(intervention.get("status") == "approved", "intervention approved")
        history = self._get_json("/v1/interventions/summary")
        _require(history.get("approved_count", 0) >= 1, "intervention summary approved count")

        forecast = self._post_json(
            "/v1/forecast/spend",
            {
                "monthly_spend_usd": [412000, 489000, 567000, 634000],
                "horizon_months": 3,
            },
        )
        _require(len(_list_of_dicts(forecast, "points")) == 3, "forecast horizon points")

    def _check_controlled_failure_state(self) -> None:
        failure = self._request(
            "GET",
            "/v1/attribution/missing-golden-demo-workload",
            expected_status=404,
        ).json()
        error = _dict(failure, "error")
        _require(
            failure.get("detail") == "Workload not found in attribution index",
            "stable 404 detail",
        )
        _require(error.get("operator_guidance"), "failure operator guidance")
        _require(error.get("correlation_id"), "failure correlation id")
        _require(error.get("status_code") == 404, "failure status code")
        _require("Traceback" not in json.dumps(failure), "failure hides traceback")


def _require(condition: bool, label: str) -> None:
    if not condition:
        raise SmokeTestError(f"golden demo smoke failed: {label}")


def _dict(payload: dict[str, Any], key: str) -> dict[str, Any]:
    value = payload.get(key)
    if not isinstance(value, dict):
        raise SmokeTestError(f"expected '{key}' to be an object")
    return value


def _list_of_dicts(payload: dict[str, Any], key: str) -> list[dict[str, Any]]:
    value = payload.get(key)
    if not isinstance(value, list) or not all(isinstance(item, dict) for item in value):
        raise SmokeTestError(f"expected '{key}' to be a list of objects")
    return value


def _string_list(payload: dict[str, Any], key: str) -> list[str]:
    value = payload.get(key)
    if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
        raise SmokeTestError(f"expected '{key}' to be a list of strings")
    return value


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except SmokeTestError as exc:
        print(str(exc), file=sys.stderr)
        raise SystemExit(1) from exc
