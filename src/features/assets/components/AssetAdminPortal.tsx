import React, { useState } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { AssetEditor } from "./AssetEditor";
import { AssetTable } from "./AssetTable";
import { AssetMetrics } from "./AssetMetrics";
import { CategoryManagementTab } from "./CategoryManagementTab";
import { ProductDetailModal } from "./ProductDetailModal";
import { Asset, assetsService } from "../services/assets.service";
import { CreateProductPayload, UpdateProductPayload } from "../api/assets.api";
import { AssetFormValues } from "../hooks/useAssetForm";
import { useOrgInventory } from "../hooks/useAssets";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ReleaseManagementModal } from "./ReleaseManagementModal";
import { ConfirmArchiveModal } from "./ConfirmArchiveModal";
import { TableChrome } from "@/components/layout/TableChrome";
import { AssetMenuState } from "./AssetActionMenu";

interface AssetAdminPortalProps {
  activeTab: "inventory" | "categories" | "analytics";
  analyticsPeriod?: string;
  onCreateRef?: (fn: () => void) => void;
  onCategoryCreateRef?: (fn: () => void) => void;
}

export const AssetAdminPortal: React.FC<AssetAdminPortalProps> = ({
  activeTab,
  analyticsPeriod = "month",
  onCreateRef,
  onCategoryCreateRef,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { session } = useAuthStore();
  const { currentOrg: org } = useOrgStore();
  const orgId = org?.id;

  const {
    data: inventory = [],
    total: inventoryTotal,
    hasNextPage: inventoryHasNextPage,
    isFetchingNextPage: inventoryIsFetchingNextPage,
    fetchNextPage: inventoryFetchNextPage,
    isLoading: isInventoryLoading,
    refetch: fetchInventory,
  } = useOrgInventory();

  // Asset Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [previewingAsset, setPreviewingAsset] = useState<Asset | null>(null);
  const [activeMenu, setActiveMenu] = useState<AssetMenuState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenMenu = (e: React.MouseEvent, asset: Asset) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const menuHeight = 220;
    const spaceBelow = window.innerHeight - rect.bottom;
    const showAbove = spaceBelow < menuHeight;
    setActiveMenu({
      id: asset.id,
      x: rect.right - 12,
      y: showAbove ? window.innerHeight - rect.top + 8 : rect.bottom + 8,
      align: showAbove ? "bottom" : "top",
    });
  };

  // Note: Local listeners removed - synchronized via useRealtimeDashboard globally

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingAsset(null);
    setIsEditorOpen(true);
  };

  // Expose handleCreate to parent
  React.useEffect(() => {
    onCreateRef?.(handleCreate);
  }, [onCreateRef]);

  const handlePreview = (asset: Asset) => {
    setPreviewingAsset(asset);
  };

  const handleModalAction = async (
    asset: Asset,
    type: "download" | "cart" | "docs",
  ) => {
    if (type === "download") {
      if (!session?.accessToken) return;
      try {
        toast.info(`Preparing download for ${asset.name}...`);
        const { download_url } = await assetsService.downloadAsset(
          session.accessToken,
          asset.id,
        );
        if (download_url) {
          window.open(download_url, "_blank");
          toast.success("Download started");
        }
      } catch {
        toast.error("Failed to start download");
      }
    } else {
      toast.info(
        `Action '${type}' is only available in the public Marketplace, but it's verified!`,
      );
    }
  };

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async (data: AssetFormValues) => {
    if (!session?.accessToken || !orgId) return;

    let finalThumbnailUrl = data.thumbnail_url;

    // 1. Handle actual file upload if there's a pending image
    if (data.pending_image instanceof File) {
      try {
        setIsUploading(true);
        setUploadProgress(0);

        const file = data.pending_image;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;

        const { supabase } = await import("@/lib/supabase/client");
        if (!supabase) throw new Error("Supabase client not available");

        // Simulate progress for UI (actual upload progress is harder to track with .upload() without a custom client)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 10));
        }, 200);

        const { error } = await supabase.storage
          .from("products")
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        clearInterval(progressInterval);
        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        finalThumbnailUrl = urlData.publicUrl;
        setUploadProgress(100);
      } catch (err: unknown) {
        toast.error(
          `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        setIsUploading(false);
        return;
      }
    }

    // 2. Handle Product File Upload (if any)
    let productFileUrl: string | null = null;
    let productFileSize: number = 0;

    if (data.productFile instanceof File) {
      try {
        setIsUploading(true);
        setUploadProgress(0);

        const file = data.productFile;
        const fileExt = file.name.split(".").pop();
        const fileName = `releases/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

        const { supabase } = await import("@/lib/supabase/client");
        if (!supabase) throw new Error("Supabase client not available");

        // Simulate progress
        setUploadProgress(20);

        const { error } = await supabase.storage
          .from("products")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        productFileUrl = urlData.publicUrl;
        productFileSize = file.size;
        setUploadProgress(100);
      } catch (err: unknown) {
        toast.error(
          `Product file upload failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        setIsUploading(false);
        return;
      }
    }

    const transformedData: CreateProductPayload = {
      name: data.name,
      slug: editingAsset?.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
      short_description: data.description?.substring(0, 100),
      description: data.description,
      base_price: data.price,
      product_type: data.type,
      status: data.status,
      is_public: data.is_public,
      category_id: data.category_id,
      thumbnail_url: finalThumbnailUrl,
      external_url: data.external_url,
      github_repository: data.github_repository,
      features: data.features ? data.features.split("\n").filter(Boolean) : [],
      tags: data.tags ? data.tags.split("\n").filter(Boolean) : [],
      technical_stack: data.technical_stack
        ? data.technical_stack.split("\n").filter(Boolean)
        : [],
      requirements: data.requirements
        ? data.requirements.split("\n").filter(Boolean)
        : [],
      min_plan_tier: data.min_plan_tier,
    };

    // setInventoryLoading removed

    try {
      // Create or Update Asset
      const asset = editingAsset
        ? await assetsService.updateAsset(
            session.accessToken,
            orgId,
            editingAsset.id,
            transformedData as UpdateProductPayload,
          )
        : await assetsService.createAsset(
            session.accessToken,
            orgId,
            transformedData,
          );

      // 3. Create Release if file was uploaded
      if (productFileUrl) {
        await assetsService.createRelease(
          session.accessToken,
          orgId,
          asset.id,
          {
            version: "1.0.0", // Default version for MVP
            status: "stable",
            download_url: productFileUrl,
            file_size_bytes: productFileSize,
          },
        );
        toast.success("Release v1.0.0 created successfully!");
      }

      toast.success(
        `Asset ${editingAsset ? "updated" : "created"} successfully!`,
      );

      fetchInventory();
      setIsEditorOpen(false);
    } catch (err: unknown) {
      toast.error(
        `Error: ${err instanceof Error ? err.message : "Failed to save asset"}`,
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = (id: string) => {
    const asset = inventory.find((a) => a.id === id);
    setDeleteTarget({ id, name: asset?.name ?? "este asset" });
  };

  const confirmDelete = async () => {
    if (!session?.accessToken || !orgId || !deleteTarget) return;
    setIsDeleting(true);
    try {
      await assetsService.deleteAsset(session.accessToken, orgId, deleteTarget.id);
      toast.success(`"${deleteTarget.name}" archivado correctamente`);
      fetchInventory();
      setDeleteTarget(null);
    } catch (err: unknown) {
      toast.error(
        `Error: ${err instanceof Error ? err.message : "Failed to archive"}`,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (asset: Asset) => {
    if (!session?.accessToken || !orgId) return;

    const duplicateData: CreateProductPayload = {
      name: `${asset.name} (Copy)`,
      product_type: asset.type,
      is_public: false,
      description: asset.description,
      thumbnail_url: asset.thumbnail,
      slug: `${asset.slug}-copy-${Date.now()}`,
    };

    try {
      await assetsService.createAsset(
        session.accessToken,
        orgId,
        duplicateData,
      );
      toast.success("Asset duplicated");
      fetchInventory();
    } catch (err: unknown) {
      toast.error(
        `Error duplicating: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  // Release Management State
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [selectedAssetForReleases, setSelectedAssetForReleases] =
    useState<Asset | null>(null);

  const handleManageReleases = (asset: Asset) => {
    setSelectedAssetForReleases(asset);
    setIsReleaseModalOpen(true);
    setActiveMenu(null);
  };

  return (
    <div className="h-full w-full flex flex-col min-h-0 overflow-hidden relative">
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          {activeTab === "inventory" ? (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <TableChrome
                toolbar={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                      <span
                        className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        All Assets
                      </span>
                    </div>
                    <span className={`text-[11px] tabular-nums ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {inventoryTotal != null ? `Showing ${inventory.length} of ${inventoryTotal} entries` : ""}
                    </span>
                  </div>
                }
              >
                {isInventoryLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"
                    />
                  </div>
                ) : (
                  <AssetTable
                    assets={inventory}
                    isDark={isDark}
                    isLoading={isInventoryLoading}
                    activeMenu={activeMenu}
                    onOpenMenu={handleOpenMenu}
                    onCloseMenu={() => setActiveMenu(null)}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    totalItems={inventoryTotal}
                    hasNextPage={inventoryHasNextPage}
                    isFetchingNextPage={inventoryIsFetchingNextPage}
                    onLoadMore={inventoryFetchNextPage}
                    hideFooter
                    onDownload={async (asset) => {
                      if (!session?.accessToken) {
                        toast.error("Authentication required");
                        return;
                      }

                      try {
                        toast.info("Preparing secure download...");
                        const { download_url } =
                          await assetsService.downloadAsset(
                            session.accessToken,
                            asset.id,
                          );

                        if (!download_url) {
                          throw new Error(
                            "No download URL returned from server",
                          );
                        }

                        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                        if (!apiUrl)
                          throw new Error(
                            "NEXT_PUBLIC_API_URL is not configured",
                          );
                        const url = `${apiUrl}${download_url}`;

                        const response = await fetch(url, {
                          headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                          },
                        });

                        if (!response.ok) {
                          const err = await response.json();
                          throw new Error(err.error || "Download failed");
                        }

                        const blob = await response.blob();
                        const objUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = objUrl;

                        const urlObj = new URL(url);
                        const fileName =
                          urlObj.searchParams.get("asset") ||
                          "bundle.zip";

                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(objUrl);
                        document.body.removeChild(a);
                        toast.success("Download completed");
                      } catch (err: unknown) {
                        toast.error(
                          `Download error: ${err instanceof Error ? err.message : "Unknown error"}`,
                        );
                      }
                    }}
                    onPreview={handlePreview}
                    onManageReleases={handleManageReleases}
                  />
                )}
              </TableChrome>
            </motion.div>
          ) : activeTab === "analytics" ? (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <AssetMetrics period={analyticsPeriod} />
            </motion.div>
          ) : (
            <motion.div
              key="categories"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <CategoryManagementTab isDark={isDark} onCreateRef={onCategoryCreateRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AssetEditor
        key={editingAsset ? editingAsset.id : "new-asset"}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        asset={editingAsset}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
      />

      <ProductDetailModal
        product={previewingAsset}
        onClose={() => setPreviewingAsset(null)}
        onAction={handleModalAction}
      />

      <ReleaseManagementModal
        isOpen={isReleaseModalOpen}
        onClose={() => setIsReleaseModalOpen(false)}
        asset={selectedAssetForReleases}
      />

      <ConfirmArchiveModal
        isOpen={!!deleteTarget}
        assetName={deleteTarget?.name ?? ""}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
