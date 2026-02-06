"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useApiAuth } from "@/lib/use-api-auth";

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
  const [org, setOrgState] = useState<Organization | null>(null);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrgs = useCallback(async () => {
    if (!token) {
      setOrgs([]);
      setOrgState(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { authService } =
        await import("@/features/auth/services/auth.service");
      const res = await authService.getUserOrganizations(token);
      const list = res?.organizations ?? [];

      setOrgs(list);

      const defaultOrg = list.find((o) => o.is_default) ?? list[0];
      setOrgState((prev) => {
        if (prev && list.some((o) => o.id === prev.id)) return prev;
        return defaultOrg ?? null;
      });
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      setOrgs([]);
      setOrgState(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthReady) {
      fetchOrgs();
    } else {
      setOrgs([]);
      setOrgState(null);
      setIsLoading(false);
    }
  }, [isAuthReady, fetchOrgs]);

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
