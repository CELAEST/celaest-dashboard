"use client";

import React, { useState } from "react";
import {
  Bell,
  Mail,
  Smartphone,
  AlertTriangle,
  TrendingUp,
  Megaphone,
} from "lucide-react";

interface NotificationSetting {
  id: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  email: boolean;
  push: boolean;
  required?: boolean;
}

/**
 * Notifications Settings Tab
 */
export function Notifications() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "1",
      category: "Critical Alerts",
      description: "System failures, security breaches, license violations",
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      email: true,
      push: true,
      required: true,
    },
    {
      id: "2",
      category: "Weekly Summaries",
      description: "Performance reports, usage statistics, revenue updates",
      icon: <TrendingUp className="w-5 h-5 text-cyan-400" />,
      email: true,
      push: false,
    },
    {
      id: "3",
      category: "Team Activity",
      description: "New members, role changes, permission updates",
      icon: <Bell className="w-5 h-5 text-purple-400" />,
      email: true,
      push: true,
    },
    {
      id: "4",
      category: "Product Updates",
      description: "New features, platform improvements, maintenance notices",
      icon: <Smartphone className="w-5 h-5 text-blue-400" />,
      email: false,
      push: true,
    },
    {
      id: "5",
      category: "Marketing & News",
      description: "Tips, best practices, company news, promotional offers",
      icon: <Megaphone className="w-5 h-5 text-orange-400" />,
      email: false,
      push: false,
    },
  ]);

  const toggleNotification = (id: string, channel: "email" | "push") => {
    setSettings(
      settings.map((setting) => {
        if (setting.id === id && !setting.required) {
          return {
            ...setting,
            [channel]: !setting[channel],
          };
        }
        return setting;
      }),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-400" />
          Notification Preferences
        </h3>
        <p className="text-sm text-gray-500">
          Control how and when you receive notifications from CELAEST Dashboard.
        </p>
      </div>

      {/* Notification Matrix */}
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-white/10">
            <div className="col-span-6 text-xs text-gray-500 uppercase tracking-wider">
              Category
            </div>
            <div className="col-span-3 text-center">
              <div className="flex flex-col items-center gap-1">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Email
                </span>
              </div>
            </div>
            <div className="col-span-3 text-center">
              <div className="flex flex-col items-center gap-1">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Push/In-App
                </span>
              </div>
            </div>
          </div>

          {/* Notification Rows */}
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="grid grid-cols-12 gap-4 items-center p-4 rounded-xl bg-[#0d0d0d] border border-white/5"
            >
              {/* Category Info */}
              <div className="col-span-6 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  {setting.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm">
                      {setting.category}
                    </p>
                    {setting.required && (
                      <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {setting.description}
                  </p>
                </div>
              </div>

              {/* Email Toggle */}
              <div className="col-span-3 flex justify-center">
                <button
                  onClick={() => toggleNotification(setting.id, "email")}
                  disabled={setting.required}
                  className={`settings-toggle-switch ${
                    setting.email ? "active" : ""
                  } ${setting.required ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  <div className="settings-toggle-thumb" />
                </button>
              </div>

              {/* Push Toggle */}
              <div className="col-span-3 flex justify-center">
                <button
                  onClick={() => toggleNotification(setting.id, "push")}
                  disabled={setting.required}
                  className={`settings-toggle-switch ${
                    setting.push ? "active" : ""
                  } ${setting.required ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  <div className="settings-toggle-thumb" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="text-sm text-red-400 font-medium mb-1">
                Critical Alerts
              </p>
              <p className="text-xs text-gray-500">
                Critical alerts cannot be disabled for security and compliance
                reasons.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <p className="text-sm text-cyan-400 font-medium mb-1">
                Push Notifications
              </p>
              <p className="text-xs text-gray-500">
                Enable browser permissions to receive in-app notifications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-8 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
