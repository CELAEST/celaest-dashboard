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
    [isDark]
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

export const SalesChart = React.memo(function SalesChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Memoizar colores que dependen del tema
  const colors = useMemo(
    () => ({
      stroke: isDark ? "#22d3ee" : "#3b82f6",
      axis: isDark ? "#666" : "#9ca3af",
      grid: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
      cursor: isDark ? "rgba(34,211,238,0.2)" : "rgba(59,130,246,0.2)",
    }),
    [isDark]
  );

  // Memoizar estilos del select
  const selectClassName = useMemo(
    () =>
      `text-xs rounded-lg px-2 py-1 outline-none border ${
        isDark
          ? "bg-black/30 border-white/10 text-gray-400 focus:border-cyan-500/50"
          : "bg-white border-gray-200 text-gray-600 focus:border-blue-500"
      }`,
    [isDark]
  );

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`font-medium flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isDark ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]" : "bg-blue-500"
            }`}
          />
          Revenue Flow
        </h3>
        <select className={selectClassName}>
          <option>Last 7 Days</option>
          <option>Last Month</option>
        </select>
      </div>

      <div className="w-full h-[300px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
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
    </div>
  );
});
