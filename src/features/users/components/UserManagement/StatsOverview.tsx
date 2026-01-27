import React, { memo } from "react";
import { Users, Shield, User as UserIcon, Clock } from "lucide-react";
import { StatCard } from "@/features/shared/components/StatCard";
import { UserData, AuditLog } from "../types";

interface StatsOverviewProps {
  users: UserData[];
  auditLogs: AuditLog[];
  isDark: boolean;
}

export const StatsOverview = memo(
  ({ users, auditLogs, isDark }: StatsOverviewProps) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Users"
          value={users.length.toString()}
          trend="Active"
          trendUp={true}
          icon={<Users size={20} />}
          delay={0.1}
          gradient="from-cyan-400 to-blue-500"
        />
        <StatCard
          title="Administrators"
          value={users
            .filter((u) => u.role === "admin" || u.role === "super_admin")
            .length.toString()}
          trend="Secured"
          trendUp={true}
          icon={<Shield size={20} />}
          delay={0.2}
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          title="Clients"
          value={users.filter((u) => u.role === "client").length.toString()}
          trend="Registered"
          trendUp={true}
          icon={<UserIcon size={20} />}
          delay={0.3}
          gradient="from-blue-400 to-indigo-500"
        />
        <StatCard
          title="Audit Events"
          value={auditLogs.length.toString()}
          trend="Logged"
          trendUp={true}
          icon={<Clock size={20} />}
          delay={0.4}
          gradient="from-emerald-400 to-teal-500"
        />
      </div>
    );
  },
);

StatsOverview.displayName = "StatsOverview";
