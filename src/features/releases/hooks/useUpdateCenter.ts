import { useState, useCallback, useEffect } from "react";
import { CustomerAsset } from "../types";
import { assetsService } from "@/features/assets/services/assets.service";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { handleApiError } from "@/lib/error-handler";

export const useUpdateCenter = (options: { enabled?: boolean } = {}) => {
  const { session } = useAuth();
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [assets, setAssets] = useState<CustomerAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    if (!options.enabled || !session?.accessToken) return;
    
    setIsLoading(true);
    try {
      const myAssets = await assetsService.getMyAssets(session.accessToken);
      
      const mappedAssets: CustomerAsset[] = myAssets.map(a => ({
        id: a.id,
        name: a.name,
        currentVersion: "v1.0.0", // Fallback current version
        latestVersion: a.version || "v1.0.0",
        hasUpdate: a.version !== "v1.0.0" && a.version !== "", 
        purchaseDate: a.createdAt,
        lastDownload: a.updatedAt,
        changelog: [], // Will be fetched on demand or from preview
        compatibility: a.requirements[0] || "Universal",
        checksum: "sha256:pending...",
      }));
      
      setAssets(mappedAssets);
    } catch (err) {
      console.error("Failed to fetch customer assets:", err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken, options.enabled]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const toggleExpanded = async (id: string) => {
    const isExpanding = expandedAsset !== id;
    setExpandedAsset(isExpanding ? id : null);
    
    // On demand changelog fetch
    if (isExpanding && session?.accessToken) {
      const asset = assets.find(a => a.id === id);
      if (asset && asset.changelog.length === 0) {
        try {
          // Fetch releases for the product linked to this asset
          // We need the productId, which is available in the Asset object from service
          const myAssets = await assetsService.getMyAssets(session.accessToken);
          const targetAsset = myAssets.find(a => a.id === id);
          
          if (targetAsset) {
            // Use empty string for orgId to trigger public route in assetsApi.getReleases
            const releases = await assetsService.getReleases(session.accessToken, "", targetAsset.productId);
            if (releases && releases.length > 0) {
              const latestRelease = releases[0];
              setAssets(prev => prev.map(a => 
                a.id === id 
                  ? { ...a, changelog: latestRelease.changelog || [latestRelease.release_notes || "No release notes available"] } 
                  : a
              ));
            }
          }
        } catch (err) {
          console.error("Failed to fetch changelog:", err);
        }
      }
    }
  };



  const downloadUpdate = async (assetId: string) => {
    if (!session?.accessToken) return;
    try {
      const response = await assetsService.downloadAsset(session.accessToken, assetId);
      if (response && response.download_url) {
        // Trigger download
        const link = document.createElement('a');
        link.href = response.download_url;
        link.setAttribute('download', ''); // Optional: sets download attribute
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Failed to download update:", err);
      setError(handleApiError(err));
    }
  };

  const skipUpdate = async (assetId: string, version: string) => {
    if (!session?.accessToken) return;
    try {
      await assetsService.skipVersion(session.accessToken, assetId, version);
      
      // Update local state to hide the update
      setAssets(prev => prev.map(a => 
        a.id === assetId 
          ? { ...a, hasUpdate: false } 
          : a
      ));
      
      // Optionally re-fetch to ensure sync
      // fetchAssets();
    } catch (err) {
      console.error("Failed to skip update:", err);
      setError(handleApiError(err));
    }
  };

  const updateCount = assets.filter((a) => a.hasUpdate).length;

  return {
    assets,
    expandedAsset,
    toggleExpanded,
    downloadUpdate,
    skipUpdate,
    updateCount,
    isLoading,
    error
  };
};
