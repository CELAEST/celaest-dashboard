import React from "react";
import { Check } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface CurrentPlanCardProps {
  plan: string;
  status: string;
  billingCycle: string;
  price: string;
}

export const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
  plan,
  status,
  billingCycle,
  price,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isActive = status.toLowerCase() === "active" || status.toLowerCase() === "trial";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl p-5 border transition-colors ${
        isDark
          ? "bg-white/[0.02] border-white/8 backdrop-blur-xl hover:border-white/12"
          : "bg-white border-gray-200 shadow-xs hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div
            className={`text-[10px] font-mono uppercase tracking-[0.18em] mb-1 ${
              isDark ? "text-white/40" : "text-gray-500"
            }`}
          >
            CURRENT PLAN
          </div>
          <div
            className={`text-lg sm:text-xl font-semibold tracking-tight ${
              isDark ? "text-zinc-100" : "text-gray-900"
            }`}
          >
            {plan}
          </div>
        </div>
        <div
          className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border flex items-center gap-1.5 shrink-0 ${
            isActive
              ? isDark
                ? "bg-white/[0.08] text-white border-white/10 shadow-xs font-semibold"
                : "bg-gray-900 text-white font-semibold"
              : isDark
                ? "bg-white/[0.03] text-white/50 border-white/[0.05]"
                : "bg-gray-100 text-gray-600 border-gray-200"
          }`}
        >
          {isActive && <Check size={11} strokeWidth={3} className="text-white/80" />}
          <span>{status.toUpperCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/6">
        <div>
          <div
            className={`text-[10px] font-mono uppercase tracking-wider mb-1 ${
              isDark ? "text-white/40" : "text-gray-500"
            }`}
          >
            BILLING CYCLE
          </div>
          <div
            className={`text-sm font-mono font-medium ${
              isDark ? "text-zinc-200" : "text-gray-900"
            }`}
          >
            {billingCycle}
          </div>
        </div>
        <div>
          <div
            className={`text-[10px] font-mono uppercase tracking-wider mb-1 ${
              isDark ? "text-white/40" : "text-gray-500"
            }`}
          >
            PRICE
          </div>
          <div
            className={`text-base font-mono font-bold tracking-tight ${
              isDark ? "text-zinc-100" : "text-gray-900"
            }`}
          >
            {price}/mo
          </div>
        </div>
      </div>
    </motion.div>
  );
};
