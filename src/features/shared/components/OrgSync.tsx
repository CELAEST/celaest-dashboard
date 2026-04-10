"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "../stores/useOrgStore";
import { socket } from "@/lib/socket-client";
import { toast } from "sonner";
import { decodeJWT } from "@/lib/jwt";
import { useQueryClient } from "@tanstack/react-query";
import { logger } from "@/lib/logger";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

/**
 * Logical component to handle organization fetching and synchronization.
 * Replaces the lifecycle logic previously in OrgContext.
 */
export const OrgSync = () => {
  const { session, signOut } = useAuth();
  // isAuthenticated is persisted in localStorage; session is not.
  // On every page reload, session starts null while Supabase runs getSession() async.
  // We MUST NOT wipe org data during that window — only wipe when truly signed out.
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const fetchOrgs = useOrgStore((state) => state.fetchOrgs);
  const resetOrgs = useOrgStore((state) => state.reset);
  const lastFetchedToken = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const currentOrgId = useOrgStore((s) => s.currentOrg?.id);
  const hasOrg = !!currentOrgId;
  const isRedirecting = useRef(false);

  // Effect 1: Fetch orgs when token changes or there is no org selected.
  // Separated from socket.connect intentionally: org switches should reconnect
  // the socket (different channel) but should NOT trigger a new fetch.
  useEffect(() => {
    const token = session?.accessToken;

    if (token) {
      const tokenChanged = lastFetchedToken.current !== token;
      if (tokenChanged || !hasOrg) {
        if (tokenChanged) lastFetchedToken.current = token;
        fetchOrgs(token, !hasOrg);
      }
    } else if (!isAuthenticated) {
      // Truly signed out (not just session loading async). Safe to wipe.
      lastFetchedToken.current = null;
      resetOrgs();
    }
    // If !token but isAuthenticated=true: Supabase is initializing, do nothing.
  }, [session?.accessToken, isAuthenticated, hasOrg, fetchOrgs, resetOrgs]);

  // Effect 2: Connect/reconnect WebSocket when token OR active org changes.
  // Kept separate so org switches update the socket channel without re-fetching.
  useEffect(() => {
    const token = session?.accessToken;
    if (token) {
      socket.connect(token, currentOrgId);
    } else if (!isAuthenticated) {
      socket.disconnect();
    }
  }, [session?.accessToken, isAuthenticated, currentOrgId]);

  // Real-time Reactivity: Listen for membership revoked events
  // NOTE: NotificationContext handles the membership_revoked action (for the
  // removed user) with force-fetch + hard redirect. This handler only covers
  // the org-broadcast side (someone else was removed) — it force-refreshes the
  // org list so the sidebar stays consistent, without duplicating the redirect.
  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;

    const unsubscribe = socket.on(
      "organization.member_removed",
      (rawPayload: unknown) => {
        const payload = rawPayload as {
          action?: string;
          organization_id?: string;
          user_id?: string;
          data?: { action?: string; organization_id?: string; user_id?: string };
        };
        const action = payload?.action || payload?.data?.action;

        // membership_revoked is fully handled by NotificationContext (force fetch
        // + hard redirect). Handling it here again would race with that flow.
        if (action === "membership_revoked") return;

        // For org-broadcast removals (someone else was removed), refresh org
        // list so the workspace sidebar/switcher stays up to date.
        fetchOrgs(token, true);
      },
    );

    return () => unsubscribe();
  }, [session?.accessToken, fetchOrgs]);

  // Real-time Reactivity: Listen for session revocation
  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;

    const unsubscribe = socket.on(
      "user.session_revoked",
      (rawPayload: unknown) => {
        const payload = rawPayload as {
          session_id?: string;
          all_sessions?: boolean;
        };
        const decoded = decodeJWT(token);
        const currentSessionId = decoded?.session_id || decoded?.jti;

        const isThisSession =
          payload.all_sessions ||
          (payload.session_id && payload.session_id === currentSessionId);

        if (isThisSession) {
          toast.error("Sesión terminada", {
            description:
              "Esta sesión ha sido terminada desde otro dispositivo. Redirigiendo...",
            duration: 5000,
          });

          // Small delay to let the toast be seen before redirecting
          setTimeout(() => {
            signOut();
          }, 1500);
        }
      },
    );

    return () => unsubscribe();
  }, [session?.accessToken, signOut]);

  // Real-time Reactivity: Local workspace synchronization (Multi-tab)
  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;

    const unsubscribe = socket.on("user.updated", (rawPayload: unknown) => {
      const payload = rawPayload as {
        organization_id?: string;
        user_id: string;
      };
      const currentUserId = decodeJWT(token)?.sub;

      if (payload.user_id === currentUserId && payload.organization_id) {
        const { currentOrg, organizations, setCurrentOrg } =
          useOrgStore.getState();

        if (payload.organization_id !== currentOrg?.id) {
          const newOrg = organizations.find(
            (o) => o.id === payload.organization_id,
          );
          if (newOrg) {
            logger.debug(
              "[OrgSync] Workspace updated from another tab/session. Syncing...",
            );
            setCurrentOrg(newOrg);
            toast.info("Contexto actualizado", {
              description: `Workspace cambiado a: ${newOrg.name}`,
            });
          }
        }
      }
    });

    return () => unsubscribe();
  }, [session?.accessToken]);

  // Real-time Reactivity: Organization Updated (Logo, Name changes)
  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;

    const unsubscribe = socket.on(
      "organization.updated",
      (rawPayload: unknown) => {
        const payload = rawPayload as {
          organization_id: string;
          action?: string;
          plan_id?: string;
        };
        logger.debug(
          `[OrgSync] Organization updated (${payload.action || "general"}). Refetching context...`,
        );

        // We always refresh the list in the Zustand store
        fetchOrgs(token);

        // Invalidate relevant React Query caches to trigger UI re-renders
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.organizations.all,
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.organizations.detail(payload.organization_id),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.organizations.settings(payload.organization_id),
        });

        // If it's a subscription or settings update, also invalidate those
        if (
          payload.action === "subscription_updated" ||
          payload.action === "subscription_cancelled"
        ) {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.organizations.subscription(
              payload.organization_id,
            ),
          });
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
        }
      },
    );

    return unsubscribe;
  }, [session?.accessToken, fetchOrgs, queryClient]);

  useEffect(() => {
    const handleOrgNotFound = () => {
      const token = session?.accessToken;
      if (!token || isRedirecting.current) return;

      isRedirecting.current = true;
      logger.warn(
        "[OrgSync] 🚨 NUCLEAR RECOVERY TRIGGERED. Revoked ID detected.",
      );

      // 1. Wipe absolutely everything synchronously
      const store = useOrgStore.getState();
      store.clearSync();

      // 2. Force hard reload to home with high-priority flag
      // No delay, no toasts, just break the loop.
      window.location.href = "/?revoked=true";
    };

    window.addEventListener("celaest:org_not_found", handleOrgNotFound);
    return () =>
      window.removeEventListener("celaest:org_not_found", handleOrgNotFound);
  // Empty deps: this listener must be registered exactly once for the lifetime
  // of the component. The handler reads session via useOrgStore.getState() and
  // isRedirecting.current — no stale-closure risk.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
