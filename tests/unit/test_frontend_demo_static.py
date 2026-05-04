import json
from datetime import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
FRONTEND_INDEX = REPO_ROOT / "frontend" / "index.html"
FRONTEND_APP_CSS = REPO_ROOT / "frontend" / "assets" / "app.css"
FRONTEND_APP_JS = REPO_ROOT / "frontend" / "assets" / "app.js"
FRONTEND_README = REPO_ROOT / "frontend" / "README.md"
FRONTEND_SCHEMA = REPO_ROOT / "frontend" / "data" / "SCHEMA.md"
FEATURE_DEMO_MATRIX = REPO_ROOT / "docs" / "feature-demo-coverage-matrix.md"
VENDORED_CHART = REPO_ROOT / "frontend" / "vendor" / "chart.umd.min.js"
FRONTEND_FONT_DIR = REPO_ROOT / "frontend" / "assets" / "fonts"
LEGACY_V3_MOCKUP = REPO_ROOT / "frontend" / "platform-mockup-v3.html"
DEMO_USER_FACING_PATHS = [
    REPO_ROOT / "README.md",
    REPO_ROOT / "docs" / "demo-guide.md",
    REPO_ROOT / "docs" / "demo-feature-matrix.md",
    FEATURE_DEMO_MATRIX,
    FRONTEND_INDEX,
    FRONTEND_APP_JS,
    FRONTEND_SCHEMA,
    REPO_ROOT / "frontend" / "data" / "demo_dataset.json",
]


def _read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _hex_to_rgb(value: str) -> tuple[int, int, int]:
    normalized = value.strip().removeprefix("#")
    return (
        int(normalized[0:2], 16),
        int(normalized[2:4], 16),
        int(normalized[4:6], 16),
    )


def _relative_luminance(hex_color: str) -> float:
    def channel(value: int) -> float:
        normalized = value / 255
        if normalized <= 0.03928:
            return normalized / 12.92
        return float(((normalized + 0.055) / 1.055) ** 2.4)

    red, green, blue = _hex_to_rgb(hex_color)
    return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)


def _contrast_ratio(foreground: str, background: str) -> float:
    fg_luminance = _relative_luminance(foreground)
    bg_luminance = _relative_luminance(background)
    lighter = max(fg_luminance, bg_luminance)
    darker = min(fg_luminance, bg_luminance)
    return (lighter + 0.05) / (darker + 0.05)


def test_demo_energy_copy_preserves_uncertainty_instead_of_false_precision() -> None:
    js = _read(FRONTEND_APP_JS)
    schema = _read(FRONTEND_SCHEMA)
    dataset = _read(REPO_ROOT / "frontend" / "data" / "demo_dataset.json")

    assert "Energy transparency" in js
    assert "Unknowns remain null, not zero" in js
    assert "Unrated" in js
    assert "advisory" in js.lower()
    assert "energy_efficiency" in schema
    assert "explicit `Unrated` / `null` handling" in schema
    assert '"status": "unrated"' in dataset
    assert '"kwh_per_1k_requests": null' in dataset


def test_demo_copy_no_longer_advertises_obsolete_short_walkthrough() -> None:
    for path in DEMO_USER_FACING_PATHS:
        content = _read(path)
        assert "Start 90-sec Walkthrough" not in content
        assert "90-second walkthrough" not in content
        assert "90 second walkthrough" not in content


def test_confidential_source_document_exports_are_not_committed() -> None:
    tmp_pdf_dir = REPO_ROOT / "tmp" / "pdfs"
    committed_exports = []
    if tmp_pdf_dir.exists():
        committed_exports = [
            path
            for path in tmp_pdf_dir.iterdir()
            if path.is_file() and path.suffix in {".txt", ".pdf"}
        ]

    assert committed_exports == []
    assert "tmp/pdfs/" in _read(REPO_ROOT / ".gitignore")


def test_frontend_dataset_integrations_match_schema_contract() -> None:
    dataset = json.loads(
        (REPO_ROOT / "frontend" / "data" / "demo_dataset.json").read_text()
    )
    integrations = dataset["integrations"]
    summary = integrations["summary"]
    sources = integrations["sources"]
    routes = integrations["routes"]
    scenarios = integrations["scenarios"]
    deliveries = integrations["recent_deliveries"]

    assert summary["inbound_source_count"] == sum(
        1 for source in sources if source["direction"] == "inbound"
    )
    assert summary["outbound_route_count"] == len(routes)
    assert summary["scenario_count"] == len(scenarios)
    assert summary["recent_delivery_count"] == len(deliveries)
    assert summary["live_delivery_mode"] == "simulated"
    assert {scenario["route_id"] for scenario in scenarios} <= {
        route["route_id"] for route in routes
    }


def test_frontend_dataset_references_existing_models_and_teams() -> None:
    dataset = json.loads(
        (REPO_ROOT / "frontend" / "data" / "demo_dataset.json").read_text()
    )
    team_names = {team["name"] for team in dataset["teams"]}
    model_names = {model["name"] for model in dataset["models"]}

    for request in dataset["attribution_requests"]:
        assert request["model"] in model_names

    for intervention in dataset["interventions"]:
        assert intervention["team"] in team_names
        linked_model = intervention.get("linked_model")
        if linked_model:
            assert linked_model in model_names


def test_frontend_dataset_has_coherent_enterprise_relationships() -> None:
    dataset = json.loads(
        (REPO_ROOT / "frontend" / "data" / "demo_dataset.json").read_text()
    )
    teams = dataset["teams"]
    team_ids = {team["id"] for team in teams}
    team_names = {team["name"] for team in teams}
    team_by_id = {team["id"]: team for team in teams}
    model_names = {model["name"] for model in dataset["models"]}
    request_ids = {request["id"] for request in dataset["attribution_requests"]}

    assert dataset["overview"]["total_spend_usd"] == sum(
        team["spend_usd"] for team in teams
    )
    assert dataset["overview"]["total_spend_usd"] == sum(
        model["spend_usd"] for model in dataset["models"]
    )
    assert dataset["overview"]["requests_30d"] == sum(
        model["requests"] for model in dataset["models"]
    )

    assert len(team_ids) == len(teams)
    assert len({team["lead"] for team in teams}) == len(teams)
    for team in teams:
        assert team["id"].startswith("team-")
        assert team["business_unit_id"].startswith("bu-")
        assert team["business_unit_name"]
        assert team["cost_center"].startswith("CC-")
        assert team["service_owner_email"].endswith("@novatech.example")

    workflow_map = dataset["adoption"]["workflow_map"]
    workflows = workflow_map["workflows"]
    workflow_summary = workflow_map["summary"]
    assert len({workflow["id"] for workflow in workflows}) == len(workflows)
    assert workflow_summary["workflow_count"] == len(workflows)
    assert workflow_summary["business_units_with_adoption"] == len(
        {workflow["business_unit_id"] for workflow in workflows}
    )
    assert workflow_summary["teams_with_adoption"] == len(
        {workflow["team_id"] for workflow in workflows}
    )
    assert workflow_summary["ai_services_used"] == len(
        {workflow["service_name"] for workflow in workflows}
    )
    assert workflow_summary["capability_classes"] == len(
        {workflow["capability_class"] for workflow in workflows}
    )
    assert workflow_summary["embedded_or_scaled_workflows"] == sum(
        1
        for workflow in workflows
        if "embedded" in workflow["adoption_depth"].lower()
        or "scaled" in workflow["adoption_depth"].lower()
    )

    for workflow in workflows:
        team = team_by_id[workflow["team_id"]]
        assert workflow["team_name"] == team["name"]
        assert workflow["business_unit_id"] == team["business_unit_id"]
        assert workflow["business_unit_name"] == team["business_unit_name"]
    assert {workflow["team_id"] for workflow in workflows} == team_ids

    capability_counts = {
        capability["capability"]: capability["workflow_count"]
        for capability in workflow_map["capabilities"]
    }
    service_counts = {
        service["service"]: service["used_by_workflows"]
        for service in workflow_map["services"]
    }
    for capability in {workflow["capability"] for workflow in workflows}:
        assert capability_counts[capability] == sum(
            1 for workflow in workflows if workflow["capability"] == capability
        )
    for service in {workflow["service_name"] for workflow in workflows}:
        assert service_counts[service] == sum(
            1 for workflow in workflows if workflow["service_name"] == service
        )

    partner_brief = dataset["design_partner_brief"]
    pillar_evidence = {
        item
        for pillar in partner_brief["readiness_pillars"]
        for item in pillar["evidence"]
    }
    assert f"{workflow_summary['workflow_count']} workflows mapped across business units" in (
        pillar_evidence
    )
    assert (
        f"{workflow_summary['ai_services_used']} AI services and "
        f"{workflow_summary['capability_classes']} capability classes represented"
    ) in pillar_evidence
    workflow_metric = next(
        metric
        for metric in partner_brief["success_metrics"]
        if metric["metric"] == "Workflow adoption visibility"
    )
    assert workflow_metric["baseline"] == (
        f"{workflow_summary['workflow_count']} modeled workflows"
    )

    for request in dataset["attribution_requests"]:
        assert request["model"] in model_names
        for node in request["chain"]:
            if node["layer"] == "Org Hierarchy":
                assert node["value"] in (team_names | {"UNKNOWN"})

    for mapping in dataset["manual_mapping"]:
        assert mapping["request_id"] is None or mapping["request_id"] in request_ids
        assert mapping["current_owner"] in (team_names | {"UNKNOWN"})
        assert mapping["suggested_owner"] in team_names
        assert mapping["resolved_team"] in (team_names | {"UNKNOWN"})
        assert set(mapping["candidate_teams"]) <= (team_names | {"UNKNOWN"})

    for delivery in dataset["integrations"]["recent_deliveries"]:
        sent_at = datetime.fromisoformat(delivery["sent_at"].replace("Z", "+00:00"))
        assert delivery["delivery_id"].startswith(f"delivery-{sent_at:%Y%m%d}-")

    for row in dataset["exports"]["rows"]:
        assert row["team_event_time"] in (team_names | {"UNKNOWN"})
        assert row["model"] in (model_names | {"unknown-provider-model"})
        for field in (
            "billed_cost_usd",
            "estimated_cost_usd",
            "reconciled_cost_usd",
            "trac_usd",
        ):
            assert row[field] is None or row[field] >= 0


def test_frontend_uses_vendored_chart_and_no_cdn_fonts() -> None:
    html = _read(FRONTEND_INDEX)
    css = _read(FRONTEND_APP_CSS)
    assert 'src="vendor/chart.umd.min.js?v=' in html
    assert 'src="vendor/chart.umd.min.js?v=20260309as" defer' in html
    assert 'src="assets/app.js?v=' in html
    assert 'href="assets/app.css?v=' in html
    assert "cdnjs.cloudflare.com" not in html
    assert "fonts.googleapis.com" not in html
    assert "fonts.gstatic.com" not in html
    assert '@font-face' in css
    assert 'SpaceGrotesk-Regular.ttf' in css
    assert 'IBMPlexMono-Regular.ttf' in css
    assert VENDORED_CHART.exists()
    assert FRONTEND_APP_CSS.exists()
    assert FRONTEND_APP_JS.exists()
    assert FRONTEND_FONT_DIR.exists()


def test_frontend_csp_and_accessibility_scaffolding_present() -> None:
    html = _read(FRONTEND_INDEX)
    css = _read(FRONTEND_APP_CSS)
    assert "Content-Security-Policy" in html
    assert "script-src 'self'" in html
    assert "'unsafe-inline'" not in html.split("script-src", 1)[1].split(";", 1)[0]
    assert "form-action 'self'" in html
    assert "Skip to main content" in html
    assert "JavaScript is required to run the Argmin demo UI." in html
    assert "Decision-time AI cost governance" in html
    assert 'aria-controls="execution-drawer"' in html
    assert 'aria-controls="mobile-nav-drawer"' in html
    assert 'role="dialog"' in html
    assert 'aria-label="Primary navigation"' in html
    assert 'id="app-loader"' in html
    assert 'id="drawer-summary" role="status" aria-live="polite"' in html
    assert 'id="log-stream" role="log" aria-live="polite"' in html
    assert 'id="recovery-banner" role="alert" aria-live="assertive"' in html
    assert 'aria-label="Close navigation menu">&times;' in html
    assert "Preparing local demo workspace" in html
    assert 'class="demo-boot-state"' in html
    assert "</body>" in html
    assert "focus-visible" in css

def test_frontend_overview_avoids_confusing_data_freshness_panel() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "Operating Readiness" in js
    assert "Attribution Confidence Mix" not in js
    assert "Data Freshness" not in js
    assert "sampled request set" not in js
    assert "chart-axis-note" in js
    assert "Where To Go Next" not in js
    assert "Adoption Snapshot" in js


def test_frontend_uses_investor_facing_request_proof_and_tenant_labels() -> None:
    html = _read(FRONTEND_INDEX)
    js = _read(FRONTEND_APP_JS)
    dataset = _read(REPO_ROOT / "frontend" / "data" / "demo_dataset.json")
    assert "Request Proof" in js
    assert "Technical Diagnostics" not in js
    assert "Synthetic enterprise operating profile" in html
    assert "Cross-functional AI program spanning engineering, support, data, and operations" in html
    assert "Investor demo environment" not in dataset
    assert "Enterprise model estate: Azure OpenAI, AWS Bedrock, Vertex AI" not in dataset
    assert "context-ribbon" in html
    assert "role-ribbon" in html
    assert "renderContextRibbon" in js
    assert "renderRoleRibbon" in js
    assert "Enterprise Model Landscape" in js
    assert "of TRAC exposure in the decision record." in js
    assert "of ${inlineTextForAlternate(selected)} exposure" not in js

def test_frontend_no_silent_bare_catches() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "catch {}" not in js
    assert "void error" not in js
    assert "void recoveryError" not in js


def test_frontend_demo_uses_controlled_recovery_states() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert "recoveryNotice: null" in js
    assert "function sanitizeOperatorMessage(message, fallback)" in js
    assert "function apiResponseErrorMessage(response, data)" in js
    assert "function setRecoveryNotice(notice)" in js
    assert "function renderRecoveryBanner()" in js
    assert "function renderControlledRecoveryState(error)" in js
    assert "A render failure was contained" in js
    assert "Frontend issue contained" in js
    assert "Async demo action recovered" in js
    assert "JSON.stringify(data)" not in js
    assert "raw stack" not in js.lower()
    assert ".recovery-banner" in css
    assert ".recovery-state" in css


def test_frontend_demo_uses_explicit_loading_success_empty_error_states() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert "function explicitStateMarkup(kind, title, message, options = {})" in js
    assert "function loadingStateMarkup(title, message, options = {})" in js
    assert "function successStateMarkup(title, message, options = {})" in js
    assert "function emptyStateMarkup(title, message, options = {})" in js
    assert "function errorStateMarkup(title, message, options = {})" in js
    assert "function tableEmptyRowMarkup(colspan, title, message, options = {})" in js
    assert "function pageStateStripMarkup()" in js
    assert "function renderViewWithState(markup)" in js
    assert "root.innerHTML = renderViewWithState(" in js
    assert "No demo activity yet." in js
    assert "Integration fallback active" in js
    assert "Unknown page" in js
    assert ".state-panel-loading" in css
    assert ".state-panel-success" in css
    assert ".state-panel-empty" in css
    assert ".state-panel-error" in css
    assert ".page-state-strip" in css


def test_frontend_standardizes_visual_state_contracts() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    for token in (
        "--state-hover-bg: rgba(var(--brand-rgb), 0.09);",
        "--state-hover-border: rgba(var(--brand-rgb), 0.44);",
        "--state-active-bg: rgba(var(--brand-rgb), 0.16);",
        "--state-active-border: rgba(var(--brand-rgb), 0.58);",
        "--state-disabled-opacity: 0.68;",
        "--state-disabled-bg: rgba(120, 137, 168, 0.06);",
        "--state-loading-bg: rgba(var(--brand-rgb), 0.12);",
        "--state-loading-border: rgba(var(--brand-rgb), 0.42);",
        "--state-success-bg: var(--status-success-soft);",
        "--state-warning-bg: var(--status-warning-soft);",
        "--state-error-bg: var(--status-danger-soft);",
    ):
        assert token in css

    assert "/* Visual State Contracts" in css
    state_block = css.split("/* Visual State Contracts", 1)[1].split(
        "/* Typography Role Contracts",
        1,
    )[0]
    for selector in (
        ".small-btn:not(.primary):not(.success):not(:disabled):hover",
        ".filter-btn.active,",
        ".nav-item.active,",
        "[aria-pressed=\"true\"],",
        "[data-ui-state=\"active\"]",
        "button:disabled:not(.active):not(.current):not([aria-current]),",
        "[data-ui-state=\"disabled\"]:not(.active):not(.current):not([aria-current])",
        "[data-loading=\"true\"],",
        ".state-panel-loading,",
        "[data-ui-state=\"loading\"]",
        ".state-panel-success,",
        ".field-feedback-ok,",
        ".state-panel-warn,",
        ".field-feedback-warn,",
        ".state-panel-error,",
        ".field-feedback-error,",
        ".noscript-warning,",
    ):
        assert selector in state_block
    assert "border-color: var(--state-hover-border);" in state_block
    assert "background: var(--state-active-bg);" in state_block
    assert "opacity: var(--state-disabled-opacity);" in state_block
    assert "cursor: progress;" in state_block
    assert "color: var(--state-success-text);" in state_block
    assert "color: var(--state-warning-text);" in state_block
    assert "color: var(--state-error-text);" in state_block

    assert "function normalizeVisualStateContracts(root = document)" in js
    assert 'button.dataset.uiState = "loading";' in js
    assert 'button.dataset.uiState = "active";' in js
    assert 'button.dataset.uiState = "disabled";' in js
    assert 'button.dataset.uiState = "idle";' in js
    assert 'panel.dataset.uiState = match ? match[0] : "idle";' in js
    assert "normalizeVisualStateContracts(scope);" in js


def test_frontend_uses_clean_data_visual_contracts() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    for token in (
        "--data-visual-surface: rgba(8, 14, 24, 0.42);",
        "--data-visual-border: rgba(120, 137, 168, 0.12);",
        "--data-visual-grid: rgba(120, 137, 168, 0.12);",
        "--data-visual-axis: var(--text-muted);",
        "--data-visual-primary: var(--brand);",
        "--data-visual-highlight: var(--status-success);",
    ):
        assert token in css

    assert "/* Clean Data Visual Contracts" in css
    data_block = css.split("/* Clean Data Visual Contracts", 1)[1].split(
        "/* Typography Role Contracts",
        1,
    )[0]
    for selector in (
        ".chart-frame,",
        ".data-chart-frame,",
        "[data-visual=\"chart\"]",
        ".chart-axis-note,",
        ".data-visual-caption",
        ".metric-card,",
        ".adoption-kpi-card,",
        ".forecast-metric,",
        "[data-visual=\"metric\"]",
        ".metric-card[data-visual-priority=\"primary\"],",
        ".scannable-table-wrap,",
        "[data-visual=\"table\"]",
        ".table tbody tr:nth-child(even):not([hidden]) td",
        ".table-sort-indicator",
    ):
        assert selector in data_block
    assert "box-shadow: none;" in data_block
    assert "font-variant-numeric: tabular-nums;" in data_block
    assert "background: var(--data-visual-surface);" in data_block
    assert "border-color: var(--data-visual-border);" in data_block

    for snippet in (
        "const CLEAN_CHART_COLOR_SEQUENCE = Object.freeze",
        "function cleanChartScale(scale = {})",
        (
            "function cleanChartDataset(dataset = {}, index = 0, "
            "chartType = \"bar\", datasetCount = 1)"
        ),
        "function cleanChartOptions(options = {}, config = {})",
        "function cleanChartConfig(config = {})",
        "function normalizeDataVisualContracts(root = document)",
        "frame.classList.add(\"data-chart-frame\");",
        "frame.dataset.visual = \"chart\";",
        "metric.dataset.visual = \"metric\";",
        "metric.dataset.visualPriority = index === 0 ? \"primary\" : \"secondary\";",
        "wrap.dataset.visual = \"table\";",
        "normalizeDataVisualContracts(scope);",
        "const cleanConfig = cleanChartConfig(config);",
        "new Chart(el, cleanConfig)",
        "display: datasets.length > 1",
        "title: {\n      ...(scale.title || {}),\n      display: false",
        'grid.display === false ? "transparent" : "rgba(120, 137, 168, 0.12)"',
    ):
        assert snippet in js


def test_frontend_reduces_visual_noise_without_hiding_meaningful_state() -> None:
    css = _read(FRONTEND_APP_CSS)

    assert "/* Low Visual Noise Contracts" in css
    noise_block = css.split("/* Low Visual Noise Contracts", 1)[1].split(
        "/* Typography Role Contracts",
        1,
    )[0]

    for selector in (
        ":root",
        "body,\n.app-loader",
        ".brand-logo,\n.avatar",
        ".app-loader-skeleton,",
        ".screen-priority::before,",
        ".screen-priority::after,",
        ".entry-home::before",
        ".clickable-card:hover,",
        ".small-btn.primary,",
        ".entry-home-action .small-btn.primary,",
        "body .entry-home-action .small-btn.primary,",
        ".state-panel-icon,",
        ".field-feedback-ok::before,",
        ".recovery-banner.error",
        ".metric-accent",
        ".table-toolbar,\n.table-pagination",
    ):
        assert selector in noise_block

    for snippet in (
        "--action-primary-shadow: none;",
        "background: var(--bg);",
        "background-image: none;",
        "display: none;",
        "box-shadow: none;",
        "transform: none;",
        "border-right-width: 1px;",
        "backdrop-filter: none;",
        "background: var(--state-warning-bg);",
        "background: var(--state-error-bg);",
        "background: var(--data-visual-surface-subtle);",
    ):
        assert snippet in noise_block

    assert "button:focus-visible,\ninput:focus-visible,\na:focus-visible" in css
    focus_block = css.split("button:focus-visible,", 1)[1].split("button,", 1)[0]
    assert "outline: 2px solid var(--blue);" in focus_block
    assert "box-shadow: 0 0 0 3px rgba(79, 142, 248, 0.18);" in focus_block


def test_frontend_empty_states_guide_first_use_with_examples() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert "function singleNextStepAction(actions = [])" in js
    assert "function guidedEmptyExampleFor(title)" in js
    assert "function guidedEmptyNextStepFor(title)" in js
    assert "function stateExampleMarkup(example)" in js
    assert "function stateNextStepMarkup(nextStep)" in js
    assert "function applyGuidedExample(inputKey, value)" in js
    assert "guided-empty-state" in js
    assert "Prefilled example" in js
    assert "Search Governance" in js
    assert "Search Deployment" in js
    assert 'case "apply-guided-example"' in js
    assert 'data: { "input-key": "glossary-query", value: "governance" }' in js
    assert 'data: { "input-key": "faq-query", value: "deployment" }' in js
    assert "const emptyActions = Array.isArray(options.actions) && options.actions.length" in js
    assert "? options.actions" in js
    assert ": (example?.actions || [])" in js
    assert "singleNextStepAction(emptyActions)" in js
    assert "This timeline records the proof points generated during a walkthrough." in js
    assert "governance terminology" in js
    assert "deployment diligence" in js
    assert ".guided-empty-state" in css
    assert ".state-panel-example" in css
    assert ".state-panel-next-step" in css
    assert ".deferred-example" in css


def test_frontend_demo_optimizes_perceived_speed() -> None:
    html = _read(FRONTEND_INDEX)
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert 'id="instant-feedback"' in html
    assert "function instantActionLabel(actionEl, action)" in js
    assert "function acknowledgeInstantAction(actionEl, action)" in js
    assert "acknowledgeInstantAction(actionEl, action);" in js
    assert ".instant-feedback" in css
    assert ".click-ack" in css

    assert "function deferredContentMarkup(key, title, message, contentMarkup, options = {})" in js
    assert "function glossaryResultStats()" in js
    assert "data-action=\"show-deferred-section\"" in js
    assert "state.deferredSectionsVisible.add(\"glossary-results\")" in js
    assert "state.deferredSectionsVisible.add(\"faq-results\")" in js
    assert ".deferred-section" in css

    assert ".state-panel-skeleton" in css
    assert ".skeleton-line" in css
    assert 'class="app-loader-skeleton"' in html
    assert ".app-loader-skeleton" in css
    assert "animation: spin" not in css
    assert "@keyframes spin" not in css

    forecast_block = js.split("async function runForecastDemo(options = {})", 1)[1].split(
        "async function refreshIntegrationFeed()",
        1,
    )[0]
    assert "const optimistic = buildLocalForecastEstimate" in forecast_block
    assert "state.forecastResult = optimistic;" in forecast_block
    assert (
        "Local ${scenario.label.toLowerCase()} estimate ready while live forecast runs."
        in forecast_block
    )
    assert forecast_block.index("state.forecastResult = optimistic;") < forecast_block.index(
        'apiRequest("POST", "/v1/forecast/spend"',
    )

    intervention_block = js.split("async function updateInterventionStatus", 1)[1].split(
        "async function updateManualMapping",
        1,
    )[0]
    assert "const previousStatus = currentStatus;" in intervention_block
    assert "intervention.status = normalized;" in intervention_block
    assert intervention_block.index("intervention.status = normalized;") < intervention_block.index(
        'apiRequest("POST", `/v1/interventions/${id}/status`',
    )


def test_frontend_standardizes_interaction_contracts() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert "function normalizeInteractionContracts(root = document)" in js
    assert "function isInteractiveFilterControl(button, action)" in js
    assert "normalizeInteractionContracts(document);" in js
    assert "button.setAttribute(\"type\", \"button\")" in js
    assert "button.dataset.control = \"filter\";" in js
    assert "button.dataset.control = \"button\";" in js
    assert "button.dataset.control = \"disclosure\";" in js
    assert "button.setAttribute(\"aria-pressed\", active ? \"true\" : \"false\")" in js
    assert "wrap.setAttribute(\"role\", \"region\")" in js
    assert "row.dataset.control = \"selectable-row\";" in js
    assert "row.setAttribute(\"tabindex\", \"0\")" in js
    assert "input.classList.add(\"control-input\")" in js
    assert "select.classList.add(\"control-select\")" in js
    assert "[data-action][role='button'], tr[data-action]" in js
    assert 'class="control-input"' in js
    assert 'class="simulation-select control-select"' in js

    assert ".control-input" in css
    assert ".control-select" in css
    assert '[data-control="button"]' in css
    assert '[data-control="filter"][aria-pressed="true"]' in css
    assert '[data-control="selectable-row"]:focus-visible' in css
    assert '[data-control="table-region"]' in css


def test_frontend_forms_are_frictionless_and_validated() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert "formStatus: {}" in js
    assert "const FORM_MIN_SEARCH_LENGTH = 2" in js
    assert "function searchFieldFeedback(inputKey, value, stats = {})" in js
    assert "function fieldValidationAttrs(inputKey, fallbackStatus = null" in js
    assert "function fieldFeedbackMarkup(inputKey, fallbackStatus = null" in js
    assert "function syncFieldFeedback(inputKey, value, status" in js
    assert 'aria-invalid="${status.kind === "error" ? "true" : "false"}"' in js
    assert 'fieldValidationAttrs("glossary-query", feedback, state.glossaryQuery' in js
    assert 'fieldValidationAttrs("faq-query", feedback, state.faqQuery' in js
    assert 'id="${esc(key)}-feedback"' in js
    assert 'fieldFeedbackMarkup("glossary-query", feedback, state.glossaryQuery)' in js
    assert 'fieldFeedbackMarkup("faq-query", feedback, state.faqQuery)' in js
    assert 'id="faq-summary"' in js
    assert 'Loaded example "${exampleValue}". Results update automatically.' in js
    assert "function selectedGovernanceRequestValue()" in js
    assert "function governanceRequestSelectionFeedback(value)" in js
    assert 'id="governance-request-select"' in js
    assert 'fieldFeedbackMarkup("governance-request", governanceRequestStatus' in js
    assert "No request samples are loaded." in js
    assert "The previous valid selection was preserved." in js
    assert "FORECAST_HORIZONS.includes(nextHorizon)" in js
    assert "The local demo preserved the previous horizon" in js

    assert '.control-input[aria-invalid="true"]' in css
    assert ".field-feedback" in css
    assert ".field-feedback-ok" in css
    assert ".field-feedback-warn" in css
    assert ".field-feedback-error" in css


def test_frontend_provides_contextual_help_without_manuals() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert "const CONTEXTUAL_HELP = {" in js
    assert '"optimization-potential": {' in js
    assert '"attribution-coverage": {' in js
    assert '"trac": {' in js
    assert '"entry-point": {' in js
    assert '"insertion-point": {' in js
    assert '"governed": {' in js
    assert "function normalizeContextualHelp(root = document)" in js
    assert "function contextualHelpTargets(scope)" in js
    assert "function attachContextualHelp(target, entry)" in js
    assert "function showContextHelp(helpKey)" in js
    assert "normalizeContextualHelp(scope);" in js
    assert 'data-action = "show-context-help"' not in js
    assert 'button.dataset.action = "show-context-help";' in js
    assert 'case "show-context-help":' in js
    assert "showToast(entry.title, contextualHelpTooltip(entry));" in js
    assert "Sort headers, filter rows, then page without losing the demo context." in js
    assert "Next: ${entry.next}" in js

    assert ".context-help-target" in css
    assert ".context-help-button" in css
    assert ".context-help-tooltip" in css
    assert ".has-context-help::after" in css
    assert ".table-microcopy" in css


def test_frontend_demo_surfaces_one_primary_signal_per_screen() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert "function pagePrioritySignal()" in js
    assert "function pagePriorityMarkup()" in js
    assert "Screen focus" in js
    assert 'data-visual-role="dominant"' in js
    assert 'data-visual-role="secondary"' in js
    assert 'class="entry-home" data-visual-role="dominant"' in js
    assert "renderViewWithState(markup)" in js
    assert "${pageStateStripMarkup()}${pagePriorityMarkup()}" in js
    assert 'class="screen-secondary-content" data-visual-role="secondary"' in js
    assert 'return "";' in js.split("function pageStateStripMarkup()", 1)[1].split(
        "function renderViewWithState",
        1,
    )[0]
    assert ".screen-priority" in css
    assert ".screen-priority::before" in css
    assert "grid-template-columns: minmax(0, 1.35fr) minmax(220px, 0.38fr) auto;" in css
    assert "min-height: 132px;" in css
    assert ".screen-secondary-content" in css
    assert ".screen-secondary-content .card:not(.metric-card)" in css
    assert ".screen-secondary-content .partner-hero h1" in css
    assert ".screen-secondary-content .admin-hero h1" in css
    assert "font-size: clamp(20px, 1.8vw, 22px);" in css
    assert ".screen-priority-measure strong" in css
    assert "font-size: 34px;" in css
    assert ".screen-priority .state-panel-actions" in css
    page_keys = [
        "overview",
        "partner_brief",
        "requirements",
        "adoption",
        "attribution",
        "models",
        "teams",
        "manual_mapping",
        "interventions",
        "governance",
        "coverage",
        "exports",
        "energy",
        "forecast",
        "integrations",
        "admin",
        "glossary",
        "faq",
    ]
    for page_key in page_keys:
        assert f'case "{page_key}":' in js


def test_frontend_makes_primary_actions_unmistakable() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    for token in (
        "--action-primary-bg: var(--brand);",
        "--action-primary-bg-hover: var(--brand-strong);",
        "--action-primary-border: #9bc0ff;",
        "--action-primary-text: var(--accent-ink);",
        "--action-primary-shadow: 0 16px 34px rgba(var(--brand-rgb), 0.28);",
        "--action-secondary-bg: rgba(120, 137, 168, 0.04);",
        "--action-secondary-border: rgba(120, 137, 168, 0.22);",
        "--action-secondary-text: var(--text-muted);",
    ):
        assert token in css

    primary_block = css.split(".small-btn.primary", 1)[1].split(".small-btn.success", 1)[0]
    assert "min-height: 36px;" in primary_block
    assert "background: var(--action-primary-bg);" in primary_block
    assert "color: var(--action-primary-text);" in primary_block
    assert "font-weight: 800;" in primary_block
    assert "box-shadow: var(--action-primary-shadow);" in primary_block
    assert ".small-btn.primary:hover," in css

    assert ".small-btn[data-action-priority=\"secondary\"]" in css
    secondary_block = css.split(
        '.small-btn[data-action-priority="secondary"]',
        1,
    )[1].split(".small-btn.click-ack", 1)[0]
    assert "background: var(--action-secondary-bg);" in secondary_block
    assert "color: var(--action-secondary-text);" in secondary_block
    assert "box-shadow: none;" in secondary_block

    assert ".screen-priority .state-panel-actions::before" in css
    priority_label_block = css.split(".screen-priority .state-panel-actions::before", 1)[
        1
    ].split(".screen-priority .small-btn.primary", 1)[0]
    assert 'content: "Primary action";' in priority_label_block
    assert "text-transform: uppercase;" in priority_label_block
    assert "data-primary-action=\"true\"" in js
    assert "aria-label=\"Primary action: ${esc(action.label)}\"" in js
    assert "function normalizePrimaryActionContracts(root = document)" in js
    assert 'button.dataset.actionPriority = isPrimary ? "primary" : "secondary";' in js
    assert 'button.setAttribute("aria-label", `Primary action: ${label}`);' in js
    assert "normalizePrimaryActionContracts(scope);" in js

    for label in (
        "Open Forecast Planner",
        "Open Coverage Matrix",
        "Show Organization Adoption",
        "Inspect Request Proof",
        "Select Highest-Spend Model",
        "Open Team Detail",
        "Inspect Ownership Evidence",
        "Start Savings Review",
        "Export Chargeback Preview",
        "Generate Live Forecast",
        "Run Handoff Scenario",
        "Refresh Integration Feed",
    ):
        assert label in js


def test_frontend_uses_consistent_grid_and_spacing_system() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert "--space-1: 4px;" in css
    assert "--space-3: 12px;" in css
    assert "--space-4: 16px;" in css
    assert "--space-8: 40px;" in css
    assert "--layout-gutter: 24px;" in css
    assert "--layout-gap: var(--space-4);" in css
    assert "--layout-section-gap: var(--space-6);" in css
    assert "--layout-page-gap: var(--space-7);" in css
    assert "--layout-card-padding: var(--space-5);" in css
    assert "--layout-hero-padding: var(--space-7);" in css
    assert "--layout-toolbar-padding: 12px 14px;" in css
    assert "--layout-table-cell-padding: 12px 14px;" in css
    assert "--layout-page-max: 1440px;" in css
    assert ".layout-stack" in css
    assert ".layout-stack > *" in css
    assert ".layout-cluster" in css
    assert ".layout-header" in css
    assert ".layout-mt-3" in css
    assert ".layout-mb-3" in css
    assert ".chart-frame-md" in css
    assert ".chart-frame-xl" in css
    assert ".metric-card .context-help-tooltip" in css
    assert ".table-sort-btn.has-context-help::after" in css
    assert "gap: var(--layout-gap);" in css
    assert "padding: var(--layout-gutter);" in css
    assert "width: min(100%, var(--layout-page-max));" in css
    assert "/* Whitespace Rhythm Contracts" in css
    whitespace_block = css.split("/* Whitespace Rhythm Contracts", 1)[1].split(
        "/* Component Consistency Contracts",
        1,
    )[0]
    assert ".screen-secondary-content," in whitespace_block
    assert ".partner-page," in whitespace_block
    assert "gap: var(--layout-page-gap);" in whitespace_block
    assert ".overview-zone," in whitespace_block
    assert "gap: var(--layout-section-gap);" in whitespace_block
    assert ".entry-home-context" in whitespace_block
    assert "margin-top: var(--space-7);" in whitespace_block
    assert ".table-toolbar," in whitespace_block
    assert "padding: var(--layout-toolbar-padding);" in whitespace_block
    assert ".table td" in whitespace_block
    assert "padding: var(--layout-table-cell-padding);" in whitespace_block
    assert "--layout-hero-padding: var(--space-5);" in css.split(
        "@media (max-width: 960px)",
        1,
    )[1]

    assert "const LAYOUT_SPACING_CLASS_BY_PX = new Map" in js
    assert "const CHART_FRAME_CLASS_BY_HEIGHT = new Map" in js
    assert "function normalizeLayoutContracts(root = document)" in js
    assert "function layoutSpacingClass(value, prefix)" in js
    assert "function applyLayoutSpacingClass(element, styleProp, prefix)" in js
    assert "normalizeLayoutContracts(scope);" in js
    assert (
        'stack.dataset.layout = stack.classList.contains("screen-secondary-content")'
        ' ? "page-stack" : "section-stack";'
    ) in js
    assert 'grid.dataset.layout = "grid";' in js
    assert 'cluster.dataset.layout = "cluster";' in js
    assert 'header.dataset.layout = "header";' in js
    assert 'frame.dataset.layout = "chart-frame";' in js
    assert 'class="card forecast-estimate-card"' in js
    assert 'style="padding:10px' not in js
    assert ".forecast-estimate-card" in css


def test_frontend_defines_semantic_typography_roles() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert '--font-ui: "Space Grotesk"' in css
    assert '--font-mono: "IBM Plex Mono"' in css
    assert "--type-heading-size: 24px;" in css
    assert "--type-heading-line: 28px;" in css
    assert "--type-subheading-size: 15px;" in css
    assert "--type-subheading-line: 20px;" in css
    assert "--type-body-size: 13px;" in css
    assert "--type-body-line: 20px;" in css
    assert "--type-label-size: 10px;" in css
    assert "--type-label-tracking: 0;" in css
    assert "--type-meta-size: 11px;" in css
    assert "--type-meta-line: 16px;" in css
    assert "--type-number-size: 28px;" in css
    assert "--type-number-line: 32px;" in css

    for role in ("heading", "subheading", "body", "label", "meta", "number"):
        assert f'.type-{role},' in css
        assert f'[data-typography="{role}"]' in css
        assert f'.app [data-typography="{role}"]' in css
        assert "element.dataset.typography = role;" in js
        assert "element.classList.add(`type-${role}`);" in js

    assert "const TYPOGRAPHY_ROLE_SELECTORS = Object.freeze({" in js
    assert 'const TYPOGRAPHY_INLINE_PROPS = Object.freeze(["fontSize"' in js
    assert 'heading: [' in js
    assert '".screen-priority-title"' in js
    assert '".integration-title"' in js
    assert "function normalizeTypographyContracts(root = document)" in js
    assert "normalizeTypographyContracts(scope);" in js
    assert "for (const prop of TYPOGRAPHY_INLINE_PROPS)" in js
    assert 'element.style[prop] = "";' in js
    assert ".card-title" in js
    assert ".metric-label" in js
    assert ".metric-meta" in js
    assert ".metric-value" in js

    assert ".page-title," in css
    assert ".screen-priority-title," in css
    assert ".card-title," in css
    assert ".card-subtitle," in css
    assert ".metric-label," in css
    assert ".metric-meta," in css
    assert ".status-badge" in css


def test_frontend_enforces_pixel_alignment_contracts() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert "/* Pixel Alignment Contracts" in css
    alignment_block = css.split("/* Pixel Alignment Contracts", 1)[1].split(
        "/* Typography Role Contracts",
        1,
    )[0]

    for token in (
        "--pixel-grid: 4px;",
        "--chrome-inline-padding: var(--space-4);",
        "--chrome-ribbon-min-height: 40px;",
        "--chrome-role-min-height: 56px;",
        "--entry-action-width: 280px;",
        "--control-height-sm: 32px;",
        "--control-height-md: 36px;",
        "--control-height-lg: 44px;",
    ):
        assert token in alignment_block

    for selector in (
        '[data-alignment="pixel-grid"]',
        ".topbar-left,\n.topbar-right",
        ".runtime-copy,\n.runtime-label,\n.runtime-detail",
        ".brand-title",
        ".brand-sub,\n.nav-label",
        ".demo-path-nav",
        ".demo-path-status,\n.demo-path-copy em",
        ".demo-path-step",
        ".demo-path-copy strong",
        ".nav-item",
        ".context-ribbon,\n.context-ribbon.entry-context",
        ".role-ribbon,\n.role-ribbon.entry-role",
        ".entry-home",
        ".entry-home-main,\n.entry-home-action",
        ".entry-home-context-item strong",
        ".card-header,\n.table-toolbar,\n.table-pagination",
    ):
        assert selector in alignment_block

    for snippet in (
        "line-height: 20px;",
        "line-height: 16px;",
        "line-height: 40px;",
        "line-height: 24px;",
        "grid-template-columns: minmax(0, 1fr) var(--entry-action-width);",
        "padding-inline: var(--chrome-inline-padding);",
        "padding: var(--space-2) var(--chrome-inline-padding);",
        "padding: var(--space-2) var(--space-3);",
    ):
        assert snippet in alignment_block

    assert "const PIXEL_ALIGNMENT_SELECTORS = Object.freeze([" in js
    assert '".demo-path-nav"' in js
    assert '".tenant-card"' in js
    assert '".runtime-chip"' in js
    assert "function normalizePixelAlignmentContracts(root = document)" in js
    assert 'element.dataset.alignment = "pixel-grid";' in js
    assert "normalizePixelAlignmentContracts(scope);" in js


def test_frontend_maintains_responsive_integrity_contracts() -> None:
    css = _read(FRONTEND_APP_CSS)

    assert "/* Responsive Integrity Contracts" in css
    responsive_block = css.split("/* Responsive Integrity Contracts", 1)[1].split(
        "@media (prefers-reduced-motion",
        1,
    )[0]

    for token in (
        "--responsive-mobile-touch-target: 44px;",
        "--responsive-drawer-width: min(460px, calc(100vw - 32px));",
        "--responsive-mobile-drawer-width: min(340px, calc(100vw - 24px));",
    ):
        assert token in responsive_block

    for media_query in (
        "@media (max-width: 1360px)",
        "@media (max-width: 1100px)",
        "@media (max-width: 960px)",
        "@media (max-width: 720px)",
        "@media (max-width: 520px)",
    ):
        assert media_query in responsive_block

    for selector in (
        ".app,\n.view-root,\n.topbar-left,\n.topbar-right",
        ".runtime-chip,\n.screen-priority,\n.entry-home",
        ".screen-priority .state-panel-actions",
        ".entry-home-action .small-btn",
        ".context-ribbon,\n  .role-ribbon",
        ".entry-home-context,\n  .grid-4,\n  .grid-3,\n  .grid-2",
        ".card-header,\n  .table-toolbar,\n  .table-pagination",
        ".table-context",
        ".table-tools",
        ".table-filter-input",
        ".mobile-nav-drawer",
    ):
        assert selector in responsive_block

    for snippet in (
        "min-width: 0;",
        "grid-template-columns: minmax(0, 1fr) minmax(180px, 240px);",
        "grid-template-columns: repeat(2, minmax(0, 1fr));",
        "grid-template-columns: 1fr;",
        "max-width: 420px;",
        "width: 100%;",
        "flex-wrap: wrap;",
        "min-height: var(--responsive-mobile-touch-target);",
        "width: var(--responsive-drawer-width);",
        "height: calc(100svh - 16px);",
    ):
        assert snippet in responsive_block


def test_frontend_uses_restrained_semantic_color_palette() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)
    dataset = json.loads((REPO_ROOT / "frontend" / "data" / "demo_dataset.json").read_text())

    assert "--brand: #4f8ef8;" in css
    assert "--brand-rgb: 79, 142, 248;" in css
    assert "--brand-soft: rgba(var(--brand-rgb), 0.15);" in css
    assert "--status-success: #2ac487;" in css
    assert "--status-warning: #eda82e;" in css
    assert "--status-danger: #ee5858;" in css
    assert "--purple: var(--brand);" in css
    assert "--cyan: var(--brand);" in css
    assert "radial-gradient(circle at 90% 115%, rgba(var(--brand-rgb), 0.09)" in css
    assert "linear-gradient(180deg, var(--brand-strong), var(--brand))" in css
    assert ".metric-card .context-help-tooltip" in css

    assert "const PALETTE = Object.freeze({" in js
    assert "passive: { bg: \"rgba(79,142,248,0.14)\", color: PALETTE.brandText }" in js
    assert "active: { bg: \"rgba(237,168,46,0.15)\", color: PALETTE.warningText }" in js
    assert "function paletteChartColor(value, fallback = PALETTE.brand)" in js
    assert "backgroundColor: [PALETTE.brand, PALETTE.success, PALETTE.neutral]" in js
    assert (
        "const comparePalette = [PALETTE.brand, PALETTE.success, "
        "PALETTE.warning, PALETTE.neutral];"
    ) in js

    stale_accents = (
        "#9470ff",
        "#1dbcc8",
        "#8f6af8",
        "#d86ef5",
        "#60dde6",
        "#b49bff",
        "#f18f42",
        "rgba(29, 188, 200",
        "rgba(148, 112, 255",
        "rgba(232, 93, 140",
        "255, 111, 145",
        "255, 195, 92",
    )
    for stale in stale_accents:
        assert stale not in css
        assert stale not in js

    allowed_dataset_colors = {"#4f8ef8", "#2ac487", "#eda82e", "#ee5858", "#8ea0bf"}
    assert {
        item["color"] for item in dataset["optimization_categories"] if item.get("color")
    } <= allowed_dataset_colors


def test_frontend_enforces_readable_contrast_contracts() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)
    html = _read(FRONTEND_INDEX)

    contrast_pairs = (
        ("#e8eef8", "#080d16"),
        ("#a8b8d4", "#0f1724"),
        ("#96a7c2", "#0b1220"),
        ("#06101f", "#4f8ef8"),
        ("#06101f", "#6aa1ff"),
        ("#06101f", "#2ac487"),
        ("#06101f", "#eda82e"),
        ("#06101f", "#ee5858"),
    )
    for foreground, background in contrast_pairs:
        assert _contrast_ratio(foreground, background) >= 4.5

    assert "--text-dim: #a8b8d4;" in css
    assert "--text-muted: #96a7c2;" in css
    assert "--accent-ink: #06101f;" in css
    assert "color: var(--accent-ink);" in css.split(".skip-link", 1)[1].split(
        ".skip-link:focus",
        1,
    )[0]
    assert ".brand-logo svg" in css
    assert "background-color: var(--brand);" in css.split(".brand-logo", 1)[1].split(
        ".brand-logo svg",
        1,
    )[0]
    assert "color: var(--accent-ink);" in css.split(".brand-logo", 1)[1].split(
        ".brand-logo svg",
        1,
    )[0]
    assert 'stroke="#fff"' not in html
    assert ".avatar" in css
    assert "background-color: var(--brand);" in css.split(".avatar", 1)[1].split(
        ".mode-menu",
        1,
    )[0]
    assert "color: var(--accent-ink);" in css.split(".avatar", 1)[1].split(
        ".mode-menu",
        1,
    )[0]
    assert ".screen-secondary-content .section-title" in css
    assert "color: var(--text-muted);" in css.split(
        ".screen-secondary-content .section-title",
        1,
    )[1].split(".screen-secondary-content .card:not", 1)[0]
    assert ".entry-home-action .small-btn.primary" in css
    assert "color: var(--action-primary-text);" in css.split(
        ".entry-home-action .small-btn.primary",
        1,
    )[1].split(".entry-home-action span", 1)[0]
    assert ".adoption-child-card" in css
    assert "color: var(--text);" in css.split(
        ".adoption-kpi-card,",
        1,
    )[1].split(".adoption-child-label", 1)[0]
    assert "font: inherit;" in css.split(".adoption-kpi-card,", 1)[1].split(
        ".adoption-child-label",
        1,
    )[0]
    assert ".adoption-child-stat strong" in css
    assert ".trac-segment" in css
    assert "color: var(--accent-ink);" in css.split(".trac-segment", 1)[1].split(
        ".diagnostics-intro",
        1,
    )[0]
    assert 'brandText: "#c2dcff"' in js
    assert 'neutral: "#a8b8d4"' in js


def test_frontend_uses_single_line_icon_style_contract() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)
    html = _read(FRONTEND_INDEX)
    nav_items_block = js.split("const NAV_ITEMS = [", 1)[1].split(
        "const ALL_PAGE_KEYS",
        1,
    )[0]

    assert "--icon-size: 18px;" in css
    assert "--icon-stroke-width: 1.9;" in css
    assert ".app-icon {" in css
    assert "fill: none;" in css.split(".app-icon {", 1)[1].split(".app-icon *", 1)[0]
    assert "stroke: currentColor;" in css.split(".app-icon {", 1)[1].split(
        ".app-icon *",
        1,
    )[0]
    assert "stroke-width: var(--icon-stroke-width);" in css
    assert "stroke-linecap: round;" in css
    assert "stroke-linejoin: round;" in css
    assert "vector-effect: non-scaling-stroke;" in css
    assert ".nav-item .app-icon" in css

    assert 'class="app-icon app-icon-brand"' in html
    assert "fill='%234f8ef8'" in html
    assert "stroke='%2306101f'" in html
    assert "%238f6af8" not in html
    assert "stroke='%23fff'" not in html
    assert 'stroke="#fff"' not in html
    assert 'stroke-width="2"' not in html

    assert 'const LINE_ICON_VIEWBOX = "0 0 24 24";' in js
    assert 'function renderLineIcon(icon, className = "app-icon nav-icon")' in js
    assert 'renderLineIcon(item.icon)' in js
    assert 'stroke-width="2"' not in js
    assert 'stroke="currentColor"' not in js
    assert 'fill="none"' not in nav_items_block
    assert 'stroke=' not in nav_items_block
    assert 'fill=' not in nav_items_block


def test_frontend_uses_consistent_component_visual_contracts() -> None:
    css = _read(FRONTEND_APP_CSS)

    for token in (
        "--radius-control: 8px;",
        "--radius-card: 12px;",
        "--radius-overlay: 12px;",
        "--radius-pill: 999px;",
        "--component-border: 1px solid var(--border);",
        "--component-border-muted: 1px solid rgba(120, 137, 168, 0.18);",
        "--component-border-strong: 1px solid var(--border-soft);",
        "--component-surface: var(--panel);",
        "--component-hover: rgba(var(--brand-rgb), 0.09);",
        "--component-focus-ring: 0 0 0 3px rgba(var(--brand-rgb), 0.2);",
        "--component-shadow-hover: 0 14px 28px rgba(4, 10, 18, 0.22);",
        "--component-shadow-overlay: 0 18px 40px rgba(0, 0, 0, 0.32);",
        "--component-transition: border-color 0.14s ease",
    ):
        assert token in css

    controls_block = css.split(".control-input,", 1)[1].split(".filter-btn,", 1)[0]
    assert ".control-select," in controls_block
    assert ".small-btn," in controls_block
    assert ".top-btn," in controls_block
    assert ".drawer-close," in controls_block
    assert "border: var(--component-border);" in controls_block
    assert "border-radius: var(--radius-control);" in controls_block
    assert "transition: var(--component-transition);" in controls_block

    cards_block = css.split(".card,", 1)[1].split(".clickable-card:hover", 1)[0]
    assert ".adoption-kpi-card," in cards_block
    assert ".workflow-spotlight-card," in cards_block
    assert ".drawer-purpose," in cards_block
    assert "border: var(--component-border);" in cards_block
    assert "border-radius: var(--radius-card);" in cards_block
    assert "background-color: var(--component-surface);" in cards_block

    assert ".scannable-table-wrap" in css
    assert "border: var(--component-border-muted);" in css
    assert "background: var(--component-surface-soft);" in css
    assert ".filter-btn,\n.pill,\n.badge,\n.status-badge,\n.table-sort-indicator" in css
    assert ".table-sort-btn,\n.table tbody tr" in css
    assert ".mode-menu,\n.toast,\n.context-help-tooltip,\n.inline-term-tooltip" in css
    assert "border: var(--component-border-strong);" in css
    assert "border-radius: var(--radius-overlay);" in css
    assert "box-shadow: var(--component-shadow-overlay);" in css
    assert ".drawer {\n  border-left: var(--component-border-strong);" in css


def test_frontend_demo_validates_role_based_personas() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)
    dataset = json.loads((REPO_ROOT / "frontend" / "data" / "demo_dataset.json").read_text())
    account_roles = {account["role"] for account in dataset["admin"]["accounts"]}
    summary_roles = set(dataset["admin"]["summary"]["rbac_roles"])

    assert "const DEMO_PERSONAS = [" in js
    assert 'key: "admin"' in js
    assert 'key: "manager"' in js
    assert 'key: "user"' in js
    assert 'key: "auditor"' in js
    assert "activePersonaKey: \"admin\"" in js
    assert "function activeDemoPersona()" in js
    assert "function personaCanAccessPage(pageKey, persona = activeDemoPersona())" in js
    assert "function personaHasPermission(persona, permissions = [])" in js
    assert (
        "function personaCanUseAction(action, descriptor = {}, persona = activeDemoPersona())"
        in js
    )
    assert "function normalizeRoleBasedControls(root = document)" in js
    assert "function personaCanPerformOperation(operation, persona = activeDemoPersona())" in js
    assert "function personaVisibleAccounts(accounts = [], persona = activeDemoPersona())" in js
    assert "function personaVisibleOperations(operations = [], persona = activeDemoPersona())" in js
    assert "function personaVisibleAuditEvents(events = [], persona = activeDemoPersona())" in js
    assert "data-action=\"set-demo-persona\"" in js
    assert "Persona Access Preview" in js
    assert "Allowed for persona" in js
    assert "Restricted</span>" not in js
    assert "nav-item.locked" not in css
    assert "nav-lock" not in js
    assert "nav-lock" not in css
    assert 'group.items.filter((item) => personaCanAccessPage(item.key, persona))' in js
    assert "DEMO_PATH_ITEMS.filter((item) => personaCanAccessPage(item.page, persona))" in js
    assert "This view lists only operations available to the selected persona." in js
    assert (
        "This persona has a read-only view here; mutation options are intentionally hidden."
        in js
    )
    assert "Action Hidden For Role" in js
    assert ".persona-card-grid" in css
    assert ".persona-permission-panel" in css
    assert {"Admin", "Manager", "User", "Auditor"} <= account_roles
    assert account_roles == summary_roles


def test_frontend_assets_are_externalized() -> None:
    html = _read(FRONTEND_INDEX)
    assert "<style>" not in html
    assert "<script>\n" not in html
    assert "mobile-nav-drawer" in html
    assert "drawer-progress" in html
    assert 'id="start-walkthrough"' in html
    assert 'id="walkthrough-banner"' in html
    assert not LEGACY_V3_MOCKUP.exists()


def test_frontend_polish_and_responsive_guards_present() -> None:
    css = _read(FRONTEND_APP_CSS)
    js = _read(FRONTEND_APP_JS)
    assert ".app-loader" in css
    assert ".demo-boot-state" in css
    assert ".demo-skeleton-card" in css
    assert "grid-template-columns: 1fr;" in css
    assert ".entry-home" in css
    assert ".entry-home-action .small-btn" in css
    assert ".topbar.entry-home-active #start-walkthrough" in css
    assert ".topbar.entry-home-active #open-guided-demo" in css
    assert ".view-root.transitioning" in css
    assert ".drawer-actions.busy .small-btn" in css
    assert "width: min(360px, calc(100vw - 280px));" in css
    assert "--text-muted: #96a7c2;" in css
    assert "grid-template-columns: repeat(3, minmax(0, 1fr));" in css
    assert "max-height: 2000px;" in css
    assert "overflow-y: auto;" in css
    assert "root.classList.add(\"transitioning\")" in js
    assert "loader.remove();" in js
    assert "drawerBody.scrollTop = 0;" in js
    assert "A requestAnimationFrame debounce was" in js
    assert 'No models available in the current dataset.' in js
    assert 'No teams available in the current dataset.' in js
    assert 'No manual mapping items are available in the current dataset.' in js
    assert "state.pendingDemoAction && [" in js
    assert "\"clear-logs\"].includes(action)" in js
    assert "closest(\"[data-action][role='button'], tr[data-action]\")" in js
    assert 'role="button" tabindex="0" aria-label="Open Forecasting"' in js
    assert 'role="button" tabindex="0" aria-label="Open Manual Mapping"' in js
    assert 'role="button" tabindex="0" aria-label="Open Interventions"' in js
    assert "window.localStorage" not in js
    assert 'role="button" tabindex="0" aria-label="Open ${esc(team.name)} team detail"' in js
    assert "Backend reachable; returned controlled operator response" in js
    assert "response.status >= 500" in js
    assert 'typeof value.status === "string"' in js
    assert "Argmin demo is ready" in js
    assert "root.classList.toggle(\"entry-context\", entryHomeActive)" in js
    assert "root.classList.toggle(\"entry-role\", entryHomeActive)" in js
    assert "TBD" not in js


def test_overview_entry_home_has_one_primary_decision() -> None:
    js = _read(FRONTEND_APP_JS)
    overview_block = js.split("function overviewView()", 1)[1].split(
        "function renderOverviewCharts()", 1
    )[0]
    entry_block = overview_block.split('<div class="entry-home"', 1)[1].split(
        '<div class="section-title">Executive Summary</div>', 1
    )[0]

    assert 'aria-label="Prepared local demo home"' in entry_block
    assert "Executive lens, Admin persona, Advisory mode" in entry_block
    assert entry_block.count('data-action="start-walkthrough"') == 1
    assert "Start Guided Demo" in entry_block
    assert "Open Partner Brief" not in entry_block
    assert "Open Guided Demo" not in entry_block


def test_guided_demo_drawer_uses_presenter_facing_copy() -> None:
    html = _read(FRONTEND_INDEX)
    js = _read(FRONTEND_APP_JS)
    assert "Recommended path" in html
    assert "Live Proof Controls" in html
    assert "Current Result" in html
    assert "Recent Activity" in html
    assert "Recommended next step" in js
    assert "Presentation mode" in js
    assert "The walkthrough is available from local demo data." in js
    assert "No demo activity yet." in js
    assert "Start Guided Demo" in js


def test_presenter_mode_has_manual_path_recovery_and_shortcuts() -> None:
    html = _read(FRONTEND_INDEX)
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert 'id="presenter-mode-toggle"' in html
    assert 'id="presenter-console"' in html
    assert 'data-action="toggle-presenter-mode"' in html
    assert "presenterMode: false" in js
    assert "function renderPresenterConsole()" in js
    assert "function presenterAvailableSteps" in js
    assert "function recoverPresenterStep()" in js
    assert "function activeWalkthroughAnchor()" in js
    assert 'case "presenter-next"' in js
    assert 'case "presenter-prev"' in js
    assert 'case "presenter-recover"' in js
    assert 'case "presenter-step"' in js
    assert 'event.key === "ArrowRight"' in js
    assert 'event.key === "ArrowLeft"' in js
    assert "Shift+R reset" in js
    assert "Off script: current page is" in js
    assert "Reset complete. Presenter mode is back at step 1." in js
    assert ".presenter-console" in css
    assert ".presenter-console.off-script" in css
    assert ".presenter-step-dot.active" in css
    assert ".top-btn.presenter-toggle.active" in css


def test_forecast_scenario_selection_updates_preview_state_immediately() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "function updateForecastPreview(options = {})" in js
    assert "Generate Live Forecast" in js
    scenario_block = js.split('case "forecast-set-scenario":', 1)[1].split(
        'case "forecast-set-horizon":', 1
    )[0]
    horizon_block = js.split('case "forecast-set-horizon":', 1)[1].split(
        'case "forecast-compare-toggle":', 1
    )[0]
    assert "updateForecastPreview();" in scenario_block
    assert "updateForecastPreview();" in horizon_block
    assert "markForecastDirty();" not in scenario_block
    assert "markForecastDirty();" not in horizon_block
    assert "Inputs Used" not in js
    assert 'id="forecast-inputs-used"' not in js


def test_frontend_uses_dataset_fallback_and_not_stale_overview_fetch() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "const FALLBACK_DATASET" in js
    assert "const DATASET_VERSION" in js
    assert "const DATASET_URL" in js
    assert "demo_dataset.json?v=${DATASET_VERSION}" in js
    assert 'fetch(DATASET_URL' in js
    assert 'fetch(DATASET_URL, { cache: "default" })' in js
    assert 'cloneData(FALLBACK_DATASET)' in js
    assert '"/v1/dashboard/overview"' not in js


def test_frontend_starts_local_first_instead_of_eager_live_sync() -> None:
    js = _read(FRONTEND_APP_JS)
    initialize_block = js.split(
        "async function initialize() {", 1
    )[1].split("}\n\nwindow.addEventListener", 1)[0]
    reset_demo_block = js.split(
        "async function clearExecutionLogs() {", 1
    )[1].split("}\n\nfunction setMobileNav(", 1)[0]
    reset_block = js.split(
        "async function resetForecastPlanner(options = {}) {", 1
    )[1].split("}\n\nfunction forecastView()", 1)[0]
    assert 'runtimeStatus: "local"' in js
    assert "Using deterministic local demo data until a live action is requested" in js
    assert "await syncInterventionsFromApi();" not in initialize_block
    assert 'await syncAdoptionFromApi({ render: false });' not in initialize_block
    assert 'await syncIntegrationsFromApi({ render: false });' not in initialize_block
    assert "await syncInterventionsFromApi();" not in reset_demo_block
    assert "await syncAdoptionFromApi" not in reset_demo_block
    assert "await syncIntegrationsFromApi" not in reset_demo_block
    assert "await runForecastDemo({" not in reset_block
    assert "seedForecastPlanner({" in reset_block


def test_frontend_demo_reset_and_scenarios_are_deterministic() -> None:
    js = _read(FRONTEND_APP_JS)
    scenario_block = js.split(
        "async function runInterceptScenario(kind, options = {}) {", 1
    )[1].split("}\n\nfunction scenarioNarrative(", 1)[0]
    reset_block = js.split(
        "async function clearExecutionLogs() {", 1
    )[1].split("}\n\nfunction setMobileNav(", 1)[0]
    initialize_block = js.split(
        "async function initialize() {", 1
    )[1].split("}\n\nwindow.addEventListener", 1)[0]

    assert "demoScenarioRunCounts: {}" in js
    assert "async function resetBackendDemoState(options = {})" in js
    assert 'apiRequest("POST", "/v1/demo/reset", {})' in js
    assert "function clearDemoSessionStorage(options = {})" in js
    assert "includeAuthTokens = false" in js
    assert "INTERVENTION_STORAGE_KEY" in js
    assert "MANUAL_MAPPING_STORAGE_KEY" in js
    assert "...(includeAuthTokens ? API_TOKEN_STORAGE_KEYS : [])" in js
    assert "function nextDemoScenarioRequestId(kind)" in js
    assert "Date.now()" not in scenario_block
    assert "nextDemoScenarioRequestId(kind)" in scenario_block
    assert "clearDemoSessionStorage();" in reset_block
    assert "state.demoScenarioRunCounts = {};" in reset_block
    assert "resetBackendDemoState({ log: false, toast: false })" in reset_block
    assert 'params.get("reset") === "1"' in initialize_block
    assert "clearDemoSessionStorage();" in initialize_block
    assert "clearDemoSessionStorage({ includeAuthTokens: true });" in initialize_block


def test_manual_mapping_view_handles_session_state_without_numeric_crashes() -> None:
    js = _read(FRONTEND_APP_JS)
    manual_mapping_block = js.split("function manualMappingView() {", 1)[1].split(
        "}\n\nfunction governanceView()",
        1,
    )[0]

    assert "impact.beforeConfidence.toFixed" not in manual_mapping_block
    assert "impact.afterConfidence.toFixed" not in manual_mapping_block
    assert "latestImpact.beforeConfidence.toFixed" not in manual_mapping_block
    assert "latestImpact.afterConfidence.toFixed" not in manual_mapping_block
    assert "fmtPct(impact.beforeConfidence, 0)" in manual_mapping_block
    assert "fmtPct(latestImpact.beforeConfidence, 0)" in manual_mapping_block


def test_frontend_intervention_sync_can_clear_with_empty_live_payload() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "if (!Array.isArray(rows))" in js
    assert "dataset.interventions = merged;" in js
    assert "if (!incoming.length)" not in js


def test_frontend_intervention_write_failures_keep_optimistic_demo_state() -> None:
    js = _read(FRONTEND_APP_JS)
    intervention_block = js.split("async function updateInterventionStatus", 1)[1].split(
        "async function updateManualMapping",
        1,
    )[0]
    assert "const previousStatus = currentStatus;" in intervention_block
    assert "intervention.status = normalized;" in intervention_block
    assert (
        "Live intervention status update unavailable; the local demo retained"
        in intervention_block
    )
    assert "Intervention Saved Locally" in intervention_block


def test_frontend_glossary_and_faq_search_use_labels_and_partial_updates() -> None:
    js = _read(FRONTEND_APP_JS)
    assert 'for="glossary-query-input"' in js
    assert 'for="faq-query-input"' in js
    assert 'id="glossary-summary"' in js
    assert 'id="glossary-results"' in js
    assert 'id="faq-results"' in js
    assert "renderGlossaryResults()" in js
    assert "renderFaqResults()" in js


def test_frontend_docs_state_static_shell_and_local_first_runtime() -> None:
    readme = _read(FRONTEND_README)
    assert "intentionally self-contained and deterministic" in readme
    assert "plain HTML, CSS, and JavaScript" in readme
    assert "local-data mode" in readme
    assert "before the presenter asks" in readme


def test_feature_to_demo_coverage_matrix_treats_mocks_as_contracts() -> None:
    matrix = _read(FEATURE_DEMO_MATRIX)
    readme = _read(REPO_ROOT / "README.md")
    surface_reference = _read(REPO_ROOT / "docs" / "demo-feature-matrix.md")

    assert "Feature-to-Demo Coverage Matrix" in matrix
    assert "mocks as product contracts" in matrix
    assert "production capability-to-local mock contract matrix" in surface_reference
    assert "feature-demo-coverage-matrix.md" in readme

    for heading in (
        "Production capability",
        "Local demo equivalent",
        "Mock source of truth",
        "Dummy dataset or seed",
        "UI path",
        "Contract expectations",
        "Validation status",
    ):
        assert heading in matrix

    required_capabilities = (
        "Immutable multi-source event ingestion",
        "Heuristic reconciliation and ownership graph",
        "Materialized attribution index",
        "Decision-time interceptor",
        "Policy evaluation and deployment mode controls",
        "Pricing catalog and cost estimation",
        "FinOps reconciliation and drift",
        "Forecasting and planning",
        "Optimization interventions",
        "Workforce and workflow AI adoption intelligence",
        "Enterprise integrations and operational handoffs",
        "Chargeback and export posture",
        "Energy, carbon, and TRAC posture",
        "Manual mapping and human correction",
        "Authentication, RBAC, and permission posture",
        "Observability and readiness",
        "Shared-backend production topology",
        "Deterministic reset and local setup",
        "Security and local safety boundaries",
        "UI product narrative and design-partner proof",
    )
    for capability in required_capabilities:
        assert capability in matrix

    for contract_term in (
        "422",
        "413",
        "429",
        "404",
        "503",
        "bounded `limit` pagination",
        "redacted",
        "demo bypass",
        "production/staging demo reset is forbidden",
    ):
        assert contract_term in matrix


def test_frontend_tables_are_wrapped_for_horizontal_scroll() -> None:
    js = _read(FRONTEND_APP_JS)
    table_count = js.count('<table class="table')
    wrapper_count = js.count('<div class="table-wrap')
    assert table_count > 0
    assert wrapper_count >= table_count


def test_frontend_tables_are_scannable_sortable_filterable_and_paged() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert "tableUi: {}" in js
    assert "const DEFAULT_TABLE_PAGE_SIZE = 8" in js
    assert "const TABLE_PAGE_SIZE_OPTIONS = [8, 16, 32]" in js
    assert "function normalizeScannableTables(root = document)" in js
    assert "function setupScannableTable(table, tableKey)" in js
    assert "function applyScannableTable(table)" in js
    assert "function updateTableSort(tableKey, columnIndex)" in js
    assert "function updateTableFilter(tableKey, value)" in js
    assert "function updateTablePage(tableKey, delta)" in js
    assert "function updateTablePageSize(tableKey, value)" in js
    assert "normalizeScannableTables(scope);" in js
    assert "const sortedMatchingRows = sortedRows.filter((row) => matchingSet.has(row));" in js
    assert "const visibleRows = new Set(sortedMatchingRows.slice(" in js
    assert 'data-action-input="table-filter"' in js
    assert 'data-action-change="table-page-size"' in js
    assert 'data-action="table-sort"' in js
    assert 'data-action="table-page"' in js
    assert "aria-sort" in js
    assert "aria-pressed" in js
    assert "No rows match this quick filter." in js
    assert "Clear the quick filter to restore the current seeded table." in js
    assert "state.tableUi = {};" in js

    assert ".scannable-table-wrap" in css
    assert ".table-toolbar" in css
    assert ".table-filter-input" in css
    assert ".table-pagination" in css
    assert ".table-sort-btn" in css
    assert ".table-sort-indicator" in css
    assert ".table th.table-primary-column" in css
    assert ".table td.table-number-column" in css
    assert "position: sticky;" in css


def test_frontend_navigation_is_not_decorative() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "const NAV_ITEMS" in js
    assert 'data-action="go"' in js
    assert "aria-current" in js
    assert "state.scrollTopByPage[pageKey] = 0;" in js


def test_frontend_navigation_has_shallow_demo_path_and_return_control() -> None:
    html = _read(FRONTEND_INDEX)
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)

    assert "const DEMO_PATH_ITEMS" in js
    assert "const SUPPORTING_PAGE_DEMO_PATH_TARGETS" in js
    assert "function renderDemoPathNav" in js
    assert "function demoPathTargetPage" in js
    assert "function demoPathProgressLabel" in js
    assert "case \"back-to-demo-path\"" in js
    assert 'id="back-to-demo-path"' in html
    assert 'data-action="back-to-demo-path"' in html
    assert "${renderDemoPathNav(persona)}${directoryMarkup}" in js
    assert ".demo-path-nav" in css
    assert ".demo-path-step.active" in css
    assert ".top-btn.path-return" in css
    for label in (
        "Start",
        "Adoption",
        "Proof",
        "Resolve",
        "Act",
        "Plan",
        "Trust",
    ):
        assert f'label: "{label}"' in js


def test_frontend_investor_walkthrough_is_defined() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "const INVESTOR_WALKTHROUGH_STEPS" in js
    assert "Overview: where the money is" in js
    assert "PRD Proof: every claim tied to a visible surface" in js
    assert "Coverage: what the system can and cannot see" in js
    assert "Employee Adoption: who is actually using AI" in js
    assert "Request Proof: why one request belongs to one owner" in js
    assert "Exports: chargeback without false precision" in js
    assert "Interventions: what to do next" in js
    assert "Energy: footprint as an advisory signal" in js
    assert "Forecasting: what happens if you act" in js
    assert "Governance: why this is safe to deploy" in js
    assert "Admin: operable inside the trust boundary" in js
    assert "function renderWalkthroughBanner()" in js
    assert 'data-action="start-walkthrough"' in _read(FRONTEND_INDEX)
    assert "const INVESTOR_WALKTHROUGH_TOTAL_MS" in js
    assert "durationMs: 12000" in js
    assert "durationMs: 10000" in js
    assert "durationMs: 9000" in js
    assert "durationMs: 11000" in js
    assert "durationMs: 15000" in js
    assert "durationMs: 13000" in js
    assert "durationMs: 14000" in js
    assert "durationMs: 8000" in js


def test_frontend_demo_includes_prd_traceability_proof_surface() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)
    readme = _read(FRONTEND_README)
    schema = _read(FRONTEND_SCHEMA)
    feature_matrix = _read(REPO_ROOT / "docs" / "demo-feature-matrix.md")
    dataset_path = REPO_ROOT / "frontend" / "data" / "demo_dataset.json"
    dataset = json.loads(dataset_path.read_text(encoding="utf-8"))

    assert "PRD Proof" in js
    assert "requirementsView" in js
    assert 'data-action="select-proof-journey"' in js
    assert "Pathway Coverage Matrix" in js
    assert "Requirement Coverage Matrix" in js
    assert ".proof-hero" in css
    assert ".rail-stage-grid" in css
    assert "prd_traceability" in schema
    assert "PRD Proof page maps the attached Argmin artifacts" in readme
    assert "| `PRD Proof` |" in feature_matrix

    traceability = dataset["prd_traceability"]
    assert len(traceability["document_sources"]) >= 6
    assert len(traceability["journeys"]) >= 6
    assert len(traceability["decision_surfaces"]) >= 6
    assert len(traceability["rail_pipeline"]) >= 4
    assert len(traceability["invariants"]) >= 8
    assert len(traceability["pathway_matrix"]) >= 10
    assert len(traceability["requirement_matrix"]) >= 20
    assert {journey["key"] for journey in traceability["journeys"]} >= {
        "money",
        "models",
        "adoption",
        "budget",
        "trust",
        "dispute",
    }


def test_frontend_demo_includes_local_prd_gap_surfaces() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)
    readme = _read(FRONTEND_README)
    schema = _read(FRONTEND_SCHEMA)
    feature_matrix = _read(REPO_ROOT / "docs" / "demo-feature-matrix.md")

    for label in ("Coverage", "Exports", "Energy", "Admin"):
        assert label in js
        assert f"| `{label}` |" in feature_matrix
        assert label in readme

    assert "coverageView" in js
    assert "exportsView" in js
    assert "energyView" in js
    assert "adminView" in js
    assert 'data-walkthrough-anchor="walkthrough-coverage"' in js
    assert 'data-walkthrough-anchor="walkthrough-exports"' in js
    assert 'data-walkthrough-anchor="walkthrough-energy"' in js
    assert 'data-walkthrough-anchor="walkthrough-admin"' in js
    assert 'data-action="set-export-mode"' in js
    assert 'data-artifact="chargeback-export"' in js
    assert "starRatingMarkup" in js
    assert ".coverage-page" in css
    assert ".exports-page" in css
    assert ".energy-page" in css
    assert ".admin-page" in css
    assert "coverage" in schema
    assert "exports" in schema
    assert "energy_efficiency" in schema
    assert "admin" in schema


def test_frontend_adoption_answers_product_lead_workflow_story() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)
    schema = _read(FRONTEND_SCHEMA)
    feature_matrix = _read(REPO_ROOT / "docs" / "demo-feature-matrix.md")
    readme = _read(FRONTEND_README)
    dataset_path = REPO_ROOT / "frontend" / "data" / "demo_dataset.json"
    dataset = json.loads(dataset_path.read_text(encoding="utf-8"))

    assert "Product Lead Workflow Map" in js
    assert "Workflow Adoption Matrix" in js
    assert "Capability Deployment Map" in js
    assert "Workflow insertion point" in js
    assert "adoptionWorkflowRowsForDashboard" in js
    assert ".workflow-spotlight-card" in css
    assert "adoption.workflow_map.workflows[]" in schema
    assert "workflow insertion points" in feature_matrix
    assert "workflow, service, and capability adoption" in readme
    reset_block = js.split('case "adoption-reset":', 1)[1].split(
        'case "forecast-set-scenario":',
        1,
    )[0]
    scope_block = js.split("function setAdoptionScope", 1)[1].split(
        "function setAdoptionWindow",
        1,
    )[0]
    assert "currentAdoptionDashboard()" in scope_block
    assert "fallbackAdoptionHierarchy" in reset_block
    assert "syncAdoptionFromApi" not in reset_block

    workflow_map = dataset["adoption"]["workflow_map"]
    workflows = workflow_map["workflows"]
    assert workflow_map["summary"]["workflow_count"] == len(workflows)
    assert workflow_map["summary"]["ai_services_used"] == len(
        {row["service_name"] for row in workflows}
    )
    assert workflow_map["summary"]["capability_classes"] == len(
        {row["capability_class"] for row in workflows}
    )
    assert len(workflow_map["capabilities"]) == len(
        {row["capability"] for row in workflows}
    )
    assert len(workflow_map["services"]) == workflow_map["summary"]["ai_services_used"]
    assert len(workflows) >= 20
    assert {row["business_unit_name"] for row in workflows} >= {
        "Product and Platform",
        "Customer Operations",
        "Risk and Trust",
        "Finance and Operations",
    }
    assert len({row["service_name"] for row in workflows}) >= 16
    assert len({row["capability_class"] for row in workflows}) >= 16
    assert {row["adoption_depth"] for row in workflows} >= {
        "Scaled",
        "Embedded",
        "Emerging",
        "Pilot",
    }
    required_fields = {
        "workflow_name",
        "service_name",
        "capability",
        "entry_point",
        "exact_where",
        "how_adopted",
        "evidence",
        "decision_owner",
    }
    for workflow in workflows:
        assert required_fields <= workflow.keys()
        assert all(str(workflow[field]).strip() for field in required_fields)
        assert workflow["users_30d"] > 0
        assert workflow["requests_30d"] > 0
        assert workflow["governed_usage_pct"] > 0


def test_frontend_dataset_supports_local_prd_requirement_surfaces() -> None:
    dataset_path = REPO_ROOT / "frontend" / "data" / "demo_dataset.json"
    dataset = json.loads(dataset_path.read_text(encoding="utf-8"))

    coverage = dataset["coverage"]
    coverage_summary = coverage["summary"]
    assert coverage_summary["classified_pathways"] == 20
    assert len(coverage["pathways"]) == coverage_summary["classified_pathways"]
    assert {row["feasibility"] for row in coverage["pathways"]} >= {
        "FULLY_CAPTURABLE",
        "PARTIALLY_CAPTURABLE",
        "INDIRECTLY_CAPTURABLE",
        "UNCAPTURABLE",
    }
    assert len(coverage["blind_spots"]) >= 5
    lineage = coverage["agent_lineage"]
    assert lineage["linked_descendant_calls"] <= lineage["total_descendant_calls"]
    assert any(not call["linked"] for call in lineage["calls"])
    assert len(coverage["scenario_results"]) >= 20
    assert {row["id"] for row in coverage["scenario_results"]} >= {"S-001", "S-020"}

    exports = dataset["exports"]
    assert exports["summary"]["rows_previewed"] == len(exports["rows"])
    assert len(exports["rows"]) >= 14
    assert {row["ownership_state"] for row in exports["rows"]} >= {
        "CHARGEBACK_READY_SINGLE_CANDIDATE",
        "PROVISIONAL_SINGLE_CANDIDATE",
        "SHARED",
        "UNKNOWN",
        "UNRESOLVED_CONFLICT",
    }
    assert sum(row["share_pct"] for row in exports["allocation_splits"]) == 100
    assert exports["summary"]["unknown_excluded_usd"] > 0

    energy = dataset["energy_efficiency"]
    assert len(energy["models"]) >= 12
    assert {row["status"] for row in energy["models"]} >= {"rated", "unrated"}
    assert any(row["star_rating"] is None for row in energy["models"])
    assert any(row["kwh_per_1k_requests"] is None for row in energy["models"])
    assert len(energy["recommendations"]) >= 3
    assert all("decision" in row for row in energy["recommendations"])

    admin = dataset["admin"]
    assert len(admin["accounts"]) >= 8
    assert len(admin["operations"]) >= 8
    assert len(admin["diagnostics"]) >= 8
    assert len(admin["audit_log"]) >= 8
    assert {row["status"] for row in admin["accounts"]} >= {"active", "deactivated"}
    assert admin["summary"]["read_only_integrations"] > 0
    assert admin["summary"]["mutation_surfaces"] == sum(
        1 for row in admin["operations"] if row["write_target"] != "none"
    )
    assert all(
        "Argmin " in row["write_target"] or row["write_target"] == "none"
        for row in admin["operations"]
    )
    assert all(row["audit"] == "required" for row in admin["operations"])


def test_frontend_dataset_has_rich_clickthrough_variants() -> None:
    dataset_path = REPO_ROOT / "frontend" / "data" / "demo_dataset.json"
    dataset = json.loads(dataset_path.read_text(encoding="utf-8"))
    team_names = {team["name"] for team in dataset["teams"]}
    model_names = {model["name"] for model in dataset["models"]}

    requests = dataset["attribution_requests"]
    assert len(requests) >= 14
    assert {request["model"] for request in requests} <= model_names
    assert any(request["confidence"] >= 0.9 for request in requests)
    assert any(0.8 <= request["confidence"] < 0.9 for request in requests)
    assert any(request["confidence"] < 0.8 for request in requests)
    assert any(
        "R6:" in node["method"]
        for request in requests
        for node in request["chain"]
    )
    assert any(
        node["value"] == "UNKNOWN"
        for request in requests
        for node in request["chain"]
        if node["layer"] == "Org Hierarchy"
    )

    mappings = dataset["manual_mapping"]
    assert len(mappings) >= 8
    assert {row["status"] for row in mappings} >= {
        "needs_review",
        "confirmed",
        "reassigned",
        "deferred",
    }
    for mapping in mappings:
        assert set(mapping["candidate_teams"]) <= (team_names | {"UNKNOWN"})

    interventions = dataset["interventions"]
    assert len(interventions) >= 14
    assert {row["status"] for row in interventions} >= {
        "recommended",
        "review",
        "approved",
        "implemented",
    }
    assert len({row["type"] for row in interventions}) >= 10
    assert all(row["team"] in team_names for row in interventions)

    integrations = dataset["integrations"]
    assert len(integrations["sources"]) >= 12
    assert len(integrations["routes"]) >= 8
    assert len(integrations["scenarios"]) >= 8
    assert len(integrations["recent_deliveries"]) >= 10
    assert integrations["summary"]["inbound_source_count"] == sum(
        1 for source in integrations["sources"] if source["direction"] == "inbound"
    )
    assert integrations["summary"]["failed_deliveries"] >= 1


def test_frontend_integrations_and_admin_have_local_demo_actions() -> None:
    js = _read(FRONTEND_APP_JS)
    schema = _read(FRONTEND_SCHEMA)

    assert "function localIntegrationDeliveryForScenario" in js
    assert "function mergedIntegrationOverview" in js
    assert "mergeRecordsByKey" in js
    assert "applyLocalIntegrationScenario" in js
    assert 'state.runtimeStatus !== "online"' in js
    assert 'pageKey === "integrations" && state.runtimeStatus === "online"' in js
    assert "Integration Workflow Simulated" in js
    assert "Local integration handoff" in js
    assert "Integration Workflow Failed" not in js
    assert "Customer-Visible Audit Trail" in js
    assert "admin.audit_log[]" in schema


def test_frontend_has_customer_design_partner_briefing_surface() -> None:
    dataset = json.loads(
        (REPO_ROOT / "frontend" / "data" / "demo_dataset.json").read_text()
    )
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)
    schema = _read(FRONTEND_SCHEMA)

    brief = dataset["design_partner_brief"]
    assert "partner_brief" in js
    assert "Partner Brief" in js
    assert "design-partner-brief" in js
    assert "function designPartnerView" in js
    assert "set-partner-stage" in js
    assert "lensNarrative.conclusion" in js
    assert "lensNarrative[0]" not in js
    assert ".partner-hero" in css
    assert "design_partner_brief.pilot_stages[]" in schema
    assert len(brief["readiness_pillars"]) >= 5
    assert len(brief["pilot_stages"]) == 4
    assert len(brief["buyer_roles"]) >= 4
    assert len(brief["proof_moments"]) == 8
    assert len(brief["success_metrics"]) >= 6
    assert brief["thesis"]["signals"] == [
        {"label": "Pilot motion", "value": f'{len(brief["pilot_stages"])} stages'},
        {
            "label": "Modeled integrations",
            "value": f'{len(dataset["integrations"]["sources"])} systems',
        },
        {
            "label": "Proof surfaces",
            "value": f'{len(brief["proof_moments"])} buyer moments',
        },
        {
            "label": "Success metrics",
            "value": f'{len(brief["success_metrics"])} measurable checkpoints',
        },
    ]
    assert {stage["stage_id"] for stage in brief["pilot_stages"]} == {
        "discover",
        "connect",
        "prove",
        "pilot",
    }
    surface_pages = {moment["surface_page"] for moment in brief["proof_moments"]}
    expected_pages = {
        "overview",
        "adoption",
        "attribution",
        "exports",
        "forecast",
        "energy",
        "admin",
        "integrations",
    }
    assert expected_pages <= surface_pages
    assert {step["surface_page"] for step in brief["demo_script"]} <= (
        expected_pages | {"partner_brief"}
    )


def test_frontend_support_docs_cover_schema_and_local_assets() -> None:
    readme = _read(FRONTEND_README)
    schema = _read(FRONTEND_SCHEMA)
    assert "frontend/data/SCHEMA.md" in readme
    assert "frontend/vendor/chart.umd.min.js" in readme
    assert "frontend/assets/app.css" in readme
    assert "frontend/assets/app.js" in readme
    assert "local directional estimate" in readme or "Local forecast estimation fallback" in readme
    assert "Top-Level Keys" in schema


def test_frontend_dataset_totals_are_internally_consistent() -> None:
    dataset_path = REPO_ROOT / "frontend" / "data" / "demo_dataset.json"
    dataset = json.loads(dataset_path.read_text(encoding="utf-8"))
    team_total = sum(item["spend_usd"] for item in dataset["teams"])
    model_total = sum(item["spend_usd"] for item in dataset["models"])
    model_requests = sum(item["requests"] for item in dataset["models"])

    assert dataset["overview"]["total_spend_usd"] == team_total == model_total
    assert dataset["overview"]["requests_30d"] == model_requests
    assert len(dataset["attribution_requests"]) >= 5
    assert len({item["provider"] for item in dataset["models"]}) >= 10
    assert "enterprise_market_signals" in dataset
    assert len(dataset["enterprise_market_signals"]) >= 4
    assert "enterprise_model_landscape" in dataset
    assert len(dataset["enterprise_model_landscape"]) >= 10
    assert "enterprise_ai_platforms" in dataset
    assert len(dataset["enterprise_ai_platforms"]) >= 7
    assert "enterprise_ai_stack" in dataset
    assert len(dataset["enterprise_ai_stack"]) >= 5


def test_frontend_dataset_includes_enterprise_model_landscape_content() -> None:
    dataset_path = REPO_ROOT / "frontend" / "data" / "demo_dataset.json"
    dataset = json.loads(dataset_path.read_text(encoding="utf-8"))
    glossary_terms = {entry["term"] for entry in dataset["glossary"]}
    faq_categories = {entry["category"] for entry in dataset["faq"]}

    assert "Multi-Model Strategy" in glossary_terms
    assert "Model Router" in glossary_terms
    assert "OpenAI GPT Family" in glossary_terms
    assert "Anthropic Claude" in glossary_terms
    assert "Google Gemini" in glossary_terms
    assert "Enterprise AI Stack" in glossary_terms
    assert "AI Infrastructure Layer" in glossary_terms
    assert "Vector Database" in glossary_terms
    assert "Snowflake Cortex AI" in glossary_terms
    assert "Microsoft Copilot / Copilot Studio" in glossary_terms
    assert "Enterprise Model Strategy and Platforms" in faq_categories
    assert "Fortune 500 AI Operating Patterns" in faq_categories
    assert "Enterprise AI Stack Architecture" in faq_categories


def test_frontend_models_page_exposes_enterprise_platform_and_stack_context() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "Enterprise Adoption Signals" in js
    assert "Top Enterprise AI Platforms" in js
    assert "Canonical Enterprise AI Stack" in js
    assert "modelReferenceKey" in js
    assert 'data-action="set-model-reference"' in js


def test_frontend_demo_supports_cross_view_context_and_role_lenses() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "const ROLE_LENSES" in js
    assert "function activeContextItems()" in js
    assert 'label: "Lens"' in js
    assert "state.selectedModelName" in js
    assert "state.selectedInterventionId" in js
    assert "syncContextFromRequest" in js
    assert "syncSelectedInterventionForCurrentFilter();" in js
    assert 'state.selectedInterventionId = items[0].id;' in js


def test_frontend_declutter_layouts_present() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)
    assert "intervention-workbench" in js
    assert "Selected Intervention" in js
    assert "intervention-summary-card" in css
    assert "grid-template-columns: repeat(2, minmax(0, 1fr));" in css
    assert "syncContextFromTeam" in js
    assert "syncContextFromModel" in js
    assert "syncContextFromIntervention" in js
    assert ".role-ribbon" in css
    assert ".lens-btn" in css
    assert 'id="models-table-body"' in js
    assert 'id="models-chart-semantics"' in js


def test_frontend_same_page_chart_controls_support_in_place_updates() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "function refreshModelsPageInPlace()" in js
    assert "function refreshForecastPageInPlace()" in js
    assert "existing.canvas === el" in js
    assert "existing.update();" in js
    assert 'id="forecast-horizon-row"' in js
    assert 'id="forecast-scenario-grid"' in js
    assert 'id="forecast-estimate-grid"' in js
    assert 'id="forecast-compare-buttons"' in js


def test_frontend_demo_surfaces_manual_mapping_replay_forecast_and_governance_explainers() -> None:
    js = _read(FRONTEND_APP_JS)
    css = _read(FRONTEND_APP_CSS)
    assert "Latest Mapping Impact" in js
    assert "Confidence increase" in js
    assert "Owner reassignment" in js
    assert "Budget impact" in js
    assert "Intervention reprioritization" in js
    assert "Forecast delta" in js
    assert "Decision Replay" in js
    assert "Selected Scenario" in js
    assert "Planning Impact" in js
    assert "Monthly Outlook" in js
    assert "Compare Planning Cases" in js
    assert "Policy Simulation" in js
    assert "Simulated decision" in js
    assert "Export monthly planning pack" in js
    assert "Export governance exception log" in js
    assert "async function submitManualMappingCorrection" in js
    assert "await apiRequest(\"POST\", \"/v1/attribution/manual\", payload)" in js
    assert "const latestMapping =" in js
    assert "const latestImpact = latestMapping ? manualMappingImpact(latestMapping) : null;" in js
    assert ": beforeConfidence;" in js
    assert ".decision-replay-card" in css
    assert ".manual-mapping-impact-grid" in css
    assert ".simulation-result-card" in css


def test_frontend_optimization_potential_uses_one_canonical_total() -> None:
    js = _read(FRONTEND_APP_JS)
    overview_block = js.split('<div class="metric-label">Optimization Potential</div>', 1)[1].split(
        '<div class="metric-label">Savings Captured</div>', 1
    )[0]
    interventions_block = js.split("function interventionsView()", 1)[1].split(
        "function compareScenarioData()", 1
    )[0]
    assert 'fmtUSD(stats.totalPotential)' in overview_block
    assert 'fmtUSD(stats.remaining)' not in overview_block
    assert "const stats = computeOverview();" in interventions_block
    assert "const totalPotential = stats.totalPotential;" in interventions_block


def test_frontend_forecast_and_guided_demo_have_runtime_fallback_guards() -> None:
    js = _read(FRONTEND_APP_JS)
    html = _read(FRONTEND_INDEX)
    assert "buildLocalForecastEstimate" in js
    assert "forecast estimated locally because the live forecast API is unavailable" in js
    assert "The automated walkthrough continued on deterministic local demo data." in js
    assert "Recommended path" in html
    assert "Live Proof Controls" in html


def test_repo_demo_docs_match_current_frontend_behavior() -> None:
    repo_readme = _read(REPO_ROOT / "README.md")
    demo_guide = _read(REPO_ROOT / "docs" / "demo-guide.md")
    feature_matrix = _read(REPO_ROOT / "docs" / "demo-feature-matrix.md")

    assert "Start Guided Demo" in repo_readme
    assert "local directional estimate" in demo_guide
    assert "continues on deterministic local demo data" in feature_matrix
