import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { normalizeConfig } from './config.js';
import type { AgentReadyConfig } from './config.js';
import { registerDiscoveryRoutes } from './routes/discovery.js';
import { registerMcpRoutes } from './routes/mcp.js';
import { createScannerFilter } from './middleware/scanner-filter.js';

async function agentReadyPlugin(
  fastify: FastifyInstance,
  options: AgentReadyConfig
) {
  const config = normalizeConfig(options);

  if (config.features.scannerFilter) {
    fastify.addHook('preHandler', createScannerFilter(config.scannerFilter));
  }

  registerDiscoveryRoutes(fastify, config);
  registerMcpRoutes(fastify, config);

  fastify.log?.info?.({ name: config.name }, 'agent-ready: discovery and MCP routes registered');
}

export const agentReady = fp(agentReadyPlugin, {
  name: 'agent-ready-api',
});
