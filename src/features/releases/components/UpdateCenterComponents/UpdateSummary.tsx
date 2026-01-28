import React, { memo } from "react";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface UpdateSummaryProps {
  updateCount: number;
}

export const UpdateSummary: React.FC<UpdateSummaryProps> = memo(
  ({ updateCount }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div
        className={`rounded-2xl border p-6 ${
          isDark
            ? "bg-linear-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20"
            : "bg-linear-to-r from-cyan-50 to-purple-50 border-cyan-200"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {updateCount} Update
              {updateCount !== 1 ? "s" : ""} Available
            </h2>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Stay current with the latest features, security patches, and
              performance improvements
            </p>
          </div>
          <Sparkles
            size={32}
            className={isDark ? "text-cyan-400" : "text-cyan-600"}
          />
        </div>
      </div>
    );
  },
);

UpdateSummary.displayName = "UpdateSummary";
