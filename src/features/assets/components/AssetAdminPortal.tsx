import React, { useState } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { AssetEditor } from "./AssetEditor";
import { AssetTable } from "./AssetTable";
import { AssetHeader } from "./AssetHeader";
import { AssetMetrics } from "./AssetMetrics";
import { Asset } from "../hooks/useAssets";
import { AssetFormValues } from "../hooks/useAssetForm";

interface AssetAdminPortalProps {
  assets: Asset[];
  saveAsset: (data: Partial<Asset>, id?: string) => void;
  deleteAsset: (id: string) => void;
  duplicateAsset: (asset: Asset) => void;
}

export const AssetAdminPortal: React.FC<AssetAdminPortalProps> = ({
  assets,
  saveAsset,
  deleteAsset,
  duplicateAsset,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingAsset(null);
    setIsEditorOpen(true);
  };

  const handleSave = (data: AssetFormValues) => {
    // Transform string inputs (textarea) to arrays for the Asset type
    const transformedData: Partial<Asset> = {
      ...data,
      requirements: data.requirements
        ? data.requirements.split("\n").filter(Boolean)
        : [],
      features: data.features ? data.features.split("\n").filter(Boolean) : [],
      // Ensure other fields are passed correctly
      description: data.description || "",
      thumbnail: "", // In a real app, this would be the uploaded image URL
    };

    saveAsset(transformedData, editingAsset?.id);
    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Section */}
      <AssetMetrics />

      {/* CRUD Table Section */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          isDark
            ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <AssetHeader isDark={isDark} onCreate={handleCreate} />

        <AssetTable
          assets={assets}
          isDark={isDark}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          onEdit={handleEdit}
          onDuplicate={duplicateAsset}
          onDelete={deleteAsset}
        />

        <div
          className={`p-4 border-t flex items-center justify-between ${
            isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-200"
          }`}
        >
          <p
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Showing {assets.length} assets
          </p>
        </div>

        <AssetEditor
          key={editingAsset ? editingAsset.id : "new-asset"}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSave}
          asset={editingAsset}
        />
      </div>
    </div>
  );
};
