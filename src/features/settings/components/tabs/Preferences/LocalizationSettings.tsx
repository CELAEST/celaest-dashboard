import React, { memo } from "react";
import { Globe, Check } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { SettingsSelect } from "@/features/settings/components/SettingsSelect";
import {
  TimezoneOption,
  DateFormatOption,
  TimeFormatOption,
} from "@/features/settings/components/types";

interface LocalizationSettingsProps {
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  onTimezoneChange: (val: string) => void;
  onDateFormatChange: (val: string) => void;
  onTimeFormatChange: (val: string) => void;
  timezones: TimezoneOption[];
  dateFormats: DateFormatOption[];
  timeFormats: TimeFormatOption[];
}

export const LocalizationSettings: React.FC<LocalizationSettingsProps> = memo(
  ({
    timezone,
    dateFormat,
    timeFormat,
    onTimezoneChange,
    onDateFormatChange,
    onTimeFormatChange,
    timezones,
    dateFormats,
    timeFormats,
  }) => {
    const { isDark } = useTheme();

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Globe className="w-5 h-5 text-cyan-500" />
          Localization
        </h3>

        <div className="space-y-6">
          {/* Timezone */}
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              User Timezone
            </label>
            <SettingsSelect
              options={timezones}
              value={timezone}
              onChange={onTimezoneChange}
            />
            <p
              className={`text-xs mt-2 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Your timezone is used to display timestamps consistently
              throughout the dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Format */}
            <div>
              <label
                className={`text-xs uppercase tracking-wider mb-3 block font-bold ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Date Format
              </label>
              <div className="space-y-2">
                {dateFormats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => onDateFormatChange(format.value)}
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
                className={`text-xs uppercase tracking-wider mb-3 block font-bold ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Time Format
              </label>
              <div className="space-y-2">
                {timeFormats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => onTimeFormatChange(format.value)}
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
    );
  },
);

LocalizationSettings.displayName = "LocalizationSettings";
