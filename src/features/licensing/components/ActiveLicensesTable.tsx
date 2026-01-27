"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { License } from "@/features/licensing/constants/mock-data";

interface ActiveLicensesTableProps {
  licenses: License[];
  onSelectLicense: (license: License) => void;
}

export const ActiveLicensesTable: React.FC<ActiveLicensesTableProps> = ({
  licenses,
  onSelectLicense,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        isDark ? "border-white/5" : "border-gray-100"
      }`}
    >
      <Table>
        <TableHeader className={isDark ? "bg-white/5" : "bg-gray-50"}>
          <TableRow
            className={`hover:bg-transparent ${
              isDark ? "border-white/5" : "border-gray-100"
            }`}
          >
            <TableHead className="font-semibold">Product</TableHead>
            <TableHead className="font-semibold">User ID</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">IP Usage</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {licenses.map((license) => (
            <TableRow
              key={license.id}
              className={`group cursor-pointer transition-colors ${
                isDark
                  ? "hover:bg-white/5 border-white/5"
                  : "hover:bg-gray-50 border-gray-100"
              }`}
              onClick={() => onSelectLicense(license)}
            >
              <TableCell>
                <div>
                  <div
                    className={`font-medium ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {license.productId}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {license.productType.replace("-", " ")}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-gray-500">
                {license.userId}
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex-1 h-1.5 w-24 rounded-full overflow-hidden ${
                      isDark ? "bg-white/10" : "bg-gray-100"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full ${
                        (license.ipSlotsUsed || 0) / license.maxIpSlots > 0.8
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${
                          ((license.ipSlotsUsed || 0) / license.maxIpSlots) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {license.ipSlotsUsed}/{license.maxIpSlots}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
