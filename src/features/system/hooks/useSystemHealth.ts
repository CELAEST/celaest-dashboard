import { useQuery } from "@tanstack/react-query";
import { systemApi } from "../api/system.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export function useSystemHealth() {
  const { data: health, isLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.system.health,
    queryFn: () => systemApi.getHealth(),
    staleTime: 30_000, // 30-second cache (same as old manual TTL)
    refetchInterval: 60_000, // Auto-refresh every 60s
  });

  return {
    health: health ?? null,
    isLoading,
    checkHealth: (force = false) => {
      if (force) refetch();
    },
  };
}
