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
