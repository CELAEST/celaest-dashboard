import { create } from 'zustand';

interface ErrorFilters {
  severity: string;
  status: string;
}

interface ErrorState {
  showErrorControls: boolean;
  setShowErrorControls: (show: boolean) => void;
  errorFilters: ErrorFilters;
  setErrorFilters: (filters: ErrorFilters) => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  showErrorControls: false,
  errorFilters: {
    severity: 'all',
    status: 'all',
  },
  setShowErrorControls: (show) => set({ showErrorControls: show }),
  setErrorFilters: (filters) => set({ errorFilters: filters }),
}));
