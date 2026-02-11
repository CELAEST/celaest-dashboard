import { api } from "@/lib/api-client";
import { AuditLog } from "../components/types";

export interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
}

interface BackendAuditLog {
  id: string;
  organization_id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// Backend structure mapping helper
const mapBackendToFrontend = (log: BackendAuditLog): AuditLog => ({
  userId: log.user_id || "System",
  action: log.action,
  ip: log.ip_address || "0.0.0.0",
  timestamp: log.created_at,
  metadata: log.metadata,
});

export const auditApi = {
  getAuditLogs: async (page = 1, limit = 50, token: string, orgId: string): Promise<AuditLogsResponse> => {
    const response = await api.get<BackendAuditLog[] | { logs: BackendAuditLog[]; total: number }>("/api/v1/org/audit-logs", {
      params: { page: String(page), limit: String(limit) },
      token,
      orgId,
      skipUnwrap: true,
    });

    // The backend sometimes returns the array directly or wrapped in { logs: [], total: 0 }
    // Let's handle both
    const logs = Array.isArray(response) ? response : (response.logs || []);
    const total = Array.isArray(response) ? response.length : (response.total || logs.length);

    return {
      logs: logs.map(mapBackendToFrontend),
      total,
    };
  },
};
