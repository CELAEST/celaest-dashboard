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
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#6366f1",
  "#ec4899",
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
    cyan: isDark
      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
      : "bg-cyan-50 border-cyan-200 text-cyan-700",
    emerald: isDark
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      : "bg-emerald-50 border-emerald-200 text-emerald-700",
    amber: isDark
      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
      : "bg-amber-50 border-amber-200 text-amber-700",
  };

  return (
    <div
      className={`rounded-2xl border p-4 ${
        isDark
          ? "bg-white/3 border-white/8"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {label}
          </p>
          <p
            className={`mt-2 text-2xl font-black tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {value}
          </p>
        </div>
        <div className={`rounded-xl border p-2 ${tones[tone]}`}>{icon}</div>
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
          color: "#06b6d4",
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
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={`relative h-full rounded-4xl border overflow-hidden transition-all duration-300 ${
        isDark
          ? "bg-[#0a0a0a]/60 border-white/10 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          : "bg-white border-gray-100 shadow-xl shadow-gray-200/40"
      }`}
    >
      {/* Absolute background accent */}
      <div
        className={`absolute top-0 right-0 w-80 h-80 blur-[100px] rounded-full pointer-events-none opacity-20 ${
          isDark ? "bg-cyan-500/10" : "bg-cyan-500/5"
        }`}
      />

      <div className="relative z-10 h-full p-6 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl border shadow-inner ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <ShieldCheck
                size={20}
                className={isDark ? "text-cyan-400" : "text-cyan-600"}
                weight="duotone"
              />
            </div>
            <div>
              <h3
                className={`text-[11px] font-black uppercase tracking-[0.32em] ${isDark ? "text-white/40" : "text-gray-400"}`}
              >
                Ecosystem Integrity
              </h3>
              <h2
                className={`text-3xl font-black italic tracking-tighter mt-1 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                PLATFORM RELIABILITY
              </h2>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black tracking-[0.22em] uppercase ${
              isDark
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                : "bg-emerald-50 border-emerald-100 text-emerald-700"
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            System Health: {averageHealth}%
          </div>
        </div>

        {/* Main Content */}
        <div className="grid flex-1 min-h-0 grid-cols-1 xl:grid-cols-[220px_minmax(0,1fr)_260px] gap-6 items-stretch">
          {/* Left: Integrity Gauge */}
          <div className="w-full max-w-55 aspect-square relative shrink-0 mx-auto xl:mx-0 self-center">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.18, 0.32, 0.18] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute w-36 h-36 rounded-full blur-3xl ${isDark ? "bg-cyan-500/20" : "bg-cyan-500/10"}`}
              />
              <span
                className={`text-[10px] font-black uppercase tracking-[0.24em] opacity-40 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Integrity
              </span>
              <span
                className={`text-5xl font-black italic tracking-tighter ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {averageHealth}%
              </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ecosystemData}
                  cx="50%"
                  cy="50%"
                  innerRadius={76}
                  outerRadius={100}
                  paddingAngle={ecosystemData.length > 1 ? 10 : 0}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                  animationBegin={200}
                  animationDuration={1600}
                >
                  {ecosystemData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "rgba(12,12,12,0.95)" : "#fff",
                    borderColor: "transparent",
                    borderRadius: "18px",
                    fontSize: "12px",
                    fontWeight: "900",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center: Platform Status Stack */}
          <div className="flex flex-col gap-3 justify-center min-h-0">
            {ecosystemData.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + idx * 0.08, duration: 0.35 }}
                className={`group rounded-2xl border p-4 transition-all duration-200 ${
                  isDark
                    ? "bg-white/3 border-white/8 hover:border-white/15"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-11 w-11 rounded-xl border flex items-center justify-center ${
                      isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Monitor
                      size={18}
                      className={isDark ? "text-white/40" : "text-gray-500"}
                      weight="duotone"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-black uppercase tracking-wide ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`text-[11px] mt-0.5 truncate ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          {item.details}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {item.status === "optimal" ? (
                          <CheckCircle size={12} className="text-emerald-500" weight="fill" />
                        ) : (
                          <Warning
                            size={12}
                            className={item.status === "warning" ? "text-amber-500" : "text-red-500"}
                            weight="fill"
                          />
                        )}
                        <span
                          className={`text-xl font-black italic tracking-tight ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.value}%
                        </span>
                      </div>
                    </div>

                    <div
                      className={`mt-3 h-1.5 rounded-full overflow-hidden ${
                        isDark ? "bg-white/10" : "bg-gray-200"
                      }`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{
                          duration: 1.6,
                          ease: [0.22, 1, 0.36, 1],
                          delay: 0.4 + idx * 0.06,
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
              icon={<Monitor size={16} weight="duotone" />}
              tone="cyan"
              isDark={isDark}
            />
            <SummaryCard
              label="Óptimas"
              value={healthyPlatforms.toString()}
              icon={<CheckCircle size={16} weight="duotone" />}
              tone="emerald"
              isDark={isDark}
            />
            <SummaryCard
              label="En riesgo"
              value={atRiskPlatforms.toString()}
              icon={<Pulse size={16} weight="duotone" />}
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
