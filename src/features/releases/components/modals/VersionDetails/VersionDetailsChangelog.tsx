import React, { memo } from "react";
import { FileText } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Version } from "@/features/releases/types";

interface VersionDetailsChangelogProps {
  version: Version;
}

export const VersionDetailsChangelog: React.FC<VersionDetailsChangelogProps> =
  memo(({ version }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div>
        <h3
          className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <FileText size={16} /> Update Notes
        </h3>
        <div
          className={`rounded-xl border p-5 ${
            isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-200"
          }`}
        >
          <ul className="space-y-3">
            {version.changelog.map((log, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  {log}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  });

VersionDetailsChangelog.displayName = "VersionDetailsChangelog";
