import React, { memo } from "react";
import { Globe } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const WorkspaceProfile: React.FC = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <h3
        className={`text-lg font-bold mb-6 flex items-center gap-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        <Globe className="w-5 h-5 text-cyan-500" />
        Workspace Profile
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Workspace Name
          </label>
          <input
            type="text"
            defaultValue="Celaest Headquarters"
            className="settings-input w-full rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label
            className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Workspace URL
          </label>
          <div className="flex">
            <span
              className={`px-4 py-3 rounded-l-lg border-y border-l text-sm transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 text-gray-500"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              celaest.io/
            </span>
            <input
              type="text"
              defaultValue="hq"
              className="settings-input w-full rounded-r-lg px-4 py-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

WorkspaceProfile.displayName = "WorkspaceProfile";
