import { metricsApi } from "../api/metrics.api";
import { DashboardMetrics } from "../types";

export const metricsService = {
  /**
   * Obtiene el resumen del dashboard para una organización
   */

  async getDashboardOverview(orgId: string, token: string): Promise<DashboardMetrics | null> {
    try {
      return await metricsApi.getDashboardOverview(orgId, token);
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
      throw error;
    }
  },

  /**
   * Obtiene las ventas por periodo para gráficos
   */
  async getSalesByPeriod(orgId: string, token: string, period: string = "day") {
    try {
      return await metricsApi.getSalesByPeriod(orgId, token, period);
    } catch (error) {
      console.error("Error fetching sales by period:", error);
      return [];
    }
  }
};
