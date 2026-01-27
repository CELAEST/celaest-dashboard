"use client";

import React, { type ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Muestra contenido solo si el usuario está autenticado
 */
export function AuthGuard({ children, fallback = null }: ProtectedProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return fallback;
  }

  if (!user) {
    return fallback;
  }

  return <>{children}</>;
}
