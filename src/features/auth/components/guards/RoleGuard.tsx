"use client";

import React, { type ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { type Role, roleIsAtLeast } from "../../lib/permissions";

interface RoleGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  role: Role;
}

/**
 * Muestra contenido solo si el usuario tiene el rol mínimo requerido
 */
export function RoleGuard({ children, role, fallback = null }: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return fallback;
  }

  if (!user || !roleIsAtLeast(user.role, role)) {
    return fallback;
  }

  return <>{children}</>;
}
