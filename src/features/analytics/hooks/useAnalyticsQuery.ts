import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export function useDashboardStats(token: string | null, orgId: string | null, period: string = "month") {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.dashboard(orgId || "", period),
    queryFn: () => analyticsApi.getDashboardStats(token!, orgId!, period),
    enabled: !!token && !!orgId,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useSalesByPeriod(token: string | null, orgId: string | null, period: string = "day") {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.sales(orgId || "", period),
    queryFn: () => analyticsApi.getSalesByPeriod(token!, orgId!, period),
    enabled: !!token && !!orgId,
    staleTime: 60 * 1000,
  });
}

export function useROIMetrics(token: string | null, orgId: string | null, period: string = "month") {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.roi(orgId || "", period),
    queryFn: () => analyticsApi.getROI(token!, orgId!, period),
    enabled: !!token && !!orgId,
    staleTime: 60 * 1000,
  });
}

export function useUsageReport(token: string | null, orgId: string | null, period: string = "month") {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.usage(orgId || "", period),
    queryFn: () => analyticsApi.getUsageReport(token!, orgId!, period),
    enabled: !!token && !!orgId,
    staleTime: 60 * 1000,
  });
}

export function useCategoryDistribution(token: string | null, orgId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.distribution(orgId || ""),
    queryFn: () => analyticsApi.getCategoryDistribution(token!, orgId!),
    enabled: !!token && !!orgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLiveFeed(token: string | null, orgId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.liveFeed(orgId || ""),
    queryFn: () => analyticsApi.getLiveFeed(token!, orgId!),
    enabled: !!token && !!orgId,
    staleTime: 10 * 1000,
    // Polling removed: Real-time via WebSockets integrated in useRealtimeDashboard
  });
}
