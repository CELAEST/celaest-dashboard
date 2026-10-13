"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BillingModal, useBillingModalSwipe } from "./shared/BillingModal";
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
  onDownload?: () => void;
  canRefund?: boolean;
  isSuperAdmin?: boolean;
}

function OrderDetailsBody({
  formData,
  mode,
  updateField,
  events,
  onDownload,
}: {
  formData: Order;
  mode: "view" | "edit";
  updateField: (field: keyof Order, value: string) => void;
  events: OrderActivityEvent[];
  onDownload?: () => void;
}) {
  const swipe = useBillingModalSwipe();

  return (
    <div
      ref={swipe?.bodyRef}
      onTouchStart={swipe?.handleBodyTouchStart}
      onTouchMove={swipe?.handleBodyTouchMove}
      onTouchEnd={swipe?.handleBodyTouchEnd}
      className="flex-1 overflow-y-auto p-4 sm:p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 sm:gap-6">
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
          onDownload={onDownload}
        />
      </div>
    </div>
  );
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  initialMode = "view",
  onSave,
  onRefund,
  onDownload,
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
      className="max-w-3xl max-h-[92dvh] sm:max-h-[90vh]"
      showCloseButton={false}
    >
      {/* Top subtle luminance line */}
      <div className="absolute inset-x-0 top-0 h-px z-20 bg-linear-to-r from-transparent via-white/12 to-transparent" />

      <OrderDetailsHeader
        orderId={formData.displayId}
        orderDate={formData.date}
        onClose={onClose}
      />

      <OrderDetailsBody
        formData={formData}
        mode={mode}
        updateField={updateField}
        events={events}
        onDownload={onDownload}
      />

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
