/**
 * Sistema de Roles y Permisos (RBAC)
 * Siguiendo principios SOLID:
 * - Single Responsibility: Cada tipo/función tiene una única responsabilidad
 * - Open/Closed: Extensible sin modificar el código existente
 * - Interface Segregation: Interfaces pequeñas y específicas
 */

// ==================== TIPOS BASE ====================

/**
 * Roles disponibles en el sistema
 * Ordenados por nivel de acceso (menor a mayor)
 */
export const ROLES = ['client', 'admin', 'super_admin'] as const
export type Role = typeof ROLES[number]

/**
 * Permisos granulares del sistema
 * Formato: 'resource:action'
 */
export const PERMISSIONS = {
  // Templates
  'templates:read': 'Ver plantillas',
  'templates:write': 'Crear/editar plantillas',
  'templates:delete': 'Eliminar plantillas',
  
  // Billing
  'billing:read': 'Ver facturación',
  'billing:write': 'Gestionar facturación',
  
  // Users
  'users:read': 'Ver usuarios',
  'users:manage': 'Gestionar usuarios',
  'users:delete': 'Eliminar usuarios',
  
  // Analytics
  'analytics:read': 'Ver analíticas',
  'analytics:export': 'Exportar analíticas',
  
  // Releases
  'releases:read': 'Ver releases',
  'releases:write': 'Crear/editar releases',
  'releases:publish': 'Publicar releases',
  
  // Marketplace
  'marketplace:read': 'Ver marketplace',
  'marketplace:purchase': 'Comprar en marketplace',
  'marketplace:sell': 'Vender en marketplace',
  
  // Assets
  'assets:read': 'Ver activos',
  'assets:write': 'Gestionar activos',
  
  // Licensing
  'licensing:read': 'Ver licencias',
  'licensing:manage': 'Gestionar licencias',
} as const

export type Permission = keyof typeof PERMISSIONS

// ==================== CONFIGURACIÓN DE ROLES ====================

/**
 * Matriz de permisos por rol
 * Cada rol hereda los permisos del rol inferior
 */
const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
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
    // Hereda de client
    'templates:read',
    'templates:write',
    'billing:read',
    'billing:write',
    'users:read',
    'analytics:read',
    'analytics:export',
    'releases:read',
    'releases:write',
    'marketplace:read',
    'marketplace:purchase',
    'marketplace:sell',
    'assets:read',
    'assets:write',
    'licensing:read',
    'licensing:manage',
  ],
  
  super_admin: [
    // Todos los permisos
    'templates:read',
    'templates:write',
    'templates:delete',
    'billing:read',
    'billing:write',
    'users:read',
    'users:manage',
    'users:delete',
    'analytics:read',
    'analytics:export',
    'releases:read',
    'releases:write',
    'releases:publish',
    'marketplace:read',
    'marketplace:purchase',
    'marketplace:sell',
    'assets:read',
    'assets:write',
    'licensing:read',
    'licensing:manage',
  ],
} as const

// ==================== FUNCIONES DE VERIFICACIÓN ====================

/**
 * Verifica si un rol tiene un permiso específico
 */
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
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
  return ROLE_PERMISSIONS[role] ?? []
}

/**
 * Compara niveles de roles (retorna true si roleA >= roleB)
 */
export function roleIsAtLeast(roleA: Role, roleB: Role): boolean {
  return ROLES.indexOf(roleA) >= ROLES.indexOf(roleB)
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
  const basePermissions = new Set(getRolePermissions(role))
  
  if (customScopes) {
    for (const [permission, enabled] of Object.entries(customScopes)) {
      if (isValidPermission(permission)) {
        if (enabled) {
          basePermissions.add(permission)
        } else {
          basePermissions.delete(permission)
        }
      }
    }
  }
  
  return Array.from(basePermissions)
}
