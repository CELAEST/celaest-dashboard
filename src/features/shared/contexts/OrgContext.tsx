"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useShallow } from "zustand/react/shallow";
import { useOrgStore } from "../stores/useOrgStore";

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
  const { session, isBackendSynced } = useAuth();
  const isAuthReady = !!session?.accessToken && isBackendSynced;
  const token = session?.accessToken || null;
  const {
    currentOrg,
    organizations,
    isLoading,
    lastFetched,
    setOrganizations,
    setCurrentOrg,
    setLoading,
  } = useOrgStore(
    useShallow((state) => ({
      currentOrg: state.currentOrg,
      organizations: state.organizations,
      isLoading: state.isLoading,
      lastFetched: state.lastFetched,
      setOrganizations: state.setOrganizations,
      setCurrentOrg: state.setCurrentOrg,
      setLoading: state.setLoading,
    })),
  );

  const fetchOrgs = useCallback(
    async (force = false) => {
      // Read mutable state from store directly to avoid stale closures
      const { isLoading: loading, lastFetched: cached, currentOrg: activeOrg } = useOrgStore.getState();
      const CACHE_TTL = 300000; // 5 minutos para organizaciones

      if (!token) {
        useOrgStore.getState().reset();
        return;
      }

      if (!force && cached && Date.now() - cached < CACHE_TTL) return;
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
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
        setOrganizations([]);
        setCurrentOrg(null);
      } finally {
        setLoading(false);
      }
    },
    [token, setOrganizations, setCurrentOrg, setLoading],
  );

  useEffect(() => {
    if (isAuthReady) {
      fetchOrgs();
    } else {
      useOrgStore.getState().reset();
    }
  }, [isAuthReady, fetchOrgs]);

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
