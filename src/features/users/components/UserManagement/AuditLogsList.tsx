import React, { memo, useState } from "react";
import { motion } from "motion/react";
import { Download, Loader2 } from "lucide-react";
import { AuditLog } from "../types";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { auditApi } from "../../api/audit.api";
import { useApiAuth } from "@/lib/use-api-auth";
import { toast } from "sonner";

interface AuditLogsListProps {
  logs: AuditLog[];
}

export const AuditLogsList = memo(({ logs }: AuditLogsListProps) => {
  const { isDark } = useTheme();
  const { token, orgId } = useApiAuth();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    if (!token || !orgId) return;
    setIsExporting(true);
    try {
      await auditApi.exportAuditLogs(token, orgId);
      toast.success("Audit logs exported successfully");
    } catch {
      toast.error("Failed to export audit logs");
    } finally {
      setIsExporting(false);
    }
  };

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
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={isExporting || logs.length === 0}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
              isDark
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {isExporting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Download size={12} />
            )}
            Export CSV
          </button>
          <div
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? "bg-white/5 text-cyan-400 border border-white/5" : "bg-gray-100 text-gray-500"}`}
          >
            {logs.length} Events Logged
          </div>
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
