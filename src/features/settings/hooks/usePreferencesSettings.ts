import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useApiAuth } from "@/lib/use-api-auth";
import { settingsApi } from "../api/settings.api";
import {
  TimezoneOption,
  DateFormatOption,
  TimeFormatOption,
} from "@/features/settings/components/types";

export const usePreferencesSettings = () => {
  const { token, isReady } = useApiAuth();
  const { setTheme, theme: currentTheme } = useTheme();
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPreferences = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await settingsApi.getPreferences(token);
      const { preferences } = response;
      
      if (preferences.timezone) setTimezone(preferences.timezone);
      if (preferences.theme) setTheme(preferences.theme as "light" | "dark");
      // Date and time formats might be in the raw string or handled separately
      // For now, let's assume standard mapping
    } catch (err) {
      console.error("Error fetching preferences:", err);
      toast.error("Failed to load generic preferences");
    } finally {
      setIsLoading(false);
    }
  }, [token, setTheme]);

  useEffect(() => {
    if (isReady) {
      fetchPreferences();
    }
  }, [isReady, fetchPreferences]);

  const savePreferences = useCallback(async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      await settingsApi.updatePreferences({
        timezone,
        theme: currentTheme,
        date_format: dateFormat,
        time_format: timeFormat,
      }, token);
      toast.success("Preferences saved successfully");
    } catch (err) {
      console.error("Error saving preferences:", err);
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  }, [token, timezone, currentTheme, dateFormat, timeFormat]);

  const timezones: TimezoneOption[] = useMemo(
    () => [
      {
        value: "America/Los_Angeles",
        label: "Pacific Time (PT) - Los Angeles",
      },
      { value: "America/Denver", label: "Mountain Time (MT) - Denver" },
      { value: "America/Chicago", label: "Central Time (CT) - Chicago" },
      { value: "America/New_York", label: "Eastern Time (ET) - New York" },
      { value: "Europe/London", label: "Greenwich Mean Time (GMT) - London" },
      { value: "Europe/Paris", label: "Central European Time (CET) - Paris" },
      { value: "Asia/Tokyo", label: "Japan Standard Time (JST) - Tokyo" },
      { value: "UTC", label: "Coordinated Universal Time (UTC)" },
    ],
    [],
  );

  const dateFormats: DateFormatOption[] = useMemo(
    () => [
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
    ],
    [],
  );

  const timeFormats: TimeFormatOption[] = useMemo(
    () => [
      { value: "12h", label: "12-hour", desc: "2:30 PM" },
      { value: "24h", label: "24-hour", desc: "14:30" },
    ],
    [],
  );

  return {
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
  };
};
