"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Check,
  Trash2,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import {
  useNotifications,
  type Notification,
} from "../contexts/NotificationContext";

// ============================================================================
// Constants - Open/Closed Principle
// ============================================================================

const NOTIFICATION_ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
} as const;

const getColorScheme = (type: Notification["type"], isDark: boolean) => {
  const schemes = {
    success: {
      icon: "text-emerald-500",
      bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
    },
    warning: {
      icon: "text-orange-500",
      bg: isDark ? "bg-orange-500/10" : "bg-orange-50",
    },
    error: {
      icon: "text-red-500",
      bg: isDark ? "bg-red-500/10" : "bg-red-50",
    },
    info: {
      icon: isDark ? "text-cyan-400" : "text-blue-500",
      bg: isDark ? "bg-cyan-500/10" : "bg-blue-50",
    },
  };
  return schemes[type];
};

// ============================================================================
// Utility Functions
// ============================================================================

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${days}d`;
};

// ============================================================================
// Sub-components - Single Responsibility
// ============================================================================

interface NotificationItemProps {
  notification: Notification;
  isDark: boolean;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

const NotificationItem = React.memo(function NotificationItem({
  notification,
  isDark,
  onMarkAsRead,
  onRemove,
}: NotificationItemProps) {
  const Icon = NOTIFICATION_ICONS[notification.type];
  const colors = getColorScheme(notification.type, isDark);

  const handleClick = useCallback(() => {
    onMarkAsRead(notification.id);
  }, [notification.id, onMarkAsRead]);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove(notification.id);
    },
    [notification.id, onRemove],
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`
        relative p-4 transition-colors cursor-pointer
        ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}
        ${!notification.read ? (isDark ? "bg-white/5" : "bg-blue-50/50") : ""}
      `}
      onClick={handleClick}
    >
      {/* Unread Indicator */}
      {!notification.read && (
        <div
          className={`absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full 
          ${
            isDark
              ? "bg-linear-to-br from-cyan-400 to-blue-400"
              : "bg-linear-to-br from-blue-600 to-indigo-600"
          }`}
        />
      )}

      <div className="flex gap-3 pl-3">
        {/* Icon */}
        <div
          className={`shrink-0 w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4
              className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {notification.title}
            </h4>
            <button
              onClick={handleRemove}
              className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-colors
                ${
                  isDark
                    ? "bg-white/5 text-gray-500 hover:bg-white/10"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              aria-label="Eliminar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p
            className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {notification.message}
          </p>
          <span
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
          >
            {formatTimestamp(notification.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// Main Component
// ============================================================================

export const NotificationCenter = React.memo(function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const {
    notifications,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount,
  } = useNotifications();

  const isDark = theme === "dark";

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Memoized class names
  const bellButtonClassName = useMemo(
    () =>
      `relative p-2 rounded-full transition-all duration-300
      ${
        isDark
          ? "text-gray-400 hover:text-white hover:bg-white/5"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
      }`,
    [isDark],
  );

  const panelClassName = useMemo(
    () =>
      `absolute right-0 mt-2 w-[400px] max-h-[600px] rounded-2xl backdrop-blur-xl border shadow-2xl overflow-hidden z-50
      ${isDark ? "bg-black/90 border-white/10" : "bg-white border-gray-200"}`,
    [isDark],
  );

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className={bellButtonClassName}
        aria-label="Abrir notificaciones"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center
              ${
                isDark
                  ? "bg-linear-to-br from-cyan-400 to-blue-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  : "bg-linear-to-br from-blue-600 to-indigo-600"
              }`}
          >
            <span className="text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </motion.div>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={panelClassName}
          >
            {/* Header */}
            <div
              className={`p-5 border-b ${isDark ? "border-white/10" : "border-gray-200"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold
                    ${
                      isDark
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {unreadCount} nuevas
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              {notifications.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors
                      ${
                        isDark
                          ? "bg-white/5 text-gray-300 hover:bg-white/10"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <Check className="w-4 h-4" />
                    Marcar todas
                  </button>
                  <button
                    onClick={clearAll}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors
                      ${
                        isDark
                          ? "bg-white/5 text-gray-300 hover:bg-white/10"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpiar todas
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[480px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4
                    ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                  >
                    <Bell
                      className={`w-8 h-8 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                    />
                  </div>
                  <p
                    className={`font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    No hay notificaciones
                  </p>
                  <p
                    className={`text-sm mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Te avisaremos cuando haya novedades
                  </p>
                </div>
              ) : (
                <div
                  className={`divide-y ${isDark ? "divide-white/5" : "divide-gray-100"}`}
                >
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        isDark={isDark}
                        onMarkAsRead={markAsRead}
                        onRemove={removeNotification}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
