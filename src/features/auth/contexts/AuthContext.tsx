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
import { type AuthActions, type AuthState } from "../lib/types";
import { useAuthSession } from "../hooks/useAuthSession";
import { useAuthActions } from "../hooks/useAuthActions";

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
  const store = useAuthStore();
  const actions = useAuthActions(supabase);

  // ==================== VALUE ====================

  const value = useMemo<AuthContextValue>(
    () => ({
      ...store,
      ...actions,
    }),
    [store, actions],
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
