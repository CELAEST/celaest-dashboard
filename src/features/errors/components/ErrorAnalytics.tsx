"use client";

import React from "react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Monitor, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ErrorAnalyticsProps {
  data?: {
    totalErrors: number;
    ecosystem: {
      name: string;
      value: number;
      color: string;
      details: string;
      status: "optimal" | "warning" | "critical";
    }[];
  };
}

export const ErrorAnalytics: React.FC<ErrorAnalyticsProps> = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const ecosystemData = [
    {
      name: "Enterprise Hub (W11)",
      value: 45,
      color: "#06b6d4",
      details: "Excel 365 v2401",
      status: "optimal",
    },
    {
      name: "Legacy Node (W10)",
      value: 30,
      color: "#3b82f6",
      details: "Excel 365 v2312",
      status: "optimal",
    },
    {
      name: "Mac Runtime (macOS)",
      value: 15,
      color: "#8b5cf6",
      details: "Excel v16.82",
      status: "warning",
    },
    {
      name: "Restricted Env",
      value: 10,
      color: "#6366f1",
      details: "Excel 2019 LTSC",
      status: "critical",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={`relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-700 overflow-hidden ${
        isDark
          ? "bg-[#0a0a0a]/60 border-white/10 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          : "bg-white border-gray-100 shadow-2xl shadow-gray-200/40"
      }`}
    >
      {/* Absolute background accent */}
      <div
        className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[120px] rounded-full pointer-events-none opacity-20 ${
          isDark ? "bg-purple-500/10" : "bg-purple-500/5"
        }`}
      />

      {/* Header Section */}
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="flex items-center gap-5">
          <div
            className={`p-4 rounded-[1.25rem] border shadow-inner ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <ShieldCheck
              size={24}
              className={isDark ? "text-purple-400" : "text-purple-600"}
            />
          </div>
          <div>
            <h3
              className={`text-[11px] font-black uppercase tracking-[0.4em] ${isDark ? "text-white/40" : "text-gray-400"}`}
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

        <div className="flex gap-2">
          <div
            className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest flex items-center gap-2 ${
              isDark
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                : "bg-emerald-50 border-emerald-100 text-emerald-700"
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            SYSTEM HEALTH: 100%
          </div>
        </div>
      </div>

      {/* Main Content: Gauge + Grid */}
      <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10 h-full">
        {/* Left: Interactive Integrity Gauge */}
        <div className="w-[240px] h-[240px] relative shrink-0">
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute w-40 h-40 rounded-full blur-3xl ${isDark ? "bg-cyan-500/20" : "bg-cyan-500/10"}`}
            />
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Integrity
            </span>
            <span
              className={`text-5xl font-black italic tracking-tighter ${isDark ? "text-white" : "text-gray-900"}`}
            >
              100%
            </span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ecosystemData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={105}
                paddingAngle={12}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
                animationBegin={200}
                animationDuration={1800}
              >
                {ecosystemData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "rgba(12,12,12,0.95)" : "#fff",
                  borderColor: "transparent",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "900",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Platform Status Grid (2x2 for Perfect Symmetry) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {ecosystemData.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
              className={`group flex items-center justify-between p-5 rounded-[1.75rem] border transition-all duration-500 cursor-pointer ${
                isDark
                  ? "bg-white/3 border-white/5 hover:bg-white/8 hover:border-cyan-500/30 shadow-lg shadow-black/20"
                  : "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl border transition-colors duration-300 ${
                    isDark
                      ? "bg-white/5 border-white/10 group-hover:border-cyan-500/50"
                      : "bg-white border-gray-100 group-hover:border-cyan-200 shadow-sm"
                  }`}
                >
                  <Monitor
                    size={18}
                    className={isDark ? "text-white/30" : "text-gray-400"}
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-black uppercase tracking-wider transition-colors duration-300 ${
                      isDark
                        ? "text-white group-hover:text-cyan-400"
                        : "text-gray-900 group-hover:text-cyan-600"
                    }`}
                  >
                    {item.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold opacity-40 mt-0.5 ${isDark ? "text-white" : "text-gray-500"}`}
                  >
                    {item.details}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 pr-2">
                <div className="flex items-center gap-2">
                  {item.status === "optimal" ? (
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  ) : (
                    <AlertCircle
                      size={12}
                      className={
                        item.status === "warning"
                          ? "text-amber-500"
                          : "text-red-500"
                      }
                    />
                  )}
                  <span
                    className={`text-lg font-black italic tracking-tighter ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {item.value}%
                  </span>
                </div>
                <div
                  className={`w-16 h-1 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-200"}`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{
                      duration: 2,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.8,
                    }}
                    className="h-full relative shadow-[0_0_10px] shadow-current"
                    style={{ backgroundColor: item.color, color: item.color }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/30 to-white/0 animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

ErrorAnalytics.displayName = "ErrorAnalytics";
