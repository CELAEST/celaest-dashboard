/**
 * Hook que devuelve token y orgId para llamadas a celaest-back
 */
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";

export function useApiAuth() {
  const { session } = useAuth();
  const { currentOrg: org } = useOrgStore();

  return {
    token: session?.accessToken ?? null,
    orgId: org?.id ?? null,
    // isReady requires a valid Supabase JWT and a selected org.
    // isBackendSynced is intentionally excluded: the backend middleware validates
    // the JWT on every request anyway, so gating purchases on the proactive
    // verifySession call only creates spurious "Preparando sesión" blocks when
    // the backend is briefly slow or the proactive check races with the user.
    isReady: !!session?.accessToken && !!org?.id,
    isAuthReady: !!session?.accessToken,
  };
}

