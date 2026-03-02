import { z } from 'zod';

export const AIModelSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  name: z.string(),
  provider: z.string(),
  model_id: z.string(),
  type: z.string(), // z.union se vuelve type string en db
  max_tokens: z.number().nullish().transform(v => v ?? undefined),
  temperature: z.number().nullish().transform(v => v ?? undefined),
  is_active: z.boolean().nullish().transform(v => v ?? undefined),
  cost_per_input_token: z.number().nullish().transform(v => v ?? undefined),
  cost_per_output_token: z.number().nullish().transform(v => v ?? undefined),
  metadata: z.record(z.string(), z.any()).nullish().transform(v => v ?? undefined),
  created_at: z.string().nullish().transform(v => v ?? undefined),
  updated_at: z.string().nullish().transform(v => v ?? undefined),
});

export const AIProviderSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  api_key: z.string().optional(),
  base_url: z.string().optional(),
  is_active: z.boolean(),
  rate_limit: z.number().nullish().transform(v => v ?? undefined),
  metadata: z.record(z.string(), z.any()).nullish().transform(v => v ?? undefined),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AIPromptSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullish().transform(v => v ?? undefined),
  content: z.string(),
  variables: z.array(z.string()).nullish().transform(v => v ?? undefined),
  model_id: z.string().uuid().nullish().transform(v => v ?? undefined),
  category: z.string().nullish().transform(v => v ?? undefined),
  is_active: z.boolean(),
  version: z.number(),
  metadata: z.record(z.string(), z.any()).nullish().transform(v => v ?? undefined),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AITaskSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  model_id: z.string().uuid(),
  prompt_id: z.string().uuid().nullish().transform(v => v ?? undefined),
  type: z.string(),
  status: z.union([z.literal('pending'), z.literal('processing'), z.literal('completed'), z.literal('failed')]),
  input: z.string(),
  output: z.string().optional(),
  input_tokens: z.number(),
  output_tokens: z.number(),
  cost: z.number(),
  latency_ms: z.number(),
  error: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  user_email: z.string().optional(),
  created_at: z.string(),
  completed_at: z.string().nullish().transform(v => v ?? undefined),
});

export const AIBatchSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  model_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullish().transform(v => v ?? undefined),
  status: z.union([z.literal('pending'), z.literal('processing'), z.literal('completed'), z.literal('failed')]),
  total_tasks: z.number(),
  completed_tasks: z.number(),
  failed_tasks: z.number(),
  total_cost: z.number(),
  created_at: z.string(),
  completed_at: z.string().nullish().transform(v => v ?? undefined),
});

export const AIPoolStatusSchema = z.object({
  active_workers: z.number(),
  max_workers: z.number(),
  pending_tasks: z.number(),
  processing_tasks: z.number(),
  completed_tasks: z.number(),
  failed_tasks: z.number(),
  avg_latency_ms: z.number(),
  requests_per_min: z.number(),
  tokens_per_min: z.number(),
  total_cost_today: z.number(),
});

export const ProviderStatsSchema = z.object({
  provider: z.string(),
  requests: z.number(),
  tokens_used: z.number(),
  cost: z.number(),
  avg_latency_ms: z.number(),
});

export const PoolStatsSchema = z.object({
  total_keys: z.number(),
  active_keys: z.number(),
  total_requests: z.number(),
  total_tokens_used: z.number(),
  total_cost: z.number(),
  avg_latency_ms: z.number(),
  requests_today: z.number(),
  tokens_today: z.number(),
  cost_today: z.number(),
  top_providers: z.array(ProviderStatsSchema),
});

export const AIPoolKeySchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  name: z.string(),
  provider: z.string(),
  key_prefix: z.string(),
  is_active: z.boolean(),
  rate_limit: z.number().nullish().transform(v => v ?? undefined),
  usage_count: z.number(),
  last_used_at: z.string().nullish().transform(v => v ?? undefined),
  created_at: z.string(),
});

export const ChatMessageSchema = z.object({
  role: z.union([z.literal('system'), z.literal('user'), z.literal('assistant')]),
  content: z.string(),
});

// - [x] 1d. Integrar Chat Real-time (si aplica) o Streaming de respuestas.
// - [/] 1e. Depurar persistencia y conectividad del servidor backend.
export const ChatResponseSchema = z.object({
  id: z.string().uuid(),
  model_id: z.string().uuid(),
  message: ChatMessageSchema,
  finish_reason: z.string(),
  input_tokens: z.number(),
  output_tokens: z.number(),
  cost: z.number(),
  latency_ms: z.number(),
  created_at: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const CompletionResponseSchema = z.object({
  id: z.string().uuid(),
  model_id: z.string().uuid(),
  text: z.string(),
  finish_reason: z.string(),
  input_tokens: z.number(),
  output_tokens: z.number(),
  cost: z.number(),
  latency_ms: z.number(),
  created_at: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
});
