import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { toast } from "sonner";
import { assetsService } from "../services/assets.service";
import { useMyAssetsQuery, useOrgInventoryQuery } from "./useAssetsQuery";

export function useAssets() {
  const { session } = useAuth();
  const { currentOrg } = useOrgStore();
  const token = session?.accessToken || "";
  const orgId = currentOrg?.id || "";

  const myAssetsQuery = useMyAssetsQuery(token);
  const orgInventoryQuery = useOrgInventoryQuery(token, orgId);
  
  const downloadAsset = async (assetId: string, slug?: string) => {
    if (!token) {
       toast.error("Authentication required");
       return;
    }
    try {
        const { download_url } = await assetsService.downloadAsset(token, assetId);
        if (download_url) {
            window.open(download_url, "_blank");
            toast.success(`Download started for ${slug || assetId}`);
        }
    } catch {
        toast.error("Download failed");
    }
  };

  return {
    assets: myAssetsQuery.data || [],
    activeAssets: myAssetsQuery.data || [],
    inventory: orgInventoryQuery.data || [],
    isLoading: myAssetsQuery.isLoading || orgInventoryQuery.isLoading,
    refresh: () => {
      myAssetsQuery.refetch();
      orgInventoryQuery.refetch();
    },
    downloadAsset,
  };
}

export function useOrgInventory() {
  const { session } = useAuth();
  const { currentOrg } = useOrgStore();
  const token = session?.accessToken || "";
  const orgId = currentOrg?.id || "";

  const query = useOrgInventoryQuery(token, orgId);

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
