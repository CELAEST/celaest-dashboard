import React from "react";
import {
  Shield,
  CheckCircle,
  Clock,
  Pulse,
  Prohibit,
  Pause,
  XCircle,
  TrendUp,
  Lightning,
  Lock,
  ChartBar,
  ChartPie,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { LicenseStats } from "@/features/licensing/types";

interface LicensingStatsProps {
  analytics: LicenseStats | null;
}

const STATUS_CONFIG = [
  { key: "active",    label: "Active",    icon: CheckCircle, color: "#22c55e" },
  { key: "trial",     label: "Trial",     icon: Pulse,       color: "#a855f7" },
  { key: "expired",   label: "Expired",   icon: Clock,       color: "#f97316" },
  { key: "suspended", label: "Suspended", icon: Pause,       color: "#eab308" },
  { key: "revoked",   label: "Revoked",   icon: Prohibit,    color: "#ef4444" },
  { key: "cancelled", label: "Cancelled", icon: XCircle,     color: "#4b5563" },
] as const;

const StatusRow: React.FC<{
  label: string; value: number; total: number;
  color: string; icon: React.ElementType; index: number;
}> = ({ label, value, total, color, icon: Icon, index }) => {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 + index * 0.04 }}
      className="flex-1 flex items-center gap-3 group"
    >
      {/* Label */}
      <div className="flex items-center gap-2 w-22 shrink-0">
        <Icon size={11} style={{ color }} className="shrink-0" />
        <span className="text-[11px] font-medium text-white/40 group-hover:text-white/65 transition-colors truncate">{label}</span>
      </div>
      {/* Bar track */}
      <div className="flex-1 h-1 rounded-full bg-white/5 relative overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2 + index * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full origin-left"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            boxShadow: pct > 0 ? `0 0 6px ${color}60` : "none",
          }}
        />
      </div>
      {/* Count + pct */}
      <div className="flex items-center gap-1.5 w-13 shrink-0 justify-end">
        <span className="text-[13px] font-black tabular-nums text-white/80">{value}</span>
        <span className="text-[9px] tabular-nums text-white/20 w-7 text-right">{pct.toFixed(0)}%</span>
      </div>
    </motion.div>
  );
};

const DonutChart: React.FC<{
  data: { value: number; color: string; label: string }[];
  total: number;
}> = ({ data, total }) => {
  const radius = 48;
  const sw = 9;
  const circ = 2 * Math.PI * radius;
  const segs = data.reduce<
    { value: number; color: string; label: string; dash: number; offset: number }[]
  >((acc, s) => {
    const dash = total > 0 ? (s.value / total) * circ : 0;
    const prev = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    return [...acc, { ...s, dash, offset: prev }];
  }, []);

  return (
    <div className="relative w-32 h-32 shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={sw} />
        {segs.map((s, i) => s.value === 0 ? null : (
          <motion.circle
            key={s.label} cx="60" cy="60" r={radius} fill="none"
            stroke={s.color} strokeWidth={sw}
            strokeDasharray={`${s.dash} ${circ - s.dash}`}
            strokeDashoffset={-s.offset} strokeLinecap="butt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white tabular-nums leading-none">{total}</span>
        <span className="text-[8px] font-black uppercase tracking-[0.18em] text-white/20 mt-0.5">total</span>
      </div>
    </div>
  );
};

export const LicensingStats: React.FC<LicensingStatsProps> = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white/15 border-t-white/50 rounded-full animate-spin" />
      </div>
    );
  }

  const total = analytics.total;

  const metricCards = [
    { label: "Total Licenses",  value: analytics.total,   icon: Shield,      sub: "Registered" },
    { label: "Active",          value: analytics.active,  icon: CheckCircle, sub: "In use" },
    {
      label: "Utilization",
      value: total > 0 ? Math.round((analytics.active / total) * 100) : 0,
      suffix: "%", icon: TrendUp, sub: "Active ratio",
    },
    {
      label: "At Risk",
      value: analytics.expired + analytics.suspended,
      icon: Lightning, sub: "Need action",
      alert: analytics.expired + analytics.suspended > 0,
    },
  ];

  const insightCards = [
    {
      icon: Lock, label: "Health Score",
      value: total > 0 ? Math.round(((analytics.active + analytics.trial) / total) * 100) : 0,
      suffix: "%", sub: "Active + Trial",
    },
    {
      icon: TrendUp, label: "Trials",
      value: analytics.trial, suffix: "pending", sub: "Awaiting conversion",
    },
    {
      icon: Lightning, label: "Action Needed",
      value: analytics.expired + analytics.suspended, suffix: "keys", sub: "Expired + Suspended",
    },
  ];

  const donutData = STATUS_CONFIG.map((s) => ({
    value: analytics[s.key as keyof LicenseStats] as number,
    color: s.color, label: s.label,
  }));

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3 px-4 pt-4 pb-4">

      {/* ── Row 1: Metric Cards ── */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        {metricCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative rounded-xl border border-white/6 bg-[#0d0d0d] p-4 overflow-hidden hover:border-white/10 transition-colors duration-200"
          >
            {"alert" in card && card.alert && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-amber-500"
              />
            )}
            <div className="flex items-center gap-2 mb-3">
              <card.icon size={13} className="text-white/25 shrink-0 group-hover:text-white/45 transition-colors" />
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/22 group-hover:text-white/40 transition-colors">{card.label}</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[26px] font-black tabular-nums text-white leading-none">{card.value}</span>
              {"suffix" in card && card.suffix && (
                <span className="text-sm font-bold text-white/30 ml-0.5">{card.suffix}</span>
              )}
            </div>
            <p className="text-[9px] text-white/18 mt-1.5">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Row 2: Breakdown + Distribution ── */}
      <div className="flex-1 min-h-0 grid grid-cols-3 gap-3">

        {/* Status Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="col-span-2 rounded-xl border border-white/6 bg-[#0d0d0d] flex flex-col overflow-hidden"
        >
          {/* Panel header */}
          <div className="relative flex items-center gap-2.5 px-5 py-3.5 shrink-0">
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/4" />
            <div className="absolute bottom-0 left-5 h-px w-10 bg-white/18" />
            <ChartBar size={12} className="text-white/25 shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/28">Status Breakdown</span>
          </div>
          {/* Bars — distributed full height */}
          <div className="flex-1 min-h-0 flex flex-col px-5 py-3">
            {STATUS_CONFIG.map((s, i) => (
              <StatusRow
                key={s.key}
                label={s.label}
                value={analytics[s.key as keyof LicenseStats] as number}
                total={total}
                color={s.color}
                icon={s.icon}
                index={i}
              />
            ))}
          </div>
        </motion.div>

        {/* Distribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.16 }}
          className="rounded-xl border border-white/6 bg-[#0d0d0d] flex flex-col overflow-hidden"
        >
          {/* Panel header */}
          <div className="relative flex items-center gap-2.5 px-5 py-3.5 shrink-0">
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/4" />
            <div className="absolute bottom-0 left-5 h-px w-10 bg-white/18" />
            <ChartPie size={12} className="text-white/25 shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/28">Distribution</span>
          </div>
          {/* Content — donut izquierda + leyenda derecha */}
          <div className="flex-1 min-h-0 flex flex-row items-center gap-4 px-5 py-4">
            <div className="shrink-0 flex items-center justify-center">
              <DonutChart data={donutData} total={total} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              {STATUS_CONFIG.map((s) => {
                const val = analytics[s.key as keyof LicenseStats] as number;
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return (
                  <div key={s.key} className="flex items-center gap-2.5 group py-0.5">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="flex-1 text-[10px] text-white/35 truncate group-hover:text-white/60 transition-colors">{s.label}</span>
                    <span className="text-[13px] font-black tabular-nums text-white/75 shrink-0">{val}</span>
                    <span className="text-[9px] tabular-nums text-white/22 w-7 text-right shrink-0">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Row 3: Insight Cards ── */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        {insightCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + i * 0.04 }}
            className="group rounded-xl border border-white/6 bg-[#0d0d0d] px-5 py-4 flex items-center gap-5 hover:border-white/10 transition-colors duration-200"
          >
            <div className="shrink-0">
              <card.icon size={16} className="text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/22 mb-1.5">{card.label}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black tabular-nums text-white leading-none">{card.value}</span>
                {"suffix" in card && card.suffix && (
                  <span className="text-[10px] text-white/25">{card.suffix}</span>
                )}
              </div>
              <p className="text-[9px] text-white/18 mt-1 truncate">{card.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};