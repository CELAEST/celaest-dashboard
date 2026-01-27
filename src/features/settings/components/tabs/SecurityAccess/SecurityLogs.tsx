import React, { memo } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const SecurityLogs: React.FC = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-bold flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Security Logs
        </h3>
        <button
          className={`p-2 rounded-lg transition-colors ${
            isDark
              ? "hover:bg-white/5 text-gray-500"
              : "hover:bg-gray-100 text-gray-400"
          }`}
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      <div className="space-y-1">
        {[
          {
            event: "Password changed successfully",
            time: "Dec 24, 2023 at 14:32",
            type: "auth",
          },
          {
            event: "New login from Madrid, Spain",
            time: "Dec 22, 2023 at 09:15",
            type: "login",
          },
          {
            event: "Two-factor authentication disabled",
            time: "Dec 15, 2023 at 18:40",
            type: "security",
          },
        ].map((log, i) => (
          <div
            key={i}
            className={`flex items-center justify-between py-4 border-b last:border-0 transition-colors ${
              isDark ? "border-white/5" : "border-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  log.type === "auth"
                    ? "bg-emerald-500"
                    : log.type === "login"
                      ? "bg-cyan-500"
                      : "bg-amber-500"
                }`}
              />
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {log.event}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 tracking-tight font-mono">
                  {log.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

SecurityLogs.displayName = "SecurityLogs";
