"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { NotificationToast } from "@/features/shared/components/NotificationToast";
import { socket } from "@/lib/socket-client";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/features/settings/api/settings.api";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { toast } from "sonner";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";

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
  const { session } = useAuthStore();
  const token = session?.accessToken;
  const _currentUserId = session?.user?.id;

  // We need to access useOrgStore for currentOrg and forcing fetch
  const { currentOrg, fetchOrgs } = useOrgStore();
  const _currentOrgId = currentOrg?.id;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);

  // Fetch preferences for filtering
  // staleTime 5m: notification preferences rarely change mid-session
  const { data: prefs } = useQuery({
    queryKey: [...QUERY_KEYS.users.all, "notifications"],
    queryFn: async () => {
      if (!token) return null;
      const response = await settingsApi.getNotificationPreferences(token);
      if (response.notifications) {
        return typeof response.notifications === "string"
          ? JSON.parse(response.notifications)
          : response.notifications;
      }
      return null;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes — preferences rarely change mid-session
    gcTime: 10 * 60 * 1000,
  });

  const prefsRef = useRef(prefs);
  useEffect(() => {
    prefsRef.current = prefs;
  }, [prefs]);

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

  // derived state
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Global Socket Listeners for Real-time Notifications
  useEffect(() => {
    if (!token) return;

    const handleEvent = (
      type: NotificationType,
      title: string,
      message: string,
      prefId?: string,
    ) => {
      // Check filtering
      if (prefId && prefsRef.current && prefsRef.current[prefId] === false) {
        return;
      }

      addNotification({
        type,
        title,
        message,
        timestamp: new Date(),
      });
    };

    const unsubscribers = [
      socket.on("order.created", (raw: unknown) => {
        const payload = raw as { id: string };
        handleEvent(
          "info",
          "Nueva Orden",
          `Se ha creado la orden #${payload.id?.slice(0, 8)}`,
          "email_activity",
        );
      }),
      socket.on("order.updated", (raw: unknown) => {
        const payload = raw as { id: string; status: string };
        handleEvent(
          "info",
          "Orden Actualizada",
          `La orden #${payload.id?.slice(0, 8)} ahora está en estado ${payload.status}`,
          "email_activity",
        );
      }),
      socket.on("order.paid", (raw: unknown) => {
        const payload = raw as { id: string };
        handleEvent(
          "success",
          "Pago Recibido",
          `La orden #${payload.id?.slice(0, 8)} ha sido pagada.`,
          "email_activity",
        );
      }),
      socket.on("payment.failed", (raw: unknown) => {
        const payload = raw as { order_id: string; error?: string };
        handleEvent(
          "error",
          "Pago Fallido",
          `Error en el pago de la orden #${payload.order_id?.slice(0, 8)}. ${payload.error || ""}`,
          "push_security",
        );
      }),
      socket.on("organization.member_added", (raw: unknown) => {
        const payload = raw as {
          action?: string;
          role?: string;
          data?: { action?: string; role?: string };
        };
        const action = payload?.action || payload?.data?.action;
        const role = payload?.role || payload?.data?.role;

        // Si el evento viene dirigido hacia el usuario indicando que lo agregaron:
        if (action === "added_to_workspace") {
          toast.success("¡Nuevo Workspace!", {
            description: `Te han invitado y otorgado el rol de ${role}. Revísalo en tu lista de organizaciones.`,
            duration: 8000,
          });

          handleEvent(
            "success",
            "Nuevo Workspace",
            `Te han invitado a una nueva organización con el rol de ${role}`,
            "push_mentions",
          );

          // Hacer fetch automático silencioso para que la UI se actualice
          if (token) fetchOrgs(token, true);
        } else {
          // Si es el evento general de la org de que entró ALGUIEN más (y no somos nosotros)
          handleEvent(
            "info",
            "Nuevo Miembro",
            `Un nuevo miembro se ha unido a la organización.`,
            "push_mentions",
          );
        }
      }),
      socket.on("organization.member_removed", (raw: unknown) => {
        const payload = raw as {
          action?: string;
          user_id?: string;
          organization_id?: string;
          data?: {
            action?: string;
            user_id?: string;
            organization_id?: string;
          };
        };

        const action = payload?.action || payload?.data?.action;
        const eventOrgId =
          payload?.organization_id || payload?.data?.organization_id;

        // Si el evento nos dice directamente a nosotros que fuimos revocados
        if (action === "membership_revoked") {
          // Leer el org actual DIRECTAMENTE del store (no del cierre del efecto).
          // Si el org-broadcast llega primero y fetchOrgs cambia currentOrg de
          // Juli → Celaest antes que este handler procese membership_revoked,
          // la variable `currentOrgId` del cierre ya no coincidie con eventOrgId
          // y el redirect nunca ocurría. getState() siempre lee el valor fresco.
          const freshCurrentOrgId = useOrgStore.getState().currentOrg?.id;
          if (eventOrgId === freshCurrentOrgId || !freshCurrentOrgId) {
            toast.error("Fuiste removido de este Workspace.", {
              description: "Redirigiendo a tu espacio por defecto...",
            });

            // IMPORTANT: Do NOT rely on fetchOrgs().then(redirect) here.
            // The viewer receives two socket events for the same action:
            //   1. org-broadcast "member_removed" → OrgSync calls fetchOrgs → isLoading = true
            //   2. user-targeted "membership_revoked" → this branch
            // If (1) fires first, (2)'s fetchOrgs hits the `isLoading` guard and
            // returns immediately → redirect fires with currentOrg = Juli still in
            // localStorage → post-reload API calls use Juli's orgId → 403 "not a
            // member" → nuclear recovery → currentOrg wiped → can't buy in Celaest.
            //
            // Fix: synchronously wipe org localStorage BEFORE redirecting.
            // Use /?revoked=true so DashboardShell activates its circuit-breaker
            // (shows spinner + calls clearSync again) which BLOCKS rendering until
            // fetchOrgs completes and currentOrg is set. Without ?revoked=true the
            // shell mounts immediately with currentOrg=null → "Preparando sesión"
            // while the async fetch is still in-flight.
            useOrgStore.getState().clearSync();
            window.location.href = "/?revoked=true";
          } else {
            // Fuimos removidos de un workspace diferente al que estamos viendo
            toast.warning("Privilegios Revocados", {
              description:
                "Fuiste removido de uno de tus Workspaces inactivos.",
            });
            if (token) fetchOrgs(token, true); // update sidebars without interrupting
          }
          return;
        }

        // Si no es nuestra propia revocación, sino de un compañero:
        if (action !== "membership_revoked") {
          handleEvent(
            "warning",
            "Miembro Eliminado",
            `Un miembro ha sido eliminado de la organización.`,
            "push_mentions",
          );
        }
      }),
      socket.on("product.asset_created", () => {
        handleEvent(
          "success",
          "Compra Exitosa",
          `Tu nuevo activo ha sido añadido correctamente.`,
          "email_activity",
        );
      }),
      socket.on("license.created", () => {
        handleEvent(
          "success",
          "Licencia Generada",
          `Se ha emitido una nueva licencia para tu cuenta.`,
          "push_security",
        );
      }),
      socket.on("license.activated", () => {
        handleEvent(
          "success",
          "Licencia Activada",
          `Tu licencia ha sido activada correctamente.`,
          "push_security",
        );
      }),
      socket.on("invoice.generated", (raw: unknown) => {
        const payload = raw as { id: string };
        handleEvent(
          "info",
          "Factura Generada",
          `Se ha generado una nueva factura #${payload.id?.slice(0, 8)}`,
          "email_activity",
        );
      }),
    ];

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  // currentOrgId and currentUserId are intentionally EXCLUDED from deps.
  // Both values are read via useOrgStore.getState() inside the handlers so
  // there is no stale-closure risk. Including them would tear down and
  // re-register all 11 socket listeners on every org switch, creating a
  // brief window where real-time events could be silently dropped.
  }, [token, addNotification, fetchOrgs]);

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
