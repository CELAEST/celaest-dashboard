import { useState, useEffect, useCallback } from "react";
import { Session } from "../components/tabs/SecurityAccess/SecuritySessions";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import api from "@/lib/api-client";

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
  const [faEnabled, setFaEnabled] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSecurityData = useCallback(async () => {
    if (!supabase || !currentAuthSession) return;
    
    try {
      setIsLoading(true);
      const token = currentAuthSession.accessToken;

      // 1. Fetch Sessions from Backend
      const sessionsResponse = await api.get<{ sessions: BackendSession[] }>("/api/v1/user/sessions", { token });
      if (sessionsResponse.sessions) {
        const mappedSessions: Session[] = sessionsResponse.sessions.map((s) => ({
          id: s.id,
          device: s.device_name || s.browser || "Unknown Device",
          location: s.location_city ? `${s.location_city}, ${s.location_country}` : "Unknown location",
          ip: s.ip_address || "Unknown IP",
          current: s.session_token === token,
          lastActive: formatLastActive(s.last_activity_at),
        }));
        setSessions(mappedSessions);
      }

      // 2. Fetch Security Logs from Backend
      const logsResponse = await api.get<BackendAuditLog[]>("/api/v1/user/security-logs", { token });
      if (Array.isArray(logsResponse)) {
        const mappedLogs: SecurityLog[] = logsResponse.map((l) => ({
          event: l.action,
          time: new Date(l.created_at).toLocaleString(),
          type: mapLogType(l.action),
        }));
        setLogs(mappedLogs);
      }

      // 3. Check MFA status from Supabase
      const { data: factors } = await supabase.auth.mfa.listFactors();
      if (factors && factors.totp && factors.totp.length > 0) {
        setFaEnabled(true);
      }
    } catch (error) {
      console.error("[Security] Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentAuthSession]);

  useEffect(() => {
    fetchSecurityData();
  }, [fetchSecurityData]);

  const handleLogoutSession = useCallback(
    async (id: string) => {
      if (!currentAuthSession) return;
      try {
        await api.delete(`/api/v1/user/sessions/${id}`, { token: currentAuthSession.accessToken });
        setSessions((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error("[Security] Error revoking session:", error);
      }
    },
    [currentAuthSession],
  );

  const handleEnable2FA = useCallback(async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
      });
      if (error) throw error;
      setFaEnabled(true);
    } catch {
      setFaEnabled(false);
    }
  }, []);

  const handleDisable2FA = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      if (factors?.totp?.[0]) {
        await supabase.auth.mfa.unenroll({ factorId: factors.totp[0].id });
      }
      setFaEnabled(false);
    } catch {
      // Keep current state on failure
    }
  }, []);

  return {
    faEnabled,
    sessions,
    logs,
    isLoading,
    handleEnable2FA,
    handleDisable2FA,
    handleLogoutSession,
    refreshLogs: fetchSecurityData,
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
