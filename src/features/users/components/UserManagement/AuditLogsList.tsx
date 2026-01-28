import React, { memo } from "react";
import { motion } from "motion/react";
import { AuditLog } from "../types";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface AuditLogsListProps {
  logs: AuditLog[];
}

export const AuditLogsList = memo(({ logs }: AuditLogsListProps) => {
  const { isDark } = useTheme();

  const getActionColor = (action: string) => {
    if (action.includes("login"))
      return isDark ? "text-green-400" : "text-green-600";
    if (action.includes("logout") || action.includes("signout"))
      return isDark ? "text-yellow-400" : "text-yellow-600";
    if (action.includes("role_changed"))
      return isDark ? "text-purple-400" : "text-purple-600";
    if (action.includes("registered"))
      return isDark ? "text-cyan-400" : "text-cyan-600";
    return isDark ? "text-gray-400" : "text-gray-600";
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header for Logs (Fixed) */}
      <div className="shrink-0 flex items-center justify-between mb-6 px-2">
        <div>
          <h3
            className={`text-lg font-black uppercase tracking-tighter italic ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Security Audit Trail
          </h3>
          <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mt-1">
            Real-time Event Logging
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? "bg-white/5 text-cyan-400 border border-white/5" : "bg-gray-100 text-gray-500"}`}
        >
          {logs.length} Events Logged
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar pr-2 pb-6">
          <div className="space-y-3">
            {logs.slice(0, 50).map((log, index) => (
              <motion.div
                key={`${log.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.01 }}
                className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
                  isDark
                    ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 shadow-inner"
                    : "bg-white border-gray-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 ${getActionColor(
                          log.action,
                        )}`}
                      >
                        {log.action.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`text-[10px] font-mono opacity-50 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div
                      className={`text-xs flex items-center gap-6 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-cyan-500" : "bg-blue-500"}`}
                        ></span>
                        <span className="font-mono text-[10px] opacity-70 uppercase tracking-tighter">
                          UID:
                        </span>{" "}
                        {log.userId.substring(0, 8)}...
                      </span>
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-purple-500" : "bg-purple-600"}`}
                        ></span>
                        <span className="font-mono text-[10px] opacity-70 uppercase tracking-tighter">
                          IP:
                        </span>{" "}
                        {log.ip}
                      </span>
                    </div>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div
                        className={`mt-3 text-[10px] font-mono p-3 rounded-xl border border-white/5 ${isDark ? "bg-black/40 text-gray-500" : "bg-gray-50 text-gray-600"}`}
                      >
                        {JSON.stringify(log.metadata, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

AuditLogsList.displayName = "AuditLogsList";
