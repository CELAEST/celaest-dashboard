"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useShallow } from "zustand/react/shallow";
import { useOrgStore } from "../stores/useOrgStore";
import { logger } from "@/lib/logger";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  role?: string;
  is_default?: boolean;
}

interface OrgContextValue {
  org: Organization | null;
  orgs: Organization[];
  setOrg: (org: Organization | null) => void;
  isLoading: boolean;
  refreshOrgs: () => Promise<void>;
}

const OrgContext = createContext<OrgContextValue | undefined>(undefined);

export function OrgProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  // isAuthenticated is persisted; session is not. On every reload session starts
  // null while Supabase runs getSession() async. Gate on accessToken only after
  // that resolves. Never reset org data while session is just loading.
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAuthReady = !!session?.accessToken;
  const token = session?.accessToken || null;
  const {
    currentOrg,
    organizations,
    isLoading,
    setOrganizations,
    setCurrentOrg,
    setLoading,
  } = useOrgStore(
    useShallow((state) => ({
      currentOrg: state.currentOrg,
      organizations: state.organizations,
      isLoading: state.isLoading,
      setOrganizations: state.setOrganizations,
      setCurrentOrg: state.setCurrentOrg,
      setLoading: state.setLoading,
    })),
  );

  const fetchOrgs = useCallback(
    async (force = false) => {
      // Read mutable state from store directly to avoid stale closures
      const {
        isLoading: loading,
        lastFetched: cached,
        currentOrg: activeOrg,
      } = useOrgStore.getState();
      const CACHE_TTL = 300000; // 5 minutos para organizaciones

      if (!token) {
        // Only wipe org data when truly signed out, not while session is loading.
        if (!isAuthenticated) {
          useOrgStore.getState().reset();
        }
        return;
      }

      // Always fetch when currentOrg is null — same TTL bypass as useOrgStore.
      const noOrg = !activeOrg;
      if (!force && !noOrg && cached && Date.now() - cached < CACHE_TTL) return;
      if (loading) return;

      setLoading(true);
      try {
        const { authService } =
          await import("@/features/auth/services/auth.service");
        const res = await authService.getUserOrganizations(token);
        const list = res?.organizations ?? [];

        setOrganizations(list);

        // Si no hay organización seleccionada o la actual ya no está en la lista, elegir la default
        if (!activeOrg || !list.some((o) => o.id === activeOrg.id)) {
          const defaultOrg = list.find((o) => o.is_default) ?? list[0];
          setCurrentOrg(defaultOrg ?? null);
        }
      } catch (error: unknown) {
        logger.error("Failed to fetch organizations:", error);
        // On transient error, preserve existing org context.
        // Clearing currentOrg here causes "Preparando sesión..." on any network hiccup.
      } finally {
        setLoading(false);
      }
    },
    [token, isAuthenticated, setOrganizations, setCurrentOrg, setLoading],
  );

  useEffect(() => {
    if (isAuthReady) {
      fetchOrgs();
    } else if (!isAuthenticated) {
      // Truly signed out — safe to wipe. If session is just loading, do nothing.
      useOrgStore.getState().reset();
    }
  }, [isAuthReady, isAuthenticated, fetchOrgs]);

  const value: OrgContextValue = {
    org: currentOrg,
    orgs: organizations,
    setOrg: setCurrentOrg,
    isLoading,
    refreshOrgs: () => fetchOrgs(true),
  };

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg(): OrgContextValue {
  const ctx = useContext(OrgContext);
  if (!ctx) {
    return {
      org: null,
      orgs: [],
      setOrg: () => {},
      isLoading: false,
      refreshOrgs: async () => {},
    };
  }
  return ctx;
}
