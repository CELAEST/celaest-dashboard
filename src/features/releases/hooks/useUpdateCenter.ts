import { logger } from "@/lib/logger";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomerAsset } from "../types";
import { assetsService } from "@/features/assets/services/assets.service";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { handleApiError } from "@/lib/error-handler";

import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export const useUpdateCenter = (options: { enabled?: boolean } = {}) => {
  const { session } = useAuth();
  const token = session?.accessToken;
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: assets = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.releases.updateCenter,
    queryFn: async (): Promise<CustomerAsset[]> => {
      if (!token) return [];
      const myAssets = await assetsService.getMyAssets(token);
      
      return myAssets.map(a => ({
        id: a.id,
        name: a.name,
        currentVersion: "v1.0.0",
        latestVersion: a.version || "v1.0.0",
        hasUpdate: a.version !== "v1.0.0" && a.version !== "", 
        purchaseDate: a.createdAt,
        lastDownload: a.updatedAt,
        changelog: [],
        compatibility: a.requirements[0] || "Universal",
        checksum: "sha256:pending...",
      }));
    },
    enabled: !!options.enabled && !!token,
  });

  const toggleExpanded = async (id: string) => {
    const isExpanding = expandedAsset !== id;
    setExpandedAsset(isExpanding ? id : null);
    
    if (isExpanding && token) {
      const asset = assets.find(a => a.id === id);
      if (asset && asset.changelog.length === 0) {
        try {
          const myAssets = await assetsService.getMyAssets(token);
          const targetAsset = myAssets.find(a => a.id === id);
          
          if (targetAsset) {
            const releases = await assetsService.getReleases(token, "", targetAsset.productId);
            if (releases && releases.length > 0) {
              const latestRelease = releases[0];
              queryClient.setQueryData<CustomerAsset[]>(QUERY_KEYS.releases.updateCenter, old =>
                (old || []).map(a =>
                  a.id === id 
                    ? { ...a, changelog: latestRelease.changelog || [latestRelease.release_notes || "No release notes available"] } 
                    : a
                )
              );
            }
          }
        } catch (err: unknown) {
          logger.error("Failed to fetch changelog:", err);
        }
      }
    }
  };

  const downloadMutation = useMutation({
    mutationFn: async (assetId: string) => {
      if (!token) throw new Error("No token");
      return assetsService.downloadAsset(token, assetId);
    },
    onSuccess: (response) => {
      if (response?.download_url) {
        const link = document.createElement('a');
        link.href = response.download_url;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
  });

  const skipMutation = useMutation({
    mutationFn: async ({ assetId, version }: { assetId: string; version: string }) => {
      if (!token) throw new Error("No token");
      await assetsService.skipVersion(token, assetId, version);
      return assetId;
    },
    onMutate: async ({ assetId }) => {
      const previous = queryClient.getQueryData<CustomerAsset[]>(QUERY_KEYS.releases.updateCenter);
      queryClient.setQueryData<CustomerAsset[]>(QUERY_KEYS.releases.updateCenter, old =>
        (old || []).map(a => a.id === assetId ? { ...a, hasUpdate: false } : a)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.releases.updateCenter, context.previous);
    },
  });

  const updateCount = assets.filter((a) => a.hasUpdate).length;

  return {
    assets,
    expandedAsset,
    toggleExpanded,
    downloadUpdate: (assetId: string) => downloadMutation.mutate(assetId),
    skipUpdate: (assetId: string, version: string) => skipMutation.mutate({ assetId, version }),
    updateCount,
    isLoading,
    error: error ? handleApiError(error) : null,
  };
};
