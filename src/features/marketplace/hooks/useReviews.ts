/**
 * useReviews - Hook para sistema de reviews
 * Responsabilidad única: submit de reviews (requiere autenticación)
 */
import { useState, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { CreateReviewInput } from "../types";
import { marketplaceService } from "../services/marketplace.service";

interface ReviewSubmitState {
  submitting: boolean;
  success: boolean;
  error: string | null;
}

export function useReviews() {
  const { session } = useAuth();
  const [state, setState] = useState<ReviewSubmitState>({
    submitting: false,
    success: false,
    error: null,
  });

  const submitReview = useCallback(
    async (productId: string, rating: number, comment: string) => {
      if (!session?.accessToken) {
        setState({ submitting: false, success: false, error: "Debes iniciar sesión para enviar una reseña" });
        return false;
      }

      setState({ submitting: true, success: false, error: null });

      try {
        const input: CreateReviewInput = {
          product_id: productId,
          rating,
          comment,
        };
        await marketplaceService.submitReview(productId, input, session.accessToken);
        setState({ submitting: false, success: true, error: null });
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error al enviar reseña";
        setState({ submitting: false, success: false, error: message });
        return false;
      }
    },
    [session]
  );

  const resetState = useCallback(() => {
    setState({ submitting: false, success: false, error: null });
  }, []);

  return {
    ...state,
    isAuthenticated: !!session?.accessToken,
    submitReview,
    resetState,
  };
}
