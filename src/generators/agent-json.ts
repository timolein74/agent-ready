import type { AgentReadyConfig, EndpointConfig } from '../config.js';

function endpointToSkill(e: EndpointConfig): { id: string; name: string; description: string; tags: string[] } {
  const id = e.path
    .replace(/^\//, '')
    .replace(/\//g, '_')
    .replace(/\{[^}]+\}/g, 'id')
    .replace(/\?.*$/, '') || 'root';
  return {
    id,
    name: e.description.slice(0, 80),
    description: e.description,
    tags: e.free ? ['free'] : ['paid'],
  };
}

export function generateAgentJson(config: AgentReadyConfig): object {
  const baseUrl = config.baseUrl.replace(/\/$/, '');
  const skills = config.endpoints.map(endpointToSkill);

  const endpoints: Record<string, { method: string; path: string; description: string; authentication: string }> = {};
  config.endpoints.forEach((e, i) => {
    endpoints[`e${i}`] = {
      method: e.method,
      path: e.path,
      description: e.description,
      authentication: e.free ? 'none' : 'x402',
    };
  });

  const out: Record<string, unknown> = {
    name: config.name,
    description: config.description,
    url: baseUrl,
    version: config.version ?? '1.0.0',
    documentationUrl: config.documentationUrl ?? config.provider?.url ?? baseUrl,
    capabilities: { streaming: false, pushNotifications: false },
    defaultInputModes: ['application/json'],
    defaultOutputModes: ['application/json'],
    skills,
    endpoints,
    authentication: { schemes: config.asterpay?.x402 ? ['x402'] : ['none'] },
  };

  if (config.provider) {
    out.provider = {
      organization: config.provider.organization ?? config.provider.name,
      url: config.provider.url,
    };
  }
  if (config.protocols?.length) {
    out.protocols = config.protocols;
  }
  if (config.chains?.length) {
    out.supportedChains = config.chains;
  }
  if (config.tokens?.length) {
    out.supportedTokens = config.tokens;
  }
  if (config.asterpay?.settlement) {
    out.settlementCurrencies = [config.asterpay.settlement];
  }

  return out;
}
