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
import { useTheme } from "@/features/shared/hooks/useTheme";

interface DataPoint {
  label: string;
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
  timeRange: "week" | "month" | "year";
  setTimeRange: (range: "week" | "month" | "year") => void;
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
        className={`rounded-2xl overflow-hidden transition-all duration-200 h-full flex flex-col ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/10"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <div className="p-5 flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
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
                Tiempo Ahorrado -{" "}
                {timeRange === "week"
                  ? "Última Semana"
                  : timeRange === "month"
                    ? "Último Mes"
                    : "Último Año"}
              </h3>
            </div>
            <div
              className={`flex bg-transparent p-1 gap-1 rounded-xl border shadow-inner ${
                isDark ? "bg-white/5 border-white/5" : "bg-gray-100/80 border-gray-200"
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
                    className="relative px-2.5 py-1 text-[11px] font-bold outline-none transition-colors"
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-period"
                        className={`absolute inset-0 rounded-lg shadow-sm ${
                          isDark ? "bg-white/10 ring-1 ring-white/10" : "bg-white ring-1 ring-black/5"
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
                            ? "text-white"
                            : "text-blue-600"
                          : isDark
                            ? "text-gray-400 hover:text-white"
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

          <div className="flex-1 min-h-70">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
              >
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
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke={isDark ? "#22d3ee" : "#3b82f6"}
                  strokeWidth={2.25}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                  dot={false}
                  activeDot={{ r: 5, fill: isDark ? "#22d3ee" : "#3b82f6", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  },
);

TimeSavedChart.displayName = "TimeSavedChart";
