import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

// Singleton pattern para el cliente del navegador
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Cliente de Supabase para el navegador (Client Components)
 * Usa cookies para manejar la sesión automáticamente
 */
export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  if (browserClient) {
    return browserClient
  }

  browserClient = createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  )

  return browserClient
}

/**
 * Hook-friendly export para usar en componentes
 */
export const supabase = typeof window !== 'undefined' 
  ? getSupabaseBrowserClient() 
  : null
