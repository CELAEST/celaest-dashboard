import React, { memo } from "react";
import { Sparkle, ArrowsClockwise, CheckCircle } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface UpdateSummaryProps {
  updateCount: number;
}

export const UpdateSummary: React.FC<UpdateSummaryProps> = memo(
  ({ updateCount }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const t = useTranslations("releases");
    const hasUpdates = updateCount > 0;

    return (
      <div
        className={`relative rounded-2xl border overflow-hidden ${
          hasUpdates
            ? isDark
              ? "bg-linear-to-br from-cyan-500/8 via-transparent to-purple-500/8 border-cyan-500/20"
              : "bg-linear-to-br from-cyan-50 via-white to-purple-50 border-cyan-200"
            : isDark
              ? "bg-linear-to-br from-emerald-500/5 via-transparent to-transparent border-emerald-500/15"
              : "bg-linear-to-br from-emerald-50 via-white to-white border-emerald-200"
        }`}
      >
        {/* Subtle grid pattern */}
        {isDark && (
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        )}

        <div className="relative p-4 sm:p-5 flex items-center gap-4">
          {/* Icon */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              hasUpdates
                ? isDark
                  ? "bg-cyan-500/10 border border-cyan-500/20"
                  : "bg-cyan-100 border border-cyan-200"
                : isDark
                  ? "bg-emerald-500/10 border border-emerald-500/20"
                  : "bg-emerald-100 border border-emerald-200"
            }`}
          >
            {hasUpdates ? (
              <ArrowsClockwise
                size={20}
                weight="bold"
                className={`${isDark ? "text-cyan-400" : "text-cyan-600"} ${hasUpdates ? "animate-spin" : ""}`}
                style={{ animationDuration: "3s" }}
              />
            ) : (
              <CheckCircle
                size={20}
                weight="fill"
                className={isDark ? "text-emerald-400" : "text-emerald-600"}
              />
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h2
              className={`text-sm sm:text-base font-bold ${
                isDark ? "text-white" : "text-gray-900"
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
                className={`text-xs mt-0.5 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("update_summary_desc")}
              </p>
            )}
          </div>

          {/* Badge */}
          {hasUpdates && (
            <div className="shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  isDark
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25"
                    : "bg-cyan-100 text-cyan-700 border border-cyan-200"
                }`}
              >
                <Sparkle size={12} weight="fill" />
                {updateCount}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

UpdateSummary.displayName = "UpdateSummary";
