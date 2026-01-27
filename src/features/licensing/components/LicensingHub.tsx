import React, { useState } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { CreateLicenseModal } from "./modals/CreateLicenseModal";
import { LicenseDetailsModal } from "./modals/LicenseDetailsModal";
import { useLicensing } from "@/features/licensing/hooks/useLicensing";
import { LicenseFormData } from "@/features/licensing/hooks/useCreateLicense";

// Sub-components
import { LicensingHeader } from "./hub/LicensingHeader";
import { LicensingStats } from "./hub/LicensingStats";
import { LicensingList } from "./hub/LicensingList";
import { LicensingCollisions } from "./hub/LicensingCollisions";

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
    activeTab,
    setActiveTab,
    selectedLicense,
    validationLogs,
    handleChangeStatus,
    handleUnbindIp,
    selectLicense,
    addNewLicense,
  } = useLicensing();

  // Handle License Creation (Bridge between UI and Hook)
  const handleCreateLicense = async (data: LicenseFormData) => {
    return new Promise<string>((resolve) => {
      // Logic for adding the new license to the list is handled here or in the hook.
      const newLicenseId = `lic_${Date.now()}`;
      const newKey = `sk_live_${Math.random().toString(36).substring(7)}`;

      const newLicense = {
        id: newLicenseId,
        userId: data.userId,
        productId: data.productId || `prod_${Date.now()}`,
        productType: data.productType,
        status: "active" as const,
        maxIpSlots: data.maxIpSlots,
        ipSlotsUsed: 0,
        metadata: { tier: data.tier },
        createdAt: new Date().toISOString(),
      };

      addNewLicense(newLicense);
      resolve(newKey);
    });
  };

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-[#0a0a0a]" : "bg-gray-50"} pb-20`}
    >
      <LicensingHeader onCreateClick={() => setIsCreateModalOpen(true)} />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Navigation Tabs (Simplified for now, can be extracted too) */}
        <div className="flex items-center gap-6 border-b border-gray-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab("licenses")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "licenses"
                ? isDark
                  ? "text-cyan-400 border-cyan-400"
                  : "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-400"
            }`}
          >
            All Licenses
          </button>
          <button
            onClick={() => setActiveTab("collisions")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "collisions"
                ? isDark
                  ? "text-red-400 border-red-400"
                  : "text-red-600 border-red-600"
                : "text-gray-500 border-transparent hover:text-gray-400"
            }`}
          >
            Collisions
            {collisions.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] bg-red-500/10 text-red-500 rounded-full font-bold">
                {collisions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "analytics"
                ? isDark
                  ? "text-purple-400 border-purple-400"
                  : "text-purple-600 border-purple-600"
                : "text-gray-500 border-transparent hover:text-gray-400"
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "analytics" && <LicensingStats analytics={analytics} />}

        {activeTab === "collisions" && (
          <LicensingCollisions collisions={collisions} />
        )}

        {activeTab === "licenses" && (
          <LicensingList
            licenses={licenses}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onSelectLicense={selectLicense}
          />
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
        onStatusChange={handleChangeStatus}
        onUnbindIp={handleUnbindIp}
      />
    </div>
  );
};
