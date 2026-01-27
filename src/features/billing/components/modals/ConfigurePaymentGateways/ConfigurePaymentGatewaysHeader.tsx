import React from "react";
import { CreditCard } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const ConfigurePaymentGatewaysHeader: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative p-6 border-b border-white/10 shrink-0">
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            duration: 0.8,
            bounce: 0.5,
          }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            isDark
              ? "bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
              : "bg-linear-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/20"
          }`}
        >
          <CreditCard
            className={`w-8 h-8 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
          />
        </motion.div>
        <div>
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Payment Gateway Configuration
          </h2>
          <p
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Manage API keys, webhooks, and gateway settings
          </p>
        </div>
      </div>
    </div>
  );
};
