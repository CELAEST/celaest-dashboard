import React, { memo } from "react";
import { Zap, Globe, Trash2, Plus, Loader2 } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useWebhooks } from "@/features/settings/hooks/useWebhooks";
import { Webhook } from "@/features/settings/api/settings.api";

export const Webhooks: React.FC = memo(() => {
  const { isDark } = useTheme();
  const { webhooks, isLoading, deleteWebhook, createWebhook, isCreating } =
    useWebhooks();

  const handleAddWebhook = () => {
    const url = window.prompt(
      "Enter webhook URL (e.g. https://your-domain.com/webhook)",
    );

    if (!url) return;

    try {
      new URL(url); // Basic validation
      createWebhook({
        url,
        events: ["order.created", "license.activated", "payment.succeeded"],
        is_active: true,
      });
    } catch {
      alert("Please enter a valid URL including http:// or https://");
    }
  };

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-bold flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Zap className="w-5 h-5 text-amber-500" />
          Webhooks
        </h3>
        <button
          onClick={handleAddWebhook}
          disabled={isCreating}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
            isDark
              ? "bg-white/5 text-gray-400 hover:text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {isCreating ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Plus size={12} />
          )}
          ADD ENDPOINT
        </button>
      </div>

      <div className="space-y-3">
        {isLoading && (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
          </div>
        )}

        {!isLoading && webhooks.length === 0 && (
          <div
            className={`flex flex-col items-center justify-center py-12 px-6 rounded-2xl border border-dashed transition-colors ${
              isDark
                ? "bg-black/20 border-white/5 text-gray-500"
                : "bg-gray-50 border-gray-200 text-gray-400"
            }`}
          >
            <Globe size={40} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">
              No webhook endpoints configured
            </p>
            <p className="text-xs mt-1 opacity-60">
              Add an endpoint to start receiving real-time events.
            </p>
          </div>
        )}

        {!isLoading &&
          webhooks.map((webhook: Webhook) => (
            <div
              key={webhook.id}
              className={`p-4 flex items-center justify-between rounded-xl border ${
                isDark
                  ? "bg-black/40 border-white/5"
                  : "bg-white border-gray-100"
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${webhook.is_active ? "bg-emerald-500" : "bg-gray-400"}`}
                  />
                  <span className="font-mono text-xs">{webhook.url}</span>
                </div>
                <div className="flex gap-2 text-[10px] text-gray-500 mt-2">
                  {webhook.events.map((event) => (
                    <span
                      key={event}
                      className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => deleteWebhook(webhook.id)}
                className="p-2 rounded-lg text-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
});

Webhooks.displayName = "Webhooks";
