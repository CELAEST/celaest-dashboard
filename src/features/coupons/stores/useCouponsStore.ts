import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { couponsApi, CouponPageResponse } from "../api/coupons.api";
import { useApiAuth } from "@/lib/use-api-auth";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { useMemo } from "react";

const COUPONS_QUERY_KEY = [...QUERY_KEYS.billing.all, "coupons"] as const;
const COUPON_PAGE_SIZE = 15;

/**
 * useCoupons — TanStack Query infinite scroll hook for coupons.
 */
export const useCoupons = () => {
  const { token, orgId } = useApiAuth();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<CouponPageResponse>({
    queryKey: [...COUPONS_QUERY_KEY, orgId],
    queryFn: async ({ pageParam }) => {
      if (!token || !orgId) {
        return {
          success: true,
          data: [],
          meta: { page: pageParam as number, per_page: COUPON_PAGE_SIZE, total: 0, total_pages: 0 },
        };
      }
      return couponsApi.getCouponsPaginated(token, orgId, pageParam as number, COUPON_PAGE_SIZE);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined;
      return lastPage.meta.page < lastPage.meta.total_pages
        ? lastPage.meta.page + 1
        : undefined;
    },
    enabled: !!token && !!orgId,
    staleTime: 30_000,
  });

  const coupons = useMemo(
    () => data?.pages.flatMap((p) => p.data ?? []) ?? [],
    [data],
  );
  const totalCoupons = data?.pages[0]?.meta?.total ?? 0;

  const deleteMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!token || !orgId) throw new Error("Missing auth");
      await couponsApi.deleteCoupon(code, token, orgId);
      return code;
    },
    onMutate: async (code: string) => {
      const key = [...COUPONS_QUERY_KEY, orgId];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<InfiniteData<CouponPageResponse>>(key);
      queryClient.setQueryData<InfiniteData<CouponPageResponse>>(key, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            data: p.data.map((c) =>
              c.code === code ? { ...c, is_active: false } : c,
            ),
          })),
        };
      });
      return { previous, key };
    },
    onError: (_err, _code, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
    },
  });

  return {
    coupons,
    totalCoupons,
    isLoading,
    error: error ? (error instanceof Error ? error.message : "Error loading coupons") : null,
    fetchCoupons: refetch,
    deleteCoupon: (code: string) => deleteMutation.mutateAsync(code),
    invalidate: () => queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEY }),
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
};

/** @deprecated Use `useCoupons` hook instead */
export const useCouponsStore = useCoupons;
