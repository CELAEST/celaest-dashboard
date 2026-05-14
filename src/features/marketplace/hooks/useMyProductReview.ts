import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { marketplaceApi } from "../api/marketplace.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

/**
 * useMyProductReview
 *
 * Returns the caller's review for a given product, or null if none exists.
 * Used by the ReviewForm to switch between "create" and "edit/delete" modes
 * and by the reviews tab to surface the user's existing review at the top.
 *
 * Disabled when the user is not authenticated or no product id is provided.
 */
export function useMyProductReview(productId: string | null | undefined) {
  const { session } = useAuth();
  const token = session?.accessToken;

  const query = useQuery({
    queryKey: QUERY_KEYS.marketplace.myReview(productId || ""),
    queryFn: async () => {
      if (!token || !productId) return null;
      const res = await marketplaceApi.getMyReview(productId, token);
      return res?.review ?? null;
    },
    enabled: !!token && !!productId,
    staleTime: 60 * 1000,
  });

  return {
    review: query.data ?? null,
    loading: query.isLoading,
    refetch: query.refetch,
    isAuthenticated: !!token,
  };
}
