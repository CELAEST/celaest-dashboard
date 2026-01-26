"use client";

import { useState } from "react";
import { Globe, Monitor, Moon, Sun, Check } from "lucide-react";
import { SettingsSelect } from "../SettingsSelect";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

/**
 * Preferences Settings Tab
 */
export function Preferences() {
  const { setTheme, resolvedTheme: currentTheme, isDark } = useTheme();

  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");

  const timezones = [
    { value: "America/Los_Angeles", label: "Pacific Time (PT) - Los Angeles" },
    { value: "America/Denver", label: "Mountain Time (MT) - Denver" },
    { value: "America/Chicago", label: "Central Time (CT) - Chicago" },
    { value: "America/New_York", label: "Eastern Time (ET) - New York" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT) - London" },
    { value: "Europe/Paris", label: "Central European Time (CET) - Paris" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST) - Tokyo" },
    { value: "UTC", label: "Coordinated Universal Time (UTC)" },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Localization */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          <Globe className="w-5 h-5 text-cyan-500" />
          Localization
        </h3>

        <div className="space-y-6">
          {/* Timezone */}
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              User Timezone
            </label>
            <SettingsSelect
              options={timezones}
              value={timezone}
              onChange={setTimezone}
            />
            <p
              className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Your timezone is used to display timestamps consistently
              throughout the dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Format */}
            <div>
              <label
                className={`text-xs uppercase tracking-wider mb-3 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Date Format
              </label>
              <div className="space-y-2">
                {[
                  {
                    value: "MM/DD/YYYY",
                    label: "MM/DD/YYYY",
                    desc: "US Format (12/25/2023)",
                  },
                  {
                    value: "DD/MM/YYYY",
                    label: "DD/MM/YYYY",
                    desc: "International (25/12/2023)",
                  },
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setDateFormat(format.value)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      dateFormat === format.value
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-500"
                        : isDark
                          ? "bg-black/20 border-white/5 hover:bg-white/5 text-gray-500"
                          : "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-bold">{format.label}</p>
                      <p className="text-[10px] opacity-60 tracking-tight">
                        {format.desc}
                      </p>
                    </div>
                    {dateFormat === format.value && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Format */}
            <div>
              <label
                className={`text-xs uppercase tracking-wider mb-3 block font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Time Format
              </label>
              <div className="space-y-2">
                {[
                  { value: "12h", label: "12-hour", desc: "2:30 PM" },
                  { value: "24h", label: "24-hour", desc: "14:30" },
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setTimeFormat(format.value)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      timeFormat === format.value
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-500"
                        : isDark
                          ? "bg-black/20 border-white/5 hover:bg-white/5 text-gray-500"
                          : "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-bold">{format.label}</p>
                      <p className="text-[10px] opacity-60 tracking-tight">
                        {format.desc}
                      </p>
                    </div>
                    {timeFormat === format.value && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Theme */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          <Monitor className="w-5 h-5 text-cyan-500" />
          Appearance & Theme
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "light", icon: Sun, label: "Light Mode" },
            { id: "dark", icon: Moon, label: "Dark Mode" },
            { id: "system", icon: Monitor, label: "System" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTheme(item.id)}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                currentTheme === item.id
                  ? "bg-cyan-500/10 border-cyan-500 text-cyan-500"
                  : isDark
                    ? "bg-black/20 border-white/5 hover:bg-white/5 text-gray-500"
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600"
              }`}
            >
              <item.icon
                className={`w-6 h-6 ${currentTheme === item.id ? "text-cyan-500" : "opacity-40"}`}
              />
              <span className="text-xs font-black tracking-widest uppercase">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={() => toast.success("Preferences saved successfully")}
          className="px-8 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
