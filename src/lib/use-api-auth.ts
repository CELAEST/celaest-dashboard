/**
 * Hook que devuelve token y orgId para llamadas a celaest-back
 */
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useOrg } from "@/features/shared/contexts/OrgContext";

export function useApiAuth() {
  const { session, isBackendSynced } = useAuth();
  const { org } = useOrg();

  return {
    token: session?.accessToken ?? null,
    orgId: org?.id ?? null,
    // isReady solo es true si hay sesion, el backend la verificó y hay una organización seleccionada
    isReady: !!session?.accessToken && isBackendSynced && !!org?.id,
    isAuthReady: !!session?.accessToken && isBackendSynced,
  };
}

