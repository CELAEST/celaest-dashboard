import { useState, useEffect, useCallback } from "react";
import { Version } from "../types";
import { assetsService } from "@/features/assets/services/assets.service";
import { useApiAuth } from "@/lib/use-api-auth";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error-handler";

export const useVersionControl = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<Version | null>(null);
  const [availableAssets, setAvailableAssets] = useState<{ id: string; name: string }[]>([]);

  const { token, orgId } = useApiAuth();

  const fetchVersions = useCallback(async () => {
    if (!token || !orgId) {
        console.log("[useVersionControl] Missing auth:", { hasToken: !!token, orgId });
        // Ensure loading is false if auth is missing/pending to avoid stuck UI
        setIsLoading(false); 
        return;
    }

    console.log("[useVersionControl] Fetching versions for:", orgId);

    try {
      const response = await assetsService.getGlobalReleases(token, orgId);
      console.log("[useVersionControl] API Response:", response);
      
      if (!response || !response.data || !Array.isArray(response.data)) {
        console.log("[useVersionControl] Empty or invalid response data");
        setVersions([]);
        return;
      }
      
      const mappedVersions: Version[] = response.data.map((rel: any) => ({
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

      setVersions(mappedVersions);
    } catch {
      toast.error("Failed to load release history");
    } finally {
      setIsLoading(false);
    }
  }, [token, orgId]);

  const fetchAssets = useCallback(async () => {
    if (!token || !orgId) return;
    try {
      const assets = await assetsService.fetchInventory(token, orgId);
      setAvailableAssets(assets.map(a => ({ id: a.id, name: a.name })));
    } catch {
      console.error("Failed to fetch assets for release creation");
    }
  }, [token, orgId]);

  useEffect(() => {
    fetchVersions();
    fetchAssets();
  }, [fetchVersions, fetchAssets, token, orgId]);

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
    if (!token || !orgId) return;
    try {
      await assetsService.updateRelease(token, orgId, id, { status: "deprecated" });
      setVersions(
        versions.map((v) =>
          v.id === id ? { ...v, status: "deprecated" as const } : v,
        ),
      );
      toast.success("Release marked as deprecated");
    } catch (err) {
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

      // 1. Upload file if present
      if (versionData.file) {
        // Dynamic import to avoid SSR issues if any (though this hook is likely client-side)
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

      // 2. Create Release
      const productId = versionData.productId || editingVersion?.productId;
      if (!productId) throw new Error("Product ID is required");

      if (editingVersion) {
         await assetsService.updateRelease(token, orgId, editingVersion.id, {
          version: versionData.versionNumber,
          status: versionData.status,
          download_url: downloadUrl || undefined,
          file_size_bytes: fileSizeBytes || undefined,
          file_hash: versionData.checksum || undefined,
          min_app_version: versionData.compatibility || undefined,
          changelog: versionData.changelogItems || versionData.changelog || [],
          release_notes: versionData.changelogItems?.[0] || versionData.changelog?.[0] || "",
        });
        toast.success("Release updated successfully");
      } else {
        await assetsService.createRelease(token, orgId, productId, {
          version: versionData.versionNumber,
          status: versionData.status,
          download_url: downloadUrl || undefined,
          file_size_bytes: fileSizeBytes || undefined,
          file_hash: versionData.checksum || undefined,
          min_app_version: versionData.compatibility || undefined,
          changelog: versionData.changelogItems || versionData.changelog || [],
          release_notes: versionData.changelogItems?.[0] || versionData.changelog?.[0] || "",
        });
        toast.success("Release created successfully");
      }
      setIsEditorOpen(false);
      // No need to fetchVersions() here if sockets are working, but keeping it as fallback
      // fetchVersions(); 
    } catch (err) {
      toast.error(`Failed to save release: ${handleApiError(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Socket Listeners
  useEffect(() => {
    const socket = (window as any).socket; // Assuming global socket instance available via context/window
    // Ideally use useSocket hook if available
    if (!socket) return;
    
    // Listen for release events
    const handleReleaseCreated = (data: any) => {
        // data.payload matches Release struct
        console.log("Release created event:", data);
        fetchVersions(); 
    };
    
    const handleReleaseUpdated = (data: any) => {
        console.log("Release updated event:", data);
        fetchVersions();
    };

    const handleReleaseDeleted = (data: any) => {
        console.log("Release deleted event:", data);
        fetchVersions();
    };

    socket.on("release.created", handleReleaseCreated);
    socket.on("release.updated", handleReleaseUpdated);
    socket.on("release.deleted", handleReleaseDeleted); 

    return () => {
        socket.off("release.created", handleReleaseCreated);
        socket.off("release.updated", handleReleaseUpdated);
        socket.off("release.deleted", handleReleaseDeleted);
    };
  }, [fetchVersions]);

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

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
