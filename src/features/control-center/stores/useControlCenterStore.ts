import { create } from 'zustand';
import { DashboardStats, SalesByPeriod } from '../types';


interface ControlCenterState {
  dashboard: DashboardStats | null;
  salesSeries: SalesByPeriod[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Actions
  setData: (data: Partial<ControlCenterState>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useControlCenterStore = create<ControlCenterState>((set) => ({
  dashboard: null,
  salesSeries: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  setData: (data) => set((state) => ({ 
    ...state, 
    ...data, 
    lastFetched: Date.now(),
    isLoading: false 
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  reset: () => set({ 
    dashboard: null, 
    salesSeries: [], 
    isLoading: false, 
    error: null,
    lastFetched: null
  }),
}));

