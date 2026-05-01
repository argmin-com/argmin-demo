# Policy Reference

This document defines the decision-time policy controls enforced by the platform.

## Policy Types

### Model Allowlist

- Purpose: restrict a workload to approved models.
- Source field: `model_allowlist`
- Trigger: requested model is not in the approved set.
- Result:
  - `advisory`: enriched response with policy violation details
  - `active`: request may be hard-stopped or rerouted if an approved equivalent exists

### Budget Ceiling

- Purpose: surface workloads that are close to exhausting a team budget.
- Source fields: `budget_remaining_usd`, `budget_limit_usd`
- Trigger: utilization exceeds 90%.
- Result:
  - `advisory`: soft-stop signal
  - `active`: budget-driven gating is only applied when attribution confidence satisfies the active gate threshold

### Token Budget

- Purpose: cap response size and oversized prompt inputs at request time.
- Source fields: `token_budget_output`, `token_budget_input`
- Trigger:
  - output token request exceeds `token_budget_output`
  - input token count exceeds `token_budget_input`
- Result:
  - `token_budget`: soft-stop advisory for oversized responses
  - `token_budget_input`: hard-stop candidate in active mode for oversized prompt payloads

### Cost Ceiling

- Purpose: prevent unapproved per-request spend spikes.
- Source field: `cost_ceiling_per_request_usd`
- Trigger: estimated request cost exceeds the configured ceiling.
- Result:
  - `advisory`: cost approval required
  - `active`: request may be blocked or rerouted to an approved lower-cost equivalent

## Deployment Modes

### Passive

- Records policy evaluation and attribution context.
- Does not emit decision-time enrichment headers.
- Intended for observation and rollout validation.

### Advisory

- Returns `X-ACI-*` enrichment headers to the caller.
- Leaves final request behavior to the upstream application or API gateway.

### Active

- May route to approved alternatives or reject requests.
- Only applies hard controls when attribution confidence meets the active gate threshold.
- Falls back to advisory behavior when confidence is insufficient or the environment is unsuitable for active changes.

## Fail-Open Semantics

The interceptor never blocks inference solely because the attribution/control plane is degraded.

- Cache miss: request proceeds, shadow warming and audit signals are emitted asynchronously.
- Timeout: request proceeds with fail-open headers.
- Circuit open: request proceeds unmodified while the control plane recovers.

The runtime maintains a rolling fail-open alert window. Health and dashboard surfaces expose:

- `fail_open_window_rate`
- `fail_open_alert_level` (`normal`, `warn`, `critical`)

This makes prolonged degraded enforcement visible to operators without violating the availability contract.

## Decision-Time Headers

Headers are intentionally bounded to avoid upstream proxy rejection.

Critical headers are retained even when optional fields are trimmed:

- `X-ACI-Est-Cost-USD`
- `X-ACI-Attribution-Owner-Id`
- `X-ACI-Cost-Center-Id`
- `X-ACI-Attribution-Confidence`
- `X-ACI-Attribution-Reason`
- `X-ACI-Advisory`
- `X-ACI-Intervention-Applied`
- `X-ACI-Intervention-Type`
- `X-ACI-Fail-Open`
- `X-ACI-Fail-Open-Reason`

Optional headers such as budget percentage, advisory detail, and alternative models are trimmed first when the configured header budget is exceeded.
