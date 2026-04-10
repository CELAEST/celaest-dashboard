import React, { memo, useMemo } from "react";
import { Users, Shield, Clock, Pulse, Fingerprint } from "@phosphor-icons/react";
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
} from "recharts";
import { motion } from "motion/react";

interface StatsOverviewProps {
  users: UserData[];
  auditLogs: AuditLog[];
  isDark: boolean;
}

interface RoleData {
  name: string;
  value: number;
  color: string;
}

// Custom Bespoke Holographic SVG for Role Ratio (Replaces Recharts Pie)
const BespokeRoleRotisserie = ({ data, total, isDark }: { data: RoleData[], total: number, isDark: boolean }) => {
  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <svg viewBox="0 0 100 100" className="w-[180px] h-[180px] overflow-visible drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]">
      <defs>
        <filter id="pieGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Background HUD Matrix */}
      <motion.circle 
        cx="50" cy="50" r="48" fill="none" stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"} 
        strokeWidth="1" strokeDasharray="1 8" strokeLinecap="round"
        animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
        style={{ transformOrigin: "center" }} 
      />
      <motion.circle 
        cx="50" cy="50" r="32" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"} 
        strokeWidth="1.5" strokeDasharray="30 60"
        animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
        style={{ transformOrigin: "center" }} 
      />
      
      {/* Parametric Rotisserie Ring */}
      <motion.g animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "center" }}>
        {data.map((item, idx) => {
          if (item.value === 0) return null;
          const percentage = item.value / total;
          const strokeLength = percentage * c;
          const gap = Math.min(strokeLength * 0.5, 5); // Responsive gap that doesn't consume tiny segments completely
          const dashArray = `${Math.max(0, strokeLength - gap)} ${c}`;
          
          // Calculate cumulative offset purely
          const currentOffset = data.slice(0, idx).reduce((acc, prev) => acc + (prev.value / total) * c, 0);
          
          return (
            <motion.circle
              key={idx}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={item.color}
              strokeWidth="9"
              strokeDasharray={dashArray}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              filter="url(#pieGlow)"
              initial={{ strokeDashoffset: -c }}
              animate={{ strokeDashoffset: -currentOffset }}
              transition={{ duration: 1.5, delay: idx * 0.2, ease: "easeOut" }}
              style={{ transformOrigin: "center", rotate: -90 }}
            />
          );
        })}
      </motion.g>
    </svg>
  );
};

// Custom Bespoke Holographic SVG for Authentication Flux Empty State
const FluxEmptyStateVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[120px] h-[120px] overflow-visible drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
    <defs>
      <linearGradient id="fluxGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
      </linearGradient>
      <filter id="fluxGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
      {/* Radar grid */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="1" />
      <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(34, 211, 238, 0.05)" strokeWidth="1" />
      <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="1" strokeDasharray="2 4" />
      <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="1" strokeDasharray="2 4" />
      
      {/* Sine Wave scanning motion */}
      <motion.path 
        d="M 10 50 Q 25 20, 50 50 T 90 50" 
        fill="none" 
        stroke="url(#fluxGrad)" 
        strokeWidth="3" 
        strokeLinecap="round"
        filter="url(#fluxGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle 
        cx="50" cy="50" r="40" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="30 220" strokeLinecap="round"
        animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />
    </motion.g>
  </svg>
);

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

// ── Bespoke SVG: User Sovereignty Constellation ──────────────────────
const SovereigntyVisual = () => (
  <svg viewBox="0 0 80 80" className="w-[100px] h-[100px] overflow-visible">
    <defs>
      <filter id="sovGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <linearGradient id="sovGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {/* Outer orbit ring */}
    <motion.circle
      cx="40" cy="40" r="36" fill="none" stroke="rgba(34,211,238,0.12)" strokeWidth="1"
      strokeDasharray="4 8" animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "center" }}
    />
    {/* Inner constellation ring */}
    <motion.circle
      cx="40" cy="40" r="24" fill="none" stroke="rgba(34,211,238,0.08)" strokeWidth="1.5"
      strokeDasharray="12 20" animate={{ rotate: -360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "center" }}
    />
    {/* Network nodes */}
    {[
      { cx: 40, cy: 14 }, { cx: 62, cy: 28 }, { cx: 62, cy: 52 },
      { cx: 40, cy: 66 }, { cx: 18, cy: 52 }, { cx: 18, cy: 28 },
    ].map((node, i) => (
      <g key={i}>
        <line x1="40" y1="40" x2={node.cx} y2={node.cy} stroke="rgba(34,211,238,0.15)" strokeWidth="1" />
        <motion.circle
          cx={node.cx} cy={node.cy} r="3" fill="#22d3ee" filter="url(#sovGlow)"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
        />
      </g>
    ))}
    {/* Central core */}
    <motion.circle
      cx="40" cy="40" r="6" fill="url(#sovGrad)" filter="url(#sovGlow)"
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "center" }}
    />
    <circle cx="40" cy="40" r="2" fill="white" opacity="0.9" />
  </svg>
);

// ── Bespoke SVG: Control Hierarchy Shield Reactor ────────────────────
const HierarchyVisual = () => (
  <svg viewBox="0 0 80 80" className="w-[100px] h-[100px] overflow-visible">
    <defs>
      <filter id="hierGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <linearGradient id="hierGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    {/* Rotating guard ring */}
    <motion.circle
      cx="40" cy="40" r="35" fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth="2"
      strokeDasharray="18 12 6 12" strokeLinecap="round"
      animate={{ rotate: 360 }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "center" }}
    />
    <motion.circle
      cx="40" cy="40" r="28" fill="none" stroke="rgba(168,85,247,0.08)" strokeWidth="1"
      strokeDasharray="8 16" animate={{ rotate: -360 }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "center" }}
    />
    {/* Shield shape */}
    <motion.path
      d="M40 16 L56 26 L56 44 C56 54 48 62 40 66 C32 62 24 54 24 44 L24 26 Z"
      fill="none" stroke="url(#hierGrad)" strokeWidth="2.5" strokeLinejoin="round"
      filter="url(#hierGlow)"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "center" }}
    />
    {/* Inner shield layer */}
    <motion.path
      d="M40 24 L50 30 L50 42 C50 49 46 55 40 58 C34 55 30 49 30 42 L30 30 Z"
      fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.25)" strokeWidth="1"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Crown / Chevron authority mark */}
    <motion.path
      d="M34 38 L40 32 L46 38" fill="none" stroke="#a855f7" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" filter="url(#hierGlow)"
      animate={{ y: [-1, 1, -1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.path
      d="M36 44 L40 39 L44 44" fill="none" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      animate={{ y: [1, -1, 1] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);

// ── Bespoke SVG: Operational Registry Scanner ────────────────────────
const RegistryVisual = () => (
  <svg viewBox="0 0 80 80" className="w-[100px] h-[100px] overflow-visible">
    <defs>
      <filter id="regGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <linearGradient id="regGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {/* Clock face ring */}
    <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(52,211,153,0.1)" strokeWidth="1" />
    {/* Tick marks */}
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 40 + 28 * Math.cos(angle);
      const y1 = 40 + 28 * Math.sin(angle);
      const x2 = 40 + 32 * Math.cos(angle);
      const y2 = 40 + 32 * Math.sin(angle);
      return (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={i % 3 === 0 ? "rgba(52,211,153,0.4)" : "rgba(52,211,153,0.15)"}
          strokeWidth={i % 3 === 0 ? "2" : "1"} strokeLinecap="round"
        />
      );
    })}
    {/* Scanning sweep arm */}
    <motion.line
      x1="40" y1="40" x2="40" y2="12" stroke="url(#regGrad)" strokeWidth="2"
      strokeLinecap="round" filter="url(#regGlow)"
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "40px 40px" }}
    />
    {/* Pulse rings */}
    <motion.circle
      cx="40" cy="40" r="18" fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth="1"
      strokeDasharray="6 10" animate={{ rotate: -360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "center" }}
    />
    {/* Center dot */}
    <motion.circle
      cx="40" cy="40" r="4" fill="url(#regGrad)" filter="url(#regGlow)"
      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "center" }}
    />
    <circle cx="40" cy="40" r="1.5" fill="white" opacity="0.9" />
    {/* Telemetry label */}
    <text x="40" y="72" textAnchor="middle" fill="rgba(52,211,153,0.3)"
      fontSize="4" fontFamily="monospace" fontWeight="900">SYS.LOG.01</text>
  </svg>
);

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

    const roleData: RoleData[] = [
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
            visual={<SovereigntyVisual />}
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
            visual={<HierarchyVisual />}
          />
          <StatCard
            title="Registro Operativo"
            value={auditLogs.length.toString()}
            trend="Security Log"
            trendUp={true}
            icon={<Clock size={24} />}
            delay={0.3}
            gradient="from-emerald-400 to-teal-500"
            visual={<RegistryVisual />}
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
                  <Pulse
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
                  {hasActivity ? "Real Data" : "No Pulse"}
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
                <div className="h-full flex flex-col items-center justify-center gap-6">
                  <FluxEmptyStateVisual />
                  <p className={`text-[10px] md:text-sm font-black uppercase tracking-[0.2em] ${isDark ? "text-white/30" : "text-gray-400"}`}>
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
                <BespokeRoleRotisserie data={roleData} total={users.length} isDark={isDark} />

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
