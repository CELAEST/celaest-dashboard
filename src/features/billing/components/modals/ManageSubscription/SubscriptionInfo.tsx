import React from "react";
import { CalendarBlank, Check } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface SubscriptionInfoProps {
  nextBillingDate: string;
  activeSince: string;
}

export const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({
  nextBillingDate,
  activeSince,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Next Billing Date */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className={`p-4 rounded-xl border transition-colors ${
          isDark
            ? "bg-white/[0.02] border-white/6 hover:border-white/12"
            : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
        }`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <CalendarBlank
            className={`w-3.5 h-3.5 ${isDark ? "text-white/50" : "text-gray-500"}`}
          />
          <div
            className={`text-[10px] font-mono uppercase tracking-[0.18em] ${
              isDark ? "text-white/40" : "text-gray-500"
            }`}
          >
            NEXT BILLING DATE
          </div>
        </div>
        <div
          className={`text-sm sm:text-base font-mono font-semibold tracking-wider ${
            isDark ? "text-zinc-100" : "text-gray-900"
          }`}
        >
          {nextBillingDate}
        </div>
      </motion.div>

      {/* Active Since */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`p-4 rounded-xl border transition-colors ${
          isDark
            ? "bg-white/[0.02] border-white/6 hover:border-white/12"
            : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
        }`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Check
            size={12}
            strokeWidth={3}
            className={isDark ? "text-white/50" : "text-gray-500"}
          />
          <div
            className={`text-[10px] font-mono uppercase tracking-[0.18em] ${
              isDark ? "text-white/40" : "text-gray-500"
            }`}
          >
            ACTIVE SINCE
          </div>
        </div>
        <div
          className={`text-sm sm:text-base font-mono font-semibold tracking-wider ${
            isDark ? "text-zinc-100" : "text-gray-900"
          }`}
        >
          {activeSince}
        </div>
      </motion.div>
    </div>
  );
};
