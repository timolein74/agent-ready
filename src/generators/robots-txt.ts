import type { AgentReadyConfig } from '../config.js';

const AI_CRAWLERS = [
  'User-agent: GPTBot',
  'Allow: /',
  '',
  'User-agent: ClaudeBot',
  'Allow: /',
  '',
  'User-agent: Google-Extended',
  'Allow: /',
  '',
  'User-agent: PerplexityBot',
  'Allow: /',
  '',
  'User-agent: Applebot-Extended',
  'Allow: /',
];

export function generateRobotsTxt(config: AgentReadyConfig, allowPaths: string[] = []): string {
  const baseUrl = config.baseUrl.replace(/\/$/, '');
  const lines = [
    `# ${config.name} — AI Agent Discoverable API`,
    '# We WANT AI agents, LLMs, and crawlers to discover this API',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    ...allowPaths.map((p) => `Allow: ${p}`),
    '',
    '# AI/LLM crawlers explicitly welcome',
    ...AI_CRAWLERS,
  ];
  return lines.join('\n');
}
