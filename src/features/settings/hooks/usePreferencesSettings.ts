import { useState, useMemo } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import {
  TimezoneOption,
  DateFormatOption,
  TimeFormatOption,
} from "@/features/settings/components/types";

export const usePreferencesSettings = () => {
  const { setTheme, theme: currentTheme } = useTheme();
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");

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
  };
};
