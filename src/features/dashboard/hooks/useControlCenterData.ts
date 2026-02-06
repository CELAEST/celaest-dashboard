"use client";

import { useState, useEffect, useCallback } from "react";
// import { controlCenterAdapter } from "../adapter"; // DELETED
import { useApiAuth } from "@/lib/use-api-auth";
import type { HealthResponse, DashboardStats } from "../types";

interface ControlCenterData {
  health: HealthResponse | null;
  dashboard: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useControlCenterData(): ControlCenterData {
  const { token, orgId, isReady } = useApiAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);

    try {
      const { metricsService } = await import("@/features/control-center/services/metrics.service");
      
      const [healthRes, dashboardRes] = await Promise.allSettled([
        metricsService.getHealth(),
        isReady && token && orgId
          ? metricsService.getDashboardOverview(orgId)
          : Promise.resolve(null),
      ]);

      setHealth(healthRes.status === "fulfilled" ? healthRes.value : null);

      if (dashboardRes.status === "fulfilled" && dashboardRes.value) {
        // Mapear los datos de DashboardMetrics (nuevo) a DashboardStats (legacy) si es necesario
        // O actualizar types.ts para que coincidan. Por ahora, asumimos coincidencia.
        setDashboard(dashboardRes.value as any);
      } else {
        setDashboard(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, [token, orgId, isReady]);


  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return { health, dashboard, loading, error, refresh: fetchData };
}
