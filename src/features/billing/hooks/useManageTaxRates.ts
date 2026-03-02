import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaxRate } from "../types";
import { billingApi } from "../api/billing.api";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export const useManageTaxRates = () => {
  const { session } = useAuth();
  const token = session?.accessToken ?? null;
  const queryClient = useQueryClient();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTaxRate, setNewTaxRate] = useState<Partial<TaxRate>>({
    name: "",
    rate: 0,
    region: "",
    type: "VAT",
    status: "active",
  });

  // ── Query ───────────────────────────────────────────────────────────
  const { data: taxRates = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.billing.taxRates,
    queryFn: async () => {
      const data = await billingApi.getAdminTaxRates(token!);
      return data.map(r => ({ ...r, isActive: r.status === "active" }));
    },
    enabled: !!token,
  });

  // ── Mutations ───────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async (rate: TaxRate) => {
      await billingApi.createAdminTaxRate(token!, rate);
      return rate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.taxRates });
      setNewTaxRate({ name: "", rate: 0, region: "", type: "VAT", status: "active" });
      setIsAdding(false);
      toast.success("Tax rate created successfully");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to create tax rate";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await billingApi.deleteAdminTaxRate(token!, id);
      return id;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.billing.taxRates });
      const previous = queryClient.getQueryData<TaxRate[]>(QUERY_KEYS.billing.taxRates);
      queryClient.setQueryData<TaxRate[]>(QUERY_KEYS.billing.taxRates, old =>
        (old || []).filter(r => r.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.billing.taxRates, context.previous);
      toast.error("Failed to delete tax rate");
    },
    onSuccess: () => toast.success("Tax rate deleted"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TaxRate> }) => {
      await billingApi.updateAdminTaxRate(token!, id, data);
      return { id, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.taxRates });
      setEditingId(null);
      setNewTaxRate({ name: "", rate: 0, region: "", type: "VAT", status: "active" });
      setIsAdding(false);
      toast.success("Tax rate updated successfully");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update tax rate";
      toast.error(msg);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, newActive }: { id: string; newActive: boolean }) => {
      await billingApi.updateAdminTaxRate(token!, id, {
        status: newActive ? "active" : "inactive",
      });
      return { id, newActive };
    },
    onMutate: async ({ id, newActive }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.billing.taxRates });
      const previous = queryClient.getQueryData<TaxRate[]>(QUERY_KEYS.billing.taxRates);
      queryClient.setQueryData<TaxRate[]>(QUERY_KEYS.billing.taxRates, old =>
        (old || []).map(r =>
          r.id === id
            ? { ...r, isActive: newActive, status: newActive ? "active" : "inactive" }
            : r
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.billing.taxRates, context.previous);
      toast.error("Failed to update tax rate status");
    },
    onSuccess: (_, { newActive }) => {
      toast.success(`Tax rate ${newActive ? "enabled" : "disabled"}`);
    },
  });

  // ── Handlers ────────────────────────────────────────────────────────
  const handleAddTaxRate = async () => {
    if (!token || !newTaxRate.name || !newTaxRate.region || newTaxRate.rate === undefined) return;
    const rateToCreate: TaxRate = {
      id: newTaxRate.id || `tax_${Math.random().toString(36).substring(2, 9)}`,
      name: newTaxRate.name,
      rate: Number(newTaxRate.rate),
      region: newTaxRate.region,
      type: newTaxRate.type || "VAT",
      status: "active",
    };
    createMutation.mutate(rateToCreate);
  };

  const handleDeleteTaxRate = (id: string) => {
    if (!token) return;
    deleteMutation.mutate(id);
  };

  const handleSaveEdit = () => {
    if (!token || !editingId || !newTaxRate.name || !newTaxRate.region || newTaxRate.rate === undefined) return;
    updateMutation.mutate({
      id: editingId,
      data: {
        name: newTaxRate.name,
        region: newTaxRate.region,
        rate: Number(newTaxRate.rate),
        type: newTaxRate.type,
        status: newTaxRate.status || "active",
      },
    });
  };

  const handleToggleActive = (id: string) => {
    if (!token) return;
    const rate = taxRates.find(r => r.id === id);
    if (!rate) return;
    toggleMutation.mutate({ id, newActive: !rate.isActive });
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
      setIsAdding(true);
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
    refresh: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.taxRates }),
  };
};
