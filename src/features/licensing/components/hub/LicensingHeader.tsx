import React from "react";
import { Plus } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { PageBanner } from "@/components/layout/PageLayout";

interface LicensingHeaderProps {
  onCreateClick: () => void;
  activeTab: "licenses" | "collisions" | "analytics";
  onTabChange: (tab: "licenses" | "collisions" | "analytics") => void;
  collisionsCount: number;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Todos los estados" },
  { value: "active", label: "Activo" },
  { value: "expired", label: "Expirado" },
  { value: "revoked", label: "Revocado" },
  { value: "suspended", label: "Suspendido" },
];

export const LicensingHeader: React.FC<LicensingHeaderProps> = ({
  onCreateClick,
  activeTab,
  onTabChange,
  collisionsCount,
  statusFilter,
  onStatusFilterChange,
}) => {
  const { isDark } = useTheme();

  const tabs: { id: "licenses" | "collisions" | "analytics"; label: string }[] = [
    { id: "licenses", label: "All Licenses" },
    { id: "collisions", label: "Collisions" },
    { id: "analytics", label: "Analytics" },
  ];



  return (
    <PageBanner
      title="Licensing Hub"
      subtitle="Master Repository & Security Control"
      actions={
        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div
            className={`flex items-center p-0.5 rounded-lg ${
              isDark ? "bg-white/5 border border-white/5" : "bg-gray-100 border border-gray-200"
            }`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? isDark
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-white text-amber-600 shadow-sm"
                    : isDark
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.id === "collisions" && collisionsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[9px] font-black">
                    {collisionsCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filter */}
          {activeTab === "licenses" && (
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-colors outline-none appearance-none cursor-pointer ${
                isDark
                  ? "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                  : "bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-700"
              }`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {/* Button */}
          <button
            onClick={onCreateClick}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              isDark
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/25"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            }`}
          >
            <Plus size={11} weight="bold" />
            Generate Key
          </button>
        </div>
      }
    />
  );
};
