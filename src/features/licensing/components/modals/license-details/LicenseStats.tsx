import React from "react";
import { Layers, Server, Clock } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface LicenseStatsProps {
  tier?: string;
  maxIpSlots: number;
  startsAt?: string;
  expiresAt?: string;
}

export const LicenseStats: React.FC<LicenseStatsProps> = ({
  tier,
  maxIpSlots,
  startsAt,
  expiresAt,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
      >
        <div className="text-gray-500 text-xs mb-1">Nivel de Uso</div>
        <div
          className={`font-bold capitalize flex items-center gap-2 ${isDark ? "text-purple-400" : "text-purple-600"}`}
        >
          <Layers size={16} /> {tier || "Estándar"}
        </div>
      </div>

      <div
        className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
      >
        <div className="text-gray-500 text-xs mb-1">Slots de IP Máx.</div>
        <div
          className={`font-bold flex items-center gap-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
        >
          <Server size={16} /> {maxIpSlots}
        </div>
      </div>

      <div
        className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
      >
        <div className="text-gray-500 text-xs mb-1">Periodo de Vigencia</div>
        <div
          className={`text-xs font-semibold flex flex-col gap-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}
        >
          <div className="flex items-center gap-1.5 line-clamp-1">
            <Clock size={14} /> {formatDate(startsAt)}
          </div>
          <div className="line-clamp-1">Hasta: {formatDate(expiresAt)}</div>
        </div>
      </div>
    </div>
  );
};
