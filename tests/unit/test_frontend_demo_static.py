import json
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
        "No demo activity yet. Start the full product walkthrough, or run one live proof action."
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
    assert "function nextDemoScenarioRequestId(kind)" in js
    assert "Date.now()" not in scenario_block
    assert "nextDemoScenarioRequestId(kind)" in scenario_block
    assert "state.demoScenarioRunCounts = {};" in reset_block
    assert "resetBackendDemoState({ log: false, toast: false })" in reset_block
    assert 'params.get("reset") === "1"' in initialize_block


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

    assert "Start Full Walkthrough" in repo_readme
    assert "local directional estimate" in demo_guide
    assert "continues on deterministic local demo data" in feature_matrix
