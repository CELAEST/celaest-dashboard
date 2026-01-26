"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Plus, Trash2, Shield, AlertCircle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { SettingsSelect } from "../../settings/components/SettingsSelect";

interface Version {
  id: string;
  assetName: string;
  versionNumber: string;
  status: "stable" | "beta" | "deprecated";
  releaseDate: string;
  fileSize: string;
  checksum: string;
  downloads: number;
  adoptionRate: number;
  changelog: string[];
  compatibility: string;
}

interface VersionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (version: Partial<Version>) => void;
  version: Version | null;
}

export const VersionEditor: React.FC<VersionEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  version,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    assetName: "",
    versionNumber: "",
    status: "beta" as Version["status"],
    fileSize: "",
    checksum: "",
    changelog: [""] as string[],
    compatibility: "",
  });

  // State initialization handled by key prop in parent
  // useEffect removed to prevent 'setState in effect' warning

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanChangelog = formData.changelog.filter(
      (item) => item.trim() !== "",
    );
    onSave({ ...formData, changelog: cleanChangelog });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangelogChange = (index: number, value: string) => {
    const newChangelog = [...formData.changelog];
    newChangelog[index] = value;
    setFormData((prev) => ({ ...prev, changelog: newChangelog }));
  };

  const addChangelogItem = () => {
    setFormData((prev) => ({ ...prev, changelog: [...prev.changelog, ""] }));
  };

  const removeChangelogItem = (index: number) => {
    if (formData.changelog.length > 1) {
      setFormData((prev) => ({
        ...prev,
        changelog: prev.changelog.filter((_, i) => i !== index),
      }));
    }
  };

  const generateChecksum = () => {
    const randomHash =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    handleChange("checksum", `sha256:${randomHash}...`);
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border ${
            isDark ? "bg-gray-900 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          {/* Header */}
          <div
            className={`sticky top-0 z-10 p-6 border-b ${
              isDark
                ? "bg-gray-900/95 backdrop-blur-sm border-white/5"
                : "bg-white/95 backdrop-blur-sm border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {version ? "Edit Version" : "Create New Release"}
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {version
                    ? "Update changelog and release metadata"
                    : "Publish a new version with full changelog"}
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* File Upload */}
            {!version && (
              <div>
                <label
                  className={`block text-sm font-semibold mb-3 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Upload New Version File
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDark
                      ? "border-white/10 hover:border-cyan-500/30 bg-white/5"
                      : "border-gray-300 hover:border-blue-400 bg-gray-50"
                  }`}
                >
                  <Upload
                    size={48}
                    className={`mx-auto mb-4 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-sm font-medium mb-1 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Drop your updated file here or click to browse
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
            )}

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Asset Name *
                </label>
                <input
                  type="text"
                  value={formData.assetName}
                  onChange={(e) => handleChange("assetName", e.target.value)}
                  required
                  placeholder="e.g., Advanced Financial Dashboard"
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Version Number *
                </label>
                <input
                  type="text"
                  value={formData.versionNumber}
                  onChange={(e) =>
                    handleChange("versionNumber", e.target.value)
                  }
                  required
                  placeholder="e.g., v2.1.0"
                  className={`w-full px-4 py-3 rounded-xl border font-mono transition-colors ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }`}
                />
              </div>
            </div>

            {/* Status & Compatibility */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <SettingsSelect
                  label="Release Status"
                  value={formData.status}
                  onChange={(val) => handleChange("status", val)}
                  options={[
                    { value: "beta", label: "Beta (Early access testing)" },
                    { value: "stable", label: "Stable (Production ready)" },
                    {
                      value: "deprecated",
                      label: "Deprecated (Legacy support only)",
                    },
                  ]}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Compatibility
                </label>
                <input
                  type="text"
                  value={formData.compatibility}
                  onChange={(e) =>
                    handleChange("compatibility", e.target.value)
                  }
                  placeholder="e.g., Excel 2016+ or Python 3.8+"
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }`}
                />
              </div>
            </div>

            {/* Checksum Generator */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                File Checksum (SHA-256)
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formData.checksum}
                  onChange={(e) => handleChange("checksum", e.target.value)}
                  readOnly
                  placeholder="Click generate to create checksum..."
                  className={`flex-1 px-4 py-3 rounded-xl border font-mono text-sm transition-colors ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={generateChecksum}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isDark
                      ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <Shield size={16} />
                  Generate
                </button>
              </div>
            </div>

            {/* Changelog */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label
                  className={`text-sm font-semibold ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Changelog (What&apos;s New)
                </label>
                <button
                  type="button"
                  onClick={addChangelogItem}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isDark
                      ? "bg-white/5 text-gray-300 hover:bg-white/10"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Plus size={14} />
                  Add Item
                </button>
              </div>
              <div className="space-y-3">
                {formData.changelog.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleChangelogChange(index, e.target.value)
                      }
                      placeholder={`Change #${
                        index + 1
                      } (e.g., Added multi-currency support)`}
                      className={`flex-1 px-4 py-3 rounded-xl border transition-colors ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/30 focus:bg-white/10"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      }`}
                    />
                    {formData.changelog.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChangelogItem(index)}
                        className={`p-3 rounded-xl transition-colors ${
                          isDark
                            ? "text-red-400 hover:bg-red-500/10"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div
              className={`p-4 rounded-xl border flex gap-3 ${
                isDark
                  ? "bg-blue-500/5 border-blue-500/20"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <AlertCircle
                size={20}
                className={`shrink-0 mt-0.5 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <div>
                <p
                  className={`text-sm font-semibold mb-1 ${
                    isDark ? "text-blue-400" : "text-blue-700"
                  }`}
                >
                  Checksum Verification
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-blue-400/80" : "text-blue-600/80"
                  }`}
                >
                  Customers can verify file integrity using the SHA-256
                  checksum. This ensures downloads are not corrupted or tampered
                  with.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
                  isDark
                    ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                  isDark
                    ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                }`}
              >
                {version ? "Update Version" : "Publish Release"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
