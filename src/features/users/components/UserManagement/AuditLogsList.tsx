import React, { memo } from "react";
import { motion } from "motion/react";
import { AuditLog } from "../types";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
    <Card
      className={`${
        isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-white border-gray-200"
      }`}
    >
      <CardHeader>
        <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
          Security Audit Logs
        </CardTitle>
        <CardDescription>
          Real-time tracking of all security events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {logs.slice(0, 50).map((log, index) => (
            <motion.div
              key={`${log.timestamp}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`p-4 rounded-lg border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-mono font-medium ${getActionColor(
                        log.action,
                      )}`}
                    >
                      {log.action.replace(/_/g, " ").toUpperCase()}
                    </span>
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span>User ID: {log.userId.substring(0, 8)}...</span>
                    <span className="mx-2">•</span>
                    <span>IP: {log.ip}</span>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="font-mono text-xs">
                          {JSON.stringify(log.metadata)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

AuditLogsList.displayName = "AuditLogsList";
