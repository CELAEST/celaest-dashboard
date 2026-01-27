import React from "react";
import { Layers, Server } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface LicenseStatsProps {
  tier?: string;
  maxIpSlots: number;
}

export const LicenseStats: React.FC<LicenseStatsProps> = ({
  tier,
  maxIpSlots,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-2 gap-4">
      <div
        className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
      >
        <div className="text-gray-500 text-xs mb-1">Usage Tier</div>
        <div
          className={`font-bold capitalize flex items-center gap-2 ${isDark ? "text-purple-400" : "text-purple-600"}`}
        >
          <Layers size={16} /> {tier || "Standard"}
        </div>
      </div>
      <div
        className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
      >
        <div className="text-gray-500 text-xs mb-1">Max IP Slots</div>
        <div
          className={`font-bold flex items-center gap-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
        >
          <Server size={16} /> {maxIpSlots}
        </div>
      </div>
    </div>
  );
};
