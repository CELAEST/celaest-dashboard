import React, { useMemo } from "react";
import {
  Users,
  DotsThreeVertical,
  Envelope,
  Cpu,
  HardDrive,
  Monitor,
  Calendar,
  Copy,
  CreditCard,
  FileText,
  Lifebuoy,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
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
  total: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onSelectLicense: (license: LicenseResponse) => void;
}

export const LicensingList: React.FC<LicensingListProps> = ({
  licenses,
  loading,
  // removed unused searchQuery, setSearchQuery, setStatusFilter
  total,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onSelectLicense,
}) => {
  const { isDark } = useTheme();
  const { isSuperAdmin, role } = useRole();
  const showAdminData =
    isSuperAdmin || role === "super_admin" || role === "admin";



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
                  {license.plan?.name || (license.metadata?.product_name as string) || "—"}
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
                <Envelope size={12} />
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
                    <Lifebuoy size={16} />
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
                <DotsThreeVertical size={18} />
              </button>
            </div>
          );
        },
      },
    ],
    [isDark, showAdminData],
  );

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={licenses}
        isLoading={loading}
        emptyMessage="Sin registros activos"
        emptySubmessage="You don't have any licenses assigned yet."
        onRowClick={onSelectLicense}
        totalItems={total}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
        hideFooter
      />
    </div>
  );
};
