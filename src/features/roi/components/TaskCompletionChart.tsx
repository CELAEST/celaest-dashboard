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
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface DataPoint {
  month: string;
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
        className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/10"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
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

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "rgba(255,255,255,0.05)" : "#e5e7eb"}
              />
              <XAxis
                dataKey="month"
                stroke={isDark ? "#64748b" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke={isDark ? "#64748b" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar
                dataKey="tasks"
                fill={isDark ? "#22d3ee" : "#3b82f6"}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  },
);

TaskCompletionChart.displayName = "TaskCompletionChart";
