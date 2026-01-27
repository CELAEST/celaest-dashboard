import React, { memo } from "react";
import { Shield, Copy } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Version } from "@/features/releases/types";

interface VersionDetailsTechnicalProps {
  version: Version;
}

export const VersionDetailsTechnical: React.FC<VersionDetailsTechnicalProps> =
  memo(({ version }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      // Could add toast here
    };

    return (
      <div>
        <h3
          className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <Shield size={16} /> Security & Compatibility
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-xl border ${
              isDark
                ? "bg-white/5 border-white/5"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <div
              className={`text-xs mb-2 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              SHA-256 Checksum
            </div>
            <div className="flex items-center justify-between gap-2">
              <code
                className={`text-xs font-mono truncate ${
                  isDark ? "text-cyan-400" : "text-blue-600"
                }`}
              >
                {version.checksum}
              </code>
              <button
                onClick={() => copyToClipboard(version.checksum)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-white/10 text-gray-400 hover:text-white"
                    : "hover:bg-gray-200 text-gray-500 hover:text-gray-900"
                }`}
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          <div
            className={`p-4 rounded-xl border ${
              isDark
                ? "bg-white/5 border-white/5"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <div
              className={`text-xs mb-2 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Compatibility
            </div>
            <div
              className={`text-sm font-medium ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {version.compatibility}
            </div>
          </div>
        </div>
      </div>
    );
  });

VersionDetailsTechnical.displayName = "VersionDetailsTechnical";
