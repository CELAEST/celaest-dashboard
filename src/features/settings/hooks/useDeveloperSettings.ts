import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ApiKey } from "../components/tabs/DeveloperAPI/ApiKeys";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import api from "@/lib/api-client";

interface BackendApiKey {
  id: string;
  name: string;
  key_prefix: string;
  key_secret?: string; 
  last_used_at?: string;
  created_at: string;
}

export const useDeveloperSettings = () => {
  const { session } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchApiKeys = useCallback(async () => {
    if (!session) return;
    try {
      setIsLoading(true);
      const response = await api.get<{ api_keys: BackendApiKey[] }>("/api/v1/user/api-keys", {
        token: session.accessToken,
      });
      if (response.api_keys) {
        setApiKeys(
          response.api_keys.map((k) => ({
            id: k.id,
            name: k.name,
            key: k.key_secret || `${k.key_prefix}••••••••`,
            created: new Date(k.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            lastUsed: k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : "Never",
          }))
        );
      }
    } catch (error) {
      console.error("[DeveloperAPI] Failed to fetch keys:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API Key copied to clipboard");
  };

  const generateKey = async () => {
    if (!session) return;
    try {
      const name = `API Key ${apiKeys.length + 1}`;
      const response = await api.post<{ api_key: BackendApiKey; message: string }>("/api/v1/user/api-keys", 
        { name },
        { token: session.accessToken }
      );
      
      if (response.api_key) {
        toast.success("New API key generated successfully");
        // We refresh all keys to get the list, 
        // Note: the secret is only shown once in the 'message' or 'api_key' if backend supports it
        fetchApiKeys();
      }
    } catch (error) {
      toast.error("Failed to generate API key");
    }
  };

  const revokeKey = async (id: string) => {
    if (!session) return;
    try {
      await api.delete(`/api/v1/user/api-keys/${id}`, {
        token: session.accessToken,
      });
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      toast.success("API key revoked");
    } catch (error) {
      toast.error("Failed to revoke API key");
    }
  };

  return {
    apiKeys,
    isLoading,
    copyToClipboard,
    generateKey,
    revokeKey,
  };
};
