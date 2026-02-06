"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { api } from "@/lib/api-client";

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
  const { session, isAuthenticated } = useAuth();
  const [org, setOrgState] = useState<Organization | null>(null);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrgs = useCallback(async () => {
    if (!session?.accessToken) {
      setOrgs([]);
      setOrgState(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get<{ success: boolean; data: { organizations: Organization[] } }>(
        "/api/v1/user/organizations",
        { token: session.accessToken }
      );
      const list = res?.data?.organizations ?? [];
      setOrgs(list);

      const defaultOrg = list.find((o) => o.is_default) ?? list[0];
      setOrgState((prev) => {
        if (prev && list.some((o) => o.id === prev.id)) return prev;
        return defaultOrg ?? null;
      });
    } catch {
      setOrgs([]);
      setOrgState(null);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (isAuthenticated && session?.accessToken) {
      fetchOrgs();
    } else {
      setOrgs([]);
      setOrgState(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, session?.accessToken, fetchOrgs]);

  const setOrg = useCallback((o: Organization | null) => {
    setOrgState(o);
  }, []);

  const value: OrgContextValue = {
    org,
    orgs,
    setOrg,
    isLoading,
    refreshOrgs: fetchOrgs,
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
