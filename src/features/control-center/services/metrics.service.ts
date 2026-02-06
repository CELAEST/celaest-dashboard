import { metricsApi } from "../api/metrics.api";
import { DashboardMetrics } from "../types";


export const metricsService = {
  async getHealth(): Promise<any> {
    return metricsApi.getHealth();
  },

  async getDashboardOverview(orgId: string): Promise<DashboardMetrics> {

    try {
      const metrics = await metricsApi.getDashboardMetrics(orgId);
      return metrics;
    } catch (error) {
      console.error("MetricsService.getDashboardOverview error:", error);
      throw error;
    }
  },
};
