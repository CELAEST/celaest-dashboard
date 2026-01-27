import React, { useCallback, memo } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { type Notification } from "@/features/shared/contexts/NotificationContext";
import { NOTIFICATION_ICONS, getColorScheme } from "./constants";
import { formatTimestamp } from "./utils";

interface NotificationItemProps {
  notification: Notification;
  isDark: boolean;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export const NotificationItem = memo(function NotificationItem({
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

NotificationItem.displayName = "NotificationItem";
