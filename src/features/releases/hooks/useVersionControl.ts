import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Version } from "../types";
import { assetsService } from "@/features/assets/services/assets.service";
import { useApiAuth } from "@/lib/use-api-auth";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error-handler";
import { useSocket } from "@/features/shared/hooks/useSocket";

import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

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
  const { data: versions = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.releases.versions(orgId || "none"),
    queryFn: async (): Promise<Version[]> => {
      if (!token || !orgId) return [];
      const response = await assetsService.getGlobalReleases(token, orgId);
      if (!response?.data || !Array.isArray(response.data)) return [];

      return response.data.map((rel) => ({
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
      }));
    },
    enabled: !!token && !!orgId,
  });

  const { data: availableAssets = [] } = useQuery({
    queryKey: QUERY_KEYS.releases.assets(orgId || "none"),
    queryFn: async () => {
      if (!token || !orgId) return [];
      const assets = await assetsService.fetchInventory(token, orgId);
      return assets.map(a => ({ id: a.id, name: a.name }));
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
      const previous = queryClient.getQueryData<Version[]>(key);
      queryClient.setQueryData<Version[]>(key, old =>
        (old || []).map(v => v.id === id ? { ...v, status: "deprecated" as const } : v)
      );
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

  const handleSaveVersion = async (versionData: Partial<Version> & { productId?: string; file?: File; changelogItems?: string[] }) => {
    if (!token || !orgId) return;

    try {
      setIsSaving(true);
      
      let downloadUrl = "";
      let fileSizeBytes = 0;

      if (versionData.file) {
        const { supabase } = await import("@/lib/supabase/client");
        if (!supabase) throw new Error("Supabase client not available");

        const fileExt = versionData.file.name.split(".").pop();
        const fileName = `releases/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
          .from("products")
          .upload(fileName, versionData.file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);
        
        downloadUrl = urlData.publicUrl;
        fileSizeBytes = versionData.file.size;
      }

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
