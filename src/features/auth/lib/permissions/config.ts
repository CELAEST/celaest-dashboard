import { Role, Permission } from './definitions'

// ==================== CONFIGURACIÓN DE ROLES (SINGLE SOURCE OF TRUTH) ====================

/**
 * Jerarquía de roles
 * Define quién hereda de quién
 */
export const ROLE_HIERARCHY: Record<Role, Role | null> = {
  client: null,
  admin: 'client',      // Admin hereda todo de Client
  super_admin: 'admin', // Super Admin hereda todo de Admin
} as const

/**
 * Permisos ESPECÍFICOS por rol
 * Solo definimos los permisos ADICIONALES que tiene cada rol.
 * La herencia se calcula automáticamente.
 */
export const SCOPED_PERMISSIONS: Record<Role, readonly Permission[]> = {
  client: [
    'templates:read',
    'billing:read',
    'analytics:read',
    'releases:read',
    'marketplace:read',
    'marketplace:purchase',
    'assets:read',
    'licensing:read',
  ],
  
  admin: [
    'templates:write',
    'billing:write',
    'users:read',
    'analytics:export',
    'releases:write',
    'marketplace:sell',
    'assets:write',
    'licensing:manage',
  ],
  
  super_admin: [
    'templates:delete',
    'users:manage',
    'users:delete',
    'releases:publish',
  ],
} as const
