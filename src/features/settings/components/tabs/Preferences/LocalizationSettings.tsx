import React, { memo } from "react";
import { Globe, Check } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { SettingsSelect } from "@/features/settings/components/SettingsSelect";
import {
  TimezoneOption,
  DateFormatOption,
  TimeFormatOption,
} from "@/features/settings/components/types";
import { useTranslations } from "next-intl";

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
    const t = useTranslations("settings");

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-base font-bold font-jakarta mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Globe className={`w-5 h-5 ${isDark ? "text-white/80" : "text-gray-700"}`} />
          {t("localization")}
        </h3>

        <div className="space-y-6">
          {/* Timezone */}
          <div>
            <label
              className={`text-[10px] font-mono uppercase tracking-wider mb-2 block ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {t("user_timezone")}
            </label>
            <SettingsSelect
              options={timezones}
              value={timezone}
              onChange={onTimezoneChange}
            />
            <p
              className={`text-xs mt-2 font-mono ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {t("timezone_desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Format */}
            <div>
              <label
                className={`text-[10px] font-mono uppercase tracking-wider mb-3 block ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                {t("date_format")}
              </label>
              <div className="space-y-2">
                {dateFormats.map((format) => (
                  <button
                    key={format.value}
                    type="button"
                    onClick={() => onDateFormatChange(format.value)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer font-mono ${
                      dateFormat === format.value
                        ? isDark
                          ? "bg-zinc-800/40 border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-100 font-semibold"
                          : "bg-white border-black/6 text-gray-900 shadow-sm font-semibold"
                        : isDark
                          ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-200"
                          : "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-xs font-semibold">{format.label}</p>
                      <p className="text-[10px] opacity-60 tracking-tight mt-0.5">
                        {format.desc}
                      </p>
                    </div>
                    {dateFormat === format.value && <Check size={14} weight="bold" className={isDark ? "text-zinc-100" : "text-gray-900"} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Format */}
            <div>
              <label
                className={`text-[10px] font-mono uppercase tracking-wider mb-3 block ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                {t("time_format")}
              </label>
              <div className="space-y-2">
                {timeFormats.map((format) => (
                  <button
                    key={format.value}
                    type="button"
                    onClick={() => onTimeFormatChange(format.value)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer font-mono ${
                      timeFormat === format.value
                        ? isDark
                          ? "bg-zinc-800/40 border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-100 font-semibold"
                          : "bg-white border-black/6 text-gray-900 shadow-sm font-semibold"
                        : isDark
                          ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-200"
                          : "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-xs font-semibold">{format.label}</p>
                      <p className="text-[10px] opacity-60 tracking-tight mt-0.5">
                        {format.desc}
                      </p>
                    </div>
                    {timeFormat === format.value && <Check size={14} weight="bold" className={isDark ? "text-zinc-100" : "text-gray-900"} />}
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
