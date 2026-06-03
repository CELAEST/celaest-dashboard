import React, { memo } from "react";
import { DownloadSimple, Clock, Warning, CheckCircle, ArrowRight, Package } from "@phosphor-icons/react";
import { CustomerAsset } from "../../../types";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface UpdateItemHeaderProps {
  asset: CustomerAsset;
}

export const UpdateItemHeader: React.FC<UpdateItemHeaderProps> = memo(
  ({ asset }) => {
    const { isDark } = useTheme();
    const t = useTranslations("releases");

    return (
      <div
        className={`p-4 sm:p-5 ${
          asset.hasUpdate ? (isDark ? "bg-cyan-500/5" : "bg-cyan-50/30") : ""
        }`}
      >
        {/* Top row: Icon + Name + Badge */}
        <div className="flex items-start gap-3 mb-3">
          {/* Product icon */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              asset.hasUpdate
                ? isDark
                  ? "bg-cyan-500/10 border border-cyan-500/20"
                  : "bg-cyan-100 border border-cyan-200"
                : isDark
                  ? "bg-emerald-500/10 border border-emerald-500/20"
                  : "bg-emerald-100 border border-emerald-200"
            }`}
          >
            <Package
              size={18}
              weight="duotone"
              className={
                asset.hasUpdate
                  ? isDark ? "text-cyan-400" : "text-cyan-600"
                  : isDark ? "text-emerald-400" : "text-emerald-600"
              }
            />
          </div>

          {/* Name + status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`text-sm sm:text-base font-bold truncate ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {asset.name}
              </h3>
              {asset.hasUpdate ? (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                    isDark
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25"
                      : "bg-cyan-100 text-cyan-700 border border-cyan-200"
                  }`}
                >
                  <DownloadSimple size={10} weight="bold" />
                  {t("badge_update_available")}
                </span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                    isDark
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  <CheckCircle size={10} weight="bold" />
                  {t("action_up_to_date")}
                </span>
              )}
            </div>

            {/* Metadata row */}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock
                  size={12}
                  className={isDark ? "text-gray-600" : "text-gray-400"}
                />
                <span className={`text-[11px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  {t("label_purchased")}{" "}
                  {new Date(asset.purchaseDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {asset.compatibility && asset.compatibility !== "null" && asset.compatibility !== "undefined" && (
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    isDark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {asset.compatibility}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Version comparison strip */}
        <div
          className={`flex items-center gap-2 sm:gap-3 rounded-xl p-2.5 sm:p-3 ${
            isDark ? "bg-white/[0.03] border border-white/5" : "bg-gray-50 border border-gray-100"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {t("label_installed")}
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                isDark
                  ? "bg-white/8 text-gray-300 border border-white/5"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              v{asset.currentVersion}
            </span>
          </div>

          {asset.hasUpdate && (
            <>
              <ArrowRight
                size={14}
                className={`shrink-0 ${isDark ? "text-cyan-500/60" : "text-cyan-500"}`}
              />
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {t("label_latest")}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    isDark
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25"
                      : "bg-cyan-50 text-cyan-700 border border-cyan-200"
                  }`}
                >
                  v{asset.latestVersion}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
);

UpdateItemHeader.displayName = "UpdateItemHeader";
