export type AIModelType = 'chat' | 'completion' | 'embedding' | 'image';
export type AIStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type AIChatRole = 'system' | 'user' | 'assistant';

export interface AIModel {
  id: string;
  organization_id: string;
  name: string;
  provider: string;
  model_id: string;
  type: AIModelType;
  max_tokens: number;
  temperature: number;
  is_active: boolean;
  cost_per_input_token: number;
  cost_per_output_token: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AIProvider {
  id: string;
  organization_id: string;
  name: string;
  type: string;
  api_key?: string;
  base_url?: string;
  is_active: boolean;
  rate_limit?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProviderStats {
  provider: string;
  requests: number;
  tokens_used: number;
  cost: number;
  avg_latency_ms: number;
}

export interface PoolStats {
  total_keys: number;
  active_keys: number;
  total_requests: number;
  total_tokens_used: number;
  total_cost: number;
  avg_latency_ms: number;
  requests_today: number;
  tokens_today: number;
  cost_today: number;
  top_providers: ProviderStats[];
}

export interface AIPrompt {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  content: string;
  variables?: string[];
  model_id?: string;
  category?: string;
  is_active: boolean;
  version: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AITask {
  id: string;
  organization_id: string;
  model_id: string;
  prompt_id?: string;
  type: string;
  status: AIStatus;
  input: string;
  output?: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  latency_ms: number;
  error?: string;
  metadata?: Record<string, unknown>;
  user_email?: string;
  created_at: string;
  completed_at?: string;
}

export interface AIBatch {
  id: string;
  organization_id: string;
  model_id: string;
  name: string;
  description?: string;
  status: AIStatus;
  total_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  total_cost: number;
  created_at: string;
  completed_at?: string;
}

export interface AIBatchTask {
  input: string;
  metadata?: Record<string, unknown>;
}

export interface CompletionResponse {
  id: string;
  model_id: string;
  text: string;
  finish_reason: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  latency_ms: number;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface AIPoolStatus {
  active_workers: number;
  max_workers: number;
  pending_tasks: number;
  processing_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  avg_latency_ms: number;
  requests_per_min: number;
  tokens_per_min: number;
  total_cost_today: number;
}

export interface ChatMessage {
  role: AIChatRole;
  content: string;
}

export interface ChatRequest {
  model_id?: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CompletionRequest {
  model_id?: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  metadata?: Record<string, unknown>;
}

export interface ChatResponse {
  id: string;
  model_id: string;
  message: ChatMessage;
  finish_reason: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  latency_ms: number;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface AIPoolKey {
  id: string;
  organization_id: string;
  name: string;
  provider: string;
  key_prefix: string;
  is_active: boolean;
  rate_limit?: number;
  usage_count: number;
  last_used_at?: string;
  created_at: string;
}
