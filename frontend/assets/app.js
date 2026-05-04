/*
 * DEMO_ONLY_FRONTEND_SURFACE
 * This browser app is a deterministic local demo shell. It uses synthetic
 * fixtures, local persona simulation, and controlled API fallbacks to make
 * stakeholder walkthroughs safe without cloud credentials. Do not treat these
 * mocks, roles, or fallback responses as production implementations.
 */

const NAV_ITEMS = [
  {
    group: "Platform",
    items: [
      { key: "overview", label: "Overview", icon: "<path d='M3 12l9-9 9 9'/><path d='M9 21V9h6v12'/>", badge: null },
      { key: "partner_brief", label: "Partner Brief", icon: "<path d='M12 2l7 4v5c0 4.7-2.9 8.6-7 10-4.1-1.4-7-5.3-7-10V6l7-4z'/><path d='M8 12h8'/><path d='M8 16h5'/><path d='M9 8h6'/>", badge: null },
      { key: "requirements", label: "PRD Proof", icon: "<path d='M9 11l2 2 4-4'/><path d='M9 17h6'/><path d='M5 3h14v18H5z'/>", badge: null },
      { key: "adoption", label: "Employee Adoption", icon: "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M20 8v6'/><path d='M23 11h-6'/>", badge: null },
      { key: "attribution", label: "Request Proof", icon: "<circle cx='12' cy='6' r='3'/><circle cx='6' cy='18' r='3'/><circle cx='18' cy='18' r='3'/><path d='M10 8l-2 7M14 8l2 7M9 18h6'/>", badge: null },
      { key: "models", label: "Models", icon: "<rect x='3' y='3' width='18' height='18' rx='3'/><path d='M3 9h18M9 3v18'/>", badge: null },
      { key: "teams", label: "Teams", icon: "<path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 00-3-3.87'/><path d='M16 3.13a4 4 0 010 7.75'/>", badge: null },
      { key: "manual_mapping", label: "Manual Mapping", icon: "<path d='M12 20h9'/><path d='M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z'/>", badge: null },
      { key: "interventions", label: "Interventions", icon: "<path d='M13 2L3 14h8l-1 8 10-12h-8l1-8z'/>", badge: "0" },
      { key: "governance", label: "Governance", icon: "<path d='M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z'/><path d='M9 12l2 2 4-4'/>", badge: null },
      { key: "coverage", label: "Coverage", icon: "<path d='M3 12h18'/><path d='M12 3v18'/><circle cx='12' cy='12' r='9'/><path d='M7 12a5 5 0 0 1 10 0'/>", badge: null },
      { key: "exports", label: "Exports", icon: "<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><path d='M14 2v6h6'/><path d='M8 13h8M8 17h5'/>", badge: null },
      { key: "energy", label: "Energy", icon: "<path d='M13 2L4 14h7l-1 8 10-13h-7z'/>", badge: null }
    ]
  },
  {
    group: "Operational",
    items: [
      { key: "forecast", label: "Forecasting", icon: "<path d='M3 17l5-5 4 4 8-8'/><path d='M14 8h6v6'/>", badge: null },
      { key: "integrations", label: "Integrations", icon: "<path d='M8 4h8v4H8z'/><path d='M3 10h18v10H3z'/><path d='M12 10v10'/>", badge: null },
      { key: "admin", label: "Admin", icon: "<path d='M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z'/><path d='M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6V22a2 2 0 0 1-4 0v-2a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1H2a2 2 0 0 1 0-4h2a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6V2a2 2 0 0 1 4 0v2a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.2.35.4.65.6 1h2a2 2 0 0 1 0 4h-2c-.2.35-.4.65-.6 1z'/>", badge: null },
      { key: "glossary", label: "Glossary", icon: "<path d='M4 19.5A2.5 2.5 0 016.5 17H20'/><path d='M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z'/>", badge: null },
      { key: "faq", label: "FAQ", icon: "<circle cx='12' cy='12' r='10'/><path d='M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3'/><circle cx='12' cy='17' r='1'/>", badge: null }
    ]
  }
];

const ALL_PAGE_KEYS = NAV_ITEMS.flatMap((group) => group.items.map((item) => item.key));

const LINE_ICON_VIEWBOX = "0 0 24 24";

function renderLineIcon(icon, className = "app-icon nav-icon") {
  return `<svg class="${esc(className)}" viewBox="${LINE_ICON_VIEWBOX}" aria-hidden="true" focusable="false">${icon}</svg>`;
}

const PAGE_TITLES = {
  overview: "Overview",
  partner_brief: "Partner Brief",
  requirements: "PRD Proof",
  adoption: "Employee AI Adoption",
  attribution: "Request Proof",
  models: "Model Intelligence",
  teams: "Teams",
  manual_mapping: "Manual Mapping",
  interventions: "Interventions",
  governance: "Governance",
  coverage: "Coverage",
  exports: "Chargeback Exports",
  energy: "Energy",
  forecast: "Cost Forecasting",
  integrations: "Integrations",
  admin: "Admin",
  glossary: "Glossary",
  faq: "FAQ"
};

const PALETTE = Object.freeze({
  brand: "#4f8ef8",
  brandStrong: "#6aa1ff",
  brandText: "#c2dcff",
  success: "#2ac487",
  successText: "#8be3ba",
  warning: "#eda82e",
  warningText: "#f4c978",
  danger: "#ee5858",
  dangerText: "#ff9f9f",
  neutral: "#a8b8d4",
  neutralStrong: "#d9e6fb",
  surface: "#18263b",
  border: "#274062"
});

const MODE_COLORS = {
  passive: { bg: "rgba(79,142,248,0.14)", color: PALETTE.brandText },
  advisory: { bg: "rgba(42,196,135,0.14)", color: PALETTE.successText },
  active: { bg: "rgba(237,168,46,0.15)", color: PALETTE.warningText }
};

const ROLE_LENSES = [
  {
    key: "executive",
    label: "Executive",
    description: "Company-level posture, operating leverage, and deployment readiness."
  },
  {
    key: "finance",
    label: "Finance",
    description: "Budget ownership, chargeback readiness, and planning impact."
  },
  {
    key: "platform",
    label: "Platform",
    description: "Model routing, request proof, and operational execution."
  },
  {
    key: "security",
    label: "Security",
    description: "Control coverage, policy behavior, and fail-open safety."
  }
];

// DEMO_ONLY_FAKE_AUTH_PERSONAS: these records drive local persona UX and menu
// restrictions only. They are not customer IAM, SSO, SCIM, or production RBAC.
const DEMO_PERSONAS = [
  {
    key: "admin",
    label: "Admin",
    name: "Maya Patel",
    role: "Admin",
    email: "maya.patel@novatech.example",
    description: "Owns account lifecycle, policy setup, connector diagnostics, and audited local mutations.",
    allowedPages: ALL_PAGE_KEYS,
    homePage: "admin",
    permissions: ["manage_users", "manage_policy", "approve_exceptions", "export_packets", "run_diagnostics", "replay_scenarios"],
    workflows: ["Invite user", "Set policy bundle", "Run connector backfill", "Disable user session"],
    records: ["current-demo-policy-bundle", "Owen Brooks session", "demo presenter token"]
  },
  {
    key: "manager",
    label: "Manager",
    name: "Samira Okafor",
    role: "Manager",
    email: "samira.okafor@novatech.example",
    description: "Reviews team adoption, workflow usage, budget posture, and intervention impact for owned business units.",
    allowedPages: ["overview", "partner_brief", "adoption", "teams", "manual_mapping", "interventions", "forecast", "integrations", "glossary", "faq"],
    homePage: "adoption",
    permissions: ["view_adoption", "review_team_records", "comment_on_interventions", "view_integration_handoffs"],
    workflows: ["Review adoption by business unit", "Prioritize team intervention", "Approve workflow rollout plan"],
    records: ["team-cs-platform adoption scorecard", "refund escalation workflow", "manager approval record"]
  },
  {
    key: "user",
    label: "User",
    name: "Noah Kim",
    role: "User",
    email: "noah.kim@novatech.example",
    description: "Sees personal/team context, request explanations, model guidance, and methodology references without admin surfaces.",
    allowedPages: ["overview", "adoption", "attribution", "models", "teams", "glossary", "faq"],
    homePage: "overview",
    permissions: ["view_own_usage", "view_request_explanations", "view_model_guidance"],
    workflows: ["Understand request attribution", "Compare approved model options", "Review team AI usage"],
    records: ["customer-copilot-prod request", "gpt-4o-mini guidance", "team usage summary"]
  },
  {
    key: "auditor",
    label: "Auditor",
    name: "Priya Nair",
    role: "Auditor",
    email: "priya.nair@novatech.example",
    description: "Reviews immutable evidence, exports, policy posture, admin actions, and exception history in read-only mode.",
    allowedPages: ["overview", "requirements", "attribution", "governance", "coverage", "exports", "admin", "glossary", "faq"],
    homePage: "admin",
    permissions: ["read_audit_trail", "export_evidence", "view_policy_history", "view_admin_records"],
    workflows: ["Review chargeback packet", "Inspect policy exception", "Validate audit export"],
    records: ["February 2026 preview", "req_audit_export_104", "security-exception-review route"]
  },
  {
    key: "finops",
    label: "FinOps",
    name: "Ethan Chen",
    role: "FinOps",
    email: "ethan.chen@novatech.example",
    description: "Owns chargeback, manual ownership correction, forecast planning, and savings capture workflows.",
    allowedPages: ["overview", "partner_brief", "adoption", "teams", "manual_mapping", "interventions", "exports", "forecast", "integrations", "glossary", "faq"],
    homePage: "exports",
    permissions: ["manual_override", "export_packets", "forecast_spend", "review_savings"],
    workflows: ["Manual ownership override", "Export chargeback packet", "Forecast spend scenario"],
    records: ["mm_006 -> Data Science", "event-time owner mode", "optimization capture scenario"]
  },
  {
    key: "engineer",
    label: "Engineer",
    name: "Rina Alvarez",
    role: "Engineer",
    email: "rina.alvarez@novatech.example",
    description: "Debugs request lineage, model routing, integration health, and implementation tasks without finance/admin mutation rights.",
    allowedPages: ["overview", "attribution", "models", "teams", "interventions", "coverage", "energy", "integrations", "glossary", "faq"],
    homePage: "attribution",
    permissions: ["view_request_lineage", "replay_scenarios", "view_interventions", "view_integration_health"],
    workflows: ["Replay scenario harness", "Review model routing", "Inspect intervention implementation"],
    records: ["S-015 agent workflow lineage", "customer-support-bot route", "model over-provisioning intervention"]
  },
  {
    key: "security",
    label: "Security",
    name: "Jordan Lee",
    role: "Security",
    email: "jordan.lee@novatech.example",
    description: "Reviews fail-open posture, policy simulation, exceptions, trust boundaries, and security handoff routes.",
    allowedPages: ["overview", "requirements", "attribution", "governance", "coverage", "integrations", "admin", "glossary", "faq"],
    homePage: "governance",
    permissions: ["approve_exceptions", "view_policy_history", "view_trust_boundary", "view_security_handoffs"],
    workflows: ["Approve policy exception", "Review fail-open scenario", "Route security exception"],
    records: ["req_audit_export_104", "security-exception-review route", "fail-open safety scenario"]
  }
];

const GOVERNANCE_POLICY_BUNDLES = [
  {
    key: "current",
    label: "Current bundle",
    description: "Matches the current demo policy posture.",
    confidence_floor: 0.82,
    cost_ceiling_usd: 0.03,
    allowlist_strictness: "standard"
  },
  {
    key: "finance_tightened",
    label: "Finance tightened",
    description: "Tighter ceilings and stronger routing toward low-cost equivalents.",
    confidence_floor: 0.85,
    cost_ceiling_usd: 0.02,
    allowlist_strictness: "strict"
  },
  {
    key: "security_hardened",
    label: "Security hardened",
    description: "Highest confidence floor and strictest model controls.",
    confidence_floor: 0.9,
    cost_ceiling_usd: 0.018,
    allowlist_strictness: "strictest"
  }
];

const DEFAULT_FORECAST_SCENARIO = "baseline";
const DEFAULT_FORECAST_HORIZON = 12;
const FORECAST_HORIZONS = [3, 6, 9, 12, 18, 24];
const ADOPTION_WINDOWS = [7, 30, 90];
const UI_LIMITS = {
  searchDebounceMs: 180,
  toastTimeoutMs: 4000,
  maxLogEntries: 80,
  maxIntegrationDeliveries: 12,
  runtimeDegradedThreshold: 2
};
const DEFAULT_TABLE_PAGE_SIZE = 8;
const TABLE_PAGE_SIZE_OPTIONS = [8, 16, 32];
const FORM_MIN_SEARCH_LENGTH = 2;
const FORM_SEARCH_EXAMPLES = {
  "glossary-query": "governance",
  "faq-query": "deployment"
};
const FORM_SEARCH_LABELS = {
  "glossary-query": "glossary terms",
  "faq-query": "FAQ items"
};
const BUSINESS_RULES = {
  attributionCoverageCapPct: 98.9,
  forecastFloorShare: 0.45,
  manualMappingCoverageBoostPct: {
    confirmed: 0.5,
    reassigned: 0.8
  },
  manualMappingConfidenceByStatus: {
    confirmed: 0.96,
    reassigned: 0.9,
    resolvedFloor: 0.93,
    deferredFloor: 0.88
  },
  manualMappingRiskPremiumMultiplier: {
    confirmed: 0.018,
    reassigned: 0.026,
    deferred: 0.042
  },
  forecastRiskReserveShare: 0.035
};
const VALID_INTERVENTION_TRANSITIONS = {
  recommended: new Set(["review", "approved", "dismissed"]),
  review: new Set(["approved", "dismissed"]),
  approved: new Set(["implemented", "dismissed", "review"]),
  implemented: new Set(["review"]),
  dismissed: new Set(["review"])
};
const DATASET_VERSION = "20260309as";
const DATASET_URL = new URL(`data/demo_dataset.json?v=${DATASET_VERSION}`, window.location.href).toString();
const TYPOGRAPHY_ROLE_SELECTORS = Object.freeze({
  heading: [
    ".page-title",
    ".screen-priority-title",
    ".integration-title"
  ].join(", "),
  subheading: [
    ".card-title",
    ".evidence-section-title",
    ".intervention-title",
    ".intervention-summary-title",
    ".glossary-title",
    ".deferred-section-title",
    ".simulation-card-title",
    ".allocation-title",
    ".blindspot-title"
  ].join(", "),
  body: [
    ".screen-priority-detail",
    ".card-subtitle",
    ".field-feedback",
    ".table-microcopy",
    ".intervention-detail",
    ".intervention-summary-detail",
    ".integration-detail",
    ".integration-scenario-card p",
    ".forecast-scenario-subtitle",
    ".export-control-card p"
  ].join(", "),
  label: [
    ".input-label",
    ".nav-label",
    ".section-title",
    ".metric-label",
    ".screen-priority-eyebrow",
    ".screen-priority-measure span",
    ".methodology-title",
    ".forecast-metric-label",
    ".adoption-kpi-label",
    ".context-chip-label",
    ".table th",
    ".table-sort-btn > span:first-child",
    ".export-control-label",
    ".status-badge",
    ".pill",
    ".mode-button"
  ].join(", "),
  meta: [
    ".metric-meta",
    ".hint",
    ".tenant-line",
    ".demo-path-status",
    ".demo-path-copy em",
    ".context-chip",
    ".integration-meta",
    ".glossary-category-meta",
    ".blindspot-meta",
    ".intervention-summary-meta"
  ].join(", "),
  number: [
    ".metric-value",
    ".screen-priority-measure strong",
    ".adoption-kpi-value",
    ".forecast-metric-value",
    ".export-control-value"
  ].join(", ")
});
const TYPOGRAPHY_INLINE_PROPS = Object.freeze(["fontSize", "fontWeight", "lineHeight", "letterSpacing"]);
const LAYOUT_SPACING_CLASS_BY_PX = new Map([
  ["0px", "0"],
  ["2px", "1"],
  ["3px", "1"],
  ["4px", "1"],
  ["5px", "1"],
  ["6px", "2"],
  ["7px", "2"],
  ["8px", "2"],
  ["9px", "2"],
  ["10px", "3"],
  ["11px", "3"],
  ["12px", "3"],
  ["14px", "4"],
  ["15px", "4"],
  ["16px", "4"],
  ["18px", "5"],
  ["20px", "5"],
  ["22px", "6"],
  ["24px", "6"],
  ["28px", "7"],
  ["30px", "7"],
  ["32px", "7"]
]);
const CHART_FRAME_CLASS_BY_HEIGHT = new Map([
  ["220px", "chart-frame-sm"],
  ["240px", "chart-frame-sm"],
  ["260px", "chart-frame-md"],
  ["280px", "chart-frame-lg"],
  ["300px", "chart-frame-xl"],
  ["320px", "chart-frame-xxl"]
]);
const PIXEL_ALIGNMENT_SELECTORS = Object.freeze([
  ".topbar",
  ".topbar-left",
  ".topbar-right",
  ".context-ribbon",
  ".context-chip",
  ".role-ribbon",
  ".view-root",
  ".brand",
  ".brand-logo",
  ".demo-path-nav",
  ".demo-path-step",
  ".demo-path-number",
  ".demo-path-copy",
  ".tenant-card",
  ".runtime-chip",
  ".screen-secondary-content",
  ".screen-priority",
  ".entry-home",
  ".entry-home-main",
  ".entry-home-action",
  ".card",
  ".card-header",
  ".metric-card",
  ".table-toolbar",
  ".table-pagination",
  ".state-panel",
  ".small-btn",
  ".top-btn",
  ".nav-item"
].join(", "));

const FALLBACK_FORECAST_SCENARIOS = {
  baseline: {
    label: "Baseline",
    summary: "Current trajectory with no incremental governance capture.",
    definition: "Reference case that carries forward observed demand growth, current routing patterns, and existing governance posture.",
    demand_shift_pct: 0.0,
    trend_ramp_pct: 0.0,
    governance_drag_pct: 0.0,
    capture_realization_pct: 0.0,
    volatility_band_pct: 7.0,
    assumptions: [
      "Observed month-over-month demand growth continues without intervention-driven savings.",
      "No additional policy tightening is assumed beyond current controls.",
      "Previously identified savings remain unimplemented."
    ]
  },
  growth_push: {
    label: "Growth Push",
    summary: "Assumes accelerated adoption and elevated request growth.",
    definition: "Upside demand case where product rollouts, higher request volumes, and expanded model usage increase monthly spend faster than the current baseline.",
    demand_shift_pct: 3.5,
    trend_ramp_pct: 13.0,
    governance_drag_pct: 0.0,
    capture_realization_pct: 0.0,
    volatility_band_pct: 10.0,
    assumptions: [
      "New product launches and broader internal adoption increase request volume above the observed trend.",
      "Model mix stays broadly constant, so incremental demand lands directly on spend.",
      "Governance posture remains unchanged."
    ]
  },
  policy_hardened: {
    label: "Policy Hardened",
    summary: "Assumes enforcement hardens and outlier spend is constrained.",
    definition: "Control scenario where stricter allowlists, budget ceilings, and confidence floors suppress outlier usage and reduce demand growth.",
    demand_shift_pct: -1.5,
    trend_ramp_pct: -6.0,
    governance_drag_pct: 7.5,
    capture_realization_pct: 0.2,
    volatility_band_pct: 5.5,
    assumptions: [
      "Outlier usage is curtailed through stronger policy enforcement and budget gates.",
      "Higher-confidence routing and entitlement checks reduce noisy non-production spend.",
      "Only a modest portion of identified savings is assumed to convert into durable run-rate reduction."
    ]
  },
  optimization_capture: {
    label: "Optimization Capture",
    summary: "Assumes approved interventions are implemented and stick.",
    definition: "Execution scenario where approved routing, caching, and duplicate-request interventions convert into realized run-rate savings over the planning horizon.",
    demand_shift_pct: -2.5,
    trend_ramp_pct: -9.0,
    governance_drag_pct: 4.0,
    capture_realization_pct: 0.75,
    volatility_band_pct: 4.5,
    assumptions: [
      "Approved interventions move into implementation and produce durable run-rate savings.",
      "Duplicate requests, oversized model selection, and staging sprawl are actively reduced.",
      "Savings compound gradually rather than appearing as a single one-time drop."
    ]
  }
};

const FALLBACK_INTEGRATION_OVERVIEW = {
  summary: {
    inbound_source_count: 5,
    outbound_route_count: 4,
    scenario_count: 4,
    configured_destination_count: 8,
    recent_delivery_count: 4,
    success_rate_pct: 100,
    failed_deliveries: 0,
    live_delivery_mode: "simulated",
    last_delivery_at: "2026-02-28T16:42:00Z"
  },
  sources: [
    {
      integration_id: "aws-cur",
      name: "AWS Billing",
      category: "Cost telemetry",
      direction: "inbound",
      status: "active",
      system: "AWS CUR",
      owner: "FinOps",
      business_value: "Supplies reconciled cost truth for unit economics, drift analysis, and planning.",
      primary_signals: ["line-item cost", "service", "usage type"],
      downstream_consumers: ["Reconciliation ledger", "Forecasting", "Executive reporting"]
    },
    {
      integration_id: "aws-bedrock",
      name: "AWS Bedrock Telemetry",
      category: "Request telemetry",
      direction: "inbound",
      status: "active",
      system: "Amazon Bedrock",
      owner: "Platform Engineering",
      business_value: "Provides live request metadata for attribution, governance, and employee adoption analytics.",
      primary_signals: ["model", "token usage", "latency"],
      downstream_consumers: ["HRE", "Attribution index", "Adoption analytics"]
    },
    {
      integration_id: "github-sdlc",
      name: "GitHub",
      category: "SDLC and deployment",
      direction: "inbound",
      status: "active",
      system: "GitHub Webhooks and Actions",
      owner: "Developer Platform",
      business_value: "Connects services and repositories to the teams actually shipping AI systems.",
      primary_signals: ["push", "workflow job", "deployment metadata"],
      downstream_consumers: ["Graph store", "Manual mapping", "Interventions"]
    },
    {
      integration_id: "okta",
      name: "Okta",
      category: "Workforce identity",
      direction: "inbound",
      status: "active",
      system: "Okta System Log and SCIM",
      owner: "IT and Identity",
      business_value: "Keeps workforce identity and org structure synchronized for ownership and adoption rollups.",
      primary_signals: ["login", "group membership", "SCIM profile changes"],
      downstream_consumers: ["Adoption analytics", "Graph store", "Policy context"]
    },
    {
      integration_id: "slack",
      name: "Slack",
      category: "Operational handoff",
      direction: "outbound",
      status: "active",
      system: "Slack",
      owner: "FinOps and Platform Operations",
      business_value: "Routes urgent Argmin decisions into the channels that already own triage.",
      primary_signals: ["policy alerts", "implementation handoffs", "executive digests"],
      downstream_consumers: ["FinOps war room", "Platform ops", "Executive staff"]
    }
  ],
  routes: [
    {
      route_id: "policy-breach-escalation",
      name: "Policy Breach Escalation",
      workflow_name: "Guardrail Escalation",
      owner: "FinOps duty manager",
      trigger: "Budget ceiling, model allowlist, or confidence-floor violation",
      expected_action: "Review the request, confirm the owner, and approve, block, or remediate the route.",
      business_outcome: "High-risk spend is surfaced in minutes instead of at month end.",
      sla_target: "15 minutes",
      channels: [
        { channel: "slack", target: "slack://ai-governance-war-room", purpose: "Primary escalation room", fallback: false, live_capable: false },
        { channel: "email", target: "finops-leads@novatech.example", purpose: "Fallback escalation and audit trail", fallback: true, live_capable: false }
      ]
    },
    {
      route_id: "intervention-implementation",
      name: "Intervention Implementation Handoff",
      workflow_name: "Optimization Execution",
      owner: "Developer Platform lead",
      trigger: "Approved intervention transitions to implementation",
      expected_action: "Create or update the downstream work item that executes the model-routing or caching change.",
      business_outcome: "Savings opportunities become tracked execution work instead of passive insight.",
      sla_target: "1 business day",
      channels: [
        { channel: "webhook", target: "webhook://service-desk/aci-implementation", purpose: "Automation trigger or ticket creation", fallback: false, live_capable: false },
        { channel: "slack", target: "slack://platform-ops", purpose: "Owner notification", fallback: true, live_capable: false }
      ]
    },
    {
      route_id: "pricing-drift-review",
      name: "Pricing Drift Review",
      workflow_name: "Unit Economics Verification",
      owner: "Platform economics lead",
      trigger: "Synthetic estimate diverges materially from billing truth",
      expected_action: "Review catalog rules and reconcile provider pricing changes.",
      business_outcome: "Forecasts and TRAC stay trustworthy as provider pricing changes.",
      sla_target: "4 hours",
      channels: [
        { channel: "slack", target: "slack://platform-economics", purpose: "Primary review channel", fallback: false, live_capable: false },
        { channel: "email", target: "platform-economics@novatech.example", purpose: "Fallback record", fallback: true, live_capable: false }
      ]
    },
    {
      route_id: "executive-adoption-digest",
      name: "Executive Adoption Digest",
      workflow_name: "Leadership Reporting",
      owner: "Office of the CTO",
      trigger: "Weekly reporting cadence",
      expected_action: "Review adoption breadth, governed usage, and business-unit variation.",
      business_outcome: "Leadership sees whether AI is scaling broadly and under control.",
      sla_target: "Weekly",
      channels: [
        { channel: "email", target: "exec-staff@novatech.example", purpose: "Primary digest delivery", fallback: false, live_capable: false },
        { channel: "slack", target: "slack://executive-ai-briefing", purpose: "Executive discussion thread", fallback: true, live_capable: false }
      ]
    }
  ],
  scenarios: [
    {
      scenario_id: "policy-breach",
      title: "Budget Breach Escalation",
      description: "Shows who is alerted when a high-spend request violates policy.",
      route_id: "policy-breach-escalation",
      business_question: "If a live request breaks policy, who sees it and how fast can they act?",
      expected_outcome: "FinOps receives a routed escalation with enough context to approve, block, or remediate."
    },
    {
      scenario_id: "intervention-approved",
      title: "Approved Optimization Handoff",
      description: "Shows how a savings recommendation becomes execution work.",
      route_id: "intervention-implementation",
      business_question: "How does an approved intervention become actual implementation work?",
      expected_outcome: "Argmin pushes a structured handoff into downstream execution channels."
    },
    {
      scenario_id: "pricing-drift",
      title: "Pricing Drift Alert",
      description: "Shows how pricing accuracy issues get routed to the right owner.",
      route_id: "pricing-drift-review",
      business_question: "How does the platform react when estimated and billed costs drift apart?",
      expected_outcome: "Platform economics owners receive a review package before planning credibility erodes."
    },
    {
      scenario_id: "executive-digest",
      title: "Executive Adoption Digest",
      description: "Shows the leadership reporting path for adoption and governance signals.",
      route_id: "executive-adoption-digest",
      business_question: "What do executives actually receive about adoption, control posture, and efficiency?",
      expected_outcome: "Leadership gets a structured weekly digest, not raw telemetry."
    }
  ],
  recent_deliveries: [
    {
      delivery_id: "delivery-1709138520000-1",
      channel: "slack",
      target: "slack://ai-governance-war-room",
      status: "simulated",
      message: "delivery simulated",
      sent_at: "2026-02-28T16:22:00Z",
      event_type: "policy_violation",
      severity: "warning",
      route_id: "policy-breach-escalation",
      route_name: "Policy Breach Escalation",
      workflow_name: "Guardrail Escalation",
      audience: "FinOps duty manager",
      business_outcome: "High-risk spend is surfaced in minutes instead of at month end.",
      scenario_id: "policy-breach"
    },
    {
      delivery_id: "delivery-1709139000000-2",
      channel: "webhook",
      target: "webhook://service-desk/aci-implementation",
      status: "simulated",
      message: "delivery simulated",
      sent_at: "2026-02-28T16:30:00Z",
      event_type: "intervention_approved",
      severity: "info",
      route_id: "intervention-implementation",
      route_name: "Intervention Implementation Handoff",
      workflow_name: "Optimization Execution",
      audience: "Developer Platform lead",
      business_outcome: "Savings opportunities become tracked execution work instead of passive insight.",
      scenario_id: "intervention-approved"
    },
    {
      delivery_id: "delivery-1709139600000-3",
      channel: "slack",
      target: "slack://platform-economics",
      status: "simulated",
      message: "delivery simulated",
      sent_at: "2026-02-28T16:40:00Z",
      event_type: "pricing_drift_alert",
      severity: "warning",
      route_id: "pricing-drift-review",
      route_name: "Pricing Drift Review",
      workflow_name: "Unit Economics Verification",
      audience: "Platform economics lead",
      business_outcome: "Forecasts and TRAC stay trustworthy as provider pricing changes.",
      scenario_id: "pricing-drift"
    },
    {
      delivery_id: "delivery-1709139720000-4",
      channel: "email",
      target: "exec-staff@novatech.example",
      status: "simulated",
      message: "delivery simulated",
      sent_at: "2026-02-28T16:42:00Z",
      event_type: "executive_digest",
      severity: "info",
      route_id: "executive-adoption-digest",
      route_name: "Executive Adoption Digest",
      workflow_name: "Leadership Reporting",
      audience: "Office of the CTO",
      business_outcome: "Leadership sees whether AI is scaling broadly and under control.",
      scenario_id: "executive-digest"
    }
  ]
};

const FALLBACK_DATASET = {
  meta: {
    tenant: "NovaTech Industries",
    environment: "demo",
    environment_label: "Synthetic enterprise operating profile",
    tenant_profile_label: "Cross-functional AI program spanning engineering, support, data, and operations",
    default_mode: "advisory",
    period_label: "February 2026",
    watermark: "SIMULATED DATA"
  },
  overview: {
    attribution_coverage_pct: 87.4,
    requests_30d: 5821041,
    spend_trend_k_usd: []
  },
  adoption: {
    hierarchy: null,
    dashboards: {},
    workflow_map: { summary: {}, capabilities: [], services: [], workflows: [] }
  },
  teams: [],
  models: [],
  interventions: [],
  attribution_requests: [],
  governance: { modes: [], policies: [], fail_open_matrix: [], trust_boundary_summary: [] },
  manual_mapping: [],
  integrations: FALLBACK_INTEGRATION_OVERVIEW,
  coverage: { summary: {}, pathways: [], blind_spots: [], agent_lineage: null, scenario_results: [] },
  exports: { summary: {}, controls: [], rows: [], allocation_splits: [] },
  energy_efficiency: { summary: {}, models: [], recommendations: [] },
  admin: { summary: {}, accounts: [], operations: [], diagnostics: [] },
  design_partner_brief: { thesis: {}, readiness_pillars: [], pilot_stages: [], buyer_roles: [], proof_moments: [], success_metrics: [], open_questions: [], demo_script: [] },
  prd_traceability: {
    summary: {
      conclusion: "The local demo is organized as a requirements proof, not a generic dashboard.",
      basis: "It maps the Argmin PRD, Engineering Specification, RAIL PRD, HRE decisions, vision statement, and pitch deck into visible local workflows.",
      operating_boundary: "Every proof item uses synthetic local data and simulated actions; production-only systems remain represented as readiness, trust-boundary, and architecture evidence."
    },
    decision_surfaces: [],
    journeys: [],
    rail_pipeline: [],
    invariants: [],
    pathway_matrix: [],
    requirement_matrix: [],
    document_sources: []
  },
  glossary: [],
  faq: [],
  demo_scenarios: {},
  forecast_scenarios: FALLBACK_FORECAST_SCENARIOS
};

const state = {
  page: "overview",
  selectedTeamId: null,
  selectedRequestId: null,
  selectedModelName: null,
  selectedInterventionId: null,
  modelReferenceKey: "signals",
  interventionFilter: "all",
  modelSort: "spend_usd",
  mode: "advisory",
  roleLens: "executive",
  activePersonaKey: "admin",
  personaNotice: null,
  modeMenuOpen: false,
  mobileNavOpen: false,
  executionDrawerOpen: false,
  runtimeStatus: "local",
  runtimeDetail: "Using deterministic local demo data until a live action is requested",
  runtimeCapabilities: {},
  recoveryNotice: null,
  logs: [],
  lastPayload: null,
  lastResponse: null,
  demoOutcome: null,
  forecastResult: null,
  forecastStatus: "Forecast not generated yet.",
  forecastScenarioKey: DEFAULT_FORECAST_SCENARIO,
  forecastHorizonMonths: DEFAULT_FORECAST_HORIZON,
  forecastCompareKeys: ["baseline", "growth_push", "policy_hardened", "optimization_capture"],
  forecastDirty: false,
  forecastLoading: false,
  adoptionHierarchy: null,
  adoptionDashboardCache: {},
  adoptionScopeType: "organization",
  adoptionScopeId: null,
  adoptionWindowDays: 30,
  adoptionLoading: false,
  interventionLoading: false,
  interventionSyncAttempted: false,
  integrationOverview: null,
  integrationLoading: false,
  integrationDeliveries: [],
  selectedProofJourney: "money",
  selectedPartnerStage: "discover",
  glossaryQuery: "",
  faqQuery: "",
  formStatus: {},
  tableUi: {},
  faqOpenKeys: new Set(),
  deferredSectionsVisible: new Set(),
  lastRenderedPage: null,
  pendingDemoAction: "",
  instantFeedback: null,
  demoScenarioRunCounts: {},
  guidedDemoProgressLabel: "",
  walkthroughStatus: "idle",
  walkthroughStepIndex: -1,
  walkthroughStepTitle: "",
  walkthroughStepHeadline: "",
  walkthroughProgressPct: 0,
  walkthroughElapsedMs: 0,
  walkthroughTotalMs: 0,
  walkthroughAnchor: "",
  presenterMode: false,
  presenterStepIndex: 0,
  presenterRecoveryNotice: "",
  scrollTopByPage: {},
  governanceSimulationMode: "advisory",
  governanceSimulationBundle: "current",
  governanceSimulationRequestId: null,
  exportViewMode: "event_time",
  replayStageIndex: 0,
  lastMappingImpactId: null
};

let dataset = FALLBACK_DATASET;
let datasetIndex = buildDatasetIndex(dataset);
const chartRegistry = new Map();
const INTERVENTION_STORAGE_KEY = "aci_demo_interventions_v3";
const MANUAL_MAPPING_STORAGE_KEY = "aci_demo_manual_mapping_v1";
const API_TOKEN_STORAGE_KEYS = ["aci_demo_api_token", "aci_api_token"];
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");
const USD_FORMATTERS = new Map();
let toastTimer = null;
let instantFeedbackTimer = null;
let lastActiveElementBeforeDrawer = null;
let inputRenderTimer = null;
let investorWalkthroughRunId = 0;

const INVESTOR_WALKTHROUGH_STEPS = [
  {
    key: "overview",
    page: "overview",
    anchor: "walkthrough-overview",
    durationMs: 12000,
    title: "Overview: where the money is",
    headline: "Start with the business posture: total spend, owned spend, and the biggest savings levers.",
    prepare: async () => {
      go("overview");
    }
  },
  {
    key: "partner-brief",
    page: "partner_brief",
    anchor: "walkthrough-partner-brief",
    durationMs: 10000,
    title: "Partner Brief: credible pilot path",
    headline: "Turn the demo from a dashboard tour into a concrete enterprise design-partner plan: scope, integrations, success metrics, and executive proof moments.",
    prepare: async () => {
      state.selectedPartnerStage = "prove";
      go("partner_brief");
    }
  },
  {
    key: "requirements-proof",
    page: "requirements",
    anchor: "walkthrough-requirements",
    durationMs: 10000,
    title: "PRD Proof: every claim tied to a visible surface",
    headline: "Anchor the walkthrough in the actual Argmin source documents: decision surfaces, RAIL, trust controls, and local proof paths.",
    prepare: async () => {
      state.selectedProofJourney = "trust";
      go("requirements");
    }
  },
  {
    key: "coverage",
    page: "coverage",
    anchor: "walkthrough-coverage",
    durationMs: 9000,
    title: "Coverage: what the system can and cannot see",
    headline: "Show honest pathway coverage: fully capturable, partial, indirect, uncapturable, and degraded states all remain explicit.",
    prepare: async () => {
      go("coverage");
    }
  },
  {
    key: "adoption",
    page: "adoption",
    anchor: "walkthrough-adoption",
    durationMs: 11000,
    title: "Employee Adoption: who is actually using AI",
    headline: "Move from spend to operating reality: which parts of the business are using AI broadly, repeatedly, and under control.",
    prepare: async () => {
      state.adoptionWindowDays = 30;
      applyAdoptionHierarchy(state.adoptionHierarchy || fallbackAdoptionHierarchy());
      go("adoption");
    }
  },
  {
    key: "request-proof",
    page: "attribution",
    anchor: "walkthrough-request-proof",
    durationMs: 15000,
    title: "Request Proof: why one request belongs to one owner",
    headline: "Show the evidence chain behind a single request so the financial outcome is explainable instead of opaque.",
    prepare: async () => {
      state.selectedRequestId = dataset.attribution_requests?.[0]?.id || state.selectedRequestId;
      go("attribution");
      await runInterceptScenario("enriched", { manageLoading: false });
    }
  },
  {
    key: "exports",
    page: "exports",
    anchor: "walkthrough-exports",
    durationMs: 9000,
    title: "Exports: chargeback without false precision",
    headline: "Show finance-ready rows, review-required rows, allocation-only rows, and unknown spend kept out of chargeback.",
    prepare: async () => {
      state.exportViewMode = "event_time";
      go("exports");
    }
  },
  {
    key: "interventions",
    page: "interventions",
    anchor: "walkthrough-interventions",
    durationMs: 13000,
    title: "Interventions: what to do next",
    headline: "Translate attribution into action by showing which recommendations are open, what they save, and how risky they are.",
    prepare: async () => {
      state.interventionFilter = "recommended";
      go("interventions");
      await runInterceptScenario("soft_stop", { manageLoading: false });
    }
  },
  {
    key: "energy",
    page: "energy",
    anchor: "walkthrough-energy",
    durationMs: 9000,
    title: "Energy: footprint as an advisory signal",
    headline: "Surface model energy, carbon, and Unrated states without letting sustainability claims override cost, quality, or policy.",
    prepare: async () => {
      go("energy");
    }
  },
  {
    key: "forecast",
    page: "forecast",
    anchor: "walkthrough-forecast",
    durationMs: 14000,
    title: "Forecasting: what happens if you act",
    headline: "Switch from diagnosis to planning by showing how approved actions change the forward spend curve.",
    prepare: async () => {
      state.forecastScenarioKey = "optimization_capture";
      state.forecastHorizonMonths = 12;
      go("forecast");
      await runForecastDemo({
        log: false,
        toast: false,
        statusOverride: "Optimization Capture scenario loaded for the investor walkthrough."
      });
    }
  },
  {
    key: "governance",
    page: "governance",
    anchor: "walkthrough-governance",
    durationMs: 12000,
    title: "Governance: why this is safe to deploy",
    headline: "End on deployment trust: the platform guides behavior at decision time without becoming an outage path.",
    prepare: async () => {
      go("governance");
      await runInterceptScenario("fail_open", { manageLoading: false });
    }
  },
  {
    key: "admin",
    page: "admin",
    anchor: "walkthrough-admin",
    durationMs: 8000,
    title: "Admin: operable inside the trust boundary",
    headline: "Finish with RBAC, read-only integration posture, scoped diagnostics, and auditable administrative actions.",
    prepare: async () => {
      go("admin");
    }
  }
];

const INVESTOR_WALKTHROUGH_TOTAL_MS = INVESTOR_WALKTHROUGH_STEPS.reduce(
  (sum, step) => sum + step.durationMs,
  0
);

const DEMO_PATH_ITEMS = [
  {
    step: "01",
    page: "overview",
    label: "Start",
    detail: "Spend posture"
  },
  {
    step: "02",
    page: "adoption",
    label: "Adoption",
    detail: "Where teams use AI"
  },
  {
    step: "03",
    page: "attribution",
    label: "Proof",
    detail: "One request to owner"
  },
  {
    step: "04",
    page: "manual_mapping",
    label: "Resolve",
    detail: "Close ownership gaps"
  },
  {
    step: "05",
    page: "interventions",
    label: "Act",
    detail: "Approve one savings move"
  },
  {
    step: "06",
    page: "forecast",
    label: "Plan",
    detail: "Show spend impact"
  },
  {
    step: "07",
    page: "governance",
    label: "Trust",
    detail: "Show safe deployment"
  }
];

const SUPPORTING_PAGE_DEMO_PATH_TARGETS = {
  partner_brief: "overview",
  requirements: "overview",
  coverage: "adoption",
  models: "adoption",
  teams: "adoption",
  exports: "manual_mapping",
  energy: "interventions",
  integrations: "interventions",
  admin: "governance",
  glossary: "overview",
  faq: "overview"
};

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isInteractiveFilterControl(button, action) {
  if (!(button instanceof HTMLElement)) {
    return false;
  }
  if (
    button.classList.contains("filter-btn")
    || button.classList.contains("lens-btn")
    || button.classList.contains("forecast-horizon-btn")
    || button.classList.contains("forecast-scenario-btn")
    || button.classList.contains("adoption-window-btn")
    || button.classList.contains("adoption-breadcrumb")
    || button.classList.contains("request-sample-btn")
    || button.classList.contains("decision-replay-stage")
    || button.classList.contains("partner-stage-btn")
    || button.classList.contains("proof-journey-btn")
    || button.classList.contains("persona-card")
    || button.classList.contains("table-sort-btn")
    || button.classList.contains("table-page-btn")
  ) {
    return true;
  }
  return action.startsWith("set-")
    || action.startsWith("table-")
    || action.includes("-set-")
    || action === "select-proof-journey"
    || action === "select-request"
    || action === "select-intervention";
}

const CONTEXTUAL_HELP = {
  "total-ai-spend": {
    title: "Total AI Spend",
    summary: "Current month synthetic spend across AI providers, services, and workflows.",
    next: "Use Teams or Models to see where it concentrates."
  },
  "attribution-coverage": {
    title: "Attribution Coverage",
    summary: "Share of spend with enough evidence to assign an owner confidently.",
    next: "Open Request Proof to inspect the evidence chain."
  },
  "optimization-potential": {
    title: "Optimization Potential",
    summary: "Validated savings headroom from routing, policy, or implementation changes.",
    next: "Open Interventions to choose a savings move."
  },
  "savings-captured": {
    title: "Savings Captured",
    summary: "Savings already moved from recommendation into the implemented baseline.",
    next: "Compare with open pipeline to explain remaining upside."
  },
  "budget-utilization": {
    title: "Budget Utilization",
    summary: "Current AI spend as a percentage of the team budget envelope.",
    next: "Use this to spot teams approaching operating limits."
  },
  "trac": {
    title: "TRAC",
    summary: "Transparent Reconciled AI Cost: the finance-safe cost delta after estimate, billing, and attribution checks.",
    next: "Open Exports to see TRAC on chargeback rows."
  },
  "model-spend": {
    title: "Model Spend",
    summary: "Synthetic monthly spend grouped by model family.",
    next: "Sort the model table by Spend or Requests."
  },
  "monthly-spend": {
    title: "Monthly Spend",
    summary: "Current monthly run-rate for the selected team, model, or export view.",
    next: "Use Forecasting to project the impact."
  },
  "spend": {
    title: "Spend",
    summary: "Synthetic cost measured in the current demo period.",
    next: "Sort or filter the table to isolate the largest drivers."
  },
  "requests": {
    title: "Requests",
    summary: "Count of AI calls or usage events in the selected period.",
    next: "Compare with spend to separate demand from unit-cost issues."
  },
  "latency-p95": {
    title: "Latency P95",
    summary: "95th percentile request latency for the model or workflow.",
    next: "Use this as a quality guard before proposing lower-cost routing."
  },
  "variance": {
    title: "Variance",
    summary: "Relative cost difference versus the expected low-cost baseline.",
    next: "High variance usually deserves a routing or policy review."
  },
  "teams": {
    title: "Teams",
    summary: "Number of teams or business units using the selected model or workflow.",
    next: "Open Employee Adoption for workflow-level detail."
  },
  "trend": {
    title: "Trend",
    summary: "Recent direction of spend, demand, or adoption compared with the prior period.",
    next: "Use positive trend with spend to flag drift."
  },
  "workflow": {
    title: "Workflow",
    summary: "The business process where AI is being used, not just the technical service.",
    next: "Use workflow names to tell the adoption story."
  },
  "ai-service": {
    title: "AI Service",
    summary: "The platform, model, or internal service being consumed by a team.",
    next: "Compare it with Entry Point and Insertion Point."
  },
  "capability": {
    title: "Capability",
    summary: "What the AI service does for the workflow, such as drafting, search, coding, or classification.",
    next: "Use this to show how adoption differs by business function."
  },
  "entry-point": {
    title: "Entry Point",
    summary: "Where a user starts the AI-powered workflow.",
    next: "Entry points reveal whether adoption is embedded or ad hoc."
  },
  "insertion-point": {
    title: "Insertion Point",
    summary: "The step in the workflow where AI output changes work or decisions.",
    next: "Use it to explain exactly how teams adopt AI."
  },
  "governed": {
    title: "Governed",
    summary: "Share of usage covered by policy, routing, attribution, or review controls.",
    next: "Open Governance to simulate a decision."
  },
  "depth": {
    title: "Depth",
    summary: "How deeply AI is embedded in the workflow, from assistive to operational.",
    next: "High depth with low governance is a design-partner talking point."
  },
  "manual-mapping": {
    title: "Manual Mapping",
    summary: "Human review for ambiguous ownership when graph evidence is not enough.",
    next: "Resolve one item to show coverage lift."
  },
  "confidence": {
    title: "Confidence",
    summary: "Strength of the evidence behind an attribution or ownership decision.",
    next: "Low confidence should route to review, not disappear."
  },
  "owner": {
    title: "Owner",
    summary: "The team or person accountable for the spend, workflow, or remediation.",
    next: "Use owner to connect cost to action."
  },
  "owner-shift": {
    title: "Owner Shift",
    summary: "The business owner changes after stronger attribution evidence is applied.",
    next: "Use it to show why review changes finance outcomes."
  },
  "policy-simulation": {
    title: "Policy Simulation",
    summary: "A local preview of how one request behaves under different governance postures.",
    next: "Switch mode or bundle to show the decision changing."
  },
  "fail-open": {
    title: "Fail-open",
    summary: "Production work continues when context is missing, while the exception is logged.",
    next: "Use this to explain safety without creating outages."
  },
  "next-action": {
    title: "Next Action",
    summary: "The shortest operator move that keeps the demo narrative moving.",
    next: "Click the adjacent CTA or follow the demo path."
  },
  "why-it-matters": {
    title: "Why It Matters",
    summary: "The business reason this data point changes a decision.",
    next: "Use this sentence as presenter talk track."
  },
  "truth-basis": {
    title: "Truth Basis",
    summary: "The evidence source used to treat a record as finance-safe or caveated.",
    next: "Use it to separate known cost from provisional cost."
  },
  "chargeback-ready": {
    title: "Chargeback Ready",
    summary: "Spend that can be exported to finance with enough ownership evidence.",
    next: "Open Exports to compare event-time and current-state views."
  },
  "review-required": {
    title: "Review Required",
    summary: "Spend or records that need a human decision before finance export.",
    next: "Open Manual Mapping to close gaps."
  },
  "implementation-effort": {
    title: "Implementation Effort",
    summary: "Relative lift required to capture the recommendation.",
    next: "Use low effort and high savings for the cleanest demo action."
  },
  "forecast-impact": {
    title: "Forecast Impact",
    summary: "Expected planning effect if the selected recommendation is executed.",
    next: "Open Forecasting to show the run-rate change."
  }
};
let contextualHelpIdCounter = 0;

function normalizeHelpLabel(value) {
  return String(value || "")
    .replace(/\?.*$/g, "")
    .replace(/\b(sort|asc|desc)\b/gi, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function contextualHelpEntryForLabel(label) {
  const key = normalizeHelpLabel(label);
  if (CONTEXTUAL_HELP[key]) {
    return { key, ...CONTEXTUAL_HELP[key] };
  }
  return null;
}

function contextualHelpTooltip(entry) {
  if (!entry) {
    return "";
  }
  return `${entry.summary}${entry.next ? ` Next: ${entry.next}` : ""}`;
}

function contextualHelpTargets(scope) {
  const selector = [
    ".metric-label",
    ".forecast-metric-label",
    ".adoption-lens-metric-label",
    ".signal-title",
    ".section-narrative-label",
    ".simulation-card-title",
    ".simulation-result-label",
    ".card-title",
    ".table-sort-btn > span:first-child"
  ].join(",");
  return Array.from(scope.querySelectorAll(selector));
}

function attachContextualHelp(target, entry) {
  if (!(target instanceof HTMLElement) || !entry || target.dataset.contextHelpBound === "true") {
    return;
  }
  target.dataset.contextHelpBound = "true";
  const interactiveParent = target.closest("button");
  if (interactiveParent instanceof HTMLElement && interactiveParent.contains(target)) {
    interactiveParent.classList.add("has-context-help");
    interactiveParent.dataset.tooltip = contextualHelpTooltip(entry);
    const baseLabel = interactiveParent.getAttribute("aria-label") || target.textContent.trim();
    interactiveParent.setAttribute("aria-label", `${baseLabel}. ${entry.summary}`);
    if (!target.querySelector(".context-help-glyph")) {
      const glyph = document.createElement("span");
      glyph.className = "context-help-glyph";
      glyph.setAttribute("aria-hidden", "true");
      glyph.textContent = "?";
      target.appendChild(glyph);
    }
    return;
  }

  target.classList.add("context-help-target");
  const tooltipId = `context-help-${entry.key}-${contextualHelpIdCounter += 1}`;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "context-help-button";
  button.dataset.action = "show-context-help";
  button.dataset.helpKey = entry.key;
  button.setAttribute("aria-label", `Explain ${entry.title}`);
  button.setAttribute("aria-describedby", tooltipId);
  button.textContent = "?";

  const tooltip = document.createElement("span");
  tooltip.className = "context-help-tooltip";
  tooltip.id = tooltipId;
  tooltip.setAttribute("role", "tooltip");
  tooltip.textContent = contextualHelpTooltip(entry);

  target.appendChild(button);
  target.appendChild(tooltip);
}

function normalizeContextualHelp(root = document) {
  const scope = root || document;
  for (const target of contextualHelpTargets(scope)) {
    const label = target.dataset.columnLabel || target.textContent || "";
    const entry = contextualHelpEntryForLabel(label);
    if (entry) {
      attachContextualHelp(target, entry);
    }
  }
}

function showContextHelp(helpKey) {
  const key = String(helpKey || "");
  const entry = CONTEXTUAL_HELP[key];
  if (!entry) {
    return;
  }
  showToast(entry.title, contextualHelpTooltip(entry));
}

function tableSlug(value) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "demo-table";
}

function tableTitleFor(table) {
  const card = table.closest(".card");
  const title = card?.querySelector(".card-title")?.textContent?.trim();
  if (title) {
    return title;
  }
  const header = table.querySelector("thead th")?.textContent?.trim();
  return header ? `${header} table` : "Demo table";
}

function tableHeaderLabels(table) {
  return Array.from(table.querySelectorAll("thead th")).map((th, index) => {
    return th.dataset.columnLabel || th.textContent.trim() || `Column ${index + 1}`;
  });
}

function tableBaseKey(table) {
  const headers = tableHeaderLabels(table).slice(0, 3).join("-");
  return tableSlug(`${tableTitleFor(table)}-${headers}`);
}

function ensureTableKey(table, tables) {
  if (table.dataset.tableKey) {
    return table.dataset.tableKey;
  }
  const base = tableBaseKey(table);
  const sameBaseBefore = tables.slice(0, tables.indexOf(table))
    .filter((candidate) => tableBaseKey(candidate) === base)
    .length;
  const key = sameBaseBefore ? `${base}-${sameBaseBefore + 1}` : base;
  table.dataset.tableKey = key;
  return key;
}

function tableUiFor(tableKey) {
  const key = String(tableKey || "");
  if (!state.tableUi[key]) {
    state.tableUi[key] = {
      filter: "",
      sortIndex: null,
      sortDirection: "asc",
      page: 1,
      pageSize: DEFAULT_TABLE_PAGE_SIZE
    };
  }
  return state.tableUi[key];
}

function tableForKey(tableKey) {
  return Array.from(document.querySelectorAll("table.table"))
    .find((table) => table.dataset.tableKey === tableKey) || null;
}

function tableDataRows(table) {
  const tbody = table.tBodies[0];
  if (!tbody) {
    return [];
  }
  return Array.from(tbody.rows).filter((row) => {
    return row.dataset.tableGenerated !== "empty"
      && !row.querySelector(".state-panel-empty, .state-panel-error");
  });
}

function parseTableNumericValue(value) {
  const text = String(value || "")
    .trim()
    .replace(/,/g, "")
    .replace(/\$/g, "")
    .replace(/%/g, "")
    .replace(/\b(ms|months?|requests?|users?|teams?|records?|rows?)\b/gi, "")
    .trim();
  const match = text.match(/^([+-]?\d+(?:\.\d+)?)\s*([kmb])?$/i);
  if (!match) {
    return null;
  }
  const base = Number(match[1]);
  if (!Number.isFinite(base)) {
    return null;
  }
  const multiplier = {
    k: 1000,
    m: 1000000,
    b: 1000000000
  }[String(match[2] || "").toLowerCase()] || 1;
  return base * multiplier;
}

function tableComparableValue(text) {
  const numeric = parseTableNumericValue(text);
  if (numeric !== null) {
    return { type: "number", value: numeric };
  }
  return {
    type: "text",
    value: String(text || "").trim().toLowerCase()
  };
}

function compareTableCells(left, right, direction) {
  const leftValue = tableComparableValue(left);
  const rightValue = tableComparableValue(right);
  const multiplier = direction === "desc" ? -1 : 1;
  if (leftValue.type === "number" && rightValue.type === "number") {
    return (leftValue.value - rightValue.value) * multiplier;
  }
  return leftValue.value.localeCompare(rightValue.value, undefined, {
    numeric: true,
    sensitivity: "base"
  }) * multiplier;
}

function tableColumnLooksNumeric(rows, columnIndex) {
  const values = rows
    .map((row) => row.cells[columnIndex]?.textContent?.trim() || "")
    .filter(Boolean);
  if (!values.length) {
    return false;
  }
  const numericCount = values.filter((value) => parseTableNumericValue(value) !== null).length;
  return numericCount / values.length >= 0.6;
}

function normalizeTableCells(table, rows) {
  const headers = Array.from(table.querySelectorAll("thead th"));
  headers.forEach((th, columnIndex) => {
    const numeric = tableColumnLooksNumeric(rows, columnIndex);
    th.classList.toggle("table-primary-column", columnIndex === 0);
    th.classList.toggle("table-number-column", numeric);
    th.classList.toggle("table-detail-column", columnIndex === headers.length - 1);
    for (const row of rows) {
      const cell = row.cells[columnIndex];
      if (!cell) {
        continue;
      }
      cell.classList.toggle("table-primary-column", columnIndex === 0);
      cell.classList.toggle("table-number-column", numeric);
      cell.classList.toggle("table-detail-column", columnIndex === headers.length - 1);
    }
  });
}

function tableColumnCount(table) {
  return table.querySelectorAll("thead th").length || table.rows[0]?.cells?.length || 1;
}

function noMatchTableRow(table) {
  const tbody = table.tBodies[0];
  if (!tbody) {
    return null;
  }
  let row = tbody.querySelector('tr[data-table-generated="empty"]');
  if (!row) {
    row = document.createElement("tr");
    row.dataset.tableGenerated = "empty";
    row.innerHTML = `
      <td colspan="${tableColumnCount(table)}">
        ${emptyStateMarkup(
          "No rows match this quick filter.",
          "Clear the table filter or use fewer terms to restore the seeded rows.",
          {
            compact: true,
            example: { label: "Filter state", value: "No matching rows on this page" },
            nextStep: "Clear the quick filter to restore the current seeded table."
          }
        )}
      </td>
    `;
    tbody.appendChild(row);
  }
  return row;
}

function setupScannableTable(table, tableKey) {
  const wrap = table.closest(".table-wrap");
  if (!wrap) {
    return;
  }
  const ui = tableUiFor(tableKey);
  const title = tableTitleFor(table);
  wrap.classList.add("scannable-table-wrap");
  wrap.dataset.tableKey = tableKey;
  wrap.setAttribute("aria-label", `${title} table`);

  if (!wrap.querySelector(`[data-table-toolbar="${tableKey}"]`)) {
    const toolbar = document.createElement("div");
    toolbar.className = "table-toolbar";
    toolbar.dataset.tableToolbar = tableKey;
    toolbar.innerHTML = `
      <div class="table-context">
        <strong>${esc(title)}</strong>
        <span id="${esc(tableKey)}-status">Rows ready</span>
        <em class="table-microcopy">Sort headers, filter rows, then page without losing the demo context.</em>
      </div>
      <div class="table-tools">
        <label class="sr-only" for="${esc(tableKey)}-filter">Filter ${esc(title)}</label>
        <input
          id="${esc(tableKey)}-filter"
          class="control-input table-filter-input"
          type="text"
          value="${esc(ui.filter)}"
          placeholder="Filter rows"
          data-action-input="table-filter"
          data-table-key="${esc(tableKey)}"
          autocomplete="off"
          aria-label="Filter ${esc(title)} rows"
        />
        <select
          class="control-select table-page-size"
          data-action-change="table-page-size"
          data-table-key="${esc(tableKey)}"
          aria-label="Rows per page for ${esc(title)}"
        >
          ${TABLE_PAGE_SIZE_OPTIONS.map((size) => `<option value="${size}"${ui.pageSize === size ? " selected" : ""}>${size} rows</option>`).join("")}
        </select>
      </div>
    `;
    wrap.insertBefore(toolbar, table);
  }

  if (!wrap.querySelector(`[data-table-pagination="${tableKey}"]`)) {
    const pagination = document.createElement("div");
    pagination.className = "table-pagination";
    pagination.dataset.tablePagination = tableKey;
    pagination.innerHTML = `
      <button class="small-btn table-page-btn" data-action="table-page" data-table-key="${esc(tableKey)}" data-page-delta="-1">Previous</button>
      <span id="${esc(tableKey)}-page">Page 1 of 1</span>
      <button class="small-btn table-page-btn" data-action="table-page" data-table-key="${esc(tableKey)}" data-page-delta="1">Next</button>
    `;
    wrap.appendChild(pagination);
  }

  Array.from(table.querySelectorAll("thead th")).forEach((th, columnIndex) => {
    const label = th.dataset.columnLabel || th.textContent.trim() || `Column ${columnIndex + 1}`;
    th.dataset.columnLabel = label;
    th.setAttribute("scope", "col");
    if (!th.querySelector(".table-sort-btn")) {
      th.innerHTML = `
        <button class="table-sort-btn" data-action="table-sort" data-table-key="${esc(tableKey)}" data-column-index="${columnIndex}" aria-label="Sort by ${esc(label)}">
          <span>${esc(label)}</span>
          <span class="table-sort-indicator">Sort</span>
        </button>
      `;
    }
  });
}

function applyScannableTable(table) {
  const tableKey = table.dataset.tableKey;
  if (!tableKey || !table.tBodies[0]) {
    return;
  }
  const ui = tableUiFor(tableKey);
  const rows = tableDataRows(table);
  rows.forEach((row, index) => {
    if (!row.dataset.originalIndex) {
      row.dataset.originalIndex = String(index);
    }
    row.dataset.tableSearchText = (row.textContent || "").toLowerCase();
  });
  normalizeTableCells(table, rows);

  const query = String(ui.filter || "").trim().toLowerCase();
  const tokens = query.split(/\s+/).filter(Boolean);
  const matchingRows = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const haystack = row.dataset.tableSearchText || "";
    return tokens.every((token) => haystack.includes(token));
  });
  const sortedRows = [...rows].sort((left, right) => {
    if (Number.isInteger(ui.sortIndex)) {
      const leftCell = left.cells[ui.sortIndex]?.textContent || "";
      const rightCell = right.cells[ui.sortIndex]?.textContent || "";
      const compared = compareTableCells(leftCell, rightCell, ui.sortDirection);
      if (compared !== 0) {
        return compared;
      }
    }
    return Number(left.dataset.originalIndex || 0) - Number(right.dataset.originalIndex || 0);
  });
  const matchingSet = new Set(matchingRows);
  const sortedMatchingRows = sortedRows.filter((row) => matchingSet.has(row));

  const tbody = table.tBodies[0];
  const generatedRow = noMatchTableRow(table);
  for (const row of sortedRows) {
    tbody.appendChild(row);
  }
  if (generatedRow) {
    tbody.appendChild(generatedRow);
  }

  const pageSize = TABLE_PAGE_SIZE_OPTIONS.includes(Number(ui.pageSize))
    ? Number(ui.pageSize)
    : DEFAULT_TABLE_PAGE_SIZE;
  ui.pageSize = pageSize;
  const totalPages = Math.max(1, Math.ceil(sortedMatchingRows.length / pageSize));
  ui.page = Math.min(Math.max(Number(ui.page) || 1, 1), totalPages);
  const visibleStart = (ui.page - 1) * pageSize;
  const visibleRows = new Set(sortedMatchingRows.slice(visibleStart, visibleStart + pageSize));
  for (const row of sortedRows) {
    const visible = visibleRows.has(row);
    row.hidden = !visible;
    row.classList.toggle("table-row-filtered-out", !matchingSet.has(row));
  }
  if (generatedRow) {
    generatedRow.hidden = matchingRows.length > 0 || rows.length === 0;
  }

  const status = document.getElementById(`${tableKey}-status`);
  if (status) {
    const filteredLabel = rows.length && matchingRows.length !== rows.length
      ? `${fmtNumber(matchingRows.length)} of ${fmtNumber(rows.length)} rows`
      : `${fmtNumber(rows.length)} row${rows.length === 1 ? "" : "s"}`;
    const sortedLabel = Number.isInteger(ui.sortIndex)
      ? ` | sorted by ${tableHeaderLabels(table)[ui.sortIndex] || "column"} ${ui.sortDirection}`
      : "";
    status.textContent = `${filteredLabel}${sortedLabel}`;
  }
  const page = document.getElementById(`${tableKey}-page`);
  if (page) {
    page.textContent = `Page ${ui.page} of ${totalPages}`;
  }
  const wrap = table.closest(".table-wrap");
  for (const button of wrap?.querySelectorAll(`[data-action="table-page"][data-table-key="${tableKey}"]`) || []) {
    const delta = Number(button.dataset.pageDelta || 0);
    button.disabled = delta < 0 ? ui.page <= 1 : ui.page >= totalPages;
  }
  const filter = document.getElementById(`${tableKey}-filter`);
  if (filter instanceof HTMLInputElement && filter.value !== ui.filter) {
    filter.value = ui.filter;
  }
  const pageSizeSelect = wrap?.querySelector(`[data-action-change="table-page-size"][data-table-key="${tableKey}"]`);
  if (pageSizeSelect instanceof HTMLSelectElement) {
    pageSizeSelect.value = String(pageSize);
  }

  Array.from(table.querySelectorAll("thead th")).forEach((th, columnIndex) => {
    const active = ui.sortIndex === columnIndex;
    th.setAttribute("aria-sort", active ? (ui.sortDirection === "desc" ? "descending" : "ascending") : "none");
    const button = th.querySelector(".table-sort-btn");
    const indicator = th.querySelector(".table-sort-indicator");
    if (button instanceof HTMLElement) {
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    }
    if (indicator) {
      indicator.textContent = active ? ui.sortDirection.toUpperCase() : "Sort";
    }
  });
}

function normalizeScannableTables(root = document) {
  const scope = root || document;
  const tables = Array.from(document.querySelectorAll("table.table"));
  for (const table of tables) {
    if (scope !== document && !scope.contains(table)) {
      continue;
    }
    const tableKey = ensureTableKey(table, tables);
    table.dataset.control = "table";
    table.dataset.scannable = "true";
    setupScannableTable(table, tableKey);
    applyScannableTable(table);
  }
}

function updateTableSort(tableKey, columnIndex) {
  const table = tableForKey(tableKey);
  if (!table) {
    return;
  }
  const ui = tableUiFor(tableKey);
  const nextIndex = Number(columnIndex);
  if (!Number.isInteger(nextIndex)) {
    return;
  }
  if (ui.sortIndex === nextIndex) {
    ui.sortDirection = ui.sortDirection === "asc" ? "desc" : "asc";
  } else {
    ui.sortIndex = nextIndex;
    ui.sortDirection = "asc";
  }
  ui.page = 1;
  applyScannableTable(table);
}

function updateTablePage(tableKey, delta) {
  const table = tableForKey(tableKey);
  if (!table) {
    return;
  }
  const ui = tableUiFor(tableKey);
  ui.page = (Number(ui.page) || 1) + Number(delta || 0);
  applyScannableTable(table);
}

function updateTableFilter(tableKey, value) {
  const table = tableForKey(tableKey);
  if (!table) {
    return;
  }
  const ui = tableUiFor(tableKey);
  ui.filter = String(value || "");
  ui.page = 1;
  applyScannableTable(table);
}

function updateTablePageSize(tableKey, value) {
  const table = tableForKey(tableKey);
  if (!table) {
    return;
  }
  const ui = tableUiFor(tableKey);
  const pageSize = Number(value || DEFAULT_TABLE_PAGE_SIZE);
  ui.pageSize = TABLE_PAGE_SIZE_OPTIONS.includes(pageSize) ? pageSize : DEFAULT_TABLE_PAGE_SIZE;
  ui.page = 1;
  applyScannableTable(table);
}

function layoutSpacingClass(value, prefix) {
  const token = LAYOUT_SPACING_CLASS_BY_PX.get(String(value || "").trim().toLowerCase());
  return token ? `${prefix}-${token}` : "";
}

function applyLayoutSpacingClass(element, styleProp, prefix) {
  if (!(element instanceof HTMLElement)) {
    return;
  }
  const className = layoutSpacingClass(element.style[styleProp], prefix);
  if (!className) {
    return;
  }
  element.classList.add(className);
  element.style[styleProp] = "";
}

function normalizeTypographyContracts(root = document) {
  const scope = root || document;
  for (const [role, selector] of Object.entries(TYPOGRAPHY_ROLE_SELECTORS)) {
    for (const element of scope.querySelectorAll(selector)) {
      if (!(element instanceof HTMLElement)) {
        continue;
      }
      element.dataset.typography = role;
      element.classList.add(`type-${role}`);
      for (const prop of TYPOGRAPHY_INLINE_PROPS) {
        element.style[prop] = "";
      }
    }
  }
}

function normalizeLayoutContracts(root = document) {
  const scope = root || document;
  const viewRoot = scope === document
    ? document.getElementById("view-root")
    : scope.closest?.("#view-root") || scope.querySelector?.("#view-root") || scope;

  for (const stack of scope.querySelectorAll(".screen-secondary-content, .partner-page, .requirements-page, .coverage-page, .exports-page, .energy-page, .admin-page")) {
    stack.classList.add("layout-stack");
    stack.dataset.layout = stack.classList.contains("screen-secondary-content") ? "page-stack" : "section-stack";
  }

  for (const grid of scope.querySelectorAll(".grid, .adoption-kpi-grid, .adoption-lens-grid, .adoption-child-grid, .adoption-detail-grid, .workflow-spotlight-grid-wrap, .integration-summary-grid, .integration-source-grid, .integration-route-grid, .integration-scenario-grid, .coverage-split, .export-control-grid, .energy-model-grid-wrap, .persona-card-grid, .admin-diagnostic-grid")) {
    grid.dataset.layout = "grid";
  }

  for (const cluster of scope.querySelectorAll(".filter-bar, .adoption-toolbar-right, .adoption-window-row, .adoption-breadcrumbs, .adoption-inline-list, .manual-mapping-actions, .intervention-actions")) {
    cluster.classList.add("layout-cluster");
    cluster.dataset.layout = "cluster";
  }

  for (const header of scope.querySelectorAll(".card-header")) {
    header.classList.add("layout-header");
    header.dataset.layout = "header";
  }

  const styledElements = Array.from(scope.querySelectorAll("[style]"));
  if (scope instanceof HTMLElement && scope.hasAttribute("style")) {
    styledElements.unshift(scope);
  }
  for (const element of styledElements) {
    applyLayoutSpacingClass(element, "marginTop", "layout-mt");
    applyLayoutSpacingClass(element, "marginBottom", "layout-mb");
  }

  for (const canvas of scope.querySelectorAll("canvas")) {
    const frame = canvas.parentElement;
    if (!(frame instanceof HTMLElement)) {
      continue;
    }
    const frameClass = CHART_FRAME_CLASS_BY_HEIGHT.get(String(frame.style.height || "").trim().toLowerCase());
    if (frameClass) {
      frame.classList.add("chart-frame", frameClass);
      frame.dataset.layout = "chart-frame";
      frame.style.height = "";
    }
  }

  if (viewRoot instanceof HTMLElement) {
    viewRoot.dataset.layout = "viewport";
  }
}

function normalizePixelAlignmentContracts(root = document) {
  const scope = root || document;
  for (const element of scope.querySelectorAll(PIXEL_ALIGNMENT_SELECTORS)) {
    if (!(element instanceof HTMLElement)) {
      continue;
    }
    element.dataset.alignment = "pixel-grid";
  }
}

function normalizeDataVisualContracts(root = document) {
  const scope = root || document;

  for (const canvas of scope.querySelectorAll("canvas")) {
    const frame = canvas.parentElement;
    if (!(frame instanceof HTMLElement)) {
      continue;
    }
    frame.classList.add("data-chart-frame");
    frame.dataset.visual = "chart";
    frame.dataset.visualDensity = "clean";
    canvas.dataset.visual = "chart-canvas";
  }

  for (const note of scope.querySelectorAll(".chart-axis-note")) {
    if (!(note instanceof HTMLElement)) {
      continue;
    }
    note.classList.add("data-visual-caption");
    note.dataset.visual = "chart-caption";
  }

  const metricSelector = [
    ".metric-card",
    ".adoption-kpi-card",
    ".forecast-metric",
    ".forecast-estimate-card",
    ".drawer-summary-kpi",
    ".manual-mapping-kpi",
    ".adoption-lens-card",
    ".coverage-kpi"
  ].join(",");
  const metricGroups = new Map();
  for (const metric of scope.querySelectorAll(metricSelector)) {
    if (!(metric instanceof HTMLElement)) {
      continue;
    }
    metric.dataset.visual = "metric";
    metric.dataset.visualDensity = "clean";
    const parent = metric.parentElement;
    if (!parent) {
      metric.dataset.visualPriority = metric.dataset.visualPriority || "secondary";
      continue;
    }
    if (!metricGroups.has(parent)) {
      metricGroups.set(parent, []);
    }
    metricGroups.get(parent).push(metric);
  }
  for (const metrics of metricGroups.values()) {
    metrics.forEach((metric, index) => {
      metric.dataset.visualPriority = index === 0 ? "primary" : "secondary";
    });
  }

  for (const wrap of scope.querySelectorAll(".table-wrap, .scannable-table-wrap")) {
    if (!(wrap instanceof HTMLElement)) {
      continue;
    }
    wrap.dataset.visual = "table";
    wrap.dataset.visualDensity = "scan";
  }

  for (const table of scope.querySelectorAll("table.table")) {
    table.dataset.visual = "table";
    table.dataset.visualDensity = "scan";
  }
}

function normalizePrimaryActionContracts(root = document) {
  const scope = root || document;
  const actionGroups = scope.querySelectorAll(
    ".state-panel-actions, .entry-home-action, .forecast-button-row, .drawer-actions, .mode-banner-right, .presenter-controls, .recovery-banner-actions, .walkthrough-banner-actions, .adoption-toolbar-right"
  );
  for (const group of actionGroups) {
    const buttons = Array.from(group.querySelectorAll("button.small-btn, button.top-btn"))
      .filter((button) => button instanceof HTMLButtonElement);
    if (!buttons.length) {
      continue;
    }
    const primaryButton = buttons.find((button) => (
      button.dataset.primaryAction === "true"
        || button.classList.contains("primary")
        || button.classList.contains("success")
    )) || null;
    group.dataset.actionHierarchy = primaryButton ? "primary" : "secondary";
    for (const button of buttons) {
      const isPrimary = button === primaryButton;
      button.dataset.actionPriority = isPrimary ? "primary" : "secondary";
      if (isPrimary) {
        const label = button.dataset.defaultLabel || button.textContent.trim() || "Continue";
        button.dataset.defaultLabel = label;
        button.dataset.primaryAction = "true";
        button.setAttribute("aria-label", `Primary action: ${label}`);
      } else if (button.getAttribute("aria-label")?.startsWith("Primary action:")) {
        button.removeAttribute("aria-label");
      }
    }
  }
}

function normalizeVisualStateContracts(root = document) {
  const scope = root || document;
  for (const button of scope.querySelectorAll("button[data-action]")) {
    if (!(button instanceof HTMLButtonElement)) {
      continue;
    }
    const isLoading = button.dataset.loading === "true" || button.getAttribute("aria-busy") === "true";
    const isActive = button.classList.contains("active")
      || button.classList.contains("current")
      || button.getAttribute("aria-pressed") === "true"
      || button.hasAttribute("aria-current");
    const isDisabled = button.disabled || button.getAttribute("aria-disabled") === "true";
    if (isLoading) {
      button.dataset.uiState = "loading";
      button.setAttribute("aria-busy", "true");
    } else if (isActive) {
      button.dataset.uiState = "active";
    } else if (isDisabled) {
      button.dataset.uiState = "disabled";
    } else {
      button.dataset.uiState = "idle";
    }
  }

  const statePanelClasses = [
    ["loading", "state-panel-loading"],
    ["success", "state-panel-success"],
    ["empty", "state-panel-empty"],
    ["warning", "state-panel-warn"],
    ["error", "state-panel-error"]
  ];
  for (const panel of scope.querySelectorAll(".state-panel")) {
    if (!(panel instanceof HTMLElement)) {
      continue;
    }
    const match = statePanelClasses.find(([, className]) => panel.classList.contains(className));
    panel.dataset.uiState = match ? match[0] : "idle";
  }

  for (const feedback of scope.querySelectorAll(".field-feedback")) {
    if (!(feedback instanceof HTMLElement)) {
      continue;
    }
    feedback.dataset.uiState = feedback.classList.contains("field-feedback-ok")
      ? "success"
      : feedback.classList.contains("field-feedback-warn")
        ? "warning"
        : feedback.classList.contains("field-feedback-error")
          ? "error"
          : "idle";
  }
}

function normalizeInteractionContracts(root = document) {
  const scope = root || document;
  normalizeTypographyContracts(scope);
  normalizeLayoutContracts(scope);
  normalizeScannableTables(scope);
  normalizePixelAlignmentContracts(scope);
  normalizeDataVisualContracts(scope);
  normalizeContextualHelp(scope);
  normalizePrimaryActionContracts(scope);
  for (const button of scope.querySelectorAll("button[data-action]")) {
    const action = button.dataset.action || "";
    if (!button.hasAttribute("type")) {
      button.setAttribute("type", "button");
    }
    if (button.classList.contains("faq-question")) {
      button.dataset.control = "disclosure";
    } else if (isInteractiveFilterControl(button, action)) {
      button.dataset.control = "filter";
    } else {
      button.dataset.control = "button";
    }
    const active = button.classList.contains("active") || button.classList.contains("current");
    if (button.dataset.control === "filter") {
      button.setAttribute("aria-pressed", active ? "true" : "false");
    }
    if (button.classList.contains("current")) {
      button.setAttribute("aria-current", "page");
    } else if (button.getAttribute("aria-current") === "page") {
      button.removeAttribute("aria-current");
    }
    if (button.disabled) {
      button.setAttribute("aria-disabled", "true");
    } else {
      button.removeAttribute("aria-disabled");
    }
  }

  for (const input of scope.querySelectorAll("input[data-action-input]")) {
    input.classList.add("control-input");
    input.dataset.control = "input";
    if (!input.hasAttribute("autocomplete")) {
      input.setAttribute("autocomplete", "off");
    }
  }

  for (const select of scope.querySelectorAll("select[data-action-change]")) {
    select.classList.add("control-select");
    select.dataset.control = "select";
  }

  for (const wrap of scope.querySelectorAll(".table-wrap")) {
    wrap.dataset.control = "table-region";
    if (!wrap.hasAttribute("role")) {
      wrap.setAttribute("role", "region");
    }
    if (!wrap.hasAttribute("aria-label")) {
      wrap.setAttribute("aria-label", "Data table");
    }
  }

  for (const table of scope.querySelectorAll("table.table")) {
    table.dataset.control = "table";
  }

  for (const row of scope.querySelectorAll("tr[data-action]")) {
    row.dataset.control = "selectable-row";
    if (!row.hasAttribute("tabindex")) {
      row.setAttribute("tabindex", "0");
    }
    if (row.classList.contains("selected-row")) {
      row.setAttribute("aria-selected", "true");
    } else {
      row.removeAttribute("aria-selected");
    }
  }

  for (const card of scope.querySelectorAll("[data-action][role='button']")) {
    card.dataset.control = card.dataset.control || "selectable-card";
    if (!card.hasAttribute("tabindex")) {
      card.setAttribute("tabindex", "0");
    }
  }

  normalizeRoleBasedControls(scope);
  normalizeVisualStateContracts(scope);
}

function normalizeFormStatus(status = {}) {
  const kind = ["hint", "ok", "warn", "error"].includes(status.kind)
    ? status.kind
    : "hint";
  return {
    kind,
    message: String(status.message || ""),
    example: String(status.example || ""),
    value: String(status.value ?? "")
  };
}

function setFormStatus(inputKey, status = {}, value = "") {
  const key = String(inputKey || "");
  if (!key) {
    return;
  }
  state.formStatus[key] = normalizeFormStatus({
    ...status,
    value: String(value ?? "")
  });
}

function formStatusFor(inputKey, fallbackStatus = null, currentValue = "") {
  const key = String(inputKey || "");
  const value = String(currentValue ?? "");
  const explicit = key ? state.formStatus[key] : null;
  if (explicit && explicit.value === value) {
    return normalizeFormStatus(explicit);
  }
  return normalizeFormStatus(fallbackStatus || { kind: "hint", message: "" });
}

function searchFieldFeedback(inputKey, value, stats = {}) {
  const key = String(inputKey || "");
  const query = String(value || "").trim();
  const example = FORM_SEARCH_EXAMPLES[key] || "";
  const label = FORM_SEARCH_LABELS[key] || "results";
  const count = Number(stats.filteredCount || 0);
  if (!query) {
    return {
      kind: "hint",
      message: example
        ? `Optional. Leave blank to show all ${label}, or try "${example}".`
        : `Optional. Leave blank to show all ${label}.`,
      example
    };
  }
  if (query.length < FORM_MIN_SEARCH_LENGTH) {
    return {
      kind: "warn",
      message: example
        ? `Keep typing for useful matches, or use "${example}" as a known-good example.`
        : "Keep typing for useful matches.",
      example
    };
  }
  if (count === 0) {
    return {
      kind: "error",
      message: example
        ? `No matches for "${query}". Use "${example}" to restore a known-good search.`
        : `No matches for "${query}". Try a broader term.`,
      example
    };
  }
  return {
    kind: "ok",
    message: `${count} ${label} shown. Your input is preserved while results update.`,
    example
  };
}

function fieldValidationAttrs(inputKey, fallbackStatus = null, currentValue = "", describedBy = []) {
  const key = String(inputKey || "");
  const status = formStatusFor(key, fallbackStatus, currentValue);
  const describedIds = [`${key}-feedback`, ...describedBy].filter(Boolean).join(" ");
  return `aria-describedby="${esc(describedIds)}" aria-invalid="${status.kind === "error" ? "true" : "false"}"`;
}

function fieldFeedbackMarkup(inputKey, fallbackStatus = null, currentValue = "") {
  const key = String(inputKey || "");
  const status = formStatusFor(key, fallbackStatus, currentValue);
  return `
    <div class="field-feedback field-feedback-${esc(status.kind)}" id="${esc(key)}-feedback" data-feedback-for="${esc(key)}" role="${status.kind === "error" ? "alert" : "status"}" aria-live="polite">
      <span>${esc(status.message)}</span>
    </div>
  `;
}

function syncFieldFeedback(inputKey, value, status, describedBy = []) {
  const key = String(inputKey || "");
  if (!key) {
    return;
  }
  setFormStatus(key, status, value);
  const feedback = document.getElementById(`${key}-feedback`);
  if (feedback) {
    feedback.outerHTML = fieldFeedbackMarkup(key, status, value);
  }
  const field = document.getElementById(`${key}-input`);
  if (field instanceof HTMLElement) {
    field.setAttribute("aria-describedby", [`${key}-feedback`, ...describedBy].filter(Boolean).join(" "));
    field.setAttribute("aria-invalid", normalizeFormStatus(status).kind === "error" ? "true" : "false");
  }
}

function fmtNumber(value) {
  return NUMBER_FORMATTER.format(Number(value || 0));
}

function fmtUSD(value, digits = 0) {
  if (!USD_FORMATTERS.has(digits)) {
    USD_FORMATTERS.set(digits, new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }));
  }
  return USD_FORMATTERS.get(digits).format(Number(value || 0));
}

function fmtNullableUSD(value, digits = 0) {
  return value === null || value === undefined ? "Unknown" : fmtUSD(value, digits);
}

function fmtPct(value, digits = 1) {
  return `${Number(value || 0).toFixed(digits)}%`;
}

function compactUSD(value) {
  const amount = Number(value || 0);
  if (Math.abs(amount) >= 1_000_000) {
    return `${fmtUSD(amount / 1_000_000, 2)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `${fmtUSD(amount / 1_000, 1)}K`;
  }
  return fmtUSD(amount, 0);
}

function nowLabel() {
  const d = new Date();
  return d.toLocaleTimeString("en-US", { hour12: false });
}

function normalizeLookupKey(value) {
  return String(value || "").trim().toLowerCase();
}

function indexBy(items, keyFn) {
  const index = new Map();
  for (const item of items || []) {
    const key = normalizeLookupKey(keyFn(item));
    if (key) {
      index.set(key, item);
    }
  }
  return index;
}

function buildDatasetIndex(source) {
  return {
    requestsById: indexBy(source.attribution_requests, (item) => item.id),
    teamsById: indexBy(source.teams, (item) => item.id),
    teamsByName: indexBy(source.teams, (item) => item.name),
    modelsByName: indexBy(source.models, (item) => item.name),
    interventionsById: indexBy(source.interventions, (item) => item.id),
    manualMappingsById: indexBy(source.manual_mapping, (item) => item.id),
    glossaryByTerm: indexBy(source.glossary, (item) => item.term)
  };
}

function rebuildDatasetIndex() {
  datasetIndex = buildDatasetIndex(dataset);
}

function indexedLookup(index, key) {
  return index.get(normalizeLookupKey(key)) || null;
}

function fmtDateTime(value) {
  if (!value) {
    return "N/A";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function roleLensLabel(key = state.roleLens) {
  return ROLE_LENSES.find((item) => item.key === key)?.label || "Executive";
}

function roleLensDescription(key = state.roleLens) {
  return ROLE_LENSES.find((item) => item.key === key)?.description || "";
}

function activeDemoPersona() {
  return DEMO_PERSONAS.find((persona) => persona.key === state.activePersonaKey) || DEMO_PERSONAS[0];
}

function personaCanAccessPage(pageKey, persona = activeDemoPersona()) {
  return (persona.allowedPages || []).includes(pageKey);
}

function personaHasPermission(persona, permissions = []) {
  const required = Array.isArray(permissions) ? permissions : [permissions];
  if (!required.length) {
    return true;
  }
  const owned = new Set(persona.permissions || []);
  return required.some((permission) => owned.has(permission));
}

function actionPermissionRequirements(action, descriptor = {}) {
  const normalizedAction = String(action || "");
  if (normalizedAction === "manual-map-confirm" || normalizedAction === "manual-map-assign") {
    return ["manual_override", "manage_policy"];
  }
  if (normalizedAction === "manual-map-defer") {
    return ["manual_override", "manage_policy", "review_team_records"];
  }
  if (normalizedAction === "intervention-status") {
    return ["review_savings", "comment_on_interventions", "manage_policy"];
  }
  if (normalizedAction === "set-mode") {
    return ["manage_policy", "approve_exceptions"];
  }
  if (normalizedAction === "forecast-generate" || normalizedAction === "forecast-reset") {
    return ["forecast_spend", "review_savings", "manage_policy"];
  }
  if (normalizedAction === "export-artifact") {
    return ["export_packets", "export_evidence", "review_savings", "forecast_spend", "manage_policy"];
  }
  if (normalizedAction === "adoption-refresh") {
    return ["view_adoption", "run_diagnostics", "manage_users"];
  }
  if (normalizedAction === "integrations-refresh" || normalizedAction === "integrations-run-scenario") {
    return ["view_integration_handoffs", "view_integration_health", "view_security_handoffs", "replay_scenarios", "run_diagnostics"];
  }
  if (normalizedAction === "bootstrap-demo" || normalizedAction === "run-sequence" || normalizedAction === "run-scenario") {
    return descriptor.scenario ? ["replay_scenarios", "manage_policy", "view_request_lineage"] : [];
  }
  return [];
}

function actionDescriptorFromElement(actionEl) {
  return {
    action: actionEl.dataset.action || "",
    page: actionEl.dataset.page || "",
    scenario: actionEl.dataset.scenario || "",
    nextStatus: actionEl.dataset.nextStatus || ""
  };
}

function personaCanUseAction(action, descriptor = {}, persona = activeDemoPersona()) {
  const targetPage = descriptor.page || "";
  if ((action === "go" || action === "back-to-demo-path") && targetPage) {
    return personaCanAccessPage(targetPage, persona);
  }
  if (targetPage && PAGE_TITLES[targetPage] && !personaCanAccessPage(targetPage, persona)) {
    return false;
  }
  return personaHasPermission(persona, actionPermissionRequirements(action, descriptor));
}

function personaCanUseActionElement(actionEl, persona = activeDemoPersona()) {
  if (!(actionEl instanceof HTMLElement)) {
    return true;
  }
  const descriptor = actionDescriptorFromElement(actionEl);
  return personaCanUseAction(descriptor.action, descriptor, persona);
}

function personaCanUseActionDescriptor(action, descriptor = {}, persona = activeDemoPersona()) {
  return personaCanUseAction(action, descriptor, persona);
}

function normalizeRoleBasedControls(root = document) {
  const scope = root || document;
  const persona = activeDemoPersona();
  for (const actionEl of Array.from(scope.querySelectorAll("[data-action]"))) {
    if (!(actionEl instanceof HTMLElement)) {
      continue;
    }
    const action = actionEl.dataset.action || "";
    if (action === "set-demo-persona" || action === "set-role-lens" || action.startsWith("table-") || action === "show-context-help") {
      continue;
    }
    if (!personaCanUseActionElement(actionEl, persona)) {
      actionEl.remove();
    }
  }
}

function setPersonaNotice(title, message, detail = "") {
  state.personaNotice = { title, message, detail };
  showToast(title, message);
}

function clearPersonaNotice() {
  state.personaNotice = null;
}

function setActivePersona(personaKey) {
  const nextPersona = DEMO_PERSONAS.find((persona) => persona.key === personaKey) || DEMO_PERSONAS[0];
  state.activePersonaKey = nextPersona.key;
  if (!personaCanAccessPage(state.page, nextPersona)) {
    state.page = nextPersona.homePage || "overview";
    state.scrollTopByPage[state.page] = 0;
    setPersonaNotice(
      "Persona View Applied",
      `${nextPersona.label} starts on ${PAGE_TITLES[state.page] || "Overview"}.`,
      "The previous page is outside this persona's local demo permission set."
    );
  } else {
    clearPersonaNotice();
    showToast("Persona View Applied", `${nextPersona.label} permissions and records are now active.`);
  }
  appendLog("ok", "Persona switched", `${nextPersona.name} (${nextPersona.role}) is active.`, null, {
    hidden: true,
    why: "The local demo uses synthetic personas to validate role-specific menus, workflows, and records."
  });
  render();
}

function operationRoles(operation) {
  return String(operation.role_required || "")
    .split(/\s+or\s+|,\s*/i)
    .map((role) => role.trim())
    .filter(Boolean);
}

function personaCanPerformOperation(operation, persona = activeDemoPersona()) {
  const roles = operationRoles(operation);
  return roles.includes(persona.role) || roles.includes(persona.label);
}

function personaCanViewAdminRecords(persona = activeDemoPersona()) {
  return persona.role === "Admin"
    || persona.role === "Auditor"
    || persona.role === "Security"
    || personaHasPermission(persona, ["view_admin_records", "manage_users"]);
}

function personaVisibleAccounts(accounts = [], persona = activeDemoPersona()) {
  const rows = Array.isArray(accounts) ? accounts : [];
  if (personaCanViewAdminRecords(persona)) {
    return rows;
  }
  return rows.filter((account) => account.role === persona.role || account.name === persona.name);
}

function personaVisibleOperations(operations = [], persona = activeDemoPersona()) {
  const rows = Array.isArray(operations) ? operations : [];
  return rows.filter((operation) => personaCanPerformOperation(operation, persona));
}

function personaVisibleAuditEvents(events = [], persona = activeDemoPersona()) {
  const rows = Array.isArray(events) ? events : [];
  if (personaCanViewAdminRecords(persona)) {
    return rows;
  }
  return rows.filter((event) => event.role === persona.role || event.actor === persona.name);
}

function pageLensNarrative(pageKey = state.page, lens = state.roleLens) {
  const copy = {
    overview: {
      executive: ["AI spend is growing quickly, but most of it is already attributable enough to act on.", "This is the company-level posture: owned spend, open leverage, and where executive attention belongs next."],
      finance: ["This page shows which share of AI spend is ready for chargeback versus still provisional.", "The key question is whether finance can trust the number enough to budget and report on it."],
      platform: ["This is the operating baseline for routing, ownership, and intervention prioritization.", "The goal is to see which parts of the stack are expensive, ambiguous, or ripe for optimization."],
      security: ["This is the governance posture of the AI estate before you drill into individual requests.", "The key question is whether usage is broad but still controlled."]
    },
    partner_brief: {
      executive: ["This is the design-partner ask in customer language.", "It turns the demo into a pilot plan with decision makers, scope, proof moments, success metrics, and next steps."],
      finance: ["This is how finance validates value quickly.", "The pilot centers on chargeback-ready spend, savings execution, and planning accuracy without waiting for production billing cycles."],
      platform: ["This is the technical onboarding path.", "Read-only integrations, synthetic replay, and scoped hot-path proof make the first customer environment concrete and low-risk."],
      security: ["This is the trust review package.", "The brief separates local proof from production deployment requirements and makes fail-open, read-only, and audit controls explicit."]
    },
    attribution: {
      executive: ["This is the proof surface behind one financial claim.", "It shows that a specific request can be tied back to an accountable owner with explainable evidence."],
      finance: ["This request-level view is what makes chargeback and audit defensible.", "It answers who pays, why they pay, and how much uncertainty remains in the ownership chain."],
      platform: ["This is the runtime evidence path from model invocation to final owner.", "It is where you see whether the attribution system is credible enough to drive automation."],
      security: ["This is where policy context and evidence quality meet.", "It shows whether a request can be governed confidently or needs human confirmation."]
    },
    requirements: {
      executive: ["This page ties the product story directly to the PRD and investor narrative.", "It shows that the demo is proving a system of record for AI consumption, not a disconnected feature tour."],
      finance: ["This page explains which workflows are decision-ready and which remain informational.", "It separates chargeback-ready outputs from provisional, estimated, allocated, or indirect evidence."],
      platform: ["This page is the implementation map for the local demo.", "It shows the pipeline, state machines, and visible surfaces that satisfy the engineering specification with deterministic dummy data."],
      security: ["This page preserves the trust-boundary claims while keeping the local demo honest.", "It shows fail-open, read-only, confidence caps, uncapturable disclosures, and human approval boundaries as explicit controls."]
    },
    interventions: {
      executive: ["This is the action queue that turns visibility into savings.", "The right question is not which card looks interesting, but which action changes run-rate fastest with the least business risk."],
      finance: ["Each recommendation has a baseline cost, projected savings, and forecast impact.", "This is where spend intelligence becomes operating prioritization."],
      platform: ["This queue shows which changes are practical to implement and what evidence supports them.", "It should read like an engineering action plan, not a dashboard ornament."],
      security: ["This is also a policy control surface, not just a savings list.", "Some interventions lower risk by constraining model choice, routing, or governance gaps."]
    },
    forecast: {
      executive: ["This page shows what happens if the company acts, not just what happened last month.", "The core question is how interventions and policy change the forward cost curve."],
      finance: ["Forecasting here is about planning confidence and downside control.", "The key value is understanding which drivers move spend and which of those drivers are already actionable."],
      platform: ["This is the planning surface for model mix, routing, and optimization execution.", "It connects interventions and ownership cleanup to the future spend curve."],
      security: ["This page quantifies how stronger controls affect cost and risk over time.", "It makes governance a planning variable instead of a compliance footnote."]
    },
    governance: {
      executive: ["This page answers the final buyer question: can the platform be deployed safely?", "It explains how decision-time governance works without turning the platform into an outage path."],
      finance: ["Governance matters here because policy drives both financial control and confidence in the spend number.", "This page shows the control posture behind the economics."],
      platform: ["This is the deployment model and policy simulator.", "The important question is how the same request behaves as you change mode or tighten bundle rules."],
      security: ["This is the trust surface: control enforcement, safety validation, and fail-open behavior.", "It shows the platform treats resilience as a first-class requirement."]
    },
    coverage: {
      executive: ["This page shows what the system can and cannot see.", "It preserves trust by making blind spots visible instead of implying complete coverage."],
      finance: ["Coverage quality determines which spend can support chargeback.", "The important distinction is fully capturable, partial, indirect, and unknown spend."],
      platform: ["This is the messy-enterprise operating surface.", "It shows provider asymmetry, missing context, agent lineage gaps, and the work needed to raise coverage."],
      security: ["Coverage is also a control map.", "Uncapturable and degraded pathways are explicitly excluded from unsafe enforcement."]
    },
    exports: {
      executive: ["This is where Argmin becomes finance-operational.", "It shows which outputs are trustworthy enough for monthly reporting and which remain caveated."],
      finance: ["This page separates ownership truth from allocation truth.", "It proves chargeback exports can be useful without hiding provisional, shared, or unknown states."],
      platform: ["Export readiness depends on event-time evidence and lineage.", "The surface shows what engineering has to fix before finance can trust a row."],
      security: ["Exports preserve evidence class and capture feasibility.", "Unsafe rows are excluded or routed to review rather than being flattened into clean totals."]
    },
    energy: {
      executive: ["Energy is a decision dimension, not a veto.", "This page makes environmental footprint visible while preserving the cost and quality context."],
      finance: ["Energy variance can change total operational cost.", "The useful view is which model shifts reduce both spend and footprint without overstating unknowns."],
      platform: ["This page keeps energy estimates tied to model, task, and request volume.", "Unknown models remain unrated instead of being treated as zero impact."],
      security: ["The same honesty rule applies here: unknown means unknown.", "Energy and carbon estimates stay advisory and never bypass approved governance policy."]
    },
    admin: {
      executive: ["This page shows the demo as an operable deployment, not only an analysis surface.", "It makes account control, diagnostic boundaries, and audit posture visible."],
      finance: ["Admin controls define who can mutate policy, overrides, and exports.", "The key question is whether finance-sensitive actions are role-bound and audited."],
      platform: ["This is the local approximation of customer deployment operations.", "It shows hot-path dependencies, read-only integrations, and scoped diagnostics."],
      security: ["This is the trust-boundary operating model.", "Diagnostics run inside the customer boundary, and access is role-scoped, time-limited, and auditable."]
    }
  };
  const selected = copy[pageKey]?.[lens] || copy[pageKey]?.executive || ["", ""];
  return { conclusion: selected[0] || "", why: selected[1] || "" };
}

function currentSelectedRequest() {
  return indexedLookup(datasetIndex.requestsById, state.selectedRequestId);
}

function isEntryHomeActive() {
  return state.page === "overview" && state.walkthroughStatus === "idle";
}

function preparedDemoRequestLabel() {
  const request = currentSelectedRequest() || (dataset.attribution_requests || [])[0] || null;
  const service = chainNode(request, "Service Attribution")?.value;
  return service || request?.id || "customer-copilot-prod";
}

function currentSelectedTeam() {
  return indexedLookup(datasetIndex.teamsById, state.selectedTeamId);
}

function currentSelectedModel() {
  if (state.selectedModelName) {
    const explicit = indexedLookup(datasetIndex.modelsByName, state.selectedModelName);
    if (explicit) {
      return explicit;
    }
  }
  const request = currentSelectedRequest();
  if (request) {
    return indexedLookup(datasetIndex.modelsByName, request.model);
  }
  const team = currentSelectedTeam();
  if (team && Array.isArray(team.top_models) && team.top_models.length) {
    return indexedLookup(datasetIndex.modelsByName, team.top_models[0]);
  }
  return null;
}

function currentSelectedIntervention() {
  return indexedLookup(datasetIndex.interventionsById, state.selectedInterventionId);
}

function filteredInterventions() {
  return getInterventions().filter((item) => {
    if (state.interventionFilter === "all") {
      return true;
    }
    return normalizeStatus(item.status) === state.interventionFilter;
  });
}

function syncSelectedInterventionForCurrentFilter() {
  if (state.page !== "interventions") {
    return;
  }
  const items = filteredInterventions();
  if (!items.length) {
    state.selectedInterventionId = null;
    return;
  }
  if (!items.some((item) => item.id === state.selectedInterventionId)) {
    state.selectedInterventionId = items[0].id;
  }
}

function selectedRequestTeamName(request = currentSelectedRequest()) {
  return chainNode(request, "Org Hierarchy")?.value || null;
}

function syncContextFromRequest(requestId) {
  const request = indexedLookup(datasetIndex.requestsById, requestId);
  if (!request) {
    return;
  }
  state.selectedRequestId = request.id;
  state.replayStageIndex = 0;
  state.selectedModelName = request.model || state.selectedModelName;
  const teamName = selectedRequestTeamName(request);
  if (teamName) {
    const team = indexedLookup(datasetIndex.teamsByName, teamName);
    if (team) {
      state.selectedTeamId = team.id;
    }
  }
}

function syncContextFromTeam(teamId) {
  const team = indexedLookup(datasetIndex.teamsById, teamId);
  if (!team) {
    return;
  }
  state.selectedTeamId = team.id;
  if (!state.selectedModelName && Array.isArray(team.top_models) && team.top_models.length) {
    state.selectedModelName = team.top_models[0];
  }
}

function syncContextFromModel(modelName) {
  const model = indexedLookup(datasetIndex.modelsByName, modelName);
  if (!model) {
    return;
  }
  state.selectedModelName = model.name;
}

function syncContextFromIntervention(interventionId) {
  const intervention = indexedLookup(datasetIndex.interventionsById, interventionId);
  if (!intervention) {
    return;
  }
  state.selectedInterventionId = intervention.id;
  const team = (dataset.teams || []).find((item) => item.name.toLowerCase().includes(String(intervention.team || "").toLowerCase()));
  if (team) {
    state.selectedTeamId = team.id;
  }
}

function glossaryEntry(term) {
  return indexedLookup(datasetIndex.glossaryByTerm, term);
}

function inlineDefinition(term, label = term) {
  const entry = glossaryEntry(term);
  if (!entry) {
    return `<span class="inline-term-fallback">${esc(label)}</span>`;
  }
  const detail = entry.why_it_matters
    ? `${entry.definition} Why it matters: ${entry.why_it_matters}`
    : entry.definition;
  return `
    <span class="inline-term" tabindex="0" aria-label="${esc(`${label}: ${detail}`)}">
      <span class="inline-term-label">${esc(label)}</span>
      <span class="inline-term-tooltip">${esc(detail)}</span>
    </span>
  `;
}

function sum(values, key) {
  return values.reduce((acc, item) => acc + Number(item[key] || 0), 0);
}

function riskPill(risk) {
  const value = String(risk || "medium").toLowerCase();
  if (value === "low") {
    return `<span class="pill pill-green">Low Risk</span>`;
  }
  if (value === "high") {
    return `<span class="pill pill-red">High Risk</span>`;
  }
  return `<span class="pill pill-amber">Medium Risk</span>`;
}

function confidencePill(confPct) {
  const conf = Number(confPct || 0);
  if (conf >= 92) {
    return `<span class="pill pill-green">Confidence ${conf.toFixed(0)}%</span>`;
  }
  if (conf >= 82) {
    return `<span class="pill pill-amber">Confidence ${conf.toFixed(0)}%</span>`;
  }
  return `<span class="pill pill-red">Confidence ${conf.toFixed(0)}%</span>`;
}

function statusPill(status) {
  const normalized = normalizeStatus(status);
  if (normalized === "recommended") {
    return `<span class="pill pill-blue">Recommended</span>`;
  }
  if (normalized === "review") {
    return `<span class="pill pill-amber">In Review</span>`;
  }
  if (normalized === "approved") {
    return `<span class="pill pill-green">Approved</span>`;
  }
  if (normalized === "implemented") {
    return `<span class="pill pill-green">Implemented</span>`;
  }
  return `<span class="pill pill-red">Dismissed</span>`;
}

function normalizeStatus(status) {
  const value = String(status || "recommended").toLowerCase();
  if (value === "in_review") {
    return "review";
  }
  if (value === "done") {
    return "implemented";
  }
  if (value === "reject") {
    return "dismissed";
  }
  return value;
}

function chartColors() {
  return [
    PALETTE.brand,
    PALETTE.success,
    PALETTE.warning,
    PALETTE.danger,
    PALETTE.neutral,
    PALETTE.brandStrong,
    PALETTE.successText,
    PALETTE.warningText
  ];
}

const CLEAN_CHART_COLOR_SEQUENCE = Object.freeze([
  "rgba(79, 142, 248, 0.62)",
  "rgba(42, 196, 135, 0.52)",
  "rgba(237, 168, 46, 0.5)",
  "rgba(120, 137, 168, 0.42)"
]);

const CLEAN_CHART_STROKE_SEQUENCE = Object.freeze([
  PALETTE.brand,
  PALETTE.success,
  PALETTE.warning,
  PALETTE.neutral
]);

function paletteChartColor(value, fallback = PALETTE.brand) {
  const normalized = String(value || "").trim().toLowerCase();
  const mapped = {
    "#4f8ef8": PALETTE.brand,
    "#2ac487": PALETTE.success,
    "#eda82e": PALETTE.warning,
    "#ee5858": PALETTE.danger,
    "#8ea0bf": PALETTE.neutral
  };
  return mapped[normalized] || fallback;
}

function renderChartSemantics(items) {
  return `
    <div class="chart-axis-note">
      ${items.map((item) => `
        <span><strong>${esc(item.label)}:</strong> ${esc(item.value)}</span>
      `).join("")}
    </div>
  `;
}

function renderCompactBreakdownRows(items, options = {}) {
  const {
    limit = 4,
    valueKey = "value",
    otherLabel = "Other",
    includeShare = false
  } = options;
  const rows = Array.isArray(items) ? items : [];
  const total = rows.reduce((sum, item) => sum + Number(item?.[valueKey] || 0), 0) || 1;
  const visible = rows.slice(0, limit);
  const remainder = rows.slice(limit);
  const markup = visible.map((item) => {
    const value = Number(item?.[valueKey] || 0);
    const share = includeShare ? ` | ${fmtPct((value / total) * 100)}` : "";
    return `
      <div class="breakdown-row">
        <span>${esc(item?.name || "Unknown")}</span>
        <strong>${fmtUSD(value)}${share}</strong>
      </div>
    `;
  });
  if (remainder.length) {
    const remainderValue = remainder.reduce((sum, item) => sum + Number(item?.[valueKey] || 0), 0);
    const share = includeShare ? ` | ${fmtPct((remainderValue / total) * 100)}` : "";
    markup.push(`
      <div class="breakdown-row">
        <span>${esc(otherLabel)}</span>
        <strong>${fmtUSD(remainderValue)}${share}</strong>
      </div>
    `);
  }
  return markup.join("");
}

function renderSectionNarrative(title, narrative, supporting, nextAction) {
  return `
    <div class="section-narrative">
      <div class="section-narrative-card">
        <div class="section-narrative-label">Conclusion</div>
        <div class="section-narrative-value">${esc(narrative.conclusion || "")}</div>
      </div>
      <div class="section-narrative-card">
        <div class="section-narrative-label">Why it matters</div>
        <div class="section-narrative-value">${esc(narrative.why || "")}</div>
      </div>
      <div class="section-narrative-card">
        <div class="section-narrative-label">Supporting evidence</div>
        <div class="section-narrative-value">${esc(supporting || "")}</div>
      </div>
      <div class="section-narrative-card">
        <div class="section-narrative-label">Next action</div>
        <div class="section-narrative-value">${esc(nextAction || "")}</div>
      </div>
    </div>
  `;
}

function cloneData(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function getApiBearerToken() {
  const metaToken = document.querySelector("meta[name='aci-api-token']")?.content;
  if (metaToken) {
    return metaToken;
  }
  if (typeof window.__ACI_API_TOKEN__ === "string" && window.__ACI_API_TOKEN__) {
    return window.__ACI_API_TOKEN__;
  }
  for (const key of API_TOKEN_STORAGE_KEYS) {
    try {
      const fromSession = window.sessionStorage.getItem(key);
      if (fromSession) {
        return fromSession;
      }
    } catch (error) {
      appendLog("warn", "Session token unavailable", summarizeApiError(error, "Browser session storage is unavailable for API token lookup."), null, { hidden: true });
    }
  }
  return "";
}

function safeSessionGet(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch (error) {
    appendLog("warn", "Session cache unavailable", summarizeApiError(error, "Browser session storage could not be read."), null, { hidden: true });
    return null;
  }
}

function safeSessionSet(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
    return true;
  } catch (error) {
    appendLog("warn", "Session cache", `Could not persist session state: ${String(error)}`, null, { hidden: true });
    return false;
  }
}

function safeSessionRemove(key) {
  try {
    window.sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    appendLog("warn", "Session cache", `Could not clear session state: ${String(error)}`, null, { hidden: true });
    return false;
  }
}

function clearDemoSessionStorage(options = {}) {
  const { includeAuthTokens = false } = options;
  const keys = [
    INTERVENTION_STORAGE_KEY,
    MANUAL_MAPPING_STORAGE_KEY,
    ...(includeAuthTokens ? API_TOKEN_STORAGE_KEYS : [])
  ];
  const cleared = new Set();
  for (const key of keys) {
    if (cleared.has(key)) {
      continue;
    }
    safeSessionRemove(key);
    cleared.add(key);
  }
}

function destroyCharts() {
  for (const chart of chartRegistry.values()) {
    chart.destroy();
  }
  chartRegistry.clear();
}

function captureFocusedInputState() {
  const active = document.activeElement;
  if (!(active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement)) {
    return null;
  }
  if (!active.dataset.actionInput && !active.id) {
    return null;
  }
  return {
    id: active.id || "",
    actionInput: active.dataset.actionInput || "",
    start: active.selectionStart,
    end: active.selectionEnd
  };
}

function restoreFocusedInputState(snapshot) {
  if (!snapshot) {
    return;
  }
  let target = null;
  if (snapshot.actionInput) {
    target = document.querySelector(`[data-action-input="${snapshot.actionInput}"]`);
  }
  if (!target && snapshot.id) {
    target = document.getElementById(snapshot.id);
  }
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
    return;
  }
  target.focus({ preventScroll: true });
  if (typeof snapshot.start === "number" && typeof snapshot.end === "number") {
    try {
      target.setSelectionRange(snapshot.start, snapshot.end);
    } catch (error) {
      appendLog("warn", "Focus restore skipped", summarizeApiError(error, "The active input could not restore its cursor position."), null, { hidden: true });
    }
  }
}

function executiveReadinessRows() {
  const overview = computeOverview();
  const mappings = manualMappingCounts();
  const interventions = getInterventions();
  const approvedSavings = interventions
    .filter((item) => normalizeStatus(item.status) === "approved")
    .reduce((sum, item) => sum + Number(item.monthly_savings_usd || 0), 0);
  const reviewQueue = mappings.needs_review + mappings.deferred;
  const requestCount = dataset.overview?.requests_30d || 0;

  return [
    {
      name: "Chargeback-ready spend",
      value: fmtUSD((overview.totalSpend * overview.coverage) / 100),
      detail: `${fmtPct(overview.coverage)} of AI spend is already attributed with enough confidence for financial reporting.`,
      status: overview.coverage >= 85 ? "green" : "amber"
    },
    {
      name: "Ownership review queue",
      value: fmtNumber(reviewQueue),
      detail: `${fmtNumber(requestCount)} requests were observed in the window; only the outliers still need manual confirmation.`,
      status: reviewQueue > 0 ? "amber" : "green"
    },
    {
      name: "Approved savings awaiting execution",
      value: fmtUSD(approvedSavings),
      detail: "These recommendations are already approved and become durable run-rate savings once the operating teams complete implementation.",
      status: approvedSavings > 0 ? "blue" : "green"
    }
  ];
}

function activeContextItems() {
  const persona = activeDemoPersona();
  const items = [
    { label: "Mode", value: modeLabel(state.mode) },
    { label: "Lens", value: roleLensLabel(state.roleLens) },
    { label: "Persona", value: persona.label }
  ];

  const selectedTeam = currentSelectedTeam();
  const selectedRequest = currentSelectedRequest();
  const selectedModel = currentSelectedModel();
  const selectedIntervention = currentSelectedIntervention();

  if (selectedTeam) {
    items.push({ label: "Team", value: selectedTeam.name });
  }
  if (selectedRequest) {
    items.push({ label: "Request", value: chainNode(selectedRequest, "Service Attribution")?.value || selectedRequest.id });
  }
  if (selectedModel) {
    items.push({ label: "Model", value: selectedModel.name });
  }
  if (selectedIntervention) {
    items.push({ label: "Intervention", value: selectedIntervention.title });
  }

  if (state.page === "overview") {
    items.push({ label: "Focus", value: "Spend posture and savings levers" });
  }

  items.push({ label: "Path", value: demoPathProgressLabel(state.page) });

  if (state.page === "partner_brief") {
    const stage = selectedPartnerStage();
    items.push({ label: "Brief", value: "Design partner pilot" });
    items.push({ label: "Stage", value: stage?.label || "Pilot path" });
  }

  if (state.page === "requirements") {
    const journey = selectedProofJourney();
    items.push({ label: "Source", value: "PRD + Engineering Spec + RAIL" });
    items.push({ label: "Journey", value: journey?.title || "All requirements" });
  }

  if (state.page === "adoption") {
    const dashboard = currentAdoptionDashboard();
    const scopeLabel = dashboard?.scope_label || "Organization";
    items.push({ label: "Scope", value: scopeLabel });
    items.push({ label: "Window", value: `${state.adoptionWindowDays} days` });
  }

  if (state.page === "attribution") {
    const request = selectedRequest || dataset.attribution_requests?.[0];
    if (request) {
      const service = chainNode(request, "Service Attribution")?.value || request.id;
      const team = chainNode(request, "Org Hierarchy")?.value || "Review required";
      items.push({ label: "Owner", value: team });
      items.push({ label: "Proof", value: "Replay and evidence quality" });
    }
  }

  if (state.page === "models") {
    const labels = {
      spend_usd: "Spend",
      requests: "Request volume",
      optimization_potential_usd: "Optimization potential"
    };
    items.push({ label: "Sorted by", value: labels[state.modelSort] || "Spend" });
  }

  if (state.page === "teams") {
    const team = selectedTeam;
    items.push({ label: "Scope", value: team ? team.name : "All teams" });
  }

  if (state.page === "manual_mapping") {
    const counts = manualMappingCounts();
    items.push({ label: "Queue", value: `${fmtNumber(counts.needs_review + counts.deferred)} open mappings` });
  }

  if (state.page === "interventions") {
    const count = interventionCounts();
    items.push({ label: "Open actions", value: fmtNumber(count.recommended + count.review) });
  }

  if (state.page === "governance") {
    items.push({ label: "Policy posture", value: "Fail-open with decision-time controls" });
  }

  if (state.page === "forecast") {
    const scenario = getForecastScenario();
    items.push({ label: "Scenario", value: scenario.label });
    items.push({ label: "Horizon", value: `${state.forecastHorizonMonths} months` });
  }

  if (state.page === "governance") {
    const request = indexedLookup(datasetIndex.requestsById, state.governanceSimulationRequestId) || selectedRequest;
    if (request) {
      items.push({ label: "Simulation request", value: request.id });
    }
  }

  if (state.page === "integrations") {
    items.push({ label: "Purpose", value: "Operational handoffs and executive reporting" });
  }

  return items;
}

function renderContextRibbon() {
  const root = document.getElementById("context-ribbon");
  if (!root) {
    return;
  }
  const entryHomeActive = isEntryHomeActive();
  root.classList.toggle("entry-context", entryHomeActive);
  if (entryHomeActive) {
    root.innerHTML = `
      <div class="entry-context-summary">
        <span>Preselected context</span>
        <strong>${esc(roleLensLabel())} lens / ${esc(activeDemoPersona().label)} persona / ${esc(modeLabel(state.mode))} mode</strong>
        <em>${esc(preparedDemoRequestLabel())} is loaded with deterministic NovaTech data.</em>
      </div>
    `;
    return;
  }
  const items = activeContextItems();
  root.innerHTML = items.map((item) => `
    <div class="context-chip">
      <span class="context-chip-label">${esc(item.label)}</span>
      <span class="context-chip-value">${esc(item.value)}</span>
    </div>
  `).join("");
}

function renderRoleRibbon() {
  const root = document.getElementById("role-ribbon");
  if (!root) {
    return;
  }
  const entryHomeActive = isEntryHomeActive();
  root.classList.toggle("entry-role", entryHomeActive);
  if (entryHomeActive) {
    root.innerHTML = `
      <div class="role-ribbon-copy">
        <div class="role-ribbon-title">Ready for first-time review</div>
        <div class="role-ribbon-detail">The demo opens with the enterprise buyer context already selected. No persona, mode, tenant, or data setup is required.</div>
      </div>
    `;
    return;
  }
  const persona = activeDemoPersona();
  root.innerHTML = `
    <div class="role-ribbon-copy">
      <div class="role-ribbon-title">Audience lens and persona</div>
      <div class="role-ribbon-detail">${esc(roleLensDescription())}</div>
      <div class="persona-current">
        <span>${esc(persona.name)}</span>
        <strong>${esc(persona.role)}</strong>
        <em>${fmtNumber((persona.allowedPages || []).length)} menus</em>
      </div>
      ${state.personaNotice ? `<div class="persona-notice">${esc(state.personaNotice.message)} ${state.personaNotice.detail ? esc(state.personaNotice.detail) : ""}</div>` : ""}
    </div>
    <div class="role-ribbon-controls">
      <div class="role-ribbon-actions" aria-label="Audience lens controls">
        ${ROLE_LENSES.map((item) => `
          <button class="lens-btn${state.roleLens === item.key ? " active" : ""}" data-action="set-role-lens" data-role-lens="${esc(item.key)}">
            ${esc(item.label)}
          </button>
        `).join("")}
      </div>
      <div class="role-ribbon-actions persona-actions" aria-label="Demo persona controls">
        ${DEMO_PERSONAS.map((item) => `
          <button class="lens-btn persona-btn${state.activePersonaKey === item.key ? " active" : ""}" data-action="set-demo-persona" data-persona-key="${esc(item.key)}" title="${esc(item.name)} | ${esc(item.description)}">
            ${esc(item.label)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderWalkthroughBanner() {
  const banner = document.getElementById("walkthrough-banner");
  if (!banner) {
    return;
  }

  const running = state.walkthroughStatus === "running";
  const completed = state.walkthroughStatus === "complete";
  if (!running && !completed) {
    banner.hidden = true;
    banner.innerHTML = "";
    return;
  }

  banner.hidden = false;
  const totalSteps = INVESTOR_WALKTHROUGH_STEPS.length;
  const stepLabel = running
    ? `Automated walkthrough • Step ${state.walkthroughStepIndex + 1} of ${totalSteps}`
    : "Automated walkthrough • Complete";
  const remainingSeconds = running ? Math.max(Math.ceil((state.walkthroughTotalMs - state.walkthroughElapsedMs) / 1000), 0) : 0;
  const buttonMarkup = running
    ? `
      <div class="walkthrough-banner-actions">
        <div class="hint">${remainingSeconds}s remaining</div>
        <button class="small-btn" data-action="stop-walkthrough">Stop</button>
      </div>
    `
    : `
      <div class="walkthrough-banner-actions">
        <button class="small-btn primary" data-action="start-walkthrough">Replay</button>
        <button class="small-btn" data-action="dismiss-walkthrough">Close</button>
      </div>
    `;

  banner.innerHTML = `
    <div class="walkthrough-banner-head">
      <div>
        <div class="walkthrough-banner-meta">${esc(stepLabel)}</div>
        <div class="walkthrough-banner-title">${esc(state.walkthroughStepTitle || "Full product walkthrough")}</div>
        <div class="walkthrough-banner-copy">${esc(state.walkthroughStepHeadline || "The demo is auto-progressing through the product story.")}</div>
      </div>
      ${buttonMarkup}
    </div>
    <div class="walkthrough-progress">
      <div class="walkthrough-progress-bar" style="width:${Math.max(0, Math.min(state.walkthroughProgressPct, 100)).toFixed(1)}%"></div>
    </div>
  `;
}

function renderPresenterConsole() {
  const consoleEl = document.getElementById("presenter-console");
  if (!consoleEl) {
    return;
  }
  const toggle = document.getElementById("presenter-mode-toggle");
  if (toggle instanceof HTMLButtonElement) {
    toggle.textContent = state.presenterMode ? "Presenter On" : "Presenter Mode";
    toggle.setAttribute("aria-pressed", state.presenterMode ? "true" : "false");
    toggle.classList.toggle("active", state.presenterMode);
  }
  if (!state.presenterMode) {
    consoleEl.hidden = true;
    consoleEl.innerHTML = "";
    return;
  }

  const steps = presenterAvailableSteps();
  state.presenterStepIndex = clampPresenterStepIndex(state.presenterStepIndex);
  const step = presenterCurrentStep();
  const current = state.presenterStepIndex + 1;
  const total = steps.length;
  const offScript = presenterIsOffScript();
  const dots = steps.map((item, index) => `
    <button class="presenter-step-dot${index === state.presenterStepIndex ? " active" : ""}${state.page === item.page ? " current-page" : ""}" data-action="presenter-step" data-step-index="${index}" aria-label="Go to presenter step ${index + 1}: ${esc(item.title)}">
      <span>${String(index + 1).padStart(2, "0")}</span>
    </button>
  `).join("");
  const recoveryMarkup = offScript
    ? `<div class="presenter-recovery warn">Off script: current page is ${esc(PAGE_TITLES[state.page] || state.page)}. Return to the highlighted step before continuing.</div>`
    : state.presenterRecoveryNotice
      ? `<div class="presenter-recovery ok">${esc(state.presenterRecoveryNotice)}</div>`
      : `<div class="presenter-recovery">Script ready. The highlighted region is the current talk track.</div>`;

  consoleEl.hidden = false;
  consoleEl.classList.toggle("off-script", offScript);
  consoleEl.innerHTML = `
    <div class="presenter-console-main">
      <div class="presenter-console-copy">
        <div class="presenter-kicker">Presenter mode - Step ${current} of ${total}</div>
        <div class="presenter-title">${esc(step?.title || "Presenter path")}</div>
        <div class="presenter-detail">${esc(step?.headline || "Use the controls to keep the local demo on script.")}</div>
        ${recoveryMarkup}
      </div>
      <div class="presenter-controls" aria-label="Presenter controls">
        <button class="small-btn" data-action="presenter-prev" ${current <= 1 ? "disabled" : ""}>Previous</button>
        <button class="small-btn primary" data-action="presenter-next" ${current >= total ? "disabled" : ""}>Next</button>
        <button class="small-btn" data-action="presenter-recover">${offScript ? "Return To Step" : "Recover Step"}</button>
        <button class="small-btn" data-action="clear-logs">Reset Demo</button>
        <button class="small-btn" data-action="toggle-presenter-mode">Close</button>
      </div>
    </div>
    <div class="presenter-step-row" aria-label="Presenter step indicators">${dots}</div>
    <div class="presenter-shortcuts" aria-label="Presenter shortcuts">
      <span>P toggle</span>
      <span>Left/Right step</span>
      <span>R recover</span>
      <span>Shift+R reset</span>
    </div>
  `;
}

function applyWalkthroughHighlight() {
  const allTargets = Array.from(document.querySelectorAll("[data-walkthrough-anchor]"));
  for (const target of allTargets) {
    target.classList.remove("walkthrough-highlight");
  }
  const anchor = activeWalkthroughAnchor();
  if (!anchor) {
    return;
  }
  const activeTarget = document.querySelector(`[data-walkthrough-anchor="${anchor}"]`);
  if (activeTarget instanceof HTMLElement) {
    activeTarget.classList.add("walkthrough-highlight");
  }
}

function resetWalkthroughState() {
  state.walkthroughStatus = "idle";
  state.walkthroughStepIndex = -1;
  state.walkthroughStepTitle = "";
  state.walkthroughStepHeadline = "";
  state.walkthroughProgressPct = 0;
  state.walkthroughElapsedMs = 0;
  state.walkthroughTotalMs = 0;
  state.walkthroughAnchor = "";
}

function completeWalkthroughState() {
  state.walkthroughStatus = "complete";
  state.walkthroughStepIndex = INVESTOR_WALKTHROUGH_STEPS.length - 1;
  state.walkthroughStepTitle = "Walkthrough complete";
  state.walkthroughStepHeadline = "The product story has been auto-played end to end. Use the sidebar to go deeper on any surface or replay the walkthrough for the next audience.";
  state.walkthroughProgressPct = 100;
  state.walkthroughElapsedMs = state.walkthroughTotalMs;
  state.walkthroughAnchor = "";
}

function presenterAvailableSteps(persona = activeDemoPersona()) {
  const steps = INVESTOR_WALKTHROUGH_STEPS.filter((step) => personaCanAccessPage(step.page, persona));
  return steps.length ? steps : [INVESTOR_WALKTHROUGH_STEPS[0]].filter(Boolean);
}

function clampPresenterStepIndex(index = state.presenterStepIndex) {
  const steps = presenterAvailableSteps();
  return Math.max(0, Math.min(Number(index) || 0, Math.max(steps.length - 1, 0)));
}

function presenterCurrentStep() {
  const steps = presenterAvailableSteps();
  state.presenterStepIndex = clampPresenterStepIndex(state.presenterStepIndex);
  return steps[state.presenterStepIndex] || steps[0] || null;
}

function presenterStepIndexForPage(pageKey = state.page) {
  return presenterAvailableSteps().findIndex((step) => step.page === pageKey);
}

function syncPresenterStepFromPage(pageKey = state.page) {
  const index = presenterStepIndexForPage(pageKey);
  if (index >= 0) {
    state.presenterStepIndex = index;
  }
}

function presenterIsOffScript() {
  const step = presenterCurrentStep();
  return Boolean(state.presenterMode && step && state.page !== step.page);
}

function setPresenterMode(enabled) {
  state.presenterMode = Boolean(enabled);
  state.presenterRecoveryNotice = "";
  if (state.presenterMode) {
    syncPresenterStepFromPage();
    state.modeMenuOpen = false;
    state.mobileNavOpen = false;
    setExecutionDrawer(false);
    showToast("Presenter Mode On", "Use the presenter rail to move through the script or recover the current step.");
  } else {
    showToast("Presenter Mode Off", "The standard demo controls remain available.");
  }
  render();
}

async function preparePresenterStep(step, options = {}) {
  if (!step) {
    return;
  }
  state.modeMenuOpen = false;
  state.mobileNavOpen = false;
  state.executionDrawerOpen = false;
  setExecutionDrawer(false);
  setMobileNav(false);
  hideToast();
  if (!personaCanAccessPage(step.page, activeDemoPersona())) {
    state.activePersonaKey = "admin";
  }
  switch (step.key) {
    case "partner-brief":
      state.selectedPartnerStage = "prove";
      break;
    case "requirements-proof":
      state.selectedProofJourney = "trust";
      break;
    case "adoption":
      state.adoptionWindowDays = 30;
      applyAdoptionHierarchy(state.adoptionHierarchy || fallbackAdoptionHierarchy(), { preserveSelection: true });
      break;
    case "request-proof":
      state.selectedRequestId = dataset.attribution_requests?.[0]?.id || state.selectedRequestId;
      break;
    case "exports":
      state.exportViewMode = "event_time";
      break;
    case "interventions":
      state.interventionFilter = "recommended";
      break;
    case "forecast":
      state.forecastScenarioKey = "optimization_capture";
      state.forecastHorizonMonths = 12;
      if (!state.forecastResult && options.ensureForecast !== false) {
        await resetForecastPlanner({ log: false, toast: false });
      }
      break;
    case "governance":
      state.governanceSimulationMode = state.mode || "advisory";
      state.governanceSimulationRequestId = dataset.attribution_requests?.[0]?.id || state.governanceSimulationRequestId;
      break;
    default:
      break;
  }
  go(step.page);
}

async function goToPresenterStep(index, options = {}) {
  if (state.walkthroughStatus === "running") {
    stopInvestorWalkthrough();
  }
  state.presenterMode = true;
  state.presenterStepIndex = clampPresenterStepIndex(index);
  const step = presenterCurrentStep();
  state.presenterRecoveryNotice = options.recovery
    ? `Recovered to ${step?.title || "the current presenter step"}.`
    : "";
  await preparePresenterStep(step, options);
  render();
}

async function recoverPresenterStep() {
  await goToPresenterStep(state.presenterStepIndex, { recovery: true, ensureForecast: true });
}

function activeWalkthroughAnchor() {
  if (state.walkthroughStatus === "running" && state.walkthroughAnchor) {
    return state.walkthroughAnchor;
  }
  if (state.presenterMode) {
    return presenterCurrentStep()?.anchor || "";
  }
  return state.walkthroughAnchor || "";
}

async function waitForWalkthroughStep(durationMs, runId, stepIndex) {
  const completedMs = INVESTOR_WALKTHROUGH_STEPS
    .slice(0, stepIndex)
    .reduce((sum, step) => sum + step.durationMs, 0);
  const started = performance.now();
  return new Promise((resolve) => {
    const tick = () => {
      if (runId !== investorWalkthroughRunId || state.walkthroughStatus !== "running") {
        resolve(false);
        return;
      }
      const elapsed = Math.min(performance.now() - started, durationMs);
      state.walkthroughElapsedMs = completedMs + elapsed;
      state.walkthroughProgressPct = (state.walkthroughElapsedMs / state.walkthroughTotalMs) * 100;
      renderWalkthroughBanner();
      if (elapsed >= durationMs) {
        resolve(true);
        return;
      }
      window.setTimeout(tick, 250);
    };
    tick();
  });
}

function cleanChartColor(index, alpha = 0.62) {
  const color = CLEAN_CHART_COLOR_SEQUENCE[index % CLEAN_CHART_COLOR_SEQUENCE.length];
  if (alpha === 0.62) {
    return color;
  }
  return color.replace(/0\.\d+\)$/, `${alpha})`);
}

function cleanChartStroke(index) {
  return CLEAN_CHART_STROKE_SEQUENCE[index % CLEAN_CHART_STROKE_SEQUENCE.length];
}

function cleanChartScale(scale = {}) {
  const grid = scale.grid || {};
  const ticks = scale.ticks || {};
  return {
    ...scale,
    border: {
      ...(scale.border || {}),
      display: false
    },
    grid: {
      ...grid,
      display: grid.display === false ? false : true,
      color: grid.display === false ? "transparent" : "rgba(120, 137, 168, 0.12)",
      drawTicks: false,
      lineWidth: 1
    },
    title: {
      ...(scale.title || {}),
      display: false
    },
    ticks: {
      ...ticks,
      color: "#96a7c2",
      maxTicksLimit: ticks.maxTicksLimit || 6,
      padding: ticks.padding || 8,
      font: {
        ...(ticks.font || {}),
        size: 10,
        weight: 500
      }
    }
  };
}

function cleanChartDataset(dataset = {}, index = 0, chartType = "bar", datasetCount = 1) {
  const type = dataset.type || chartType;
  if (type === "line") {
    const stroke = cleanChartStroke(index);
    return {
      ...dataset,
      borderColor: dataset.borderColor || stroke,
      backgroundColor: dataset.fill ? cleanChartColor(index, 0.1) : "rgba(0, 0, 0, 0)",
      borderWidth: Math.min(Number(dataset.borderWidth || 2.5), 3),
      pointRadius: Math.min(Number(dataset.pointRadius ?? 1.5), 2),
      pointHoverRadius: 4,
      tension: Number.isFinite(Number(dataset.tension)) ? Number(dataset.tension) : 0.28
    };
  }
  return {
    ...dataset,
    backgroundColor: cleanChartColor(index, datasetCount === 1 ? 0.58 : 0.48),
    borderColor: dataset.borderColor || cleanChartStroke(index),
    borderWidth: Math.min(Number(dataset.borderWidth || 1), 1),
    borderSkipped: false,
    borderRadius: Math.min(Number(dataset.borderRadius || 6), 8),
    barPercentage: Math.min(Number(dataset.barPercentage || 0.66), 0.7),
    categoryPercentage: Math.min(Number(dataset.categoryPercentage || 0.72), 0.78)
  };
}

function cleanChartOptions(options = {}, config = {}) {
  const datasets = Array.isArray(config.data?.datasets) ? config.data.datasets : [];
  const scales = options.scales || {};
  const normalizedScales = {};
  const scaleEntries = Object.entries(scales).length ? Object.entries(scales) : [["x", {}], ["y", {}]];
  for (const [key, scale] of scaleEntries) {
    normalizedScales[key] = cleanChartScale(scale);
  }
  const plugins = options.plugins || {};
  const tooltip = plugins.tooltip || {};
  const legend = plugins.legend || {};
  return {
    ...options,
    animation: {
      duration: 420,
      easing: "easeOutQuart",
      ...(options.animation || {})
    },
    layout: {
      padding: {
        top: 4,
        right: 8,
        bottom: 0,
        left: 2
      },
      ...(options.layout || {})
    },
    interaction: {
      mode: "nearest",
      intersect: false,
      ...(options.interaction || {})
    },
    plugins: {
      ...plugins,
      legend: {
        ...legend,
        display: datasets.length > 1,
        position: legend.position || "bottom",
        labels: {
          color: "#a8b8d4",
          boxWidth: 10,
          boxHeight: 2,
          padding: 12,
          usePointStyle: true,
          pointStyle: "line",
          font: { size: 10, weight: 500 },
          ...(legend.labels || {})
        }
      },
      tooltip: {
        ...tooltip,
        backgroundColor: "#101927",
        borderColor: "rgba(120, 137, 168, 0.28)",
        borderWidth: 1,
        titleColor: "#e8eef8",
        bodyColor: "#d9e6fb",
        displayColors: datasets.length > 1,
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: normalizedScales
  };
}

function cleanChartConfig(config = {}) {
  const datasets = Array.isArray(config.data?.datasets) ? config.data.datasets : [];
  return {
    ...config,
    data: {
      ...(config.data || {}),
      datasets: datasets.map((dataset, index) => (
        cleanChartDataset(dataset, index, config.type || "bar", datasets.length)
      ))
    },
    options: cleanChartOptions(config.options || {}, config)
  };
}

function createChart(canvasId, config, options = {}) {
  const el = document.getElementById(canvasId);
  if (!el || typeof Chart === "undefined") {
    return;
  }
  const cleanConfig = cleanChartConfig(config);
  const existing = chartRegistry.get(canvasId);
  if (existing) {
    if (existing.canvas === el && existing.config.type === cleanConfig.type) {
      if (options.ariaLabel) {
        el.setAttribute("role", "img");
        el.setAttribute("aria-label", options.ariaLabel);
      }
      existing.data = cleanConfig.data;
      existing.options = cleanConfig.options || existing.options;
      existing.update();
      normalizeDataVisualContracts(el.parentElement || document);
      return;
    }
    existing.destroy();
    chartRegistry.delete(canvasId);
  }
  if (options.ariaLabel) {
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", options.ariaLabel);
  }
  const chart = new Chart(el, cleanConfig);
  chartRegistry.set(canvasId, chart);
  normalizeDataVisualContracts(el.parentElement || document);
}

function getInterventions() {
  return dataset.interventions || [];
}

function interventionCounts() {
  const counts = {
    recommended: 0,
    review: 0,
    approved: 0,
    implemented: 0,
    dismissed: 0
  };
  for (const item of getInterventions()) {
    const status = normalizeStatus(item.status);
    counts[status] = (counts[status] || 0) + 1;
  }
  return counts;
}

function getManualMappings() {
  return dataset.manual_mapping || [];
}

function normalizeManualMappingStatus(status) {
  const value = String(status || "needs_review").toLowerCase();
  if (value === "confirmed" || value === "reassigned" || value === "deferred") {
    return value;
  }
  return "needs_review";
}

function manualMappingCounts() {
  const counts = {
    needs_review: 0,
    confirmed: 0,
    reassigned: 0,
    deferred: 0
  };
  for (const item of getManualMappings()) {
    const status = normalizeManualMappingStatus(item.status);
    counts[status] = (counts[status] || 0) + 1;
  }
  return counts;
}

function manualMappingResolvedSpend() {
  return getManualMappings().reduce((acc, item) => {
    const status = normalizeManualMappingStatus(item.status);
    if (status === "confirmed") {
      return acc + Number(item.spend_at_risk_usd || 0);
    }
    if (status === "reassigned") {
      return acc + Number(item.spend_at_risk_usd || 0);
    }
    return acc;
  }, 0);
}

function manualMappingCoverageLiftPct(totalSpendUsd) {
  if (!totalSpendUsd) {
    return 0;
  }
  return (manualMappingResolvedSpend() / totalSpendUsd) * 100;
}

function adoptionCacheKey(scopeType, scopeId, windowDays = state.adoptionWindowDays) {
  return `${scopeType}:${scopeId || "default"}:${windowDays}`;
}

function fallbackAdoptionHierarchy() {
  return dataset.adoption?.hierarchy || null;
}

function cacheAdoptionDashboard(dashboard) {
  if (!dashboard?.scope_type || !dashboard?.scope_id) {
    return;
  }
  state.adoptionDashboardCache[adoptionCacheKey(
    dashboard.scope_type,
    dashboard.scope_id,
    dashboard.window_days || state.adoptionWindowDays
  )] = dashboard;
}

function currentAdoptionDashboard() {
  const hierarchy = state.adoptionHierarchy || fallbackAdoptionHierarchy();
  const scopeType = state.adoptionScopeType || hierarchy?.default_scope_type || "organization";
  const scopeId = state.adoptionScopeId || hierarchy?.default_scope_id || null;
  if (!scopeId) {
    return null;
  }
  const cacheKey = adoptionCacheKey(scopeType, scopeId, state.adoptionWindowDays);
  if (state.adoptionDashboardCache[cacheKey]) {
    return state.adoptionDashboardCache[cacheKey];
  }

  const fallbackDashboards = dataset.adoption?.dashboards || {};
  return fallbackDashboards[cacheKey] || null;
}

function currentAdoptionSummary() {
  return currentAdoptionDashboard()?.summary || null;
}

function applyAdoptionHierarchy(hierarchy, options = {}) {
  const preserveSelection = Boolean(options.preserveSelection);
  state.adoptionHierarchy = hierarchy || null;
  if (!hierarchy) {
    state.adoptionScopeType = "organization";
    state.adoptionScopeId = null;
    return;
  }
  if (!preserveSelection || !state.adoptionScopeId) {
    state.adoptionScopeType = hierarchy.default_scope_type || "organization";
    state.adoptionScopeId = hierarchy.default_scope_id || hierarchy.organization?.organization_id || null;
  }
}

async function syncAdoptionFromApi(options = {}) {
  const preserveSelection = Boolean(options.preserveSelection);
  const force = Boolean(options.force);
  const shouldRender = Boolean(options.render !== false);
  state.adoptionLoading = true;
  if (shouldRender && state.page === "adoption") {
    render();
  }

  try {
    const hierarchy = await apiRequest("GET", "/v1/adoption/hierarchy");
    applyAdoptionHierarchy(hierarchy, { preserveSelection });
    const scopeType = state.adoptionScopeType || hierarchy.default_scope_type || "organization";
    const scopeId = state.adoptionScopeId || hierarchy.default_scope_id;
    const cacheKey = adoptionCacheKey(scopeType, scopeId, state.adoptionWindowDays);
    if (!force && state.adoptionDashboardCache[cacheKey]) {
      return;
    }
    const params = new URLSearchParams({
      scope: scopeType,
      window_days: String(state.adoptionWindowDays)
    });
    if (scopeId) {
      params.set("scope_id", scopeId);
    }
    const dashboard = await apiRequest("GET", `/v1/adoption/dashboard?${params.toString()}`);
    cacheAdoptionDashboard(dashboard);
  } catch (error) {
    applyAdoptionHierarchy(fallbackAdoptionHierarchy(), { preserveSelection });
    appendLog(
      "warn",
      "Adoption data fallback",
      summarizeApiError(error, "Employee adoption analytics are using local fallback data."),
      null,
      { hidden: true }
    );
  } finally {
    state.adoptionLoading = false;
    if (shouldRender) {
      render();
    }
  }
}

function setAdoptionScope(scopeType, scopeId) {
  state.adoptionScopeType = scopeType;
  state.adoptionScopeId = scopeId;
  if (currentAdoptionDashboard()) {
    render();
    return;
  }
  void syncAdoptionFromApi({ preserveSelection: true });
}

function setAdoptionWindow(windowDays) {
  state.adoptionWindowDays = windowDays;
  const dashboard = currentAdoptionDashboard();
  if (
    dashboard
    && dashboard.window_days === windowDays
    && dashboard.scope_type === state.adoptionScopeType
    && dashboard.scope_id === state.adoptionScopeId
  ) {
    render();
    return;
  }
  void syncAdoptionFromApi({ preserveSelection: true });
}

function fallbackIntegrationOverview() {
  return dataset.integrations || FALLBACK_INTEGRATION_OVERVIEW;
}

function currentIntegrationOverview() {
  return state.integrationOverview || fallbackIntegrationOverview();
}

function mergeRecordsByKey(primary = [], fallback = [], key) {
  const merged = new Map();
  for (const item of fallback || []) {
    if (item && item[key]) {
      merged.set(item[key], item);
    }
  }
  for (const item of primary || []) {
    if (item && item[key]) {
      merged.set(item[key], item);
    }
  }
  return Array.from(merged.values());
}

function mergedIntegrationOverview(overview) {
  const fallback = fallbackIntegrationOverview();
  if (!overview) {
    return fallback;
  }
  const sources = mergeRecordsByKey(overview.sources, fallback.sources, "integration_id");
  const routes = mergeRecordsByKey(overview.routes, fallback.routes, "route_id");
  const scenarios = mergeRecordsByKey(overview.scenarios, fallback.scenarios, "scenario_id");
  const recentDeliveries = mergeRecordsByKey(
    overview.recent_deliveries,
    fallback.recent_deliveries,
    "delivery_id"
  ).slice(0, UI_LIMITS.maxIntegrationDeliveries);
  const summary = {
    ...(fallback.summary || {}),
    ...(overview.summary || {}),
    inbound_source_count: sources.filter((item) => item.direction === "inbound").length,
    outbound_route_count: routes.length,
    scenario_count: scenarios.length,
    configured_destination_count: new Set(
      routes.flatMap((route) => (route.channels || []).map((channel) => channel.target))
    ).size,
    recent_delivery_count: recentDeliveries.length,
    failed_deliveries: recentDeliveries.filter((item) => item.status === "failed").length,
    success_rate_pct: recentDeliveries.length
      ? Number(((recentDeliveries.filter((item) => ["simulated", "sent"].includes(item.status)).length / recentDeliveries.length) * 100).toFixed(1))
      : 100,
    live_delivery_mode: overview.summary?.live_delivery_mode || fallback.summary?.live_delivery_mode || "simulated",
    last_delivery_at: recentDeliveries
      .map((item) => item.sent_at || "")
      .filter(Boolean)
      .sort()
      .at(-1) || ""
  };
  return { ...fallback, ...overview, summary, sources, routes, scenarios, recent_deliveries: recentDeliveries };
}

function integrationRouteForScenario(scenario) {
  const overview = currentIntegrationOverview();
  return (overview?.routes || []).find((item) => item.route_id === scenario?.route_id) || null;
}

function localIntegrationDeliveryForScenario(scenario) {
  const route = integrationRouteForScenario(scenario);
  const primaryChannel = route?.channels?.[0] || {};
  const existing = state.integrationDeliveries?.length
    ? state.integrationDeliveries
    : (currentIntegrationOverview()?.recent_deliveries || []);
  const newestTimestamp = existing
    .map((item) => Date.parse(item.sent_at || ""))
    .filter((timestamp) => Number.isFinite(timestamp))
    .sort((a, b) => b - a)[0];
  const sentAt = new Date((newestTimestamp || Date.UTC(2026, 1, 28, 17, 0, 0)) + 60000).toISOString();
  const sequence = existing.length + 1;
  return {
    delivery_id: `local-delivery-${scenario.scenario_id}-${sequence}`,
    channel: primaryChannel.channel || "local",
    target: primaryChannel.target || "local://demo-handoff",
    status: "simulated",
    message: "delivery simulated from deterministic local demo data",
    sent_at: sentAt,
    event_type: scenario.event_type || String(scenario.scenario_id || "integration").replaceAll("-", "_"),
    severity: scenario.severity || (String(scenario.scenario_id || "").includes("breach") ? "warning" : "info"),
    route_id: route?.route_id || scenario.route_id || "local-demo-route",
    route_name: route?.name || scenario.title || "Local Demo Route",
    workflow_name: route?.workflow_name || "Local Demo Workflow",
    audience: route?.owner || "Demo owner",
    business_outcome: route?.business_outcome || scenario.expected_outcome || "Local handoff recorded for the presenter.",
    scenario_id: scenario.scenario_id
  };
}

function applyLocalIntegrationScenario(scenario) {
  const delivery = localIntegrationDeliveryForScenario(scenario);
  const overview = currentIntegrationOverview();
  const existing = state.integrationDeliveries?.length
    ? state.integrationDeliveries
    : (overview?.recent_deliveries || []);
  state.integrationDeliveries = [delivery, ...existing].slice(0, UI_LIMITS.maxIntegrationDeliveries);
  if (overview?.summary) {
    overview.summary.recent_delivery_count = state.integrationDeliveries.length;
    overview.summary.failed_deliveries = state.integrationDeliveries.filter((item) => item.status === "failed").length;
    const successful = state.integrationDeliveries.filter((item) => ["simulated", "sent"].includes(item.status)).length;
    overview.summary.success_rate_pct = state.integrationDeliveries.length
      ? Number(((successful / state.integrationDeliveries.length) * 100).toFixed(1))
      : 100;
    overview.summary.last_delivery_at = delivery.sent_at;
  }
  state.integrationOverview = overview;
  return delivery;
}

async function syncIntegrationsFromApi(options = {}) {
  const force = Boolean(options.force);
  const shouldRender = Boolean(options.render !== false);
  if (state.integrationLoading && !force) {
    return;
  }

  state.integrationLoading = true;
  if (shouldRender && state.page === "integrations") {
    render();
  }

  try {
    const overview = await apiRequest("GET", "/v1/integrations/overview?limit=12");
    state.integrationOverview = mergedIntegrationOverview(overview);
    state.integrationDeliveries = Array.isArray(state.integrationOverview?.recent_deliveries)
      ? state.integrationOverview.recent_deliveries
      : [];
  } catch (error) {
    state.integrationOverview = fallbackIntegrationOverview();
    state.integrationDeliveries = Array.isArray(state.integrationOverview?.recent_deliveries)
      ? state.integrationOverview.recent_deliveries
      : [];
    appendLog(
      "warn",
      "Integration data fallback",
      summarizeApiError(error, "Operational integration data is using local fallback content."),
      null,
      { hidden: true }
    );
  } finally {
    state.integrationLoading = false;
    if (shouldRender) {
      render();
    }
  }
}

async function runIntegrationScenario(scenarioId) {
  const overview = currentIntegrationOverview();
  const scenario = (overview?.scenarios || []).find((item) => item.scenario_id === scenarioId);
  if (!scenario) {
    return;
  }

  if (state.runtimeStatus !== "online") {
    const delivery = applyLocalIntegrationScenario(scenario);
    appendLog(
      "ok",
      "Local integration handoff",
      `${scenario.title} added a ${delivery.channel} handoff from deterministic local demo data.`,
      null,
      { hidden: true }
    );
    showToast(
      "Integration Workflow Simulated",
      `${scenario.title} updated Recent Handoffs using local demo data.`
    );
    render();
    return;
  }

  state.integrationLoading = true;
  render();
  try {
    const response = await apiRequest(
      "POST",
      `/v1/integrations/scenarios/${encodeURIComponent(scenarioId)}/dispatch`,
      {}
    );
    await syncIntegrationsFromApi({ force: true, render: false });
    appendLog(
      "ok",
      "Integration handoff",
      `${response.scenario_title} generated ${response.deliveries?.length || 0} delivery records.`,
      null,
      { hidden: true }
    );
    showToast(
      "Integration Workflow Executed",
      `${response.scenario_title} completed via ${response.route_name}.`
    );
  } catch (error) {
    const fallbackMessage = summarizeApiError(
      error,
      "Live integration scenario dispatch failed; using deterministic local handoff data."
    );
    const delivery = applyLocalIntegrationScenario(scenario);
    setRecoveryNotice({
      severity: "warn",
      title: "Integration fallback active",
      message: "The live integration dispatch was unavailable, so the demo used a deterministic local handoff.",
      detail: fallbackMessage,
      source: "integrations"
    });
    appendLog(
      "warn",
      "Local integration handoff",
      `${scenario.title} added a ${delivery.channel} handoff from deterministic local demo data.`,
      null,
      { why: "The UI shows the fallback instead of silently dropping the failed dispatch." }
    );
    showToast(
      "Integration Workflow Simulated",
      `${scenario.title} updated Recent Handoffs using local demo data.`
    );
  } finally {
    state.integrationLoading = false;
    render();
  }
}

function manualMappingStatusPill(status) {
  const normalized = normalizeManualMappingStatus(status);
  if (normalized === "confirmed") {
    return `<span class="pill pill-green">Confirmed</span>`;
  }
  if (normalized === "reassigned") {
    return `<span class="pill pill-blue">Reassigned</span>`;
  }
  if (normalized === "deferred") {
    return `<span class="pill pill-amber">Needs More Evidence</span>`;
  }
  return `<span class="pill pill-amber">Needs Review</span>`;
}

function computeOverview() {
  const teams = dataset.teams || [];
  const interventions = getInterventions();
  const totalSpend = sum(teams, "spend_usd");
  const captured = interventions
    .filter((x) => ["approved", "implemented"].includes(normalizeStatus(x.status)))
    .reduce((acc, x) => acc + Number(x.savings_usd_month || 0), 0);
  const remaining = interventions
    .filter((x) => ["recommended", "review"].includes(normalizeStatus(x.status)))
    .reduce((acc, x) => acc + Number(x.savings_usd_month || 0), 0);

  const totalPotential = captured + remaining;
  const baselineCoverage = Number(dataset.overview?.attribution_coverage_pct || 0);
  const baselineCoveredSpend = totalSpend * (baselineCoverage / 100);
  const resolvedSpend = manualMappingResolvedSpend();
  return {
    totalSpend,
    totalPotential,
    remaining,
    captured,
    coverage: Math.min(
      ((baselineCoveredSpend + resolvedSpend) / Math.max(totalSpend, 1)) * 100,
      BUSINESS_RULES.attributionCoverageCapPct
    )
  };
}

function providerBreakdown() {
  const rows = {};
  for (const model of dataset.models || []) {
    const key = model.provider || "Unknown";
    rows[key] = (rows[key] || 0) + Number(model.spend_usd || 0);
  }
  return Object.entries(rows)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function sortedModels() {
  return [...(dataset.models || [])]
    .sort((a, b) => Number(b[state.modelSort] || 0) - Number(a[state.modelSort] || 0));
}

function renderModelTableRows(models = sortedModels()) {
  return models.map((model) => {
    const trend = Number(model.trend_pct || 0);
    const trendColor = trend >= 0 ? "var(--amber)" : "var(--green)";
    return `
      <tr class="clickable" data-action="select-model" data-model-name="${esc(model.name)}">
        <td class="mono" style="color:var(--text)">${esc(model.name)}</td>
        <td>${esc(model.provider)}</td>
        <td style="color:var(--text)">${fmtUSD(model.spend_usd)}</td>
        <td>${fmtNumber(model.requests)}</td>
        <td>${fmtNumber(model.latency_p95_ms)} ms</td>
        <td>${esc(model.cost_variance || "N/A")}</td>
        <td>${fmtNumber(model.teams)}</td>
        <td style="color:${trendColor}">${fmtPct(trend)}</td>
        <td style="color:var(--amber)">${fmtUSD(model.optimization_potential_usd)}</td>
      </tr>
    `;
  }).join("");
}

function renderModelChartSemantics() {
  return renderChartSemantics([
    { label: "Y-axis", value: "Model family" },
    {
      label: "X-axis",
      value: state.modelSort === "requests"
        ? "Request volume"
        : state.modelSort === "optimization_potential_usd"
          ? "Monthly savings headroom in USD"
          : "Monthly spend in USD"
    }
  ]);
}

function refreshModelsPageInPlace() {
  if (state.page !== "models") {
    return false;
  }
  const tableBody = document.getElementById("models-table-body");
  const chartSemantics = document.getElementById("models-chart-semantics");
  const chartCanvas = document.getElementById("chart-models");
  if (!tableBody || !chartSemantics || !chartCanvas) {
    return false;
  }
  for (const button of document.querySelectorAll('[data-action="set-model-sort"]')) {
    button.classList.toggle("active", button.dataset.sort === state.modelSort);
  }
  tableBody.innerHTML = renderModelTableRows();
  chartSemantics.innerHTML = renderModelChartSemantics();
  renderModelChart();
  renderContextRibbon();
  normalizeInteractionContracts(document);
  return true;
}

function enterpriseModelLandscape() {
  return dataset.enterprise_model_landscape || [];
}

function enterpriseMarketSignals() {
  return dataset.enterprise_market_signals || [];
}

function enterpriseAIPlatforms() {
  return dataset.enterprise_ai_platforms || [];
}

function enterpriseAIStack() {
  return dataset.enterprise_ai_stack || [];
}

function interventionImplementationEffort(item) {
  if (item.implementation_effort) {
    return item.implementation_effort;
  }
  const type = String(item.type || "").toLowerCase();
  if (type.includes("policy")) {
    return "Low";
  }
  if (type.includes("routing") || type.includes("cache")) {
    return "Medium";
  }
  return "Medium";
}

function interventionBaselineCost(item) {
  if (item.baseline_cost_usd_month) {
    return Number(item.baseline_cost_usd_month);
  }
  const savings = Number(item.savings_usd_month || 0);
  const multiplier = interventionImplementationEffort(item) === "Low" ? 4.2 : interventionImplementationEffort(item) === "High" ? 2.8 : 3.5;
  return Math.round(savings * multiplier);
}

function interventionForecastImpact(item) {
  if (item.forecast_impact_usd_year) {
    return Number(item.forecast_impact_usd_year);
  }
  const status = normalizeStatus(item.status);
  const captureFactor = status === "implemented" ? 1 : status === "approved" ? 0.85 : status === "review" ? 0.45 : 0.25;
  return Math.round(Number(item.savings_usd_month || 0) * 12 * captureFactor);
}

function interventionEvidenceLines(item) {
  if (Array.isArray(item.linked_evidence) && item.linked_evidence.length) {
    return item.linked_evidence;
  }
  return [
    item.detail || "Recommendation generated from observed demand and cost variance.",
    item.methodology?.threshold || "Threshold conditions were met.",
    item.methodology?.rule || "Recommendation follows the platform rule set."
  ].filter(Boolean);
}

function manualMappingImpact(mapping) {
  const status = normalizeManualMappingStatus(mapping.status);
  const beforeConfidence = Number(mapping.confidence_pct || 0);
  const afterConfidence = status === "confirmed"
    ? 96
    : status === "reassigned"
      ? 93
      : beforeConfidence;
  const forecastDelta = Math.round(Number(mapping.spend_at_risk_usd || 0) * BUSINESS_RULES.forecastRiskReserveShare);
  const request = indexedLookup(datasetIndex.requestsById, mapping.request_id);
  const beforeOwner = mapping.current_owner;
  const afterOwner = status === "deferred"
    ? mapping.current_owner
    : (mapping.resolved_team || mapping.suggested_owner || mapping.current_owner);
  const linkedIntervention = getInterventions().find((item) => String(item.team || "").toLowerCase().includes(String(afterOwner || "").split(" ")[0].toLowerCase()));
  return {
    workloadLabel: mapping.workload_label || mapping.id || "Manual mapping",
    beforeConfidence,
    afterConfidence,
    confidenceLift: afterConfidence - beforeConfidence,
    beforeOwner,
    afterOwner,
    spendReassignedUsd: Number(mapping.spend_at_risk_usd || 0),
    linkedInterventionTitle: linkedIntervention?.title || "Open team recommendation will move higher in the queue once ownership is confirmed.",
    forecastDeltaUsd: forecastDelta,
    request
  };
}

function requestEvidenceQuality(request) {
  const chain = request?.chain || [];
  const strongest = [...chain].sort((a, b) => Number(b.confidence || 0) - Number(a.confidence || 0))[0] || null;
  const weakest = [...chain].sort((a, b) => Number(a.confidence || 0) - Number(b.confidence || 0))[0] || null;
  const ambiguous = chain.filter((node) => Number(node.confidence || 0) < 0.88);
  const missing = [];
  if (!chainNode(request, "Identity Resolution") || Number(chainNode(request, "Identity Resolution")?.confidence || 0) < 0.85) {
    missing.push("Durable identity link strong enough for automated chargeback");
  }
  if (!chainNode(request, "Budget Attribution") || Number(chainNode(request, "Budget Attribution")?.confidence || 0) < 0.85) {
    missing.push("Budget assignment strong enough for automatic financial roll-up");
  }
  if (!chainNode(request, "Code Ownership") || Number(chainNode(request, "Code Ownership")?.confidence || 0) < 0.82) {
    missing.push("Code ownership evidence that closes the ownership chain deterministically");
  }
  return { strongest, weakest, ambiguous, missing };
}

function requestReplayStages(request) {
  const quality = requestEvidenceQuality(request);
  return [
    {
      label: "Raw signal arrival",
      detail: `${request?.model || "Model request"} arrived with ${fmtNumber(request?.input_tokens || 0)} input tokens and ${fmtNumber(request?.output_tokens || 0)} output tokens from ${chainNode(request, "Service Attribution")?.value || "an unresolved workload"}.`
    },
    {
      label: "Reconciliation",
      detail: `${chainNode(request, "Code Ownership")?.method || "Heuristic reconciliation"} plus ${chainNode(request, "Identity Resolution")?.method || "identity resolution"} tied the request to ${selectedRequestTeamName(request) || "a provisional owner"}.`
    },
    {
      label: "Materialization",
      detail: `The ownership chain was written into the low-latency attribution surface so the interceptor could read it in ${fmtNumber(request?.latency_ms || 0)} ms without re-running graph logic.`
    },
    {
      label: "Interceptor decision",
      detail: `${modeLabel(String(request?.mode || state.mode).toLowerCase())} mode attached ${inlineTextForAlternate(request)} and evaluated ${inlineDefinition("Confidence Floor", "confidence floor")} / policy posture on the request path.`
    },
    {
      label: "Intervention and audit outcome",
      detail: quality.weakest && Number(quality.weakest.confidence || 0) < 0.88
        ? `The request remains visible to review workflows because ${quality.weakest.layer} is still the limiting evidence join.`
        : "The request is strong enough to feed downstream intervention ranking, audit history, and financial reporting surfaces."
    }
  ];
}

function inlineTextForAlternate(request) {
  return optimizationNarrative(request).replace(/\s+/g, " ").trim();
}

function forecastProjectionForScenario(scenarioKey, horizonMonths = state.forecastHorizonMonths) {
  const series = buildForecastInputSeries(scenarioKey);
  const base = series[series.length - 1] || 0;
  const scenario = getForecastScenario(scenarioKey);
  const labels = forecastProjectionLabels(Array.from({ length: horizonMonths }, (_, idx) => ({ month_offset: idx + 1 })));
  const points = labels.map((label, idx) => {
    const progress = (idx + 1) / Math.max(horizonMonths, 1);
    const drift = base * ((Number(scenario.trend_ramp_pct || 0) / 100) * progress);
    const demand = base * (Number(scenario.demand_shift_pct || 0) / 100);
    const governance = base * (Number(scenario.governance_drag_pct || 0) / 100) * (0.4 + progress * 0.6);
    const capture = base * Number(scenario.capture_realization_pct || 0) * 0.16 * (0.35 + progress * 0.65);
    const predicted = Math.max(Math.round(base + demand + drift - governance - capture), Math.round(base * BUSINESS_RULES.forecastFloorShare));
    return {
      label,
      predicted_spend_usd: predicted
    };
  });
  return points;
}

function forecastDriversForScenario(scenarioKey = state.forecastScenarioKey) {
  const scenario = getForecastScenario(scenarioKey);
  const model = currentSelectedModel();
  const selectedIntervention = currentSelectedIntervention();
  const spendAtRisk = getManualMappings()
    .filter((item) => ["needs_review", "deferred"].includes(normalizeManualMappingStatus(item.status)))
    .reduce((sum, item) => sum + Number(item.spend_at_risk_usd || 0), 0);
  return [
    {
      label: "Demand growth",
      value: signedPct(scenario.demand_shift_pct || 0),
      detail: "Additional workload demand or broader adoption pressure applied to the baseline."
    },
    {
      label: "Model mix",
      value: model ? `${esc(model.provider)} / ${esc(model.name)}` : "Portfolio-weighted",
      detail: model
        ? `Current context is anchored on ${model.name}, which changes the economics if the selected team or request leans heavily on this model family.`
        : "Portfolio-weighted model routing assumptions across the active estate."
    },
    {
      label: "Governance drag",
      value: signedPct(-Number(scenario.governance_drag_pct || 0)),
      detail: "Reduction in outlier or policy-violating spend under tighter controls."
    },
    {
      label: "Optimization capture",
      value: selectedIntervention ? fmtUSD(interventionForecastImpact(selectedIntervention)) : fmtPct(Number(scenario.capture_realization_pct || 0) * 100, 0),
      detail: selectedIntervention
        ? `Selected intervention could contribute approximately ${fmtUSD(interventionForecastImpact(selectedIntervention))} of annualized planning benefit if executed.`
        : "How much of the open intervention pipeline actually becomes durable run-rate savings."
    },
    {
      label: "Unresolved attribution risk",
      value: fmtUSD(spendAtRisk),
      detail: "Spend still sitting in provisional ownership queues that finance may need to hold as planning risk."
    }
  ];
}

function forecastViewData() {
  const scenario = getForecastScenario();
  const trend = dataset.overview?.spend_trend_k_usd || [];
  const selectedIntervention = currentSelectedIntervention();
  const adjustedSeries = buildForecastInputSeries();
  const points = state.forecastResult?.points || [];
  const finalPoint = points[points.length - 1];
  const latestActual = trend.length ? Number(trend[trend.length - 1].total || 0) * 1000 : 0;
  const projectedDeltaPct = finalPoint && latestActual > 0
    ? ((Number(finalPoint.predicted_spend_usd || 0) / latestActual) - 1) * 100
    : 0;
  const scenarioDeltaPct = trend.length && adjustedSeries.length && latestActual > 0
    ? ((adjustedSeries[adjustedSeries.length - 1] / latestActual) - 1) * 100
    : 0;
  return {
    scenario,
    trend,
    selectedIntervention,
    adjustedSeries,
    points,
    finalPoint,
    latestActual,
    projectedDeltaPct,
    scenarioDeltaPct
  };
}

function renderForecastHorizonButtons() {
  return FORECAST_HORIZONS.map((months) => {
    const active = state.forecastHorizonMonths === months;
    return `<button class="small-btn forecast-horizon-btn${active ? " active" : ""}" data-action="forecast-set-horizon" data-months="${months}" ${state.forecastLoading ? "disabled" : ""}>${months}m</button>`;
  }).join("");
}

function renderForecastScenarioButtons() {
  return Object.entries(forecastScenarioLibrary()).map(([key, item]) => {
    const active = state.forecastScenarioKey === key;
    return `
      <button class="forecast-scenario-btn${active ? " active" : ""}" data-action="forecast-set-scenario" data-scenario-key="${esc(key)}" ${state.forecastLoading ? "disabled" : ""}>
        <div class="forecast-scenario-title">${esc(item.label)}</div>
        <div class="forecast-scenario-subtitle">${esc(item.summary || item.definition || "")}</div>
      </button>
    `;
  }).join("");
}

function renderForecastCompareButtons() {
  return Object.entries(forecastScenarioLibrary()).map(([key, item]) => {
    const active = state.forecastCompareKeys.includes(key);
    return `<button class="filter-btn${active ? " active" : ""}" data-action="forecast-compare-toggle" data-scenario-key="${esc(key)}">${esc(item.label)}</button>`;
  }).join("");
}

function renderForecastScenarioMeaning(data = forecastViewData()) {
  const { scenario } = data;
  const team = currentSelectedTeam();
  const model = currentSelectedModel();
  const selectedIntervention = currentSelectedIntervention();
  const contextBits = [
    team ? `Team context: ${team.name}` : null,
    model ? `Model context: ${model.provider} / ${model.name}` : null,
    selectedIntervention ? `Linked intervention: ${selectedIntervention.title}` : null
  ].filter(Boolean);
  return `
    <div class="card-title" style="font-size:14px">Selected Scenario</div>
    <div class="card-subtitle">${esc(scenario.label)} for ${state.forecastHorizonMonths} months</div>
    <p class="forecast-summary-copy">${esc(scenario.definition || scenario.summary || "")}</p>
    ${contextBits.length ? `<div class="hint" style="margin-top:8px">${esc(contextBits.join(" | "))}</div>` : ""}
    <div class="forecast-metric-grid">
      <div class="forecast-metric">
        <div class="forecast-metric-label">Demand Change</div>
        <div class="forecast-metric-value">${signedPct(scenario.demand_shift_pct || 0)}</div>
      </div>
      <div class="forecast-metric">
        <div class="forecast-metric-label">Trend Change</div>
        <div class="forecast-metric-value">${signedPct(scenario.trend_ramp_pct || 0)}</div>
      </div>
      <div class="forecast-metric">
        <div class="forecast-metric-label">Policy Pressure</div>
        <div class="forecast-metric-value">${signedPct(-Number(scenario.governance_drag_pct || 0))}</div>
      </div>
      <div class="forecast-metric">
        <div class="forecast-metric-label">Savings Capture</div>
        <div class="forecast-metric-value">${fmtPct(Number(scenario.capture_realization_pct || 0) * 100, 0)}</div>
      </div>
    </div>
    <ul class="forecast-bullets">
      ${(scenario.assumptions || []).slice(0, 3).map((item) => `<li>${esc(item)}</li>`).join("")}
    </ul>
  `;
}

function renderForecastScenarioReadout(data = forecastViewData()) {
  const { finalPoint, latestActual, scenarioDeltaPct, projectedDeltaPct, selectedIntervention } = data;
  const exitRange = finalPoint
    ? `${fmtUSD(finalPoint.lower_bound_usd)} - ${fmtUSD(finalPoint.upper_bound_usd)}`
    : "Generate a forecast to see the likely range.";
  const interventionImpact = selectedIntervention
    ? `Linked intervention impact: about ${fmtUSD(interventionForecastImpact(selectedIntervention))} annualized if execution holds.`
    : "Linked intervention impact appears once a specific intervention is selected.";
  return `
    <div class="card-title" style="font-size:14px">Planning Impact</div>
    <div class="card-subtitle">What the selected case does to the forward cost curve.</div>
    <div class="forecast-metric-grid">
      <div class="forecast-metric">
        <div class="forecast-metric-label">Planning Horizon</div>
        <div class="forecast-metric-value">${state.forecastHorizonMonths} months</div>
      </div>
      <div class="forecast-metric">
        <div class="forecast-metric-label">Scenario Adjustment</div>
        <div class="forecast-metric-value">${signedPct(scenarioDeltaPct)}</div>
      </div>
      <div class="forecast-metric">
        <div class="forecast-metric-label">Current Monthly Spend</div>
        <div class="forecast-metric-value">${latestActual ? compactUSD(latestActual) : "N/A"}</div>
      </div>
      <div class="forecast-metric">
        <div class="forecast-metric-label">Exit Monthly Spend</div>
        <div class="forecast-metric-value">${finalPoint ? compactUSD(finalPoint.predicted_spend_usd) : "Not generated"}</div>
      </div>
      <div class="forecast-metric">
        <div class="forecast-metric-label">Exit-Rate Change</div>
        <div class="forecast-metric-value">${finalPoint ? signedPct(projectedDeltaPct) : "N/A"}</div>
      </div>
    </div>
    <div class="forecast-impact-note">Likely exit range: ${esc(exitRange)}.</div>
    <div class="hint" style="margin-top:10px">${esc(interventionImpact)}</div>
  `;
}

function renderForecastEstimateCards(data = forecastViewData()) {
  const projectionLabels = forecastProjectionLabels(data.points);
  return data.points.length
    ? data.points.map((point, idx) => {
        return `
          <div class="card forecast-estimate-card">
            <div class="metric-label">${esc(projectionLabels[idx] || `Month +${point.month_offset}`)}</div>
            <div style="font-size:18px;font-weight:650">${fmtUSD(point.predicted_spend_usd)}</div>
            <div class="hint">Range ${fmtUSD(point.lower_bound_usd)} - ${fmtUSD(point.upper_bound_usd)}</div>
          </div>
        `;
      }).join("")
    : `<div class="hint">Generate a forecast to populate projection points.</div>`;
}

function refreshForecastPageInPlace() {
  if (state.page !== "forecast") {
    return false;
  }
  const horizonRow = document.getElementById("forecast-horizon-row");
  const scenarioGrid = document.getElementById("forecast-scenario-grid");
  const status = document.getElementById("forecast-status");
  const meaning = document.getElementById("forecast-scenario-meaning");
  const readout = document.getElementById("forecast-scenario-readout");
  const estimateGrid = document.getElementById("forecast-estimate-grid");
  const compareButtons = document.getElementById("forecast-compare-buttons");
  const forecastCanvas = document.getElementById("chart-forecast");
  const compareCanvas = document.getElementById("chart-forecast-compare");
  if (!horizonRow || !scenarioGrid || !status || !meaning || !readout || !estimateGrid || !compareButtons || !forecastCanvas || !compareCanvas) {
    return false;
  }
  const data = forecastViewData();
  horizonRow.innerHTML = renderForecastHorizonButtons();
  scenarioGrid.innerHTML = renderForecastScenarioButtons();
  status.textContent = state.forecastStatus;
  meaning.innerHTML = renderForecastScenarioMeaning(data);
  readout.innerHTML = renderForecastScenarioReadout(data);
  estimateGrid.innerHTML = renderForecastEstimateCards(data);
  compareButtons.innerHTML = renderForecastCompareButtons();
  renderForecastChart();
  renderContextRibbon();
  normalizeInteractionContracts(document);
  return true;
}

function governancePolicyBundle(bundleKey = state.governanceSimulationBundle) {
  return GOVERNANCE_POLICY_BUNDLES.find((item) => item.key === bundleKey) || GOVERNANCE_POLICY_BUNDLES[0];
}

function selectedGovernanceRequestValue() {
  const requests = Array.isArray(dataset.attribution_requests)
    ? dataset.attribution_requests
    : [];
  if (!requests.length) {
    state.governanceSimulationRequestId = "";
    return "";
  }
  const current = String(state.governanceSimulationRequestId || "");
  if (requests.some((request) => request.id === current)) {
    return current;
  }
  const fallback = String(requests[0]?.id || "");
  state.governanceSimulationRequestId = fallback;
  return fallback;
}

function governanceRequestSelectionFeedback(value) {
  const requestId = String(value || "");
  const requests = Array.isArray(dataset.attribution_requests)
    ? dataset.attribution_requests
    : [];
  if (!requests.length) {
    return {
      kind: "error",
      message: "No request samples are loaded. Reset the local demo before presenting this simulator."
    };
  }
  const request = requests.find((item) => item.id === requestId);
  if (!request) {
    return {
      kind: "error",
      message: "That request sample is not in the current dummy dataset. The previous valid selection was preserved."
    };
  }
  const service = chainNode(request, "Service Attribution")?.value || request.id;
  const owner = selectedRequestTeamName(request) || "review queue";
  return {
    kind: "ok",
    message: `Selected ${service} for ${owner}. Changing this sample preserves the rest of the simulator context.`
  };
}

function governanceSimulationResult() {
  const requestId = selectedGovernanceRequestValue();
  const request = indexedLookup(datasetIndex.requestsById, requestId) || currentSelectedRequest() || dataset.attribution_requests?.[0];
  if (!request) {
    return null;
  }
  const bundle = governancePolicyBundle();
  const mode = state.governanceSimulationMode || state.mode;
  const confidence = Number(request.confidence || 0);
  const billed = Number(request.cost_usd || request.cost_breakdown?.billed_cost_usd || 0);
  const hasAlternative = !String(request.enrichment?.alternate_model || "").toLowerCase().includes("no verified equivalent")
    && !String(request.enrichment?.alternate_model || "").toLowerCase().includes("already on lowest-cost")
    && Boolean(request.enrichment?.alternate_model);
  let decision = mode === "passive" ? "Observe only" : "Allow";
  let why = "The request remains within the active policy envelope.";
  if (confidence < bundle.confidence_floor) {
    decision = mode === "active" && bundle.key === "security_hardened"
      ? "Escalate to manual review"
      : mode === "passive"
        ? "Observe only"
        : "Warn and require owner confirmation";
    why = `Confidence ${Math.round(confidence * 100)}% is below the ${Math.round(bundle.confidence_floor * 100)}% floor for the selected bundle.`;
  } else if (billed > bundle.cost_ceiling_usd && hasAlternative) {
    decision = mode === "active" ? "Route to lower-cost equivalent" : mode === "advisory" ? "Recommend lower-cost equivalent" : "Observe only";
    why = `Request cost ${fmtUSD(billed, 4)} is above the ${fmtUSD(bundle.cost_ceiling_usd, 4)} ceiling and a verified alternative exists.`;
  } else if (bundle.allowlist_strictness === "strictest" && String(request.model || "").toLowerCase().includes("mini")) {
    decision = mode === "active" ? "Allow with audit event" : "Allow";
    why = "Model remains in policy, but the hardened bundle records stricter audit telemetry.";
  }
  return {
    request,
    bundle,
    mode,
    decision,
    why,
    nextAction: decision === "Route to lower-cost equivalent"
      ? "Show this outcome in Forecasting to quantify the run-rate delta."
      : decision === "Warn and require owner confirmation" || decision === "Escalate to manual review"
        ? "Open Manual Mapping or Request Proof to resolve the weak ownership evidence."
        : "This outcome is deployable because the request can proceed safely without losing governance visibility."
  };
}

function downloadArtifact(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function exportArtifact(kind) {
  const team = currentSelectedTeam();
  const intervention = currentSelectedIntervention() || getInterventions()[0];
  const simulation = governanceSimulationResult();
  const scenario = getForecastScenario();
  let filename = "aci-artifact.txt";
  let content = `Argmin\nGenerated: ${new Date().toISOString()}\n\n`;

  if (kind === "intervention-brief" && intervention) {
    filename = `aci-intervention-brief-${intervention.id}.txt`;
    content += [
      `Intervention Brief: ${intervention.title}`,
      `Team: ${intervention.team}`,
      `Status: ${normalizeStatus(intervention.status)}`,
      `Baseline monthly cost: ${fmtUSD(interventionBaselineCost(intervention))}`,
      `Projected monthly savings: ${fmtUSD(intervention.savings_usd_month)}`,
      `Projected annual forecast impact: ${fmtUSD(interventionForecastImpact(intervention))}`,
      `Confidence: ${fmtPct(intervention.confidence_pct, 0)}`,
      `Implementation effort: ${interventionImplementationEffort(intervention)}`,
      `Business risk: ${intervention.risk}`,
      "",
      "Linked evidence:",
      ...interventionEvidenceLines(intervention).map((line) => `- ${line}`)
    ].join("\n");
  } else if (kind === "team-report" && team) {
    filename = `aci-team-report-${team.id}.txt`;
    content += [
      `Team Optimization Report: ${team.name}`,
      `Lead: ${team.lead}`,
      `Monthly spend: ${fmtUSD(team.spend_usd)}`,
      `Budget: ${fmtUSD(team.budget_usd)}`,
      `Optimization potential: ${fmtUSD(team.optimization_potential_usd)}`,
      `Top models: ${(team.top_models || []).join(", ")}`,
      `Primary workload: ${team.top_workload}`,
      "",
      "Current selected intervention:",
      intervention ? `${intervention.title} | ${fmtUSD(intervention.savings_usd_month)} monthly savings` : "No intervention selected"
    ].join("\n");
  } else if (kind === "governance-log" && simulation) {
    filename = `aci-governance-exception-log-${simulation.request.id}.txt`;
    content += [
      `Governance Exception Log`,
      `Request: ${simulation.request.id}`,
      `Simulation mode: ${modeLabel(simulation.mode)}`,
      `Policy bundle: ${simulation.bundle.label}`,
      `Decision: ${simulation.decision}`,
      `Rationale: ${simulation.why}`,
      `Next action: ${simulation.nextAction}`
    ].join("\n");
  } else if (kind === "planning-pack") {
    filename = `aci-monthly-planning-pack-${state.forecastScenarioKey}-${state.forecastHorizonMonths}m.txt`;
    content += [
      `Monthly Planning Pack`,
      `Scenario: ${scenario.label}`,
      `Horizon: ${state.forecastHorizonMonths} months`,
      `Forecast status: ${state.forecastStatus}`,
      "",
      "Drivers:",
      ...forecastDriversForScenario().map((driver) => `- ${driver.label}: ${driver.value} | ${driver.detail}`)
    ].join("\n");
  } else if (kind === "design-partner-brief") {
    const brief = designPartnerData();
    const thesis = brief.thesis || {};
    const stage = selectedPartnerStage();
    filename = "argmin-design-partner-brief.txt";
    content += [
      "Design Partner Brief",
      thesis.headline || "Enterprise AI cost-governance design partner pilot",
      thesis.summary || "",
      "",
      "Selected pilot stage:",
      stage ? `${stage.label} | ${stage.duration} | ${stage.goal}` : "No stage selected",
      "",
      "Success metrics:",
      ...(brief.success_metrics || []).map((metric) => `- ${metric.metric}: ${metric.baseline} -> ${metric.target} | Owner: ${metric.owner}`),
      "",
      "Proof moments:",
      ...(brief.proof_moments || []).map((moment) => `- ${moment.audience}: ${moment.moment} | Surface: ${moment.surface_label}`),
      "",
      "Open design-partner questions:",
      ...(brief.open_questions || []).map((question) => `- ${question.owner}: ${question.question}`)
    ].join("\n");
  } else if (kind === "chargeback-export") {
    filename = `aci-chargeback-preview-${state.exportViewMode}.txt`;
    const rows = exportRowsForMode();
    content += [
      "Chargeback Export Preview",
      `Reporting mode: ${state.exportViewMode === "current_state" ? "Current-state rollup" : "Event-time owner"}`,
      `Validation: ${dataset.exports?.summary?.validation_status || "PASS"}`,
      "",
      "Rows:",
      ...rows.map((row) => [
        row.line_id,
        row.service,
        row.display_team,
        row.cost_center,
        row.truth_basis,
        row.export_action,
        fmtNullableUSD(row.reconciled_cost_usd),
        fmtPct(Number(row.confidence || 0) * 100, 0)
      ].join(" | "))
    ].join("\n");
  } else {
    return;
  }

  downloadArtifact(filename, content);
  showToast("Artifact Exported", `Downloaded ${filename}`);
}

function cloudBreakdown() {
  const rows = {};
  for (const team of dataset.teams || []) {
    const key = team.cloud || "Unknown";
    rows[key] = (rows[key] || 0) + Number(team.spend_usd || 0);
  }
  return Object.entries(rows)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function hydrateInterventionStatuses() {
  const storedRaw = safeSessionGet(INTERVENTION_STORAGE_KEY);
  if (!storedRaw) {
    return;
  }
  try {
    const map = JSON.parse(storedRaw);
    for (const item of getInterventions()) {
      if (map[item.id]) {
        item.status = normalizeStatus(map[item.id]);
      } else {
        item.status = normalizeStatus(item.status);
      }
    }
  } catch (error) {
    appendLog("warn", "Session cache", `Could not load intervention state: ${String(error)}`, null, { hidden: true });
  }
}

function persistInterventionStatuses() {
  const map = {};
  for (const item of getInterventions()) {
    map[item.id] = normalizeStatus(item.status);
  }
  safeSessionSet(INTERVENTION_STORAGE_KEY, JSON.stringify(map));
}

function hydrateManualMappingState() {
  const storedRaw = safeSessionGet(MANUAL_MAPPING_STORAGE_KEY);
  for (const item of getManualMappings()) {
    item.status = normalizeManualMappingStatus(item.status);
    item.resolved_team = item.resolved_team || item.suggested_owner || item.current_owner;
  }
  if (!storedRaw) {
    return;
  }
  try {
    const map = JSON.parse(storedRaw);
    for (const item of getManualMappings()) {
      if (!map[item.id]) {
        continue;
      }
      item.status = normalizeManualMappingStatus(map[item.id].status);
      item.resolved_team = map[item.id].resolved_team || item.resolved_team;
      item.updated_at = map[item.id].updated_at || item.updated_at || null;
    }
  } catch (error) {
    appendLog("warn", "Session cache", `Could not load manual mapping state: ${String(error)}`, null, { hidden: true });
  }
}

function persistManualMappingState() {
  const map = {};
  for (const item of getManualMappings()) {
    map[item.id] = {
      status: normalizeManualMappingStatus(item.status),
      resolved_team: item.resolved_team || item.suggested_owner || item.current_owner,
      updated_at: item.updated_at || null
    };
  }
  safeSessionSet(MANUAL_MAPPING_STORAGE_KEY, JSON.stringify(map));
}

function setRuntimeStatus(status, detail) {
  state.runtimeStatus = status;
  state.runtimeDetail = detail;
  renderTopbar();
}

function runtimeCapabilityKey(path) {
  if (path.startsWith("/v1/adoption/")) {
    return "adoption";
  }
  if (path.startsWith("/v1/integrations/")) {
    return "integrations";
  }
  if (path.startsWith("/v1/interventions")) {
    return "interventions";
  }
  if (path.startsWith("/v1/forecast/")) {
    return "forecast";
  }
  if (path.startsWith("/v1/demo/")) {
    return "demo";
  }
  if (path.startsWith("/v1/intercept")) {
    return "intercept";
  }
  if (path.startsWith("/v1/policy/")) {
    return "policy";
  }
  return "runtime";
}

function runtimeCapabilityLabel(key) {
  const labels = {
    adoption: "employee adoption analytics",
    integrations: "integration workflows",
    interventions: "intervention controls",
    forecast: "forecast generation",
    demo: "guided demo runtime",
    intercept: "request interception",
    policy: "policy simulation",
    runtime: "live runtime"
  };
  return labels[key] || "live runtime";
}

function refreshRuntimeStatus() {
  const capabilityEntries = Object.entries(state.runtimeCapabilities || {}).filter(([, value]) => (
    value && typeof value === "object" && typeof value.status === "string"
  ));
  if (!capabilityEntries.length) {
    setRuntimeStatus("local", "Using deterministic local demo data until a live action is requested");
    return;
  }

  const degraded = capabilityEntries.filter(([, value]) => value.status !== "online");
  if (!degraded.length) {
    setRuntimeStatus("online", "Connected to demo runtime with simulated enterprise data");
    return;
  }

  const anyOnline = capabilityEntries.some(([, value]) => value.status === "online");
  if (anyOnline) {
    setRuntimeStatus(
      "degraded",
      "Presentation mode with partial live runtime access"
    );
    return;
  }

  setRuntimeStatus(
    "offline",
    "Using local demo data. Live proof controls are unavailable."
  );
}

function markRuntimeSuccess(path, detail) {
  const capability = runtimeCapabilityKey(path);
  state.runtimeCapabilities[capability] = {
    status: "online",
    detail
  };
  refreshRuntimeStatus();
}

function markRuntimeFailure(path, detail, mode = "degraded") {
  const capability = runtimeCapabilityKey(path);
  state.runtimeCapabilities[capability] = {
    status: mode,
    detail
  };
  refreshRuntimeStatus();
}

function hideToast() {
  const toast = document.getElementById("toast");
  if (!toast) {
    return;
  }
  toast.classList.remove("show");
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
}

function showToast(title, message, options = {}) {
  const toast = document.getElementById("toast");
  if (!toast) {
    return;
  }
  const persistent = Boolean(options.persistent);
  document.getElementById("toast-title").textContent = title;
  document.getElementById("toast-msg").textContent = message;
  toast.classList.add("show");
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  if (!persistent) {
    toastTimer = setTimeout(() => {
      hideToast();
    }, UI_LIMITS.toastTimeoutMs);
  }
}

function instantActionLabel(actionEl, action) {
  if (action === "go") {
    return `Opening ${PAGE_TITLES[actionEl.dataset.page] || "demo view"}`;
  }
  if (action === "back-to-demo-path") {
    const targetPage = actionEl.dataset.page || demoPathTargetPage();
    return `Moving to ${PAGE_TITLES[targetPage] || "the demo path"}`;
  }
  if (action === "start-walkthrough" || action === "run-sequence") {
    return "Starting guided walkthrough";
  }
  if (action === "toggle-presenter-mode") {
    return state.presenterMode ? "Closing presenter mode" : "Opening presenter mode";
  }
  if (action.startsWith("presenter-")) {
    return "Presenter path updated";
  }
  if (action === "bootstrap-demo") {
    return "Preparing seeded demo state";
  }
  if (action === "forecast-generate") {
    return "Local forecast estimate readying";
  }
  if (action === "forecast-set-scenario" || action === "forecast-set-horizon" || action === "forecast-compare-toggle") {
    return "Forecast inputs updated";
  }
  if (action === "intervention-status") {
    return "Intervention updated locally";
  }
  if (action.startsWith("manual-map")) {
    return "Mapping review updated locally";
  }
  if (action === "integrations-refresh") {
    return "Refreshing integration feed";
  }
  if (action === "integrations-run-scenario") {
    return "Simulating integration handoff";
  }
  if (action === "show-deferred-section") {
    return "Loading reference content";
  }
  if (action === "toggle-faq") {
    return "FAQ state updated";
  }
  if (action === "apply-guided-example") {
    return "Example loaded";
  }
  return "Action received";
}

function renderInstantFeedback() {
  const feedback = document.getElementById("instant-feedback");
  if (!feedback) {
    return;
  }
  if (!state.instantFeedback) {
    feedback.hidden = true;
    feedback.classList.remove("show");
    feedback.textContent = "";
    return;
  }
  feedback.hidden = false;
  feedback.textContent = state.instantFeedback.message;
  feedback.classList.add("show");
}

function acknowledgeInstantAction(actionEl, action) {
  if (!action || action === "close-toast" || action === "close-drawer" || action === "close-mobile-nav") {
    return;
  }
  if (actionEl instanceof HTMLElement) {
    actionEl.classList.add("click-ack");
    window.setTimeout(() => {
      actionEl.classList.remove("click-ack");
    }, 180);
  }
  state.instantFeedback = {
    action,
    message: instantActionLabel(actionEl, action),
    at: Date.now()
  };
  renderInstantFeedback();
  if (instantFeedbackTimer) {
    clearTimeout(instantFeedbackTimer);
  }
  instantFeedbackTimer = window.setTimeout(() => {
    state.instantFeedback = null;
    renderInstantFeedback();
  }, 1300);
}

function extractOperatorErrorMessage(error) {
  if (!error) {
    return "";
  }
  if (error instanceof Error) {
    return error.message || "";
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object") {
    if (typeof error.message === "string") {
      return error.message;
    }
    if (typeof error.detail === "string") {
      return error.detail;
    }
    if (error.error && typeof error.error.message === "string") {
      return error.error.message;
    }
  }
  return String(error || "");
}

function sanitizeOperatorMessage(message, fallback) {
  const raw = String(message || "").trim();
  if (!raw) {
    return fallback;
  }
  const hasStackMarker = raw.includes("\n    at ") || raw.includes("Traceback") || raw.includes('File "');
  if (hasStackMarker) {
    return fallback;
  }
  const withoutPrefix = raw.replace(/^Error:\s*/i, "").replace(/\s+/g, " ").trim();
  return withoutPrefix.length > 260 ? `${withoutPrefix.slice(0, 257)}...` : withoutPrefix;
}

function summarizeApiError(error, fallback = "The live demo action could not be completed.") {
  const message = sanitizeOperatorMessage(extractOperatorErrorMessage(error), fallback);
  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "Local demo API unavailable. Start the local runtime with ./scripts/start_demo.sh, or continue the walkthrough on seeded local data.";
  }
  return message || fallback;
}

function apiResponseErrorMessage(response, data) {
  const statusLabel = `${response.status} ${response.statusText || "API error"}`.trim();
  let detail = "";
  if (data && typeof data.error?.message === "string") {
    detail = data.error.message;
  } else if (data && typeof data.detail === "string") {
    detail = data.detail;
  } else if (Array.isArray(data?.detail)) {
    detail = "The request did not pass API validation. Check the visible inputs and retry.";
  } else if (typeof data?.raw === "string" && data.raw && !data.raw.startsWith("<")) {
    detail = data.raw;
  }

  if (response.status === 401 || response.status === 403) {
    detail = detail || "Live API authentication is required for this action.";
    return `${statusLabel}. ${detail} Continue with local demo data or restart the demo profile.`;
  }
  if (response.status >= 500) {
    const correlationId = data?.error?.correlation_id || response.headers.get("X-ACI-Correlation-Id") || "";
    return [
      `${statusLabel}. The local demo runtime hit an internal recovery boundary.`,
      correlationId ? `Reference ${correlationId}.` : "",
      "Use Reset Demo or run ./scripts/reset_demo.sh, then retry the action."
    ].filter(Boolean).join(" ");
  }
  return `${statusLabel}. ${detail || "The demo API rejected the request. Use Reset Demo if the local state looks stale."}`;
}

function recoveryActionsMarkup() {
  return `
    <button class="small-btn" data-action="clear-logs">Reset Demo</button>
    <button class="small-btn" data-action="go" data-page="overview">Open Overview</button>
    <button class="small-btn" data-action="open-drawer">Guided Demo</button>
  `;
}

function noteRecoveryRenderIssue(error) {
  state.runtimeStatus = "degraded";
  state.runtimeDetail = summarizeApiError(
    error,
    "A recovery UI element could not render, but the main controlled recovery state remains active."
  );
}

function setRecoveryNotice(notice) {
  state.recoveryNotice = {
    severity: notice.severity || "warn",
    title: notice.title || "Demo recovered",
    message: notice.message || "The demo moved into a controlled recovery state.",
    detail: notice.detail || "",
    source: notice.source || "runtime"
  };
  try {
    renderRecoveryBanner();
    renderTopbar();
  } catch (recoveryError) {
    noteRecoveryRenderIssue(recoveryError);
  }
}

function clearRecoveryNotice(source = "") {
  if (!state.recoveryNotice) {
    return;
  }
  if (source && state.recoveryNotice.source !== source) {
    return;
  }
  state.recoveryNotice = null;
  try {
    renderRecoveryBanner();
  } catch (recoveryError) {
    noteRecoveryRenderIssue(recoveryError);
  }
}

function renderRecoveryBanner() {
  const banner = document.getElementById("recovery-banner");
  if (!banner) {
    return;
  }
  const notice = state.recoveryNotice;
  if (!notice) {
    banner.hidden = true;
    banner.innerHTML = "";
    banner.className = "recovery-banner";
    return;
  }
  banner.hidden = false;
  banner.className = `recovery-banner ${notice.severity === "error" ? "error" : "warn"}`;
  banner.innerHTML = `
    <div class="recovery-banner-inner">
      <div>
        <div class="recovery-banner-title">${esc(notice.title)}</div>
        <div class="recovery-banner-copy">${esc(notice.message)}</div>
        ${notice.detail ? `<div class="recovery-banner-detail">${esc(notice.detail)}</div>` : ""}
      </div>
      <div class="recovery-banner-actions">${recoveryActionsMarkup()}</div>
    </div>
  `;
}

function recoveryViewMarkup(notice) {
  return `
    <div class="recovery-state">
      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${esc(notice.title || "Demo recovered safely")}</div>
            <div class="card-subtitle">${esc(notice.message || "A demo-critical path failed, so the UI moved into a controlled recovery state instead of leaving a blank screen.")}</div>
          </div>
          <div class="recovery-banner-actions">${recoveryActionsMarkup()}</div>
        </div>
        ${notice.detail ? `<div class="hint">${esc(notice.detail)}</div>` : ""}
        <div class="recovery-steps">
          <div class="recovery-step"><span>01</span><div>Click <strong>Reset Demo</strong> to clear browser session state and reload the seeded baseline.</div></div>
          <div class="recovery-step"><span>02</span><div>If the backend was stopped, run <span class="mono">./scripts/start_demo.sh</span> from the repo root.</div></div>
          <div class="recovery-step"><span>03</span><div>For command-line recovery, run <span class="mono">ACI_RESET_OPEN_BROWSER=0 ./scripts/reset_demo.sh</span> and reload <span class="mono">/platform/?reset=1</span>.</div></div>
        </div>
      </section>
    </div>
  `;
}

function stateActionButtonsMarkup(actions = []) {
  const visibleActions = actions.filter((action) => {
    return personaCanUseActionDescriptor(
      action.action || "",
      {
        page: action.page || "",
        scenario: action.scenario || "",
        ...(action.data || {})
      },
      activeDemoPersona()
    );
  });
  return visibleActions.length
    ? `
      <div class="state-panel-actions">
        ${visibleActions.map((action) => {
          const extraData = Object.entries(action.data || {}).map(([key, value]) => (
            ` data-${esc(key)}="${esc(value)}"`
          )).join("");
          const primaryAttr = action.primary
            ? ` data-primary-action="true" aria-label="Primary action: ${esc(action.label)}"`
            : "";
          return `
          <button class="small-btn${action.primary ? " primary" : ""}" data-action="${esc(action.action)}"${action.page ? ` data-page="${esc(action.page)}"` : ""}${action.scenario ? ` data-scenario="${esc(action.scenario)}"` : ""}${extraData}${primaryAttr}>
            ${esc(action.label)}
          </button>
        `;
        }).join("")}
      </div>
    `
    : "";
}

function singleNextStepAction(actions = []) {
  if (!actions.length) {
    return [];
  }
  const primary = actions.find((action) => action.primary);
  return [primary || actions[0]];
}

function guidedEmptyExampleFor(title) {
  const label = String(title || "").toLowerCase();
  if (label.includes("glossary")) {
    return {
      label: "Prefilled example",
      value: "governance",
      actions: [{
        label: "Search Governance",
        action: "apply-guided-example",
        primary: true,
        data: { "input-key": "glossary-query", value: "governance" }
      }]
    };
  }
  if (label.includes("faq")) {
    return {
      label: "Prefilled example",
      value: "deployment",
      actions: [{
        label: "Search Deployment",
        action: "apply-guided-example",
        primary: true,
        data: { "input-key": "faq-query", value: "deployment" }
      }]
    };
  }
  if (label.includes("forecast")) {
    return { label: "Example", value: "Baseline scenario / 12-month horizon" };
  }
  if (label.includes("demo activity")) {
    return { label: "Example path", value: "Overview -> Adoption -> Request Proof" };
  }
  if (label.includes("request proof")) {
    return { label: "Seeded example", value: "customer-support-bot using gpt-4o-mini" };
  }
  if (label.includes("models") || label.includes("model rows")) {
    return { label: "Seeded example", value: "gpt-4o-mini, Claude Sonnet, Gemini Flash" };
  }
  if (label.includes("teams")) {
    return { label: "Seeded example", value: "Customer Support AI / Data Platform / Revenue Operations" };
  }
  if (label.includes("manual mapping")) {
    return { label: "Seeded example", value: "support-bot-staging ownership review" };
  }
  if (label.includes("interventions")) {
    return { label: "Example filter", value: "All recommendations" };
  }
  if (label.includes("workflow")) {
    return { label: "Seeded example", value: "Support copilot adoption workflow" };
  }
  if (label.includes("integration")) {
    return { label: "Seeded example", value: "Jira remediation handoff" };
  }
  if (label.includes("export")) {
    return { label: "Seeded example", value: "February chargeback preview" };
  }
  return { label: "Seeded example", value: "NovaTech local demo baseline" };
}

function guidedEmptyNextStepFor(title) {
  const label = String(title || "").toLowerCase();
  if (label.includes("glossary")) {
    return "Use the prefilled Governance search to reveal the relevant terminology.";
  }
  if (label.includes("faq")) {
    return "Use the prefilled Deployment search to open the most relevant diligence answers.";
  }
  if (label.includes("forecast")) {
    return "Generate the baseline forecast using the preselected scenario and horizon.";
  }
  if (label.includes("demo activity")) {
    return "Start the guided demo to create the first timeline event.";
  }
  if (label.includes("interventions")) {
    return "Return to the All filter to see the seeded recommendation queue.";
  }
  if (label.includes("manual mapping")) {
    return "Open Request Proof to show the evidence trail, then return to the seeded review queue.";
  }
  if (label.includes("request proof") || label.includes("models") || label.includes("teams")) {
    return "Reset the demo to reload the seeded NovaTech records.";
  }
  return "Reset the demo to restore the known-good seeded baseline.";
}

function stateExampleMarkup(example) {
  if (!example) {
    return "";
  }
  const label = example.label || "Example";
  const value = example.value || example;
  return `
    <div class="state-panel-example">
      <span>${esc(label)}</span>
      <strong>${esc(value)}</strong>
    </div>
  `;
}

function stateNextStepMarkup(nextStep) {
  if (!nextStep) {
    return "";
  }
  return `
    <div class="state-panel-next-step">
      <span>Next</span>
      <strong>${esc(nextStep)}</strong>
    </div>
  `;
}

function explicitStateMarkup(kind, title, message, options = {}) {
  const stateKind = ["loading", "success", "empty", "error", "warn"].includes(kind)
    ? kind
    : "success";
  const compact = Boolean(options.compact);
  const role = stateKind === "error" || stateKind === "warn" ? "alert" : "status";
  const busy = stateKind === "loading" ? "true" : "false";
  const isEmptyState = stateKind === "empty";
  const example = isEmptyState
    ? (options.example || guidedEmptyExampleFor(title))
    : options.example;
  const emptyActions = Array.isArray(options.actions) && options.actions.length
    ? options.actions
    : (example?.actions || []);
  const actions = isEmptyState
    ? singleNextStepAction(emptyActions)
    : (options.actions || []);
  const nextStep = isEmptyState
    ? (options.nextStep || guidedEmptyNextStepFor(title))
    : options.nextStep;
  const className = [
    "state-panel",
    `state-panel-${stateKind}`,
    isEmptyState ? "guided-empty-state" : "",
    compact ? "compact" : "",
    options.className || ""
  ].filter(Boolean).join(" ");
  return `
    <div class="${className}" role="${role}" aria-live="${role === "alert" ? "assertive" : "polite"}" aria-busy="${busy}">
      <span class="state-panel-icon" aria-hidden="true"></span>
      <div class="state-panel-copy">
        <div class="state-panel-title">${esc(title)}</div>
        <div class="state-panel-message">${esc(message)}</div>
        ${options.detail ? `<div class="state-panel-detail">${esc(options.detail)}</div>` : ""}
        ${stateExampleMarkup(example)}
        ${stateNextStepMarkup(nextStep)}
        ${stateKind === "loading" ? `
          <div class="state-panel-skeleton" aria-hidden="true">
            <span class="skeleton-line wide"></span>
            <span class="skeleton-line"></span>
          </div>
        ` : ""}
      </div>
      ${stateActionButtonsMarkup(actions)}
    </div>
  `;
}

function loadingStateMarkup(title, message, options = {}) {
  return explicitStateMarkup("loading", title, message, options);
}

function successStateMarkup(title, message, options = {}) {
  return explicitStateMarkup("success", title, message, options);
}

function emptyStateMarkup(title, message, options = {}) {
  return explicitStateMarkup("empty", title, message, options);
}

function errorStateMarkup(title, message, options = {}) {
  return explicitStateMarkup("error", title, message, options);
}

function tableEmptyRowMarkup(colspan, title, message, options = {}) {
  return `
    <tr>
      <td colspan="${Number(colspan) || 1}">
        ${emptyStateMarkup(title, message, { compact: true, ...options })}
      </td>
    </tr>
  `;
}

function currentPageLoadingLabel() {
  if (state.pendingDemoAction) {
    return state.guidedDemoProgressLabel || "Running a guided demo action.";
  }
  if (state.page === "adoption" && state.adoptionLoading) {
    return "Refreshing adoption analytics.";
  }
  if (state.page === "interventions" && state.interventionLoading) {
    return "Syncing intervention recommendations.";
  }
  if (state.page === "forecast" && state.forecastLoading) {
    return "Generating a live forecast.";
  }
  if (state.page === "integrations" && state.integrationLoading) {
    return "Refreshing operational integrations.";
  }
  return "";
}

function pageReadyMessage() {
  const label = PAGE_TITLES[state.page] || "Overview";
  if (state.page === "adoption") {
    const dashboard = currentAdoptionDashboard();
    return dashboard
      ? `${dashboard.scope_label} adoption data is loaded for ${dashboard.window_days} days.`
      : "Adoption data is not loaded; the page will show a recovery state.";
  }
  if (state.page === "forecast") {
    return state.forecastStatus || "Forecast planner is ready with seeded local data.";
  }
  if (state.page === "integrations") {
    const summary = currentIntegrationOverview()?.summary || {};
    return `${fmtNumber(summary.inbound_source_count || 0)} sources and ${fmtNumber(summary.outbound_route_count || 0)} handoff routes are loaded.`;
  }
  return `${label} is ready with deterministic local demo data.`;
}

function priorityAction(label, action, options = {}) {
  return { label, action, primary: true, ...options };
}

function pagePrioritySignal() {
  if (isEntryHomeActive()) {
    return null;
  }

  const stats = computeOverview();
  const title = PAGE_TITLES[state.page] || "Demo";
  const adoptionDashboard = currentAdoptionDashboard();
  const workflowRows = adoptionWorkflowRowsForDashboard(adoptionDashboard);
  const workflowMap = adoptionWorkflowMap();
  const workflowSummary = workflowMap.summary || {};
  const selectedRequest = currentSelectedRequest() || (dataset.attribution_requests || [])[0] || null;
  const lowestConfidenceRequest = (dataset.attribution_requests || [])
    .slice()
    .sort((a, b) => Number(a.confidence || 0) - Number(b.confidence || 0))[0] || null;
  const selectedModel = currentSelectedModel()
    || (dataset.models || []).slice().sort((a, b) => Number(b[state.modelSort] || 0) - Number(a[state.modelSort] || 0))[0]
    || null;
  const highestPotentialTeam = (dataset.teams || [])
    .slice()
    .sort((a, b) => Number(b.optimization_potential_usd || 0) - Number(a.optimization_potential_usd || 0))[0] || null;
  const selectedTeam = currentSelectedTeam() || highestPotentialTeam;
  const mappings = manualMappingCounts();
  const openMapping = getManualMappings().find((item) => {
    const status = normalizeManualMappingStatus(item.status);
    return (status === "needs_review" || status === "deferred") && item.request_id;
  }) || getManualMappings()[0] || null;
  const interventions = getInterventions();
  const interventionCountsByStatus = interventionCounts();
  const topIntervention = currentSelectedIntervention()
    || interventions.find((item) => normalizeStatus(item.status) === "recommended")
    || interventions.find((item) => normalizeStatus(item.status) === "review")
    || interventions[0]
    || null;
  const governancePolicies = dataset.governance?.policies || [];
  const coverageSummary = dataset.coverage?.summary || {};
  const exportSummary = dataset.exports?.summary || {};
  const energySummary = dataset.energy_efficiency?.summary || {};
  const forecast = forecastViewData();
  const integrations = currentIntegrationOverview();
  const integrationSummary = integrations?.summary || {};
  const firstScenario = (integrations?.scenarios || [])[0] || null;
  const admin = dataset.admin || {};
  const proofRequirements = dataset.prd_traceability?.requirement_matrix || [];
  const partnerSignals = dataset.design_partner_brief?.thesis?.signals || [];
  const pilotSignal = partnerSignals.find((item) => item.label === "Pilot motion") || partnerSignals[0] || null;
  const faqCount = (dataset.faq || []).reduce((count, category) => count + (category.items || []).length, 0);

  switch (state.page) {
    case "overview":
      return {
        title: "Start with the spend decision.",
        label: "Primary metric",
        value: fmtUSD(stats.totalSpend),
        detail: `${fmtUSD(stats.totalPotential)} is addressable, with ${fmtUSD(stats.captured)} already captured.`,
        actions: [priorityAction("Open Forecast Planner", "go", { page: "forecast" })]
      };
    case "partner_brief":
      return {
        title: "Decide whether NovaTech is design-partner ready.",
        label: "Pilot motion",
        value: pilotSignal?.value || "4 stages",
        detail: "Use the brief to show the buyer path, success metrics, proof moments, and trust-boundary posture.",
        actions: [priorityAction("Run Buyer Walkthrough", "start-walkthrough")]
      };
    case "requirements":
      return {
        title: "Prove the demo maps to the source requirements.",
        label: "Requirement rows",
        value: fmtNumber(proofRequirements.length),
        detail: "Each row ties a local demo surface to the PRD, engineering spec, RAIL, or architecture evidence.",
        actions: [priorityAction("Open Coverage Matrix", "go", { page: "coverage" })]
      };
    case "adoption": {
      const representedTeams = new Set(workflowRows.map((row) => row.team_id).filter(Boolean)).size;
      return {
        title: "Show where teams are actually adopting AI.",
        label: "Mapped workflows",
        value: fmtNumber(workflowRows.length || workflowSummary.workflow_count || 0),
        detail: `${fmtNumber(representedTeams || workflowSummary.teams_with_adoption || 0)} teams and ${fmtNumber(new Set(workflowRows.map((row) => row.service_name).filter(Boolean)).size || workflowSummary.ai_services_used || 0)} AI services represented in the selected scope.`,
        actions: [priorityAction("Show Organization Adoption", "adoption-set-scope", { data: { "scope-type": "organization", "scope-id": "org-novatech" } })]
      };
    }
    case "attribution": {
      const request = lowestConfidenceRequest || selectedRequest;
      const confidencePct = Number((request || selectedRequest)?.confidence || 0) * 100;
      return {
        title: "Inspect the request that needs the clearest proof.",
        label: "Attribution confidence",
        value: fmtPct(confidencePct, 0),
        detail: `${chainNode(request || selectedRequest, "Service Attribution")?.value || "Selected request"} resolves to ${chainNode(request || selectedRequest, "Org Hierarchy")?.value || "review required"}.`,
        actions: request ? [priorityAction("Inspect Request Proof", "select-request", { data: { "request-id": request.id } })] : []
      };
    }
    case "models":
      return {
        title: "Focus on the model creating the biggest planning decision.",
        label: selectedModel?.name || "Model estate",
        value: selectedModel ? fmtUSD(selectedModel.spend_usd || 0) : fmtNumber((dataset.models || []).length),
        detail: selectedModel
          ? `${fmtNumber(selectedModel.requests || 0)} requests with ${fmtUSD(selectedModel.optimization_potential_usd || 0)} optimization potential.`
          : "Model records are unavailable; reset the demo to restore seeded data.",
        actions: selectedModel ? [priorityAction("Select Highest-Spend Model", "select-model", { data: { "model-name": selectedModel.name } })] : []
      };
    case "teams":
      return {
        title: "Open the team with the largest addressable opportunity.",
        label: selectedTeam?.name || "Teams",
        value: selectedTeam ? fmtUSD(selectedTeam.optimization_potential_usd || 0) : fmtNumber((dataset.teams || []).length),
        detail: selectedTeam
          ? `${fmtUSD(selectedTeam.spend_usd || 0)} current spend under ${selectedTeam.lead || "named owner"}.`
          : "Team records are unavailable; reset the demo to restore seeded data.",
        actions: selectedTeam ? [priorityAction("Open Team Detail", "select-team", { data: { "team-id": selectedTeam.id } })] : []
      };
    case "manual_mapping":
      return {
        title: "Resolve the ownership queue before finance trusts chargeback.",
        label: "Open mappings",
        value: fmtNumber(mappings.needs_review + mappings.deferred),
        detail: `${fmtNumber(mappings.confirmed + mappings.reassigned)} mappings are already resolved in the local story.`,
        actions: openMapping?.request_id
          ? [priorityAction("Inspect Ownership Evidence", "manual-map-open-request", { data: { "request-id": openMapping.request_id } })]
          : []
      };
    case "interventions": {
      const openActions = interventionCountsByStatus.recommended + interventionCountsByStatus.review;
      return {
        title: "Move one recommendation from insight to execution.",
        label: "Open actions",
        value: fmtNumber(openActions),
        detail: topIntervention
          ? `${topIntervention.title} can affect ${fmtUSD(topIntervention.monthly_savings_usd || 0)} per month.`
          : "No intervention is selected in the local dataset.",
        actions: topIntervention ? [priorityAction("Start Savings Review", "intervention-status", { data: { "intervention-id": topIntervention.id, "next-status": "review" } })] : []
      };
    }
    case "governance":
      return {
        title: "Keep the policy posture visible before automation.",
        label: "Deployment mode",
        value: modeLabel(state.mode),
        detail: `${fmtNumber(governancePolicies.length)} policy bundles show confidence floors, model controls, and fail-open behavior.`,
        actions: [priorityAction("Export Exception Log", "export-artifact", { data: { artifact: "governance-log" } })]
      };
    case "coverage":
      return {
        title: "Separate captured truth from known blind spots.",
        label: "Capture coverage",
        value: fmtPct(coverageSummary.capture_coverage_pct || 0),
        detail: `${fmtNumber(coverageSummary.blind_spot_count || 0)} blind spots remain explicit, not hidden in the demo math.`,
        actions: [priorityAction("Open Request Proof", "go", { page: "attribution" })]
      };
    case "exports":
      return {
        title: "Export only the spend finance can defend.",
        label: "Chargeback ready",
        value: fmtUSD(exportSummary.exportable_chargeback_usd || 0),
        detail: `${fmtUSD(exportSummary.provisional_review_usd || 0)} remains in review and ${fmtUSD(exportSummary.unknown_excluded_usd || 0)} is excluded.`,
        actions: [priorityAction("Export Chargeback Preview", "export-artifact", { data: { artifact: "chargeback-export" } })]
      };
    case "energy":
      return {
        title: "Show energy estimates without pretending unknowns are known.",
        label: "Known requests",
        value: fmtPct(energySummary.energy_known_request_pct || 0),
        detail: `${fmtNumber(energySummary.unrated_model_count || 0)} models remain explicitly unrated in the local demo.`,
        actions: [priorityAction("Open Models", "go", { page: "models" })]
      };
    case "forecast": {
      const projectedValue = forecast.finalPoint
        ? fmtUSD(forecast.finalPoint.predicted_spend_usd || 0)
        : signedPct(forecast.scenarioDeltaPct || 0);
      return {
        title: "Turn the current scenario into a planning number.",
        label: forecast.finalPoint ? "Projected spend" : "Scenario delta",
        value: projectedValue,
        detail: `${forecast.scenario.label} over ${fmtNumber(state.forecastHorizonMonths)} months from the seeded spend curve.`,
        actions: [priorityAction("Generate Live Forecast", "forecast-generate")]
      };
    }
    case "integrations":
      return {
        title: "Prove insights become operational handoffs.",
        label: "Delivery success",
        value: fmtPct(integrationSummary.success_rate_pct || 0, 0),
        detail: `${fmtNumber(integrationSummary.recent_delivery_count || 0)} recent simulated handoffs across ${fmtNumber(integrationSummary.outbound_route_count || 0)} routes.`,
        actions: firstScenario
          ? [priorityAction("Run Handoff Scenario", "integrations-run-scenario", { data: { "scenario-id": firstScenario.scenario_id } })]
          : [priorityAction("Refresh Integration Feed", "integrations-refresh")]
      };
    case "admin":
      return {
        title: "Make the local trust boundary inspectable.",
        label: "Demo accounts",
        value: fmtNumber((admin.accounts || []).length),
        detail: `${fmtNumber(admin.summary?.mutation_surfaces || 0)} local mutation surfaces remain audited and demo-only.`,
        actions: [priorityAction("Open Governance", "go", { page: "governance" })]
      };
    case "glossary":
      return {
        title: "Use this as the shared vocabulary for the walkthrough.",
        label: "Terms",
        value: fmtNumber((dataset.glossary || []).length),
        detail: "Definitions keep investor, design partner, finance, platform, and security language aligned.",
        actions: [priorityAction("Open FAQ", "go", { page: "faq" })]
      };
    case "faq":
      return {
        title: "Answer the first diligence question before drilling deeper.",
        label: "Answers",
        value: fmtNumber(faqCount),
        detail: "The FAQ focuses the conversation on product behavior, local-only boundaries, and production parity.",
        actions: [priorityAction("Open Overview", "go", { page: "overview" })]
      };
    default:
      return {
        title: `${title} focus`,
        label: "Primary action",
        value: "Review",
        detail: "Use the visible controls to continue the local demo path.",
        actions: [priorityAction("Open Overview", "go", { page: "overview" })]
      };
  }
}

function pagePriorityMarkup() {
  const signal = pagePrioritySignal();
  if (!signal) {
    return "";
  }

  return `
    <section class="screen-priority screen-priority-${esc(signal.tone || "focus")}" data-visual-role="dominant" aria-label="${esc((PAGE_TITLES[state.page] || "Current page") + " primary focus")}">
      <div class="screen-priority-copy">
        <div class="screen-priority-eyebrow">Screen focus</div>
        <div class="screen-priority-title">${esc(signal.title)}</div>
        <div class="screen-priority-detail">${esc(signal.detail || "")}</div>
      </div>
      <div class="screen-priority-measure">
        <span>${esc(signal.label || "Primary metric")}</span>
        <strong>${esc(signal.value || "Ready")}</strong>
      </div>
      ${stateActionButtonsMarkup(signal.actions || [])}
    </section>
  `;
}

function pageStateStripMarkup() {
  if (isEntryHomeActive()) {
    return "";
  }
  const loadingMessage = currentPageLoadingLabel();
  if (loadingMessage) {
    return loadingStateMarkup("Working", loadingMessage, { compact: true, className: "page-state-strip" });
  }
  if (state.recoveryNotice) {
    return explicitStateMarkup(
      state.recoveryNotice.severity === "error" ? "error" : "warn",
      state.recoveryNotice.title,
      state.recoveryNotice.message,
      {
        compact: true,
        className: "page-state-strip",
        detail: state.recoveryNotice.detail
      }
    );
  }
  if (state.runtimeStatus === "offline") {
    return errorStateMarkup("Local runtime offline", state.runtimeDetail || "The UI is using local demo data only.", {
      compact: true,
      className: "page-state-strip",
      actions: [{ label: "Reset Demo", action: "clear-logs", primary: true }]
    });
  }
  if (state.runtimeStatus === "degraded") {
    return explicitStateMarkup("warn", "Runtime partially available", state.runtimeDetail || "Some live proof controls may use local fallbacks.", {
      compact: true,
      className: "page-state-strip",
      actions: [{ label: "Guided Demo", action: "open-drawer" }]
    });
  }
  return "";
}

function renderViewWithState(markup) {
  const contentMarkup = markup || errorStateMarkup("View unavailable", "This page returned no content. Use Reset Demo to restore the seeded baseline.");
  return `${pageStateStripMarkup()}${pagePriorityMarkup()}<div class="screen-secondary-content" data-visual-role="secondary">${contentMarkup}</div>`;
}

function visibleDrawerEntries() {
  const seen = new Set();
  return state.logs.filter((entry) => {
    if (entry.hidden) {
      return false;
    }
    const normalizedTitle = String(entry.title || "").toLowerCase();
    const isOfflineNoise = normalizedTitle === "live runtime unavailable" || normalizedTitle === "live proof action unavailable";
    const key = isOfflineNoise ? normalizedTitle : `${entry.title}|${entry.message}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function isUnavailableDemoOutcome(outcome) {
  if (!outcome) {
    return false;
  }
  const title = String(outcome.title || "").toLowerCase();
  const headline = String(outcome.headline || "").toLowerCase();
  return title.includes("unavailable") || headline.includes("could not be") || headline.includes("needs the local demo api");
}

function setDemoOutcome(outcome) {
  state.demoOutcome = outcome;
}

function interceptOutcomeLabel(outcome) {
  const map = {
    passthrough: "Allowed",
    enriched: "Enriched",
    soft_stopped: "Policy Warning",
    hard_stopped: "Blocked",
    redirected: "Redirected",
    fail_open: "Fail-Open",
    timeout: "Fail-Open",
    circuit_open: "Fail-Open"
  };
  return map[String(outcome || "").toLowerCase()] || String(outcome || "Unknown");
}

function scenarioNarrative(kind) {
  const map = {
    enriched: {
      title: "Attributed Request",
      headline: "High-confidence attribution completed without adding friction.",
      why: "This proves the platform can identify the accountable team and policy posture in the request path without interrupting a normal workload."
    },
    soft_stop: {
      title: "Policy Intervention",
      headline: "The request surfaced a governance warning before spend drifted further.",
      why: "This shows governance can be applied as an explainable operating control instead of a black-box blocker."
    },
    fail_open: {
      title: "Fail-Open Safety",
      headline: "The workload continued even though attribution context was unavailable.",
      why: "This shows the control plane does not become a production outage. Availability wins while the system records what happened."
    }
  };
  return map[kind] || {
    title: "Scenario",
    headline: "Scenario executed.",
    why: "This action demonstrates a live platform behavior."
  };
}

function appendLog(level, title, message, payload, options = {}) {
  state.logs.unshift({
    level,
    title,
    message,
    payload,
    at: nowLabel(),
    why: options.why || "",
    hidden: Boolean(options.hidden)
  });
  state.logs = state.logs.slice(0, UI_LIMITS.maxLogEntries);
  renderDrawer();
  renderTopbar();
  // FIX: keep the newest guided-demo entry visible after each log append.
  const drawerBody = document.querySelector(".drawer-body");
  if (drawerBody instanceof HTMLElement) {
    drawerBody.scrollTop = 0;
  }
}

function setPendingDemoAction(actionKey, progressLabel = "") {
  state.pendingDemoAction = actionKey;
  state.guidedDemoProgressLabel = progressLabel;
  renderDrawer();
}

function syncGuidedActionButtons() {
  const progress = document.getElementById("drawer-progress");
  if (progress) {
    progress.textContent = state.guidedDemoProgressLabel || "";
  }

  const allButtons = Array.from(document.querySelectorAll("#execution-drawer .drawer-actions .small-btn"));
  // FIX: reflect drawer busy state at the container level as well as on individual buttons.
  const actionRow = document.querySelector("#execution-drawer .drawer-actions");
  if (actionRow instanceof HTMLElement) {
    actionRow.classList.toggle("busy", Boolean(state.pendingDemoAction));
  }
  for (const button of allButtons) {
    if (!(button instanceof HTMLButtonElement)) {
      continue;
    }
    const action = button.dataset.action || "";
    const scenario = button.dataset.scenario || "";
    const key = action === "run-scenario" ? `run-scenario:${scenario}` : action;
    const defaultLabel = button.dataset.defaultLabel || button.textContent.trim();
    button.dataset.defaultLabel = defaultLabel;
    const isBusy = Boolean(state.pendingDemoAction);
    const isActive = state.pendingDemoAction === key;
    button.disabled = isBusy;
    button.dataset.loading = isActive ? "true" : "false";
    button.setAttribute("aria-busy", isActive ? "true" : "false");
    if (isActive) {
      button.textContent = action === "run-sequence" || action === "start-walkthrough"
        ? "Running..."
        : action === "bootstrap-demo"
          ? "Initializing..."
          : "Working...";
    } else {
      button.textContent = defaultLabel;
    }
  }
}

async function clearExecutionLogs() {
  if (!window.confirm("Reset the guided demo, mapping queue, and forecast state?")) {
    return;
  }
  const keepPresenterMode = state.presenterMode;
  stopInvestorWalkthrough();
  clearDemoSessionStorage();
  clearRecoveryNotice();
  clearPersonaNotice();
  state.logs = [];
  state.lastPayload = null;
  state.lastResponse = null;
  state.demoOutcome = null;
  state.demoScenarioRunCounts = {};
  state.selectedTeamId = null;
  state.selectedRequestId = null;
  state.selectedModelName = null;
  state.selectedInterventionId = null;
  state.roleLens = "executive";
  state.interventionFilter = "all";
  state.forecastCompareKeys = ["baseline", "growth_push", "policy_hardened", "optimization_capture"];
  state.adoptionHierarchy = null;
  state.adoptionDashboardCache = {};
  state.adoptionScopeType = "organization";
  state.adoptionScopeId = null;
  state.adoptionWindowDays = 30;
  state.adoptionLoading = false;
  state.interventionLoading = false;
  state.interventionSyncAttempted = false;
  state.integrationOverview = null;
  state.integrationLoading = false;
  state.integrationDeliveries = [];
  state.glossaryQuery = "";
  state.faqQuery = "";
  state.formStatus = {};
  state.tableUi = {};
  state.faqOpenKeys = new Set();
  state.deferredSectionsVisible = new Set();
  state.governanceSimulationMode = "advisory";
  state.governanceSimulationBundle = "current";
  state.governanceSimulationRequestId = null;
  state.replayStageIndex = 0;
  state.lastMappingImpactId = null;
  state.instantFeedback = null;
  state.presenterMode = keepPresenterMode;
  state.presenterStepIndex = 0;
  state.presenterRecoveryNotice = keepPresenterMode
    ? "Reset complete. Presenter mode is back at step 1."
    : "";
  state.page = "overview";
  state.runtimeCapabilities = {};
  await loadDataset();
  hydrateInterventionStatuses();
  hydrateManualMappingState();
  applyDatasetMetadata();
  applyAdoptionHierarchy(fallbackAdoptionHierarchy(), { preserveSelection: false });
  state.integrationOverview = fallbackIntegrationOverview();
  state.integrationDeliveries = Array.isArray(state.integrationOverview?.recent_deliveries)
    ? state.integrationOverview.recent_deliveries
    : [];
  const backendReset = await resetBackendDemoState({ log: false, toast: false });
  await resetForecastPlanner({
    log: false,
    toast: false,
    statusOverride: "Forecast reset to baseline 12-month view."
  });
  appendLog("ok", "Demo reset", "The walkthrough, mapping queue, forecast planner, and backend runtime returned to their baseline investor-demo state.", backendReset ? state.lastResponse : null, {
    why: "This gives you a clean starting point before presenting the demo again."
  });
  showToast("Demo Reset", "The platform demo is back to its baseline presentation state.");
  render();
}

function setMobileNav(open) {
  state.mobileNavOpen = Boolean(open);
  const drawer = document.getElementById("mobile-nav-drawer");
  const scrim = document.getElementById("mobile-nav-scrim");
  const toggle = document.getElementById("mobile-nav-toggle");
  if (drawer) {
    drawer.classList.toggle("open", state.mobileNavOpen);
    drawer.setAttribute("aria-hidden", state.mobileNavOpen ? "false" : "true");
  }
  if (scrim) {
    scrim.classList.toggle("open", state.mobileNavOpen);
  }
  if (toggle) {
    toggle.setAttribute("aria-expanded", state.mobileNavOpen ? "true" : "false");
  }
}

function setExecutionDrawer(open) {
  state.executionDrawerOpen = Boolean(open);
  const drawer = document.getElementById("execution-drawer");
  const scrim = document.getElementById("drawer-scrim");
  const trigger = document.getElementById("open-guided-demo");
  if (drawer) {
    drawer.classList.toggle("open", state.executionDrawerOpen);
    drawer.setAttribute("aria-hidden", state.executionDrawerOpen ? "false" : "true");
  }
  if (scrim) {
    scrim.classList.toggle("open", state.executionDrawerOpen);
  }
  if (trigger) {
    trigger.setAttribute("aria-expanded", state.executionDrawerOpen ? "true" : "false");
  }
  if (state.executionDrawerOpen) {
    lastActiveElementBeforeDrawer = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    window.requestAnimationFrame(() => {
      const firstButton = document.querySelector("#execution-drawer [data-action='start-walkthrough']");
      if (firstButton instanceof HTMLElement) {
        firstButton.focus();
      }
    });
  } else if (lastActiveElementBeforeDrawer instanceof HTMLElement) {
    lastActiveElementBeforeDrawer.focus({ preventScroll: true });
    lastActiveElementBeforeDrawer = null;
  }
}

function toggleModeMenu() {
  state.modeMenuOpen = !state.modeMenuOpen;
  renderModeMenu();
}

async function setMode(modeKey) {
  try {
    const response = await apiRequest("POST", "/v1/demo/mode", { mode: modeKey });
    state.mode = String(response?.interceptor_mode || modeKey).toLowerCase();
    state.governanceSimulationMode = state.mode;
    showToast("Deployment Mode Updated", `Current mode: ${modeLabel(state.mode)}`);
  } catch (error) {
    state.mode = modeKey;
    state.governanceSimulationMode = state.mode;
    appendLog("warn", "Mode sync fallback", summarizeApiError(error, "Backend mode update unavailable; applying local demo state."), null, { hidden: true });
    showToast("Deployment Mode Updated", `Current mode: ${modeLabel(state.mode)}`);
  }
  state.modeMenuOpen = false;
  render();
}

function modeLabel(modeKey) {
  const map = {
    passive: "Passive Observation",
    advisory: "Advisory",
    active: "Active"
  };
  return map[modeKey] || "Advisory";
}

function statusColor(status) {
  const normalized = normalizeStatus(status);
  if (normalized === "approved" || normalized === "implemented") {
    return "var(--green)";
  }
  if (normalized === "review") {
    return "var(--amber)";
  }
  if (normalized === "dismissed") {
    return "var(--red)";
  }
  return "var(--blue)";
}

function applyInterventionApiRows(rows) {
  if (!Array.isArray(rows)) {
    return;
  }
  const incoming = rows;

  const current = getInterventions();
  const currentById = new Map(current.map((item) => [item.id, item]));
  const merged = incoming.map((row) => {
    const existing = currentById.get(row.intervention_id);
    return {
      id: row.intervention_id,
      title: row.title,
      type: row.intervention_type,
      status: normalizeStatus(row.status),
      savings_usd_month: Number(row.savings_usd_month || 0),
      confidence_pct: Number(row.confidence_pct || 0),
      risk: row.risk,
      team: row.team,
      detail: row.detail,
      equivalence_mode: row.equivalence_mode,
      equivalence_status: row.equivalence_status,
      methodology: {
        category: row.methodology?.category || existing?.methodology?.category || "",
        threshold: row.methodology?.threshold_condition || existing?.methodology?.threshold || "",
        rule: row.methodology?.rule_condition || existing?.methodology?.rule || ""
      }
    };
  });

  dataset.interventions = merged;
  rebuildDatasetIndex();
  if (state.selectedInterventionId && !merged.some((item) => item.id === state.selectedInterventionId)) {
    state.selectedInterventionId = merged[0]?.id || null;
  }
}

async function syncInterventionsFromApi(options = {}) {
  const shouldRender = Boolean(options.render !== false);
  if (state.interventionLoading) {
    return;
  }
  state.interventionLoading = true;
  try {
    const payload = await apiRequest("GET", "/v1/interventions");
    applyInterventionApiRows(payload.interventions);
    state.interventionSyncAttempted = true;
    persistInterventionStatuses();
  } catch (error) {
    state.interventionSyncAttempted = true;
    appendLog("warn", "Intervention sync fallback", summarizeApiError(error, "Live intervention sync unavailable; using demo dataset state."), null, { hidden: true });
  } finally {
    state.interventionLoading = false;
    if (shouldRender && state.page === "interventions") {
      render();
    }
  }
}

async function updateInterventionStatus(id, nextStatus) {
  const intervention = indexedLookup(datasetIndex.interventionsById, id);
  if (!intervention) {
    return;
  }
  syncContextFromIntervention(id);
  const normalized = normalizeStatus(nextStatus);
  const currentStatus = normalizeStatus(intervention.status);
  const allowedTransitions = VALID_INTERVENTION_TRANSITIONS[currentStatus] || new Set();
  if (!allowedTransitions.has(normalized)) {
    showToast("Transition Blocked", `${currentStatus} cannot transition directly to ${normalized}.`);
    appendLog("warn", "Intervention transition blocked", `${id} attempted invalid transition from ${currentStatus} to ${normalized}.`, null, { hidden: true });
    return;
  }

  const previousStatus = currentStatus;
  intervention.status = normalized;
  persistInterventionStatuses();
  render();

  try {
    const response = await apiRequest("POST", `/v1/interventions/${id}/status`, {
      status: normalized,
      actor: "demo-ui",
      note: "Updated via platform demo controls"
    });
    intervention.status = normalizeStatus(response.status);
  } catch (error) {
    appendLog("warn", "Intervention update kept local", summarizeApiError(error, "Live intervention status update unavailable; the local demo retained the visible optimistic state."), {
      intervention_id: id,
      previous_status: previousStatus,
      local_status: normalized
    }, {
      hidden: true,
      why: "The demo uses synthetic data, so local intervention workflow feedback stays responsive when the API is offline."
    });
    showToast("Intervention Saved Locally", `${id} is ${normalized.replace("_", " ")} in the local demo state.`);
    render();
    return;
  }

  persistInterventionStatuses();
  const statusText = intervention.status.replace("_", " ");
  showToast("Intervention Updated", `${id} set to ${statusText}.`);
  render();
}

async function updateManualMapping(id, status, resolvedTeam) {
  const mapping = indexedLookup(datasetIndex.manualMappingsById, id);
  if (!mapping) {
    return;
  }
  mapping.status = normalizeManualMappingStatus(status);
  mapping.resolved_team = mapping.status === "deferred"
    ? mapping.current_owner
    : (resolvedTeam || mapping.suggested_owner || mapping.current_owner);
  mapping.updated_at = nowLabel();
  state.lastMappingImpactId = mapping.id;
  syncContextFromRequest(mapping.request_id || "");
  applyManualMappingToRequest(mapping);
  persistManualMappingState();
  const correction = await submitManualMappingCorrection(mapping);
  const outcomeMessage = mapping.status === "deferred"
    ? `${mapping.workload_label} remains provisional until stronger evidence is available.`
    : `${mapping.workload_label} now resolves to ${mapping.resolved_team}.`;
  appendLog("ok", "Manual mapping updated", outcomeMessage, null, { hidden: true });
  const correctionSuffix = correction ? " Durable correction event recorded." : "";
  showToast("Manual Mapping Updated", `${outcomeMessage}${correctionSuffix}`);
  render();
}

function teamForManualMappingOwner(ownerName) {
  return indexedLookup(datasetIndex.teamsByName, ownerName);
}

function fallbackTeamId(ownerName) {
  return `team-${String(ownerName || "unknown")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "unknown"}`;
}

function fallbackCostCenterId(team) {
  if (!team) {
    return "CC-MANUAL";
  }
  return `CC-${String(team.id || team.name || "manual").toUpperCase().replace(/[^A-Z0-9]+/g, "-")}`;
}

async function submitManualMappingCorrection(mapping) {
  const status = normalizeManualMappingStatus(mapping.status);
  if (status === "deferred") {
    appendLog(
      "ok",
      "Manual mapping deferred",
      `${mapping.workload_label} remains provisional; no durable correction event was emitted.`,
      null,
      { hidden: true }
    );
    return null;
  }

  const resolvedTeamName = mapping.resolved_team || mapping.suggested_owner || mapping.current_owner;
  const team = teamForManualMappingOwner(resolvedTeamName);
  const payload = {
    workload_id: mapping.workload_label,
    true_team_id: team?.id || fallbackTeamId(resolvedTeamName),
    true_team_name: resolvedTeamName,
    true_cost_center_id: team?.cost_center_id || fallbackCostCenterId(team),
    true_cost_center_name: team?.cost_center || `${resolvedTeamName} Cost Center`,
    actor: "demo-ui",
    note: `Manual mapping ${mapping.id} resolved from the local demo UI.`
  };

  try {
    const response = await apiRequest("POST", "/v1/attribution/manual", payload);
    appendLog(
      "ok",
      "Manual correction emitted",
      `${mapping.workload_label} wrote a durable correction event and updated the attribution index.`,
      response,
      { hidden: true }
    );
    return response;
  } catch (error) {
    appendLog(
      "warn",
      "Manual correction fallback",
      summarizeApiError(error, "Live manual correction unavailable; keeping the local review state visible."),
      null,
      { hidden: true }
    );
    return null;
  }
}

function go(pageKey) {
  if (!PAGE_TITLES[pageKey]) {
    return;
  }
  const persona = activeDemoPersona();
  if (!personaCanAccessPage(pageKey, persona)) {
    setPersonaNotice(
      "Permission Preview",
      `${persona.label} cannot open ${PAGE_TITLES[pageKey] || pageKey} in the local RBAC demo.`,
      `Switch to Admin, Auditor, or another permitted persona to view that surface.`
    );
    appendLog("warn", "Persona access blocked", `${persona.name} attempted to open ${PAGE_TITLES[pageKey] || pageKey}.`, null, {
      hidden: true,
      why: "The local demo keeps persona permission boundaries visible without calling production identity systems."
    });
    renderRoleRibbon();
    renderSidebar();
    return;
  }
  clearPersonaNotice();
  const viewRoot = document.getElementById("view-root");
  if (viewRoot) {
    state.scrollTopByPage[state.page] = viewRoot.scrollTop;
  }
  state.page = pageKey;
  state.scrollTopByPage[pageKey] = 0;
  state.modeMenuOpen = false;
  state.mobileNavOpen = false;
  if (pageKey === "adoption" && !currentAdoptionDashboard() && !state.adoptionLoading) {
    void syncAdoptionFromApi({ preserveSelection: true });
  }
  if (pageKey === "interventions" && !state.interventionSyncAttempted && !state.interventionLoading) {
    void syncInterventionsFromApi({ render: false });
  }
  if (pageKey === "integrations" && state.runtimeStatus === "online" && !state.integrationLoading) {
    void syncIntegrationsFromApi({ force: !state.integrationOverview });
  }
  render();
}

function demoPathIndexForPage(pageKey = state.page) {
  return DEMO_PATH_ITEMS.findIndex((item) => item.page === pageKey);
}

function demoPathItemForPage(pageKey = state.page) {
  const index = demoPathIndexForPage(pageKey);
  return index >= 0 ? DEMO_PATH_ITEMS[index] : null;
}

function nearestDemoPathPage(pageKey = state.page) {
  return demoPathItemForPage(pageKey)?.page
    || SUPPORTING_PAGE_DEMO_PATH_TARGETS[pageKey]
    || "overview";
}

function nextDemoPathPage(pageKey = state.page) {
  const index = demoPathIndexForPage(pageKey);
  if (index < 0) {
    return nearestDemoPathPage(pageKey);
  }
  const nextItem = DEMO_PATH_ITEMS[Math.min(index + 1, DEMO_PATH_ITEMS.length - 1)];
  return nextItem?.page || "overview";
}

function demoPathTargetPage(pageKey = state.page, persona = activeDemoPersona()) {
  const preferred = demoPathItemForPage(pageKey)
    ? nextDemoPathPage(pageKey)
    : nearestDemoPathPage(pageKey);
  if (personaCanAccessPage(preferred, persona)) {
    return preferred;
  }
  return DEMO_PATH_ITEMS.find((item) => personaCanAccessPage(item.page, persona))?.page || "overview";
}

function demoPathProgressLabel(pageKey = state.page, persona = activeDemoPersona()) {
  const allowedItems = DEMO_PATH_ITEMS.filter((item) => personaCanAccessPage(item.page, persona));
  const item = allowedItems.find((pathItem) => pathItem.page === pageKey);
  if (!item) {
    const target = demoPathItemForPage(nearestDemoPathPage(pageKey));
    return target ? `Return to ${target.step} ${target.label}` : "Return to demo path";
  }
  const index = allowedItems.findIndex((pathItem) => pathItem.page === pageKey);
  const lastStep = index === allowedItems.length - 1;
  return lastStep ? "Demo path complete" : `${String(index + 1).padStart(2, "0")} of ${String(allowedItems.length).padStart(2, "0")}: ${item.label}`;
}

function renderDemoPathNav(persona = activeDemoPersona()) {
  const currentIndex = demoPathIndexForPage(state.page);
  const nearestPage = nearestDemoPathPage(state.page);
  const nearestIndex = demoPathIndexForPage(nearestPage);
  const targetPage = demoPathTargetPage(state.page, persona);
  const targetItem = demoPathItemForPage(targetPage);
  const backLabel = demoPathItemForPage(state.page) ? "Next Step" : "Back To Path";
  const pathItems = DEMO_PATH_ITEMS.filter((item) => personaCanAccessPage(item.page, persona)).map((item) => {
    const index = demoPathIndexForPage(item.page);
    const active = item.page === state.page;
    const nearby = !active && index === nearestIndex && currentIndex < 0;
    const complete = currentIndex >= 0 && index < currentIndex;
    return `
      <button class="demo-path-step${active ? " active" : ""}${nearby ? " nearby" : ""}${complete ? " complete" : ""}" data-action="go" data-page="${esc(item.page)}" ${active ? 'aria-current="step"' : ""} aria-label="${esc(item.step)} ${esc(item.label)}">
        <span class="demo-path-number">${esc(item.step)}</span>
        <span class="demo-path-copy">
          <strong>${esc(item.label)}</strong>
          <em>${esc(item.detail)}</em>
        </span>
      </button>
    `;
  }).join("");

  return `
    <div class="demo-path-nav" aria-label="Primary demo path">
      <div class="demo-path-head">
        <div>
          <div class="demo-path-title">Demo Path</div>
          <div class="demo-path-status">${esc(demoPathProgressLabel(state.page, persona))}</div>
        </div>
        <button class="demo-path-return" data-action="back-to-demo-path" data-page="${esc(targetPage)}" aria-label="${esc(backLabel)}${targetItem ? ` to ${targetItem.label}` : ""}">
          ${esc(backLabel)}
        </button>
      </div>
      <div class="demo-path-steps">${pathItems}</div>
    </div>
  `;
}

function renderSidebar() {
  const nav = document.getElementById("sidebar-nav");
  const mobileNav = document.getElementById("mobile-sidebar-nav");
  if (!nav && !mobileNav) {
    return;
  }
  const counts = interventionCounts();
  const mappingCounts = manualMappingCounts();
  const persona = activeDemoPersona();
  const directoryMarkup = NAV_ITEMS.map((group) => {
    const allowedItems = group.items.filter((item) => personaCanAccessPage(item.key, persona));
    if (!allowedItems.length) {
      return "";
    }
    const items = allowedItems.map((item) => {
      const isActive = item.key === state.page;
      let badge = "";
      if (item.key === "interventions") {
        const interventionCount = counts.recommended + counts.review;
        if (interventionCount > 0) {
          badge = `<span class="nav-badge">${interventionCount}</span>`;
        }
      } else if (item.key === "manual_mapping") {
        const mappingCount = mappingCounts.needs_review + mappingCounts.deferred;
        if (mappingCount > 0) {
          badge = `<span class="nav-badge">${mappingCount}</span>`;
        }
      }
      return `
        <button class="nav-item${isActive ? " active" : ""}" data-action="go" data-page="${esc(item.key)}" aria-label="${esc(item.label)}" ${isActive ? 'aria-current="page"' : ""}>
          ${renderLineIcon(item.icon)}
          <span>${esc(item.label)}</span>
          ${badge}
        </button>
      `;
    }).join("");

    return `
      <div class="nav-group">
        <div class="nav-label">${esc(group.group)}</div>
        ${items}
      </div>
    `;
  }).join("");
  const markup = `${renderDemoPathNav(persona)}${directoryMarkup}`;
  if (nav) {
    nav.innerHTML = markup;
  }
  if (mobileNav) {
    mobileNav.innerHTML = markup;
  }
}

function renderModeMenu() {
  const menu = document.getElementById("mode-menu");
  if (!menu) {
    return;
  }

  const modes = dataset.governance?.modes || [];
  const persona = activeDemoPersona();
  const canSetMode = personaCanUseActionDescriptor("set-mode", {}, persona);
  menu.classList.toggle("open", state.modeMenuOpen);
  menu.setAttribute("aria-hidden", state.modeMenuOpen ? "false" : "true");
  menu.innerHTML = `
    <div class="mode-menu-title">Deployment Modes</div>
    ${modes.map((mode) => {
      const active = mode.key === state.mode;
      return `
        <div class="mode-option">
          <div class="mode-head">
            <div class="mode-name">${esc(mode.label)}</div>
            <span class="mode-tag">${active ? "Current" : "Available"}</span>
          </div>
          <div class="mode-desc">${esc(mode.description || "")}</div>
          <div class="mode-desc" style="margin-top:3px">${esc(mode.impact || "")}</div>
          ${active || !canSetMode ? "" : `<button class="mode-set-btn" data-action="set-mode" data-mode="${esc(mode.key)}">Set ${esc(mode.label)}</button>`}
        </div>
      `;
    }).join("")}
  `;

  const modeButton = document.getElementById("mode-button");
  const colors = MODE_COLORS[state.mode] || MODE_COLORS.advisory;
  if (modeButton) {
    modeButton.textContent = modeLabel(state.mode);
    modeButton.style.background = colors.bg;
    modeButton.style.color = colors.color;
    modeButton.style.borderColor = colors.color + "55";
    modeButton.setAttribute("aria-expanded", state.modeMenuOpen ? "true" : "false");
  }
}

function renderTopbar() {
  const topbar = document.querySelector(".topbar");
  if (topbar) {
    topbar.classList.toggle("entry-home-active", isEntryHomeActive());
  }
  const title = document.getElementById("page-title");
  if (title) {
    title.textContent = PAGE_TITLES[state.page] || "Overview";
  }
  const walkthroughButton = document.getElementById("start-walkthrough");
  if (walkthroughButton instanceof HTMLButtonElement) {
    const running = state.walkthroughStatus === "running";
    walkthroughButton.disabled = running;
    walkthroughButton.textContent = running ? "Walkthrough Running..." : "Start Guided Demo";
    walkthroughButton.setAttribute("aria-expanded", running ? "true" : "false");
  }
  const presenterButton = document.getElementById("presenter-mode-toggle");
  if (presenterButton instanceof HTMLButtonElement) {
    presenterButton.textContent = state.presenterMode ? "Presenter On" : "Presenter Mode";
    presenterButton.setAttribute("aria-pressed", state.presenterMode ? "true" : "false");
    presenterButton.classList.toggle("active", state.presenterMode);
  }
  const pathReturnButton = document.getElementById("back-to-demo-path");
  if (pathReturnButton instanceof HTMLButtonElement) {
    const onPath = Boolean(demoPathItemForPage(state.page));
    const targetPage = demoPathTargetPage();
    const targetItem = demoPathItemForPage(targetPage);
    pathReturnButton.dataset.page = targetPage;
    pathReturnButton.textContent = onPath ? "Next Demo Step" : "Back to Demo Path";
    pathReturnButton.title = targetItem
      ? `${onPath ? "Continue" : "Return"} to ${targetItem.step} ${targetItem.label}: ${targetItem.detail}`
      : "Return to the recommended demo path";
    pathReturnButton.setAttribute("aria-label", pathReturnButton.title);
    pathReturnButton.hidden = isEntryHomeActive();
  }
  const streamCount = document.getElementById("stream-count");
  if (streamCount) {
    const count = visibleDrawerEntries().length;
    streamCount.textContent = String(count);
    streamCount.classList.toggle("is-empty", count === 0);
  }
  const runtimeChip = document.getElementById("runtime-chip");
  const runtimeLabel = document.getElementById("runtime-label");
  const runtimeDetail = document.getElementById("runtime-detail");
  const mobileToggle = document.getElementById("mobile-nav-toggle");
  if (runtimeChip) {
    runtimeChip.classList.toggle("offline", state.runtimeStatus === "offline");
    runtimeChip.classList.toggle("degraded", state.runtimeStatus === "degraded");
  }
  if (runtimeLabel) {
    runtimeLabel.textContent = state.runtimeStatus === "offline"
      ? "Demo runtime unavailable"
      : state.runtimeStatus === "degraded"
        ? "Demo runtime partially available"
        : state.runtimeStatus === "online"
          ? "Demo runtime online"
          : "Demo using local data";
  }
  if (runtimeDetail) {
    runtimeDetail.textContent = state.runtimeDetail || "Connected to demo runtime";
  }
  if (mobileToggle) {
    mobileToggle.setAttribute("aria-expanded", state.mobileNavOpen ? "true" : "false");
  }
}

function renderDrawer() {
  const logRoot = document.getElementById("log-stream");
  if (logRoot) {
    const visibleEntries = visibleDrawerEntries();
    logRoot.innerHTML = visibleEntries.length
      ? visibleEntries.map((entry) => {
          return `
            <div class="log-item ${entry.level === "ok" ? "ok" : entry.level === "warn" ? "warn" : entry.level === "err" ? "err" : ""}">
              <div class="log-head"><span>${esc(entry.title)}</span><span>${esc(entry.at)}</span></div>
              <div class="log-msg">${esc(entry.message)}</div>
              ${entry.why ? `<div class="log-why">${esc(entry.why)}</div>` : ""}
            </div>
          `;
        }).join("")
      : emptyStateMarkup(
        "No demo activity yet.",
        "This timeline records the proof points generated during a walkthrough. Start the guided demo to populate it from the seeded NovaTech scenario.",
        {
          compact: true,
          actions: [
            { label: "Start Guided Demo", action: "start-walkthrough", primary: true }
          ]
        }
      );
  }

  const summaryEl = document.getElementById("drawer-summary");
  if (summaryEl) {
    if (!state.demoOutcome) {
      summaryEl.innerHTML = `
        <div class="drawer-summary">
          <div class="drawer-summary-title">Recommended next step</div>
          <div class="drawer-summary-headline">Start the full product walkthrough.</div>
          <div class="drawer-summary-detail">That is the clearest way to tell the product story. Use the live proof controls only when you want to isolate one specific runtime behavior.</div>
        </div>
      `;
    } else if (isUnavailableDemoOutcome(state.demoOutcome)) {
      summaryEl.innerHTML = `
        <div class="drawer-summary">
          <div class="drawer-summary-title">Presentation mode</div>
          <div class="drawer-summary-headline">The walkthrough is available from local demo data.</div>
          <div class="drawer-summary-detail">The product story can still be presented cleanly. Live proof controls will come back once the local demo runtime is reachable from the browser.</div>
          <div class="drawer-summary-grid">
            <div class="drawer-summary-kpi">
              <div class="drawer-summary-kpi-label">Recommended path</div>
              <div class="drawer-summary-kpi-value">Walkthrough</div>
            </div>
            <div class="drawer-summary-kpi">
              <div class="drawer-summary-kpi-label">Live proof controls</div>
              <div class="drawer-summary-kpi-value">Unavailable</div>
            </div>
          </div>
          <div class="drawer-why"><strong>What to do:</strong> Use the full product walkthrough for the presentation, and use live proof controls only after the local demo runtime is available.</div>
        </div>
      `;
    } else {
      summaryEl.innerHTML = `
        <div class="drawer-summary">
          <div class="drawer-summary-title">${esc(state.demoOutcome.title)}</div>
          <div class="drawer-summary-headline">${esc(state.demoOutcome.headline)}</div>
          <div class="drawer-summary-detail">${esc(state.demoOutcome.detail)}</div>
          <div class="drawer-summary-grid">
            ${(state.demoOutcome.metrics || []).map((metric) => `
              <div class="drawer-summary-kpi">
                <div class="drawer-summary-kpi-label">${esc(metric.label)}</div>
                <div class="drawer-summary-kpi-value">${esc(metric.value)}</div>
              </div>
            `).join("")}
          </div>
          <div class="drawer-why"><strong>Why it matters:</strong> ${esc(state.demoOutcome.why)}</div>
        </div>
      `;
    }
  }

  setExecutionDrawer(state.executionDrawerOpen);
  syncGuidedActionButtons();
}

function traceabilityData() {
  return dataset.prd_traceability || FALLBACK_DATASET.prd_traceability || {};
}

function selectedProofJourney() {
  const journeys = traceabilityData().journeys || [];
  return journeys.find((item) => item.key === state.selectedProofJourney) || journeys[0] || null;
}

function renderMiniPills(items = [], className = "proof-pill") {
  return (items || []).map((item) => `<span class="${className}">${esc(item)}</span>`).join("");
}

function requirementsView() {
  const traceability = traceabilityData();
  const lensNarrative = pageLensNarrative("requirements");
  const summary = traceability.summary || {};
  const journeys = traceability.journeys || [];
  const selected = selectedProofJourney();
  const decisionSurfaces = traceability.decision_surfaces || [];
  const railStages = traceability.rail_pipeline || [];
  const invariants = traceability.invariants || [];
  const pathwayRows = traceability.pathway_matrix || [];
  const requirementRows = traceability.requirement_matrix || [];
  const sources = traceability.document_sources || [];

  const journeyButtons = journeys.map((journey) => `
    <button class="proof-journey-btn${journey.key === selected?.key ? " active" : ""}" data-action="select-proof-journey" data-journey-key="${esc(journey.key)}">
      <span>${esc(journey.title)}</span>
      <strong>${esc(journey.status || "mapped")}</strong>
    </button>
  `).join("");

  const proofPoints = (selected?.proof_points || []).map((point) => `
    <li>
      <strong>${esc(point.label)}</strong>
      <span>${esc(point.detail)}</span>
    </li>
  `).join("");

  const surfaceCards = decisionSurfaces.map((surface) => `
    <div class="proof-surface">
      <div class="proof-surface-head">
        <div>
          <div class="card-title">${esc(surface.name)}</div>
          <div class="card-subtitle">${esc(surface.decision)}</div>
        </div>
        <span class="status-badge">${esc(surface.trust_state)}</span>
      </div>
      <div class="proof-surface-grid">
        <div><span>Owner</span><strong>${esc(surface.owner)}</strong></div>
        <div><span>Cadence</span><strong>${esc(surface.cadence)}</strong></div>
        <div><span>Action</span><strong>${esc(surface.action_class)}</strong></div>
        <div><span>Minimum confidence</span><strong>${esc(surface.minimum_confidence)}</strong></div>
      </div>
      <div class="proof-pill-row">${renderMiniPills(surface.truth_domains || [])}</div>
      <div class="hint">${esc(surface.failure_rule || "")}</div>
    </div>
  `).join("");

  const railCards = railStages.map((stage, index) => `
    <div class="rail-stage-card">
      <div class="rail-stage-index">${index + 1}</div>
      <div class="rail-stage-title">${esc(stage.stage)}</div>
      <div class="rail-stage-purpose">${esc(stage.purpose)}</div>
      <div class="rail-stage-io">
        <span>Input</span>
        <strong>${esc(stage.input)}</strong>
      </div>
      <div class="rail-stage-io">
        <span>Output</span>
        <strong>${esc(stage.output)}</strong>
      </div>
      <div class="proof-pill-row">${renderMiniPills(stage.requirements || [], "proof-pill subtle")}</div>
      <div class="hint">${esc(stage.visible_proof)}</div>
    </div>
  `).join("");

  const invariantCards = invariants.map((item) => `
    <div class="invariant-card">
      <div class="invariant-id">${esc(item.id)}</div>
      <div class="invariant-claim">${esc(item.claim)}</div>
      <div class="hint">${esc(item.local_proof)}</div>
      <span class="status-badge ${esc(String(item.status || "").toLowerCase())}">${esc(item.status || "visible")}</span>
    </div>
  `).join("");

  const pathwayMarkup = pathwayRows.map((row) => `
    <tr>
      <td><span class="mono">${esc(row.pathway_class)}</span></td>
      <td>${esc(row.primary_capture)}</td>
      <td>${esc(row.usage_truth)}</td>
      <td>${esc(row.cost_truth)}</td>
      <td>${esc(row.ownership_truth)}</td>
      <td><span class="status-badge">${esc(row.feasibility)}</span></td>
      <td>${esc(row.local_proof)}</td>
    </tr>
  `).join("");

  const requirementMarkup = requirementRows.map((row) => `
    <tr>
      <td><span class="mono">${esc(row.id)}</span></td>
      <td>${esc(row.requirement)}</td>
      <td>${esc(row.visible_surface)}</td>
      <td>${esc(row.proof)}</td>
      <td><span class="status-badge">${esc(row.status)}</span></td>
    </tr>
  `).join("");

  const sourceMarkup = sources.map((source) => `
    <div class="source-chip">
      <strong>${esc(source.name)}</strong>
      <span>${esc(source.used_for)}</span>
    </div>
  `).join("");

  return `
    <div class="requirements-page" data-walkthrough-anchor="walkthrough-requirements">
      <div class="proof-hero">
        <div class="proof-hero-copy">
          <div class="pill">Local PRD/spec proof</div>
          <h1>Argmin demo requirement map</h1>
          <p>${esc(summary.conclusion || "The local demo maps source-document requirements to visible workflows.")}</p>
          <div class="proof-doc-row">${sourceMarkup}</div>
        </div>
        <div class="proof-hero-panel">
          <div class="proof-hero-panel-label">Operating boundary</div>
          <div class="proof-hero-panel-value">${esc(summary.operating_boundary || "")}</div>
          <div class="proof-hero-panel-foot">${esc(summary.basis || "")}</div>
        </div>
      </div>

      ${renderSectionNarrative(
        "Requirements proof",
        {
          conclusion: lensNarrative.conclusion,
          why: lensNarrative.why
        },
        "Every source-document claim shown here is tied to an interactive local surface, a deterministic dummy dataset, or an explicit production-only boundary.",
        "Use the journey selector, then jump to the corresponding page to show the working proof."
      )}

      <div class="requirements-layout">
        <section class="card proof-journey-panel">
          <div class="card-header">
            <div>
              <div class="card-title">Source Document Journeys</div>
              <div class="card-subtitle">The PRD workflows converted into a local presentation path.</div>
            </div>
          </div>
          <div class="proof-journey-list">${journeyButtons}</div>
        </section>

        <section class="card proof-detail-panel">
          <div class="card-header">
            <div>
              <div class="card-title">${esc(selected?.title || "Journey proof")}</div>
              <div class="card-subtitle">${esc(selected?.trigger || "Select a journey to inspect how the demo proves it.")}</div>
            </div>
            <button class="small-btn primary" data-action="go" data-page="${esc(selected?.visible_route || "overview")}">Open Surface</button>
          </div>
          <div class="proof-detail-grid">
            <div>
              <span>Persona</span>
              <strong>${esc(selected?.persona || "Operator")}</strong>
            </div>
            <div>
              <span>Success condition</span>
              <strong>${esc(selected?.success || "Visible local proof")}</strong>
            </div>
            <div>
              <span>Mapped requirements</span>
              <strong>${esc((selected?.requirements || []).join(", "))}</strong>
            </div>
          </div>
          <ul class="proof-point-list">${proofPoints}</ul>
        </section>
      </div>

      <section class="proof-section">
        <div class="section-title">Decision Surface Controls</div>
        <div class="proof-surface-grid-wrap">${surfaceCards}</div>
      </section>

      <section class="proof-section">
        <div class="section-title">RAIL and HRE Pipeline</div>
        <div class="rail-stage-grid">${railCards}</div>
      </section>

      <section class="proof-section">
        <div class="section-title">Trust Boundary and Invariant Ledger</div>
        <div class="invariant-grid">${invariantCards}</div>
      </section>

      <section class="proof-section">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Pathway Coverage Matrix</div>
              <div class="card-subtitle">Comparable provider views preserve feasibility and truth-domain caveats rather than flattening evidence quality.</div>
            </div>
            <button class="small-btn" data-action="go" data-page="integrations">Open Integrations</button>
          </div>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Pathway</th>
                  <th>Capture</th>
                  <th>Usage</th>
                  <th>Cost</th>
                  <th>Ownership</th>
                  <th>Feasibility</th>
                  <th>Local proof</th>
                </tr>
              </thead>
              <tbody>${pathwayMarkup}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="proof-section">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Requirement Coverage Matrix</div>
              <div class="card-subtitle">High-signal P0/P1 requirements made visible in the local demo.</div>
            </div>
            <button class="small-btn" data-action="start-walkthrough">Run Walkthrough</button>
          </div>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Requirement</th>
                  <th>Visible surface</th>
                  <th>Proof shown</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${requirementMarkup}</tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  `;
}

function designPartnerData() {
  return dataset.design_partner_brief || FALLBACK_DATASET.design_partner_brief || {};
}

function selectedPartnerStage() {
  const stages = designPartnerData().pilot_stages || [];
  return stages.find((stage) => stage.stage_id === state.selectedPartnerStage) || stages[0] || null;
}

function designPartnerStatusClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (["green", "ready", "complete", "live"].includes(normalized)) {
    return "good";
  }
  if (["amber", "review", "simulated", "partial"].includes(normalized)) {
    return "warn";
  }
  if (["blue", "planned"].includes(normalized)) {
    return "info";
  }
  return "";
}

function designPartnerView() {
  const brief = designPartnerData();
  const lensNarrative = pageLensNarrative("partner_brief");
  const thesis = brief.thesis || {};
  const stages = brief.pilot_stages || [];
  const selectedStage = selectedPartnerStage();
  const pillars = brief.readiness_pillars || [];
  const buyerRoles = brief.buyer_roles || [];
  const proofMoments = brief.proof_moments || [];
  const metrics = brief.success_metrics || [];
  const openQuestions = brief.open_questions || [];
  const script = brief.demo_script || [];

  const stageButtons = stages.map((stage) => `
    <button class="partner-stage-btn${stage.stage_id === selectedStage?.stage_id ? " active" : ""}" data-action="set-partner-stage" data-stage-id="${esc(stage.stage_id)}">
      <span>${esc(stage.label)}</span>
      <strong>${esc(stage.duration)}</strong>
    </button>
  `).join("");

  const selectedSurfaces = (selectedStage?.visible_surfaces || []).map((surface) => `
    <span class="partner-chip">${esc(surface)}</span>
  `).join("");

  const selectedRisks = (selectedStage?.risk_controls || []).map((risk) => `
    <li>${esc(risk)}</li>
  `).join("");

  const pillarCards = pillars.map((pillar) => `
    <div class="partner-pillar-card">
      <div class="partner-card-head">
        <div>
          <div class="partner-kicker">${esc(pillar.pillar)}</div>
          <div class="partner-pillar-score">${esc(pillar.score)}</div>
        </div>
        <span class="status-badge ${designPartnerStatusClass(pillar.status)}">${esc(pillar.status)}</span>
      </div>
      <p>${esc(pillar.design_partner_value)}</p>
      <ul>
        ${(pillar.evidence || []).map((item) => `<li>${esc(item)}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  const buyerCards = buyerRoles.map((role) => `
    <div class="partner-role-card">
      <div class="partner-kicker">${esc(role.role)}</div>
      <div class="partner-role-name">${esc(role.name)}</div>
      <p>${esc(role.cares_about)}</p>
      <div class="partner-chip-row">${(role.demo_surfaces || []).map((surface) => `<span class="partner-chip">${esc(surface)}</span>`).join("")}</div>
    </div>
  `).join("");

  const proofCards = proofMoments.map((moment) => `
    <div class="partner-proof-card">
      <div>
        <div class="partner-kicker">${esc(moment.audience)}</div>
        <div class="partner-proof-title">${esc(moment.moment)}</div>
        <p>${esc(moment.why_it_converts)}</p>
      </div>
      <button class="small-btn" data-action="go" data-page="${esc(moment.surface_page || "overview")}">Open ${esc(moment.surface_label || "Surface")}</button>
    </div>
  `).join("");

  const metricRows = metrics.map((metric) => `
    <tr>
      <td>${esc(metric.metric)}</td>
      <td>${esc(metric.baseline)}</td>
      <td>${esc(metric.target)}</td>
      <td>${esc(metric.owner)}</td>
      <td>${esc(metric.proof_surface)}</td>
    </tr>
  `).join("");

  const questionCards = openQuestions.map((question) => `
    <div class="partner-question-card">
      <div class="partner-kicker">${esc(question.owner)}</div>
      <div class="partner-question-title">${esc(question.question)}</div>
      <div class="hint">${esc(question.how_demo_handles_it)}</div>
    </div>
  `).join("");

  const scriptRows = script.map((step, index) => `
    <div class="partner-script-step">
      <div class="partner-script-index">${index + 1}</div>
      <div>
        <div class="partner-script-title">${esc(step.title)}</div>
        <div class="hint">${esc(step.talk_track)}</div>
      </div>
      <button class="small-btn" data-action="go" data-page="${esc(step.surface_page || "overview")}">${esc(step.surface_label || "Open")}</button>
    </div>
  `).join("");

  return `
    <div class="partner-page" data-walkthrough-anchor="walkthrough-partner-brief">
      <section class="partner-hero">
        <div class="partner-hero-copy">
          <div class="pill">Design partner briefing room</div>
          <h1>${esc(thesis.headline || "Turn the local demo into an enterprise pilot.")}</h1>
          <p>${esc(thesis.summary || "A customer-ready path from screen recording to design partnership.")}</p>
          <div class="partner-hero-actions">
            <button class="small-btn primary" data-action="start-walkthrough">Run Buyer Walkthrough</button>
            <button class="small-btn" data-action="export-artifact" data-artifact="design-partner-brief">Export Partner Brief</button>
            <button class="small-btn" data-action="go" data-page="requirements">Open PRD Proof</button>
          </div>
        </div>
        <div class="partner-hero-panel">
          <div class="partner-kicker">Why this should earn a design partner</div>
          <div class="partner-hero-quote">${esc(thesis.design_partner_claim || "The demo makes the buyer's environment feel already understood.")}</div>
          <div class="partner-panel-grid">
            ${(thesis.signals || []).slice(0, 4).map((signal) => `
              <div>
                <span>${esc(signal.label)}</span>
                <strong>${esc(signal.value)}</strong>
              </div>
            `).join("")}
          </div>
        </div>
      </section>

      ${renderSectionNarrative(
        "Design partner conversion",
        {
          conclusion: lensNarrative.conclusion,
          why: lensNarrative.why
        },
        "The page avoids asking a customer to believe a static dashboard. It shows a scoped pilot, decision owners, proof moments, success metrics, and unresolved questions with explicit owners.",
        "Use this page at the start or end of the recording when the ask is partnership, not just feedback."
      )}

      <section class="partner-section">
        <div class="partner-section-head">
          <div>
            <div class="section-title">Pilot Path</div>
            <div class="card-subtitle">Click each stage to show how the customer relationship becomes operational.</div>
          </div>
          <button class="small-btn" data-action="go" data-page="integrations">Open Integrations</button>
        </div>
        <div class="partner-stage-layout">
          <div class="partner-stage-list">${stageButtons}</div>
          <div class="partner-stage-detail">
            <div class="partner-kicker">${esc(selectedStage?.duration || "Pilot")}</div>
            <div class="partner-stage-title">${esc(selectedStage?.goal || "Select a pilot stage")}</div>
            <div class="partner-stage-grid">
              <div>
                <span>Customer commitment</span>
                <strong>${esc(selectedStage?.customer_commitment || "Customer next step not configured")}</strong>
              </div>
              <div>
                <span>Argmin commitment</span>
                <strong>${esc(selectedStage?.argmin_commitment || "Argmin next step not configured")}</strong>
              </div>
              <div>
                <span>Success signal</span>
                <strong>${esc(selectedStage?.success_signal || "Success signal not configured")}</strong>
              </div>
            </div>
            <div class="partner-chip-row">${selectedSurfaces}</div>
            <ul class="partner-risk-list">${selectedRisks}</ul>
          </div>
        </div>
      </section>

      <section class="partner-section">
        <div class="section-title">Enterprise Readiness Pillars</div>
        <div class="partner-pillar-grid">${pillarCards}</div>
      </section>

      <section class="partner-section">
        <div class="partner-two-col">
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">Buyer Map</div>
                <div class="card-subtitle">Each role gets a crisp reason to keep engaging after the demo.</div>
              </div>
            </div>
            <div class="partner-role-grid">${buyerCards}</div>
          </div>
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">Proof Moments</div>
                <div class="card-subtitle">Specific screens that convert curiosity into a design-partner next step.</div>
              </div>
            </div>
            <div class="partner-proof-list">${proofCards}</div>
          </div>
        </div>
      </section>

      <section class="partner-section">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Pilot Success Metrics</div>
              <div class="card-subtitle">Measurable checkpoints that keep a design partnership from becoming an open-ended advisory call.</div>
            </div>
            <button class="small-btn" data-action="go" data-page="exports">Open Exports</button>
          </div>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Baseline</th>
                  <th>Target</th>
                  <th>Owner</th>
                  <th>Proof surface</th>
                </tr>
              </thead>
              <tbody>${metricRows}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="partner-section">
        <div class="partner-two-col">
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">Open Questions to Invite Collaboration</div>
                <div class="card-subtitle">The demo should feel honest about where customer input shapes the product.</div>
              </div>
            </div>
            <div class="partner-question-grid">${questionCards}</div>
          </div>
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">Recording Talk Track</div>
                <div class="card-subtitle">A concise sequence for presenting the demo as a partnership opportunity.</div>
              </div>
            </div>
            <div class="partner-script-list">${scriptRows}</div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function overviewView() {
  const stats = computeOverview();
  const trends = dataset.overview?.spend_trend_k_usd || [];
  const trendStart = trends.length ? Number(trends[0].total || 0) : 0;
  const trendEnd = trends.length ? Number(trends[trends.length - 1].total || 0) : 0;
  const growthPct = trendStart > 0 ? ((trendEnd - trendStart) / trendStart) * 100 : 0;
  const counts = interventionCounts();
  const adoptionSummary = currentAdoptionSummary();
  const readinessRows = executiveReadinessRows().map((row) => {
    const color = row.status === "green"
      ? "var(--green)"
      : row.status === "amber"
        ? "var(--amber)"
        : "var(--blue)";
    return `
      <div class="signal-item">
        <div class="signal-title">${esc(row.name)}</div>
        <div class="signal-values">
          <strong style="color:var(--text)">${esc(row.value)}</strong>
          <span class="status-dot" style="background:${color}"></span>
        </div>
        <div class="hint" style="margin-top:6px">${esc(row.detail)}</div>
      </div>
    `;
  }).join("");
  const providers = providerBreakdown();
  const clouds = cloudBreakdown();
  const categories = dataset.optimization_categories || [];
  const providerRows = renderCompactBreakdownRows(providers, {
    limit: 4,
    valueKey: "value",
    otherLabel: "Other providers",
    includeShare: true
  });
  const cloudRows = renderCompactBreakdownRows(clouds, {
    limit: 3,
    valueKey: "value",
    otherLabel: "Other footprints"
  });
  const optimizationRows = renderCompactBreakdownRows(categories, {
    limit: 4,
    valueKey: "value_usd",
    otherLabel: "Other savings levers",
    includeShare: true
  });

  const teamRows = (dataset.teams || []).map((team) => {
    const mom = team.previous_spend_usd > 0
      ? ((Number(team.spend_usd) - Number(team.previous_spend_usd)) / Number(team.previous_spend_usd)) * 100
      : 0;
    const budgetUtil = team.budget_usd > 0 ? (Number(team.spend_usd) / Number(team.budget_usd)) * 100 : 0;
    return `
      <tr class="clickable" data-action="select-team" data-team-id="${esc(team.id)}" data-navigate="teams">
        <td><span class="mono" style="color:var(--text)">${esc(team.name)}</span></td>
        <td style="color:var(--text)">${fmtUSD(team.spend_usd)}</td>
        <td style="color:${mom >= 0 ? "var(--amber)" : "var(--green)"}">${fmtPct(mom)}</td>
        <td>${fmtPct(budgetUtil)}</td>
        <td style="color:var(--amber)">${fmtUSD(team.optimization_potential_usd)}</td>
        <td style="color:var(--text)">${fmtUSD(team.trac_usd)}</td>
      </tr>
    `;
  }).join("");

  const modeColor = MODE_COLORS[state.mode] || MODE_COLORS.advisory;
  const entryRequestLabel = preparedDemoRequestLabel();
  const entryPersona = activeDemoPersona();
  const entryLens = roleLensLabel();

  const adoptionCallout = adoptionSummary
    ? `
      <div class="card" style="margin-top:12px">
        <div class="card-header">
          <div>
            <div class="card-title">Adoption Snapshot</div>
            <div class="card-subtitle">Enough to show whether usage is broad, repeated, and governed without forcing the full adoption dashboard into Overview.</div>
          </div>
          <button class="small-btn" data-action="go" data-page="adoption">Open Adoption Dashboard</button>
        </div>
        <div class="adoption-inline-list compact" style="margin-top:12px">
          <span class="adoption-inline-pill">Active employees: ${fmtNumber(adoptionSummary.active_employees_30d)}</span>
          <span class="adoption-inline-pill">Penetration: ${fmtPct(adoptionSummary.adoption_penetration_pct)}</span>
          <span class="adoption-inline-pill">Governed usage: ${fmtPct(adoptionSummary.governed_usage_pct)}</span>
          <span class="adoption-inline-pill">Spend / active employee: ${fmtUSD(adoptionSummary.spend_per_active_employee_usd)}</span>
          <span class="adoption-inline-pill">Repeat usage: ${fmtPct(adoptionSummary.repeat_user_rate_pct)}</span>
        </div>
      </div>
    `
    : "";

  return `
    <div class="overview-zone" data-walkthrough-anchor="walkthrough-overview">
      <div class="entry-home" data-visual-role="dominant" aria-label="Prepared local demo home">
        <div class="entry-home-main">
          <div class="entry-home-kicker">Local demo workspace</div>
          <h1 class="entry-home-title">Argmin demo is ready</h1>
          <p class="entry-home-copy">Start with the guided path. The Executive lens, Admin persona, Advisory mode, and ${esc(entryRequestLabel)} workflow are already selected with deterministic NovaTech data.</p>
          <div class="entry-home-context" aria-label="Preselected demo context">
            <div class="entry-home-context-item">
              <span>Lens</span>
              <strong>${esc(entryLens)}</strong>
            </div>
            <div class="entry-home-context-item">
              <span>Persona</span>
              <strong>${esc(entryPersona.label)}</strong>
            </div>
            <div class="entry-home-context-item">
              <span>Mode</span>
              <strong style="color:${modeColor.color}">${esc(modeLabel(state.mode))}</strong>
            </div>
            <div class="entry-home-context-item">
              <span>Workflow</span>
              <strong>${esc(entryRequestLabel)}</strong>
            </div>
          </div>
        </div>
        <div class="entry-home-action">
          <button class="small-btn primary" data-action="start-walkthrough">Start Guided Demo</button>
          <button class="small-btn" data-action="toggle-presenter-mode">Presenter Mode</button>
          <span>No setup required. Deeper controls remain available after the walkthrough starts.</span>
        </div>
      </div>

      <div class="section-title">Executive Summary</div>
      <div class="grid grid-4">
        <!-- FIX: expose clickable metric cards as keyboard-addressable controls -->
        <div class="card metric-card clickable-card" data-action="go" data-page="forecast" role="button" tabindex="0" aria-label="Open Forecasting">
          <div class="metric-accent" style="background:var(--blue)"></div>
          <div class="metric-label">Total AI Spend</div>
          <div class="metric-value">${fmtUSD(stats.totalSpend)}</div>
          <div class="metric-meta">30-day requests: ${fmtNumber(dataset.overview?.requests_30d || 0)} | Open forecasting</div>
        </div>
          <!-- FIX: expose clickable metric cards as keyboard-addressable controls -->
          <div class="card metric-card clickable-card" data-action="go" data-page="manual_mapping" role="button" tabindex="0" aria-label="Open Manual Mapping">
            <div class="metric-accent" style="background:var(--green)"></div>
            <div class="metric-label">Attribution Coverage</div>
            <div class="metric-value">${fmtPct(stats.coverage)}</div>
            <div class="metric-meta">Share of spend already owned with usable confidence | Open ownership review queue</div>
          </div>
          <!-- FIX: expose clickable metric cards as keyboard-addressable controls -->
          <div class="card metric-card clickable-card" data-action="go" data-page="interventions" role="button" tabindex="0" aria-label="Open Interventions">
            <div class="metric-accent" style="background:var(--amber)"></div>
            <div class="metric-label">Optimization Potential</div>
            <div class="metric-value">${fmtUSD(stats.totalPotential)}</div>
          <div class="metric-meta">Open recommendations: ${counts.recommended + counts.review} | Captured: ${fmtUSD(stats.captured)} | View interventions</div>
        </div>
        <!-- FIX: expose clickable metric cards as keyboard-addressable controls -->
        <div class="card metric-card clickable-card" data-action="go" data-page="interventions" role="button" tabindex="0" aria-label="Open Interventions">
          <div class="metric-accent" style="background:var(--green)"></div>
          <div class="metric-label">Savings Captured</div>
          <div class="metric-value">${fmtUSD(stats.captured)}</div>
          <div class="metric-meta">Approved or implemented interventions | Review queue</div>
        </div>
      </div>
    </div>

    <div class="overview-zone">
      <div class="section-title">Spending Profile</div>
      <div class="grid grid-8-4">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Monthly AI Spend</div>
              <div class="card-subtitle">Trend growth: ${fmtPct(growthPct)} over the displayed window</div>
            </div>
            <button class="small-btn" data-action="go" data-page="forecast">Open Forecast</button>
          </div>
          <div style="height:260px"><canvas id="chart-overview-trend"></canvas></div>
          ${renderChartSemantics([
            { label: "X-axis", value: "Month in the observed reporting window" },
            { label: "Y-axis", value: "Monthly spend in thousands of USD" }
          ])}
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom:8px">Operating Readiness</div>
          <div class="card-subtitle" style="margin-bottom:10px">What is already ready for finance and governance teams to act on, and what still needs operator attention.</div>
          ${readinessRows}
        </div>
      </div>

      <div class="grid grid-3" style="margin-top:12px">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Provider Breakdown</div>
              <div class="card-subtitle">Where spend is concentrated across frontier, open-weight, and platform-native model providers.</div>
            </div>
          </div>
          <div style="height:280px"><canvas id="chart-provider"></canvas></div>
          ${renderChartSemantics([
            { label: "Y-axis", value: "Model provider family" },
            { label: "X-axis", value: "Monthly spend in USD" }
          ])}
          <div class="breakdown-list compact">${providerRows}</div>
        </div>
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Cloud Breakdown</div>
              <div class="card-subtitle">Which cloud footprints are carrying the current AI run-rate.</div>
            </div>
          </div>
          <div style="height:220px"><canvas id="chart-cloud"></canvas></div>
          ${renderChartSemantics([
            { label: "X-axis", value: "Cloud platform carrying the workload" },
            { label: "Y-axis", value: "Monthly spend in USD" }
          ])}
          <div class="breakdown-list compact">${cloudRows}</div>
        </div>
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Optimization Potential Categories</div>
              <div class="card-subtitle">What is driving avoidable spend and how large each lever is.</div>
            </div>
            <button class="small-btn" data-action="go" data-page="interventions">View Interventions</button>
          </div>
          <div style="height:280px"><canvas id="chart-optimization"></canvas></div>
          ${renderChartSemantics([
            { label: "Y-axis", value: "Optimization category" },
            { label: "X-axis", value: "Addressable monthly spend in USD" }
          ])}
          <div class="breakdown-list compact">${optimizationRows}</div>
        </div>
      </div>

      ${adoptionCallout}

      <div class="card" style="margin-top:12px">
        <div class="card-header">
          <div>
            <div class="card-title">Team Attribution</div>
            <div class="card-subtitle">Cost ownership and optimization potential by organization</div>
          </div>
          <button class="small-btn" data-action="go" data-page="teams">View All Teams</button>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Spend</th>
                <th>MoM</th>
                <th>Budget Utilization</th>
                <th>Optimization Potential</th>
                <th>TRAC</th>
              </tr>
            </thead>
            <tbody>${teamRows}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderOverviewCharts() {
  const trend = dataset.overview?.spend_trend_k_usd || [];
  createChart("chart-overview-trend", {
    type: "line",
    data: {
      labels: trend.map((item) => item.month),
      datasets: [
        {
          label: "Total Spend (K USD)",
          data: trend.map((item) => item.total),
          borderColor: "#4f8ef8",
          backgroundColor: "rgba(79,142,248,0.15)",
          fill: true,
          tension: 0.3,
          pointRadius: 3
        },
        {
          label: "Attributed Spend (K USD)",
          data: trend.map((item) => item.attributed),
          borderColor: "#2ac487",
          backgroundColor: "rgba(42,196,135,0.0)",
          fill: false,
          tension: 0.3,
          pointRadius: 2
        }
      ]
    },
    options: {
      ...chartOptions(),
      scales: {
        ...chartOptions().scales,
        x: {
          ...chartOptions().scales.x,
          title: {
            display: true,
            text: "Month",
            color: "#8ea0bf"
          }
        },
        y: {
          ...chartOptions().scales.y,
          title: {
            display: true,
            text: "Monthly spend (K USD)",
            color: "#8ea0bf"
          }
        }
      }
    }
  }, { ariaLabel: "Monthly AI spend trend comparing total spend and attributed spend in thousands of US dollars." });

  const providers = providerBreakdown();
  createChart("chart-provider", {
    type: "bar",
    data: {
      labels: providers.map((x) => x.name),
      datasets: [
        {
          label: "Spend",
          data: providers.map((x) => x.value),
          backgroundColor: chartColors().slice(0, providers.length),
          borderRadius: 8,
          barPercentage: 0.7
        }
      ]
    },
    options: {
      ...chartOptions(),
      indexAxis: "y",
      plugins: {
        ...chartOptions().plugins,
        tooltip: {
          ...chartOptions().plugins.tooltip,
          callbacks: {
            label: (ctx) => {
              const value = Number(providers[ctx.dataIndex]?.value || 0);
              const total = providers.reduce((sum, item) => sum + Number(item.value || 0), 0) || 1;
              return `${ctx.label}: ${fmtUSD(value)} | ${fmtPct((value / total) * 100)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ...chartOptions().scales.x,
          title: {
            display: true,
            text: "Monthly spend (USD)",
            color: "#8ea0bf"
          },
          ticks: {
            ...chartOptions().scales.x.ticks,
            callback: (value) => compactUSD(value)
          }
        },
        y: {
          ...chartOptions().scales.y,
          title: {
            display: true,
            text: "Provider family",
            color: "#8ea0bf"
          }
        }
      }
    }
  }, { ariaLabel: "Provider spend breakdown showing monthly spend by model provider family." });

  const clouds = cloudBreakdown();
  createChart("chart-cloud", {
    type: "bar",
    data: {
      labels: clouds.map((x) => x.name),
      datasets: [
        {
          label: "Spend",
          data: clouds.map((x) => x.value),
          backgroundColor: [PALETTE.brand, PALETTE.success, PALETTE.neutral],
          borderRadius: 6,
          barPercentage: 0.68
        }
      ]
    },
    options: {
      ...chartOptions(),
      scales: {
        ...chartOptions().scales,
        y: {
          ...chartOptions().scales.y,
          title: {
            display: true,
            text: "Monthly spend (USD)",
            color: "#8ea0bf"
          },
          ticks: {
            ...chartOptions().scales.y.ticks,
            callback: (v) => `$${Math.round(v / 1000)}K`
          }
        },
        x: {
          ...chartOptions().scales.x,
          title: {
            display: true,
            text: "Cloud platform",
            color: "#8ea0bf"
          }
        }
      }
    }
  }, { ariaLabel: "Cloud spend breakdown showing spend by deployment footprint." });

  const categories = dataset.optimization_categories || [];
  createChart("chart-optimization", {
    type: "bar",
    data: {
      labels: categories.map((x) => x.name),
      datasets: [
        {
          label: "Addressable Spend",
          data: categories.map((x) => x.value_usd),
          backgroundColor: categories.map((x) => paletteChartColor(x.color, PALETTE.brand)),
          borderRadius: 8,
          barPercentage: 0.7
        }
      ]
    },
    options: {
      ...chartOptions(),
      indexAxis: "y",
      plugins: {
        ...chartOptions().plugins,
        tooltip: {
          ...chartOptions().plugins.tooltip,
          callbacks: {
            label: (ctx) => {
              const value = Number(categories[ctx.dataIndex]?.value_usd || 0);
              const total = categories.reduce((sum, item) => sum + Number(item.value_usd || 0), 0) || 1;
              return `${ctx.label}: ${fmtUSD(value)} | ${fmtPct((value / total) * 100)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ...chartOptions().scales.x,
          title: {
            display: true,
            text: "Addressable spend (USD)",
            color: "#8ea0bf"
          },
          ticks: {
            ...chartOptions().scales.x.ticks,
            callback: (value) => compactUSD(value)
          }
        },
        y: {
          ...chartOptions().scales.y,
          title: {
            display: true,
            text: "Optimization category",
            color: "#8ea0bf"
          }
        }
      }
    }
  }, { ariaLabel: "Optimization potential breakdown showing addressable monthly spend by optimization category." });
}

function adoptionStagePill(stage) {
  const normalized = String(stage || "").toLowerCase();
  if (normalized.includes("power")) {
    return `<span class="pill pill-green">${esc(stage || "Power user")}</span>`;
  }
  if (normalized.includes("embedded")) {
    return `<span class="pill pill-blue">${esc(stage || "Embedded")}</span>`;
  }
  return `<span class="pill pill-amber">${esc(stage || "Emerging")}</span>`;
}

function resolveAdoptionBreadcrumbs(hierarchy, dashboard) {
  if (!hierarchy?.organization || !dashboard) {
    return [];
  }
  const items = [
    {
      scopeType: "organization",
      scopeId: hierarchy.organization.organization_id,
      label: hierarchy.organization.organization_name,
      current: dashboard.scope_type === "organization"
    }
  ];

  const businessUnits = hierarchy.organization.business_units || [];
  const selectedBusinessUnit = businessUnits.find((item) => {
    if (dashboard.scope_type === "business_unit") {
      return item.business_unit_id === dashboard.scope_id;
    }
    return (item.teams || []).some((team) => team.team_id === dashboard.scope_id);
  });

  if (selectedBusinessUnit) {
    items.push({
      scopeType: "business_unit",
      scopeId: selectedBusinessUnit.business_unit_id,
      label: selectedBusinessUnit.business_unit_name,
      current: dashboard.scope_type === "business_unit"
    });
  }

  if (dashboard.scope_type === "team" && selectedBusinessUnit) {
    const selectedTeam = (selectedBusinessUnit.teams || []).find(
      (team) => team.team_id === dashboard.scope_id
    );
    if (selectedTeam) {
      items.push({
        scopeType: "team",
        scopeId: selectedTeam.team_id,
        label: selectedTeam.team_name,
        current: true
      });
    }
  }

  return items;
}

function adoptionWorkflowMap() {
  return dataset.adoption?.workflow_map || FALLBACK_DATASET.adoption.workflow_map;
}

function adoptionWorkflowRowsForDashboard(dashboard) {
  const rows = adoptionWorkflowMap().workflows || [];
  if (!dashboard) {
    return rows;
  }
  if (dashboard.scope_type === "business_unit") {
    return rows.filter((row) => row.business_unit_id === dashboard.scope_id);
  }
  if (dashboard.scope_type === "team") {
    return rows.filter((row) => row.team_id === dashboard.scope_id);
  }
  return rows;
}

function adoptionDepthClass(depth) {
  const normalized = String(depth || "").toLowerCase();
  if (normalized.includes("scaled")) {
    return "good";
  }
  if (normalized.includes("embedded")) {
    return "info";
  }
  if (normalized.includes("emerging")) {
    return "warn";
  }
  return "danger";
}

function averageWorkflowPct(rows, key) {
  if (!rows.length) {
    return 0;
  }
  const total = rows.reduce((sum, row) => sum + Number(row[key] || 0), 0);
  return total / rows.length;
}

function adoptionCapabilitySummaries(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = row.capability_class || row.capability || "Unclassified";
    if (!groups.has(key)) {
      groups.set(key, {
        capability: key,
        workflows: 0,
        services: new Set(),
        businessUnits: new Set(),
        users: 0,
        requests: 0,
        governed: []
      });
    }
    const group = groups.get(key);
    group.workflows += 1;
    group.services.add(row.service_name || "Unknown service");
    group.businessUnits.add(row.business_unit_name || "Unknown BU");
    group.users += Number(row.users_30d || 0);
    group.requests += Number(row.requests_30d || 0);
    group.governed.push(Number(row.governed_usage_pct || 0));
  }
  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      serviceCount: group.services.size,
      businessUnitCount: group.businessUnits.size,
      governedPct: group.governed.length
        ? group.governed.reduce((sum, value) => sum + value, 0) / group.governed.length
        : 0
    }))
    .sort((a, b) => b.requests - a.requests);
}

function adoptionView() {
  const hierarchy = state.adoptionHierarchy || fallbackAdoptionHierarchy();
  const dashboard = currentAdoptionDashboard();

  if (!dashboard) {
    return `
      <div class="card">
        <div class="card-title">Employee AI Adoption</div>
        <div class="card-subtitle">Executive adoption analytics become available when the live demo runtime is online.</div>
        <div style="margin-top:12px">
          ${emptyStateMarkup(
            "Adoption analytics not loaded",
            "This page needs the seeded adoption hierarchy and dashboard. Initialize or reset the demo, then retry this view.",
            {
              actions: [
                { label: "Initialize Demo", action: "bootstrap-demo", primary: true },
                { label: "Retry", action: "adoption-refresh" }
              ]
            }
          )}
        </div>
      </div>
    `;
  }

  const summary = dashboard.summary;
  const workflowMap = adoptionWorkflowMap();
  const workflowSummary = workflowMap.summary || {};
  const workflowRows = adoptionWorkflowRowsForDashboard(dashboard);
  const sortedWorkflowRows = workflowRows
    .slice()
    .sort((a, b) => Number(b.maturity_score || 0) - Number(a.maturity_score || 0));
  const embeddedWorkflowCount = workflowRows.filter((row) => {
    const depth = String(row.adoption_depth || "").toLowerCase();
    return depth.includes("embedded") || depth.includes("scaled");
  }).length;
  const serviceCount = new Set(workflowRows.map((row) => row.service_name).filter(Boolean)).size;
  const capabilityCount = new Set(workflowRows.map((row) => row.capability_class || row.capability).filter(Boolean)).size;
  const buCount = new Set(workflowRows.map((row) => row.business_unit_id).filter(Boolean)).size;
  const teamCount = new Set(workflowRows.map((row) => row.team_id).filter(Boolean)).size;
  const governedWorkflowPct = averageWorkflowPct(workflowRows, "governed_usage_pct");
  const capabilitySummaries = adoptionCapabilitySummaries(workflowRows);
  const productLeadCards = [
    {
      label: "Mapped Workflows",
      value: fmtNumber(workflowRows.length || workflowSummary.workflow_count || 0),
      meta: `${fmtNumber(embeddedWorkflowCount)} embedded or scaled in this scope`
    },
    {
      label: "AI Services Used",
      value: fmtNumber(serviceCount || workflowSummary.ai_services_used || 0),
      meta: "Hosted models, SaaS AI, data-platform AI, gateway and policy services"
    },
    {
      label: "Capability Classes",
      value: fmtNumber(capabilityCount || workflowSummary.capability_classes || 0),
      meta: "What teams are using AI to do, not just what they spent"
    },
    {
      label: "Governed Workflows",
      value: fmtPct(governedWorkflowPct || workflowSummary.governed_workflow_pct || 0),
      meta: `${fmtNumber(buCount || workflowSummary.business_units_with_adoption || 0)} BUs / ${fmtNumber(teamCount || workflowSummary.teams_with_adoption || 0)} teams represented`
    }
  ].map((card) => `
    <div class="adoption-map-stat">
      <span>${esc(card.label)}</span>
      <strong>${esc(card.value)}</strong>
      <p>${esc(card.meta)}</p>
    </div>
  `).join("");

  const breadcrumbs = resolveAdoptionBreadcrumbs(hierarchy, dashboard);
  const windowLabel = `${dashboard.window_days}d`;
  const windowButtons = ADOPTION_WINDOWS.map((windowDays) => {
    const active = state.adoptionWindowDays === windowDays;
    return `<button class="small-btn adoption-window-btn${active ? " active" : ""}" data-action="adoption-set-window" data-window-days="${windowDays}" ${state.adoptionLoading ? "disabled" : ""}>${windowDays}d</button>`;
  }).join("");
  const childScopeLabel = dashboard.scope_type === "organization"
    ? "Business Units"
    : dashboard.scope_type === "business_unit"
      ? "Teams"
      : "Related Signals";
  const childScopesMarkup = dashboard.child_scopes?.length
    ? dashboard.child_scopes.map((item) => `
        <button class="adoption-child-card" data-action="adoption-set-scope" data-scope-type="${esc(item.scope_type)}" data-scope-id="${esc(item.scope_id)}">
          <div class="adoption-child-label">${esc(item.scope_type.replace("_", " "))}</div>
          <div class="adoption-child-title">${esc(item.label)}</div>
          <div class="adoption-child-meta">${fmtPct(item.adoption_penetration_pct)} penetration | ${fmtUSD(item.spend_30d_usd)} ${windowLabel} spend</div>
          <div class="adoption-child-stats">
            <div class="adoption-child-stat"><span>Active employees</span><strong>${fmtNumber(item.active_employees_30d)}</strong></div>
            <div class="adoption-child-stat"><span>Growth vs prior</span><strong>${signedPct(item.growth_vs_prior_pct)}</strong></div>
            <div class="adoption-child-stat"><span>Governed usage</span><strong>${fmtPct(item.governed_usage_pct)}</strong></div>
            <div class="adoption-child-stat"><span>Top entry point</span><strong>${esc(item.top_entry_point)}</strong></div>
          </div>
        </button>
      `).join("")
    : `
      ${emptyStateMarkup(
        "No deeper child scope",
        "Team scope is the terminal drill-down. Use the employees, workflows, and lenses below to evaluate whether adoption is broad, embedded, and controlled.",
        { compact: true }
      )}
    `;

  const lensesMarkup = (dashboard.executive_lenses || []).map((lens) => `
    <div class="adoption-lens-card">
      <div class="adoption-lens-audience">${esc(lens.audience)}</div>
      <div class="adoption-lens-headline">${esc(lens.headline)}</div>
      <div class="adoption-lens-detail">${esc(lens.detail)}</div>
      <div class="adoption-lens-metric">
        <span class="adoption-lens-metric-label">${esc(lens.metric_label)}</span>
        <span class="adoption-lens-metric-value">${esc(lens.metric_value)}</span>
      </div>
    </div>
  `).join("");

  const topEmployeesMarkup = (dashboard.top_employees || []).map((employee) => `
    <tr>
      <td>
        <div style="font-weight:600;color:var(--text)">${esc(employee.name)}</div>
        <div class="hint">${esc(employee.title)}</div>
      </td>
      <td>${esc(employee.team_name)}</td>
      <td>${fmtNumber(employee.requests_30d)}</td>
      <td>${fmtUSD(employee.spend_30d_usd)}</td>
      <td>${fmtPct(employee.governed_usage_pct)}</td>
      <td>${esc(employee.top_entry_point)}</td>
      <td>${adoptionStagePill(employee.adoption_stage)}</td>
    </tr>
  `).join("");
  const workflowSpotlightMarkup = sortedWorkflowRows.slice(0, 4).map((workflow) => `
    <div class="workflow-spotlight-card">
      <div class="workflow-spotlight-head">
        <div>
          <div class="workflow-spotlight-bu">${esc(workflow.business_unit_name)} / ${esc(workflow.team_name)}</div>
          <div class="workflow-spotlight-title">${esc(workflow.workflow_name)}</div>
        </div>
        <span class="status-badge ${adoptionDepthClass(workflow.adoption_depth)}">${esc(workflow.adoption_depth)}</span>
      </div>
      <div class="workflow-spotlight-grid">
        <div><span>AI service</span><strong>${esc(workflow.service_name)}</strong></div>
        <div><span>Capability</span><strong>${esc(workflow.capability)}</strong></div>
      </div>
      <div class="workflow-insertion">
        <span>Workflow insertion point</span>
        <strong>${esc(workflow.exact_where)}</strong>
      </div>
      <p>${esc(workflow.how_adopted)}</p>
      <div class="workflow-evidence">${esc(workflow.evidence)}</div>
    </div>
  `).join("");
  const workflowMatrixRows = workflowRows.map((workflow) => `
    <tr>
      <td>
        <div style="font-weight:650;color:var(--text)">${esc(workflow.business_unit_name)}</div>
        <div class="hint">${esc(workflow.team_name)}</div>
      </td>
      <td>
        <div style="font-weight:650;color:var(--text)">${esc(workflow.workflow_name)}</div>
        <div class="hint">${esc(workflow.workflow_stage)}</div>
      </td>
      <td>${esc(workflow.service_name)}</td>
      <td>${esc(workflow.capability)}</td>
      <td>${esc(workflow.entry_point)}</td>
      <td>${esc(workflow.exact_where)}</td>
      <td>${fmtNumber(workflow.users_30d)} / ${fmtNumber(workflow.requests_30d)}</td>
      <td>${fmtPct(workflow.governed_usage_pct)}</td>
      <td><span class="status-badge ${adoptionDepthClass(workflow.adoption_depth)}">${esc(workflow.adoption_depth)}</span></td>
    </tr>
  `).join("");
  const capabilityRows = capabilitySummaries.map((capability) => `
    <tr>
      <td>
        <div style="font-weight:650;color:var(--text)">${esc(capability.capability)}</div>
        <div class="hint">${fmtNumber(capability.workflows)} workflow${capability.workflows === 1 ? "" : "s"} across ${fmtNumber(capability.businessUnitCount)} BU${capability.businessUnitCount === 1 ? "" : "s"}</div>
      </td>
      <td>${fmtNumber(capability.serviceCount)}</td>
      <td>${fmtNumber(capability.users)}</td>
      <td>${fmtNumber(capability.requests)}</td>
      <td>${fmtPct(capability.governedPct)}</td>
    </tr>
  `).join("");

  return `
    <div class="card" style="margin-bottom:12px" data-walkthrough-anchor="walkthrough-adoption">
      <div class="adoption-toolbar">
        <div>
          <div class="card-title">Employee AI Adoption Dashboard</div>
          <div class="card-subtitle">Executive operating view of how broadly AI is being adopted, where that adoption is concentrated, and whether it is governed well enough to scale.</div>
        </div>
        <div class="adoption-toolbar-right">
          <button class="small-btn" data-action="adoption-refresh" ${state.adoptionLoading ? "disabled" : ""}>${state.adoptionLoading ? "Refreshing..." : "Refresh Live Data"}</button>
          <button class="small-btn" data-action="adoption-reset" ${state.adoptionLoading ? "disabled" : ""}>Reset to Organization</button>
          <button class="small-btn" data-action="go" data-page="faq">FAQ</button>
        </div>
      </div>
      <div class="adoption-breadcrumbs">
        ${breadcrumbs.map((item) => `
          <button class="adoption-breadcrumb${item.current ? " current" : ""}" ${item.current ? "disabled" : ""} data-action="adoption-set-scope" data-scope-type="${esc(item.scopeType)}" data-scope-id="${esc(item.scopeId)}">
            ${esc(item.label)}
          </button>
        `).join("")}
      </div>
      <div class="adoption-window-row" style="margin-top:12px">
        ${windowButtons}
      </div>
      <div class="adoption-inline-list">
        <span class="adoption-inline-pill">Scope: ${esc(dashboard.scope_label)}</span>
        <span class="adoption-inline-pill">Parent: ${esc(dashboard.parent_scope_label || "Organization")}</span>
        <span class="adoption-inline-pill">Eligible employees: ${fmtNumber(summary.eligible_employees)}</span>
        <span class="adoption-inline-pill">Power-user rate: ${fmtPct(summary.power_user_rate_pct)}</span>
        <span class="adoption-inline-pill">Growth vs prior: ${signedPct(summary.growth_vs_prior_pct)}</span>
      </div>
    </div>

    <div class="adoption-kpi-grid" style="margin-bottom:12px">
      <div class="adoption-kpi-card">
        <div class="adoption-kpi-label">Active Employees</div>
        <div class="adoption-kpi-value">${fmtNumber(summary.active_employees_30d)}</div>
        <div class="adoption-kpi-meta">7d active: ${fmtNumber(summary.active_employees_7d)}</div>
      </div>
      <div class="adoption-kpi-card">
        <div class="adoption-kpi-label">Adoption Penetration</div>
        <div class="adoption-kpi-value">${fmtPct(summary.adoption_penetration_pct)}</div>
        <div class="adoption-kpi-meta">Share of eligible employees with AI activity in the selected window</div>
      </div>
      <div class="adoption-kpi-card">
        <div class="adoption-kpi-label">Repeat Usage Rate</div>
        <div class="adoption-kpi-value">${fmtPct(summary.repeat_user_rate_pct)}</div>
        <div class="adoption-kpi-meta">Employees using AI often enough that it is part of recurring work</div>
      </div>
      <div class="adoption-kpi-card">
        <div class="adoption-kpi-label">Governed Usage</div>
        <div class="adoption-kpi-value">${fmtPct(summary.governed_usage_pct)}</div>
        <div class="adoption-kpi-meta">Requests executed with governance context attached</div>
      </div>
      <div class="adoption-kpi-card">
        <div class="adoption-kpi-label">Spend / Active Employee</div>
        <div class="adoption-kpi-value">${fmtUSD(summary.spend_per_active_employee_usd)}</div>
        <div class="adoption-kpi-meta">${windowLabel} spend: ${fmtUSD(summary.spend_30d_usd)} | ${fmtNumber(summary.requests_30d)} requests</div>
      </div>
    </div>

    <section class="card adoption-product-map" style="margin-bottom:12px">
      <div class="card-header">
        <div>
          <div class="card-title">Product Lead Workflow Map</div>
          <div class="card-subtitle">What each organization, business unit, and team is doing with AI, which services power it, and the exact workflow step where adoption is happening.</div>
        </div>
        <button class="small-btn" data-action="go" data-page="integrations">Open Integrations</button>
      </div>
      <div class="adoption-map-narrative">
        <div>
          <div class="adoption-map-kicker">Adoption pattern</div>
          <h2>${esc(workflowSummary.primary_adoption_pattern || "AI adoption is mapped to workflows, not only users.")}</h2>
          <p>${esc(dashboard.scope_type === "organization" ? workflowSummary.highest_maturity_signal || "" : `${dashboard.scope_label} is filtered below so product leaders can see the workflow-level adoption story for this scope.`)}</p>
        </div>
        <div class="adoption-map-stat-grid">${productLeadCards}</div>
      </div>
    </section>

    <section class="card" style="margin-bottom:12px">
      <div class="card-header">
        <div>
          <div class="card-title">Where AI Is Embedded In The Work</div>
          <div class="card-subtitle">Highest-maturity workflows in the selected scope, with the service, capability, exact insertion point, and adoption mechanism visible together.</div>
        </div>
      </div>
      <div class="workflow-spotlight-grid-wrap">${workflowSpotlightMarkup || emptyStateMarkup("No workflow records", "No workflow-level adoption records are available for this scope.", { compact: true })}</div>
    </section>

    <section class="card" style="margin-bottom:12px">
      <div class="card-header">
        <div>
          <div class="card-title">Workflow Adoption Matrix</div>
          <div class="card-subtitle">A product-lead operating map of team, workflow, AI service, capability, entry point, insertion point, users, request volume, governance, and maturity.</div>
        </div>
      </div>
      <div class="table-wrap">
        <table class="table adoption-workflow-table">
          <thead>
            <tr>
              <th>Business Unit / Team</th>
              <th>Workflow</th>
              <th>AI Service</th>
              <th>Capability</th>
              <th>Entry Point</th>
              <th>Insertion Point</th>
              <th>Users / Requests</th>
              <th>Governed</th>
              <th>Depth</th>
            </tr>
          </thead>
          <tbody>${workflowMatrixRows || tableEmptyRowMarkup(9, "No workflow adoption records", "No workflow adoption records are captured for this scope and window.")}</tbody>
        </table>
      </div>
    </section>

    <section class="card" style="margin-bottom:12px">
      <div class="card-header">
        <div>
          <div class="card-title">Capability Deployment Map</div>
          <div class="card-subtitle">Shows what teams are using AI for across the selected scope, independent of provider brand or model family.</div>
        </div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr><th>Capability Class</th><th>Services</th><th>Users</th><th>Requests</th><th>Governed</th></tr>
          </thead>
          <tbody>${capabilityRows || tableEmptyRowMarkup(5, "No capability records", "No capability summary rows are captured for this scope.")}</tbody>
        </table>
      </div>
    </section>

    <div class="card" style="margin-bottom:12px" data-walkthrough-anchor="walkthrough-request-proof">
      <div class="card-title">Executive Lenses</div>
      <div class="card-subtitle">The same operating data, translated into the questions a CEO, CFO, COO, and CTO would each naturally ask.</div>
      <div class="adoption-lens-grid" style="margin-top:12px">${lensesMarkup}</div>
    </div>

    <div class="card" style="margin-bottom:12px" data-walkthrough-anchor="walkthrough-forecast">
      <div class="card-header">
        <div>
          <div class="card-title">${esc(childScopeLabel)}</div>
          <div class="card-subtitle">Drill from organization to business unit to team without losing the adoption and control narrative.</div>
        </div>
      </div>
      <div class="adoption-child-grid" style="margin-top:12px">${childScopesMarkup}</div>
    </div>

    <div class="adoption-detail-grid">
      <div>
        <div class="card" style="margin-bottom:12px">
          <div class="card-title">Adoption Trend</div>
          <div class="card-subtitle">How employee participation and request volume have changed over the last six months.</div>
          <div style="height:300px;margin-top:12px"><canvas id="chart-adoption-trend"></canvas></div>
          ${renderChartSemantics([
            { label: "X-axis", value: "Month in the selected reporting window" },
            { label: "Left Y-axis", value: "Request volume" },
            { label: "Right Y-axis", value: "Active employees" }
          ])}
        </div>

        <div class="card">
          <div class="card-title">Most Active Employees</div>
          <div class="card-subtitle">Employees driving the most AI activity in the selected scope. This helps distinguish broad adoption from a narrow set of heavy users.</div>
          <div class="table-wrap" style="margin-top:12px">
            <table class="table adoption-employee-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Team</th>
                  <th>Requests</th>
                  <th>${windowLabel} Spend</th>
                  <th>Governed</th>
                  <th>Primary Entry</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>${topEmployeesMarkup || tableEmptyRowMarkup(7, "No employee activity", "No employee activity is captured for this scope and window.")}</tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <div class="card" style="margin-bottom:12px">
          <div class="card-title">Model Mix</div>
          <div class="card-subtitle">Which model families are driving employee adoption in this scope.</div>
          <div style="height:260px;margin-top:12px"><canvas id="chart-adoption-model-mix"></canvas></div>
          ${renderChartSemantics([
            { label: "Y-axis", value: "Model family used by employees in this scope" },
            { label: "X-axis", value: "Request volume" }
          ])}
        </div>

        <div class="card">
          <div class="card-title">Entry-Point Mix</div>
          <div class="card-subtitle">How employees are actually accessing AI inside the business.</div>
          <div style="height:260px;margin-top:12px"><canvas id="chart-adoption-entry-mix"></canvas></div>
          ${renderChartSemantics([
            { label: "Y-axis", value: "Business entry point" },
            { label: "X-axis", value: "Request volume" }
          ])}
        </div>
      </div>
    </div>
  `;
}

function renderAdoptionCharts() {
  const dashboard = currentAdoptionDashboard();
  if (!dashboard) {
    return;
  }

  const trend = dashboard.trend || [];
  createChart("chart-adoption-trend", {
    type: "bar",
    data: {
      labels: trend.map((item) => item.label),
      datasets: [
        {
          type: "bar",
          label: "Requests",
          data: trend.map((item) => item.requests),
          backgroundColor: "rgba(79, 142, 248, 0.22)",
          borderColor: "#4f8ef8",
          borderWidth: 1,
          borderRadius: 8,
          yAxisID: "yRequests"
        },
        {
          type: "line",
          label: "Active employees",
          data: trend.map((item) => item.active_employees),
          borderColor: "#2ac487",
          backgroundColor: "rgba(42, 196, 135, 0.15)",
          tension: 0.28,
          pointRadius: 3,
          yAxisID: "yEmployees"
        }
      ]
    },
    options: {
      ...chartOptions(),
      plugins: {
        ...chartOptions().plugins,
        legend: {
          display: true,
          labels: {
            color: "#a9b4cf",
            boxWidth: 14,
            boxHeight: 14
          }
        },
        tooltip: {
          ...chartOptions().plugins.tooltip,
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed.y ?? 0;
              if (ctx.dataset.label === "Requests") {
                return `Requests: ${fmtNumber(value)}`;
              }
              return `Active employees: ${fmtNumber(value)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ...chartOptions().scales.x,
          title: {
            display: true,
            text: "Period",
            color: "#8ea0bf"
          }
        },
        yRequests: {
          position: "left",
          grid: { color: "rgba(27,43,69,0.55)" },
          ticks: { color: "#8ea0bf", font: { size: 10 } },
          title: {
            display: true,
            text: "Requests",
            color: "#8ea0bf"
          }
        },
        yEmployees: {
          position: "right",
          grid: { display: false },
          ticks: { color: "#8ea0bf", font: { size: 10 } },
          title: {
            display: true,
            text: "Active employees",
            color: "#8ea0bf"
          }
        }
      }
    }
  });

  createChart("chart-adoption-model-mix", {
    type: "bar",
    data: {
      labels: (dashboard.model_mix || []).map((item) => item.label),
      datasets: [
        {
          label: "Requests",
          data: (dashboard.model_mix || []).map((item) => item.requests),
          backgroundColor: chartColors().slice(0, Math.max((dashboard.model_mix || []).length, 1)),
          borderRadius: 8,
          barPercentage: 0.7
        }
      ]
    },
    options: {
      ...chartOptions(),
      indexAxis: "y",
      plugins: {
        ...chartOptions().plugins,
        tooltip: {
          ...chartOptions().plugins.tooltip,
          callbacks: {
            label: (ctx) => {
              const item = dashboard.model_mix?.[ctx.dataIndex];
              return `${ctx.label}: ${fmtNumber(item?.requests || 0)} requests | ${fmtUSD(item?.spend_usd || 0)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ...chartOptions().scales.x,
          title: {
            display: true,
            text: "Requests",
            color: "#8ea0bf"
          },
          ticks: {
            ...chartOptions().scales.x.ticks,
            callback: (value) => fmtNumber(value)
          }
        },
        y: {
          ...chartOptions().scales.y,
          title: {
            display: true,
            text: "Model family",
            color: "#8ea0bf"
          }
        }
      }
    }
  });

  createChart("chart-adoption-entry-mix", {
    type: "bar",
    data: {
      labels: (dashboard.entry_point_mix || []).map((item) => item.label),
      datasets: [
        {
          label: "Requests",
          data: (dashboard.entry_point_mix || []).map((item) => item.requests),
          backgroundColor: chartColors().slice(0, Math.max((dashboard.entry_point_mix || []).length, 1)),
          borderRadius: 8,
          barPercentage: 0.7
        }
      ]
    },
    options: {
      ...chartOptions(),
      indexAxis: "y",
      plugins: {
        ...chartOptions().plugins,
        tooltip: {
          ...chartOptions().plugins.tooltip,
          callbacks: {
            label: (ctx) => {
              const item = dashboard.entry_point_mix?.[ctx.dataIndex];
              return `${ctx.label}: ${fmtNumber(item?.requests || 0)} requests | ${fmtUSD(item?.spend_usd || 0)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ...chartOptions().scales.x,
          title: {
            display: true,
            text: "Requests",
            color: "#8ea0bf"
          },
          ticks: {
            ...chartOptions().scales.x.ticks,
            callback: (value) => fmtNumber(value)
          }
        },
        y: {
          ...chartOptions().scales.y,
          title: {
            display: true,
            text: "Entry point",
            color: "#8ea0bf"
          }
        }
      }
    }
  });
}

function chainNode(request, layerName) {
  return (request?.chain || []).find((node) => String(node.layer || "").toLowerCase() === layerName.toLowerCase()) || null;
}

function confidenceBandLabel(confidence) {
  const conf = Number(confidence || 0);
  if (conf >= 0.9) {
    return "High confidence";
  }
  if (conf >= 0.8) {
    return "Medium confidence";
  }
  return "Needs review";
}

function confidenceWhy(confidence) {
  const conf = Number(confidence || 0);
  if (conf >= 0.9) {
    return "Multiple deterministic signals agree on the owner and budget path.";
  }
  if (conf >= 0.8) {
    return "Core ownership signals align, but one or more joins are probabilistic.";
  }
  return "At least one critical ownership hop is probabilistic enough that a human should confirm it.";
}

function optimizationNarrative(request) {
  const alt = String(request?.enrichment?.alternate_model || "");
  if (!alt) {
    return "No optimization signal was attached to this request.";
  }
  if (alt.toLowerCase().includes("already on lowest-cost")) {
    return "This request is already on the lowest-cost verified model, so the platform recommends no routing change.";
  }
  if (alt.toLowerCase().includes("no verified equivalent")) {
    return "The platform did not find a verified lower-cost equivalent for this workload, so it preserves the current route.";
  }
  return `The platform found a lower-cost verified alternative: ${alt}.`;
}

function attributionView() {
  const requests = dataset.attribution_requests || [];
  const selected = currentSelectedRequest() || requests[0];
  if (!selected) {
    return `
      <div class="card">
        <div class="card-title">Request Proof</div>
        <div style="margin-top:12px">
          ${emptyStateMarkup(
            "No request proof examples",
            "No request-level proof examples are available in the demo dataset. Reset the demo to reload seeded attribution requests.",
            {
              actions: [
                { label: "Reset Demo", action: "clear-logs", primary: true },
                { label: "Open Overview", action: "go", page: "overview" }
              ]
            }
          )}
        </div>
      </div>
    `;
  }

  const modelNode = chainNode(selected, "Model Invocation");
  const serviceNode = chainNode(selected, "Service Attribution");
  const codeNode = chainNode(selected, "Code Ownership");
  const identityNode = chainNode(selected, "Identity Resolution");
  const teamNode = chainNode(selected, "Org Hierarchy");
  const budgetNode = chainNode(selected, "Budget Attribution");
  const confidencePct = Number(selected.confidence || 0) * 100;
  const billed = Number(selected.cost_breakdown?.billed_cost_usd || 0);
  const risk = Number(selected.cost_breakdown?.confidence_risk_premium_usd || 0);
  const total = billed + risk;
  const tracTotal = Number(selected.trac_usd || selected.cost_breakdown?.total_usd || 0);
  const tracWidthBase = total > 0 ? Math.max((billed / total) * 100, 10) : 50;
  const tracWidthRisk = total > 0 ? Math.max((risk / total) * 100, 10) : 50;
  const alternateModel = String(selected.enrichment?.alternate_model || "");
  const lensNarrative = pageLensNarrative("attribution");
  const evidenceQuality = requestEvidenceQuality(selected);
  const replayStages = requestReplayStages(selected);
  const activeReplayStage = replayStages[state.replayStageIndex] || replayStages[0];
  const decisionHeadline = confidencePct >= 90
    ? "This request is attributable strongly enough to use in financial reporting, governance, and optimization workflows."
    : confidencePct >= 80
      ? "This request is attributable, but the weaker joins should still be reviewed before using it for fully automated financial workflows."
      : "This request can be placed, but it should stay in a human review queue until ownership is confirmed.";
  const nextAction = confidencePct >= 90
    ? "Ready for automated reporting and policy telemetry."
    : confidencePct >= 80
      ? "Usable for review workflows; confirm the weaker ownership links before automated chargeback."
      : "Move this request into Manual Mapping before using it in automated chargeback or policy reporting.";
  const strongestNode = evidenceQuality.strongest;
  const weakestNode = evidenceQuality.weakest;
  const evidenceGroups = [
    {
      title: "Runtime evidence",
      layers: ["Model Invocation", "Service Attribution"]
    },
    {
      title: "Ownership evidence",
      layers: ["Code Ownership", "Identity Resolution", "Org Hierarchy"]
    },
    {
      title: "Financial assignment",
      layers: ["Budget Attribution"]
    }
  ];

  const requestButtons = requests.map((req) => {
    const reqTeam = chainNode(req, "Org Hierarchy");
    const reqService = chainNode(req, "Service Attribution");
    const active = selected.id === req.id;
    return `
      <button class="request-sample-btn${active ? " active" : ""}" data-action="select-request" data-request-id="${esc(req.id)}">
        <div class="request-sample-title">${esc(reqService?.value || req.id)}</div>
        <div class="request-sample-meta">${esc(req.model)} | ${fmtUSD(req.cost_usd, 4)} | ${esc(reqTeam?.value || "Unassigned")} | ${Math.round(Number(req.confidence || 0) * 100)}% confidence</div>
      </button>
    `;
  }).join("");

  const evidenceCards = evidenceGroups.map((group) => {
    const cards = (selected.chain || [])
      .filter((node) => group.layers.includes(node.layer))
      .map((node) => `
        <div class="evidence-card">
          <div class="evidence-title">${esc(node.layer)}</div>
          <div class="evidence-value mono">${esc(node.value)}</div>
          <div class="evidence-meta">
            <span>Source: ${esc(node.source)}</span>
            <span>Method: ${esc(node.method)}</span>
            <span>Confidence: ${Math.round(Number(node.confidence || 0) * 100)}%</span>
          </div>
        </div>
      `).join("");
    if (!cards) {
      return "";
    }
    return `
      <div class="evidence-section">
        <div class="evidence-section-title">${esc(group.title)}</div>
        <div class="evidence-grid">${cards}</div>
      </div>
    `;
  }).join("");

  const narrativeSteps = [
    {
      label: "Observed",
      body: `${modelNode?.value || selected.model} was invoked by ${serviceNode?.value || "the workload"} at ${esc(selected.time)} using ${fmtNumber(selected.input_tokens)} input tokens and ${fmtNumber(selected.output_tokens)} output tokens.`
    },
    {
      label: "Resolved",
      body: `${codeNode?.value || "Code ownership"} plus ${identityNode?.value || "identity resolution"} ties the request to ${teamNode?.value || "an accountable team"}, with ${budgetNode?.value || "the budget owner"} receiving the cost assignment.`
    },
    {
      label: "Decided",
      body: `${modeLabel(String(selected.mode || state.mode).toLowerCase())} mode returned guidance in ${fmtNumber(selected.latency_ms)} ms. ${optimizationNarrative(selected)}`
    }
  ].map((item) => `
    <div class="diagnostics-narrative-step">
      <div class="diagnostics-narrative-label">${esc(item.label)}</div>
      <div class="diagnostics-narrative-body">${esc(item.body)}</div>
    </div>
  `).join("");
  const replayButtons = replayStages.map((stage, idx) => `
    <button class="decision-replay-stage${idx === state.replayStageIndex ? " active" : ""}" data-action="set-replay-stage" data-stage-index="${idx}">
      ${esc(stage.label)}
    </button>
  `).join("");
  const missingEvidence = evidenceQuality.missing.length
    ? evidenceQuality.missing.map((item) => `<li>${esc(item)}</li>`).join("")
    : "<li>No missing evidence is blocking automated use on this request.</li>";
  const ambiguousEdges = evidenceQuality.ambiguous.length
    ? evidenceQuality.ambiguous.map((node) => `<li>${esc(node.layer)} | ${esc(node.value)} | ${Math.round(Number(node.confidence || 0) * 100)}% confidence</li>`).join("")
    : "<li>No materially ambiguous edges remain in the ownership chain.</li>";

  const trustSignals = [
    "The platform uses precomputed attribution data, so it can return governed decisions without slowing production traffic.",
    "If evidence is incomplete, the request still proceeds and the platform escalates the ambiguity for review instead of creating an outage.",
    "Manual Mapping lets finance and platform teams correct ambiguous ownership without losing the original evidence trail."
  ];
  const manualMappingCallout = confidencePct < 80 ? `
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">This request still needs manual confirmation</div>
      <div class="card-subtitle">The confidence score is below the automated chargeback threshold. Move it into the manual mapping queue to confirm the accountable owner and raise coverage.</div>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="small-btn primary" data-action="go" data-page="manual_mapping">Open Manual Mapping</button>
        <button class="small-btn" data-action="open-drawer">Run Guided Demo</button>
      </div>
    </div>
  ` : "";

  return `
    ${renderSectionNarrative(
      "Request Proof",
      lensNarrative,
      `${chainNode(selected, "Service Attribution")?.value || selected.id} resolves to ${teamNode?.value || "an unresolved owner"} with ${Math.round(confidencePct)}% confidence and ${fmtUSD(tracTotal, 4)} of TRAC exposure in the decision record. ${inlineTextForAlternate(selected)}`,
      confidencePct >= 90
        ? "Use this request to show why the financial number is credible enough to automate."
        : "Use this request to show why unresolved evidence should move into Manual Mapping before full automation."
    )}

    <div class="card" style="margin-bottom:12px">
      <div class="card-title">Request Attribution Proof</div>
      <div class="card-subtitle">${esc(decisionHeadline)}</div>
      <div class="hint" style="margin-top:10px">Pick a request sample below. This page shows who owned the request, which evidence links made that assignment credible, what the request cost, and what the customer should do next if confidence is still weak.</div>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="small-btn" data-action="open-drawer">Open Guided Demo</button>
        <button class="small-btn" data-action="go" data-page="faq">Methodology FAQ</button>
      </div>
    </div>

    <div class="request-sample-grid">${requestButtons}</div>

    <div class="diagnostics-proof-grid">
      <div class="diagnostics-proof-card">
        <div class="diagnostics-proof-label">Accountable Team</div>
        <div class="diagnostics-proof-value">${esc(teamNode?.value || "Unresolved")}</div>
        <div class="diagnostics-proof-meta">${esc(identityNode?.value || "No identity join")} | ${esc(serviceNode?.value || "No service join")}</div>
      </div>
      <div class="diagnostics-proof-card">
        <div class="diagnostics-proof-label">Budget Owner</div>
        <div class="diagnostics-proof-value">${esc(budgetNode?.value || "Unresolved")}</div>
        <div class="diagnostics-proof-meta">${esc(codeNode?.value || "No code ownership evidence")}</div>
      </div>
      <div class="diagnostics-proof-card">
        <div class="diagnostics-proof-label">Confidence</div>
        <div class="diagnostics-proof-value">${Math.round(confidencePct)}%</div>
        <div class="diagnostics-proof-meta">${esc(confidenceBandLabel(selected.confidence))} | ${esc(confidenceWhy(selected.confidence))}</div>
      </div>
      <div class="diagnostics-proof-card">
        <div class="diagnostics-proof-label">Next Action</div>
        <div class="diagnostics-proof-value">${confidencePct >= 90 ? "Ready" : confidencePct >= 80 ? "Review" : "Manual map"}</div>
        <div class="diagnostics-proof-meta">${esc(nextAction)}</div>
      </div>
    </div>

    ${manualMappingCallout}

    <div class="diagnostics-detail-grid">
      <div>
        <div class="card">
          <div class="card-title">What happened on this request</div>
          <div class="card-subtitle">A concise narrative from runtime signal to accountable owner and decision.</div>
          <div class="diagnostics-narrative" style="margin-top:12px">${narrativeSteps}</div>
          <div class="diagnostics-evidence-quality">
            <div class="diagnostics-quality-card">
              <div class="diagnostics-quality-label">Strongest evidence</div>
              <div class="diagnostics-quality-value">${esc(strongestNode?.layer || "Unavailable")} | ${esc(strongestNode?.value || "No evidence")}</div>
              <div class="hint" style="margin-top:6px">${esc(strongestNode?.source || "No source available")}</div>
            </div>
            <div class="diagnostics-quality-card">
              <div class="diagnostics-quality-label">Weakest join</div>
              <div class="diagnostics-quality-value">${esc(weakestNode?.layer || "Unavailable")} | ${esc(weakestNode?.value || "No evidence")}</div>
              <div class="hint" style="margin-top:6px">${Math.round(Number(weakestNode?.confidence || 0) * 100)}% confidence | ${esc(weakestNode?.method || "No method available")}</div>
            </div>
            <div class="diagnostics-quality-card full">
              <div class="diagnostics-quality-label">Confidence blocker</div>
              <div class="diagnostics-quality-value">${confidencePct >= 90 ? "No blocker remains. This request is strong enough for automated governance and reporting use." : `The request is only as strong as its weakest join. In this sample, ${weakestNode?.layer || "the weakest layer"} is what keeps the request out of a fully automated financial workflow.`}</div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top:12px">
          <div class="card-title">Evidence behind the assignment</div>
          <div class="card-subtitle">Each ownership hop is backed by a concrete source, reconciliation method, and confidence score.</div>
          <div style="margin-top:12px">${evidenceCards}</div>
        </div>

        <div class="decision-replay-card" style="margin-top:12px">
          <div class="card-title" style="font-size:14px">Decision Replay</div>
          <div class="card-subtitle">A staged replay of how this request moved from raw runtime signal to governed outcome.</div>
          <div class="decision-replay-stage-bar">${replayButtons}</div>
          <div class="decision-replay-detail">
            <div class="diagnostics-quality-label">${esc(activeReplayStage?.label || "Replay stage")}</div>
            <div class="diagnostics-quality-value" style="margin-top:8px">${esc(activeReplayStage?.detail || "No replay detail available.")}</div>
          </div>
        </div>
      </div>

      <div>
        <div class="diagnostics-panel">
          <div class="diagnostics-panel-title">Financial result</div>
          <div class="diagnostics-panel-body">${inlineDefinition("TRAC", "TRAC")} combines the billed request cost with a confidence risk premium. The weaker the ownership chain, the larger the premium that finance and platform teams should hold against the request.</div>
          <div class="cost-row"><span>Request ID</span><span class="mono">${esc(selected.id)}</span></div>
          <div class="cost-row"><span>Decision-time latency</span><span>${fmtNumber(selected.latency_ms)} ms</span></div>
          <div class="cost-row"><span>Billed Cost</span><span>${fmtUSD(billed, 4)}</span></div>
          <div class="cost-row"><span>Confidence Risk Premium</span><span>${fmtUSD(risk, 4)}</span></div>
          <div class="cost-row"><span><strong>${inlineDefinition("TRAC", "TRAC")}</strong></span><span><strong>${fmtUSD(tracTotal, 4)}</strong></span></div>
          <div class="trac-bar">
            <div class="trac-segment" style="width:${tracWidthBase.toFixed(1)}%;background:var(--blue)">Billed</div>
            <div class="trac-segment" style="width:${tracWidthRisk.toFixed(1)}%;background:var(--amber)">Risk Premium</div>
          </div>
        </div>

        <div class="diagnostics-panel">
          <div class="diagnostics-panel-title">Business implication</div>
          <div class="diagnostics-panel-body">${esc(nextAction)}</div>
          <ul class="diagnostics-panel-list">
            <li>Accountable team: ${esc(teamNode?.value || "Review required")}.</li>
            <li>Budget owner: ${esc(budgetNode?.value || "Review required")}.</li>
            <li>Optimization signal: ${esc(alternateModel || "No lower-cost verified alternative was attached to this request.")}</li>
          </ul>
        </div>

        <div class="diagnostics-panel">
          <div class="diagnostics-panel-title">Why leadership can trust this</div>
          <ul class="diagnostics-panel-list">
            ${trustSignals.map((item) => `<li>${esc(item)}</li>`).join("")}
          </ul>
        </div>

        <div class="diagnostics-panel">
          <div class="diagnostics-panel-title">Evidence quality</div>
          <div class="diagnostics-panel-body">This is where the platform shows why the answer is trustworthy, where it is still ambiguous, and what would need to improve to automate with higher confidence.</div>
          <div class="diagnostics-quality-card" style="margin-top:12px">
            <div class="diagnostics-quality-label">Missing evidence</div>
            <ul class="diagnostics-panel-list" style="margin-top:8px">${missingEvidence}</ul>
          </div>
          <div class="diagnostics-quality-card full" style="margin-top:12px">
            <div class="diagnostics-quality-label">Ambiguous edges</div>
            <ul class="diagnostics-panel-list" style="margin-top:8px">${ambiguousEdges}</ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

function modelsView() {
  const sortable = ["spend_usd", "requests", "optimization_potential_usd"];
  if (!sortable.includes(state.modelSort)) {
    state.modelSort = "spend_usd";
  }

  const sortButtons = [
    ["spend_usd", "Spend"],
    ["requests", "Requests"],
    ["optimization_potential_usd", "Optimization Potential"]
  ].map(([key, label]) => {
    return `<button class="filter-btn${state.modelSort === key ? " active" : ""}" data-action="set-model-sort" data-sort="${esc(key)}">${esc(label)}</button>`;
  }).join("");

  const selectedModel = currentSelectedModel();
  const rows = renderModelTableRows();

  const totalSpend = sum(dataset.models || [], "spend_usd");
  const totalOptimization = sum(dataset.models || [], "optimization_potential_usd");
  const providers = providerBreakdown();
  const providerCount = providers.length;
  const modelLandscape = enterpriseModelLandscape();
  const marketSignals = enterpriseMarketSignals();
  const enterprisePlatforms = enterpriseAIPlatforms();
  const enterpriseStack = enterpriseAIStack();
  const providerCards = modelLandscape.map((item) => `
    <div class="provider-landscape-card">
      <div class="provider-landscape-head">
        <div class="provider-landscape-provider">${esc(item.provider)}</div>
        <div class="provider-landscape-model">${esc(item.model_family)}</div>
      </div>
      <div class="provider-landscape-meta">${esc(item.typical_access)}</div>
      <div class="provider-landscape-detail">${esc(item.strength)}</div>
      <div class="provider-landscape-use">${esc(item.enterprise_fit)}</div>
    </div>
  `).join("");
  const marketSignalCards = marketSignals.map((item) => `
    <div class="enterprise-signal-card">
      <div class="metric-label">${esc(item.label)}</div>
      <div class="metric-value" style="font-size:24px">${esc(item.value)}</div>
      <div class="metric-meta">${esc(item.context)}</div>
      <div class="enterprise-card-detail">${esc(item.why_it_matters)}</div>
    </div>
  `).join("");
  const platformCards = enterprisePlatforms.map((item) => `
    <div class="provider-landscape-card">
      <div class="provider-landscape-head">
        <div class="provider-landscape-provider">${esc(item.name)}</div>
        <div class="provider-landscape-model">${esc(item.positioning)}</div>
      </div>
      <div class="provider-landscape-meta">${esc(item.what_it_is)}</div>
      <div class="provider-landscape-detail">${esc(item.enterprise_reason)}</div>
      <div class="provider-landscape-use">${esc(item.example_fit)}</div>
    </div>
  `).join("");
  const stackCards = enterpriseStack.map((item) => `
    <div class="provider-landscape-card">
      <div class="provider-landscape-head">
        <div class="provider-landscape-provider">${esc(item.layer)}</div>
        <div class="provider-landscape-model">${esc(item.role)}</div>
      </div>
      <div class="provider-landscape-detail">${esc(item.description)}</div>
      <div class="provider-landscape-meta"><strong>Typical systems:</strong> ${esc(item.examples.join(", "))}</div>
      <div class="provider-landscape-use"><strong>Why it matters:</strong> ${esc(item.why_it_matters)}</div>
    </div>
  `).join("");
  const lensNarrative = pageLensNarrative("models");
  if (!Array.isArray(dataset.models) || !dataset.models.length) {
    return `
      ${renderSectionNarrative(
        "Model Intelligence",
        lensNarrative,
        "No model portfolio is loaded in the current dataset.",
        "Load or restore a demo dataset before using this page in a live walkthrough."
      )}
      ${emptyStateMarkup(
        "No models available in the current dataset.",
        "The model estate is empty, so charts and optimization references cannot be rendered. Reset the demo to restore the seeded model portfolio.",
        {
          actions: [
            { label: "Reset Demo", action: "clear-logs", primary: true },
            { label: "Open Integrations", action: "go", page: "integrations" }
          ]
        }
      )}
    `;
  }

  const modelReferenceSections = {
    signals: {
      title: "Enterprise Adoption Signals",
      subtitle: "Market context that explains why this demo is built around multi-model governance instead of one-model reporting.",
      layoutClass: "grid grid-3",
      body: marketSignalCards
    },
    landscape: {
      title: "Enterprise Model Landscape",
      subtitle: "The model estate represented here mirrors how large enterprises blend frontier, open-weight, and platform-native providers.",
      layoutClass: "provider-landscape-grid",
      body: providerCards
    },
    platforms: {
      title: "Top Enterprise AI Platforms",
      subtitle: "Most enterprises reach model families through a small number of control planes rather than calling every vendor directly.",
      layoutClass: "provider-landscape-grid",
      body: platformCards
    },
    stack: {
      title: "Canonical Enterprise AI Stack",
      subtitle: "The common deployment pattern is a layered system: data, infrastructure, models, agents, and applications.",
      layoutClass: "provider-landscape-grid",
      body: stackCards
    }
  };
  const activeModelReference = modelReferenceSections[state.modelReferenceKey] || modelReferenceSections.signals;
  const modelReferenceButtons = [
    ["signals", "Adoption Signals"],
    ["landscape", "Model Landscape"],
    ["platforms", "Platforms"],
    ["stack", "AI Stack"]
  ].map(([key, label]) => `
    <button class="filter-btn${state.modelReferenceKey === key ? " active" : ""}" data-action="set-model-reference" data-reference-key="${esc(key)}">${esc(label)}</button>
  `).join("");
  const selectedModelSupport = selectedModel
    ? `${selectedModel.name} currently represents ${fmtUSD(selectedModel.spend_usd)} of monthly spend at ${fmtNumber(selectedModel.latency_p95_ms)} ms p95 latency.`
    : "The current portfolio highlights how enterprises route work across many model families instead of choosing one permanent winner.";

  return `
    ${renderSectionNarrative(
      "Model Intelligence",
      lensNarrative,
      selectedModelSupport,
      selectedModel
        ? `Use ${selectedModel.name} as the active context for Forecasting, Governance, and Request Proof.`
        : "Select a model row to carry that context into the rest of the demo."
    )}

    <div class="grid grid-3" style="margin-bottom:12px">
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--blue)"></div>
        <div class="metric-label">Active Models</div>
        <div class="metric-value">${fmtNumber((dataset.models || []).length)}</div>
        <div class="metric-meta">Across ${fmtNumber(providerCount)} provider families</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--green)"></div>
        <div class="metric-label">Model Spend</div>
        <div class="metric-value">${fmtUSD(totalSpend)}</div>
        <div class="metric-meta">Monthly rolling estimate</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--amber)"></div>
        <div class="metric-label">Optimization Potential</div>
        <div class="metric-value">${fmtUSD(totalOptimization)}</div>
        <div class="metric-meta">Model-level opportunity</div>
      </div>
    </div>

    ${selectedModel ? `
      <div class="card" style="margin-bottom:12px">
        <div class="card-header">
          <div>
            <div class="card-title">Active Model Context</div>
            <div class="card-subtitle">This selected model now carries through Forecasting, Governance simulation, and the active context ribbon.</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="small-btn" data-action="go" data-page="forecast">Open Forecasting</button>
            <button class="small-btn" data-action="go" data-page="governance">Open Governance</button>
          </div>
        </div>
        <div class="grid grid-4">
          <div class="signal-item">
            <div class="signal-title">Model family</div>
            <div class="signal-values"><strong>${esc(selectedModel.name)}</strong></div>
            <div class="hint" style="margin-top:6px">${esc(selectedModel.provider)}</div>
          </div>
          <div class="signal-item">
            <div class="signal-title">Monthly spend</div>
            <div class="signal-values"><strong>${fmtUSD(selectedModel.spend_usd)}</strong></div>
            <div class="hint" style="margin-top:6px">${fmtNumber(selectedModel.requests)} requests</div>
          </div>
          <div class="signal-item">
            <div class="signal-title">Operational fit</div>
            <div class="signal-values"><strong>${selectedModel.latency_p95_ms} ms p95</strong></div>
            <div class="hint" style="margin-top:6px">Optimization potential ${fmtUSD(selectedModel.optimization_potential_usd)}</div>
          </div>
          <div class="signal-item">
            <div class="signal-title">Why it matters</div>
            <div class="signal-values"><strong>${esc(selectedModel.provider)} is part of a routed estate</strong></div>
            <div class="hint" style="margin-top:6px">The point is not who wins forever; it is which tasks this model should own economically and safely.</div>
          </div>
        </div>
      </div>
    ` : ""}

    <div class="grid grid-8-4">
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Model Cost Breakdown</div>
            <div class="card-subtitle">Sorted by the metric selected above so the team can compare spend, demand, and savings headroom by model family.</div>
          </div>
          <div class="filter-bar" style="margin:0">${sortButtons}</div>
        </div>
        <div style="height:300px"><canvas id="chart-models"></canvas></div>
        <div id="models-chart-semantics">${renderModelChartSemantics()}</div>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:10px">How to Read This</div>
        <div class="hint" style="margin-bottom:8px">Variance is relative cost per request versus a low-cost baseline. It does not imply quality differences.</div>
        <div class="hint" style="margin-bottom:8px">Optimization Potential represents validated reduction pathways, not speculative estimates.</div>
        <div class="hint">This page is intentionally multi-model. Large enterprises rarely standardize on one provider; they route work by reasoning need, privacy posture, multimodal needs, and unit cost.</div>
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <div class="card-header">
        <div>
          <div class="card-title">${esc(activeModelReference.title)}</div>
          <div class="card-subtitle">${esc(activeModelReference.subtitle)}</div>
        </div>
        <div class="filter-bar" style="margin:0">
          ${modelReferenceButtons}
          <button class="small-btn" data-action="go" data-page="glossary">Glossary</button>
          <button class="small-btn" data-action="go" data-page="faq">Enterprise AI FAQ</button>
        </div>
      </div>
      <div class="${activeModelReference.layoutClass}" style="margin-top:12px">${activeModelReference.body}</div>
    </div>

    <div class="card" style="margin-top:12px">
      <div class="card-title" style="margin-bottom:10px">Model Intelligence Table</div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Provider</th>
              <th>Spend</th>
              <th>Requests</th>
              <th>Latency P95</th>
              <th>Variance</th>
              <th>Teams</th>
              <th>Trend</th>
              <th>Optimization Potential</th>
            </tr>
          </thead>
          <tbody id="models-table-body">${rows || tableEmptyRowMarkup(9, "No model rows", "No model records match the current sort and context.")}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderModelChart() {
  const models = sortedModels();
  createChart("chart-models", {
    type: "bar",
    data: {
      labels: models.map((m) => m.name),
      datasets: [
        {
          data: models.map((m) => Number(m[state.modelSort] || 0)),
          backgroundColor: chartColors(),
          borderRadius: 6,
          barThickness: 18
        }
      ]
    },
    options: {
      ...chartOptions(),
      indexAxis: "y",
      scales: {
        ...chartOptions().scales,
        x: {
          ...chartOptions().scales.x,
          title: {
            display: true,
            text: state.modelSort === "requests"
              ? "Request volume"
              : state.modelSort === "optimization_potential_usd"
                ? "Optimization potential (USD)"
                : "Monthly spend (USD)",
            color: "#8ea0bf"
          },
          ticks: {
            ...chartOptions().scales.x.ticks,
            callback: (value) => {
              if (state.modelSort === "requests") {
                return fmtNumber(value);
              }
              return compactUSD(value);
            }
          }
        },
        y: {
          ...chartOptions().scales.y,
          title: {
            display: true,
            text: "Model family",
            color: "#8ea0bf"
          }
        }
      }
    }
  });
}

function teamsView() {
  const allTeams = dataset.teams || [];
  const selected = allTeams.find((team) => team.id === state.selectedTeamId);
  const lensNarrative = pageLensNarrative("overview");
  if (!allTeams.length) {
    return `
      ${renderSectionNarrative(
        "Teams",
        { conclusion: "No organizational spend view is available right now.", why: roleLensDescription() || lensNarrative.why },
        "The current dataset does not include any accountable team rows.",
        "Restore a populated dataset before using the team drill-down in the demo."
      )}
      ${emptyStateMarkup(
        "No teams available in the current dataset.",
        "The organization hierarchy is empty, so ownership and budget drill-downs cannot be shown. Reset the demo to restore seeded team rows.",
        {
          actions: [
            { label: "Reset Demo", action: "clear-logs", primary: true },
            { label: "Open Request Proof", action: "go", page: "attribution" }
          ]
        }
      )}
    `;
  }
  if (!selected) {
    const cards = allTeams.map((team) => {
      const budgetUtil = team.budget_usd > 0 ? (Number(team.spend_usd) / Number(team.budget_usd)) * 100 : 0;
      const mom = team.previous_spend_usd > 0
        ? ((Number(team.spend_usd) - Number(team.previous_spend_usd)) / Number(team.previous_spend_usd)) * 100
        : 0;
      return `
        <!-- FIX: expose clickable team cards as keyboard-addressable controls -->
        <div class="card" style="cursor:pointer" data-action="select-team" data-team-id="${esc(team.id)}" role="button" tabindex="0" aria-label="Open ${esc(team.name)} team detail">
          <div class="card-header">
            <div>
              <div class="card-title">${esc(team.name)}</div>
              <div class="card-subtitle">Lead: ${esc(team.lead)} | Workload: ${esc(team.top_workload)}</div>
            </div>
            <span class="badge">${esc(team.cloud)}</span>
          </div>
          <div class="grid grid-2">
            <div>
              <div class="metric-label">Spend</div>
              <div style="font-size:18px;font-weight:650">${fmtUSD(team.spend_usd)}</div>
              <div class="hint">MoM: <span style="color:${mom >= 0 ? "var(--amber)" : "var(--green)"}">${fmtPct(mom)}</span></div>
            </div>
            <div>
              <div class="metric-label">Budget Utilization</div>
              <div style="font-size:18px;font-weight:650">${fmtPct(budgetUtil)}</div>
              <div class="hint">Optimization: ${fmtUSD(team.optimization_potential_usd)}</div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `
      ${renderSectionNarrative(
        "Teams",
        { conclusion: "This view shows where spend lands organizationally once requests are resolved to accountable owners.", why: roleLensDescription() || lensNarrative.why },
        "Each team row connects budget usage, optimization potential, and the model footprint it is actually carrying.",
        "Select a team to carry that context into Manual Mapping, Interventions, and Forecasting."
      )}
      <div class="grid grid-2">${cards}</div>
      <div class="card" style="margin-top:12px">
        <div class="card-title" style="margin-bottom:8px">Team Portfolio View</div>
        <div style="height:280px"><canvas id="chart-teams"></canvas></div>
        ${renderChartSemantics([
          { label: "X-axis", value: "Team" },
          { label: "Y-axis", value: "Monthly spend, budget, and savings headroom in USD" }
        ])}
      </div>
    `;
  }

  const mom = selected.previous_spend_usd > 0
    ? ((Number(selected.spend_usd) - Number(selected.previous_spend_usd)) / Number(selected.previous_spend_usd)) * 100
    : 0;
  const budgetUtil = selected.budget_usd > 0 ? (Number(selected.spend_usd) / Number(selected.budget_usd)) * 100 : 0;

  return `
    ${renderSectionNarrative(
      "Team Detail",
      { conclusion: `${selected.name} is now the active organizational context across the demo.`, why: "The point is to connect one accountable team to its spend, model footprint, and recommended actions." },
      `${selected.name} is spending ${fmtUSD(selected.spend_usd)} per month across ${(selected.top_models || []).length} primary model families.`,
      "Use the linked model buttons and interventions to show what this team should do next."
    )}
    <button class="back-btn" data-action="clear-team">Back to Team List</button>

    <div class="grid grid-4" style="margin-bottom:12px">
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--blue)"></div>
        <div class="metric-label">Monthly Spend</div>
        <div class="metric-value">${fmtUSD(selected.spend_usd)}</div>
        <div class="metric-meta">MoM ${fmtPct(mom)}</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:${budgetUtil > 90 ? "var(--red)" : "var(--green)"}"></div>
        <div class="metric-label">Budget Utilization</div>
        <div class="metric-value">${fmtPct(budgetUtil)}</div>
        <div class="metric-meta">Budget ${fmtUSD(selected.budget_usd)}</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--amber)"></div>
        <div class="metric-label">Optimization Potential</div>
        <div class="metric-value">${fmtUSD(selected.optimization_potential_usd)}</div>
        <div class="metric-meta">${fmtPct(selected.optimization_pct)} of spend</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--blue)"></div>
        <div class="metric-label">Model Footprint</div>
        <div class="metric-value">${fmtNumber((selected.top_models || []).length)}</div>
        <div class="metric-meta">${esc((selected.top_models || []).join(", "))}</div>
      </div>
    </div>

    <div class="card" data-walkthrough-anchor="walkthrough-interventions">
      <div class="card-title" style="margin-bottom:8px">${esc(selected.name)} Detail</div>
      <div class="hint">Lead: ${esc(selected.lead)} | Headcount: ${fmtNumber(selected.headcount)} | Primary workload: ${esc(selected.top_workload)} | Cloud: ${esc(selected.cloud)}</div>
      <div class="filter-bar" style="margin:12px 0 0">
        ${(selected.top_models || []).map((modelName) => `
          <button class="small-btn" data-action="select-model" data-model-name="${esc(modelName)}" data-navigate="models">${esc(modelName)}</button>
        `).join("")}
      </div>
      <div style="margin-top:10px;height:260px"><canvas id="chart-team-daily"></canvas></div>
      ${renderChartSemantics([
        { label: "X-axis", value: "Day of month" },
        { label: "Y-axis", value: "Daily spend in USD" }
      ])}
    </div>
  `;
}

function renderTeamCharts() {
  const allTeams = dataset.teams || [];
  if (!state.selectedTeamId) {
    createChart("chart-teams", {
      type: "bar",
      data: {
        labels: allTeams.map((t) => t.name),
        datasets: [
          {
            label: "Spend",
            data: allTeams.map((t) => t.spend_usd),
            backgroundColor: "#4f8ef8",
            borderRadius: 6
          },
          {
            label: "Budget",
            data: allTeams.map((t) => t.budget_usd),
            backgroundColor: "#22385a",
            borderRadius: 6
          },
          {
            label: "Optimization Potential",
            data: allTeams.map((t) => t.optimization_potential_usd),
            backgroundColor: "#eda82e",
            borderRadius: 6
          }
        ]
      },
      options: {
        ...chartOptions(),
        scales: {
          ...chartOptions().scales,
          x: {
            ...chartOptions().scales.x,
            title: {
              display: true,
              text: "Team",
              color: "#8ea0bf"
            }
          },
          y: {
            ...chartOptions().scales.y,
            title: {
              display: true,
              text: "Monthly spend (USD)",
              color: "#8ea0bf"
            },
            ticks: {
              ...chartOptions().scales.y.ticks,
              callback: (v) => `$${Math.round(v / 1000)}K`
            }
          }
        }
      }
    });
    return;
  }

  const team = allTeams.find((t) => t.id === state.selectedTeamId);
  if (!team) {
    return;
  }

  const series = Array.from({ length: 28 }, (_, idx) => {
    const base = Number(team.spend_usd) / 28;
    const volatility = 0.78 + ((idx % 7) * 0.07);
    return Math.round(base * volatility);
  });

  createChart("chart-team-daily", {
    type: "line",
    data: {
      labels: series.map((_, idx) => String(idx + 1)),
      datasets: [
        {
          label: "Daily Spend",
          data: series,
          borderColor: "#4f8ef8",
          backgroundColor: "rgba(79,142,248,0.12)",
          fill: true,
          tension: 0.27,
          pointRadius: 2
        }
      ]
    },
    options: {
      ...chartOptions(),
      scales: {
        ...chartOptions().scales,
        x: {
          ...chartOptions().scales.x,
          title: {
            display: true,
            text: "Day of month",
            color: "#8ea0bf"
          }
        },
        y: {
          ...chartOptions().scales.y,
          title: {
            display: true,
            text: "Daily spend (USD)",
            color: "#8ea0bf"
          },
          ticks: {
            ...chartOptions().scales.y.ticks,
            callback: (v) => compactUSD(v)
          }
        }
      }
    }
  });
}

function applyManualMappingToRequest(mapping) {
  if (!mapping.request_id) {
    return;
  }
  const request = indexedLookup(datasetIndex.requestsById, mapping.request_id);
  if (!request) {
    return;
  }
  const mappingStatus = normalizeManualMappingStatus(mapping.status);
  const baseConfidence = Number(mapping.confidence_pct || Number(request.confidence || 0) * 100) / 100;
  const resolvedTeam = mappingStatus === "deferred"
    ? mapping.current_owner
    : (mapping.resolved_team || mapping.suggested_owner || mapping.current_owner);
  const teamNode = chainNode(request, "Org Hierarchy");
  if (teamNode) {
    teamNode.value = resolvedTeam;
    teamNode.source = mappingStatus === "deferred" ? "Automated attribution" : "Manual mapping review";
    teamNode.method = mappingStatus === "confirmed" ? "Manual confirmation" : mappingStatus === "reassigned" ? "Manual reassignment" : "Probabilistic reconciliation";
    teamNode.confidence = mappingStatus === "confirmed"
      ? BUSINESS_RULES.manualMappingConfidenceByStatus.confirmed
      : mappingStatus === "reassigned"
        ? BUSINESS_RULES.manualMappingConfidenceByStatus.reassigned
        : baseConfidence;
  }
  request.confidence = mappingStatus === "deferred"
    ? baseConfidence
    : Math.max(Number(request.confidence || 0), BUSINESS_RULES.manualMappingConfidenceByStatus.resolvedFloor);
  if (request.cost_breakdown) {
    const billed = Number(request.cost_breakdown.billed_cost_usd || 0);
    const multiplier = mappingStatus === "confirmed"
      ? BUSINESS_RULES.manualMappingRiskPremiumMultiplier.confirmed
      : mappingStatus === "reassigned"
        ? BUSINESS_RULES.manualMappingRiskPremiumMultiplier.reassigned
        : BUSINESS_RULES.manualMappingRiskPremiumMultiplier.deferred;
    const riskPremium = Number((billed * multiplier).toFixed(4));
    request.cost_breakdown.confidence_risk_premium_usd = riskPremium;
    request.cost_breakdown.total_usd = Number((billed + riskPremium).toFixed(4));
    request.trac_usd = request.cost_breakdown.total_usd;
  }
}

function manualMappingView() {
  const items = getManualMappings();
  const counts = manualMappingCounts();
  const spendAtRisk = items
    .filter((item) => normalizeManualMappingStatus(item.status) === "needs_review")
    .reduce((acc, item) => acc + Number(item.spend_at_risk_usd || 0), 0);
  const reviewed = counts.confirmed + counts.reassigned;
  const uplift = manualMappingCoverageLiftPct(sum(dataset.teams || [], "spend_usd"));
  const latestMapping = items.find((item) => item.id === state.lastMappingImpactId) || null;
  const latestImpact = latestMapping ? manualMappingImpact(latestMapping) : null;
  if (!items.length) {
    return `
      ${renderSectionNarrative(
        "Manual Mapping",
        {
          conclusion: "There are no unresolved ownership overrides in the current dataset.",
          why: "That means the demo dataset does not currently need a human override to make ownership financially usable."
        },
        "This surface is intentionally empty when attribution evidence is already complete enough for the current dataset.",
        "Switch to a dataset with ambiguous ownership if you want to demonstrate the human-in-the-loop workflow."
      )}
      ${emptyStateMarkup(
        "No manual mapping items are available in the current dataset.",
        "All visible ownership paths are already above the review threshold. Use Request Proof to show evidence quality, or reset to reload the seeded ambiguity queue.",
        {
          actions: [
            { label: "Open Request Proof", action: "go", page: "attribution", primary: true },
            { label: "Reset Demo", action: "clear-logs" }
          ]
        }
      )}
    `;
  }

  const cards = items.map((item) => {
    const currentStatus = normalizeManualMappingStatus(item.status);
    const requestLinked = Boolean(item.request_id);
    const impact = manualMappingImpact(item);
    const choiceButtons = (item.candidate_teams || []).map((team) => {
      const active = (item.resolved_team || item.suggested_owner || item.current_owner) === team && currentStatus !== "needs_review";
      return `<button class="small-btn${active ? " primary" : ""}" data-action="manual-map-assign" data-mapping-id="${esc(item.id)}" data-team="${esc(team)}">${active ? "Mapped to " : "Map to "}${esc(team)}</button>`;
    }).join("");

    return `
      <div class="manual-mapping-card">
        <div class="manual-mapping-head">
          <div>
            <div class="manual-mapping-title">${esc(item.workload_label)}</div>
            <div class="manual-mapping-subtitle">${esc(item.scope)}${requestLinked ? ` | Request ${esc(item.request_id)}` : ""}</div>
          </div>
          ${manualMappingStatusPill(currentStatus)}
        </div>

        <div class="manual-mapping-meta" style="margin-bottom:10px">
          ${confidencePill(item.confidence_pct)}
          <span class="badge">${esc(item.reason_code || "Ownership mismatch")}</span>
          <span class="badge">${fmtUSD(item.spend_at_risk_usd || 0)} at risk</span>
        </div>

        <div class="manual-mapping-owner-row">
          <div class="manual-mapping-owner">
            <div class="manual-mapping-owner-label">Current automated owner</div>
            <div class="manual-mapping-owner-value">${esc(item.current_owner)}</div>
          </div>
          <div class="manual-mapping-owner">
            <div class="manual-mapping-owner-label">Suggested owner</div>
            <div class="manual-mapping-owner-value">${esc(item.suggested_owner)}</div>
          </div>
        </div>

        <div class="manual-mapping-kpis">
          <div class="manual-mapping-kpi">
            <div class="manual-mapping-kpi-label">Reason flagged</div>
            <div class="manual-mapping-kpi-value">${esc(item.reason)}</div>
          </div>
          <div class="manual-mapping-kpi">
            <div class="manual-mapping-kpi-label">Operator recommendation</div>
            <div class="manual-mapping-kpi-value">${esc(item.recommendation)}</div>
          </div>
        </div>

        <div class="manual-mapping-impact-grid">
          <div class="manual-mapping-impact-card">
            <div class="manual-mapping-kpi-label">Confidence increase</div>
            <div class="manual-mapping-kpi-value">${fmtPct(impact.beforeConfidence, 0)} -> ${fmtPct(impact.afterConfidence, 0)}</div>
          </div>
          <div class="manual-mapping-impact-card">
            <div class="manual-mapping-kpi-label">Owner reassignment</div>
            <div class="manual-mapping-kpi-value">${esc(impact.beforeOwner)} -> ${esc(impact.afterOwner)}</div>
          </div>
          <div class="manual-mapping-impact-card">
            <div class="manual-mapping-kpi-label">Budget impact</div>
            <div class="manual-mapping-kpi-value">${fmtUSD(impact.spendReassignedUsd)} moves from provisional to named ownership</div>
          </div>
          <div class="manual-mapping-impact-card">
            <div class="manual-mapping-kpi-label">Intervention reprioritization</div>
            <div class="manual-mapping-kpi-value">${esc(impact.linkedInterventionTitle)}</div>
          </div>
          <div class="manual-mapping-impact-card full">
            <div class="manual-mapping-kpi-label">Forecast delta</div>
            <div class="manual-mapping-kpi-value">${fmtUSD(impact.forecastDeltaUsd)} of planning risk reserve becomes more defensible once this mapping is resolved.</div>
          </div>
        </div>

        <ul class="manual-mapping-evidence">
          ${(item.evidence || []).map((evidence) => `<li>${esc(evidence)}</li>`).join("")}
        </ul>

        <div class="manual-mapping-team-choices">${choiceButtons}</div>

        <div class="manual-mapping-actions" style="margin-top:10px">
          <button class="small-btn success" data-action="manual-map-confirm" data-mapping-id="${esc(item.id)}">Accept Suggested Owner</button>
          <button class="small-btn" data-action="manual-map-defer" data-mapping-id="${esc(item.id)}">Needs More Evidence</button>
          ${requestLinked ? `<button class="small-btn" data-action="manual-map-open-request" data-request-id="${esc(item.request_id)}">Open Request Evidence</button>` : ""}
          <button class="small-btn" data-action="manual-map-open-team" data-team-id="${esc((indexedLookup(datasetIndex.teamsByName, impact.afterOwner) || {}).id || "")}">Open Team</button>
        </div>

        <div class="manual-mapping-note">${esc(item.note)}</div>
      </div>
    `;
  }).join("");

  return `
    <div class="card" style="margin-bottom:12px">
      <div class="card-header">
        <div>
          <div class="card-title">Manual Mapping Queue</div>
          <div class="card-subtitle">Use this queue when automated evidence is directionally useful but not strong enough to assign durable ownership without human confirmation.</div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="small-btn" data-action="go" data-page="attribution">Open Request Proof</button>
          <button class="small-btn" data-action="go" data-page="faq">Mapping FAQ</button>
        </div>
      </div>
      <div class="hint">Manual mapping is the human override layer that closes attribution gaps for ambiguous services, shared identities, and legacy deployment paths. Confirmed mappings raise coverage and reduce downstream financial ambiguity.</div>
    </div>

    ${renderSectionNarrative(
      "Manual Mapping",
      {
        conclusion: "Manual mapping is where uncertain ownership turns into a financially usable result.",
        why: "It closes the gap between directionally useful telemetry and ownership that finance, platform, and governance teams will actually trust."
      },
      latestImpact
        ? `${latestImpact.workloadLabel} now shows how one mapping decision changes confidence, budget ownership, and the forecast reserve.`
        : "Each mapping card now shows the explicit before-and-after business effect of resolving ambiguous ownership.",
      "Resolve one mapping and then jump into Request Proof, Teams, or Forecasting to show how the result propagates."
    )}

    <div class="grid grid-4" style="margin-bottom:12px">
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--amber)"></div>
        <div class="metric-label">Needs Review</div>
        <div class="metric-value">${fmtNumber(counts.needs_review)}</div>
        <div class="metric-meta">Mappings currently awaiting a decision</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--blue)"></div>
        <div class="metric-label">Spend Awaiting Confirmation</div>
        <div class="metric-value">${fmtUSD(spendAtRisk)}</div>
        <div class="metric-meta">Monthly spend still treated as provisional</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--green)"></div>
        <div class="metric-label">Resolved This Session</div>
        <div class="metric-value">${fmtNumber(reviewed)}</div>
        <div class="metric-meta">Confirmed or reassigned ownership paths</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--green)"></div>
        <div class="metric-label">Coverage Lift</div>
        <div class="metric-value">+${Number(uplift || 0).toFixed(1)} pts</div>
        <div class="metric-meta">Applied back into the overview coverage view</div>
      </div>
    </div>

    ${latestImpact ? `
      <div class="card" style="margin-bottom:12px">
        <div class="card-title">Latest Mapping Impact</div>
        <div class="card-subtitle">This is the before-and-after business effect of the most recent manual ownership decision.</div>
        <div class="grid grid-4" style="margin-top:12px">
          <div class="signal-item">
            <div class="signal-title">Confidence</div>
            <div class="signal-values"><strong>${fmtPct(latestImpact.beforeConfidence, 0)} -> ${fmtPct(latestImpact.afterConfidence, 0)}</strong></div>
          </div>
          <div class="signal-item">
            <div class="signal-title">Owner shift</div>
            <div class="signal-values"><strong>${esc(latestImpact.beforeOwner)} -> ${esc(latestImpact.afterOwner)}</strong></div>
          </div>
          <div class="signal-item">
            <div class="signal-title">Budget movement</div>
            <div class="signal-values"><strong>${fmtUSD(latestImpact.spendReassignedUsd)}</strong></div>
            <div class="hint" style="margin-top:6px">Now sits with a named accountable owner instead of a provisional queue.</div>
          </div>
          <div class="signal-item">
            <div class="signal-title">Planning effect</div>
            <div class="signal-values"><strong>${fmtUSD(latestImpact.forecastDeltaUsd)}</strong></div>
            <div class="hint" style="margin-top:6px">Lower unresolved attribution reserve in forecasting.</div>
          </div>
        </div>
      </div>
    ` : ""}

    <div class="manual-mapping-grid">${cards}</div>
  `;
}

function interventionActions(item) {
  const status = normalizeStatus(item.status);
  if (status === "recommended") {
    return `
      <button class="small-btn" data-action="intervention-status" data-intervention-id="${esc(item.id)}" data-next-status="review">Start Review</button>
      <button class="small-btn success" data-action="intervention-status" data-intervention-id="${esc(item.id)}" data-next-status="approved">Approve</button>
      <button class="small-btn" data-action="intervention-status" data-intervention-id="${esc(item.id)}" data-next-status="dismissed">Dismiss</button>
    `;
  }
  if (status === "review") {
    return `
      <button class="small-btn success" data-action="intervention-status" data-intervention-id="${esc(item.id)}" data-next-status="approved">Approve</button>
      <button class="small-btn" data-action="intervention-status" data-intervention-id="${esc(item.id)}" data-next-status="dismissed">Reject</button>
      <button class="small-btn" data-action="intervention-status" data-intervention-id="${esc(item.id)}" data-next-status="recommended">Reset</button>
    `;
  }
  if (status === "approved") {
    return `
      <button class="small-btn success" data-action="intervention-status" data-intervention-id="${esc(item.id)}" data-next-status="implemented">Mark Implemented</button>
      <button class="small-btn" data-action="intervention-status" data-intervention-id="${esc(item.id)}" data-next-status="dismissed">Dismiss</button>
    `;
  }
  if (status === "implemented") {
    return `<button class="small-btn" data-action="intervention-status" data-intervention-id="${esc(item.id)}" data-next-status="review">Re-open</button>`;
  }
  return `<button class="small-btn" data-action="intervention-status" data-intervention-id="${esc(item.id)}" data-next-status="recommended">Re-open</button>`;
}

function interventionsView() {
  const options = [
    ["all", "All"],
    ["recommended", "Recommended"],
    ["review", "In Review"],
    ["approved", "Approved"],
    ["implemented", "Implemented"],
    ["dismissed", "Dismissed"]
  ];

  const filters = options.map(([key, label]) => {
    return `<button class="filter-btn${state.interventionFilter === key ? " active" : ""}" data-action="set-intervention-filter" data-filter="${esc(key)}">${esc(label)}</button>`;
  }).join("");

  const items = filteredInterventions();

  const stats = computeOverview();
  const totalPotential = stats.totalPotential;
  const captured = stats.captured;
  const selectedIntervention = currentSelectedIntervention();
  const lensNarrative = pageLensNarrative("interventions");
  const queueItems = items.map((item) => {
    const isActive = selectedIntervention?.id === item.id;
    return `
      <button class="intervention-summary-card${isActive ? " active" : ""}" data-action="select-intervention" data-intervention-id="${esc(item.id)}">
        <div class="intervention-summary-head">
          <div>
            <div class="intervention-summary-title">${esc(item.title)}</div>
            <div class="intervention-summary-detail">${esc(item.detail)}</div>
          </div>
          <div class="intervention-summary-value">${fmtUSD(item.savings_usd_month)}</div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
          ${statusPill(item.status)}
          ${confidencePill(item.confidence_pct)}
          ${riskPill(item.risk)}
        </div>
        <div class="intervention-summary-meta">
          <span>${esc(item.team)}</span>
          <span>${esc(item.type)}</span>
          <span>${esc(interventionImplementationEffort(item))} effort</span>
        </div>
      </button>
    `;
  }).join("");
  const detailMethod = selectedIntervention?.methodology || {};
  const detailEvidence = selectedIntervention ? interventionEvidenceLines(selectedIntervention) : [];
  const detailBaseline = selectedIntervention ? interventionBaselineCost(selectedIntervention) : 0;
  const detailForecastImpact = selectedIntervention ? interventionForecastImpact(selectedIntervention) : 0;

  return `
    ${renderSectionNarrative(
      "Interventions",
      lensNarrative,
      selectedIntervention
        ? `${selectedIntervention.title} is the active action. It targets ${fmtUSD(interventionBaselineCost(selectedIntervention))} of baseline monthly cost with ${fmtUSD(interventionForecastImpact(selectedIntervention))} of annualized forecast impact.`
        : "Each intervention now shows baseline cost, projected savings, implementation effort, business risk, and linked evidence.",
      selectedIntervention
        ? "Approve it to show how the forecast and planning impact change."
        : "Select one recommendation to carry it into Forecasting, Governance, and the active context ribbon."
    )}

    <div class="grid grid-3" style="margin-bottom:12px">
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--green)"></div>
        <div class="metric-label">Total Potential</div>
        <div class="metric-value">${fmtUSD(totalPotential)}</div>
        <div class="metric-meta">Across all interventions</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--blue)"></div>
        <div class="metric-label">Open Pipeline</div>
        <div class="metric-value">${fmtNumber(interventionCounts().recommended + interventionCounts().review)}</div>
        <div class="metric-meta">Recommended or in review</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--green)"></div>
        <div class="metric-label">Captured</div>
        <div class="metric-value">${fmtUSD(captured)}</div>
        <div class="metric-meta">Approved or implemented</div>
      </div>
    </div>

    <div class="intervention-workbench">
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Intervention Queue</div>
            <div class="card-subtitle">Select one recommendation at a time. This keeps the queue readable and moves the supporting methodology into a focused detail panel.</div>
          </div>
        </div>
        <div class="filter-bar">${filters}</div>
        <div class="intervention-summary-stack">
          ${queueItems || emptyStateMarkup(
            "No interventions in this filter",
            "The selected status has no matching recommendations. Change the filter or reset the demo to restore the default intervention queue.",
            {
              compact: true,
              actions: [
                { label: "Show All", action: "set-intervention-filter", primary: true, data: { filter: "all" } }
              ]
            }
          )}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
        <div>
          <div class="card-title">Selected Intervention</div>
          <div class="card-subtitle">Show one recommendation clearly: what it changes, what it saves, what risk it carries, and why the platform believes it is valid.</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="small-btn" data-action="export-artifact" data-artifact="intervention-brief">Export intervention brief</button>
          <button class="small-btn" data-action="export-artifact" data-artifact="team-report">Export team optimization report</button>
        </div>
        </div>
        ${selectedIntervention ? `
          <div class="intervention-detail-shell">
            <div class="intervention-head">
              <div>
                <div class="intervention-title">${esc(selectedIntervention.title)}</div>
                <div class="intervention-detail">${esc(selectedIntervention.detail)}</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:22px;font-weight:700;color:var(--green)">${fmtUSD(selectedIntervention.savings_usd_month)}</div>
                <div class="hint">estimated monthly impact</div>
              </div>
            </div>

            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
              ${statusPill(selectedIntervention.status)}
              ${confidencePill(selectedIntervention.confidence_pct)}
              ${riskPill(selectedIntervention.risk)}
              <span class="badge">${esc(selectedIntervention.type)}</span>
              <span class="badge">${esc(selectedIntervention.team)}</span>
              <span class="badge">${esc(selectedIntervention.equivalence_mode || "N/A")}</span>
            </div>

            <div class="grid grid-4" style="margin-top:12px">
              <div class="signal-item">
                <div class="signal-title">Baseline cost</div>
                <div class="signal-values"><strong>${fmtUSD(detailBaseline)}</strong></div>
              </div>
              <div class="signal-item">
                <div class="signal-title">Projected savings</div>
                <div class="signal-values"><strong>${fmtUSD(selectedIntervention.savings_usd_month)}</strong></div>
              </div>
              <div class="signal-item">
                <div class="signal-title">Implementation effort</div>
                <div class="signal-values"><strong>${esc(interventionImplementationEffort(selectedIntervention))}</strong></div>
              </div>
              <div class="signal-item">
                <div class="signal-title">Forecast impact</div>
                <div class="signal-values"><strong>${fmtUSD(detailForecastImpact)}</strong></div>
                <div class="hint" style="margin-top:6px">Annualized planning effect</div>
              </div>
            </div>

            <div class="methodology-box">
              <div class="methodology-title">Recommendation methodology</div>
              <div class="methodology-row"><strong>Optimization Category:</strong> ${esc(detailMethod.category || "N/A")}</div>
              <div class="methodology-row"><strong>Threshold Condition:</strong> ${esc(detailMethod.threshold || "N/A")}</div>
              <div class="methodology-row"><strong>Conditional Rule:</strong> ${esc(detailMethod.rule || "N/A")}</div>
            </div>

            <div class="methodology-box">
              <div class="methodology-title">Linked evidence</div>
              ${detailEvidence.map((line) => `<div class="methodology-row">${esc(line)}</div>`).join("")}
            </div>

            <div class="intervention-foot">
              <div class="hint">${esc(selectedIntervention.id)} | Equivalence status: ${esc(selectedIntervention.equivalence_status || "n/a")}</div>
              <div class="intervention-actions">${interventionActions(selectedIntervention)}</div>
            </div>
          </div>
        ` : emptyStateMarkup(
          "No intervention selected",
          "Select a recommendation from the queue to show savings, risk, evidence, and next actions.",
          { compact: true }
        )}
      </div>
    </div>
  `;
}

function governanceView() {
  const lensNarrative = pageLensNarrative("governance");
  const simulation = governanceSimulationResult();
  const modeCards = (dataset.governance?.modes || []).map((mode) => {
    const active = state.mode === mode.key;
    const color = MODE_COLORS[mode.key] || MODE_COLORS.advisory;
    return `
      <div class="card" style="background:var(--surface)">
        <div class="card-header">
          <div>
            <div class="card-title" style="font-size:14px">${esc(mode.label)}</div>
            <div class="card-subtitle">${esc(mode.description || "")}</div>
          </div>
          <span class="pill" style="background:${color.bg};color:${color.color}">${active ? "Current" : "Available"}</span>
        </div>
        <div class="hint" style="margin-bottom:10px">${esc(mode.impact || "")}</div>
        ${active ? "" : `<button class="small-btn" data-action="set-mode" data-mode="${esc(mode.key)}">Set Mode</button>`}
      </div>
    `;
  }).join("");
  const simulationModeButtons = (dataset.governance?.modes || []).map((mode) => {
    const active = state.governanceSimulationMode === mode.key;
    return `<button class="filter-btn${active ? " active" : ""}" data-action="governance-set-sim-mode" data-mode="${esc(mode.key)}">${esc(mode.label)}</button>`;
  }).join("");
  const bundleButtons = GOVERNANCE_POLICY_BUNDLES.map((bundle) => {
    const active = state.governanceSimulationBundle === bundle.key;
    return `<button class="filter-btn${active ? " active" : ""}" data-action="governance-set-bundle" data-bundle="${esc(bundle.key)}">${esc(bundle.label)}</button>`;
  }).join("");
  const selectedRequestValue = selectedGovernanceRequestValue();
  const governanceRequestStatus = governanceRequestSelectionFeedback(selectedRequestValue);
  const requestOptions = (dataset.attribution_requests || []).map((request) => {
    const active = selectedRequestValue === request.id;
    const owner = selectedRequestTeamName(request) || "Review required";
    return `<option value="${esc(request.id)}"${active ? " selected" : ""}>${esc(chainNode(request, "Service Attribution")?.value || request.id)} | ${esc(request.model)} | ${esc(owner)}</option>`;
  }).join("");

  const policyRows = (dataset.governance?.policies || []).map((policy) => {
    return `
      <tr>
        <td class="mono" style="color:var(--text)">${esc(policy.policy_id)}</td>
        <td style="color:var(--text)">${esc(policy.name)}</td>
        <td>${esc(policy.mode)}</td>
        <td>${esc(policy.scope)}</td>
        <td>${esc(policy.status)}</td>
        <td>${esc(policy.rule)}</td>
        <td>${fmtNumber(policy.violations_7d || 0)}</td>
      </tr>
    `;
  }).join("");

  const matrixRows = (dataset.governance?.fail_open_matrix || []).map((row) => {
    return `
      <tr>
        <td class="mono" style="color:var(--text)">${esc(row.test_id)}</td>
        <td>${esc(row.scenario)}</td>
        <td>${esc(row.expected)}</td>
      </tr>
    `;
  }).join("");

  const trustBullets = (dataset.governance?.trust_boundary_summary || []).map((item) => {
    return `<li class="hint" style="margin-bottom:6px">${esc(item)}</li>`;
  }).join("");

  return `
    ${renderSectionNarrative(
      "Governance",
      lensNarrative,
      simulation
        ? `${simulation.request.model} under ${modeLabel(simulation.mode)} and the ${simulation.bundle.label} bundle currently resolves to: ${simulation.decision}.`
        : "Use the policy simulator to show how one request behaves as you change mode or tighten the active bundle.",
      "Prove that the platform can change decision posture without becoming an outage path, then export the governance exception log."
    )}

    <div class="grid grid-3" style="margin-bottom:12px" data-walkthrough-anchor="walkthrough-governance">${modeCards || emptyStateMarkup("No governance modes", "No deployment modes are loaded for this local run.", { compact: true })}</div>

    <div class="governance-sim-grid" style="margin-bottom:12px">
      <div class="simulation-control-grid">
        <div class="simulation-card">
          <div class="simulation-card-title">Policy Simulation</div>
          <div class="simulation-card-subtitle">Test one request against different deployment modes and policy bundles. This shows what the interceptor would do, why, and what the next operating step should be.</div>
          <div class="simulation-button-row">${simulationModeButtons}</div>
          <div class="simulation-button-row">${bundleButtons}</div>
          <label class="input-label" for="governance-request-select" style="margin-top:12px">Request sample</label>
          <select
            id="governance-request-select"
            class="simulation-select control-select"
            data-action-change="governance-set-request"
            data-simulation="request"
            aria-label="Governance request sample"
            aria-describedby="governance-request-feedback"
            aria-invalid="${governanceRequestStatus.kind === "error" ? "true" : "false"}"
            ${requestOptions ? "" : "disabled"}
          >
            ${requestOptions || "<option>No request samples loaded</option>"}
          </select>
          ${fieldFeedbackMarkup("governance-request", governanceRequestStatus, selectedRequestValue)}
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
            <button class="small-btn" data-action="go" data-page="attribution">Open Request Proof</button>
            <button class="small-btn" data-action="export-artifact" data-artifact="governance-log">Export governance exception log</button>
          </div>
        </div>

        <div class="card">
          <div class="card-title" style="margin-bottom:10px">Governance Rules In Force</div>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Mode</th>
                  <th>Scope</th>
                  <th>Status</th>
                  <th>Rule</th>
                  <th>Violations (7d)</th>
                </tr>
              </thead>
              <tbody>${policyRows || tableEmptyRowMarkup(7, "No governance policies", "No policy rows are loaded for the current demo dataset.")}</tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="simulation-result-card">
        <div class="simulation-result-label">Simulated decision</div>
        <div class="simulation-result-value">${esc(simulation?.decision || "Unavailable")}</div>
        <div class="simulation-result-why">${esc(simulation?.why || "No simulation result available.")}</div>
        <div class="grid grid-2" style="margin-top:12px">
          <div class="signal-item">
            <div class="signal-title">Request</div>
            <div class="signal-values"><strong>${esc(simulation?.request?.id || "N/A")}</strong></div>
            <div class="hint" style="margin-top:6px">${esc(chainNode(simulation?.request, "Service Attribution")?.value || "")}</div>
          </div>
          <div class="signal-item">
            <div class="signal-title">Owner</div>
            <div class="signal-values"><strong>${esc(selectedRequestTeamName(simulation?.request) || "Review required")}</strong></div>
            <div class="hint" style="margin-top:6px">${esc(chainNode(simulation?.request, "Budget Attribution")?.value || "Budget owner unresolved")}</div>
          </div>
          <div class="signal-item">
            <div class="signal-title">Mode</div>
            <div class="signal-values"><strong>${esc(modeLabel(simulation?.mode || state.mode))}</strong></div>
            <div class="hint" style="margin-top:6px">${esc(simulation?.bundle?.label || "Current bundle")}</div>
          </div>
          <div class="signal-item">
            <div class="signal-title">Next action</div>
            <div class="signal-values"><strong>${esc(simulation?.nextAction || "No next action")}</strong></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-8-4">
      <div class="card">
        <div class="card-title" style="margin-bottom:10px">What this proves</div>
        <div class="card-subtitle">Governance is not static policy text. It is a decision surface that can explain how the same request behaves under different control postures.</div>
        <div class="grid grid-2" style="margin-top:12px">
          <div class="signal-item">
            <div class="signal-title">With policy</div>
            <div class="signal-values"><strong>${esc(simulation?.decision || "Unavailable")}</strong></div>
            <div class="hint" style="margin-top:6px">${esc(simulation?.why || "")}</div>
          </div>
          <div class="signal-item">
            <div class="signal-title">Why it matters</div>
            <div class="signal-values"><strong>Safe deployment posture</strong></div>
            <div class="hint" style="margin-top:6px">You can tighten control posture without converting governance into an outage path.</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:10px">Deployment Trust Boundary</div>
        <ul style="padding-left:16px">${trustBullets}</ul>
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <div class="card-title" style="margin-bottom:10px">Safety Validation Scenarios</div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Test</th>
              <th>Failure Scenario</th>
              <th>Expected Behavior</th>
            </tr>
          </thead>
          <tbody>${matrixRows || tableEmptyRowMarkup(3, "No safety scenarios", "No fail-open validation scenarios are loaded.")}</tbody>
        </table>
      </div>
    </div>
  `;
}

function forecastScenarioLibrary() {
  if (dataset.forecast_scenarios && Object.keys(dataset.forecast_scenarios).length) {
    return dataset.forecast_scenarios;
  }
  return FALLBACK_FORECAST_SCENARIOS;
}

function getForecastScenario(key = state.forecastScenarioKey) {
  const scenarios = forecastScenarioLibrary();
  return scenarios[key] || scenarios[DEFAULT_FORECAST_SCENARIO] || Object.values(scenarios)[0];
}

function signedPct(value, digits = 1) {
  const num = Number(value || 0);
  return `${num >= 0 ? "+" : ""}${num.toFixed(digits)}%`;
}

function buildForecastInputSeries(scenarioKey = state.forecastScenarioKey) {
  const scenario = getForecastScenario(scenarioKey);
  const trend = dataset.overview?.spend_trend_k_usd || [];
  const divisor = Math.max(trend.length - 1, 1);
  return trend.map((item, idx) => {
    const totalUsd = Number(item.total || 0) * 1000;
    const capturedUsd = Number(item.captured || 0) * 1000;
    const progress = trend.length <= 1 ? 1 : idx / divisor;
    const demandLift = totalUsd * (Number(scenario.demand_shift_pct || 0) / 100);
    const trendLift = totalUsd * (Number(scenario.trend_ramp_pct || 0) / 100) * progress;
    const governanceDrag = totalUsd * (Number(scenario.governance_drag_pct || 0) / 100) * (0.35 + (progress * 0.65));
    const captureCredit = capturedUsd * Number(scenario.capture_realization_pct || 0);
    const adjusted = totalUsd + demandLift + trendLift - governanceDrag - captureCredit;
    return Math.max(Math.round(adjusted), Math.round(totalUsd * BUSINESS_RULES.forecastFloorShare));
  });
}

function forecastProjectionLabels(points) {
  const trend = dataset.overview?.spend_trend_k_usd || [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const lastMonth = trend.length ? String(trend[trend.length - 1].month || "Jan") : "Jan";
  const startIndex = Math.max(monthNames.indexOf(lastMonth), 0);
  return points.map((_, idx) => monthNames[(startIndex + idx + 1) % monthNames.length]);
}

function updateForecastPreview(options = {}) {
  const { toast = false } = options;
  const scenario = getForecastScenario();
  // FIX: scenario and horizon selection should immediately update the forecast preview state.
  seedForecastPlanner({
    toast,
    statusOverride: `${scenario.label} preview updated for ${state.forecastHorizonMonths} months. Generate Live Forecast to validate with the demo runtime.`
  });
}

function seedForecastPlanner(options = {}) {
  const { log = false, toast = false, statusOverride = "" } = options;
  const monthly = buildForecastInputSeries();
  const scenario = getForecastScenario();
  state.forecastResult = buildLocalForecastEstimate(monthly, state.forecastHorizonMonths, scenario);
  state.forecastDirty = false;
  state.forecastLoading = false;
  state.forecastStatus = statusOverride || `${scenario.label} forecast estimated locally from the demo dataset.`;
  if (log) {
    appendLog("ok", "Forecast ready", `${scenario.label} baseline prepared from local demo data.`, null, { hidden: true });
  }
  if (toast) {
    showToast("Forecast Reset", "Baseline forecast restored using local demo data.");
  }
}

async function resetForecastPlanner(options = {}) {
  const { log = false, toast = false } = options;
  state.forecastScenarioKey = DEFAULT_FORECAST_SCENARIO;
  state.forecastHorizonMonths = DEFAULT_FORECAST_HORIZON;
  state.forecastDirty = false;
  seedForecastPlanner({
    log,
    toast,
    statusOverride: "Forecast reset to baseline 12-month view."
  });
}

function forecastView() {
  const data = forecastViewData();
  const forecastStatePanel = state.forecastLoading
    ? loadingStateMarkup("Forecast running", "The local runtime is generating the selected planning case.", { compact: true })
    : data.points.length
      ? successStateMarkup("Forecast ready", state.forecastStatus || "The forecast is available from seeded local data.", { compact: true })
      : emptyStateMarkup("Forecast not generated", "No forecast points are available yet. Generate a live forecast or reset to the baseline local estimate.", {
        compact: true,
        actions: [{ label: "Generate Live Forecast", action: "forecast-generate", primary: true }]
      });

  return `
    <div class="card" style="margin-bottom:12px">
      <div class="forecast-toolbar">
        <div>
          <div class="card-title">Cost Forecasting</div>
          <div class="card-subtitle">Project how spend changes under the core planning cases, then compare the selected path to the alternatives.</div>
        </div>
        <div class="forecast-button-row">
          <button class="small-btn primary" data-action="forecast-generate" ${state.forecastLoading ? "disabled" : ""}>${state.forecastLoading ? "Generating..." : "Generate Live Forecast"}</button>
          <button class="small-btn" data-action="forecast-reset" ${state.forecastLoading ? "disabled" : ""}>Reset</button>
          <button class="small-btn" data-action="export-artifact" data-artifact="planning-pack">Export monthly planning pack</button>
        </div>
      </div>

      <div id="forecast-horizon-row" class="forecast-horizon-row">${renderForecastHorizonButtons()}</div>
      <div id="forecast-scenario-grid" class="forecast-scenario-grid">${renderForecastScenarioButtons()}</div>
      <div id="forecast-status" class="hint">${esc(state.forecastStatus)}</div>
      <div style="margin-top:12px">${forecastStatePanel}</div>

      <div class="forecast-detail-grid">
        <div id="forecast-scenario-meaning" class="forecast-detail-card">${renderForecastScenarioMeaning(data)}</div>

        <div id="forecast-scenario-readout" class="forecast-detail-card">${renderForecastScenarioReadout(data)}</div>
      </div>

      <div style="height:320px;margin-top:14px"><canvas id="chart-forecast"></canvas></div>
      ${renderChartSemantics([
        { label: "X-axis", value: "Historical and projected month" },
        { label: "Y-axis", value: "Spend in USD, including forecast bounds" }
      ])}

      <div class="forecast-monthly-section">
        <div class="card-title" style="font-size:14px">Monthly Outlook</div>
        <div class="card-subtitle">Expected monthly spend and likely range for the selected planning case.</div>
      </div>
      <div id="forecast-estimate-grid" class="grid grid-3">${renderForecastEstimateCards(data)}</div>
    </div>

    <div class="card" style="margin-top:12px">
      <div class="card-header">
        <div>
          <div class="card-title">Compare Planning Cases</div>
          <div class="card-subtitle">Keep the selected case in view while showing how the other planning options diverge.</div>
        </div>
      </div>
      <div id="forecast-compare-buttons" class="filter-bar">${renderForecastCompareButtons()}</div>
      <div style="height:280px;margin-top:12px"><canvas id="chart-forecast-compare"></canvas></div>
      ${renderChartSemantics([
        { label: "X-axis", value: "Projected month in the selected horizon" },
        { label: "Y-axis", value: "Projected monthly spend in USD by scenario" }
      ])}
    </div>
  `;
}

function renderForecastChart() {
  const trend = dataset.overview?.spend_trend_k_usd || [];
  const historical = trend.map((item) => Number(item.total || 0) * 1000);
  const historicalLabels = trend.map((item) => item.month);
  const forecastPoints = state.forecastResult?.points || [];
  const futureLabels = forecastProjectionLabels(forecastPoints);
  const labels = historicalLabels.concat(futureLabels);
  const predicted = forecastPoints.map((point) => Number(point.predicted_spend_usd || 0));
  const lower = forecastPoints.map((point) => Number(point.lower_bound_usd || 0));
  const upper = forecastPoints.map((point) => Number(point.upper_bound_usd || 0));

  createChart("chart-forecast", {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Historical spend",
          data: historical.concat(Array(forecastPoints.length).fill(null)),
          borderColor: "rgba(125, 154, 197, 0.78)",
          backgroundColor: "rgba(125, 154, 197, 0.08)",
          fill: false,
          tension: 0.2,
          pointRadius: 3,
          borderWidth: 2
        },
        {
          label: `${getForecastScenario().label} forecast`,
          data: Array(historical.length).fill(null).concat(predicted),
          borderColor: "#4f8ef8",
          backgroundColor: "rgba(79,142,248,0.12)",
          fill: false,
          tension: 0.26,
          pointRadius: 3,
          borderWidth: 3
        },
        {
          label: "Lower bound",
          data: Array(historical.length).fill(null).concat(lower),
          borderColor: "#eda82e",
          borderDash: [6, 6],
          fill: false,
          tension: 0.2,
          pointRadius: 0
        },
        {
          label: "Upper bound",
          data: Array(historical.length).fill(null).concat(upper),
          borderColor: "#2ac487",
          borderDash: [6, 6],
          fill: false,
          tension: 0.2,
          pointRadius: 0
        }
      ]
    },
    options: {
      ...chartOptions(),
      plugins: {
        ...chartOptions().plugins,
        legend: {
          display: true,
          labels: {
            color: "#a9b4cf",
            boxWidth: 14,
            boxHeight: 14
          }
        }
      },
      scales: {
        ...chartOptions().scales,
        x: {
          ...chartOptions().scales.x,
          title: {
            display: true,
            text: "Month",
            color: "#8ea0bf"
          }
        },
        y: {
          ...chartOptions().scales.y,
          title: {
            display: true,
            text: "Spend (USD)",
            color: "#8ea0bf"
          },
          ticks: {
            ...chartOptions().scales.y.ticks,
            callback: (v) => compactUSD(v)
          }
        }
      }
    }
  }, {
    ariaLabel: `${getForecastScenario().label} spend forecast with historical actuals and confidence bounds`
  });

  const compareKeys = state.forecastCompareKeys.length ? state.forecastCompareKeys : ["baseline"];
  const compareProjection = compareKeys.map((key) => ({
    key,
    scenario: getForecastScenario(key),
    points: forecastProjectionForScenario(key, state.forecastHorizonMonths)
  }));
  const compareLabels = compareProjection[0]?.points.map((point) => point.label) || [];
  const comparePalette = [PALETTE.brand, PALETTE.success, PALETTE.warning, PALETTE.neutral];
  createChart("chart-forecast-compare", {
    type: "line",
    data: {
      labels: compareLabels,
      datasets: compareProjection.map((entry, idx) => ({
        label: entry.scenario.label,
        data: entry.points.map((point) => point.predicted_spend_usd),
        borderColor: comparePalette[idx % comparePalette.length],
        backgroundColor: `${comparePalette[idx % comparePalette.length]}22`,
        fill: false,
        tension: 0.22,
        pointRadius: 2,
        borderWidth: entry.key === state.forecastScenarioKey ? 3 : 2
      }))
    },
    options: {
      ...chartOptions(),
      plugins: {
        ...chartOptions().plugins,
        legend: {
          display: true,
          labels: {
            color: "#a9b4cf",
            boxWidth: 14,
            boxHeight: 14
          }
        }
      },
      scales: {
        ...chartOptions().scales,
        x: {
          ...chartOptions().scales.x,
          title: {
            display: true,
            text: "Projected month",
            color: "#8ea0bf"
          }
        },
        y: {
          ...chartOptions().scales.y,
          title: {
            display: true,
            text: "Projected spend (USD)",
            color: "#8ea0bf"
          },
          ticks: {
            ...chartOptions().scales.y.ticks,
            callback: (v) => compactUSD(v)
          }
        }
      }
    }
  }, {
    ariaLabel: "Scenario comparison chart showing projected monthly spend by planning scenario"
  });
}

function integrationsView() {
  const overview = currentIntegrationOverview();
  const summary = overview?.summary || FALLBACK_INTEGRATION_OVERVIEW.summary;
  const sources = overview?.sources || [];
  const routes = overview?.routes || [];
  const scenarios = overview?.scenarios || [];
  const deliveries = state.integrationDeliveries?.length
    ? state.integrationDeliveries
    : (overview?.recent_deliveries || []);

  const sourceCards = sources.map((source) => `
    <div class="integration-source-card">
      <div class="integration-kicker">${esc(source.direction)} • ${esc(source.category)}</div>
      <div class="integration-title">${esc(source.name)}</div>
      <div class="integration-meta">${esc(source.system)} • Owner: ${esc(source.owner)}</div>
      <p class="integration-detail" style="margin-top:10px">${esc(source.business_value)}</p>
      <div class="integration-inline-list">
        ${(source.primary_signals || []).slice(0, 3).map((signal) => `<span class="adoption-inline-pill">${esc(signal)}</span>`).join("")}
      </div>
      <div class="hint" style="margin-top:12px">Downstream consumers: ${esc((source.downstream_consumers || []).join(", "))}</div>
    </div>
  `).join("");

  const routeCards = routes.map((route) => `
    <div class="integration-route-card">
      <div class="integration-kicker">${esc(route.workflow_name)}</div>
      <div class="integration-title">${esc(route.name)}</div>
      <div class="integration-meta">Owner: ${esc(route.owner)} • SLA: ${esc(route.sla_target)}</div>
      <p class="integration-detail" style="margin-top:10px">${esc(route.business_outcome)}</p>
      <div class="hint" style="margin-top:10px"><strong>Trigger:</strong> ${esc(route.trigger)}</div>
      <div class="hint" style="margin-top:6px"><strong>Expected action:</strong> ${esc(route.expected_action)}</div>
      <div class="integration-channel-list">
        ${(route.channels || []).map((channel) => `
          <div class="integration-channel-row">
            <div>
              <div class="integration-channel-label">${esc(channel.channel)}${channel.fallback ? " (fallback)" : ""}</div>
              <div class="integration-channel-target">${esc(channel.target)}</div>
            </div>
            <div class="integration-meta" style="text-align:right">${esc(channel.purpose)}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  const routeById = Object.fromEntries(routes.map((route) => [route.route_id, route]));
  const scenarioCards = scenarios.map((scenario) => {
    const route = routeById[scenario.route_id];
    return `
      <div class="integration-scenario-card">
        <div class="integration-kicker">${esc(route?.workflow_name || "Operational workflow")}</div>
        <div class="integration-title">${esc(scenario.title)}</div>
        <p>${esc(scenario.description)}</p>
        <div class="hint" style="margin-top:10px"><strong>Business question:</strong> ${esc(scenario.business_question)}</div>
        <div class="hint" style="margin-top:6px"><strong>Expected outcome:</strong> ${esc(scenario.expected_outcome)}</div>
        <button
          class="small-btn primary"
          data-action="integrations-run-scenario"
          data-scenario-id="${esc(scenario.scenario_id)}"
          ${state.integrationLoading ? "disabled" : ""}
        >
          ${state.integrationLoading ? "Running..." : "Run Scenario"}
        </button>
      </div>
    `;
  }).join("");

  const rows = deliveries.map((delivery) => `
    <tr>
      <td>${esc(delivery.route_name || delivery.workflow_name || delivery.event_type || "N/A")}</td>
      <td>${esc(delivery.audience || "Unassigned")}</td>
      <td>${esc(delivery.channel || "")}</td>
      <td>${esc(delivery.status || "")}</td>
      <td>${esc(delivery.business_outcome || delivery.message || "")}</td>
      <td>${esc(fmtDateTime(delivery.sent_at || ""))}</td>
    </tr>
  `).join("");

  return `
    <div class="card" style="margin-bottom:12px">
      <div class="card-header">
        <div>
          <div class="card-title">Operational Integrations</div>
          <div class="card-subtitle">Shows how Argmin plugs into the company operating system: signals in from enterprise systems, decisions out to the teams and tools that act on them.</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="small-btn" data-action="integrations-refresh" ${state.integrationLoading ? "disabled" : ""}>${state.integrationLoading ? "Refreshing..." : "Refresh Live State"}</button>
        </div>
      </div>
      <div class="hint">The value here is not that Argmin can send a message. It is that Argmin turns telemetry into routed business handoffs with owners, SLAs, and expected downstream actions.</div>
    </div>

    <div class="integration-summary-grid" style="margin-bottom:12px">
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--blue)"></div>
        <div class="metric-label">Inbound Systems</div>
        <div class="metric-value" style="font-size:20px">${fmtNumber(summary.inbound_source_count || 0)}</div>
        <div class="metric-meta">Billing, identity, SDLC, and telemetry sources currently modeled</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--amber)"></div>
        <div class="metric-label">Business Workflows</div>
        <div class="metric-value" style="font-size:20px">${fmtNumber(summary.outbound_route_count || 0)}</div>
        <div class="metric-meta">Distinct handoff paths from Argmin into owned operational workflows</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--green)"></div>
        <div class="metric-label">Delivery Success</div>
        <div class="metric-value" style="font-size:20px">${fmtPct(summary.success_rate_pct || 0, 0)}</div>
        <div class="metric-meta">${fmtNumber(summary.recent_delivery_count || 0)} recent handoffs • ${fmtNumber(summary.failed_deliveries || 0)} failed</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--green)"></div>
        <div class="metric-label">Delivery Posture</div>
        <div class="metric-value" style="font-size:20px">${esc(String(summary.live_delivery_mode || "simulated").replace(/^./, (c) => c.toUpperCase()))}</div>
        <div class="metric-meta">${fmtNumber(summary.configured_destination_count || 0)} configured destinations • last handoff ${esc(fmtDateTime(summary.last_delivery_at || ""))}</div>
      </div>
    </div>

    <div class="grid grid-7-5" style="margin-bottom:12px">
      <div class="card">
        <div class="card-title">Connected Systems</div>
        <div class="card-subtitle">What enterprise systems Argmin already consumes or hands off into, and why each connection matters.</div>
        <div class="integration-source-grid" style="margin-top:12px">${sourceCards || emptyStateMarkup("No connected systems", "The integration source list is empty. Reset the demo to reload seeded enterprise systems.", { compact: true })}</div>
      </div>
      <div class="card">
        <div class="card-title">Scenario Runner</div>
        <div class="card-subtitle">Run the business workflows that matter in diligence: escalation, execution handoff, pricing drift review, and executive reporting.</div>
        <div class="integration-scenario-grid" style="margin-top:12px">${scenarioCards || emptyStateMarkup("No integration scenarios", "No operational handoff scenarios are loaded. Reset the demo or refresh live state before presenting integrations.", { compact: true })}</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:12px">
      <div class="card-title">Operational Handoffs</div>
      <div class="card-subtitle">Where Argmin routes decisions once it knows who should act and why.</div>
      <div class="integration-route-grid" style="margin-top:12px">${routeCards || emptyStateMarkup("No operational handoff routes", "No downstream route contracts are loaded for this local run.", { compact: true })}</div>
    </div>

    <div class="card">
      <div class="card-title" style="margin-bottom:10px">Recent Handoffs</div>
      <div class="card-subtitle" style="margin-bottom:10px">Latest delivery records across the modeled business workflows. This is the audit surface, not the whole story.</div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Workflow</th>
              <th>Owner</th>
              <th>Channel</th>
              <th>Status</th>
              <th>Business Outcome</th>
              <th>Sent At</th>
            </tr>
          </thead>
          <tbody>${rows || tableEmptyRowMarkup(6, "No delivery records yet", "Run one of the scenarios above to create a visible simulated handoff record.")}</tbody>
        </table>
      </div>
    </div>
  `;
}

function feasibilityClassName(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("fully")) {
    return "good";
  }
  if (normalized.includes("partial")) {
    return "warn";
  }
  if (normalized.includes("indirect")) {
    return "info";
  }
  if (normalized.includes("uncapturable") || normalized.includes("unknown")) {
    return "danger";
  }
  return "";
}

function renderCoverageSummaryCards(summary = {}) {
  const cards = [
    {
      label: "Pathways Classified",
      value: `${fmtNumber(summary.classified_pathways || 0)} / 20`,
      meta: "Every pathway is represented before downstream interpretation.",
      accent: "var(--blue)"
    },
    {
      label: "Capture Coverage",
      value: fmtPct(summary.capture_coverage_pct || 0),
      meta: `${fmtUSD(summary.unknown_spend_usd || 0)} remains unknown, indirect, or excluded.`,
      accent: "var(--green)"
    },
    {
      label: "Identity Resolution",
      value: fmtPct(summary.identity_resolution_pct || 0),
      meta: "Linked to canonical identities, teams, or explicit unknown states.",
      accent: "var(--amber)"
    },
    {
      label: "Agent Lineage",
      value: fmtPct(summary.agent_lineage_pct || 0),
      meta: "Root request propagation across descendant calls.",
      accent: "var(--blue)"
    }
  ];
  return cards.map((card) => `
    <div class="card metric-card coverage-kpi">
      <div class="metric-accent" style="background:${card.accent}"></div>
      <div class="metric-label">${esc(card.label)}</div>
      <div class="metric-value">${esc(card.value)}</div>
      <div class="metric-meta">${esc(card.meta)}</div>
    </div>
  `).join("");
}

function coverageView() {
  const coverage = dataset.coverage || FALLBACK_DATASET.coverage;
  const summary = coverage.summary || {};
  const lens = pageLensNarrative("coverage");
  const pathwayRows = (coverage.pathways || []).map((row) => `
    <tr>
      <td>
        <div class="mono" style="color:var(--text)">${esc(row.category)}</div>
        <div class="hint">${esc(row.label)}</div>
      </td>
      <td><span class="status-badge ${feasibilityClassName(row.feasibility)}">${esc(row.feasibility)}</span></td>
      <td>${esc(row.capture_method)}</td>
      <td>${esc(row.usage_truth)}</td>
      <td>${esc(row.cost_truth)}</td>
      <td>${esc(row.ownership_truth)}</td>
      <td>${fmtUSD(row.spend_usd || 0)}</td>
      <td>${fmtPct(row.coverage_pct || 0)}</td>
      <td>${esc(row.caveat)}</td>
    </tr>
  `).join("");

  const blindSpotCards = (coverage.blind_spots || []).map((item) => `
    <div class="blindspot-card ${esc(String(item.severity || "").toLowerCase())}">
      <div class="blindspot-head">
        <span class="mono">${esc(item.id)}</span>
        <span class="status-badge ${item.severity === "high" ? "danger" : item.severity === "medium" ? "warn" : "info"}">${esc(item.severity || "medium")}</span>
      </div>
      <div class="blindspot-title">${esc(item.title)}</div>
      <div class="blindspot-meta">${esc(item.pathway)} • ${fmtUSD(item.spend_usd || 0)} exposed</div>
      <p>${esc(item.cause)}</p>
      <div class="blindspot-action">${esc(item.operator_action)}</div>
    </div>
  `).join("");

  const lineage = coverage.agent_lineage || {};
  const lineageCalls = (lineage.calls || []).map((call) => `
    <div class="lineage-step ${call.linked ? "linked" : "missing"}">
      <div class="lineage-step-index">${fmtNumber(call.step)}</div>
      <div>
        <div class="lineage-step-title">${esc(call.purpose)}</div>
        <div class="hint mono">${esc(call.event_id)}${call.parent_event_id ? ` <- ${esc(call.parent_event_id)}` : " <- missing parent"}</div>
      </div>
      <div class="lineage-step-cost">${fmtUSD(call.cost_usd || 0, 2)}</div>
    </div>
  `).join("");

  const scenarioRows = (coverage.scenario_results || []).map((scenario) => `
    <tr>
      <td><span class="mono">${esc(scenario.id)}</span></td>
      <td>${esc(scenario.name)}</td>
      <td>${esc(scenario.surface)}</td>
      <td>${esc(scenario.evidence)}</td>
      <td><span class="status-badge good">${esc(scenario.status)}</span></td>
    </tr>
  `).join("");

  return `
    <div class="coverage-page" data-walkthrough-anchor="walkthrough-coverage">
      <div class="card coverage-hero">
        <div>
          <div class="pill">Pathway truth map</div>
          <h1>Coverage without cosmetic certainty</h1>
          <p>${esc(lens.conclusion)} ${esc(lens.why)}</p>
        </div>
        <div class="coverage-hero-grid">
          <div><span>Fully capturable</span><strong>${fmtNumber(summary.fully_capturable || 0)}</strong></div>
          <div><span>Partially capturable</span><strong>${fmtNumber(summary.partially_capturable || 0)}</strong></div>
          <div><span>Indirect</span><strong>${fmtNumber(summary.indirectly_capturable || 0)}</strong></div>
          <div><span>Uncapturable</span><strong>${fmtNumber(summary.uncapturable || 0)}</strong></div>
        </div>
      </div>

      <div class="grid grid-4" style="margin-bottom:12px">${renderCoverageSummaryCards(summary)}</div>

      <section class="card" style="margin-bottom:12px">
        <div class="card-header">
          <div>
            <div class="card-title">Inference Pathway Coverage Matrix</div>
            <div class="card-subtitle">Every class carries usage, cost, ownership, feasibility, and caveat metadata before it reaches dashboards or exports.</div>
          </div>
          <button class="small-btn" data-action="go" data-page="integrations">Open Integrations</button>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Pathway</th>
                <th>Feasibility</th>
                <th>Capture Method</th>
                <th>Usage Truth</th>
                <th>Cost Truth</th>
                <th>Ownership Truth</th>
                <th>Spend</th>
                <th>Coverage</th>
                <th>Caveat</th>
              </tr>
            </thead>
            <tbody>${pathwayRows || tableEmptyRowMarkup(9, "No pathway rows", "No inference pathway records are loaded. Reset the demo to restore the coverage matrix.")}</tbody>
          </table>
        </div>
      </section>

      <div class="coverage-split" style="margin-bottom:12px">
        <section class="card">
          <div class="card-title">Blind Spots and Degraded States</div>
          <div class="card-subtitle">The product remains useful under partial data by making causes and operator actions explicit.</div>
          <div class="blindspot-grid">${blindSpotCards || emptyStateMarkup("No blind spots loaded", "No degraded pathway examples are available in the current dataset.", { compact: true })}</div>
        </section>
        <section class="card">
          <div class="card-title">Agentic Workflow Lineage</div>
          <div class="card-subtitle">A local proof of root_request_id / parent_event_id propagation and the way missing child links stay visible.</div>
          <div class="lineage-summary">
            <div><span>Workflow</span><strong>${esc(lineage.workflow_id || "N/A")}</strong></div>
            <div><span>Root request</span><strong>${esc(lineage.root_request_id || "N/A")}</strong></div>
            <div><span>Linked descendants</span><strong>${fmtNumber(lineage.linked_descendant_calls || 0)} / ${fmtNumber(lineage.total_descendant_calls || 0)}</strong></div>
            <div><span>Aggregate cost</span><strong>${fmtUSD(lineage.aggregate_cost_usd || 0, 2)}</strong></div>
          </div>
          <div class="lineage-timeline">${lineageCalls || emptyStateMarkup("No lineage events", "No agentic workflow lineage records are loaded for this dataset.", { compact: true })}</div>
        </section>
      </div>

      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Pathological Scenario Proof</div>
            <div class="card-subtitle">The local demo maps the highest-risk S-001 to S-020 cases to visible surfaces instead of only claiming backend coverage.</div>
          </div>
          <button class="small-btn" data-action="go" data-page="requirements">Open PRD Proof</button>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr><th>Scenario</th><th>Name</th><th>Surface</th><th>Evidence</th><th>Status</th></tr>
            </thead>
            <tbody>${scenarioRows || tableEmptyRowMarkup(5, "No scenario proof rows", "No pathological scenario proof records are loaded.")}</tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function exportRowsForMode() {
  const rows = dataset.exports?.rows || [];
  if (state.exportViewMode === "current_state") {
    return rows.map((row) => ({ ...row, display_team: row.team_current_state, display_mode: "Current-state" }));
  }
  return rows.map((row) => ({ ...row, display_team: row.team_event_time, display_mode: "Event-time" }));
}

function exportsView() {
  const exportsData = dataset.exports || FALLBACK_DATASET.exports;
  const summary = exportsData.summary || {};
  const lens = pageLensNarrative("exports");
  const totalAssignable = Number(summary.exportable_chargeback_usd || 0)
    + Number(summary.provisional_review_usd || 0)
    + Number(summary.allocated_shared_usd || 0)
    + Number(summary.unknown_excluded_usd || 0);
  const readinessPct = totalAssignable > 0
    ? (Number(summary.exportable_chargeback_usd || 0) / totalAssignable) * 100
    : 0;

  const modeButtons = [
    { key: "event_time", label: "Event-Time Owner" },
    { key: "current_state", label: "Current-State Rollup" }
  ].map((item) => `
    <button class="filter-btn${state.exportViewMode === item.key ? " active" : ""}" data-action="set-export-mode" data-export-mode="${item.key}">
      ${esc(item.label)}
    </button>
  `).join("");

  const controls = (exportsData.controls || []).map((item) => `
    <div class="export-control-card">
      <div class="export-control-label">${esc(item.label)}</div>
      <div class="export-control-value">${esc(item.value)}</div>
      <p>${esc(item.meaning)}</p>
    </div>
  `).join("");

  const rows = exportRowsForMode().map((row) => `
    <tr>
      <td><span class="mono">${esc(row.line_id)}</span></td>
      <td>
        <div style="font-weight:650;color:var(--text)">${esc(row.service)}</div>
        <div class="hint">${esc(row.model)}</div>
      </td>
      <td>${esc(row.display_team)}</td>
      <td>${esc(row.cost_center)}</td>
      <td>${fmtNullableUSD(row.estimated_cost_usd)}</td>
      <td>${fmtNullableUSD(row.reconciled_cost_usd)}</td>
      <td>${fmtUSD(row.trac_usd || 0)}</td>
      <td>${fmtPct(Number(row.confidence || 0) * 100, 0)}</td>
      <td><span class="status-badge ${feasibilityClassName(row.ownership_state)}">${esc(row.ownership_state)}</span></td>
      <td>${esc(row.truth_basis)}</td>
      <td>${esc(row.export_action)}</td>
    </tr>
  `).join("");

  const allocations = (exportsData.allocation_splits || []).map((row) => `
    <div class="allocation-row">
      <div>
        <div class="allocation-title">${esc(row.team)}</div>
        <div class="hint">${esc(row.resource)} • ${esc(row.basis)}</div>
      </div>
      <div class="allocation-share">${fmtPct(row.share_pct || 0, 0)}</div>
      <div class="allocation-cost">${fmtUSD(row.allocated_cost_usd || 0)}</div>
    </div>
  `).join("");

  return `
    <div class="exports-page" data-walkthrough-anchor="walkthrough-exports">
      <div class="card exports-hero">
        <div>
          <div class="pill">Finance close packet</div>
          <h1>Chargeback without collapsing truth</h1>
          <p>${esc(lens.conclusion)} ${esc(lens.why)}</p>
        </div>
        <div class="export-mode-panel">
          <div class="card-subtitle">Reporting mode</div>
          <div class="filter-bar">${modeButtons}</div>
          <div class="hint">Event-time is finance-safe. Current-state is planning-safe and always labeled.</div>
        </div>
      </div>

      <div class="grid grid-4" style="margin-bottom:12px">
        <div class="card metric-card"><div class="metric-accent" style="background:var(--green)"></div><div class="metric-label">Chargeback Ready</div><div class="metric-value">${fmtUSD(summary.exportable_chargeback_usd || 0)}</div><div class="metric-meta">${fmtPct(readinessPct)} of previewed assignable spend</div></div>
        <div class="card metric-card"><div class="metric-accent" style="background:var(--amber)"></div><div class="metric-label">Review Required</div><div class="metric-value">${fmtUSD(summary.provisional_review_usd || 0)}</div><div class="metric-meta">Provisional or conflict-bearing ownership</div></div>
        <div class="card metric-card"><div class="metric-accent" style="background:var(--amber)"></div><div class="metric-label">Allocated Shared</div><div class="metric-value">${fmtUSD(summary.allocated_shared_usd || 0)}</div><div class="metric-meta">Exported separately from ownership truth</div></div>
        <div class="card metric-card"><div class="metric-accent" style="background:var(--red)"></div><div class="metric-label">Excluded Unknown</div><div class="metric-value">${fmtUSD(summary.unknown_excluded_usd || 0)}</div><div class="metric-meta">Shown with caveat, not hidden</div></div>
      </div>

      <div class="export-control-grid" style="margin-bottom:12px">${controls}</div>

      <section class="card" style="margin-bottom:12px">
        <div class="card-header">
          <div>
            <div class="card-title">Chargeback Export Preview</div>
            <div class="card-subtitle">FOCUS-compatible posture with ${fmtNumber(summary.focus_columns || 0)} standard columns plus ${fmtNumber(summary.argmin_extension_columns || 0)} Argmin evidence extensions.</div>
          </div>
          <button class="small-btn primary" data-action="export-artifact" data-artifact="chargeback-export">Export chargeback preview</button>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Line</th><th>Service</th><th>Owner</th><th>Cost Center</th><th>Estimated</th><th>Reconciled</th><th>TRAC</th><th>Confidence</th><th>State</th><th>Truth Basis</th><th>Action</th>
              </tr>
            </thead>
            <tbody>${rows || tableEmptyRowMarkup(11, "No export rows", "No chargeback export rows are available in the current dataset. Reset the demo to reload seeded finance records.")}</tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <div class="card-title">Shared Allocation Guard</div>
        <div class="card-subtitle">Stage C allocation conserves cost but never overwrites the ownership columns used for chargeback readiness.</div>
        <div class="allocation-list">${allocations || emptyStateMarkup("No shared allocations", "No shared allocation splits are loaded for the selected export mode.", { compact: true })}</div>
      </section>
    </div>
  `;
}

function starRatingMarkup(rating) {
  if (rating === null || rating === undefined) {
    return `<span class="energy-unrated">Unrated</span>`;
  }
  const stars = Array.from({ length: 5 }, (_, index) => index < Number(rating) ? "★" : "☆").join("");
  return `<span class="energy-stars" aria-label="${esc(`${rating} of 5 stars`)}">${stars}</span>`;
}

function energyView() {
  const energy = dataset.energy_efficiency || FALLBACK_DATASET.energy_efficiency;
  const summary = energy.summary || {};
  const lens = pageLensNarrative("energy");
  const modelCards = (energy.models || []).map((model) => `
    <div class="energy-model-card ${model.status === "unrated" ? "unrated" : ""}">
      <div class="energy-model-head">
        <div>
          <div class="energy-model-name">${esc(model.model)}</div>
          <div class="hint">${esc(model.provider)} • ${esc(model.task)}</div>
        </div>
        ${starRatingMarkup(model.star_rating)}
      </div>
      <div class="energy-model-grid">
        <div><span>Requests</span><strong>${fmtNumber(model.requests_30d || 0)}</strong></div>
        <div><span>kWh / 1K</span><strong>${model.kwh_per_1k_requests === null || model.kwh_per_1k_requests === undefined ? "Unknown" : Number(model.kwh_per_1k_requests).toFixed(1)}</strong></div>
        <div><span>Carbon</span><strong>${model.carbon_kgco2e === null || model.carbon_kgco2e === undefined ? "Unknown" : `${fmtNumber(model.carbon_kgco2e)} kg`}</strong></div>
      </div>
      <div class="energy-recommendation">${esc(model.recommendation)}</div>
    </div>
  `).join("");

  const recommendationRows = (energy.recommendations || []).map((row) => `
    <tr>
      <td>${esc(row.current_model)}</td>
      <td>${esc(row.candidate_model)}</td>
      <td>${row.cost_delta_pct === null || row.cost_delta_pct === undefined ? "N/A" : signedPct(row.cost_delta_pct, 0)}</td>
      <td>${esc(row.quality_delta)}</td>
      <td>${row.energy_delta_kwh_per_1k === null || row.energy_delta_kwh_per_1k === undefined ? "Unknown" : `${Number(row.energy_delta_kwh_per_1k).toFixed(1)} kWh / 1K`}</td>
      <td>${row.annual_carbon_delta_kgco2e === null || row.annual_carbon_delta_kgco2e === undefined ? "Unknown" : `${fmtNumber(row.annual_carbon_delta_kgco2e)} kg`}</td>
      <td>${esc(row.decision)}</td>
    </tr>
  `).join("");

  return `
    <div class="energy-page" data-walkthrough-anchor="walkthrough-energy">
      <div class="card energy-hero">
        <div>
          <div class="pill">Energy transparency</div>
          <h1>Model footprint without greenwashing</h1>
          <p>${esc(lens.conclusion)} ${esc(lens.why)}</p>
        </div>
        <div class="energy-boundary">
          <div class="card-title">Decision binding</div>
          <div class="card-subtitle">${esc(summary.decision_binding || "Advisory only")}</div>
          <div class="hint">${esc(summary.region || "")}</div>
        </div>
      </div>

      <div class="grid grid-4" style="margin-bottom:12px">
        <div class="card metric-card"><div class="metric-accent" style="background:var(--green)"></div><div class="metric-label">Rated Models</div><div class="metric-value">${fmtNumber(summary.rated_model_count || 0)}</div><div class="metric-meta">${fmtNumber(summary.unrated_model_count || 0)} explicitly unrated</div></div>
        <div class="card metric-card"><div class="metric-accent" style="background:var(--blue)"></div><div class="metric-label">Known Energy Usage</div><div class="metric-value">${fmtPct(summary.energy_known_request_pct || 0)}</div><div class="metric-meta">Unknowns remain null, not zero</div></div>
        <div class="card metric-card"><div class="metric-accent" style="background:var(--amber)"></div><div class="metric-label">Monthly Energy</div><div class="metric-value">${fmtNumber(summary.estimated_monthly_kwh || 0)} kWh</div><div class="metric-meta">${Number(summary.estimated_kwh_per_1k_requests || 0).toFixed(1)} kWh per 1K requests</div></div>
        <div class="card metric-card"><div class="metric-accent" style="background:var(--amber)"></div><div class="metric-label">Estimated Carbon</div><div class="metric-value">${fmtNumber(summary.estimated_carbon_kgco2e || 0)} kg</div><div class="metric-meta">Informational Phase 1 disclosure</div></div>
      </div>

      <section class="card" style="margin-bottom:12px">
        <div class="card-title">Observed Model Energy View</div>
        <div class="card-subtitle">Models without published data are displayed as Unrated and kept in the decision surface.</div>
        <div class="energy-model-grid-wrap">${modelCards || emptyStateMarkup("No model energy rows", "No model energy records are loaded. Unknown values should remain explicit, not invisible.", { compact: true })}</div>
      </section>

      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Energy-Aware Optimization Candidates</div>
            <div class="card-subtitle">Energy deltas appear beside cost and quality; they never override equivalence or customer policy.</div>
          </div>
          <button class="small-btn" data-action="go" data-page="interventions">Open Interventions</button>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr><th>Current</th><th>Candidate</th><th>Cost Delta</th><th>Quality Basis</th><th>Energy Delta</th><th>Annual Carbon Delta</th><th>Decision</th></tr>
            </thead>
            <tbody>${recommendationRows || tableEmptyRowMarkup(7, "No energy-aware candidates", "No energy optimization candidates are loaded for this dataset.")}</tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function adminView() {
  const admin = dataset.admin || FALLBACK_DATASET.admin;
  const summary = admin.summary || {};
  const lens = pageLensNarrative("admin");
  const persona = activeDemoPersona();
  const personaMenuNames = (persona.allowedPages || [])
    .map((pageKey) => PAGE_TITLES[pageKey] || pageKey)
    .join(", ");
  const visibleAccounts = personaVisibleAccounts(admin.accounts || [], persona);
  const visibleOperations = personaVisibleOperations(admin.operations || [], persona);
  const visibleAuditEvents = personaVisibleAuditEvents(admin.audit_log || [], persona);
  const personaWorkflowRows = (persona.workflows || []).map((workflow) => `
    <div class="persona-workflow-row">
      <span>${esc(workflow)}</span>
      <strong>Available</strong>
    </div>
  `).join("");
  const personaRecordRows = (persona.records || []).map((record) => `
    <tr>
      <td>${esc(record)}</td>
      <td>${esc(persona.role)}</td>
      <td><span class="status-badge good">Visible</span></td>
    </tr>
  `).join("");
  const personaCards = DEMO_PERSONAS.map((item) => `
    <button class="persona-card${item.key === persona.key ? " active" : ""}" data-action="set-demo-persona" data-persona-key="${esc(item.key)}">
      <span>${esc(item.label)}</span>
      <strong>${esc(item.name)}</strong>
      <em>${fmtNumber((item.allowedPages || []).length)} menus • ${fmtNumber((item.permissions || []).length)} permissions</em>
    </button>
  `).join("");
  const accountRows = visibleAccounts.map((account) => `
    <tr class="${account.name === persona.name ? "selected-row" : ""}">
      <td>${esc(account.name)}</td>
      <td>${esc(account.role)}</td>
      <td><span class="status-badge ${account.status === "active" ? "good" : "warn"}">${esc(account.status)}</span></td>
      <td>${esc(account.mfa)}</td>
      <td>${esc(fmtDateTime(account.last_auth || ""))}</td>
    </tr>
  `).join("");
  const operationRows = visibleOperations.map((operation) => `
    <tr>
      <td>${esc(operation.operation)}</td>
      <td>${esc(operation.role_required)}</td>
      <td>${esc(operation.write_target)}</td>
      <td>${esc(operation.audit)}</td>
      <td><span class="status-badge good">Allowed for persona</span></td>
    </tr>
  `).join("");
  const auditRows = visibleAuditEvents.map((event) => `
    <tr>
      <td>${esc(fmtDateTime(event.timestamp || ""))}</td>
      <td>
        <div style="font-weight:650;color:var(--text)">${esc(event.actor || "Unknown actor")}</div>
        <div class="hint">${esc(event.role || "Unassigned role")}</div>
      </td>
      <td>${esc(event.action || "")}</td>
      <td>${esc(event.target || "")}</td>
      <td><span class="status-badge good">${esc(event.outcome || "recorded")}</span></td>
      <td>${esc(event.basis || "")}</td>
    </tr>
  `).join("");
  const diagnostics = (admin.diagnostics || []).map((item) => `
    <div class="admin-diagnostic-card">
      <div class="admin-diagnostic-head">
        <span>${esc(item.check)}</span>
        <span class="status-badge ${item.status === "green" ? "good" : "info"}">${esc(item.status)}</span>
      </div>
      <p>${esc(item.detail)}</p>
    </div>
  `).join("");

  return `
    <div class="admin-page" data-walkthrough-anchor="walkthrough-admin">
      <div class="card admin-hero">
        <div>
          <div class="pill">Customer deployment operations</div>
          <h1>Admin controls inside the trust boundary</h1>
          <p>${esc(lens.conclusion)} ${esc(lens.why)}</p>
        </div>
        <div class="admin-summary-grid">
          <div><span>Mode</span><strong>${esc(summary.deployment_mode || "local demo")}</strong></div>
          <div><span>RBAC roles</span><strong>${fmtNumber((summary.rbac_roles || []).length)}</strong></div>
          <div><span>Read-only integrations</span><strong>${fmtNumber(summary.read_only_integrations || 0)}</strong></div>
          <div><span>Mutation surfaces</span><strong>${fmtNumber(summary.mutation_surfaces || 0)}</strong></div>
        </div>
      </div>

      <section class="card persona-access-card">
        <div class="card-header">
          <div>
            <div class="card-title">Persona Access Preview</div>
            <div class="card-subtitle">Local RBAC simulation for menus, workflows, permissions, and records. No production identity provider is contacted.</div>
          </div>
          <div class="status-badge info">${esc(persona.label)} active</div>
        </div>
        <div class="persona-card-grid">${personaCards || emptyStateMarkup("No local personas", "No local persona definitions are loaded.", { compact: true })}</div>
        <div class="grid grid-7-5" style="margin-top:12px">
          <div class="persona-permission-panel">
            <div class="section-title">Selected Persona</div>
            <div class="persona-selected-name">${esc(persona.name)}</div>
            <div class="hint">${esc(persona.email)} • ${esc(persona.description)}</div>
            <div class="persona-chip-row">${(persona.permissions || []).map((permission) => `<span>${esc(permission.replaceAll("_", " "))}</span>`).join("")}</div>
            <div class="persona-menu-list"><strong>Menus:</strong> ${esc(personaMenuNames)}</div>
          </div>
          <div class="persona-permission-panel">
            <div class="section-title">Workflow Access</div>
            <div class="persona-workflow-list">${personaWorkflowRows || emptyStateMarkup("No workflow access rows", "This persona has no configured local workflow rows.", { compact: true })}</div>
          </div>
        </div>
        <div class="table-wrap" style="margin-top:12px">
          <table class="table">
            <thead><tr><th>Dummy Record</th><th>Persona Role</th><th>Visibility</th></tr></thead>
            <tbody>${personaRecordRows || tableEmptyRowMarkup(3, "No dummy records", "This persona has no dummy records assigned in the local dataset.")}</tbody>
          </table>
        </div>
      </section>

      <div class="grid grid-7-5" style="margin-bottom:12px">
        <section class="card">
          <div class="card-title">Account Lifecycle and RBAC</div>
            <div class="card-subtitle">${personaCanViewAdminRecords(persona) ? "Invitation-gated accounts, role assignment, MFA posture, and deactivation history are visible in the same product shell." : "This persona only sees account records tied to their role."}</div>
          <div class="table-wrap" style="margin-top:12px">
            <table class="table">
              <thead><tr><th>User</th><th>Role</th><th>Status</th><th>MFA</th><th>Last Auth</th></tr></thead>
              <tbody>${accountRows || tableEmptyRowMarkup(5, "No visible demo accounts", "No local dummy accounts are visible for the selected persona.")}</tbody>
            </table>
          </div>
        </section>
        <section class="card">
          <div class="card-title">Operational Diagnostics</div>
          <div class="card-subtitle">Diagnostics stay scoped to the deployment and do not imply external access to customer data.</div>
          <div class="admin-diagnostic-grid">${diagnostics || emptyStateMarkup("No diagnostics loaded", "No local diagnostic checks are available in the current dataset.", { compact: true })}</div>
        </section>
      </div>

      <section class="card" style="margin-bottom:12px">
        <div class="card-header">
          <div>
            <div class="card-title">Customer-Visible Audit Trail</div>
            <div class="card-subtitle">${personaCanViewAdminRecords(persona) ? "Every admin-side mutation, export, replay, and exception approval is represented as a local append-only event with actor, target, outcome, and basis." : "Audit rows are scoped to this persona's role and visible records."}</div>
          </div>
          <button class="small-btn" data-action="go" data-page="exports">Open Exports</button>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th><th>Outcome</th><th>Basis</th></tr></thead>
            <tbody>${auditRows || tableEmptyRowMarkup(6, "No visible admin audit events", "No admin audit events are visible for the selected persona.")}</tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Audited Admin Operations</div>
            <div class="card-subtitle">${esc(summary.auth_policy || "")} This view lists only operations available to the selected persona. Last audit event: ${esc(fmtDateTime(summary.last_audit_event || ""))}</div>
          </div>
          <button class="small-btn" data-action="go" data-page="governance">Open Governance</button>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Operation</th><th>Role Required</th><th>Write Target</th><th>Audit</th><th>Selected Persona</th></tr></thead>
            <tbody>${operationRows || tableEmptyRowMarkup(5, "No permitted admin operations", "This persona has a read-only view here; mutation options are intentionally hidden.")}</tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function glossaryResultsMarkup() {
  const query = state.glossaryQuery.trim().toLowerCase();
  const filtered = (dataset.glossary || []).filter((entry) => {
    if (!query) {
      return true;
    }
    const hay = `${entry.term || ""} ${entry.aka || ""} ${entry.category || ""} ${entry.definition || ""} ${entry.why_it_matters || ""}`.toLowerCase();
    return hay.includes(query);
  });
  const groups = filtered.reduce((acc, entry) => {
    const category = entry.category || "General";
    if (!acc.has(category)) {
      acc.set(category, []);
    }
    acc.get(category).push(entry);
    return acc;
  }, new Map());

  const rendered = Array.from(groups.entries()).map(([category, entries]) => {
    const items = entries.map((entry) => `
      <div class="glossary-term">
        <div class="glossary-title">${esc(entry.term)} ${entry.aka ? `<span class='glossary-aka'>${esc(entry.aka)}</span>` : ""}</div>
        <div class="glossary-definition">${esc(entry.definition)}</div>
        ${entry.why_it_matters ? `<div class="glossary-context"><strong>Why it matters:</strong> ${esc(entry.why_it_matters)}</div>` : ""}
      </div>
    `).join("");
    return `
      <div class="glossary-category">
        <div class="glossary-category-head">
          <div class="section-title">${esc(category)}</div>
          <div class="glossary-category-meta">${entries.length} term${entries.length === 1 ? "" : "s"}</div>
        </div>
        ${items}
      </div>
    `;
  }).join("");

  return {
    filteredCount: filtered.length,
    groupCount: groups.size,
    markup: rendered || emptyStateMarkup(
      "No glossary terms match this search query.",
      "Try a broader term such as TRAC, governance, forecasting, fail-open, or manual mapping.",
      { compact: true }
    )
  };
}

function glossaryResultStats() {
  const query = state.glossaryQuery.trim().toLowerCase();
  const categories = new Set();
  let filteredCount = 0;
  for (const entry of dataset.glossary || []) {
    if (query) {
      const hay = `${entry.term || ""} ${entry.aka || ""} ${entry.category || ""} ${entry.definition || ""} ${entry.why_it_matters || ""}`.toLowerCase();
      if (!hay.includes(query)) {
        continue;
      }
    }
    filteredCount += 1;
    categories.add(entry.category || "General");
  }
  return {
    filteredCount,
    groupCount: categories.size
  };
}

function deferredContentMarkup(key, title, message, contentMarkup, options = {}) {
  const forceVisible = Boolean(options.forceVisible);
  const visible = forceVisible || state.deferredSectionsVisible.has(key);
  if (visible) {
    return contentMarkup;
  }
  return `
    <div class="deferred-section" data-deferred-key="${esc(key)}">
      <div class="deferred-section-copy">
        <div class="deferred-section-title">${esc(title)}</div>
        <div class="deferred-section-message">${esc(message)}</div>
        ${options.example ? `<div class="deferred-example"><span>Example</span><strong>${esc(options.example)}</strong></div>` : ""}
        <div class="deferred-skeleton" aria-hidden="true">
          <span class="skeleton-line wide"></span>
          <span class="skeleton-line"></span>
          <span class="skeleton-line short"></span>
        </div>
      </div>
      <button class="small-btn" data-action="show-deferred-section" data-deferred-key="${esc(key)}">${esc(options.buttonLabel || "Show Content")}</button>
    </div>
  `;
}

function showDeferredSection(key) {
  if (!key) {
    return;
  }
  state.deferredSectionsVisible.add(key);
  render();
}

function applyGuidedExample(inputKey, value) {
  const normalizedInput = String(inputKey || "");
  const exampleValue = String(value || "").trim();
  if (!exampleValue) {
    return;
  }
  if (normalizedInput === "glossary-query") {
    state.glossaryQuery = exampleValue;
    state.deferredSectionsVisible.add("glossary-results");
    setFormStatus("glossary-query", {
      kind: "ok",
      message: `Loaded example "${exampleValue}". Results update automatically.`
    }, exampleValue);
    render();
    focusPageSearchInput();
    return;
  }
  if (normalizedInput === "faq-query") {
    state.faqQuery = exampleValue;
    state.deferredSectionsVisible.add("faq-results");
    setFormStatus("faq-query", {
      kind: "ok",
      message: `Loaded example "${exampleValue}". Results update automatically.`
    }, exampleValue);
    render();
    focusPageSearchInput();
  }
}

function renderGlossaryResults() {
  const summary = document.getElementById("glossary-summary");
  const results = document.getElementById("glossary-results");
  if (!summary || !results) {
    return;
  }
  state.deferredSectionsVisible.add("glossary-results");
  const rendered = glossaryResultsMarkup();
  const feedback = searchFieldFeedback("glossary-query", state.glossaryQuery, rendered);
  syncFieldFeedback("glossary-query", state.glossaryQuery, feedback, ["glossary-summary"]);
  summary.textContent = `${rendered.filteredCount} term${rendered.filteredCount === 1 ? "" : "s"} shown across ${rendered.groupCount} categor${rendered.groupCount === 1 ? "y" : "ies"}.`;
  results.innerHTML = rendered.markup;
  normalizeInteractionContracts(document);
}

function glossaryView() {
  const showResults = Boolean(state.glossaryQuery.trim()) || state.deferredSectionsVisible.has("glossary-results");
  const rendered = showResults
    ? glossaryResultsMarkup()
    : { ...glossaryResultStats(), markup: "" };
  const feedback = searchFieldFeedback("glossary-query", state.glossaryQuery, rendered);

  return `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Glossary</div>
          <div class="card-subtitle">Investor-facing terminology, organized by platform concept and operating layer.</div>
        </div>
      </div>
      <label class="input-label" for="glossary-query-input">Search glossary</label>
      <input
        id="glossary-query-input"
        class="control-input"
        type="text"
        value="${esc(state.glossaryQuery)}"
        placeholder="Search terms (TRAC, fail-open, manual mapping, forecasting...)"
        aria-label="Search glossary terms"
        ${fieldValidationAttrs("glossary-query", feedback, state.glossaryQuery, ["glossary-summary"])}
        data-action-input="glossary-query"
      />
      ${fieldFeedbackMarkup("glossary-query", feedback, state.glossaryQuery)}
      <div class="hint" id="glossary-summary" style="margin:8px 0 12px">${rendered.filteredCount} term${rendered.filteredCount === 1 ? "" : "s"} shown across ${rendered.groupCount} categor${rendered.groupCount === 1 ? "y" : "ies"}.</div>
      <div id="glossary-results">${deferredContentMarkup(
        "glossary-results",
        "Reference terms are ready",
        "Core demo screens render first; load the full glossary when diligence needs it.",
        rendered.markup,
        { forceVisible: showResults, buttonLabel: "Show Glossary Terms", example: "governance terminology" }
      )}</div>
    </div>
  `;
}

function faqResultsMarkup() {
  const query = state.faqQuery.trim().toLowerCase();
  let filteredCount = 0;
  const categories = (dataset.faq || []).map((category, idx) => {
    const filteredItems = (category.items || []).filter((item) => {
      if (!query) {
        return true;
      }
      const hay = `${item.question} ${item.answer}`.toLowerCase();
      return hay.includes(query);
    });
    filteredCount += filteredItems.length;
    return {
      key: `cat-${idx}`,
      name: category.category,
      description: category.description,
      items: filteredItems
    };
  }).filter((cat) => cat.items.length > 0);

  const markup = categories.map((category) => {
    const items = category.items.map((item, itemIndex) => {
      const key = `${category.key}-${itemIndex}`;
      const open = state.faqOpenKeys.has(key);
      return `
        <div class="faq-item${open ? " open" : ""}">
          <button class="faq-question" data-action="toggle-faq" data-faq-key="${esc(key)}" aria-expanded="${open ? "true" : "false"}">
            <span>${esc(item.question)}</span>
            <span>${open ? "-" : "+"}</span>
          </button>
          <div class="faq-answer">${esc(item.answer)}</div>
        </div>
      `;
    }).join("");
    return `
      <div class="faq-category">
        <div class="section-title">${esc(category.name)}</div>
        ${category.description ? `<div class="faq-category-description">${esc(category.description)}</div>` : ""}
        ${items}
      </div>
    `;
  }).join("");

  return {
    filteredCount,
    groupCount: categories.length,
    markup: markup || emptyStateMarkup(
      "No FAQ items match this search query.",
      "Try searching deployment, governance, methodology, intervention, or forecasting.",
      { compact: true }
    )
  };
}

function renderFaqResults() {
  const summary = document.getElementById("faq-summary");
  const results = document.getElementById("faq-results");
  if (!results) {
    return;
  }
  state.deferredSectionsVisible.add("faq-results");
  const rendered = faqResultsMarkup();
  const feedback = searchFieldFeedback("faq-query", state.faqQuery, rendered);
  syncFieldFeedback("faq-query", state.faqQuery, feedback, ["faq-summary"]);
  if (summary) {
    summary.textContent = `${rendered.filteredCount} FAQ item${rendered.filteredCount === 1 ? "" : "s"} shown across ${rendered.groupCount} categor${rendered.groupCount === 1 ? "y" : "ies"}.`;
  }
  results.innerHTML = rendered.markup;
  normalizeInteractionContracts(document);
}

function faqView() {
  const showResults = Boolean(state.faqQuery.trim()) || state.deferredSectionsVisible.has("faq-results");
  const rendered = showResults ? faqResultsMarkup() : { filteredCount: 0, groupCount: 0, markup: "" };
  const feedback = searchFieldFeedback("faq-query", state.faqQuery, rendered);

  return `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">FAQ and Methodology</div>
          <div class="card-subtitle">Clear answers for technical diligence and executive review.</div>
        </div>
      </div>
      <label class="input-label" for="faq-query-input">Search FAQ</label>
      <input
        id="faq-query-input"
        class="control-input"
        type="text"
        value="${esc(state.faqQuery)}"
        placeholder="Search FAQs (deployment, governance, methodology...)"
        aria-label="Search frequently asked questions"
        ${fieldValidationAttrs("faq-query", feedback, state.faqQuery, ["faq-summary"])}
        data-action-input="faq-query"
      />
      ${fieldFeedbackMarkup("faq-query", feedback, state.faqQuery)}
      <div class="hint" id="faq-summary" style="margin:8px 0 12px">${showResults ? `${rendered.filteredCount} FAQ item${rendered.filteredCount === 1 ? "" : "s"} shown across ${rendered.groupCount} categor${rendered.groupCount === 1 ? "y" : "ies"}.` : "Covers platform logic, deployment posture, governance controls, interventions, and forecasting assumptions."}</div>
      <div id="faq-results">${deferredContentMarkup(
        "faq-results",
        "Methodology reference is ready",
        "Keep the first paint focused; reveal FAQ content when the conversation turns to diligence.",
        rendered.markup,
        { forceVisible: showResults, buttonLabel: "Show FAQ", example: "deployment diligence" }
      )}</div>
    </div>
  `;
}

function toggleFaq(key) {
  if (state.faqOpenKeys.has(key)) {
    state.faqOpenKeys.delete(key);
  } else {
    state.faqOpenKeys.add(key);
  }
  render();
}

function renderMainView() {
  const root = document.getElementById("view-root");
  if (!root) {
    return;
  }
  // FIX: add a brief fade to make full-view swaps feel intentional rather than abrupt.
  const shouldTransition = root.dataset.rendered === "true";
  if (shouldTransition) {
    root.classList.add("transitioning");
  }
  const pageChanged = Boolean(state.lastRenderedPage && state.lastRenderedPage !== state.page);
  if (pageChanged) {
    destroyCharts();
  }

  switch (state.page) {
    case "overview":
      root.innerHTML = renderViewWithState(overviewView());
      renderOverviewCharts();
      break;
    case "partner_brief":
      root.innerHTML = renderViewWithState(designPartnerView());
      break;
    case "requirements":
      root.innerHTML = renderViewWithState(requirementsView());
      break;
    case "adoption":
      root.innerHTML = renderViewWithState(adoptionView());
      renderAdoptionCharts();
      break;
    case "attribution":
      root.innerHTML = renderViewWithState(attributionView());
      break;
    case "models":
      root.innerHTML = renderViewWithState(modelsView());
      renderModelChart();
      break;
    case "teams":
      root.innerHTML = renderViewWithState(teamsView());
      renderTeamCharts();
      break;
    case "manual_mapping":
      root.innerHTML = renderViewWithState(manualMappingView());
      break;
    case "interventions":
      root.innerHTML = renderViewWithState(interventionsView());
      break;
    case "governance":
      root.innerHTML = renderViewWithState(governanceView());
      break;
    case "coverage":
      root.innerHTML = renderViewWithState(coverageView());
      break;
    case "exports":
      root.innerHTML = renderViewWithState(exportsView());
      break;
    case "energy":
      root.innerHTML = renderViewWithState(energyView());
      break;
    case "forecast":
      root.innerHTML = renderViewWithState(forecastView());
      renderForecastChart();
      break;
    case "integrations":
      root.innerHTML = renderViewWithState(integrationsView());
      break;
    case "admin":
      root.innerHTML = renderViewWithState(adminView());
      break;
    case "glossary":
      root.innerHTML = renderViewWithState(glossaryView());
      break;
    case "faq":
      root.innerHTML = renderViewWithState(faqView());
      break;
    default:
      root.innerHTML = errorStateMarkup(
        "Unknown page",
        `${state.page} is not a configured demo route. Use Overview or Reset Demo to return to a known state.`,
        {
          actions: [
            { label: "Open Overview", action: "go", page: "overview", primary: true },
            { label: "Reset Demo", action: "clear-logs" }
          ]
        }
      );
      break;
  }
  state.lastRenderedPage = state.page;
  window.requestAnimationFrame(() => {
    root.dataset.rendered = "true";
    root.classList.remove("transitioning");
    if (pageChanged) {
      const title = document.getElementById("page-title");
      if (title instanceof HTMLElement) {
        title.focus({ preventScroll: true });
      }
    }
  });
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#18263b",
        borderColor: "#274062",
        borderWidth: 1,
        titleColor: "#d9e6fb",
        bodyColor: "#d9e6fb",
        padding: 10,
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed.y ?? ctx.parsed.x ?? ctx.parsed ?? 0;
            return `${ctx.dataset.label || ctx.label}: ${compactUSD(value)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: "rgba(27,43,69,0.55)" },
        ticks: { color: "#8ea0bf", font: { size: 10 } }
      },
      y: {
        grid: { color: "rgba(27,43,69,0.55)" },
        ticks: { color: "#8ea0bf", font: { size: 10 } }
      }
    }
  };
}

function doughnutChartOptions(tooltipBuilder) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "58%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#8ea0bf",
          boxWidth: 10,
          padding: 10,
          font: { size: 10 }
        }
      },
      tooltip: {
        backgroundColor: "#18263b",
        borderColor: "#274062",
        borderWidth: 1,
        titleColor: "#d9e6fb",
        bodyColor: "#d9e6fb",
        padding: 10,
        callbacks: {
          label: (ctx) => tooltipBuilder(ctx)
        }
      }
    }
  };
}

async function apiRequest(method, path, body) {
  const bearerToken = getApiBearerToken();
  const options = {
    method,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  };
  if (bearerToken) {
    options.headers.Authorization = `Bearer ${bearerToken}`;
  }
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(path, options);
  } catch (error) {
    markRuntimeFailure(path, "Running on local demo data only", "offline");
    setRecoveryNotice({
      severity: "warn",
      title: "Local demo API unavailable",
      message: "Live proof controls are offline, but the guided walkthrough can continue on deterministic local data.",
      detail: "Start the runtime with ./scripts/start_demo.sh or use Reset Demo after the server is running.",
      source: "api"
    });
    throw new Error(summarizeApiError(error));
  }
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    appendLog(
      "warn",
      "Non-JSON API response",
      summarizeApiError(error, "The local demo API returned a non-JSON response; preserving it as a controlled raw payload."),
      null,
      { hidden: true }
    );
    data = { raw: text };
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      markRuntimeFailure(path, "Backend reachable | live API requires authentication");
    } else if (response.status >= 500) {
      markRuntimeFailure(path, `Backend responded ${response.status} ${response.statusText}`);
    } else {
      markRuntimeSuccess(path, "Backend reachable; returned controlled operator response");
    }
    const message = apiResponseErrorMessage(response, data);
    setRecoveryNotice({
      severity: response.status >= 500 ? "error" : "warn",
      title: response.status >= 500 ? "Demo API recovered from an error" : "Demo API action needs attention",
      message,
      detail: "The UI remains available. Use Reset Demo to restore the seeded baseline before retrying.",
      source: "api"
    });
    throw new Error(message);
  }
  markRuntimeSuccess(path, "Connected to demo runtime with simulated enterprise data");
  clearRecoveryNotice("api");
  return data;
}

async function bootstrapDemoData(options = {}) {
  const { manageLoading = true, fallbackOkay = false } = options;
  if (manageLoading) {
    setPendingDemoAction("bootstrap-demo", "Initializing synthetic operating state...");
  }
  try {
    const result = await apiRequest("POST", "/v1/demo/bootstrap", {});
    state.lastPayload = { action: "bootstrap" };
    state.lastResponse = result;
    setDemoOutcome({
      title: "Demo Initialized",
      headline: "Synthetic attribution state is loaded and ready for live walkthrough steps.",
      detail: "Representative workloads, ownership mappings, and governance context are now active so the next actions demonstrate real product behavior instead of static mock data.",
      metrics: [
        { label: "Seeded entries", value: String(result.seeded_entries || 0) },
        { label: "Workloads", value: String((result.workloads || []).length) },
        { label: "Graph nodes", value: String(result.graph_nodes || 0) },
        { label: "Mode", value: modeLabel(String(result.interceptor_mode || state.mode).toLowerCase()) }
      ],
      why: "This turns the demo into a live operating simulation with deterministic state behind the UI."
    });
    appendLog(
      "ok",
      "Demo initialized",
      "Synthetic workloads, ownership mappings, and governance state loaded successfully.",
      null,
      { why: "Subsequent walkthrough actions now reflect live attribution and policy outcomes." }
    );
    state.adoptionDashboardCache = {};
    await Promise.all([
      syncAdoptionFromApi({ preserveSelection: false, force: true, render: false }),
      syncIntegrationsFromApi({ force: true, render: false })
    ]);
    showToast("Demo Ready", "Live walkthrough steps can now be run.");
    return true;
  } catch (error) {
    const message = summarizeApiError(error, "The demo could not be initialized.");
    setDemoOutcome({
      title: fallbackOkay ? "Local walkthrough mode" : "Live runtime unavailable",
      headline: fallbackOkay
        ? "The automated walkthrough will continue on deterministic local demo data."
        : "The automated walkthrough is still available on deterministic local demo data.",
      detail: fallbackOkay
        ? "The local demo API could not be reached, so the walkthrough will use the seeded dataset instead of live runtime controls."
        : "Initialize Demo requires the local demo API. The presentation can still continue on local demo data until the runtime is available.",
      metrics: [
        { label: "Automated walkthrough", value: "Available" },
        { label: "Live proof controls", value: "Offline" }
      ],
      why: "This keeps the presentation usable even when the local demo API is not reachable from the browser."
    });
    appendLog("warn", "Live runtime unavailable", message, null, {
      hidden: true,
      why: "The local demo API could not be reached from the browser."
    });
    showToast("Live Runtime Unavailable", "The automated walkthrough can still run on local demo data.");
    return false;
  } finally {
    if (manageLoading) {
      setPendingDemoAction("", "");
    }
  }
}

async function resetBackendDemoState(options = {}) {
  const { log = true, toast = false } = options;
  try {
    const result = await apiRequest("POST", "/v1/demo/reset", {});
    state.lastPayload = { action: "reset" };
    state.lastResponse = result;
    state.mode = String(result.interceptor_mode || state.mode).toLowerCase();
    state.runtimeCapabilities = {
      ...state.runtimeCapabilities,
      reference_time: result.reference_time,
      reset_token: result.reset_token,
      scenario_count: Array.isArray(result.scenario_ids) ? result.scenario_ids.length : 0,
      demo_account_count: Array.isArray(result.demo_accounts) ? result.demo_accounts.length : 0
    };
    state.adoptionDashboardCache = {};
    await Promise.all([
      syncAdoptionFromApi({ preserveSelection: false, force: true, render: false }),
      syncIntegrationsFromApi({ force: true, render: false })
    ]);
    if (log) {
      appendLog("ok", "Backend demo reset", "Synthetic runtime state was restored from the fixed demo baseline.", result, {
        why: "This keeps repeated walkthroughs comparable across machines and recording sessions."
      });
    }
    if (toast) {
      showToast("Backend Reset", "Runtime state is back to the fixed baseline.");
    }
    return true;
  } catch (error) {
    appendLog("warn", "Backend reset unavailable", summarizeApiError(error, "The backend reset endpoint could not be reached."), null, {
      hidden: true,
      why: "The browser will continue using deterministic local dataset state."
    });
    return false;
  }
}

function nextDemoScenarioRequestId(kind) {
  const key = String(kind || "scenario");
  const count = Number(state.demoScenarioRunCounts[key] || 0) + 1;
  state.demoScenarioRunCounts[key] = count;
  return `demo-${key}-${String(count).padStart(2, "0")}`;
}

async function runInterceptScenario(kind, options = {}) {
  const { manageLoading = true } = options;
  const scenario = dataset.demo_scenarios?.[kind];
  if (!scenario) {
    appendLog("warn", "Scenario unavailable", `Scenario '${kind}' is not configured.`, null, { hidden: true });
    return false;
  }
  const scenarioName = String(scenario.label || kind).replace(/^Scenario [A-Z]:\s*/, "");

  const payload = {
    ...scenario.payload,
    request_id: scenario.payload?.request_id || nextDemoScenarioRequestId(kind)
  };

  state.lastPayload = payload;
  renderDrawer();
  if (manageLoading) {
    setPendingDemoAction(`run-scenario:${kind}`, `Running ${scenarioName.toLowerCase()} scenario...`);
  }

  try {
    const response = await apiRequest("POST", "/v1/intercept", payload);
    state.lastResponse = response;
    const outcome = response?.outcome || "unknown";
    const narrative = scenarioNarrative(kind);
    const confidence = response?.attribution_confidence != null ? `${Math.round(Number(response.attribution_confidence || 0) * 100)}%` : "N/A";
    const team = response?.attribution_team || "Not attributed";
    setDemoOutcome({
      title: narrative.title,
      headline: narrative.headline,
      detail: `${scenarioName} completed with outcome ${interceptOutcomeLabel(outcome)}. ${response?.redirect_model ? `The request was redirected to ${response.redirect_model}.` : ""}`.trim(),
      metrics: [
        { label: "Outcome", value: interceptOutcomeLabel(outcome) },
        { label: "Team", value: team },
        { label: "Confidence", value: confidence },
        { label: "Latency", value: `${Number(response?.elapsed_ms || 0).toFixed(1)} ms` }
      ],
      why: narrative.why
    });
    appendLog("ok", narrative.title, `${scenarioName} completed with outcome ${interceptOutcomeLabel(outcome)}.`, null, {
      why: narrative.why
    });
    showToast(narrative.title, `Outcome: ${interceptOutcomeLabel(outcome)}`);
    return true;
  } catch (error) {
    state.lastResponse = { error: String(error) };
    const narrative = scenarioNarrative(kind);
    const message = summarizeApiError(error, `${scenario.label} did not complete.`);
    setDemoOutcome({
      title: "Live proof action unavailable",
      headline: `${scenarioName} needs the local demo API.`,
      detail: "The presentation can continue on local demo data, but this specific proof action only works when the local runtime is reachable from the browser.",
      metrics: [
        { label: "Scenario", value: scenarioName },
        { label: "Live proof controls", value: "Offline" }
      ],
      why: "Run the full product walkthrough for the presentation flow, or start the local demo runtime to show this proof action live."
    });
    appendLog("warn", "Live proof action unavailable", message, null, {
      hidden: true,
      why: "This is a runtime availability issue, not a product-behavior outcome."
    });
    showToast("Live Proof Unavailable", summarizeApiError(error, "The local demo runtime could not be reached."));
    return false;
  } finally {
    if (manageLoading) {
      setPendingDemoAction("", "");
    }
  }
  renderDrawer();
}

async function runFullSequence() {
  if (state.walkthroughStatus === "running") {
    return;
  }

  investorWalkthroughRunId += 1;
  const runId = investorWalkthroughRunId;
  setExecutionDrawer(false);
  state.modeMenuOpen = false;
  state.walkthroughStatus = "running";
  state.walkthroughStepIndex = 0;
  state.walkthroughProgressPct = 0;
  state.walkthroughElapsedMs = 0;
  state.walkthroughTotalMs = INVESTOR_WALKTHROUGH_TOTAL_MS;
  state.walkthroughAnchor = "";
  state.walkthroughStepTitle = "Preparing walkthrough";
  state.walkthroughStepHeadline = "Initializing deterministic demo state so the walkthrough stays logically consistent from the customer perspective.";
  setPendingDemoAction("start-walkthrough", "Preparing full product walkthrough...");
  render();

  const bootstrapped = await bootstrapDemoData({ manageLoading: false, fallbackOkay: true });
  if (!bootstrapped) {
    appendLog(
      "warn",
      "Local walkthrough mode",
      "The automated walkthrough continued on deterministic local demo data.",
      null,
      {
        hidden: true,
        why: "The automated story should stay usable even when the local demo API is unavailable."
      }
    );
  }

  try {
    for (let index = 0; index < INVESTOR_WALKTHROUGH_STEPS.length; index += 1) {
      if (runId !== investorWalkthroughRunId || state.walkthroughStatus !== "running") {
        return;
      }
      const step = INVESTOR_WALKTHROUGH_STEPS[index];
      state.walkthroughStepIndex = index;
      state.walkthroughStepTitle = step.title;
      state.walkthroughStepHeadline = step.headline;
      state.walkthroughAnchor = step.anchor;
      setPendingDemoAction("start-walkthrough", `Step ${index + 1}/${INVESTOR_WALKTHROUGH_STEPS.length}: ${step.title}`);
      if (typeof step.prepare === "function") {
        await step.prepare();
      } else {
        go(step.page);
      }
      renderWalkthroughBanner();
      applyWalkthroughHighlight();
      const completed = await waitForWalkthroughStep(step.durationMs, runId, index);
      if (!completed) {
        return;
      }
    }
    completeWalkthroughState();
    appendLog(
      "ok",
      "Walkthrough complete",
      "The automated investor walkthrough completed all product steps.",
      null,
      { hidden: true }
    );
  } finally {
    setPendingDemoAction("", "");
    renderWalkthroughBanner();
    renderTopbar();
    applyWalkthroughHighlight();
  }
}

function stopInvestorWalkthrough() {
  investorWalkthroughRunId += 1;
  resetWalkthroughState();
  setPendingDemoAction("", "");
  renderTopbar();
  renderWalkthroughBanner();
  applyWalkthroughHighlight();
}

function buildLocalForecastEstimate(monthlySpendUsd, horizonMonths, scenario) {
  const values = monthlySpendUsd.map((value) => Number(value || 0)).filter((value) => value > 0);
  const count = values.length;
  const latest = count ? values[count - 1] : 0;
  if (!count || !latest) {
    return {
      source: "local_estimate",
      trend_pct: 0,
      points: []
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  values.forEach((value, index) => {
    sumX += index;
    sumY += value;
    sumXY += index * value;
    sumXX += index * index;
  });

  const denominator = (count * sumXX) - (sumX * sumX);
  const slope = denominator ? (((count * sumXY) - (sumX * sumY)) / denominator) : 0;
  const intercept = count ? ((sumY - (slope * sumX)) / count) : latest;
  const residuals = values.map((value, index) => value - (intercept + (slope * index)));
  const residualVariance = residuals.length > 1
    ? residuals.reduce((acc, value) => acc + (value ** 2), 0) / (residuals.length - 1)
    : 0;
  const residualStdDev = Math.sqrt(residualVariance);
  const scenarioBand = Number(scenario?.volatility_band_pct || 0) / 100;
  const points = [];

  for (let monthOffset = 1; monthOffset <= horizonMonths; monthOffset += 1) {
    const projected = Math.max(
      Math.round(intercept + (slope * (count - 1 + monthOffset))),
      Math.round(latest * BUSINESS_RULES.forecastFloorShare)
    );
    const uncertainty = Math.max(
      Math.round(projected * scenarioBand),
      Math.round(residualStdDev * (1 + (monthOffset * 0.08)))
    );
    points.push({
      month_index: monthOffset,
      predicted_spend_usd: projected,
      lower_bound_usd: Math.max(projected - uncertainty, 0),
      upper_bound_usd: projected + uncertainty
    });
  }

  const exit = points.length ? points[points.length - 1].predicted_spend_usd : latest;
  return {
    source: "local_estimate",
    trend_pct: latest > 0 ? ((exit / latest) - 1) * 100 : 0,
    points
  };
}

async function runForecastDemo(options = {}) {
  const {
    log = true,
    toast = false,
    statusOverride = ""
  } = options;
  const monthly = buildForecastInputSeries();
  if (!monthly.length) {
    if (log) {
      appendLog("warn", "Forecast unavailable", "No historical monthly spend points found in dataset.", null, { hidden: true });
    }
    return;
  }

  const scenario = getForecastScenario();
  const payload = {
    monthly_spend_usd: monthly,
    horizon_months: state.forecastHorizonMonths
  };
  const optimistic = buildLocalForecastEstimate(monthly, state.forecastHorizonMonths, scenario);

  state.forecastResult = optimistic;
  state.forecastDirty = false;
  state.forecastLoading = true;
  state.forecastStatus = `Local ${scenario.label.toLowerCase()} estimate ready while live forecast runs.`;
  render();

  try {
    const response = await apiRequest("POST", "/v1/forecast/spend", payload);
    state.forecastResult = response;
    state.forecastDirty = false;
    state.forecastStatus = statusOverride || `${scenario.label} forecast generated successfully. Trend ${fmtPct(response.trend_pct || 0)} across ${state.forecastHorizonMonths} months.`;
    if (log) {
      appendLog("ok", "Forecast generated", `${scenario.label} trend ${fmtPct(response.trend_pct || 0)} across ${response.points?.length || 0} projection points.`, null, { hidden: true });
    }
    if (toast) {
      showToast("Forecast Updated", `${scenario.label} scenario projected across ${state.forecastHorizonMonths} months.`);
    }
  } catch (error) {
    const fallback = state.forecastResult?.source === "local_estimate"
      ? state.forecastResult
      : buildLocalForecastEstimate(monthly, state.forecastHorizonMonths, scenario);
    state.forecastResult = fallback;
    state.forecastDirty = false;
    state.forecastStatus = statusOverride || `${scenario.label} forecast estimated locally because the live forecast API is unavailable.`;
    if (log) {
      appendLog("warn", "Forecast fallback", summarizeApiError(error, "Live forecast generation failed."), null, {
        hidden: true,
        why: "The planner stayed usable by generating a local estimate from the demo dataset and scenario assumptions."
      });
    }
    if (toast) {
      showToast("Forecast Estimated Locally", `${scenario.label} scenario estimated locally because the live forecast API is unavailable.`);
    }
  } finally {
    state.forecastLoading = false;
    render();
  }
}

async function refreshIntegrationFeed() {
  await syncIntegrationsFromApi({ force: true });
  appendLog("ok", "Integration state refreshed", "Reloaded integration inventory, workflows, and recent handoffs.", null, { hidden: true });
}

async function loadDataset() {
  try {
    const response = await fetch(DATASET_URL, { cache: "default" });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const loaded = await response.json();
    dataset = {
      ...cloneData(FALLBACK_DATASET),
      ...cloneData(loaded)
    };
    for (const item of dataset.interventions || []) {
      item.status = normalizeStatus(item.status);
    }
    rebuildDatasetIndex();
  } catch (error) {
    dataset = cloneData(FALLBACK_DATASET);
    rebuildDatasetIndex();
    const message = summarizeApiError(error, "The external demo dataset file could not be loaded.");
    setRecoveryNotice({
      severity: "warn",
      title: "Dataset fallback active",
      message: "The demo loaded its embedded synthetic dataset instead of leaving the screen blank.",
      detail: `${message} Restart the local demo if this repeats after a refresh.`,
      source: "dataset"
    });
    appendLog("warn", "Dataset fallback", message, null, {
      why: "The embedded fallback keeps the investor walkthrough usable without network or filesystem assumptions."
    });
  }
}

function applyDatasetMetadata() {
  const tenantName = document.getElementById("tenant-name");
  const tenantEnv = document.getElementById("tenant-env");
  const tenantProfile = document.getElementById("tenant-profile");
  const period = document.getElementById("period-label");
  const watermark = document.getElementById("watermark-text");

  if (tenantName) {
    tenantName.textContent = dataset.meta?.tenant || "Tenant";
  }
  if (tenantEnv) {
    tenantEnv.textContent = dataset.meta?.environment_label || "Synthetic enterprise operating profile";
  }
  if (tenantProfile) {
    tenantProfile.textContent = dataset.meta?.tenant_profile_label || "Cross-functional AI program spanning engineering, support, data, and operations";
  }
  if (period) {
    period.textContent = dataset.meta?.period_label || "Current Period";
  }
  if (watermark) {
    watermark.textContent = dataset.meta?.watermark || "SIMULATED DATA";
  }

  const defaultMode = String(dataset.meta?.default_mode || "advisory").toLowerCase();
  if (["passive", "advisory", "active"].includes(defaultMode)) {
    state.mode = defaultMode;
  }

  if (!state.selectedRequestId && (dataset.attribution_requests || []).length) {
    state.selectedRequestId = dataset.attribution_requests[0].id;
  }
  if (!state.governanceSimulationRequestId && (dataset.attribution_requests || []).length) {
    state.governanceSimulationRequestId = dataset.attribution_requests[0].id;
  }
  if (state.governanceSimulationRequestId) {
    selectedGovernanceRequestValue();
  }
  if (!state.selectedModelName && (dataset.models || []).length) {
    state.selectedModelName = dataset.models[0].name;
  }
  if (!state.adoptionHierarchy && dataset.adoption?.hierarchy) {
    applyAdoptionHierarchy(dataset.adoption.hierarchy);
  }
}

function render() {
  try {
    // Direct render sequencing remains intentional because focus,
    // drawer feedback, and same-page chart timing are coupled to immediate
    // repaint order during the live demo. A requestAnimationFrame debounce was
    // evaluated and rejected for this path.
    const inputSnapshot = captureFocusedInputState();
    const rootBeforeRender = document.getElementById("view-root");
    const previousScrollTop = rootBeforeRender ? rootBeforeRender.scrollTop : 0;
    const pageBeforeRender = state.lastRenderedPage;
    syncSelectedInterventionForCurrentFilter();
    renderSidebar();
    renderTopbar();
    renderInstantFeedback();
    renderContextRibbon();
    renderRoleRibbon();
    renderRecoveryBanner();
    renderModeMenu();
    renderMainView();
    renderWalkthroughBanner();
    renderPresenterConsole();
    applyWalkthroughHighlight();
    renderDrawer();
    setMobileNav(state.mobileNavOpen);
    normalizeInteractionContracts(document);
    restoreFocusedInputState(inputSnapshot);
    const rootAfterRender = document.getElementById("view-root");
    if (rootAfterRender) {
      rootAfterRender.setAttribute("aria-busy", "false");
      if (pageBeforeRender === state.page) {
        rootAfterRender.scrollTop = previousScrollTop;
      } else {
        rootAfterRender.scrollTop = state.scrollTopByPage[state.page] || 0;
      }
    }
  } catch (error) {
    renderControlledRecoveryState(error);
  }
}

function renderControlledRecoveryState(error) {
  const message = summarizeApiError(error, "A demo-critical UI path failed while rendering.");
  state.recoveryNotice = {
    severity: "error",
    title: "Demo UI recovered safely",
    message: "A render failure was contained so the app can still guide the operator back to a known state.",
    detail: message,
    source: "render"
  };
  investorWalkthroughRunId += 1;
  resetWalkthroughState();
  state.pendingDemoAction = "";
  state.runtimeStatus = "degraded";
  state.runtimeDetail = "UI recovery mode active | reset demo state before continuing";
  state.logs.unshift({
    level: "err",
    title: "UI recovery mode",
    message,
    payload: null,
    at: nowLabel(),
    why: "The app replaced a blank-screen failure with controlled recovery guidance.",
    hidden: false
  });
  state.logs = state.logs.slice(0, UI_LIMITS.maxLogEntries);
  try {
    renderTopbar();
    renderInstantFeedback();
    renderRecoveryBanner();
    renderPresenterConsole();
    renderDrawer();
  } catch (recoveryError) {
    noteRecoveryRenderIssue(recoveryError);
  }
  const root = document.getElementById("view-root");
  if (root) {
    root.setAttribute("aria-busy", "false");
    root.innerHTML = recoveryViewMarkup(state.recoveryNotice);
  }
  const loader = document.getElementById("app-loader");
  if (loader instanceof HTMLElement) {
    loader.remove();
  }
}

function handleAction(actionEl) {
  const action = actionEl.dataset.action || "";
  if (!personaCanUseActionElement(actionEl, activeDemoPersona())) {
    const persona = activeDemoPersona();
    setPersonaNotice(
      "Action Hidden For Role",
      `${persona.label} does not have permission for this local demo action.`,
      "Switch persona to view or run that workflow."
    );
    appendLog("warn", "Persona action blocked", `${persona.name} attempted ${action}.`, null, {
      hidden: true,
      why: "The local demo blocks role-inappropriate actions even if a stale control is clicked."
    });
    render();
    return;
  }
  // FIX: block duplicate guided-demo actions before button disabled state visually catches up.
  if (state.pendingDemoAction && ["bootstrap-demo", "run-sequence", "start-walkthrough", "run-scenario", "clear-logs"].includes(action)) {
    return;
  }
  acknowledgeInstantAction(actionEl, action);

  switch (action) {
    case "close-toast":
      hideToast();
      return;
    case "toggle-mobile-nav":
      setMobileNav(!state.mobileNavOpen);
      return;
    case "close-mobile-nav":
      setMobileNav(false);
      return;
    case "toggle-mode-menu":
      toggleModeMenu();
      return;
    case "toggle-presenter-mode":
      setPresenterMode(!state.presenterMode);
      return;
    case "presenter-step":
      void goToPresenterStep(Number(actionEl.dataset.stepIndex || 0));
      return;
    case "presenter-prev":
      void goToPresenterStep(state.presenterStepIndex - 1);
      return;
    case "presenter-next":
      void goToPresenterStep(state.presenterStepIndex + 1);
      return;
    case "presenter-recover":
      void recoverPresenterStep();
      return;
    case "start-walkthrough":
      void runFullSequence();
      return;
    case "stop-walkthrough":
      stopInvestorWalkthrough();
      return;
    case "dismiss-walkthrough":
      resetWalkthroughState();
      renderWalkthroughBanner();
      renderTopbar();
      applyWalkthroughHighlight();
      return;
    case "open-drawer":
      setExecutionDrawer(true);
      return;
    case "close-drawer":
      setExecutionDrawer(false);
      return;
    case "back-to-demo-path":
      go(actionEl.dataset.page || demoPathTargetPage());
      return;
    case "bootstrap-demo":
      void bootstrapDemoData();
      return;
    case "run-sequence":
      void runFullSequence();
      return;
    case "run-scenario":
      void runInterceptScenario(actionEl.dataset.scenario || "");
      return;
    case "clear-logs":
      void clearExecutionLogs();
      return;
    case "go":
      go(actionEl.dataset.page || "overview");
      return;
    case "select-proof-journey":
      state.selectedProofJourney = actionEl.dataset.journeyKey || state.selectedProofJourney;
      render();
      return;
    case "set-partner-stage":
      state.selectedPartnerStage = actionEl.dataset.stageId || state.selectedPartnerStage;
      render();
      return;
    case "set-role-lens":
      state.roleLens = actionEl.dataset.roleLens || "executive";
      render();
      return;
    case "set-demo-persona":
      setActivePersona(actionEl.dataset.personaKey || "admin");
      return;
    case "set-mode":
      void setMode(actionEl.dataset.mode || "advisory");
      return;
    case "select-team":
      syncContextFromTeam(actionEl.dataset.teamId || "");
      if (actionEl.dataset.navigate === "teams") {
        go("teams");
      } else {
        render();
      }
      return;
    case "clear-team":
      state.selectedTeamId = null;
      render();
      return;
    case "manual-map-confirm": {
      const mapping = indexedLookup(datasetIndex.manualMappingsById, actionEl.dataset.mappingId || "");
      if (!mapping) {
        return;
      }
      void updateManualMapping(mapping.id, "confirmed", mapping.suggested_owner);
      return;
    }
    case "manual-map-assign":
      void updateManualMapping(
        actionEl.dataset.mappingId || "",
        "reassigned",
        actionEl.dataset.team || ""
      );
      return;
    case "manual-map-defer":
      void updateManualMapping(actionEl.dataset.mappingId || "", "deferred");
      return;
    case "manual-map-open-request":
      syncContextFromRequest(actionEl.dataset.requestId || "");
      go("attribution");
      return;
    case "manual-map-open-team":
      syncContextFromTeam(actionEl.dataset.teamId || "");
      go("teams");
      return;
    case "select-request":
      syncContextFromRequest(actionEl.dataset.requestId || "");
      render();
      return;
    case "select-model":
      syncContextFromModel(actionEl.dataset.modelName || "");
      if (actionEl.dataset.navigate === "models") {
        go("models");
      } else {
        render();
      }
      return;
    case "set-model-sort":
      state.modelSort = actionEl.dataset.sort || "spend_usd";
      if (!refreshModelsPageInPlace()) {
        render();
      }
      return;
    case "set-model-reference":
      state.modelReferenceKey = actionEl.dataset.referenceKey || "signals";
      render();
      return;
    case "select-intervention":
      syncContextFromIntervention(actionEl.dataset.interventionId || "");
      render();
      return;
    case "intervention-status":
      void updateInterventionStatus(
        actionEl.dataset.interventionId || "",
        actionEl.dataset.nextStatus || "recommended"
      );
      return;
    case "set-intervention-filter":
      state.interventionFilter = actionEl.dataset.filter || "all";
      render();
      return;
    case "adoption-set-scope":
      setAdoptionScope(
        actionEl.dataset.scopeType || "organization",
        actionEl.dataset.scopeId || ""
      );
      return;
    case "adoption-set-window":
      setAdoptionWindow(Number(actionEl.dataset.windowDays || "30"));
      return;
    case "adoption-refresh":
      void syncAdoptionFromApi({ preserveSelection: true, force: true });
      return;
    case "adoption-reset":
      state.adoptionDashboardCache = {};
      applyAdoptionHierarchy(fallbackAdoptionHierarchy(), { preserveSelection: false });
      render();
      return;
    case "forecast-set-scenario":
      state.forecastScenarioKey = actionEl.dataset.scenarioKey || DEFAULT_FORECAST_SCENARIO;
      updateForecastPreview();
      if (!refreshForecastPageInPlace()) {
        render();
      }
      return;
    case "forecast-set-horizon":
      {
        const nextHorizon = Number(actionEl.dataset.months || DEFAULT_FORECAST_HORIZON);
        if (!Number.isFinite(nextHorizon) || !FORECAST_HORIZONS.includes(nextHorizon)) {
          showToast(
            "Invalid forecast horizon",
            "The local demo preserved the previous horizon because the requested option is not part of the seeded scenario set."
          );
          appendLog("warn", "Invalid forecast horizon", `Rejected horizon value: ${actionEl.dataset.months || "empty"}.`, null, {
            why: "Forecast controls only accept seeded demo horizons so stakeholder walkthroughs stay deterministic."
          });
          return;
        }
        state.forecastHorizonMonths = nextHorizon;
      }
      updateForecastPreview();
      if (!refreshForecastPageInPlace()) {
        render();
      }
      return;
    case "forecast-compare-toggle": {
      const key = actionEl.dataset.scenarioKey || "";
      const next = new Set(state.forecastCompareKeys);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      next.add("baseline");
      state.forecastCompareKeys = Array.from(next);
      if (!refreshForecastPageInPlace()) {
        render();
      }
      return;
    }
    case "forecast-generate":
      void runForecastDemo({ toast: true });
      return;
    case "forecast-reset":
      void resetForecastPlanner({ toast: true });
      return;
    case "integrations-refresh":
      void refreshIntegrationFeed();
      return;
    case "integrations-run-scenario":
      void runIntegrationScenario(actionEl.dataset.scenarioId || "");
      return;
    case "set-replay-stage":
      state.replayStageIndex = Number(actionEl.dataset.stageIndex || 0);
      render();
      return;
    case "governance-set-sim-mode":
      state.governanceSimulationMode = actionEl.dataset.mode || state.mode;
      render();
      return;
    case "governance-set-bundle":
      state.governanceSimulationBundle = actionEl.dataset.bundle || "current";
      render();
      return;
    case "governance-set-request":
      state.governanceSimulationRequestId = actionEl.dataset.requestId || "";
      syncContextFromRequest(state.governanceSimulationRequestId);
      render();
      return;
    case "set-export-mode":
      state.exportViewMode = actionEl.dataset.exportMode || "event_time";
      render();
      return;
    case "export-artifact":
      exportArtifact(actionEl.dataset.artifact || "");
      return;
    case "toggle-faq":
      toggleFaq(actionEl.dataset.faqKey || "");
      return;
    case "show-deferred-section":
      showDeferredSection(actionEl.dataset.deferredKey || "");
      return;
    case "apply-guided-example":
      applyGuidedExample(actionEl.dataset.inputKey || "", actionEl.dataset.value || "");
      return;
    case "table-sort":
      updateTableSort(actionEl.dataset.tableKey || "", Number(actionEl.dataset.columnIndex || 0));
      return;
    case "table-page":
      updateTablePage(actionEl.dataset.tableKey || "", Number(actionEl.dataset.pageDelta || 0));
      return;
    case "show-context-help":
      showContextHelp(actionEl.dataset.helpKey || "");
      return;
    default:
      return;
  }
}

function onDocumentClick(event) {
  const target = event.target;
  const actionEl = target instanceof Element ? target.closest("[data-action]") : null;
  if (actionEl) {
    event.preventDefault();
    handleAction(actionEl);
    return;
  }

  const menu = document.getElementById("mode-menu");
  const button = document.getElementById("mode-button");
  if (!menu || !button || !state.modeMenuOpen) {
    return;
  }
  const clickedInside = menu.contains(target) || button.contains(target);
  if (!clickedInside) {
    state.modeMenuOpen = false;
    renderModeMenu();
  }

  const mobileDrawer = document.getElementById("mobile-nav-drawer");
  const mobileToggle = document.getElementById("mobile-nav-toggle");
  if (mobileDrawer && mobileToggle && state.mobileNavOpen) {
    const clickedInsideMobile = mobileDrawer.contains(target) || mobileToggle.contains(target);
    if (!clickedInsideMobile) {
      setMobileNav(false);
    }
  }
}

function onDocumentInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }
  if (target.dataset.actionInput === "table-filter") {
    updateTableFilter(target.dataset.tableKey || "", target.value);
    return;
  }
  if (target.dataset.actionInput === "glossary-query") {
    state.glossaryQuery = target.value;
    syncFieldFeedback(
      "glossary-query",
      state.glossaryQuery,
      searchFieldFeedback("glossary-query", state.glossaryQuery, glossaryResultStats()),
      ["glossary-summary"]
    );
    if (inputRenderTimer) {
      clearTimeout(inputRenderTimer);
    }
    inputRenderTimer = setTimeout(() => {
      inputRenderTimer = null;
      renderGlossaryResults();
    }, UI_LIMITS.searchDebounceMs);
    return;
  }
  if (target.dataset.actionInput === "faq-query") {
    state.faqQuery = target.value;
    syncFieldFeedback(
      "faq-query",
      state.faqQuery,
      searchFieldFeedback("faq-query", state.faqQuery, faqResultsMarkup()),
      ["faq-summary"]
    );
    if (inputRenderTimer) {
      clearTimeout(inputRenderTimer);
    }
    inputRenderTimer = setTimeout(() => {
      inputRenderTimer = null;
      renderFaqResults();
    }, UI_LIMITS.searchDebounceMs);
  }
}

function onDocumentChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) {
    return;
  }
  if (target.dataset.actionChange === "table-page-size") {
    updateTablePageSize(target.dataset.tableKey || "", target.value);
    return;
  }
  if (target.dataset.actionChange === "governance-set-request") {
    const status = governanceRequestSelectionFeedback(target.value);
    if (status.kind === "error") {
      syncFieldFeedback("governance-request", target.value, status);
      showToast("Request sample unavailable", status.message);
      return;
    }
    state.governanceSimulationRequestId = target.value;
    setFormStatus("governance-request", status, target.value);
    syncContextFromRequest(target.value);
    render();
  }
}

function trapFocusWithin(container, event) {
  const focusable = Array.from(container.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"))
    .filter((el) => !el.hasAttribute("disabled"));
  if (!focusable.length) {
    return false;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return true;
  }
  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
    return true;
  }
  return false;
}

function eventComesFromEditableTarget(event) {
  const target = event.target;
  return target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLSelectElement
    || Boolean(target instanceof HTMLElement && target.isContentEditable);
}

function focusPageSearchInput() {
  if (state.page !== "glossary" && state.page !== "faq") {
    return false;
  }
  const selector = state.page === "glossary"
    ? '[data-action-input="glossary-query"]'
    : '[data-action-input="faq-query"]';
  const input = document.querySelector(selector);
  if (!(input instanceof HTMLInputElement)) {
    return false;
  }
  input.focus({ preventScroll: true });
  input.select();
  return true;
}

function onKeyDown(event) {
  // FIX: allow keyboard activation for non-native controls that expose button semantics.
  if ((event.key === "Enter" || event.key === " ") && event.target instanceof HTMLElement) {
    const actionEl = event.target.closest("[data-action][role='button'], tr[data-action]");
    if (actionEl instanceof HTMLElement) {
      event.preventDefault();
      handleAction(actionEl);
      return;
    }
  }
  if (event.key === "Tab" && state.executionDrawerOpen) {
    const drawer = document.getElementById("execution-drawer");
    if (drawer && trapFocusWithin(drawer, event)) {
      return;
    }
  }
  if (event.key === "Tab" && state.mobileNavOpen) {
    const mobileDrawer = document.getElementById("mobile-nav-drawer");
    if (mobileDrawer && trapFocusWithin(mobileDrawer, event)) {
      return;
    }
  }
  if (event.key === "Escape") {
    if (state.executionDrawerOpen) {
      setExecutionDrawer(false);
    }
    if (state.mobileNavOpen) {
      setMobileNav(false);
    }
    if (state.modeMenuOpen) {
      state.modeMenuOpen = false;
      renderModeMenu();
    }
    hideToast();
    return;
  }
  if (eventComesFromEditableTarget(event)) {
    return;
  }
  if (!event.metaKey && !event.ctrlKey && !event.altKey && (event.key === "p" || event.key === "P")) {
    event.preventDefault();
    setPresenterMode(!state.presenterMode);
    return;
  }
  if (state.presenterMode && !event.metaKey && !event.ctrlKey && !event.altKey) {
    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      void goToPresenterStep(state.presenterStepIndex + 1);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      void goToPresenterStep(state.presenterStepIndex - 1);
      return;
    }
    if (event.key === "r" || event.key === "R") {
      event.preventDefault();
      if (event.shiftKey) {
        void clearExecutionLogs();
      } else {
        void recoverPresenterStep();
      }
      return;
    }
  }
  if (event.key === "g" || event.key === "G") {
    event.preventDefault();
    setExecutionDrawer(!state.executionDrawerOpen);
    return;
  }
  if (event.key === "m" || event.key === "M") {
    event.preventDefault();
    if (state.mobileNavOpen) {
      setMobileNav(false);
      return;
    }
    toggleModeMenu();
    return;
  }
  if (event.key === "/") {
    if (focusPageSearchInput()) {
      event.preventDefault();
    }
  }
}

async function initialize() {
  try {
    const params = new URLSearchParams(window.location.search);
    const resetOnLoad = params.get("reset") === "1";
    await loadDataset();
    if (resetOnLoad) {
      clearDemoSessionStorage();
      clearRecoveryNotice();
      clearPersonaNotice();
      state.logs = [];
      state.lastPayload = null;
      state.lastResponse = null;
      state.demoOutcome = null;
      state.demoScenarioRunCounts = {};
      state.deferredSectionsVisible = new Set();
      state.formStatus = {};
      state.tableUi = {};
      state.instantFeedback = null;
    }
    hydrateInterventionStatuses();
    hydrateManualMappingState();
    applyDatasetMetadata();
    applyAdoptionHierarchy(fallbackAdoptionHierarchy(), { preserveSelection: false });
    state.integrationOverview = fallbackIntegrationOverview();
    state.integrationDeliveries = Array.isArray(state.integrationOverview?.recent_deliveries)
      ? state.integrationOverview.recent_deliveries
      : [];
    if (resetOnLoad) {
      await resetBackendDemoState({ log: false, toast: false });
      clearDemoSessionStorage({ includeAuthTokens: true });
    }
    await resetForecastPlanner();
    appendLog(
      "ok",
      "Demo initialized",
      resetOnLoad
        ? "Frontend and backend demo state reset from the fixed baseline."
        : "Frontend dataset loaded and runtime controls ready.",
      null,
      { hidden: true }
    );
  } catch (error) {
    appendLog("err", "Initialization fallback", summarizeApiError(error, "The demo UI could not finish its startup routine."), null, {
      hidden: true
    });
    setRuntimeStatus("degraded", "Demo startup fell back to local presentation mode");
  } finally {
    render();
    // FIX: remove the cold-start loader once initialization is complete or safely degraded.
    const loader = document.getElementById("app-loader");
    if (loader instanceof HTMLElement) {
      loader.remove();
    }
  }
}

window.addEventListener("error", (event) => {
  const message = summarizeApiError(event?.error || event?.message, "An unexpected frontend error was contained.");
  appendLog("err", "Frontend recovered", message, null, {
    why: "The app kept the operator in a controlled demo state instead of relying on a console-only failure."
  });
  setRecoveryNotice({
    severity: "error",
    title: "Frontend issue contained",
    message: "The demo caught a browser-side issue and stayed available.",
    detail: "Use Reset Demo if the current view looks stale, or reload /platform/?reset=1 before presenting.",
    source: "frontend"
  });
  setRuntimeStatus("degraded", "Frontend recovery active | Reset Demo is available");
});

window.addEventListener("unhandledrejection", (event) => {
  const message = summarizeApiError(event?.reason, "A frontend async action failed and was contained.");
  appendLog("err", "Async action recovered", message, null, {
    why: "The app surfaced controlled guidance instead of leaving the failure in the browser console."
  });
  setRecoveryNotice({
    severity: "warn",
    title: "Async demo action recovered",
    message: "A live or browser-side action failed, but the local walkthrough remains usable.",
    detail: "Run Reset Demo to return to the seeded baseline, then retry the action if the local API is online.",
    source: "frontend"
  });
  setRuntimeStatus("degraded", "Async recovery active | local walkthrough available");
});

document.addEventListener("click", onDocumentClick);
document.addEventListener("input", onDocumentInput);
document.addEventListener("change", onDocumentChange);
document.addEventListener("keydown", onKeyDown);
document.addEventListener("DOMContentLoaded", initialize);
