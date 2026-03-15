# agent-ready-api — Tarkat viestit ja ohjeet kanaville

Kopioi viestit code blockeista. Korvaa npm-linkki oikealla, kun paketti on julkaistu.

**Huom:** Tämä projekti on erillinen tuote (ei AsterPay). Pakettinimi: **agent-ready-api**. npm: https://www.npmjs.com/package/agent-ready-api (päivitä kun julkaistu).

---

## 1. TWITTER/X

### Ohje
1. Kirjaudu tilillesi.
2. Klikkaa **Post** (twiitti).
3. Liitä alla oleva teksti. Tarkista että linkki on kokonaisena.
4. (Valinnainen) Lisää 1–2 hashtagia: `#AIagents` `#nodejs`
5. Julkaise.

### Pääpostaus (yksi twiitti)

```text
We kept hitting the same wall: making our API discoverable to AI agents meant manually adding robots.txt, llms.txt, agent.json, MCP endpoint, CORS, and scanner filters. So we packaged it.

agent-ready-api — one Fastify plugin, your API is agent-ready.

npm install agent-ready-api fastify

https://www.npmjs.com/package/agent-ready-api
```

### Vaihtoehto: lyhyempi twiitti

```text
One Fastify plugin = robots.txt, llms.txt, agent.json, MCP endpoint, scanner filter. Your API, agent-ready.

npm install agent-ready-api fastify

https://www.npmjs.com/package/agent-ready-api
```

### Seuraaja-twiitti (jos haluat ketjun)

```text
What you get automatically:
• /robots.txt (AI crawlers welcome)
• /llms.txt (LLM-readable API overview)
• /.well-known/agent.json (A2A)
• /mcp (JSON-RPC 2.0)
• Scanner bot filter (no LeakIX/Shodan spam in logs)
```

### Vastaus kun joku twiittaa x402 / AI API / MCP -aiheesta

```text
If you're on Fastify, we just shipped agent-ready-api — one plugin adds robots.txt, llms.txt, agent.json, MCP endpoint and scanner filter. No OpenAPI needed. https://www.npmjs.com/package/agent-ready-api
```

---

## 2. LINKEDIN

### Ohje
1. Kirjaudu LinkedIniin.
2. **Aloita postaus** (Share an article, photo, video or idea).
3. Liitä otsikko + teksti alla olevasta.
4. Lisää linkki: `https://www.npmjs.com/package/agent-ready-api`
5. Julkaise (voit rajoittaa näkyvyyttä "Connections" tai "Public").

### Postaus

```text
We open-sourced the plumbing we built to make our API discoverable to AI agents.

Problem: Getting Claude, Cursor, and other agents to find and call your API usually means manually adding robots.txt, llms.txt, A2A agent cards, MCP endpoints, CORS headers, and filters for scanner traffic. We did that and then packaged it.

agent-ready-api is a single Fastify plugin. You pass a config (name, baseUrl, endpoints). It registers /robots.txt, /llms.txt, /.well-known/agent.json, MCP JSON-RPC, and a scanner filter so security bots don't flood your logs. Optional CORS/Helmet presets for cross-origin agent calls.

If you're building an API that AI agents should discover and use, this gets you there in one line.

npm install agent-ready-api fastify
https://www.npmjs.com/package/agent-ready-api
```

---

## 3. DEV.TO

### Ohje
1. Mene https://dev.to/new.
2. **Title:** kopioi alla oleva otsikko.
3. **Tags:** lisää tagit pilkulla (ai, node, fastify, api, mcp).
4. **Body:** korvaa koko body alla olevalla markdownilla (kopioi code blockin sisältö).
5. **Canonical URL:** jätä tyhjäksi tai `https://www.npmjs.com/package/agent-ready-api`.
6. **Publish**.

### Otsikko

```text
Make any API AI-agent discoverable in one line with agent-ready-api
```

### Body (markdown)

```markdown
Getting your API in front of AI agents usually means a lot of manual work: robots.txt that allows GPTBot/ClaudeBot, llms.txt, A2A agent cards, MCP endpoints, CORS and security headers, and filtering out security scanner traffic.

We needed all of that and then turned it into a single Fastify plugin so anyone can do the same in one call.

## Install

```bash
npm install agent-ready-api fastify
```

## Use

```javascript
import Fastify from 'fastify';
import { agentReady } from 'agent-ready-api';

const fastify = Fastify();
await fastify.register(agentReady, {
  name: 'My API',
  description: 'What your API does',
  baseUrl: 'https://api.example.com',
  endpoints: [
    { path: '/health', method: 'GET', description: 'Health check', free: true },
    { path: '/data', method: 'GET', description: 'Get data', price: 0.01 },
  ],
});

// Your routes...
await fastify.listen({ port: 3000 });
```

Your API now serves `/robots.txt`, `/llms.txt`, `/.well-known/agent.json`, `/.well-known/mcp/server-card.json`, `/mcp` (MCP JSON-RPC), and `/health`. Optional: `getCorsPreset()` and `getHelmetPreset()` for cross-origin agent calls, and a built-in scanner filter (`request.isScanner`) so you can skip logging Shodan/LeakIX hits.

Docs and a small Weather API example: https://www.npmjs.com/package/agent-ready-api
```

---

## 4. HACKER NEWS

### Ohje A: Uusi "Show HN" -postaus
1. Mene https://news.ycombinator.com/submit.
2. **Title:** alla oleva otsikko.
3. **URL:** `https://www.npmjs.com/package/agent-ready-api`
4. **Text:** jätä tyhjäksi (kun laitat URL:n, text jätetään usein tyhjäksi).
5. Submit.
6. Heti postauksen jälkeen: kirjoita **ensimmäinen kommentti** (alla oleva teksti), jotta konteksti on selvä.

### Show HN -otsikko

```text
Show HN: agent-ready-api – Make any API AI-agent discoverable (one Fastify plugin)
```

### Ensimmäinen kommentti (lisää postauksen alle)

```text
We built this and then extracted it. One Fastify plugin adds:
- /robots.txt (AI-crawler friendly)
- /llms.txt
- /.well-known/agent.json (A2A)
- /mcp (MCP JSON-RPC 2.0)
- Scanner bot filter (so LeakIX/Shodan don't flood your logs)

Config is just name, baseUrl, and endpoints[] — no OpenAPI required. Optional CORS/Helmet presets for cross-origin agent calls. If you're building an API that agents should discover and call, this gets you there in one register() call.
```

### Ohje B: Kommentti olemassa olevaan ketjuun
Kun näet ketjun (esim. "x402", "AI API", "MCP", "agent payments"): avaa ketju, klikkaa "reply", liitä alla oleva teksti.

### Kommenttiteksti (olemassa olevaan ketjuun)

```text
We built exactly this and shipped it as a reusable package: agent-ready-api (npm). One Fastify plugin adds robots.txt, llms.txt, agent.json, MCP endpoint, and a scanner bot filter. No OpenAPI required — you pass name, baseUrl, endpoints[]. Optional CORS/Helmet presets. https://www.npmjs.com/package/agent-ready-api
```

---

## 5. DISCORD | 6. TELEGRAM | 7. REDDIT | 8. SLACK

Käytä samoja rakenteita kuin yllä ja korvaa pakettinimi/linkki: **agent-ready-api**, https://www.npmjs.com/package/agent-ready-api
