import React, { memo } from "react";
import { Shield, ClockCounterClockwise, SignOut } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

export interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  current: boolean;
  lastActive: string;
}

interface SecuritySessionsProps {
  sessions: Session[];
  onLogoutSession: (id: string) => void;
}

export const SecuritySessions: React.FC<SecuritySessionsProps> = memo(
  ({ sessions, onLogoutSession }) => {
    const { isDark } = useTheme();
    const t = useTranslations("settings");

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Shield className="w-5 h-5 text-cyan-500" />
          {t("active_sessions")}
        </h3>

        <div className="space-y-3 sm:space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 sm:p-4 rounded-xl border transition-all hover:border-cyan-500/30 ${
                isDark
                  ? "bg-black/20 border-white/5"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors shadow-sm shrink-0 ${
                    isDark ? "bg-gray-800" : "bg-white border border-gray-100"
                  }`}
                >
                  <ClockCounterClockwise
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p
                      className={`font-bold text-sm truncate ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {session.device}
                    </p>
                    {session.current && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                          isDark
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-cyan-100 text-cyan-600"
                        }`}
                      >
                        {t("current_device")}
                      </span>
                    )}
                  </div>
                  {/* Desktop: single line */}
                  <p
                    className={`text-xs truncate hidden sm:block ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {session.location} • {session.ip} • {session.lastActive}
                  </p>
                  {/* Mobile: wrapped for readability */}
                  <div className="flex sm:hidden flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                    <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{session.location}</span>
                    <span className={`text-xs ${isDark ? "text-gray-600" : "text-gray-300"}`}>•</span>
                    <span className={`text-xs font-mono ${isDark ? "text-gray-500" : "text-gray-400"}`}>{session.ip}</span>
                    <span className={`text-xs ${isDark ? "text-gray-600" : "text-gray-300"}`}>•</span>
                    <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{session.lastActive}</span>
                  </div>
                </div>

                {/* Desktop terminate button */}
                {!session.current && (
                  <button
                    onClick={() => onLogoutSession(session.id)}
                    className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      isDark
                        ? "text-red-400 hover:bg-red-500/10 border border-red-500/20"
                        : "text-red-600 hover:bg-red-50 border border-red-200 shadow-xs"
                    }`}
                  >
                    <SignOut size={14} />
                    {t("terminate")}
                  </button>
                )}
              </div>

              {/* Mobile terminate button - full width below */}
              {!session.current && (
                <button
                  onClick={() => onLogoutSession(session.id)}
                  className={`flex sm:hidden items-center justify-center gap-2 w-full mt-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    isDark
                      ? "text-red-400 hover:bg-red-500/10 border border-red-500/20"
                      : "text-red-600 hover:bg-red-50 border border-red-200 shadow-xs"
                  }`}
                >
                  <SignOut size={14} />
                  {t("terminate")}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

SecuritySessions.displayName = "SecuritySessions";
