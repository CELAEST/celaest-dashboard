import { api } from "@/lib/api-client";
import { DashboardMetrics, SalesByPeriod } from "../types";

export const metricsApi = {
  getDashboardOverview: (orgId: string, token: string) =>
    api.get<DashboardMetrics>(`/api/v1/org/analytics/dashboard`, { orgId, token }),


  getSalesByPeriod: (orgId: string, token: string, period: string = "day") =>
    api.get<SalesByPeriod[]>(`/api/v1/org/analytics/sales/by-period?period=${period}`, { orgId, token }),
};



