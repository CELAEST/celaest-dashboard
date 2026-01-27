"use client";

import React from "react";
import { Search, Filter, RefreshCw } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LicenseFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  loading: boolean;
  onRefresh: () => void;
}

export const LicenseFilters: React.FC<LicenseFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  loading,
  onRefresh,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
      <div className="relative max-w-md w-full">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        />
        <Input
          placeholder="Search by Product ID, User ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`pl-10 h-10 ${
            isDark
              ? "bg-white/5 border-white/10 focus:border-cyan-500/40"
              : "bg-gray-50 border-gray-200"
          }`}
        />
      </div>
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className={`w-40 h-10 ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Filter size={14} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          className={`h-10 w-10 ${isDark ? "border-white/10 hover:bg-white/5" : ""}`}
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
        </Button>
      </div>
    </div>
  );
};
