import { useCallback, useMemo, useEffect } from "react";
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
    const unsubscribePayment = socket.on("payment.succeeded", handleRefresh);

    return () => {
      unsubscribeAsset();
      unsubscribePayment();
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
    if (!token) return;
    try {
      const { download_url } = await assetsService.downloadAsset(token, assetId);
      if (download_url) {
        const link = document.createElement('a');
        link.href = download_url;
        link.download = filename || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setError("No download URL available");
      }
    } catch (err) {
      console.error("[useAssets] Download error:", err);
      setError("Failed to download asset");
    }
  }, [token, setError]);

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
    downloadAsset
  };
};
