# Announcement drafts for agent-ready-api

Use these for Twitter/X, Hacker News, and Dev.to. Copy from the code blocks.

**Huom:** Korvaa npm-linkki oikealla julkaisulinkillä, kun paketti on julkaistu (esim. https://www.npmjs.com/package/agent-ready-api).

---

## Twitter/X post

```text
We kept hitting the same wall: making our API discoverable to AI agents meant manually adding robots.txt, llms.txt, agent.json, MCP endpoint, CORS, and scanner filters. So we packaged it.

agent-ready-api — one Fastify plugin, your API is agent-ready.

npm install agent-ready-api fastify

https://www.npmjs.com/package/agent-ready-api
```

---

## Hacker News comment (e.g. on a relevant thread about AI APIs or x402)

```text
We built exactly this and then extracted it into a reusable package: agent-ready-api (npm). One Fastify plugin adds robots.txt (AI-crawler friendly), llms.txt, /.well-known/agent.json, MCP JSON-RPC endpoint, and a scanner bot filter so you don't get spammed by LeakIX/Shodan. Optional CORS/Helmet presets for cross-origin agent calls. No OpenAPI required — you pass a simple config with name, baseUrl, and endpoints[]. If you're building an API that agents should discover and call, this gets you there in one register() call. https://www.npmjs.com/package/agent-ready-api
```

---

## Dev.to article (short post)

**Title:** Make any API AI-agent discoverable in one line with agent-ready-api

**Tags:** ai, node, fastify, api, agents, mcp

**Body (markdown):** Katso LAUNCH-MESSAGES.md → Dev.to -osio (täysi markdown).
