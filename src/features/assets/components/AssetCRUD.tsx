"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  MoreVertical,
  FileSpreadsheet,
  Code,
  Globe,
  Eye,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { AssetEditor } from "./AssetEditor";

interface Asset {
  id: string;
  name: string;
  type: "excel" | "script" | "google-sheet";
  category: string;
  price: number;
  operationalCost: number;
  status: "active" | "draft" | "archived";
  version: string;
  fileSize: string;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

export const AssetCRUD: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      name: "Advanced Financial Dashboard",
      type: "excel",
      category: "Finance",
      price: 149.99,
      operationalCost: 25.0,
      status: "active",
      version: "2.1.0",
      fileSize: "4.2 MB",
      downloads: 342,
      createdAt: "2025-11-15",
      updatedAt: "2026-01-10",
    },
    {
      id: "2",
      name: "Python Data Scraper Script",
      type: "script",
      category: "Automation",
      price: 89.99,
      operationalCost: 15.0,
      status: "active",
      version: "1.5.2",
      fileSize: "125 KB",
      downloads: 567,
      createdAt: "2025-09-20",
      updatedAt: "2025-12-05",
    },
    {
      id: "3",
      name: "Inventory Management Template",
      type: "google-sheet",
      category: "Operations",
      price: 59.99,
      operationalCost: 10.0,
      status: "active",
      version: "3.0.0",
      fileSize: "Cloud",
      downloads: 891,
      createdAt: "2025-08-10",
      updatedAt: "2025-11-22",
    },
    {
      id: "4",
      name: "CRM Analytics Bundle",
      type: "excel",
      category: "Sales",
      price: 199.99,
      operationalCost: 35.0,
      status: "draft",
      version: "1.0.0-beta",
      fileSize: "8.7 MB",
      downloads: 0,
      createdAt: "2026-01-05",
      updatedAt: "2026-01-18",
    },
  ]);

  const getTypeIcon = (type: Asset["type"]) => {
    switch (type) {
      case "excel":
        return <FileSpreadsheet size={18} className="text-emerald-500" />;
      case "script":
        return <Code size={18} className="text-blue-500" />;
      case "google-sheet":
        return <Globe size={18} className="text-orange-500" />;
    }
  };

  const getStatusColor = (status: Asset["status"]) => {
    switch (status) {
      case "active":
        return isDark
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "draft":
        return isDark
          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          : "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "archived":
        return isDark
          ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
          : "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setIsEditorOpen(true);
    setActiveMenu(null);
  };

  const handleCreate = () => {
    setEditingAsset(null);
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this asset? This will create a new archived version."
      )
    ) {
      setAssets(
        assets.map((a) =>
          a.id === id ? { ...a, status: "archived" as const } : a
        )
      );
      setActiveMenu(null);
    }
  };

  const handleDuplicate = (asset: Asset) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
      name: `${asset.name} (Copy)`,
      status: "draft",
      downloads: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setAssets([...assets, newAsset]);
    setActiveMenu(null);
  };

  const handleSaveAsset = (assetData: Partial<Asset>) => {
    if (editingAsset) {
      // Update existing
      setAssets(
        assets.map((a) =>
          a.id === editingAsset.id
            ? {
                ...a,
                ...assetData,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : a
        )
      );
    } else {
      // Create new
      const newAsset: Asset = {
        id: Date.now().toString(),
        name: assetData.name || "New Asset",
        type: assetData.type || "excel",
        category: assetData.category || "Uncategorized",
        price: assetData.price || 0,
        operationalCost: assetData.operationalCost || 0,
        status: assetData.status || "draft",
        version: "1.0.0",
        fileSize: "0 KB",
        downloads: 0,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setAssets([...assets, newAsset]);
    }
    setIsEditorOpen(false);
  };

  return (
    <>
      <div
        className={`rounded-2xl border overflow-hidden ${
          isDark
            ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${
            isDark ? "border-white/5" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Template Inventory
              </h3>
              <p
                className={`text-xs mt-1 ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                Full CRUD control with atomic versioning and metadata management
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              }`}
            >
              <Plus size={18} />
              Create Asset
            </motion.button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  isDark
                    ? "bg-white/2 border-white/5"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Asset
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Type
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Price
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Net Margin
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Version
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Downloads
                </th>
                <th
                  className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? "divide-white/5" : "divide-gray-200"
              }`}
            >
              {assets.map((asset, index) => {
                const netMargin = asset.price - asset.operationalCost;
                const marginPercentage = (
                  (netMargin / asset.price) *
                  100
                ).toFixed(1);

                return (
                  <motion.tr
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`transition-colors ${
                      isDark ? "hover:bg-white/2" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div
                          className={`text-sm font-semibold mb-1 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {asset.name}
                        </div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-gray-500" : "text-gray-600"
                          }`}
                        >
                          {asset.category} • {asset.fileSize}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(asset.type)}
                        <span
                          className={`text-sm capitalize ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {asset.type.replace("-", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-bold tabular-nums ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ${asset.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div
                          className={`text-sm font-bold tabular-nums ${
                            isDark ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        >
                          ${netMargin.toFixed(2)}
                        </div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-gray-500" : "text-gray-600"
                          }`}
                        >
                          {marginPercentage}% margin
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border uppercase ${getStatusColor(
                          asset.status
                        )}`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-mono ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        v{asset.version}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {asset.downloads.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === asset.id ? null : asset.id
                            )
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? "hover:bg-white/10 text-gray-400 hover:text-white"
                              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        <AnimatePresence>
                          {activeMenu === asset.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`absolute right-0 top-12 w-52 rounded-xl border shadow-xl z-20 overflow-hidden ${
                                isDark
                                  ? "bg-gray-900 border-white/10"
                                  : "bg-white border-gray-200"
                              }`}
                            >
                              <button
                                onClick={() => handleEdit(asset)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                                  isDark
                                    ? "text-gray-300 hover:bg-white/5"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <Edit2 size={16} />
                                Edit Asset
                              </button>
                              <button
                                onClick={() => handleDuplicate(asset)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                                  isDark
                                    ? "text-gray-300 hover:bg-white/5"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <Copy size={16} />
                                Duplicate (Version)
                              </button>
                              <button
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                                  isDark
                                    ? "text-gray-300 hover:bg-white/5"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <Eye size={16} />
                                Preview
                              </button>
                              <button
                                onClick={() => handleDelete(asset.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t ${
                                  isDark
                                    ? "text-red-400 hover:bg-red-500/10 border-white/5"
                                    : "text-red-600 hover:bg-red-50 border-gray-200"
                                }`}
                              >
                                <Trash2 size={16} />
                                Archive
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
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
      </div>

      {/* Asset Editor Modal */}
      <AssetEditor
        key={editingAsset ? editingAsset.id : "new-asset"}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveAsset}
        asset={editingAsset}
      />
    </>
  );
};
