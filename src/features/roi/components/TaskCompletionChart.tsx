import React from "react";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface DataPoint {
  label: string;
  tasks: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
  isDark: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  isDark,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-3 rounded-xl border shadow-xl backdrop-blur-md ${
          isDark
            ? "bg-black/80 border-cyan-500/20 shadow-cyan-900/10"
            : "bg-white/95 border-blue-100 shadow-blue-500/5"
        }`}
      >
        <p
          className={`text-xs font-semibold mb-1.5 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {label}
        </p>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isDark ? "bg-cyan-400" : "bg-blue-500"
            }`}
          />
          <span
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {payload[0].value}
          </span>
          <span
            className={`text-xs font-medium ${
              isDark ? "text-cyan-200/70" : "text-blue-600/70"
            }`}
          >
            tareas
          </span>
        </div>
      </div>
    );
  }
  return null;
};

interface TaskCompletionChartProps {
  data: DataPoint[];
}

export const TaskCompletionChart = React.memo(
  ({ data }: TaskCompletionChartProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-2xl overflow-hidden transition-all duration-200 h-full flex flex-col ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/10"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <div className="p-5 flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isDark ? "bg-cyan-400" : "bg-blue-500"
                }`}
              />
              <h3
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Tareas Completadas - Últimos 6 Meses
              </h3>
            </div>
          </div>

          <div className="flex-1 min-h-70">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
                maxBarSize={44}
                barCategoryGap="18%"
              >
                <defs>
                  <linearGradient id="barGradientDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="barGradientLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255,255,255,0.05)" : "#e5e7eb"}
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke={isDark ? "#64748b" : "#9ca3af"}
                  tickLine={false}
                  axisLine={false}
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke={isDark ? "#64748b" : "#9ca3af"}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  content={<CustomTooltip isDark={isDark} />}
                  cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", radius: 8 }}
                />
                <Bar
                  dataKey="tasks"
                  fill={isDark ? "url(#barGradientDark)" : "url(#barGradientLight)"}
                  radius={[8, 8, 2, 2]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  },
);

TaskCompletionChart.displayName = "TaskCompletionChart";
