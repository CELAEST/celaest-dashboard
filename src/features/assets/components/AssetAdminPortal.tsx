import React, { useState, useEffect } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { AssetEditor } from "./AssetEditor";
import { AssetTable } from "./AssetTable";
import { AssetHeader } from "./AssetHeader";
import { AssetMetrics } from "./AssetMetrics";
import { ProductDetailModal } from "./ProductDetailModal";
import { Asset, assetsService } from "../services/assets.service";
import { CreateProductPayload, UpdateProductPayload } from "../api/assets.api";
import { AssetFormValues } from "../hooks/useAssetForm";
import { useAssetStore } from "../stores/useAssetStore";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrg } from "@/features/shared/contexts/OrgContext";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { socket } from "@/lib/socket-client";

interface AssetAdminPortalProps {
  activeTab: "inventory" | "analytics";
}

export const AssetAdminPortal: React.FC<AssetAdminPortalProps> = ({
  activeTab,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { session } = useAuthStore();
  const { org } = useOrg();
  const orgId = org?.id;

  const { inventory, isInventoryLoading, fetchInventory, setInventoryLoading } =
    useAssetStore();

  // Asset Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [previewingAsset, setPreviewingAsset] = useState<Asset | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    if (session?.accessToken && orgId) {
      fetchInventory(session.accessToken, orgId, {});
    }
  }, [session, orgId, fetchInventory]);

  // Real-time updates for Inventory
  useEffect(() => {
    if (!session?.accessToken || !orgId) return;

    // Ensure socket is connected (idempotent)
    socket.connect(session.accessToken, orgId);

    const handleRefresh = () => {
      console.log(
        "[AssetAdminPortal] Real-time activity detected. Refreshing inventory...",
      );
      fetchInventory(session.accessToken!, orgId, { silent: true });
    };

    const unsubCreated = socket.on("product.created", handleRefresh);
    const unsubUpdated = socket.on("product.updated", handleRefresh);
    const unsubDeleted = socket.on("product.deleted", handleRefresh);

    return () => {
      unsubCreated();
      unsubUpdated();
      unsubDeleted();
    };
  }, [session, orgId, fetchInventory]);

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingAsset(null);
    setIsEditorOpen(true);
  };

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
      } catch (err) {
        toast.error(`Upload failed: ${(err as Error).message}`);
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
      } catch (err) {
        toast.error(`Product file upload failed: ${(err as Error).message}`);
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
      category_id: data.category,
      thumbnail_url: finalThumbnailUrl,
      external_url: data.external_url,
    };

    setInventoryLoading(true);

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
        await assetsService.createRelease(session.accessToken, asset.id, {
          version: "1.0.0", // Default version for MVP
          status: "stable",
          download_url: productFileUrl,
          file_size_bytes: productFileSize,
        });
        toast.success("Release v1.0.0 created successfully!");
      }

      toast.success(
        `Asset ${editingAsset ? "updated" : "created"} successfully!`,
      );

      fetchInventory(session.accessToken!, orgId);
      setIsEditorOpen(false);
    } catch (err) {
      const error = err as Error;
      toast.error(`Error: ${error.message || "Failed to save asset"}`);
    } finally {
      setInventoryLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!session?.accessToken || !orgId) return;

    if (window.confirm("Are you sure you want to archive this asset?")) {
      try {
        await assetsService.deleteAsset(session.accessToken, orgId, id);
        toast.success("Asset archived");
        fetchInventory(session.accessToken, orgId);
      } catch (err) {
        const error = err as Error;
        toast.error(`Error: ${error.message}`);
      }
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
      fetchInventory(session.accessToken, orgId);
    } catch (err) {
      const error = err as Error;
      toast.error(`Error duplicating: ${error.message}`);
    }
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
              className="h-full flex flex-col pb-2 relative"
            >
              <div
                className={`flex-1 relative backdrop-blur-xl border rounded-3xl overflow-hidden flex flex-col ${isDark ? "bg-[#0a0a0a]/60 border-white/5" : "bg-white border-gray-200 shadow-sm"}`}
              >
                <div
                  className={`shrink-0 border-b ${isDark ? "border-white/5" : "border-gray-100"}`}
                >
                  <AssetHeader isDark={isDark} onCreate={handleCreate} />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="h-full w-full overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
                          activeMenu={activeMenu}
                          setActiveMenu={setActiveMenu}
                          onEdit={handleEdit}
                          onDuplicate={handleDuplicate}
                          onDelete={handleDelete}
                          onPreview={handlePreview}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`p-2 border-t flex items-center justify-between shrink-0 ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-200"}`}
                >
                  <p
                    className={`text-[10px] uppercase font-mono tracking-widest ${isDark ? "text-gray-500" : "text-gray-600"}`}
                  >
                    Inventory:{" "}
                    <span className={isDark ? "text-white" : "text-black"}>
                      {inventory.length}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <AssetMetrics />
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
    </div>
  );
};
