import { z } from "zod";

export const BackgroundJobSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(["running", "idle", "failed", "stopped"]),
  last_run: z.string().nullable(),
  next_run: z.string().nullable(),
  success_count: z.number(),
  error_count: z.number(),
  avg_duration_ms: z.number(),
});

export type BackgroundJob = z.infer<typeof BackgroundJobSchema>;

export const jobsApi = {
  // Mock implementations since backend doesn't expose jobs API yet
  listJobs: async (_token: string, _orgId: string): Promise<BackgroundJob[]> => {
    return [
      {
        id: "license_expiration",
        name: "License Expiration Check",
        description: "Checks for expired subscriptions and revokes associated licenses.",
        status: "idle",
        last_run: new Date(Date.now() - 5 * 60000).toISOString(),
        next_run: new Date(Date.now() + 5 * 60000).toISOString(),
        success_count: 1240,
        error_count: 0,
        avg_duration_ms: 45.2,
      },
      {
        id: "invoice_overdue",
        name: "Invoice Overdue Check",
        description: "Marks unpaid invoices as overdue and suspends subscriptions if necessary.",
        status: "running",
        last_run: new Date(Date.now() - 15 * 60000).toISOString(),
        next_run: new Date(Date.now() + 15 * 60000).toISOString(),
        success_count: 890,
        error_count: 2,
        avg_duration_ms: 120.5,
      },
      {
        id: "ai_batch_processor",
        name: "AI Batch Inference Engine",
        description: "Processes queued AI prompts asynchronously.",
        status: "idle",
        last_run: new Date(Date.now() - 2 * 60000).toISOString(),
        next_run: new Date(Date.now() + 2 * 60000).toISOString(),
        success_count: 4500,
        error_count: 15,
        avg_duration_ms: 850.4,
      },
    ];
  },
  
  triggerJob: async (_token: string, _orgId: string, _jobId: string): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 500));
  },
};
