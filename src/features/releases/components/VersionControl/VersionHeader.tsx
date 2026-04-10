import React, { memo } from "react";
import { ClockCounterClockwise as HistoryIcon } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface VersionHeaderProps {
  showingCount: number;
  totalCount: number;
}

export const VersionHeader: React.FC<VersionHeaderProps> = memo(
  ({ showingCount, totalCount }) => {
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
              className={`text-lg font-bold flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <HistoryIcon size={18} className="text-purple-400" />
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
          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>
            Showing {showingCount} of {totalCount} versions
          </p>
        </div>
      </div>
    );
  },
);

VersionHeader.displayName = "VersionHeader";

VersionHeader.displayName = "VersionHeader";
