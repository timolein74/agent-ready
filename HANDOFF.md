# Agent-Ready API — Handoff to New Product / Agent

**Päivitetty:** 16.3.2026  
**Tarkoitus:** Erillinen tuote/yritysnimi; kehitys tapahtuu tässä projektissa (`P:\2026\Cursor\agent ready API`). Alkuperäinen paketti jää npm:ään muuttumattomana.

---

## 1. Päätös ja nykytila

- **npm-paketti** `@asterpay/agent-ready` (v0.1.0) on julkaistu: https://www.npmjs.com/package/@asterpay/agent-ready  
- **Päätös:** Ei tehdä tälle paketille enää muutoksia AsterPayn payment layer -repossa. Tuote siirretään erilliseksi projektiksi ja mahdollisesti uudella yritys-/tuotenimellä.
- **Kehitys jatkuu:** Tässä hakemistossa: `P:\2026\Cursor\agent ready API`
- **Lähdekoodi (viimeisin täysi versio):** `c:\cursor\2026\payment layer\agent-ready` (kopioi tänne tai forkkaa, jos haluat pohjan).

---

## 2. Mitä tuote tekee

Yksi Fastify-plugin, jolla API:sta tulee AI-agenteille löydettävissä:

- **robots.txt** — AI-crawler -ystävälliset säännöt (GPTBot, ClaudeBot, jne.)
- **llms.txt** — LLM-luettava API-kuvaus
- **/.well-known/agent.json** — A2A agent card
- **/.well-known/mcp/server-card.json** — MCP-rekisteri metadata
- **/mcp** — MCP JSON-RPC 2.0 -endpoint (tools/list, tools/call, discover_endpoints)
- **/health** — Health check
- **Scanner filter** — `request.isScanner` + mahdollisuus olla lähettämättä ilmoituksia (LeakIX, Shodan, Satring-Scraper, staattiset polut)
- **CORS/Helmet presetit** — `getCorsPreset()`, `getHelmetPreset()` cross-origin -kutsuja varten

Config: `name`, `description`, `baseUrl`, `endpoints[]` (path, method, description, free/price, params). Ei pakollista OpenAPI-specia.

---

## 3. Rakenne (alkuperäinen repo)

```
agent-ready/
├── package.json          # name: @asterpay/agent-ready, version 0.1.0
├── tsconfig.json
├── README.md
├── ANNOUNCE.md           # Lyhyet twiitti/HN/Dev.to -draftit
├── LAUNCH-MESSAGES.md    # Tarkat viestit + ohjeet kanaville (Twitter, LinkedIn, Dev.to, HN, Discord, Telegram, Reddit, Slack)
├── examples/
│   └── weather-api/      # server.js, package.json, README
└── src/
    ├── index.ts          # export agentReady, getCorsPreset, getHelmetPreset, isScannerRequest, createScannerFilter
    ├── config.ts         # AgentReadyConfig (Zod), normalizeConfig()
    ├── plugin.ts         # Fastify plugin
    ├── generators/
    │   ├── robots-txt.ts
    │   ├── llms-txt.ts
    │   ├── agent-json.ts
    │   └── mcp-server-card.ts
    ├── routes/
    │   ├── discovery.ts  # /robots.txt, /llms.txt, /.well-known/agent.json, /.well-known/mcp/server-card.json, /health
    │   └── mcp.ts        # POST /mcp JSON-RPC
    └── middleware/
        ├── scanner-filter.ts  # SCANNER_UA, SCANNER_PATHS, isScannerRequest(), createScannerFilter()
        ├── cors-preset.ts     # getCorsPreset()
        └── headers.ts         # getHelmetPreset()
```

---

## 4. Riippuvuudet

- **dependencies:** fastify-plugin, zod  
- **peerDependencies:** fastify ^4.0.0  
- **devDependencies:** @types/node, fastify, typescript  
- **build:** `npm run build` → `tsc`, tulostus `dist/`

---

## 5. Viimeisimmät muutokset (konteksti)

Nämä koskevat **AsterPayn payment layer -repossa** olevia asioita; uusi agent voi huomioida ne jos teet integraatioita tai viittauksia.

- **InsumerAPI keygen URL:** Kaikki keygen-curlit päivitetty käyttämään `https://api.insumermodel.com/v1/keys/create` (ei enää Cloud Functions -URL). Blog-draft: `contracts/erc8183-kya-hook/docs/blog-first-iacphook-with-attestation.md`.
- **Telegram discovery -ilmoitukset:** x402-api:n middleware suodattaa nyt pois mm. Satring-Scraper, Thinkbot, polut `/css/`, `/assets/`, `/static/`, `/.well-known/satring-verify`, `/.git`, `/js/twint_ch.js`, `/js/lkk_ch.js`, `/sys_files/` jotta "API Discovery Hit!" -viestit eivät tulvi Telegramiin. Toteutus: `x402-api/src/middleware/x402.ts` (SCANNER_UA, SCANNER_PATHS).
- **Douglas Borthwick (Telegram):** Insumer siirsi API:n Cloudflare-proxyn taakse. Kuittausviesti Douglasille: "Done — updated the keygen curl in our blog draft to api.insumermodel.com/v1/keys/create. Thanks for the heads up."

---

## 6. Mainonta- ja launch-materiaali

- **ANNOUNCE.md** — Lyhyet kopioitavissa olevat tekstit: Twitter, HN-kommentti, Dev.to-artikkelin body.  
- **LAUNCH-MESSAGES.md** — Kanavakohtaiset ohjeet ja viestit: Twitter, LinkedIn, Dev.to, Hacker News, Discord, Telegram, Reddit, Slack. Twitter-handle viesteissä: @Asterpayment.

Uudella tuotteella/brändillä korvaa pakettinimi ja linkit (npm, repo) uusilla.

---

## 7. Ohjeet uudelle agentille / kehittäjälle

1. **Kehityspolku:** Kaikki uusi kehitys tapahtuu tässä projektissa: `P:\2026\Cursor\agent ready API`.
2. **Pohja:** Voit kopioida koko `agent-ready`-kansion tähän hakemistoon tai kloonata repo (jos siirrät repon uudelle orgille/brändille).
3. **Uusi tuote/yritysnimi:** Päätä uusi nimi (ei AsterPay / @asterpay). Päivitä package.json (name, description, repository, keywords), README, LAUNCH-MESSAGES/ANNOUNCE -viittaukset ja mahdollinen uusi npm-paketti (esim. `@newname/agent-ready` tai `agent-ready-api`).
4. **@asterpay/agent-ready:** Jätetään npm:ään sellaisenaan; sitä ei enää ylläpidetä tästä reposta. Uusi julkaisu = uusi paketti uudella nimellä.
5. **Scanner-lista:** Jos uudessa tuotteessa on oma API ja Telegram-ilmoitukset, voit käyttää samaa logiikkaa kuin x402-api (SCANNER_UA, SCANNER_PATHS); lista on `agent-ready/src/middleware/scanner-filter.ts` ja x402-api:n `x402.ts`.

---

## 8. Tiedostot tässä projektissa (P:\2026\Cursor\agent ready API)

- **HANDOFF.md** (tämä tiedosto) — kaikki yllä oleva konteksti ja ohjeet.

Tarvittaessa kopioi tähän myös:
- koko `agent-ready`-kansion sisältö (src, examples, package.json, tsconfig, README, ANNOUNCE, LAUNCH-MESSAGES), tai  
- linkki/vain tärkeimmät tiedostot (package.json, README, src/index.ts, plugin.ts, config.ts) ja viittaus alkuperäiseen polkuun.

---

## 9. Yhteenveto

| Asia | Arvo |
|------|------|
| Npm (nykyinen) | https://www.npmjs.com/package/@asterpay/agent-ready v0.1.0 |
| Uudet muutokset | Ei enää AsterPay-repossa |
| Kehitys jatkuu | P:\2026\Cursor\agent ready API |
| Lähdekoodi (pohja) | c:\cursor\2026\payment layer\agent-ready |
| Launch-materiaali | LAUNCH-MESSAGES.md, ANNOUNCE.md (agent-ready -kansiossa) |
| Viime päivän muutokset | InsumerAPI keygen URL, Telegram scanner filter (x402-api), Douglas-kuittaus |
