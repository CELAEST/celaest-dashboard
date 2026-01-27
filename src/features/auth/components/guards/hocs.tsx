"use client";

import React, { type ComponentType } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { usePermissions } from "../../hooks/useAuthorization";
import {
  type Permission,
  type Role,
  roleIsAtLeast,
} from "../../lib/permissions";

/**
 * HOC que protege un componente requiriendo autenticación
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  FallbackComponent?: ComponentType,
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    if (!user) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    return <Component {...props} />;
  };
}

/**
 * HOC que protege un componente requiriendo un permiso
 */
export function withPermission<P extends object>(
  Component: ComponentType<P>,
  permission: Permission,
  FallbackComponent?: ComponentType,
) {
  return function PermissionProtectedComponent(props: P) {
    const { user, isLoading } = useAuth();
    const { hasPermission } = usePermissions();

    if (isLoading) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    if (!user || !hasPermission(permission)) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    return <Component {...props} />;
  };
}

/**
 * HOC que protege un componente requiriendo un rol mínimo
 */
export function withRole<P extends object>(
  Component: ComponentType<P>,
  role: Role,
  FallbackComponent?: ComponentType,
) {
  return function RoleProtectedComponent(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    if (!user || !roleIsAtLeast(user.role, role)) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    return <Component {...props} />;
  };
}
