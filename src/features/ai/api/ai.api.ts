import { api } from '@/lib/api-client';
import { 
  AIModel, 
  AIPrompt, 
  AITask,
  AIBatch,
  AIBatchTask,
  AIPoolStatus, 
  AIPoolKey, 
  AIProvider,
  PoolStats,
  CompletionRequest,
  CompletionResponse,
  ChatRequest, 
  ChatResponse
} from '../types';
import { 
  AIModelSchema, 
  AIPromptSchema, 
  AITaskSchema,
  AIBatchSchema, 
  AIPoolStatusSchema, 
  AIPoolKeySchema, 
  AIProviderSchema,
  PoolStatsSchema,
  ChatResponseSchema,
  CompletionResponseSchema
} from './schemas';
import { z } from 'zod';

export const aiApi = {
  // Models
  listModels: async (token: string, orgId: string) => {
    return api.get<{ models: AIModel[]; total: number }>('/api/v1/org/ai/models', {
      token,
      orgId,
      schema: z.union([
        z.object({
          models: z.array(AIModelSchema),
          total: z.number(),
        }),
        z.array(AIModelSchema).transform((models) => ({
          models,
          total: models.length,
        })),
      ]) as z.ZodType<{ models: AIModel[]; total: number }>,
    });
  },

  // Prompts
  listPrompts: async (token: string, orgId: string) => {
    return api.get<{ prompts: AIPrompt[]; total: number }>('/api/v1/org/ai/prompts', {
      token,
      orgId,
      schema: z.union([
        z.object({
          prompts: z.array(AIPromptSchema),
          total: z.number(),
        }),
        z.array(AIPromptSchema).transform((prompts) => ({
          prompts,
          total: prompts.length,
        })),
      ]) as z.ZodType<{ prompts: AIPrompt[]; total: number }>,
    });
  },

  createPrompt: async (token: string, orgId: string, data: Partial<AIPrompt>) => {
    return api.post<AIPrompt>('/api/v1/org/ai/prompts', data, {
      token,
      orgId,
      schema: AIPromptSchema as z.ZodType<AIPrompt>,
    });
  },

  updatePrompt: async (token: string, orgId: string, id: string, data: Partial<AIPrompt>) => {
    return api.put<AIPrompt>(`/api/v1/org/ai/prompts/${id}`, data, {
      token,
      orgId,
      schema: AIPromptSchema as z.ZodType<AIPrompt>,
    });
  },

  deletePrompt: async (token: string, orgId: string, id: string) => {
    return api.delete(`/api/v1/org/ai/prompts/${id}`, {
      token,
      orgId,
    });
  },

  // Tasks
  listTasks: async (token: string, orgId: string, status?: string) => {
    return api.get<{ tasks: AITask[]; total: number }>('/api/v1/org/ai/tasks', {
      token,
      orgId,
      params: status ? { status } : undefined,
      schema: z.union([
        z.object({
          tasks: z.array(AITaskSchema),
          total: z.number(),
        }),
        z.array(AITaskSchema).transform((tasks) => ({
          tasks,
          total: tasks.length,
        })),
      ]) as z.ZodType<{ tasks: AITask[]; total: number }>,
    });
  },

  listBatches: async (token: string, orgId: string, status?: string) => {
    return api.get<{ batches: AIBatch[]; total: number }>('/api/v1/org/ai/batches', {
      token,
      orgId,
      params: status ? { status } : undefined,
      schema: z.union([
        z.object({
          batches: z.array(AIBatchSchema),
          total: z.number(),
        }),
        z.array(AIBatchSchema).transform((batches) => ({
          batches,
          total: batches.length,
        })),
      ]) as z.ZodType<{ batches: AIBatch[]; total: number }>,
    });
  },

  createBatch: async (token: string, orgId: string, data: { name: string; model_id: string; tasks: AIBatchTask[] }) => {
    return api.post<AIBatch>('/api/v1/org/ai/batches', data, {
      token,
      orgId,
      schema: AIBatchSchema as z.ZodType<AIBatch>,
    });
  },

  // Providers
  listProviders: async (token: string, orgId: string) => {
    return api.get<{ providers: AIProvider[]; total: number }>('/api/v1/org/ai/providers', {
      token,
      orgId,
      schema: z.union([
        z.object({
          providers: z.array(AIProviderSchema),
          total: z.number(),
        }),
        z.array(AIProviderSchema).transform((providers) => ({
          providers,
          total: providers.length,
        })),
      ]) as z.ZodType<{ providers: AIProvider[]; total: number }>,
    });
  },

  createProvider: async (token: string, orgId: string, data: Partial<AIProvider>) => {
    return api.post<AIProvider>('/api/v1/org/ai/providers', data, {
      token,
      orgId,
      schema: AIProviderSchema as z.ZodType<AIProvider>,
    });
  },

  deleteProvider: async (token: string, orgId: string, id: string) => {
    return api.delete(`/api/v1/org/ai/providers/${id}`, {
      token,
      orgId,
    });
  },

  // Pool
  getPoolStatus: async (token: string, orgId: string) => {
    return api.get<AIPoolStatus>('/api/v1/org/ai/pool', {
      token,
      orgId,
      schema: AIPoolStatusSchema,
    });
  },

  listPoolKeys: async (token: string, orgId: string) => {
    return api.get<{ keys: AIPoolKey[]; total: number }>('/api/v1/org/ai/pool/keys', {
      token,
      orgId,
      schema: z.union([
        z.object({
          keys: z.array(AIPoolKeySchema),
          total: z.number(),
        }),
        z.array(AIPoolKeySchema).transform((keys) => ({
          keys,
          total: keys.length,
        })),
      ]) as z.ZodType<{ keys: AIPoolKey[]; total: number }>,
    });
  },

  createPoolKey: async (token: string, orgId: string, data: Partial<AIPoolKey>) => {
    return api.post<AIPoolKey>('/api/v1/org/ai/pool/keys', data, {
      token,
      orgId,
      schema: AIPoolKeySchema as z.ZodType<AIPoolKey>,
    });
  },

  updatePoolKey: async (token: string, orgId: string, id: string, data: Partial<AIPoolKey>) => {
    return api.put<AIPoolKey>(`/api/v1/org/ai/pool/keys/${id}`, data, {
      token,
      orgId,
      schema: AIPoolKeySchema as z.ZodType<AIPoolKey>,
    });
  },

  deletePoolKey: async (token: string, orgId: string, id: string) => {
    return api.delete(`/api/v1/org/ai/pool/keys/${id}`, {
      token,
      orgId,
    });
  },

  // Inference
  chat: async (token: string, orgId: string, data: ChatRequest) => {
    return api.post<ChatResponse>('/api/v1/org/ai/chat', data, {
      token,
      orgId,
      schema: ChatResponseSchema,
    });
  },

  complete: async (token: string, orgId: string, data: CompletionRequest) => {
    return api.post<CompletionResponse>('/api/v1/org/ai/completions', data, {
      token,
      orgId,
      schema: CompletionResponseSchema as z.ZodType<CompletionResponse>,
    });
  },

  getPoolStats: async (token: string, orgId: string) => {
    return api.get<PoolStats>('/api/v1/org/ai/pool/stats', {
      token,
      orgId,
      schema: PoolStatsSchema as z.ZodType<PoolStats>,
    });
  },
};
