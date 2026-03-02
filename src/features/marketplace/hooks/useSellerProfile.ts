import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SellerProfile } from "../types";
import { marketplaceApi } from "../api/marketplace.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { useApiAuth } from "@/lib/use-api-auth";
import { toast } from "sonner";

/**
 * useSellerProfile - Hook para perfil de vendedor público.
 */
export function useSellerProfile(sellerId: string | null) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.marketplace.seller(sellerId || "none"),
    queryFn: () => sellerId ? marketplaceApi.getSellerProfile(sellerId) : null,
    enabled: !!sellerId,
  });

  return {
    seller: data,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refresh: refetch,
  };
}

/**
 * useUpdateSellerProfile - Hook para actualizar el perfil propio (Optimistic)
 */
export function useUpdateSellerProfile() {
  const { token, orgId } = useApiAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<SellerProfile>) => {
      if (!token || !orgId) throw new Error("Auth required");
      return marketplaceApi.updateProfile(data, token, orgId);
    },
    onMutate: async (newProfile) => {
      // Cancelar refetches salientes
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.marketplace.seller("none") });

      // Snapshot del valor previo
      const previousProfiles = queryClient.getQueriesData<SellerProfile>({ queryKey: QUERY_KEYS.marketplace.seller("none") });

      // Actualización optimista de todas las instancias del perfil
      queryClient.setQueriesData({ queryKey: QUERY_KEYS.marketplace.seller("none") }, (old: SellerProfile | undefined) => {
        if (!old) return old;
        return { ...old, ...newProfile };
      });

      return { previousProfiles };
    },
    onError: (_err, _newProfile, context) => {
      // Rollback si falla
      if (context?.previousProfiles) {
        context.previousProfiles.forEach(([key, profile]) => {
          queryClient.setQueryData(key, profile);
        });
      }
      toast.error(_err.message || "Failed to update profile");
    },
    onSuccess: () => {
      toast.success("Perfil de vendedor actualizado");
    },
    onSettled: () => {
      // Sincronizar con backend si o si
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.seller("none") });
    },
  });
}
