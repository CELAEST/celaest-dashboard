"use client";

import { useState, useEffect, useMemo } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { AuthState } from "../lib/types";
import { mapSupabaseUser } from "../lib/mappers";

/**
 * Hook to manage Supabase session state.
 * Returns the current AuthState based on Supabase session events.
 */
export function useAuthSession() {
  // Initialize Supabase Client first
  const supabase = useMemo(() => {
    try {
      return getSupabaseBrowserClient();
    } catch {
      console.error("Failed to initialize Supabase client");
      return null;
    }
  }, []);

  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: !!supabase, // Initialize directly based on client availability
    error: null,
  });

  // Helper to centralize state updates based on session
  const setSession = (session: Session | null) => {
    if (session?.user) {
      const user = mapSupabaseUser(session.user);
      setState({
        user,
        session: {
          user,
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: session.expires_at || 0,
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  useEffect(() => {
    if (!supabase) return;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Fallback to unauthenticated state on error
        setSession(null);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { state, setState, supabase };
}
