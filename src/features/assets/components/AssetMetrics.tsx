"use client";

import React from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { StatCard } from "@/features/shared/components/StatCard";
import {
  Package,
  FileText,
  Stack,
  HardDrive,
  ChartPie as PieIcon,
  TrendUp,
} from "@phosphor-icons/react";
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
import { useAnalytics as useAnalyticsHook } from "@/features/analytics/hooks/useAnalytics";
import {
  CategoryDistribution,
  SalesByPeriod,
} from "@/features/analytics/api/analytics.api";

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
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
        className={`p-4 rounded-xl border backdrop-blur-xl ${isDark ? "bg-black/80 border-white/10" : "bg-white/90 border-gray-200 shadow-xl"}`}
      >
        <p
          className={`text-sm font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {label}
        </p>
        {payload.map((entry, index) => (
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

const ActiveTemplatesVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <motion.g
      animate={{ y: [-2, 2, -2] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <polygon points="50,75 80,60 50,45 20,60" fill="rgba(16, 185, 129, 0.1)" stroke="#34d399" strokeWidth="1" />
      <polygon points="20,60 50,75 50,90 20,75" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
      <polygon points="80,60 50,75 50,90 80,75" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
      {[0, 1, 2].map((i) => (
        <motion.polygon
          key={i}
          points={`50,${40 - i * 12} 70,${30 - i * 12} 50,${20 - i * 12} 30,${30 - i * 12}`}
          fill={i === 2 ? "rgba(52, 211, 153, 0.2)" : "rgba(16, 185, 129, 0.1)"}
          stroke="#6ee7b7"
          strokeWidth="0.8"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        />
      ))}
      <motion.line
        x1="30" y1="6" x2="70" y2="6" stroke="#a7f3d0" strokeWidth="1.5"
        animate={{ x1: [30, 50, 70, 50, 30], y1: [30, 20, 30, 40, 30], x2: [50, 70, 50, 30, 50], y2: [20, 30, 40, 30, 20] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={`spark-${i}`}
          r="1.5"
          fill="#a7f3d0"
          initial={{ cx: 50, cy: 60, opacity: 1 }}
          animate={{ cy: 10, opacity: 0, cx: 50 + (i - 1) * 15 }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
        />
      ))}
    </motion.g>
  </svg>
);

const DraftAssetsVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <defs>
      <linearGradient id="draftGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
      </linearGradient>
    </defs>
    <motion.g
      animate={{ rotateX: [0, 5, 0], rotateY: [0, -5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "50px 50px" }}
    >
      <path d="M 10 50 L 50 25 L 90 50 L 50 75 Z" fill="none" stroke="#b45309" strokeWidth="0.5" strokeDasharray="1 3" />
      <path d="M 30 37.5 L 70 62.5 M 70 37.5 L 30 62.5" stroke="#b45309" strokeWidth="0.5" strokeDasharray="1 3" />
      <motion.path
        d="M 40 45 L 60 35 L 70 50 L 50 60 Z"
        fill="rgba(251, 191, 36, 0.15)"
        stroke="#fbbf24"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.line
        x1="10" y1="10"
        stroke="url(#draftGlow)" strokeWidth="2"
        animate={{ x2: [40, 60, 70, 50, 40], y2: [45, 35, 50, 60, 45] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        r="2"
        fill="#fde68a"
        animate={{ cx: [40, 60, 70, 50, 40], cy: [45, 35, 50, 60, 45] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 4px #fbbf24)" }}
      />
      <rect x="45" y="42" width="10" height="2" fill="#fbbf24" transform="rotate(-26.5 45 42)" opacity="0.6"/>
      <rect x="48" y="46" width="14" height="2" fill="#fbbf24" transform="rotate(-26.5 48 46)" opacity="0.5"/>
    </motion.g>
  </svg>
);

const TotalLicensesVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <defs>
      <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
      </radialGradient>
      <filter id="glowBlur">
        <feGaussianBlur stdDeviation="1.5" />
      </filter>
    </defs>
    <motion.circle
      cx="50" cy="50" r="10" fill="url(#coreGlow)"
      animate={{ r: [10, 14, 10], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <circle cx="50" cy="50" r="4" fill="#93c5fd" filter="url(#glowBlur)" />

    <motion.g animate={{ rotateZ: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "50px 50px" }}>
      <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" transform="rotate(30 50 50)" />
      <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="#60a5fa" strokeWidth="0.5" transform="rotate(150 50 50)" />
      <motion.rect x="80" y="45" width="12" height="8" rx="2" fill="#93c5fd" transform="rotate(30 50 50)" />
      <motion.rect x="8" y="45" width="12" height="8" rx="2" fill="#93c5fd" transform="rotate(30 50 50)" />
    </motion.g>

    <motion.g animate={{ rotateZ: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "50px 50px" }}>
      <ellipse cx="50" cy="50" rx="45" ry="14" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="1 6" transform="rotate(90 50 50)" />
      <motion.circle cx="50" cy="5" r="3" fill="#bfdbfe" transform="rotate(90 50 50)" />
      <motion.circle cx="50" cy="95" r="3" fill="#bfdbfe" transform="rotate(90 50 50)" />
    </motion.g>
  </svg>
);

const StorageUsedVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      {[30, 50, 70].map((x, i) => (
        <g key={`blade-${i}`}>
          <polygon points={`${x},20 ${x+12},26 ${x+12},86 ${x},80`} fill="none" stroke="#7e22ce" strokeWidth="1" strokeDasharray="1 1" />
          <polygon points={`${x},20 ${x+12},26 ${x},32 ${x-12},26`} fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" strokeWidth="1" />
          <polygon points={`${x-12},26 ${x},32 ${x},92 ${x-12},86`} fill="none" stroke="#9333ea" strokeWidth="1" />
          
          <motion.polygon 
            points={`${x-10},${86-i*10} ${x-2},${90-i*10} ${x-2},90 ${x-10},86`} 
            fill="url(#storageFill)" 
            stroke="#d8b4fe"
            strokeWidth="0.5"
            animate={{ 
              points: [
                `${x-10},${86-i*10} ${x-2},${90-i*10} ${x-2},90 ${x-10},86`,
                `${x-10},${40+i*5} ${x-2},${44+i*5} ${x-2},90 ${x-10},86`,
                `${x-10},${86-i*10} ${x-2},${90-i*10} ${x-2},90 ${x-10},86`
              ] 
            }}
            transition={{ duration: 4, repeat: Infinity, delay: i*0.5, ease: "easeInOut" }}
          />
          <defs>
             <linearGradient id="storageFill" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#9333ea" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d8b4fe" stopOpacity="0.3" />
             </linearGradient>
          </defs>
          
          <motion.circle cx={`${x-6}`} cy={`${45 + i*8}`} r="1" fill="#e9d5ff" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: i*0.2 }} />
          <motion.circle cx={`${x-6}`} cy={`${55 + i*8}`} r="1" fill="#e9d5ff" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i*0.3 }} />
        </g>
      ))}

      {[30, 50, 70].map((x, i) => (
        <motion.circle
          key={`data-${i}`}
          cx={x} cy="0" r="2" fill="#f3e8ff"
          animate={{ cy: 26, opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i*0.4 }}
        />
      ))}
    </motion.g>
  </svg>
);

interface AssetMetricsProps {
  period?: string;
}

export const AssetMetrics: React.FC<AssetMetricsProps> = ({ period = "month" }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    stats,
    usage,
    salesByPeriod,
    categoryDistribution,
    isLoading,
    error,
  } = useAnalyticsHook(period);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 font-bold">
        {error}
      </div>
    );
  }

  // Map SalesByPeriod to Engagement Trends
  const chartData = [...salesByPeriod].reverse().map((item: SalesByPeriod) => ({
    name: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
    orders: item.orders,
    sales: item.sales,
  }));

  // Map CategoryDistribution to Asset Mix
  const categoryColors = [
    "#3b82f6",
    "#a855f7",
    "#10b981",
    "#f59e0b",
    "#6b7280",
  ];
  const mixData = categoryDistribution.map(
    (item: CategoryDistribution, index: number) => ({
      name: item.category || "Uncategorized",
      value: item.count,
      color: categoryColors[index % categoryColors.length],
    }),
  );

  const totalGlobal = categoryDistribution.reduce(
    (acc: number, curr: CategoryDistribution) => acc + curr.count,
    0,
  );

  return (
    <div className="flex flex-col h-full gap-4 pb-2">
      {/* Row 1: KPI Cards */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Active Templates"
          value={stats?.active_products?.toString() || "0"}
          trend={`Total: ${stats?.total_products}`}
          trendUp={true}
          icon={<Package size={24} />}
          delay={0.1}
          gradient="from-emerald-400 to-teal-500"
          visual={<ActiveTemplatesVisual />}
        />
        <StatCard
          title="Draft Assets"
          value={stats?.draft_products?.toString() || "0"}
          trend="In Review"
          trendUp={false}
          icon={<FileText size={24} />}
          delay={0.2}
          gradient="from-amber-400 to-orange-500"
          visual={<DraftAssetsVisual />}
        />
        <StatCard
          title="Total Licenses"
          value={stats?.total_licenses?.toString() || "0"}
          trend={`${stats?.active_licenses} Active`}
          trendUp={true}
          icon={<Stack size={24} />}
          delay={0.3}
          gradient="from-blue-400 to-indigo-500"
          visual={<TotalLicensesVisual />}
        />
        <StatCard
          title="Storage Used"
          value={`${usage?.storage_used_gb?.toFixed(1) || "0.0"} GB`}
          trend={`${usage?.api_requests || 0} API Calls`}
          trendUp={true}
          icon={<HardDrive size={24} />}
          delay={0.4}
          gradient="from-purple-400 to-pink-500"
          visual={<StorageUsedVisual />}
        />
      </div>

      {/* Row 2: Analytics Row */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Chart 1: Engagement Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`col-span-1 lg:col-span-2 rounded-2xl border p-5 flex flex-col ${isDark ? "bg-[#0a0a0a]/60 border-white/5 backdrop-blur-3xl shadow-xl" : "bg-white border-gray-200 shadow-sm"}`}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-[8px] border shadow-sm shrink-0 ${
                  isDark
                    ? "bg-linear-to-b from-white/[0.08] to-transparent border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]"
                    : "bg-linear-to-b from-white to-gray-50 border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]"
                }`}
              >
                <TrendUp
                  size={14}
                  className={isDark ? "text-gray-300 drop-shadow-sm" : "text-gray-600"}
                  weight="bold"
                />
              </div>
              <div className="flex flex-col">
                <h3
                  className={`text-[9px] font-black uppercase tracking-[0.3em] leading-tight ${isDark ? "text-white/40" : "text-gray-400"}`}
                >
                  Inteligencia de Activos
                </h3>
                <h2
                  className={`text-lg font-black italic tracking-tighter leading-none mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  ORDER TRENDS
                </h2>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={
                      isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                    }
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={isDark ? "#444" : "#999"}
                    fontSize={10}
                    fontWeight="900"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={isDark ? "#444" : "#999"}
                    fontSize={10}
                    fontWeight="900"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip isDark={isDark} />} />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="url(#colorOrders)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stackId="2"
                    stroke="#3b82f6"
                    fill="url(#colorSales)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                No trend data available for this period
              </div>
            )}
          </div>
        </motion.div>

        {/* Chart 2: Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`col-span-1 lg:col-span-1 rounded-2xl border p-5 flex flex-col ${isDark ? "bg-[#0a0a0a]/60 border-white/5 backdrop-blur-3xl shadow-xl" : "bg-white border-gray-200 shadow-sm"}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-[8px] border shadow-sm shrink-0 ${
                isDark
                  ? "bg-linear-to-b from-white/[0.08] to-transparent border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]"
                  : "bg-linear-to-b from-white to-gray-50 border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]"
              }`}
            >
              <PieIcon
                size={14}
                className={isDark ? "text-gray-300 drop-shadow-sm" : "text-gray-600"}
                weight="bold"
              />
            </div>
            <div className="flex flex-col">
              <h3
                className={`text-[9px] font-black uppercase tracking-[0.3em] leading-tight ${isDark ? "text-white/40" : "text-gray-400"}`}
              >
                Estructura de Catálogo
              </h3>
              <h2
                className={`text-lg font-black italic tracking-tighter leading-none mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                ASSET MIX
              </h2>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0 relative flex items-center justify-center py-4">
            {mixData.length > 0 ? (
              <>
                <div className="w-full h-full min-h-[300px] max-w-[400px] aspect-square relative flex items-center justify-center">
                  <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible drop-shadow-2xl">
                    <defs>
                      <filter id="glowMix" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <filter id="glowMixHeavy" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <radialGradient id="centerCore" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.02)"} />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                    </defs>

                    {/* HUD Targeting Crosshairs */}
                    <g opacity="0.1">
                      <line x1="200" y1="0" x2="200" y2="400" stroke={isDark ? "white" : "black"} strokeWidth="1" strokeDasharray="4 8" />
                      <line x1="0" y1="200" x2="400" y2="200" stroke={isDark ? "white" : "black"} strokeWidth="1" strokeDasharray="4 8" />
                      <circle cx="200" cy="200" r="190" fill="none" stroke={isDark ? "white" : "black"} strokeWidth="1" />
                    </g>

                    {/* Outer Radar Rotisserie (Large) */}
                    <motion.g animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "200px 200px" }}>
                      <circle cx="200" cy="200" r="180" fill="none" stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} strokeWidth="2" strokeDasharray="2 24" />
                      <circle cx="200" cy="20" r="4" fill={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"} filter="url(#glowMix)" />
                      <circle cx="200" cy="380" r="2" fill={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} />
                      <path d="M 194 18 L 206 18 L 200 24 Z" fill={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"} />
                    </motion.g>

                    {/* Secondary Rotating Ring */}
                    <motion.g animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "200px 200px" }}>
                      <circle cx="200" cy="200" r="150" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" strokeDasharray="40 20 10 20" />
                      <rect x="48" y="198" width="10" height="4" fill={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} />
                      <rect x="342" y="198" width="10" height="4" fill={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} />
                    </motion.g>

                    {/* Terciary Data Orbit */}
                    <motion.g animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "200px 200px" }}>
                      <circle cx="200" cy="200" r="130" fill="none" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="4" strokeDasharray="1 10" />
                    </motion.g>

                    {/* HUD Corner Accents */}
                    <path d="M 15 45 L 15 15 L 45 15" fill="none" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} strokeWidth="2" />
                    <path d="M 385 45 L 385 15 L 355 15" fill="none" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} strokeWidth="2" />
                    <path d="M 15 355 L 15 385 L 45 385" fill="none" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} strokeWidth="2" />
                    <path d="M 385 355 L 385 385 L 355 385" fill="none" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} strokeWidth="2" />

                    {/* Core Ambient Plate */}
                    <circle cx="200" cy="200" r="90" fill="url(#centerCore)" />
                    <line x1="200" y1="85" x2="200" y2="105" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="2" strokeLinecap="round" />
                    <line x1="200" y1="295" x2="200" y2="315" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="2" strokeLinecap="round" />
                    <line x1="85" y1="200" x2="105" y2="200" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="2" strokeLinecap="round" />
                    <line x1="295" y1="200" x2="315" y2="200" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="2" strokeLinecap="round" />

                    {/* Background Track */}
                    <circle cx="200" cy="200" r="110" fill="none" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="20" />

                    {/* Custom SVG Donut Math */}
                    <g transform="rotate(-90 200 200)">
                      {(() => {
                        const radius = 110;
                        const circumference = 2 * Math.PI * radius;
                        let offsetAccumulator = 0;

                        return mixData.map((item, i) => {
                          const ratio = (item.value / totalGlobal) || 0;
                          const arcLength = ratio * circumference;
                          const gap = mixData.length > 1 ? 10 : 0;
                          const visualLength = Math.max(0, arcLength - gap);

                          const dashArray = `${visualLength} ${circumference}`;
                          const dashOffset = -offsetAccumulator;

                          offsetAccumulator += arcLength;

                          return (
                            <motion.g key={`segment-${i}`}>
                              {/* Background heavy glow layer */}
                              <motion.circle
                                cx="200"
                                cy="200"
                                r={radius}
                                fill="none"
                                stroke={(item as { color: string }).color}
                                strokeWidth="20"
                                strokeLinecap="round"
                                strokeDasharray={dashArray}
                                filter="url(#glowMixHeavy)"
                                opacity={0.5}
                                initial={{ strokeDashoffset: 0 }}
                                animate={{ strokeDashoffset: dashOffset }}
                                transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                              />
                              {/* Foreground sharp layer */}
                              <motion.circle
                                cx="200"
                                cy="200"
                                r={radius}
                                fill="none"
                                stroke={(item as { color: string }).color}
                                strokeWidth="14"
                                strokeLinecap="round"
                                strokeDasharray={dashArray}
                                filter="url(#glowMix)"
                                initial={{ strokeDashoffset: 0, opacity: 0 }}
                                animate={{ strokeDashoffset: dashOffset, opacity: 1 }}
                                transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                              />
                            </motion.g>
                          );
                        });
                      })()}
                    </g>
                    
                    {/* Small Tech Labels */}
                    <text x="25" y="25" fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fontSize="10" fontFamily="monospace" fontWeight="bold">SYS.OP.01</text>
                    <text x="375" y="25" fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="end">ASSET MIX</text>
                    <text x="25" y="382" fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fontSize="10" fontFamily="monospace" fontWeight="bold">RX: ONLINE</text>
                    <text x="375" y="382" fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="end">v2.1.4</text>
                  </svg>

                  {/* Absolute Centered Text overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span
                      className={`text-6xl font-black italic tracking-tighter ${isDark ? "text-white" : "text-gray-900"}`}
                      style={{ textShadow: isDark ? "0 4px 20px rgba(0,0,0,0.6)" : "0 2px 8px rgba(0,0,0,0.15)" }}
                    >
                      {totalGlobal > 1000 ? `${(totalGlobal / 1000).toFixed(1)}K` : totalGlobal}
                    </span>
                    <span className={`text-[12px] font-black uppercase tracking-[0.3em] mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Global Spread
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                No category data available
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 justify-center">
            {mixData.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px] shadow-current"
                  style={{
                    backgroundColor: (item as { color: string }).color,
                    color: (item as { color: string }).color,
                  }}
                />
                <span
                  className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-white/60" : "text-gray-600"}`}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

AssetMetrics.displayName = "AssetMetrics";
