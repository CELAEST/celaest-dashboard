import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/features/shared/hooks/useSocket";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

/**
 * useRealtimeDashboard
 * 
 * Orquestra la invalidación de caché de TanStack Query basada en eventos de WebSocket.
 * Asegura que la UI esté siempre sincronizada con el estado real del backend sin polling.
 */
export function useRealtimeDashboard() {
  const queryClient = useQueryClient();

  // 1. Eventos de Pedidos/Ventas -> Invalidar métricas financieras y ventas
  useSocket("order.created", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.adminStats });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
    toast.success("New order received (Real-time)");
  });

  useSocket("order.paid", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.adminStats });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
    toast.success("Order paid (Real-time)");
  });

  useSocket("order.updated", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
  });

  useSocket("order.deleted", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
  });

  useSocket("order.completed", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
  });

  useSocket("order.cancelled", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
  });

  useSocket("order.refunded", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
  });

  // 2. Eventos de Analíticas -> Invalidar todo el dominio de analíticas
  useSocket("analytics.updated", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.adminStats });
  });

  // 3. Eventos de Pagos -> Invalidar alertas y logs
  useSocket("payment.failed", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.adminStats });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.alerts("failed") });
    toast.error("Payment failed detected (Real-time)");
  });

  // 3.5. Eventos de Facturación Expandida (Invoices, Subs, Cupones)
  useSocket("payment.received", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
  });
  useSocket("payment.refunded", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
  });
  useSocket("invoice.generated", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
  });
  useSocket("invoice.paid", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
  });
  useSocket("invoice.overdue", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
    toast.warning("An invoice is overdue");
  });
  useSocket("subscription.created", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
  });
  useSocket("subscription.updated", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
  });
  useSocket("subscription.cancelled", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
    toast.warning("A subscription was cancelled");
  });
  useSocket("subscription.reactivated", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
  });
  useSocket("coupon.created", () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all }));
  useSocket("coupon.redeemed", () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all }));
  useSocket("coupon.deleted", () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all }));

  // 4. Mercado / Marketplace & Inventory
  useSocket("product.created", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets.all });
    toast.info("Nuevo producto disponible");
  });

  useSocket("product.updated", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets.all });
  });

  useSocket("product.deleted", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets.all });
  });

  useSocket("product.published", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
  });

  useSocket("marketplace.review_created", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
  });

  useSocket("marketplace.seller_updated", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
  });

  useSocket("marketplace.product_featured", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.marketplace.all });
  });

  // 5. Licensing & Assets
  useSocket("license.activated", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
    toast.info("Licensing data updated (Real-time)");
  });

  useSocket("license.validated", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
  });

  useSocket("license.created", () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all }));
  useSocket("license.deactivated", () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all }));
  useSocket("license.expired", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
    toast.warning("A license has expired");
  });
  useSocket("license.revoked", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
    toast.error("A license has been revoked");
  });

  useSocket("product.asset_updated", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets.all });
  });

  useSocket("product.asset_created", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets.all });
  });

  // 6. Organizations & Users
  useSocket("organization.updated", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations.all });
    toast.success("Organization settings synced");
  });

  useSocket("organization.member_added", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations.all });
    toast.info("New team member joined");
  });

  useSocket("organization.created", () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations.all }));
  useSocket("organization.deleted", () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations.all }));
  useSocket("organization.member_removed", () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.organizations.all }));



  useSocket("user.logged_in", () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all }));

  useSocket("user.created", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
  });

  useSocket("user.updated", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
  });

  useSocket("user.deleted", () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
  });

  // 7. Conexión/Estado del sistema
  useSocket("system.heartbeat", () => {
    // Mantener la conexión viva
  });

  useSocket("system.connected", () => {
    // Optional: toast.success("Real-time connection restored")
  });

  useSocket("system.disconnected", () => {
    // Optional: toast.error("Real-time connection lost by server")
  });

  useSocket("system.error", () => {
    // Handle specific system errors
  });

  return null;
}
