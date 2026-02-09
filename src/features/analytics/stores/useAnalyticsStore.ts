import { create } from "zustand";
import { 
  analyticsApi, 
  DashboardStats, 
  SalesByPeriod, 
  ROIMetrics,
  UsageReport,
  CategoryDistribution
} from "../api/analytics.api";

interface AnalyticsStore {
  stats: DashboardStats | null;
  salesByPeriod: SalesByPeriod[];
  roi: ROIMetrics | null;
  usage: UsageReport | null;
  categoryDistribution: CategoryDistribution[];
  eventLogs: Array<{ id: string; type: "info" | "success" | "warning" | "error"; message: string }>;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchDashboardData: (token: string, orgId: string, period?: string) => Promise<void>;
  clear: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  stats: null,
  salesByPeriod: [],
  roi: null,
  usage: null,
  categoryDistribution: [],
  eventLogs: [
    { id: "1", type: "success", message: "System core initialized." },
    { id: "2", type: "info", message: "Listening for new orders..." },
    { id: "3", type: "info", message: "Checking license validity..." },
  ],
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchDashboardData: async (token: string, orgId: string, period = "month") => {
    if (!token || !orgId) return;
    
    // Check cache
    const now = Date.now();
    const { lastFetched, isLoading } = get();
    if (!isLoading && lastFetched && (now - lastFetched < 60000)) return; // 1 min cache

    set({ isLoading: true, error: null });
    try {
      const [stats, salesByPeriod, roi, usage, categoryDistribution] = await Promise.all([
        analyticsApi.getDashboardStats(token, orgId, period),
        analyticsApi.getSalesByPeriod(token, orgId, "day"),
        analyticsApi.getROI(token, orgId, period),
        analyticsApi.getUsageReport(token, orgId, period),
        analyticsApi.getCategoryDistribution(token, orgId),
      ]);

      set({ 
        stats, 
        salesByPeriod, 
        roi, 
        usage,
        categoryDistribution,
        lastFetched: Date.now(), 
        isLoading: false 
      });
    } catch (err: unknown) {
      console.error("[AnalyticsStore] Error fetching analytics:", err);
      set({ 
        error: "Failed to load analytics data.", 
        isLoading: false 
      });
    }
  },

  clear: () => set({
    stats: null,
    salesByPeriod: [],
    roi: null,
    usage: null,
    categoryDistribution: [],
    eventLogs: [
      { id: "1", type: "success", message: "System core initialized." },
      { id: "2", type: "info", message: "Listening for new orders..." },
      { id: "3", type: "info", message: "Checking license validity..." },
    ],
    isLoading: false,
    error: null,
    lastFetched: null,
  }),
}));
