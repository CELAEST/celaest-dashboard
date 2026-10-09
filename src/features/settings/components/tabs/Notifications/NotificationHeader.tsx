import React, { memo } from "react";
import { Bell } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const NotificationHeader: React.FC = memo(() => {
  const { isDark } = useTheme();
  const t = useTranslations("settings");

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
            isDark ? "bg-white/[0.04] border-white/10 text-white/70" : "bg-gray-100 border-gray-200 text-gray-700"
          }`}
        >
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h3
            className={`text-base font-bold font-jakarta tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("notification_preferences")}
          </h3>
          <p
            className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}
          >
            {t("notification_preferences_desc")}
          </p>
        </div>
      </div>
      <button
        onClick={() =>
          toast.message(t("all_muted"), {
            description: t("all_muted_desc"),
          })
        }
        className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all ${
          isDark
            ? "bg-white/5 text-zinc-400 hover:text-white border border-white/5"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        {t("mute_all")}
      </button>
    </div>
  );
});

NotificationHeader.displayName = "NotificationHeader";
