import React from "react";
import { motion } from "motion/react";
import { Activity, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";

export const EventLogs = React.memo(() => {
  const { isDark, eventLogs } = useAnalytics();

  const getStatusStyles = (type: string) => {
    switch (type) {
      case "error":
        return {
          bg: isDark ? "bg-red-500/5" : "bg-red-50",
          border: isDark ? "border-red-500/20" : "border-red-200",
          text: "text-red-400",
          iconBg: isDark ? "bg-red-500/10" : "bg-red-100",
          icon: AlertCircle,
        };
      case "warning":
        return {
          bg: isDark ? "bg-orange-500/5" : "bg-orange-50",
          border: isDark ? "border-orange-500/20" : "border-orange-200",
          text: "text-orange-400",
          iconBg: isDark ? "bg-orange-500/10" : "bg-orange-100",
          icon: AlertCircle,
        };
      case "success":
        return {
          bg: isDark ? "bg-green-500/5" : "bg-green-50",
          border: isDark ? "border-green-500/20" : "border-green-200",
          text: "text-green-400",
          iconBg: isDark ? "bg-green-500/10" : "bg-green-100",
          icon: CheckCircle,
        };
      default:
        return {
          bg: isDark ? "bg-blue-500/5" : "bg-blue-50",
          border: isDark ? "border-blue-500/20" : "border-blue-200",
          text: "text-blue-400",
          iconBg: isDark ? "bg-blue-500/10" : "bg-blue-100",
          icon: Info,
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity
              className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            />
            <h3
              className={`font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              GLOBAL_EVENT_LOGS
            </h3>
          </div>
          <div className="flex gap-2">
            {["Live", "Filtered", "Search"].map((tab, idx) => (
              <button
                key={idx}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  idx === 0
                    ? isDark
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                    : isDark
                      ? "text-gray-400 hover:text-cyan-400 hover:bg-white/5"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table */}
        <div
          className={`rounded-xl overflow-hidden ${
            isDark ? "bg-white/5" : "bg-gray-50"
          }`}
        >
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  isDark ? "border-white/10" : "border-gray-200"
                }`}
              >
                <th
                  className={`text-left px-4 py-3 text-xs font-semibold tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  STATUS
                </th>
                <th
                  className={`text-left px-4 py-3 text-xs font-semibold tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  TIMESTAMP
                </th>
                <th
                  className={`text-left px-4 py-3 text-xs font-semibold tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  MESSAGE
                </th>
              </tr>
            </thead>
            <tbody>
              {eventLogs.map((log) => {
                const styles = getStatusStyles(log.type);
                const Icon = styles.icon;
                return (
                  <tr
                    key={log.id}
                    className={`border-b transition-colors duration-200 ${
                      isDark
                        ? "border-white/5 hover:bg-white/5"
                        : "border-gray-100 hover:bg-white"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${styles.iconBg} border ${styles.border}`}
                      >
                        <Icon className={`w-3 h-3 ${styles.text}`} />
                        <span
                          className={`text-xs font-bold uppercase ${styles.text}`}
                        >
                          {log.type}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-mono ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {log.time}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {log.message}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
});

EventLogs.displayName = "EventLogs";
