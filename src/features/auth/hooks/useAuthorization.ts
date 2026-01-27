'use client'

/**
 * Hooks de autorización
 * Siguiendo Single Responsibility Principle - cada hook tiene una única función
 */

import { useCallback, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Permission, 
  Role, 
  roleHasPermission, 
  roleIsAtLeast,
  isAdminRole,
  isSuperAdminRole,
} from '../lib/permissions'

// ==================== HOOK DE PERMISOS ====================

/**
 * Hook para verificar permisos del usuario actual
 */
export function usePermissions() {
  const { user } = useAuth()
  
  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!user) return false
    // AuthUser now has 'permissions' array from types.ts
    // Check if permission is in user's granted permissions OR inferred from role
    return user.permissions.includes(permission) || roleHasPermission(user.role, permission)
  }, [user])
  
  const hasAllPermissions = useCallback((permissions: Permission[]): boolean => {
    if (!user) return false
    return permissions.every(p => hasPermission(p))
  }, [user, hasPermission])
  
  const hasAnyPermission = useCallback((permissions: Permission[]): boolean => {
    if (!user) return false
    return permissions.some(p => hasPermission(p))
  }, [user, hasPermission])
  
  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
  }
}

// ==================== HOOK DE ROLES ====================

/**
 * Hook para verificar roles del usuario actual
 */
export function useRole() {
  const { user } = useAuth()
  
  const role = user?.role ?? 'client'
  
  const isAtLeast = useCallback((requiredRole: Role): boolean => {
    return roleIsAtLeast(role, requiredRole)
  }, [role])
  
  const isAdmin = useMemo(() => isAdminRole(role), [role])
  const isSuperAdmin = useMemo(() => isSuperAdminRole(role), [role])
  const isClient = useMemo(() => role === 'client', [role])
  
  return {
    role,
    isAtLeast,
    isAdmin,
    isSuperAdmin,
    isClient,
  }
}

// ==================== HOOK DE AUTORIZACIÓN COMBINADO ====================

/**
 * Hook combinado para verificar autorización
 */
export function useAuthorization() {
  const { user, isLoading } = useAuth()
  const permissions = usePermissions()
  const roles = useRole()
  
  const isAuthorized = useCallback((
    options: {
      permission?: Permission
      permissions?: Permission[]
      anyPermission?: Permission[]
      role?: Role
    }
  ): boolean => {
    if (!user) return false
    
    // Verificar rol mínimo
    if (options.role && !roles.isAtLeast(options.role)) {
      return false
    }
    
    // Verificar permiso único
    if (options.permission && !permissions.hasPermission(options.permission)) {
      return false
    }
    
    // Verificar todos los permisos
    if (options.permissions && !permissions.hasAllPermissions(options.permissions)) {
      return false
    }
    
    // Verificar cualquier permiso
    if (options.anyPermission && !permissions.hasAnyPermission(options.anyPermission)) {
      return false
    }
    
    return true
  }, [user, roles, permissions])
  
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
    ...permissions,
    ...roles,
    isAuthorized,
  }
}

// ==================== HOOK PARA PROTEGER ACCIONES ====================

/**
 * Hook para crear acciones protegidas por permisos
 */
export function useProtectedAction<T extends (...args: unknown[]) => unknown>(
  action: T,
  requiredPermission: Permission
): T | (() => void) {
  const { hasPermission } = usePermissions()
  
  return useMemo(() => {
    if (hasPermission(requiredPermission)) {
      return action
    }
    return () => {
      console.warn(`Action blocked: missing permission "${requiredPermission}"`)
    }
  }, [action, hasPermission, requiredPermission]) as T | (() => void)
}

// ==================== HOOK PARA VERIFICAR ACCESO A RECURSOS ====================

/**
 * Hook para verificar si el usuario puede acceder a un recurso específico
 */
export function useResourceAccess(
  resourceOwnerId?: string,
  requiredPermission?: Permission
) {
  const { user } = useAuth()
  const { hasPermission } = usePermissions()
  const { isAdmin } = useRole()
  
  const canAccess = useMemo(() => {
    if (!user) return false
    
    // Los admins siempre pueden acceder
    if (isAdmin) return true
    
    // Verificar si es el dueño del recurso
    if (resourceOwnerId && user.id === resourceOwnerId) return true
    
    // Verificar permiso específico
    if (requiredPermission) return hasPermission(requiredPermission)
    
    return false
  }, [user, isAdmin, resourceOwnerId, requiredPermission, hasPermission])
  
  const canEdit = useMemo(() => {
    if (!user) return false
    if (isAdmin) return true
    if (resourceOwnerId && user.id === resourceOwnerId) return true
    return false
  }, [user, isAdmin, resourceOwnerId])
  
  const canDelete = useMemo(() => {
    if (!user) return false
    // Solo admins o el dueño pueden eliminar
    if (isAdmin) return true
    if (resourceOwnerId && user.id === resourceOwnerId) return true
    return false
  }, [user, isAdmin, resourceOwnerId])
  
  return {
    canAccess,
    canEdit,
    canDelete,
    isOwner: resourceOwnerId ? user?.id === resourceOwnerId : false,
  }
}
