import React from "react";
import { Plus } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { PageBanner } from "@/components/layout/PageLayout";
import { useTranslations } from "next-intl";

interface LicensingHeaderProps {
  onCreateClick: () => void;
  activeTab: "licenses" | "collisions" | "analytics";
  onTabChange: (tab: "licenses" | "collisions" | "analytics") => void;
  collisionsCount: number;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  isSuperAdmin?: boolean;
}

const STATUS_OPTIONS = [
  { value: "all", label: "all_statuses" },
  { value: "active", label: "status_active" },
  { value: "expired", label: "status_expired" },
  { value: "revoked", label: "status_revoked" },
  { value: "suspended", label: "status_suspended" },
];

export const LicensingHeader: React.FC<LicensingHeaderProps> = ({
  onCreateClick,
  activeTab,
  onTabChange,
  collisionsCount,
  statusFilter,
  onStatusFilterChange,
  isSuperAdmin,
}) => {
  const { isDark } = useTheme();
  const t = useTranslations("licensing");

  const tabs: { id: "licenses" | "collisions" | "analytics"; label: string }[] = [
    { id: "licenses", label: t("all_licenses_tab") },
    { id: "collisions", label: t("collisions_tab") },
    ...(isSuperAdmin ? [{ id: "analytics" as const, label: t("analytics_tab") }] : []),
  ];



  return (
    <PageBanner
      title={t("licensing_hub")}
      subtitle={t("licensing_hub_subtitle")}
      titleAside={
        <div className="flex items-center gap-2.5 w-full flex-nowrap">
          {/* Tabs */}
          <div
            className={`flex items-center p-0.5 rounded-xl grow sm:grow-0 ${
              isDark ? "bg-white/5 border border-white/10" : "bg-gray-100 border border-gray-200"
            }`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
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
            <div className="relative shrink-0 grow sm:grow-0">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className={`w-full sm:w-[145px] pl-3 pr-8 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-colors outline-none cursor-pointer appearance-none ${
                  isDark
                    ? "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    : "bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-700"
                }`}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className={isDark ? "bg-[#0c0c0c]" : "bg-white"}>
                    {t(opt.label)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      }
      actions={
        isSuperAdmin ? (
          <button
            onClick={onCreateClick}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
              isDark
                ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-md shadow-cyan-500/10 active:scale-95"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/10 active:scale-95"
            }`}
          >
            <Plus size={12} weight="bold" />
            <span className="hidden sm:inline whitespace-nowrap">{t("generate_key")}</span>
          </button>
        ) : undefined
      }
    />
  );
};
