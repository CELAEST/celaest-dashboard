"use client";

import { useTheme } from "@/features/shared/hooks/useTheme";
import { useApiAuth } from "@/lib/use-api-auth";
import { 
  useDashboardStats, 
  useSalesByPeriod, 
  useROIMetrics, 
  useUsageReport, 
  useCategoryDistribution, 
  useLiveFeed 
} from "./useAnalyticsQuery";
import { useRealtimeDashboard } from "./useRealtimeDashboard";

export const useAnalytics = (period: string = "month") => {
  const { theme } = useTheme();
  const { token, orgId } = useApiAuth();
  const isDark = theme === "dark";

  // New TanStack Query based hooks
  const statsQuery = useDashboardStats(token, orgId, period);
  const salesQuery = useSalesByPeriod(token, orgId, "day");
  const roiQuery = useROIMetrics(token, orgId, period);
  const usageQuery = useUsageReport(token, orgId, period);
  const distributionQuery = useCategoryDistribution(token, orgId);
  const liveFeedQuery = useLiveFeed(token, orgId);

  // Initialize real-time synchronization
  useRealtimeDashboard();

  const isLoading = 
    statsQuery.isLoading || 
    salesQuery.isLoading || 
    roiQuery.isLoading || 
    usageQuery.isLoading || 
    distributionQuery.isLoading;

  const error = 
    statsQuery.error || 
    salesQuery.error || 
    roiQuery.error || 
    usageQuery.error || 
    distributionQuery.error;

  return {
    isDark,
    stats: statsQuery.data ?? null,
    salesByPeriod: salesQuery.data ?? [],
    roi: roiQuery.data ?? null,
    usage: usageQuery.data ?? null,
    categoryDistribution: distributionQuery.data ?? [],
    eventLogs: liveFeedQuery.data ?? [],
    isLoading,
    error: error ? "Failed to load analytics data." : null,
    refresh: () => {
      statsQuery.refetch();
      salesQuery.refetch();
      roiQuery.refetch();
      usageQuery.refetch();
      distributionQuery.refetch();
      liveFeedQuery.refetch();
    },
  };
};
