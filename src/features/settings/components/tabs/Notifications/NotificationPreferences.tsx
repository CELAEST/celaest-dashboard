import React, { memo } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
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
              className={`text-[10px] uppercase tracking-[0.18em] font-mono font-semibold mb-3 flex items-center gap-2 ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              <section.icon size={14} />
              {section.title}
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isDark
                      ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div>
                    <p
                      className={`font-semibold text-sm ${
                        isDark ? "text-zinc-100" : "text-gray-900"
                      }`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-xs font-mono mt-0.5 ${
                        isDark ? "text-white/40" : "text-gray-400"
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
