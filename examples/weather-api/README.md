# Weather API example

Minimal Fastify API that uses `agent-ready-api` to make the API discoverable by AI agents.

## Run

From this directory:

```bash
npm install
npm start
```

Then try:

- http://localhost:3000/llms.txt
- http://localhost:3000/.well-known/agent.json
- http://localhost:3000/robots.txt
- http://localhost:3000/health
- http://localhost:3000/current?city=Helsinki
- POST http://localhost:3000/mcp with JSON-RPC body `{"jsonrpc":"2.0","id":1,"method":"tools/list"}`

When using the published npm package, replace `"file:../.."` in package.json with `"agent-ready-api"`.
