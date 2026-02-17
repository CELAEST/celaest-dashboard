import { useCallback, useMemo, useEffect, useState } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { assetsService } from "../services/assets.service";
import type { Asset, AssetType } from "../services/assets.service";
import { useAssetStore } from "../stores/useAssetStore";
import { useApiAuth } from "@/lib/use-api-auth";
import { socket } from "@/lib/socket-client";

export type { Asset, AssetType };

export const useAssets = () => {
  const { theme } = useTheme();
  const { token, isAuthReady, orgId } = useApiAuth();
  const isDark = theme === "dark";
  
  const { 
    assets, 
    isLoading, 
    error, 
    fetchAssets, 
    setError,
    setAssets
  } = useAssetStore();

  const [searchQuery, setSearchQuery] = useState("");

  const handleFetch = useCallback(async (force = false) => {
    if (token) {
      await fetchAssets(token, force);
    }
  }, [token, fetchAssets]);

  useEffect(() => {
    if (isAuthReady) {
      handleFetch();
    }
  }, [isAuthReady, handleFetch]);

  // WebSocket listener for real-time updates
  useEffect(() => {
    if (!token) return;

    // Conectar socket
    socket.connect(token, orgId || undefined);

    const handleRefresh = () => {
      console.log("[useAssets] Real-time activity detected. Refreshing assets...");
      handleFetch(true);
    };

    const unsubscribeAsset = socket.on("product.asset_created", handleRefresh);

    return () => {
      unsubscribeAsset();
    };
  }, [token, handleFetch, orgId]);

  const deleteAsset = useCallback((id: string) => {
    setAssets(assets.map((a: Asset) => (a.id === id ? { ...a, status: "archived" as const } : a)));
  }, [assets, setAssets]);

  const duplicateAsset = useCallback((asset: Asset) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
      name: `${asset.name} (Copy)`,
      status: "draft",
      downloads: 0,
      rating: 0,
      reviews: 0,
      isPurchased: false,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setAssets([...assets, newAsset]);
  }, [assets, setAssets]);

  const saveAsset = useCallback(
    (assetData: Partial<Asset>, editingAssetId?: string) => {
      if (editingAssetId) {
        setAssets(assets.map((a: Asset) =>
            a.id === editingAssetId
              ? ({
                   ...a,
                   ...assetData,
                   updatedAt: new Date().toISOString().split("T")[0],
                 } as Asset)
              : a
          )
        );
      } else {
        const newAsset: Asset = {
          id: Date.now().toString(),
          productId: "",
          name: assetData.name || "New Asset",
          type: (assetData.type as AssetType) || "asset",
          category: assetData.category || "Uncategorized",
          price: assetData.price || 0,
          operationalCost: assetData.operationalCost || 0,
          status: assetData.status || "draft",
          version: "1.0.0",
          fileSize: "0 KB",
          downloads: 0,
          rating: 0,
          reviews: 0,
          slug: assetData.slug || `asset-${Date.now()}`,
          shortDescription: assetData.shortDescription || "",
          description: assetData.description || "",
          features: assetData.features || [],
          requirements: assetData.requirements || [],
          thumbnail: assetData.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp",
          isPurchased: false,
          isPublic: assetData.isPublic || false,
          isFeatured: assetData.isFeatured || false,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };
        setAssets([...assets, newAsset]);
      }
    },
    [assets, setAssets]
  );

  const downloadAsset = useCallback(async (assetId: string, filename: string) => {
    try {
      if (!token) {
        setError("Authentication required.");
        return;
      }

      const response = await assetsService.downloadAsset(token, assetId);
      // Check if response has data property (axios/api-client wrapper) or is direct
      const downloadData = (response as any).data || response;
      const download_url = downloadData.download_url;

      if (download_url) {
        // Solution: Direct Browser Download via Token in Query Param
        // This avoids memory issues with Blob and solves "Pending" state bugs.
        // Backend Auth Middleware supports ?token=... and ?org_id=...
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
        const fullUrl = download_url.startsWith('http') ? download_url : `${apiUrl}${download_url}`;
        
        // Use URL object to safely append params
        const finalUrl = new URL(fullUrl);
        finalUrl.searchParams.append('token', token);
        if (orgId) {
            finalUrl.searchParams.append('org_id', orgId);
        }

        console.log(`[useAssets] Starting direct download: ${finalUrl.toString()}`);
        
        // Trigger native browser download
        // We use a temporary link to support 'download' attribute if needed, 
        // though Content-Disposition should handle filename.
        const link = document.createElement('a');
        link.href = finalUrl.toString();
        link.setAttribute('download', filename || 'download'); // Hint only
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("[useAssets] Download error:", err);
      setError("Failed to initialize download. Please try again.");
    }
  }, [token, orgId, setError]);

  const activeAssets = useMemo(() => assets.filter((a: Asset) => a.status === 'active'), [assets]);

  return {
    isDark,
    assets,
    activeAssets,
    inventory: useAssetStore((state) => state.inventory),
    isLoading,
    error,
    refresh: handleFetch,
    deleteAsset,
    duplicateAsset,
    saveAsset,
    downloadAsset,
    searchQuery,
    setSearchQuery
  };
};
