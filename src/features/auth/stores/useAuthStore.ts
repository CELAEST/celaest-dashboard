import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, AuthUser, AuthSession, AuthError } from '../lib/types';

interface AuthStore extends AuthState {
  // Actions
  setAuth: (payload: { user: AuthUser | null; session: AuthSession | null }) => void;
  setLoading: (isLoading: boolean) => void;
  setBackendSynced: (isSynced: boolean) => void;
  setError: (error: AuthError | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,
      isBackendSynced: false,
      error: null,

      // Actions
      setAuth: ({ user, session }) => set({ 
        user, 
        session, 
        isAuthenticated: !!session,
        isLoading: false 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setBackendSynced: (isBackendSynced) => set({ isBackendSynced }),
      
      setError: (error) => set({ error, isLoading: false }),
      
      reset: () => set({ 
        user: null, 
        session: null, 
        isAuthenticated: false, 
        isLoading: false, 
        isBackendSynced: false, 
        error: null 
      }),
    }),
    {
      name: 'celaest-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos la sesión y el usuario para rapidez en el re-hidrate
      partialize: (state) => ({ 
        session: state.session, 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
