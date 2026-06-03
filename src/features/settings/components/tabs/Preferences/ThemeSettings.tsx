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
          className={`text-lg font-bold mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Monitor className="w-5 h-5 text-cyan-500" />
          {t("appearance_theme")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {themes.map((item) => (
            <button
              key={item.id}
              onClick={() => onThemeChange(item.id)}
              className={`flex sm:flex-col items-center justify-start sm:justify-center gap-4 sm:gap-3 p-4 sm:p-6 rounded-2xl border transition-all ${
                currentTheme === item.id
                  ? "bg-cyan-500/10 border-cyan-500 text-cyan-500"
                  : isDark
                    ? "bg-black/20 border-white/5 hover:bg-white/5 text-gray-500"
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600"
              }`}
            >
              <item.icon
                className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 ${
                  currentTheme === item.id ? "text-cyan-500" : "opacity-40"
                }`}
              />
              <span className="text-xs font-black tracking-widest uppercase text-left sm:text-center">
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
