"use client";

import React, { useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

// Datos estáticos fuera del componente para evitar re-creación
const chartData = [
  { name: "Mon", sales: 4000, traffic: 2400 },
  { name: "Tue", sales: 3000, traffic: 1398 },
  { name: "Wed", sales: 9000, traffic: 3800 },
  { name: "Thu", sales: 2780, traffic: 3908 },
  { name: "Fri", sales: 6890, traffic: 4800 },
  { name: "Sat", sales: 2390, traffic: 3800 },
  { name: "Sun", sales: 7490, traffic: 4300 },
];

// Tooltip memoizado
const CustomTooltip = React.memo(function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // useMemo DEBE llamarse ANTES de cualquier return condicional
  const tooltipClassName = useMemo(
    () =>
      `p-3 rounded-lg backdrop-blur-md border ${
        isDark
          ? "bg-black/90 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          : "bg-white/90 border-gray-200 shadow-lg"
      }`,
    [isDark],
  );

  // Return condicional DESPUÉS de todos los hooks
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className={tooltipClassName}>
      <p
        className={`text-xs font-mono mb-1 ${
          isDark ? "text-gray-300" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`font-bold text-sm ${
          isDark ? "text-cyan-400" : "text-blue-600"
        }`}
      >
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
});

interface RevenueChartProps {
  data?: { date: string; sales: number }[];
}

export const RevenueChart = React.memo(function RevenueChart({
  data,
}: RevenueChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Usar datos reales o fallback estático si no hay
  const displayData = useMemo(() => {
    if (!data || data.length === 0) return chartData;

    // El backend devuelve fechas. Vamos a formatearlas para el eje X
    return data
      .map((item) => ({
        name: new Date(item.date).toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
        }),
        sales: item.sales,
      }))
      .reverse(); // El backend devuelve de más reciente a más antiguo
  }, [data]);

  // Memoizar colores que dependen del tema
  const colors = useMemo(
    () => ({
      stroke: isDark ? "#22d3ee" : "#3b82f6",
      axis: isDark ? "#666" : "#9ca3af",
      grid: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
      cursor: isDark ? "rgba(34,211,238,0.2)" : "rgba(59,130,246,0.2)",
    }),
    [isDark],
  );

  return (
    <div className="w-full h-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayData}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.stroke} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors.stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.grid}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke={colors.axis}
            tick={{ fill: colors.axis, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke={colors.axis}
            tick={{ fill: colors.axis, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: colors.cursor, strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke={colors.stroke}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSales)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});
