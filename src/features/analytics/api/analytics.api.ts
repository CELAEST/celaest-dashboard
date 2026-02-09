import { api } from "@/lib/api-client";

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_licenses: number;
  active_licenses: number;
  total_users: number;
  active_users: number;
  total_products: number;
  active_products: number;
  draft_products: number;
  conversion_rate: number;
  revenue_growth: number;
  period: string;
  period_start: string;
  period_end: string;
}

export interface SalesByPeriod {
  period: string;
  date: string;
  sales: number;
  orders: number;
}

export interface ProductSales {
  product_id: string;
  product_name: string;
  total_sales: number;
  units_sold: number;
}

export interface SalesAnalytics {
  total_sales: number;
  order_count: number;
  average_order_value: number;
  top_products: ProductSales[];
  sales_by_status: Record<string, number>;
  period: string;
}

export interface ROIMetrics {
  total_revenue: number;
  total_costs: number;
  net_profit: number;
  roi_percentage: number;
  customer_ltv: number;
  cac: number;
  period: string;
}

export interface UsageReport {
  api_requests: number;
  storage_used_gb: number;
  bandwidth_used_gb: number;
  ai_requests_used: number;
  unique_visitors: number;
  period: string;
}

export interface CategoryDistribution {
  category: string;
  count: number;
}

export const analyticsApi = {
  async getDashboardStats(token: string, orgId: string, period = "month"): Promise<DashboardStats> {
    return api.get<DashboardStats>("/api/v1/org/analytics/dashboard", {
      params: { period },
      token,
      orgId
    });
  },

  async getSalesByPeriod(token: string, orgId: string, period = "day"): Promise<SalesByPeriod[]> {
    return api.get<SalesByPeriod[]>("/api/v1/org/analytics/sales/by-period", {
      params: { period },
      token,
      orgId
    });
  },

  async getROI(token: string, orgId: string, period = "month"): Promise<ROIMetrics> {
    return api.get<ROIMetrics>("/api/v1/org/analytics/roi", {
      params: { period },
      token,
      orgId
    });
  },

  async getUsageReport(token: string, orgId: string, period = "month"): Promise<UsageReport> {
    return api.get<UsageReport>("/api/v1/org/analytics/usage", {
      params: { period },
      token,
      orgId
    });
  },

  async getCategoryDistribution(token: string, orgId: string): Promise<CategoryDistribution[]> {
    return api.get<CategoryDistribution[]>("/api/v1/org/analytics/category-distribution", {
      token,
      orgId
    });
  },
};
