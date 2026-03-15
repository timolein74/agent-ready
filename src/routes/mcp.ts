import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { AgentReadyConfig, EndpointConfig } from '../config.js';

const PROTOCOL_VERSION = '2024-11-05';

function endpointToTool(e: EndpointConfig, index: number) {
  const name = e.path
    .replace(/^\//, '')
    .replace(/\//g, '_')
    .replace(/\{[^}]+\}/g, 'id')
    .replace(/\?.*$/, '')
    .slice(0, 40) || `endpoint_${index}`;
  const properties: Record<string, { type: string; description?: string }> = {};
  const required: string[] = [];
  if (e.params) {
    for (const [k, v] of Object.entries(e.params)) {
      properties[k] = { type: v.type, description: v.description };
      if (v.required) required.push(k);
    }
  }
  return {
    name,
    description: e.description + (e.free ? ' Free.' : e.price != null ? ` $${e.price}.` : ''),
    inputSchema: {
      type: 'object' as const,
      properties,
      required,
    },
  };
}

function buildRequestUrl(baseUrl: string, path: string, params: Record<string, unknown>): string {
  const url = new URL(path.startsWith('http') ? path : baseUrl.replace(/\/$/, '') + path);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const pathWithParam = url.pathname.replace(`{${k}}`, String(v));
    if (pathWithParam !== url.pathname) {
      url.pathname = pathWithParam;
    } else {
      url.searchParams.set(k, String(v));
    }
  }
  url.pathname = url.pathname.replace(/\{[^}]+\}/g, (m) => {
    const key = m.slice(1, -1);
    return params[key] != null ? String(params[key]) : m;
  });
  return url.toString();
}

function jsonRpcResponse(id: unknown, result: unknown) {
  return { jsonrpc: '2.0', id, result };
}

function jsonRpcError(id: unknown, code: number, message: string) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

export function registerMcpRoutes(
  fastify: FastifyInstance,
  config: AgentReadyConfig & { features: { mcpEndpoint: boolean } }
) {
  if (!config.features.mcpEndpoint) return;

  const baseUrl = config.baseUrl.replace(/\/$/, '');
  const tools = config.endpoints.map((e, i) => endpointToTool(e, i));
  const discoverTool = {
    name: 'discover_endpoints',
    description: `List all ${config.name} endpoints with URLs, methods, and parameters.`,
    inputSchema: { type: 'object' as const, properties: {} },
  };
  const allTools = [discoverTool, ...tools];

  fastify.post('/mcp', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { jsonrpc?: string; method?: string; params?: { name?: string; arguments?: Record<string, unknown> }; id?: unknown };

    if (!body || body.jsonrpc !== '2.0' || !body.method) {
      return reply.status(400).send(jsonRpcError(body?.id ?? null, -32600, 'Invalid JSON-RPC request'));
    }

    const { method, params, id } = body;

    try {
      switch (method) {
        case 'initialize':
          return reply.send(
            jsonRpcResponse(id, {
              protocolVersion: PROTOCOL_VERSION,
              serverInfo: { name: config.name, version: config.version ?? '1.0.0' },
              capabilities: { tools: {} },
            })
          );

        case 'notifications/initialized':
          return reply.status(200).send({});

        case 'tools/list':
          return reply.send(jsonRpcResponse(id, { tools: allTools }));

        case 'tools/call': {
          const toolName = params?.name as string;
          const toolArgs = (params?.arguments || {}) as Record<string, unknown>;

          if (toolName === 'discover_endpoints') {
            const list = config.endpoints.map((e) => ({
              method: e.method,
              path: e.path,
              url: baseUrl + e.path,
              description: e.description,
              free: e.free ?? false,
              price: e.price,
              params: e.params,
            }));
            return reply.send(
              jsonRpcResponse(id, {
                content: [{ type: 'text', text: JSON.stringify({ endpoints: list, baseUrl }, null, 2) }],
              })
            );
          }

          const idx = allTools.findIndex((t) => t.name === toolName);
          if (idx < 1) {
            return reply.send(
              jsonRpcResponse(id, {
                content: [{ type: 'text', text: `Unknown tool: ${toolName}` }],
                isError: true,
              })
            );
          }

          const endpoint = config.endpoints[idx - 1];
          const requestUrl = buildRequestUrl(baseUrl, endpoint.path, toolArgs);
          const spec = {
            method: endpoint.method,
            url: requestUrl,
            description: endpoint.description,
          };
          return reply.send(
            jsonRpcResponse(id, {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      request: spec,
                      message: 'Issue this HTTP request to get the result. Response body will contain the data.',
                    },
                    null,
                    2
                  ),
                },
              ],
            })
          );
        }

        case 'ping':
          return reply.send(jsonRpcResponse(id, {}));

        default:
          return reply.send(jsonRpcError(id, -32601, `Method not found: ${method}`));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Internal error';
      return reply.send(jsonRpcError(id, -32603, msg));
    }
  });

  fastify.get('/mcp', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(405).send({ error: 'Use POST for MCP JSON-RPC calls' });
  });
}
