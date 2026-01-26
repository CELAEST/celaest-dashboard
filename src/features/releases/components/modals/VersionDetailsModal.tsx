import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  HardDrive,
  Download,
  Shield,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Hash,
  Share2,
  Copy,
  Clock,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Version } from "../VersionControl";

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

  if (!version) return null;

  const getStatusColor = (status: Version["status"]) => {
    switch (status) {
      case "stable":
        return isDark
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
          : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "beta":
        return isDark
          ? "bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
          : "bg-amber-50 text-amber-700 border-amber-200";
      case "deprecated":
        return isDark
          ? "bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
          : "bg-red-50 text-red-700 border-red-200";
    }
  };

  const getStatusIcon = (status: Version["status"]) => {
    switch (status) {
      case "stable":
        return <CheckCircle2 size={16} />;
      case "beta":
        return <AlertTriangle size={16} />;
      case "deprecated":
        return <XCircle size={16} />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a small toast here if available, but for now just copy
  };

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
            >
              {/* Header with Gradient */}
              <div className="relative p-6 shrink-0">
                <div
                  className={`absolute inset-0 opacity-20 ${
                    isDark
                      ? "bg-linear-to-r from-cyan-500 via-blue-600 to-purple-600"
                      : "bg-linear-to-r from-cyan-100 via-blue-100 to-purple-100"
                  }`}
                />

                <div className="relative flex items-start justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`h-16 w-16 rounded-xl flex items-center justify-center text-3xl shadow-lg border ${
                        isDark
                          ? "bg-gray-900 border-white/10 text-cyan-400"
                          : "bg-white border-gray-100 text-blue-600"
                      }`}
                    >
                      <Hash strokeWidth={2.5} size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2
                          className={`text-2xl font-bold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {version.versionNumber}
                        </h2>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${getStatusColor(
                            version.status,
                          )}`}
                        >
                          {getStatusIcon(version.status)}
                          {version.status}
                        </span>
                      </div>
                      <p
                        className={`font-medium ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {version.assetName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-full transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-gray-400 hover:text-white"
                        : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div
                className={`flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar ${
                  isDark ? "custom-scrollbar-dark" : "custom-scrollbar-light"
                }`}
              >
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Released",
                      value: new Date(version.releaseDate).toLocaleDateString(),
                      icon: Calendar,
                      color: "text-blue-500",
                    },
                    {
                      label: "Size",
                      value: version.fileSize,
                      icon: HardDrive,
                      color: "text-purple-500",
                    },
                    {
                      label: "Downloads",
                      value: version.downloads.toLocaleString(),
                      icon: Download,
                      color: "text-emerald-500",
                    },
                    {
                      label: "Adoption",
                      value: `${version.adoptionRate}%`,
                      icon: Activity,
                      color: "text-cyan-500",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border ${
                        isDark
                          ? "bg-white/5 border-white/5"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <stat.icon size={18} className={`mb-2 ${stat.color}`} />
                      <div
                        className={`text-xs mb-0.5 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {stat.label}
                      </div>
                      <div
                        className={`text-sm font-bold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Changelog */}
                <div>
                  <h3
                    className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <FileText size={16} /> Update Notes
                  </h3>
                  <div
                    className={`rounded-xl border p-5 ${
                      isDark
                        ? "bg-white/5 border-white/5"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <ul className="space-y-3">
                      {version.changelog.map((log, index) => (
                        <li key={index} className="flex gap-3 text-sm">
                          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {log}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical Details */}
                <div>
                  <h3
                    className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Shield size={16} /> Security & Compatibility
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`p-4 rounded-xl border ${
                        isDark
                          ? "bg-white/5 border-white/5"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div
                        className={`text-xs mb-2 ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        SHA-256 Checksum
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <code
                          className={`text-xs font-mono truncate ${
                            isDark ? "text-cyan-400" : "text-blue-600"
                          }`}
                        >
                          {version.checksum}
                        </code>
                        <button
                          onClick={() => copyToClipboard(version.checksum)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark
                              ? "hover:bg-white/10 text-gray-400 hover:text-white"
                              : "hover:bg-gray-200 text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    <div
                      className={`p-4 rounded-xl border ${
                        isDark
                          ? "bg-white/5 border-white/5"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div
                        className={`text-xs mb-2 ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        Compatibility
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {version.compatibility}
                      </div>
                    </div>
                  </div>
                </div>
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
                      // Download logic would go here
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
