import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  // Navigation & Search
  navbarSearchVisible: boolean;
  searchQuery: string;
  setNavbarSearchVisible: (visible: boolean) => void;
  setSearchQuery: (query: string) => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Hydration
  isMounted: boolean;
  setIsMounted: (mounted: boolean) => void;

  // Feature Specific Controls
  showErrorControls: boolean;
  setShowErrorControls: (show: boolean) => void;
  errorFilters: {
    severity: string;
    status: string;
  };
  setErrorFilters: (filters: { severity: string, status: string }) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Defaults
      navbarSearchVisible: false,
      searchQuery: '',
      theme: 'system',
      isMounted: false,

      // Feature Specific Defaults
      showErrorControls: false,
      errorFilters: {
        severity: 'all',
        status: 'all',
      },

      // Actions
      setNavbarSearchVisible: (visible) => set({ navbarSearchVisible: visible }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setTheme: (theme) => set({ theme }),
      setIsMounted: (mounted) => set({ isMounted: mounted }),
      setShowErrorControls: (show) => set({ showErrorControls: show }),
      setErrorFilters: (filters) => set({ errorFilters: filters }),
    }),
    {
      name: 'ui-storage',
      // Only persist theme
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
