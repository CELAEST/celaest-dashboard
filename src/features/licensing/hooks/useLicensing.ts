import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { licensingService } from "@/features/licensing/services/licensing.service";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { socket } from "@/lib/socket-client";
import { useEffect } from "react";

import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import {
  useLicensesQuery,
  useLicenseStatsQuery,
} from "./useLicensesQuery";
import type {
  LicenseResponse,
  IPBinding,
  LicenseStatus,
} from "@/features/licensing/types";
import type { ValidationLog } from "@/features/licensing/constants/mock-data";

export const useLicensing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
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
  const { data: listData, isLoading: loadingLicenses } = useLicensesQuery({
    search: searchQuery || undefined,
    status: statusFilter === "all" ? undefined : (statusFilter as LicenseStatus),
    page,
    limit,
  });

  const { data: statsData } = useLicenseStatsQuery();

  // Real-time synchronization for Licensing Hub
  useEffect(() => {
    if (!session?.accessToken) return;

    const handler = () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
    };

    const unsubscribers = [
      socket.on("license.created", handler),
      socket.on("license.updated", handler),
      socket.on("license.activated", handler),
      socket.on("subscription.created", handler),
      socket.on("subscription.updated", handler),
      socket.on("subscription.cancelled", handler),
    ];

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [session?.accessToken, queryClient]);

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
      const snapshots = queryClient.getQueriesData<{ licenses: LicenseResponse[]; total: number }>({ queryKey: QUERY_KEYS.licensing.all });
      queryClient.setQueriesData<{ licenses: LicenseResponse[]; total: number }>(
        { queryKey: QUERY_KEYS.licensing.all },
        (old) => {
          if (!old || !old.licenses) return old;
          return {
            ...old,
            licenses: old.licenses.map((l) =>
              l.id === id ? { ...l, status } : l
            ),
          };
        }
      );
      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      context?.snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error("Failed to update license status");
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
      if (selectedLicense?.id === updated.id) setSelectedLicense(updated);
      toast.success(`License status changed to ${updated.status}`);
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) =>
      licensingService.revoke(id, "Revoked via dashboard"),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.licensing.all });
      const snapshots = queryClient.getQueriesData<{ licenses: LicenseResponse[]; total: number }>({ queryKey: QUERY_KEYS.licensing.all });
      queryClient.setQueriesData<{ licenses: LicenseResponse[]; total: number }>(
        { queryKey: QUERY_KEYS.licensing.all },
        (old) => {
          if (!old || !old.licenses) return old;
          return {
            ...old,
            licenses: old.licenses.map((l) =>
              l.id === id ? { ...l, status: "revoked" as LicenseStatus } : l
            ),
          };
        }
      );
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      context?.snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error("Failed to revoke license");
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
      if (selectedLicense?.id === updated.id) setSelectedLicense(updated);
      toast.success(`License revoked successfully`);
    },
  });

  const renewMutation = useMutation({
    mutationFn: (id: string) => licensingService.renew(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
      if (selectedLicense?.id === updated.id) setSelectedLicense(updated);
      toast.success("License renewed successfully");
    },
    onError: () => toast.error("Failed to renew license"),
  });

  const convertTrialMutation = useMutation({
    mutationFn: (id: string) => licensingService.convertTrial(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
      if (selectedLicense?.id === updated.id) setSelectedLicense(updated);
      toast.success("Trial converted to paid license");
    },
    onError: () => toast.error("Failed to convert trial"),
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => licensingService.reactivate(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.licensing.all });
      if (selectedLicense?.id === updated.id) setSelectedLicense(updated);
      toast.success("License reactivated successfully");
    },
    onError: () => toast.error("Failed to reactivate license"),
  });

  const unbindMutation = useMutation({
    mutationFn: ({ id, ip }: { id: string; ip: string }) =>
      licensingService.unbindIP(id, ip),
    onMutate: async ({ id, ip }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.licensing.all });
      const snapshots = queryClient.getQueriesData<{ licenses: LicenseResponse[]; total: number }>({ queryKey: QUERY_KEYS.licensing.all });
      queryClient.setQueriesData<{ licenses: LicenseResponse[]; total: number }>(
        { queryKey: QUERY_KEYS.licensing.all },
        (old) => old ? {
          ...old,
          licenses: old.licenses.map(l => l.id === id
            ? { ...l, ip_bindings: (l.ip_bindings || []).filter((b: IPBinding) => b.ip_address !== ip) }
            : l
          )
        } : old
      );
      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      context?.snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error("Failed to unbind IP");
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
  const filteredLicenses = useMemo(() => {
    const baseLicenses = listData?.licenses || [];

    // For regular users, show their licenses sorted by tier, excluding revoked
    if (!isAdminUser && baseLicenses.length > 0) {
      const displayLicenses = baseLicenses.filter(
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

    return baseLicenses;
  }, [listData, isAdminUser]);

  return {
    licenses: filteredLicenses,
    total: listData?.total || 0,
    analytics: statsData || null,
    collisions: [] as IPBinding[], 
    loading: loadingLicenses,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    limit,
    setLimit,
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
