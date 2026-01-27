import { Role, Permission } from './definitions'
import { SCOPED_PERMISSIONS, ROLE_HIERARCHY } from './config'

// ====================CÁLCULO DE PERMISOS (OPTIMIZACIÓN) ====================

/**
 * Construcción recursiva de permisos heredados
 * Se ejecuta una sola vez al iniciar la aplicación.
 */
function buildRolePermissions(role: Role): Set<Permission> {
  const permissions = new Set(SCOPED_PERMISSIONS[role])
  let currentRole = ROLE_HIERARCHY[role]
  
  while (currentRole) {
    for (const p of SCOPED_PERMISSIONS[currentRole]) {
      permissions.add(p)
    }
    currentRole = ROLE_HIERARCHY[currentRole]
  }
  
  return permissions
}

// Cache O(1) inmutable de todos los permisos calculados
export const ROLE_PERMISSIONS_SET: Record<Role, ReadonlySet<Permission>> = Object.freeze({
  client: buildRolePermissions('client'),
  admin: buildRolePermissions('admin'),
  super_admin: buildRolePermissions('super_admin'),
})
