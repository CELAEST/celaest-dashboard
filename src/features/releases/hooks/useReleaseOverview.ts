import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { assetsApi, ReleaseOverviewResponse } from "@/features/assets/api/assets.api";
import { useOrg } from "@/features/shared/contexts/OrgContext";
import { handleApiError } from "@/lib/error-handler";

export const useReleaseOverview = (options: { enabled?: boolean } = {}) => {
  const { session } = useAuth();
  const { org } = useOrg();
  const [data, setData] = useState<ReleaseOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    if (!options.enabled) return;
    if (!session?.accessToken || !org?.id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await assetsApi.getReleaseOverview(session.accessToken, org.id);
      setData(response);
    } catch (err: any) {
      console.error("Failed to fetch release overview:", err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken, org?.id, options.enabled]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchOverview
  };
};
