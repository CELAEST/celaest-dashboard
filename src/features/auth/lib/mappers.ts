import { User as SupabaseUser } from "@supabase/supabase-js";
import { AuthUser } from "./types";
import { parseRole, calculateEffectivePermissions } from "./permissions";

export function mapSupabaseUser(supabaseUser: SupabaseUser): AuthUser {
  const metadata = supabaseUser.user_metadata || {};
  const role = parseRole(metadata.role);

  // Calculate effective permissions (Role + Custom Scopes)
  const permissions = calculateEffectivePermissions(
    role,
    metadata.custom_scopes,
  );

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    name:
      metadata.name ||
      metadata.full_name ||
      supabaseUser.email?.split("@")[0] ||
      "Usuario",
    avatarUrl: metadata.avatar_url || metadata.picture,
    role,
    permissions,
    emailVerified: supabaseUser.email_confirmed_at != null,
    createdAt: supabaseUser.created_at,
    lastSignInAt: supabaseUser.last_sign_in_at,
  };
}
