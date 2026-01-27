import React from "react";
import { Globe, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface ManageTaxRatesHeaderProps {
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
}

export const ManageTaxRatesHeader: React.FC<ManageTaxRatesHeaderProps> = ({
  isAdding,
  setIsAdding,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative p-6 border-b border-white/10 shrink-0">
      <div className="flex items-center justify-between">
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
                ? "bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                : "bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/20"
            }`}
          >
            <Globe
              className={`w-8 h-8 ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`}
            />
          </motion.div>
          <div>
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Manage Tax Rates
            </h2>
            <p
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Configure tax rates by country and region
            </p>
          </div>
        </div>

        {/* Add New Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(!isAdding)}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            isAdding
              ? isDark
                ? "bg-purple-500/20 border border-purple-500/30 text-purple-400"
                : "bg-purple-500/20 border border-purple-500/30 text-purple-600"
              : isDark
                ? "bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                : "bg-purple-500/10 border border-purple-500/20 text-purple-600 hover:bg-purple-500/20"
          }`}
        >
          <Plus className="w-4 h-4" />
          Add New
        </motion.button>
      </div>
    </div>
  );
};
