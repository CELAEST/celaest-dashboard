import { logger } from "@/lib/logger";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  role?: string;
  is_default?: boolean;
  is_system_default?: boolean;
}

interface OrgState {
  currentOrg: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
  lastFetched: number | null;

  // Actions
  setOrganizations: (orgs: Organization[]) => void;
  setCurrentOrg: (org: Organization | null) => void;
  setLoading: (isLoading: boolean) => void;
  fetchOrgs: (token: string, force?: boolean) => Promise<void>;
  reset: () => void;
  clearSync: () => void;
}

const CACHE_TTL = 300000; // 5 minutes

// NUCLEAR CIRCUIT BREAKER: If landing with ?revoked=true, synchronously wipe any trace of stale org context
if (typeof window !== 'undefined' && window.location.search.includes('revoked=true')) {
  console.warn("[useOrgStore] Revoked landing detected. Synchronously wiping stale org storage.");
  localStorage.removeItem('celaest-org-storage');
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set, get) => ({
      currentOrg: null,
      organizations: [],
      isLoading: false,
      lastFetched: null,

      setOrganizations: (organizations) => set({ 
        organizations, 
        lastFetched: Date.now(),
        isLoading: false 
      }),
      
      setCurrentOrg: (currentOrg) => set({ currentOrg }),
      
      setLoading: (isLoading) => set({ isLoading }),

      fetchOrgs: async (token: string, force = false) => {
        const { isLoading, lastFetched, currentOrg: activeOrg } = get();

        if (!token) {
          get().reset();
          return;
        }

        // Always fetch when currentOrg is null — stale TTL must NOT block org recovery.
        // Without this, post-removal reloads skip the fetch because lastFetched is recent,
        // leaving currentOrg = null and isReady = false for up to 5 minutes.
        const noOrg = !activeOrg;
        if (!force && !noOrg && lastFetched && Date.now() - lastFetched < CACHE_TTL) return;
        if (isLoading) return;

        set({ isLoading: true });
        try {
          const { authService } = await import("@/features/auth/services/auth.service");
          const res = await authService.getUserOrganizations(token);
          // Filter out blacklisted organizations
          let list = res?.organizations ?? [];
          if (typeof window !== 'undefined') {
            try {
              const blacklistData = sessionStorage.getItem('celaest:revoked_orgs');
              if (blacklistData) {
                const blacklist = new Set(JSON.parse(blacklistData));
                list = list.filter(o => !blacklist.has(o.id));
              }
            } catch (e) {
              console.warn("[useOrgStore] Failed to filter by blacklist:", e);
            }
          }

          set({ 
            organizations: list, 
            lastFetched: Date.now(),
            isLoading: false 
          });

          // Track the home/system org so api-client can protect it from
          // accidental blacklisting. The home org (Celaest) should never be
          // blocked — it is the fallback workspace for every user.
          if (typeof window !== 'undefined') {
            const homeOrg =
              list.find((o) => o.is_system_default) ??
              list.find((o) => o.slug?.toLowerCase().startsWith('celaest'));
            if (homeOrg) {
              sessionStorage.setItem('celaest:home_org_id', homeOrg.id);
            }
          }

          // If no org selected or current one is missing/blacklisted, pick default
          if (!activeOrg || !list.some((o) => o.id === activeOrg.id)) {
            const defaultOrg = list.find((o) => o.is_default) ?? list[0];
            set({ currentOrg: defaultOrg ?? null });
          }
        } catch (error: unknown) {
          logger.error("Failed to fetch organizations:", error);
          // On transient error, preserve existing org context.
          // Wiping currentOrg to null causes downstream "Preparando sesión..." loops.
          set({ isLoading: false });
        }
      },
      
      reset: () => set({ 
        currentOrg: null, 
        organizations: [], 
        isLoading: false, 
        lastFetched: null 
      }),

      clearSync: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('celaest-org-storage');
          // CRITICAL: also wipe the api-client blacklist from sessionStorage.
          // sessionStorage survives window.location.href redirects within the
          // same tab, so without this, the revoked org ID persists across the
          // /?revoked=true redirect and blocks ALL requests in the next session
          // (billing, assets, checkout) even after currentOrg is already Celaest.
          sessionStorage.removeItem('celaest:revoked_orgs');
          // Also reset the home org tracker — it will be re-written on the
          // next fetchOrgs, ensuring a clean state after recovery.
          sessionStorage.removeItem('celaest:home_org_id');
        }
        set({ currentOrg: null, organizations: [], lastFetched: null });
      },
    }),
    {
      name: 'celaest-org-storage',
      storage: createJSONStorage(() => localStorage),
      // We only want to persist currentOrg to survive reloads.
      // Organizations list can be re-fetched.
      partialize: (state) => ({ currentOrg: state.currentOrg }),
    }
  )
);
