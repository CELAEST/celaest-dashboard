"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { FinancialMetric } from "../../types";

/* ───────────────────────────────────────────────────────────────
   BESPOKE SVG: Holographic User Constellation
   For "Active Subscriptions" — crystal human silhouettes
   connected by orbital comm-lines.
   ─────────────────────────────────────────────────────────────── */
const HolographicUsersVisual = ({ hovered }: { hovered: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-[100px] h-[100px]">
    <defs>
      <filter id="metricUserGlow"><feGaussianBlur stdDeviation="2" /></filter>
    </defs>
    <motion.g
      animate={{ scale: hovered ? 1.06 : 1, y: hovered ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Outer boundary ring */}
      <circle cx="50" cy="50" r="44" fill="none" stroke="#0e7490" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.4" />

      {/* Orbital comm-ring */}
      <motion.circle
        cx="50" cy="50" r="38" fill="none" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="4 12"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* Primary person — crystal wireframe */}
      <g>
        {/* Head diamond */}
        <polygon points="35,42 28,34 35,24 42,34" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="0.8" />
        <line x1="35" y1="42" x2="35" y2="24" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="1 1" />
        <line x1="28" y1="34" x2="42" y2="34" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="1 1" />
        {/* Head orbit  */}
        <circle cx="35" cy="34" r="12" fill="none" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="2 3" />

        {/* Body crystal */}
        <polygon points="35,42 22,56 30,72 42,72 50,56" fill="rgba(34,211,238,0.06)" stroke="#22d3ee" strokeWidth="0.8" />
        <line x1="35" y1="42" x2="30" y2="72" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="1 1" />
        <line x1="22" y1="56" x2="42" y2="72" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="1 1" />

        {/* Nodes */}
        {[[35,24],[28,34],[42,34],[35,42],[22,56],[50,56],[30,72],[42,72]].map(([x, y], i) => (
          <motion.circle
            key={`p1-${i}`} cx={x} cy={y} r="1.5" fill="#67e8f9"
            animate={{ r: [1.3, 2, 1.3], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}
      </g>

      {/* Secondary person — ghost wireframe */}
      <g opacity="0.55">
        <polygon points="68,48 62,42 68,34 74,42" fill="none" stroke="#06b6d4" strokeWidth="0.6" strokeDasharray="1 1" />
        <circle cx="68" cy="42" r="9" fill="none" stroke="#06b6d4" strokeWidth="0.4" strokeDasharray="2 2" />
        <polygon points="68,48 58,60 64,74 72,74 78,60" fill="none" stroke="#06b6d4" strokeWidth="0.6" strokeDasharray="1 1" />
        {[[68,34],[62,42],[74,42],[68,48],[58,60],[78,60]].map(([x, y], i) => (
          <circle key={`p2-${i}`} cx={x} cy={y} r="1" fill="#22d3ee" />
        ))}
      </g>

      {/* Interaction arc between the two */}
      <motion.path
        d="M 35 24 Q 50 10 68 34" fill="none" stroke="#a5f3fc" strokeWidth="0.6" strokeDasharray="3 3"
        initial={{ pathLength: 0.3 }}
        animate={{ pathLength: hovered ? 1 : 0.5 }}
        transition={{ duration: 1, type: "spring" }}
      />

      {/* Data packet on the arc */}
      <motion.circle
        r="1.2" fill="#cffafe"
        animate={{ cx: [38, 52, 65], cy: [18, 12, 30], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Base platform */}
      <ellipse cx="45" cy="76" rx="30" ry="5" fill="none" stroke="#0e7490" strokeWidth="0.4" strokeDasharray="2 3" opacity="0.4" />

      {/* Telemetry */}
      <text x="78" y="12" fontFamily="monospace" fontSize="4" fill="#22d3ee" opacity="0.4">USR.01</text>
    </motion.g>
  </svg>
);

/* ───────────────────────────────────────────────────────────────
   BESPOKE SVG: Holographic Churn Gauge
   For "Churn Rate" — radial gauge with rotating scanner
   ─────────────────────────────────────────────────────────────── */
const HolographicChurnVisual = ({ hovered }: { hovered: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-[100px] h-[100px]">
    <defs>
      <filter id="churnGlow"><feGaussianBlur stdDeviation="2" /></filter>
      <linearGradient id="churnArc" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <motion.g
      animate={{ scale: hovered ? 1.06 : 1, y: hovered ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Outer ring */}
      <circle cx="50" cy="50" r="44" fill="none" stroke="#78350f" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.4" />

      {/* Scanner ring — fast rotation */}
      <motion.circle
        cx="50" cy="50" r="40" fill="none" stroke="#fbbf24" strokeWidth="0.8"
        strokeDasharray="8 100"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
        filter="url(#churnGlow)"
      />

      {/* Gauge track */}
      <circle cx="50" cy="50" r="34" fill="none" stroke="#78350f" strokeWidth="1.5" opacity="0.3" />

      {/* Gauge fill arc — representing churn percentage (0% = empty) */}
      <motion.circle
        cx="50" cy="50" r="34" fill="none" stroke="url(#churnArc)" strokeWidth="2"
        strokeDasharray={`${0.02 * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
        strokeLinecap="round"
        animate={{ strokeDashoffset: [2 * Math.PI * 34 * 0.25, 0] }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ transformOrigin: "50px 50px" }}
        transform="rotate(-90 50 50)"
      />

      {/* Slow rotating orbit */}
      <motion.circle
        cx="50" cy="50" r="26" fill="none" stroke="#f59e0b" strokeWidth="0.6" strokeDasharray="4 10"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* Crosshair */}
      <line x1="50" y1="20" x2="50" y2="80" stroke="#b45309" strokeWidth="0.3" strokeDasharray="2 3" />
      <line x1="20" y1="50" x2="80" y2="50" stroke="#b45309" strokeWidth="0.3" strokeDasharray="2 3" />

      {/* Center percent indicator */}
      <circle cx="50" cy="50" r="14" fill="rgba(251,191,36,0.08)" />
      <motion.circle
        cx="50" cy="50" r="8" fill="rgba(251,191,36,0.15)"
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        filter="url(#churnGlow)"
      />
      <text x="50" y="53" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#fcd34d" fontWeight="bold" opacity="0.9">%</text>

      {/* Tick marks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={`churn-tick-${i}`}
          x1="50" y1="8" x2="50" y2="14"
          stroke="#fbbf24" strokeWidth="1"
          transform={`rotate(${angle} 50 50)`}
          opacity="0.5"
        />
      ))}

      {/* Telemetry */}
      <text x="74" y="12" fontFamily="monospace" fontSize="4" fill="#fbbf24" opacity="0.4">CHN.02</text>
    </motion.g>
  </svg>
);

/* ───────────────────────────────────────────────────────────────
   BESPOKE SVG: Holographic ARPU Lightning Reactor
   For "ARPU" — energy reactor with lightning node at center
   ─────────────────────────────────────────────────────────────── */
const HolographicArpuVisual = ({ hovered }: { hovered: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-[100px] h-[100px]">
    <defs>
      <filter id="arpuGlow"><feGaussianBlur stdDeviation="2.5" /></filter>
      <radialGradient id="arpuCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.05" />
      </radialGradient>
    </defs>
    <motion.g
      animate={{ scale: hovered ? 1.06 : 1, y: hovered ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Outer containment ring */}
      <circle cx="50" cy="50" r="44" fill="none" stroke="#581c87" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.4" />

      {/* Magnetic field ring 1 — CW */}
      <motion.circle
        cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="6 14"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* Magnetic field ring 2 — CCW */}
      <motion.circle
        cx="50" cy="50" r="34" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="10 18"
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
        opacity="0.7"
      />

      {/* Energy ring 3 — fast */}
      <motion.circle
        cx="50" cy="50" r="26" fill="none" stroke="#e9d5ff" strokeWidth="1.5" strokeDasharray="25 20"
        animate={{ rotate: 360 }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
        filter="url(#arpuGlow)"
      />

      {/* Crosshair grid */}
      <line x1="50" y1="8" x2="50" y2="92" stroke="#7c3aed" strokeWidth="0.3" strokeDasharray="2 4" />
      <line x1="8" y1="50" x2="92" y2="50" stroke="#7c3aed" strokeWidth="0.3" strokeDasharray="2 4" />

      {/* Reactor core */}
      <circle cx="50" cy="50" r="16" fill="url(#arpuCore)" />

      {/* Lightning bolt path */}
      <motion.path
        d="M 46 38 L 52 48 L 47 48 L 54 62 L 49 52 L 53 52 Z"
        fill="rgba(168,85,247,0.3)"
        stroke="#d8b4fe"
        strokeWidth="1"
        strokeLinejoin="round"
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 50px" }}
        filter="url(#arpuGlow)"
      />

      {/* Pulsating center */}
      <motion.circle
        cx="50" cy="50" r="6" fill="#e9d5ff" opacity="0.5"
        animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        filter="url(#arpuGlow)"
      />

      {/* Energy particle orbits */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={`particle-${i}`}
          r="1.5" fill="#d8b4fe"
          animate={{
            cx: [50 + 30 * Math.cos((i * 2 * Math.PI) / 3), 50 + 30 * Math.cos((i * 2 * Math.PI) / 3 + Math.PI)],
            cy: [50 + 30 * Math.sin((i * 2 * Math.PI) / 3), 50 + 30 * Math.sin((i * 2 * Math.PI) / 3 + Math.PI)],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
        />
      ))}

      {/* Tick marks */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <line
          key={`arpu-tick-${i}`}
          x1="50" y1="8" x2="50" y2="13"
          stroke="#c084fc" strokeWidth="1.2"
          transform={`rotate(${angle} 50 50)`}
          opacity="0.5"
        />
      ))}

      {/* Telemetry */}
      <text x="74" y="12" fontFamily="monospace" fontSize="4" fill="#a855f7" opacity="0.4">PWR.03</text>
      <text x="6" y="94" fontFamily="monospace" fontSize="3.5" fill="#7c3aed" opacity="0.35">[ARPU]</text>
    </motion.g>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   VISUAL SELECTOR — Maps metric color to bespoke SVG
   ═══════════════════════════════════════════════════════════════ */
const BespokeVisualMap: Record<string, React.FC<{ hovered: boolean }>> = {
  blue: HolographicUsersVisual,
  yellow: HolographicChurnVisual,
  purple: HolographicArpuVisual,
};

/* ═══════════════════════════════════════════════════════════════
   METRIC CARD — Enterprise Bespoke Refactored
   ═══════════════════════════════════════════════════════════════ */
interface MetricCardProps {
  metric: FinancialMetric;
  index: number;
  className?: string;
}

export const MetricCard = React.memo(
  ({ metric, index, className }: MetricCardProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [hovered, setHovered] = useState(false);

    const VisualComponent = BespokeVisualMap[metric.color] || HolographicUsersVisual;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + index * 0.1 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`group relative rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${
          isDark
            ? "bg-[#09090b] border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:-translate-y-1"
            : "bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-500/30 hover:-translate-y-1"
        } ${className || ""}`}
      >
        {/* Bespoke Holographic Visual — positioned right */}
        <div className="absolute right-3 top-0 bottom-0 w-[45%] z-0 pointer-events-none flex items-center justify-end mix-blend-screen opacity-70">
          <VisualComponent hovered={hovered} />
        </div>

        <div className="p-6 h-full flex flex-col justify-center gap-4 relative z-10">
          <div className="flex items-start justify-between">
            {/* Jewel-Box Icon */}
            <div
              className={`w-7 h-7 rounded-input flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                isDark
                  ? "bg-linear-to-b from-white/8 to-transparent border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]"
                  : "bg-linear-to-b from-white to-gray-50 border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]"
              }`}
            >
              {metric.icon && (
                <metric.icon
                  className={`w-4 h-4 transition-colors duration-300 ${
                    isDark
                      ? "text-gray-400 group-hover:text-cyan-400"
                      : "text-gray-500 group-hover:text-blue-600"
                  }`}
                />
              )}
            </div>
            {/* Status indicator dot */}
            <motion.div
              animate={{
                scale: hovered ? [1, 1.5, 1] : 1,
                boxShadow: hovered
                  ? ["0 0 0px #22d3ee", "0 0 8px #22d3ee", "0 0 0px #22d3ee"]
                  : "0 0 0px transparent",
              }}
              transition={{ duration: 1.5, repeat: hovered ? Infinity : 0 }}
              className={`w-1.5 h-1.5 rounded-full ${
                isDark
                  ? "bg-zinc-800 group-hover:bg-cyan-500"
                  : "bg-gray-300 group-hover:bg-blue-500"
              } transition-colors duration-300`}
            />
          </div>

          <div>
            <div
              className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                isDark
                  ? "text-gray-500 group-hover:text-gray-300 transition-colors"
                  : "text-gray-400 group-hover:text-gray-600 transition-colors"
              }`}
            >
              {metric.label}
            </div>
            <div
              className={`text-3xl font-black tracking-tight mb-3 tabular-nums ${
                isDark
                  ? "text-white group-hover:text-cyan-50 transition-colors"
                  : "text-gray-900"
              }`}
            >
              {metric.value}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  isDark
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {metric.change}
              </span>
              <span
                className={`text-[10px] font-medium opacity-60 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                VS LAST MO
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

MetricCard.displayName = "MetricCard";
