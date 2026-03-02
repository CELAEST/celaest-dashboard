import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentMethod as PaymentMethodType } from "../types";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { billingApi } from "../api/billing.api";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export const usePaymentMethods = () => {
  const { currentOrg } = useOrgStore();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const token = session?.accessToken;
  const orgId = currentOrg?.id;

  const queryKey = orgId ? QUERY_KEYS.billing.paymentMethods(orgId) : QUERY_KEYS.billing.all;

  // Fetch Methods
  const {
    data: methods = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!orgId || !token) return [];
      const data = await billingApi.getPaymentMethods(orgId, token);
      
      return (data || []).map((m) => ({
        id: m.id,
        type: (m.brand?.toLowerCase() || 'visa'), 
        brand: m.brand,
        last4: m.last4 || '0000',
        expiryMonth: String(m.expiry_month || '12').padStart(2, '0'),
        expiryYear: String(m.expiry_year || '2025'),
        isDefault: m.is_default || false,
        holderName: "Card Holder",
      }));
    },
    enabled: !!orgId && !!token,
  });

  // Mutations
  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => billingApi.setDefaultPaymentMethod(orgId!, token!, id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<PaymentMethodType[]>(queryKey);
      if (previous) {
        queryClient.setQueryData<PaymentMethodType[]>(queryKey, 
          previous.map(m => ({ ...m, isDefault: m.id === id }))
        );
      }
      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error("Failed to update default payment method");
    },
    onSuccess: () => {
      toast.success("Default payment method updated");
      setActiveMenu(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => billingApi.deletePaymentMethod(orgId!, token!, id),
    onSuccess: () => {
      toast.success("Payment method removed");
      queryClient.invalidateQueries({ queryKey });
      setActiveMenu(null);
    },
    onError: () => {
      toast.error("Failed to remove payment method");
    }
  });

  const handleSetDefault = (id: string) => {
    setDefaultMutation.mutate(id);
  };

  const handleDelete = async (id: string) => {
    const method = methods.find((m) => m.id === id);
    if (method?.isDefault && methods.length > 1) {
      toast.error("Cannot delete default payment method");
      return;
    }
    deleteMutation.mutate(id);
  };

  return {
    methods,
    isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    activeMenu,
    setActiveMenu,
    handleSetDefault,
    handleDelete,
    addMethod: () => queryClient.invalidateQueries({ queryKey }),
    refresh: refetch,
  };
};
