import { useState } from "react";
import { PaymentGateway } from "../types";

const INITIAL_GATEWAYS: PaymentGateway[] = [
  {
    id: "stripe",
    name: "Stripe",
    logo: "stripe",
    status: "active",
    apiKey: "",
    webhookUrl: "https://api.celaest.com/webhooks/stripe",
    testMode: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    logo: "paypal",
    status: "standby",
    apiKey: "",
    webhookUrl: "https://api.celaest.com/webhooks/paypal",
    testMode: false,
  },
  {
    id: "square",
    name: "Square",
    logo: "square",
    status: "disabled",
    apiKey: "",
    webhookUrl: "https://api.celaest.com/webhooks/square",
    testMode: true,
  },
];

export const usePaymentGateways = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>(INITIAL_GATEWAYS);
  const [editingGatewayId, setEditingGatewayId] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [editForm, setEditForm] = useState<Partial<PaymentGateway>>({});

  const handleEdit = (gateway: PaymentGateway) => {
    setEditingGatewayId(gateway.id);
    setEditForm(gateway);
  };

  const handleSaveEdit = () => {
    if (editingGatewayId && editForm) {
      setGateways(
        gateways.map((g) =>
          g.id === editingGatewayId ? { ...g, ...editForm } : g
        )
      );
      setEditingGatewayId(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingGatewayId(null);
    setEditForm({});
  };

  const handleToggleStatus = (id: string) => {
    setGateways(
      gateways.map((g) => {
        if (g.id === id) {
          const statuses: Array<"active" | "standby" | "disabled"> = [
            "active",
            "standby",
            "disabled",
          ];
          const currentIndex = statuses.indexOf(g.status);
          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
          return { ...g, status: nextStatus };
        }
        return g;
      })
    );
  };

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return {
    gateways,
    editingGatewayId,
    showApiKey,
    editForm,
    setEditForm, // Expose setter for form updates
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleToggleStatus,
    toggleApiKeyVisibility,
  };
};
