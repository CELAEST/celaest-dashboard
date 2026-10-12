import React, { memo } from "react";
import { Lightning } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";
import type { BillingCycle } from "@/features/billing/types";

interface CurrentPlanProps {
  currentPlanName: string;
  nextBillingDate: string;
  billingCycle: BillingCycle;
  onCycleChange: (cycle: BillingCycle) => void;
}

export const CurrentPlan: React.FC<CurrentPlanProps> = memo(
  ({ currentPlanName, nextBillingDate, billingCycle, onCycleChange }) => {
    const { isDark } = useTheme();
    const t = useTranslations("settings");

    const getPlanColor = (name: string) => {
      const lower = name.toLowerCase();
      if (lower.includes("enterprise")) return "text-amber-400";
      if (lower.includes("pro")) return "text-violet-400";
      if (lower.includes("starter") || lower.includes("basic")) return "text-sky-400";
      return isDark ? "text-white" : "text-gray-900";
    };

    return (
      <div className="settings-glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${
                isDark ? "bg-white/[0.04] border-white/10 text-white/70" : "bg-gray-100 border-gray-200 text-gray-700"
              }`}
            >
              <Lightning className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3
                className={`text-sm sm:text-base font-bold font-jakarta tracking-tight truncate ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("current_plan")}{" "}
                <span className={`font-mono font-bold ${getPlanColor(currentPlanName)}`}>
                  {currentPlanName}
                </span>
              </h3>
              <p
                className={`text-[11px] sm:text-xs mt-0.5 font-mono truncate ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                {t("next_billing_date", { date: nextBillingDate })}
              </p>
            </div>
          </div>

          <div
            className={`w-full sm:w-auto grid grid-cols-2 sm:flex sm:items-center p-1 rounded-xl border ${
              isDark ? "bg-white/[0.03] border-white/8" : "bg-gray-100 border-gray-200"
            }`}
          >
            <button
              onClick={() => onCycleChange("monthly")}
              className={`flex-1 sm:flex-none justify-center px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center ${
                billingCycle === "monthly"
                  ? isDark
                    ? "bg-white/10 text-white shadow-xs"
                    : "bg-white text-gray-900 shadow-xs"
                  : isDark
                    ? "text-white/40 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => onCycleChange("yearly")}
              className={`flex-1 sm:flex-none justify-center px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === "yearly"
                  ? isDark
                    ? "bg-white/10 text-white shadow-xs"
                    : "bg-white text-gray-900 shadow-xs"
                  : isDark
                    ? "text-white/40 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {t("annually")}
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                -20%
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  },
);

CurrentPlan.displayName = "CurrentPlan";
