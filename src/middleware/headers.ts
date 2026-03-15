/**
 * Recommended Helmet (security headers) options for public APIs that need to be
 * loaded by AI agents and MCP clients from other origins (cross-origin).
 *
 * Use with @fastify/helmet:
 *   import helmet from '@fastify/helmet';
 *   import { getHelmetPreset } from 'agent-ready-api';
 *   await fastify.register(helmet, getHelmetPreset());
 */
export function getHelmetPreset(): {
  contentSecurityPolicy: false;
  crossOriginResourcePolicy: { policy: 'cross-origin' };
  crossOriginOpenerPolicy: false;
} {
  return {
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: false,
  };
}
