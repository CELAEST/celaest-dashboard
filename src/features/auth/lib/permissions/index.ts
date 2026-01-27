/**
 * Permissions Module Facade
 * Expone la API pública del sistema de permisos.
 */

// Definitions (Types & Constants)
export * from './definitions'

// Config (Single Source of Truth)
export { ROLE_HIERARCHY, SCOPED_PERMISSIONS } from './config'

// Guards (Verification Logic)
export * from './guards'

// Validators (Input Validation)
export * from './validators'

// Types Helper (User Permissions)
export * from './types'
