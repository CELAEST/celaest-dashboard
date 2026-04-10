import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { assetsService } from "@/features/assets/services/assets.service";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

const INVENTORY_PAGE_SIZE = 15;

export function useMyAssetsQuery(token: string) {
  // E2E Test bypass: permitimos inyectar un token por sessionStorage para no depender de Supabase Auth
  const effectiveToken = token || (typeof window !== 'undefined' ? window.sessionStorage.getItem('playwright-token') : "") || "";
  return useQuery({
    queryKey: QUERY_KEYS.assets.myAssets(effectiveToken),
    queryFn: () => assetsService.getMyAssets(effectiveToken),
    enabled: !!effectiveToken,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOrgInventoryQuery(token: string, orgId: string) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.assets.inventory(orgId),
    queryFn: ({ pageParam }) =>
      assetsService.fetchInventory(token, orgId, pageParam, INVENTORY_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.page * lastPage.limit;
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
    enabled: !!token && !!orgId,
    staleTime: 5 * 60 * 1000,
  });
}
