import type { AgentReadyConfig, EndpointConfig } from '../config.js';

function endpointToTool(e: EndpointConfig): { name: string; description: string } {
  const name = e.path
    .replace(/^\//, '')
    .replace(/\//g, '_')
    .replace(/\{[^}]+\}/g, 'id')
    .replace(/\?.*$/, '')
    .slice(0, 40) || 'call';
  return {
    name,
    description: e.description + (e.free ? ' Free.' : e.price != null ? ` $${e.price}.` : ''),
  };
}

export function generateMcpServerCard(config: AgentReadyConfig): object {
  const baseUrl = config.baseUrl.replace(/\/$/, '');
  const tools = config.endpoints.map(endpointToTool);

  const out: Record<string, unknown> = {
    name: config.name,
    description: config.description,
    version: config.version ?? '1.0.0',
    homepage: config.provider?.url ?? baseUrl,
    tools,
    license: 'MIT',
  };

  if (config.provider) {
    out.author = {
      name: config.provider.name,
      url: config.provider.url,
      email: config.provider.email,
    };
  }
  if (config.protocols?.length) {
    out.protocols = config.protocols;
  }

  return out;
}
