import { useState, useEffect, useCallback } from "react";
import { PaymentMethod } from "../types";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { billingApi } from "../api/billing.api";
import { toast } from "sonner";

export const usePaymentMethods = () => {
  const { currentOrg } = useOrgStore();
  const { session } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchMethods = useCallback(async () => {
    if (!currentOrg?.id || !session?.accessToken) return;

    setIsLoading(true);
    try {
      const data: any = await billingApi.getPaymentMethods(currentOrg.id, session.accessToken);
      
      // Map backend to frontend types if necessary
      const mappedMethods: PaymentMethod[] = (data || []).map((m: any) => ({
        id: m.id,
        // Backend brand -> frontend type
        type: (m.brand?.toLowerCase() || 'visa') as any, 
        last4: m.last4 || '0000',
        expiryMonth: String(m.expiry_month || '12').padStart(2, '0'),
        expiryYear: String(m.expiry_year || '2025'),
        isDefault: m.is_default || false,
        holderName: "Card Holder", // Fallback if not in DB
      }));

      setMethods(mappedMethods);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch payment methods:", err);
      setError("Failed to load payment methods");
      // toast.error("Failed to load payment methods");
    } finally {
      setIsLoading(false);
    }
  }, [currentOrg?.id, session?.accessToken]);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const handleSetDefault = async (id: string) => {
    if (!currentOrg?.id || !session?.accessToken) return;

    try {
      await billingApi.setDefaultPaymentMethod(currentOrg.id, session.accessToken, id);
      setMethods(methods.map((m) => ({ ...m, isDefault: m.id === id })));
      setActiveMenu(null);
      toast.success("Default payment method updated");
    } catch (err: any) {
      console.error("Failed to set default payment method:", err);
      toast.error("Failed to update default payment method");
    }
  };

  const handleDelete = async (id: string) => {
    if (!currentOrg?.id || !session?.accessToken) return;

    const method = methods.find((m) => m.id === id);
    if (method?.isDefault && methods.length > 1) {
      toast.error("Cannot delete default payment method");
      return;
    }

    try {
      await billingApi.deletePaymentMethod(currentOrg.id, session.accessToken, id);
      setMethods(methods.filter((m) => m.id !== id));
      setActiveMenu(null);
      toast.success("Payment method removed");
    } catch (err: any) {
      console.error("Failed to delete payment method:", err);
      toast.error("Failed to remove payment method");
    }
  };

  const handleUpdateMethod = (updatedMethod: PaymentMethod) => {
    setMethods(
      methods.map((m) => (m.id === updatedMethod.id ? updatedMethod : m)),
    );
  };

  const addMethod = (newMethod: PaymentMethod) => {
      setMethods([...methods, newMethod]);
  }

  return {
    methods,
    isLoading,
    error,
    activeMenu,
    setActiveMenu,
    handleSetDefault,
    handleDelete,
    handleUpdateMethod,
    addMethod,
    refresh: fetchMethods
  };
};
