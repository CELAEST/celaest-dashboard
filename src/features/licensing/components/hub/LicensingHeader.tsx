import React from "react";
import { Plus, Key, MagnifyingGlass } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface LicensingHeaderProps {
  onCreateClick: () => void;
  activeTab: "licenses" | "collisions" | "analytics";
  onTabChange: (tab: "licenses" | "collisions" | "analytics") => void;
  collisionsCount: number;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  isSuperAdmin?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
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
  searchQuery,
  onSearchChange,
}) => {
  const { isDark } = useTheme();
  const t = useTranslations("licensing");

  const tabs: { id: "licenses" | "collisions" | "analytics"; label: string }[] = [
    { id: "licenses", label: t("all_licenses_tab") },
    { id: "collisions", label: t("collisions_tab") },
    ...(isSuperAdmin ? [{ id: "analytics" as const, label: t("analytics_tab") }] : []),
  ];

  return (
    <header
      className={`shrink-0 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b backdrop-blur-xl transition-colors duration-200 ${
        isDark ? "bg-[#09090b]/80 border-white/6" : "bg-white/80 border-gray-200/80"
      }`}
    >
      {/* Título & Subtítulo en una sola línea compacta */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
            isDark
              ? "bg-white/[0.04] border-white/8 text-white/70"
              : "bg-gray-100 border-gray-200 text-gray-700"
          }`}
        >
          <Key size={15} />
        </div>
        <div className="flex items-center gap-3">
          <h1
            className={`text-sm sm:text-base font-semibold tracking-tight ${
              isDark ? "text-zinc-100" : "text-gray-900"
            }`}
          >
            {t("licensing_hub")}
          </h1>
          <span
            className={`text-[10px] sm:text-[11px] font-mono tracking-wider uppercase border-l pl-3 ${
              isDark ? "border-white/10 text-white/40" : "border-gray-200 text-gray-400"
            }`}
          >
            {t("licensing_hub_subtitle")}
          </span>
        </div>
      </div>

      {/* Controles de Tab, Filtros & Acciones */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Búsqueda integrada cuando la pestaña es Licencias */}
        {activeTab === "licenses" && onSearchChange && (
          <div className="relative w-36 sm:w-48">
            <MagnifyingGlass
              size={12}
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? "text-white/30" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full pl-7 pr-2.5 py-1 rounded-lg text-[11px] font-mono border outline-none transition-colors ${
                isDark
                  ? "bg-white/[0.04] border-white/8 text-white placeholder-white/30 focus:border-white/20"
                  : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400"
              }`}
            />
          </div>
        )}

        {/* Segmented Control */}
        <div
          className={`flex items-center p-0.5 rounded-lg border ${
            isDark ? "bg-white/5 border-white/6" : "bg-gray-100 border-gray-200"
          }`}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs"
                      : "bg-white text-gray-900 shadow-xs"
                    : isDark
                      ? "text-white/40 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === "collisions" && collisionsCount > 0 && (
                  <span
                    className={`px-1 py-0.2 rounded text-[9px] font-mono ${
                      isDark ? "bg-red-500/20 text-red-300" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {collisionsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filtro de Estado */}
        {activeTab === "licenses" && (
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider border outline-none cursor-pointer transition-colors ${
                isDark
                  ? "bg-white/[0.04] border-white/8 text-white/70 hover:text-white"
                  : "bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-900"
              }`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className={isDark ? "bg-[#09090b] text-white" : "bg-white text-gray-900"}
                >
                  {t(opt.label)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Botón Nueva Licencia (SuperAdmin) */}
        {isSuperAdmin && (
          <button
            type="button"
            onClick={onCreateClick}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold tracking-tight transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isDark
                ? "bg-white text-zinc-950 hover:bg-zinc-200"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            <Plus size={13} weight="bold" />
            <span>{t("generate_key")}</span>
          </button>
        )}
      </div>
    </header>
  );
};
