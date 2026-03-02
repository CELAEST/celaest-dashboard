import { useQuery } from "@tanstack/react-query";
import { assetsService } from "@/features/assets/services/assets.service";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export function useMyAssetsQuery(token: string) {
  return useQuery({
    queryKey: QUERY_KEYS.assets.myAssets(token),
    queryFn: () => assetsService.getMyAssets(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOrgInventoryQuery(token: string, orgId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.assets.inventory(orgId),
    queryFn: () => assetsService.fetchInventory(token, orgId),
    enabled: !!token && !!orgId,
    staleTime: 5 * 60 * 1000,
  });
}
