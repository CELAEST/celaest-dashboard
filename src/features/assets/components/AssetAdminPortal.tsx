"use client";

import React, { useState } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { AssetEditor } from "./AssetEditor";
import { AssetTable } from "./AssetTable";
import { AssetHeader } from "./AssetHeader";
import { AssetMetrics } from "./AssetMetrics";
import { Asset } from "../hooks/useAssets";
import { AssetFormValues } from "../hooks/useAssetForm";
import { motion, AnimatePresence } from "motion/react";

interface AssetAdminPortalProps {
  assets: Asset[];
  saveAsset: (data: Partial<Asset>, id?: string) => void;
  deleteAsset: (id: string) => void;
  duplicateAsset: (asset: Asset) => void;
  activeTab: "inventory" | "analytics";
}

export const AssetAdminPortal: React.FC<AssetAdminPortalProps> = ({
  assets,
  saveAsset,
  deleteAsset,
  duplicateAsset,
  activeTab,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Asset Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingAsset(null);
    setIsEditorOpen(true);
  };

  const handleSave = (data: AssetFormValues) => {
    const transformedData: Partial<Asset> = {
      ...data,
      requirements: data.requirements
        ? data.requirements.split("\n").filter(Boolean)
        : [],
      features: data.features ? data.features.split("\n").filter(Boolean) : [],
      description: data.description || "",
      thumbnail: "",
    };

    saveAsset(transformedData, editingAsset?.id);
    setIsEditorOpen(false);
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
                  {/* Scrollable Container */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="h-full w-full overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                      <AssetTable
                        assets={assets}
                        isDark={isDark}
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        onEdit={handleEdit}
                        onDuplicate={duplicateAsset}
                        onDelete={deleteAsset}
                      />
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div
                  className={`p-2 border-t flex items-center justify-between shrink-0 ${isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-200"}`}
                >
                  <p
                    className={`text-[10px] uppercase font-mono tracking-widest ${isDark ? "text-gray-500" : "text-gray-600"}`}
                  >
                    Total Assets:{" "}
                    <span className={isDark ? "text-white" : "text-black"}>
                      {assets.length}
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

      {/* Editor Modal */}
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
