import React, { memo } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Settings, Zap } from "lucide-react";

export const SettingsHeader: React.FC = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-2xl ${
            isDark
              ? "bg-linear-to-br from-cyan-500/20 to-purple-500/20 border border-white/5"
              : "bg-linear-to-br from-cyan-100 to-purple-100 border border-gray-200"
          }`}
        >
          <Settings
            size={24}
            className={isDark ? "text-cyan-400" : "text-cyan-600"}
          />
        </div>
        <div>
          <h1
            className={`text-2xl font-black italic tracking-tighter uppercase ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Control Nexus
          </h1>
          <p
            className={`text-[10px] font-black uppercase tracking-[0.2em] ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            System Configuration & Governance
          </p>
        </div>
      </div>

      <div
        className={`flex items-center gap-3 border px-4 py-2.5 rounded-xl transition-all duration-300 ${
          isDark
            ? "bg-black/40 border-white/10 shadow-lg shadow-black/20"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="relative">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
        </div>
        <div>
          <p
            className={`text-[9px] uppercase tracking-[0.2em] font-black ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            System Status
          </p>
          <p className="text-sm font-black text-emerald-500 tracking-tighter flex items-center gap-1">
            <Zap size={12} />
            OPERATIONAL
          </p>
        </div>
      </div>
    </div>
  );
});

SettingsHeader.displayName = "SettingsHeader";
