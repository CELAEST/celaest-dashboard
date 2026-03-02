import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi, Webhook } from "../api/settings.api";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { toast } from "sonner";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";

const WEBHOOKS_QUERY_KEY = ["webhooks"];

export function useWebhooks() {
  const { session } = useAuth();
  const token = session?.accessToken || "";
  const queryClient = useQueryClient();
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const orgId = currentOrg?.id || "";

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: [...WEBHOOKS_QUERY_KEY, orgId],
    queryFn: () => settingsApi.getWebhooks(token, orgId),
    enabled: !!token && !!orgId,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Webhook>) => settingsApi.createWebhook(token, orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_QUERY_KEY });
      toast.success("Webhook endpoint created successfully");
    },
    onError: (error) => {
      console.error("Failed to create webhook", error);
      toast.error("Failed to create webhook endpoint. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => settingsApi.deleteWebhook(token, orgId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_QUERY_KEY });
      toast.success("Webhook endpoint removed");
    },
    onError: (error) => {
      console.error("Failed to remove webhook", error);
      toast.error("Failed to remove webhook endpoint.");
    },
  });

  return {
    webhooks,
    isLoading,
    createWebhook: (data: Partial<Webhook>) => createMutation.mutate(data),
    deleteWebhook: (id: string) => deleteMutation.mutate(id),
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
