import { useState, useMemo } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useAuth } from "@/features/auth/contexts/AuthContext";

export type ErrorSeverity = "critical" | "warning" | "info";
export type ErrorStatus = "new" | "reviewing" | "resolved" | "ignored";

export interface ErrorLog {
  id: string;
  timestamp: string;
  severity: ErrorSeverity;
  status: ErrorStatus;
  errorCode: string;
  message: string;
  template: string;
  version: string;
  affectedUsers: number;
  environment: {
    os: string;
    excelVersion?: string;
    platform: string;
  };
  stackTrace?: string;
  suggestion?: string;
}

const MOCK_ERROR_LOGS: ErrorLog[] = [
  {
    id: "ERR-001",
    timestamp: "2025-01-20 14:23:15",
    severity: "critical",
    status: "new",
    errorCode: "ERR-502-AUTH",
    message: "Authentication token expired during macro execution",
    template: "Excel Automation Pro v3.2.1",
    version: "3.2.1",
    affectedUsers: 47,
    environment: {
      os: "Windows 11",
      excelVersion: "Office 365 (16.0.14332)",
      platform: "Desktop",
    },
    stackTrace:
      "AuthService.validateToken() at line 142\nMacroExecutor.run() at line 89\nMain.init() at line 34",
    suggestion: "Implementar refresh token automático antes de expiration",
  },
  {
    id: "ERR-002",
    timestamp: "2025-01-20 13:45:32",
    severity: "warning",
    status: "reviewing",
    errorCode: "ERR-304-CONN",
    message: "Slow API response detected (timeout: 8.5s)",
    template: "PDF Generator Elite v2.1.0",
    version: "2.1.0",
    affectedUsers: 12,
    environment: {
      os: "macOS 14.2",
      platform: "Desktop",
    },
    suggestion: "Revisar latencia del servidor o implementar retry logic",
  },
  {
    id: "ERR-003",
    timestamp: "2025-01-20 12:18:47",
    severity: "info",
    status: "resolved",
    errorCode: "ERR-200-INFO",
    message: "Template updated successfully but cache not cleared",
    template: "Data Analyzer Plus v1.8.3",
    version: "1.8.3",
    affectedUsers: 3,
    environment: {
      os: "Windows 10",
      excelVersion: "Office 2019",
      platform: "Desktop",
    },
    suggestion: "Cache limpiado manualmente - considerar auto-clear",
  },
  {
    id: "ERR-004",
    timestamp: "2025-01-20 11:32:19",
    severity: "critical",
    status: "reviewing",
    errorCode: "ERR-503-CRASH",
    message: "Excel crashed during data import (large dataset >100k rows)",
    template: "Excel Automation Pro v3.2.1",
    version: "3.2.1",
    affectedUsers: 8,
    environment: {
      os: "Windows 10",
      excelVersion: "Office 2016 (16.0.4266)",
      platform: "Desktop",
    },
    stackTrace:
      "DataImporter.processLargeFile() at line 267\nExcelAPI.insertRows() at line 445",
    suggestion:
      "Implementar chunking para datasets grandes (ej: 10k rows por batch)",
  },
  {
    id: "ERR-005",
    timestamp: "2025-01-20 10:15:03",
    severity: "warning",
    status: "new",
    errorCode: "ERR-401-PERM",
    message: "User lacks file write permissions in target directory",
    template: "Report Builder v1.5.2",
    version: "1.5.2",
    affectedUsers: 5,
    environment: {
      os: "Windows 11",
      platform: "Desktop",
    },
    suggestion: "Mostrar dialog para seleccionar directorio con permisos",
  },
];

export const useErrorMonitoring = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";
  const isAdmin = user?.role === "super_admin" || !user;

  const [selectedSeverity, setSelectedSeverity] = useState<
    ErrorSeverity | "all"
  >("all");
  const [selectedStatus, setSelectedStatus] = useState<ErrorStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedError, setExpandedError] = useState<string | null>(null);

  const filteredErrors = useMemo(() => {
    return MOCK_ERROR_LOGS.filter((error) => {
      const matchesSeverity =
        selectedSeverity === "all" || error.severity === selectedSeverity;
      const matchesStatus =
        selectedStatus === "all" || error.status === selectedStatus;
      const matchesSearch =
        error.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        error.errorCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSeverity && matchesStatus && matchesSearch;
    });
  }, [selectedSeverity, selectedStatus, searchQuery]);

  const stats = useMemo(() => {
    return {
      criticalCount: MOCK_ERROR_LOGS.filter((e) => e.severity === "critical")
        .length,
      warningCount: MOCK_ERROR_LOGS.filter((e) => e.severity === "warning")
        .length,
      resolvedCount: MOCK_ERROR_LOGS.filter((e) => e.status === "resolved")
        .length,
      totalAffectedUsers: MOCK_ERROR_LOGS.reduce(
        (sum, e) => sum + e.affectedUsers,
        0,
      ),
    };
  }, []);

  const toggleErrorExpansion = (errorId: string) => {
    setExpandedError(expandedError === errorId ? null : errorId);
  };

  return {
    isDark,
    isAdmin,
    selectedSeverity,
    setSelectedSeverity,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    expandedError,
    toggleErrorExpansion,
    filteredErrors,
    stats,
  };
};
