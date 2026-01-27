"use client";

import React, { type ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { isAdminRole, isSuperAdminRole } from "../../lib/permissions";

interface ProtectedProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Muestra contenido solo para administradores
 */
export function AdminGuard({ children, fallback = null }: ProtectedProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return fallback;
  }

  if (!user || !isAdminRole(user.role)) {
    return fallback;
  }

  return <>{children}</>;
}

/**
 * Muestra contenido solo para super administradores
 */
export function SuperAdminGuard({ children, fallback = null }: ProtectedProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return fallback;
  }

  if (!user || !isSuperAdminRole(user.role)) {
    return fallback;
  }

  return <>{children}</>;
}
