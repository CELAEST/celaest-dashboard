import { useMemo, useCallback } from "react";
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

  const inventory = useMemo(
    () => orgInventoryQuery.data?.pages.flatMap((p) => p.assets) ?? [],
    [orgInventoryQuery.data],
  );
  const inventoryTotal = orgInventoryQuery.data?.pages[0]?.total ?? 0;

  const downloadAsset = async (assetId: string, slug?: string) => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }
    const toastId = toast.loading(`Preparando descarga de ${slug || "archivo"}…`);
    try {
      const result = await assetsService.downloadAsset(token, assetId);
      const { download_url, suggested_filename, version } = result;

      if (!download_url) {
        toast.error("No download URL available", { id: toastId });
        return;
      }

      const versionLabel = version
        ? version.startsWith("v") ? version : `v${version}`
        : null;

      // Build absolute URL pointing to the backend (not Next.js frontend)
      const backendBase = process.env.NEXT_PUBLIC_CELAEST_API_URL || "http://localhost:3001";
      const fullUrl = download_url.startsWith("/")
        ? `${backendBase}${download_url}`
        : download_url;

      // Fetch with Authorization header (window.open / link-navigation never sends headers)
      const res = await fetch(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(orgId ? { "X-Organization-ID": orgId } : {}),
        },
      });

      if (!res.ok) {
        toast.error("La descarga fue rechazada por el servidor", { id: toastId });
        return;
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = suggested_filename || slug || "download";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);

      const successMsg = versionLabel
        ? `${slug || "Archivo"} ${versionLabel} descargado correctamente`
        : `${slug || "Archivo"} descargado correctamente`;
      toast.success(successMsg, { id: toastId });
    } catch {
      toast.error("Error al descargar el archivo", { id: toastId });
    }
  };

  return {
    assets: myAssetsQuery.data || [],
    activeAssets: myAssetsQuery.data || [],
    inventory,
    inventoryTotal,
    inventoryHasNextPage: !!orgInventoryQuery.hasNextPage,
    inventoryIsFetchingNextPage: orgInventoryQuery.isFetchingNextPage,
    inventoryFetchNextPage: orgInventoryQuery.fetchNextPage,
    isLoading: myAssetsQuery.isLoading || orgInventoryQuery.isLoading,
    refresh: useCallback(() => {
      myAssetsQuery.refetch();
      orgInventoryQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
    downloadAsset,
  };
}

export function useOrgInventory() {
  const { session } = useAuth();
  const { currentOrg } = useOrgStore();
  const token = session?.accessToken || "";
  const orgId = currentOrg?.id || "";

  const query = useOrgInventoryQuery(token, orgId);

  const data = useMemo(
    () => query.data?.pages.flatMap((p) => p.assets) ?? [],
    [query.data],
  );
  const total = query.data?.pages[0]?.total ?? 0;

  return {
    data,
    total,
    hasNextPage: !!query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
