"use client";

import React from "react";
import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface MrrCardProps {
  mrr: number;
  growth: number;
  className?: string;
}

export const MrrCard = React.memo(
  ({ mrr, growth, className }: MrrCardProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/10"
            : "bg-white border border-gray-200 shadow-sm"
        } ${className || ""}`}
      >
        <div className="relative h-full flex flex-col min-h-0 bg-transparent">
          {/* 1. HEADER: Title & Status - Fixed Height */}
          <div className="flex items-center justify-between px-6 pt-5 pb-2 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-300 ${
                  isDark
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-emerald-50 border-emerald-100 text-emerald-600"
                }`}
              >
                <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <div
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Monthly Recurring Revenue
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${isDark ? "bg-emerald-500" : "bg-emerald-500"}`}
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-emerald-500" : "text-emerald-600"}`}
              >
                Live
              </span>
            </div>
          </div>

          {/* 2. BODY: Hero Value & Rich Chart - Flex-1 (Takes available space) */}
          <div className="flex-1 flex flex-col min-h-0 relative group/chart px-6">
            {/* Big Value Anchor */}
            <div className="mb-2 shrink-0 z-10">
              <div
                className={`text-3xl sm:text-4xl lg:text-4xl font-black tracking-tighter tabular-nums transition-all duration-300 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                ${mrr.toLocaleString()}
              </div>
            </div>

            {/* Rich Chart */}
            <div className="flex-1 w-full relative min-h-0">
              {/* Simulated Grid Lines for Scale */}
              <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-20">
                <div
                  className={`w-full h-px ${isDark ? "bg-white/10" : "bg-black/5"}`}
                />
                <div
                  className={`w-full h-px ${isDark ? "bg-white/10" : "bg-black/5"}`}
                />
                <div
                  className={`w-full h-px ${isDark ? "bg-white/10" : "bg-black/5"}`}
                />
              </div>

              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="mrrRichGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 40 L0 30 C 20 32, 40 25, 60 15 C 80 8, 90 2, 100 1 V 40 Z"
                  fill="url(#mrrRichGradient)"
                />
                <path
                  d="M0 30 C 20 32, 40 25, 60 15 C 80 8, 90 2, 100 1"
                  fill="none"
                  stroke={isDark ? "#34d399" : "#059669"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className="drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                />
              </svg>
            </div>
          </div>

          {/* 3. FOOTER: Data Strip - Fixed Height - Anchors the bottom */}
          <div
            className={`h-13 border-t mt-auto shrink-0 grid grid-cols-3 divide-x ${
              isDark
                ? "border-white/5 bg-white/2 divide-white/5"
                : "border-gray-100 bg-gray-50/80 divide-gray-100"
            }`}
          >
            {/* Slot 1: Growth */}
            <div className="flex flex-col items-center justify-center p-2">
              <div
                className={`flex items-center gap-1.5 mb-1 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
              >
                <TrendingUp className="w-3 h-3" />
                <span className="text-sm font-bold">+{growth}%</span>
              </div>
              <div
                className={`text-[9px] font-medium uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                vs Last Month
              </div>
            </div>

            {/* Slot 2: Projection */}
            <div className="flex flex-col items-center justify-center p-2">
              <div
                className={`text-sm font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                $
                {(mrr * 1.05).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
              <div
                className={`text-[9px] font-medium uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                EOM Projection
              </div>
            </div>

            {/* Slot 3: Goal Status */}
            <div className="flex flex-col justify-center px-6 py-2">
              <div className="flex justify-between mb-1.5">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Goal
                </span>
                <span
                  className={`text-[9px] font-bold ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  95%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[95%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

MrrCard.displayName = "MrrCard";
