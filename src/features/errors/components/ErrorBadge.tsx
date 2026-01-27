import React from "react";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
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
        critical: <AlertTriangle size={16} />,
        warning: <AlertCircle size={16} />,
        info: <Info size={16} />,
      };

      const colors = {
        critical: "red",
        warning: "orange",
        info: isDark ? "cyan" : "blue",
      };

      const baseColors = {
        critical: isDark ? "bg-red-500/20" : "bg-red-50",
        warning: isDark ? "bg-orange-500/20" : "bg-orange-50",
        info: isDark ? "bg-cyan-500/20" : "bg-blue-50",
      };

      return (
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${baseColors[severity]}`}
        >
          <span className={`text-${colors[severity]}-400`}>
            {icons[severity]}
          </span>
        </div>
      );
    }

    const status = value as ErrorStatus;
    const statusColors = {
      new: isDark
        ? "bg-red-500/20 text-red-400 border-red-500/30"
        : "bg-red-50 text-red-600 border-red-200",
      reviewing: isDark
        ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
        : "bg-orange-50 text-orange-600 border-orange-200",
      resolved: isDark
        ? "bg-green-500/20 text-green-400 border-green-500/30"
        : "bg-green-50 text-green-600 border-green-200",
      ignored: isDark
        ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
        : "bg-gray-100 text-gray-600 border-gray-200",
    };

    const labels = {
      new: "Nuevo",
      reviewing: "En Revisión",
      resolved: "Resuelto",
      ignored: "Ignorado",
    };

    return (
      <span
        className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[status]}`}
      >
        {labels[status]}
      </span>
    );
  },
);

ErrorBadge.displayName = "ErrorBadge";
