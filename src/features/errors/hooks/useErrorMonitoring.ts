import { logger } from "@/lib/logger";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useUIStore } from "@/stores/useUIStore";
import { useErrorStore } from "../stores/useErrorStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { errorsApi } from "../api/errors.api";
import { analyticsApi, SystemEvent } from "@/features/analytics/api/analytics.api";
import { AITask, ErrorAnalyticsResponse } from "../api/types";
import { useShallow } from "zustand/react/shallow";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

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
  userEmail?: string;
}

// ── Mapping helpers ─────────────────────────────────────────────────
const severityMap: Record<string, ErrorSeverity> = {
  failed: "critical",
  reviewing: "warning",
  resolved: "info",
  ignored: "info",
};

function mapTaskToError(task: AITask): ErrorLog {
  return {
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
    userEmail: task.user_email || "system",
  };
}

function mapEventToError(event: SystemEvent): ErrorLog {
  return {
    id: event.id,
    timestamp: new Date(event.timestamp).toLocaleString(),
    severity: "critical",
    status: "failed",
    errorCode: event.source === "system" ? "SYS-WAF" : "SYS-ERR",
    message: event.message,
    template: "System Telemetry",
    version: "N/A",
    affectedUsers: 1,
    environment: {
      os: "Server Runtime",
      platform: event.source.toUpperCase(),
    },
    stackTrace: "Telemetry event captured in real-time.",
    suggestion: "Check security logs or endpoint health.",
    userEmail: event.user_email || "system",
  };
}

// ── Main Hook ───────────────────────────────────────────────────────
export const useErrorMonitoring = () => {
  const { theme } = useTheme();
  const { user, session } = useAuth();
  const { currentOrg } = useOrgStore();
  const token = session?.accessToken;
  const orgID = currentOrg?.id;
  const queryClient = useQueryClient();

  const { searchQuery, setSearchQuery } = useUIStore(useShallow(state => ({
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
  })));

  const { errorFilters, setErrorFilters, setShowErrorControls } = useErrorStore(useShallow(state => ({
    errorFilters: state.errorFilters,
    setErrorFilters: state.setErrorFilters,
    setShowErrorControls: state.setShowErrorControls
  })));

  const isDark = theme === "dark";
  const isAdmin = user?.role === "super_admin" || !user;
  const [expandedError, setExpandedError] = useState<string | null>(null);

  // ── Queries ──────────────────────────────────────────────────────
  const { data: errors = [], isLoading: errorsLoading } = useQuery<ErrorLog[]>({
    queryKey: QUERY_KEYS.errors.tasks(orgID || ""),
    queryFn: async () => {
      if (!token || !orgID) return [];

      // Fetch all statuses in parallel
      const statuses = ["failed", "reviewing", "resolved", "ignored"];
      const results = await Promise.all(
        statuses.map(s => errorsApi.getFailedTasks(token, orgID, 1, 50, s))
      );
      const aiErrors = results.flat().map(mapTaskToError);

      // Merge live feed telemetry errors
      let telemetryErrors: ErrorLog[] = [];
      try {
        const liveEvents = await analyticsApi.getLiveFeed(token, orgID);
        telemetryErrors = liveEvents
          .filter(event => event.type === "error")
          .map(mapEventToError);
      } catch {
        // Silently ignore live feed failures
      }

      // Dedupe and sort
      const existingIds = new Set(aiErrors.map(e => e.id));
      const combined = [
        ...aiErrors,
        ...telemetryErrors.filter(e => !existingIds.has(e.id)),
      ];
      return combined.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
    enabled: !!token && !!orgID,
  });

  const { data: errorStats } = useQuery<ErrorAnalyticsResponse>({
    queryKey: QUERY_KEYS.errors.analytics(orgID || ""),
    queryFn: () => errorsApi.getErrorStats(token!, orgID!),
    enabled: !!token && !!orgID,
  });

  // ── Mutations ────────────────────────────────────────────────────
  const updateStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: ErrorStatus }) => {
      if (!token || !orgID) throw new Error("Missing auth");
      await errorsApi.updateTaskStatus(token, orgID, taskId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.errors.tasks(orgID || "") });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.errors.analytics(orgID || "") });
    },
    onError: (err: unknown) => {
      logger.error("Failed to update task status:", err);
    },
  });

  // ── UI Effects ───────────────────────────────────────────────────
  useEffect(() => {
    setShowErrorControls(true);
    return () => {
      setShowErrorControls(false);
      setSearchQuery("");
    };
  }, [setShowErrorControls, setSearchQuery]);

  // ── Derived Data ─────────────────────────────────────────────────
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

  const hasActiveFilters =
    errorFilters.severity !== "all" ||
    errorFilters.status !== "all" ||
    searchQuery.trim().length > 0;

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
    await updateStatusMutation.mutateAsync({ taskId, status });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setErrorFilters({ severity: "all", status: "all" });
  };

  return {
    isDark,
    isAdmin,
    isLoading: errorsLoading,
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.errors.tasks(orgID || "") });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.errors.analytics(orgID || "") });
    },
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
    hasActiveFilters,
    clearFilters,
    stats,
    platformDistribution: errorStats?.platform_distribution || [],
  };
};
