/**
 * Recommended CORS options for public APIs that need to be called by AI agents
 * and MCP clients from any origin (browsers, Cursor, Claude Desktop, etc.).
 *
 * Use with @fastify/cors:
 *   import cors from '@fastify/cors';
 *   import { getCorsPreset } from 'agent-ready-api';
 *   await fastify.register(cors, getCorsPreset());
 */
export function getCorsPreset(): {
  origin: true;
  credentials: boolean;
  exposedHeaders: string[];
} {
  return {
    origin: true,
    credentials: true,
    exposedHeaders: ['PAYMENT-REQUIRED', 'PAYMENT-RESPONSE'],
  };
}
