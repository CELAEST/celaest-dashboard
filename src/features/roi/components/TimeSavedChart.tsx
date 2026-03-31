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
        className={`px-3.5 py-2.5 rounded-xl border shadow-2xl backdrop-blur-xl ${
          isDark
            ? "bg-black/80 border-white/10 shadow-black/40"
            : "bg-white/95 border-gray-200 shadow-gray-300/20"
        }`}
      >
        <p
          className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-xl font-black tracking-tight tabular-nums ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {payload[0].value}
          </span>
          <span
            className={`text-[10px] font-semibold ${
              isDark ? "text-cyan-400/70" : "text-blue-500/70"
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

/* Custom active dot with glow */
const GlowActiveDot = (props: any) => {
  const { cx, cy, fill } = props;
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r="10" fill={fill} opacity="0.15" />
      <circle cx={cx} cy={cy} r="5" fill={fill} strokeWidth="0" />
      <circle cx={cx} cy={cy} r="2.5" fill="#fff" />
    </g>
  );
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
        className={`rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/8 hover:border-white/15"
            : "bg-white border border-gray-200 shadow-sm hover:border-gray-300"
        }`}
      >
        <div className="p-5 flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  isDark ? "bg-cyan-400" : "bg-blue-500"
                }`}
                style={{
                  boxShadow: isDark
                    ? "0 0 6px 2px rgba(34,211,238,0.4)"
                    : "0 0 4px 1px rgba(59,130,246,0.3)",
                }}
              />
              <h3
                className={`text-sm font-bold tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Tiempo Ahorrado —{" "}
                <span className={`font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {timeRange === "week"
                    ? "Última Semana"
                    : timeRange === "month"
                      ? "Último Mes"
                      : "Último Año"}
                </span>
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
                  <linearGradient id="colorHoursRoi" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isDark ? "#22d3ee" : "#3b82f6"}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="50%"
                      stopColor={isDark ? "#22d3ee" : "#3b82f6"}
                      stopOpacity={0.08}
                    />
                    <stop
                      offset="100%"
                      stopColor={isDark ? "#22d3ee" : "#3b82f6"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <filter id="glowLineRoi">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid
                  strokeDasharray="2 6"
                  stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke={isDark ? "rgba(255,255,255,0.2)" : "#9ca3af"}
                  tickLine={false}
                  axisLine={false}
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono, monospace)",
                    letterSpacing: "0.05em",
                  }}
                  dy={4}
                />
                <YAxis
                  stroke={isDark ? "rgba(255,255,255,0.15)" : "#9ca3af"}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                />
                <Tooltip
                  content={<CustomTooltip isDark={isDark} />}
                  cursor={{
                    stroke: isDark ? "rgba(34,211,238,0.25)" : "rgba(59,130,246,0.15)",
                    strokeWidth: 1.5,
                    strokeDasharray: "3 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke={isDark ? "#22d3ee" : "#3b82f6"}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorHoursRoi)"
                  dot={false}
                  activeDot={
                    <GlowActiveDot fill={isDark ? "#22d3ee" : "#3b82f6"} />
                  }
                  animationDuration={1200}
                  animationEasing="ease-out"
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
