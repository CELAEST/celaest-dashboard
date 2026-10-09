import React, { useMemo } from "react";
import {
  Users,
  Envelope,
  Cpu,
  HardDrive,
  Monitor,
  Calendar,
  Copy,
  CreditCard,
  Check,
  Clock,
  X,
  DotsThree,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useTranslations } from "next-intl";
import type { LicenseResponse } from "@/features/licensing/types";
import { useIsMobile } from "@/components/ui/use-mobile";
import { toast } from "sonner";

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
  total,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onSelectLicense,
}) => {
  const { isDark } = useTheme();
  const { isSuperAdmin, role } = useRole();
  const isMobile = useIsMobile();
  const showAdminData =
    isSuperAdmin || role === "super_admin" || role === "admin";
  const t = useTranslations("licensing");

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

  const renderStatus = React.useCallback(
    (status: LicenseResponse["status"]) => {
      if (status === "active") {
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider border font-semibold shadow-xs ${
              isDark
                ? "bg-white/[0.08] text-white border-white/10"
                : "bg-gray-100 text-gray-900 border-gray-300"
            }`}
          >
            <Check size={10} strokeWidth={3} className={isDark ? "text-white/80" : "text-gray-800"} />
            {t("status_active")}
          </span>
        );
      }

      if (status === "revoked") {
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-red-500/10 text-red-300 border border-red-500/20 font-medium">
            <X size={10} strokeWidth={3} className="text-red-400" />
            {t("status_revoked")}
          </span>
        );
      }

      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider border font-medium ${
            isDark
              ? "bg-white/[0.04] text-white/60 border-white/[0.06]"
              : "bg-gray-100 text-gray-600 border-gray-200"
          }`}
        >
          <Clock size={10} className={isDark ? "text-white/40" : "text-gray-400"} />
          {status === "expired"
            ? t("status_expired")
            : status === "suspended"
              ? t("status_suspended")
              : status}
        </span>
      );
    },
    [isDark, t],
  );

  const columns: ColumnDef<LicenseResponse>[] = useMemo(
    () => [
      {
        id: "producto",
        header: showAdminData ? t("plan_key") : t("product_plan"),
        cell: ({ row }) => {
          const license = row.original;
          return (
            <div className="flex items-center gap-2.5 py-1">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  isDark
                    ? "bg-white/[0.04] border-white/8 text-white/60"
                    : "bg-gray-100 border-gray-200 text-gray-600"
                }`}
              >
                <Monitor size={14} />
              </div>
              <div className="flex flex-col min-w-0 max-w-[200px]">
                <span
                  className={`text-xs font-medium truncate block ${
                    isDark ? "text-zinc-200" : "text-gray-900"
                  }`}
                >
                  {license.plan?.name || (license.metadata?.product_name as string) || "—"}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded border ${
                      isDark
                        ? "bg-white/[0.04] border-white/8 text-white/50"
                        : "bg-gray-100 border-gray-200 text-gray-600"
                    }`}
                  >
                    {license.plan?.code || "STD"}
                  </span>
                  <span
                    className={`text-[10px] font-mono truncate ${
                      isDark ? "text-white/40" : "text-gray-400"
                    }`}
                  >
                    {!showAdminData
                      ? license.notes?.split(":")[1]?.trim() || t("standard_license")
                      : maskLicenseKey(license.license_key)}
                  </span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "licencia",
        header: showAdminData ? t("owner") : t("license"),
        cell: ({ row }) => {
          const license = row.original;
          return showAdminData ? (
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 border ${
                  isDark
                    ? "bg-white/[0.05] border-white/8 text-white/70"
                    : "bg-gray-100 border-gray-200 text-gray-700"
                }`}
              >
                {license.user_name?.[0]?.toUpperCase() || <Users size={12} />}
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className={`text-xs font-medium truncate ${
                    isDark ? "text-zinc-200" : "text-gray-800"
                  }`}
                >
                  {license.user_name || "N/A"}
                </span>
                <span
                  className={`text-[10px] font-mono truncate ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}
                >
                  ID: {license.organization_id.substring(0, 8)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <span
                className={`text-xs font-medium ${
                  isDark ? "text-zinc-200" : "text-gray-800"
                }`}
              >
                {t("license")}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[10px] font-mono ${
                    isDark ? "text-white/50" : "text-gray-500"
                  }`}
                >
                  {maskLicenseKey(license.license_key)}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(license.license_key);
                    toast.success(t("copied_to_clipboard") || "Clave copiada al portapapeles");
                  }}
                  className={`transition-colors cursor-pointer ${
                    isDark ? "text-white/40 hover:text-white" : "text-gray-400 hover:text-gray-900"
                  }`}
                  title="Copiar Clave"
                >
                  <Copy size={11} />
                </button>
              </div>
            </div>
          );
        },
      },
      {
        id: "consumo",
        header: t("consumption_usage"),
        cell: ({ row }) => {
          const license = row.original;
          const maxAi = (license.plan?.limits?.max_ai_requests_per_month as number) || 1000;
          const aiPercent = Math.min(100, Math.round((license.ai_requests_used / maxAi) * 100));
          const maxUsers = (license.plan?.limits?.max_users as number) || 5;
          const storageGb = (license.storage_used_bytes / (1024 * 1024 * 1024)).toFixed(1);

          return (
            <div className="flex flex-col gap-1.5 max-w-[170px]">
              {/* Barra de progreso AI */}
              <div
                className={`flex items-center justify-between text-[10px] font-mono ${
                  isDark ? "text-white/50" : "text-gray-500"
                }`}
              >
                <span
                  className={`flex items-center gap-1 ${
                    isDark ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  <Cpu size={11} /> AI
                </span>
                <span className="tabular-nums">
                  {license.ai_requests_used} / {maxAi}
                </span>
              </div>
              <div
                className={`w-full h-1 rounded-full overflow-hidden ${
                  isDark ? "bg-white/[0.06]" : "bg-gray-200"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all ${
                    isDark ? "bg-white/50" : "bg-gray-700"
                  }`}
                  style={{ width: `${aiPercent}%` }}
                />
              </div>

              {/* Dispositivos y Storage */}
              <div
                className={`flex items-center justify-between text-[10px] font-mono ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                <span className="flex items-center gap-1">
                  <Monitor size={11} /> {license.active_activations}/{maxUsers} devs
                </span>
                <span className="flex items-center gap-1">
                  <HardDrive size={11} /> {storageGb} GB
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: "contacto",
        header: showAdminData ? t("contact") : t("billing"),
        cell: ({ row }) => {
          const license = row.original;
          return showAdminData ? (
            <div className="flex flex-col">
              <div
                className={`flex items-center gap-1.5 text-xs font-mono truncate max-w-[140px] ${
                  isDark ? "text-white/70" : "text-gray-700"
                }`}
              >
                <Envelope size={11} className={isDark ? "text-white/40" : "text-gray-400"} />
                <span className="truncate">{license.user_email || "n/a"}</span>
              </div>
              <span
                className={`text-[9px] font-mono uppercase tracking-wider mt-1 ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                {t("verified_account")}
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono w-fit border ${
                  isDark
                    ? "bg-white/[0.03] border-white/[0.06] text-white/70"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <CreditCard size={12} className={isDark ? "text-white/40" : "text-gray-400"} />
                <span className="capitalize">
                  {license.billing_cycle === "lifetime"
                    ? t("lifetime_access")
                    : license.billing_cycle}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono mt-1 ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                {license.billing_cycle === "lifetime"
                  ? t("subscription")
                  : `Renueva: ${formatDate(license.next_billing_date)}`}
              </span>
            </div>
          );
        },
      },
      {
        id: "estado",
        header: t("status"),
        cell: ({ row }) => renderStatus(row.original.status),
      },
      {
        id: "vigencia",
        header: t("validity"),
        cell: ({ row }) => {
          const license = row.original;
          return (
            <div className="flex flex-col">
              <div
                className={`flex items-center gap-1.5 text-xs font-mono ${
                  isDark ? "text-white/70" : "text-gray-800"
                }`}
              >
                <Calendar size={11} className={isDark ? "text-white/40" : "text-gray-400"} />
                <span>
                  {license.billing_cycle === "lifetime"
                    ? t("unlimited")
                    : formatDate(license.expires_at)}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono mt-0.5 ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                {license.billing_cycle === "lifetime"
                  ? t("no_expiration")
                  : t("expiration")}
              </span>
            </div>
          );
        },
      },
      {
        id: "acciones",
        header: () => <div className="text-right">{t("actions")}</div>,
        cell: () => {
          return (
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? "text-white/40 hover:text-white hover:bg-white/5"
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <DotsThree size={16} weight="bold" />
              </button>
            </div>
          );
        },
      },
    ],
    [isDark, showAdminData, t, renderStatus],
  );

  if (isMobile && !loading) {
    return (
      <div className="flex flex-col gap-3 p-2 w-full">
        {licenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 space-y-3 py-16 px-4">
            <div
              className={`p-4 rounded-2xl border ${
                isDark ? "bg-white/[0.03] border-white/6" : "bg-gray-50 border-gray-200"
              }`}
            >
              <Monitor className="w-8 h-8 text-white/40" weight="light" />
            </div>
            <div className="space-y-1 text-center">
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("no_active_records")}
              </p>
              <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {t("no_licenses_assigned")}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {licenses.map((license) => {
              const productName =
                license.plan?.name ||
                (license.metadata?.product_name as string) ||
                "—";
              const productCode = license.plan?.code || "STD";
              const maxAi =
                (license.plan?.limits?.max_ai_requests_per_month as number) ||
                1000;
              const aiPercent = Math.min(
                100,
                Math.round((license.ai_requests_used / maxAi) * 100)
              );
              const maxUsers =
                (license.plan?.limits?.max_users as number) || 5;
              const storageGb = (
                license.storage_used_bytes /
                (1024 * 1024 * 1024)
              ).toFixed(1);

              return (
                <div
                  key={license.id}
                  onClick={() => onSelectLicense(license)}
                  className={`
                    relative rounded-2xl border p-4 transition-all active:scale-[0.99] cursor-pointer
                    ${
                      isDark
                        ? "bg-[#09090b] border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                        : "bg-white border-gray-200/80 shadow-sm"
                    }
                    flex flex-col gap-3.5 w-full
                  `}
                >
                  {/* Header: Plan & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                          isDark
                            ? "bg-white/[0.04] border-white/8 text-white/60"
                            : "bg-gray-100 border-gray-200 text-gray-600"
                        }`}
                      >
                        <Monitor size={15} />
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-xs font-semibold tracking-tight ${
                            isDark ? "text-zinc-100" : "text-gray-900"
                          }`}
                        >
                          {productName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[9px] font-mono px-1 py-0.2 rounded border uppercase ${
                              isDark
                                ? "bg-white/[0.04] border-white/8 text-white/50"
                                : "bg-gray-100 border-gray-200 text-gray-600"
                            }`}
                          >
                            {productCode}
                          </span>
                          {!showAdminData && (
                            <span
                              className={`text-[9px] font-mono ${
                                isDark ? "text-white/40" : "text-gray-400"
                              }`}
                            >
                              v1.0.4
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">{renderStatus(license.status)}</div>
                  </div>

                  {/* License Key Section */}
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider ${
                        isDark ? "text-white/40" : "text-gray-400"
                      }`}
                    >
                      {showAdminData ? t("owner") : t("license")}
                    </span>
                    {showAdminData ? (
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 border ${
                            isDark
                              ? "bg-white/[0.05] border-white/8 text-white/70"
                              : "bg-gray-100 border-gray-200 text-gray-700"
                          }`}
                        >
                          {license.user_name?.[0]?.toUpperCase() || (
                            <Users size={11} />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-xs font-medium truncate ${
                              isDark ? "text-zinc-200" : "text-gray-800"
                            }`}
                          >
                            {license.user_name || "N/A"}
                          </span>
                          <span
                            className={`text-[10px] font-mono truncate ${
                              isDark ? "text-white/40" : "text-gray-400"
                            }`}
                          >
                            ID: {license.organization_id.substring(0, 8)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border ${
                          isDark
                            ? "border-white/8 bg-white/[0.02]"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <span
                          className={`text-xs font-mono tracking-wider ${
                            isDark ? "text-white/60" : "text-gray-600"
                          }`}
                        >
                          {maskLicenseKey(license.license_key)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(license.license_key);
                            toast.success(
                              t("copied_to_clipboard") ||
                                "Copiado al portapapeles"
                            );
                          }}
                          className={`transition-colors p-1 ${
                            isDark
                              ? "text-white/40 hover:text-white"
                              : "text-gray-400 hover:text-gray-900"
                          }`}
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Usage / Metrics Section */}
                  <div
                    className={`flex flex-col gap-3 py-3 border-t border-b ${
                      isDark ? "border-white/6" : "border-gray-100"
                    }`}
                  >
                    {/* AI progress */}
                    <div className="flex flex-col gap-1.5">
                      <div
                        className={`flex justify-between items-center text-[10px] font-mono ${
                          isDark ? "text-white/50" : "text-gray-500"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Cpu size={11} className={isDark ? "text-white/60" : "text-gray-600"} />
                          <span>AI Qty</span>
                        </div>
                        <span className="tabular-nums">
                          {license.ai_requests_used} / {maxAi}
                        </span>
                      </div>
                      <div
                        className={`h-1 w-full rounded-full overflow-hidden ${
                          isDark ? "bg-white/[0.06]" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`h-full rounded-full transition-all ${
                            isDark ? "bg-white/50" : "bg-gray-700"
                          }`}
                          style={{ width: `${aiPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Devices & Storage side-by-side */}
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                          isDark
                            ? "bg-white/[0.02] border-white/6 text-white/70"
                            : "bg-gray-50 border-gray-100 text-gray-700"
                        }`}
                      >
                        <Monitor size={12} className={isDark ? "text-white/40" : "text-gray-400"} />
                        <div className="flex flex-col">
                          <span
                            className={`text-[8px] font-mono uppercase tracking-wider ${
                              isDark ? "text-white/40" : "text-gray-400"
                            }`}
                          >
                            Dispositivos
                          </span>
                          <span className="text-[10px] font-mono tabular-nums">
                            {license.active_activations} / {maxUsers}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                          isDark
                            ? "bg-white/[0.02] border-white/6 text-white/70"
                            : "bg-gray-50 border-gray-100 text-gray-700"
                        }`}
                      >
                        <HardDrive size={12} className={isDark ? "text-white/40" : "text-gray-400"} />
                        <div className="flex flex-col">
                          <span
                            className={`text-[8px] font-mono uppercase tracking-wider ${
                              isDark ? "text-white/40" : "text-gray-400"
                            }`}
                          >
                            Storage
                          </span>
                          <span className="text-[10px] font-mono tabular-nums">
                            {storageGb} GB
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expiration & Next billing */}
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={11} className={isDark ? "text-white/40" : "text-gray-400"} />
                      <span className={isDark ? "text-white/60" : "text-gray-600"}>
                        {license.billing_cycle === "lifetime"
                          ? t("unlimited")
                          : formatDate(license.expires_at)}
                      </span>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${
                        isDark
                          ? "bg-white/[0.03] border-white/6 text-white/60"
                          : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    >
                      <CreditCard size={10} className={isDark ? "text-white/40" : "text-gray-400"} />
                      <span className="capitalize">
                        {license.billing_cycle === "lifetime"
                          ? t("lifetime_access")
                          : license.billing_cycle}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        {(hasNextPage || isFetchingNextPage) && (
          <div className="flex items-center justify-center gap-2.5 py-4 w-full">
            {isFetchingNextPage ? (
              <div
                className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                  isDark ? "border-white/50" : "border-gray-500"
                }`}
              />
            ) : (
              <button
                type="button"
                onClick={onLoadMore}
                className={`text-xs font-mono uppercase tracking-wider ${
                  isDark
                    ? "text-white/60 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Cargar más
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <DataTable
        columns={columns}
        data={licenses}
        isLoading={loading}
        emptyMessage={t("no_active_records")}
        emptySubmessage={t("no_licenses_assigned")}
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
