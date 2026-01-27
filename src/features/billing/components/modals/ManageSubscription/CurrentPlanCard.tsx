import React from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`rounded-2xl p-5 ${
        isDark
          ? "bg-linear-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
          : "bg-linear-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/20 shadow-lg"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div
            className={`text-xs font-semibold tracking-wider mb-1 ${
              isDark ? "text-cyan-300" : "text-blue-700"
            }`}
          >
            CURRENT PLAN
          </div>
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {plan}
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1 ${
            isDark
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600"
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          {status.toUpperCase()}
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div
            className={`text-xs font-semibold mb-1 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            BILLING CYCLE
          </div>
          <div
            className={`text-base font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {billingCycle}
          </div>
        </div>
        <div>
          <div
            className={`text-xs font-semibold mb-1 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            PRICE
          </div>
          <div
            className={`text-base font-bold ${
              isDark ? "text-cyan-400" : "text-blue-600"
            }`}
          >
            {price}/mo
          </div>
        </div>
      </div>
    </motion.div>
  );
};
