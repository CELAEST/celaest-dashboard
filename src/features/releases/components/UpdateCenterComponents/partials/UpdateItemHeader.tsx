import React, { memo } from "react";
import { DownloadSimple, Clock, CheckCircle, ArrowRight, Package } from "@phosphor-icons/react";
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
      <div className="p-4 sm:p-5">
        {/* Top row: Icon + Name + Badge */}
        <div className="flex items-start gap-3 mb-3">
          {/* Product icon */}
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
              isDark
                ? "bg-white/[0.04] border-white/8 text-white/80"
                : "bg-gray-100 border-gray-200 text-gray-700"
            }`}
          >
            <Package size={17} weight="duotone" />
          </div>

          {/* Name + status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`text-sm sm:text-base font-semibold tracking-tight truncate ${
                  isDark ? "text-zinc-100" : "text-gray-900"
                }`}
              >
                {asset.name}
              </h3>
              {asset.hasUpdate ? (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider whitespace-nowrap border ${
                    isDark
                      ? "bg-white/10 text-white border-white/15 shadow-xs"
                      : "bg-gray-900 text-white border-gray-800 shadow-xs"
                  }`}
                >
                  <DownloadSimple size={10} weight="bold" />
                  {t("badge_update_available")}
                </span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider whitespace-nowrap border ${
                    isDark
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
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
                  className={isDark ? "text-white/30" : "text-gray-400"}
                />
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider ${
                    isDark ? "text-white/40" : "text-gray-500"
                  }`}
                >
                  {t("label_purchased")}{" "}
                  {new Date(asset.purchaseDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {asset.compatibility &&
                asset.compatibility !== "null" &&
                asset.compatibility !== "undefined" && (
                  <span
                    className={`text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded border ${
                      isDark
                        ? "bg-white/[0.02] border-white/6 text-white/40"
                        : "bg-gray-100 border-gray-200 text-gray-500"
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
          className={`flex items-center gap-2 sm:gap-3 rounded-lg p-2.5 sm:p-3 border ${
            isDark
              ? "bg-white/[0.02] border-white/6"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`text-[10px] font-mono uppercase tracking-wider shrink-0 ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {t("label_installed")}
            </span>
            <span
              className={`text-xs font-mono font-medium px-2 py-0.5 rounded-md border ${
                isDark
                  ? "bg-white/[0.04] text-white/70 border-white/8"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              v{asset.currentVersion}
            </span>
          </div>

          {asset.hasUpdate && (
            <>
              <ArrowRight
                size={13}
                className={`shrink-0 ${
                  isDark ? "text-white/30" : "text-gray-400"
                }`}
              />
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider shrink-0 ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}
                >
                  {t("label_latest")}
                </span>
                <span
                  className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md border ${
                    isDark
                      ? "bg-white/10 text-white border-white/15"
                      : "bg-gray-900 text-white border-gray-800"
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
