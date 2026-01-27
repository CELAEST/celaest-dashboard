"use client";

import { BillingModal } from "./shared/BillingModal";
import { useOrderDetails } from "../../hooks/useOrderDetails";
import { Order } from "../../types";
import { OrderDetailsHeader } from "./OrderDetails/OrderDetailsHeader";
import { OrderDetailsContent } from "./OrderDetails/OrderDetailsContent";
import { OrderDetailsSidebar } from "./OrderDetails/OrderDetailsSidebar";
import { OrderDetailsFooter } from "./OrderDetails/OrderDetailsFooter";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  initialMode?: "view" | "edit";
  onSave?: (updatedOrder: Order) => void;
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  initialMode = "view",
  onSave,
}: OrderDetailsModalProps) {
  const { mode, setMode, formData, updateField, handleSave } = useOrderDetails(
    order,
    initialMode,
    isOpen,
    onSave,
    onClose,
  );

  if (!formData) return null;

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-3xl max-h-[90vh]"
      showCloseButton={false}
    >
      <OrderDetailsHeader
        orderId={formData.id}
        orderDate={formData.date}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          <OrderDetailsContent
            formData={formData}
            mode={mode}
            updateField={updateField}
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
        lastEditDate={formData.date}
      />
    </BillingModal>
  );
}
