"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useApiAuth } from "@/lib/use-api-auth";
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
  const { isAuthReady, token } = useApiAuth();
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
      // Si no hay token o ya cargamos recientemente y no es force, no hacemos nada
      const CACHE_TTL = 300000; // 5 minutos para organizaciones
      if (!token) {
        useOrgStore.getState().reset();
        return;
      }

      if (!force && lastFetched && Date.now() - lastFetched < CACHE_TTL) return;
      if (isLoading) return;

      setLoading(true);
      try {
        const { authService } =
          await import("@/features/auth/services/auth.service");
        const res = await authService.getUserOrganizations(token);
        const list = res?.organizations ?? [];

        setOrganizations(list);

        // Si no hay organización seleccionada o la actual ya no está en la lista, elegir la default
        if (!currentOrg || !list.some((o) => o.id === currentOrg.id)) {
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
    [
      token,
      lastFetched,
      isLoading,
      currentOrg,
      setOrganizations,
      setCurrentOrg,
      setLoading,
    ],
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
