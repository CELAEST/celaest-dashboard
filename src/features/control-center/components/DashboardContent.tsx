"use client";

import React, { useState } from "react";
import {
  Activity,
  Zap,
  Server,
  Box,
  Terminal,
  Shield,
  List,
  LayoutGrid,
} from "lucide-react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { toast } from "sonner";

// Static imports
import { StatCard } from "@/features/shared/components/StatCard";
import { OrdersTable } from "@/features/billing/components/OrdersTable";
import { useApiAuth } from "@/lib/use-api-auth";
import { useControlCenterData } from "../hooks/useControlCenterData";

// Skeleton
const ChartSkeleton = () => (
  <div className="h-full w-full animate-pulse bg-gray-200/10 dark:bg-white/5 rounded-lg" />
);

// Dynamic Chart
const RevenueChart = dynamic(
  () =>
    import("@/features/analytics/components/RevenueChart").then((m) => ({
      default: m.RevenueChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

// Sparkline fallbacks when no trend data
const defaultSparkline = (v: number) =>
  Array.from({ length: 12 }, (_, i) => ({ value: v + i * 2 }));

export const DashboardContent = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<"metrics" | "feed">("metrics");
  const { orgId } = useApiAuth(); // Added orgId from useApiAuth
  const { health, dashboard, salesSeries, loading, error, refresh } =
    useControlCenterData();

  const handleRunDiagnostics = async () => {
    toast.info("Ejecutando diagnósticos...");
    await refresh();
    toast.success("Diagnósticos completados");
  };

  return (
    <div className="h-full w-full flex flex-col min-h-0 overflow-hidden p-2">
      {/* Header - Fixed */}
      <div className="shrink-0 mb-4 flex flex-col gap-4">
        {/* Top Bar */}
        <div className="flex justify-between items-end">
          <div>
            <h1
              className={`text-3xl font-black mb-1 tracking-tighter uppercase italic ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Command Center
            </h1>
            <p
              className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs font-mono flex items-center gap-3`}
            >
              <span>
                SYS_ID:{" "}
                <span className="text-cyan-400">
                  {orgId?.split("-")[0].toUpperCase() || "CX-9000"}
                </span>
              </span>
              <span className="opacity-30">|</span>
              <span className="flex items-center gap-1.5">
                STATUS:{" "}
                <span
                  className={`font-bold ${
                    health?.status === "healthy"
                      ? "text-emerald-400 animate-pulse"
                      : error
                        ? "text-red-400"
                        : "text-amber-400"
                  }`}
                >
                  {loading
                    ? "..."
                    : health?.status?.toUpperCase() ||
                      (error ? "OFFLINE" : "CONNECTING")}
                </span>
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${isDark ? "bg-[#0a0a0a] border-white/10 text-gray-400" : "bg-white border-gray-200 text-gray-600"}`}
            >
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>SECURE</span>
            </div>
            <button
              onClick={handleRunDiagnostics}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                isDark
                  ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  : "bg-white hover:bg-gray-50 text-blue-600 border-gray-200 shadow-sm"
              } disabled:opacity-50`}
            >
              <Terminal size={14} />
              {loading ? "Cargando..." : "Run Diagnostics"}
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div
          className={`flex items-center p-1 rounded-xl w-fit ${isDark ? "bg-white/5 border border-white/5" : "bg-gray-100 border border-gray-200"}`}
        >
          <button
            onClick={() => setActiveTab("metrics")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === "metrics"
                ? isDark
                  ? "bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                  : "bg-white text-purple-600 shadow-sm"
                : isDark
                  ? "text-gray-500 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutGrid size={14} />
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab("feed")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === "feed"
                ? isDark
                  ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                  : "bg-white text-blue-600 shadow-sm"
                : isDark
                  ? "text-gray-500 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List size={14} />
            Live Transactions
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          {activeTab === "metrics" ? (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full grid grid-cols-12 grid-rows-[auto_1fr] lg:grid-rows-12 gap-4 pb-2"
            >
              {/* ROW 1: KPI CARDS (Spans 3 rows on large screens) */}
              <div className="col-span-12 lg:row-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Revenue"
                  value={
                    dashboard != null
                      ? `$${(dashboard.total_revenue ?? 0).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          },
                        )}`
                      : "—"
                  }
                  trend={
                    dashboard?.revenue_growth != null
                      ? `${dashboard.revenue_growth >= 0 ? "+" : ""}${dashboard.revenue_growth.toFixed(1)}%`
                      : "—"
                  }
                  trendUp={(dashboard?.revenue_growth ?? 0) >= 0}
                  icon={<Activity size={24} />}
                  delay={0.1}
                  className="h-full"
                  chartData={defaultSparkline(dashboard?.total_revenue ?? 0)}
                />
                <StatCard
                  title="Global Orders"
                  value={
                    dashboard?.total_orders != null
                      ? dashboard.total_orders.toLocaleString()
                      : "—"
                  }
                  trend={
                    dashboard?.orders_growth != null
                      ? `${dashboard.orders_growth >= 0 ? "+" : ""}${dashboard.orders_growth.toFixed(1)}%`
                      : "—"
                  }
                  trendUp={(dashboard?.orders_growth ?? 0) >= 0}
                  icon={<Box size={24} />}
                  delay={0.2}
                  className="h-full"
                  chartData={defaultSparkline(dashboard?.total_orders ?? 0)}
                />
                <StatCard
                  title="Active Licenses"
                  value={
                    dashboard != null
                      ? `${dashboard.active_licenses ?? 0}/${dashboard.total_licenses ?? 0}`
                      : "—"
                  }
                  trend={
                    dashboard?.licenses_growth != null
                      ? `${dashboard.licenses_growth >= 0 ? "+" : ""}${dashboard.licenses_growth.toFixed(1)}%`
                      : "—"
                  }
                  trendUp={(dashboard?.licenses_growth ?? 0) >= 0}
                  icon={<Server size={24} />}
                  delay={0.3}
                  className="h-full"
                  chartData={defaultSparkline(dashboard?.active_licenses ?? 0)}
                />
                <StatCard
                  title="Active Users"
                  value={
                    dashboard != null
                      ? `${dashboard.active_users ?? 0}/${dashboard.total_users ?? 0}`
                      : "—"
                  }
                  trend={
                    dashboard?.users_growth != null
                      ? `${dashboard.users_growth >= 0 ? "+" : ""}${dashboard.users_growth.toFixed(1)}%`
                      : "—"
                  }
                  trendUp={(dashboard?.users_growth ?? 0) >= 0}
                  icon={<Zap size={24} />}
                  delay={0.4}
                  className="h-full"
                  chartData={defaultSparkline(dashboard?.active_users ?? 0)}
                />
              </div>

              {/* Chart + System */}
              <div className="col-span-12 lg:col-span-9 lg:row-span-9 min-h-[300px] lg:min-h-0 relative">
                <div
                  className={`absolute inset-0 backdrop-blur-xl border rounded-3xl p-6 flex flex-col ${isDark ? "bg-[#0a0a0a]/60 border-white/5" : "bg-white border-gray-200 shadow-sm"}`}
                >
                  <div className="flex justify-between items-center mb-4 shrink-0">
                    <div>
                      <h3
                        className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        Revenue Analytics
                      </h3>
                      <p
                        className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        REAL-TIME DATA STREAM
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-[10px] font-bold ${isDark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-600"}`}
                    >
                      LIVE
                    </div>
                  </div>
                  <div className="flex-1 w-full min-h-0 relative">
                    <div className="absolute inset-0">
                      <RevenueChart data={salesSeries} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-3 lg:row-span-9 min-h-[300px] lg:min-h-0 relative">
                <div
                  className={`absolute inset-0 backdrop-blur-xl border rounded-3xl p-6 flex flex-col ${isDark ? "bg-[#0a0a0a]/60 border-white/5" : "bg-white border-gray-200 shadow-sm"}`}
                >
                  <h3
                    className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-white" : "text-gray-900"} mb-4`}
                  >
                    System Health
                  </h3>
                  <div className="flex-1 flex flex-col justify-center space-y-8">
                    {[
                      {
                        name: "Database",
                        ok: health?.services?.database ?? false,
                        color: "#22d3ee",
                      },
                      {
                        name: "Redis Cache",
                        ok: health?.services?.redis ?? false,
                        color: "#34d399",
                      },
                      {
                        name: "Backend API",
                        ok: health?.status === "healthy",
                        color: "#a78bfa",
                      },
                    ].map((item, i) => (
                      <div key={i} className="group">
                        <div className="flex justify-between text-[10px] mb-2 uppercase font-bold tracking-wider">
                          <span
                            className={`${isDark ? "text-gray-400 group-hover:text-cyan-400" : "text-gray-500 group-hover:text-blue-600"} transition-colors`}
                          >
                            {item.name}
                          </span>
                          <span
                            className="font-mono text-xs"
                            style={{ color: item.color }}
                          >
                            {item.ok ? "OK" : "—"}
                          </span>
                        </div>
                        <div
                          className={`h-2 w-full rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                        >
                          <div
                            className="h-full rounded-full shadow-[0_0_10px_currentColor] transition-all duration-1000"
                            style={{
                              width: item.ok ? "100%" : "0%",
                              backgroundColor: item.color,
                              color: item.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className={`mt-auto pt-4 border-t border-dashed ${isDark ? "border-white/10" : "border-gray-200"}`}
                  >
                    <div className="flex justify-between text-[10px] font-mono opacity-50">
                      <span>UPTIME: {health?.uptime ?? "—"}</span>
                      <span className="text-cyan-400">
                        {health?.status === "healthy" ? "99.99%" : "0.00%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="feed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full relative flex flex-col pb-2"
            >
              <div
                className={`flex-1 relative backdrop-blur-xl border rounded-3xl overflow-hidden flex flex-col ${
                  isDark
                    ? "bg-[#0a0a0a]/60 border-white/5"
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <div
                  className={`h-12 border-b flex items-center justify-between px-6 shrink-0 ${isDark ? "border-white/5 bg-white/2" : "border-gray-100 bg-gray-50/50"}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <h3
                      className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Live Transaction Feed
                    </h3>
                  </div>
                  <div
                    className={`text-[10px] px-2 py-1 rounded border ${isDark ? "border-white/10 text-gray-500" : "border-gray-200 text-gray-400"}`}
                  >
                    AUTO-SCROLL: ON
                  </div>
                </div>

                <div className="flex-1 relative">
                  <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-0">
                    <OrdersTable />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
