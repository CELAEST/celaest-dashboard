import React, { memo } from "react";
import { Download, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { CustomerAsset } from "../../../types";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface UpdateItemHeaderProps {
  asset: CustomerAsset;
}

export const UpdateItemHeader: React.FC<UpdateItemHeaderProps> = memo(
  ({ asset }) => {
    const { isDark } = useTheme();

    return (
      <div
        className={`p-6 ${
          asset.hasUpdate ? (isDark ? "bg-cyan-500/5" : "bg-cyan-50/50") : ""
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {asset.name}
              </h3>
              {asset.hasUpdate && (
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    isDark
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "bg-cyan-100 text-cyan-700 border border-cyan-300"
                  }`}
                >
                  <Download size={12} />
                  UPDATE AVAILABLE
                </span>
              )}
            </div>

            {/* Version Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold uppercase ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Installed:
                </span>
                <span
                  className={`text-sm font-mono px-2 py-0.5 rounded ${
                    isDark
                      ? "bg-white/10 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {asset.currentVersion}
                </span>
              </div>
              {asset.hasUpdate && (
                <>
                  <span className={isDark ? "text-gray-600" : "text-gray-400"}>
                    →
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold uppercase ${
                        isDark ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      Latest:
                    </span>
                    <span
                      className={`text-sm font-mono px-2 py-0.5 rounded ${
                        isDark
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-cyan-100 text-cyan-700 border border-cyan-300"
                      }`}
                    >
                      {asset.latestVersion}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Status Icon */}
          <div
            className={`p-3 rounded-xl ${
              asset.hasUpdate
                ? isDark
                  ? "bg-cyan-500/10"
                  : "bg-cyan-100"
                : isDark
                  ? "bg-emerald-500/10"
                  : "bg-emerald-100"
            }`}
          >
            {asset.hasUpdate ? (
              <AlertCircle
                size={24}
                className={isDark ? "text-cyan-400" : "text-cyan-600"}
              />
            ) : (
              <CheckCircle2
                size={24}
                className={isDark ? "text-emerald-400" : "text-emerald-600"}
              />
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <Clock
              size={14}
              className={isDark ? "text-gray-600" : "text-gray-400"}
            />
            <span className={isDark ? "text-gray-500" : "text-gray-600"}>
              Purchased:{" "}
              {new Date(asset.purchaseDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div
            className={`px-2 py-1 rounded ${
              isDark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-600"
            }`}
          >
            {asset.compatibility}
          </div>
        </div>
      </div>
    );
  },
);

UpdateItemHeader.displayName = "UpdateItemHeader";
