import React from "react";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface ManageTaxRatesFooterProps {
  taxRatesCount: number;
  onClose: () => void;
}

export const ManageTaxRatesFooter: React.FC<ManageTaxRatesFooterProps> = ({
  taxRatesCount,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`p-4 border-t shrink-0 ${
        isDark ? "border-white/10 bg-black/20" : "border-gray-200 bg-gray-50/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {taxRatesCount} tax rate{taxRatesCount !== 1 ? "s" : ""} configured
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            isDark
              ? "bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 shadow-lg shadow-purple-500/10"
              : "bg-purple-500/10 border border-purple-500/20 text-purple-600 hover:bg-purple-500/20 shadow-lg"
          }`}
        >
          <Check className="w-4 h-4" />
          Save Changes
        </motion.button>
      </div>
    </div>
  );
};
