import { useState, useMemo, useEffect, useCallback } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useUIStore } from "@/stores/useUIStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { errorsApi } from "../api/errors.api";
import { AITask, ErrorAnalyticsResponse } from "../api/types";

export type ErrorSeverity = "critical" | "warning" | "info";
export type ErrorStatus = "failed" | "reviewing" | "resolved" | "ignored";

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

export const useErrorMonitoring = () => {
  const { theme } = useTheme();
  const { user, session } = useAuth();
  const { currentOrg } = useOrgStore();
  const token = session?.accessToken;
  const orgID = currentOrg?.id;
  const { 
    searchQuery, 
    setSearchQuery, 
    errorFilters, 
    setErrorFilters,
    setShowErrorControls 
  } = useUIStore();

  const isDark = theme === "dark";
  const isAdmin = user?.role === "super_admin" || !user;

  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [errorStats, setErrorStats] = useState<ErrorAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedError, setExpandedError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!token || !orgID) return;
    try {
      const stats = await errorsApi.getErrorStats(token, orgID);
      setErrorStats(stats);
    } catch (err) {
      console.error("Failed to fetch error stats:", err);
    }
  }, [token, orgID]);

  const fetchErrors = useCallback(async () => {
    if (!token || !orgID) return;
    
    setIsLoading(true);
    try {
      // Fetch all error-relevant statuses so filters and status buttons work
      const statuses = ["failed", "reviewing", "resolved", "ignored"];
      const results = await Promise.all(
        statuses.map((s) => errorsApi.getFailedTasks(token, orgID, 1, 50, s))
      );
      const allTasks = results.flat();
      
      const severityMap: Record<string, ErrorSeverity> = {
        failed: "critical",
        reviewing: "warning",
        resolved: "info",
        ignored: "info",
      };
      
      const mappedErrors: ErrorLog[] = allTasks.map((task: AITask) => ({
        id: task.id,
        timestamp: new Date(task.created_at).toLocaleString(),
        severity: severityMap[task.status] || "critical",
        status: task.status as ErrorStatus,
        errorCode: `AI-${task.type.toUpperCase()}`,
        message: task.error || "Unknown AI Processing Error",
        template: (task.metadata?.template_name as string) || `AI ${task.type}`,
        version: (task.metadata?.version as string) || "1.0.0",
        affectedUsers: 1,
        environment: {
          os: (task.metadata?.os as string) || "AI Runtime",
          platform: "IA-Mesh",
        },
        stackTrace: task.error,
        suggestion: "Verify AI model availability and prompt parameters.",
      }));
      
      setErrors(mappedErrors);
    } catch (err) {
      console.error("Failed to fetch errors:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, orgID]);

  useEffect(() => {
    fetchErrors();
    fetchStats();
  }, [fetchErrors, fetchStats]);

  // Manage control visibility
  useEffect(() => {
    setShowErrorControls(true);
    return () => {
        setShowErrorControls(false);
        setSearchQuery(""); 
    };
  }, [setShowErrorControls, setSearchQuery]);

  const filteredErrors = useMemo(() => {
    return errors.filter((error) => {
      const matchesSeverity =
        errorFilters.severity === "all" || error.severity === errorFilters.severity;
      const matchesStatus =
        errorFilters.status === "all" || error.status === errorFilters.status;
      const matchesSearch =
        error.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        error.errorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        error.template.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSeverity && matchesStatus && matchesSearch;
    });
  }, [errors, errorFilters, searchQuery]);

  const stats = useMemo(() => {
    if (!errorStats) {
      return {
        criticalCount: 0,
        warningCount: 0,
        resolvedCount: 0,
        totalAffectedUsers: 0,
        mttr: "0m",
      };
    }
    return {
      criticalCount: errorStats.failed_tasks + errorStats.reviewing_tasks,
      warningCount: errorStats.pending_tasks,
      resolvedCount: errorStats.resolved_tasks,
      totalAffectedUsers: errorStats.total_tasks,
      mttr: errorStats.avg_resolution_time_min > 0 
        ? `${Math.round(errorStats.avg_resolution_time_min)}m` 
        : "N/A",
    };
  }, [errorStats]);

  const toggleErrorExpansion = (errorId: string) => {
    setExpandedError(expandedError === errorId ? null : errorId);
  };

  const updateTaskStatus = async (taskId: string, status: ErrorStatus) => {
    if (!token || !orgID) return;
    try {
      await errorsApi.updateTaskStatus(token, orgID, taskId, status);
      await Promise.all([fetchErrors(), fetchStats()]);
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  return {
    isDark,
    isAdmin,
    isLoading,
    refresh: () => Promise.all([fetchErrors(), fetchStats()]),
    // Return compatibility props for now, though they point to global state
    selectedSeverity: errorFilters.severity as ErrorSeverity | "all",
    setSelectedSeverity: (severity: string) => setErrorFilters({ ...errorFilters, severity }),
    selectedStatus: errorFilters.status as ErrorStatus | "all",
    setSelectedStatus: (status: string) => setErrorFilters({ ...errorFilters, status }),
    searchQuery,
    setSearchQuery,
    expandedError,
    toggleErrorExpansion,
    updateTaskStatus,
    filteredErrors,
    stats,
    platformDistribution: errorStats?.platform_distribution || [],
  };
};
