"use client";

import React, { useState } from "react";
import { Bell, Mail, Smartphone, Globe, ShieldAlert } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

/**
 * Notifications Settings Tab
 */
export function Notifications() {
  const { isDark } = useTheme();
  const [prefs, setPrefs] = useState({
    email_activity: true,
    email_newsletter: false,
    push_security: true,
    push_mentions: true,
    browser_all: false,
  });

  const togglePref = (id: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const notificationSections = [
    {
      title: "Email Notifications",
      icon: Mail,
      items: [
        {
          id: "email_activity",
          label: "Account Activity",
          desc: "Large orders, new logins, and security alerts.",
        },
        {
          id: "email_newsletter",
          label: "Newsletter & Updates",
          desc: "New features, tips, and marketplace news.",
        },
      ],
    },
    {
      title: "Push Notifications",
      icon: Smartphone,
      items: [
        {
          id: "push_security",
          label: "Security Alerts",
          desc: "Critical alerts about your account security.",
        },
        {
          id: "push_mentions",
          label: "Mentions & Comments",
          desc: "When someone mentions you in a workspace.",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
                isDark ? "bg-cyan-500/10" : "bg-cyan-50"
              }`}
            >
              <Bell
                className={`w-6 h-6 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
              />
            </div>
            <div>
              <h3
                className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Notification Preferences
              </h3>
              <p
                className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Choose how and when you want to be notified.
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              toast.message("All notifications muted", {
                description: "You will no longer receive push or email alerts.",
              })
            }
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest transition-all ${
              isDark
                ? "bg-white/5 text-gray-400 hover:text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            MUTE ALL
          </button>
        </div>

        <div className="space-y-8">
          {notificationSections.map((section, idx) => (
            <div key={idx}>
              <h4
                className={`text-xs uppercase tracking-[0.2em] font-black mb-4 flex items-center gap-2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                <section.icon size={14} />
                {section.title}
              </h4>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      isDark
                        ? "bg-black/20 border-white/5"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div>
                      <p
                        className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {item.label}
                      </p>
                      <p
                        className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {item.desc}
                      </p>
                    </div>
                    <div
                      onClick={() => togglePref(item.id as keyof typeof prefs)}
                      className={`settings-toggle-switch ${
                        prefs[item.id as keyof typeof prefs] ? "active" : ""
                      }`}
                    >
                      <div className="settings-toggle-thumb" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Browser Notifications */}
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
                isDark ? "bg-blue-500/10" : "bg-blue-50"
              }`}
            >
              <Globe
                className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-600"}`}
              />
            </div>
            <div>
              <p
                className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Browser Notifications
              </p>
              <p
                className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Show real-time alerts in your web browser.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if ("Notification" in window) {
                Notification.requestPermission().then((permission) => {
                  if (permission === "granted") {
                    toast.success("Browser alerts enabled!");
                  } else {
                    toast.error("Permission denied");
                  }
                });
              } else {
                toast.error("Browser does not support notifications");
              }
            }}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black tracking-widest active:scale-95 transition-all"
          >
            ENABLE BROWSER ALERTS
          </button>
        </div>
      </div>

      {/* Security Alerts - High Priority */}
      <div
        className={`rounded-2xl p-6 border transition-all ${
          isDark ? "bg-red-500/5 border-red-500/20" : "bg-red-50 border-red-100"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <p
              className={`font-black text-sm tracking-tight ${isDark ? "text-red-400" : "text-red-700"}`}
            >
              CRITICAL SECURITY ALERTS
            </p>
            <p
              className={`text-xs mt-1 leading-relaxed ${isDark ? "text-red-400/60" : "text-red-600/70"}`}
            >
              These notifications cannot be disabled for your protection. We
              will always notify you of password changes and account-level
              security events.
            </p>
          </div>
        </div>
      </div>

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
