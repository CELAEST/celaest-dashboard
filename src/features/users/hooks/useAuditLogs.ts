import { useState } from "react";
import { AuditLog } from "../components/types";
import { MOCK_AUDIT_LOGS } from "../components/mockData";

export const useAuditLogs = () => {
  const [auditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [loading] = useState(false);

  return {
    auditLogs,
    loading,
  };
};
