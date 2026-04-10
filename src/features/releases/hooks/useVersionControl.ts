import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useInfiniteQuery, useQuery, useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { Version } from "../types";
import { assetsService } from "@/features/assets/services/assets.service";
import { type PaginatedBackendData, type BackendRelease } from "@/features/assets/api/assets.api";
import { useApiAuth } from "@/lib/use-api-auth";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error-handler";
import { useSocket } from "@/features/shared/hooks/useSocket";

import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

const VERSION_PAGE_SIZE = 15;

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const useVersionControl = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<Version | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { token, orgId } = useApiAuth();
  const queryClient = useQueryClient();

  // ── Queries ──────────────────────────────────────────────────────────
  const {
    data: versionsData,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: QUERY_KEYS.releases.versions(orgId || "none"),
    queryFn: async ({ pageParam = 1 }): Promise<PaginatedBackendData<BackendRelease>> => {
      if (!token || !orgId) return { data: [], total: 0, page: 1 };
      return assetsService.getGlobalReleases(token, orgId, pageParam, VERSION_PAGE_SIZE);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page * VERSION_PAGE_SIZE < lastPage.total ? lastPage.page + 1 : undefined;
    },
    enabled: !!token && !!orgId,
  });

  const versions = useMemo(() => {
    if (!versionsData?.pages) return [];
    return versionsData.pages.flatMap((page) =>
      (page.data || []).map((rel) => ({
        id: rel.id,
        productId: rel.product_id,
        assetName: rel.product_name || "Unknown Asset",
        versionNumber: rel.version,
        status: (rel.status as Version["status"]) || "beta",
        releaseDate: rel.released_at || rel.created_at,
        fileSize: rel.file_size_bytes ? formatBytes(rel.file_size_bytes) : "0 KB",
        checksum: rel.file_hash || "sha256:none",
        downloads: rel.download_count || 0,
        adoptionRate: 0,
        changelog: rel.changelog || [],
        compatibility: rel.min_app_version || "N/A",
        downloadUrl: rel.download_url || "",
        projectUrl: rel.github_repository || rel.external_url || "",
      }))
    );
  }, [versionsData]);

  const totalVersions = versionsData?.pages[0]?.total ?? 0;

  const { data: availableAssets = [] } = useQuery({
    queryKey: QUERY_KEYS.releases.assets(orgId || "none"),
    queryFn: async () => {
      if (!token || !orgId) return [];
      const result = await assetsService.fetchInventory(token, orgId);
      return result.assets.map(a => ({ id: a.id, name: a.name }));
    },
    enabled: !!token && !!orgId,
  });

  // ── WebSocket real-time ─────────────────────────────────────────────
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedRefetch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.releases.all });
    }, 500);
  }, [queryClient]);

  const handleReleaseEvent = useCallback(() => {
    debouncedRefetch();
  }, [debouncedRefetch]);

  useSocket("release.created", handleReleaseEvent, !!token && !!orgId);
  useSocket("release.updated", handleReleaseEvent, !!token && !!orgId);
  useSocket("release.deleted", handleReleaseEvent, !!token && !!orgId);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ── Mutations ───────────────────────────────────────────────────────
  const deprecateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token || !orgId) throw new Error("Missing auth");
      await assetsService.updateRelease(token, orgId, id, { status: "deprecated" });
      return id;
    },
    onMutate: async (id: string) => {
      const key = QUERY_KEYS.releases.versions(orgId || "none");
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<InfiniteData<PaginatedBackendData<BackendRelease>>>(key);
      queryClient.setQueryData<InfiniteData<PaginatedBackendData<BackendRelease>>>(key, old => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            data: page.data.map(v => v.id === id ? { ...v, status: "deprecated" } : v),
          })),
        };
      });
      return { previous, key };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
    },
    onSuccess: () => toast.success("Release marked as deprecated"),
  });

  // ── Handlers ────────────────────────────────────────────────────────
  const handleCreate = () => {
    setEditingVersion(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (version: Version) => {
    setEditingVersion(version);
    setIsEditorOpen(true);
    setActiveMenu(null);
  };

  const handleDeprecate = async (id: string) => {
    try {
      await deprecateMutation.mutateAsync(id);
    } catch (err: unknown) {
      toast.error(`Failed to update release status: ${handleApiError(err)}`);
    }
    setActiveMenu(null);
  };

  const handleSaveVersion = async (versionData: Partial<Version> & { productId?: string; downloadUrl?: string; changelogItems?: string[] }) => {
    if (!token || !orgId) return;

    try {
      setIsSaving(true);

      const downloadUrl = versionData.downloadUrl || "";
      const fileSizeBytes = 0;

      const productId = versionData.productId || editingVersion?.productId;
      if (!productId) throw new Error("Product ID is required");

      const payload = {
        version: versionData.versionNumber,
        status: versionData.status,
        download_url: downloadUrl || undefined,
        file_size_bytes: fileSizeBytes || undefined,
        file_hash: versionData.checksum || undefined,
        min_app_version: versionData.compatibility || undefined,
        changelog: versionData.changelogItems || versionData.changelog || [],
        release_notes: versionData.changelogItems?.[0] || versionData.changelog?.[0] || "",
      };

      if (editingVersion) {
        await assetsService.updateRelease(token, orgId, editingVersion.id, payload);
        toast.success("Release updated successfully");
      } else {
        await assetsService.createRelease(token, orgId, productId, payload);
        toast.success("Release created successfully");
      }

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.releases.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
      setIsEditorOpen(false);
    } catch (err: unknown) {
      toast.error(`Failed to save release: ${handleApiError(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewDetails = (version: Version) => {
    setViewingVersion(version);
    setDetailsModalOpen(true);
    setActiveMenu(null);
  };

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  return {
    versions,
    isLoading,
    totalVersions,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
    activeMenu,
    isEditorOpen,
    editingVersion,
    detailsModalOpen,
    viewingVersion,
    handleCreate,
    handleEdit,
    handleDeprecate,
    handleSaveVersion,
    handleViewDetails,
    toggleMenu,
    setIsEditorOpen,
    setDetailsModalOpen,
    availableAssets,
    isSaving,
  };
};
