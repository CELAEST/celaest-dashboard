/**
 * @deprecated Use @/lib/supabase/client or @/lib/supabase/server instead
 * Este archivo se mantiene por compatibilidad hacia atrás
 */

import { getSupabaseBrowserClient } from './supabase/client'

// Re-export para compatibilidad
export const supabase = typeof window !== 'undefined' 
  ? getSupabaseBrowserClient() 
  : null

// Para imports que esperan el cliente directamente
export { getSupabaseBrowserClient } from './supabase/client'
export { getSupabaseServerClient, getSupabaseAdminClient } from './supabase/server'

