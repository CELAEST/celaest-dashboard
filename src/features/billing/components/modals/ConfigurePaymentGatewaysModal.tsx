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

      <ConfigurePaymentGatewaysHeader onClose={onClose} />

      <div className="px-8 py-6 space-y-4 overflow-y-auto flex-1 min-h-0">
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
