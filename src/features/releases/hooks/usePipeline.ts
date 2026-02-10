import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { assetsApi, BackendPipelineStatus } from "@/features/assets/api/assets.api";
import { useOrg } from "@/features/shared/contexts/OrgContext";
import { handleApiError } from "@/lib/error-handler";

export const usePipeline = (options: { enabled?: boolean } = {}) => {
  const { session } = useAuth();
  const { org } = useOrg();
  const [data, setData] = useState<BackendPipelineStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!options.enabled) return;
    if (!session?.accessToken || !org?.id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await assetsApi.getPipelineStatus(session.accessToken, org.id);
      setData(response);
    } catch (err: any) {
      console.error("Failed to fetch pipeline status:", err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken, org?.id, options.enabled]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchStatus
  };
};
