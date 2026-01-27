import React from "react";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface DataPoint {
  day: string;
  hours: number;
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
            horas
          </span>
        </div>
      </div>
    );
  }
  return null;
};

interface TimeSavedChartProps {
  data: DataPoint[];
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export const TimeSavedChart = React.memo(
  ({ data, timeRange, setTimeRange }: TimeSavedChartProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
                Tiempo Ahorrado - Última Semana
              </h3>
            </div>
            <div
              className={`flex bg-transparent p-1 gap-1 rounded-lg ${
                isDark ? "bg-white/5 border border-white/5" : "bg-gray-100/50"
              }`}
            >
              {["Semana", "Mes", "Año"].map((period) => {
                const isSelected =
                  (timeRange === "week" && period === "Semana") ||
                  (timeRange === "month" && period === "Mes") ||
                  (timeRange === "year" && period === "Año");

                return (
                  <button
                    key={period}
                    onClick={() =>
                      setTimeRange(
                        period === "Semana"
                          ? "week"
                          : period === "Mes"
                            ? "month"
                            : "year",
                      )
                    }
                    className="relative px-3 py-1.5 text-xs font-bold outline-none transition-colors"
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-period"
                        className={`absolute inset-0 rounded-md shadow-sm ${
                          isDark ? "bg-cyan-500/20" : "bg-white"
                        }`}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors duration-200 ${
                        isSelected
                          ? isDark
                            ? "text-cyan-400"
                            : "text-blue-600"
                          : isDark
                            ? "text-gray-400 hover:text-gray-300"
                            : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {period}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isDark ? "#22d3ee" : "#3b82f6"}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={isDark ? "#22d3ee" : "#3b82f6"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "rgba(255,255,255,0.05)" : "#e5e7eb"}
              />
              <XAxis
                dataKey="day"
                stroke={isDark ? "#64748b" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke={isDark ? "#64748b" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Area
                type="monotone"
                dataKey="hours"
                stroke={isDark ? "#22d3ee" : "#3b82f6"}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorHours)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  },
);

TimeSavedChart.displayName = "TimeSavedChart";
