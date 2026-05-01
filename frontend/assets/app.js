const NAV_ITEMS = [
  {
    group: "Platform",
    items: [
      { key: "overview", label: "Overview", icon: "<path d='M3 12l9-9 9 9'/><path d='M9 21V9h6v12'/>", badge: null },
      { key: "adoption", label: "Employee Adoption", icon: "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M20 8v6'/><path d='M23 11h-6'/>", badge: null },
      { key: "attribution", label: "Request Proof", icon: "<circle cx='12' cy='6' r='3'/><circle cx='6' cy='18' r='3'/><circle cx='18' cy='18' r='3'/><path d='M10 8l-2 7M14 8l2 7M9 18h6'/>", badge: null },
      { key: "models", label: "Models", icon: "<rect x='3' y='3' width='18' height='18' rx='3'/><path d='M3 9h18M9 3v18'/>", badge: null },
      { key: "teams", label: "Teams", icon: "<path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 00-3-3.87'/><path d='M16 3.13a4 4 0 010 7.75'/>", badge: null },
      { key: "manual_mapping", label: "Manual Mapping", icon: "<path d='M12 20h9'/><path d='M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z'/>", badge: null },
      { key: "interventions", label: "Interventions", icon: "<path d='M13 2L3 14h8l-1 8 10-12h-8l1-8z'/>", badge: "0" },
      { key: "governance", label: "Governance", icon: "<path d='M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z'/><path d='M9 12l2 2 4-4'/>", badge: null }
    ]
  },
  {
    group: "Operational",
    items: [
      { key: "forecast", label: "Forecasting", icon: "<path d='M3 17l5-5 4 4 8-8'/><path d='M14 8h6v6'/>", badge: null },
      { key: "integrations", label: "Integrations", icon: "<path d='M8 4h8v4H8z'/><path d='M3 10h18v10H3z'/><path d='M12 10v10'/>", badge: null },
      { key: "glossary", label: "Glossary", icon: "<path d='M4 19.5A2.5 2.5 0 016.5 17H20'/><path d='M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z'/>", badge: null },
      { key: "faq", label: "FAQ", icon: "<circle cx='12' cy='12' r='10'/><path d='M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3'/><circle cx='12' cy='17' r='1'/>", badge: null }
    ]
  }
];

const PAGE_TITLES = {
  overview: "Overview",
  adoption: "Employee AI Adoption",
  attribution: "Request Proof",
  models: "Model Intelligence",
  teams: "Teams",
  manual_mapping: "Manual Mapping",
  interventions: "Interventions",
  governance: "Governance",
  forecast: "Cost Forecasting",
  integrations: "Integrations",
  glossary: "Glossary",
  faq: "FAQ"
};

const MODE_COLORS = {
  passive: { bg: "rgba(29,188,200,0.18)", color: "#60dde6" },
  advisory: { bg: "rgba(42,196,135,0.17)", color: "#73deb1" },
  active: { bg: "rgba(148,112,255,0.16)", color: "#b49bff" }
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
  runtimeDegradedThreshold: 2
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
const DATASET_URL = new URL("data/demo_dataset.json", window.location.href).toString();

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
      business_value: "Routes urgent ACI decisions into the channels that already own triage.",
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
      expected_outcome: "ACI pushes a structured handoff into downstream execution channels."
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
    dashboards: {}
  },
  teams: [],
  models: [],
  interventions: [],
  attribution_requests: [],
  governance: { modes: [], policies: [], fail_open_matrix: [], trust_boundary_summary: [] },
  manual_mapping: [],
  integrations: FALLBACK_INTEGRATION_OVERVIEW,
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
  modeMenuOpen: false,
  mobileNavOpen: false,
  executionDrawerOpen: false,
  runtimeStatus: "local",
  runtimeDetail: "Using deterministic local demo data until a live action is requested",
  runtimeCapabilities: {},
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
  glossaryQuery: "",
  faqQuery: "",
  faqOpenKeys: new Set(),
  lastRenderedPage: null,
  pendingDemoAction: "",
  guidedDemoProgressLabel: "",
  walkthroughStatus: "idle",
  walkthroughStepIndex: -1,
  walkthroughStepTitle: "",
  walkthroughStepHeadline: "",
  walkthroughProgressPct: 0,
  walkthroughElapsedMs: 0,
  walkthroughTotalMs: 0,
  walkthroughAnchor: "",
  scrollTopByPage: {},
  governanceSimulationMode: "advisory",
  governanceSimulationBundle: "current",
  governanceSimulationRequestId: null,
  replayStageIndex: 0,
  lastMappingImpactId: null
};

let dataset = FALLBACK_DATASET;
const chartRegistry = new Map();
const INTERVENTION_STORAGE_KEY = "aci_demo_interventions_v3";
const MANUAL_MAPPING_STORAGE_KEY = "aci_demo_manual_mapping_v1";
const API_TOKEN_STORAGE_KEYS = ["aci_demo_api_token", "aci_api_token"];
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");
const USD_FORMATTERS = new Map();
let toastTimer = null;
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
  }
];

const INVESTOR_WALKTHROUGH_TOTAL_MS = INVESTOR_WALKTHROUGH_STEPS.reduce(
  (sum, step) => sum + step.durationMs,
  0
);

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

function pageLensNarrative(pageKey = state.page, lens = state.roleLens) {
  const copy = {
    overview: {
      executive: ["AI spend is growing quickly, but most of it is already attributable enough to act on.", "This is the company-level posture: owned spend, open leverage, and where executive attention belongs next."],
      finance: ["This page shows which share of AI spend is ready for chargeback versus still provisional.", "The key question is whether finance can trust the number enough to budget and report on it."],
      platform: ["This is the operating baseline for routing, ownership, and intervention prioritization.", "The goal is to see which parts of the stack are expensive, ambiguous, or ripe for optimization."],
      security: ["This is the governance posture of the AI estate before you drill into individual requests.", "The key question is whether usage is broad but still controlled."]
    },
    attribution: {
      executive: ["This is the proof surface behind one financial claim.", "It shows that a specific request can be tied back to an accountable owner with explainable evidence."],
      finance: ["This request-level view is what makes chargeback and audit defensible.", "It answers who pays, why they pay, and how much uncertainty remains in the ownership chain."],
      platform: ["This is the runtime evidence path from model invocation to final owner.", "It is where you see whether the attribution system is credible enough to drive automation."],
      security: ["This is where policy context and evidence quality meet.", "It shows whether a request can be governed confidently or needs human confirmation."]
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
    }
  };
  const selected = copy[pageKey]?.[lens] || copy[pageKey]?.executive || ["", ""];
  return { conclusion: selected[0] || "", why: selected[1] || "" };
}

function currentSelectedRequest() {
  return (dataset.attribution_requests || []).find((item) => item.id === state.selectedRequestId) || null;
}

function currentSelectedTeam() {
  return (dataset.teams || []).find((item) => item.id === state.selectedTeamId) || null;
}

function currentSelectedModel() {
  if (state.selectedModelName) {
    const explicit = (dataset.models || []).find((item) => item.name === state.selectedModelName);
    if (explicit) {
      return explicit;
    }
  }
  const request = currentSelectedRequest();
  if (request) {
    return (dataset.models || []).find((item) => item.name === request.model) || null;
  }
  const team = currentSelectedTeam();
  if (team && Array.isArray(team.top_models) && team.top_models.length) {
    return (dataset.models || []).find((item) => item.name === team.top_models[0]) || null;
  }
  return null;
}

function currentSelectedIntervention() {
  return getInterventions().find((item) => item.id === state.selectedInterventionId) || null;
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
  const request = (dataset.attribution_requests || []).find((item) => item.id === requestId);
  if (!request) {
    return;
  }
  state.selectedRequestId = request.id;
  state.replayStageIndex = 0;
  state.selectedModelName = request.model || state.selectedModelName;
  const teamName = selectedRequestTeamName(request);
  if (teamName) {
    const team = (dataset.teams || []).find((item) => item.name === teamName);
    if (team) {
      state.selectedTeamId = team.id;
    }
  }
}

function syncContextFromTeam(teamId) {
  const team = (dataset.teams || []).find((item) => item.id === teamId);
  if (!team) {
    return;
  }
  state.selectedTeamId = team.id;
  if (!state.selectedModelName && Array.isArray(team.top_models) && team.top_models.length) {
    state.selectedModelName = team.top_models[0];
  }
}

function syncContextFromModel(modelName) {
  const model = (dataset.models || []).find((item) => item.name === modelName);
  if (!model) {
    return;
  }
  state.selectedModelName = model.name;
}

function syncContextFromIntervention(interventionId) {
  const intervention = getInterventions().find((item) => item.id === interventionId);
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
  return (dataset.glossary || []).find((item) => String(item.term || "").toLowerCase() === String(term || "").toLowerCase()) || null;
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
    "#4f8ef8",
    "#2ac487",
    "#eda82e",
    "#9470ff",
    "#1dbcc8",
    "#ee5858",
    "#f18f42",
    "#52d8b1",
    "#d86ef5",
    "#7bc96f",
    "#ffcf5a",
    "#7aa8ff"
  ];
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
      const fromLocal = window.localStorage.getItem(key);
      if (fromLocal) {
        return fromLocal;
      }
    } catch (error) {
      void error;
    }
  }
  return "";
}

function safeSessionGet(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch (error) {
    void error;
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
      void error;
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
  const items = [
    { label: "Mode", value: modeLabel(state.mode) },
    { label: "Lens", value: roleLensLabel(state.roleLens) }
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
    const request = (dataset.attribution_requests || []).find((item) => item.id === state.governanceSimulationRequestId) || selectedRequest;
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
  root.innerHTML = `
    <div class="role-ribbon-copy">
      <div class="role-ribbon-title">Audience lens</div>
      <div class="role-ribbon-detail">${esc(roleLensDescription())}</div>
    </div>
    <div class="role-ribbon-actions">
      ${ROLE_LENSES.map((item) => `
        <button class="lens-btn${state.roleLens === item.key ? " active" : ""}" data-action="set-role-lens" data-role-lens="${esc(item.key)}">
          ${esc(item.label)}
        </button>
      `).join("")}
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
        <div class="walkthrough-banner-title">${esc(state.walkthroughStepTitle || "90-second product walkthrough")}</div>
        <div class="walkthrough-banner-copy">${esc(state.walkthroughStepHeadline || "The demo is auto-progressing through the product story.")}</div>
      </div>
      ${buttonMarkup}
    </div>
    <div class="walkthrough-progress">
      <div class="walkthrough-progress-bar" style="width:${Math.max(0, Math.min(state.walkthroughProgressPct, 100)).toFixed(1)}%"></div>
    </div>
  `;
}

function applyWalkthroughHighlight() {
  const allTargets = Array.from(document.querySelectorAll("[data-walkthrough-anchor]"));
  for (const target of allTargets) {
    target.classList.remove("walkthrough-highlight");
  }
  if (!state.walkthroughAnchor) {
    return;
  }
  const activeTarget = document.querySelector(`[data-walkthrough-anchor="${state.walkthroughAnchor}"]`);
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

function createChart(canvasId, config, options = {}) {
  const el = document.getElementById(canvasId);
  if (!el || typeof Chart === "undefined") {
    return;
  }
  const existing = chartRegistry.get(canvasId);
  if (existing) {
    if (existing.canvas === el && existing.config.type === config.type) {
      if (options.ariaLabel) {
        el.setAttribute("role", "img");
        el.setAttribute("aria-label", options.ariaLabel);
      }
      existing.data = config.data;
      existing.options = config.options || existing.options;
      existing.update();
      return;
    }
    existing.destroy();
    chartRegistry.delete(canvasId);
  }
  if (options.ariaLabel) {
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", options.ariaLabel);
  }
  const chart = new Chart(el, config);
  chartRegistry.set(canvasId, chart);
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
  const cacheKey = adoptionCacheKey(scopeType, scopeId, state.adoptionWindowDays);
  if (state.adoptionDashboardCache[cacheKey]) {
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
    state.integrationOverview = overview;
    state.integrationDeliveries = Array.isArray(overview?.recent_deliveries)
      ? overview.recent_deliveries
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
    appendLog(
      "err",
      "Integration workflow failed",
      summarizeApiError(error, `${scenario.title} did not complete.`),
      null,
      { hidden: true }
    );
    showToast(
      "Integration Workflow Failed",
      summarizeApiError(error, "Unable to execute the selected integration workflow.")
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
      : Math.max(beforeConfidence, 88);
  const forecastDelta = Math.round(Number(mapping.spend_at_risk_usd || 0) * BUSINESS_RULES.forecastRiskReserveShare);
  const request = (dataset.attribution_requests || []).find((item) => item.id === mapping.request_id) || null;
  const beforeOwner = mapping.current_owner;
  const afterOwner = status === "deferred"
    ? mapping.current_owner
    : (mapping.resolved_team || mapping.suggested_owner || mapping.current_owner);
  const linkedIntervention = getInterventions().find((item) => String(item.team || "").toLowerCase().includes(String(afterOwner || "").split(" ")[0].toLowerCase()));
  return {
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
          <div class="card" style="padding:10px;background:var(--surface)">
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
  return true;
}

function governancePolicyBundle(bundleKey = state.governanceSimulationBundle) {
  return GOVERNANCE_POLICY_BUNDLES.find((item) => item.key === bundleKey) || GOVERNANCE_POLICY_BUNDLES[0];
}

function governanceSimulationResult() {
  const request = (dataset.attribution_requests || []).find((item) => item.id === state.governanceSimulationRequestId) || currentSelectedRequest() || dataset.attribution_requests?.[0];
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
  const capabilityEntries = Object.entries(state.runtimeCapabilities || {});
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

function summarizeApiError(error, fallback = "The live demo action could not be completed.") {
  const message = String(error || "");
  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "Live demo API unavailable. Start the local demo runtime and retry.";
  }
  return fallback;
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
  stopInvestorWalkthrough();
  safeSessionRemove(INTERVENTION_STORAGE_KEY);
  safeSessionRemove(MANUAL_MAPPING_STORAGE_KEY);
  state.logs = [];
  state.lastPayload = null;
  state.lastResponse = null;
  state.demoOutcome = null;
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
  state.faqOpenKeys = new Set();
  state.governanceSimulationMode = "advisory";
  state.governanceSimulationBundle = "current";
  state.governanceSimulationRequestId = null;
  state.replayStageIndex = 0;
  state.lastMappingImpactId = null;
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
  await resetForecastPlanner({
    log: false,
    toast: false,
    statusOverride: "Forecast reset to baseline 12-month view."
  });
  appendLog("ok", "Demo reset", "The walkthrough, mapping queue, and forecast planner returned to their baseline investor-demo state.", null, {
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
  const intervention = getInterventions().find((item) => item.id === id);
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

  try {
    const response = await apiRequest("POST", `/v1/interventions/${id}/status`, {
      status: normalized,
      actor: "demo-ui",
      note: "Updated via platform demo controls"
    });
    intervention.status = normalizeStatus(response.status);
  } catch (error) {
    appendLog("warn", "Intervention update blocked", summarizeApiError(error, "Live intervention status update unavailable; the UI kept the last confirmed state."), null, { hidden: true });
    showToast("Intervention Unchanged", "Live status update was unavailable, so the intervention state was left unchanged.");
    render();
    return;
  }

  persistInterventionStatuses();
  const statusText = intervention.status.replace("_", " ");
  showToast("Intervention Updated", `${id} set to ${statusText}.`);
  render();
}

function updateManualMapping(id, status, resolvedTeam) {
  const mapping = getManualMappings().find((item) => item.id === id);
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
  const outcomeMessage = mapping.status === "deferred"
    ? `${mapping.workload_label} remains provisional until stronger evidence is available.`
    : `${mapping.workload_label} now resolves to ${mapping.resolved_team}.`;
  appendLog("ok", "Manual mapping updated", outcomeMessage, null, { hidden: true });
  showToast("Manual Mapping Updated", outcomeMessage);
  render();
}

function go(pageKey) {
  if (!PAGE_TITLES[pageKey]) {
    return;
  }
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
  if (pageKey === "integrations" && !state.integrationLoading) {
    void syncIntegrationsFromApi({ force: !state.integrationOverview });
  }
  render();
}

function renderSidebar() {
  const nav = document.getElementById("sidebar-nav");
  const mobileNav = document.getElementById("mobile-sidebar-nav");
  if (!nav && !mobileNav) {
    return;
  }
  const counts = interventionCounts();
  const mappingCounts = manualMappingCounts();
  const markup = NAV_ITEMS.map((group) => {
    const items = group.items.map((item) => {
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${item.icon}</svg>
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
          ${active ? "" : `<button class="mode-set-btn" data-action="set-mode" data-mode="${esc(mode.key)}">Set ${esc(mode.label)}</button>`}
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
  const title = document.getElementById("page-title");
  if (title) {
    title.textContent = PAGE_TITLES[state.page] || "Overview";
  }
  const walkthroughButton = document.getElementById("start-walkthrough");
  if (walkthroughButton instanceof HTMLButtonElement) {
    const running = state.walkthroughStatus === "running";
    walkthroughButton.disabled = running;
    walkthroughButton.textContent = running ? "Walkthrough Running..." : "Start 90-sec Walkthrough";
    walkthroughButton.setAttribute("aria-expanded", running ? "true" : "false");
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
      : `<div class="hint">No demo activity yet. Start the 90-second walkthrough, or run one live proof action.</div>`;
  }

  const summaryEl = document.getElementById("drawer-summary");
  if (summaryEl) {
    if (!state.demoOutcome) {
      summaryEl.innerHTML = `
        <div class="drawer-summary">
          <div class="drawer-summary-title">Recommended next step</div>
          <div class="drawer-summary-headline">Start the 90-second walkthrough.</div>
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
          <div class="drawer-why"><strong>What to do:</strong> Use the 90-second walkthrough for the presentation, and use live proof controls only after the local demo runtime is available.</div>
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
      <div class="mode-banner">
        <div>
          <div class="pill" style="background:${modeColor.bg};color:${modeColor.color}">${esc(modeLabel(state.mode))}</div>
          <div class="hint" style="margin-top:6px">This page answers the first investor question: where AI spend sits today, how much of it is owned, and where the savings levers are.</div>
        </div>
        <div class="mode-banner-right">
          <button class="small-btn" data-action="open-drawer">Open Guided Demo</button>
          <button class="small-btn" data-action="go" data-page="faq">Why these numbers are trustworthy</button>
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
          backgroundColor: ["#4f8ef8", "#2ac487", "#9470ff"],
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
          backgroundColor: categories.map((x) => x.color || "#4f8ef8"),
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

function adoptionView() {
  const hierarchy = state.adoptionHierarchy || fallbackAdoptionHierarchy();
  const dashboard = currentAdoptionDashboard();

  if (!dashboard) {
    return `
      <div class="card">
        <div class="card-title">Employee AI Adoption</div>
        <div class="card-subtitle">Executive adoption analytics become available when the live demo runtime is online.</div>
        <div class="adoption-empty" style="margin-top:12px">
          This page depends on the live adoption analytics API. Start the local demo runtime, initialize the demo, then reopen this page.
          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
            <button class="small-btn primary" data-action="bootstrap-demo">Initialize Demo</button>
            <button class="small-btn" data-action="adoption-refresh">Retry</button>
          </div>
        </div>
      </div>
    `;
  }

  const summary = dashboard.summary;
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
      <div class="adoption-empty">
        Team scope is the terminal drill-down. Use the top employees table and the executive lenses below to understand whether adoption is broad, embedded, and controlled.
      </div>
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
              <tbody>${topEmployeesMarkup || `<tr><td colspan='7' class='muted'>No employee activity captured yet.</td></tr>`}</tbody>
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
        <div class="hint" style="margin-top:8px">No request-level proof examples are available in the demo dataset.</div>
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
      <div class="hint" style="padding:24px;text-align:center">No models available in the current dataset.</div>
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
          <tbody id="models-table-body">${rows}</tbody>
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
      <div class="hint" style="padding:24px;text-align:center">No teams available in the current dataset.</div>
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
        <div class="metric-accent" style="background:var(--purple)"></div>
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
  const request = (dataset.attribution_requests || []).find((item) => item.id === mapping.request_id);
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
  const latestImpact = items.find((item) => item.id === state.lastMappingImpactId) || null;
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
      <div class="hint" style="padding:24px;text-align:center">No manual mapping items are available in the current dataset.</div>
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
            <div class="manual-mapping-kpi-value">${impact.beforeConfidence.toFixed(0)}% -> ${impact.afterConfidence.toFixed(0)}%</div>
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
          <button class="small-btn" data-action="manual-map-open-team" data-team-id="${esc(((dataset.teams || []).find((team) => team.name === impact.afterOwner) || {}).id || "")}">Open Team</button>
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
        ? `${latestImpact.workload_label} now shows how one mapping change improves confidence, shifts budget ownership, and changes the forecast reserve.`
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
        <div class="metric-value">+${uplift.toFixed(1)} pts</div>
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
            <div class="signal-values"><strong>${latestImpact.beforeConfidence.toFixed(0)}% -> ${latestImpact.afterConfidence.toFixed(0)}%</strong></div>
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
          ${queueItems || `<div class="hint">No interventions in this filter.</div>`}
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
        ` : `<div class="hint">Select an intervention to show the operating detail.</div>`}
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
  const requestOptions = (dataset.attribution_requests || []).map((request) => {
    const active = state.governanceSimulationRequestId === request.id;
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

    <div class="grid grid-3" style="margin-bottom:12px" data-walkthrough-anchor="walkthrough-governance">${modeCards}</div>

    <div class="governance-sim-grid" style="margin-bottom:12px">
      <div class="simulation-control-grid">
        <div class="simulation-card">
          <div class="simulation-card-title">Policy Simulation</div>
          <div class="simulation-card-subtitle">Test one request against different deployment modes and policy bundles. This shows what the interceptor would do, why, and what the next operating step should be.</div>
          <div class="simulation-button-row">${simulationModeButtons}</div>
          <div class="simulation-button-row">${bundleButtons}</div>
          <select class="simulation-select" data-action-change="governance-set-request" data-simulation="request">
            ${requestOptions}
          </select>
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
              <tbody>${policyRows}</tbody>
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
          <tbody>${matrixRows}</tbody>
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
  const comparePalette = [
    "#4f8ef8",
    "#2ac487",
    "#eda82e",
    "#8f6af8"
  ];
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
          <div class="card-subtitle">Shows how ACI plugs into the company operating system: signals in from enterprise systems, decisions out to the teams and tools that act on them.</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="small-btn" data-action="integrations-refresh" ${state.integrationLoading ? "disabled" : ""}>${state.integrationLoading ? "Refreshing..." : "Refresh Live State"}</button>
        </div>
      </div>
      <div class="hint">The value here is not that ACI can send a message. It is that ACI turns telemetry into routed business handoffs with owners, SLAs, and expected downstream actions.</div>
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
        <div class="metric-meta">Distinct handoff paths from ACI into owned operational workflows</div>
      </div>
      <div class="card metric-card">
        <div class="metric-accent" style="background:var(--purple)"></div>
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
        <div class="card-subtitle">What enterprise systems ACI already consumes or hands off into, and why each connection matters.</div>
        <div class="integration-source-grid" style="margin-top:12px">${sourceCards}</div>
      </div>
      <div class="card">
        <div class="card-title">Scenario Runner</div>
        <div class="card-subtitle">Run the business workflows that matter in diligence: escalation, execution handoff, pricing drift review, and executive reporting.</div>
        <div class="integration-scenario-grid" style="margin-top:12px">${scenarioCards}</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:12px">
      <div class="card-title">Operational Handoffs</div>
      <div class="card-subtitle">Where ACI routes decisions once it knows who should act and why.</div>
      <div class="integration-route-grid" style="margin-top:12px">${routeCards}</div>
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
          <tbody>${rows || `<tr><td colspan='6' class='muted'>No delivery records yet. Run one of the scenarios above.</td></tr>`}</tbody>
        </table>
      </div>
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
    markup: rendered || `<div class='hint'>No glossary terms match this search query.</div>`
  };
}

function renderGlossaryResults() {
  const summary = document.getElementById("glossary-summary");
  const results = document.getElementById("glossary-results");
  if (!summary || !results) {
    return;
  }
  const rendered = glossaryResultsMarkup();
  summary.textContent = `${rendered.filteredCount} term${rendered.filteredCount === 1 ? "" : "s"} shown across ${rendered.groupCount} categor${rendered.groupCount === 1 ? "y" : "ies"}.`;
  results.innerHTML = rendered.markup;
}

function glossaryView() {
  const rendered = glossaryResultsMarkup();

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
        type="text"
        value="${esc(state.glossaryQuery)}"
        placeholder="Search terms (TRAC, fail-open, manual mapping, forecasting...)"
        style="width:100%;border:1px solid var(--border);background:var(--surface);color:var(--text);padding:9px 10px;border-radius:8px;font:inherit;font-size:12px"
        aria-label="Search glossary terms"
        data-action-input="glossary-query"
      />
      <div class="hint" id="glossary-summary" style="margin:8px 0 12px">${rendered.filteredCount} term${rendered.filteredCount === 1 ? "" : "s"} shown across ${rendered.groupCount} categor${rendered.groupCount === 1 ? "y" : "ies"}.</div>
      <div id="glossary-results">${rendered.markup}</div>
    </div>
  `;
}

function faqResultsMarkup() {
  const query = state.faqQuery.trim().toLowerCase();
  const categories = (dataset.faq || []).map((category, idx) => {
    const filteredItems = (category.items || []).filter((item) => {
      if (!query) {
        return true;
      }
      const hay = `${item.question} ${item.answer}`.toLowerCase();
      return hay.includes(query);
    });
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
    markup: markup || `<div class='hint'>No FAQ items match this search query.</div>`
  };
}

function renderFaqResults() {
  const results = document.getElementById("faq-results");
  if (!results) {
    return;
  }
  results.innerHTML = faqResultsMarkup().markup;
}

function faqView() {
  const rendered = faqResultsMarkup();

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
        type="text"
        value="${esc(state.faqQuery)}"
        placeholder="Search FAQs (deployment, governance, methodology...)"
        style="width:100%;border:1px solid var(--border);background:var(--surface);color:var(--text);padding:9px 10px;border-radius:8px;font:inherit;font-size:12px"
        aria-label="Search frequently asked questions"
        data-action-input="faq-query"
      />
      <div class="hint" style="margin:8px 0 12px">Covers platform logic, deployment posture, governance controls, interventions, and forecasting assumptions.</div>
      <div id="faq-results">${rendered.markup}</div>
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
      root.innerHTML = overviewView();
      renderOverviewCharts();
      break;
    case "adoption":
      root.innerHTML = adoptionView();
      renderAdoptionCharts();
      break;
    case "attribution":
      root.innerHTML = attributionView();
      break;
    case "models":
      root.innerHTML = modelsView();
      renderModelChart();
      break;
    case "teams":
      root.innerHTML = teamsView();
      renderTeamCharts();
      break;
    case "manual_mapping":
      root.innerHTML = manualMappingView();
      break;
    case "interventions":
      root.innerHTML = interventionsView();
      break;
    case "governance":
      root.innerHTML = governanceView();
      break;
    case "forecast":
      root.innerHTML = forecastView();
      renderForecastChart();
      break;
    case "integrations":
      root.innerHTML = integrationsView();
      break;
    case "glossary":
      root.innerHTML = glossaryView();
      break;
    case "faq":
      root.innerHTML = faqView();
      break;
    default:
      root.innerHTML = overviewView();
      renderOverviewCharts();
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
    throw new Error(summarizeApiError(error));
  }
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    void error;
    data = { raw: text };
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      markRuntimeFailure(path, "Backend reachable | live API requires authentication");
    } else {
      markRuntimeFailure(path, `Backend responded ${response.status} ${response.statusText}`);
    }
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(data)}`);
  }
  markRuntimeSuccess(path, "Connected to demo runtime with simulated enterprise data");
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
    await syncAdoptionFromApi({ preserveSelection: false, force: true, render: false });
    await syncIntegrationsFromApi({ force: true, render: false });
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

async function runInterceptScenario(kind, options = {}) {
  const { manageLoading = true } = options;
  const scenario = dataset.demo_scenarios?.[kind];
  if (!scenario) {
    appendLog("warn", "Scenario unavailable", `Scenario '${kind}' is not configured.`, null, { hidden: true });
    return false;
  }
  const scenarioName = String(scenario.label || kind).replace(/^Scenario [A-Z]:\s*/, "");

  const payload = {
    request_id: `demo-${kind}-${Date.now()}`,
    ...scenario.payload
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
      why: "Run the 90-second walkthrough for the presentation flow, or start the local demo runtime to show this proof action live."
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
  setPendingDemoAction("start-walkthrough", "Preparing 90-second walkthrough...");
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

  state.forecastLoading = true;
  state.forecastStatus = `Generating ${scenario.label.toLowerCase()} forecast for ${state.forecastHorizonMonths} months...`;
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
    const fallback = buildLocalForecastEstimate(monthly, state.forecastHorizonMonths, scenario);
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
    const response = await fetch(DATASET_URL, { cache: "no-store" });
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
  } catch (error) {
    dataset = cloneData(FALLBACK_DATASET);
    appendLog("warn", "Dataset fallback", `Failed to load demo_dataset.json: ${String(error)}`, null, { hidden: true });
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
  if (!state.selectedModelName && (dataset.models || []).length) {
    state.selectedModelName = dataset.models[0].name;
  }
  if (!state.adoptionHierarchy && dataset.adoption?.hierarchy) {
    applyAdoptionHierarchy(dataset.adoption.hierarchy);
  }
}

function render() {
  // TODO: A requestAnimationFrame-based queueRender() debounce was evaluated for
  // this path, but direct render sequencing remains intentional because focus,
  // drawer feedback, and same-page chart timing are coupled to immediate
  // repaint order during the live demo.
  const inputSnapshot = captureFocusedInputState();
  const rootBeforeRender = document.getElementById("view-root");
  const previousScrollTop = rootBeforeRender ? rootBeforeRender.scrollTop : 0;
  const pageBeforeRender = state.lastRenderedPage;
  syncSelectedInterventionForCurrentFilter();
  renderSidebar();
  renderTopbar();
  renderContextRibbon();
  renderRoleRibbon();
  renderModeMenu();
  renderMainView();
  renderWalkthroughBanner();
  applyWalkthroughHighlight();
  renderDrawer();
  setMobileNav(state.mobileNavOpen);
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
}

function handleAction(actionEl) {
  const action = actionEl.dataset.action || "";
  // FIX: block duplicate guided-demo actions before button disabled state visually catches up.
  if (state.pendingDemoAction && ["bootstrap-demo", "run-sequence", "start-walkthrough", "run-scenario", "clear-logs"].includes(action)) {
    return;
  }

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
    case "set-role-lens":
      state.roleLens = actionEl.dataset.roleLens || "executive";
      render();
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
      const mapping = getManualMappings().find((item) => item.id === (actionEl.dataset.mappingId || ""));
      if (!mapping) {
        return;
      }
      updateManualMapping(mapping.id, "confirmed", mapping.suggested_owner);
      return;
    }
    case "manual-map-assign":
      updateManualMapping(
        actionEl.dataset.mappingId || "",
        "reassigned",
        actionEl.dataset.team || ""
      );
      return;
    case "manual-map-defer":
      updateManualMapping(actionEl.dataset.mappingId || "", "deferred");
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
      applyAdoptionHierarchy(state.adoptionHierarchy || fallbackAdoptionHierarchy());
      void syncAdoptionFromApi({ preserveSelection: false, force: true });
      return;
    case "forecast-set-scenario":
      state.forecastScenarioKey = actionEl.dataset.scenarioKey || DEFAULT_FORECAST_SCENARIO;
      updateForecastPreview();
      if (!refreshForecastPageInPlace()) {
        render();
      }
      return;
    case "forecast-set-horizon":
      state.forecastHorizonMonths = Number(actionEl.dataset.months || DEFAULT_FORECAST_HORIZON);
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
    case "export-artifact":
      exportArtifact(actionEl.dataset.artifact || "");
      return;
    case "toggle-faq":
      toggleFaq(actionEl.dataset.faqKey || "");
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
  if (target.dataset.actionInput === "glossary-query") {
    state.glossaryQuery = target.value;
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
  if (target.dataset.actionChange === "governance-set-request") {
    state.governanceSimulationRequestId = target.value;
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
    const actionEl = event.target.closest("[data-action][role='button']");
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
    await loadDataset();
    hydrateInterventionStatuses();
    hydrateManualMappingState();
    applyDatasetMetadata();
    applyAdoptionHierarchy(fallbackAdoptionHierarchy(), { preserveSelection: false });
    state.integrationOverview = fallbackIntegrationOverview();
    state.integrationDeliveries = Array.isArray(state.integrationOverview?.recent_deliveries)
      ? state.integrationOverview.recent_deliveries
      : [];
    await resetForecastPlanner();
    appendLog("ok", "Demo initialized", "Frontend dataset loaded and runtime controls ready.", null, { hidden: true });
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
  const message = event?.message || "Unexpected frontend error.";
  appendLog("err", "Frontend error", message, null, { hidden: true });
  setRuntimeStatus("degraded", "Frontend error logged | check guided demo timeline");
});

window.addEventListener("unhandledrejection", (event) => {
  const message = summarizeApiError(event?.reason, "Unhandled frontend promise rejection.");
  appendLog("err", "Unhandled rejection", message, null, { hidden: true });
  setRuntimeStatus("degraded", "Unhandled promise rejection logged");
});

document.addEventListener("click", onDocumentClick);
document.addEventListener("input", onDocumentInput);
document.addEventListener("change", onDocumentChange);
document.addEventListener("keydown", onKeyDown);
document.addEventListener("DOMContentLoaded", initialize);
