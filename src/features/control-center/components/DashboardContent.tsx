"use client";

import React, { useState } from "react";
import {
  Pulse,
  Lightning,
  HardDrives,
  Cube,
  Terminal,
  Shield,
  List,
  SquaresFour,
  Database,
  CloudCheck,
  WifiHigh,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { toast } from "sonner";

// Layout primitives
import {
  PageLayout,
  PageBanner,
  PageContent,
} from "@/components/layout/PageLayout";
import { TableChrome } from "@/components/layout/TableChrome";

// Static imports
import { MetricCard, GlassPanel } from "@/components/ui/metric-tile";
import { OrdersTable } from "@/features/billing/components/OrdersTable";
import { useApiAuth } from "@/lib/use-api-auth";
import { useControlCenterData } from "../hooks/useControlCenterData";
import { useRole } from "@/features/auth/hooks/useAuthorization";

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

// ==================== SUPER ADMIN VIEW ====================
const SuperAdminDashboard = ({
  isDark,
  orgId,
  health,
  dashboard,
  salesSeries,
  loading,
  error,
  refresh,
}: {
  isDark: boolean;
  orgId: string | null;
  health: ReturnType<typeof useControlCenterData>["health"];
  dashboard: ReturnType<typeof useControlCenterData>["dashboard"];
  salesSeries: ReturnType<typeof useControlCenterData>["salesSeries"];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}) => {
  const [activeTab, setActiveTab] = useState<"metrics" | "feed">("metrics");

  const handleRunDiagnostics = async () => {
    toast.info("Ejecutando diagnósticos...");
    await refresh();
    toast.success("Diagnósticos completados");
  };

  return (
    <PageLayout>
      {/* Header */}
      <PageBanner
        title="Command Center"
        subtitle={
          orgId
            ? `SYS ${orgId.split("-")[0].toUpperCase()} · ${
                loading
                  ? "Connecting..."
                  : health?.status === "healthy"
                    ? "System Healthy"
                    : error
                      ? "Offline"
                      : "Connecting..."
              }`
            : "System Overview"
        }
        actions={
          <div className="flex items-center gap-3">
            {/* Tab Controls — inline with title */}
            <div
              className={`flex items-center p-0.5 rounded-lg ${isDark ? "bg-white/5 border border-white/5" : "bg-gray-100 border border-gray-200"}`}
            >
              <button
                onClick={() => setActiveTab("metrics")}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all duration-200 ${
                  activeTab === "metrics"
                    ? isDark
                      ? "bg-cyan-500/15 text-cyan-400"
                      : "bg-white text-blue-600 shadow-sm"
                    : isDark
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <SquaresFour size={12} />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("feed")}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all duration-200 ${
                  activeTab === "feed"
                    ? isDark
                      ? "bg-cyan-500/15 text-cyan-400"
                      : "bg-white text-blue-600 shadow-sm"
                    : isDark
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List size={12} />
                Orders
              </button>
            </div>

            <div
              className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isDark ? "bg-black/40 border border-white/10 text-gray-400" : "bg-white border border-gray-200 text-gray-600"}`}
            >
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>Secure</span>
            </div>
            <button
              onClick={handleRunDiagnostics}
              disabled={loading}
              className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all duration-200 ease-out border ${
                isDark
                  ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                  : "bg-white hover:bg-gray-50 text-blue-600 border-gray-200 shadow-sm"
              } disabled:opacity-50`}
            >
              <Terminal size={12} />
              {loading ? "Loading..." : "Run Diagnostics"}
            </button>
          </div>
        }
      />

      {/* Main Content */}
      <PageContent>
        <AnimatePresence mode="wait">
          {activeTab === "metrics" ? (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full grid grid-cols-12 grid-rows-[auto_minmax(0,1fr)] gap-2.5"
            >
              {/* KPI Row — compact crystal panels */}
              <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                <MetricCard
                  label="Total Revenue"
                  value={
                    dashboard != null
                      ? `$${(dashboard.total_revenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                      : "—"
                  }
                  delta={
                    dashboard?.revenue_growth != null
                      ? `${dashboard.revenue_growth >= 0 ? "+" : ""}${dashboard.revenue_growth.toFixed(1)}%`
                      : undefined
                  }
                  deltaUp={(dashboard?.revenue_growth ?? 0) >= 0}
                  icon={<Pulse />}
                  accent="cyan"
                />
                <MetricCard
                  label="Global Orders"
                  value={
                    dashboard?.total_orders != null
                      ? dashboard.total_orders.toLocaleString()
                      : "—"
                  }
                  delta={
                    dashboard?.orders_growth != null
                      ? `${dashboard.orders_growth >= 0 ? "+" : ""}${dashboard.orders_growth.toFixed(1)}%`
                      : undefined
                  }
                  deltaUp={(dashboard?.orders_growth ?? 0) >= 0}
                  icon={<Cube />}
                  accent="violet"
                />
                <MetricCard
                  label="Active Licenses"
                  value={
                    dashboard != null
                      ? `${dashboard.active_licenses ?? 0}/${dashboard.total_licenses ?? 0}`
                      : "—"
                  }
                  delta={
                    dashboard?.licenses_growth != null
                      ? `${dashboard.licenses_growth >= 0 ? "+" : ""}${dashboard.licenses_growth.toFixed(1)}%`
                      : undefined
                  }
                  deltaUp={(dashboard?.licenses_growth ?? 0) >= 0}
                  icon={<HardDrives />}
                  accent="emerald"
                />
                <MetricCard
                  label="Active Users"
                  value={
                    dashboard != null
                      ? `${dashboard.active_users ?? 0}/${dashboard.total_users ?? 0}`
                      : "—"
                  }
                  delta={
                    dashboard?.users_growth != null
                      ? `${dashboard.users_growth >= 0 ? "+" : ""}${dashboard.users_growth.toFixed(1)}%`
                      : undefined
                  }
                  deltaUp={(dashboard?.users_growth ?? 0) >= 0}
                  icon={<Lightning />}
                  accent="amber"
                />
              </div>

              {/* Chart — 9 cols */}
              <div className="col-span-12 lg:col-span-9 min-h-[45vh]">
                <GlassPanel accent="cyan" noPadding className="h-full">
                  <div className="p-4 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-3 shrink-0">
                    <div>
                      <h3
                        className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        Revenue Analytics
                      </h3>
                      <p className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        Real-time data stream
                      </p>
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ring-1 ring-inset ${isDark ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : "bg-emerald-50 text-emerald-600 ring-emerald-200"}`}
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
                </GlassPanel>
              </div>

              {/* System Health — 3 cols */}
              <div className="col-span-12 lg:col-span-3 min-h-[45vh]">
                <GlassPanel accent="emerald" noPadding className="h-full">
                  <div className="p-4 flex flex-col h-full gap-3">

                  {/* Header + overall status */}
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      System Health
                    </h3>
                    <div
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ring-1 ring-inset ${
                        health?.status === "healthy"
                          ? isDark
                            ? "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20"
                            : "text-emerald-600 bg-emerald-50 ring-emerald-200"
                          : isDark
                            ? "text-red-400 bg-red-500/10 ring-red-500/20"
                            : "text-red-600 bg-red-50 ring-red-200"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${health?.status === "healthy" ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                      {health?.status === "healthy" ? "Online" : "Offline"}
                    </div>
                  </div>

                  {/* Service cards */}
                  <div className="flex flex-col gap-2.5">
                    {[
                      {
                        name: "Database",
                        ok: health?.services?.database ?? false,
                        icon: <Database size={14} weight="bold" />,
                        accent: "cyan",
                      },
                      {
                        name: "Redis Cache",
                        ok: health?.services?.redis ?? false,
                        icon: <CloudCheck size={14} weight="bold" />,
                        accent: "emerald",
                      },
                      {
                        name: "Backend API",
                        ok: health?.status === "healthy",
                        icon: <WifiHigh size={14} weight="bold" />,
                        accent: "violet",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`group flex items-center gap-3 px-3 py-3 rounded-lg border transition-colors duration-200 ${
                          isDark
                            ? "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08]"
                            : "bg-gray-50/50 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isDark ? "bg-white/[0.05]" : "bg-gray-100"
                          }`}
                        >
                          <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                            {item.icon}
                          </span>
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                          >
                            {item.name}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="shrink-0">
                          {item.ok ? (
                            <CheckCircle
                              size={16}
                              weight="fill"
                              className="text-emerald-400"
                            />
                          ) : (
                            <XCircle
                              size={16}
                              weight="fill"
                              className={isDark ? "text-gray-600" : "text-gray-300"}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Business Pulse — real dashboard data */}
                  <div className="flex-1 flex flex-col gap-2">
                    <h4 className={`text-[10px] font-semibold uppercase tracking-widest ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                      Business Pulse
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Products", value: dashboard?.total_products?.toString() ?? "—" },
                        { label: "Conv. Rate", value: dashboard?.conversion_rate != null ? `${dashboard.conversion_rate.toFixed(1)}%` : "—" },
                        { label: "Avg Order", value: dashboard != null && dashboard.total_orders > 0 ? `$${(dashboard.total_revenue / dashboard.total_orders).toFixed(0)}` : "—" },
                        { label: "Period", value: dashboard?.period ?? "—" },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className={`px-2.5 py-2 rounded-lg border transition-colors duration-200 ${
                            isDark
                              ? "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]"
                              : "bg-gray-50/50 border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`block text-[9px] font-semibold uppercase tracking-widest ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                            {stat.label}
                          </span>
                          <span className={`block text-sm font-bold tabular-nums mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    className={`pt-3 border-t border-dashed ${isDark ? "border-white/[0.06]" : "border-gray-200"}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                        Uptime: {health?.uptime ?? "—"}
                      </span>
                      <span className={`text-[10px] font-bold tabular-nums ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                        {health?.status === "healthy" ? "99.99%" : "0.00%"}
                      </span>
                    </div>
                  </div>

                  </div>
                </GlassPanel>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full"
            >
              <TableChrome
                toolbar={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                      <span
                        className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        All Orders
                      </span>
                    </div>
                    <span className={`text-[11px] tabular-nums ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {dashboard?.total_orders != null ? `Showing ${dashboard.total_orders} entries` : ""}
                    </span>
                  </div>
                }
              >
                <OrdersTable hideFooter />
              </TableChrome>
            </motion.div>
          )}
        </AnimatePresence>
      </PageContent>
    </PageLayout>
  );
};

// ==================== CLIENT VIEW ====================
const ClientDashboard = ({
  isDark,
  orgId,
}: {
  isDark: boolean;
  orgId: string | null;
}) => {
  return (
    <PageLayout>
      <PageBanner
        title={orgId ? "My Orders" : "Welcome to Celaest"}
        subtitle={
          orgId
            ? "Your purchase history and active orders"
            : "Activate your account by choosing a workspace plan"
        }
      />
      <PageContent>
        <TableChrome
          toolbar={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span
                  className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Order History
                </span>
              </div>
              <span className={`text-[11px] tabular-nums ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Your purchases
              </span>
            </div>
          }
        >
          <OrdersTable hideFooter />
        </TableChrome>
      </PageContent>
    </PageLayout>
  );
};

// ==================== MAIN EXPORT ====================
export const DashboardContent = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { orgId } = useApiAuth();
  const { isSuperAdmin } = useRole();
  const { health, dashboard, salesSeries, loading, error, refresh } =
    useControlCenterData();

  if (isSuperAdmin) {
    return (
      <SuperAdminDashboard
        isDark={isDark}
        orgId={orgId}
        health={health}
        dashboard={dashboard}
        salesSeries={salesSeries}
        loading={loading}
        error={error}
        refresh={refresh}
      />
    );
  }

  return <ClientDashboard isDark={isDark} orgId={orgId} />;
};
