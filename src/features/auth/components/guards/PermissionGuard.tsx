"use client";

import React, { type ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { usePermissions } from "../../hooks/useAuthorization";
import { type Permission } from "../../lib/permissions";

interface PermissionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  permission: Permission;
}

interface PermissionsGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  permissions: Permission[];
  requireAll?: boolean;
}

/**
 * Muestra contenido solo si el usuario tiene un permiso específico
 */
export function PermissionGuard({
  children,
  permission,
  fallback = null,
}: PermissionGuardProps) {
  const { user, isLoading } = useAuth();
  const { hasPermission } = usePermissions();

  if (isLoading) {
    return fallback;
  }

  if (!user || !hasPermission(permission)) {
    return fallback;
  }

  return <>{children}</>;
}

/**
 * Muestra contenido solo si el usuario tiene los permisos especificados
 */
export function PermissionsGuard({
  children,
  permissions,
  requireAll = true,
  fallback = null,
}: PermissionsGuardProps) {
  const { user, isLoading } = useAuth();
  const { hasAllPermissions, hasAnyPermission } = usePermissions();

  if (isLoading) {
    return fallback;
  }

  if (!user) {
    return fallback;
  }

  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
}
