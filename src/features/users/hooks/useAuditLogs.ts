import { useState, useCallback, useEffect } from "react";
import { AuditLog } from "../components/types";
import { useApiAuth } from "@/lib/use-api-auth";
import { auditApi } from "../api/audit.api";

export const useAuditLogs = () => {
  const { token, orgId, isReady } = useApiAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!isReady || !token || !orgId) return;
    
    setLoading(true);
    try {
      const { logs } = await auditApi.getAuditLogs(1, 50, token, orgId);
      setAuditLogs(logs);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [token, orgId, isReady]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    auditLogs,
    loading,
    error,
    refresh: fetchLogs,
  };
};
