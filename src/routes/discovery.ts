import type { FastifyInstance } from 'fastify';
import type { AgentReadyConfig } from '../config.js';
import { generateRobotsTxt } from '../generators/robots-txt.js';
import { generateLlmsTxt } from '../generators/llms-txt.js';
import { generateAgentJson } from '../generators/agent-json.js';
import { generateMcpServerCard } from '../generators/mcp-server-card.js';

type ConfigWithFeatures = AgentReadyConfig & {
  features: Required<NonNullable<AgentReadyConfig['features']>>;
};

const DISCOVERY_PATHS = [
  '/robots.txt',
  '/llms.txt',
  '/.well-known/agent.json',
  '/.well-known/mcp/server-card.json',
  '/mcp',
  '/health',
];

export function registerDiscoveryRoutes(
  fastify: FastifyInstance,
  config: ConfigWithFeatures
) {
  if (config.features.robotsTxt) {
    fastify.get('/robots.txt', async (_request, reply) => {
      reply.type('text/plain');
      return generateRobotsTxt(config, DISCOVERY_PATHS);
    });
  }

  if (config.features.llmsTxt) {
    fastify.get('/llms.txt', async (_request, reply) => {
      reply.type('text/plain');
      return generateLlmsTxt(config);
    });
  }

  if (config.features.agentJson) {
    fastify.get('/.well-known/agent.json', async (_request, reply) => {
      reply.type('application/json');
      return generateAgentJson(config);
    });
  }

  if (config.features.mcpServerCard) {
    fastify.get('/.well-known/mcp/server-card.json', async (_request, reply) => {
      reply.type('application/json');
      return generateMcpServerCard(config);
    });
  }

  if (config.features.healthCheck) {
    fastify.get('/health', async () => ({
      status: 'ok',
      service: config.name,
      version: config.version ?? '1.0.0',
      timestamp: new Date().toISOString(),
    }));
  }
}
