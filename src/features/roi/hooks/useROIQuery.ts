import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/features/analytics/api/analytics.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export function useROIQuery(token: string, orgId: string, period: string) {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.roi(orgId, period),
    queryFn: () => analyticsApi.getROI(token, orgId, period),
    enabled: !!token && !!orgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useROIByProductQuery(token: string, orgId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.roiByProduct(orgId),
    queryFn: () => analyticsApi.getROIByProduct(token, orgId),
    enabled: !!token && !!orgId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSalesByPeriodQuery(token: string, orgId: string, period: string) {
  const salesPeriod = period === "week" ? "day" : period === "month" ? "day" : "month";
  return useQuery({
    queryKey: QUERY_KEYS.analytics.salesByPeriod(orgId, salesPeriod),
    queryFn: () => analyticsApi.getSalesByPeriod(token, orgId, salesPeriod),
    enabled: !!token && !!orgId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTasksQuery(token: string, orgId: string, period: string) {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.tasks(orgId, period),
    queryFn: () => analyticsApi.getTasks(token, orgId, period),
    enabled: !!token && !!orgId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useActiveUsersQuery(token: string, orgId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.activeUsers(orgId),
    queryFn: () => analyticsApi.getActiveUsers(token, orgId),
    enabled: !!token && !!orgId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUsersQuery(token: string, orgId: string, period: string) {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.usersActivity(orgId, period),
    queryFn: () => analyticsApi.getUsers(token, orgId, period),
    enabled: !!token && !!orgId,
    staleTime: 5 * 60 * 1000,
  });
}
