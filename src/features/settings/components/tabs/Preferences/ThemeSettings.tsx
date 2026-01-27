import React, { memo } from "react";
import { Monitor, Sun, Moon } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";

import { Theme } from "@/stores/useUIStore";

interface ThemeSettingsProps {
  currentTheme: Theme | undefined;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = memo(
  ({ currentTheme, onThemeChange }) => {
    const { isDark, isMounted } = useTheme();

    if (!isMounted) return null;

    const themes: { id: Theme; icon: typeof Sun; label: string }[] = [
      { id: "light", icon: Sun, label: "Light Mode" },
      { id: "dark", icon: Moon, label: "Dark Mode" },
      { id: "system", icon: Monitor, label: "System" },
    ];

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Monitor className="w-5 h-5 text-cyan-500" />
          Appearance & Theme
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {themes.map((item) => (
            <button
              key={item.id}
              onClick={() => onThemeChange(item.id)}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                currentTheme === item.id
                  ? "bg-cyan-500/10 border-cyan-500 text-cyan-500"
                  : isDark
                    ? "bg-black/20 border-white/5 hover:bg-white/5 text-gray-500"
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600"
              }`}
            >
              <item.icon
                className={`w-6 h-6 ${
                  currentTheme === item.id ? "text-cyan-500" : "opacity-40"
                }`}
              />
              <span className="text-xs font-black tracking-widest uppercase">
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
