"use client";

import React from "react";
import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface MrrCardProps {
  mrr: number;
  growth: number;
}

export const MrrCard = React.memo(({ mrr, growth }: MrrCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDark ? "bg-emerald-500/10" : "bg-emerald-500/10"
            }`}
          >
            <TrendingUp
              className={`w-6 h-6 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
        </div>

        <div
          className={`text-xs font-semibold tracking-wider mb-2 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          MONTHLY RECURRING REVENUE
        </div>
        <div
          className={`text-4xl font-bold tracking-tight mb-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          ${mrr.toLocaleString()}
        </div>

        {/* Mini Chart */}
        <div className="h-16 mb-4">
          <svg className="w-full h-full" viewBox="0 0 200 60">
            <defs>
              <linearGradient
                id="mrrGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={isDark ? "#10b981" : "#059669"}
                  stopOpacity="0.4"
                />
                <stop
                  offset="100%"
                  stopColor={isDark ? "#10b981" : "#059669"}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d="M0 50 Q20 45, 40 40 T80 35 T120 25 T160 20 T200 10 L200 60 L0 60 Z"
              fill="url(#mrrGradient)"
            />
            <path
              d="M0 50 Q20 45, 40 40 T80 35 T120 25 T160 20 T200 10"
              fill="none"
              stroke={isDark ? "#10b981" : "#059669"}
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-bold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          >
            +{growth}%
          </span>
          <span
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            vs last month
          </span>
        </div>
      </div>
    </motion.div>
  );
});

MrrCard.displayName = "MrrCard";
