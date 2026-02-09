import React, { useState, useEffect } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { AssetEditor } from "./AssetEditor";
import { AssetTable } from "./AssetTable";
import { AssetHeader } from "./AssetHeader";
import { AssetMetrics } from "./AssetMetrics";
import { Asset, assetsService } from "../services/assets.service";
import { CreateProductPayload, UpdateProductPayload } from "../api/assets.api";
import { AssetFormValues } from "../hooks/useAssetForm";
import { useAssetStore } from "../stores/useAssetStore";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrg } from "@/features/shared/contexts/OrgContext";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    if (session?.accessToken && orgId) {
      fetchInventory(session.accessToken, orgId);
    }
  }, [session?.accessToken, orgId, fetchInventory]);

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingAsset(null);
    setIsEditorOpen(true);
  };

  const handleSave = async (data: AssetFormValues) => {
    if (!session?.accessToken || !orgId) return;

    const transformedData: CreateProductPayload = {
      name: data.name,
      slug: editingAsset?.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
      short_description: data.description?.substring(0, 100),
      description: data.description,
      base_price: data.price,
      product_type: data.type,
      status: data.status,
      category_id: data.category,
    };

    setInventoryLoading(true);
    const operation = editingAsset
      ? assetsService.updateAsset(
          session.accessToken,
          orgId,
          editingAsset.id,
          transformedData as UpdateProductPayload,
        )
      : assetsService.createAsset(session.accessToken, orgId, transformedData);

    toast.promise(operation, {
      loading: editingAsset ? "Updating asset..." : "Creating asset...",
      success: () => {
        fetchInventory(session.accessToken!, orgId);
        setIsEditorOpen(false);
        return `Asset ${editingAsset ? "updated" : "created"} successfully!`;
      },
      error: (err: Error) => {
        setInventoryLoading(false);
        return `Error: ${err.message || "Failed to save asset"}`;
      },
    });
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
      />
    </div>
  );
};
