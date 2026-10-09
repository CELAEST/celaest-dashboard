import React, { memo } from "react";
import { Sparkle, ArrowsClockwise, CheckCircle } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface UpdateSummaryProps {
  updateCount: number;
  onDownloadAll?: () => void;
}

export const UpdateSummary: React.FC<UpdateSummaryProps> = memo(
  ({ updateCount, onDownloadAll }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const t = useTranslations("releases");
    const hasUpdates = updateCount > 0;

    return (
      <div
        className={`relative rounded-xl border backdrop-blur-xl overflow-hidden transition-colors ${
          isDark
            ? "bg-[#080c14]/80 border-white/8"
            : "bg-white border-gray-200/80 shadow-xs"
        }`}
      >
        <div className="relative p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                hasUpdates
                  ? isDark
                    ? "bg-white/[0.05] border-white/10 text-white"
                    : "bg-gray-100 border-gray-200 text-gray-900"
                  : isDark
                    ? "bg-white/[0.03] border-white/8 text-white/70"
                    : "bg-gray-100 border-gray-200 text-gray-700"
              }`}
            >
              {hasUpdates ? (
                <ArrowsClockwise
                  size={18}
                  weight="bold"
                  className={isDark ? "text-white" : "text-gray-900"}
                />
              ) : (
                <CheckCircle
                  size={18}
                  weight="bold"
                  className={isDark ? "text-white/70" : "text-gray-700"}
                />
              )}
            </div>

            {/* Text */}
            <div className="min-w-0">
              <h2
                className={`text-sm sm:text-base font-semibold tracking-tight ${
                  isDark ? "text-zinc-100" : "text-gray-900"
                }`}
              >
                {hasUpdates
                  ? updateCount === 1
                    ? t("update_summary_title_single", { count: updateCount })
                    : t("update_summary_title_plural", { count: updateCount })
                  : t("update_summary_desc")}
              </h2>
              {hasUpdates && (
                <p
                  className={`text-[11px] font-mono tracking-wider uppercase mt-0.5 ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}
                >
                  {t("update_summary_desc")}
                </p>
              )}
            </div>
          </div>

          {/* Actions & Badge */}
          {hasUpdates && (
            <div className="flex items-center gap-2.5">
              {onDownloadAll && (
                <button
                  type="button"
                  onClick={onDownloadAll}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowsClockwise size={13} weight="bold" />
                  <span>Actualizar Todo</span>
                </button>
              )}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold uppercase tracking-wider border ${
                  isDark
                    ? "bg-white/10 text-white border-white/15 shadow-xs"
                    : "bg-gray-900 text-white border-gray-800 shadow-xs"
                }`}
              >
                <Sparkle size={12} weight="fill" />
                <span>{updateCount}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

UpdateSummary.displayName = "UpdateSummary";
