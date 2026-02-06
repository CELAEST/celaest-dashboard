import { api } from "@/lib/api-client";
import { DashboardMetrics } from "../types";


export const metricsApi = {
  getHealth: () => api.get<any>("/health"),
  getDashboardMetrics: (orgId: string) =>
    api.get<DashboardMetrics>("/api/v1/org/analytics/dashboard", { orgId }),
};

