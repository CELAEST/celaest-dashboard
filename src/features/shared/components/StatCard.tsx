"use client";

import React from "react";
import { motion } from "motion/react";
import { TrendUp, TrendDown, Minus } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactElement;
  delay?: number;
  hologramImage?: string;
  gradient?: string;
  className?: string;
  visual?: React.ReactNode;
}

export const StatCard = React.memo(function StatCard({
  title,
  value,
  trend,
  trendUp,
  icon,
  delay = 0,
  gradient = "from-cyan-400 to-blue-500",
  className,
  visual,
}: StatCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const hasTrend = Boolean(trend && trend.trim().length > 0);
  const shouldPrefixPositiveTrend = Boolean(
    hasTrend && trendUp && !trend!.startsWith("+") && /^\d/.test(trend!.trim()),
  );
  const trendLabel = shouldPrefixPositiveTrend ? `+${trend}` : trend;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] cursor-default flex flex-col justify-between min-h-[140px]",
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          : "bg-white border border-gray-200 shadow-sm hover:shadow-xl",
        className,
      )}
    >
      {/* Background Gradient Spot */}
      <div
        className={`absolute -right-10 -top-10 w-40 h-40 bg-linear-to-br ${gradient} opacity-10 group-hover:opacity-20 blur-3xl transition-opacity duration-300 rounded-full`}
      />

      {/* Floating Custom Visual (if provided) */}
      {visual && (
        <div className="absolute right-2 bottom-0 z-0 pointer-events-none opacity-80 flex items-end justify-end group-hover:scale-105 transition-transform duration-500 origin-bottom-right">
          <div className="scale-90 opacity-90">
            {visual}
          </div>
        </div>
      )}

      {/* Header (Top Left focus) */}
      <div className="relative z-10 w-full mb-6">
        <div className="flex items-center gap-2.5 w-fit">
          <div
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-[8px] border shadow-sm",
              isDark
                ? "bg-linear-to-b from-white/[0.08] to-transparent border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]"
                : "bg-linear-to-b from-white to-gray-50 border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]"
            )}
          >
            {icon && React.cloneElement(
              icon as React.ReactElement<{
                size?: number | string;
                className?: string;
                weight?: string;
              }>,
              {
                size: 14,
                className: isDark ? "text-gray-300 drop-shadow-sm" : "text-gray-600",
                weight: "bold"
              },
            )}
          </div>
          <span
            className={`text-[11px] uppercase font-bold tracking-[0.15em] ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {title}
          </span>
        </div>
      </div>

      {/* Bottom Row: Value + Trend */}
      <div className="relative z-10 flex items-end gap-3 mt-auto">
        <div
          className={`text-3xl font-black font-mono tracking-tight drop-shadow-md ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {value}
        </div>

        {hasTrend && (
          <div
            className={`shrink-0 flex items-center gap-1 px-2 py-1 mb-1 rounded border h-fit text-[10px] font-bold tracking-wider uppercase shadow-sm ${
              trendUp === true
                ? isDark
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-emerald-50 border-emerald-100 text-emerald-600"
                : trendUp === false
                  ? isDark
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    : "bg-rose-50 border-rose-100 text-rose-600"
                  : isDark
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    : "bg-blue-50 border-blue-100 text-blue-600"
            }`}
          >
            <span className="whitespace-nowrap">
              {trendLabel}
            </span>
            {trendUp === true && <TrendUp size={12} weight="bold" />}
            {trendUp === false && <TrendDown size={12} weight="bold" />}
            {trendUp === undefined && <Minus size={12} weight="bold" />}
          </div>
        )}
      </div>

      {/* Bottom Glow Line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </motion.div>
  );
});
