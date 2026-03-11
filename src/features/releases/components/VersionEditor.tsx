"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CircleNotch, PencilSimple, Rocket } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { Version } from "../types";
import { useVersionEditor } from "../hooks/useVersionEditor";
import { VersionFileUpload } from "./VersionEditor/VersionFileUpload";
import { VersionBasicInfo } from "./VersionEditor/VersionBasicInfo";
import { VersionChangelog } from "./VersionEditor/VersionChangelog";
import { VersionSecurity } from "./VersionEditor/VersionSecurity";

interface VersionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: Partial<Version> & {
      productId?: string;
      downloadUrl?: string;
      changelogItems?: string[];
    },
  ) => void;
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
    handleUrlChange,
    generateChecksum,
    handleChangelogChange,
    addChangelogItem,
    removeChangelogItem,
    handleSubmit,
    downloadUrl,
  } = useVersionEditor({ version: version || null, onSave, onClose });

  const autoFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => { autoFocusRef.current?.focus(); }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
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
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          className={`relative w-full max-w-2xl flex flex-col rounded-4xl border shadow-2xl overflow-hidden ${
            isDark
              ? "bg-[#0a0a0a] border-white/10 shadow-black/60"
              : "bg-white border-gray-200 shadow-gray-200/80"
          }`}
          style={{ maxHeight: "min(90vh, 780px)" }}
          role="dialog"
          aria-modal="true"
        >
          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-px z-20 bg-linear-to-r from-transparent via-purple-500/70 to-transparent" />

          {/* Corner glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "22rem",
              height: "22rem",
              background: "radial-gradient(circle at top right, rgba(168,85,247,0.06), transparent 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Header */}
          <div className="relative px-8 py-6 border-b border-white/8 flex items-center justify-between overflow-hidden shrink-0">
            {/* Gradient wash */}
            <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 via-violet-600/8 to-transparent" />
            {/* Grid dots */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                pointerEvents: "none",
              }}
            />
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-px w-2/5 bg-linear-to-r from-purple-500/50 to-transparent" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 bg-[#111] text-purple-400 border border-white/10 shadow-purple-500/10">
                {version ? <PencilSimple size={24} /> : <Rocket size={24} />}
              </div>
              <div>
                <h2 className={`text-xl font-black italic tracking-tighter uppercase ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  {version ? "Edit Version" : "Publish New Release"}
                </h2>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                  {version
                    ? version.versionNumber
                    : "Link a GitHub release and fill in the version details"}
                </p>
              </div>
            </div>

            {/* Version tags (edit mode) */}
            {version && (
              <div className="relative z-10 flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold uppercase ${
                  version.status === "stable"
                    ? isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : version.status === "beta"
                      ? isDark ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : "bg-yellow-50 border-yellow-200 text-yellow-700"
                      : isDark ? "bg-gray-500/10 border-gray-500/20 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-600"
                }`}>
                  {version.status}
                </span>
              </div>
            )}

            <div className="relative z-10">
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-6"
          >
            {/* GitHub URL — show in both create and edit mode */}
            <VersionFileUpload
              downloadUrl={downloadUrl}
              onUrlChange={handleUrlChange}
            />

            {/* Project link — read-only, only visible when editing and product has a URL */}
            {version && version.projectUrl && (
              <div className={`rounded-xl border p-4 ${
                isDark ? "bg-white/3 border-white/8" : "bg-gray-50 border-gray-200"
              }`}>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}>
                  Project Link
                </p>
                <a
                  href={version.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm font-mono wrap-anywhere hover:underline ${
                    isDark ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  {version.projectUrl}
                </a>
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
          </form>

          {/* Footer — fixed */}
          <div className={`shrink-0 px-6 py-4 border-t flex gap-3 ${
            isDark ? "border-purple-500/20 bg-purple-500/4" : "border-purple-100 bg-purple-50/40"
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isDark
                  ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              form={undefined}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : isDark
                    ? "bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30"
                    : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
              }`}
            >
              {isSubmitting ? (
                <>
                  <CircleNotch size={16} className="animate-spin" />
                  {version ? "Updating..." : "Publishing..."}
                </>
              ) : version ? (
                "Update Version"
              ) : (
                "Publish Release"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
