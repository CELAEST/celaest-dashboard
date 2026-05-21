"use client";

import { useCallback, useEffect, useMemo } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { mapSupabaseUser } from "../lib/mappers";
import { useAuthStore } from "../stores/useAuthStore";
import { logger } from "@/lib/logger";

/**
 * Hook to manage Supabase session state.
 * Returns the current AuthState based on Supabase session events.
 */
export function useAuthSession() {
  const { setAuth, setBackendSynced, setLoading, reset, session, isAuthenticated, isBackendSynced } = useAuthStore();
  
  // Initialize Supabase Client first
  const supabase = useMemo(() => {
    try {
      return getSupabaseBrowserClient();
    } catch {
      logger.error("Failed to initialize Supabase client");
      return null;
    }
  }, []);

  // Helper to centralize state updates based on session
  const syncSession = useCallback((supabaseSession: Session | null) => {
    if (supabaseSession?.user) {
      const mappedUser = mapSupabaseUser(supabaseSession.user);
      setAuth({
        user: mappedUser,
        session: {
          user: mappedUser,
          accessToken: supabaseSession.access_token,
          refreshToken: supabaseSession.refresh_token,
          expiresAt: supabaseSession.expires_at || 0,
        }
      });
    } else {
      reset();
    }
  }, [setAuth, reset]);

  const buildVerifiedSession = useCallback((currentSession: Session, verifiedUser: Session["user"]): Session => ({
    access_token: currentSession.access_token,
    refresh_token: currentSession.refresh_token,
    expires_in: currentSession.expires_in,
    expires_at: currentSession.expires_at,
    token_type: currentSession.token_type,
    provider_token: currentSession.provider_token,
    provider_refresh_token: currentSession.provider_refresh_token,
    user: verifiedUser,
  }), []);


  // Efecto para verificar la sesión con el backend (celaest-back)
  useEffect(() => {
    // Si hay sesión pero no está sincronizada con el backend, intentamos sincronizar
    if (isAuthenticated && session?.accessToken && !isBackendSynced) {
      const verifyWithBackend = async () => {
        try {
          const { authService } = await import("../services/auth.service");
          const res = await authService.verifySession(session.accessToken);
          
          if (res.valid) {
            setBackendSynced(true);
            // Logging removed
          } else {
            console.warn("⚠️ Backend rejected the token. Check JWT_ISSUER/AUDIENCE configs.");
          }
        } catch (error: unknown) {
          // Usamos console.warn en vez de console.error para evitar que Next.js lance un "Unhandled Error Overlay"
          // cuando el backend simplemente está apagado durante el desarrollo.
          const msg = error instanceof Error ? error.message : "Error desconocido";
          console.warn("❌ Proactive backend session verification failed:", msg);
        }
      };

      
      verifyWithBackend();
    }
  }, [isAuthenticated, session?.accessToken, isBackendSynced, setBackendSynced]);


  useEffect(() => {
    if (!supabase) return;
    
    // E2E Bypass: Evitar que Supabase borre el estado de Zustand simulado
    if (typeof window !== 'undefined' && window.sessionStorage.getItem('playwright-token')) {
      // CRITICAL: Synthesize a full session so useApiAuth returns a valid token.
      // Without this, session stays null → token is null → all React Query hooks
      // with `enabled: !!token` are disabled → no data fetching → empty UIs.
      //
      // RACE CONDITION FIX: Zustand's persist middleware hydrates from localStorage
      // asynchronously. When this effect fires, getState().user may still be null
      // (the pre-hydration default). We read directly from localStorage as fallback
      // to bypass Zustand's async hydration timing.
      const playwrightToken = window.sessionStorage.getItem('playwright-token')!;
      let existingUser = useAuthStore.getState().user;
      if (!existingUser) {
        try {
          const stored = JSON.parse(localStorage.getItem('celaest-auth-storage') || '{}');
          existingUser = stored?.state?.user || null;
        } catch { /* ignore parse errors */ }
      }
      if (existingUser) {
        setAuth({
          user: existingUser,
          session: {
            user: existingUser,
            accessToken: playwrightToken,
            refreshToken: 'e2e-refresh-token',
            expiresAt: Math.floor(Date.now() / 1000) + 86400, // 24h from now
          },
        });
      } else {
        setLoading(false);
      }
      return;
    }

    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          syncSession(null);
        }
      } catch (error: unknown) {
        logger.error("Failed to initialize auth:", error);
        reset();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, currentSession: Session | null) => {
        if (!currentSession) {
          syncSession(null);
          return;
        }

        void supabase.auth.getUser().then(({ data, error }) => {
          if (error || !data.user) {
            syncSession(null);
            return;
          }
          syncSession(buildVerifiedSession(currentSession, data.user));
        });
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setLoading, reset, syncSession, setAuth, buildVerifiedSession]);


  return { supabase };
}

