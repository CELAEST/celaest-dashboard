"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import type { Notification } from "../contexts/NotificationContext";

// ============================================================================
// Types - Open/Closed Principle: Easy to extend with new notification types
// ============================================================================

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

// Icon mapping - extensible without modifying component
const NOTIFICATION_ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
} as const;

// Color schemes - Single source of truth for theming
const getColorScheme = (type: Notification["type"], isDark: boolean) => {
  const schemes = {
    success: {
      icon: "text-emerald-500",
      bgIcon: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
      glow: isDark ? "shadow-emerald-500/20" : "",
      progress: "bg-emerald-500",
    },
    warning: {
      icon: "text-orange-500",
      bgIcon: isDark ? "bg-orange-500/10" : "bg-orange-50",
      glow: isDark ? "shadow-orange-500/20" : "",
      progress: "bg-orange-500",
    },
    error: {
      icon: isDark ? "text-blue-400" : "text-blue-600",
      bgIcon: isDark ? "bg-blue-500/10" : "bg-blue-50",
      glow: isDark ? "shadow-blue-500/20" : "",
      progress: isDark ? "bg-blue-400" : "bg-blue-600",
    },
    info: {
      icon: isDark ? "text-cyan-400" : "text-blue-500",
      bgIcon: isDark ? "bg-cyan-500/10" : "bg-blue-50",
      glow: isDark ? "shadow-cyan-500/20" : "",
      progress: isDark ? "bg-cyan-400" : "bg-blue-500",
    },
  };
  return schemes[type];
};

// ============================================================================
// Component - Single Responsibility: Render toast notification only
// ============================================================================

export const NotificationToast = React.memo(function NotificationToast({
  notification,
  onClose,
}: NotificationToastProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const Icon = NOTIFICATION_ICONS[notification.type];
  const colors = useMemo(
    () => getColorScheme(notification.type, isDark),
    [notification.type, isDark],
  );

  // Memoized class names
  const containerClassName = useMemo(
    () =>
      `relative overflow-hidden rounded-2xl backdrop-blur-xl pointer-events-auto
      ${isDark ? "bg-black/80 border-white/10" : "bg-white border-gray-200"} 
      border shadow-lg ${colors.glow} p-4`,
    [isDark, colors.glow],
  );

  const closeButtonClassName = useMemo(
    () =>
      `shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors
      ${
        isDark
          ? "bg-white/5 text-gray-400 hover:bg-white/10"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`,
    [isDark],
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={containerClassName}
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 ${colors.bgIcon} opacity-30`} />

      {/* Content */}
      <div className="relative flex gap-3">
        {/* Icon Container */}
        <div
          className={`shrink-0 w-10 h-10 rounded-xl ${colors.bgIcon} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h4
            className={`font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {notification.title}
          </h4>
          <p
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {notification.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={closeButtonClassName}
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-1 ${colors.progress}`}
      />
    </motion.div>
  );
});
