"use client";

import React from "react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { FinancialMetric } from "../../types";

interface MetricCardProps {
  metric: FinancialMetric;
  index: number;
}

export const MetricCard = React.memo(({ metric, index }: MetricCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getMetricColor = (color: string) => {
    switch (color) {
      case "blue":
        return isDark
          ? "bg-blue-500/10 text-blue-400"
          : "bg-blue-500/10 text-blue-600";
      case "yellow":
        return isDark
          ? "bg-yellow-500/10 text-yellow-400"
          : "bg-yellow-500/10 text-yellow-600";
      case "purple":
        return isDark
          ? "bg-purple-500/10 text-purple-400"
          : "bg-purple-500/10 text-purple-600";
      default:
        return isDark
          ? "bg-gray-500/10 text-gray-400"
          : "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${getMetricColor(
              metric.color,
            )}`}
          >
            {metric.icon && <metric.icon className="w-6 h-6" />}
          </div>
        </div>

        <div
          className={`text-xs font-semibold tracking-wider mb-2 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {metric.label}
        </div>
        <div
          className={`text-3xl font-bold tracking-tight mb-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {metric.value}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-bold ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}
          >
            {metric.change}
          </span>
          <span
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            {metric.changeLabel}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

MetricCard.displayName = "MetricCard";
