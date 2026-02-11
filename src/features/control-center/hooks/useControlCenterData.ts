import { useCallback, useEffect } from "react";
import { useShallow } from 'zustand/react/shallow';
import { useApiAuth } from "@/lib/use-api-auth";
import { useSystemHealth } from "@/features/system/hooks/useSystemHealth";
import { useControlCenterStore } from "@/features/control-center/stores/useControlCenterStore";
import { socket } from "@/lib/socket-client";
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
  
  // Usar Zustand con useShallow para prevenir re-renders innecesarios
  const { 
    dashboard, 
    salesSeries, 
    isLoading, 
    error, 
    lastFetched,
    setData,
    setLoading,
    setError 
  } = useControlCenterStore(useShallow((state) => ({
    dashboard: state.dashboard,
    salesSeries: state.salesSeries,
    isLoading: state.isLoading,
    error: state.error,
    lastFetched: state.lastFetched,
    setData: state.setData,
    setLoading: state.setLoading,
    setError: state.setError,
  })));

  const fetchData = useCallback(async (isRefresh = false) => {
    const CACHE_TTL = 60000;
    if (!isReady || !token || !orgId) return;
    if (!isRefresh && lastFetched && (Date.now() - lastFetched < CACHE_TTL)) return;
    if (isLoading) return;

    setLoading(true);
    setError(null);

    try {
      // Disparar salud en paralelo pero usando su propio hook/logic
      checkHealth(isRefresh);

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

      setData({ dashboard, salesSeries });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, [token, orgId, isReady, lastFetched, isLoading, setData, setLoading, setError, checkHealth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time updates via WebSocket with Debounce
  useEffect(() => {
    if (!token) return;

    // Connect socket
    socket.connect(token, orgId || undefined);

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const handleRefresh = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      
      debounceTimer = setTimeout(() => {
        console.log("WebSocket event received (debounced), refreshing dashboard...");
        fetchData(true);
      }, 1000); // 1 second debounce
    };

    // Subscribe to relevant events
    const offs = [
      socket.on("order.created", handleRefresh),
      socket.on("order.updated", handleRefresh),
      socket.on("order.deleted", handleRefresh),
      socket.on("order.paid", handleRefresh),
      socket.on("user.created", handleRefresh),
      socket.on("user.updated", handleRefresh),
      socket.on("user.deleted", handleRefresh),
      socket.on("product.asset_created", handleRefresh),
      socket.on("payment.succeeded", handleRefresh),
    ];

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      offs.forEach((off) => off());
    };
  }, [token, fetchData, orgId]);


  return { 
    health, 
    dashboard, 
    salesSeries, 
    loading: isLoading, 
    error, 
    refresh: () => fetchData(true) 
  };
}



