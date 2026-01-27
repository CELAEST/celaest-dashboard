import React from "react";
import { Calendar, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

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
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        className={`p-4 rounded-xl transition-all duration-300 ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30"
            : "bg-white/60 border border-gray-200 hover:border-blue-500/30 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Calendar
            className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
          />
          <div
            className={`text-xs font-semibold ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            NEXT BILLING DATE
          </div>
        </div>
        <div
          className={`text-base font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {nextBillingDate}
        </div>
      </motion.div>

      {/* Active Since */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        className={`p-4 rounded-xl transition-all duration-300 ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30"
            : "bg-white/60 border border-gray-200 hover:border-emerald-500/30 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle
            className={`w-4 h-4 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          />
          <div
            className={`text-xs font-semibold ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            ACTIVE SINCE
          </div>
        </div>
        <div
          className={`text-base font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {activeSince}
        </div>
      </motion.div>
    </div>
  );
};
