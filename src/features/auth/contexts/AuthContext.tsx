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

export function AuthProvider({ children }: AuthProviderProps) {
  const { state, setState, supabase } = useAuthSession();
  const actions = useAuthActions(supabase, setState);

  // ==================== VALUE ====================

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      ...actions,
    }),
    [state, actions],
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
