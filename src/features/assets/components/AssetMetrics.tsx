"use client";

import React from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { StatCard } from "@/features/shared/components/StatCard";
import {
  PackageCheck,
  FileText,
  Archive,
  Layers,
  HardDrive,
  PieChart as PieIcon,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "motion/react";

// Mock Data for Sparklines
const templatesData = [
  { value: 20 },
  { value: 22 },
  { value: 21 },
  { value: 23 },
  { value: 25 },
  { value: 24 },
  { value: 26 },
  { value: 28 },
  { value: 27 },
  { value: 30 },
];
const draftsData = [
  { value: 5 },
  { value: 6 },
  { value: 8 },
  { value: 7 },
  { value: 5 },
  { value: 4 },
  { value: 6 },
  { value: 7 },
  { value: 5 },
  { value: 4 },
];
const archivedData = [
  { value: 10 },
  { value: 10 },
  { value: 11 },
  { value: 10 },
  { value: 12 },
  { value: 12 },
  { value: 12 },
  { value: 11 },
  { value: 12 },
  { value: 12 },
];
const storageData = [
  { value: 40 },
  { value: 42 },
  { value: 45 },
  { value: 48 },
  { value: 50 },
  { value: 52 },
  { value: 55 },
  { value: 60 },
  { value: 58 },
  { value: 65 },
];

// Mock Data for Main Charts
const engagementData = [
  { name: "Mon", downloads: 120, views: 450 },
  { name: "Tue", downloads: 145, views: 520 },
  { name: "Wed", downloads: 132, views: 480 },
  { name: "Thu", downloads: 180, views: 650 },
  { name: "Fri", downloads: 210, views: 780 },
  { name: "Sat", downloads: 160, views: 590 },
  { name: "Sun", downloads: 190, views: 680 },
];

const categoryData = [
  { name: "3D Models", value: 35, color: "#3b82f6" },
  { name: "Textures", value: 25, color: "#a855f7" },
  { name: "Scripts", value: 20, color: "#10b981" },
  { name: "Audio", value: 15, color: "#f59e0b" },
  { name: "Other", value: 5, color: "#6b7280" },
];

const CustomTooltip = ({ active, payload, label, isDark }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-4 rounded-xl border backdrop-blur-xl ${isDark ? "bg-black/80 border-white/10" : "bg-white/90 border-gray-200 shadow-xl"}`}
      >
        <p
          className={`text-sm font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
              {entry.name}:
            </span>
            <span
              className={`font-mono font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const AssetMetrics: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6 pb-6">
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Templates"
          value="24"
          trend="+3 this week"
          trendUp={true}
          icon={<PackageCheck size={24} />}
          delay={0.1}
          chartData={templatesData}
          gradient="from-emerald-400 to-teal-500"
        />
        <StatCard
          title="Draft Assets"
          value="7"
          trend="In Review"
          trendUp={false}
          icon={<FileText size={24} />}
          delay={0.2}
          chartData={draftsData}
          gradient="from-amber-400 to-orange-500"
        />
        <StatCard
          title="Total Versions"
          value="68"
          trend="All Time"
          trendUp={true}
          icon={<Layers size={24} />}
          delay={0.3}
          chartData={archivedData}
          gradient="from-blue-400 to-indigo-500"
        />
        <StatCard
          title="Storage Used"
          value="2.4 GB"
          trend="5% of 50GB"
          trendUp={true}
          icon={<HardDrive size={24} />}
          delay={0.4}
          chartData={storageData}
          gradient="from-purple-400 to-pink-500"
        />
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-96">
        {/* Chart 1: Engagement Trends (2/3 width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`col-span-1 lg:col-span-2 rounded-3xl border p-6 flex flex-col ${isDark ? "bg-[#0a0a0a]/60 border-white/5 backdrop-blur-xl" : "bg-white border-gray-200 shadow-sm"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}
              >
                <TrendingUp size={20} />
              </div>
              <div>
                <h3
                  className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Engagement Analytics
                </h3>
                <p
                  className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
                >
                  Downloads & Views Performance
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={engagementData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorDownloads"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#ffffff10" : "#00000010"}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke={isDark ? "#666" : "#999"}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={isDark ? "#666" : "#999"}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="url(#colorViews)"
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="downloads"
                  stackId="2"
                  stroke="#3b82f6"
                  fill="url(#colorDownloads)"
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 2: Category Distribution (1/3 width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`col-span-1 lg:col-span-1 rounded-3xl border p-6 flex flex-col ${isDark ? "bg-[#0a0a0a]/60 border-white/5 backdrop-blur-xl" : "bg-white border-gray-200 shadow-sm"}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`p-2 rounded-lg ${isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"}`}
            >
              <PieIcon size={20} />
            </div>
            <div>
              <h3
                className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Asset Distribution
              </h3>
              <p
                className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
              >
                By Category
              </p>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span
                className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
              >
                1,240
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                Total
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.slice(0, 4).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
