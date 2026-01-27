import React from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface ManageSubscriptionFooterProps {
  onClose: () => void;
}

export const ManageSubscriptionFooter: React.FC<
  ManageSubscriptionFooterProps
> = ({ onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`p-4 border-t shrink-0 ${
        isDark ? "border-white/10 bg-black/20" : "border-gray-200 bg-gray-50/50"
      }`}
    >
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
            isDark
              ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 shadow-lg shadow-cyan-500/10"
              : "bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20 shadow-lg"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Done
        </motion.button>
      </div>
    </div>
  );
};
