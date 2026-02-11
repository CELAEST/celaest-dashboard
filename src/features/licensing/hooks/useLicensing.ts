import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { licensingService, isServiceReady } from "@/features/licensing/services/licensing.service";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import type {
  LicenseResponse,
  LicenseStats,
  IPBinding,
  LicenseStatus,
} from "@/features/licensing/types";
import type { ValidationLog } from "@/features/licensing/constants/mock-data";

export const useLicensing = () => {
  const [licenses, setLicenses] = useState<LicenseResponse[]>([]);
  const [stats, setStats] = useState<LicenseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<
    "licenses" | "collisions" | "analytics"
  >("licenses");

  // License Detail Modal State
  const [selectedLicense, setSelectedLicense] =
    useState<LicenseResponse | null>(null);
  const [validationLogs, setValidationLogs] = useState<ValidationLog[]>([]);

  // Watch auth/org readiness to trigger data loading
  const session = useAuthStore((s) => s.session);
  const currentOrg = useOrgStore((s) => s.currentOrg);

  const loadData = useCallback(async () => {
    // Don't attempt to load if auth/org context isn't ready
    if (!isServiceReady()) {
      return;
    }

    setLoading(true);
    try {
      const [listResult, statsResult] = await Promise.allSettled([
        licensingService.list({ page: 1, limit: 100 }),
        licensingService.getStats(),
      ]);

      if (listResult.status === "fulfilled") {
        setLicenses(listResult.value.licenses);
      } else {
        console.error("Failed to load licenses:", listResult.reason);
      }

      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value);
      } else {
        console.error("Failed to load stats:", statsResult.reason);
      }
    } catch (err) {
      console.error("Error loading licensing data:", err);
      toast.error("Failed to load licensing data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data when auth + org become available
  useEffect(() => {
    if (!session?.accessToken || !currentOrg?.id) return;

    // Small delay to ensure Zustand stores are fully synchronized
    const timeout = setTimeout(loadData, 100);
    const interval = setInterval(loadData, 30000); // Refresh every 30s
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [session?.accessToken, currentOrg?.id, loadData]);

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
    async (licenseId: string, newStatus: LicenseStatus) => {
      try {
        const updated = await licensingService.changeStatus(
          licenseId,
          newStatus
        );
        setLicenses((prev) =>
          prev.map((lic) => (lic.id === licenseId ? updated : lic))
        );
        if (selectedLicense?.id === licenseId) {
          setSelectedLicense(updated);
        }
        toast.success(`License status changed to ${newStatus}`);
      } catch (err) {
        console.error("Failed to change status:", err);
        toast.error("Failed to change license status");
      }
    },
    [selectedLicense]
  );

  const handleUnbindIp = useCallback(
    async (licenseId: string, ipAddress: string) => {
      try {
        await licensingService.unbindIP(licenseId, ipAddress);
        if (selectedLicense?.id === licenseId) {
          const updated = await licensingService.getById(licenseId);
          setSelectedLicense(updated);
          setLicenses((prev) =>
            prev.map((lic) => (lic.id === licenseId ? updated : lic))
          );
        }
        toast.success(`IP ${ipAddress} unbound`);
      } catch (err) {
        console.error("Failed to unbind IP:", err);
        toast.error("Failed to unbind IP address");
      }
    },
    [selectedLicense]
  );

  const revokeLicense = useCallback(
    async (licenseId: string) => {
      try {
        const updated = await licensingService.revoke(
          licenseId,
          "Revoked via dashboard"
        );
        setLicenses((prev) =>
          prev.map((lic) => (lic.id === licenseId ? updated : lic))
        );
        if (selectedLicense?.id === licenseId) {
          setSelectedLicense(updated);
        }
        toast.success(`License revoked successfully`);
      } catch (err) {
        console.error("Failed to revoke license:", err);
        toast.error("Failed to revoke license");
      }
    },
    [selectedLicense]
  );

  const addNewLicense = useCallback((newLicense: LicenseResponse) => {
    setLicenses((prev) => [newLicense, ...prev]);
  }, []);

  // Helper for filtered licenses
  const filteredLicenses = useMemo(
    () =>
      licenses.filter((lic) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          searchQuery === "" ||
          lic.id.toLowerCase().includes(searchLower) ||
          lic.license_key.toLowerCase().includes(searchLower) ||
          lic.status.toLowerCase().includes(searchLower) ||
          lic.plan?.name?.toLowerCase().includes(searchLower) ||
          lic.billing_cycle.toLowerCase().includes(searchLower);

        const matchesStatus =
          statusFilter === "all" || lic.status === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [licenses, searchQuery, statusFilter]
  );

  // Map stats to analytics format for backward compatibility
  const analytics = useMemo(() => {
    if (!stats) return null;
    return stats;
  }, [stats]);

  return {
    licenses: filteredLicenses,
    allLicenses: licenses,
    analytics,
    collisions: [] as IPBinding[], // Loaded per-license now
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    activeTab,
    setActiveTab,
    selectedLicense,
    validationLogs,
    loadData,
    handleChangeStatus,
    handleUnbindIp,
    selectLicense,
    addNewLicense,
    revokeLicense,
  };
};
