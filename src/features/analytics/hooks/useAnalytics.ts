"use client";

import { useEffect } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useAnalyticsStore } from "../stores/useAnalyticsStore";
import { useApiAuth } from "@/lib/use-api-auth";

export const useAnalytics = (period: string = "month") => {
  const { theme } = useTheme();
  const { token, orgId, isAuthReady } = useApiAuth();
  const isDark = theme === "dark";

  const {
    stats,
    salesByPeriod,
    roi,
    usage,
    categoryDistribution,
    eventLogs,
    isLoading,
    error,
    fetchDashboardData
  } = useAnalyticsStore();

  useEffect(() => {
    if (isAuthReady && token && orgId) {
      fetchDashboardData(token, orgId, period);
    }
  }, [isAuthReady, token, orgId, fetchDashboardData, period]);

  return {
    isDark,
    stats,
    salesByPeriod,
    roi,
    usage,
    categoryDistribution,
    eventLogs,
    isLoading,
    error,
    refresh: () => token && orgId && fetchDashboardData(token, orgId),
  };
};
