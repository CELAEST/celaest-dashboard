import { ROLES, PERMISSIONS, Role, Permission } from './definitions'

// ==================== VALIDADORES ====================

/**
 * Valida que un string sea un rol válido
 */
export function isValidRole(value: unknown): value is Role {
  return typeof value === 'string' && ROLES.includes(value as Role)
}

/**
 * Valida que un string sea un permiso válido
 */
export function isValidPermission(value: unknown): value is Permission {
  return typeof value === 'string' && value in PERMISSIONS
}

/**
 * Parsea un rol de forma segura, retornando 'client' por defecto
 */
export function parseRole(value: unknown): Role {
  return isValidRole(value) ? value : 'client'
}
