import React, { memo } from "react";
import { Lightning, Globe, Trash, Plus, CircleNotch } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useWebhooks } from "@/features/settings/hooks/useWebhooks";
import { Webhook } from "@/features/settings/api/settings.api";
import { useTranslations } from "next-intl";

export const Webhooks: React.FC = memo(() => {
  const { isDark } = useTheme();
  const { webhooks, isLoading, deleteWebhook, createWebhook, isCreating } =
    useWebhooks();
  const t = useTranslations("settings");

  const handleAddWebhook = () => {
    const url = window.prompt(t("webhook_prompt"));

    if (!url) return;

    try {
      new URL(url); // Basic validation
      createWebhook({
        url,
        events: ["order.created", "license.activated", "payment.succeeded"],
        is_active: true,
      });
    } catch {
      alert(t("webhook_invalid_url"));
    }
  };

  return (
    <div className="settings-glass-card rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h3
          className={`text-lg font-bold flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Lightning className="w-5 h-5 text-amber-500" />
          {t("webhooks")}
        </h3>
        <button
          onClick={handleAddWebhook}
          disabled={isCreating}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all w-full sm:w-auto shrink-0 cursor-pointer ${
            isDark
              ? "bg-white/[0.04] text-white/80 hover:text-white hover:bg-white/[0.08] border border-white/8"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isCreating ? (
            <CircleNotch size={12} className="animate-spin" />
          ) : (
            <Plus size={12} />
          )}
          {t("add_endpoint")}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
        {isLoading && (
          <div className="py-8 flex justify-center">
            <CircleNotch className="w-6 h-6 animate-spin text-white/80" />
          </div>
        )}

        {!isLoading && webhooks.length === 0 && (
          <div
            className={`flex flex-col items-center justify-center py-12 px-6 rounded-2xl border border-dashed transition-colors ${
              isDark
                ? "bg-white/[0.02] border-white/10 text-white/40"
                : "bg-gray-50 border-gray-200 text-gray-400"
            }`}
          >
            <Globe size={40} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">
              {t("no_webhooks")}
            </p>
            <p className="text-xs mt-1 opacity-60">
              {t("no_webhooks_desc")}
            </p>
          </div>
        )}

        {!isLoading &&
          webhooks.map((webhook: Webhook) => (
            <div
              key={webhook.id}
              className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        webhook.is_active
                          ? isDark
                            ? "bg-white/[0.08] text-white border-white/10"
                            : "bg-gray-900 text-white border-gray-900"
                          : isDark
                            ? "bg-white/[0.03] text-white/40 border-white/[0.06]"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                    >
                      {webhook.is_active ? "Activo" : "Pausado"}
                    </span>
                    <span className="font-mono text-xs truncate">{webhook.url}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px]">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className={`px-2 py-0.5 rounded font-mono text-[10px] border ${
                          isDark
                            ? "bg-white/[0.04] text-white/70 border-white/[0.06]"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteWebhook(webhook.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors shrink-0 cursor-pointer"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
});

Webhooks.displayName = "Webhooks";
