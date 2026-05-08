import React, { memo } from "react";
import { MagnifyingGlass, Funnel } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

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
    const t = useTranslations("users");

    return (
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
              {t("all_users")}
            </CardTitle>
            <CardDescription>
              {t("manage_users_permissions")}
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <MagnifyingGlass
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <Input
                placeholder={`${t("search_users")}...`}
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
                <Funnel className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all_roles")}</SelectItem>
                <SelectItem value="super_admin">{t("role_super_admin")}</SelectItem>
                <SelectItem value="admin">{t("role_admin")}</SelectItem>
                <SelectItem value="client">{t("client")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
    );
  },
);

UserFilters.displayName = "UserFilters";
