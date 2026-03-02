import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Users,
  MoreVertical,
  ChevronDown,
  Check,
  Mail,
  Cpu,
  HardDrive,
  Monitor,
  Calendar,
  Copy,
  CreditCard,
  FileText,
  LifeBuoy,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import { LicenseResponse } from "@/features/licensing/types";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

interface LicensingListProps {
  licenses: LicenseResponse[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  page: number;
  setPage: (page: number) => void;
  total: number;
  onSelectLicense: (license: LicenseResponse) => void;
}

export const LicensingList: React.FC<LicensingListProps> = ({
  licenses,
  loading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  page,
  setPage,
  total,
  onSelectLicense,
}) => {
  const { isDark } = useTheme();
  const { isSuperAdmin, role } = useRole();
  const showAdminData =
    isSuperAdmin || role === "super_admin" || role === "admin";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    { value: "all", label: "Todos los Estados" },
    { value: "active", label: "Activo" },
    { value: "expired", label: "Expirado" },
    { value: "revoked", label: "Revocado" },
    { value: "suspended", label: "Suspendido" },
  ];

  const currentStatusLabel =
    statusOptions.find((opt) => opt.value === statusFilter)?.label || "Estado";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "---";
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return "---";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskLicenseKey = (key?: string) => {
    if (!key) return "••••-••••-••••";
    const parts = key.split("-");
    if (parts.length < 2) return "••••" + key.slice(-4);
    const lastPart = parts[parts.length - 1];
    return `${parts[0]}-••••-••••-${lastPart}`;
  };

  const columns: ColumnDef<LicenseResponse>[] = useMemo(
    () => [
      {
        id: "producto",
        header: showAdminData ? "Plan & Key" : "Producto & Plan",
        cell: ({ row }) => {
          const license = row.original;
          return (
            <div className="flex items-center gap-4 py-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center p-2.5 transition-transform group-hover:scale-110 ${
                  isDark
                    ? "bg-white/5 border border-white/10"
                    : "bg-blue-50 border border-blue-100"
                }`}
              >
                <Monitor
                  className={isDark ? "text-cyan-400" : "text-blue-600"}
                  size={18}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-sm font-black tracking-tight ${isDark ? "text-white group-hover:text-cyan-400" : "text-gray-900"} transition-colors`}
                >
                  {license.plan?.name || "Sin Nombre"}
                </span>
                {!showAdminData ? (
                  <span className="text-[8px] font-black text-cyan-500/60 uppercase tracking-tighter mt-0.5">
                    {license.notes?.split(":")[1]?.trim() ||
                      "LICENCIA ESTÁNDAR"}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-cyan-500/80 dark:text-cyan-400/60 mt-0.5">
                    {maskLicenseKey(license.license_key)}
                  </span>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[8px] font-black bg-gray-500/10 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-widest leading-none">
                    {license.plan?.code || "STD"}
                  </span>
                  {!showAdminData && (
                    <span
                      className={`text-[8px] font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      v1.0.4
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "licencia",
        header: showAdminData ? "Propietario" : "Licencia",
        cell: ({ row }) => {
          const license = row.original;
          return showAdminData ? (
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDark
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {license.user_name?.[0]?.toUpperCase() || <Users size={14} />}
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className={`text-xs font-bold truncate ${isDark ? "text-gray-200" : "text-gray-700"}`}
                >
                  {license.user_name || "N/A"}
                </span>
                <span className="text-[9px] font-mono text-gray-500 truncate">
                  ID: {license.organization_id.substring(0, 8)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 w-fit">
                <span className="text-[10px] font-mono text-gray-500">
                  {maskLicenseKey(license.license_key)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(license.license_key);
                  }}
                  className="text-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  <Copy size={12} />
                </button>
              </div>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest pl-1">
                CLAVE DE ACTIVACIÓN
              </span>
            </div>
          );
        },
      },
      {
        id: "consumo",
        header: "Consumo & Uso",
        cell: ({ row }) => {
          const license = row.original;
          return (
            <div className="flex flex-col gap-3 max-w-[180px]">
              {/* AI Usage */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-gray-500">
                  <div className="flex items-center gap-1 text-cyan-500">
                    <Cpu size={10} /> AI Qty
                  </div>
                  <span>
                    {license.ai_requests_used} /{" "}
                    {(license.plan?.limits
                      ?.max_ai_requests_per_month as number) || 1000}
                  </span>
                </div>
                <div
                  className={`h-1 w-full rounded-full ${isDark ? "bg-white/5" : "bg-gray-100"} overflow-hidden`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (license.ai_requests_used / ((license.plan?.limits?.max_ai_requests_per_month as number) || 1000)) * 100)}%`,
                    }}
                    className="h-full bg-linear-to-r from-cyan-500 to-blue-500"
                  />
                </div>
              </div>

              {/* Devices & Storage */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <Monitor size={12} className="text-purple-400" />
                  <span className="text-[10px] font-black text-gray-400">
                    {license.active_activations} /{" "}
                    {(license.plan?.limits?.max_users as number) || 5}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HardDrive size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-black text-gray-400">
                    {(
                      license.storage_used_bytes /
                      (1024 * 1024 * 1024)
                    ).toFixed(1)}{" "}
                    GB
                  </span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "contacto",
        header: showAdminData ? "Contacto" : "Facturación",
        cell: ({ row }) => {
          const license = row.original;
          return showAdminData ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium">
                <Mail size={12} />
                <span className="truncate max-w-[130px]">
                  {license.user_email || "n/a"}
                </span>
              </div>
              <span className="text-[9px] text-gray-500/60 font-black tracking-tighter uppercase mt-1">
                A Cuenta Verificada
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase">
                <CreditCard
                  size={12}
                  className={
                    license.billing_cycle === "lifetime"
                      ? "text-amber-500/80"
                      : "text-emerald-500/60"
                  }
                />
                <span className={isDark ? "text-gray-200" : "text-gray-800"}>
                  {license.billing_cycle === "lifetime"
                    ? "Acceso Vitalicio"
                    : license.billing_cycle}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">
                  {license.billing_cycle === "lifetime"
                    ? "Suscripción"
                    : "Próx. Recargo"}
                </span>
                <span
                  className={`text-[9px] font-bold ${license.billing_cycle === "lifetime" ? "text-amber-400/60" : "text-gray-400"} font-mono`}
                >
                  {license.billing_cycle === "lifetime"
                    ? "PERMANENTE"
                    : formatDate(license.next_billing_date)}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: "estado",
        header: "Estado",
        cell: ({ row }) => {
          const license = row.original;
          return (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                license.status === "active"
                  ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
                  : "bg-rose-500/5 text-rose-500 border-rose-500/10"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${license.status === "active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500"}`}
              />
              {license.status}
            </div>
          );
        },
      },
      {
        id: "vigencia",
        header: "Vigencia",
        cell: ({ row }) => {
          const license = row.original;
          return (
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase">
                <Calendar
                  size={12}
                  className={
                    license.billing_cycle === "lifetime"
                      ? "text-cyan-400/80"
                      : "text-cyan-500/60"
                  }
                />
                <span className={isDark ? "text-gray-200" : "text-gray-800"}>
                  {license.billing_cycle === "lifetime"
                    ? "Ilimitada"
                    : formatDate(license.expires_at)}
                </span>
              </div>
              <span
                className={`text-[8px] font-black ${license.billing_cycle === "lifetime" ? "text-cyan-500/40" : "text-gray-500/60"} uppercase tracking-tight mt-1 ml-5`}
              >
                {license.billing_cycle === "lifetime"
                  ? "Sin Expiración"
                  : "Vencimiento"}
              </span>
            </div>
          );
        },
      },
      {
        id: "acciones",
        header: () => <div className="text-right">Actions</div>,
        cell: () => {
          return (
            <div className="flex items-center justify-end gap-1">
              {!showAdminData && (
                <>
                  <button className="p-2 rounded-lg hover:bg-cyan-500/10 text-gray-500 hover:text-cyan-500 transition-all group/icon">
                    <FileText size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-emerald-500/10 text-gray-500 hover:text-emerald-500 transition-all group/icon">
                    <LifeBuoy size={16} />
                  </button>
                </>
              )}
              <button
                className={`p-2 rounded-lg transition-all ${
                  isDark
                    ? "hover:bg-white/10 text-gray-500 hover:text-white"
                    : "hover:bg-gray-100 text-gray-400 hover:text-gray-900"
                }`}
              >
                <MoreVertical size={18} />
              </button>
            </div>
          );
        },
      },
    ],
    [isDark, showAdminData],
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-6">
      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 shrink-0 px-1">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                isDark
                  ? "text-gray-500 group-focus-within:text-cyan-400"
                  : "text-gray-400 group-focus-within:text-blue-600"
              }`}
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por licencia, producto o cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none font-medium text-sm ${
                isDark
                  ? "bg-white/5 border-white/5 text-white focus:border-cyan-500/30 focus:bg-white/10"
                  : "bg-white border-gray-100 text-gray-900 focus:border-blue-500/30 shadow-sm"
              }`}
            />
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`h-full min-w-[180px] px-6 py-3 rounded-2xl border flex items-center justify-between gap-3 transition-all duration-300 font-bold uppercase tracking-widest text-[10px] ${
              isDark
                ? "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                : "bg-white border-gray-100 text-gray-500 hover:text-gray-900 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              <Filter
                size={14}
                className={isDark ? "text-cyan-400" : "text-blue-600"}
              />
              {currentStatusLabel}
            </div>
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl z-50 backdrop-blur-xl overflow-hidden ${
                  isDark
                    ? "bg-[#0f0f0f] border-white/10"
                    : "bg-white border-blue-50"
                }`}
              >
                <div className="p-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                        statusFilter === option.value
                          ? isDark
                            ? "bg-cyan-500/10 text-cyan-400"
                            : "bg-blue-50 text-blue-600"
                          : isDark
                            ? "text-gray-400 hover:bg-white/5 hover:text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-tight">
                        {option.label}
                      </span>
                      {statusFilter === option.value && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        className={`flex-1 rounded-3xl border overflow-hidden transition-all duration-500 flex flex-col ${
          isDark
            ? "bg-black/40 border-white/5"
            : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
        }`}
      >
        <div className="flex-1 overflow-hidden">
          <DataTable
            columns={columns}
            data={licenses}
            isLoading={loading}
            emptyMessage="Sin registros activos"
            emptySubmessage="You don't have any licenses assigned yet."
            onRowClick={onSelectLicense}
          />
        </div>

        {/* Pagination Footer */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-t ${isDark ? "border-white/5 bg-white/5" : "border-gray-50 bg-gray-50/30"}`}
        >
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <span>Resultados:</span>
            <span className={isDark ? "text-cyan-400" : "text-blue-600"}>
              {(page - 1) * 20 + 1} - {Math.min(page * 20, total)}
            </span>
            <span>de</span>
            <span className={isDark ? "text-white" : "text-gray-900"}>
              {total}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                page === 1 || loading
                  ? "opacity-30 cursor-not-allowed text-gray-400"
                  : isDark
                    ? "bg-white/5 hover:bg-white/10 text-white"
                    : "bg-white hover:bg-gray-50 text-gray-900 shadow-sm"
              }`}
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * 20 >= total || loading}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                page * 20 >= total || loading
                  ? "opacity-30 cursor-not-allowed text-gray-400"
                  : isDark
                    ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
