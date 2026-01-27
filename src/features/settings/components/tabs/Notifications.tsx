"use client";

import React from "react";
import { toast } from "sonner";
import { useNotificationSettings } from "../../hooks/useNotificationSettings";
import { NotificationHeader } from "./Notifications/NotificationHeader";
import { NotificationPreferences } from "./Notifications/NotificationPreferences";
import { BrowserNotifications } from "./Notifications/BrowserNotifications";
import { SecurityAlerts } from "./Notifications/SecurityAlerts";

/**
 * Notifications Settings Tab
 */
export function Notifications() {
  const { prefs, togglePref, notificationSections } = useNotificationSettings();

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="settings-glass-card rounded-2xl p-6">
        <NotificationHeader />
        <NotificationPreferences
          sections={notificationSections}
          prefs={prefs}
          onToggle={togglePref}
        />
      </div>

      <BrowserNotifications />

      <SecurityAlerts />

      {/* Save Button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={() => toast.success("Notification preferences updated")}
          className="px-8 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
