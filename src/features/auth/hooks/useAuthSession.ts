"use client";

import { useCallback, useEffect, useMemo } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { mapSupabaseUser } from "../lib/mappers";
import { useAuthStore } from "../stores/useAuthStore";
import { logger } from "@/lib/logger";
import { toast } from "sonner";

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
        const currentAuth = useAuthStore.getState();
        if (!currentAuth.isAuthenticated) {
          setLoading(true);
        }

        // Handle OAuth callback (code or error from GitHub/Google redirect)
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get("code");
          const errorParam =
            urlParams.get("error_description") || urlParams.get("error");

          if (errorParam) {
            const decodedError = decodeURIComponent(errorParam);
            logger.error("OAuth callback error:", decodedError);
            toast.error(`Error de autenticación: ${decodedError}`);
            const cleanUrl = new URL(window.location.href);
            cleanUrl.searchParams.delete("error");
            cleanUrl.searchParams.delete("error_description");
            cleanUrl.searchParams.delete("error_code");
            window.history.replaceState({}, "", cleanUrl.toString());
            syncSession(null);
            setLoading(false);
            return;
          }

          if (code) {
            try {
              // 1. Proactive PKCE code exchange
              const { data: exchangeData, error: exchangeError } =
                await supabase.auth.exchangeCodeForSession(code);
              if (exchangeData?.session?.user) {
                syncSession(exchangeData.session);
                const cleanUrl = new URL(window.location.href);
                cleanUrl.searchParams.delete("code");
                window.history.replaceState({}, "", cleanUrl.toString());
                setLoading(false);
                return;
              }

              if (exchangeError) {
                logger.warn(
                  "[useAuthSession] Code exchange reported error, checking session fallback:",
                  exchangeError.message,
                );
                // 2. Fallback: Check if detectSessionInUrl already redeemed the code
                const { data: fallbackData } = await supabase.auth.getSession();
                if (fallbackData?.session?.user) {
                  syncSession(fallbackData.session);
                  const cleanUrl = new URL(window.location.href);
                  cleanUrl.searchParams.delete("code");
                  window.history.replaceState({}, "", cleanUrl.toString());
                  setLoading(false);
                  return;
                }
              }
            } catch (err) {
              logger.warn(
                "[useAuthSession] Exception during PKCE exchange, attempting getSession:",
                err,
              );
              const { data: fallbackData } = await supabase.auth.getSession();
              if (fallbackData?.session?.user) {
                syncSession(fallbackData.session);
                const cleanUrl = new URL(window.location.href);
                cleanUrl.searchParams.delete("code");
                window.history.replaceState({}, "", cleanUrl.toString());
                setLoading(false);
                return;
              }
            }
          }

          // Handle implicit hash token (#access_token=...)
          if (window.location.hash.includes("access_token")) {
            const { data: hashSessionData } = await supabase.auth.getSession();
            if (hashSessionData?.session?.user) {
              syncSession(hashSessionData.session);
              window.history.replaceState(
                {},
                "",
                window.location.pathname + window.location.search,
              );
              setLoading(false);
              return;
            }
          }
        }

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

        // Fast-path: Sincronizar inmediatamente con currentSession para eliminar latencia en la UI
        if (currentSession.user) {
          syncSession(currentSession);
        }

        void supabase.auth.getUser().then(({ data, error }) => {
          if (error || !data.user) {
            if (!currentSession.user) syncSession(null);
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

