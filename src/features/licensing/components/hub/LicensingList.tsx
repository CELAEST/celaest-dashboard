"use client";

import React from "react";
import { Search, Filter, Users, MoreVertical } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { License } from "@/features/licensing/constants/mock-data";

interface LicensingListProps {
  licenses: License[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onSelectLicense: (license: License) => void;
}

export const LicensingList: React.FC<LicensingListProps> = ({
  licenses,
  loading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onSelectLicense,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search licenses, products, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
              isDark
                ? "bg-white/5 border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          />
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-full px-4 rounded-xl border flex items-center gap-2 ${
              isDark
                ? "bg-white/5 border-white/10 text-gray-300"
                : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            <Filter size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className={`rounded-2xl border overflow-hidden ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
        }`}
      >
        <table className="w-full text-left">
          <thead
            className={`border-b ${
              isDark
                ? "bg-white/5 border-white/10 text-gray-300"
                : "bg-gray-50 border-gray-200 text-gray-600"
            }`}
          >
            <tr>
              <th className="px-6 py-4 font-medium text-sm">Product</th>
              <th className="px-6 py-4 font-medium text-sm">User</th>
              <th className="px-6 py-4 font-medium text-sm">Status</th>
              <th className="px-6 py-4 font-medium text-sm">IP Usage</th>
              <th className="px-6 py-4 font-medium text-sm">Created</th>
              <th className="px-6 py-4 font-medium text-sm text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/5">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Loading licenses...
                </td>
              </tr>
            ) : licenses.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No licenses found matching your criteria.
                </td>
              </tr>
            ) : (
              licenses.map((license) => (
                <tr
                  key={license.id}
                  onClick={() => onSelectLicense(license)}
                  className={`group cursor-pointer transition-colors ${
                    isDark ? "hover:bg-white/5" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {license.productId}
                    </div>
                    <div className="text-xs text-gray-500">
                      {license.productType}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[150px] truncate">
                    <div
                      className={`flex items-center gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <Users size={14} className="text-gray-500" />
                      {license.userId}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                        license.status === "active"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : license.status === "expired"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {license.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex-1 h-1.5 w-16 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden`}
                      >
                        <div
                          className={`h-full rounded-full ${
                            (license.ipSlotsUsed || 0) / license.maxIpSlots >
                            0.8
                              ? "bg-red-500"
                              : "bg-cyan-500"
                          }`}
                          style={{
                            width: `${
                              ((license.ipSlotsUsed || 0) /
                                license.maxIpSlots) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {license.ipSlotsUsed}/{license.maxIpSlots}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(license.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                        isDark
                          ? "hover:bg-white/10 text-gray-400 hover:text-white"
                          : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
