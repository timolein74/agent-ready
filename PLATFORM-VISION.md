# AgentReady — Global Infrastructure Platform for AI Agents

**Version:** 0.1 — March 2026
**Status:** Strategic Architecture Document
**Audience:** Founding team, investors, first engineering hires

---

## SECTION 1 — CATEGORY CREATION

### The Category: **Agent Infrastructure Layer**

A new middleware category that sits between AI agents and the internet's APIs, providing standardised discovery, execution, billing, and trust for autonomous software.

### The Problem AI Agents Face Today

AI agents are functionally blind. A model can reason, plan, and generate code — but when it needs to *do* something in the real world (send a payment, query a database, file a tax return, book a flight), it hits a wall:

1. **No discovery mechanism.** There is no DNS for capabilities. An agent that needs "send USDC to an Ethereum address" has no machine-readable way to find which APIs can do that, what they cost, or whether they are reliable. Developers hard-code tool lists. Every new tool requires a code change.

2. **No execution standard.** Every API has its own auth scheme, error format, rate-limit header, and retry semantics. Agents must carry bespoke integration code for each tool. This does not scale past a handful of integrations.

3. **No trust signal.** An agent cannot evaluate whether a tool is safe, performant, or honest. There is no reputation layer. A malicious endpoint looks identical to a legitimate one.

4. **No billing primitive.** Microtransactions between autonomous software do not exist at scale. Stripe and PayPal are designed for humans with credit cards. An agent that wants to pay $0.003 for a weather lookup has no clean path to do so.

5. **No observability.** When an agent calls a tool and it fails, there is no shared telemetry standard. Debugging requires manual log inspection across multiple systems.

### Why Existing API Marketplaces Fail

| Platform | Failure mode |
|---|---|
| RapidAPI | Human-centric UI; no machine-readable discovery; no agent auth; no reputation engine |
| OpenAI Plugin Store | Proprietary to one model provider; no cross-agent compatibility; no billing |
| Hugging Face | Model hosting, not tool execution; no runtime gateway; no billing |
| Postman / SwaggerHub | Documentation tools, not execution infrastructure; no agent-facing discovery |
| MCP registries (early) | Discovery only; no execution gateway; no billing; no ranking |

Every existing platform was designed for **human developers browsing a catalog**. None was designed for **autonomous software discovering and executing tools at machine speed**.

### Why This Category Will Exist for Decades

The internet transitioned from human-read (HTML) to machine-read (APIs) over 20 years. We are now transitioning from human-orchestrated APIs to **agent-orchestrated APIs**. This transition is permanent and accelerating:

- By 2028, the majority of API calls will originate from AI agents, not human-triggered frontend code.
- Every SaaS product will expose agent-facing endpoints or become invisible to the agentic economy.
- The volume of tool-to-tool transactions will exceed human-to-service transactions within a decade.

The Agent Infrastructure Layer is to this transition what AWS was to cloud computing, what Stripe was to internet payments, and what Docker Hub was to containerised deployment. It is **required plumbing** for an autonomous internet.

### Category Name

**Agent Infrastructure Layer (AIL)**

One sentence: *The discovery, execution, and monetization backbone for AI agents on the internet.*

---

## SECTION 2 — PRODUCT DEFINITION

### What AgentReady Is

AgentReady is a **global registry, execution gateway, and billing network** for AI-agent-callable tools.

### For Tool Developers

Any developer can register a tool:

```
agentready register \
  --name "Crypto Transfer" \
  --endpoint "https://api.example.com/transfer" \
  --auth bearer \
  --capabilities send_crypto,evm,usdc \
  --price 0.005 \
  --latency-p99 180ms
```

That tool is now:

- **Discoverable** by every AI agent on the internet via the AgentReady Discovery API.
- **Executable** through the AgentReady Gateway with standardised auth, retries, and error handling.
- **Billable** per call with automatic settlement to the developer's account.
- **Ranked** by real performance data — latency, success rate, agent satisfaction.

Developers can register:

- REST APIs
- MCP servers (tools/list, tools/call)
- GraphQL endpoints
- WebSocket streams
- Automation workflows (multi-step chains)
- Static data sources

### For AI Agents

Any agent (Claude, GPT, Cursor, custom) can query the registry:

```json
POST /v1/discover
{
  "task": "send 10 USDC to 0xABC on Base",
  "constraints": {
    "max_cost": 0.01,
    "max_latency_ms": 200,
    "min_success_rate": 0.99
  }
}
```

The response returns ranked tools the agent can call immediately through the gateway:

```json
{
  "tools": [
    {
      "id": "tool_8xKq2",
      "name": "Crypto Transfer",
      "gateway_url": "https://gw.agentready.dev/tool_8xKq2",
      "cost_per_call": 0.005,
      "latency_p50_ms": 92,
      "success_rate": 0.997,
      "rank_score": 0.94
    }
  ]
}
```

The agent calls the gateway URL. AgentReady handles auth injection, rate limiting, retries, fallback routing, billing, and telemetry.

### Core Product Components

| Component | Purpose |
|---|---|
| **Tool Registry** | Global database of machine-callable tools with structured metadata |
| **Discovery Engine** | Semantic + structured search for agents to find tools by task description or capability tags |
| **Execution Gateway** | Unified proxy that handles auth, retries, rate limits, circuit breaking |
| **Billing Network** | Usage-based metering and settlement between agents and tool providers |
| **Ranking Engine** | Real-time scoring of tools based on performance, reliability, cost, reputation |
| **Observability Platform** | Distributed tracing, error rates, latency histograms for every tool call |
| **Developer Dashboard** | Analytics, configuration, billing, and tool management for providers |
| **Agent SDK** | Client libraries for agents to discover and execute tools in one call |

### What Makes This Different

AgentReady is not a marketplace UI. It is **infrastructure**. The primary consumer is not a human browsing a website — it is an autonomous software system making decisions at machine speed. Every design decision optimises for:

- Machine-readability over human-readability
- Sub-100ms discovery latency
- Zero-configuration agent integration
- Automatic quality enforcement through real usage data

---

## SECTION 3 — SYSTEM ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AI AGENTS                                   │
│   Claude  ·  GPT  ·  Cursor  ·  Custom Agents  ·  Workflows       │
└──────────┬──────────────────────────────────┬───────────────────────┘
           │  Discovery API                   │  Execution API
           ▼                                  ▼
┌─────────────────────┐        ┌──────────────────────────────────────┐
│   DISCOVERY ENGINE  │        │        EXECUTION GATEWAY             │
│                     │        │                                      │
│  Semantic Search    │        │  Request Router                      │
│  Capability Index   │        │  Auth Injector                       │
│  Ranking Engine     │        │  Rate Limiter                        │
│  Result Cache       │        │  Circuit Breaker                     │
│                     │        │  Retry Engine                        │
│                     │        │  Fallback Router                     │
│                     │        │  Response Normaliser                 │
└────────┬────────────┘        └───────────┬──────────────────────────┘
         │                                 │
         ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CORE DATA PLANE                              │
│                                                                     │
│  ┌───────────────┐  ┌────────────────┐  ┌────────────────────────┐ │
│  │ Tool Registry │  │ Metrics Store  │  │  Billing Ledger        │ │
│  │ (Postgres +   │  │ (ClickHouse)   │  │  (Postgres + Stripe)   │ │
│  │  Embeddings)  │  │                │  │                        │ │
│  └───────────────┘  └────────────────┘  └────────────────────────┘ │
│                                                                     │
│  ┌───────────────┐  ┌────────────────┐  ┌────────────────────────┐ │
│  │ Auth Vault    │  │ Event Bus      │  │  Cache Layer           │ │
│  │ (Vault/KMS)   │  │ (Kafka/NATS)   │  │  (Redis Cluster)      │ │
│  └───────────────┘  └────────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
           │                                 │
           ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     TOOL PROVIDERS                                  │
│   REST APIs  ·  MCP Servers  ·  GraphQL  ·  Webhooks  ·  Chains   │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. Tool Registry

- **Storage:** PostgreSQL with pgvector extension for semantic embeddings.
- **What it stores:** Tool metadata, endpoint URLs, auth configuration (encrypted), capability tags, pricing rules, rate limits, schema definitions.
- **Write path:** Developer registers tool via CLI/API/Dashboard → validation → schema extraction → embedding generation → insert.
- **Read path:** Discovery Engine queries the registry using structured filters + vector similarity.

#### 2. Discovery Engine

- **Dual search:** Structured search (capability tags, price range, latency bounds) combined with semantic search (task description → embedding → nearest-neighbour lookup against tool description embeddings).
- **Index:** pgvector HNSW index for sub-50ms vector search at 1M+ tools. Capability tags in a GIN index for exact-match filtering.
- **Ranking integration:** Raw search results are re-ranked by the Ranking Engine before returning to the agent.
- **Cache:** Redis cache with 60-second TTL for repeated identical queries. Cache key = hash(query + constraints).

#### 3. Execution Gateway

- **Implementation:** Edge-deployed proxy (Cloudflare Workers or Fastly Compute) for global low-latency routing.
- **Auth injection:** Gateway retrieves the tool provider's expected auth credentials from the Auth Vault and injects them into the outbound request. The agent never sees provider credentials.
- **Rate limiting:** Per-agent and per-tool sliding-window rate limits enforced at the edge via Redis.
- **Circuit breaker:** If a tool's error rate exceeds threshold (e.g. >10% 5xx in 60s), the circuit opens. Subsequent requests are routed to a fallback tool or return a structured error.
- **Retry engine:** Exponential backoff with jitter, configurable per tool (max 3 retries, idempotent methods only).
- **Response normalisation:** Converts diverse error formats into a unified AgentReady error schema so agents have consistent error handling.

#### 4. Authentication Layer

- **Agent auth:** API keys (for simple use) + JWT tokens (for production) + mTLS (for enterprise).
- **Tool provider auth:** OAuth2 client credentials, API keys, or custom headers — stored encrypted in HashiCorp Vault or AWS KMS.
- **Auth injection:** The gateway retrieves provider credentials at request time and injects them. Agents never handle provider secrets.

#### 5. Billing System

- **Metering:** Every gateway request produces a usage event (tool_id, agent_id, timestamp, latency, status, bytes). Events stream via Kafka to ClickHouse for aggregation.
- **Pricing models:** Per-call flat rate, per-call dynamic (based on compute), monthly subscription, free tier.
- **Settlement:** Hourly aggregation. Agent accounts are pre-funded (credit balance) or post-paid (Stripe billing). Tool providers receive payouts via Stripe Connect.
- **Micro-transactions:** For calls under $0.01, the system batches charges and settles at threshold ($1.00) or end of billing period — avoiding payment processor minimums.

#### 6. Ranking Engine

- **Signals:** success_rate, p50_latency, p99_latency, cost_per_call, uptime_30d, agent_usage_count, failure_rate, time_since_last_outage, developer_reputation.
- **Model:** Weighted linear combination with bayesian smoothing for new tools (see Section 7).
- **Update frequency:** Rankings recomputed every 5 minutes from ClickHouse aggregates. Cached in Redis.
- **Personalisation:** Agent-specific ranking adjustments based on the agent's past success with each tool.

#### 7. Observability Platform

- **Tracing:** Every gateway request gets a trace_id propagated to the tool provider (via `X-AgentReady-Trace-Id` header). Full distributed trace stored in ClickHouse.
- **Metrics:** Latency histograms, error rates, throughput — per tool, per agent, per region. Exposed via Prometheus-compatible endpoint.
- **Dashboards:** Grafana for internal ops. Developer dashboard shows tool-specific analytics (see Section 9).
- **Alerting:** Tool providers can configure alerts (e.g. "notify me if error rate > 5%") via webhook or email.

#### 8. Cache Layer

- **Edge cache:** Discovery responses cached at CDN edge for 60s (cache key = query hash).
- **Gateway cache:** Idempotent GET tool responses cached in Redis with configurable TTL (tool provider sets TTL, default 0 = no cache).
- **Registry cache:** Hot tool metadata cached in Redis with 5-minute TTL to reduce Postgres read load.

---

## SECTION 4 — DATA MODEL

### Core Tables

```sql
-- Tool providers (companies or individual developers)
CREATE TABLE developers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    email           TEXT UNIQUE NOT NULL,
    org             TEXT,
    stripe_account  TEXT,
    api_key_hash    TEXT NOT NULL,
    plan            TEXT DEFAULT 'free',  -- free | pro | enterprise
    reputation      NUMERIC(4,3) DEFAULT 0.500,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Registered tools
CREATE TABLE tools (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID REFERENCES developers(id),
    name            TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL,
    description     TEXT NOT NULL,
    endpoint_url    TEXT NOT NULL,
    method          TEXT DEFAULT 'POST',
    auth_type       TEXT DEFAULT 'bearer',  -- bearer | api_key | oauth2 | none
    auth_config_enc BYTEA,                  -- encrypted auth details
    protocol        TEXT DEFAULT 'rest',    -- rest | mcp | graphql | websocket
    input_schema    JSONB,                  -- JSON Schema for request body
    output_schema   JSONB,                  -- JSON Schema for response
    pricing_model   TEXT DEFAULT 'per_call', -- per_call | subscription | free
    price_per_call  NUMERIC(10,6) DEFAULT 0,
    rate_limit_rpm  INT DEFAULT 60,
    latency_p50_ms  INT,
    latency_p99_ms  INT,
    success_rate    NUMERIC(5,4) DEFAULT 1.0000,
    rank_score      NUMERIC(5,4) DEFAULT 0.5000,
    status          TEXT DEFAULT 'active',  -- active | suspended | deprecated
    version         TEXT DEFAULT '1.0.0',
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Capability tags (many-to-many)
CREATE TABLE capabilities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT UNIQUE NOT NULL,   -- e.g. 'send_crypto', 'weather', 'translate'
    category        TEXT,                   -- e.g. 'finance', 'data', 'communication'
    description     TEXT
);

CREATE TABLE tool_capabilities (
    tool_id         UUID REFERENCES tools(id) ON DELETE CASCADE,
    capability_id   UUID REFERENCES capabilities(id) ON DELETE CASCADE,
    PRIMARY KEY (tool_id, capability_id)
);

-- Semantic embeddings for tool descriptions
CREATE TABLE tool_embeddings (
    tool_id         UUID PRIMARY KEY REFERENCES tools(id) ON DELETE CASCADE,
    embedding       vector(1536),           -- OpenAI text-embedding-3-small dimension
    model           TEXT DEFAULT 'text-embedding-3-small',
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tool_embeddings_hnsw
    ON tool_embeddings USING hnsw (embedding vector_cosine_ops);

-- Agent accounts
CREATE TABLE agents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    owner_id        UUID REFERENCES developers(id),
    api_key_hash    TEXT NOT NULL,
    credit_balance  NUMERIC(12,6) DEFAULT 0,
    plan            TEXT DEFAULT 'free',
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Usage events (hot table, partitioned by day, synced to ClickHouse)
CREATE TABLE usage_events (
    id              UUID DEFAULT gen_random_uuid(),
    tool_id         UUID NOT NULL,
    agent_id        UUID NOT NULL,
    trace_id        TEXT NOT NULL,
    status_code     INT,
    latency_ms      INT,
    cost            NUMERIC(10,6),
    region          TEXT,
    error_type      TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
) PARTITION BY RANGE (created_at);

-- Reputation scores (computed, updated every 5 min)
CREATE TABLE tool_reputation (
    tool_id             UUID PRIMARY KEY REFERENCES tools(id),
    success_rate_7d     NUMERIC(5,4),
    success_rate_30d    NUMERIC(5,4),
    latency_p50_7d      INT,
    latency_p99_7d      INT,
    total_calls_30d     BIGINT,
    unique_agents_30d   INT,
    uptime_pct_30d      NUMERIC(5,2),
    rank_score          NUMERIC(5,4),
    updated_at          TIMESTAMPTZ DEFAULT now()
);
```

### Example Records

**Developer:**
```json
{
  "id": "d_01HZ...",
  "name": "WeatherCo",
  "email": "dev@weatherco.io",
  "org": "WeatherCo Inc",
  "plan": "pro",
  "reputation": 0.920
}
```

**Tool:**
```json
{
  "id": "tool_8xKq2",
  "developer_id": "d_01HZ...",
  "name": "Current Weather",
  "slug": "weatherco-current",
  "description": "Get current weather conditions for any city worldwide. Returns temperature, humidity, wind, conditions.",
  "endpoint_url": "https://api.weatherco.io/v2/current",
  "method": "GET",
  "auth_type": "api_key",
  "protocol": "rest",
  "pricing_model": "per_call",
  "price_per_call": 0.001,
  "rate_limit_rpm": 600,
  "latency_p50_ms": 45,
  "latency_p99_ms": 180,
  "success_rate": 0.9985,
  "rank_score": 0.9200,
  "status": "active"
}
```

**Capability:**
```json
{ "name": "weather_current", "category": "data", "description": "Real-time weather conditions" }
```

**Usage Event:**
```json
{
  "tool_id": "tool_8xKq2",
  "agent_id": "ag_7nPm...",
  "trace_id": "tr_abc123",
  "status_code": 200,
  "latency_ms": 52,
  "cost": 0.001,
  "region": "eu-west-1"
}
```

---

## SECTION 5 — TOOL REGISTRY SPECIFICATION

### Tool Definition Schema

Every tool registered on AgentReady conforms to this JSON schema:

```json
{
  "$schema": "https://agentready.dev/schemas/tool/v1.json",
  "name": "Crypto Transfer",
  "slug": "acme-crypto-transfer",
  "version": "1.2.0",
  "description": "Send ERC-20 tokens on EVM chains. Supports USDC, USDT, DAI on Ethereum, Base, Arbitrum, Polygon.",
  "provider": {
    "name": "Acme Finance",
    "url": "https://acmefinance.io",
    "contact": "api@acmefinance.io"
  },
  "endpoint": {
    "url": "https://api.acmefinance.io/v1/transfer",
    "method": "POST",
    "protocol": "rest"
  },
  "auth": {
    "type": "bearer",
    "header": "Authorization",
    "prefix": "Bearer"
  },
  "capabilities": [
    "send_crypto",
    "evm",
    "usdc",
    "usdt",
    "dai",
    "cross_chain"
  ],
  "input_schema": {
    "type": "object",
    "required": ["to", "amount", "token", "chain"],
    "properties": {
      "to":     { "type": "string", "description": "Recipient address (0x...)" },
      "amount": { "type": "number", "description": "Amount in token units" },
      "token":  { "type": "string", "enum": ["USDC", "USDT", "DAI"] },
      "chain":  { "type": "string", "enum": ["ethereum", "base", "arbitrum", "polygon"] }
    }
  },
  "output_schema": {
    "type": "object",
    "properties": {
      "tx_hash": { "type": "string" },
      "status":  { "type": "string", "enum": ["pending", "confirmed", "failed"] },
      "fee":     { "type": "number" }
    }
  },
  "pricing": {
    "model": "per_call",
    "price_usd": 0.005,
    "free_tier": { "calls_per_month": 100 }
  },
  "rate_limits": {
    "requests_per_minute": 120,
    "requests_per_day": 10000
  },
  "performance": {
    "latency_p50_ms": 92,
    "latency_p99_ms": 340,
    "uptime_sla": 0.999
  },
  "metadata": {
    "documentation_url": "https://docs.acmefinance.io/transfer",
    "changelog_url": "https://docs.acmefinance.io/changelog",
    "tags": ["defi", "payments", "blockchain"],
    "regions": ["us-east-1", "eu-west-1"]
  }
}
```

### Registration Flow

```
Developer                  AgentReady CLI / API              Registry
    │                              │                             │
    │  agentready register         │                             │
    │  --file tool.json            │                             │
    │─────────────────────────────▶│                             │
    │                              │  validate schema            │
    │                              │  extract capabilities       │
    │                              │  generate embedding          │
    │                              │  health-check endpoint       │
    │                              │─────────────────────────────▶│
    │                              │                     INSERT   │
    │                              │◀─────────────────────────────│
    │  ✓ tool_8xKq2 registered    │                             │
    │◀─────────────────────────────│                             │
```

### Validation Rules

1. `endpoint.url` must respond to a health-check probe within 5 seconds.
2. `input_schema` must be valid JSON Schema draft-07+.
3. `capabilities` must contain at least one tag from the AgentReady taxonomy (open, extensible).
4. `pricing.price_usd` must be >= 0.
5. `slug` must be globally unique and match `^[a-z0-9][a-z0-9-]{2,48}$`.

---

## SECTION 6 — AGENT DISCOVERY PROTOCOL

### Discovery API

```
POST https://api.agentready.dev/v1/discover
```

#### Request

```json
{
  "task": "send 10 USDC to 0xABC on Base chain",
  "capabilities": ["send_crypto", "usdc", "base"],
  "constraints": {
    "max_cost_per_call": 0.01,
    "max_latency_ms": 200,
    "min_success_rate": 0.99,
    "protocols": ["rest", "mcp"]
  },
  "limit": 5,
  "agent_id": "ag_7nPm..."
}
```

#### Processing Pipeline

```
1. Parse constraints → structured filters (price <= 0.01, latency_p99 <= 200, etc.)
2. Generate embedding from "task" field
3. Query pgvector: nearest 50 neighbours filtered by structured constraints
4. If "capabilities" provided: intersect with capability tag index
5. Feed 50 candidates to Ranking Engine → return top `limit`
6. Inject gateway URLs, cache for 60s
```

#### Response

```json
{
  "request_id": "req_Xk92m",
  "tools": [
    {
      "id": "tool_8xKq2",
      "name": "Crypto Transfer",
      "provider": "Acme Finance",
      "description": "Send ERC-20 tokens on EVM chains...",
      "gateway_url": "https://gw.agentready.dev/v1/exec/tool_8xKq2",
      "protocol": "rest",
      "method": "POST",
      "input_schema": { "..." : "..." },
      "cost_per_call": 0.005,
      "latency_p50_ms": 92,
      "latency_p99_ms": 340,
      "success_rate": 0.9970,
      "rank_score": 0.94,
      "capabilities": ["send_crypto", "evm", "usdc", "base"]
    },
    {
      "id": "tool_Qw3rT",
      "name": "BaseChain Sender",
      "provider": "ChainOps",
      "gateway_url": "https://gw.agentready.dev/v1/exec/tool_Qw3rT",
      "cost_per_call": 0.003,
      "latency_p50_ms": 140,
      "success_rate": 0.9910,
      "rank_score": 0.87,
      "capabilities": ["send_crypto", "base", "usdc"]
    }
  ],
  "cached": false,
  "latency_ms": 38
}
```

### Semantic Search

The `task` field is embedded using the same model as tool descriptions (text-embedding-3-small, 1536 dimensions). Cosine similarity is computed via pgvector's HNSW index. This allows agents to describe what they need in natural language:

```json
{ "task": "translate a document from Finnish to English" }
```

Without needing to know the exact capability tags.

### Capability Tags

AgentReady maintains an open taxonomy of capability tags. Any developer can propose new tags. Tags are hierarchical:

```
finance/
  finance/payments/
    finance/payments/crypto
    finance/payments/fiat
    finance/payments/invoice
  finance/exchange/
data/
  data/weather/
  data/geolocation/
  data/market_data/
communication/
  communication/email/
  communication/sms/
  communication/chat/
```

### Relevance Ranking

Discovery results are ranked by a composite score (see Section 7). The agent can override ranking by specifying `sort_by`:

```json
{ "sort_by": "cost_asc" }
{ "sort_by": "latency_asc" }
{ "sort_by": "success_rate_desc" }
```

Default: `rank_score_desc` (composite).

---

## SECTION 7 — TOOL RANKING ALGORITHM

### Signals

| Signal | Symbol | Weight | Source |
|---|---|---|---|
| Success rate (30d) | S | 0.30 | usage_events |
| Latency p50 (7d) | L | 0.15 | usage_events |
| Cost per call | C | 0.10 | tools table |
| Uptime (30d) | U | 0.15 | health checks |
| Agent adoption (unique agents 30d) | A | 0.10 | usage_events |
| Failure rate (7d) | F | 0.10 | usage_events |
| Developer reputation | D | 0.05 | developers table |
| Recency of last outage | R | 0.05 | incidents table |

### Normalisation

Each signal is normalised to [0, 1]:

```
S_norm = S                                   (already 0-1)
L_norm = 1 - min(L / 1000, 1)               (lower latency = higher score)
C_norm = 1 - min(C / max_price_in_set, 1)   (lower cost = higher score)
U_norm = U / 100                             (uptime percentage / 100)
A_norm = min(A / 1000, 1)                    (cap at 1000 unique agents)
F_norm = 1 - min(F / 0.10, 1)               (lower failure = higher score)
D_norm = D                                   (already 0-1)
R_norm = min(days_since_outage / 90, 1)      (longer = better, cap 90d)
```

### Composite Score

```
rank_score = 0.30 * S_norm
           + 0.15 * L_norm
           + 0.10 * C_norm
           + 0.15 * U_norm
           + 0.10 * A_norm
           + 0.10 * F_norm
           + 0.05 * D_norm
           + 0.05 * R_norm
```

### Bayesian Smoothing for New Tools

Tools with fewer than 100 calls use a smoothed estimate:

```
S_smoothed = (n * S_observed + k * S_prior) / (n + k)

where:
  n = number of calls
  k = 100 (smoothing constant)
  S_prior = 0.90 (global average success rate)
```

This prevents a tool with 3/3 successes from outranking a proven tool with 9,970/10,000 successes.

### Personalised Ranking

If the requesting agent has historical usage data, the Ranking Engine applies an agent-specific adjustment:

```
personalised_score = 0.85 * rank_score + 0.15 * agent_affinity

agent_affinity = (agent's success rate with this tool over last 30d)
```

This rewards tools that work well specifically for the calling agent's use patterns.

---

## SECTION 8 — EXECUTION GATEWAY

### Purpose

The gateway is the **runtime proxy** between agents and tools. It provides a single, consistent interface so agents never need to handle per-tool auth, error formats, or retry logic.

### Full Request Flow

```
Agent                    Edge Gateway              Auth Vault       Tool Provider
  │                          │                         │                 │
  │ POST /v1/exec/tool_8xKq2│                         │                 │
  │ Authorization: ar_xxx    │                         │                 │
  │ Body: { to, amount, ... }│                         │                 │
  │─────────────────────────▶│                         │                 │
  │                          │                         │                 │
  │                          │ 1. Validate agent key   │                 │
  │                          │ 2. Check rate limits    │                 │
  │                          │ 3. Check agent balance  │                 │
  │                          │ 4. Fetch tool auth ────▶│                 │
  │                          │    ◀── bearer token ────│                 │
  │                          │                         │                 │
  │                          │ 5. Build outbound request                 │
  │                          │    - inject auth header                   │
  │                          │    - add trace header                     │
  │                          │    - validate input schema                │
  │                          │                         │                 │
  │                          │ 6. Forward request ─────────────────────▶│
  │                          │                         │                 │
  │                          │    ◀── 200 { tx_hash } ─────────────────│
  │                          │                         │                 │
  │                          │ 7. Validate output schema                 │
  │                          │ 8. Emit usage event → Kafka               │
  │                          │ 9. Debit agent balance                    │
  │                          │                         │                 │
  │ 200 { tx_hash, trace_id }│                         │                 │
  │◀─────────────────────────│                         │                 │
```

### Request Routing

- The gateway resolves `tool_8xKq2` to the tool's `endpoint_url` from the registry cache.
- If the tool has multiple regions, the gateway routes to the nearest region based on the agent's source IP.

### Retry Logic

```
if status >= 500 and method is idempotent:
    retry up to 3 times
    backoff: 100ms, 400ms, 1600ms (exponential with jitter)
    
if status == 429 (rate limited):
    respect Retry-After header
    retry once after delay

if circuit is open:
    skip retries
    return 503 with fallback suggestion
```

### Fallback Routing

If the primary tool fails after all retries, the gateway can automatically route to the next-ranked tool for the same capability (if the agent opted into `auto_fallback: true` in the request):

```json
POST /v1/exec/tool_8xKq2
{
  "auto_fallback": true,
  "fallback_constraints": { "max_cost": 0.02 },
  "body": { "to": "0xABC", "amount": 10, "token": "USDC", "chain": "base" }
}
```

### Error Response Format

All errors from the gateway use a unified schema:

```json
{
  "error": {
    "code": "TOOL_TIMEOUT",
    "message": "Tool did not respond within 10000ms",
    "trace_id": "tr_abc123",
    "tool_id": "tool_8xKq2",
    "retries_attempted": 3,
    "fallback_available": true,
    "fallback_tool_id": "tool_Qw3rT"
  }
}
```

Error codes: `TOOL_TIMEOUT`, `TOOL_ERROR`, `TOOL_RATE_LIMITED`, `CIRCUIT_OPEN`, `INVALID_INPUT`, `AUTH_FAILED`, `INSUFFICIENT_BALANCE`, `TOOL_NOT_FOUND`.

---

## SECTION 9 — DEVELOPER PLATFORM

### Principle

Developers must feel like AgentReady is **the best distribution channel** for their API. The platform should make them more money with less effort than self-promotion.

### Components

#### 1. CLI (`agentready`)

```bash
npm install -g agentready

agentready login
agentready register --file tool.json
agentready status my-tool-slug
agentready logs my-tool-slug --tail
agentready metrics my-tool-slug --period 7d
agentready update my-tool-slug --price 0.003
```

The CLI is the primary registration and management interface. It works in CI/CD pipelines for automated tool updates.

#### 2. Developer Dashboard (web)

```
dashboard.agentready.dev
├── Overview          — total calls, revenue, active agents
├── Tools             — list of registered tools, status, quick actions
├── Analytics         — latency histograms, success rates, geographic breakdown
├── Revenue           — earnings, payouts, billing history
├── Logs              — recent requests with trace IDs, searchable
├── Alerts            — error rate thresholds, latency spikes, downtime
├── Settings          — API keys, team members, Stripe payout config
└── Docs              — how to register, schema reference, best practices
```

#### 3. SDKs

Client libraries for agents to discover and execute tools:

```typescript
// TypeScript SDK
import { AgentReady } from 'agentready';

const ar = new AgentReady({ apiKey: 'ar_xxx' });

const tools = await ar.discover({
  task: 'send 10 USDC to 0xABC on Base',
  constraints: { maxCost: 0.01, maxLatencyMs: 200 }
});

const result = await ar.exec(tools[0].id, {
  to: '0xABC', amount: 10, token: 'USDC', chain: 'base'
});
```

SDKs for: TypeScript/Node, Python, Go, Rust. Python and TypeScript are priority.

#### 4. Documentation Portal

```
docs.agentready.dev
├── Getting Started         — register your first tool in 5 minutes
├── Tool Schema Reference   — full JSON schema docs
├── Discovery API           — search, filters, ranking
├── Execution API           — gateway, retries, fallback
├── Billing                 — pricing models, payouts, free tier
├── Best Practices          — latency tips, schema design, versioning
├── Guides
│   ├── MCP Server → AgentReady
│   ├── FastAPI → AgentReady
│   ├── Express → AgentReady
│   └── Fastify → AgentReady (using agent-ready-api plugin)
└── API Reference           — OpenAPI spec, interactive playground
```

#### 5. Open Source Bridge

The `agent-ready-api` npm package (this project) is the open-source entry point. It registers routes that make a Fastify API agent-discoverable. The next version adds optional auto-registration to AgentReady registry:

```typescript
await fastify.register(agentReady, {
  name: 'My API',
  baseUrl: 'https://api.example.com',
  endpoints: [...],
  agentReadyKey: 'ar_xxx'  // auto-register to the global registry
});
```

This bridges self-hosted discovery (llms.txt, agent.json, MCP) with global registry discovery — developers get both.

---

## SECTION 10 — MONETIZATION ENGINE

### Revenue Streams

#### 1. Transaction Fee (primary revenue)

AgentReady charges a **platform fee** on every paid tool execution:

| Tier | Fee |
|---|---|
| Free tier (first 10k calls/mo) | 0% |
| Standard | 5% of tool price |
| High-volume (>1M calls/mo) | 3% of tool price |
| Enterprise | Negotiated |

Example: A tool charges $0.01 per call. AgentReady takes $0.0005. At 100M calls/month, that is $50,000/month from one tool.

#### 2. Agent Credit Top-ups (float revenue)

Agents pre-fund their accounts. AgentReady holds the float. At scale ($10M+ in agent balances), this generates significant interest income and provides working capital.

#### 3. Premium Developer Plans

| Plan | Price | Features |
|---|---|---|
| Free | $0 | 3 tools, basic analytics, community support |
| Pro | $49/mo | Unlimited tools, advanced analytics, priority ranking boost, webhook alerts |
| Enterprise | Custom | SLA guarantees, dedicated support, custom auth, private registry, audit logs |

#### 4. Promoted Placement

Tool providers can pay for higher ranking in discovery results (clearly labelled as "promoted"). CPM or CPC model. This is the Google Ads of agent infrastructure.

#### 5. Data & Insights

Anonymised, aggregated market intelligence:
- "What capabilities are agents searching for that have zero tools?"
- "What is the average price agents are willing to pay for weather data?"
- Sold as reports or API access to enterprise customers.

### Long-Term Revenue Model

Transaction fees dominate. As more tools go through the gateway, revenue scales with internet-wide agent activity — not with sales effort.

**Revenue projection at scale:**

| Year | Monthly gateway calls | Avg tool price | Platform fee | Monthly revenue |
|---|---|---|---|---|
| Y1 | 10M | $0.005 | 5% | $25K |
| Y3 | 1B | $0.008 | 4% | $3.2M |
| Y5 | 50B | $0.010 | 3.5% | $17.5M |
| Y7 | 500B | $0.012 | 3% | $180M |

At Y7, this is a $2B+ ARR business.

---

## SECTION 11 — NETWORK EFFECTS

### 1. Developer Network Effect (supply side)

More tools registered → richer discovery → agents find better matches → agents use AgentReady more → more agents → developers earn more → more developers register tools.

This is the **classic two-sided marketplace flywheel**.

### 2. Agent Network Effect (demand side)

More agents using the platform → more usage data → better ranking → better results → agents prefer AgentReady → more agents.

Agents that use AgentReady produce better outcomes than agents that don't. This creates a quality gap that drives adoption.

### 3. Data Network Effect (the deepest moat)

Every tool execution produces telemetry:
- Latency measurement
- Success/failure
- Agent satisfaction (implicit: did the agent retry? switch tools?)

This data feeds the Ranking Engine. The ranking improves with every call. A competitor starting from zero has no ranking data — their discovery is worse — agents don't adopt — they never get the data.

**This is the strongest moat.** It compounds over time and cannot be replicated without equivalent traffic volume.

### 4. Protocol Network Effect

As AgentReady's tool definition schema becomes widely adopted, it becomes a de facto standard. Tools are built to be "AgentReady compatible." SDKs assume the AgentReady protocol. Switching to an alternative requires rewriting schemas, re-registering tools, and losing ranking history.

### 5. Ecosystem Lock-in

- Agent SDKs hard-code AgentReady discovery.
- Developer CI/CD pipelines auto-deploy to AgentReady.
- Tool ranking history is non-portable.
- Agent credit balances are locked to the platform.
- Integration guides across the ecosystem reference AgentReady.

---

## SECTION 12 — GROWTH ENGINE

### Phase 1: 0 → 1,000 Developers (Months 1-6)

**Strategy: Open source distribution + community seeding.**

1. **Ship `agent-ready-api`** (this npm package) as the open-source hook. Every Fastify developer who installs it is one step from the hosted registry.
2. **Publish framework plugins**: `agent-ready-express`, `agent-ready-fastapi`, `agent-ready-nextjs`. Each plugin is an SEO magnet and distribution channel.
3. **Write 20 technical guides**: "How to make your Express API discoverable by AI agents", "MCP server in 5 minutes with AgentReady", etc. Post on Dev.to, Hashnode, Medium.
4. **GitHub stars campaign**: Pin repos, add badges, submit to trending lists, Awesome lists (`awesome-mcp`, `awesome-ai-agents`).
5. **Seed the registry**: Register 100 free tools ourselves (weather, exchange rates, IP geolocation, text translation, image generation) so agents have something to discover from day one.
6. **Discord community**: Launch developer Discord. Provide hands-on support. This becomes the feedback loop.

### Phase 2: 1,000 → 10,000 Developers (Months 6-18)

**Strategy: Integrations + partnerships + content flywheel.**

1. **MCP ecosystem integration**: Ship an AgentReady MCP server that Claude Desktop, Cursor, and other MCP clients can connect to. One connection = access to every tool in the registry.
2. **AI framework plugins**: LangChain tool, LlamaIndex tool, AutoGen tool, CrewAI tool. Each brings the framework's entire user base.
3. **Conference talks**: Present at AI Engineer Summit, Node Congress, PyCon. "The missing infrastructure for AI agents."
4. **Developer testimonials**: Case studies: "How we went from 0 to 10,000 agent calls/day by registering on AgentReady."
5. **Referral programme**: Developers earn 10% of platform fees from tools they refer.
6. **Documentation SEO**: Every capability tag gets a landing page ("Best API for sending crypto via AI agents") that ranks in Google and in LLM training data.

### Phase 3: 10,000 → 100,000 Developers (Months 18-36)

**Strategy: Platform gravity + default infrastructure status.**

1. **Cloud provider integrations**: One-click deploy on Vercel, Railway, Render with AgentReady auto-registration.
2. **Enterprise contracts**: Large API providers (Twilio, Stripe, Plaid) register their full API surface. Their millions of users see AgentReady as the standard.
3. **Agent framework defaults**: Become the default tool provider in major agent frameworks. When someone writes `agent.use_tools()`, it queries AgentReady.
4. **Protocol standardisation**: Submit the Tool Definition Schema to an open standards body. Become the W3C recommendation for agent tool discovery.
5. **Acquisition or partnership** of smaller MCP registries and agent tool directories to consolidate the ecosystem.

---

## SECTION 13 — AGENT SEO STRATEGY

### Principle

AI agents discover tools through two paths:
1. **Direct API query** to AgentReady Discovery.
2. **LLM knowledge** — the model's training data includes documentation, blog posts, and landing pages that mention AgentReady tools.

Both paths must be optimised.

### 200 SEO Keywords

#### Core Platform Keywords (20)
1. agent ready API
2. AI agent tool discovery
3. AI agent infrastructure
4. MCP server registry
5. agent tool marketplace
6. AI tool execution gateway
7. machine-readable API registry
8. autonomous agent tools
9. AI agent API gateway
10. agent billing platform
11. MCP tool discovery
12. AI agent monetization
13. agent-to-agent protocol
14. LLM tool registry
15. AI agent SDK
16. agent API proxy
17. tool discovery for AI
18. agent execution layer
19. AI infrastructure platform
20. MCP endpoint registry

#### Capability-Specific Keywords (60)
21. AI agent send crypto
22. AI agent weather API
23. AI agent translate text
24. AI agent send email
25. AI agent generate image
26. AI agent search web
27. AI agent database query
28. AI agent file conversion
29. AI agent PDF generation
30. AI agent SMS API
31. AI agent payment processing
32. AI agent stock data
33. AI agent geocoding
34. AI agent sentiment analysis
35. AI agent OCR
36. AI agent speech to text
37. AI agent text to speech
38. AI agent calendar API
39. AI agent CRM integration
40. AI agent invoice generation
41. AI agent blockchain data
42. AI agent NFT API
43. AI agent exchange rate
44. AI agent shipping API
45. AI agent tax calculation
46. AI agent identity verification
47. AI agent document signing
48. AI agent video processing
49. AI agent social media API
50. AI agent analytics API
51. AI agent notification service
52. AI agent DNS lookup
53. AI agent SSL certificate
54. AI agent domain registration
55. AI agent cloud storage
56. AI agent backup API
57. AI agent monitoring API
58. AI agent logging service
59. AI agent queue service
60. AI agent rate limiting API
61. AI agent authentication service
62. AI agent authorization API
63. AI agent webhook service
64. AI agent cron job API
65. AI agent scraping API
66. AI agent proxy service
67. AI agent VPN API
68. AI agent compression API
69. AI agent encryption API
70. AI agent hashing service
71. AI agent math API
72. AI agent unit conversion
73. AI agent timezone API
74. AI agent holiday API
75. AI agent news API
76. AI agent recipe API
77. AI agent nutrition API
78. AI agent fitness API
79. AI agent music API
80. AI agent podcast API

#### Framework Integration Keywords (30)
81. LangChain tool provider
82. LlamaIndex tool registry
83. CrewAI tool discovery
84. AutoGen tool execution
85. Claude MCP tools
86. Cursor MCP server
87. GPT function calling registry
88. Anthropic tool use API
89. OpenAI plugin alternative
90. AI agent Fastify plugin
91. AI agent Express middleware
92. AI agent FastAPI integration
93. AI agent Next.js API
94. AI agent Django integration
95. AI agent Rails integration
96. AI agent Spring Boot
97. AI agent Go API
98. AI agent Rust API
99. MCP server TypeScript
100. MCP server Python
101. agent discovery protocol
102. agent capability schema
103. agent tool JSON schema
104. machine-readable API description
105. AI-friendly API design
106. agent-first API
107. robots.txt for AI
108. llms.txt specification
109. well-known agent.json
110. MCP server card

#### Developer Education Keywords (40)
111. how to make API discoverable by AI
112. register API for AI agents
113. build MCP server tutorial
114. AI agent tool development
115. monetize API with AI agents
116. API pricing for AI agents
117. agent-ready API tutorial
118. MCP server from scratch
119. llms.txt tutorial
120. agent.json specification
121. AI crawler robots.txt
122. best practices AI agent API
123. API design for autonomous agents
124. low latency API for agents
125. API reliability for AI
126. API schema for AI agents
127. JSON-RPC for AI agents
128. REST API for AI agents
129. GraphQL for AI agents
130. WebSocket API for AI agents
131. API authentication for agents
132. bearer token AI agent
133. OAuth2 for AI agents
134. API rate limiting for agents
135. API versioning for agents
136. API error handling for agents
137. API monitoring for agents
138. API analytics for agents
139. API documentation for agents
140. API testing for agents
141. deploy MCP server
142. host MCP server
143. MCP server Docker
144. MCP server Kubernetes
145. MCP server serverless
146. MCP server Cloudflare Workers
147. MCP server Vercel
148. MCP server Railway
149. MCP server Render
150. MCP server Fly.io

#### Business & Strategy Keywords (30)
151. AI agent economy
152. agent-to-agent commerce
153. AI tool marketplace business
154. API marketplace 2026
155. future of API economy
156. autonomous software transactions
157. machine-to-machine payments
158. AI agent billing
159. AI agent subscription
160. AI agent usage metering
161. AI agent SaaS
162. AI agent platform
163. AI infrastructure startup
164. AI agent developer tools
165. AI agent DevOps
166. AI agent observability
167. AI agent tracing
168. AI agent debugging
169. AI agent error handling
170. AI agent fallback
171. build AI agent platform
172. AI agent startup idea
173. AI agent business model
174. AI agent revenue model
175. AI agent market size
176. AI agent TAM
177. AI agent venture capital
178. AI agent seed funding
179. AI agent series A
180. AI agent unicorn

#### Long-Tail Agent Task Keywords (20)
181. best API to send USDC for AI agent
182. cheapest weather API for AI bots
183. fastest translation API for agents
184. most reliable email API for AI
185. AI agent crypto payment under 1 cent
186. free API for AI agent testing
187. AI agent tool comparison
188. AI agent tool benchmark
189. AI agent latency benchmark
190. AI agent uptime comparison
191. top 10 APIs for AI agents
192. best MCP servers 2026
193. MCP server directory
194. AI tool directory
195. agent tool search engine
196. find API for AI agent
197. API recommendation for AI
198. AI agent tool ranking
199. AI agent tool reputation
200. agent-ready certification

### Landing Page Architecture

Each capability tag generates a landing page:

```
agentready.dev/tools/send-crypto
agentready.dev/tools/weather
agentready.dev/tools/translate
agentready.dev/tools/send-email
... (hundreds of pages)
```

Each page contains:
- Machine-readable structured data (JSON-LD)
- Comparison table of registered tools for that capability
- Performance benchmarks (latency, success rate)
- Code examples showing how to discover and use these tools
- FAQ section targeting long-tail queries

These pages are optimised for both Google and LLM training data ingestion.

---

## SECTION 14 — DEFENSIBILITY

### 1. Data Moat

The Ranking Engine improves with every tool execution. After 1 billion calls, AgentReady has the most accurate tool performance data on the internet. A new entrant has zero data. Their rankings are arbitrary. Agents produce worse results. They don't adopt. The competitor never gets data.

**This moat deepens every day and cannot be bought.**

### 2. Ecosystem Lock-in

- **SDKs** in every major language hard-code AgentReady endpoints.
- **Framework integrations** (LangChain, LlamaIndex, CrewAI) use AgentReady as default tool provider.
- **Developer CI/CD pipelines** auto-register tools to AgentReady on deploy.
- **Agent credit balances** are locked to the platform.
- **Tool ranking history** is non-portable — a developer's 0.97 rank score on AgentReady starts at 0.50 on any competitor.

### 3. Protocol Influence

If the AgentReady Tool Definition Schema becomes a standard (W3C, IETF, or de facto), every tool built to that standard is inherently compatible with AgentReady. The standard *is* the platform.

### 4. Developer Switching Cost

A developer with 50 tools registered, each with performance history, pricing, and active agent consumers, faces enormous switching cost:
- Re-register all tools on a new platform
- Lose all ranking history
- Lose all active agent connections
- Reconfigure billing and payouts
- Update CI/CD pipelines

### 5. Agent Switching Cost

An agent configured with AgentReady SDK, with credit balance, with personalised ranking data, with retry/fallback configuration — switching to a competitor means rewriting integration code, losing personalisation, and losing credit balance.

### 6. Supply-Side Moat

The platform with the most tools gets the most agents. The platform with the most agents pays developers the most. Developers consolidate on the dominant platform. This is winner-take-most.

---

## SECTION 15 — BILLION DOLLAR OUTCOME

### Market Size

**Total Addressable Market (TAM): $180B+**

The TAM is the global API economy ($100B in 2026) intersected with the AI agent execution market ($80B+ by 2030). AgentReady captures value from every agent-to-tool transaction on the internet.

**Serviceable Addressable Market (SAM): $30B**

APIs that are actively called by AI agents (not human-triggered) — growing 200%+ annually.

**Serviceable Obtainable Market (SOM) at Year 5: $500M-$1B**

Capturing 2-3% of agent-to-tool transactions via platform fees, developer subscriptions, and promoted placement.

### Revenue Scenarios

| Scenario | Year 5 ARR | Year 7 ARR | Year 10 ARR |
|---|---|---|---|
| Conservative | $50M | $200M | $500M |
| Base case | $200M | $800M | $2B |
| Bull case | $500M | $2B | $8B |

### Strategic Value

AgentReady becomes strategically valuable to:

- **Cloud providers** (AWS, GCP, Azure) — acquiring AgentReady gives them the default agent tool layer on top of their compute.
- **AI model companies** (Anthropic, OpenAI, Google) — owning the tool execution layer means controlling what agents can do.
- **Payment companies** (Stripe, Adyen) — agent-to-tool billing is the next payments frontier.

Acquisition multiples for infrastructure companies at this scale: 15-30x ARR. At $2B ARR, the company is worth **$30B-$60B**.

### What the Company Looks Like in 10 Years

- **Registry:** 5M+ tools registered, covering every capability an agent could need.
- **Traffic:** 1T+ gateway calls per month. More than most CDNs.
- **Revenue:** $2B+ ARR from transaction fees alone. Additional revenue from enterprise, promoted placement, data.
- **Team:** 500-800 people. Engineering-heavy. Offices in SF, London, Helsinki, Singapore.
- **Standard:** The Tool Definition Schema is a W3C recommendation. "AgentReady compatible" is a badge on every API landing page — like "Works with Stripe" or "Runs on AWS."
- **Moat:** Decade of usage data. Billions of tool calls feeding the ranking engine. Ecosystem lock-in across every major agent framework, cloud provider, and API provider.
- **Status:** The default infrastructure layer for the autonomous internet. When an AI agent needs to do something in the real world, it goes through AgentReady.

---

## APPENDIX — RELATIONSHIP TO THIS PROJECT

This document describes the platform vision. The starting point is the code in this repository:

| Current | Evolution |
|---|---|
| `agent-ready-api` npm package | Open-source distribution channel and developer on-ramp |
| Fastify plugin (self-hosted discovery) | Adds optional `agentReadyKey` for auto-registration to hosted registry |
| robots.txt, llms.txt, agent.json, MCP endpoint | Local discovery that bridges to global discovery |
| Scanner filter | Becomes gateway-level scanner detection |
| Weather API example | First seed tool in the hosted registry |

The open-source package **is** the growth engine. The hosted platform **is** the business.

---

*This document is a living blueprint. Every section should be revisited quarterly as the market evolves.*
