// Re-export all auth-related modules
// Clean Architecture: Single entry point for the auth feature

// Context and Provider
export { AuthProvider, useAuth } from './contexts/AuthContext'
export type { User, UserScopes } from './contexts/AuthContext'

// Permissions system
export {
  ROLES,
  PERMISSIONS,
  roleHasPermission,
  roleHasAllPermissions,
  roleHasAnyPermission,
  getRolePermissions,
  roleIsAtLeast,
  isAdminRole,
  isSuperAdminRole,
  isValidRole,
  isValidPermission,
  parseRole,
  calculateEffectivePermissions,
} from './lib/permissions'
export type { Role, Permission, UserPermissions } from './lib/permissions'

// Authorization hooks
export {
  usePermissions,
  useRole,
  useAuthorization,
  useProtectedAction,
  useResourceAccess,
} from './hooks/useAuthorization'

// Protected components
export {
  AuthGuard,
  PermissionGuard,
  PermissionsGuard,
  RoleGuard,
  AdminGuard,
  SuperAdminGuard,
  withAuth,
  withPermission,
  withRole,
  Forbidden,
} from './components/ProtectedComponents'

// Auth page component
export { AuthPage } from './components/AuthPage'
