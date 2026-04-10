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
import { TableChrome } from "@/components/layout/TableChrome";

export const LicensingHub: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
      className={`h-full w-full flex flex-col min-h-0 ${isDark ? "bg-[#0a0a0a]" : "bg-gray-50"}`}
    >
      <LicensingHeader
        onCreateClick={() => setIsCreateModalOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collisionsCount={collisions.length}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {activeTab === "analytics" && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <LicensingStats analytics={analytics} />
            </div>
          )}

          {activeTab === "collisions" && (
            <LicensingCollisions
              collisions={collisions}
              onRevoke={revokeLicense}
            />
          )}

          {activeTab === "licenses" && (
            <div className="flex-1 min-h-0 px-4 pb-4 overflow-hidden">
              <TableChrome
                toolbar={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        All Licenses
                      </span>
                    </div>
                    <span className={`text-[11px] tabular-nums ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {licenses.length > 0 ? `Showing ${licenses.length} of ${total} entries` : ""}
                    </span>
                  </div>
                }
              >
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
              </TableChrome>
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
