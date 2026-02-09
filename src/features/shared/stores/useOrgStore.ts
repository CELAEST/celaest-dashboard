import { create } from 'zustand';
import { Organization } from '../contexts/OrgContext';

interface OrgState {
  currentOrg: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
  lastFetched: number | null;

  // Actions
  setOrganizations: (orgs: Organization[]) => void;
  setCurrentOrg: (org: Organization | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useOrgStore = create<OrgState>((set) => ({
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
  
  reset: () => set({ 
    currentOrg: null, 
    organizations: [], 
    isLoading: false, 
    lastFetched: null 
  }),
}));
