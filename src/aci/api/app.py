"""
FastAPI application: API surface for the Argmin platform.

Routes serve attribution data, policy management, benchmarks, and health checks.
The API runs in the vendor control plane (SaaS) or within customer VPC depending
on deployment topology.
"""

from __future__ import annotations

import asyncio
import os
from contextlib import asynccontextmanager
from datetime import UTC, datetime
from ipaddress import ip_address, ip_network
from pathlib import Path
from typing import TYPE_CHECKING, Annotated, Any, Literal, cast
from uuid import uuid4

import structlog
from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from jwt import InvalidTokenError
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest
from pydantic import BaseModel, Field

from aci.api.auth import (
    can_bypass_auth,
    decode_and_validate_token,
    is_auth_required,
    is_public_path,
)
from aci.api.runtime import AppState, SlidingWindowRateLimiter, ensure_app_state
from aci.core.event_schema import EventSchemaValidationError, validate_event_attributes
from aci.demo.seeder import DEMO_REFERENCE_TIME, DemoBootstrapResult, bootstrap_demo_state
from aci.integrations.catalog import default_integration_sources
from aci.integrations.notifications import NotificationDelivery, NotificationMessage
from aci.interceptor.gateway import (
    DeploymentMode,
    InterceptionOutcome,
    InterceptionRequest,
    InterceptionResult,
)
from aci.models.events import DomainEvent, EventType
from aci.pricing.catalog import PricingRule, PricingUsage

if TYPE_CHECKING:
    from collections.abc import AsyncIterator, Awaitable, Callable

    from starlette.types import ASGIApp, Message, Receive, Scope, Send

    from aci.adoption.analytics import (
        AdoptionDashboard,
        AdoptionExecutiveLens,
        AdoptionHierarchy,
        AdoptionHierarchyBusinessUnit,
        AdoptionHierarchyTeam,
        AdoptionMixRecord,
        AdoptionScopeBreakdown,
        AdoptionSummary,
        AdoptionTopEmployee,
        AdoptionTrendPoint,
    )
    from aci.interventions.registry import InterventionRecord, InterventionTransition

logger = structlog.get_logger()
__all__ = ["AppState", "SlidingWindowRateLimiter", "app", "get_state"]

PLATFORM_DEMO_CSP = (
    "default-src 'self'; "
    "script-src 'self'; "
    "style-src 'self' 'unsafe-inline'; "
    "img-src 'self' data:; "
    "connect-src 'self'; "
    "font-src 'self' data:; "
    "object-src 'none'; "
    "base-uri 'self'; "
    "form-action 'self'; "
    "frame-ancestors 'none'"
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Application lifespan: initialize and tear down platform components."""
    app_state = get_state(app)
    logger.info("platform.starting", tenant=app_state.config.tenant_id)
    await app_state.start()
    yield
    await app_state.stop()
    logger.info("platform.shutting_down")


app = FastAPI(
    title="Argmin Platform",
    description="Argmin: application-level cost attribution and optimization",
    version="0.3.3",
    lifespan=lifespan,
)
app.add_middleware(GZipMiddleware, minimum_size=500)


class _RequestBodyTooLargeError(Exception):
    pass


class RequestBodyLimitMiddleware:
    """Reject oversized ingestion payloads before FastAPI parses the request body."""

    _LIMITED_PATHS = {"/v1/events/ingest", "/v1/events/ingest/batch"}

    def __init__(self, app: ASGIApp, default_max_body_bytes: int = 1_048_576) -> None:
        self.app = app
        self.default_max_body_bytes = default_max_body_bytes

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        method = scope.get("method", "").upper()
        path = scope.get("path", "")
        if method != "POST" or path not in self._LIMITED_PATHS:
            await self.app(scope, receive, send)
            return

        max_body_bytes = self._resolve_limit(scope)
        content_length = self._content_length(scope)
        if content_length is not None and content_length > max_body_bytes:
            await self._send_too_large(send, max_body_bytes)
            return

        total_body_bytes = 0

        async def limited_receive() -> Message:
            nonlocal total_body_bytes
            message = await receive()
            if message["type"] == "http.request":
                total_body_bytes += len(message.get("body", b""))
                if total_body_bytes > max_body_bytes:
                    raise _RequestBodyTooLargeError
            return message

        try:
            await self.app(scope, limited_receive, send)
        except _RequestBodyTooLargeError:
            await self._send_too_large(send, max_body_bytes)

    def _resolve_limit(self, scope: Scope) -> int:
        app_instance = scope.get("app")
        if isinstance(app_instance, FastAPI):
            return get_state(app_instance).config.api_max_request_bytes
        return self.default_max_body_bytes

    @staticmethod
    def _content_length(scope: Scope) -> int | None:
        for key, value in scope.get("headers", []):
            if key.lower() == b"content-length":
                try:
                    return int(value.decode("latin-1"))
                except ValueError:
                    return None
        return None

    @staticmethod
    async def _send_too_large(send: Send, max_body_bytes: int) -> None:
        body = (
            f'{{"detail":"request body exceeds configured max {max_body_bytes} bytes"}}'
        ).encode()
        await send(
            {
                "type": "http.response.start",
                "status": 413,
                "headers": [
                    (b"content-type", b"application/json"),
                    (b"content-length", str(len(body)).encode("ascii")),
                ],
            }
        )
        await send({"type": "http.response.body", "body": body, "more_body": False})


app.add_middleware(
    RequestBodyLimitMiddleware,
    default_max_body_bytes=int(os.getenv("ACI_API_MAX_REQUEST_BYTES", "1048576")),
)


def get_state(app_instance: FastAPI | None = None) -> AppState:
    """Return state attached to the FastAPI application instance."""
    return ensure_app_state(app if app_instance is None else app_instance)


cors_allowed_origins = [
    origin.strip()
    for origin in os.getenv("ACI_API_CORS_ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]
if cors_allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_allowed_origins,
        allow_credentials=os.getenv("ACI_API_CORS_ALLOW_CREDENTIALS", "false").lower() == "true",
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-Requested-With", "X-ACI-Request-ID"],
    )


@app.middleware("http")
async def bind_correlation_id(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    """Resolve and propagate a stable request correlation identifier."""
    correlation_id = (
        request.headers.get("X-ACI-Correlation-Id")
        or request.headers.get("X-Request-Id")
        or uuid4().hex
    ).strip()
    request.state.correlation_id = correlation_id
    response = await call_next(request)
    response.headers.setdefault("X-ACI-Correlation-Id", correlation_id)
    logger.info(
        "api.request_completed",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        correlation_id=correlation_id,
    )
    return response


@app.middleware("http")
async def add_security_headers(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    """Apply baseline security headers to all HTTP responses."""
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    if request.url.path.startswith("/platform"):
        response.headers.setdefault("Content-Security-Policy", PLATFORM_DEMO_CSP)
        # FIX: force fresh platform assets so browsers do not run stale demo bundles.
        response.headers.setdefault("Cache-Control", "no-store, max-age=0")
        response.headers.setdefault("Pragma", "no-cache")
    return response


@app.middleware("http")
async def enforce_service_auth(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    """Enforce bearer-token authentication for private API endpoints."""
    path = request.url.path
    if is_public_path(path) or not is_auth_required(path):
        return await call_next(request)

    app_state = get_state(request.app)
    auth_config = app_state.config.auth
    if not auth_config.enabled:
        return await call_next(request)

    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        if can_bypass_auth(app_state.config):
            return await call_next(request)
        return JSONResponse(
            status_code=401,
            content={"detail": "missing bearer token"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth_header.removeprefix("Bearer ").strip()
    try:
        claims = decode_and_validate_token(token, auth_config, app_state.config.tenant_id)
    except InvalidTokenError as exc:
        logger.warning(
            "auth.token_invalid",
            error=str(exc),
            path=path,
            correlation_id=_request_correlation_id(request),
        )
        return JSONResponse(
            status_code=401,
            content={"detail": "invalid bearer token"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    request.state.auth_claims = claims
    return await call_next(request)


@app.middleware("http")
async def enforce_runtime_surface(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    """Restrict role-specific HTTP surface area to the routes a pod should serve."""
    path = request.url.path
    always_available_paths = {"/", "/health", "/live", "/ready", "/metrics", "/metrics/prometheus"}
    if path in always_available_paths or path.startswith("/platform"):
        return await call_next(request)

    app_state = get_state(request.app)
    if app_state.runtime_role == "gateway" and path.startswith("/v1/") and path != "/v1/intercept":
        return JSONResponse(
            status_code=503,
            content={"detail": "route unavailable for runtime role 'gateway'"},
        )

    return await call_next(request)


# Serve the platform demo from the repo.
frontend_dir = Path(__file__).resolve().parents[3] / "frontend"
if frontend_dir.exists():
    app.mount("/platform", StaticFiles(directory=str(frontend_dir), html=True), name="platform")


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------


class RootResponse(BaseModel):
    name: str
    version: str
    health_url: str
    mockup_url: str | None


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    index_size: int
    runtime_role: str
    interceptor_mode: str
    circuit_breaker: str
    fail_open_alert_level: str
    fail_open_window_rate: float


class LivenessResponse(BaseModel):
    status: str
    timestamp: str


class ReadinessResponse(BaseModel):
    status: str
    timestamp: str
    checks: dict[str, bool]


class InterceptRequest(BaseModel):
    request_id: str
    model: str
    provider: str = ""
    service_name: str = ""
    workload_id: str = ""
    api_key_id: str = ""
    input_tokens: int = 0
    max_tokens: int = 0
    estimated_cost_usd: float = 0.0
    environment: str = ""
    route: str = ""
    response_format_type: str = ""
    tools_present: bool = False
    strict_json_schema: bool = False


class InterceptResponse(BaseModel):
    request_id: str
    outcome: str
    elapsed_ms: float
    enrichment_headers: dict[str, str]
    redirect_model: str | None = None
    attribution_team: str | None = None
    attribution_confidence: float | None = None


class PolicySignalsRequest(BaseModel):
    est_cost_usd: float = 0.0


class ServicePolicyRequest(BaseModel):
    active_lite_enabled: bool = False
    allowed_actions: list[str] = Field(default_factory=list)
    min_route_confidence: float = 0.90
    max_tokens_cap: int | None = None


class PolicyEvaluateRequest(BaseModel):
    request_id: str
    env: str
    service_id: str
    model_requested: str
    attribution: dict[str, Any] = Field(default_factory=dict)
    signals: PolicySignalsRequest = Field(default_factory=PolicySignalsRequest)
    mode: str = "ADVISORY"
    service_policy: ServicePolicyRequest = Field(default_factory=ServicePolicyRequest)


class PolicyActionResponse(BaseModel):
    type: str
    confidence: float
    delta: str


class PolicyAdvisoryResponse(BaseModel):
    code: str
    detail: str


class PolicyEvaluateResponse(BaseModel):
    decision: str
    advisories: list[PolicyAdvisoryResponse]
    actions: list[PolicyActionResponse]
    fail_open: bool


class TRACRequest(BaseModel):
    workload_id: str
    billed_cost_usd: float
    emissions_kg_co2e: float = 0.0
    attribution_confidence: float = 0.95
    signal_age_days: float = 0.0


class TRACResponse(BaseModel):
    workload_id: str
    trac_usd: float
    billed_cost_usd: float
    carbon_liability_usd: float
    confidence_risk_premium_usd: float
    carbon_pct_of_trac: float
    risk_pct_of_trac: float


class IndexLookupResponse(BaseModel):
    workload_id: str
    team_id: str
    team_name: str
    cost_center_id: str
    confidence: float
    confidence_tier: str
    method_used: str
    version: int


class ManualAttributionRequest(BaseModel):
    workload_id: str
    true_team_id: str
    true_team_name: str
    true_cost_center_id: str
    true_cost_center_name: str = ""
    actor: str = "manual_mapping_api"
    note: str = ""


class ManualAttributionResponse(BaseModel):
    accepted: bool
    event_id: str
    workload_id: str
    previous_team_id: str
    previous_team_name: str
    previous_cost_center_id: str
    updated_team_id: str
    updated_team_name: str
    updated_cost_center_id: str
    updated_cost_center_name: str
    confidence_before: float
    confidence_after: float
    method_used: str


class IndexConstraintResponse(BaseModel):
    type: str
    scope: str


class IndexLookupAttributionResponse(BaseModel):
    owner_id: str | None
    team_id: str | None
    confidence: float
    reason: str
    explanation_id: str


class IndexLookupByKeyResponse(BaseModel):
    key: str
    index_version: int
    attribution: IndexLookupAttributionResponse
    constraints: list[IndexConstraintResponse]
    cache_ttl_ms: int


class EventIngestRequest(BaseModel):
    event_type: EventType
    subject_id: str
    attributes: dict[str, Any] = Field(default_factory=dict)
    event_time: datetime = Field(default_factory=lambda: datetime.now(UTC))
    source: str
    idempotency_key: str


class EventIngestResponse(BaseModel):
    accepted: bool
    event_id: str


class EventBatchIngestRequest(BaseModel):
    events: list[EventIngestRequest] = Field(min_length=1)


class EventBatchIngestResponse(BaseModel):
    total: int
    accepted: int
    deduplicated: int


class DashboardOverviewResponse(BaseModel):
    tenant_id: str
    environment: str
    runtime_role: str
    generated_at: str
    total_ai_spend_usd: float
    attribution_coverage_pct: float
    optimization_potential_usd: float
    savings_captured_usd: float
    spend_by_team: list[dict[str, Any]]
    spend_by_model: list[dict[str, Any]]
    spend_trend: list[dict[str, Any]]
    index_size: int
    index_hit_rate: float
    interceptor_requests: int
    interceptor_enriched: int
    interceptor_fail_open: int
    interceptor_cache_misses: int
    interceptor_mode: str
    circuit_breaker_state: str
    fail_open_alert_level: str
    fail_open_window_rate: float
    events_published: int


class AdoptionSummaryResponse(BaseModel):
    eligible_employees: int
    active_employees_7d: int
    active_employees_30d: int
    adoption_penetration_pct: float
    repeat_user_rate_pct: float
    power_user_rate_pct: float
    governed_usage_pct: float
    intervention_rate_pct: float
    requests_30d: int
    spend_30d_usd: float
    spend_per_active_employee_usd: float
    requests_per_active_employee: float
    growth_vs_prior_pct: float


class AdoptionScopeBreakdownResponse(BaseModel):
    scope_type: Literal["organization", "business_unit", "team"]
    scope_id: str
    label: str
    eligible_employees: int
    active_employees_30d: int
    adoption_penetration_pct: float
    growth_vs_prior_pct: float
    requests_30d: int
    spend_30d_usd: float
    governed_usage_pct: float
    top_entry_point: str


class AdoptionTopEmployeeResponse(BaseModel):
    employee_id: str
    name: str
    title: str
    team_name: str
    business_unit_name: str
    requests_30d: int
    spend_30d_usd: float
    governed_usage_pct: float
    last_active_at: str | None
    adoption_stage: str
    top_model: str
    top_entry_point: str


class AdoptionMixRecordResponse(BaseModel):
    label: str
    requests: int
    spend_usd: float
    pct_of_requests: float


class AdoptionTrendPointResponse(BaseModel):
    label: str
    active_employees: int
    requests: int
    spend_usd: float
    governed_usage_pct: float


class AdoptionExecutiveLensResponse(BaseModel):
    audience: str
    headline: str
    detail: str
    metric_label: str
    metric_value: str


class AdoptionDashboardResponse(BaseModel):
    generated_at: str
    scope_type: Literal["organization", "business_unit", "team"]
    scope_id: str
    scope_label: str
    parent_scope_label: str | None
    window_days: int
    summary: AdoptionSummaryResponse
    child_scopes: list[AdoptionScopeBreakdownResponse]
    top_employees: list[AdoptionTopEmployeeResponse]
    model_mix: list[AdoptionMixRecordResponse]
    entry_point_mix: list[AdoptionMixRecordResponse]
    trend: list[AdoptionTrendPointResponse]
    executive_lenses: list[AdoptionExecutiveLensResponse]


class AdoptionHierarchyTeamResponse(BaseModel):
    team_id: str
    team_name: str
    eligible_employees: int


class AdoptionHierarchyBusinessUnitResponse(BaseModel):
    business_unit_id: str
    business_unit_name: str
    eligible_employees: int
    teams: list[AdoptionHierarchyTeamResponse]


class AdoptionHierarchyOrganizationResponse(BaseModel):
    organization_id: str
    organization_name: str
    eligible_employees: int
    business_units: list[AdoptionHierarchyBusinessUnitResponse]


class AdoptionHierarchyResponse(BaseModel):
    organization: AdoptionHierarchyOrganizationResponse
    default_scope_type: Literal["organization", "business_unit", "team"]
    default_scope_id: str


class DemoBootstrapResponse(BaseModel):
    seeded_entries: int
    workloads: list[str]
    events_published: int
    graph_nodes: int
    graph_edges: int
    reference_time: str
    scenario_ids: list[str]
    demo_accounts: list[dict[str, str]]
    reset_token: str
    interceptor_mode: str
    environment: str


class DemoModeRequest(BaseModel):
    mode: Literal["passive", "advisory", "active"]


class DemoModeResponse(BaseModel):
    interceptor_mode: str
    environment: str


class PricingRuleResponse(BaseModel):
    provider: str
    model: str
    effective_from: str
    input_usd_per_1k_tokens: float
    output_usd_per_1k_tokens: float
    cached_input_usd_per_1k_tokens: float | None
    request_base_usd: float
    source: str
    provenance_ref: str
    updated_by: str


class PricingRuleCreateRequest(BaseModel):
    provider: str
    model: str
    effective_from: datetime
    input_usd_per_1k_tokens: float
    output_usd_per_1k_tokens: float
    cached_input_usd_per_1k_tokens: float | None = None
    request_base_usd: float = 0.0
    source: str = "manual"
    provenance_ref: str = ""
    updated_by: str = "api"


class PricingEstimateRequest(BaseModel):
    provider: str
    model: str
    input_tokens: int = 0
    output_tokens: int = 0
    cache_read_input_tokens: int = 0
    request_count: int = 1
    effective_at: datetime | None = None


class PricingEstimateResponse(BaseModel):
    provider: str
    model: str
    request_count: int
    rule_effective_from: str
    input_cost_usd: float
    cached_input_cost_usd: float
    output_cost_usd: float
    request_base_cost_usd: float
    total_cost_usd: float


class SyntheticCostIngestRequest(BaseModel):
    request_id: str
    service_name: str
    provider: str
    model: str
    input_tokens: int = 0
    output_tokens: int = 0
    cache_read_input_tokens: int = 0
    synthetic_cost_usd: float | None = None
    recorded_at: datetime | None = None


class SyntheticCostIngestResponse(BaseModel):
    request_id: str
    synthetic_cost_usd: float
    provider: str
    model: str
    recorded_at: str
    reconciled: bool


class CostReconcileRequest(BaseModel):
    request_id: str
    reconciled_cost_usd: float
    source: str = "billing_api"
    recorded_at: datetime | None = None


class CostReconcileResponse(BaseModel):
    request_id: str
    synthetic_cost_usd: float
    reconciled_cost_usd: float
    drift_usd: float
    drift_pct: float
    source: str


class DriftSummaryResponse(BaseModel):
    group: str
    total_records: int
    reconciled_records: int
    unresolved_records: int
    synthetic_cost_usd: float
    reconciled_cost_usd: float
    absolute_drift_usd: float
    drift_pct: float
    window: Literal["daily", "weekly"]
    threshold_pct: float
    investigation_required: bool
    dashboard_annotation: str


class SpendForecastRequest(BaseModel):
    monthly_spend_usd: list[float]
    horizon_months: int = 3


class SpendForecastPointResponse(BaseModel):
    month_offset: int
    predicted_spend_usd: float
    lower_bound_usd: float
    upper_bound_usd: float


class SpendForecastResponse(BaseModel):
    trend_pct: float
    residual_stddev_usd: float
    points: list[SpendForecastPointResponse]


class CostSimulationRequest(BaseModel):
    service_id: str
    provider: str
    current_model: str
    avg_input_tokens: int
    avg_output_tokens: int
    requests_per_day: int
    candidate_models: list[str] = Field(default_factory=list)


class CostSimulationCandidateResponse(BaseModel):
    model: str
    projected_monthly_cost_usd: float
    monthly_savings_usd: float
    savings_pct: float


class CostSimulationResponse(BaseModel):
    service_id: str
    provider: str
    current_model: str
    projected_monthly_cost_usd: float
    candidates: list[CostSimulationCandidateResponse]


class InterventionMethodologyResponse(BaseModel):
    category: str
    threshold_condition: str
    rule_condition: str


class InterventionResponse(BaseModel):
    intervention_id: str
    title: str
    intervention_type: str
    team: str
    detail: str
    savings_usd_month: float
    confidence_pct: float
    risk: str
    equivalence_mode: str
    equivalence_status: str
    status: str
    methodology: InterventionMethodologyResponse
    updated_at: str
    updated_by: str
    update_note: str


class InterventionSummaryResponse(BaseModel):
    total_count: int
    recommended_count: int
    review_count: int
    approved_count: int
    implemented_count: int
    dismissed_count: int
    total_potential_usd: float
    captured_savings_usd: float
    open_potential_usd: float


class InterventionListResponse(BaseModel):
    summary: InterventionSummaryResponse
    interventions: list[InterventionResponse]


class InterventionTransitionRequest(BaseModel):
    status: Literal["recommended", "review", "approved", "implemented", "dismissed"]
    actor: str = "api"
    note: str = ""


class InterventionHistoryEntryResponse(BaseModel):
    from_status: str
    to_status: str
    actor: str
    note: str
    changed_at: str


class NotificationRequest(BaseModel):
    event_type: str
    title: str
    detail: str
    severity: str = "info"
    channels: list[str]
    slack_webhook_url: str = ""
    webhook_url: str = ""
    email_to: list[str] = Field(default_factory=list)
    metadata: dict[str, str] = Field(default_factory=dict)


class NotificationDeliveryResponse(BaseModel):
    delivery_id: str
    channel: str
    target: str
    status: str
    message: str
    sent_at: str
    event_type: str = ""
    severity: str = ""
    route_id: str = ""
    route_name: str = ""
    workflow_name: str = ""
    audience: str = ""
    business_outcome: str = ""
    scenario_id: str = ""


class IntegrationSourceResponse(BaseModel):
    integration_id: str
    name: str
    category: str
    direction: str
    status: str
    system: str
    owner: str
    business_value: str
    primary_signals: list[str]
    downstream_consumers: list[str]


class IntegrationRouteChannelResponse(BaseModel):
    channel: str
    target: str
    purpose: str
    fallback: bool
    live_capable: bool


class IntegrationRouteResponse(BaseModel):
    route_id: str
    name: str
    workflow_name: str
    owner: str
    trigger: str
    expected_action: str
    business_outcome: str
    sla_target: str
    channels: list[IntegrationRouteChannelResponse]


class IntegrationScenarioResponse(BaseModel):
    scenario_id: str
    title: str
    description: str
    route_id: str
    business_question: str
    expected_outcome: str


class IntegrationSummaryResponse(BaseModel):
    inbound_source_count: int
    outbound_route_count: int
    scenario_count: int
    configured_destination_count: int
    recent_delivery_count: int
    success_rate_pct: float
    failed_deliveries: int
    live_delivery_mode: str
    last_delivery_at: str = ""


class IntegrationOverviewResponse(BaseModel):
    summary: IntegrationSummaryResponse
    sources: list[IntegrationSourceResponse]
    routes: list[IntegrationRouteResponse]
    scenarios: list[IntegrationScenarioResponse]
    recent_deliveries: list[NotificationDeliveryResponse]


class IntegrationScenarioDispatchResponse(BaseModel):
    scenario_id: str
    scenario_title: str
    route_id: str
    route_name: str
    workflow_name: str
    business_question: str
    expected_outcome: str
    deliveries: list[NotificationDeliveryResponse]


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


def _notification_delivery_response(
    delivery: NotificationDelivery,
) -> NotificationDeliveryResponse:
    return NotificationDeliveryResponse(
        delivery_id=delivery.delivery_id,
        channel=delivery.channel,
        target=delivery.target,
        status=delivery.status,
        message=delivery.message,
        sent_at=delivery.sent_at.isoformat(),
        event_type=getattr(delivery, "event_type", ""),
        severity=getattr(delivery, "severity", ""),
        route_id=getattr(delivery, "route_id", ""),
        route_name=getattr(delivery, "route_name", ""),
        workflow_name=getattr(delivery, "workflow_name", ""),
        audience=getattr(delivery, "audience", ""),
        business_outcome=getattr(delivery, "business_outcome", ""),
        scenario_id=getattr(delivery, "scenario_id", ""),
    )


def _ingest_rate_limit_key(request: Request) -> str:
    """Derive a stable per-caller key for ingestion throttling."""
    app_state = get_state(request.app)
    claims = getattr(request.state, "auth_claims", None)
    if isinstance(claims, dict):
        subject = str(claims.get("sub", "")).strip()
        if subject:
            return f"sub:{subject}"

    forwarded_for = request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
    if forwarded_for and _request_came_from_trusted_proxy(request, app_state):
        return f"ip:{forwarded_for}"

    if request.client and request.client.host:
        return f"ip:{request.client.host}"

    return "anonymous"


def _request_came_from_trusted_proxy(request: Request, app_state: AppState) -> bool:
    trusted_entries = [
        item.strip()
        for item in app_state.config.api_trusted_proxy_cidrs.split(",")
        if item.strip()
    ]
    if not trusted_entries or request.client is None:
        return False

    try:
        client_ip = ip_address(request.client.host)
    except ValueError:
        return False

    for entry in trusted_entries:
        try:
            if client_ip in ip_network(entry, strict=False):
                return True
        except ValueError:
            logger.warning("proxy_config.invalid_cidr", cidr=entry)
    return False


def _extract_aci_headers(request: Request) -> dict[str, str]:
    """Extract ACI namespaced headers from incoming HTTP request."""
    return {
        key: value
        for key, value in request.headers.items()
        if key.lower().startswith("x-aci-")
    }


def _request_correlation_id(request: Request) -> str:
    correlation_id = getattr(request.state, "correlation_id", "")
    return str(correlation_id).strip()


def _coerce_metric_float(value: object, default: float = 0.0) -> float:
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return default
    return default


def _to_adoption_summary_response(summary: AdoptionSummary) -> AdoptionSummaryResponse:
    return AdoptionSummaryResponse(
        eligible_employees=summary.eligible_employees,
        active_employees_7d=summary.active_employees_7d,
        active_employees_30d=summary.active_employees_30d,
        adoption_penetration_pct=summary.adoption_penetration_pct,
        repeat_user_rate_pct=summary.repeat_user_rate_pct,
        power_user_rate_pct=summary.power_user_rate_pct,
        governed_usage_pct=summary.governed_usage_pct,
        intervention_rate_pct=summary.intervention_rate_pct,
        requests_30d=summary.requests_30d,
        spend_30d_usd=summary.spend_30d_usd,
        spend_per_active_employee_usd=summary.spend_per_active_employee_usd,
        requests_per_active_employee=summary.requests_per_active_employee,
        growth_vs_prior_pct=summary.growth_vs_prior_pct,
    )


def _to_adoption_scope_breakdown_response(
    breakdown: AdoptionScopeBreakdown,
) -> AdoptionScopeBreakdownResponse:
    return AdoptionScopeBreakdownResponse(
        scope_type=breakdown.scope_type,
        scope_id=breakdown.scope_id,
        label=breakdown.label,
        eligible_employees=breakdown.eligible_employees,
        active_employees_30d=breakdown.active_employees_30d,
        adoption_penetration_pct=breakdown.adoption_penetration_pct,
        growth_vs_prior_pct=breakdown.growth_vs_prior_pct,
        requests_30d=breakdown.requests_30d,
        spend_30d_usd=breakdown.spend_30d_usd,
        governed_usage_pct=breakdown.governed_usage_pct,
        top_entry_point=breakdown.top_entry_point,
    )


def _to_adoption_employee_response(
    employee: AdoptionTopEmployee,
) -> AdoptionTopEmployeeResponse:
    return AdoptionTopEmployeeResponse(
        employee_id=employee.employee_id,
        name=employee.name,
        title=employee.title,
        team_name=employee.team_name,
        business_unit_name=employee.business_unit_name,
        requests_30d=employee.requests_30d,
        spend_30d_usd=employee.spend_30d_usd,
        governed_usage_pct=employee.governed_usage_pct,
        last_active_at=employee.last_active_at.isoformat() if employee.last_active_at else None,
        adoption_stage=employee.adoption_stage,
        top_model=employee.top_model,
        top_entry_point=employee.top_entry_point,
    )


def _to_adoption_mix_response(record: AdoptionMixRecord) -> AdoptionMixRecordResponse:
    return AdoptionMixRecordResponse(
        label=record.label,
        requests=record.requests,
        spend_usd=record.spend_usd,
        pct_of_requests=record.pct_of_requests,
    )


def _to_adoption_trend_response(point: AdoptionTrendPoint) -> AdoptionTrendPointResponse:
    return AdoptionTrendPointResponse(
        label=point.label,
        active_employees=point.active_employees,
        requests=point.requests,
        spend_usd=point.spend_usd,
        governed_usage_pct=point.governed_usage_pct,
    )


def _to_adoption_lens_response(
    lens: AdoptionExecutiveLens,
) -> AdoptionExecutiveLensResponse:
    return AdoptionExecutiveLensResponse(
        audience=lens.audience,
        headline=lens.headline,
        detail=lens.detail,
        metric_label=lens.metric_label,
        metric_value=lens.metric_value,
    )


def _to_adoption_dashboard_response(
    dashboard: AdoptionDashboard,
) -> AdoptionDashboardResponse:
    return AdoptionDashboardResponse(
        generated_at=dashboard.generated_at.isoformat(),
        scope_type=dashboard.scope_type,
        scope_id=dashboard.scope_id,
        scope_label=dashboard.scope_label,
        parent_scope_label=dashboard.parent_scope_label,
        window_days=dashboard.window_days,
        summary=_to_adoption_summary_response(dashboard.summary),
        child_scopes=[
            _to_adoption_scope_breakdown_response(item) for item in dashboard.child_scopes
        ],
        top_employees=[_to_adoption_employee_response(item) for item in dashboard.top_employees],
        model_mix=[_to_adoption_mix_response(item) for item in dashboard.model_mix],
        entry_point_mix=[_to_adoption_mix_response(item) for item in dashboard.entry_point_mix],
        trend=[_to_adoption_trend_response(item) for item in dashboard.trend],
        executive_lenses=[_to_adoption_lens_response(item) for item in dashboard.executive_lenses],
    )


def _to_adoption_hierarchy_team_response(
    team: AdoptionHierarchyTeam,
) -> AdoptionHierarchyTeamResponse:
    return AdoptionHierarchyTeamResponse(
        team_id=team.team_id,
        team_name=team.team_name,
        eligible_employees=team.eligible_employees,
    )


def _to_adoption_hierarchy_business_unit_response(
    business_unit: AdoptionHierarchyBusinessUnit,
) -> AdoptionHierarchyBusinessUnitResponse:
    return AdoptionHierarchyBusinessUnitResponse(
        business_unit_id=business_unit.business_unit_id,
        business_unit_name=business_unit.business_unit_name,
        eligible_employees=business_unit.eligible_employees,
        teams=[
            _to_adoption_hierarchy_team_response(team) for team in business_unit.teams
        ],
    )


def _to_adoption_hierarchy_response(
    hierarchy: AdoptionHierarchy,
) -> AdoptionHierarchyResponse:
    organization = hierarchy.organization
    return AdoptionHierarchyResponse(
        organization=AdoptionHierarchyOrganizationResponse(
            organization_id=organization.organization_id,
            organization_name=organization.organization_name,
            eligible_employees=organization.eligible_employees,
            business_units=[
                _to_adoption_hierarchy_business_unit_response(item)
                for item in organization.business_units
            ],
        ),
        default_scope_type=hierarchy.default_scope_type,
        default_scope_id=hierarchy.default_scope_id,
    )


def _normalize_route(route: str) -> str:
    """
    Normalize route strings to bounded template-like keys.

    Raw URLs, query strings, and fragments are collapsed to the logical route
    shape to keep route-cardinality bounded.
    """
    normalized = route.strip()
    if not normalized:
        return ""

    if "://" in normalized:
        normalized = normalized.split("://", 1)[1]
        normalized = "/" + normalized.split("/", 1)[1] if "/" in normalized else "/"

    normalized = normalized.split("?", 1)[0]
    normalized = normalized.split("#", 1)[0]
    return normalized[:128]


def _map_attribution_reason(method_used: str) -> str:
    method = method_used.upper()
    if "MANUAL" in method or "CORRECTION" in method:
        return "MANUAL_OVERRIDE"
    if method.startswith("R1"):
        return "DIRECT_OWNER_MAPPING"
    if method.startswith("R2"):
        return "CI_PROVENANCE_MATCH"
    if method.startswith("R3") or method.startswith("R4") or method.startswith("R5"):
        return "HEURISTIC_MATCH"
    if method.startswith("R6"):
        return "GATEWAY_INHERITANCE"
    return "UNKNOWN"


def _is_production_like(environment: str) -> bool:
    return environment.strip().lower() in {"production", "staging"}


def _demo_event_id_part(value: str) -> str:
    normalized = "".join(
        character.lower() if character.isalnum() else "-"
        for character in value.strip()
    ).strip("-")
    return normalized or "unknown"


def _normalize_scopes(raw_scope: object | None) -> set[str]:
    if raw_scope is None:
        return set()
    if isinstance(raw_scope, str):
        return {item for item in raw_scope.strip().split() if item}
    if isinstance(raw_scope, list):
        return {str(item) for item in raw_scope if str(item)}
    return {str(raw_scope)}


def _require_additional_scope(request: Request, required_scope: str) -> None:
    app_state = get_state(request.app)
    if not required_scope.strip() or not app_state.config.auth.enabled:
        return
    if can_bypass_auth(app_state.config):
        return

    claims = getattr(request.state, "auth_claims", None)
    if not isinstance(claims, dict):
        raise HTTPException(status_code=401, detail="missing auth claims")

    scopes = _normalize_scopes(claims.get("scope"))
    if required_scope not in scopes:
        raise HTTPException(
            status_code=403,
            detail=f"missing required scope '{required_scope}'",
        )


def _to_intervention_response(record: InterventionRecord) -> InterventionResponse:
    """Serialize registry record into API response model."""
    return InterventionResponse(
        intervention_id=record.intervention_id,
        title=record.title,
        intervention_type=record.intervention_type,
        team=record.team,
        detail=record.detail,
        savings_usd_month=record.savings_usd_month,
        confidence_pct=record.confidence_pct,
        risk=record.risk,
        equivalence_mode=record.equivalence_mode,
        equivalence_status=record.equivalence_status,
        status=record.status,
        methodology=InterventionMethodologyResponse(
            category=record.category,
            threshold_condition=record.threshold_condition,
            rule_condition=record.rule_condition,
        ),
        updated_at=record.updated_at.isoformat(),
        updated_by=record.updated_by,
        update_note=record.update_note,
    )


def _to_pricing_rule_response(rule: PricingRule) -> PricingRuleResponse:
    return PricingRuleResponse(
        provider=rule.provider,
        model=rule.model,
        effective_from=rule.effective_from.isoformat(),
        input_usd_per_1k_tokens=rule.input_usd_per_1k_tokens,
        output_usd_per_1k_tokens=rule.output_usd_per_1k_tokens,
        cached_input_usd_per_1k_tokens=rule.cached_input_usd_per_1k_tokens,
        request_base_usd=rule.request_base_usd,
        source=rule.source,
        provenance_ref=rule.provenance_ref,
        updated_by=rule.updated_by,
    )


def _to_intervention_history_response(
    item: InterventionTransition,
) -> InterventionHistoryEntryResponse:
    return InterventionHistoryEntryResponse(
        from_status=item.from_status,
        to_status=item.to_status,
        actor=item.actor,
        note=item.note,
        changed_at=item.changed_at.isoformat(),
    )


def _gate_error_from_result(result: InterceptionResult) -> JSONResponse | None:
    """Map active gate policy violations to explicit HTTP error responses."""
    hard_violations = [
        violation
        for violation in result.policy_results
        if violation.violated
        and violation.policy_id
        in {"token_budget_input", "model_allowlist", "budget_ceiling", "cost_ceiling"}
    ]
    if not hard_violations:
        return None

    primary = hard_violations[0]
    if primary.policy_id == "token_budget_input":
        return JSONResponse(
            status_code=413,
            content={
                "error": {
                    "type": "token_size_exceeded",
                    "message": primary.details,
                    "request_id": result.request_id,
                    "policy_id": primary.policy_id,
                    "retry": False,
                }
            },
        )
    if primary.policy_id == "model_allowlist":
        approved = result.attribution.approved_alternatives if result.attribution else []
        return JSONResponse(
            status_code=403,
            content={
                "error": {
                    "type": "model_not_allowed",
                    "message": primary.details,
                    "request_id": result.request_id,
                    "policy_id": primary.policy_id,
                    "approved_alternatives": approved,
                }
            },
        )
    if primary.policy_id == "budget_ceiling":
        return JSONResponse(
            status_code=429,
            content={
                "error": {
                    "type": "budget_exceeded",
                    "message": primary.details,
                    "request_id": result.request_id,
                    "policy_id": primary.policy_id,
                    "retry_after_seconds": 3600,
                }
            },
        )
    if primary.policy_id == "cost_ceiling":
        approved = result.attribution.approved_alternatives if result.attribution else []
        return JSONResponse(
            status_code=403,
            content={
                "error": {
                    "type": "cost_approval_required",
                    "message": primary.details,
                    "request_id": result.request_id,
                    "policy_id": primary.policy_id,
                    "approved_alternatives": approved,
                }
            },
        )
    return None


@app.get("/", response_model=RootResponse)
async def root(request: Request) -> RootResponse | RedirectResponse:
    """Root metadata and quick links."""
    mockup_url = "/platform/" if frontend_dir.exists() else None
    accepts_html = "text/html" in request.headers.get("accept", "").lower()
    if mockup_url is not None and accepts_html:
        return RedirectResponse(url=mockup_url, status_code=307)

    return RootResponse(
        name="Argmin Platform",
        version="0.3.3",
        health_url="/health",
        mockup_url=mockup_url,
    )


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """Platform summary health check for operators."""
    app_state = get_state()
    checks = app_state.readiness_checks()
    interceptor_stats = app_state.interceptor.stats
    fail_open_alert_level = str(interceptor_stats.get("fail_open_alert_level", "normal"))
    status = (
        "healthy"
        if all(checks.values()) and fail_open_alert_level == "normal"
        else "degraded"
    )
    return HealthResponse(
        status=status,
        timestamp=datetime.now(UTC).isoformat(),
        index_size=app_state.index_store.size,
        runtime_role=app_state.runtime_role,
        interceptor_mode=app_state.interceptor.mode.value,
        circuit_breaker=app_state.interceptor.circuit_breaker.state,
        fail_open_alert_level=fail_open_alert_level,
        fail_open_window_rate=_coerce_metric_float(
            interceptor_stats.get("fail_open_window_rate", 0.0)
        ),
    )


@app.get("/live", response_model=LivenessResponse)
async def live() -> LivenessResponse:
    """Liveness probe endpoint: process is up and serving requests."""
    return LivenessResponse(
        status="alive",
        timestamp=datetime.now(UTC).isoformat(),
    )


@app.get("/ready", response_model=ReadinessResponse)
async def ready() -> ReadinessResponse:
    """Readiness probe endpoint: required runtime dependencies are available."""
    checks = get_state().readiness_checks()
    if not all(checks.values()):
        raise HTTPException(
            status_code=503,
            detail={
                "status": "not_ready",
                "checks": checks,
            },
        )

    return ReadinessResponse(
        status="ready",
        timestamp=datetime.now(UTC).isoformat(),
        checks=checks,
    )


@app.get("/metrics")
async def metrics() -> dict[str, dict[str, Any]]:
    """Platform metrics for monitoring."""
    app_state = get_state()
    return {
        "index": app_state.index_store.stats,
        "interceptor": app_state.interceptor.stats,
        "processor": app_state.processor.stats,
        "event_bus": app_state.event_bus.stats,
    }


@app.get("/metrics/prometheus")
async def metrics_prometheus() -> Response:
    """Prometheus exposition format metrics endpoint."""
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/v1/events/ingest", response_model=EventIngestResponse)
async def ingest_event(request: Request, req: EventIngestRequest) -> EventIngestResponse:
    """Ingest a single domain event into the append-only bus."""
    app_state = get_state()
    if not app_state.accepts_ingestion:
        raise HTTPException(
            status_code=503, detail="event ingestion disabled for this runtime role"
        )
    if not await app_state.ingest_rate_limiter.allow(_ingest_rate_limit_key(request)):
        raise HTTPException(status_code=429, detail="ingestion rate limit exceeded")

    try:
        attributes = validate_event_attributes(
            req.event_type,
            req.attributes,
            max_depth=app_state.config.api_event_max_json_depth,
            max_keys=app_state.config.api_event_max_json_keys,
        )
    except EventSchemaValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    event = DomainEvent(
        event_type=req.event_type,
        subject_id=req.subject_id,
        attributes=attributes,
        event_time=req.event_time,
        source=req.source,
        idempotency_key=req.idempotency_key,
        tenant_id=app_state.config.tenant_id,
    )
    event_bus = cast("Any", app_state.event_bus)
    accepted = await event_bus.publish(event)
    return EventIngestResponse(accepted=accepted, event_id=event.event_id)


@app.post("/v1/events/ingest/batch", response_model=EventBatchIngestResponse)
async def ingest_events_batch(
    request: Request,
    req: EventBatchIngestRequest,
) -> EventBatchIngestResponse:
    """Ingest a batch of domain events with idempotency-aware accounting."""
    app_state = get_state()
    if not app_state.accepts_ingestion:
        raise HTTPException(
            status_code=503, detail="event ingestion disabled for this runtime role"
        )
    if not await app_state.ingest_rate_limiter.allow(_ingest_rate_limit_key(request)):
        raise HTTPException(status_code=429, detail="ingestion rate limit exceeded")
    if len(req.events) > app_state.ingest_max_batch_size:
        raise HTTPException(
            status_code=413,
            detail=(
                f"batch size {len(req.events)} exceeds configured max "
                f"{app_state.ingest_max_batch_size}"
            ),
        )

    events: list[DomainEvent] = []
    for e in req.events:
        try:
            attrs = validate_event_attributes(
                e.event_type,
                e.attributes,
                max_depth=app_state.config.api_event_max_json_depth,
                max_keys=app_state.config.api_event_max_json_keys,
            )
        except EventSchemaValidationError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

        events.append(
            DomainEvent(
                event_type=e.event_type,
                subject_id=e.subject_id,
                attributes=attrs,
                event_time=e.event_time,
                source=e.source,
                idempotency_key=e.idempotency_key,
                tenant_id=app_state.config.tenant_id,
            )
        )
    event_bus = cast("Any", app_state.event_bus)
    result = await event_bus.publish_batch(events)
    return EventBatchIngestResponse(
        total=len(events),
        accepted=result["published"],
        deduplicated=result["deduplicated"],
    )


@app.post("/v1/demo/bootstrap", response_model=DemoBootstrapResponse)
async def bootstrap_demo() -> DemoBootstrapResponse:
    """
    Seed deterministic demo index entries for reviewer walkthroughs.

    This endpoint is intentionally disabled in production/staging.
    """
    app_state = get_state()
    if _is_production_like(app_state.config.environment):
        raise HTTPException(
            status_code=403,
            detail="demo bootstrap endpoint is disabled in production/staging",
        )

    result = await bootstrap_demo_state(app_state, reset_existing=True)
    return _demo_bootstrap_response(result, app_state)


@app.post("/v1/demo/reset", response_model=DemoBootstrapResponse)
async def reset_demo() -> DemoBootstrapResponse:
    """
    Restore the local demo to its known baseline state.

    This endpoint is intentionally disabled in production/staging.
    """
    app_state = get_state()
    if _is_production_like(app_state.config.environment):
        raise HTTPException(
            status_code=403,
            detail="demo reset endpoint is disabled in production/staging",
        )

    result = await bootstrap_demo_state(app_state, reset_existing=True)
    if app_state.accepts_interception:
        app_state.interceptor.mode = DeploymentMode.ADVISORY
    return _demo_bootstrap_response(result, app_state)


def _demo_bootstrap_response(
    result: DemoBootstrapResult,
    app_state: AppState,
) -> DemoBootstrapResponse:
    return DemoBootstrapResponse(
        seeded_entries=result.seeded_entries,
        workloads=result.workloads,
        events_published=result.events_published,
        graph_nodes=result.graph_nodes,
        graph_edges=result.graph_edges,
        reference_time=result.reference_time,
        scenario_ids=result.scenario_ids,
        demo_accounts=result.demo_accounts,
        reset_token="argmin-demo-baseline-v1",
        interceptor_mode=app_state.interceptor.mode.value,
        environment=app_state.config.environment,
    )


@app.post("/v1/demo/mode", response_model=DemoModeResponse)
async def set_demo_mode(req: DemoModeRequest) -> DemoModeResponse:
    """Update interceptor mode for local/demo walkthroughs."""
    app_state = get_state()
    if _is_production_like(app_state.config.environment):
        raise HTTPException(
            status_code=403,
            detail="demo mode switching is disabled in production/staging",
        )
    if not app_state.accepts_interception:
        raise HTTPException(status_code=503, detail="interceptor disabled for this runtime role")

    app_state.interceptor.mode = DeploymentMode(req.mode)
    return DemoModeResponse(
        interceptor_mode=app_state.interceptor.mode.value,
        environment=app_state.config.environment,
    )


@app.post("/v1/intercept", response_model=InterceptResponse)
async def intercept(request: Request, req: InterceptRequest) -> InterceptResponse | JSONResponse:
    """
    Decision-time interception endpoint with framework-level timeout.

    Defense-in-depth: the interceptor enforces its own 20ms enrichment budget
    internally. This outer wrapper enforces the 50ms total budget at the
    framework level, catching event-loop contention that the internal timer
    cannot detect. On timeout, the request proceeds unmodified (fail-open).
    """
    app_state = get_state()
    if not app_state.accepts_interception:
        raise HTTPException(status_code=503, detail="interceptor disabled for this runtime role")

    aci_headers = _extract_aci_headers(request)
    header_lookup = {key.lower(): value for key, value in aci_headers.items()}
    service_name = req.service_name or header_lookup.get("x-aci-service-id", "")
    route_value = req.route or header_lookup.get("x-aci-route", "")
    route_key = app_state.resolve_route_key(route_value, service_name)

    interception_req = InterceptionRequest(
        request_id=req.request_id,
        model=req.model,
        provider=req.provider,
        service_name=service_name,
        workload_id=req.workload_id or header_lookup.get("x-aci-workload-id", ""),
        api_key_id=req.api_key_id,
        input_tokens=req.input_tokens,
        estimated_cost_usd=req.estimated_cost_usd,
        headers=aci_headers,
        metadata={
            "environment": req.environment or header_lookup.get("x-aci-env", ""),
            "route": route_key,
            "tenant_id": header_lookup.get("x-aci-tenant-id", ""),
            "correlation_id": _request_correlation_id(request),
            "max_tokens": req.max_tokens,
            "response_format_type": req.response_format_type,
            "tools_present": req.tools_present,
            "strict_json_schema": req.strict_json_schema,
            "price_snapshot_id": app_state.pricing.snapshot_id,
        },
    )

    try:
        interceptor = cast("Any", app_state.interceptor)
        result = await asyncio.wait_for(
            interceptor.intercept(interception_req),
            timeout=app_state.config.interceptor.total_budget_ms / 1000.0,
        )
    except TimeoutError:
        return InterceptResponse(
            request_id=req.request_id,
            outcome=InterceptionOutcome.TIMEOUT.value,
            elapsed_ms=float(app_state.config.interceptor.total_budget_ms),
            enrichment_headers={
                "X-ACI-Fail-Open": "true",
                "X-ACI-Fail-Open-Reason": "LOOKUP_TIMEOUT",
            },
            redirect_model=None,
            attribution_team=None,
            attribution_confidence=None,
        )

    if result.outcome == InterceptionOutcome.HARD_STOPPED:
        gate_error = _gate_error_from_result(result)
        if gate_error is not None:
            return gate_error

    return InterceptResponse(
        request_id=result.request_id,
        outcome=result.outcome.value,
        elapsed_ms=result.elapsed_ms,
        enrichment_headers=result.enrichment_headers,
        redirect_model=result.redirect_model,
        attribution_team=(result.attribution.team_name if result.attribution else None),
        attribution_confidence=(result.attribution.confidence if result.attribution else None),
    )


@app.post("/v1/policy/evaluate", response_model=PolicyEvaluateResponse)
async def policy_evaluate(req: PolicyEvaluateRequest) -> PolicyEvaluateResponse:
    """
    Administrative/test policy evaluation endpoint.

    Hot-path evaluations remain in-process inside the interceptor.
    """
    try:
        context = {
            "model": req.model_requested,
            "confidence": float(req.attribution.get("confidence", 1.0)),
            "current_spend_usd": float(req.signals.est_cost_usd),
            "daily_cost_usd": float(req.signals.est_cost_usd),
            "has_cicd_linkage": bool(req.attribution.get("has_cicd_linkage", True)),
        }
        results = get_state().policy_engine.evaluate_all(context)
    except Exception:
        return PolicyEvaluateResponse(
            decision="PASS_THROUGH",
            advisories=[],
            actions=[],
            fail_open=True,
        )

    advisories = [
        PolicyAdvisoryResponse(code=result.policy_id, detail=result.details)
        for result in results
        if result.violated
    ]
    actions: list[PolicyActionResponse] = []

    active_lite_mode = req.mode.strip().upper() == "ACTIVE_LITE"
    if active_lite_mode and req.service_policy.active_lite_enabled:
        for advisory in advisories:
            actions.append(
                PolicyActionResponse(
                    type=advisory.code.upper(),
                    confidence=float(req.attribution.get("confidence", 0.0)),
                    delta=advisory.detail[:256],
                )
            )

    if actions:
        decision = "APPLY"
    elif advisories:
        decision = "ADVISORY"
    else:
        decision = "PASS_THROUGH"

    return PolicyEvaluateResponse(
        decision=decision,
        advisories=advisories,
        actions=actions,
        fail_open=False,
    )


@app.post("/v1/trac", response_model=TRACResponse)
async def compute_trac(req: TRACRequest) -> TRACResponse:
    """Compute TRAC for a workload."""
    result = get_state().trac.compute(
        workload_id=req.workload_id,
        billed_cost_usd=req.billed_cost_usd,
        emissions_kg_co2e=req.emissions_kg_co2e,
        attribution_confidence=req.attribution_confidence,
        signal_age_days=req.signal_age_days,
    )
    return TRACResponse(
        workload_id=result.workload_id,
        trac_usd=result.trac_usd,
        billed_cost_usd=result.billed_cost_usd,
        carbon_liability_usd=result.carbon_liability_usd,
        confidence_risk_premium_usd=result.confidence_risk_premium_usd,
        carbon_pct_of_trac=result.carbon_pct_of_trac,
        risk_pct_of_trac=result.risk_pct_of_trac,
    )


@app.post("/v1/attribution/manual", response_model=ManualAttributionResponse)
async def submit_manual_attribution(
    req: ManualAttributionRequest,
    request: Request,
) -> ManualAttributionResponse:
    """Apply a manual attribution correction and emit a correction event."""
    app_state = get_state(request.app)
    current = app_state.index_store.lookup(req.workload_id)
    if current is None:
        raise HTTPException(status_code=404, detail="Workload not found in attribution index")

    if app_state.config.environment.lower() == "demo":
        event_time = DEMO_REFERENCE_TIME
        correction_event_id = (
            "evt-demo-manual-"
            f"{_demo_event_id_part(req.workload_id)}-"
            f"{_demo_event_id_part(req.true_team_id)}-"
            f"{_demo_event_id_part(req.true_cost_center_id)}"
        )
        idempotency_key = (
            f"manual:{req.workload_id}:{req.true_team_id}:{req.true_cost_center_id}"
        )
    else:
        event_time = datetime.now(UTC)
        correction_event_id = str(uuid4())
        idempotency_key = f"manual:{req.workload_id}:{uuid4()}"

    correction_event = DomainEvent(
        event_id=correction_event_id,
        event_type=EventType.ATTRIBUTION_CORRECTION,
        subject_id=req.workload_id,
        attributes={
            "attribution_id": req.workload_id,
            "true_team_id": req.true_team_id,
            "true_cost_center_id": req.true_cost_center_id,
            "predicted_team_id": current.team_id,
            "predicted_confidence": current.confidence,
            "method_used": current.method_used,
            "was_correct": (
                current.team_id == req.true_team_id
                and current.cost_center_id == req.true_cost_center_id
            ),
        },
        event_time=event_time,
        ingest_time=event_time,
        source="manual_attribution_api",
        idempotency_key=idempotency_key,
        tenant_id=app_state.config.tenant_id,
    )

    await app_state.event_bus.publish(correction_event)

    source_event_ids = list(current.source_event_ids)
    if correction_event.event_id not in source_event_ids:
        source_event_ids.append(correction_event.event_id)

    corrected_entry = current.model_copy(
        update={
            "team_id": req.true_team_id,
            "team_name": req.true_team_name,
            "cost_center_id": req.true_cost_center_id,
            "cost_center_name": req.true_cost_center_name or current.cost_center_name,
            "confidence": 1.0,
            "confidence_tier": "chargeback_ready",
            "method_used": "MANUAL_CORRECTION",
            "source_event_ids": source_event_ids,
        }
    )
    app_state.index_store.materialize(corrected_entry, materialized_at=event_time)

    return ManualAttributionResponse(
        accepted=True,
        event_id=correction_event.event_id,
        workload_id=req.workload_id,
        previous_team_id=current.team_id,
        previous_team_name=current.team_name,
        previous_cost_center_id=current.cost_center_id,
        updated_team_id=corrected_entry.team_id,
        updated_team_name=corrected_entry.team_name,
        updated_cost_center_id=corrected_entry.cost_center_id,
        updated_cost_center_name=corrected_entry.cost_center_name,
        confidence_before=current.confidence,
        confidence_after=corrected_entry.confidence,
        method_used=corrected_entry.method_used,
    )


@app.get("/v1/attribution/{workload_id}", response_model=IndexLookupResponse)
async def get_attribution(workload_id: str) -> IndexLookupResponse:
    """Look up current attribution for a workload."""
    entry = get_state().index_store.lookup(workload_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Workload not found in attribution index")

    return IndexLookupResponse(
        workload_id=entry.workload_id,
        team_id=entry.team_id,
        team_name=entry.team_name,
        cost_center_id=entry.cost_center_id,
        confidence=entry.confidence,
        confidence_tier=entry.confidence_tier,
        method_used=entry.method_used,
        version=entry.version,
    )


@app.get("/v1/index/lookup", response_model=IndexLookupByKeyResponse)
async def index_lookup(key: str) -> IndexLookupByKeyResponse:
    """Low-latency index lookup contract for interceptor callers and diagnostics."""
    entry = get_state().index_store.lookup(key)
    if entry is None:
        raise HTTPException(status_code=404, detail="lookup key not found in attribution index")

    constraints: list[IndexConstraintResponse] = []
    if entry.token_budget_input is not None or entry.token_budget_output is not None:
        constraints.append(IndexConstraintResponse(type="TOKEN_CAP", scope="SERVICE"))
    if entry.model_allowlist:
        constraints.append(IndexConstraintResponse(type="MODEL_ALLOWLIST", scope="SERVICE"))
    if entry.budget_limit_usd is not None:
        constraints.append(IndexConstraintResponse(type="BUDGET_SOFT", scope="TEAM"))
        if entry.budget_remaining_usd is not None and entry.budget_limit_usd > 0:
            utilization = 1.0 - (entry.budget_remaining_usd / entry.budget_limit_usd)
            if utilization >= 1.0:
                constraints.append(IndexConstraintResponse(type="BUDGET_HARD", scope="TEAM"))

    owner_id = entry.team_id or entry.person_id or None
    return IndexLookupByKeyResponse(
        key=key,
        index_version=entry.version,
        attribution=IndexLookupAttributionResponse(
            owner_id=owner_id,
            team_id=entry.team_id or None,
            confidence=entry.confidence,
            reason=_map_attribution_reason(entry.method_used),
            explanation_id=entry.method_used or "unknown",
        ),
        constraints=constraints,
        cache_ttl_ms=60_000,
    )


@app.get("/v1/index/stats")
async def index_stats() -> dict[str, Any]:
    """Attribution index statistics."""
    return get_state().index_store.stats


@app.get("/v1/dashboard/overview", response_model=DashboardOverviewResponse)
async def dashboard_overview() -> DashboardOverviewResponse:
    """Frontend-ready overview metrics for the platform dashboard."""
    app_state = get_state()
    interceptor_stats = app_state.interceptor.stats
    index_stats_payload = app_state.index_store.stats
    event_stats = app_state.event_bus.stats
    adoption_dashboard = app_state.adoption.dashboard(
        scope_type="organization",
        scope_id=None,
        window_days=30,
    )
    intervention_summary = app_state.intervention_registry.summary()
    index_entries = app_state.index_store.snapshot_entries()
    covered_entries = [
        entry for entry in index_entries if entry.team_id.strip() and entry.cost_center_id.strip()
    ]

    hierarchy = app_state.adoption.hierarchy()
    spend_by_team: list[dict[str, Any]] = []
    for business_unit in hierarchy.organization.business_units:
        for team in business_unit.teams:
            team_dashboard = app_state.adoption.dashboard(
                scope_type="team",
                scope_id=team.team_id,
                window_days=30,
            )
            spend_by_team.append(
                {
                    "team_id": team.team_id,
                    "team_name": team.team_name,
                    "spend_30d_usd": round(team_dashboard.summary.spend_30d_usd, 2),
                    "requests_30d": team_dashboard.summary.requests_30d,
                    "active_employees_30d": team_dashboard.summary.active_employees_30d,
                }
            )
    spend_by_team.sort(key=lambda item: float(item["spend_30d_usd"]), reverse=True)

    return DashboardOverviewResponse(
        tenant_id=app_state.config.tenant_id,
        environment=app_state.config.environment,
        runtime_role=app_state.runtime_role,
        generated_at=datetime.now(UTC).isoformat(),
        total_ai_spend_usd=round(adoption_dashboard.summary.spend_30d_usd, 2),
        attribution_coverage_pct=round(
            (len(covered_entries) / len(index_entries) * 100.0) if index_entries else 0.0,
            2,
        ),
        optimization_potential_usd=round(intervention_summary.open_potential_usd, 2),
        savings_captured_usd=round(intervention_summary.captured_savings_usd, 2),
        spend_by_team=spend_by_team[:6],
        spend_by_model=[
            {
                "label": item.label,
                "requests": item.requests,
                "spend_30d_usd": round(item.spend_usd, 2),
                "pct_of_requests": item.pct_of_requests,
            }
            for item in adoption_dashboard.model_mix
        ],
        spend_trend=[
            {
                "label": item.label,
                "active_employees": item.active_employees,
                "requests": item.requests,
                "spend_30d_usd": round(item.spend_usd, 2),
                "governed_usage_pct": item.governed_usage_pct,
            }
            for item in adoption_dashboard.trend
        ],
        index_size=index_stats_payload.get("size", 0),
        index_hit_rate=index_stats_payload.get("hit_rate", 0.0),
        interceptor_requests=interceptor_stats.get("total_requests", 0),
        interceptor_enriched=interceptor_stats.get("total_enriched", 0),
        interceptor_fail_open=interceptor_stats.get("total_fail_open", 0),
        interceptor_cache_misses=interceptor_stats.get("total_cache_misses", 0),
        interceptor_mode=interceptor_stats.get("mode", "advisory"),
        circuit_breaker_state=interceptor_stats.get("circuit_breaker_state", "closed"),
        fail_open_alert_level=str(interceptor_stats.get("fail_open_alert_level", "normal")),
        fail_open_window_rate=_coerce_metric_float(
            interceptor_stats.get("fail_open_window_rate", 0.0)
        ),
        events_published=event_stats.get("published", 0),
    )


@app.get("/v1/adoption/hierarchy", response_model=AdoptionHierarchyResponse)
async def adoption_hierarchy() -> AdoptionHierarchyResponse:
    """Return the employee-adoption hierarchy used for org/BU/team drill-down."""
    return _to_adoption_hierarchy_response(get_state().adoption.hierarchy())


@app.get("/v1/adoption/dashboard", response_model=AdoptionDashboardResponse)
async def adoption_dashboard(
    scope: Literal["organization", "business_unit", "team"] = "organization",
    scope_id: str | None = None,
    window_days: int = 30,
) -> AdoptionDashboardResponse:
    """Return executive-ready employee AI adoption metrics for the selected scope."""
    try:
        dashboard = get_state().adoption.dashboard(
            scope_type=scope,
            scope_id=scope_id,
            window_days=window_days,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return _to_adoption_dashboard_response(dashboard)


@app.get("/v1/pricing/catalog", response_model=list[PricingRuleResponse])
async def pricing_catalog(
    provider: str | None = None,
    model: str | None = None,
) -> list[PricingRuleResponse]:
    """List versioned pricing rules used by synthetic and simulation flows."""
    rules = get_state().pricing.list_rules(provider=provider, model=model)
    return [_to_pricing_rule_response(rule) for rule in rules]


@app.post("/v1/pricing/catalog", response_model=PricingRuleResponse)
async def create_pricing_rule(
    request: Request,
    req: PricingRuleCreateRequest,
) -> PricingRuleResponse:
    """Register a new pricing rule without redeploying the service."""
    _require_additional_scope(request, get_state(request.app).config.auth.pricing_write_scope)

    if req.input_usd_per_1k_tokens < 0 or req.output_usd_per_1k_tokens < 0:
        raise HTTPException(status_code=422, detail="token pricing rates must be non-negative")
    if req.cached_input_usd_per_1k_tokens is not None and req.cached_input_usd_per_1k_tokens < 0:
        raise HTTPException(
            status_code=422,
            detail="cached input pricing rate must be non-negative",
        )
    if req.request_base_usd < 0:
        raise HTTPException(status_code=422, detail="request_base_usd must be non-negative")

    rule = PricingRule(
        provider=req.provider,
        model=req.model,
        effective_from=req.effective_from,
        input_usd_per_1k_tokens=req.input_usd_per_1k_tokens,
        output_usd_per_1k_tokens=req.output_usd_per_1k_tokens,
        cached_input_usd_per_1k_tokens=req.cached_input_usd_per_1k_tokens,
        request_base_usd=req.request_base_usd,
        source=req.source,
        provenance_ref=req.provenance_ref,
        updated_by=req.updated_by,
    )
    app_state = get_state(request.app)
    app_state.pricing.register_rule(rule)
    normalized = next(
        candidate
        for candidate in app_state.pricing.list_rules(provider=req.provider, model=req.model)
        if candidate.effective_from == rule.effective_from
        and candidate.provider == rule.provider.strip().lower()
        and candidate.model == rule.model.strip()
    )
    return _to_pricing_rule_response(normalized)


@app.post("/v1/pricing/estimate", response_model=PricingEstimateResponse)
async def pricing_estimate(req: PricingEstimateRequest) -> PricingEstimateResponse:
    """Estimate request costs from usage + versioned pricing (FR-110/111)."""
    usage = PricingUsage(
        provider=req.provider,
        model=req.model,
        input_tokens=req.input_tokens,
        output_tokens=req.output_tokens,
        cache_read_input_tokens=req.cache_read_input_tokens,
        request_count=req.request_count,
        effective_at=req.effective_at,
    )
    try:
        estimate = get_state().pricing.estimate(usage)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return PricingEstimateResponse(
        provider=estimate.provider,
        model=estimate.model,
        request_count=estimate.request_count,
        rule_effective_from=estimate.rule_effective_from.isoformat(),
        input_cost_usd=estimate.input_cost_usd,
        cached_input_cost_usd=estimate.cached_input_cost_usd,
        output_cost_usd=estimate.output_cost_usd,
        request_base_cost_usd=estimate.request_base_cost_usd,
        total_cost_usd=estimate.total_cost_usd,
    )


@app.post("/v1/finops/synthetic", response_model=SyntheticCostIngestResponse)
async def finops_synthetic_cost(req: SyntheticCostIngestRequest) -> SyntheticCostIngestResponse:
    """
    Record real-time synthetic cost for a request (FR-111).

    If synthetic_cost_usd is omitted, compute deterministically from pricing rules.
    """
    app_state = get_state()
    synthetic_cost = req.synthetic_cost_usd
    if synthetic_cost is None:
        usage = PricingUsage(
            provider=req.provider,
            model=req.model,
            input_tokens=req.input_tokens,
            output_tokens=req.output_tokens,
            cache_read_input_tokens=req.cache_read_input_tokens,
            request_count=1,
            effective_at=req.recorded_at,
        )
        try:
            synthetic_cost = app_state.pricing.estimate(usage).total_cost_usd
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

    record = app_state.reconciliation.upsert_synthetic(
        request_id=req.request_id,
        service_name=req.service_name,
        provider=req.provider,
        model=req.model,
        synthetic_cost_usd=synthetic_cost,
        recorded_at=req.recorded_at,
    )
    return SyntheticCostIngestResponse(
        request_id=record.request_id,
        synthetic_cost_usd=record.synthetic_cost_usd,
        provider=record.provider,
        model=record.model,
        recorded_at=record.synthetic_recorded_at.isoformat(),
        reconciled=record.is_reconciled,
    )


@app.post("/v1/finops/reconcile", response_model=CostReconcileResponse)
async def finops_reconcile(req: CostReconcileRequest) -> CostReconcileResponse:
    """Attach billing truth-up cost and expose drift for the request (FR-111/607)."""
    try:
        record = get_state().reconciliation.reconcile(
            request_id=req.request_id,
            reconciled_cost_usd=req.reconciled_cost_usd,
            source=req.source,
            recorded_at=req.recorded_at,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    drift_usd = record.drift_usd or 0.0
    drift_pct = record.drift_pct or 0.0
    return CostReconcileResponse(
        request_id=record.request_id,
        synthetic_cost_usd=record.synthetic_cost_usd,
        reconciled_cost_usd=record.reconciled_cost_usd or 0.0,
        drift_usd=drift_usd,
        drift_pct=drift_pct,
        source=record.reconciliation_source,
    )


@app.get("/v1/finops/drift", response_model=list[DriftSummaryResponse])
async def finops_drift(
    group_by: str = "provider",
    window: Literal["daily", "weekly"] = "daily",
    daily_threshold_pct: float = 3.0,
    weekly_threshold_pct: float = 5.0,
) -> list[DriftSummaryResponse]:
    """Aggregate reconciliation drift and flag investigation thresholds (FR-607)."""
    try:
        summaries = get_state().reconciliation.summarize_drift(group_by=group_by)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    threshold_pct = daily_threshold_pct if window == "daily" else weekly_threshold_pct
    return [
        DriftSummaryResponse(
            group=summary.group,
            total_records=summary.total_records,
            reconciled_records=summary.reconciled_records,
            unresolved_records=summary.unresolved_records,
            synthetic_cost_usd=summary.synthetic_cost_usd,
            reconciled_cost_usd=summary.reconciled_cost_usd,
            absolute_drift_usd=summary.absolute_drift_usd,
            drift_pct=summary.drift_pct,
            window=window,
            threshold_pct=threshold_pct,
            investigation_required=abs(summary.drift_pct) > threshold_pct,
            dashboard_annotation=(
                "unreconciled" if abs(summary.drift_pct) > threshold_pct else "reconciled"
            ),
        )
        for summary in summaries
    ]


@app.post("/v1/forecast/spend", response_model=SpendForecastResponse)
async def forecast_spend(req: SpendForecastRequest) -> SpendForecastResponse:
    """Forecast monthly spend from recent time-series history (FR-408)."""
    try:
        forecast = get_state().forecast.forecast(
            monthly_spend_usd=req.monthly_spend_usd,
            horizon_months=req.horizon_months,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return SpendForecastResponse(
        trend_pct=forecast.trend_pct,
        residual_stddev_usd=forecast.residual_stddev_usd,
        points=[
            SpendForecastPointResponse(
                month_offset=point.month_offset,
                predicted_spend_usd=point.predicted_spend_usd,
                lower_bound_usd=point.lower_bound_usd,
                upper_bound_usd=point.upper_bound_usd,
            )
            for point in forecast.points
        ],
    )


@app.get("/v1/interventions", response_model=InterventionListResponse)
async def list_interventions(status: str | None = None) -> InterventionListResponse:
    """List intervention recommendations and lifecycle summary (FR-502)."""
    normalized_status = status.strip().lower() if status else None
    registry = get_state().intervention_registry

    try:
        records = registry.list_records(status=normalized_status)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    summary = registry.summary()
    return InterventionListResponse(
        summary=InterventionSummaryResponse(
            total_count=summary.total_count,
            recommended_count=summary.recommended_count,
            review_count=summary.review_count,
            approved_count=summary.approved_count,
            implemented_count=summary.implemented_count,
            dismissed_count=summary.dismissed_count,
            total_potential_usd=summary.total_potential_usd,
            captured_savings_usd=summary.captured_savings_usd,
            open_potential_usd=summary.open_potential_usd,
        ),
        interventions=[_to_intervention_response(record) for record in records],
    )


@app.get("/v1/interventions/summary", response_model=InterventionSummaryResponse)
async def intervention_summary() -> InterventionSummaryResponse:
    """Return aggregate intervention lifecycle metrics (FR-404/502)."""
    summary = get_state().intervention_registry.summary()
    return InterventionSummaryResponse(
        total_count=summary.total_count,
        recommended_count=summary.recommended_count,
        review_count=summary.review_count,
        approved_count=summary.approved_count,
        implemented_count=summary.implemented_count,
        dismissed_count=summary.dismissed_count,
        total_potential_usd=summary.total_potential_usd,
        captured_savings_usd=summary.captured_savings_usd,
        open_potential_usd=summary.open_potential_usd,
    )


@app.post("/v1/interventions/{intervention_id}/status", response_model=InterventionResponse)
async def set_intervention_status(
    request: Request,
    intervention_id: str,
    req: InterventionTransitionRequest,
) -> InterventionResponse:
    """Transition intervention lifecycle state with audit metadata (FR-502)."""
    _require_additional_scope(
        request,
        get_state(request.app).config.auth.intervention_write_scope,
    )
    try:
        updated = get_state(request.app).intervention_registry.transition(
            intervention_id=intervention_id,
            next_status=req.status,
            actor=req.actor,
            note=req.note,
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return _to_intervention_response(updated)


@app.get(
    "/v1/interventions/{intervention_id}/history",
    response_model=list[InterventionHistoryEntryResponse],
)
async def intervention_history(
    intervention_id: str,
) -> list[InterventionHistoryEntryResponse]:
    """Return audit history for one intervention lifecycle record."""
    try:
        history = get_state().intervention_registry.get_history(intervention_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return [_to_intervention_history_response(item) for item in history]


@app.post("/v1/interventions/cost-simulate", response_model=CostSimulationResponse)
async def simulate_intervention_cost(req: CostSimulationRequest) -> CostSimulationResponse:
    """Pre-deploy cost simulation for model routing decisions (FR-503/606)."""
    try:
        result = get_state().cost_simulation.simulate(
            service_id=req.service_id,
            provider=req.provider,
            current_model=req.current_model,
            avg_input_tokens=req.avg_input_tokens,
            avg_output_tokens=req.avg_output_tokens,
            requests_per_day=req.requests_per_day,
            candidate_models=req.candidate_models,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return CostSimulationResponse(
        service_id=result.service_id,
        provider=result.provider,
        current_model=result.current_model,
        projected_monthly_cost_usd=result.projected_monthly_cost_usd,
        candidates=[
            CostSimulationCandidateResponse(
                model=candidate.model,
                projected_monthly_cost_usd=candidate.projected_monthly_cost_usd,
                monthly_savings_usd=candidate.monthly_savings_usd,
                savings_pct=candidate.savings_pct,
            )
            for candidate in result.candidates
        ],
    )


@app.post("/v1/integrations/notify", response_model=list[NotificationDeliveryResponse])
async def integrations_notify(
    request: Request,
    req: NotificationRequest,
) -> list[NotificationDeliveryResponse]:
    """Dispatch policy/intervention notifications via Slack/email/webhook (FR-800/801/803)."""
    app_state = get_state(request.app)
    if app_state.notification_hub.live_network:
        _require_additional_scope(
            request,
            app_state.config.auth.notification_live_scope,
        )

    message = NotificationMessage(
        event_type=req.event_type,
        title=req.title,
        detail=req.detail,
        severity=req.severity,
        metadata=req.metadata,
    )
    deliveries = await app_state.notification_hub.send(
        message=message,
        channels=req.channels,
        slack_webhook_url=req.slack_webhook_url,
        webhook_url=req.webhook_url,
        email_to=req.email_to,
    )
    return [_notification_delivery_response(delivery) for delivery in deliveries]


@app.get("/v1/integrations/deliveries", response_model=list[NotificationDeliveryResponse])
async def integrations_deliveries(
    limit: Annotated[int, Query(ge=0, le=100)] = 100,
) -> list[NotificationDeliveryResponse]:
    """Inspect recent notification deliveries for auditability."""
    deliveries = get_state().notification_hub.list_deliveries(limit=limit)
    return [_notification_delivery_response(delivery) for delivery in deliveries]


@app.get("/v1/integrations/overview", response_model=IntegrationOverviewResponse)
async def integrations_overview(
    limit: Annotated[int, Query(ge=0, le=100)] = 12,
) -> IntegrationOverviewResponse:
    """Summarize inbound coverage and outbound operational handoffs."""
    app_state = get_state()
    hub = app_state.notification_hub
    sources = default_integration_sources()
    routes = hub.list_routes()
    scenarios = hub.list_scenarios()
    summary = hub.summary()
    recent_deliveries = hub.list_deliveries(limit=limit)
    return IntegrationOverviewResponse(
        summary=IntegrationSummaryResponse(
            inbound_source_count=len([item for item in sources if item.direction == "inbound"]),
            outbound_route_count=int(summary["active_routes"]),
            scenario_count=int(summary["scenario_count"]),
            configured_destination_count=int(summary["configured_destinations"]),
            recent_delivery_count=int(summary["recent_delivery_count"]),
            success_rate_pct=float(summary["success_rate_pct"]),
            failed_deliveries=int(summary["failed_deliveries"]),
            live_delivery_mode="live" if summary["live_network_enabled"] else "simulated",
            last_delivery_at=str(summary["last_delivery_at"]),
        ),
        sources=[
            IntegrationSourceResponse(
                integration_id=item.integration_id,
                name=item.name,
                category=item.category,
                direction=item.direction,
                status=item.status,
                system=item.system,
                owner=item.owner,
                business_value=item.business_value,
                primary_signals=list(item.primary_signals),
                downstream_consumers=list(item.downstream_consumers),
            )
            for item in sources
        ],
        routes=[
            IntegrationRouteResponse(
                route_id=route.route_id,
                name=route.name,
                workflow_name=route.workflow_name,
                owner=route.owner,
                trigger=route.trigger,
                expected_action=route.expected_action,
                business_outcome=route.business_outcome,
                sla_target=route.sla_target,
                channels=[
                    IntegrationRouteChannelResponse(
                        channel=channel.channel,
                        target=channel.target,
                        purpose=channel.purpose,
                        fallback=channel.fallback,
                        live_capable=channel.live_capable,
                    )
                    for channel in route.channels
                ],
            )
            for route in routes
        ],
        scenarios=[
            IntegrationScenarioResponse(
                scenario_id=scenario.scenario_id,
                title=scenario.title,
                description=scenario.description,
                route_id=scenario.route_id,
                business_question=scenario.business_question,
                expected_outcome=scenario.expected_outcome,
            )
            for scenario in scenarios
        ],
        recent_deliveries=[
            _notification_delivery_response(delivery) for delivery in recent_deliveries
        ],
    )


@app.post(
    "/v1/integrations/scenarios/{scenario_id}/dispatch",
    response_model=IntegrationScenarioDispatchResponse,
)
async def integrations_dispatch_scenario(scenario_id: str) -> IntegrationScenarioDispatchResponse:
    """Run a business workflow scenario through the outbound integration layer."""
    try:
        scenario, route, deliveries = await get_state().notification_hub.dispatch_scenario(
            scenario_id
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return IntegrationScenarioDispatchResponse(
        scenario_id=scenario.scenario_id,
        scenario_title=scenario.title,
        route_id=route.route_id,
        route_name=route.name,
        workflow_name=route.workflow_name,
        business_question=scenario.business_question,
        expected_outcome=scenario.expected_outcome,
        deliveries=[_notification_delivery_response(delivery) for delivery in deliveries],
    )
