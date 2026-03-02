import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../api/jobs.api';
import { toast } from 'sonner';

export const useJobs = (token: string, orgId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['operations-jobs', orgId],
    queryFn: () => jobsApi.listJobs(token, orgId),
    enabled: !!token && !!orgId,
    refetchInterval: 15000, // Refresh every 15s to see next_run updates
  });

  const triggerMutation = useMutation({
    mutationFn: (jobId: string) => jobsApi.triggerJob(token, orgId, jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['operations-jobs', orgId] });
      toast.success(`Job ${jobId} triggered successfully`);
    },
    onError: () => toast.error('Failed to trigger job manually'),
  });

  return { ...query, triggerMutation };
};
