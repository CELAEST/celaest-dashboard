import React, { memo } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface VersionHeaderProps {
  onCreate: () => void;
}

export const VersionHeader: React.FC<VersionHeaderProps> = memo(
  ({ onCreate }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div
        className={`p-6 border-b ${
          isDark ? "border-white/5" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Version History
            </h3>
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Complete release timeline with checksums and adoption tracking
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreate}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              isDark
                ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            }`}
          >
            <Plus size={18} />
            New Release
          </motion.button>
        </div>
      </div>
    );
  },
);

VersionHeader.displayName = "VersionHeader";
