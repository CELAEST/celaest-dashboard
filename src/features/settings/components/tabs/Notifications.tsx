"use client";

import React from "react";
import { toast } from "sonner";
import { useNotificationSettings } from "../../hooks/useNotificationSettings";
import { NotificationHeader } from "./Notifications/NotificationHeader";
import { NotificationPreferences } from "./Notifications/NotificationPreferences";
import { BrowserNotifications } from "./Notifications/BrowserNotifications";
import { SecurityAlerts } from "./Notifications/SecurityAlerts";
import { useTranslations } from "next-intl";

/**
 * Notifications Settings Tab
 */
export function Notifications() {
  const t = useTranslations("settings");
  const { prefs, togglePref, notificationSections, isLoading } =
    useNotificationSettings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/80"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="settings-glass-card rounded-2xl p-6">
        <NotificationHeader />
        <NotificationPreferences
          sections={notificationSections}
          prefs={prefs || {}}
          onToggle={togglePref}
        />
      </div>

      <BrowserNotifications />

      <SecurityAlerts />

      {/* Save Button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={() => toast.success(t("notification_updated"))}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer shadow-md font-jakarta"
        >
          {t("save_settings")}
        </button>
      </div>
    </div>
  );
}
