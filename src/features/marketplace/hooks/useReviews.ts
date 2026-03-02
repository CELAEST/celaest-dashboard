import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { CreateReviewInput } from "../types";
import { marketplaceApi } from "../api/marketplace.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { toast } from "sonner";

export function useReviews() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ productId, rating, comment }: { productId: string, rating: number, comment: string }) => {
      if (!session?.accessToken) throw new Error("Debes iniciar sesión para enviar una reseña");
      
      const input: CreateReviewInput = {
        product_id: productId,
        rating,
        comment,
      };
      return marketplaceApi.submitReview(productId, input, session.accessToken);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.detail(variables.productId) });
      toast.success("Reseña enviada exitosamente");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al enviar reseña");
    }
  });

  return {
    submitting: mutation.isPending,
    success: mutation.isSuccess,
    error: mutation.error instanceof Error ? mutation.error.message : mutation.error ? String(mutation.error) : null,
    isAuthenticated: !!session?.accessToken,
    submitReview: (productId: string, rating: number, comment: string) => 
      mutation.mutateAsync({ productId, rating, comment }),
    resetState: () => mutation.reset(),
  };
}
