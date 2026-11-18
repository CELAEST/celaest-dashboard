"use client";

import { useCallback, useEffect, useMemo } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { mapSupabaseUser } from "../lib/mappers";
import { isJwtNearOrPastExpiry, recoverDashboardSession } from "../lib/sessionRefresh";
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

    let isMounted = true;

    const readPersistedStoreSession = (): {
      user: NonNullable<ReturnType<typeof useAuthStore.getState>["user"]>;
      session: NonNullable<ReturnType<typeof useAuthStore.getState>["session"]>;
    } | null => {
      const inMemory = useAuthStore.getState();
      if (inMemory.session?.accessToken && inMemory.user) {
        return { user: inMemory.user, session: inMemory.session };
      }
      if (typeof window === "undefined") return null;
      try {
        const raw = localStorage.getItem("celaest-auth-storage");
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const storedSession = parsed?.state?.session;
        const storedUser = parsed?.state?.user || storedSession?.user;
        if (storedSession?.accessToken && storedUser) {
          return { user: storedUser, session: storedSession };
        }
      } catch {
        // ignore storage parse errors
      }
      return null;
    };

    const ensureFreshSupabaseSession = async (verifiedUser: Session["user"]) => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        let activeSession = sessionData?.session ?? null;
        if (!activeSession) return;

        const expiresAtMs = (activeSession.expires_at ?? 0) * 1000;
        if (expiresAtMs > 0 && expiresAtMs <= Date.now() + 120_000) {
          const { data: refreshedData } = await supabase.auth.refreshSession();
          if (refreshedData?.session) {
            activeSession = refreshedData.session;
          }
        }

        if (!isMounted) return;
        const currentStore = useAuthStore.getState();
        if (
          !currentStore.isAuthenticated ||
          currentStore.session?.accessToken !== activeSession.access_token ||
          currentStore.session?.refreshToken !== activeSession.refresh_token
        ) {
          syncSession(buildVerifiedSession(activeSession, verifiedUser));
        }
      } catch (err) {
        logger.warn("[useAuthSession] Session freshness sync warning:", err);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, currentSession: Session | null) => {
        if (!isMounted) return;
        if (!currentSession) {
          const persisted = readPersistedStoreSession();
          // Preserve active CELAEST 24h session if Supabase emits a background SIGNED_OUT
          // (e.g. when entering Lingua or using a backend-issued 24h JWT).
          // Explicit user signOut() already clears localStorage before reset().
          if (
            persisted?.session?.accessToken &&
            !isJwtNearOrPastExpiry(persisted.session.accessToken, 5)
          ) {
            if (!useAuthStore.getState().session?.accessToken) {
              setAuth(persisted);
            }
            return;
          }
          if (event === "SIGNED_OUT" || !persisted?.session?.accessToken) {
            syncSession(null);
            return;
          }
          if (!useAuthStore.getState().session?.accessToken) {
            setAuth(persisted);
          }
          return;
        }

        // Fast-path: Sincronizar inmediatamente con currentSession para eliminar latencia en la UI
        if (currentSession.user) {
          syncSession(currentSession);
        }

        void supabase.auth.getUser().then(({ data, error }) => {
          if (!isMounted) return;
          if (error || !data.user) {
            if (!currentSession.user) syncSession(null);
            return;
          }
          syncSession(buildVerifiedSession(currentSession, data.user));
        });
      },
    );

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
          const persisted = readPersistedStoreSession();
          const storedToken = persisted?.session?.accessToken;
          if (persisted && storedToken) {
            if (!useAuthStore.getState().session?.accessToken) {
              setAuth(persisted);
            }
            try {
              const { authService } = await import("../services/auth.service");
              const verified = await authService.verifySession(storedToken);
              if (verified?.valid) {
                setBackendSynced(true);
                return;
              }
            } catch {
              const expiresAtMs = (persisted.session.expiresAt || 0) * 1000;
              if (!expiresAtMs || expiresAtMs > Date.now()) {
                return;
              }
            }
          }
          syncSession(null);
        } else {
          // Ensure Zustand store + localStorage mirror the latest refreshed Supabase token
          await ensureFreshSupabaseSession(userData.user);
        }
      } catch (error: unknown) {
        logger.error("Failed to initialize auth:", error);
        reset();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const handleVisibilityOrFocus = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      const persisted = readPersistedStoreSession();
      const activeTok = persisted?.session?.accessToken;
      if (activeTok && isJwtNearOrPastExpiry(activeTok, 15 * 60)) {
        void recoverDashboardSession(activeTok);
      }
      void supabase.auth.getUser().then(({ data, error }) => {
        if (!error && data.user && isMounted) {
          void ensureFreshSupabaseSession(data.user);
        }
      });
    };

    void initializeAuth();
    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleVisibilityOrFocus);
      document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    }

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", handleVisibilityOrFocus);
        document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      }
    };
  }, [supabase, setLoading, reset, syncSession, setAuth, buildVerifiedSession, setBackendSynced]);


  return { supabase };
}

