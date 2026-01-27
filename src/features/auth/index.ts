// Re-export all auth-related modules
// Clean Architecture: Single entry point for the auth feature

// Providers & Context
export { AuthProvider, useAuth } from "./contexts/AuthContext";

// Hooks
export {
  useAuthorization,
  usePermissions,
  useRole,
  useProtectedAction,
  useResourceAccess,
} from "./hooks/useAuthorization";

// Types
export type { AuthUser as User } from "./lib/types";

// Permissions system
export {
  parseRole,
  calculateEffectivePermissions,
} from './lib/permissions'
export type { Role, Permission, UserPermissions } from './lib/permissions'

// Protected components
export * from './components/guards'

// Auth page component
export { AuthPage } from './components/AuthPage'
