import { z } from 'zod';

const endpointParamSchema = z.object({
  type: z.string(),
  required: z.boolean().optional(),
  description: z.string().optional(),
});

export const endpointSchema = z.object({
  path: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  description: z.string(),
  free: z.boolean().optional(),
  price: z.number().optional(),
  params: z.record(endpointParamSchema).optional(),
});

export const providerSchema = z
  .object({
    name: z.string(),
    url: z.string().url().optional(),
    email: z.string().email().optional(),
    organization: z.string().optional(),
  })
  .optional();

export const featuresSchema = z
  .object({
    robotsTxt: z.boolean().optional(),
    llmsTxt: z.boolean().optional(),
    agentJson: z.boolean().optional(),
    mcpEndpoint: z.boolean().optional(),
    mcpServerCard: z.boolean().optional(),
    scannerFilter: z.boolean().optional(),
    corsPreset: z.boolean().optional(),
    healthCheck: z.boolean().optional(),
  })
  .optional();

export const asterpaySchema = z
  .object({
    kya: z.boolean().optional(),
    x402: z.boolean().optional(),
    settlement: z.enum(['EUR', 'USD', 'GBP']).optional(),
    apiKey: z.string().optional(),
  })
  .optional();

export const scannerFilterSchema = z
  .object({
    additionalUAs: z.array(z.string()).optional(),
    additionalPaths: z.array(z.string()).optional(),
    onScannerDetected: z.function().optional(),
  })
  .optional();

export const agentReadyConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  baseUrl: z.string().url(),

  endpoints: z.array(endpointSchema).min(1),

  provider: providerSchema,
  version: z.string().optional(),
  documentationUrl: z.string().url().optional(),
  protocols: z.array(z.string()).optional(),
  chains: z.array(z.string()).optional(),
  tokens: z.array(z.string()).optional(),

  features: featuresSchema,

  asterpay: asterpaySchema,

  scannerFilter: scannerFilterSchema,
});

export type EndpointParam = z.infer<typeof endpointParamSchema>;
export type EndpointConfig = z.infer<typeof endpointSchema>;
export type ProviderConfig = z.infer<typeof providerSchema>;
export type FeaturesConfig = z.infer<typeof featuresSchema>;
export type AsterpayConfig = z.infer<typeof asterpaySchema>;
export type ScannerFilterConfig = z.infer<typeof scannerFilterSchema>;
export type AgentReadyConfig = z.infer<typeof agentReadyConfigSchema>;

const DEFAULT_FEATURES: Required<NonNullable<AgentReadyConfig['features']>> = {
  robotsTxt: true,
  llmsTxt: true,
  agentJson: true,
  mcpEndpoint: true,
  mcpServerCard: true,
  scannerFilter: true,
  corsPreset: true,
  healthCheck: true,
};

export function normalizeConfig(raw: AgentReadyConfig): AgentReadyConfig & { features: Required<NonNullable<AgentReadyConfig['features']>> } {
  const parsed = agentReadyConfigSchema.parse(raw);
  return {
    ...parsed,
    features: { ...DEFAULT_FEATURES, ...parsed.features },
  };
}
