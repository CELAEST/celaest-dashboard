"use client";

import { BillingModal } from "./shared/BillingModal";
import { usePaymentGateways } from "../../hooks/usePaymentGateways";
import { ConfigurePaymentGatewaysHeader } from "./ConfigurePaymentGateways/ConfigurePaymentGatewaysHeader";
import { PaymentGatewaysList } from "./ConfigurePaymentGateways/PaymentGatewaysList";
import { ConfigurePaymentGatewaysFooter } from "./ConfigurePaymentGateways/ConfigurePaymentGatewaysFooter";

interface ConfigurePaymentGatewaysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigurePaymentGatewaysModal({
  isOpen,
  onClose,
}: ConfigurePaymentGatewaysModalProps) {
  const {
    gateways,
    editingGatewayId,
    showApiKey,
    editForm,
    setEditForm,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleToggleStatus,
    toggleApiKeyVisibility,
  } = usePaymentGateways();

  const maskApiKey = (key: string, show: boolean) => {
    if (show) return key;
    if (!key) return "Not configured";
    return `${key.substring(0, 8)}${"•".repeat(Math.min(20, key.length - 8))}`;
  };

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-5xl max-h-[85vh]"
    >
      <ConfigurePaymentGatewaysHeader />

      <div className="p-6 space-y-4 overflow-y-auto flex-1">
        <PaymentGatewaysList
          gateways={gateways}
          editingGatewayId={editingGatewayId}
          editForm={editForm}
          setEditForm={setEditForm}
          showApiKey={showApiKey}
          toggleApiKeyVisibility={toggleApiKeyVisibility}
          handleEdit={handleEdit}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          handleToggleStatus={handleToggleStatus}
          maskApiKey={maskApiKey}
        />
      </div>

      <ConfigurePaymentGatewaysFooter onClose={onClose} />
    </BillingModal>
  );
}
