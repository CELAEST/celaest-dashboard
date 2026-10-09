import React, { useState } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { CreateLicenseModal } from "./modals/CreateLicenseModal";
import { LicenseDetailsModal } from "./modals/LicenseDetailsModal";
import { useLicensing } from "@/features/licensing/hooks/useLicensing";
import { LicenseFormData } from "@/features/licensing/hooks/useCreateLicense";
import { licensingService } from "@/features/licensing/services/licensing.service";
import type { LicenseStatus } from "@/features/licensing/types";

// Sub-components
import { LicensingHeader } from "./hub/LicensingHeader";
import { LicensingStats } from "./hub/LicensingStats";
import { LicensingList } from "./hub/LicensingList";
import { LicensingCollisions } from "./hub/LicensingCollisions";
import { useRole } from "@/features/auth/hooks/useAuthorization";

export const LicensingHub: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isSuperAdmin } = useRole();

  const {
    licenses,
    analytics,
    collisions,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    total,
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
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useLicensing();

  const effectiveActiveTab = activeTab === "analytics" && !isSuperAdmin ? "licenses" : activeTab;

  // Handle License Creation — delegates to real API
  const handleCreateLicense = async (data: LicenseFormData) => {
    const created = await licensingService.create({
      plan_id: data.plan_id,
      billing_cycle: data.billing_cycle,
      notes: data.notes,
    });
    // Add the newly created license to the local list
    addNewLicense();
    return created.license_key;
  };

  return (
    <div
      className={`h-full w-full flex flex-col min-h-0 ${isDark ? "bg-transparent" : "bg-gray-50"}`}
    >
      <LicensingHeader
        onCreateClick={() => setIsCreateModalOpen(true)}
        activeTab={effectiveActiveTab}
        onTabChange={setActiveTab}
        collisionsCount={collisions.length}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        isSuperAdmin={isSuperAdmin}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {effectiveActiveTab === "analytics" && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <LicensingStats analytics={analytics} />
            </div>
          )}

          {effectiveActiveTab === "collisions" && (
            <LicensingCollisions
              collisions={collisions}
              onRevoke={revokeLicense}
            />
          )}

          {effectiveActiveTab === "licenses" && (
            <div className="flex-1 min-h-0 px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 overflow-hidden flex flex-col">
              <LicensingList
                licenses={licenses}
                loading={loading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                total={total}
                onSelectLicense={selectLicense}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={fetchNextPage}
              />
            </div>
          )}

      </div>

      <CreateLicenseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateLicense}
      />

      <LicenseDetailsModal
        isOpen={!!selectedLicense}
        onClose={() => selectLicense(null)}
        license={selectedLicense}
        logs={validationLogs}
        onStatusChange={(status) =>
          selectedLicense &&
          handleChangeStatus(selectedLicense.id, status as LicenseStatus)
        }
        onUnbindIp={(ip) =>
          selectedLicense && handleUnbindIp(selectedLicense.id, ip)
        }
        onRevoke={() => selectedLicense && revokeLicense(selectedLicense.id)}
        onRenew={() => selectedLicense && renewLicense(selectedLicense.id)}
        onConvertTrial={() =>
          selectedLicense && convertTrial(selectedLicense.id)
        }
        onReactivate={() =>
          selectedLicense && reactivateLicense(selectedLicense.id)
        }
      />
    </div>
  );
};
