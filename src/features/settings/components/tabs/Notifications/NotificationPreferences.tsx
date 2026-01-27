import React, { memo } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { NotificationSection } from "../../../hooks/useNotificationSettings";

interface NotificationPreferencesProps {
  sections: NotificationSection[];
  prefs: Record<string, boolean>;
  onToggle: (id: string) => void;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> =
  memo(({ sections, prefs, onToggle }) => {
    const { isDark } = useTheme();

    return (
      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h4
              className={`text-xs uppercase tracking-[0.2em] font-black mb-4 flex items-center gap-2 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <section.icon size={14} />
              {section.title}
            </h4>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isDark
                      ? "bg-black/20 border-white/5"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div>
                    <p
                      className={`font-bold text-sm ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                  <div
                    onClick={() => onToggle(item.id)}
                    className={`settings-toggle-switch ${
                      prefs[item.id] ? "active" : ""
                    }`}
                  >
                    <div className="settings-toggle-thumb" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  });

NotificationPreferences.displayName = "NotificationPreferences";
