import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  Users,
  MoreVertical,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { LicenseResponse } from "@/features/licensing/types";

interface LicensingListProps {
  licenses: LicenseResponse[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onSelectLicense: (license: LicenseResponse) => void;
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
  const { isDark } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "revoked", label: "Revoked" },
  ];

  const currentStatusLabel =
    statusOptions.find((opt) => opt.value === statusFilter)?.label || "Status";

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

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-6">
      {/* Search & Filters Bar (Fixed at top) */}
      <div className="flex flex-col md:flex-row gap-6 shrink-0">
        <div className="relative flex-1 group">
          <div
            className={`absolute inset-0 bg-linear-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500`}
          />
          <div className="relative">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                isDark
                  ? "text-gray-500 group-focus-within:text-cyan-400"
                  : "text-gray-400 group-focus-within:text-blue-600"
              }`}
              size={20}
            />
            <input
              type="text"
              placeholder="Search by license ID, product or user email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-300 outline-none font-medium ${
                isDark
                  ? "bg-black/40 border-white/5 text-white focus:border-cyan-500/50 focus:bg-black/60"
                  : "bg-white border-gray-100 text-gray-900 focus:border-blue-500/50 shadow-sm"
              }`}
            />
          </div>
        </div>

        {/* Custom Dropdown Filter */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`h-full min-w-[180px] px-6 py-4 rounded-2xl border flex items-center justify-between gap-3 transition-all duration-300 font-bold uppercase tracking-widest text-[10px] ${
              isDark
                ? "bg-black/40 border-white/5 text-gray-400 hover:text-white hover:border-white/10"
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
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`absolute right-0 mt-3 w-64 rounded-2xl border shadow-2xl z-50 backdrop-blur-xl overflow-hidden ${
                  isDark
                    ? "bg-[#0a0a0a]/95 border-white/5 shadow-black/60"
                    : "bg-white/95 border-blue-100 shadow-blue-900/10"
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
                      <span className="text-sm font-semibold">
                        {option.label}
                      </span>
                      {statusFilter === option.value && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        className={`flex-1 min-h-0 rounded-3xl border overflow-auto custom-scrollbar pb-4 transition-all duration-500 ${
          isDark
            ? "bg-black/40 border-white/5 shadow-2xl"
            : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
        }`}
      >
        <div className="min-w-full">
          <table className="w-full text-left border-collapse">
            <thead
              className={`border-b transition-colors duration-300 ${
                isDark
                  ? "bg-white/5 border-white/5 text-gray-400"
                  : "bg-gray-50/50 border-gray-100 text-gray-500"
              }`}
            >
              <tr>
                <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest">
                  Product Details
                </th>
                <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest">
                  Assigned User
                </th>
                <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest">
                  IP Utilization
                </th>
                <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest">
                  Issuance Date
                </th>
                <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className={`w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin`}
                      />
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                        Synchronizing records...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : licenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <Search size={40} className="mb-2" />
                      <span className="text-sm font-bold uppercase tracking-widest">
                        No matching assets found
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                licenses.map((license, index) => (
                  <motion.tr
                    key={license.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => onSelectLicense(license)}
                    className={`group cursor-pointer transition-all duration-300 ${
                      isDark ? "hover:bg-white/5" : "hover:bg-blue-50/30"
                    }`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div
                          className={`font-black tracking-tight text-sm ${
                            isDark
                              ? "text-white group-hover:text-cyan-400"
                              : "text-gray-900 group-hover:text-blue-600"
                          } transition-colors duration-300`}
                        >
                          {license.plan?.name ||
                            license.license_key.substring(0, 16)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-sm ${
                              isDark
                                ? "bg-white/5 text-gray-500"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {license.billing_cycle}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div
                        className={`flex items-center gap-3 transition-colors duration-300 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full border border-current/10 flex items-center justify-center bg-current/5`}
                        >
                          <Users size={14} className="opacity-60" />
                        </div>
                        <span className="text-sm font-medium truncate max-w-[120px]">
                          {license.organization_id.substring(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${
                          license.status === "active"
                            ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500/10"
                            : license.status === "expired"
                              ? "bg-amber-500/5 text-amber-500 border-amber-500/20 group-hover:bg-amber-500/10"
                              : "bg-rose-500/5 text-rose-500 border-rose-500/20 group-hover:bg-rose-500/10"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                            license.status === "active"
                              ? "bg-emerald-500"
                              : license.status === "expired"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                        />
                        {license.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                            {license.ip_bindings?.length || 0}/∞ SLOTS
                          </span>
                          <span className="text-[10px] font-black text-gray-500">
                            {license.ip_bindings?.length || 0} active
                          </span>
                        </div>
                        <div
                          className={`h-1.5 w-full rounded-full overflow-hidden transition-all duration-300 ${
                            isDark ? "bg-white/5" : "bg-gray-100"
                          }`}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min((license.ip_bindings?.length || 0) * 20, 100)}%`,
                            }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className={`h-full rounded-full ${
                              (license.ip_bindings?.length || 0) > 4
                                ? "bg-linear-to-r from-rose-500 to-rose-400"
                                : "bg-linear-to-r from-cyan-500 to-blue-500"
                            }`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {new Date(license.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                          Authorized Record
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        className={`p-3 rounded-xl transition-all duration-300 group/btn ${
                          isDark
                            ? "hover:bg-white/10 text-gray-500 hover:text-white"
                            : "hover:bg-gray-100 text-gray-400 hover:text-gray-900"
                        }`}
                      >
                        <MoreVertical
                          size={18}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
