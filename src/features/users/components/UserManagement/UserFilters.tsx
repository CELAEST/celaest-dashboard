import React, { memo } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
}

export const UserFilters = memo(
  ({
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
  }: UserFiltersProps) => {
    const { isDark } = useTheme();

    return (
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
              All Users
            </CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 w-64 ${
                  isDark ? "bg-white/5 border-white/10" : "bg-gray-50"
                }`}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger
                className={`w-40 ${
                  isDark ? "bg-white/5 border-white/10" : "bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
    );
  },
);

UserFilters.displayName = "UserFilters";
