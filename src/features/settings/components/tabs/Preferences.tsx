"use client";

import React from "react";
import { toast } from "sonner";
import { usePreferencesSettings } from "../../hooks/usePreferencesSettings";
import { LocalizationSettings } from "./Preferences/LocalizationSettings";
import { ThemeSettings } from "./Preferences/ThemeSettings";

/**
 * Preferences Settings Tab
 */
export function Preferences() {
  const {
    currentTheme,
    setTheme,
    timezone,
    setTimezone,
    dateFormat,
    setDateFormat,
    timeFormat,
    setTimeFormat,
    timezones,
    dateFormats,
    timeFormats,
  } = usePreferencesSettings();

  const handleSave = () => {
    toast.success("Preferences saved successfully");
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Localization */}
      <LocalizationSettings
        timezone={timezone}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
        onTimezoneChange={setTimezone}
        onDateFormatChange={setDateFormat}
        onTimeFormatChange={setTimeFormat}
        timezones={timezones}
        dateFormats={dateFormats}
        timeFormats={timeFormats}
      />

      {/* Interface Theme */}
      <ThemeSettings currentTheme={currentTheme} onThemeChange={setTheme} />

      {/* Save Button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          className="px-8 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
