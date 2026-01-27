import React, { memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, ChevronUp, ChevronDown, Shield } from "lucide-react";
import { CustomerAsset } from "../../../types";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface UpdateItemChangelogProps {
  asset: CustomerAsset;
  isExpanded: boolean;
  onToggle: () => void;
}

export const UpdateItemChangelog: React.FC<UpdateItemChangelogProps> = memo(
  ({ asset, isExpanded, onToggle }) => {
    const { isDark } = useTheme();

    if (!asset.hasUpdate) return null;

    return (
      <div
        className={`border-t ${isDark ? "border-white/5" : "border-gray-200"}`}
      >
        <button
          onClick={onToggle}
          className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
            isDark
              ? "hover:bg-white/2 text-gray-400 hover:text-white"
              : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText size={16} />
            <span className="text-sm font-semibold">
              What&apos;s New in {asset.latestVersion}
            </span>
          </div>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`px-6 pb-6 border-t ${
                isDark ? "border-white/5" : "border-gray-200"
              }`}
            >
              <ul className="space-y-2 mb-6 pt-4">
                {asset.changelog.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                        isDark ? "bg-cyan-400" : "bg-cyan-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {change}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Checksum Verification */}
              <div
                className={`p-4 rounded-xl border mb-4 ${
                  isDark
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-emerald-50 border-emerald-200"
                }`}
              >
                <div className="flex gap-3">
                  <Shield
                    size={16}
                    className={`shrink-0 mt-0.5 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-xs font-semibold mb-1 ${
                        isDark ? "text-emerald-400" : "text-emerald-700"
                      }`}
                    >
                      File Integrity Verification
                    </p>
                    <p
                      className={`text-xs font-mono ${
                        isDark ? "text-emerald-400/80" : "text-emerald-600/80"
                      }`}
                    >
                      {asset.checksum}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

UpdateItemChangelog.displayName = "UpdateItemChangelog";
