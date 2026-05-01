"""Local-friendly notification delivery hub for Slack/email/webhooks."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from datetime import UTC, datetime
from ipaddress import ip_address
from threading import Lock
from typing import Protocol
from urllib.parse import urlparse

import httpx
import structlog
from prometheus_client import Counter

from aci.integrations.catalog import (
    IntegrationRoute,
    IntegrationScenario,
    default_integration_routes,
    default_integration_scenarios,
)

logger = structlog.get_logger()

NOTIFICATION_DELIVERY_TOTAL = Counter(
    "aci_notification_delivery_total",
    "Notification delivery attempts by channel and status.",
    ["channel", "status"],
)
SUPPORTED_CHANNELS = {"email", "slack", "webhook"}


class SupportsAsyncHTTPClient(Protocol):
    async def post(
        self,
        url: str,
        *,
        json: dict[str, object],
        headers: dict[str, str],
        timeout: float,
        follow_redirects: bool,
    ) -> httpx.Response: ...

    async def aclose(self) -> None: ...


@dataclass(frozen=True)
class NotificationMessage:
    """Notification payload independent of channel transport."""

    event_type: str
    title: str
    detail: str
    severity: str = "info"
    metadata: dict[str, str] = field(default_factory=dict)


@dataclass(frozen=True)
class NotificationDelivery:
    """One delivery attempt result."""

    delivery_id: str
    channel: str
    target: str
    status: str
    message: str
    sent_at: datetime
    event_type: str = ""
    severity: str = ""
    route_id: str = ""
    route_name: str = ""
    workflow_name: str = ""
    audience: str = ""
    business_outcome: str = ""
    scenario_id: str = ""


class NotificationHub:
    """Dispatch notifications to Slack/email/webhooks with simulate/live modes."""

    def __init__(
        self,
        *,
        live_network: bool = False,
        timeout_seconds: float = 2.0,
        retry_attempts: int = 2,
        retry_backoff_seconds: float = 0.25,
        webhook_allowlist: list[str] | None = None,
        allow_private_targets: bool = False,
        history_max_entries: int = 1000,
        http_client: SupportsAsyncHTTPClient | None = None,
        routes: list[IntegrationRoute] | None = None,
        scenarios: list[IntegrationScenario] | None = None,
    ) -> None:
        self.live_network = live_network
        self.timeout_seconds = timeout_seconds
        self.retry_attempts = retry_attempts
        self.retry_backoff_seconds = retry_backoff_seconds
        self.webhook_allowlist = [
            item.strip().lower()
            for item in webhook_allowlist or []
            if item.strip()
        ]
        self.allow_private_targets = allow_private_targets
        self.history_max_entries = history_max_entries
        self._deliveries: list[NotificationDelivery] = []
        self._lock = Lock()
        self._http_client = http_client
        self._routes = {
            route.route_id: route for route in (routes or default_integration_routes())
        }
        self._scenarios = {
            scenario.scenario_id: scenario
            for scenario in (scenarios or default_integration_scenarios())
        }

    async def send(
        self,
        *,
        message: NotificationMessage,
        channels: list[str],
        slack_webhook_url: str = "",
        webhook_url: str = "",
        email_to: list[str] | None = None,
        route_id: str = "",
        route_name: str = "",
        workflow_name: str = "",
        audience: str = "",
        business_outcome: str = "",
        scenario_id: str = "",
    ) -> list[NotificationDelivery]:
        """Dispatch one message across the selected channels."""
        dispatched: list[NotificationDelivery] = []
        email_targets = email_to or []
        normalized_channels = [channel.strip().lower() for channel in channels if channel.strip()]
        timestamp = datetime.now(UTC)

        async_tasks: list[asyncio.Task[NotificationDelivery]] = []

        if not normalized_channels:
            dispatched.append(
                self._record(
                    channel="unknown",
                    target="notification://missing-channel",
                    status="failed",
                    message="at least one notification channel is required",
                    timestamp=timestamp,
                    event_type=message.event_type,
                    severity=message.severity,
                    route_id=route_id,
                    route_name=route_name,
                    workflow_name=workflow_name,
                    audience=audience,
                    business_outcome=business_outcome,
                    scenario_id=scenario_id,
                )
            )
            return dispatched

        for channel in normalized_channels:
            if channel == "slack":
                target = slack_webhook_url.strip() or "slack://simulated"
                async_tasks.append(
                    asyncio.create_task(
                        self._deliver_async(
                            channel="slack",
                            target=target,
                            body=self._slack_body(message),
                            timestamp=timestamp,
                            message_context={
                                "event_type": message.event_type,
                                "severity": message.severity,
                                "route_id": route_id,
                                "route_name": route_name,
                                "workflow_name": workflow_name,
                                "audience": audience,
                                "business_outcome": business_outcome,
                                "scenario_id": scenario_id,
                            },
                        )
                    )
                )
            elif channel == "webhook":
                target = webhook_url.strip() or "webhook://simulated"
                async_tasks.append(
                    asyncio.create_task(
                        self._deliver_async(
                            channel="webhook",
                            target=target,
                            body=self._webhook_body(message),
                            timestamp=timestamp,
                            message_context={
                                "event_type": message.event_type,
                                "severity": message.severity,
                                "route_id": route_id,
                                "route_name": route_name,
                                "workflow_name": workflow_name,
                                "audience": audience,
                                "business_outcome": business_outcome,
                                "scenario_id": scenario_id,
                            },
                        )
                    )
                )
            elif channel == "email":
                if not email_targets:
                    dispatched.append(
                        self._record(
                            channel="email",
                            target="email://missing-recipient",
                            status="failed",
                            message="email_to must contain at least one recipient",
                            timestamp=timestamp,
                            event_type=message.event_type,
                            severity=message.severity,
                            route_id=route_id,
                            route_name=route_name,
                            workflow_name=workflow_name,
                            audience=audience,
                            business_outcome=business_outcome,
                            scenario_id=scenario_id,
                        )
                    )
                    continue
                for recipient in email_targets:
                    dispatched.append(
                        self._record(
                            channel="email",
                            target=recipient,
                            status="simulated",
                            message=(
                                f"[{message.severity.upper()}] "
                                f"{message.title}: {message.detail}"
                            ),
                            timestamp=timestamp,
                            event_type=message.event_type,
                            severity=message.severity,
                            route_id=route_id,
                            route_name=route_name,
                            workflow_name=workflow_name,
                            audience=audience,
                            business_outcome=business_outcome,
                            scenario_id=scenario_id,
                        )
                    )
            elif channel not in SUPPORTED_CHANNELS:
                dispatched.append(
                    self._record(
                        channel=channel,
                        target=f"notification://unsupported/{channel}",
                        status="failed",
                        message=f"unsupported notification channel '{channel}'",
                        timestamp=timestamp,
                        event_type=message.event_type,
                        severity=message.severity,
                        route_id=route_id,
                        route_name=route_name,
                        workflow_name=workflow_name,
                        audience=audience,
                        business_outcome=business_outcome,
                        scenario_id=scenario_id,
                    )
                )

        if async_tasks:
            dispatched.extend(await asyncio.gather(*async_tasks))

        return dispatched

    def list_deliveries(self, limit: int = 100) -> list[NotificationDelivery]:
        """Return most recent delivery records."""
        with self._lock:
            if limit <= 0:
                return []
            return list(self._deliveries[-limit:])

    def clear(self) -> None:
        """Clear delivery history."""
        with self._lock:
            self._deliveries.clear()

    def list_routes(self) -> list[IntegrationRoute]:
        """Return the configured outbound operational handoff routes."""
        return list(self._routes.values())

    def list_scenarios(self) -> list[IntegrationScenario]:
        """Return scenario runners available for the UI and API."""
        return list(self._scenarios.values())

    def summary(self) -> dict[str, int | float | bool | str]:
        """Return a small operating summary for the integrations surface."""
        with self._lock:
            deliveries = list(self._deliveries)

        total = len(deliveries)
        sent = sum(1 for item in deliveries if item.status in {"sent", "simulated"})
        failed = sum(1 for item in deliveries if item.status == "failed")
        last_delivery_at = deliveries[-1].sent_at.isoformat() if deliveries else ""
        destinations = {
            channel.target
            for route in self._routes.values()
            for channel in route.channels
        }
        return {
            "active_routes": len(self._routes),
            "scenario_count": len(self._scenarios),
            "configured_destinations": len(destinations),
            "recent_delivery_count": total,
            "success_rate_pct": round((sent / total) * 100, 1) if total else 100.0,
            "failed_deliveries": failed,
            "live_network_enabled": self.live_network,
            "last_delivery_at": last_delivery_at,
        }

    async def dispatch_scenario(
        self,
        scenario_id: str,
    ) -> tuple[IntegrationScenario, IntegrationRoute, list[NotificationDelivery]]:
        """Execute a named business workflow scenario."""
        scenario = self._scenarios.get(scenario_id)
        if scenario is None:
            raise KeyError(f"Unknown integration scenario '{scenario_id}'")
        route = self._routes.get(scenario.route_id)
        if route is None:
            raise KeyError(
                f"Integration scenario '{scenario_id}' references missing route "
                f"'{scenario.route_id}'"
            )

        email_targets = [
            channel.target for channel in route.channels if channel.channel == "email"
        ]
        slack_target = next(
            (channel.target for channel in route.channels if channel.channel == "slack"),
            "",
        )
        webhook_target = next(
            (channel.target for channel in route.channels if channel.channel == "webhook"),
            "",
        )
        deliveries = await self.send(
            message=NotificationMessage(
                event_type=scenario.event_type,
                title=scenario.message_title,
                detail=scenario.message_detail,
                severity=scenario.severity,
                metadata=scenario.metadata,
            ),
            channels=[channel.channel for channel in route.channels],
            slack_webhook_url=slack_target,
            webhook_url=webhook_target,
            email_to=email_targets,
            route_id=route.route_id,
            route_name=route.name,
            workflow_name=route.workflow_name,
            audience=route.owner,
            business_outcome=route.business_outcome,
            scenario_id=scenario.scenario_id,
        )
        return scenario, route, deliveries

    async def aclose(self) -> None:
        """Close any owned HTTP client."""
        if self._http_client is not None:
            await self._http_client.aclose()

    async def _deliver_async(
        self,
        *,
        channel: str,
        target: str,
        body: dict[str, object],
        timestamp: datetime,
        message_context: dict[str, str],
    ) -> NotificationDelivery:
        if not self.live_network or not target.startswith(("http://", "https://")):
            return self._record(
                channel=channel,
                target=target,
                status="simulated",
                message="delivery simulated",
                timestamp=timestamp,
                **message_context,
            )

        validation_error = self._validate_live_target(target)
        if validation_error:
            return self._record(
                channel=channel,
                target=target,
                status="failed",
                message=validation_error,
                timestamp=timestamp,
                **message_context,
            )

        owns_client = False
        client = self._http_client
        if client is None:
            client = httpx.AsyncClient()
            owns_client = True

        try:
            for attempt in range(1, self.retry_attempts + 1):
                try:
                    response = await client.post(
                        target,
                        json=body,
                        headers={"Content-Type": "application/json"},
                        timeout=self.timeout_seconds,
                        follow_redirects=False,
                    )
                    if 200 <= response.status_code < 300:
                        logger.info(
                            "notifications.sent",
                            channel=channel,
                            target=target,
                            status_code=response.status_code,
                        )
                        return self._record(
                            channel=channel,
                            target=target,
                            status="sent",
                            message=f"http_status={response.status_code}",
                            timestamp=timestamp,
                            **message_context,
                        )
                    if attempt < self.retry_attempts and response.status_code in {
                        408,
                        409,
                        425,
                        429,
                        500,
                        502,
                        503,
                        504,
                    }:
                        await asyncio.sleep(self.retry_backoff_seconds * (2 ** (attempt - 1)))
                        continue
                    return self._record(
                        channel=channel,
                        target=target,
                        status="failed",
                        message=f"http_status={response.status_code}",
                        timestamp=timestamp,
                        **message_context,
                    )
                except httpx.HTTPError as exc:
                    logger.warning(
                        "notifications.delivery_failed",
                        channel=channel,
                        target=target,
                        attempt=attempt,
                        error=str(exc),
                    )
                    if attempt < self.retry_attempts:
                        await asyncio.sleep(self.retry_backoff_seconds * (2 ** (attempt - 1)))
                        continue
                    return self._record(
                        channel=channel,
                        target=target,
                        status="failed",
                        message=str(exc),
                        timestamp=timestamp,
                        **message_context,
                    )
        finally:
            if owns_client:
                await client.aclose()

        return self._record(
            channel=channel,
            target=target,
            status="failed",
            message="delivery failed after retries",
            timestamp=timestamp,
            **message_context,
        )

    def _record(
        self,
        *,
        channel: str,
        target: str,
        status: str,
        message: str,
        timestamp: datetime,
        event_type: str = "",
        severity: str = "",
        route_id: str = "",
        route_name: str = "",
        workflow_name: str = "",
        audience: str = "",
        business_outcome: str = "",
        scenario_id: str = "",
    ) -> NotificationDelivery:
        with self._lock:
            delivery_id = (
                f"delivery-{int(timestamp.timestamp() * 1000)}-"
                f"{len(self._deliveries) + 1}"
            )
            delivery = NotificationDelivery(
                delivery_id=delivery_id,
                channel=channel,
                target=target,
                status=status,
                message=message,
                sent_at=timestamp,
                event_type=event_type,
                severity=severity,
                route_id=route_id,
                route_name=route_name,
                workflow_name=workflow_name,
                audience=audience,
                business_outcome=business_outcome,
                scenario_id=scenario_id,
            )
            self._deliveries.append(delivery)
            if len(self._deliveries) > self.history_max_entries:
                self._deliveries = self._deliveries[-self.history_max_entries :]
        NOTIFICATION_DELIVERY_TOTAL.labels(channel=channel, status=status).inc()
        return delivery

    def _validate_live_target(self, target: str) -> str | None:
        parsed = urlparse(target)
        if parsed.scheme.lower() not in {"https", "http"}:
            return "webhook URL must use http or https"
        if not parsed.hostname:
            return "webhook URL must include a hostname"
        if parsed.username or parsed.password:
            return "webhook URL may not include embedded credentials"

        host = parsed.hostname.lower()
        if parsed.scheme.lower() != "https" and not self.allow_private_targets:
            return "live webhook delivery requires https targets"
        if not self.allow_private_targets and host == "localhost":
            return "localhost webhook targets are not permitted"
        try:
            addr = ip_address(host)
        except ValueError:
            addr = None
        if (
            addr is not None
            and not self.allow_private_targets
            and (
                addr.is_private
                or addr.is_loopback
                or addr.is_link_local
                or addr.is_reserved
                or addr.is_multicast
            )
        ):
            return "private or reserved webhook targets are not permitted"

        if self.webhook_allowlist:
            allowed = any(
                host == candidate or host.endswith(f".{candidate.lstrip('.')}")
                for candidate in self.webhook_allowlist
            )
            if not allowed:
                return "webhook hostname is not in the configured allowlist"

        return None

    @staticmethod
    def _slack_body(message: NotificationMessage) -> dict[str, object]:
        return {
            "text": f"[{message.severity.upper()}] {message.title}\n{message.detail}",
            "metadata": message.metadata,
            "event_type": message.event_type,
        }

    @staticmethod
    def _webhook_body(message: NotificationMessage) -> dict[str, object]:
        return {
            "event_type": message.event_type,
            "severity": message.severity,
            "title": message.title,
            "detail": message.detail,
            "metadata": message.metadata,
            "sent_at": datetime.now(UTC).isoformat(),
        }
