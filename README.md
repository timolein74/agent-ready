# agent-ready-api

Make any API AI-agent discoverable in one line.

Add `robots.txt`, `llms.txt`, `/.well-known/agent.json`, MCP endpoint, scanner bot filter, and CORS presets so AI agents (Claude, GPT, Cursor, A2A) can find and use your API.

## Install

```bash
npm install agent-ready-api fastify
```

## Quick start

```typescript
import Fastify from 'fastify';
import { agentReady } from 'agent-ready-api';

const fastify = Fastify();

await fastify.register(agentReady, {
  name: 'My API',
  description: 'Description for AI agents',
  baseUrl: 'https://api.example.com',
  endpoints: [
    { path: '/health', method: 'GET', description: 'Health check', free: true },
    { path: '/data', method: 'GET', description: 'Get data', price: 0.01 },
  ],
});

// Your API routes...
await fastify.listen({ port: 3000 });
```

Your API now serves:

- `/robots.txt` — AI crawler–friendly rules
- `/llms.txt` — LLM-readable API overview
- `/.well-known/agent.json` — A2A agent card
- `/.well-known/mcp/server-card.json` — MCP registry metadata
- `/mcp` — MCP JSON-RPC 2.0 endpoint
- `/health` — Health check

## CORS and security headers (recommended)

For APIs that agents call from other origins (e.g. Cursor, Claude Desktop), register CORS and Helmet with the provided presets:

```bash
npm install @fastify/cors @fastify/helmet
```

```typescript
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { agentReady, getCorsPreset, getHelmetPreset } from 'agent-ready-api';

await fastify.register(cors, getCorsPreset());
await fastify.register(helmet, getHelmetPreset());
await fastify.register(agentReady, { ... });
```

## Config schema

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `name` | string | Yes | API name (e.g. for agent card) |
| `description` | string | Yes | One-line description for agents |
| `baseUrl` | string | Yes | Full base URL of your API |
| `endpoints` | array | Yes | List of endpoints (path, method, description, free/price) |
| `provider` | object | No | `{ name, url?, email? }` |
| `version` | string | No | API version |
| `documentationUrl` | string | No | Link to docs |
| `protocols` | string[] | No | e.g. `['x402', 'A2A']` |
| `features` | object | No | Toggle routes: `robotsTxt`, `llmsTxt`, `agentJson`, `mcpEndpoint`, `mcpServerCard`, `scannerFilter`, `corsPreset`, `healthCheck` (all default `true`) |
| `scannerFilter` | object | No | `{ additionalUAs?, additionalPaths?, onScannerDetected? }` to treat requests as scanner bots and e.g. skip logging |

Each `endpoints[]` item: `path`, `method` ('GET'|'POST'|'PUT'|'DELETE'|'PATCH'), `description`, `free?`, `price?` (USD), `params?` (object with `type`, `required?`, `description?` per param).

## Scanner filter

The plugin sets `request.isScanner` when the request looks like a security scanner (e.g. LeakIX, Shodan). You can use it to skip noisy logging or notifications:

```typescript
fastify.addHook('preHandler', async (request, reply) => {
  if ((request as any).isScanner) {
    // optional: skip logging or Telegram alerts
  }
});
```

Or pass a callback:

```typescript
await fastify.register(agentReady, {
  ...config,
  scannerFilter: {
    onScannerDetected(ua, path) {
      console.warn('Scanner hit', path, ua);
    },
  },
});
```

## Example: Weather API

See [examples/weather-api](./examples/weather-api) for a minimal Fastify API that uses `agent-ready-api` and exposes a fake weather endpoint.

```bash
cd examples/weather-api && npm install && npm start
# then: curl http://localhost:3000/llms.txt
# and: curl http://localhost:3000/.well-known/agent.json
```

## License

MIT
