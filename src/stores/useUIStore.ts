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
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Defaults
      navbarSearchVisible: false,
      searchQuery: '',
      theme: 'system',
      isMounted: false,

      // Actions
      setNavbarSearchVisible: (visible) => set({ navbarSearchVisible: visible }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setTheme: (theme) => set({ theme }),
      setIsMounted: (mounted) => set({ isMounted: mounted }),
    }),
    {
      name: 'ui-storage',
      // Only persist theme
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
