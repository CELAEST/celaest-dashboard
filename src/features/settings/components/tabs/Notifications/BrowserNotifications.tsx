import React, { memo } from "react";
import { Globe } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const BrowserNotifications: React.FC = memo(() => {
  const { isDark } = useTheme();
  const t = useTranslations("settings");

  const handleRequestPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          toast.success(t("browser_alerts_enabled"));
        } else {
          toast.error(t("permission_denied"));
        }
      });
    } else {
      toast.error(t("browser_not_supported"));
    }
  };

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${
              isDark ? "bg-white/[0.04] border-white/10 text-white/70" : "bg-gray-100 border-gray-200 text-gray-700"
            }`}
          >
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <p
              className={`font-bold font-jakarta text-sm ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {t("browser_notifications")}
            </p>
            <p
              className={`text-xs mt-0.5 ${
                isDark ? "text-white/50" : "text-gray-500"
              }`}
            >
              {t("browser_notifications_desc")}
            </p>
          </div>
        </div>
        <button
          onClick={handleRequestPermission}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-zinc-900 font-jakarta text-xs font-semibold hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-md cursor-pointer text-center"
        >
          {t("enable_browser_alerts")}
        </button>
      </div>
    </div>
  );
});

BrowserNotifications.displayName = "BrowserNotifications";
