import { z } from "zod";

export const EndpointStatsSchema = z.object({
  endpoint: z.string(),
  method: z.string(),
  request_count: z.number(),
  avg_latency_ms: z.number(),
  error_rate: z.number(),
});

export const ErrorTypeSchema = z.object({
  type: z.string(),
  code: z.number(),
  count: z.number(),
  message: z.string().optional(),
});

export const TelemetryDataSchema = z.object({
  request_count: z.number(),
  error_count: z.number(),
  avg_response_time_ms: z.number(),
  top_endpoints: z.array(EndpointStatsSchema),
  errors_by_type: z.array(ErrorTypeSchema),
  latency_p50_ms: z.number(),
  latency_p95_ms: z.number(),
  latency_p99_ms: z.number(),
  period: z.string(),
});

export type EndpointStats = z.infer<typeof EndpointStatsSchema>;
export type ErrorType = z.infer<typeof ErrorTypeSchema>;
export type TelemetryData = z.infer<typeof TelemetryDataSchema>;
