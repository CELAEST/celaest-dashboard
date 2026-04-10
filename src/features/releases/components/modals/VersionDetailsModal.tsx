import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShareNetwork, DownloadSimple, Clock } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
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
              className={`relative w-full max-w-2xl rounded-4xl border shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] ${
                isDark
                  ? "bg-[#0a0a0a] border-white/10 shadow-black/60"
                  : "bg-white border-gray-200 shadow-gray-200/80"
              }`}
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
              <VersionDetailsHeader version={version} onClose={onClose} />

              {/* Scrollable Content */}
              <div
                className={`flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar ${
                  isDark ? "custom-scrollbar-dark" : "custom-scrollbar-light"
                }`}
              >
                <VersionDetailsMetrics version={version} />
                <VersionDetailsChangelog version={version} />
                <VersionDetailsTechnical version={version} />
              </div>

              {/* Footer Actions */}
              <div className="relative shrink-0">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />
                <div
                  className={`px-5 py-3.5 flex justify-between items-center gap-3 ${
                    isDark
                      ? "bg-purple-500/3 border-t border-purple-500/15"
                      : "bg-purple-50/60 border-t border-purple-200/60"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    <Clock size={12} />
                    Last viewed just now
                  </div>

                  <div className="flex gap-2.5">
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        isDark
                          ? "bg-white/5 hover:bg-white/8 text-gray-300 border border-white/8"
                          : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <ShareNetwork size={15} />
                      Share
                    </button>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                        isDark
                          ? "bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                          : "bg-purple-600 text-white hover:bg-purple-700 border-purple-700"
                      }`}
                      onClick={() => {
                        onClose();
                      }}
                    >
                      <DownloadSimple size={15} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
