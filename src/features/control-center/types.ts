export interface DashboardMetrics {
  total_revenue: number;
  revenue_growth: number;
  active_users: number;
  users_growth?: number; // Backend doesn't send this yet, optional
  total_users: number;
  total_orders: number;
  orders_growth: number;
  active_licenses: number;
  total_licenses: number;
  total_products: number;
  licenses_growth?: number; // Backend doesn't send this
  revenue_by_month?: {
    month: string;
    amount: number;
  }[];
  recent_transactions?: {
    id: string;
    amount: number;
    status: string;
    customer: string;
    date: string;
  }[];
  period: string;
  period_start: string;
  period_end: string;
  conversion_rate: number;
}


export interface HealthResponse {
  status: string;
  services?: {
    database?: boolean;
    redis?: boolean;
  };
}

// Alias for backward compatibility or refactor preference
export type DashboardStats = DashboardMetrics;


export interface SalesByPeriod {
  period: string;
  date: string;
  sales: number;
  orders: number;
}

