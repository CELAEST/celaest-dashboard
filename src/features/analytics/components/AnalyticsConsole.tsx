"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Activity,
  Cpu,
  Database,
  AlertCircle,
  CheckCircle,
  Info,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

// Pre-computed particle positions to avoid Math.random() during render
const PARTICLE_POSITIONS = [
  { left: 12, top: 25, duration: 3.2, delay: 0.4 },
  { left: 45, top: 78, duration: 4.1, delay: 1.2 },
  { left: 67, top: 34, duration: 3.8, delay: 0.8 },
  { left: 23, top: 89, duration: 4.5, delay: 1.6 },
  { left: 78, top: 12, duration: 3.5, delay: 0.2 },
  { left: 56, top: 56, duration: 4.2, delay: 1.0 },
  { left: 34, top: 45, duration: 3.9, delay: 1.4 },
  { left: 89, top: 67, duration: 4.0, delay: 0.6 },
];

const logs = [
  {
    status: "error",
    timestamp: "10:43:23",
    code: "ERR_DB_TIMEOUT",
    message: "Database connection timeout at shard-04",
    icon: AlertCircle,
    color: "red",
  },
  {
    status: "warning",
    timestamp: "10:41:05",
    code: "WARN_LATENCY",
    message: "High latency detected on API Gateway",
    icon: AlertCircle,
    color: "orange",
  },
  {
    status: "info",
    timestamp: "10:29:00",
    code: "INFO_BACKUP",
    message: "Scheduled backup completed successfully",
    icon: CheckCircle,
    color: "cyan",
  },
  {
    status: "warning",
    timestamp: "09:15:44",
    code: "WARN_MEM",
    message: "Memory usage exceeds 85% on Node-12",
    icon: AlertCircle,
    color: "orange",
  },
  {
    status: "info",
    timestamp: "09:01:00",
    code: "INFO_DEPLOY",
    message: "New deployment rollout started: v4.2.1",
    icon: Info,
    color: "blue",
  },
];

export const AnalyticsConsole: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getStatusStyles = (color: string) => {
    switch (color) {
      case "red":
        return {
          bg: isDark ? "bg-red-500/5" : "bg-red-50",
          border: isDark ? "border-red-500/20" : "border-red-200",
          text: "text-red-400",
          iconBg: isDark ? "bg-red-500/10" : "bg-red-100",
        };
      case "orange":
        return {
          bg: isDark ? "bg-orange-500/5" : "bg-orange-50",
          border: isDark ? "border-orange-500/20" : "border-orange-200",
          text: "text-orange-400",
          iconBg: isDark ? "bg-orange-500/10" : "bg-orange-100",
        };
      case "cyan":
        return {
          bg: isDark ? "bg-cyan-500/5" : "bg-cyan-50",
          border: isDark ? "border-cyan-500/20" : "border-cyan-200",
          text: "text-cyan-400",
          iconBg: isDark ? "bg-cyan-500/10" : "bg-cyan-100",
        };
      default:
        return {
          bg: isDark ? "bg-blue-500/5" : "bg-blue-50",
          border: isDark ? "border-blue-500/20" : "border-blue-200",
          text: "text-blue-400",
          iconBg: isDark ? "bg-blue-500/10" : "bg-blue-100",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-4xl font-bold tracking-tight mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Operations & Telemetry
          </h1>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            REAL-TIME MONITORING //{" "}
            <span className="text-emerald-500 font-semibold animate-pulse">
              ACTIVE
            </span>
          </p>
        </div>
        <div
          className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
            isDark
              ? "bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-linear-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 border border-emerald-500/20"
          }`}
        >
          <Activity className="w-5 h-5 animate-pulse" />
          Global Network Status: <span className="font-bold">HEALTHY</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROI Card - Large */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:col-span-2 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl ${
            isDark
              ? "bg-black/40 backdrop-blur-xl border border-white/10"
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isDark ? "bg-cyan-400" : "bg-blue-500"
                  }`}
                />
                <h3
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Return on Investment
                </h3>
              </div>
            </div>

            {/* ROI Metrics */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div
                  className={`text-xs font-semibold tracking-wider mb-2 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Time Saved
                </div>
                <div
                  className={`text-5xl font-bold tracking-tight mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  1,240
                  <span
                    className={`text-2xl ml-1 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    hrs
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-500">
                    +12% vs last month
                  </span>
                </div>
              </div>

              <div>
                <div
                  className={`text-xs font-semibold tracking-wider mb-2 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Est. Revenue Generated
                </div>
                <div
                  className={`text-5xl font-bold tracking-tight mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  $842
                  <span
                    className={`text-2xl ml-1 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    .5K
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-500">
                    +45% projected
                  </span>
                </div>
              </div>
            </div>

            {/* 3D Visualization Area */}
            <div className="relative">
              <div
                className={`text-xs font-semibold tracking-wider mb-4 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Software Execution Frequency
              </div>

              <div
                className={`relative h-48 rounded-2xl overflow-hidden ${
                  isDark
                    ? "bg-linear-to-br from-cyan-500/5 to-blue-500/5"
                    : "bg-linear-to-br from-blue-500/5 to-indigo-500/5"
                }`}
              >
                {/* 3D Donut Chart Visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    {/* Outer Ring */}
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 200 200"
                    >
                      <defs>
                        <linearGradient
                          id="gradient1"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor={isDark ? "#22d3ee" : "#3b82f6"}
                          />
                          <stop
                            offset="100%"
                            stopColor={isDark ? "#60a5fa" : "#6366f1"}
                          />
                        </linearGradient>
                        <filter id="shadow">
                          <feDropShadow
                            dx="0"
                            dy="4"
                            stdDeviation="8"
                            floodColor={isDark ? "#22d3ee" : "#3b82f6"}
                            floodOpacity="0.3"
                          />
                        </filter>
                      </defs>

                      {/* Background Circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke={
                          isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                        }
                        strokeWidth="30"
                      />

                      {/* Animated Arc */}
                      <motion.circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke="url(#gradient1)"
                        strokeWidth="30"
                        strokeLinecap="round"
                        strokeDasharray="439.8"
                        initial={{ strokeDashoffset: 439.8 }}
                        animate={{ strokeDashoffset: 110 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        filter="url(#shadow)"
                      />
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${
                            isDark
                              ? "bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                              : "bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                          }`}
                        >
                          3D
                        </div>
                        <div
                          className={`text-xs font-semibold ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          VISUALIZATION
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {PARTICLE_POSITIONS.map((particle, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 rounded-full ${
                        isDark ? "bg-cyan-400/30" : "bg-blue-500/30"
                      }`}
                      style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                      }}
                      transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Uptime & Resources */}
        <div className="space-y-6">
          {/* System Uptime */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
              isDark
                ? "bg-black/40 backdrop-blur-xl border border-white/10"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  System Uptime
                </h3>
              </div>

              <div className="relative mb-6">
                {/* Circular Progress */}
                <svg className="w-full h-32" viewBox="0 0 120 120">
                  <defs>
                    <linearGradient
                      id="uptimeGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>

                  {/* Background */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={
                      isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                    }
                    strokeWidth="8"
                  />

                  {/* Progress */}
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#uptimeGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="314.16"
                    initial={{ strokeDashoffset: 314.16 }}
                    animate={{ strokeDashoffset: 3.14 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    transform="rotate(-90 60 60)"
                    className="drop-shadow-lg"
                  />

                  {/* Center Text */}
                  <text
                    x="60"
                    y="60"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-2xl font-bold ${
                      isDark ? "fill-emerald-400" : "fill-emerald-600"
                    }`}
                  >
                    99.98%
                  </text>
                </svg>
              </div>

              <div
                className={`text-center text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Operational excellence maintained
              </div>
            </div>
          </motion.div>

          {/* Resource Allocation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
              isDark
                ? "bg-black/40 backdrop-blur-xl border border-white/10"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Database
                  className={`w-4 h-4 ${
                    isDark ? "text-cyan-400" : "text-blue-600"
                  }`}
                />
                <h3
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Resource Allocation
                </h3>
              </div>

              <div className="space-y-4">
                {/* CPU Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm flex items-center gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <Cpu className="w-4 h-4" />
                      CPU Usage (2-core Δ)
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isDark ? "text-cyan-400" : "text-blue-600"
                      }`}
                    >
                      42%
                    </span>
                  </div>
                  <div
                    className={`h-2 rounded-full overflow-hidden ${
                      isDark ? "bg-white/5" : "bg-gray-100"
                    }`}
                  >
                    <motion.div
                      className="h-full bg-linear-to-r from-cyan-400 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "42%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Memory Load */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm flex items-center gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <Database className="w-4 h-4" />
                      Memory Load
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      68%
                    </span>
                  </div>
                  <div
                    className={`h-2 rounded-full overflow-hidden ${
                      isDark ? "bg-white/5" : "bg-gray-100"
                    }`}
                  >
                    <motion.div
                      className="h-full bg-linear-to-r from-purple-400 to-pink-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "68%" }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Event Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/10"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity
                className={`w-5 h-5 ${
                  isDark ? "text-cyan-400" : "text-blue-600"
                }`}
              />
              <h3
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                GLOBAL_EVENT_LOGS
              </h3>
            </div>
            <div className="flex gap-2">
              {["Live", "Filtered", "Search"].map((tab, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    idx === 0
                      ? isDark
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      : isDark
                        ? "text-gray-400 hover:text-cyan-400 hover:bg-white/5"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Logs Table */}
          <div
            className={`rounded-xl overflow-hidden ${
              isDark ? "bg-white/5" : "bg-gray-50"
            }`}
          >
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b ${
                    isDark ? "border-white/10" : "border-gray-200"
                  }`}
                >
                  <th
                    className={`text-left px-4 py-3 text-xs font-semibold tracking-wider ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    STATUS
                  </th>
                  <th
                    className={`text-left px-4 py-3 text-xs font-semibold tracking-wider ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    TIMESTAMP
                  </th>
                  <th
                    className={`text-left px-4 py-3 text-xs font-semibold tracking-wider ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    CODE
                  </th>
                  <th
                    className={`text-left px-4 py-3 text-xs font-semibold tracking-wider ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    MESSAGE
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => {
                  const styles = getStatusStyles(log.color);
                  return (
                    <tr
                      key={idx}
                      className={`border-b transition-colors duration-200 ${
                        isDark
                          ? "border-white/5 hover:bg-white/5"
                          : "border-gray-100 hover:bg-white"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${styles.iconBg} border ${styles.border}`}
                        >
                          <log.icon className={`w-3 h-3 ${styles.text}`} />
                          <span
                            className={`text-xs font-bold uppercase ${styles.text}`}
                          >
                            {log.status}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-mono ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {log.timestamp}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-mono font-semibold ${
                          isDark ? "text-cyan-400" : "text-blue-600"
                        }`}
                      >
                        {log.code}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {log.message}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
