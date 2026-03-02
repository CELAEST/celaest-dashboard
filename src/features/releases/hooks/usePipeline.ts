import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { assetsApi } from "@/features/assets/api/assets.api";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export const usePipeline = (options: { enabled?: boolean } = {}) => {
  const { session } = useAuth();
  const { currentOrg: org } = useOrgStore();
  const token = session?.accessToken;
  const orgId = org?.id;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.releases.pipeline(orgId || "none"),
    queryFn: async () => {
      if (!token || !orgId) return null;
      return assetsApi.getPipelineStatus(token, orgId);
    },
    enabled: !!options.enabled && !!token && !!orgId,
  });

  return {
    data: data ?? null,
    isLoading,
    error: error ? (error instanceof Error ? error.message : "Unknown error") : null,
    refetch,
  };
};
