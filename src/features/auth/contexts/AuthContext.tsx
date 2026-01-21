'use client'

/**
 * AuthContext refactorizado con Clean Architecture
 * - Separación de responsabilidades
 * - Tipos estrictos
 * - Manejo de errores robusto
 * - Seguridad mejorada
 */

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback,
  useMemo,
  type ReactNode 
} from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { User as SupabaseUser, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { 
  type Role,
  type Permission,
  parseRole,
  calculateEffectivePermissions,
  roleHasPermission,
} from '../lib/permissions'

// ==================== TIPOS ====================

export type UserScopes = Partial<Record<Permission, boolean>>

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  role: Role
  scopes: UserScopes
  emailVerified: boolean
}

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

interface SignInResult {
  success: boolean
  error?: string
}

interface AuthContextValue extends AuthState {
  // Actions
  signIn: (email: string, password: string) => Promise<SignInResult>
  signUp: (email: string, password: string, name: string) => Promise<SignInResult>
  signInWithGoogle: () => Promise<SignInResult>
  signInWithGitHub: () => Promise<SignInResult>
  signOut: () => Promise<void>
  
  // Permission helpers
  hasScope: (scope: Permission) => boolean
  hasAnyScope: (scopes: Permission[]) => boolean
  hasAllScopes: (scopes: Permission[]) => boolean
  isAdmin: () => boolean
  isSuperAdmin: () => boolean
}

// ==================== CONTEXTO ====================

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ==================== HELPER FUNCTIONS ====================

function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  const metadata = supabaseUser.user_metadata || {}
  const role = parseRole(metadata.role)
  
  // Calcular scopes basados en rol + scopes personalizados
  const effectivePermissions = calculateEffectivePermissions(role, metadata.custom_scopes)
  const scopes: UserScopes = {}
  for (const permission of effectivePermissions) {
    scopes[permission] = true
  }
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: metadata.name || metadata.full_name || supabaseUser.email?.split('@')[0] || 'Usuario',
    avatarUrl: metadata.avatar_url || metadata.picture,
    role,
    scopes,
    emailVerified: supabaseUser.email_confirmed_at != null,
  }
}

function getAuthErrorMessage(error: { message: string; status?: number }): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Credenciales inválidas. Verifica tu email y contraseña.',
    'Email not confirmed': 'Por favor verifica tu email antes de iniciar sesión.',
    'User already registered': 'Este email ya está registrado.',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
    'Unable to validate email address: invalid format': 'El formato del email no es válido.',
  }
  
  return errorMap[error.message] || error.message || 'Ocurrió un error inesperado.'
}

// ==================== PROVIDER ====================

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false,
  })

  // Inicializar cliente de Supabase
  const supabase = useMemo(() => {
    try {
      return getSupabaseBrowserClient()
    } catch {
      console.error('Failed to initialize Supabase client')
      return null
    }
  }, [])

  // Cargar sesión inicial
  useEffect(() => {
    if (!supabase) {
      setState(prev => ({ ...prev, loading: false, initialized: true }))
      return
    }

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setState({
            user: mapSupabaseUser(session.user),
            loading: false,
            initialized: true,
          })
        } else {
          setState({
            user: null,
            loading: false,
            initialized: true,
          })
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        setState({
          user: null,
          loading: false,
          initialized: true,
        })
      }
    }

    initializeAuth()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          setState(prev => ({
            ...prev,
            user: mapSupabaseUser(session.user),
            loading: false,
          }))
        } else {
          setState(prev => ({
            ...prev,
            user: null,
            loading: false,
          }))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // ==================== ACTIONS ====================

  const signIn = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    if (!supabase) {
      return { success: false, error: 'Servicio no disponible' }
    }

    try {
      setState(prev => ({ ...prev, loading: true }))
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        return { success: false, error: getAuthErrorMessage(error) }
      }

      if (data.user) {
        setState(prev => ({
          ...prev,
          user: mapSupabaseUser(data.user),
          loading: false,
        }))
        return { success: true }
      }

      return { success: false, error: 'Error al iniciar sesión' }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'Error de conexión' }
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [supabase])

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    name: string
  ): Promise<SignInResult> => {
    if (!supabase) {
      return { success: false, error: 'Servicio no disponible' }
    }

    try {
      setState(prev => ({ ...prev, loading: true }))
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
            role: 'client', // Rol por defecto siempre es client
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { success: false, error: getAuthErrorMessage(error) }
      }

      if (data.user) {
        return { success: true }
      }

      return { success: false, error: 'Error al crear la cuenta' }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: 'Error de conexión' }
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [supabase])

  const signInWithGoogle = useCallback(async (): Promise<SignInResult> => {
    if (!supabase) {
      return { success: false, error: 'Servicio no disponible' }
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        return { success: false, error: getAuthErrorMessage(error) }
      }

      return { success: true }
    } catch (error) {
      console.error('Google sign in error:', error)
      return { success: false, error: 'Error al conectar con Google' }
    }
  }, [supabase])

  const signInWithGitHub = useCallback(async (): Promise<SignInResult> => {
    if (!supabase) {
      return { success: false, error: 'Servicio no disponible' }
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      })

      if (error) {
        return { success: false, error: getAuthErrorMessage(error) }
      }

      return { success: true }
    } catch (error) {
      console.error('GitHub sign in error:', error)
      return { success: false, error: 'Error al conectar con GitHub' }
    }
  }, [supabase])

  const signOut = useCallback(async (): Promise<void> => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      setState({
        user: null,
        loading: false,
        initialized: true,
      })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }, [supabase])

  // ==================== PERMISSION HELPERS ====================

  const hasScope = useCallback((scope: Permission): boolean => {
    if (!state.user) return false
    return state.user.scopes[scope] === true || roleHasPermission(state.user.role, scope)
  }, [state.user])

  const hasAnyScope = useCallback((scopes: Permission[]): boolean => {
    return scopes.some(scope => hasScope(scope))
  }, [hasScope])

  const hasAllScopes = useCallback((scopes: Permission[]): boolean => {
    return scopes.every(scope => hasScope(scope))
  }, [hasScope])

  const isAdmin = useCallback((): boolean => {
    return state.user?.role === 'admin' || state.user?.role === 'super_admin'
  }, [state.user])

  const isSuperAdmin = useCallback((): boolean => {
    return state.user?.role === 'super_admin'
  }, [state.user])

  // ==================== CONTEXT VALUE ====================

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    hasScope,
    hasAnyScope,
    hasAllScopes,
    isAdmin,
    isSuperAdmin,
  }), [
    state,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    hasScope,
    hasAnyScope,
    hasAllScopes,
    isAdmin,
    isSuperAdmin,
  ])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ==================== HOOK ====================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
