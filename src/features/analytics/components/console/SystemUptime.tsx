import React from "react";
import { motion } from "motion/react";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";
import { Activity } from "lucide-react";

export const SystemUptime = React.memo(
  ({ className }: { className?: string }) => {
    const { isDark, stats } = useAnalytics();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-3xl overflow-hidden p-6 group flex flex-col relative ${
          isDark
            ? "bg-[#09090b] border border-white/10 hover:border-emerald-500/30"
            : "bg-white border border-gray-100 shadow-lg hover:border-emerald-500/20"
        } ${className}`}
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern
              id="grid-pattern"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* TOP ROW: Header */}
        <div className="flex items-start justify-between relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isDark
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <Activity className="w-4 h-4" />
            </div>
            <h3
              className={`text-[10px] font-black uppercase tracking-widest ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              System Uptime
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] font-bold uppercase tracking-wider ${
                isDark ? "text-emerald-500" : "text-emerald-600"
              }`}
            >
              Excellent
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
        </div>

        {/* MIDDLE: Centered Radar & Main Metric */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Radar Rings */}
            <div
              className={`absolute inset-0 rounded-full border ${
                isDark ? "border-white/5" : "border-gray-100"
              }`}
            />
            <div
              className={`absolute inset-4 rounded-full border ${
                isDark ? "border-white/5" : "border-gray-100"
              }`}
            />
            {/* Sweep Animation */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, transparent 0deg, ${
                  isDark ? "rgba(16, 185, 129, 0.4)" : "rgba(16, 185, 129, 0.6)"
                } 360deg)`,
                maskImage: "radial-gradient(transparent 50%, black 100%)",
                WebkitMaskImage: "radial-gradient(transparent 50%, black 100%)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            {/* Target Blip */}
            <motion.div
              className="absolute top-6 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut",
              }}
            />

            {/* Central Metric */}
            <div className="flex flex-col items-center">
              <div
                className={`text-3xl font-black tracking-tighter tabular-nums ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.uptime}
              </div>
              <div
                className={`text-[9px] font-black uppercase tracking-widest opacity-50 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Online
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Secondary Metrics */}
        <div className="flex items-end justify-between relative z-10 shrink-0">
          {/* Ping Metric */}
          <div className="flex flex-col gap-1">
            <span
              className={`text-[9px] font-bold uppercase opacity-50 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Latency
            </span>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </div>
              <span
                className={`text-xs font-mono font-bold ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                14ms
              </span>
            </div>
          </div>

          {/* Signal Metric */}
          <div className="flex flex-col gap-1 items-end">
            <span
              className={`text-[9px] font-bold uppercase opacity-50 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Loss
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono font-bold ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                0.0%
              </span>
              <div className="flex items-end gap-0.5 h-3">
                <div className="w-0.5 h-1.5 bg-emerald-500 rounded-full" />
                <div className="w-0.5 h-2 bg-emerald-500 rounded-full" />
                <div className="w-0.5 h-3 bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

SystemUptime.displayName = "SystemUptime";
