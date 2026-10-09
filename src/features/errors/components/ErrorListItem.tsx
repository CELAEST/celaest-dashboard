import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  Code,
  Monitor,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ delay: Math.min(index * 0.02, 0.2) }}
        className={`rounded-xl border transition-all duration-200 overflow-hidden list-none ${
          isExpanded
            ? isDark
              ? "bg-[#080c14] border-white/15 ring-1 ring-white/10 shadow-lg"
              : "bg-white border-gray-300 ring-1 ring-gray-200 shadow-md"
            : isDark
              ? "bg-[#080c14]/70 border-white/6 hover:border-white/12"
              : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
        }`}
      >
        <button
          type="button"
          className={`w-full text-left p-4 sm:p-5 cursor-pointer transition-colors outline-none flex items-start justify-between gap-4 ${
            isExpanded ? (isDark ? "bg-white/[0.02]" : "bg-gray-50/40") : ""
          }`}
          onClick={() => toggleErrorExpansion(error.id)}
          aria-expanded={isExpanded}
          aria-controls={`error-details-${error.id}`}
        >
          <div className="flex items-start gap-3.5 min-w-0">
            {/* Left: Severity Indicator Line */}
            <div
              className={`w-1.5 h-11 rounded-full shrink-0 ${
                error.severity === "critical"
                  ? "bg-red-500/80"
                  : error.severity === "warning"
                    ? isDark ? "bg-white/40" : "bg-amber-500"
                    : isDark ? "bg-white/20" : "bg-gray-300"
              }`}
            />

            <div className="space-y-1.5 min-w-0">
              {/* Metadata Header */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-white/80"
                      : "border-gray-200 bg-gray-100 text-gray-800"
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
                  className={`flex items-center gap-1 text-[11px] font-mono ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}
                >
                  <Clock size={11} />
                  {error.timestamp}
                </span>
              </div>

              {/* Main Error Message */}
              <p
                className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {error.message}
              </p>

              {/* Footer Metadata */}
              <div
                className={`flex items-center gap-4 text-xs font-mono flex-wrap pt-0.5 ${
                  isDark ? "text-white/40" : "text-gray-500"
                }`}
              >
                <span
                  className={`flex items-center gap-1.5 ${
                    isDark ? "text-white/60" : "text-gray-700"
                  }`}
                >
                  <Code size={12} />
                  {error.template}
                </span>
                <span
                  className={`flex items-center gap-1.5 ${
                    isDark ? "text-white/60" : "text-gray-700"
                  }`}
                >
                  <Monitor size={12} />
                  {error.environment.os}
                </span>
                {error.userEmail && (
                  <span>
                    Usuario:{" "}
                    <strong
                      className={`font-semibold ${
                        isDark ? "text-white/70" : "text-gray-800"
                      }`}
                    >
                      {error.userEmail}
                    </strong>
                  </span>
                )}
                {isAdmin && error.affectedUsers > 1 && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      isDark
                        ? "bg-white/[0.04] text-white/60 border-white/6"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {error.affectedUsers} cuentas
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Expand Icon */}
          <div
            className={`shrink-0 p-1.5 rounded transition-colors self-start mt-1 ${
              isDark ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-600"
            }`}
          >
            {isExpanded ? <CaretUp size={15} /> : <CaretDown size={15} />}
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={`error-details-${error.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
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

