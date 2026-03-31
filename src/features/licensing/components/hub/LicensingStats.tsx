import React, { useState } from "react";
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

/* ═══════════════════════════════════════════════════════════════
   HEXAGONAL RADAR CONSTELLATION (CLEAN & SUBTLE)
   A bespoke spider-web visualization with 6 vertices (one per
   status). Animated connecting mesh, glowing data nodes sized
   by value, rotating scanner beam, and HUD data readouts.
   ═══════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════
   HEXAGONAL RADAR CONSTELLATION (CLEAN & SUBTLE)
   A bespoke spider-web visualization with 6 vertices (one per
   status). Animated connecting mesh, glowing data nodes sized
   by value, rotating scanner beam, and HUD data readouts.
   ═══════════════════════════════════════════════════════════════ */
const RadarConstellation: React.FC<{
  analytics: LicenseStats;
  total: number;
}> = ({ analytics, total }) => {
  const cx = 110, cy = 110, baseR = 85;

  const statuses = STATUS_CONFIG.map((s) => ({
    ...s,
    value: analytics[s.key as keyof LicenseStats] as number,
    pct: total > 0 ? (analytics[s.key as keyof LicenseStats] as number) / total : 0,
  }));

  // Each status at 60° apart
  const getXY = (i: number, r: number) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // Data vertices: soften the distribution curve so large discrepancies (e.g., 22 vs 1)
  // don't completely squash the polygon. Also set a minimum radius of 24 so it clears the text.
  const getRadius = (pct: number) => {
    if (pct === 0) return 24; 
    return 24 + (baseR - 24) * Math.pow(pct, 0.6); 
  };
  
  const dataPts = statuses.map((s, i) => getXY(i, getRadius(s.pct)));
  const dataPath = dataPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 220 220" className="w-full h-full max-h-full">
      <defs>
        <filter id="radarNodeGlow"><feGaussianBlur stdDeviation="2" /></filter>
      </defs>

      {/* Background: ONLY 2 subtle concentric hexagonal rings (50% and 100%) */}
      {[0.5, 1].map((scale, i) => {
        const ringPts = Array.from({ length: 6 }).map((_, j) => getXY(j, baseR * scale));
        const ringPath = ringPts.map((p, j) => `${j === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return (
          <path key={`ring-${i}`} d={ringPath} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" strokeDasharray={i === 1 ? "none" : "1 4"} />
        );
      })}

      {/* Radial axis lines (ultra subtle, starting outside the center) */}
      {statuses.map((_, i) => {
        const p1 = getXY(i, 20); // Start outside the total number
        const p2 = getXY(i, baseR);
        return <line key={`axis-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />;
      })}

      {/* Data mesh — filled polygon - soft natural fade */}
      <motion.path
        d={dataPath}
        fill="rgba(255,255,255,0.015)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Data nodes — ONLY render nodes that have > 0 value to prevent the clustered mess */}
      {statuses.map((s, i) => {
        if (s.value === 0) return null; // Drop empty nodes entirely
        
        const dp = dataPts[i];
        const nodeR = Math.max(s.pct * 6, 2.5); // Smaller, balanced nodes
        return (
          <g key={`node-${s.key}`}>
            {/* Soft Glow */}
            <motion.circle
              cx={dp.x} cy={dp.y} r={nodeR + 2.5} fill={s.color} opacity="0.1"
              filter="url(#radarNodeGlow)"
              animate={{ opacity: [0.05, 0.15, 0.05], r: [nodeR + 2.5, nodeR + 4, nodeR + 2.5] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
            />
            {/* Core */}
            <motion.circle
              cx={dp.x} cy={dp.y} r={nodeR} fill={s.color} opacity="0.9"
              initial={{ r: 0 }} animate={{ r: nodeR }}
              transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 45, damping: 10 }}
            />
          </g>
        );
      })}

      {/* Label readouts at outer vertices */}
      {statuses.map((s, i) => {
        const op = getXY(i, baseR + 20);
        const anchor = i === 0 || i === 3 ? "middle" : i < 3 ? "start" : "end";
        return (
          <g key={`label-${s.key}`}>
            <text
              x={op.x} y={op.y - 5} textAnchor={anchor}
              fontFamily="monospace" fontSize="7" fill={s.value > 0 ? s.color : "white"} opacity={s.value > 0 ? 0.9 : 0.15} fontWeight="600"
            >
              {s.value}
            </text>
            <text
              x={op.x} y={op.y + 4} textAnchor={anchor}
              fontFamily="monospace" fontSize="4.5" fill="white" opacity="0.25"
            >
              {s.label.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* Center total - Clean text, no background circle */}
      <text x={cx} y={cy + 1} textAnchor="middle" fontFamily="monospace" fontSize="16" fill="white" fontWeight="300" opacity="0.8">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontFamily="sans-serif" fontSize="4" fill="white" opacity="0.2" letterSpacing="1">TOTAL</text>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════
   LINEAR STATUS VISUALIZER (BALANCED ALTERNATIVE)
   Replaces the 6-grid gauge with a single elegant continuous
   horizontal energy bar, minimizing UI noise and adding balance.
   ═══════════════════════════════════════════════════════════════ */
const LinearStatusVisualizer: React.FC<{ analytics: LicenseStats; total: number }> = ({ analytics, total }) => {
  const statuses = STATUS_CONFIG.map((s) => ({
    ...s,
    value: analytics[s.key as keyof LicenseStats] as number,
    pct: total > 0 ? (analytics[s.key as keyof LicenseStats] as number) / total : 0,
  }));

  // Calculate cumulative percentages for stacked layout
  const activeStatuses = statuses.filter(s => s.value > 0);
  const segments = activeStatuses.map((s, index) => {
    const width = s.pct * 100;
    const offset = activeStatuses.slice(0, index).reduce((acc, curr) => acc + (curr.pct * 100), 0);
    return { ...s, offset, width };
  });

  return (
    <div className="w-full h-full flex flex-col justify-center px-4">
      {/* ── Main Stacked Bar ── */}
      <div className="mb-10 w-full px-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Global Capacity Allocation</span>
          <span className="text-[10px] font-mono text-white/40"><span className="text-white/80">{total}</span> <span className="text-[8px] text-white/20">UNITS</span></span>
        </div>
        <div className="relative w-full h-2.5 bg-[#050505] rounded-sm overflow-hidden flex border border-white/5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
          {segments.map((s, i) => (
            <motion.div
              key={s.key}
              className="h-full relative overflow-hidden"
              initial={{ width: "0%" }}
              animate={{ width: `${s.width}%` }}
              transition={{ delay: 0.1 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ backgroundColor: s.color }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-white/25" />
              <div className="absolute inset-y-0 right-0 w-px bg-black/60" />
              {/* Soft glow at edge */}
              <div className="absolute inset-y-0 right-0 w-8 bg-linear-to-r from-transparent to-white/10" />
            </motion.div>
          ))}
          {/* Overlay scanning effect */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.05) 4px, rgba(255,255,255,0.05) 5px)' }} />
        </div>
      </div>

      {/* ── Minimalist Legend Grid (3x2) ── */}
      <div className="grid grid-cols-3 gap-y-7 gap-x-8 px-2">
        {statuses.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div 
              key={s.key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`flex flex-col gap-1.5 ${s.value === 0 ? 'opacity-30' : 'opacity-100'}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-[4px] flex items-center justify-center border" style={{ backgroundColor: `${s.color}08`, borderColor: `${s.color}20` }}>
                  <Icon size={10} style={{ color: s.color }} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">{s.label}</span>
                <span className="text-[10px] font-mono text-white/90 font-medium ml-auto">{s.value}</span>
              </div>
              <div className="w-full h-px bg-white/5 relative overflow-hidden mt-0.5">
                {s.value > 0 && (
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0" 
                    style={{ backgroundColor: s.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BESPOKE HOLOGRAPHIC SVGs — TOP ROW CARDS
   ═══════════════════════════════════════════════════════════════ */

/* ── Total Licenses: Holographic Hexagonal Shield Grid ── */
const HoloTotalLicenses = ({ hovered }: { hovered: boolean; value?: number }) => (
  <svg viewBox="0 0 90 90" className="w-[85px] h-[85px]">
    <defs>
      <filter id="licShieldGlow"><feGaussianBlur stdDeviation="2" /></filter>
    </defs>
    <motion.g
      animate={{ scale: hovered ? 1.08 : 1, y: hovered ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Outer boundary */}
      <circle cx="45" cy="45" r="40" fill="none" stroke="#fbbf24" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.3" />

      {/* Rotation ring CW */}
      <motion.circle
        cx="45" cy="45" r="36" fill="none" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="5 15"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "45px 45px" }}
      />

      {/* Shield hexagon — outer */}
      <polygon points="45,8 75,23 75,53 45,68 15,53 15,23" fill="none" stroke="#d97706" strokeWidth="0.6" opacity="0.4" />

      {/* Shield hexagon — mid */}
      <polygon points="45,16 67,27 67,49 45,60 23,49 23,27" fill="rgba(251,191,36,0.04)" stroke="#fbbf24" strokeWidth="0.8" />

      {/* Shield hexagon — inner core */}
      <motion.polygon
        points="45,26 58,33 58,45 45,52 32,45 32,33"
        fill="rgba(251,191,36,0.1)" stroke="#fcd34d" strokeWidth="1.2"
        animate={{
          filter: hovered
            ? "drop-shadow(0 0 6px rgba(251,191,36,0.6))"
            : "drop-shadow(0 0 2px rgba(251,191,36,0.2))",
        }}
      />

      {/* Radial connectors mid→outer */}
      {["45,16 45,8", "67,27 75,23", "67,49 75,53", "45,60 45,68", "23,49 15,53", "23,27 15,23"].map((pts, i) => {
        const [p1, p2] = pts.split(" ");
        const [x1, y1] = p1.split(",");
        const [x2, y2] = p2.split(",");
        return (
          <line key={`rad-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d97706" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
        );
      })}

      {/* Corner nodes — pulsating */}
      {[[45,8],[75,23],[75,53],[45,68],[15,53],[15,23]].map(([x, y], i) => (
        <motion.circle
          key={`node-${i}`} cx={x} cy={y} r="2" fill="#fbbf24"
          animate={{ r: [1.5, 2.5, 1.5], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* Center pulse */}
      <motion.circle
        cx="45" cy="39" r="4" fill="#fcd34d" opacity="0.6"
        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        filter="url(#licShieldGlow)"
      />

      {/* Telemetry */}
      <text x="64" y="10" fontFamily="monospace" fontSize="3.5" fill="#fbbf24" opacity="0.4">LIC.REG</text>
    </motion.g>
  </svg>
);

/* ── Active: Holographic Checkmark Reactor ── */
const HoloActive = ({ hovered }: { hovered: boolean; value?: number }) => (
  <svg viewBox="0 0 90 90" className="w-[85px] h-[85px]">
    <defs>
      <filter id="activeGlow"><feGaussianBlur stdDeviation="2" /></filter>
      <radialGradient id="activeCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#15803d" stopOpacity="0.05" />
      </radialGradient>
    </defs>
    <motion.g
      animate={{ scale: hovered ? 1.08 : 1, y: hovered ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Outer boundary */}
      <circle cx="45" cy="45" r="40" fill="none" stroke="#166534" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.3" />

      {/* Scanner ring */}
      <motion.circle
        cx="45" cy="45" r="36" fill="none" stroke="#22c55e" strokeWidth="0.7"
        strokeDasharray="8 80"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "45px 45px" }}
        filter="url(#activeGlow)"
      />

      {/* Orbital ring CCW */}
      <motion.circle
        cx="45" cy="45" r="30" fill="none" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="4 12"
        animate={{ rotate: -360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "45px 45px" }}
      />

      {/* Core circle */}
      <circle cx="45" cy="45" r="18" fill="url(#activeCore)" />

      {/* Checkmark — animated stroke */}
      <motion.polyline
        points="35,45 42,53 57,36"
        fill="none" stroke="#86efac" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        filter="url(#activeGlow)"
      />

      {/* Crosshairs */}
      <line x1="45" y1="6" x2="45" y2="84" stroke="#15803d" strokeWidth="0.3" strokeDasharray="2 4" />
      <line x1="6" y1="45" x2="84" y2="45" stroke="#15803d" strokeWidth="0.3" strokeDasharray="2 4" />

      {/* Tick marks */}
      {[0, 90, 180, 270].map((a, i) => (
        <line key={`t-${i}`} x1="45" y1="6" x2="45" y2="10" stroke="#4ade80" strokeWidth="1" transform={`rotate(${a} 45 45)`} opacity="0.5" />
      ))}

      {/* Center pulse */}
      <motion.circle
        cx="45" cy="45" r="5" fill="#4ade80" opacity="0.3"
        animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
        filter="url(#activeGlow)"
      />

      <text x="63" y="10" fontFamily="monospace" fontSize="3.5" fill="#22c55e" opacity="0.4">ACT.01</text>
    </motion.g>
  </svg>
);

/* ── Utilization: Holographic Gauge Arc ── */
const HoloUtilization = ({ hovered, value = 0 }: { hovered: boolean; value?: number }) => {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const fillLength = (value / 100) * circ * 0.75; // 270-degree gauge
  return (
    <svg viewBox="0 0 90 90" className="w-[85px] h-[85px]">
      <defs>
        <filter id="utilGlow"><feGaussianBlur stdDeviation="2.5" /></filter>
        <linearGradient id="utilGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <motion.g
        animate={{ scale: hovered ? 1.08 : 1, y: hovered ? -2 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Boundary */}
        <circle cx="45" cy="45" r="40" fill="none" stroke="#0e7490" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.3" />

        {/* Slow orbit */}
        <motion.circle
          cx="45" cy="45" r="37" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="3 12"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "45px 45px" }}
        />

        {/* Gauge track (270 degrees) */}
        <circle
          cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeLinecap="round"
          transform="rotate(135 45 45)"
        />

        {/* Gauge fill */}
        <motion.circle
          cx="45" cy="45" r={r} fill="none" stroke="url(#utilGrad)" strokeWidth="4"
          strokeDasharray={`${fillLength} ${circ - fillLength}`}
          strokeLinecap="round"
          transform="rotate(135 45 45)"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${fillLength} ${circ - fillLength}` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          filter="url(#utilGlow)"
        />

        {/* Crosshairs */}
        <line x1="45" y1="8" x2="45" y2="82" stroke="#0891b2" strokeWidth="0.25" strokeDasharray="2 4" />
        <line x1="8" y1="45" x2="82" y2="45" stroke="#0891b2" strokeWidth="0.25" strokeDasharray="2 4" />

        {/* Tick marks around gauge */}
        {[135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5, 0, 22.5, 45].map((a, i) => (
          <line key={`ut-${i}`} x1="45" y1="10" x2="45" y2="13" stroke="#67e8f9" strokeWidth="0.8" transform={`rotate(${a} 45 45)`} opacity="0.4" />
        ))}

        {/* Center value */}
        <text x="45" y="48" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#cffafe" fontWeight="bold" opacity="0.8">{value}</text>
        <text x="45" y="54" textAnchor="middle" fontFamily="monospace" fontSize="4" fill="#67e8f9" opacity="0.4">RATIO</text>

        <text x="63" y="10" fontFamily="monospace" fontSize="3.5" fill="#22d3ee" opacity="0.35">UTL.%</text>
      </motion.g>
    </svg>
  );
};

/* ── At Risk: Warning Prism with Pulse ── */
const HoloAtRisk = ({ hovered }: { hovered: boolean; value?: number }) => (
  <svg viewBox="0 0 90 90" className="w-[85px] h-[85px]">
    <defs>
      <filter id="riskGlow"><feGaussianBlur stdDeviation="2" /></filter>
    </defs>
    <motion.g
      animate={{ scale: hovered ? 1.08 : 1, y: hovered ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Outer ring */}
      <circle cx="45" cy="45" r="40" fill="none" stroke="#7f1d1d" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.3" />

      {/* Warning scanner ring */}
      <motion.circle
        cx="45" cy="45" r="36" fill="none" stroke="#ef4444" strokeWidth="0.7"
        strokeDasharray="6 85"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "45px 45px" }}
        filter="url(#riskGlow)"
      />

      {/* Slow orbit CCW */}
      <motion.circle
        cx="45" cy="45" r="30" fill="none" stroke="#f87171" strokeWidth="0.5" strokeDasharray="4 10"
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "45px 45px" }}
      />

      {/* Warning triangle — outer */}
      <polygon points="45,12 72,62 18,62" fill="none" stroke="#dc2626" strokeWidth="0.6" opacity="0.4" />

      {/* Warning triangle — inner with fill */}
      <polygon points="45,20 65,58 25,58" fill="rgba(239,68,68,0.06)" stroke="#ef4444" strokeWidth="0.9" />

      {/* Exclamation mark bolt */}
      <motion.g
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <line x1="45" y1="30" x2="45" y2="46" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="45" cy="52" r="1.5" fill="#fca5a5" />
      </motion.g>

      {/* Crosshairs */}
      <line x1="45" y1="6" x2="45" y2="84" stroke="#991b1b" strokeWidth="0.25" strokeDasharray="2 4" />
      <line x1="6" y1="45" x2="84" y2="45" stroke="#991b1b" strokeWidth="0.25" strokeDasharray="2 4" />

      {/* Pulsating danger ring */}
      <motion.circle
        cx="45" cy="44" r="12" fill="none" stroke="#ef4444" strokeWidth="0.8"
        animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "45px 44px" }}
      />

      <text x="63" y="10" fontFamily="monospace" fontSize="3.5" fill="#ef4444" opacity="0.35">RSK.⚠</text>
    </motion.g>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   BESPOKE HOLOGRAPHIC SVGs — BOTTOM ROW INSIGHTS
   ═══════════════════════════════════════════════════════════════ */

/* ── Health Score: Holographic Heartbeat Ring ── */
const HoloHealth = ({ hovered }: { hovered: boolean }) => (
  <svg viewBox="0 0 70 70" className="w-[65px] h-[65px]">
    <defs>
      <filter id="healthGlow"><feGaussianBlur stdDeviation="1.5" /></filter>
    </defs>
    <motion.g
      animate={{ scale: hovered ? 1.06 : 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <circle cx="35" cy="35" r="30" fill="none" stroke="#065f46" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.3" />

      <motion.circle
        cx="35" cy="35" r="26" fill="none" stroke="#22c55e" strokeWidth="0.6" strokeDasharray="4 14"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "35px 35px" }}
      />

      {/* Heartbeat path */}
      <motion.path
        d="M 12 35 L 20 35 L 24 28 L 28 42 L 32 30 L 35 35 L 38 35 L 42 28 L 46 42 L 50 30 L 53 35 L 58 35"
        fill="none" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        filter="url(#healthGlow)"
      />

      {/* Core pulse */}
      <motion.circle
        cx="35" cy="35" r="3" fill="#86efac" opacity="0.5"
        animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      <text x="53" y="10" fontFamily="monospace" fontSize="3" fill="#22c55e" opacity="0.35">HTH</text>
    </motion.g>
  </svg>
);

/* ── Trials: Holographic Hourglass ── */
const HoloTrials = ({ hovered }: { hovered: boolean }) => (
  <svg viewBox="0 0 70 70" className="w-[65px] h-[65px]">
    <defs>
      <filter id="trialGlow"><feGaussianBlur stdDeviation="1.5" /></filter>
    </defs>
    <motion.g
      animate={{ scale: hovered ? 1.06 : 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <circle cx="35" cy="35" r="30" fill="none" stroke="#581c87" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.3" />

      <motion.circle
        cx="35" cy="35" r="26" fill="none" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="3 12"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "35px 35px" }}
      />

      {/* Hourglass shape */}
      <polygon points="23,14 47,14 35,35 47,56 23,56 35,35" fill="rgba(168,85,247,0.06)" stroke="#a855f7" strokeWidth="0.8" />

      {/* Inner converge lines */}
      <line x1="27" y1="18" x2="35" y2="35" stroke="#c084fc" strokeWidth="0.4" strokeDasharray="1 2" />
      <line x1="43" y1="18" x2="35" y2="35" stroke="#c084fc" strokeWidth="0.4" strokeDasharray="1 2" />
      <line x1="27" y1="52" x2="35" y2="35" stroke="#c084fc" strokeWidth="0.4" strokeDasharray="1 2" />
      <line x1="43" y1="52" x2="35" y2="35" stroke="#c084fc" strokeWidth="0.4" strokeDasharray="1 2" />

      {/* Falling particle */}
      <motion.circle
        cx="35" r="1.2" fill="#d8b4fe"
        animate={{ cy: [22, 48], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeIn" }}
      />

      {/* Center node */}
      <motion.circle
        cx="35" cy="35" r="2.5" fill="#d8b4fe" opacity="0.6"
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        filter="url(#trialGlow)"
      />

      {/* Top/bottom caps */}
      <line x1="20" y1="14" x2="50" y2="14" stroke="#a855f7" strokeWidth="1" strokeLinecap="round" />
      <line x1="20" y1="56" x2="50" y2="56" stroke="#a855f7" strokeWidth="1" strokeLinecap="round" />

      <text x="53" y="10" fontFamily="monospace" fontSize="3" fill="#a855f7" opacity="0.35">TRL</text>
    </motion.g>
  </svg>
);

/* ── Action Needed: Holographic Lightning Bolt ── */
const HoloAction = ({ hovered }: { hovered: boolean }) => (
  <svg viewBox="0 0 70 70" className="w-[65px] h-[65px]">
    <defs>
      <filter id="actionGlow"><feGaussianBlur stdDeviation="2" /></filter>
    </defs>
    <motion.g
      animate={{ scale: hovered ? 1.06 : 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <circle cx="35" cy="35" r="30" fill="none" stroke="#78350f" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.3" />

      {/* Energy ring */}
      <motion.circle
        cx="35" cy="35" r="26" fill="none" stroke="#f59e0b" strokeWidth="0.7"
        strokeDasharray="6 70"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "35px 35px" }}
        filter="url(#actionGlow)"
      />

      {/* Inner orbit */}
      <motion.circle
        cx="35" cy="35" r="20" fill="none" stroke="#fbbf24" strokeWidth="0.4" strokeDasharray="3 8"
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "35px 35px" }}
      />

      {/* Lightning bolt */}
      <motion.path
        d="M 32 14 L 38 32 L 33 32 L 40 56 L 35 38 L 39 38 Z"
        fill="rgba(251,191,36,0.15)"
        stroke="#fcd34d"
        strokeWidth="0.8"
        strokeLinejoin="round"
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.97, 1.03, 0.97] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: "35px 35px" }}
        filter="url(#actionGlow)"
      />

      {/* Core pulse */}
      <motion.circle
        cx="35" cy="35" r="4" fill="#fbbf24" opacity="0.4"
        animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
        filter="url(#actionGlow)"
      />

      <text x="53" y="10" fontFamily="monospace" fontSize="3" fill="#f59e0b" opacity="0.35">ACT</text>
    </motion.g>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   VISUAL MAP — Top row metric cards
   ═══════════════════════════════════════════════════════════════ */
const TopVisualMap = [HoloTotalLicenses, HoloActive, HoloUtilization, HoloAtRisk];
const BottomVisualMap = [HoloHealth, HoloTrials, HoloAction];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
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

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3 px-4 pt-4 pb-4">

      {/* ── Row 1: Metric Cards (REFACTORED with Bespoke SVGs) ── */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        {metricCards.map((card, i) => (
          <BespokeMetricCard key={card.label} card={card} index={i} Visual={TopVisualMap[i]} />
        ))}
      </div>

      {/* ── Row 2: ARC GAUGE MATRIX + RADAR CONSTELLATION ── */}
      <div className="flex-1 min-h-0 grid grid-cols-5 gap-3">

        {/* LEFT PANEL — 3×2 Arc Gauge Matrix */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="col-span-3 rounded-xl border border-white/6 bg-[#0a0a0c] flex flex-col overflow-hidden relative group hover:border-white/10 transition-all duration-500"
        >
          {/* Top edge highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/5 to-transparent z-20" />

          {/* Background grid */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.015] group-hover:opacity-[0.04] transition-opacity duration-700">
            <svg fill="none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="gauge-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gauge-grid)" />
            </svg>
          </div>

          {/* Panel header */}
          <div className="relative flex items-center gap-2.5 px-5 py-3 shrink-0 z-10">
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/4" />
            <div className="absolute bottom-0 left-5 h-px w-14 bg-linear-to-r from-white/20 to-transparent" />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-3.5 h-3.5 rounded-sm border border-white/8 flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 bg-white/15 rounded-[1px]" />
            </motion.div>

            <div className="w-5 h-5 rounded-[5px] flex items-center justify-center bg-linear-to-b from-white/6 to-transparent border border-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_3px_rgba(0,0,0,0.3)]">
              <ChartBar size={10} className="text-white/35" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Status Breakdown</span>
            <span className="ml-auto text-[8px] font-mono text-white/10 tracking-wider">SYS.STAT.01</span>
          </div>

          {/* Single Linear Visualizer */}
          <div className="flex-1 min-h-0 flex items-center justify-center py-2 relative z-10 w-full overflow-hidden">
            <LinearStatusVisualizer analytics={analytics} total={total} />
          </div>
        </motion.div>

        {/* RIGHT PANEL — Radar Constellation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.16 }}
          className="col-span-2 rounded-xl border border-white/6 bg-[#0a0a0c] flex flex-col overflow-hidden relative group hover:border-white/10 transition-all duration-500"
        >
          {/* Top edge highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/5 to-transparent z-20" />

          {/* Background grid */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.015] group-hover:opacity-[0.04] transition-opacity duration-700">
            <svg fill="none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="radar-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#radar-grid)" />
            </svg>
          </div>

          {/* Panel header */}
          <div className="relative flex items-center gap-2.5 px-5 py-3 shrink-0 z-10">
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/4" />
            <div className="absolute bottom-0 left-5 h-px w-14 bg-linear-to-r from-white/20 to-transparent" />

            <div className="w-5 h-5 rounded-[5px] flex items-center justify-center bg-linear-to-b from-white/6 to-transparent border border-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_3px_rgba(0,0,0,0.3)]">
              <ChartPie size={10} className="text-white/35" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Distribution Radar</span>
            <span className="ml-auto text-[8px] font-mono text-white/10 tracking-wider">DST.01</span>
          </div>

          {/* Radar Chart */}
          <div className="flex-1 min-h-0 flex items-center justify-center p-3 relative z-10">
            <RadarConstellation analytics={analytics} total={total} />
          </div>
        </motion.div>
      </div>

      {/* ── Row 3: Insight Cards (REFACTORED with Bespoke SVGs) ── */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        {insightCards.map((card, i) => (
          <BespokeInsightCard key={card.label} card={card} index={i} Visual={BottomVisualMap[i]} />
        ))}
      </div>

    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BESPOKE METRIC CARD (Top Row) — with holographic visual
   ═══════════════════════════════════════════════════════════════ */
interface MetricCardData {
  label: string;
  value: number;
  icon: React.ElementType;
  sub: string;
  suffix?: string;
  alert?: boolean;
}

const BespokeMetricCard: React.FC<{
  card: MetricCardData;
  index: number;
  Visual: React.FC<{ hovered: boolean; value?: number }>;
}> = ({ card, index, Visual }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-xl border border-white/6 bg-[#0d0d0d] p-4 overflow-hidden hover:border-white/12 transition-all duration-300"
    >
      {/* Alert dot */}
      {"alert" in card && card.alert && (
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-amber-500 z-20"
        />
      )}

      {/* Bespoke Holographic Visual */}
      <div className="absolute right-0 top-0 bottom-0 w-[55%] z-0 pointer-events-none flex items-center justify-end pr-1 mix-blend-screen opacity-60">
        <Visual hovered={hovered} value={card.value} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Jewel-Box Icon + Label */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-input flex items-center justify-center bg-linear-to-b from-white/8 to-transparent border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-110">
            <card.icon size={13} className="text-white/40 shrink-0 group-hover:text-white/70 transition-colors" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/22 group-hover:text-white/45 transition-colors">{card.label}</span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-[26px] font-black tabular-nums text-white leading-none">{card.value}</span>
          {"suffix" in card && card.suffix && (
            <span className="text-sm font-bold text-white/30 ml-0.5">{card.suffix}</span>
          )}
        </div>
        <p className="text-[9px] text-white/18 mt-1.5">{card.sub}</p>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BESPOKE INSIGHT CARD (Bottom Row) — with holographic visual
   ═══════════════════════════════════════════════════════════════ */
interface InsightCardData {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  sub: string;
}

const BespokeInsightCard: React.FC<{
  card: InsightCardData;
  index: number;
  Visual: React.FC<{ hovered: boolean }>;
}> = ({ card, index, Visual }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      key={card.label}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 + index * 0.04 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group rounded-xl border border-white/6 bg-[#0d0d0d] px-5 py-4 flex items-center gap-5 hover:border-white/12 transition-all duration-300 relative overflow-hidden"
    >
      {/* Bespoke Holographic Visual — left side */}
      <div className="absolute right-2 top-0 bottom-0 w-[40%] z-0 pointer-events-none flex items-center justify-end mix-blend-screen opacity-50">
        <Visual hovered={hovered} />
      </div>

      {/* Jewel-Box Icon */}
      <div className="shrink-0 relative z-10">
        <div className="w-7 h-7 rounded-input flex items-center justify-center bg-linear-to-b from-white/8 to-transparent border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-110">
          <card.icon size={14} className="text-white/25 group-hover:text-white/50 transition-colors" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/22 mb-1.5 group-hover:text-white/40 transition-colors">{card.label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-black tabular-nums text-white leading-none">{card.value}</span>
          {"suffix" in card && card.suffix && (
            <span className="text-[10px] text-white/25">{card.suffix}</span>
          )}
        </div>
        <p className="text-[9px] text-white/18 mt-1 truncate">{card.sub}</p>
      </div>
    </motion.div>
  );
};