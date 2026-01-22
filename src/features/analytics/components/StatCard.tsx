"use client";

import React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  delay?: number;
  hologramImage?: string;
  gradient?: string;
}

export const StatCard = React.memo(function StatCard({
  title,
  value,
  trend,
  trendUp = true,
  icon,
  delay = 0,
  gradient = "from-cyan-400 to-blue-500",
}: StatCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 cursor-pointer ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20"
          : "bg-white border border-gray-200 shadow-sm hover:shadow-xl"
      }`}
    >
      {/* Gradient Overlay on Hover */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      />

      {/* Glow Effect */}
      <div
        className={`absolute -inset-1 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
      />

      <div className="relative">
        {/* Icon & Trend */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${
              isDark ? "shadow-lg shadow-cyan-500/30" : "shadow-md"
            }`}
          >
            <div className="text-white">{icon}</div>
          </div>
          <div
            className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}
          >
            {trendUp ? (
              <TrendingUp
                className={`w-4 h-4 ${
                  trendUp ? "text-emerald-500" : "text-blue-500"
                }`}
              />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        {/* Content */}
        <div
          className={`text-xs font-semibold tracking-wider mb-2 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {title}
        </div>
        <div
          className={`text-3xl font-bold tracking-tight mb-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-semibold ${
              trendUp
                ? isDark
                  ? "text-emerald-400"
                  : "text-emerald-600"
                : isDark
                  ? "text-red-400"
                  : "text-red-600"
            }`}
          >
            {trendUp ? "+" : ""}
            {trend}
          </span>
          <span
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            vs last week
          </span>
        </div>
      </div>
    </motion.div>
  );
});
