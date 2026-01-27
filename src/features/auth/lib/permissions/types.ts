import { Role, Permission } from './definitions'

import { ROLE_PERMISSIONS_SET } from './engine'
import { isValidPermission } from './validators'

// ==================== TIPOS DE USUARIO CON PERMISOS ====================

export interface UserPermissions {
  role: Role
  permissions: Permission[]
  customScopes?: Partial<Record<Permission, boolean>>
}

/**
 * Calcula los permisos efectivos de un usuario
 * Combina permisos del rol con scopes personalizados
 */
export function calculateEffectivePermissions(
  role: Role,
  customScopes?: Partial<Record<Permission, boolean>>
): Permission[] {
  // Start with a clone of the base Set for O(1) operations
  // Using the pre-computed Set is more efficient than new Set(Array)
  const basePermissions = new Set(ROLE_PERMISSIONS_SET[role] ?? [])
  
  if (customScopes) {
    for (const [permission, enabled] of Object.entries(customScopes)) {
      if (isValidPermission(permission)) {
        if (enabled) {
          basePermissions.add(permission as Permission)
        } else {
          basePermissions.delete(permission as Permission)
        }
      }
    }
  }
  
  return Array.from(basePermissions)
}
