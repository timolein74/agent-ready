import Fastify from 'fastify';
import { agentReady } from 'agent-ready-api';

const fastify = Fastify({ logger: true });

await fastify.register(agentReady, {
  name: 'Weather API',
  description: 'Real-time weather data for AI agents. Free current weather, paid 7-day forecast.',
  baseUrl: 'http://localhost:3000',
  provider: { name: 'WeatherCo', url: 'https://weather.example' },
  endpoints: [
    { path: '/health', method: 'GET', description: 'Health check', free: true },
    {
      path: '/current',
      method: 'GET',
      description: 'Current weather for a city',
      free: true,
      params: {
        city: { type: 'string', required: true, description: 'City name' },
      },
    },
    {
      path: '/forecast',
      method: 'GET',
      description: '7-day forecast',
      price: 0.01,
      params: {
        city: { type: 'string', required: true, description: 'City name' },
      },
    },
  ],
  protocols: ['x402', 'A2A'],
});

fastify.get('/current', async (request, _reply) => {
  const { city } = request.query || {};
  return {
    city: city || 'Unknown',
    temp_c: 18,
    condition: 'Partly cloudy',
    updated: new Date().toISOString(),
  };
});

fastify.get('/forecast', async (request, _reply) => {
  const { city } = request.query || {};
  return {
    city: city || 'Unknown',
    days: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 86400000).toISOString().slice(0, 10),
      temp_c: 16 + Math.floor(Math.random() * 8),
      condition: 'Partly cloudy',
    })),
  };
});

await fastify.listen({ port: 3000, host: '0.0.0.0' });
console.log('Weather API with agent-ready: http://localhost:3000');
console.log('Try: GET /llms.txt  GET /.well-known/agent.json  POST /mcp (JSON-RPC)');
