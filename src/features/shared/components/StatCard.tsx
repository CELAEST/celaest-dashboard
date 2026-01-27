"use client";

import React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";

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
        <div className="flex items-start justify-between mb-6">
          <div
            className={`w-14 h-14 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${
              isDark
                ? "shadow-2xl shadow-cyan-500/20"
                : "shadow-xl shadow-blue-500/20"
            }`}
          >
            <div className="text-white scale-110">{icon}</div>
          </div>
          <div
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
              isDark ? "bg-white/5" : "bg-gray-100"
            }`}
          >
            <span
              className={`text-[10px] font-black tracking-widest uppercase ${
                trendUp ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {trendUp ? "+" : "-"}
              {trend}
            </span>
            {trendUp ? (
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
          </div>
        </div>

        {/* Content */}
        <div
          className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {title}
        </div>
        <div
          className={`text-4xl font-black tracking-tighter italic mb-1 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-1 w-12 rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-gray-100"}`}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ delay: delay + 0.5, duration: 1 }}
              className={`h-full bg-linear-to-r ${gradient}`}
            />
          </div>
          <span
            className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? "text-gray-600" : "text-gray-400"}`}
          >
            Global performance index
          </span>
        </div>
      </div>
    </motion.div>
  );
});
