import { useInfiniteQuery } from "@tanstack/react-query";
import { marketplaceApi } from "../api/marketplace.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

const PAGE_SIZE = 10;

/**
 * useProductReviews
 *
 * Paginated public reviews for a product using an infinite query so the
 * "Cargar más" button just calls fetchNextPage(). The first page is loaded
 * automatically when the tab opens.
 *
 * Disabled if no productId is given so we don't hit the API with empty
 * params during modal mount.
 */
export function useProductReviews(productId: string | null | undefined) {
  const query = useInfiniteQuery({
    queryKey: ["marketplace", "reviews-infinite", productId || ""],
    queryFn: async ({ pageParam = 1 }) => {
      if (!productId) {
        return { reviews: [], total: 0, page: pageParam, limit: PAGE_SIZE };
      }
      return marketplaceApi.listReviews(productId, pageParam, PAGE_SIZE);
    },
    initialPageParam: 1,
    getNextPageParam: (last, all) => {
      const loaded = all.reduce((acc, p) => acc + p.reviews.length, 0);
      return loaded < last.total ? all.length + 1 : undefined;
    },
    enabled: !!productId,
    staleTime: 60 * 1000,
  });

  const reviews = (query.data?.pages ?? []).flatMap((p) => p.reviews);
  const total = query.data?.pages?.[0]?.total ?? 0;

  return {
    reviews,
    total,
    loading: query.isLoading,
    fetchingMore: query.isFetchingNextPage,
    hasMore: !!query.hasNextPage,
    loadMore: () => query.fetchNextPage(),
    refetch: query.refetch,
    // Bridge to standard query keys so other invalidations also reach us.
    queryKey: QUERY_KEYS.marketplace.reviews(productId || "", 0),
  };
}
