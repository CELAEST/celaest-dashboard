import React, { memo } from "react";
import { Shield, History, LogOut } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

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

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-lg font-bold mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Shield className="w-5 h-5 text-cyan-500" />
          Active Sessions
        </h3>

        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:border-cyan-500/30 ${
                isDark
                  ? "bg-black/20 border-white/5"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-sm ${
                    isDark ? "bg-gray-800" : "bg-white border border-gray-100"
                  }`}
                >
                  <History
                    className={`w-5 h-5 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-bold text-sm ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {session.device}
                    </p>
                    {session.current && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isDark
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-cyan-100 text-cyan-600"
                        }`}
                      >
                        CURRENT DEVICE
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {session.location} • {session.ip} • {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <button
                  onClick={() => onLogoutSession(session.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isDark
                      ? "text-red-400 hover:bg-red-500/10 border border-red-500/20"
                      : "text-red-600 hover:bg-red-50 border border-red-200 shadow-xs"
                  }`}
                >
                  <LogOut size={14} />
                  Terminate
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
