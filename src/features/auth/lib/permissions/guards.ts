import { Role, Permission } from './definitions'
import { ROLE_PERMISSIONS_SET } from './engine'
import { ROLE_HIERARCHY } from './config'

// ==================== FUNCIONES DE VERIFICACIÓN (PUBLIC API) ====================

/**
 * Verifica si un rol tiene un permiso específico
 * Optimized: O(1) complexity using Set lookup
 */
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS_SET[role]?.has(permission) ?? false
}

/**
 * Verifica si un rol tiene todos los permisos especificados
 */
export function roleHasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => roleHasPermission(role, permission))
}

/**
 * Verifica si un rol tiene al menos uno de los permisos especificados
 */
export function roleHasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => roleHasPermission(role, permission))
}

/**
 * Obtiene todos los permisos de un rol
 */
export function getRolePermissions(role: Role): readonly Permission[] {
  return Array.from(ROLE_PERMISSIONS_SET[role] ?? [])
}

/**
 * Compara niveles de roles (retorna true si roleA >= roleB)
 * Robust: Uses hierarchy source of truth instead of fragile array index
 */
export function roleIsAtLeast(roleA: Role, roleB: Role): boolean {
  let current: Role | null = roleA
  while (current) {
    if (current === roleB) return true
    current = ROLE_HIERARCHY[current]
  }
  return false
}

/**
 * Verifica si un rol es administrador (admin o super_admin)
 */
export function isAdminRole(role: Role): boolean {
  return role === 'admin' || role === 'super_admin'
}

/**
 * Verifica si un rol es super administrador
 */
export function isSuperAdminRole(role: Role): boolean {
  return role === 'super_admin'
}
