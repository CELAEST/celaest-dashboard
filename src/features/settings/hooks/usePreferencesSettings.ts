import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useApiAuth } from "@/lib/use-api-auth";
import { settingsApi } from "../api/settings.api";
import {
  TimezoneOption,
  DateFormatOption,
  TimeFormatOption,
} from "@/features/settings/components/types";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

const PREFS_QUERY_KEY = [...QUERY_KEYS.users.all, "preferences"] as const;

export const usePreferencesSettings = () => {
  const { token, isReady } = useApiAuth();
  const { setTheme, theme: currentTheme } = useTheme();
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");

  const { isLoading } = useQuery({
    queryKey: PREFS_QUERY_KEY,
    queryFn: async () => {
      if (!token) return null;
      const response = await settingsApi.getPreferences(token);
      const { preferences } = response;
      
      if (preferences.timezone) setTimezone(preferences.timezone);
      if (preferences.theme) setTheme(preferences.theme as "light" | "dark");
      return preferences;
    },
    enabled: isReady && !!token,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("No token");
      await settingsApi.updatePreferences({
        timezone,
        theme: currentTheme,
        date_format: dateFormat,
        time_format: timeFormat,
      }, token);
    },
    onSuccess: () => {
      toast.success("Preferences saved successfully");
    },
    onError: () => {
      toast.error("Failed to save preferences");
    },
  });

  const savePreferences = useCallback(() => {
    saveMutation.mutate();
  }, [saveMutation]);

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
    isSaving: saveMutation.isPending,
    savePreferences,
  };
};
