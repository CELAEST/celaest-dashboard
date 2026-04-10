import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/features/shared/hooks/useSocket";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import {
  createInvalidationBatcher,
  type InvalidationBatcher,
} from "@/lib/query-invalidation-batcher";

/**
 * useRealtimeDashboard
 *
 * Orquestra la invalidación de caché de TanStack Query basada en eventos de WebSocket.
 * Monta UN listener por evento (singleton vía RealtimeDashboardSync en el layout).
 *
 * ── Robustez ──────────────────────────────────────────────────────────────────
 * Usa un InvalidationBatcher (debounce 350ms) para colapsar ráfagas de eventos
 * consecutivos. Si el backend emite order.deleted + analytics.updated dentro de
 * 350ms, la invalidación de ["analytics","dashboard"] se ejecuta UNA SOLA VEZ
 * en lugar de dos, eliminando las request-storm pairs visibles en DevTools.
 *
 * ── Reglas de invalidación ──────────────────────────────────────────────────
 * • NUNCA usar analytics.all (prefijo ["analytics"]) en eventos de orden —
 *   invalidaría dashboard, sales, roi, usage, distribution, live-feed a la vez
 *   disparando 6+ requests simultáneos.
 * • analytics.updated → solo ["analytics","dashboard"]: la gráfica de ventas
 *   (by-period) tiene staleTime 5min y no necesita refresh en tiempo real.
 * • Eventos de licencia/org/user aislados de analytics.
 */
export function useRealtimeDashboard() {
  const queryClient = useQueryClient();

  // ── Batcher: deduplica invalidaciones dentro de un window de 350ms ──────────
  const batcherRef = useRef<InvalidationBatcher | null>(null);
  if (batcherRef.current === null) {
    batcherRef.current = createInvalidationBatcher(queryClient, 350);
  }
  useEffect(() => {
    return () => {
      batcherRef.current?.destroy();
      batcherRef.current = null;
    };
  }, []);

  // Alias para legibilidad — batcherRef.current solo puede ser null tras destroy() en cleanup
  const inv = (key: readonly unknown[]) => batcherRef.current?.invalidate(key);

  // ── 1. Órdenes ──────────────────────────────────────────────────────────────
  // order.created / order.paid → cambian ingresos y conteos del dashboard
  useSocket("order.created", () => {
    inv(["analytics", "dashboard"]);
    inv(QUERY_KEYS.billing.adminStats);
    inv(QUERY_KEYS.billing.all);
  });

  useSocket("order.paid", () => {
    inv(["analytics", "dashboard"]);
    inv(QUERY_KEYS.billing.adminStats);
    inv(QUERY_KEYS.billing.all);
  });

  // order.updated → solo lista, no afecta KPIs
  useSocket("order.updated", () => {
    inv(QUERY_KEYS.billing.all);
  });

  // order.deleted / order.completed → afectan conteos del dashboard
  useSocket("order.deleted", () => {
    inv(["analytics", "dashboard"]);
    inv(QUERY_KEYS.billing.all);
  });

  useSocket("order.completed", () => {
    inv(["analytics", "dashboard"]);
    inv(QUERY_KEYS.billing.all);
  });

  useSocket("order.cancelled", () => {
    inv(QUERY_KEYS.billing.all);
    inv(QUERY_KEYS.assets.all);
    inv(QUERY_KEYS.licensing.all);
  });

  useSocket("order.refunded", () => {
    inv(QUERY_KEYS.billing.adminStats);
    inv(QUERY_KEYS.billing.all);
    inv(QUERY_KEYS.assets.all);
    inv(QUERY_KEYS.licensing.all);
  });

  // ── 2. Analytics ────────────────────────────────────────────────────────────
  // analytics.updated: señal genérica de recálculo en el backend.
  // Solo refreshea KPIs del dashboard — NO la gráfica de ventas (by-period),
  // que tiene staleTime 5min y su propio ciclo de actualización.
  // Usar analytics.all aquí dispararía 6+ requests simultáneos.
  useSocket("analytics.updated", () => {
    // Do NOT invalidate ["analytics","dashboard"] here — this event fires every ~1s
    // (backend live-metrics push) and causes continuous dashboard refetches in ALL tabs
    // (prefix match hits ["analytics","dashboard",orgId,"day"] used by Orders, etc.).
    // Order mutations (order.created/updated/deleted) handle dashboard invalidation correctly.
    inv(QUERY_KEYS.billing.adminStats);
  });

  // ── 3. Pagos ────────────────────────────────────────────────────────────────
  useSocket("payment.failed", () => {
    inv(QUERY_KEYS.billing.adminStats);
    inv(QUERY_KEYS.billing.alerts("failed"));
    toast.error("Payment failed detected (Real-time)");
  });

  useSocket("payment.received", () => inv(QUERY_KEYS.billing.all));
  useSocket("payment.refunded", () => inv(QUERY_KEYS.billing.all));

  // ── 4. Facturación (Invoices / Subs / Cupones) ──────────────────────────────
  useSocket("invoice.generated", () => inv(QUERY_KEYS.billing.all));
  useSocket("invoice.paid", () => inv(QUERY_KEYS.billing.all));
  useSocket("invoice.voided", () => inv(QUERY_KEYS.billing.all));
  useSocket("invoice.overdue", () => {
    inv(QUERY_KEYS.billing.all);
    toast.warning("An invoice is overdue");
  });

  useSocket("subscription.created", () => inv(QUERY_KEYS.billing.all));
  useSocket("subscription.updated", () => inv(QUERY_KEYS.billing.all));
  useSocket("subscription.cancelled", () => {
    inv(QUERY_KEYS.billing.all);
    inv(QUERY_KEYS.assets.all);
    inv(QUERY_KEYS.licensing.all);
    toast.warning("A subscription was cancelled");
  });
  useSocket("subscription.reactivated", () => inv(QUERY_KEYS.billing.all));

  useSocket("coupon.created", () => inv(QUERY_KEYS.billing.all));
  useSocket("coupon.redeemed", () => inv(QUERY_KEYS.billing.all));
  useSocket("coupon.deleted", () => inv(QUERY_KEYS.billing.all));

  // ── 5. Marketplace & Assets ─────────────────────────────────────────────────
  useSocket("product.created", () => {
    inv(QUERY_KEYS.marketplace.all);
    inv(QUERY_KEYS.assets.all);
  });
  useSocket("product.updated", () => {
    inv(QUERY_KEYS.marketplace.all);
    inv(QUERY_KEYS.assets.all);
  });
  useSocket("product.deleted", () => {
    inv(QUERY_KEYS.marketplace.all);
    inv(QUERY_KEYS.assets.all);
  });
  useSocket("product.published", () => inv(QUERY_KEYS.marketplace.all));
  useSocket("product.asset_updated", () => inv(QUERY_KEYS.assets.all));
  useSocket("product.asset_created", () => inv(QUERY_KEYS.assets.all));

  useSocket("marketplace.review_created", () => inv(QUERY_KEYS.marketplace.all));
  useSocket("marketplace.seller_updated", () => inv(QUERY_KEYS.marketplace.all));
  useSocket("marketplace.product_featured", () => inv(QUERY_KEYS.marketplace.all));

  // ── 6. Licencias ────────────────────────────────────────────────────────────
  useSocket("license.activated", () => inv(QUERY_KEYS.licensing.all));
  useSocket("license.validated", () => inv(QUERY_KEYS.licensing.all));
  useSocket("license.created", () => inv(QUERY_KEYS.licensing.all));
  useSocket("license.deactivated", () => inv(QUERY_KEYS.licensing.all));
  useSocket("license.expired", () => {
    inv(QUERY_KEYS.licensing.all);
    toast.warning("A license has expired");
  });
  useSocket("license.revoked", () => {
    inv(QUERY_KEYS.licensing.all);
    inv(QUERY_KEYS.assets.all);
    toast.error("A license has been revoked");
  });

  // ── 7. Organizaciones & Usuarios ────────────────────────────────────────────
  useSocket("organization.updated", () => inv(QUERY_KEYS.organizations.all));
  useSocket("organization.created", () => inv(QUERY_KEYS.organizations.all));
  useSocket("organization.deleted", () => inv(QUERY_KEYS.organizations.all));
  useSocket("organization.member_added", () => inv(QUERY_KEYS.organizations.all));
  useSocket("organization.member_removed", () => {
    inv(QUERY_KEYS.organizations.all);
    inv(QUERY_KEYS.assets.all);
  });

  // user.logged_in: a user connected their WebSocket — does NOT change the user list.
  // Invalidating on login would trigger users+audit-logs refetch on every page load
  // (backend emits this on WS connection). Skip it.
  // useSocket("user.logged_in", ...) — intentionally omitted
  useSocket("user.created", () => inv(QUERY_KEYS.users.all));
  useSocket("user.updated", () => inv(QUERY_KEYS.users.all));
  useSocket("user.deleted", () => inv(QUERY_KEYS.users.all));

  // ── 8. Sistema ──────────────────────────────────────────────────────────────
  useSocket("system.heartbeat", () => { /* keepalive — no invalidation needed */ });
  useSocket("system.connected", () => { /* reconnect handled by socket-client */ });
  useSocket("system.disconnected", () => { /* reconnect handled by socket-client */ });
  useSocket("system.error", () => { /* specific errors handled upstream */ });

  return null;
}
