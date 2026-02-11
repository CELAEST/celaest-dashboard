import { useState, useEffect, useCallback } from "react";
import { TaxRate } from "../types";
import { billingApi } from "../api/billing.api";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { toast } from "sonner";

export const useManageTaxRates = () => {
  const { session } = useAuth();
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTaxRate, setNewTaxRate] = useState<Partial<TaxRate>>({
    name: "",
    rate: 0,
    region: "",
    type: "VAT",
    status: "active",
  });

  const fetchRates = useCallback(async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    try {
      const data = await billingApi.getAdminTaxRates(session.accessToken);
      // Ensure rate is number if it comes as string from backend (unlikely with recent changes but safe)
      const formattedData = data.map(r => ({
        ...r,
        isActive: r.status === 'active'
      }));
      setTaxRates(formattedData);
    } catch (err) {
      console.error("Failed to fetch tax rates:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const handleAddTaxRate = async () => {
    if (!session?.accessToken) return;
    
    // Validation
    if (newTaxRate.name && newTaxRate.region && newTaxRate.rate !== undefined) {
      try {
        const rateToCreate: TaxRate = {
          id: newTaxRate.id || `tax_${Math.random().toString(36).substring(2, 9)}`,
          name: newTaxRate.name,
          rate: Number(newTaxRate.rate),
          region: newTaxRate.region,
          type: newTaxRate.type || "VAT",
          status: "active",
        };
        await billingApi.createAdminTaxRate(session.accessToken, rateToCreate);
        await fetchRates();
        setNewTaxRate({ name: "", rate: 0, region: "", type: "VAT", status: "active" });
        setIsAdding(false);
        toast.success("Tax rate created successfully");
      } catch (err: any) {
        console.error("Failed to create tax rate:", err);
        const errorMsg = err.response?.data?.error || "Failed to create tax rate";
        toast.error(errorMsg);
      }
    }
  };

  const handleDeleteTaxRate = async (id: string) => {
    if (!session?.accessToken) return;
    try {
      await billingApi.deleteAdminTaxRate(session.accessToken, id);
      setTaxRates(taxRates.filter((rate) => rate.id !== id));
      toast.success("Tax rate deleted");
    } catch (err) {
      console.error("Failed to delete tax rate:", err);
      toast.error("Failed to delete tax rate");
    }
  };

  const handleSaveEdit = async () => {
    if (!session?.accessToken || !editingId) return;
    
    if (newTaxRate.name && newTaxRate.region && newTaxRate.rate !== undefined) {
      try {
        const updateData: Partial<TaxRate> = {
          name: newTaxRate.name,
          region: newTaxRate.region,
          rate: Number(newTaxRate.rate),
          type: newTaxRate.type,
          status: newTaxRate.status || "active",
        };
        await billingApi.updateAdminTaxRate(session.accessToken, editingId, updateData);
        await fetchRates();
        setEditingId(null);
        setNewTaxRate({ name: "", rate: 0, region: "", type: "VAT", status: "active" });
        setIsAdding(false);
        toast.success("Tax rate updated successfully");
      } catch (err: any) {
        console.error("Failed to update tax rate:", err);
        const errorMsg = err.response?.data?.error || "Failed to update tax rate";
        toast.error(errorMsg);
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    if (!session?.accessToken) return;
    const rate = taxRates.find((r) => r.id === id);
    if (!rate) return;

    try {
      const newActive = !rate.isActive;
      await billingApi.updateAdminTaxRate(
        session.accessToken,
        id,
        { status: newActive ? "active" : "inactive" }
      );
      setTaxRates(
        taxRates.map((r) =>
          r.id === id ? { ...r, isActive: newActive, status: newActive ? "active" : "inactive" } : r
        )
      );
      toast.success(`Tax rate ${newActive ? "enabled" : "disabled"}`);
    } catch (err: any) {
      console.error("Failed to toggle tax rate:", err);
      const errorMsg = err.response?.data?.error || "Failed to update tax rate status";
      toast.error(errorMsg);
    }
  };

  const startEditing = (id: string) => {
    const rate = taxRates.find(r => r.id === id);
    if (rate) {
      setEditingId(id);
      setNewTaxRate({
        name: rate.name,
        region: rate.region,
        rate: rate.rate,
        type: rate.type,
        status: rate.status,
      });
      setIsAdding(true); // Open the form
    }
  };

  return {
    taxRates,
    isLoading,
    isAdding,
    setIsAdding: (val: boolean) => {
      setIsAdding(val);
      if (!val) {
        setEditingId(null);
        setNewTaxRate({ name: "", rate: 0, region: "", type: "VAT", status: "active" });
      }
    },
    editingId,
    setEditingId,
    newTaxRate,
    setNewTaxRate,
    handleAddTaxRate,
    handleDeleteTaxRate,
    handleToggleActive,
    handleSaveEdit,
    startEditing,
    refresh: fetchRates,
  };
};
