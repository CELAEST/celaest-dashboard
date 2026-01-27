import React, { memo } from "react";
import { Users, Shield, User as UserIcon, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserData, AuditLog } from "../types";

interface StatsOverviewProps {
  users: UserData[];
  auditLogs: AuditLog[];
  isDark: boolean;
}

export const StatsOverview = memo(
  ({ users, auditLogs, isDark }: StatsOverviewProps) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card
          className={`${
            isDark
              ? "bg-[#0a0a0a]/60 border-white/10"
              : "bg-white border-gray-200"
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Users
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {users.length}
                </p>
              </div>
              <Users
                className={`w-8 h-8 ${
                  isDark ? "text-cyan-400" : "text-blue-600"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${
            isDark
              ? "bg-[#0a0a0a]/60 border-white/10"
              : "bg-white border-gray-200"
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Admins
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {
                    users.filter(
                      (u) => u.role === "admin" || u.role === "super_admin",
                    ).length
                  }
                </p>
              </div>
              <Shield
                className={`w-8 h-8 ${
                  isDark ? "text-purple-400" : "text-purple-600"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${
            isDark
              ? "bg-[#0a0a0a]/60 border-white/10"
              : "bg-white border-gray-200"
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Clients
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {users.filter((u) => u.role === "client").length}
                </p>
              </div>
              <UserIcon
                className={`w-8 h-8 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${
            isDark
              ? "bg-[#0a0a0a]/60 border-white/10"
              : "bg-white border-gray-200"
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Audit Events
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {auditLogs.length}
                </p>
              </div>
              <Clock
                className={`w-8 h-8 ${
                  isDark ? "text-green-400" : "text-green-600"
                }`}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);

StatsOverview.displayName = "StatsOverview";
