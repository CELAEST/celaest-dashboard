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
  Cell,
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
            tareas
          </span>
        </div>
      </div>
    );
  }
  return null;
};

interface GlowBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  isActive?: boolean;
  index?: number;
}

/* Custom bar shape with subtle glow on hover */
const GlowBar = (props: GlowBarProps) => {
  const { x, y, width, height, fill, isActive } = props;
  if (x === undefined || y === undefined || !width || !height || height <= 0) return null;
  const rx = Math.min(6, width / 2);
  return (
    <g>
      {isActive && (
        <rect
          x={x - 2}
          y={y - 2}
          width={width + 4}
          height={height + 4}
          rx={rx + 1}
          fill={fill}
          opacity="0.12"
          filter="url(#barGlow)"
        />
      )}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={rx}
        fill={fill}
      />
    </g>
  );
};

interface TaskCompletionChartProps {
  data: DataPoint[];
}

export const TaskCompletionChart = React.memo(
  ({ data }: TaskCompletionChartProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [activeIdx, setActiveIdx] = React.useState<number | null>(null);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/8 hover:border-white/15"
            : "bg-white border border-gray-200 shadow-sm hover:border-gray-300"
        }`}
      >
        <div className="p-5 flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
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
                Tareas Completadas —{" "}
                <span className={`font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Últimos 6 Meses
                </span>
              </h3>
            </div>
            {/* Telemetry marker */}
            <span
              className={`text-[9px] font-mono tracking-wider ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            >
              SYS.TASK.06
            </span>
          </div>

          <div className="flex-1 min-h-70">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
                maxBarSize={44}
                barCategoryGap="18%"
                onMouseMove={(state: { activeTooltipIndex?: number } | undefined) => {
                  if (state?.activeTooltipIndex !== undefined) {
                    setActiveIdx(state.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <defs>
                  <linearGradient id="barGradDarkRoi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="barGradLightRoi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                  </linearGradient>
                  <filter id="barGlow">
                    <feGaussianBlur stdDeviation="4" />
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
                    fill: isDark ? "rgba(34,211,238,0.04)" : "rgba(59,130,246,0.04)",
                    radius: 8,
                  }}
                />
                <Bar
                  dataKey="tasks"
                  shape={(props: GlowBarProps) => (
                    <GlowBar
                      {...props}
                      fill={isDark ? "url(#barGradDarkRoi)" : "url(#barGradLightRoi)"}
                      isActive={activeIdx === props.index}
                    />
                  )}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={isDark ? "url(#barGradDarkRoi)" : "url(#barGradLightRoi)"}
                      opacity={activeIdx !== null && activeIdx !== i ? 0.4 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  },
);

TaskCompletionChart.displayName = "TaskCompletionChart";
