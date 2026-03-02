import { useQuery } from "@tanstack/react-query";
import { AuditLog } from "../components/types";
import { useApiAuth } from "@/lib/use-api-auth";
import { auditApi } from "../api/audit.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export const useAuditLogs = () => {
  const { token, orgId, isReady } = useApiAuth();

  const { data: auditLogs = [], isLoading, refetch } = useQuery<AuditLog[]>({
    queryKey: QUERY_KEYS.users.auditLogs(orgId || ""),
    queryFn: async () => {
      const { logs } = await auditApi.getAuditLogs(1, 50, token!, orgId!);
      return logs;
    },
    enabled: isReady && !!token && !!orgId,
  });

  return {
    auditLogs,
    loading: isLoading,
    error: null,
    refresh: () => refetch(),
  };
};
