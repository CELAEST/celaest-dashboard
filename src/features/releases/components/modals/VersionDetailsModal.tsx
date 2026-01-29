import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Share2, Download, Clock } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";
import { Version } from "@/features/releases/types";
import { VersionDetailsHeader } from "./VersionDetails/VersionDetailsHeader";
import { VersionDetailsMetrics } from "./VersionDetails/VersionDetailsMetrics";
import { VersionDetailsChangelog } from "./VersionDetails/VersionDetailsChangelog";
import { VersionDetailsTechnical } from "./VersionDetails/VersionDetailsTechnical";

interface VersionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  version: Version | null;
}

export const VersionDetailsModal = ({
  isOpen,
  onClose,
  version,
}: VersionDetailsModalProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Keyboard accessibility: Esc to close
  useEscapeKey(onClose, isOpen && !!version);

  if (!version) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-99999"
          />
          <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] ${
                isDark
                  ? "bg-[#0a0a0a] border border-white/10"
                  : "bg-white border border-gray-200"
              }`}
              role="dialog"
              aria-modal="true"
            >
              <VersionDetailsHeader version={version} onClose={onClose} />

              {/* Scrollable Content */}
              <div
                className={`flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar ${
                  isDark ? "custom-scrollbar-dark" : "custom-scrollbar-light"
                }`}
              >
                <VersionDetailsMetrics version={version} />
                <VersionDetailsChangelog version={version} />
                <VersionDetailsTechnical version={version} />
              </div>

              {/* Footer Actions */}
              <div
                className={`p-4 border-t flex justify-between items-center gap-3 shrink-0 ${
                  isDark
                    ? "bg-gray-900/50 border-white/5"
                    : "bg-gray-50/80 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} />
                  Last viewed just now
                </div>

                <div className="flex gap-3">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-white"
                        : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg ${
                      isDark
                        ? "bg-cyan-500 text-black hover:bg-cyan-400"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    onClick={() => {
                      onClose();
                    }}
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
