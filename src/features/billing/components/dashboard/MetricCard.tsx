"use client";

import React from "react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { FinancialMetric } from "../../types";

interface MetricCardProps {
  metric: FinancialMetric;
  index: number;
  className?: string;
}

export const MetricCard = React.memo(
  ({ metric, index, className }: MetricCardProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + index * 0.1 }}
        className={`group relative rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${
          isDark
            ? "bg-[#09090b] border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:-translate-y-1"
            : "bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-500/30 hover:-translate-y-1"
        } ${className || ""}`}
      >
        <div className="p-6 h-full flex flex-col justify-center gap-4 relative z-10">
          <div className="flex items-start justify-between">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${
                isDark
                  ? "bg-[#18181b] border-white/10 group-hover:border-cyan-500/50 group-hover:bg-cyan-950/30"
                  : "bg-gray-50 border-gray-200 group-hover:border-blue-500/50 group-hover:bg-blue-50"
              }`}
            >
              {metric.icon && (
                <metric.icon
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isDark
                      ? "text-gray-400 group-hover:text-cyan-400"
                      : "text-gray-500 group-hover:text-blue-600"
                  }`}
                />
              )}
            </div>
            {/* Status indicator hook */}
            <div
              className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-zinc-800 group-hover:bg-cyan-500" : "bg-gray-300 group-hover:bg-blue-500"} transition-colors duration-300`}
            />
          </div>

          <div>
            <div
              className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                isDark
                  ? "text-gray-500 group-hover:text-gray-300 transition-colors"
                  : "text-gray-400 group-hover:text-gray-600 transition-colors"
              }`}
            >
              {metric.label}
            </div>
            <div
              className={`text-3xl font-black tracking-tight mb-3 tabular-nums ${
                isDark
                  ? "text-white group-hover:text-cyan-50 transition-colors"
                  : "text-gray-900"
              }`}
            >
              {metric.value}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  isDark
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {metric.change}
              </span>
              <span
                className={`text-[10px] font-medium opacity-60 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                VS LAST MO
              </span>
            </div>
          </div>
        </div>

        {/* Metric Grid Decoration */}
        <div
          className={`absolute right-0 top-0 w-24 h-24 opacity-[0.03] transition-opacity group-hover:opacity-[0.08] pointer-events-none ${isDark ? "bg-white" : "bg-black"}`}
          style={{
            maskImage: "radial-gradient(circle, black 1px, transparent 1px)",
            maskSize: "4px 4px",
          }}
        />
      </motion.div>
    );
  },
);

MetricCard.displayName = "MetricCard";
