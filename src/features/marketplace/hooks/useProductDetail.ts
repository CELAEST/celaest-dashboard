import { useQuery } from "@tanstack/react-query";
import { marketplaceService } from "../services/marketplace.service";
import { useApiAuth } from "@/lib/use-api-auth";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export function useProductDetail(slug: string | null) {
  const { token } = useApiAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.marketplace.detail(slug || ""),
    queryFn: () => marketplaceService.getProductDetail(slug!),
    enabled: !!token && !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    product: data?.product || null,
    reviews: data?.reviews || [],
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    refresh: refetch,
  };
}
