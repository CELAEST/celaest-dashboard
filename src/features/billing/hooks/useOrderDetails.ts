import { useState } from "react";
import { Order } from "../types";

export const useOrderDetails = (
  order: Order | null,
  initialMode: "view" | "edit" = "view",
  isOpen: boolean,
  onSave?: (updatedOrder: Order) => void,
  onClose?: () => void
) => {
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [formData, setFormData] = useState<Order | null>(null);

  // Track dependencies to reset form data when they change
  const [prevProps, setPrevProps] = useState({ isOpen, orderId: order?.id });

  if (isOpen !== prevProps.isOpen || order?.id !== prevProps.orderId) {
    setPrevProps({ isOpen, orderId: order?.id });
    if (isOpen && order) {
      setFormData(order);
      setMode(initialMode);
    }
  }

  const handleSave = () => {
    if (onSave && formData) {
      onSave(formData);
    }
    if (onClose) {
      onClose();
    }
  };

  const updateField = (field: keyof Order, value: string) => {
    if (!formData) return;
    // Ensure value is appropriate for the field if strict typing is needed, 
    // but for now strict casting is okay as inputs are strings.
    setFormData({ ...formData, [field]: value });
  };

  return {
    mode,
    setMode,
    formData,
    updateField,
    handleSave,
  };
};
