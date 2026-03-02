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
  const { health, checkHealth } = useSystemHealth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.analytics.dashboard(orgId || "none", "day"),
    queryFn: async () => {
      if (!token || !orgId) return null;
      
      checkHealth(true);
      const { metricsService } = await import("../services/metrics.service");
      
      const [dashboardRes, salesRes] = await Promise.allSettled([
        metricsService.getDashboardOverview(orgId, token),
        metricsService.getSalesByPeriod(orgId, token, "day"),
      ]);

      let dashboard: DashboardStats | null = null;
      let salesSeries: SalesByPeriod[] = [];

      if (dashboardRes.status === "fulfilled" && dashboardRes.value) {
        const metrics = dashboardRes.value;
        dashboard = {
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
      }

      if (salesRes.status === "fulfilled" && salesRes.value) {
        salesSeries = salesRes.value;
      }

      return { dashboard, salesSeries };
    },
    enabled: isReady && !!token && !!orgId,
    staleTime: 60000,
  });

  return { 
    health, 
    dashboard: data?.dashboard || null, 
    salesSeries: data?.salesSeries || [], 
    loading: isLoading, 
    error: error ? (error instanceof Error ? error.message : String(error)) : null, 
    refresh: async () => { await refetch(); } 
  };
}
