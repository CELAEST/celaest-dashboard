import { logger } from "@/lib/logger";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "../api/billing.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { toast } from "sonner";

export const useAdminStatsQuery = (token: string | null) => {
// ... existing ...
  return useQuery({
    queryKey: QUERY_KEYS.billing.adminStats,
    queryFn: () => billingApi.getAdminStats(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTaxRatesQuery = (token: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.billing.taxRates,
    queryFn: () => billingApi.getAdminTaxRates(token!),
    enabled: !!token,
  });
};

export const useTransactionQuery = (token: string | null, page: number, limit: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.billing.transactions(page, limit),
    queryFn: () => billingApi.getAdminTransactions(token!, page, limit),
    enabled: !!token,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAlertsQuery = (token: string | null, status: "failed" | "refund_requested") => {
  return useQuery({
    queryKey: QUERY_KEYS.billing.alerts(status),
    queryFn: () => billingApi.getAdminAlerts(token!, status),
    enabled: !!token,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

export const useResolveRefundMutation = (token: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approve }: { id: string; approve: boolean }) =>
      billingApi.resolveAdminRefund(token!, id, approve),
    onSuccess: (_, { approve }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.alerts("refund_requested") });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.adminStats });
      toast.success(approve ? "Refund approved" : "Refund declined");
    },
    onError: (err) => {
      logger.error("Failed to resolve refund:", err);
      toast.error("Failed to resolve refund");
    },
  });
};
