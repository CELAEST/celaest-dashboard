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
      setAuth: ({ user, session }) => set((state) => {
        // Stabilize session object reference: if the accessToken is identical,
        // keep the existing session object so components using `===` comparison
        // (e.g. useShallow) don't re-render unnecessarily.
        // This prevents spurious re-renders when Supabase fires onAuthStateChange
        // multiple times with the same token (INITIAL_SESSION + SIGNED_IN).
        const stableSession =
          session?.accessToken &&
          state.session?.accessToken === session.accessToken
            ? state.session
            : session;
        return {
          user,
          session: stableSession,
          isAuthenticated: !!session,
          isLoading: false,
        };
      }),

      setLoading: (isLoading) => set({ isLoading }),
      
      setBackendSynced: (isBackendSynced) => set({ isBackendSynced }),
      
      setError: (error) => set({ error, isLoading: false }),
      
      reset: () => {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('celaest:revoked_orgs');
        }
        set({ 
          user: null, 
          session: null, 
          isAuthenticated: false, 
          isLoading: false, 
          isBackendSynced: false, 
          error: null 
        });
      },
    }),
    {
      name: 'celaest-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos la autenticación superficial y el usuario para la UI
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
