"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { NotificationToast } from "@/features/shared/components/NotificationToast";

// ============================================================================
// Types - Interface Segregation Principle
// ============================================================================

export type NotificationType = "success" | "warning" | "error" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "read">) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

// ============================================================================
// Context - Single Responsibility: State Management Only
// ============================================================================

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

// ID Generator - Dependency Inversion
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// ============================================================================
// Provider Component
// ============================================================================

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);

  // Memoized callbacks for performance - Open/Closed Principle
  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "read">) => {
      const id = generateId();
      const newNotification: Notification = {
        ...notification,
        id,
        read: false,
      };

      // Add to persistent notifications list
      setNotifications((prev) => [newNotification, ...prev]);

      // Add to toast queue for temporary display
      setToasts((prev) => [...prev, newNotification]);

      // Auto-remove toast after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Derived state
  const unreadCount = notifications.filter((n) => !n.read).length;

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      {/* Toast Container - Fixed position top-right */}
      <div className="fixed top-24 right-4 z-100 flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <NotificationToast
            key={toast.id}
            notification={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// ============================================================================
// Custom Hook - Dependency Inversion Principle
// ============================================================================

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};
