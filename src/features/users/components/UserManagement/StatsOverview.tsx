import React, { memo, useMemo } from "react";
import { Users, Shield, Clock, Activity, Fingerprint } from "lucide-react";
import { StatCard } from "@/features/shared/components/StatCard";
import { UserData, AuditLog } from "../types";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "motion/react";

interface StatsOverviewProps {
  users: UserData[];
  auditLogs: AuditLog[];
  isDark: boolean;
}

/** Derive hourly activity data from audit logs */
function buildActivityData(logs: AuditLog[]): { time: string; events: number }[] {
  const hours: Record<string, number> = {};
  // Initialize 24h buckets
  for (let h = 0; h < 24; h += 4) {
    const label = `${String(h).padStart(2, "0")}:00`;
    hours[label] = 0;
  }

  for (const log of logs) {
    if (!log.timestamp) continue;
    const date = new Date(log.timestamp);
    if (isNaN(date.getTime())) continue;
    // Round down to nearest 4-hour bucket
    const bucket = Math.floor(date.getHours() / 4) * 4;
    const label = `${String(bucket).padStart(2, "0")}:00`;
    hours[label] = (hours[label] || 0) + 1;
  }

  return Object.entries(hours)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, events]) => ({ time, events }));
}

export const StatsOverview = memo(
  ({ users, auditLogs, isDark }: StatsOverviewProps) => {
    const activityData = useMemo(() => buildActivityData(auditLogs), [auditLogs]);
    const hasActivity = activityData.some((d) => d.events > 0);

    // Calculate Role Distribution
    const roleCounts = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const roleData = [
      {
        name: "Super Admins",
        value: roleCounts.super_admin || 0,
        color: "#a855f7",
      },
      { name: "Admins", value: roleCounts.admin || 0, color: "#22d3ee" },
      { name: "Clients", value: roleCounts.client || 0, color: "#3b82f6" },
    ].filter((d) => d.value > 0);

    return (
      <div className="h-full flex flex-col gap-6">
        {/* Row 1: KPI Grid */}
        <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Soberanía de Usuarios"
            value={users.length.toString()}
            trend="Active Core"
            trendUp={true}
            icon={<Users size={24} />}
            delay={0.1}
            gradient="from-cyan-400 to-blue-500"
          />
          <StatCard
            title="Jerarquía de Control"
            value={users
              .filter((u) => u.role === "admin" || u.role === "super_admin")
              .length.toString()}
            trend="High Auth"
            trendUp={true}
            icon={<Shield size={24} />}
            delay={0.2}
            gradient="from-purple-500 to-pink-500"
          />
          <StatCard
            title="Registro Operativo"
            value={auditLogs.length.toString()}
            trend="Security Log"
            trendUp={true}
            icon={<Clock size={24} />}
            delay={0.3}
            gradient="from-emerald-400 to-teal-500"
          />
        </div>

        {/* Row 2: Deep Analytics Overview */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart: Authentication Flux */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`col-span-2 rounded-4xl border p-8 flex flex-col ${isDark ? "bg-[#0a0a0a]/60 border-white/5 backdrop-blur-3xl shadow-2xl" : "bg-white border-gray-200 shadow-sm"}`}
          >
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl ${isDark ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-cyan-50 text-cyan-600"}`}
                >
                  <Activity
                    size={20}
                    className={isDark ? "text-cyan-400" : "text-cyan-600"}
                  />
                </div>
                <div>
                  <h3
                    className={`text-[10px] font-black uppercase tracking-[0.4em] mb-1 ${isDark ? "text-white/40" : "text-gray-400"}`}
                  >
                    Vigilancia de Identidad
                  </h3>
                  <h2
                    className={`text-2xl font-black italic tracking-tighter uppercase ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Authentication Flux
                  </h2>
                </div>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDark ? "bg-black/40 border-white/10" : "bg-gray-100 border-gray-200"}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${hasActivity ? "bg-cyan-500 animate-pulse" : "bg-gray-500"}`} />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  {hasActivity ? "Real Data" : "No Activity"}
                </span>
              </div>
            </div>

            <div className="flex-1 w-full min-h-0">
              {hasActivity ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={activityData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorAuth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      stroke={isDark ? "#333" : "#ccc"}
                      fontSize={10}
                      fontWeight="900"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#000" : "#fff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        fontSize: "10px",
                        fontWeight: "900",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="events"
                      name="Events"
                      stroke="#22d3ee"
                      fill="url(#colorAuth)"
                      strokeWidth={4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-white/20" : "text-gray-300"}`}>
                    Sin actividad registrada
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`col-span-1 rounded-4xl border p-8 flex flex-col ${isDark ? "bg-[#0a0a0a]/60 border-white/5 backdrop-blur-3xl shadow-2xl" : "bg-white border-gray-200 shadow-sm"}`}
          >
            <div className="flex items-center gap-4 mb-8 shrink-0">
              <div
                className={`p-3 rounded-2xl ${isDark ? "bg-purple-500/10 border border-purple-500/20" : "bg-purple-50 text-purple-600"}`}
              >
                <Fingerprint
                  size={20}
                  className={isDark ? "text-purple-400" : "text-purple-600"}
                />
              </div>
              <div>
                <h3
                  className={`text-[10px] font-black uppercase tracking-[0.4em] mb-1 ${isDark ? "text-white/40" : "text-gray-400"}`}
                >
                  Gobernanza
                </h3>
                <h2
                  className={`text-2xl font-black italic tracking-tighter uppercase ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Role Ratio
                </h2>
              </div>
            </div>

            <div className="flex-1 w-full min-h-0 flex items-center justify-center gap-6 overflow-hidden">
              <div className="w-1/2 h-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      innerRadius="65%"
                      outerRadius="90%"
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span
                    className={`text-3xl font-black italic tracking-tighter ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {users.length}
                  </span>
                  <span
                    className={`text-[8px] font-black uppercase tracking-[0.3em] opacity-30 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Users
                  </span>
                </div>
              </div>

              <div className="w-1/2 flex flex-col justify-center gap-4 py-2">
                {roleData.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-white/60" : "text-gray-600"}`}
                        >
                          {item.name.split(" ")[0]}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-black italic tracking-tighter ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {((item.value / users.length) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div
                      className={`h-1 w-full rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(item.value / users.length) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  },
);

StatsOverview.displayName = "StatsOverview";
