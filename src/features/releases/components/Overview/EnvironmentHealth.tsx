"use client";

import React from "react";
import { Activity, Zap, Server, Wifi } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

const HealthGauge: React.FC<{
  value: number;
  label: string;
  color: string;
  icon: React.ElementType;
}> = ({ value, label, color, icon: Icon }) => {
  const { isDark } = useTheme();
  const circumference = 2 * Math.PI * 22; // r=22
  const offset = circumference - (value / 100) * circumference;

  const colors: Record<string, string> = {
    emerald: isDark ? "#10b981" : "#059669",
    blue: isDark ? "#3b82f6" : "#2563eb",
    purple: isDark ? "#a855f7" : "#7c3aed",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="22"
            stroke={isDark ? "#ffffff10" : "#e5e7eb"}
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r="22"
            stroke={colors[color]}
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
          {value}%
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-medium opacity-80">
        <Icon
          size={12}
          className={
            color === "emerald"
              ? "text-emerald-500"
              : color === "blue"
                ? "text-blue-500"
                : "text-purple-500"
          }
        />
        {label}
      </div>
    </div>
  );
};

export const EnvironmentHealth: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`h-full rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden group ${
        isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
      }`}
    >
      {/* Background decoration */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-30 ${isDark ? "bg-emerald-500" : "bg-emerald-400"}`}
      />

      <div className="flex items-center justify-between mb-2 relative z-10">
        <h3
          className={`font-bold text-base flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          <Activity size={16} className="text-emerald-500" />
          System Health
        </h3>
        <div
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
            isDark
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Healthy
        </div>
      </div>

      {/* Gauges Row */}
      <div className="flex justify-around items-center flex-1 py-2">
        <HealthGauge value={32} label="CPU" color="emerald" icon={Server} />
        <HealthGauge value={64} label="RAM" color="blue" icon={Zap} />
        <HealthGauge value={45} label="NET" color="purple" icon={Wifi} />
      </div>

      {/* Footer Stats */}
      <div
        className={`pt-3 border-t flex justify-between items-center text-xs ${isDark ? "border-white/10 text-gray-400" : "border-gray-100 text-gray-500"}`}
      >
        <span>
          Uptime:{" "}
          <span
            className={`font-mono font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            99.98%
          </span>
        </span>
        <span>
          Latency:{" "}
          <span
            className={`font-mono font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            24ms
          </span>
        </span>
      </div>
    </div>
  );
};
