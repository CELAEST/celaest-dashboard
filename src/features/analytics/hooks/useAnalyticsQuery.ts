import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export function useDashboardStats(token: string | null, orgId: string | null, period: string = "month") {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.dashboard(orgId || "", period),
    queryFn: () => analyticsApi.getDashboardStats(token!, orgId!, period),
    enabled: !!token && !!orgId,
    staleTime: 60 * 1000, // 1 minute
    // WebSocket invalidations drive updates — don't blindly refetch on every remount.
    // Only refetch on mount if the data is actually stale (covered by staleTime).
    refetchOnMount: true,
  });
}

export function useSalesByPeriod(token: string | null, orgId: string | null, period: string = "day") {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.sales(orgId || "", period),
    queryFn: () => analyticsApi.getSalesByPeriod(token!, orgId!, period),
    enabled: !!token && !!orgId,
    staleTime: 5 * 60 * 1000, // 5 min — sales chart updates less frequently
    refetchOnMount: true,
  });
}

export function useROIMetrics(token: string | null, orgId: string | null, period: string = "month") {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.roi(orgId || "", period),
    queryFn: () => analyticsApi.getROI(token!, orgId!, period),
    enabled: !!token && !!orgId,
    staleTime: 60 * 1000,
    refetchOnMount: true,
  });
}

export function useUsageReport(token: string | null, orgId: string | null, period: string = "month") {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.usage(orgId || "", period),
    queryFn: () => analyticsApi.getUsageReport(token!, orgId!, period),
    enabled: !!token && !!orgId,
    staleTime: 60 * 1000,
    refetchOnMount: true,
  });
}

export function useCategoryDistribution(token: string | null, orgId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.distribution(orgId || ""),
    queryFn: () => analyticsApi.getCategoryDistribution(token!, orgId!),
    enabled: !!token && !!orgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
  });
}

export function useLiveFeed(token: string | null, orgId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.liveFeed(orgId || ""),
    queryFn: () => analyticsApi.getLiveFeed(token!, orgId!),
    enabled: !!token && !!orgId,
    // Real-time updates come through WebSocket (useRealtimeDashboard).
    // Do NOT poll: staleTime Infinity means this query only re-fetches when
    // explicitly invalidated via queryClient.invalidateQueries().
    staleTime: Infinity,
    refetchOnMount: true,
  });
}
