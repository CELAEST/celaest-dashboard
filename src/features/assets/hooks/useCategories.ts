import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assetsService } from "../services/assets.service";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { CreateCategoryPayload } from "../api/assets.api";
import { toast } from "sonner";

export function useCategories(isPublic = false) {
  const { session } = useAuthStore();
  const { currentOrg } = useOrgStore();
  const queryClient = useQueryClient();

  const token = session?.accessToken || "";
  const orgId = currentOrg?.id || "";

  // Query for fetching categories
  const categoriesQuery = useQuery({
    queryKey: QUERY_KEYS.assets.categories(isPublic ? undefined : orgId),
    queryFn: () => assetsService.getCategories(token, isPublic ? undefined : orgId),
    staleTime: 10 * 60 * 1000,
  });

  // Mutation for creating a category
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryPayload) => 
      assetsService.createCategory(token, orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets.categories(orgId) });
      toast.success("Category created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message || "Unknown error"}`);
    },
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    isCreating: createCategoryMutation.isPending,
    createCategory: createCategoryMutation.mutateAsync,
    refetch: categoriesQuery.refetch,
  };
}
