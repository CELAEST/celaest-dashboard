import React from "react";
import { RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface AutoRenewToggleProps {
  autoRenew: boolean;
  renewalDate: string;
  onToggle: () => void;
}

export const AutoRenewToggle: React.FC<AutoRenewToggleProps> = ({
  autoRenew,
  renewalDate,
  onToggle,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className={`p-5 rounded-xl transition-all duration-300 ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-cyan-500/20"
          : "bg-white/60 border border-gray-200 hover:border-blue-500/20 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: autoRenew ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <RefreshCw
              className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            />
          </motion.div>
          <div>
            <div
              className={`font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Auto-Renewal
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Automatically renew on {renewalDate}
            </div>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
            autoRenew
              ? isDark
                ? "bg-linear-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50"
                : "bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
              : isDark
                ? "bg-gray-700"
                : "bg-gray-300"
          }`}
        >
          <motion.div
            animate={{ x: autoRenew ? 28 : 4 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
          />
        </button>
      </div>
    </motion.div>
  );
};
