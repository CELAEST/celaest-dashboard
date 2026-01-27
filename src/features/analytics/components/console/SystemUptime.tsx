import React from "react";
import { motion } from "motion/react";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";

export const SystemUptime = React.memo(() => {
  const { isDark, stats } = useAnalytics();

  return (
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
              stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
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
              {stats.uptime}
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
  );
});

SystemUptime.displayName = "SystemUptime";
