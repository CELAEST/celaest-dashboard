import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  Code,
  Monitor,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ErrorLog } from "@/features/errors/hooks/useErrorMonitoring";
import { ErrorBadge } from "./ErrorBadge";
import { ErrorDetails } from "./ErrorDetails";

interface ErrorListItemProps {
  error: ErrorLog;
  index: number;
  expandedError: string | null;
  toggleErrorExpansion: (errorId: string) => void;
  isAdmin: boolean;
  isDark: boolean;
}

export const ErrorListItem = React.memo(
  ({
    error,
    index,
    expandedError,
    toggleErrorExpansion,
    isAdmin,
    isDark,
  }: ErrorListItemProps) => {
    const isExpanded = expandedError === error.id;

    return (
      <motion.li
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.05 }}
        className={`backdrop-blur-xl border rounded-2xl overflow-hidden list-none ${
          isDark
            ? "bg-[#0a0a0a]/60 border-white/5"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <button
          className={`w-full text-left p-6 cursor-pointer hover:bg-white/5 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 ${
            isExpanded ? (isDark ? "bg-white/5" : "bg-gray-50") : ""
          }`}
          onClick={() => toggleErrorExpansion(error.id)}
          aria-expanded={isExpanded}
          aria-controls={`error-details-${error.id}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <ErrorBadge
                type="severity"
                value={error.severity}
                isDark={isDark}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`font-mono text-sm font-bold ${isDark ? "text-cyan-400" : "text-blue-600"}`}
                  >
                    {error.errorCode}
                  </span>
                  <ErrorBadge
                    type="status"
                    value={error.status}
                    isDark={isDark}
                  />
                  <span
                    className={`flex items-center gap-1 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    <Clock size={12} />
                    {error.timestamp}
                  </span>
                </div>

                <p
                  className={`font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {error.message}
                </p>

                <div className="flex items-center gap-4 text-xs">
                  <span
                    className={`flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <Code size={12} />
                    {error.template}
                  </span>
                  <span
                    className={`flex items-center gap-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <Monitor size={12} />
                    {error.environment.os}
                  </span>
                  {isAdmin && (
                    <span
                      className={`flex items-center gap-1 font-medium ${
                        error.affectedUsers > 20
                          ? "text-red-400"
                          : isDark
                            ? "text-cyan-400"
                            : "text-blue-600"
                      }`}
                    >
                      <TrendingDown size={12} />
                      {error.affectedUsers} usuarios afectados
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                isDark
                  ? "text-gray-400 group-hover:bg-white/10"
                  : "text-gray-600 group-hover:bg-gray-100"
              }`}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={`error-details-${error.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`border-t overflow-hidden ${isDark ? "border-white/5" : "border-gray-200"}`}
            >
              <ErrorDetails error={error} isDark={isDark} isAdmin={isAdmin} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.li>
    );
  },
);

ErrorListItem.displayName = "ErrorListItem";
