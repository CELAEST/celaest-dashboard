import React from "react";
import { Warning, Info, Check, X, Clock } from "@phosphor-icons/react";
import {
  ErrorSeverity,
  ErrorStatus,
} from "@/features/errors/hooks/useErrorMonitoring";

interface ErrorBadgeProps {
  type: "severity" | "status";
  value: ErrorSeverity | ErrorStatus;
  isDark: boolean;
}

export const ErrorBadge = React.memo(
  ({ type, value, isDark }: ErrorBadgeProps) => {
    if (type === "severity") {
      const severity = value as ErrorSeverity;
      const icons = {
        critical: <Warning size={14} />,
        warning: <Warning size={14} />,
        info: <Info size={14} />,
      };

      if (severity === "critical") {
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider ${
              isDark
                ? "bg-red-500/10 text-red-300 border border-red-500/20 font-medium"
                : "bg-red-50 text-red-700 border border-red-200 font-medium"
            }`}
          >
            {icons.critical}
            Crítico
          </span>
        );
      }

      if (severity === "warning") {
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider ${
              isDark
                ? "bg-white/[0.04] text-white/70 border border-white/[0.06] font-medium"
                : "bg-gray-100 text-gray-700 border border-gray-200 font-medium"
            }`}
          >
            {icons.warning}
            Advertencia
          </span>
        );
      }

      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider ${
            isDark
              ? "bg-white/[0.03] text-white/50 border border-white/[0.05] font-medium"
              : "bg-gray-50 text-gray-600 border border-gray-200 font-medium"
          }`}
        >
          {icons.info}
          Info
        </span>
      );
    }

    const status = value as ErrorStatus;

    if (status === "resolved") {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold shadow-xs border ${
            isDark
              ? "bg-white/[0.08] text-white border-white/10"
              : "bg-gray-100 text-gray-900 border-gray-300"
          }`}
        >
          <Check size={10} strokeWidth={3} className={isDark ? "text-white/80" : "text-gray-800"} />
          Resuelto
        </span>
      );
    }

    if (status === "failed") {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider border font-medium ${
            isDark
              ? "bg-red-500/10 text-red-300 border border-red-500/20"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <X size={10} strokeWidth={3} className={isDark ? "text-red-400" : "text-red-600"} />
          Fallido
        </span>
      );
    }

    if (status === "reviewing") {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider border font-medium ${
            isDark
              ? "bg-white/[0.04] text-white/70 border border-white/[0.06]"
              : "bg-gray-100 text-gray-700 border border-gray-200"
          }`}
        >
          <Clock size={10} className={isDark ? "text-white/40" : "text-gray-500"} />
          En Revisión
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider border font-medium ${
          isDark
            ? "bg-white/[0.03] text-white/50 border border-white/[0.05]"
            : "bg-gray-50 text-gray-500 border border-gray-200"
        }`}
      >
        <Clock size={10} className={isDark ? "text-white/40" : "text-gray-400"} />
        Ignorado
      </span>
    );
  },
);

ErrorBadge.displayName = "ErrorBadge";

