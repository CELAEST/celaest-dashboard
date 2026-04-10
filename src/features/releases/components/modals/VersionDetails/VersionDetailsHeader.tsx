import React, { memo } from "react";
import { Hash, X, CheckCircle, Warning, XCircle } from "@phosphor-icons/react";

import { useTheme } from "@/features/shared/hooks/useTheme";
import { Version } from "@/features/releases/types";

interface VersionDetailsHeaderProps {
  version: Version;
  onClose: () => void;
}

export const VersionDetailsHeader: React.FC<VersionDetailsHeaderProps> = memo(
  ({ version, onClose }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

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
          return <CheckCircle size={16} />;
        case "beta":
          return <Warning size={16} />;
        case "deprecated":
          return <XCircle size={16} />;
      }
    };

    return (
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
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 border ${
              isDark
                ? "bg-[#111] text-purple-400 border-white/10 shadow-purple-500/10"
                : "bg-white text-purple-600 border-gray-100"
            }`}
          >
            <Hash size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2
                className={`text-xl font-black italic tracking-tighter uppercase ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {version.versionNumber}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border uppercase tracking-wider ${getStatusColor(
                  version.status,
                )}`}
              >
                {getStatusIcon(version.status)}
                {version.status}
              </span>
            </div>
            <p
              className={`text-[10px] font-mono uppercase tracking-[0.2em] mt-0.5 ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {version.assetName}
            </p>
          </div>
        </div>

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
    );
  },
);

VersionDetailsHeader.displayName = "VersionDetailsHeader";
