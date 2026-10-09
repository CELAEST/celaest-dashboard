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
          className={`text-base font-bold font-jakarta mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Shield className={`w-5 h-5 ${isDark ? "text-white/80" : "text-gray-700"}`} />
          {t("active_sessions")}
        </h3>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 sm:p-4 rounded-xl border transition-all ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors shrink-0 border ${
                    isDark ? "bg-white/[0.04] border-white/8 text-white/70" : "bg-white border-gray-100 text-gray-500"
                  }`}
                >
                  <ClockCounterClockwise
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p
                      className={`font-bold text-sm truncate font-mono ${
                        isDark ? "text-zinc-100" : "text-gray-900"
                      }`}
                    >
                      {session.device}
                    </p>
                    {session.current && (
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold shrink-0 border ${
                          isDark
                            ? "bg-white/[0.08] text-white border-white/10"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                      >
                        {t("current_device")}
                      </span>
                    )}
                  </div>
                  {/* Desktop: single line */}
                  <p
                    className={`text-xs truncate hidden sm:block font-mono ${
                      isDark ? "text-white/40" : "text-gray-400"
                    }`}
                  >
                    {session.location} • {session.ip} • {session.lastActive}
                  </p>
                  {/* Mobile: wrapped for readability */}
                  <div className="flex sm:hidden flex-wrap gap-x-2 gap-y-0.5 mt-0.5 font-mono text-xs">
                    <span className={isDark ? "text-white/40" : "text-gray-400"}>{session.location}</span>
                    <span className={isDark ? "text-white/20" : "text-gray-300"}>•</span>
                    <span className={isDark ? "text-white/40" : "text-gray-400"}>{session.ip}</span>
                    <span className={isDark ? "text-white/20" : "text-gray-300"}>•</span>
                    <span className={isDark ? "text-white/40" : "text-gray-400"}>{session.lastActive}</span>
                  </div>
                </div>

                {/* Desktop terminate button */}
                {!session.current && (
                  <button
                    onClick={() => onLogoutSession(session.id)}
                    className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 cursor-pointer transition-all shrink-0"
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
                  className="flex sm:hidden items-center justify-center gap-2 w-full mt-3 px-3 py-1.5 rounded text-xs font-mono border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 cursor-pointer transition-all"
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
