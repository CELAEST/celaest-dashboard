"use client";

import React from "react";
import { motion } from "motion/react";
import { TrendUp, TrendDown } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactElement;
  delay?: number;
  hologramImage?: string;
  gradient?: string;
  className?: string;
  chartData?: { value: number }[];
}

const defaultChartData = [
  { value: 10 },
  { value: 15 },
  { value: 12 },
  { value: 20 },
  { value: 18 },
  { value: 25 },
  { value: 22 },
  { value: 30 },
  { value: 28 },
  { value: 35 },
  { value: 30 },
  { value: 40 },
];

export const StatCard = React.memo(function StatCard({
  title,
  value,
  trend,
  trendUp = true,
  icon,
  delay = 0,
  gradient = "from-cyan-400 to-blue-500",
  className,
  chartData = defaultChartData,
}: StatCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const hasTrend = Boolean(trend && trend.trim().length > 0);
  const hasChartActivity = chartData.some((point) => point.value > 0);
  const shouldPrefixPositiveTrend = Boolean(
    hasTrend &&
      trendUp &&
      !trend!.startsWith("+") &&
      /^\d/.test(trend!.trim()),
  );
  const trendLabel = shouldPrefixPositiveTrend ? `+${trend}` : trend;
  const chartStroke = hasChartActivity
    ? trendUp
      ? "#10b981"
      : "#ef4444"
    : isDark
      ? "rgba(148,163,184,0.55)"
      : "#94a3b8";
  const chartFillColor = hasChartActivity
    ? trendUp
      ? "#10b981"
      : "#ef4444"
    : isDark
      ? "rgba(148,163,184,0.45)"
      : "#cbd5e1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] cursor-pointer flex flex-col justify-between h-full",
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          : "bg-white border border-gray-200 shadow-sm hover:shadow-xl",
        className,
      )}
    >
      {/* Background Gradient Spot */}
      <div
        className={`absolute -right-10 -top-10 w-40 h-40 bg-linear-to-br ${gradient} opacity-10 group-hover:opacity-20 blur-3xl transition-opacity duration-200 rounded-full`}
      />



      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5 px-2 py-1 rounded-md bg-white/5 w-fit border border-white/5">
            <div
              className={`p-1 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`}
            >
              {React.cloneElement(
                icon as React.ReactElement<{
                  size?: number | string;
                  className?: string;
                }>,
                {
                  size: 12,
                  className: isDark ? "text-white" : "text-gray-600",
                },
              )}
            </div>
            <span
              className={`text-xs uppercase font-semibold tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {title}
            </span>
          </div>

          <div
            className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {value}
          </div>
        </div>

        {hasTrend && (
          <div
            className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg border h-fit ${
              trendUp
                ? isDark
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-emerald-50 border-emerald-100 text-emerald-600"
                : isDark
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-red-50 border-red-100 text-red-600"
            }`}
          >
            <span className="text-xs font-bold whitespace-nowrap">
              {trendLabel}
            </span>
            {trendUp ? (
              <TrendUp size={12} className="shrink-0" />
            ) : (
              <TrendDown size={12} className="shrink-0" />
            )}
          </div>
        )}
      </div>

      {/* Mini Chart Area */}
      <div className="h-16 w-full relative mt-4 opacity-50 group-hover:opacity-100 transition-opacity duration-200 -mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id={`gradient-${title}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={chartFillColor}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={chartFillColor}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartStroke}
              fill={`url(#gradient-${title})`}
              strokeWidth={2}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Glow Line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
      />
    </motion.div>
  );
});
