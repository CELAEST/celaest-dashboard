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
        <div className="relative p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0">
            {/* Icon */}
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors mt-0.5 sm:mt-0 ${
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
                  size={16}
                  weight="bold"
                  className={isDark ? "text-white" : "text-gray-900 sm:scale-110"}
                />
              ) : (
                <CheckCircle
                  size={16}
                  weight="bold"
                  className={isDark ? "text-white/70" : "text-gray-700 sm:scale-110"}
                />
              )}
            </div>

            {/* Text & Inline Count */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  className={`text-xs sm:text-base font-semibold tracking-tight ${
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
                  <span
                    className={`inline-flex sm:hidden items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      isDark
                        ? "bg-white/10 text-white border-white/15 shadow-xs"
                        : "bg-gray-900 text-white border-gray-800 shadow-xs"
                    }`}
                  >
                    <Sparkle size={10} weight="fill" />
                    <span>{updateCount}</span>
                  </span>
                )}
              </div>
              {hasUpdates && (
                <p
                  className={`text-[10px] sm:text-[11px] font-mono tracking-wider uppercase mt-0.5 ${
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
            <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              {onDownloadAll && (
                <button
                  type="button"
                  onClick={onDownloadAll}
                  className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl sm:rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowsClockwise size={13} weight="bold" />
                  <span>Actualizar Todo</span>
                </button>
              )}
              <span
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold uppercase tracking-wider border ${
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
