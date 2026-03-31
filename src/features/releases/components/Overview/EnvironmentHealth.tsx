"use client";

import React from "react";
import { Pulse } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { motion } from "motion/react";
import { BackendSystemHealth } from "@/features/assets/api/assets.api";

export interface EnvironmentHealthProps {
  systemHealth?: BackendSystemHealth;
  isLoading?: boolean;
}

export const EnvironmentHealth: React.FC<EnvironmentHealthProps> = ({
  systemHealth,
}) => {
  const { isDark } = useTheme();

  // Defaults if no data yet
  const health = systemHealth || {
    cpu: 0,
    ram: 0,
    network: 0,
    uptime: "99.98%",
    latency: "24ms",
  };

  const getMetricColor = (val: number, isDark: boolean) => {
    if (val > 80) return isDark ? "#ef4444" : "#dc2626"; // Alert Red
    if (val > 60) return isDark ? "#f59e0b" : "#d97706"; // Warning Amber
    return isDark ? "#10b981" : "#059669"; // Stable Emerald
  };

  return (
    <div
      className={`h-full rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden group ${
        isDark ? "bg-[#0a0a0a]/60 border-white/5 backdrop-blur-3xl shadow-xl" : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      {/* Background decoration */}
      <div
        className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-10 pointer-events-none transition-opacity duration-1000 group-hover:opacity-20 ${
          isDark ? "bg-emerald-500" : "bg-emerald-400"
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-input border shadow-sm shrink-0 ${
              isDark
                ? "bg-linear-to-b from-white/8 to-transparent border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]"
                : "bg-linear-to-b from-white to-gray-50 border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]"
            }`}
          >
            <Pulse size={14} className={isDark ? "text-emerald-400 drop-shadow-sm" : "text-emerald-600"} weight="bold" />
          </div>
          <div className="flex flex-col">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] leading-tight ${isDark ? "text-white/40" : "text-gray-400"}`}>
              Telemetry
            </h3>
            <h2 className={`text-lg font-black italic tracking-tighter leading-none mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
              SYSTEM HEALTH
            </h2>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest shadow-sm ${
            isDark
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Healthy
        </div>
      </div>

      {/* Interconnected HUD SVG Array */}
      <div className="flex-1 w-full min-h-[160px] relative flex items-center justify-center py-2">
        <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible drop-shadow-xl" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="hudGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="wireGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <stop offset="50%" stopColor={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"} />
              <stop offset="100%" stopColor={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
            </linearGradient>
          </defs>

          {/* Background PCB / Wiring Traces */}
          <g opacity="0.6">
            <path d="M 100 100 L 300 100 L 500 100" fill="none" stroke="url(#wireGradient)" strokeWidth="2" />
            <path d="M 100 100 L 150 40 L 450 40 L 500 100" fill="none" stroke="url(#wireGradient)" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 100 100 L 150 160 L 450 160 L 500 100" fill="none" stroke="url(#wireGradient)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="150" cy="40" r="2" fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} />
            <circle cx="450" cy="40" r="2" fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} />
            <circle cx="150" cy="160" r="2" fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} />
            <circle cx="450" cy="160" r="2" fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} />
          </g>

          {/* Node 1: CPU */}
          <g transform="translate(100, 100)">
            <circle cx="0" cy="0" r="45" fill="none" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="10" />
            <motion.circle animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} cx="0" cy="0" r="55" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" strokeDasharray="4 6" />
            <motion.circle
              cx="0" cy="0" r="45" fill="none"
              stroke={getMetricColor(health.cpu, isDark)} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${(health.cpu / 100) * 282} 282`}
              strokeDashoffset="0"
              transform="rotate(-90)"
              filter="url(#hudGlow)"
              initial={{ strokeDashoffset: 282 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <text x="0" y="-8" textAnchor="middle" fill={isDark ? "white" : "black"} fontSize="18" fontWeight="900" fontStyle="italic">{health.cpu}<tspan fontSize="10">%</tspan></text>
            <text x="0" y="8" textAnchor="middle" fill={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"} fontSize="8" fontWeight="bold" letterSpacing="0.2em">CPU LOAD</text>
          </g>

          {/* Node 2: RAM */}
          <g transform="translate(300, 100)">
            <circle cx="0" cy="0" r="55" fill="none" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="12" />
            <motion.circle animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} cx="0" cy="0" r="65" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" strokeDasharray="1 10" />
            <motion.circle
              cx="0" cy="0" r="55" fill="none"
              stroke={getMetricColor((health.ram / 8192) * 100, isDark)} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${((health.ram / 8192) * 100 / 100) * 345} 345`}
              transform="rotate(-90)"
              filter="url(#hudGlow)"
              initial={{ strokeDashoffset: 345 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
            />
            <text x="0" y="-8" textAnchor="middle" fill={isDark ? "white" : "black"} fontSize="18" fontWeight="900" fontStyle="italic">{health.ram}<tspan fontSize="10">MB</tspan></text>
            <text x="0" y="8" textAnchor="middle" fill={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"} fontSize="8" fontWeight="bold" letterSpacing="0.2em">RAM USAGE</text>
            {/* Hexagonal Center Core decoration */}
            <polygon points="0,-15 13,-7 13,8 0,15 -13,8 -13,-7" fill="none" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="1" />
          </g>

          {/* Node 3: NET */}
          <g transform="translate(500, 100)">
            <circle cx="0" cy="0" r="45" fill="none" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="10" />
            <motion.circle animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} cx="0" cy="0" r="35" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="2" strokeDasharray="10 20" />
            <motion.circle
              cx="0" cy="0" r="45" fill="none"
              stroke={getMetricColor(health.network, isDark)} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${(health.network / 100) * 282} 282`}
              transform="rotate(-90)"
              filter="url(#hudGlow)"
              initial={{ strokeDashoffset: 282 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2, delay: 0.4, ease: "easeOut" }}
            />
            <text x="0" y="-8" textAnchor="middle" fill={isDark ? "white" : "black"} fontSize="18" fontWeight="900" fontStyle="italic">{health.network}<tspan fontSize="10">%</tspan></text>
            <text x="0" y="8" textAnchor="middle" fill={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"} fontSize="8" fontWeight="bold" letterSpacing="0.2em">NET TRAFFIC</text>
          </g>
          
          {/* Tech HUD Accents */}
          <text x="10" y="20" fill={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} fontSize="10" fontFamily="monospace" fontWeight="bold">OP_STAT: VALID</text>
          <text x="590" y="20" fill={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="end">PORT_8080</text>

        </svg>
      </div>

      {/* Footer Stats / Diagnostics */}
      <div
        className={`pt-4 border-t flex justify-between items-center text-xs mt-auto ${isDark ? "border-white/10 text-gray-400" : "border-gray-100 text-gray-500"}`}
      >
        <div className="flex bg-black/10 dark:bg-white/5 rounded px-2 py-1 items-center gap-2">
          <span className="opacity-60 font-bold uppercase tracking-wider text-[9px]">Uptime</span>
          <span className={`font-mono font-bold text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
            {health.uptime}
          </span>
        </div>
        
        <div className="flex bg-black/10 dark:bg-white/5 rounded px-2 py-1 items-center gap-2">
          <span className="opacity-60 font-bold uppercase tracking-wider text-[9px]">Latency</span>
          <span className={`font-mono font-bold text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>
            {health.latency}
          </span>
        </div>
      </div>
    </div>
  );
};

