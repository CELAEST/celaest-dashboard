"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Version } from "../types";
import { useVersionEditor } from "../hooks/useVersionEditor";
import { VersionFileUpload } from "./VersionEditor/VersionFileUpload";
import { VersionBasicInfo } from "./VersionEditor/VersionBasicInfo";
import { VersionChangelog } from "./VersionEditor/VersionChangelog";
import { VersionSecurity } from "./VersionEditor/VersionSecurity";

interface VersionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  version?: Version | null;
  assets?: { id: string; name: string }[];
  isSubmitting?: boolean;
}

export const VersionEditor: React.FC<VersionEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  version,
  assets,
  isSubmitting,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    formData,
    handleChange,
    generateChecksum,
    handleChangelogChange,
    addChangelogItem,
    removeChangelogItem,
    handleSubmit,
    selectedFile,
    setSelectedFile,
  } = useVersionEditor({ version: version || null, onSave, onClose });

  const autoFocusRef = useRef<HTMLInputElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure modal is mounted and animation started
      const timer = setTimeout(() => {
        autoFocusRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard support (Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
          className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border flex flex-col ${
            isDark ? "bg-gray-900 border-white/10" : "bg-white border-gray-200"
          }`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div
            className={`sticky top-0 z-10 p-6 border-b shrink-0 ${
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
                aria-label="Close modal"
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
            {!version && (
              <VersionFileUpload
                onFileSelect={(files) => {
                  if (files && files.length > 0) {
                    setSelectedFile(files[0]);
                  }
                }}
              />
            )}

            {selectedFile && (
              <div
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  isDark
                    ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-400"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded bg-current/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold">FILE</span>
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs opacity-70">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 hover:bg-current/10 rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <VersionBasicInfo
              formData={formData}
              assets={assets}
              isEdit={!!version}
              onChange={handleChange}
              autoFocusRef={autoFocusRef}
            />

            <VersionChangelog
              changelog={formData.changelog}
              onChange={handleChangelogChange}
              onAdd={addChangelogItem}
              onRemove={removeChangelogItem}
            />

            <VersionSecurity
              checksum={formData.checksum}
              onChange={(val) => handleChange("checksum", val)}
              onGenerate={generateChecksum}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
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
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed bg-gray-600/20 text-gray-500"
                    : isDark
                      ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {version ? "Updating..." : "Publishing..."}
                  </>
                ) : version ? (
                  "Update Version"
                ) : (
                  "Publish Release"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
