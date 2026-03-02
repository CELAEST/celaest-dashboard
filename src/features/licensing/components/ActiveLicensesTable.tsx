"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import type { LicenseResponse } from "@/features/licensing/types";

interface ActiveLicensesTableProps {
  licenses: LicenseResponse[];
  onSelectLicense: (license: LicenseResponse) => void;
}

export const ActiveLicensesTable: React.FC<ActiveLicensesTableProps> = ({
  licenses,
  onSelectLicense,
}) => {
  const { theme } = useTheme();
  const { isSuperAdmin } = useRole();
  const isDark = theme === "dark";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  const allColumns: ColumnDef<LicenseResponse>[] = useMemo(
    () => [
      {
        id: "producto",
        header: "Producto",
        cell: ({ row }) => {
          const license = row.original;
          return (
            <div>
              <div
                className={`font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {license.plan?.name || license.license_key.substring(0, 16)}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {license.billing_cycle.replace("_", " ")}
              </div>
            </div>
          );
        },
      },
      {
        id: "usuario",
        header: "Usuario",
        cell: ({ row }) => {
          const license = row.original;
          return (
            <div className={isDark ? "text-white/80" : "text-gray-700"}>
              {license.user_name || "N/A"}
            </div>
          );
        },
      },
      {
        id: "email",
        header: "Email",
        cell: ({ row }) => {
          const license = row.original;
          return (
            <div className="text-xs text-blue-400">
              {license.user_email || "N/A"}
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
            <div className="text-xs flex flex-col gap-0.5">
              <span className="text-gray-500 whitespace-nowrap">
                D: {formatDate(license.starts_at)}
              </span>
              <span className={isDark ? "text-white/60" : "text-gray-400"}>
                H: {formatDate(license.expires_at)}
              </span>
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
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                license.status === "active"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : license.status === "expired"
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  license.status === "active"
                    ? "bg-green-500"
                    : license.status === "expired"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
              {license.status}
            </span>
          );
        },
      },
      {
        id: "usoIp",
        header: "Uso IP",
        cell: ({ row }) => {
          const license = row.original;
          return (
            <div className="flex items-center gap-2">
              <div
                className={`flex-1 h-1.5 w-24 rounded-full overflow-hidden ${
                  isDark ? "bg-white/10" : "bg-gray-100"
                }`}
              >
                <div
                  className={`h-full rounded-full ${
                    (license.ip_bindings?.length || 0) > 4
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      (license.ip_bindings?.length || 0) * 20,
                      100,
                    )}%`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {license.ip_bindings?.length || 0}
              </span>
            </div>
          );
        },
      },
      {
        id: "acciones",
        header: () => <div className="text-right">Acciones</div>,
        cell: ({ row }) => {
          const license = row.original;
          return (
            <div className="text-right">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLicense(license);
                }}
              >
                Ver
              </Button>
            </div>
          );
        },
      },
    ],
    [isDark, onSelectLicense],
  );

  const columns = useMemo(() => {
    return allColumns.filter((col) => {
      if (col.id === "usuario" || col.id === "email") {
        return isSuperAdmin;
      }
      return true;
    });
  }, [allColumns, isSuperAdmin]);

  return (
    <div
      className={`overflow-hidden ${isDark ? "border-white/5" : "border-gray-100"}`}
    >
      <DataTable
        columns={columns}
        data={licenses}
        isLoading={false}
        emptyMessage="No active licenses found"
        emptySubmessage="You don't have any licenses assigned yet."
        onRowClick={onSelectLicense}
      />
    </div>
  );
};
