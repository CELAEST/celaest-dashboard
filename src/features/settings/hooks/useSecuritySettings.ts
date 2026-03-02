import { logger } from "@/lib/logger";
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import api from "@/lib/api-client";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export interface SecurityLog {
  event: string;
  time: string;
  type: "auth" | "login" | "security";
}

interface BackendSession {
  id: string;
  device_name?: string;
  browser?: string;
  location_city?: string;
  location_country?: string;
  ip_address?: string;
  last_activity_at: string;
  session_token?: string;
}

interface BackendAuditLog {
  action: string;
  created_at: string;
}

export const useSecuritySettings = () => {
  const { session: currentAuthSession } = useAuth();
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();
  const token = currentAuthSession?.accessToken;

  // Fetch Sessions
  const { data: sessions = [], isLoading: isSessionsLoading } = useQuery({
    queryKey: QUERY_KEYS.users.security.sessions,
    queryFn: async () => {
      const response = await api.get<{ sessions: BackendSession[] }>("/api/v1/user/sessions", { token });
      return (response.sessions || []).map((s) => ({
        id: s.id,
        device: s.device_name || s.browser || "Unknown Device",
        location: s.location_city ? `${s.location_city}, ${s.location_country}` : "Unknown location",
        ip: s.ip_address || "Unknown IP",
        current: s.session_token === token,
        lastActive: formatLastActive(s.last_activity_at),
      }));
    },
    enabled: !!token,
  });

  // Fetch Security Logs
  const { data: logs = [], isLoading: isLogsLoading } = useQuery({
    queryKey: QUERY_KEYS.users.security.logs,
    queryFn: async () => {
      const response = await api.get<BackendAuditLog[]>("/api/v1/user/security-logs", { token });
      return (Array.isArray(response) ? response : []).map((l) => ({
        event: l.action,
        time: new Date(l.created_at).toLocaleString(),
        type: mapLogType(l.action),
      }));
    },
    enabled: !!token,
  });

  // Fetch MFA Status
  const { data: faEnabled = false, refetch: refetchMfa } = useQuery({
    queryKey: QUERY_KEYS.users.security.mfa,
    queryFn: async () => {
      if (!supabase) return false;
      const { data: factors } = await supabase.auth.mfa.listFactors();
      return !!(factors && factors.totp && factors.totp.length > 0);
    },
    enabled: !!supabase && !!token,
  });

  // Mutations
  const logoutSessionMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/user/sessions/${id}`, { token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.security.sessions });
    },
    onError: (error) => {
      logger.error("[Security] Error revoking session:", error);
    }
  });

  const handleEnable2FA = useCallback(async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
      });
      if (error) throw error;
      refetchMfa();
    } catch (err: unknown) {
      logger.error("[Security] Error enrolling MFA:", err);
    }
  }, [supabase, refetchMfa]);

  const handleDisable2FA = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      if (factors?.totp?.[0]) {
        await supabase.auth.mfa.unenroll({ factorId: factors.totp[0].id });
      }
      refetchMfa();
    } catch (err: unknown) {
      logger.error("[Security] Error unenrolling MFA:", err);
    }
  }, [supabase, refetchMfa]);

  return {
    faEnabled,
    sessions,
    logs,
    isLoading: isSessionsLoading || isLogsLoading,
    handleEnable2FA,
    handleDisable2FA,
    handleLogoutSession: (id: string) => logoutSessionMutation.mutate(id),
    refreshLogs: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.security.logs });
    },
  };
};

function formatLastActive(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return "Active now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}

function mapLogType(action: string): "auth" | "login" | "security" {
  const a = action.toLowerCase();
  if (a.includes("login") || a.includes("signin")) return "login";
  if (a.includes("password") || a.includes("email") || a.includes("mfa") || a.includes("2fa")) return "security";
  return "auth";
}
