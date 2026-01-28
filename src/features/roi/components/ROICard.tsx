import React from "react";
import { motion } from "motion/react";
import { DollarSign, Clock, Zap } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

const mockTrendData = [
  { name: "Mon", value: 30 },
  { name: "Tue", value: 45 },
  { name: "Wed", value: 35 },
  { name: "Thu", value: 55 },
  { name: "Fri", value: 45 },
  { name: "Sat", value: 65 },
  { name: "Sun", value: 60 },
  { name: "Mon2", value: 75 },
  { name: "Tue2", value: 65 },
  { name: "Wed2", value: 85 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  isDark: boolean;
}

const CustomTooltip = ({ active, payload, isDark }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`px-3 py-2 rounded-lg text-xs font-bold border ${
          isDark
            ? "bg-[#09090b]/90 border-white/10 text-white backdrop-blur-md"
            : "bg-white/90 border-gray-100 text-gray-900 shadow-xl"
        }`}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-cyan-400" fill="currentColor" />
          <span>Efficiency: {payload[0].value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export const ROICard = React.memo(() => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`lg:col-span-2 h-full rounded-3xl overflow-hidden p-4 grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_1fr] gap-3 transition-all duration-500 hover:shadow-2xl ${
        isDark
          ? "bg-[#09090b] border border-white/10"
          : "bg-white border border-gray-100 shadow-xl"
      }`}
    >
      {/* TILE 1: TIME SAVED (Top Left) */}
      <div
        className={`rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group ${
          isDark
            ? "bg-white/2 border border-white/5 hover:bg-white/4"
            : "bg-gray-50/50 border border-gray-100 hover:bg-gray-50"
        }`}
      >
        <div className="flex items-start justify-between z-10">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isDark
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                : "bg-purple-600 text-white shadow-md shadow-purple-500/20"
            }`}
          >
            <Clock className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div
            className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border ${
              isDark
                ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            +12% vs last
          </div>
        </div>
        <div className="relative z-10 mt-4">
          <div
            className={`text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Total Time Saved
          </div>
          <div
            className={`text-3xl lg:text-4xl font-black tracking-tighter tabular-nums transition-all duration-300 ${
              isDark ? "text-white group-hover:text-purple-50" : "text-gray-900"
            }`}
          >
            1,240<span className="text-xl ml-1 opacity-50">hrs</span>
          </div>
        </div>
      </div>

      {/* TILE 2: EST REVENUE (Top Right) */}
      <div
        className={`rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group ${
          isDark
            ? "bg-white/2 border border-white/5 hover:bg-white/4"
            : "bg-gray-50/50 border border-gray-100 hover:bg-gray-50"
        }`}
      >
        <div className="flex items-start justify-between z-10">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isDark
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
            }`}
          >
            <DollarSign className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div
            className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border ${
              isDark
                ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            +45% proj.
          </div>
        </div>
        <div className="relative z-10 mt-4">
          <div
            className={`text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Est. Revenue Generated
          </div>
          <div
            className={`text-3xl lg:text-4xl font-black tracking-tighter tabular-nums transition-all duration-300 ${
              isDark
                ? "text-white group-hover:text-emerald-50"
                : "text-gray-900"
            }`}
          >
            $842.5<span className="text-xl ml-1 opacity-50">k</span>
          </div>
        </div>
      </div>

      {/* TILE 3: EFFICIENCY TREND (Bottom - Wide) */}
      <div
        className={`col-span-1 md:col-span-2 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px] group ${
          isDark
            ? "bg-linear-to-br from-cyan-500/5 to-blue-500/5 border border-white/5"
            : "bg-linear-to-br from-blue-50/50 to-indigo-50/50 border border-gray-100"
        }`}
      >
        {/* TOP: Labels Content (Moved Up) */}
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <div
              className={`text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Efficiency Trend
            </div>
            <div
              className={`text-3xl font-black tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              +24.8%
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl backdrop-blur-md transition-transform duration-300 group-hover:rotate-12 ${
              isDark
                ? "bg-white/10 text-white"
                : "bg-white/60 text-gray-900 shadow-sm"
            }`}
          >
            <Zap className="w-5 h-5 fill-current" />
          </div>
        </div>

        {/* BOTTOM: RECHARTS Graph (Fills remaining lower space) */}
        <div className="absolute inset-x-0 bottom-0 h-[65%] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData}>
              {/* Gradients */}
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isDark ? "#22d3ee" : "#3b82f6"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={isDark ? "#22d3ee" : "#3b82f6"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Tooltip
                content={<CustomTooltip isDark={isDark} />}
                cursor={{
                  stroke: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                  strokeWidth: 2,
                  strokeDasharray: "4 4",
                }}
              />
              <XAxis dataKey="name" hide />
              <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={isDark ? "#22d3ee" : "#3b82f6"}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
});

ROICard.displayName = "ROICard";
