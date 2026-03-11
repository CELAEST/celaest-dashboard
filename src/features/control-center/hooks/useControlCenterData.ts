import { useQuery } from "@tanstack/react-query";
import { useApiAuth } from "@/lib/use-api-auth";
import { useSystemHealth } from "@/features/system/hooks/useSystemHealth";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import type { HealthResponse, DashboardStats } from "../types";
import { SalesByPeriod } from "../types";

interface ControlCenterData {
  health: HealthResponse | null;
  dashboard: DashboardStats | null;
  salesSeries: SalesByPeriod[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useControlCenterData(): ControlCenterData {
  const { token, orgId, isReady } = useApiAuth();
  const { health } = useSystemHealth();

  // ── Query 1: Dashboard statistics (KPI cards) ─────────────────────────────
  // Key: ["analytics","dashboard",...] — invalidated when order/license counts change.
  // Fetches ONLY the dashboard stats endpoint — NOT the sales series.
  // The old single-queryFn bundled both calls with Promise.allSettled, meaning any
  // ["analytics","dashboard"] invalidation would also fire a /by-period refetch.
  const dashboardQuery = useQuery({
    queryKey: QUERY_KEYS.analytics.dashboard(orgId || "none", "day"),
    queryFn: async (): Promise<DashboardStats | null> => {
      if (!token || !orgId) return null;
      const { metricsService } = await import("../services/metrics.service");
      const metrics = await metricsService.getDashboardOverview(orgId, token);
      if (!metrics) return null;
      return {
        total_revenue: metrics.total_revenue,
        revenue_growth: metrics.revenue_growth,
        active_users: metrics.active_users,
        total_users: metrics.total_users,
        users_growth: metrics.users_growth,
        total_orders: metrics.total_orders,
        orders_growth: metrics.orders_growth,
        active_licenses: metrics.active_licenses,
        total_licenses: metrics.total_licenses,
        licenses_growth: metrics.licenses_growth,
        total_products: metrics.total_products,
        conversion_rate: metrics.conversion_rate,
        period: metrics.period || "Ultimos 30 días",
        period_start: metrics.period_start || "",
        period_end: metrics.period_end || "",
      };
    },
    enabled: isReady && !!token && !!orgId,
    staleTime: 60_000,
  });

  // ── Query 2: Sales series (Revenue chart) ──────────────────────────────────
  // Separate key: ["analytics","sales",...] — NOT hit by ["analytics","dashboard"] invalidations.
  // Revenue chart data changes less frequently → longer staleTime (5 min).
  const salesQuery = useQuery({
    queryKey: QUERY_KEYS.analytics.sales(orgId || "none", "day"),
    queryFn: async (): Promise<SalesByPeriod[]> => {
      if (!token || !orgId) return [];
      const { metricsService } = await import("../services/metrics.service");
      const result = await metricsService.getSalesByPeriod(orgId, token, "day");
      return result ?? [];
    },
    enabled: isReady && !!token && !!orgId,
    staleTime: 5 * 60_000,
  });

  return {
    health,
    dashboard: dashboardQuery.data ?? null,
    salesSeries: salesQuery.data ?? [],
    loading: dashboardQuery.isLoading || salesQuery.isLoading,
    error: dashboardQuery.error
      ? dashboardQuery.error instanceof Error
        ? dashboardQuery.error.message
        : String(dashboardQuery.error)
      : null,
    refresh: async () => {
      await Promise.all([dashboardQuery.refetch(), salesQuery.refetch()]);
    },
  };
}
