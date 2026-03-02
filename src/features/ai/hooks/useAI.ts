import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../api/ai.api';
import { ChatRequest, AIPrompt, AIBatchTask, AIProvider, CompletionRequest, AIPoolKey } from '../types';
import { toast } from 'sonner';

export const useAIModels = (token: string, orgId: string) => {
  return useQuery({
    queryKey: ['ai-models', orgId],
    queryFn: () => aiApi.listModels(token, orgId),
    enabled: !!token && !!orgId,
  });
};

export const useAIPrompts = (token: string, orgId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['ai-prompts', orgId],
    queryFn: () => aiApi.listPrompts(token, orgId),
    enabled: !!token && !!orgId,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<AIPrompt>) => aiApi.createPrompt(token, orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-prompts', orgId] });
      toast.success('Prompt created successfully');
    },
    onError: () => toast.error('Failed to create prompt'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string } & Partial<AIPrompt>) =>
      aiApi.updatePrompt(token, orgId, data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-prompts', orgId] });
      toast.success('Prompt updated successfully');
    },
    onError: () => toast.error('Failed to update prompt'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => aiApi.deletePrompt(token, orgId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-prompts', orgId] });
      toast.success('Prompt deleted successfully');
    },
    onError: () => toast.error('Failed to delete prompt'),
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
};

export const useAIPool = (token: string, orgId: string) => {
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    queryKey: ['ai-pool-status', orgId],
    queryFn: () => aiApi.getPoolStatus(token, orgId),
    enabled: !!token && !!orgId,
    refetchInterval: 30000, // Refresh every 30s
  });

  const keysQuery = useQuery({
    queryKey: ['ai-pool-keys', orgId],
    queryFn: () => aiApi.listPoolKeys(token, orgId),
    enabled: !!token && !!orgId,
  });

  const createKeyMutation = useMutation({
    mutationFn: (data: { name: string; provider: string; api_key: string }) => aiApi.createPoolKey(token, orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-pool-keys', orgId] });
      toast.success('API Key added to pool');
    },
    onError: () => toast.error('Failed to add API Key'),
  });

  const deleteKeyMutation = useMutation({
    mutationFn: (id: string) => aiApi.deletePoolKey(token, orgId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-pool-keys', orgId] });
      toast.success('API Key removed from pool');
    },
    onError: () => toast.error('Failed to remove API Key'),
  });

  const updateKeyMutation = useMutation({
    mutationFn: (data: { id: string } & Partial<AIPoolKey>) =>
      aiApi.updatePoolKey(token, orgId, data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-pool-keys", orgId] });
      toast.success("API Key updated successfully");
    },
    onError: () => toast.error("Failed to update API Key"),
  });

  return { statusQuery, keysQuery, createKeyMutation, updateKeyMutation, deleteKeyMutation };
};

export const useAIProviders = (token: string, orgId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['ai-providers', orgId],
    queryFn: () => aiApi.listProviders(token, orgId),
    enabled: !!token && !!orgId,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<AIProvider>) => aiApi.createProvider(token, orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-providers', orgId] });
      toast.success('AI Provider registered');
    },
    onError: () => toast.error('Failed to register AI Provider'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => aiApi.deleteProvider(token, orgId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-providers', orgId] });
      toast.success('AI Provider removed');
    },
    onError: () => toast.error('Failed to remove AI Provider'),
  });

  return { ...query, createMutation, deleteMutation };
};

export const useAIPoolStats = (token: string, orgId: string) => {
  return useQuery({
    queryKey: ['ai-pool-stats', orgId],
    queryFn: () => aiApi.getPoolStats(token, orgId),
    enabled: !!token && !!orgId,
    refetchInterval: 60000, // Refresh metrics every minute
  });
};

export const useAIChat = (token: string, orgId: string) => {
  return useMutation({
    mutationFn: (data: ChatRequest) => aiApi.chat(token, orgId, data),
    onError: (error: Error) => {
      toast.error(error.message || 'AI Chat failed');
    },
  });
};

export const useAICompletion = (token: string, orgId: string) => {
  return useMutation({
    mutationFn: (data: CompletionRequest) => aiApi.complete(token, orgId, data),
    onError: (error: Error) => {
      toast.error(error.message || 'AI Completion failed');
    },
  });
};

export const useAITasks = (token: string, orgId: string, status?: string) => {
  return useQuery({
    queryKey: ['ai-tasks', orgId, status],
    queryFn: () => aiApi.listTasks(token, orgId, status),
    enabled: !!token && !!orgId,
    refetchInterval: 15000, // Real-time logs updates every 15s
  });
};

export const useAIBatches = (token: string, orgId: string, status?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['ai-batches', orgId, status],
    queryFn: () => aiApi.listBatches(token, orgId, status),
    enabled: !!token && !!orgId,
    refetchInterval: 30000, // Batch status updates every 30s
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; model_id: string; tasks: AIBatchTask[] }) =>
      aiApi.createBatch(token, orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-batches', orgId] });
      toast.success('Batch processing started');
    },
    onError: () => toast.error('Failed to start batch processing'),
  });

  return { ...query, createMutation };
};
