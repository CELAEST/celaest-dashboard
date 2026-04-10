"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import {
  Monitor,
  ShieldCheck,
  CheckCircle,
  Warning,
  Pulse,
} from "@phosphor-icons/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export interface PlatformStat {
  name: string;
  value: number;
  details: string;
}

const PLATFORM_COLORS = [
  "#22d3ee", // cyan-400
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#c084fc", // purple-400
  "#ec4899", // pink-500
];

interface ErrorAnalyticsProps {
  data?: PlatformStat[];
}

function SummaryCard({
  label,
  value,
  icon,
  tone,
  isDark,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: "cyan" | "emerald" | "amber";
  isDark: boolean;
}) {
  const tones = {
    cyan: isDark ? "text-cyan-400" : "text-cyan-600",
    emerald: isDark ? "text-emerald-400" : "text-emerald-600",
    amber: isDark ? "text-amber-400" : "text-amber-600",
  };

  const borderTones = {
    cyan: isDark ? "from-cyan-500/20 to-blue-500/10 border-cyan-500/15" : "from-cyan-50 to-blue-50 border-cyan-200",
    emerald: isDark ? "from-emerald-500/20 to-teal-500/10 border-emerald-500/15" : "from-emerald-50 to-teal-50 border-emerald-200",
    amber: isDark ? "from-amber-500/20 to-orange-500/10 border-amber-500/15" : "from-amber-50 to-orange-50 border-amber-200",
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        isDark
          ? "bg-white/3 border-white/8 hover:border-white/15"
          : "bg-gray-50 border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-[10px] font-black uppercase tracking-widest ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {label}
          </p>
          <p
            className={`mt-1 font-mono text-2xl font-black tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {value}
          </p>
        </div>
        {/* Jewel-box icon */}
        <div
          className={`shrink-0 w-8 h-8 rounded-input flex items-center justify-center bg-linear-to-b border ${borderTones[tone]} ${
            isDark
              ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_4px_rgba(0,0,0,0.2)]"
              : "shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.04)]"
          }`}
        >
          {React.cloneElement(
            icon as React.ReactElement<{ className?: string }>,
            { className: tones[tone] }
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-end">
        <span className={`text-[8px] font-mono tracking-widest uppercase opacity-40 ${isDark ? "text-white" : "text-gray-900"}`}>
          SYS.METRIC
        </span>
      </div>
    </div>
  );
}

export const ErrorAnalytics: React.FC<ErrorAnalyticsProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const ecosystemData = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        {
          name: "Enterprise Hub (W11)",
          value: 100,
          color: "#22d3ee",
          details: "Excel 365 v2401",
          status: "optimal" as const,
        },
      ];
    }

    return data.map((item, index) => ({
      name: item.name,
      value: item.value,
      color: PLATFORM_COLORS[index % PLATFORM_COLORS.length],
      details: item.details,
      status: (item.value > 80
        ? "optimal"
        : item.value > 50
          ? "warning"
          : "critical") as "optimal" | "warning" | "critical",
    }));
  }, [data]);

  const averageHealth = useMemo(() => {
    if (ecosystemData.length === 0) return 100;
    const sum = ecosystemData.reduce((acc, curr) => acc + curr.value, 0);
    return Math.round(sum / ecosystemData.length);
  }, [ecosystemData]);

  const healthyPlatforms = ecosystemData.filter(
    (item) => item.status === "optimal",
  ).length;
  const atRiskPlatforms = ecosystemData.filter(
    (item) => item.status !== "optimal",
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className={`relative h-full rounded-3xl border overflow-hidden transition-all duration-300 ${
        isDark
          ? "bg-[#0a0a0a]/60 border-white/10 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          : "bg-white border-gray-200 shadow-xl shadow-gray-200/40"
      }`}
    >
      {/* Absolute background accent */}
      <div
        className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[100px] rounded-full pointer-events-none opacity-20 ${
          isDark ? "bg-cyan-500/15" : "bg-cyan-500/10"
        }`}
      />

      <div className="relative z-10 h-full p-6 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <div
              className={`w-9 h-9 rounded-input flex items-center justify-center bg-linear-to-b border ${
                isDark
                  ? "from-white/10 to-transparent border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_4px_rgba(0,0,0,0.2)]"
                  : "from-white to-gray-50 border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.04)]"
              }`}
            >
              <ShieldCheck
                size={18}
                className={isDark ? "text-cyan-400" : "text-cyan-600"}
                weight="bold"
              />
            </div>
            <div>
              <h3
                className={`text-[9px] font-black uppercase tracking-[0.32em] ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Ecosystem Integrity
              </h3>
              <h2
                className={`text-2xl font-black italic tracking-tighter mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                PLATFORM RELIABILITY
              </h2>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold tracking-widest uppercase shadow-sm ${
              isDark
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-emerald-50 border-emerald-100 text-emerald-700"
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse ${isDark ? "shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]" : ""}`} />
            System Health {averageHealth}%
          </div>
        </div>

        {/* Main Content */}
        <div className="grid flex-1 min-h-0 grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-6 items-stretch">
          {/* Left: Integrity Gauge */}
          <div className="w-full max-w-60 aspect-square relative shrink-0 mx-auto xl:mx-0 self-center">
            {/* Holographic glowing rings behind the chart */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
                <circle cx="50" cy="50" r="46" fill="none" stroke={isDark ? "rgba(34,211,238,0.2)" : "rgba(59,130,246,0.1)"} strokeWidth="1" strokeDasharray="2 4" />
                <circle cx="50" cy="50" r="41" fill="none" stroke={isDark ? "rgba(34,211,238,0.1)" : "rgba(59,130,246,0.05)"} strokeWidth="2" />
                <motion.circle 
                  cx="50" cy="50" r="32" fill="none" stroke={isDark ? "rgba(34,211,238,0.3)" : "rgba(59,130,246,0.2)"} strokeWidth="0.5" strokeDasharray="1 6"
                  animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "center" }}
                />
              </svg>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.18, 0.32, 0.18] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute w-36 h-36 rounded-full blur-3xl ${isDark ? "bg-cyan-500/30" : "bg-cyan-500/10"}`}
              />
              <span
                className={`text-[9px] font-black uppercase tracking-[0.24em] opacity-50 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
              >
                Integrity
              </span>
              <span
                className={`text-5xl font-black font-mono italic tracking-tighter ${isDark ? "text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" : "text-gray-900"}`}
              >
                {averageHealth}%
              </span>
            </div>

            <div className="relative z-20 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ecosystemData}
                    cx="50%"
                    cy="50%"
                    innerRadius="68%"
                    outerRadius="86%"
                    paddingAngle={ecosystemData.length > 1 ? 4 : 0}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                    animationBegin={200}
                    animationDuration={1600}
                  >
                    {ecosystemData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.95)",
                      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: "900",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                    itemStyle={{
                      color: isDark ? "#fff" : "#000",
                      fontFamily: "var(--font-mono, monospace)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Center: Platform Status Stack */}
          <div className="flex flex-col gap-2.5 justify-center min-h-0">
            {ecosystemData.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + idx * 0.08, duration: 0.35 }}
                className={`group rounded-xl p-3.5 transition-all duration-200 border ${
                  isDark
                    ? "bg-white/3 border-white/5 hover:border-white/15"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`shrink-0 w-8 h-8 rounded-input flex items-center justify-center bg-linear-to-b border ${
                      isDark
                        ? "from-white/10 to-transparent border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_4px_rgba(0,0,0,0.2)]"
                        : "from-white to-gray-50 border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    <Monitor
                      size={14}
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                      weight="bold"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p
                          className={`truncate text-[11px] font-mono font-bold tracking-widest uppercase ${
                            isDark ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`text-[9px] mt-0.5 font-medium truncate ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          {item.details}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        {item.status === "optimal" ? (
                          <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${isDark ? "shadow-[0_0_6px_2px_rgba(16,185,129,0.4)]" : ""}`} />
                        ) : (
                          <div className={`w-1.5 h-1.5 rounded-full ${item.status === "warning" ? "bg-amber-500 shadow-[0_0_6px_2px_rgba(245,158,11,0.4)]" : "bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.4)]"}`} />
                        )}
                        <span
                          className={`text-sm font-black font-mono tracking-tight tabular-nums ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.value}%
                        </span>
                      </div>
                    </div>

                    <div
                      className={`mt-2 h-1 rounded-full overflow-hidden ${
                        isDark ? "bg-white/5" : "bg-gray-200"
                      }`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{
                          duration: 1.6,
                          ease: [0.22, 1, 0.36, 1],
                          delay: 0.5 + idx * 0.06,
                        }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3 content-start">
            <SummaryCard
              label="Fuentes monitoreadas"
              value={ecosystemData.length.toString()}
              icon={<Monitor size={14} weight="bold" />}
              tone="cyan"
              isDark={isDark}
            />
            <SummaryCard
              label="Óptimas"
              value={healthyPlatforms.toString()}
              icon={<CheckCircle size={14} weight="bold" />}
              tone="emerald"
              isDark={isDark}
            />
            <SummaryCard
              label="En riesgo"
              value={atRiskPlatforms.toString()}
              icon={<Pulse size={14} weight="bold" />}
              tone="amber"
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

ErrorAnalytics.displayName = "ErrorAnalytics";
