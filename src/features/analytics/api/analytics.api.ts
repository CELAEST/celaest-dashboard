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

  async getTasks(token: string, orgId: string, period = "month"): Promise<TaskMetrics> {
    return api.get<TaskMetrics>("/api/v1/org/analytics/tasks", {
      params: { period },
      token,
      orgId
    });
  },

  async getActiveUsers(token: string, orgId: string, period = "month"): Promise<ActiveUserStats> {
    return api.get<ActiveUserStats>("/api/v1/org/analytics/users/active", {
      params: { period },
      token,
      orgId
    });
  },

  async getUsers(token: string, orgId: string, period = "month"): Promise<UserActivity> {
    return api.get<UserActivity>("/api/v1/org/analytics/users", {
      params: { period },
      token,
      orgId
    });
  },

  async getSalesByProduct(token: string, orgId: string, period = "month"): Promise<ProductSales[]> {
    return api.get<ProductSales[]>("/api/v1/org/analytics/sales/by-product", {
      params: { period },
      token,
      orgId
    });
  },

  async getROIByProduct(token: string, orgId: string, period = "month"): Promise<ROIByProduct[]> {
    return api.get<ROIByProduct[]>("/api/v1/org/analytics/roi/by-product", {
      params: { period },
      token,
      orgId
    });
  },

  async getExport(token: string, orgId: string, format = "json"): Promise<unknown> {
    return api.get<unknown>("/api/v1/org/analytics/export", {
      params: { format },
      token,
      orgId
    });
  },
  async getLiveFeed(token: string, orgId: string): Promise<SystemEvent[]> {
    return api.get<SystemEvent[]>("/api/v1/org/analytics/live-feed", {
      token,
      orgId
    });
  },

  async getSales(token: string, orgId: string, period = "month"): Promise<SalesAnalytics> {
    return api.get<SalesAnalytics>("/api/v1/org/analytics/sales", {
      params: { period },
      token,
      orgId
    });
  },

  async getLicenseAnalytics(token: string, orgId: string, period = "month"): Promise<LicenseAnalytics> {
    return api.get<LicenseAnalytics>("/api/v1/org/analytics/licenses", {
      params: { period },
      token,
      orgId
    });
  },

  async getLicenseValidations(token: string, orgId: string, period = "month"): Promise<LicenseValidation[]> {
    return api.get<LicenseValidation[]>("/api/v1/org/analytics/licenses/validations", {
      params: { period },
      token,
      orgId
    });
  },

  async getAIUsageByProvider(token: string, orgId: string, period = "month"): Promise<AIUsageByProvider[]> {
    return api.get<AIUsageByProvider[]>("/api/v1/org/analytics/ai-usage/by-provider", {
      params: { period },
      token,
      orgId
    });
  },

  async getAICosts(token: string, orgId: string, period = "month"): Promise<AICostMetrics> {
    return api.get<AICostMetrics>("/api/v1/org/analytics/ai-usage/costs", {
      params: { period },
      token,
      orgId
    });
  },
};

export interface SystemEvent {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: string;
  source: "payment" | "user" | "system";
  user_email?: string;
}

export interface ROIByProduct {
  product_id: string;
  product_name: string;
  revenue: number;
  costs: number;
  profit: number;
  roi_percentage: number;
}

export interface UserActivity {
  total_users: number;
  active_users: number;
  new_users: number;
  churned_users: number;
  retention_rate: number;
  avg_session_time: number;
  period: string;
}

export interface TaskMetrics {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  failed_tasks: number;
  avg_completion_time_ms: number;
  success_rate: number;
}

export interface ActiveUserStats {
  daily_active_users: number;
  weekly_active_users: number;
  monthly_active_users: number;
  peak_hour: number;
  peak_day: string;
}

export interface LicenseAnalytics {
  total_licenses: number;
  active_licenses: number;
  expired_licenses: number;
  revoked_licenses: number;
  activation_rate: number;
  period: string;
}

export interface LicenseValidation {
  id: string;
  license_id: string;
  status: string;
  ip_address: string;
  validated_at: string;
}

export interface AIUsageByProvider {
  provider: string;
  requests: number;
  tokens_used: number;
  avg_latency_ms: number;
  error_rate: number;
}

export interface AICostMetrics {
  total_cost: number;
  cost_by_provider: Record<string, number>;
  cost_by_model: Record<string, number>;
  period: string;
}
