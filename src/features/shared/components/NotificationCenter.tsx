"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Check, Trash2 } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useNotifications } from "../contexts/NotificationContext";
import { NotificationItem } from "./NotificationCenter/NotificationItem";

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
