import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { CreateReviewInput, UpdateReviewInput } from "../types";
import { marketplaceApi } from "../api/marketplace.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { toast } from "sonner";

/**
 * Hook to submit a review. Invalidates the product detail, the user's
 * "my review" cache and the global marketplace listing so the rating
 * aggregates re-render across cards and modals.
 */
export function useReviews() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      productId,
      rating,
      comment,
    }: {
      productId: string;
      rating: number;
      comment: string;
    }) => {
      if (!session?.accessToken) {
        throw new Error("Debes iniciar sesión para enviar una reseña");
      }

      const input: CreateReviewInput = {
        product_id: productId,
        rating,
        comment,
      };
      return marketplaceApi.submitReview(productId, input, session.accessToken);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.marketplace.myReview(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: ["marketplace", "reviews-infinite", variables.productId],
      });
      toast.success("Reseña enviada exitosamente");
    },
    onError: (err: Error) => {
      const msg =
        err.message?.includes("ALREADY_REVIEWED") ||
        err.message?.toLowerCase().includes("already")
          ? "Ya enviaste una reseña para este producto. Puedes editarla."
          : err.message || "Error al enviar reseña";
      toast.error(msg);
    },
  });

  return {
    submitting: mutation.isPending,
    success: mutation.isSuccess,
    error:
      mutation.error instanceof Error
        ? mutation.error.message
        : mutation.error
          ? String(mutation.error)
          : null,
    isAuthenticated: !!session?.accessToken,
    submitReview: (productId: string, rating: number, comment: string) =>
      mutation.mutateAsync({ productId, rating, comment }),
    resetState: () => mutation.reset(),
  };
}

/**
 * Hook to update the caller's own review (rating + comment).
 */
export function useUpdateReview(productId: string) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      reviewId,
      rating,
      comment,
    }: {
      reviewId: string;
      rating: number;
      comment: string;
    }) => {
      if (!session?.accessToken) {
        throw new Error("Debes iniciar sesión para editar tu reseña");
      }
      const input: UpdateReviewInput = { rating, comment };
      return marketplaceApi.updateReview(reviewId, input, session.accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.marketplace.myReview(productId),
      });
      queryClient.invalidateQueries({
        queryKey: ["marketplace", "reviews-infinite", productId],
      });
      toast.success("Reseña actualizada");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al actualizar reseña");
    },
  });

  return {
    updating: mutation.isPending,
    updateReview: (reviewId: string, rating: number, comment: string) =>
      mutation.mutateAsync({ reviewId, rating, comment }),
  };
}

/**
 * Hook to delete the caller's own review.
 */
export function useDeleteReview(productId: string) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (reviewId: string) => {
      if (!session?.accessToken) {
        throw new Error("Debes iniciar sesión para eliminar tu reseña");
      }
      return marketplaceApi.deleteReview(reviewId, session.accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.marketplace.myReview(productId),
      });
      queryClient.invalidateQueries({
        queryKey: ["marketplace", "reviews-infinite", productId],
      });
      toast.success("Reseña eliminada");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al eliminar reseña");
    },
  });

  return {
    deleting: mutation.isPending,
    deleteReview: (reviewId: string) => mutation.mutateAsync(reviewId),
  };
}
