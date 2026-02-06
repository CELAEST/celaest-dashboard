/**
 * Tipos de autenticación
 * Siguiendo Interface Segregation Principle
 */

import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import type { Role, Permission } from './permissions'

// ==================== TIPOS DE USUARIO ====================

/**
 * Usuario autenticado en el sistema
 */
export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string
  role: Role
  permissions: Permission[]
  emailVerified: boolean
  createdAt: string
  lastSignInAt?: string
}

/**
 * Metadata del usuario almacenada en Supabase
 */
export interface UserMetadata {
  name?: string
  avatar_url?: string
  role?: Role
  custom_scopes?: Partial<Record<Permission, boolean>>
}

// ==================== TIPOS DE SESIÓN ====================

export interface AuthSession {
  user: AuthUser
  accessToken: string
  refreshToken?: string
  expiresAt: number
}

// ==================== TIPOS DE RESULTADO ====================

export interface AuthResult<T = void> {
  success: boolean
  data?: T
  error?: AuthError
}

export interface AuthError {
  code: AuthErrorCode
  message: string
  details?: Record<string, unknown>
}

// ==================== TIPOS DE RESPUESTA BACKEND ====================

export interface SessionVerification {
  valid: boolean;
  user_id: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: UserProfile;
}

export interface UserOrganization {
  id: string;
  name: string;
  slug: string;
  role: string;
  is_default: boolean;
}

export interface UserOrganizationsResponse {
  organizations: UserOrganization[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_LOCKED'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'
  | 'FORBIDDEN'
  | 'UNAUTHORIZED'

// ==================== TIPOS DE CONTEXTO ====================

export interface AuthState {
  user: AuthUser | null
  session: AuthSession | null
  isLoading: boolean
  isAuthenticated: boolean
  isBackendSynced: boolean // Indica si el backend ha verificado la sesión
  error: AuthError | null
}


export interface AuthActions {
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string, name: string) => Promise<AuthResult>
  signInWithGoogle: () => Promise<AuthResult>
  signInWithGitHub: () => Promise<AuthResult>
  signOut: () => Promise<AuthResult>
  refreshSession: () => Promise<AuthResult<AuthSession>>
}

export interface AuthHelpers {
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  isAdmin: () => boolean
  isSuperAdmin: () => boolean
  canAccessRoute: (route: string) => boolean
}

export type AuthContextType = AuthState & AuthActions & AuthHelpers

// ==================== MAPPERS ====================

/**
 * Convierte un usuario de Supabase a AuthUser
 */
export function mapSupabaseUserToAuthUser(
  supabaseUser: SupabaseUser,
  permissions: Permission[]
): AuthUser {
  const metadata = supabaseUser.user_metadata as UserMetadata | undefined
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    name: metadata?.name ?? supabaseUser.email?.split('@')[0] ?? 'Usuario',
    avatarUrl: metadata?.avatar_url,
    role: metadata?.role ?? 'client',
    permissions,
    emailVerified: supabaseUser.email_confirmed_at != null,
    createdAt: supabaseUser.created_at,
    lastSignInAt: supabaseUser.last_sign_in_at ?? undefined,
  }
}

/**
 * Convierte una sesión de Supabase a AuthSession
 */
export function mapSupabaseSessionToAuthSession(
  session: Session,
  user: AuthUser
): AuthSession {
  return {
    user,
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ?? Date.now() / 1000 + 3600,
  }
}

// ==================== ERROR HELPERS ====================

const ERROR_MESSAGES: Record<string, AuthErrorCode> = {
  'Invalid login credentials': 'INVALID_CREDENTIALS',
  'Email not confirmed': 'EMAIL_NOT_VERIFIED',
  'User not found': 'USER_NOT_FOUND',
  'Too many requests': 'RATE_LIMITED',
}

export function mapSupabaseError(error: { message: string }): AuthError {
  const code = ERROR_MESSAGES[error.message] ?? 'UNKNOWN_ERROR'
  
  return {
    code,
    message: getErrorMessage(code),
    details: { originalMessage: error.message },
  }
}

export function getErrorMessage(code: AuthErrorCode): string {
  const messages: Record<AuthErrorCode, string> = {
    INVALID_CREDENTIALS: 'Credenciales inválidas. Por favor verifica tu email y contraseña.',
    USER_NOT_FOUND: 'No se encontró una cuenta con ese email.',
    EMAIL_NOT_VERIFIED: 'Por favor verifica tu email antes de iniciar sesión.',
    ACCOUNT_LOCKED: 'Tu cuenta ha sido bloqueada temporalmente. Intenta más tarde.',
    RATE_LIMITED: 'Demasiados intentos. Por favor espera unos minutos.',
    NETWORK_ERROR: 'Error de conexión. Por favor verifica tu internet.',
    UNKNOWN_ERROR: 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
    FORBIDDEN: 'No tienes permiso para realizar esta acción.',
    UNAUTHORIZED: 'Debes iniciar sesión para continuar.',
  }
  
  return messages[code]
}
