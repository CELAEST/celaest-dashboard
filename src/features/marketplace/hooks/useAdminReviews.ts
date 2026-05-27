import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { marketplaceApi } from "../api/marketplace.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { AdminReviewFilter, ReviewStatus, UpdateReviewInput } from "../types";
import { toast } from "sonner";

/**
 * useAdminReviews
 *
 * Reviews listing for the super_admin moderation panel.
 * Hits GET /api/v1/admin/marketplace/reviews with the filter set as query
 * params. Disabled until the auth session is ready.
 */
export function useAdminReviews(filter: AdminReviewFilter) {
  const { session } = useAuth();
  const token = session?.accessToken;

  return useQuery({
    queryKey: QUERY_KEYS.marketplace.adminReviews(filter as Record<string, unknown>),
    queryFn: async () => {
      if (!token) return { reviews: [], total: 0, page: 1, limit: 20 };
      return marketplaceApi.adminListReviews(filter, token);
    },
    enabled: !!token,
    staleTime: 30 * 1000,
  });
}

/**
 * useAdminSetReviewStatus
 *
 * Mutation wrapper for moderation status changes. Invalidates the admin list
 * query and the global marketplace cache so cards re-render their rating
 * aggregates when a review moves in/out of the "published" set.
 */
export function useAdminSetReviewStatus() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      status,
    }: {
      reviewId: string;
      status: ReviewStatus;
    }) => {
      if (!session?.accessToken) {
        throw new Error("Auth required");
      }
      return marketplaceApi.adminSetReviewStatus(
        reviewId,
        status,
        session.accessToken,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
      queryClient.invalidateQueries({
        queryKey: ["marketplace", "admin-reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["marketplace", "reviews-infinite"],
      });
      toast.success("Reseña actualizada");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al actualizar reseña");
    },
  });
}

/**
 * useAdminUpdateReview
 *
 * Mutation wrapper for editing any review's content (rating + comment).
 * Restricted to super_admin at the backend.
 */
export function useAdminUpdateReview() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      input,
    }: {
      reviewId: string;
      input: UpdateReviewInput;
    }) => {
      if (!session?.accessToken) {
        throw new Error("Auth required");
      }
      return marketplaceApi.adminUpdateReview(
        reviewId,
        input,
        session.accessToken,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
      queryClient.invalidateQueries({
        queryKey: ["marketplace", "admin-reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["marketplace", "reviews-infinite"],
      });
      toast.success("Reseña actualizada");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al actualizar reseña");
    },
  });
}

/**
 * useAdminDeleteReview
 *
 * Permanent (hard) delete from the moderation panel.
 */
export function useAdminDeleteReview() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      if (!session?.accessToken) {
        throw new Error("Auth required");
      }
      return marketplaceApi.adminDeleteReview(reviewId, session.accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
      queryClient.invalidateQueries({
        queryKey: ["marketplace", "admin-reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["marketplace", "reviews-infinite"],
      });
      toast.success("Reseña eliminada");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al eliminar reseña");
    },
  });
}
