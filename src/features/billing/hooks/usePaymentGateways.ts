import { useState, useEffect, useCallback } from "react";
import { PaymentGateway } from "../types";
import { billingApi } from "../api/billing.api";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { toast } from "sonner";

export const usePaymentGateways = () => {
  const { session } = useAuth();
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingGatewayId, setEditingGatewayId] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [editForm, setEditForm] = useState<Partial<PaymentGateway>>({});

  const fetchGateways = useCallback(async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    try {
      const data = await billingApi.getAdminGateways(session.accessToken);
      setGateways(data);
    } catch (err) {
      console.error("Failed to fetch gateways:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    fetchGateways();
  }, [fetchGateways]);

  const handleEdit = (gateway: PaymentGateway) => {
    setEditingGatewayId(gateway.id);
    setEditForm(gateway);
  };

  const handleSaveEdit = async () => {
    if (editingGatewayId && editForm && session?.accessToken) {
      try {
        await billingApi.updateAdminGatewayConfig(
          session.accessToken,
          editingGatewayId,
          editForm
        );
        setGateways(
          gateways.map((g) =>
            g.id === editingGatewayId ? { ...g, ...editForm } : g
          )
        );
        setEditingGatewayId(null);
        setEditForm({});
        toast.success("Gateway configuration saved successfully");
      } catch (err) {
        console.error("Failed to save gateway config:", err);
        toast.error("Failed to save gateway configuration");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingGatewayId(null);
    setEditForm({});
  };

  const handleToggleStatus = async (id: string) => {
    if (!session?.accessToken) return;
    
    const gateway = gateways.find(g => g.id === id);
    if (!gateway) return;

    const newActive = gateway.status !== "active";
    
    try {
      await billingApi.updateAdminGatewayStatus(session.accessToken, id, newActive);
      setGateways(
        gateways.map((g) =>
          g.id === id ? { ...g, status: newActive ? "active" : "disabled" } : g
        )
      );
      toast.success(`Gateway ${id} status updated`);
    } catch (err) {
      console.error("Failed to toggle gateway status:", err);
      toast.error("Failed to update gateway status");
    }
  };

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return {
    gateways,
    isLoading,
    editingGatewayId,
    showApiKey,
    editForm,
    setEditForm,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleToggleStatus,
    toggleApiKeyVisibility,
    refresh: fetchGateways,
  };
};
