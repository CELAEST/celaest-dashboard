import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiKey } from "../components/tabs/DeveloperAPI/ApiKeys";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import api from "@/lib/api-client";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

interface BackendApiKey {
  id: string;
  name: string;
  key_prefix: string;
  key_secret?: string; 
  last_used_at?: string;
  created_at: string;
}

const API_KEYS_QUERY_KEY = [...QUERY_KEYS.users.all, "api-keys"] as const;

const mapApiKey = (k: BackendApiKey): ApiKey => ({
  id: k.id,
  name: k.name,
  key: k.key_secret || `${k.key_prefix}••••••••`,
  created: new Date(k.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  lastUsed: k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : "Never",
});

export const useDeveloperSettings = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: API_KEYS_QUERY_KEY,
    queryFn: async () => {
      if (!session) return [];
      const response = await api.get<{ api_keys: BackendApiKey[] }>("/api/v1/user/api-keys", {
        token: session.accessToken,
      });
      return response.api_keys ? response.api_keys.map(mapApiKey) : [];
    },
    enabled: !!session,
  });

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API Key copied to clipboard");
  }, []);

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("No session");
      const name = `API Key ${apiKeys.length + 1}`;
      await api.post<{ api_key: BackendApiKey; message: string }>("/api/v1/user/api-keys", 
        { name },
        { token: session.accessToken }
      );
    },
    onSuccess: () => {
      toast.success("New API key generated successfully");
      queryClient.invalidateQueries({ queryKey: API_KEYS_QUERY_KEY });
    },
    onError: () => toast.error("Failed to generate API key"),
  });

  const revokeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session) throw new Error("No session");
      await api.delete(`/api/v1/user/api-keys/${id}`, {
        token: session.accessToken,
      });
      return id;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: API_KEYS_QUERY_KEY });
      const previous = queryClient.getQueryData<ApiKey[]>(API_KEYS_QUERY_KEY);
      queryClient.setQueryData<ApiKey[]>(API_KEYS_QUERY_KEY, old => (old || []).filter(k => k.id !== id));
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(API_KEYS_QUERY_KEY, context.previous);
      toast.error("Failed to revoke API key");
    },
    onSuccess: () => toast.success("API key revoked"),
  });

  return {
    apiKeys,
    isLoading,
    copyToClipboard,
    generateKey: () => generateMutation.mutate(),
    revokeKey: (id: string) => revokeMutation.mutate(id),
  };
};
