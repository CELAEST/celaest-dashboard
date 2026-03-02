import { useQuery } from "@tanstack/react-query";
import { licensingService } from "../services/licensing.service";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import type { LicenseFilter } from "../types";

export const useLicensesQuery = (filter: LicenseFilter = {}) => {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  return useQuery({
    queryKey: QUERY_KEYS.licensing.list(filter as Record<string, unknown>, currentOrg?.id),
    queryFn: () => licensingService.list(filter),
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
