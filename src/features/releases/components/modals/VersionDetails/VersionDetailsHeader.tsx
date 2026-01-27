import React, { memo } from "react";
import { Hash, X, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

import { useTheme } from "@/features/shared/contexts/ThemeContext";
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
          return <CheckCircle2 size={16} />;
        case "beta":
          return <AlertTriangle size={16} />;
        case "deprecated":
          return <XCircle size={16} />;
      }
    };

    return (
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
    );
  },
);

VersionDetailsHeader.displayName = "VersionDetailsHeader";
