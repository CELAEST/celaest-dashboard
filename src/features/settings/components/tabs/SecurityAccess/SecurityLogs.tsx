import React, { memo } from "react";
import { Warning, ArrowCounterClockwise } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { SecurityLog } from "../../../hooks/useSecuritySettings";
import { useTranslations } from "next-intl";

interface SecurityLogsProps {
  logs: SecurityLog[];
  isLoading: boolean;
}

export const SecurityLogs: React.FC<SecurityLogsProps> = memo(
  ({ logs, isLoading }) => {
    const { isDark } = useTheme();
    const t = useTranslations("settings");

    return (
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-base font-bold font-jakarta flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <Warning className={`w-5 h-5 ${isDark ? "text-white/80" : "text-gray-700"}`} />
            {t("security_logs")}
          </h3>
          <button
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? "hover:bg-white/5 text-white/50 hover:text-white"
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
            <div className="py-8 text-center text-xs font-mono text-white/40">
              {t("loading_activity")}
            </div>
          ) : logs.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-white/40">
              {t("no_recent_activity")}
            </div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-3.5 border-b last:border-0 transition-colors ${
                  isDark ? "border-white/[0.06]" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                      isDark
                        ? "bg-white/[0.04] text-white/60 border-white/8"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {log.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold truncate ${
                        isDark ? "text-zinc-100" : "text-gray-800"
                      }`}
                    >
                      {log.event}
                    </p>
                    <p className={`text-[11px] mt-0.5 font-mono truncate ${isDark ? "text-white/40" : "text-gray-500"}`}>
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
