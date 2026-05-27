"use client";

import { createPortal } from "react-dom";
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
import { useTranslations } from "next-intl";
import { usersApi } from "@/features/users/api/users.api";

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
  dedupKey?: string;
  actions?: Array<{
    label: string;
    variant?: "primary" | "danger" | "secondary";
    onClick: () => void | Promise<void>;
  }>;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "read">,
    options?: { silent?: boolean },
  ) => void;
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
  const t = useTranslations("notifications");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);
  const [portalReady, setPortalReady] = useState(false);

  // Portal mount guard: document.body only exists on the client. Without it
  // SSR renders an empty <body> child which mismatches the hydrated tree.
  // The setState-in-effect pattern is the canonical SSR portal idiom, so we
  // silence the rule for this single line.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPortalReady(true);
  }, []);

  // Deduplication guard: prevents duplicate toasts when the backend emits
  // multiple related events for the same action (e.g. order.paid + license.created +
  // license.activated all fire within milliseconds of a single purchase).
  const recentEvents = useRef<Map<string, number>>(new Map());
  const DEDUP_WINDOW_MS = 3000;

  // Stable callback — empty deps because setters from useState are always stable.
  // `silent` (default false) only adds to the bell panel without popping a toast.
  // Used for invitations that were already toasted in a previous session/refresh,
  // so they stay visible in the bell but do not interrupt the user again.
  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "read">, options?: { silent?: boolean }) => {
      // Skip if the exact same type+title was already shown within the dedup window
      const dedupKey = notification.dedupKey ?? `${notification.type}:${notification.title}`;
      const lastFired = recentEvents.current.get(dedupKey) ?? 0;
      const now = Date.now();
      if (now - lastFired < DEDUP_WINDOW_MS) return;
      recentEvents.current.set(dedupKey, now);

      const id = generateId();
      const newNotification: Notification = { ...notification, id, read: false };

      setNotifications((prev) => [newNotification, ...prev]);
      if (!options?.silent) {
        setToasts((prev) => [...prev, newNotification]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
      }
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

  const loadWorkspaceInvitations = useCallback(async () => {
    if (!token) return;

    // Persistent "seen" set of invitation IDs so the toast pops only the first
    // time we ever see an invitation, not on every page refresh. The bell
    // panel still lists the invitation; only the auto-popup is suppressed
    // once it has already been shown.
    const STORAGE_KEY = "celaest:toasted_invitations";
    let seenIds = new Set<string>();
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) seenIds = new Set(JSON.parse(raw) as string[]);
      } catch {
        seenIds = new Set();
      }
    }
    const persistSeen = () => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(Array.from(seenIds)),
        );
      } catch {
        /* ignore quota errors */
      }
    };

    try {
      const response = await usersApi.listWorkspaceInvitations(token);

      // Prune storage entries that are no longer pending so accept/reject and
      // re-invite (after the previous one is cleared) trigger a fresh toast.
      const stillPending = new Set(response.invitations.map((i) => i.id));
      let pruned = false;
      seenIds.forEach((id) => {
        if (!stillPending.has(id)) {
          seenIds.delete(id);
          pruned = true;
        }
      });
      if (pruned) persistSeen();

      response.invitations.forEach((invitation) => {
        const acceptInvitation = async () => {
          await usersApi.acceptWorkspaceInvitation(invitation.id, token);
          toast.success("Invitación aceptada", {
            description: `Ya tienes acceso a ${invitation.organization_name}.`,
          });
          useOrgStore.getState().fetchOrgs(token, true);
        };

        const rejectInvitation = async () => {
          await usersApi.rejectWorkspaceInvitation(invitation.id, token);
          toast.info("Invitación rechazada", {
            description: `No se agregó el workspace ${invitation.organization_name}.`,
          });
        };

        const alreadyToasted = seenIds.has(invitation.id);
        addNotification(
          {
            type: "info",
            title: "Invitación a workspace",
            message: `${invitation.organization_name} te invitó como ${invitation.role}.`,
            timestamp: new Date(invitation.created_at),
            dedupKey: `workspace-invitation:${invitation.id}`,
            actions: [
              { label: "Aceptar", variant: "primary", onClick: acceptInvitation },
              { label: "Rechazar", variant: "danger", onClick: rejectInvitation },
            ],
          },
          { silent: alreadyToasted },
        );

        if (!alreadyToasted) {
          seenIds.add(invitation.id);
          persistSeen();
        }
      });
    } catch (err) {
      console.warn("[notifications] Failed to load workspace invitations", err);
    }
  }, [token, addNotification]);

  useEffect(() => {
    loadWorkspaceInvitations();
  }, [loadWorkspaceInvitations]);

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
        const ref = payload.order_id?.slice(0, 8) ?? "—";
        handleEvent("info", t("new_order"), t("order_created", { ref }));
      }),
      socket.on("order.updated", (raw: unknown) => {
        const payload = raw as { order_id: string; status: string };
        const ref = payload.order_id?.slice(0, 8) ?? "—";
        handleEvent("info", t("order_updated"), t("order_status_changed", { ref, status: payload.status ?? "—" }));
      }),
      socket.on("order.paid", (raw: unknown) => {
        const payload = raw as { order_id: string; order_number?: string };
        const ref = payload.order_number ?? `#${payload.order_id?.slice(0, 8) ?? "—"}`;
        handleEvent("success", t("payment_received"), t("order_paid", { ref }));
      }),
      socket.on("payment.failed", (raw: unknown) => {
        const payload = raw as { order_id: string; error?: string };
        const ref = payload.order_id?.slice(0, 8) ?? "—";
        handleEvent(
          "error",
          t("payment_failed"),
          t("order_payment_error", { ref, error: payload.error || "" })
        );
      }),
      socket.on("organization.workspace_invitation_created", () => {
        // Refetch the pending invitations list so the new entry shows up
        // instantly in the header bell with Accept / Reject actions.
        loadWorkspaceInvitations();
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
          toast.success(t("new_workspace"), {
            description: t("workspace_invited", { role: role || "member" }),
            duration: 8000,
          });

          handleEvent(
            "success",
            t("new_workspace_title"),
            t("workspace_invited_title", { role: role || "member" }),
          );

          // Fetch silencioso desde getState() — sin suscripción reactiva al store
          if (token) useOrgStore.getState().fetchOrgs(token, true);
        } else {
          // Si es el evento general de la org de que entró ALGUIEN más (y no somos nosotros)
          handleEvent(
            "info",
            t("new_member"),
            t("member_joined"),
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

            toast.error(t("removed_from_workspace"), {
              description: t("redirecting_default"),
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
            toast.warning(t("privileges_revoked"), {
              description: t("removed_inactive_workspace"),
            });
            if (token) useOrgStore.getState().fetchOrgs(token, true); // update sidebars without interrupting
          }
          return;
        }

        // Si no es nuestra propia revocación, sino de un compañero:
        if (action !== "membership_revoked") {
          handleEvent(
            "warning",
            t("member_removed"),
            t("member_removed_desc"),
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
        handleEvent("info", t("invoice_generated"), t("invoice_created", { ref }));
      }),
    ];

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  // All mutable state accessed inside handlers is read via useOrgStore.getState()
  // so there is no stale-closure risk. fetchOrgs is never stored in component scope.
  // Do NOT add fetchOrgs, currentOrg, or currentOrgId here — that would tear down
  // and re-register all socket listeners on every org switch or store change.
  }, [token, addNotification, t, loadWorkspaceInvitations]);

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

      {/* Toast Container — rendered via portal to document.body so it cannot
          be clipped by parents with overflow:hidden or repositioned by
          ancestors with `transform` (which makes `position: fixed` behave
          like `absolute`). Width is clamped to viewport with explicit
          `min(420px, calc(100vw - 32px))`. */}
      {portalReady &&
        toasts.length > 0 &&
        createPortal(
          <div
            style={{
              position: "fixed",
              bottom: 24,
              right: 16,
              width: "min(420px, calc(100vw - 32px))",
              maxHeight: "calc(100vh - 48px)",
              zIndex: 9999,
              pointerEvents: "none",
            }}
            className="flex flex-col-reverse gap-3 overflow-hidden"
          >
            {toasts.map((toastItem) => (
              <NotificationToast
                key={toastItem.id}
                notification={toastItem}
                onClose={() => removeToast(toastItem.id)}
              />
            ))}
          </div>,
          document.body,
        )}
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
