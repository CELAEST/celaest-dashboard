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
import {
  ErrorLog,
  ErrorStatus,
} from "@/features/errors/hooks/useErrorMonitoring";
import { ErrorBadge } from "./ErrorBadge";
import { ErrorDetails } from "./ErrorDetails";

interface ErrorListItemProps {
  error: ErrorLog;
  index: number;
  expandedError: string | null;
  toggleErrorExpansion: (errorId: string) => void;
  onStatusUpdate: (errorId: string, status: ErrorStatus) => Promise<void>;
  isAdmin: boolean;
  isDark: boolean;
}

export const ErrorListItem = React.memo(
  ({
    error,
    index,
    expandedError,
    toggleErrorExpansion,
    onStatusUpdate,
    isAdmin,
    isDark,
  }: ErrorListItemProps) => {
    const isExpanded = expandedError === error.id;

    return (
      <motion.li
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ delay: index * 0.03 }}
        className={`group backdrop-blur-xl border rounded-xl overflow-hidden list-none transition-all duration-300 ${
          isDark
            ? "bg-[#0a0a0a]/60 border-white/5 hover:border-white/10"
            : "bg-white border-gray-200 shadow-sm hover:shadow-md"
        } ${isExpanded ? "ring-2 ring-cyan-500/30" : ""}`}
      >
        <button
          className={`w-full text-left p-5 cursor-pointer transition-colors outline-none ${
            isExpanded ? (isDark ? "bg-white/2" : "bg-gray-50/50") : ""
          }`}
          onClick={() => toggleErrorExpansion(error.id)}
          aria-expanded={isExpanded}
          aria-controls={`error-details-${error.id}`}
        >
          <div className="flex items-start justify-between gap-6">
            {/* Left: Severity Indicator Line */}
            <div
              className={`w-1.5 h-12 rounded-full shrink-0 ${
                error.severity === "critical"
                  ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                  : error.severity === "warning"
                    ? "bg-orange-500"
                    : error.severity === "info"
                      ? "bg-blue-500"
                      : "bg-gray-500"
              }`}
            />

            <div className="flex-1 min-w-0">
              {/* Metadata Header */}
              <div className="flex items-center flex-wrap gap-3 mb-2.5">
                <span
                  className={`font-mono text-[10px] font-black px-2 py-0.5 rounded-md ${
                    isDark
                      ? "bg-white/5 text-cyan-400 border border-white/10"
                      : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}
                >
                  {error.errorCode}
                </span>
                <ErrorBadge
                  type="status"
                  value={error.status}
                  isDark={isDark}
                />
                <span
                  className={`flex items-center gap-1.5 text-[11px] font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  <Clock size={12} />
                  {error.timestamp}
                </span>
              </div>

              {/* Main Message */}
              <p
                className={`text-lg font-bold mb-3 leading-tight ${
                  isDark
                    ? "text-white group-hover:text-cyan-50"
                    : "text-gray-900 group-hover:text-blue-900"
                }`}
              >
                {error.message}
              </p>

              {/* Footer Metadata */}
              <div className="flex items-center gap-6 text-[11px] font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                <span
                  className={`flex items-center gap-1.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  <Code
                    size={13}
                    className={isDark ? "text-cyan-500" : "text-blue-500"}
                  />
                  {error.template}
                </span>
                <span
                  className={`flex items-center gap-1.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  <Monitor
                    size={13}
                    className={isDark ? "text-purple-500" : "text-purple-600"}
                  />
                  {error.environment.os}
                </span>
                {isAdmin && error.affectedUsers > 20 && (
                  <span className="flex items-center gap-1.5 font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                    <TrendingDown size={12} />
                    {error.affectedUsers} users
                  </span>
                )}
              </div>
            </div>

            {/* Expand Icon */}
            <div
              className={`p-2.5 rounded-lg transition-all duration-300 self-center ${
                isDark
                  ? "bg-white/5 text-gray-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-400"
                  : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
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
              <ErrorDetails
                error={error}
                isDark={isDark}
                isAdmin={isAdmin}
                onStatusUpdate={(status) => onStatusUpdate(error.id, status)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.li>
    );
  },
);

ErrorListItem.displayName = "ErrorListItem";
