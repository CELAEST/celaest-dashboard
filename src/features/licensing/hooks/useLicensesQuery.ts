import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { licensingService } from "../services/licensing.service";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import type { LicenseFilter, LicenseListResponse } from "../types";

const LICENSE_PAGE_SIZE = 15;

export const useLicensesQuery = (filter: Omit<LicenseFilter, "page" | "limit"> = {}) => {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.licensing.list(filter as Record<string, unknown>, currentOrg?.id),
    queryFn: ({ pageParam }) =>
      licensingService.list({ ...filter, page: pageParam, limit: LICENSE_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: LicenseListResponse) => {
      const loaded = lastPage.page * lastPage.limit;
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
    enabled: licensingService.isServiceReady(),
  });
};

export const useLicenseStatsQuery = () => {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  return useQuery({
    queryKey: QUERY_KEYS.licensing.stats(currentOrg?.id),
    queryFn: () => licensingService.getStats(),
    enabled: licensingService.isServiceReady(),
  });
};

export const useLicensePlansQuery = () => {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  return useQuery({
    queryKey: QUERY_KEYS.licensing.plans(currentOrg?.id),
    queryFn: () => licensingService.getPlans(),
    enabled: licensingService.isServiceReady(),
  });
};
