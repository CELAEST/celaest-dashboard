"use client";

import { useQuery } from "@tanstack/react-query";
import { BillingModal } from "./shared/BillingModal";
import { useOrderDetails } from "../../hooks/useOrderDetails";
import { Order, OrderActivityEvent } from "../../types";
import { OrderDetailsHeader } from "./OrderDetails/OrderDetailsHeader";
import { OrderDetailsContent } from "./OrderDetails/OrderDetailsContent";
import { OrderDetailsSidebar } from "./OrderDetails/OrderDetailsSidebar";
import { OrderDetailsFooter } from "./OrderDetails/OrderDetailsFooter";
import { ordersApi } from "../../api/orders.api";
import { useApiAuth } from "@/lib/use-api-auth";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  initialMode?: "view" | "edit";
  onSave?: (updatedOrder: Order) => void;
  onRefund?: () => void;
  canRefund?: boolean;
  isSuperAdmin?: boolean;
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  initialMode = "view",
  onSave,
  onRefund,
  canRefund = false,
  isSuperAdmin = false,
}: OrderDetailsModalProps) {
  const { token, orgId } = useApiAuth();
  const { mode, setMode, formData, updateField, handleSave } = useOrderDetails(
    order,
    initialMode,
    isOpen,
    onSave,
    onClose,
  );

  const { data: events = [] } = useQuery<OrderActivityEvent[]>({
    queryKey: ["orders", "events", order?.id],
    queryFn: async () => {
      if (!orgId || !token || !order?.id) return [];
      const raw = await ordersApi.getOrderEvents(orgId, token, order.id);
      return (raw as unknown as Array<{ id: string; type: string; data?: Record<string, unknown>; created_at: string }>).map(e => ({
        id: e.id,
        type: e.type,
        data: e.data,
        createdAt: e.created_at,
      }));
    },
    enabled: isOpen && !!order?.id && !!token && !!orgId,
  });

  if (!formData) return null;

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-3xl max-h-[90vh]"
      showCloseButton={false}
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px z-20 bg-linear-to-r from-transparent via-teal-500/70 to-transparent" />
      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "22rem",
          height: "22rem",
          background: "radial-gradient(circle at top right, rgba(20,184,166,0.06), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <OrderDetailsHeader
        orderId={formData.displayId}
        orderDate={formData.date}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          <OrderDetailsContent
            formData={formData}
            mode={mode}
            updateField={updateField}
            events={events}
          />
          <OrderDetailsSidebar
            formData={formData}
            mode={mode}
            updateField={updateField}
          />
        </div>
      </div>

      <OrderDetailsFooter
        mode={mode}
        setMode={setMode}
        onClose={onClose}
        onSave={handleSave}
        onRefund={onRefund}
        canRefund={canRefund}
        lastEditDate={formData.date}
        isSuperAdmin={isSuperAdmin}
      />
    </BillingModal>
  );
}
