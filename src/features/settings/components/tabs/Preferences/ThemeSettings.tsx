import React, { memo } from "react";
import { Monitor, Sun, Moon } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

import { Theme } from "@/stores/useUIStore";

interface ThemeSettingsProps {
  currentTheme: Theme | undefined;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = memo(
  ({ currentTheme, onThemeChange }) => {
    const { isDark, isMounted } = useTheme();
    const t = useTranslations("settings");

    if (!isMounted) return null;

    const themes: { id: Theme; icon: typeof Sun; label: string }[] = [
      { id: "light", icon: Sun, label: t("light_mode") },
      { id: "dark", icon: Moon, label: t("dark_mode") },
      { id: "system", icon: Monitor, label: t("system_theme") },
    ];

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-base font-bold font-jakarta mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Monitor className={`w-5 h-5 ${isDark ? "text-white/80" : "text-gray-700"}`} />
          {t("appearance_theme")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {themes.map((item) => (
            <button
              key={item.id}
              onClick={() => onThemeChange(item.id)}
              className={`flex sm:flex-col items-center justify-start sm:justify-center gap-4 sm:gap-3 p-4 sm:p-5 rounded-xl border transition-all cursor-pointer font-mono ${
                currentTheme === item.id
                  ? isDark
                    ? "bg-zinc-800/40 border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-100 font-semibold"
                    : "bg-white border-black/6 text-gray-900 shadow-sm font-semibold"
                  : isDark
                    ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-200"
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600"
              }`}
            >
              <item.icon
                className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 ${
                  currentTheme === item.id ? (isDark ? "text-zinc-100" : "text-gray-900") : "opacity-40"
                }`}
              />
              <span className="text-xs uppercase tracking-wider text-left sm:text-center">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  },
);

ThemeSettings.displayName = "ThemeSettings";
