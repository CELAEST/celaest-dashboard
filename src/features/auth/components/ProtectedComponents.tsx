'use client'

/**
 * Componentes de protección para autorización
 * Siguiendo Open/Closed Principle - extensibles sin modificar
 */

import React, { type ReactNode, type ComponentType } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { type Permission, type Role, roleIsAtLeast } from '../lib/permissions'

// ==================== TIPOS ====================

interface ProtectedProps {
  children: ReactNode
  fallback?: ReactNode
}

interface PermissionGuardProps extends ProtectedProps {
  permission: Permission
}

interface PermissionsGuardProps extends ProtectedProps {
  permissions: Permission[]
  requireAll?: boolean
}

interface RoleGuardProps extends ProtectedProps {
  role: Role
}

// ==================== COMPONENTES ====================

/**
 * Muestra contenido solo si el usuario está autenticado
 */
export function AuthGuard({ children, fallback = null }: ProtectedProps) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return fallback
  }
  
  if (!user) {
    return fallback
  }
  
  return <>{children}</>
}

/**
 * Muestra contenido solo si el usuario tiene un permiso específico
 */
export function PermissionGuard({ 
  children, 
  permission, 
  fallback = null 
}: PermissionGuardProps) {
  const { user, hasScope, loading } = useAuth()
  
  if (loading) {
    return fallback
  }
  
  if (!user || !hasScope(permission)) {
    return fallback
  }
  
  return <>{children}</>
}

/**
 * Muestra contenido solo si el usuario tiene los permisos especificados
 */
export function PermissionsGuard({ 
  children, 
  permissions, 
  requireAll = true,
  fallback = null 
}: PermissionsGuardProps) {
  const { user, hasScope, loading } = useAuth()
  
  if (loading) {
    return fallback
  }
  
  if (!user) {
    return fallback
  }
  
  const hasPermissions = requireAll 
    ? permissions.every(p => hasScope(p))
    : permissions.some(p => hasScope(p))
  
  if (!hasPermissions) {
    return fallback
  }
  
  return <>{children}</>
}

/**
 * Muestra contenido solo si el usuario tiene el rol mínimo requerido
 */
export function RoleGuard({ 
  children, 
  role, 
  fallback = null 
}: RoleGuardProps) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return fallback
  }
  
  if (!user || !roleIsAtLeast(user.role, role)) {
    return fallback
  }
  
  return <>{children}</>
}

/**
 * Muestra contenido solo para administradores
 */
export function AdminGuard({ children, fallback = null }: ProtectedProps) {
  const { isAdmin, loading } = useAuth()
  
  if (loading) {
    return fallback
  }
  
  if (!isAdmin()) {
    return fallback
  }
  
  return <>{children}</>
}

/**
 * Muestra contenido solo para super administradores
 */
export function SuperAdminGuard({ children, fallback = null }: ProtectedProps) {
  const { isSuperAdmin, loading } = useAuth()
  
  if (loading) {
    return fallback
  }
  
  if (!isSuperAdmin()) {
    return fallback
  }
  
  return <>{children}</>
}

// ==================== HOCs ====================

/**
 * HOC que protege un componente requiriendo autenticación
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  FallbackComponent?: ComponentType
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()
    
    if (loading) {
      return FallbackComponent ? <FallbackComponent /> : null
    }
    
    if (!user) {
      return FallbackComponent ? <FallbackComponent /> : null
    }
    
    return <Component {...props} />
  }
}

/**
 * HOC que protege un componente requiriendo un permiso
 */
export function withPermission<P extends object>(
  Component: ComponentType<P>,
  permission: Permission,
  FallbackComponent?: ComponentType
) {
  return function PermissionProtectedComponent(props: P) {
    const { user, hasScope, loading } = useAuth()
    
    if (loading) {
      return FallbackComponent ? <FallbackComponent /> : null
    }
    
    if (!user || !hasScope(permission)) {
      return FallbackComponent ? <FallbackComponent /> : null
    }
    
    return <Component {...props} />
  }
}

/**
 * HOC que protege un componente requiriendo un rol mínimo
 */
export function withRole<P extends object>(
  Component: ComponentType<P>,
  role: Role,
  FallbackComponent?: ComponentType
) {
  return function RoleProtectedComponent(props: P) {
    const { user, loading } = useAuth()
    
    if (loading) {
      return FallbackComponent ? <FallbackComponent /> : null
    }
    
    if (!user || !roleIsAtLeast(user.role, role)) {
      return FallbackComponent ? <FallbackComponent /> : null
    }
    
    return <Component {...props} />
  }
}

// ==================== COMPONENTE DE ERROR/FORBIDDEN ====================

interface ForbiddenProps {
  message?: string
  showLogin?: boolean
}

/**
 * Componente para mostrar cuando el acceso está prohibido
 */
export function Forbidden({ 
  message = 'No tienes permiso para acceder a esta sección.',
  showLogin = true 
}: ForbiddenProps) {
  const { user } = useAuth()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg 
          className="w-8 h-8 text-red-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{message}</p>
      {!user && showLogin && (
        <p className="text-sm text-gray-400">
          Por favor, inicia sesión para continuar.
        </p>
      )}
    </div>
  )
}
