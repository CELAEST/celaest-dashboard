import { useQuery } from '@tanstack/react-query';
import { operationsApi } from '../api/operations.api';

export const useTelemetry = (token: string, orgId: string, period: string = "1h") => {
  return useQuery({
    queryKey: ['telemetry', orgId, period],
    queryFn: () => operationsApi.getTelemetry(token, orgId, period),
    enabled: !!token && !!orgId,
    refetchInterval: 10000, // Refresh telemetry every 10 seconds for real-time feel
  });
};
