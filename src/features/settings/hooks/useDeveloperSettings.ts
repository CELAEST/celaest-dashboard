import { useState } from "react";
import { toast } from "sonner";
import { ApiKey } from "../components/tabs/DeveloperAPI/ApiKeys";

export const useDeveloperSettings = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API Key",
      key: "pk_live_f7a2b9c8d1e3f4a5b6c7d8e9f0a1b2c3d4",
      created: "Oct 12, 2023",
      lastUsed: "2 mins ago",
    },
    {
      id: "2",
      name: "Development Key",
      key: "pk_test_b9c8d1e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
      created: "Dec 05, 2023",
      lastUsed: "Yesterday",
    },
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API Key copied to clipboard");
  };

  const generateKey = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: "Generating cryptographically secure key...",
      success: () => {
        setApiKeys((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            name: "New Live Key",
            key: `pk_live_${Math.random().toString(36).substring(2)}`,
            created: "Just now",
            lastUsed: "Never",
          },
        ]);
        return "New API key generated successfully";
      },
    });
  };

  return {
    apiKeys,
    copyToClipboard,
    generateKey,
  };
};
