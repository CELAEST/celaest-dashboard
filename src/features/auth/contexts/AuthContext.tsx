"use client";

/**
 * AuthContext refactored with Clean Architecture
 * - Responsibility: Authentication & Identity ONLY.
 * - Authorization (Permissions) is handled by useAuthorization hook.
 */

import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useShallow } from "zustand/react/shallow";
import { type AuthActions, type AuthState } from "../lib/types";
import { useAuthSession } from "../hooks/useAuthSession";
import { useAuthActions } from "../hooks/useAuthActions";
import { useUserSync } from "@/features/users/hooks/useUserSync";

// ==================== CONTEXT VALUE ====================

interface AuthContextValue extends AuthState, AuthActions {
  // Authorization helpers removed. Use useAuthorization() or useRole() instead.
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ==================== PROVIDER ====================

interface AuthProviderProps {
  children: ReactNode;
}

import { useAuthStore } from "../stores/useAuthStore";

export function AuthProvider({ children }: AuthProviderProps) {
  const { supabase } = useAuthSession();

  // Use selective subscription for performance
  const storeValues = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      session: state.session,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      isBackendSynced: state.isBackendSynced,
      error: state.error,
    })),
  );

  const actions = useAuthActions(supabase);

  // Keep React Query user profile fresh based on WS events
  useUserSync(storeValues.session?.accessToken);

  // Sync Socket Connection
  const accessToken = storeValues.session?.accessToken;
  React.useEffect(() => {
    import("@/lib/socket-client").then(({ socket }) => {
      if (accessToken) {
        socket.connect(accessToken);
      } else {
        socket.disconnect();
      }
    });
  }, [accessToken]);

  // Global unauthorized listener (from api-client)
  React.useEffect(() => {
    const handleUnauthorized = () => {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/auth")
      ) {
        actions.signOut();
      }
    };

    window.addEventListener("celaest:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("celaest:unauthorized", handleUnauthorized);
  }, [actions]);

  // ==================== VALUE ====================

  const value = useMemo<AuthContextValue>(
    () => ({
      ...storeValues,
      ...actions,
    }),
    [storeValues, actions],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
