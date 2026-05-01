from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
FRONTEND_INDEX = REPO_ROOT / "frontend" / "index.html"
FRONTEND_APP_CSS = REPO_ROOT / "frontend" / "assets" / "app.css"
FRONTEND_APP_JS = REPO_ROOT / "frontend" / "assets" / "app.js"
FRONTEND_README = REPO_ROOT / "frontend" / "README.md"
FRONTEND_SCHEMA = REPO_ROOT / "frontend" / "data" / "SCHEMA.md"
VENDORED_CHART = REPO_ROOT / "frontend" / "vendor" / "chart.umd.min.js"
FRONTEND_FONT_DIR = REPO_ROOT / "frontend" / "assets" / "fonts"
LEGACY_V3_MOCKUP = REPO_ROOT / "frontend" / "platform-mockup-v3.html"

def _read(path: Path) -> str:
    return path.read_text(encoding="utf-8")

def test_frontend_uses_vendored_chart_and_no_cdn_fonts() -> None:
    html = _read(FRONTEND_INDEX)
    css = _read(FRONTEND_APP_CSS)
    assert 'src="vendor/chart.umd.min.js?v=' in html
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
    assert 'aria-label="Close navigation menu">&times;' in html
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
    assert ".view-root.transitioning" in css
    assert ".drawer-actions.busy .small-btn" in css
    assert "width: min(360px, calc(100vw - 280px));" in css
    assert "--text-muted: #7889a8;" in css
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
    assert "closest(\"[data-action][role='button']\")" in js
    assert 'role="button" tabindex="0" aria-label="Open Forecasting"' in js
    assert 'role="button" tabindex="0" aria-label="Open Manual Mapping"' in js
    assert 'role="button" tabindex="0" aria-label="Open Interventions"' in js
    assert "window.localStorage" not in js
    assert 'role="button" tabindex="0" aria-label="Open ${esc(team.name)} team detail"' in js


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
    assert (
        "No demo activity yet. Start the 90-second walkthrough, or run one live proof action."
        in js
    )


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
    assert "const DATASET_URL" in js
    assert 'fetch(DATASET_URL' in js
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


def test_frontend_intervention_sync_can_clear_with_empty_live_payload() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "if (!Array.isArray(rows))" in js
    assert "dataset.interventions = merged;" in js
    assert "if (!incoming.length)" not in js


def test_frontend_intervention_write_failures_do_not_apply_local_success_state() -> None:
    js = _read(FRONTEND_APP_JS)
    assert 'intervention.status = normalized;' not in js
    assert "Intervention Unchanged" in js
    assert "kept the last confirmed state" in js


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


def test_frontend_tables_are_wrapped_for_horizontal_scroll() -> None:
    js = _read(FRONTEND_APP_JS)
    table_count = js.count('<table class="table')
    wrapper_count = js.count('<div class="table-wrap')
    assert table_count > 0
    assert wrapper_count >= table_count


def test_frontend_navigation_is_not_decorative() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "const NAV_ITEMS" in js
    assert 'data-action="go"' in js
    assert "aria-current" in js
    assert "state.scrollTopByPage[pageKey] = 0;" in js


def test_frontend_investor_walkthrough_is_defined() -> None:
    js = _read(FRONTEND_APP_JS)
    assert "const INVESTOR_WALKTHROUGH_STEPS" in js
    assert "Overview: where the money is" in js
    assert "Employee Adoption: who is actually using AI" in js
    assert "Request Proof: why one request belongs to one owner" in js
    assert "Interventions: what to do next" in js
    assert "Forecasting: what happens if you act" in js
    assert "Governance: why this is safe to deploy" in js
    assert "function renderWalkthroughBanner()" in js
    assert 'data-action="start-walkthrough"' in _read(FRONTEND_INDEX)
    assert "const INVESTOR_WALKTHROUGH_TOTAL_MS" in js
    assert "durationMs: 12000" in js
    assert "durationMs: 11000" in js
    assert "durationMs: 15000" in js
    assert "durationMs: 13000" in js
    assert "durationMs: 14000" in js

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
    import json

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
    import json

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

    assert "Start 90-sec Walkthrough" in repo_readme
    assert "local directional estimate" in demo_guide
    assert "continues on deterministic local demo data" in feature_matrix
