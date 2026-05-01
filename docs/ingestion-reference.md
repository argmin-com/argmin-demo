# Ingestion Reference

This document describes the public ingestion contract exposed by the FastAPI service.

## Endpoints

### `POST /v1/events/ingest`

Publishes one validated `DomainEvent` into the append-only event bus.

### `POST /v1/events/ingest/batch`

Publishes a bounded batch of validated `DomainEvent` records and returns publish vs. dedup counts.

## Authentication

Both endpoints live under `/v1/*` and therefore require the standard service token unless the runtime is using the dedicated `demo` profile.

## Request Shape

Each event requires:

- `event_type`
- `subject_id`
- `attributes`
- `event_time`
- `source`
- `idempotency_key`

Example:

```json
{
  "event_type": "inference.request",
  "subject_id": "req-123",
  "attributes": {
    "model": "gpt-4o-mini",
    "provider": "openai",
    "service_name": "customer-support-bot",
    "input_tokens": 420,
    "output_tokens": 128,
    "latency_ms": 93.0,
    "cost_usd": 0.0034
  },
  "event_time": "2026-03-07T19:20:00Z",
  "source": "gateway",
  "idempotency_key": "req-123"
}
```

Batch example:

```json
{
  "events": [
    {
      "event_type": "deployment",
      "subject_id": "deploy-4821",
      "attributes": {
        "service_name": "customer-support-bot",
        "repository": "support-platform",
        "target_environment": "staging",
        "target_resource_arn": "arn:aws:eks:us-east-1:123:cluster/support"
      },
      "event_time": "2026-03-07T19:15:00Z",
      "source": "github-actions",
      "idempotency_key": "gha-4821"
    }
  ]
}
```

## Validation and Guardrails

Events are rejected before entering replayable state when any of the following is violated:

- request body exceeds `ACI_API_MAX_REQUEST_BYTES`
- batch size exceeds `ACI_API_INGEST_MAX_BATCH_SIZE`
- event attributes fail strict per-event-type schema validation
- event JSON exceeds `ACI_API_EVENT_MAX_JSON_DEPTH`
- event JSON exceeds `ACI_API_EVENT_MAX_JSON_KEYS`

Unknown event types are rejected rather than passed through implicitly.

## Idempotency

The durable dedup key is constructed from:

- `tenant_id`
- `source`
- `idempotency_key`

This means retries from the same source can be replayed safely without duplicating downstream graph/index updates.

## Common Error Modes

### `413 request body exceeds configured max ...`

The caller exceeded the request-body limit before payload parsing. Split large batches or reduce payload size.

### `413 batch size ... exceeds configured max ...`

The caller exceeded the logical per-request batch limit. Break the batch into smaller chunks.

### `422 Invalid payload for event_type='...'`

The payload failed strict schema validation for the selected event type.

### `422 Event payload exceeds max depth ...`

The payload is too deeply nested and was rejected before schema validation.

### `422 Event payload exceeds max key count ...`

The payload contains too many object keys and was rejected before schema validation.
