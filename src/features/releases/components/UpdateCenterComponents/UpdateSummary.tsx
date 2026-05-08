import React, { memo } from "react";
import { Sparkle } from "@phosphor-icons/react";
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

    return (
      <div
        className={`rounded-2xl border p-6 ${
          isDark
            ? "bg-linear-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20"
            : "bg-linear-to-r from-cyan-50 to-purple-50 border-cyan-200"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {updateCount === 1 
                ? t("update_summary_title_single", { count: updateCount }) 
                : t("update_summary_title_plural", { count: updateCount })}
            </h2>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("update_summary_desc")}
            </p>
          </div>
          <Sparkle
            size={32}
            className={isDark ? "text-cyan-400" : "text-cyan-600"}
          />
        </div>
      </div>
    );
  },
);

UpdateSummary.displayName = "UpdateSummary";
