import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { toastMutationError } from "@/lib/toast-helpers";
import { useQueryClient, useMutation, InfiniteData } from "@tanstack/react-query";
import { licensingService } from "@/features/licensing/services/licensing.service";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

// Helper: invalidate licensing + marketplace-related queries after license changes
const invalidateAfterLicenseChange = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets.all });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.all });
};

import {
  useLicensesQuery,
  useLicenseStatsQuery,
} from "./useLicensesQuery";
import type {
  LicenseResponse,
  LicenseListResponse,
  IPBinding,
  LicenseStatus,
} from "@/features/licensing/types";
import type { ValidationLog } from "@/features/licensing/constants/mock-data";

export const useLicensing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<
    "licenses" | "collisions" | "analytics"
  >("licenses");

  // License Detail Modal State
  const [selectedLicense, setSelectedLicense] =
    useState<LicenseResponse | null>(null);
  const [validationLogs, setValidationLogs] = useState<ValidationLog[]>([]);

  const session = useAuthStore((s) => s.session);
  const queryClient = useQueryClient();

  // Queries
  const {
    data: listData,
    isLoading: loadingLicenses,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLicensesQuery({
    search: searchQuery || undefined,
    status: statusFilter === "all" ? undefined : (statusFilter as LicenseStatus),
  });

  const { data: statsData } = useLicenseStatsQuery();



  // Determine if user is admin/super_admin
  const isAdminUser = useMemo(() => {
    const role = session?.user?.role;
    return role === "super_admin" || role === "admin";
  }, [session]);

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LicenseStatus }) =>
      licensingService.changeStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.licensing.all });
      const snapshots = queryClient.getQueriesData<InfiniteData<LicenseListResponse>>({ queryKey: ["licensing", "list"] });
      queryClient.setQueriesData<InfiniteData<LicenseListResponse>>(
        { queryKey: ["licensing", "list"] },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              licenses: p.licenses.map((l) =>
                l.id === id ? { ...l, status } : l
              ),
            })),
          };
        }
      );
      return { snapshots };
    },
    onError: (err, vars, context) => {
      context?.snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      const msg = err instanceof Error ? err.message : "Failed to update license status";
      toastMutationError({
        message: msg,
        onRetry: () => updateMutation.mutate(vars),
      });
    },
    onSuccess: (updated) => {
      invalidateAfterLicenseChange(queryClient);
      if (selectedLicense?.id === updated.id) setSelectedLicense(updated);
      toast.success(`License status changed to ${updated.status}`);
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) =>
      licensingService.revoke(id, "Revoked via dashboard"),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.licensing.all });
      const snapshots = queryClient.getQueriesData<InfiniteData<LicenseListResponse>>({ queryKey: ["licensing", "list"] });
      queryClient.setQueriesData<InfiniteData<LicenseListResponse>>(
        { queryKey: ["licensing", "list"] },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              licenses: p.licenses.map((l) =>
                l.id === id ? { ...l, status: "revoked" as LicenseStatus } : l
              ),
            })),
          };
        }
      );
      return { snapshots };
    },
    onError: (err, id, context) => {
      context?.snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      const msg = err instanceof Error ? err.message : "Failed to revoke license";
      toastMutationError({
        message: msg,
        onRetry: () => revokeMutation.mutate(id),
      });
    },
    onSuccess: (updated) => {
      invalidateAfterLicenseChange(queryClient);
      if (selectedLicense?.id === updated.id) setSelectedLicense(updated);
      toast.success(`License revoked successfully`);
    },
  });

  const renewMutation = useMutation({
    mutationFn: (id: string) => licensingService.renew(id),
    onSuccess: (updated) => {
      invalidateAfterLicenseChange(queryClient);
      if (selectedLicense?.id === updated.id) setSelectedLicense(updated);
      toast.success("License renewed successfully");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to renew license"),
  });

  const convertTrialMutation = useMutation({
    mutationFn: (id: string) => licensingService.convertTrial(id),
    onSuccess: (updated) => {
      invalidateAfterLicenseChange(queryClient);
      if (selectedLicense?.id === updated.id) setSelectedLicense(updated);
      toast.success("Trial converted to paid license");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to convert trial"),
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => licensingService.reactivate(id),
    onSuccess: (updated) => {
      invalidateAfterLicenseChange(queryClient);
      if (selectedLicense?.id === updated.id) setSelectedLicense(updated);
      toast.success("License reactivated successfully");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to reactivate license"),
  });

  const unbindMutation = useMutation({
    mutationFn: ({ id, ip }: { id: string; ip: string }) =>
      licensingService.unbindIP(id, ip),
    onMutate: async ({ id, ip }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.licensing.all });
      const snapshots = queryClient.getQueriesData<InfiniteData<LicenseListResponse>>({ queryKey: ["licensing", "list"] });
      queryClient.setQueriesData<InfiniteData<LicenseListResponse>>(
        { queryKey: ["licensing", "list"] },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((p) => ({
              ...p,
              licenses: p.licenses.map(l => l.id === id
                ? { ...l, ip_bindings: (l.ip_bindings || []).filter((b: IPBinding) => b.ip_address !== ip) }
                : l
              ),
            })),
          };
        }
      );
      return { snapshots };
    },
    onError: (err, _vars, context) => {
      context?.snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      const msg = err instanceof Error ? err.message : "Failed to unbind IP";
      toast.error(msg);
    },
    onSuccess: (_, { id, ip }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
      toast.success(`IP ${ip} unbound`);
      licensingService.getById(id).then(setSelectedLicense);
    },
  });

  // --- Handlers ---

  const selectLicense = useCallback(
    async (license: LicenseResponse | null) => {
      setSelectedLicense(license);
      if (license) {
        try {
          const validationsData = await licensingService.getValidations(
            license.id
          );
          if (Array.isArray(validationsData)) {
            setValidationLogs(validationsData as unknown as ValidationLog[]);
          } else if (validationsData && "validations" in validationsData) {
            setValidationLogs(
              (
                validationsData as unknown as { validations: ValidationLog[] }
              ).validations ?? []
            );
          } else {
            setValidationLogs([]);
          }
        } catch {
          setValidationLogs([]);
        }
      } else {
        setValidationLogs([]);
      }
    },
    []
  );

  const handleChangeStatus = useCallback(
    (licenseId: string, newStatus: LicenseStatus) => {
      updateMutation.mutate({ id: licenseId, status: newStatus });
    },
    [updateMutation]
  );

  const handleUnbindIp = useCallback(
    (licenseId: string, ipAddress: string) => {
      unbindMutation.mutate({ id: licenseId, ip: ipAddress });
    },
    [unbindMutation]
  );

  const revokeLicense = useCallback(
    (licenseId: string) => {
      revokeMutation.mutate(licenseId);
    },
    [revokeMutation]
  );

  const renewLicense = useCallback(
    (licenseId: string) => renewMutation.mutate(licenseId),
    [renewMutation]
  );

  const convertTrial = useCallback(
    (licenseId: string) => convertTrialMutation.mutate(licenseId),
    [convertTrialMutation]
  );

  const reactivateLicense = useCallback(
    (licenseId: string) => reactivateMutation.mutate(licenseId),
    [reactivateMutation]
  );

  const addNewLicense = useCallback(() => {
    // With TanStack Query, we just invalidate
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
  }, [queryClient]);

  // Derived Data
  const allLicenses = useMemo(
    () => listData?.pages.flatMap((p) => p.licenses) ?? [],
    [listData],
  );
  const totalLicenses = listData?.pages[0]?.total ?? 0;

  const filteredLicenses = useMemo(() => {
    // For regular users, show their licenses sorted by tier, excluding revoked
    if (!isAdminUser && allLicenses.length > 0) {
      const displayLicenses = allLicenses.filter(
        (lic) => lic.status !== "revoked"
      );

      if (displayLicenses.length > 0) {
        // Sort by tier descending so the best plan appears first
        return [...displayLicenses].sort((a, b) => {
          const tierA = a.plan?.tier ?? 0;
          const tierB = b.plan?.tier ?? 0;
          return tierB - tierA;
        });
      }
      return [];
    }

    return allLicenses;
  }, [allLicenses, isAdminUser]);

  return {
    licenses: filteredLicenses,
    total: totalLicenses,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    analytics: statsData || null,
    collisions: [] as IPBinding[], 
    loading: loadingLicenses,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    activeTab,
    setActiveTab,
    selectedLicense,
    validationLogs,
    handleChangeStatus,
    handleUnbindIp,
    selectLicense,
    addNewLicense,
    revokeLicense,
    renewLicense,
    convertTrial,
    reactivateLicense,
  };
};
