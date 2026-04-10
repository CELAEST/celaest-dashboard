"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { NotificationToast } from "@/features/shared/components/NotificationToast";
import { socket } from "@/lib/socket-client";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
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
  // Read token via selector — only re-renders when accessToken changes, not the whole session object
  const token = useAuthStore((s) => s.session?.accessToken);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);

  // Deduplication guard: prevents duplicate toasts when the backend emits
  // multiple related events for the same action (e.g. order.paid + license.created +
  // license.activated all fire within milliseconds of a single purchase).
  const recentEvents = useRef<Map<string, number>>(new Map());
  const DEDUP_WINDOW_MS = 3000;

  // Stable callback — empty deps because setters from useState are always stable.
  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "read">) => {
      // Skip if the exact same type+title was already shown within the dedup window
      const dedupKey = `${notification.type}:${notification.title}`;
      const lastFired = recentEvents.current.get(dedupKey) ?? 0;
      const now = Date.now();
      if (now - lastFired < DEDUP_WINDOW_MS) return;
      recentEvents.current.set(dedupKey, now);

      const id = generateId();
      const newNotification: Notification = { ...notification, id, read: false };

      setNotifications((prev) => [newNotification, ...prev]);
      setToasts((prev) => [...prev, newNotification]);

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

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  // Global Socket Listeners for Real-time Notifications
  useEffect(() => {
    if (!token) return;

    const handleEvent = (
      type: NotificationType,
      title: string,
      message: string,
    ) => {
      addNotification({
        type,
        title,
        message,
        timestamp: new Date(),
      });
    };

    const unsubscribers = [
      socket.on("order.created", (raw: unknown) => {
        const payload = raw as { order_id: string };
        const ref = payload.order_id?.slice(0, 8) ?? "nueva";
        handleEvent("info", "Nueva Orden", `Se ha creado la orden #${ref}`);
      }),
      socket.on("order.updated", (raw: unknown) => {
        const payload = raw as { order_id: string; status: string };
        const ref = payload.order_id?.slice(0, 8) ?? "—";
        handleEvent("info", "Orden Actualizada", `La orden #${ref} ahora está en estado ${payload.status ?? "—"}`);
      }),
      socket.on("order.paid", (raw: unknown) => {
        const payload = raw as { order_id: string; order_number?: string };
        const ref = payload.order_number ?? `#${payload.order_id?.slice(0, 8) ?? "—"}`;
        handleEvent("success", "Pago Recibido", `La orden ${ref} ha sido pagada.`);
      }),
      socket.on("payment.failed", (raw: unknown) => {
        const payload = raw as { order_id: string; error?: string };
        handleEvent(
          "error",
          "Pago Fallido",
          `Error en el pago de la orden #${payload.order_id?.slice(0, 8)}. ${payload.error || ""}`,
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
          );

          // Fetch silencioso desde getState() — sin suscripción reactiva al store
          if (token) useOrgStore.getState().fetchOrgs(token, true);
        } else {
          // Si es el evento general de la org de que entró ALGUIEN más (y no somos nosotros)
          handleEvent(
            "info",
            "Nuevo Miembro",
            `Un nuevo miembro se ha unido a la organización.`,
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
            if (token) useOrgStore.getState().fetchOrgs(token, true); // update sidebars without interrupting
          }
          return;
        }

        // Si no es nuestra propia revocación, sino de un compañero:
        if (action !== "membership_revoked") {
          handleEvent(
            "warning",
            "Miembro Eliminado",
            `Un miembro ha sido eliminado de la organización.`,
          );
        }
      }),
      // NOTE: product.asset_created, license.created and license.activated are
      // intentionally NOT listed here. A single purchase emits all three of those
      // events plus order.paid within milliseconds — showing a toast for each would
      // flood the user with 4 notifications for one action. order.paid is the
      // correct user-facing event. invoice.generated is kept as a separate,
      // distinct action the user cares about.
      socket.on("invoice.generated", (raw: unknown) => {
        const payload = raw as { invoice_id: string; invoice_number?: string };
        const ref = payload.invoice_number ?? `#${payload.invoice_id?.slice(0, 8) ?? "—"}`;
        handleEvent("info", "Factura Generada", `Se ha generado una nueva factura ${ref}`);
      }),
    ];

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  // All mutable state accessed inside handlers is read via useOrgStore.getState()
  // so there is no stale-closure risk. fetchOrgs is never stored in component scope.
  // Do NOT add fetchOrgs, currentOrg, or currentOrgId here — that would tear down
  // and re-register all socket listeners on every org switch or store change.
  }, [token, addNotification]);

  // Memoize context value to prevent all consumers from re-rendering on every
  // unrelated state change inside NotificationProvider.
  const contextValue = useMemo<NotificationContextType>(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      unreadCount,
    }),
    [notifications, unreadCount, addNotification, removeNotification, markAsRead, markAllAsRead, clearAll],
  );

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
