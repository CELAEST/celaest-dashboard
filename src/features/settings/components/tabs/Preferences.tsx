"use client";

import React from "react";
import { usePreferencesSettings } from "../../hooks/usePreferencesSettings";
import { LocalizationSettings } from "./Preferences/LocalizationSettings";
import { ThemeSettings } from "./Preferences/ThemeSettings";
import { useTranslations } from "next-intl";

/**
 * Preferences Settings Tab
 */
export function Preferences() {
  const t = useTranslations("settings");
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
    isLoading,
    isSaving,
    savePreferences,
  } = usePreferencesSettings();

  const handleSave = async () => {
    await savePreferences();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/80"></div>
      </div>
    );
  }

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
      {process.env.NODE_ENV !== "production" && (
        <ThemeSettings currentTheme={currentTheme} onThemeChange={setTheme} />
      )}

      {/* Save Button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-jakarta"
        >
          {isSaving ? t("saving") : t("save_preferences")}
        </button>
      </div>
    </div>
  );
}
