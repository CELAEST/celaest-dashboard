import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentGateway } from "../types";
import { billingApi } from "../api/billing.api";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export const usePaymentGateways = () => {
  const { session } = useAuth();
  const token = session?.accessToken ?? null;
  const queryClient = useQueryClient();

  const [editingGatewayId, setEditingGatewayId] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [editForm, setEditForm] = useState<Partial<PaymentGateway>>({});

  // ── Query ───────────────────────────────────────────────────────────
  const { data: gateways = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.billing.gateways,
    queryFn: () => billingApi.getAdminGateways(token!),
    enabled: !!token,
  });

  // ── Mutations ───────────────────────────────────────────────────────
  const saveConfigMutation = useMutation({
    mutationFn: async ({ id, config }: { id: string; config: Partial<PaymentGateway> }) => {
      await billingApi.updateAdminGatewayConfig(token!, id, config);
      return { id, config };
    },
    onMutate: async ({ id, config }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.billing.gateways });
      const previous = queryClient.getQueryData<PaymentGateway[]>(QUERY_KEYS.billing.gateways);
      queryClient.setQueryData<PaymentGateway[]>(QUERY_KEYS.billing.gateways, old =>
        (old || []).map(g => g.id === id ? { ...g, ...config } : g)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.billing.gateways, context.previous);
      toast.error("Failed to save gateway configuration");
    },
    onSuccess: () => {
      setEditingGatewayId(null);
      setEditForm({});
      toast.success("Gateway configuration saved successfully");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, newActive }: { id: string; newActive: boolean }) => {
      await billingApi.updateAdminGatewayStatus(token!, id, newActive);
      return { id, newActive };
    },
    onMutate: async ({ id, newActive }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.billing.gateways });
      const previous = queryClient.getQueryData<PaymentGateway[]>(QUERY_KEYS.billing.gateways);
      queryClient.setQueryData<PaymentGateway[]>(QUERY_KEYS.billing.gateways, old =>
        (old || []).map(g =>
          g.id === id ? { ...g, status: newActive ? "active" : "disabled" } : g
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.billing.gateways, context.previous);
      toast.error("Failed to update gateway status");
    },
    onSuccess: (_, { id }) => toast.success(`Gateway ${id} status updated`),
  });

  // ── Handlers ────────────────────────────────────────────────────────
  const handleEdit = (gateway: PaymentGateway) => {
    setEditingGatewayId(gateway.id);
    setEditForm(gateway);
  };

  const handleSaveEdit = () => {
    if (editingGatewayId && editForm && token) {
      saveConfigMutation.mutate({ id: editingGatewayId, config: editForm });
    }
  };

  const handleCancelEdit = () => {
    setEditingGatewayId(null);
    setEditForm({});
  };

  const handleToggleStatus = (id: string) => {
    if (!token) return;
    const gateway = gateways.find(g => g.id === id);
    if (!gateway) return;
    toggleStatusMutation.mutate({ id, newActive: gateway.status !== "active" });
  };

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }));
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
    refresh: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.gateways }),
  };
};
