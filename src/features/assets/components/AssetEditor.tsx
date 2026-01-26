"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Upload,
  AlertCircle,
  FileSpreadsheet,
  Code,
  Globe,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { SettingsSelect } from "../../settings/components/SettingsSelect";

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

interface AssetEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Partial<Asset>) => void;
  asset: Asset | null;
}

const CATEGORY_OPTIONS = [
  { value: "Finance", label: "Finance" },
  { value: "Automation", label: "Automation" },
  { value: "Operations", label: "Operations" },
  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Analytics", label: "Analytics" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft (Hidden from marketplace)" },
  { value: "active", label: "Active (Visible to customers)" },
  { value: "archived", label: "Archived (Legacy version)" },
];

export const AssetEditor: React.FC<AssetEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  asset,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState(() => {
    if (asset) {
      return {
        name: asset.name,
        type: asset.type,
        category: asset.category,
        price: asset.price,
        operationalCost: asset.operationalCost,
        status: asset.status,
        description: "",
        requirements: "",
      };
    }
    return {
      name: "",
      type: "excel" as Asset["type"],
      category: "",
      price: 0,
      operationalCost: 0,
      status: "draft" as Asset["status"],
      description: "",
      requirements: "",
    };
  });

  // State initialization handled by key prop in parent
  // useEffect removed to prevent 'setState in effect' warning

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${
            isDark ? "bg-gray-900 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          {/* Header */}
          <div
            className={`sticky top-0 z-10 p-6 border-b ${
              isDark
                ? "bg-gray-900/95 backdrop-blur-md border-white/5"
                : "bg-white/95 backdrop-blur-md border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className={`text-2xl font-bold tracking-tight ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {asset ? "Edit Asset" : "Create New Asset"}
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {asset
                    ? "Update metadata and versioning"
                    : "Upload and configure digital asset"}
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-white/10 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* File Upload Area */}
            <div>
              <label
                className={`block text-xs uppercase tracking-wider font-bold mb-3 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Upload File
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDark
                    ? "border-white/10 hover:border-cyan-500/30 bg-white/5 hover:bg-white/10"
                    : "border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isDark ? "bg-white/5" : "bg-white shadow-sm"
                  }`}
                >
                  <Upload
                    size={24}
                    className={isDark ? "text-gray-400" : "text-gray-600"}
                  />
                </div>
                <p
                  className={`text-sm font-medium mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Drop your file here or click to browse
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Supports: .xlsm, .py, .js, Google Sheets link (Max 50MB)
                </p>
              </div>
            </div>

            {/* Asset Type */}
            <div>
              <label
                className={`block text-xs uppercase tracking-wider font-bold mb-3 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Asset Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    value: "excel",
                    label: "Excel Macro",
                    icon: FileSpreadsheet,
                  },
                  { value: "script", label: "Script/Code", icon: Code },
                  {
                    value: "google-sheet",
                    label: "Google Sheet",
                    icon: Globe,
                  },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.type === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleChange("type", type.value)}
                      className={`p-4 rounded-xl border transition-all relative overflow-hidden group ${
                        isSelected
                          ? isDark
                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                            : "bg-blue-50 border-blue-500 text-blue-700 shadow-md"
                          : isDark
                            ? "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/10"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Icon
                          size={24}
                          className={`transition-colors ${
                            isSelected
                              ? "opacity-100"
                              : "opacity-50 group-hover:opacity-100"
                          }`}
                        />
                        <div className="text-xs font-bold">{type.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Asset Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  placeholder="e.g., Advanced Financial Dashboard"
                  className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  }`}
                />
              </div>

              <div>
                <SettingsSelect
                  label="Category *"
                  value={formData.category}
                  onChange={(val) => handleChange("category", val)}
                  options={CATEGORY_OPTIONS}
                  placeholder="Select category"
                />
              </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label
                  className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Sale Price *
                </label>
                <div className="relative">
                  <span
                    className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      handleChange("price", parseFloat(e.target.value))
                    }
                    required
                    className={`w-full pl-8 pr-4 py-3 rounded-lg border transition-all outline-none ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white focus:border-cyan-500/30 focus:bg-white/10"
                        : "bg-white border-gray-200 text-gray-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Operational Cost
                </label>
                <div className="relative">
                  <span
                    className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.operationalCost}
                    onChange={(e) =>
                      handleChange(
                        "operationalCost",
                        parseFloat(e.target.value),
                      )
                    }
                    className={`w-full pl-8 pr-4 py-3 rounded-lg border transition-all outline-none ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white focus:border-cyan-500/30 focus:bg-white/10"
                        : "bg-white border-gray-200 text-gray-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Net Margin
                </label>
                <div
                  className={`px-4 py-3.5 rounded-lg border flex items-center ${
                    isDark
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}
                >
                  <div className="font-bold">
                    ${(formData.price - formData.operationalCost).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <SettingsSelect
                label="Publish Status"
                value={formData.status}
                onChange={(val) => handleChange("status", val)}
                options={STATUS_OPTIONS}
              />
            </div>

            {/* Description */}
            <div>
              <label
                className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                placeholder="Detailed description of the asset, features, and use cases..."
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                }`}
              />
            </div>

            {/* Requirements */}
            <div>
              <label
                className={`block text-xs uppercase tracking-wider font-bold mb-2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Technical Requirements
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleChange("requirements", e.target.value)}
                rows={3}
                placeholder="e.g., Excel 2016 or higher, Windows 10+, macros enabled..."
                className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                }`}
              />
            </div>

            {/* Security Notice */}
            <div
              className={`p-4 rounded-xl border flex gap-3 ${
                isDark
                  ? "bg-orange-500/5 border-orange-500/20"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <AlertCircle
                size={20}
                className={`shrink-0 mt-0.5 ${
                  isDark ? "text-orange-400" : "text-orange-600"
                }`}
              />
              <div>
                <p
                  className={`text-sm font-semibold mb-1 ${
                    isDark ? "text-orange-400" : "text-orange-700"
                  }`}
                >
                  Security Validation
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-orange-400/80" : "text-orange-600/80"
                  }`}
                >
                  All uploaded files will be scanned for malicious code before
                  publication. Excel macros (.xlsm) undergo additional security
                  validation.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-6 py-3.5 rounded-xl font-bold transition-colors ${
                  isDark
                    ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg ${
                  isDark
                    ? "bg-linear-to-r from-cyan-600 to-cyan-500 text-white hover:shadow-cyan-500/25"
                    : "bg-linear-to-r from-blue-600 to-blue-500 text-white hover:shadow-blue-500/25"
                }`}
              >
                {asset ? "Update Asset" : "Create Asset"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
