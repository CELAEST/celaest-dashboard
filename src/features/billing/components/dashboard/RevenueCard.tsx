"use client";

import React from "react";
import { motion } from "motion/react";
import { CurrencyDollar } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

/* ───────────────────────────────────────────────────────────────
   BESPOKE SVG: Holographic Revenue Diamond
   Rotating orbital rings, crosshair targeting grid,
   pulsating core, and telemetry coordinates.
   ─────────────────────────────────────────────────────────────── */
const HolographicRevenueDiamond = () => (
  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-[140px] h-[140px] z-0 pointer-events-none mix-blend-screen opacity-70">
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <filter id="revGlow">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <linearGradient id="revDiamondGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <motion.g
        animate={{ y: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Crosshair targeting grid */}
        <line x1="60" y1="5" x2="60" y2="115" stroke="#06b6d4" strokeWidth="0.4" strokeDasharray="2 4" opacity="0.3" />
        <line x1="5" y1="60" x2="115" y2="60" stroke="#06b6d4" strokeWidth="0.4" strokeDasharray="2 4" opacity="0.3" />
        <line x1="20" y1="20" x2="100" y2="100" stroke="#06b6d4" strokeWidth="0.3" strokeDasharray="1 5" opacity="0.2" />
        <line x1="100" y1="20" x2="20" y2="100" stroke="#06b6d4" strokeWidth="0.3" strokeDasharray="1 5" opacity="0.2" />

        {/* Outer dashed boundary */}
        <circle cx="60" cy="60" r="52" fill="none" stroke="#0e7490" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.4" />

        {/* Orbital ring 1 — slow CW */}
        <motion.circle
          cx="60" cy="60" r="46" fill="none" stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="6 18"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "60px 60px" }}
        />

        {/* Orbital ring 2 — medium CCW */}
        <motion.circle
          cx="60" cy="60" r="38" fill="none" stroke="#67e8f9" strokeWidth="1" strokeDasharray="12 20"
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "60px 60px" }}
          opacity="0.6"
        />

        {/* Orbital ring 3 — fast CW with glow */}
        <motion.circle
          cx="60" cy="60" r="28" fill="none" stroke="#a5f3fc" strokeWidth="1.5" strokeDasharray="30 15"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "60px 60px" }}
          filter="url(#revGlow)"
        />

        {/* Diamond shape */}
        <motion.path
          d="M 60 25 L 85 60 L 60 95 L 35 60 Z"
          fill="url(#revDiamondGrad)"
          stroke="#22d3ee"
          strokeWidth="1"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "60px 60px" }}
        />

        {/* Inner diamond structure */}
        <path d="M 60 38 L 75 60 L 60 82 L 45 60 Z" fill="none" stroke="#67e8f9" strokeWidth="0.6" strokeDasharray="2 3" />

        {/* Core pulsating center */}
        <circle cx="60" cy="60" r="8" fill="rgba(34,211,238,0.15)" />
        <motion.circle
          cx="60" cy="60" r="5" fill="#cffafe" opacity="0.8"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          filter="url(#revGlow)"
        />

        {/* Cardinal tick marks */}
        {[0, 90, 180, 270].map((angle, i) => (
          <line
            key={`tick-${i}`}
            x1="60" y1="6" x2="60" y2="12"
            stroke="#67e8f9" strokeWidth="1.5"
            transform={`rotate(${angle} 60 60)`}
          />
        ))}

        {/* Telemetry text */}
        <text x="100" y="14" fontFamily="monospace" fontSize="5" fill="#22d3ee" opacity="0.5">FIN.01</text>
        <text x="4" y="114" fontFamily="monospace" fontSize="4" fill="#06b6d4" opacity="0.4">[v2.4]</text>
      </motion.g>
    </svg>
  </div>
);

/* ───────────────────────────────────────────────────────────────
   BESPOKE SVG: Mini Emerald Shield (for "Paid" sub-tile)
   ─────────────────────────────────────────────────────────────── */
const MiniPaidVisual = () => (
  <div className="absolute right-1 top-1/2 -translate-y-1/2 w-[60px] h-[60px] pointer-events-none mix-blend-screen opacity-60">
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <defs>
        <filter id="paidGlow"><feGaussianBlur stdDeviation="1.5" /></filter>
      </defs>
      <motion.g animate={{ y: [-1, 1, -1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        {/* Hexagonal shield outline */}
        <polygon points="30,5 52,17.5 52,42.5 30,55 8,42.5 8,17.5" fill="none" stroke="#10b981" strokeWidth="0.8" opacity="0.5" />
        <polygon points="30,12 45,21 45,39 30,48 15,39 15,21" fill="rgba(16,185,129,0.08)" stroke="#34d399" strokeWidth="1" />
        {/* Inner core */}
        <motion.circle
          cx="30" cy="30" r="6" fill="#34d399" opacity="0.4"
          animate={{ r: [5, 7, 5], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          filter="url(#paidGlow)"
        />
        {/* Checkmark glyph */}
        <motion.polyline
          points="24,30 28,35 36,24"
          fill="none" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round"
          animate={{ pathLength: [0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        />
      </motion.g>
    </svg>
  </div>
);

/* ───────────────────────────────────────────────────────────────
   BESPOKE SVG: Mini Warning Prism (for "Refunds" sub-tile)
   ─────────────────────────────────────────────────────────────── */
const MiniRefundVisual = () => (
  <div className="absolute right-1 top-1/2 -translate-y-1/2 w-[60px] h-[60px] pointer-events-none mix-blend-screen opacity-60">
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <defs>
        <filter id="refGlow"><feGaussianBlur stdDeviation="1.5" /></filter>
      </defs>
      <motion.g animate={{ y: [-1, 1, -1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        {/* Outer rotating ring */}
        <motion.circle
          cx="30" cy="30" r="24" fill="none" stroke="#f97316" strokeWidth="0.6" strokeDasharray="4 8"
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "30px 30px" }}
        />
        {/* Warning inverted triangle */}
        <polygon points="30,10 50,45 10,45" fill="rgba(249,115,22,0.08)" stroke="#fb923c" strokeWidth="1" />
        <polygon points="30,18 43,40 17,40" fill="none" stroke="#f97316" strokeWidth="0.6" strokeDasharray="2 2" />
        {/* Arrow down (refund symbol) */}
        <motion.g animate={{ y: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <line x1="30" y1="24" x2="30" y2="36" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" />
          <polyline points="26,32 30,37 34,32" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
        {/* Corner pulse */}
        <motion.circle
          cx="30" cy="38" r="2" fill="#f97316" opacity="0.5"
          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          filter="url(#refGlow)"
        />
      </motion.g>
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   REVENUE CARD — Enterprise Bespoke Refactored
   ═══════════════════════════════════════════════════════════════ */
interface RevenueCardProps {
  totalRevenue: number;
  paidInvoices: number;
  refundedFunds: number;
  className?: string;
}

export const RevenueCard = React.memo(
  ({ totalRevenue, paidInvoices, refundedFunds, className }: RevenueCardProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-2xl group h-full ${
          isDark
            ? "bg-[#09090b] border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
            : "bg-white border border-gray-100 shadow-xl hover:border-blue-500/30"
        } ${className || ""}`}
      >
        {/* Ambient Background Glow */}
        <div
          className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-cyan-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        />

        {/* MICRO-BENTO GRID: 3 Interlocking Tiles */}
        <div className="relative h-full p-4 grid grid-rows-[1.5fr_1fr] gap-3">
          {/* TILE 1: HERO REVENUE (Top / Dominant) */}
          <div
            className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group-hover:bg-white/5 ${
              isDark
                ? "bg-white/2 border border-white/5"
                : "bg-gray-50/50 border border-gray-100"
            }`}
          >
            {/* Bespoke Holographic Visual */}
            <HolographicRevenueDiamond />

            {/* Header Row: Jewel-Box Icon and Badge */}
            <div className="flex items-start justify-between z-10 shrink-0">
              <div
                className={`w-7 h-7 rounded-input flex items-center justify-center ${
                  isDark
                    ? "bg-linear-to-b from-white/8 to-transparent border border-white/8 text-cyan-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]"
                    : "bg-linear-to-b from-white to-gray-50 border border-gray-200 text-blue-600 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]"
                }`}
              >
                <CurrencyDollar className="w-4 h-4" weight="bold" />
              </div>
              <div
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border ${
                  isDark
                    ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                All Time
              </div>
            </div>

            {/* Content Row: Label and Value */}
            <div className="relative z-10 mt-auto pt-2">
              <div
                className={`text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Total Revenue
              </div>
              <div
                className={`text-3xl sm:text-4xl lg:text-4xl font-black tracking-tighter tabular-nums transition-all duration-300 truncate ${
                  isDark
                    ? "text-white group-hover:text-cyan-50"
                    : "text-gray-900"
                }`}
              >
                <span className="inline-block">
                  ${totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ROW 2: THE TWINS (Paid & Refunds) */}
          <div className="grid grid-cols-2 gap-3 min-h-0">
            {/* TILE 2: PAID (Emerald Glass) */}
            <div
              className={`rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-[1.02] ${
                isDark
                  ? "bg-linear-to-br from-emerald-500/10 to-transparent border border-emerald-500/10"
                  : "bg-emerald-50/50 border border-emerald-100"
              }`}
            >
              <MiniPaidVisual />
              <div
                className={`text-[9px] font-black uppercase tracking-wider mb-1 opacity-70 relative z-10 ${
                  isDark ? "text-emerald-200" : "text-emerald-700"
                }`}
              >
                Paid
              </div>
              <div
                className={`text-xl lg:text-2xl font-bold tabular-nums relative z-10 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                {paidInvoices}
              </div>
            </div>

            {/* TILE 3: REFUNDS (Orange Glass) */}
            <div
              className={`rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-[1.02] ${
                isDark
                  ? "bg-linear-to-br from-orange-500/10 to-transparent border border-orange-500/10"
                  : "bg-orange-50/50 border border-orange-100"
              }`}
            >
              <MiniRefundVisual />
              <div
                className={`text-[9px] font-black uppercase tracking-wider mb-1 opacity-70 relative z-10 ${
                  isDark ? "text-orange-200" : "text-orange-700"
                }`}
              >
                Refunds
              </div>
              <div
                className={`text-xl lg:text-2xl font-bold tabular-nums relative z-10 ${
                  isDark ? "text-orange-400" : "text-orange-600"
                }`}
              >
                -${refundedFunds.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

RevenueCard.displayName = "RevenueCard";
