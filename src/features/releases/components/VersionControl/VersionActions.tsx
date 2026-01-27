import React, { memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MoreVertical, Edit2, Archive, FileText } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Version } from "../../types";

interface VersionActionsProps {
  version: Version;
  isActive: boolean;
  onToggle: () => void;
  onEdit: (version: Version) => void;
  onViewDetails: (version: Version) => void;
  onDeprecate: (id: string) => void;
}

export const VersionActions: React.FC<VersionActionsProps> = memo(
  ({ version, isActive, onToggle, onEdit, onViewDetails, onDeprecate }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div className="relative inline-block">
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg transition-colors ${
            isDark
              ? "hover:bg-white/10 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
        >
          <MoreVertical size={18} />
        </button>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute right-0 top-12 w-52 rounded-xl border shadow-xl z-20 overflow-hidden ${
                isDark
                  ? "bg-gray-900 border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => onEdit(version)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isDark
                    ? "text-gray-300 hover:bg-white/5"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Edit2 size={16} />
                Edit Changelog
              </button>
              <button
                onClick={() => onViewDetails(version)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isDark
                    ? "text-gray-300 hover:bg-white/5"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileText size={16} />
                View Details
              </button>
              {version.status !== "deprecated" && (
                <button
                  onClick={() => onDeprecate(version.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t ${
                    isDark
                      ? "text-orange-400 hover:bg-orange-500/10 border-white/5"
                      : "text-orange-600 hover:bg-orange-50 border-gray-200"
                  }`}
                >
                  <Archive size={16} />
                  Mark Deprecated
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

VersionActions.displayName = "VersionActions";
