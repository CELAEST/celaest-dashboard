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
    <div className="space-y-4">
      {/* Header for Logs (Optional if needed, but the tab context usually implies it) */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h3
            className={`text-lg font-black uppercase tracking-tighter italic ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Security Audit Trail
          </h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
            Real-time Event Logging
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-500"}`}
        >
          {logs.length} Events Logged
        </div>
      </div>

      <div className="space-y-3">
        {logs.slice(0, 50).map((log, index) => (
          <motion.div
            key={`${log.timestamp}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
              isDark
                ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                : "bg-white border-gray-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 ${getActionColor(
                      log.action,
                    )}`}
                  >
                    {log.action.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`text-xs font-mono opacity-50 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div
                  className={`text-sm flex items-center gap-4 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-cyan-500" : "bg-blue-500"}`}
                    ></span>
                    <span className="font-mono text-xs opacity-70">UID:</span>{" "}
                    {log.userId.substring(0, 8)}...
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-purple-500" : "bg-purple-600"}`}
                    ></span>
                    <span className="font-mono text-xs opacity-70">IP:</span>{" "}
                    {log.ip}
                  </span>
                </div>
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div
                    className={`mt-2 text-xs font-mono p-2 rounded-lg ${isDark ? "bg-black/30 text-gray-400" : "bg-gray-50 text-gray-600"}`}
                  >
                    {JSON.stringify(log.metadata)}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

AuditLogsList.displayName = "AuditLogsList";
