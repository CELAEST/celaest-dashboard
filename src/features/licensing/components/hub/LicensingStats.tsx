import React from "react";
import {
  Shield,
  CheckCircle2,
  Clock,
  Activity,
  Ban,
  Pause,
  XCircle,
  TrendingUp,
  Zap,
  Lock,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { motion } from "motion/react";
import { LicenseStats } from "@/features/licensing/types";

interface LicensingStatsProps {
  analytics: LicenseStats | null;
}

// Status config
const STATUS_CONFIG = [
  {
    key: "active",
    label: "Active",
    icon: CheckCircle2,
    color: "#10b981",
    bg: "from-emerald-500/20 to-teal-500/10",
  },
  {
    key: "trial",
    label: "Trial",
    icon: Activity,
    color: "#a855f7",
    bg: "from-purple-500/20 to-violet-500/10",
  },
  {
    key: "expired",
    label: "Expired",
    icon: Clock,
    color: "#f97316",
    bg: "from-orange-500/20 to-amber-500/10",
  },
  {
    key: "suspended",
    label: "Suspended",
    icon: Pause,
    color: "#eab308",
    bg: "from-yellow-500/20 to-amber-500/10",
  },
  {
    key: "revoked",
    label: "Revoked",
    icon: Ban,
    color: "#ef4444",
    bg: "from-red-500/20 to-rose-500/10",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "#6b7280",
    bg: "from-gray-500/20 to-slate-500/10",
  },
] as const;

// Progress bar for status breakdown
const StatusBar: React.FC<{
  label: string;
  value: number;
  total: number;
  color: string;
  icon: React.ElementType;
  index: number;
  isDark: boolean;
}> = ({ label, value, total, color, icon: Icon, index, isDark }) => {
  const pct = total > 0 ? (value / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
      className="flex items-center gap-4"
    >
      <div className="flex items-center gap-2.5 w-28 shrink-0">
        <Icon size={14} style={{ color }} />
        <span
          className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          {label}
        </span>
      </div>
      <div
        className={`flex-1 h-2.5 rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-gray-100"}`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{
            delay: 0.5 + index * 0.08,
            duration: 0.8,
            ease: "easeOut",
          }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}40` }}
        />
      </div>
      <div className="flex items-center gap-1.5 w-16 justify-end shrink-0">
        <span
          className={`text-sm font-black tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {value}
        </span>
        <span
          className={`text-[10px] font-medium ${isDark ? "text-gray-600" : "text-gray-400"}`}
        >
          ({pct.toFixed(0)}%)
        </span>
      </div>
    </motion.div>
  );
};

// Donut chart component
const DonutChart: React.FC<{
  data: { value: number; color: string; label: string }[];
  total: number;
  isDark: boolean;
}> = ({ data, total, isDark }) => {
  const radius = 58;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Pre-compute offsets for each segment
  const segments = data.reduce<
    {
      value: number;
      color: string;
      label: string;
      dashLength: number;
      offset: number;
    }[]
  >((acc, seg) => {
    const pct = total > 0 ? seg.value / total : 0;
    const dashLength = pct * circumference;
    const prevEnd =
      acc.length > 0
        ? acc[acc.length - 1].offset + acc[acc.length - 1].dashLength
        : 0;
    acc.push({ ...seg, dashLength, offset: prevEnd });
    return acc;
  }, []);

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        {/* Background circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
          strokeWidth={strokeWidth}
        />
        {/* Data segments */}
        {segments.map((segment, i) => {
          if (segment.value === 0) return null;

          return (
            <motion.circle
              key={segment.label}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segment.dashLength} ${circumference - segment.dashLength}`}
              strokeDashoffset={-segment.offset}
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
              style={{ filter: `drop-shadow(0 0 4px ${segment.color}50)` }}
            />
          );
        })}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className={`text-3xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {total}
        </motion.span>
        <span
          className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          Total
        </span>
      </div>
    </div>
  );
};

export const LicensingStats: React.FC<LicensingStatsProps> = ({
  analytics,
}) => {
  const { isDark } = useTheme();

  if (!analytics) {
    return (
      <div
        className={`flex items-center justify-center h-64 rounded-3xl border ${isDark ? "bg-black/40 border-white/5" : "bg-white border-gray-100"}`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p
            className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  // Metric cards for the top row
  const metricCards = [
    {
      label: "Total Licenses",
      value: analytics.total,
      icon: Shield,
      color: "#06b6d4",
      gradient: "from-cyan-500/15 via-cyan-500/5 to-transparent",
      accent: "shadow-cyan-500/10",
    },
    {
      label: "Active",
      value: analytics.active,
      icon: CheckCircle2,
      color: "#10b981",
      gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
      accent: "shadow-emerald-500/10",
    },
    {
      label: "Utilization Rate",
      value:
        analytics.total > 0
          ? Math.round((analytics.active / analytics.total) * 100)
          : 0,
      suffix: "%",
      icon: TrendingUp,
      color: "#8b5cf6",
      gradient: "from-violet-500/15 via-violet-500/5 to-transparent",
      accent: "shadow-violet-500/10",
    },
    {
      label: "At Risk",
      value: analytics.expired + analytics.suspended,
      icon: Zap,
      color: "#f59e0b",
      gradient: "from-amber-500/15 via-amber-500/5 to-transparent",
      accent: "shadow-amber-500/10",
      alert: analytics.expired + analytics.suspended > 0,
    },
  ];

  const donutData = STATUS_CONFIG.map((s) => ({
    value: analytics[s.key as keyof LicenseStats] as number,
    color: s.color,
    label: s.label,
  }));

  return (
    <div className="space-y-6 px-1 pb-4">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className={`group relative p-5 rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] ${card.accent} ${
              isDark
                ? "bg-black/50 border-white/5 hover:border-white/10 hover:shadow-lg"
                : "bg-white border-gray-100 shadow-sm hover:shadow-lg"
            }`}
          >
            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 bg-linear-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}
                >
                  <card.icon size={18} style={{ color: card.color }} />
                </div>
                {card.alert && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 rounded-full bg-amber-500"
                  />
                )}
              </div>
              <p
                className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {card.label}
              </p>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl font-black tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {card.value}
                </span>
                {"suffix" in card && (
                  <span
                    className={`text-sm font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {card.suffix}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown with Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`lg:col-span-2 p-6 rounded-2xl border ${
            isDark
              ? "bg-black/50 border-white/5"
              : "bg-white border-gray-100 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3
              size={16}
              className={isDark ? "text-cyan-400" : "text-blue-600"}
            />
            <h3
              className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Status Breakdown
            </h3>
          </div>

          <div className="space-y-4">
            {STATUS_CONFIG.map((status, index) => (
              <StatusBar
                key={status.key}
                label={status.label}
                value={analytics[status.key as keyof LicenseStats] as number}
                total={analytics.total}
                color={status.color}
                icon={status.icon}
                index={index}
                isDark={isDark}
              />
            ))}
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl border ${
            isDark
              ? "bg-black/50 border-white/5"
              : "bg-white border-gray-100 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChart
              size={16}
              className={isDark ? "text-purple-400" : "text-purple-600"}
            />
            <h3
              className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Distribution
            </h3>
          </div>

          <DonutChart
            data={donutData}
            total={analytics.total}
            isDark={isDark}
          />

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-6">
            {STATUS_CONFIG.filter(
              (s) => (analytics[s.key as keyof LicenseStats] as number) > 0,
            ).map((status) => (
              <div key={status.key} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {status.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-5 rounded-2xl border ${isDark ? "bg-black/50 border-white/5" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Lock size={14} className="text-emerald-400" />
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Health Score
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-black ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
            >
              {analytics.total > 0
                ? Math.round(
                    ((analytics.active + analytics.trial) / analytics.total) *
                      100,
                  )
                : 0}
              %
            </span>
            <span
              className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              healthy
            </span>
          </div>
          <p
            className={`text-xs mt-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
          >
            Active + Trial licenses
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className={`p-5 rounded-2xl border ${isDark ? "bg-black/50 border-white/5" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-violet-400" />
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Trial Conversion
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-black ${isDark ? "text-violet-400" : "text-violet-600"}`}
            >
              {analytics.trial}
            </span>
            <span
              className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              pending
            </span>
          </div>
          <p
            className={`text-xs mt-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
          >
            Trials awaiting conversion
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-5 rounded-2xl border ${isDark ? "bg-black/50 border-white/5" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-amber-400" />
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Action Needed
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-black ${
                analytics.expired + analytics.suspended > 0
                  ? isDark
                    ? "text-amber-400"
                    : "text-amber-600"
                  : isDark
                    ? "text-gray-500"
                    : "text-gray-400"
              }`}
            >
              {analytics.expired + analytics.suspended}
            </span>
            <span
              className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              licenses
            </span>
          </div>
          <p
            className={`text-xs mt-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
          >
            Expired + Suspended keys
          </p>
        </motion.div>
      </div>
    </div>
  );
};
