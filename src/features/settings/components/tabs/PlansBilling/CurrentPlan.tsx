import React, { memo } from "react";
import { Zap } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface CurrentPlanProps {
  currentPlanName: string;
  nextBillingDate: string;
  billingCycle: "monthly" | "annually";
  onCycleChange: (cycle: "monthly" | "annually") => void;
}

export const CurrentPlan: React.FC<CurrentPlanProps> = memo(
  ({ currentPlanName, nextBillingDate, billingCycle, onCycleChange }) => {
    const { isDark } = useTheme();

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                isDark ? "bg-cyan-500/10" : "bg-cyan-50"
              }`}
            >
              <Zap
                className={`w-6 h-6 ${
                  isDark ? "text-cyan-400" : "text-cyan-600"
                }`}
              />
            </div>
            <div>
              <h3
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Current Plan:{" "}
                <span className="text-cyan-500">{currentPlanName}</span>
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Your next billing date is {nextBillingDate}.
              </p>
            </div>
          </div>

          <div
            className={`p-1 rounded-xl flex items-center shadow-sm transition-colors ${
              isDark ? "bg-white/5" : "bg-gray-100"
            }`}
          >
            <button
              onClick={() => onCycleChange("monthly")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
              }`}
            >
              MONTHLY
            </button>
            <button
              onClick={() => onCycleChange("annually")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "annually"
                  ? "bg-white text-gray-900 shadow-sm"
                  : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
              }`}
            >
              ANNUALLY
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black">
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
