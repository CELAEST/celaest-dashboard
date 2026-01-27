import React, { memo } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const SettingsHeader: React.FC = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1
          className={`text-3xl font-bold tracking-tight ${
            isDark
              ? "bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
              : "text-gray-900"
          }`}
        >
          Settings & Configuration
        </h1>
        <p
          className={`text-sm mt-1 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Manage your account, security, team, and preferences
        </p>
      </div>

      <div
        className={`flex items-center gap-3 border px-4 py-2 rounded-xl transition-all duration-300 ${
          isDark
            ? "bg-black/40 border-white/10 shadow-lg shadow-black/20"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="relative">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div>
          <p
            className={`text-[10px] uppercase tracking-wider font-bold ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            System
          </p>
          <p className="text-sm font-black text-emerald-500 tracking-tight">
            ONLINE
          </p>
        </div>
      </div>
    </div>
  );
});

SettingsHeader.displayName = "SettingsHeader";
