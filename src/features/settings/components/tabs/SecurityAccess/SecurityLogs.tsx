import React, { memo } from "react";
import { Warning, ArrowCounterClockwise } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { SecurityLog } from "../../../hooks/useSecuritySettings";

interface SecurityLogsProps {
  logs: SecurityLog[];
  isLoading: boolean;
}

export const SecurityLogs: React.FC<SecurityLogsProps> = memo(
  ({ logs, isLoading }) => {
    const { isDark } = useTheme();

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-lg font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <Warning className="w-5 h-5 text-amber-500" />
            Security Logs
          </h3>
          <button
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-white/5 text-gray-500"
                : "hover:bg-gray-100 text-gray-400"
            }`}
          >
            <ArrowCounterClockwise
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="space-y-1">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Loading activity...
            </div>
          ) : logs.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No recent activity detected.
            </div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-4 border-b last:border-0 transition-colors ${
                  isDark ? "border-white/5" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      log.type === "auth"
                        ? "bg-emerald-500"
                        : log.type === "login"
                          ? "bg-cyan-500"
                          : "bg-amber-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {log.event}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5 tracking-tight font-mono truncate">
                      {log.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  },
);

SecurityLogs.displayName = "SecurityLogs";
