/**
 * Hook que devuelve token y orgId para llamadas a celaest-back
 */
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";

export function useApiAuth() {
  const { session } = useAuth();
  // Selector acotado: solo suscribirse a currentOrg.id para evitar re-renders
  // cuando cambien campos irrelevantes del OrgStore (isLoading, lastFetched, etc.)
  const orgId = useOrgStore((s) => s.currentOrg?.id ?? null);

  return {
    token: session?.accessToken ?? null,
    orgId,
    isReady: !!session?.accessToken && !!orgId,
    isAuthReady: !!session?.accessToken,
  };
}

