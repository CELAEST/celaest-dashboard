/**
 * Control Center - REST Adapter
 * Consume endpoints de celaest-back sin modificar contratos
 */

import { api } from "@/lib/api-client";
import type { HealthResponse, DashboardStats, ApiSuccess } from "./types";

export const controlCenterAdapter = {
  getHealth: () => api.get<HealthResponse>("/health"),

  getDashboard: (params: { token: string; orgId: string; period?: string }) =>
    api.get<ApiSuccess<DashboardStats>>("/api/v1/org/analytics/dashboard", {
      token: params.token,
      orgId: params.orgId,
      params: { period: params.period || "month" },
    }),
};
