/**
 * Control Center - Tipos alineados con celaest-back
 */

export interface HealthResponse {
  status: string;
  services?: {
    database?: boolean;
    redis?: boolean;
  };
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_licenses: number;
  active_licenses: number;
  total_users: number;
  active_users: number;
  total_products: number;
  conversion_rate: number;
  revenue_growth: number;
  period: string;
  period_start?: string;
  period_end?: string;
}

export interface ApiSuccess<T> {
  success: boolean;
  data: T;
}
