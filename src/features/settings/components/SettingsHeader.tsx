import React, { memo } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { Gear, Lightning } from "@phosphor-icons/react";

export const SettingsHeader: React.FC = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
            isDark ? "bg-white/[0.04] border-white/10 text-white/70" : "bg-gray-100 border-gray-200 text-gray-700"
          }`}
        >
          <Gear size={20} />
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
            ? "bg-[#09090b]/80 border-white/6 backdrop-blur-xl"
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
            <Lightning size={12} />
            OPERATIONAL
          </p>
        </div>
      </div>
    </div>
  );
});

SettingsHeader.displayName = "SettingsHeader";
