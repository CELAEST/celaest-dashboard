"use client";

import React, { useState, useMemo } from "react";
import { Globe, Clock, Calendar, Monitor, Moon, Sun } from "lucide-react";
import { SettingsSelect } from "../SettingsSelect";
import type {
  ThemeMode,
  DateFormat,
  TimeFormat,
  TimezoneOption,
} from "../../types";

/**
 * Preferences Settings Tab
 */
export function Preferences() {
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [dateFormat, setDateFormat] = useState<DateFormat>("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("12h");
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const timezones: TimezoneOption[] = [
    { value: "America/Los_Angeles", label: "Pacific Time (PT) - Los Angeles" },
    { value: "America/Denver", label: "Mountain Time (MT) - Denver" },
    { value: "America/Chicago", label: "Central Time (CT) - Chicago" },
    { value: "America/New_York", label: "Eastern Time (ET) - New York" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT) - London" },
    { value: "Europe/Paris", label: "Central European Time (CET) - Paris" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST) - Tokyo" },
    {
      value: "Australia/Sydney",
      label: "Australian Eastern Time (AET) - Sydney",
    },
    { value: "UTC", label: "Coordinated Universal Time (UTC)" },
  ];

  const getCurrentTime = useMemo(() => {
    const now = new Date();
    if (timeFormat === "12h") {
      return now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  }, [timeFormat]);

  const getFormattedDate = useMemo(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    if (dateFormat === "DD/MM/YYYY") {
      return `${day}/${month}/${year}`;
    } else {
      return `${month}/${day}/${year}`;
    }
  }, [dateFormat]);

  return (
    <div className="space-y-6">
      {/* Localization */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          Localization
        </h3>

        <div className="space-y-6">
          {/* Timezone */}
          <div>
            <SettingsSelect
              label="Timezone"
              options={timezones}
              value={timezone}
              onChange={setTimezone}
            />
            <p className="text-xs text-gray-500 mt-2">
              This affects how timestamps are displayed in dashboards and
              reports.
            </p>
          </div>

          {/* Date Format */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Date Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDateFormat("MM/DD/YYYY")}
                className={`p-4 rounded-xl border transition-all text-left ${
                  dateFormat === "MM/DD/YYYY"
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-white/10 bg-[#0d0d0d] hover:bg-white/5"
                }`}
              >
                <Calendar
                  className={`w-5 h-5 mb-2 ${
                    dateFormat === "MM/DD/YYYY"
                      ? "text-cyan-400"
                      : "text-gray-500"
                  }`}
                />
                <p
                  className={`text-sm font-medium mb-1 ${
                    dateFormat === "MM/DD/YYYY" ? "text-white" : "text-gray-300"
                  }`}
                >
                  MM/DD/YYYY
                </p>
                <p className="text-xs text-gray-500">US Format</p>
              </button>

              <button
                onClick={() => setDateFormat("DD/MM/YYYY")}
                className={`p-4 rounded-xl border transition-all text-left ${
                  dateFormat === "DD/MM/YYYY"
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-white/10 bg-[#0d0d0d] hover:bg-white/5"
                }`}
              >
                <Calendar
                  className={`w-5 h-5 mb-2 ${
                    dateFormat === "DD/MM/YYYY"
                      ? "text-cyan-400"
                      : "text-gray-500"
                  }`}
                />
                <p
                  className={`text-sm font-medium mb-1 ${
                    dateFormat === "DD/MM/YYYY" ? "text-white" : "text-gray-300"
                  }`}
                >
                  DD/MM/YYYY
                </p>
                <p className="text-xs text-gray-500">International</p>
              </button>
            </div>
          </div>

          {/* Time Format */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Time Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTimeFormat("12h")}
                className={`p-4 rounded-xl border transition-all text-left ${
                  timeFormat === "12h"
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-white/10 bg-[#0d0d0d] hover:bg-white/5"
                }`}
              >
                <Clock
                  className={`w-5 h-5 mb-2 ${
                    timeFormat === "12h" ? "text-cyan-400" : "text-gray-500"
                  }`}
                />
                <p
                  className={`text-sm font-medium mb-1 ${
                    timeFormat === "12h" ? "text-white" : "text-gray-300"
                  }`}
                >
                  12-hour
                </p>
                <p className="text-xs text-gray-500">2:30 PM</p>
              </button>

              <button
                onClick={() => setTimeFormat("24h")}
                className={`p-4 rounded-xl border transition-all text-left ${
                  timeFormat === "24h"
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-white/10 bg-[#0d0d0d] hover:bg-white/5"
                }`}
              >
                <Clock
                  className={`w-5 h-5 mb-2 ${
                    timeFormat === "24h" ? "text-cyan-400" : "text-gray-500"
                  }`}
                />
                <p
                  className={`text-sm font-medium mb-1 ${
                    timeFormat === "24h" ? "text-white" : "text-gray-300"
                  }`}
                >
                  24-hour
                </p>
                <p className="text-xs text-gray-500">14:30</p>
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Preview
            </p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Date</p>
                <p className="text-white font-medium">{getFormattedDate}</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Time</p>
                <p className="text-white font-medium">{getCurrentTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-cyan-400" />
          Appearance
        </h3>

        <div className="space-y-4">
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`p-4 rounded-xl border transition-all ${
                theme === "light"
                  ? "border-cyan-400 bg-cyan-500/10"
                  : "border-white/10 bg-[#0d0d0d] hover:bg-white/5"
              }`}
            >
              <Sun
                className={`w-6 h-6 mb-2 mx-auto ${
                  theme === "light" ? "text-cyan-400" : "text-gray-500"
                }`}
              />
              <p
                className={`text-sm font-medium text-center ${
                  theme === "light" ? "text-white" : "text-gray-300"
                }`}
              >
                Light
              </p>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-xl border transition-all ${
                theme === "dark"
                  ? "border-cyan-400 bg-cyan-500/10"
                  : "border-white/10 bg-[#0d0d0d] hover:bg-white/5"
              }`}
            >
              <Moon
                className={`w-6 h-6 mb-2 mx-auto ${
                  theme === "dark" ? "text-cyan-400" : "text-gray-500"
                }`}
              />
              <p
                className={`text-sm font-medium text-center ${
                  theme === "dark" ? "text-white" : "text-gray-300"
                }`}
              >
                Dark
              </p>
            </button>

            <button
              onClick={() => setTheme("auto")}
              className={`p-4 rounded-xl border transition-all ${
                theme === "auto"
                  ? "border-cyan-400 bg-cyan-500/10"
                  : "border-white/10 bg-[#0d0d0d] hover:bg-white/5"
              }`}
            >
              <Monitor
                className={`w-6 h-6 mb-2 mx-auto ${
                  theme === "auto" ? "text-cyan-400" : "text-gray-500"
                }`}
              />
              <p
                className={`text-sm font-medium text-center ${
                  theme === "auto" ? "text-white" : "text-gray-300"
                }`}
              >
                Auto
              </p>
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {theme === "auto"
              ? "Automatically switch between light and dark based on system preferences."
              : `${
                  theme === "light" ? "Light" : "Dark"
                } theme is currently active.`}
          </p>
        </div>
      </div>

      {/* Language (Coming Soon) */}
      <div className="settings-glass-card rounded-2xl p-6 opacity-60">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          Language
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium text-sm mb-1">
              Interface Language
            </p>
            <p className="text-xs text-gray-500">Currently: English (US)</p>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-500">
            Coming Soon
          </span>
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
