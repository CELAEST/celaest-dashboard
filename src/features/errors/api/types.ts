export interface AITask {
  id: string;
  organization_id: string;
  model_id: string;
  prompt_id?: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'reviewing' | 'resolved' | 'ignored';
  input: string;
  output?: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  latency_ms: number;
  error?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  completed_at?: string;
}

export type TaskResponse = AITask[];

export interface PlatformStat {
  name: string;
  value: number;
  details: string;
}

export interface ErrorAnalyticsResponse {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  failed_tasks: number;
  reviewing_tasks: number;
  resolved_tasks: number;
  ignored_tasks: number;
  avg_completion_time_ms: number;
  avg_resolution_time_min: number;
  success_rate: number;
  platform_distribution: PlatformStat[];
}
