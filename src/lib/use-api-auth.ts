/**
 * Hook que devuelve token y orgId para llamadas a celaest-back
 */
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useOrg } from "@/features/shared/contexts/OrgContext";

export function useApiAuth() {
  const { session } = useAuth();
  const { org } = useOrg();

  return {
    token: session?.accessToken ?? null,
    orgId: org?.id ?? null,
    isReady: !!session?.accessToken && !!org?.id,
  };
}
