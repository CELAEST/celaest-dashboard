import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  MOCK_LICENSES,
  MOCK_ANALYTICS,
  MOCK_COLLISIONS,
  License,
  Analytics,
  Collision,
  ValidationLog,
} from "@/features/licensing/constants/mock-data";

export const useLicensing = () => {
  const [licenses, setLicenses] = useState<License[]>(MOCK_LICENSES);
  const [analytics, setAnalytics] = useState<Analytics | null>(MOCK_ANALYTICS);
  const [collisions, setCollisions] = useState<Collision[]>(MOCK_COLLISIONS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"licenses" | "collisions" | "analytics">("licenses");
  
  // License Detail Modal State
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [validationLogs, setValidationLogs] = useState<ValidationLog[]>([]);

  const loadData = useCallback(() => {
    // Mock refresh logic
    setLoading(true);
    setTimeout(() => {
      setLicenses(MOCK_LICENSES);
      setAnalytics(MOCK_ANALYTICS);
      setCollisions(MOCK_COLLISIONS);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    // Avoid synchronous setState warning by deferring
    const timeout = setTimeout(loadData, 0);
    const interval = setInterval(loadData, 10000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [loadData]);

  const handleChangeStatus = useCallback(async (status: string) => {
    if (!selectedLicense) return;
    const licenseId = selectedLicense.id;

    const updatedLicense = { ...selectedLicense, status: status as License["status"] };
    
    setLicenses((prev) =>
      prev.map((l) => (l.id === licenseId ? updatedLicense : l))
    );
    
    setSelectedLicense(updatedLicense);
    toast.success(`License status updated to ${status} (Mock)`);
  }, [selectedLicense]);

  const handleUnbindIp = useCallback(async (ip: string) => {
    if (!selectedLicense) return;
    const updatedBindings =
      selectedLicense.ipBindings?.filter((b) => b.ip !== ip) || [];

    const updatedLicense = { ...selectedLicense, ipBindings: updatedBindings };
    setSelectedLicense(updatedLicense);

    setLicenses((prev) =>
      prev.map((l) => (l.id === selectedLicense.id ? updatedLicense : l))
    );
    toast.success(`IP ${ip} unbound successfully (Mock)`);
  }, [selectedLicense]);

  const loadLicenseDetails = useCallback(async (licenseId: string) => {
    setValidationLogs([
      {
        licenseId,
        ip: "192.168.1.1",
        timestamp: new Date().toISOString(),
        success: true,
      },
      {
        licenseId,
        ip: "10.0.0.5",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        success: true,
      },
      {
        licenseId,
        ip: "172.16.0.1",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        success: false,
        reason: "Invalid signature",
      },
      {
        licenseId,
        ip: "203.0.113.42",
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        success: true,
      },
    ]);
  }, []);

  const selectLicense = useCallback((license: License | null) => {
    setSelectedLicense(license);
    if (license) {
      loadLicenseDetails(license.id);
    }
  }, [loadLicenseDetails]);

  const addNewLicense = useCallback((newLicense: License) => {
      setLicenses((prev) => [newLicense, ...prev]);
  }, []);

  // Helper for filtered licenses
  const filteredLicenses = useMemo(() => licenses.filter((lic) => {
    const matchesSearch =
      lic.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.productType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || lic.status === statusFilter;

    return matchesSearch && matchesStatus;
  }), [licenses, searchQuery, statusFilter]);

  return {
      licenses: filteredLicenses,
      allLicenses: licenses,
      analytics,
      collisions,
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
      addNewLicense
  };
};
