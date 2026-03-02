import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponsService } from "../services/coupons.service";
import { Coupon } from "../lib/types";
import { useApiAuth } from "@/lib/use-api-auth";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

const COUPONS_QUERY_KEY = [...QUERY_KEYS.billing.all, "coupons"] as const;

/**
 * useCoupons — TanStack Query replacement for former Zustand store.
 * Provides automatic caching, deduplication, and background refresh.
 */
export const useCoupons = () => {
  const { token, orgId } = useApiAuth();
  const queryClient = useQueryClient();

  const { data: coupons = [], isLoading, error, refetch } = useQuery({
    queryKey: [...COUPONS_QUERY_KEY, orgId],
    queryFn: async () => {
      if (!token || !orgId) return [];
      const response = await couponsService.getCoupons(token, orgId);
      return Array.isArray(response) ? response : [];
    },
    enabled: !!token && !!orgId,
    staleTime: 30_000, // mirrors the old 30s cache
  });

  const deleteMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!token || !orgId) throw new Error("Missing auth");
      await couponsService.deleteCoupon(code, token, orgId);
      return code;
    },
    onMutate: async (code: string) => {
      const key = [...COUPONS_QUERY_KEY, orgId];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Coupon[]>(key);
      queryClient.setQueryData<Coupon[]>(key, old =>
        (old || []).map(c => c.code === code ? { ...c, is_active: false } : c)
      );
      return { previous, key };
    },
    onError: (_err, _code, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
    },
  });

  return {
    coupons,
    isLoading,
    error: error ? (error instanceof Error ? error.message : "Error loading coupons") : null,
    fetchCoupons: refetch,
    deleteCoupon: (code: string) => deleteMutation.mutateAsync(code),
    invalidate: () => queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEY }),
  };
};

/** @deprecated Use `useCoupons` hook instead */
export const useCouponsStore = useCoupons;
