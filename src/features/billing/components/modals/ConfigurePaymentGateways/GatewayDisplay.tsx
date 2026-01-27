import React from "react";
import { Key, Eye, EyeOff, Activity } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { PaymentGateway } from "../../../types";

interface GatewayDisplayProps {
  gateway: PaymentGateway;
  showApiKey: Record<string, boolean>;
  toggleApiKeyVisibility: (id: string) => void;
  maskApiKey: (key: string, show: boolean) => string;
}

export const GatewayDisplay: React.FC<GatewayDisplayProps> = ({
  gateway,
  showApiKey,
  toggleApiKeyVisibility,
  maskApiKey,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* API Key Display */}
      <div
        className={`p-4 rounded-xl border ${
          isDark ? "bg-black/20 border-white/5" : "bg-gray-50 border-gray-100"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Key
            className={`w-3.5 h-3.5 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          />
          <div
            className={`text-[10px] font-black uppercase tracking-widest ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            API Credentials
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <code
            className={`text-xs font-mono font-medium truncate ${
              isDark ? "text-cyan-400/90" : "text-blue-600"
            }`}
          >
            {maskApiKey(gateway.apiKey, showApiKey[gateway.id])}
          </code>
          <button
            onClick={() => toggleApiKeyVisibility(gateway.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-white/5 text-gray-500 hover:text-white"
                : "hover:bg-gray-200 text-gray-400 hover:text-gray-700"
            }`}
          >
            {showApiKey[gateway.id] ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Webhook URL Display */}
      <div
        className={`p-4 rounded-xl border ${
          isDark ? "bg-black/20 border-white/5" : "bg-gray-50 border-gray-100"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Activity
            className={`w-3.5 h-3.5 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          />
          <div
            className={`text-[10px] font-black uppercase tracking-widest ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Endpoint URL
          </div>
        </div>
        <code
          className={`text-[10px] font-mono font-medium break-all block ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {gateway.webhookUrl}
        </code>
      </div>
    </div>
  );
};
