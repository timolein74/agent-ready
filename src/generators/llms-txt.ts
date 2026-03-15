import type { AgentReadyConfig, EndpointConfig } from '../config.js';

function formatEndpoint(e: EndpointConfig): string {
  const price = e.free ? ' (free)' : e.price != null ? ` — $${e.price}` : '';
  return `- ${e.method} ${e.path} — ${e.description}${price}`;
}

export function generateLlmsTxt(config: AgentReadyConfig): string {
  const baseUrl = config.baseUrl.replace(/\/$/, '');
  const free = config.endpoints.filter((e) => e.free === true);
  const paid = config.endpoints.filter((e) => !e.free && e.price != null);
  const other = config.endpoints.filter((e) => !e.free && e.price == null);

  const lines = [
    `# ${config.name}`,
    '',
    `> ${config.description}`,
    '',
    `## Base URL: ${baseUrl}`,
    '',
  ];

  if (free.length > 0) {
    lines.push('## Free Endpoints (no payment required)', '');
    free.forEach((e) => lines.push(formatEndpoint(e)));
    lines.push('');
  }

  if (paid.length > 0) {
    lines.push('## Paid Endpoints', '');
    paid.forEach((e) => lines.push(formatEndpoint(e)));
    lines.push('');
  }

  if (other.length > 0) {
    lines.push('## Other Endpoints', '');
    other.forEach((e) => lines.push(formatEndpoint(e)));
    lines.push('');
  }

  if (config.protocols?.length) {
    lines.push(`## Protocols: ${config.protocols.join(', ')}`, '');
  }
  if (config.chains?.length) {
    lines.push(`## Chains: ${config.chains.join(', ')}`, '');
  }

  lines.push('## Discovery', '');
  lines.push('- GET /robots.txt — crawl rules', '');
  lines.push('- GET /llms.txt — this file', '');
  lines.push('- GET /.well-known/agent.json — A2A agent card', '');
  lines.push('- POST /mcp — MCP JSON-RPC 2.0', '');

  if (config.documentationUrl) {
    lines.push('', `## Docs: ${config.documentationUrl}`);
  }
  if (config.provider?.url) {
    lines.push('', `## Provider: ${config.provider.url}`);
  }

  return lines.join('\n');
}
