"use client";

import React, { useState, useRef } from "react";
import {
  Terminal,
  Shield,
  List,
  SquaresFour,
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
import { OrdersTable } from "@/features/billing/components/OrdersTable";
import { useApiAuth } from "@/lib/use-api-auth";
import { useControlCenterData } from "../hooks/useControlCenterData";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import { cn } from "@/lib/utils";

import {
  DynamicRevenueCard,
  DynamicOrdersCard,
  DynamicLicensesCard,
  DynamicUsersCard,
  DynamicSystemHealth,
} from "./DynamicKpiCards";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);

  const handleRunDiagnostics = async () => {
    if (isRefreshingRef.current) return;
    
    isRefreshingRef.current = true;
    setIsRefreshing(true);
    toast.info("Ejecutando diagnósticos...");
    try {
      await refresh();
      toast.success("Diagnósticos completados");
    } finally {
      isRefreshingRef.current = false;
      setIsRefreshing(false);
    }
  };

  // Ring calculations from real data
  const licenseRing =
    dashboard && dashboard.total_licenses > 0
      ? Math.round(
          (dashboard.active_licenses / dashboard.total_licenses) * 100,
        )
      : 0;
  

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
                      ? "bg-blue-500/15 text-blue-400"
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
                      ? "bg-blue-500/15 text-blue-400"
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
              disabled={loading || isRefreshing}
              className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all duration-200 ease-out border ${
                isDark
                  ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "bg-white hover:bg-gray-50 text-blue-600 border-gray-200 shadow-sm"
              } disabled:opacity-50`}
            >
              <Terminal size={12} />
              {loading || isRefreshing ? "Loading..." : "Run Diagnostics"}
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
              className="flex flex-col gap-4 flex-1 min-h-0"
            >
              {/* ═══ TOP ROW: 4 KPI Cards (Fixed Height Grid) ═══ */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
                <DynamicRevenueCard
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
                  percent={dashboard?.conversion_rate ?? 0}
                />
                <DynamicOrdersCard
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
                />
                <DynamicLicensesCard
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
                  percent={licenseRing}
                />
                <DynamicUsersCard
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
                />
              </div>

              {/* ═══ BOTTOM ROW: Chart + System Health ═══ */}
              <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
                {/* Main Graph (Flexes to fill remaining vertical or horizontal space) */}
                <div
                  className={cn(
                    "flex-1 rounded-xl border flex flex-col min-h-0 min-w-0 overflow-hidden",
                    isDark
                      ? "bg-zinc-900/40 border-zinc-800/80"
                      : "bg-white border-gray-200",
                  )}
                >
                  <div className="p-4 flex flex-col h-full min-h-0">
                    <div className="flex justify-between items-center mb-3 shrink-0">
                      <div>
                        <h3
                          className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          Revenue Analytics
                        </h3>
                        <p
                          className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? "text-zinc-600" : "text-gray-400"}`}
                        >
                          Real-time data stream
                        </p>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          isDark
                            ? "bg-emerald-500/8 text-emerald-400"
                            : "bg-emerald-50 text-emerald-600",
                        )}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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

                {/* System Health Holographic Panel */}
                <div className="lg:w-[320px] xl:w-[350px] shrink-0 flex flex-col min-h-0">
                  <DynamicSystemHealth health={health} dashboard={dashboard} isDark={isDark} />
                </div>
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
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span
                        className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        All Orders
                      </span>
                    </div>
                    <span
                      className={`text-[11px] tabular-nums ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      {dashboard?.total_orders != null
                        ? `Showing ${dashboard.total_orders} entries`
                        : ""}
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
              <span
                className={`text-[11px] tabular-nums ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
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
