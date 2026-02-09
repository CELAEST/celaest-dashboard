import { create } from 'zustand';
import { HealthResponse } from "@/features/control-center/types";

interface SystemState {
  health: HealthResponse | null;
  lastChecked: number | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setHealth: (health: HealthResponse) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  health: null,
  lastChecked: null,
  isLoading: false,
  error: null,

  setHealth: (health) => set({ 
    health, 
    lastChecked: Date.now(), 
    isLoading: false 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
}));
