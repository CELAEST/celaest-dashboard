"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TrendUp, TrendDown } from "@phosphor-icons/react";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  className?: string;
  percent?: number; // 0 to 100
}

function CardBase({
  children,
  className,
  onHover,
}: {
  children: React.ReactNode;
  className?: string;
  onHover: (hovered: boolean) => void;
}) {
  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={cn(
        "relative rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden group cursor-default transition-colors duration-300 hover:border-zinc-700/80",
        className,
      )}
    >
      {/* Subtle top edge highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/5 to-transparent z-20" />
      {children}
    </div>
  );
}

function CardHeader({
  label,
  value,
  delta,
  deltaUp,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
}) {
  return (
    <div className="relative z-10 px-5 pt-5 pb-2 flex flex-col gap-1 pointer-events-none">
      <h3 className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">
        {label}
      </h3>
      <div className="flex items-end gap-3">
        <span className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
          {value}
        </span>
        {delta && (
          <div
            className={cn(
              "flex items-center gap-1 text-[11px] font-medium mb-1.5",
              deltaUp ? "text-emerald-400" : "text-rose-400",
            )}
          >
            {deltaUp ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// REVENUE: Holographic Upward Trajectory
// ─────────────────────────────────────────────────────────────────
export function DynamicRevenueCard(props: KpiCardProps) {
  const [hovered, setHovered] = useState(false);
  const nodes = [
    { x: 10, y: 70 },
    { x: 30, y: 55 },
    { x: 50, y: 65 },
    { x: 75, y: 30 },
    { x: 95, y: 15 },
  ];
  return (
    <CardBase className="h-32" onHover={setHovered}>
      <CardHeader {...props} />
      <div className="absolute right-5 top-0 bottom-0 w-[50%] z-0 pointer-events-none flex items-center justify-end opacity-80 pb-2">
        <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
          <defs>
            <linearGradient id="glowR" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
            </linearGradient>
            <filter id="blurR">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          <motion.g
            animate={{ y: hovered ? -2 : 0, scale: hovered ? 1.05 : 1 }}
            transition={{ type: "spring" }}
          >
            {/* Hologram shadow */}
            <path
              d="M10 70 L30 55 L50 65 L75 30 L95 15"
              stroke="url(#glowR)"
              strokeWidth="4"
              fill="none"
              filter="url(#blurR)"
            />
            {/* Core Lines */}
            <motion.path
              d="M10 70 L30 55 L50 65 L75 30 L95 15"
              stroke="#60a5fa"
              strokeWidth="0.8"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "linear" }}
            />
            {/* Supporting structural grid lines connecting to base */}
            {nodes.map((n, i) => (
              <line
                key={`base-${i}`}
                x1={n.x}
                y1={n.y}
                x2={n.x}
                y2="90"
                stroke="#3b82f6"
                strokeWidth="0.3"
                strokeDasharray="1 2"
              />
            ))}
            {/* Glowing intersection nodes */}
            {nodes.map((n, i) => (
              <motion.circle
                key={i}
                cx={n.x}
                cy={n.y}
                r="1.5"
                fill="#93c5fd"
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
            {/* Ascending Arrow Head */}
            <polygon
              points="95,15 90,20 85,10"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="0.8"
            />
          </motion.g>
        </svg>
      </div>
    </CardBase>
  );
}

// ─────────────────────────────────────────────────────────────────
// ORDERS: Holographic Isometric Box
// ─────────────────────────────────────────────────────────────────
export function DynamicOrdersCard(props: KpiCardProps) {
  const [hovered, setHovered] = useState(false);
  const nodes = [
    { x: 50, y: 20 }, // top
    { x: 80, y: 35 }, // right
    { x: 50, y: 50 }, // front
    { x: 20, y: 35 }, // left
    { x: 50, y: 80 }, // bottom
    { x: 80, y: 65 }, // back-right
    { x: 20, y: 65 }, // back-left
  ];
  return (
    <CardBase className="h-32" onHover={setHovered}>
      <CardHeader {...props} />
      <div className="absolute right-5 top-0 bottom-0 w-[50%] z-0 pointer-events-none flex items-center justify-end opacity-80">
        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px]">
          {/* Subtle rotation on hover */}
          <motion.g
            animate={{ y: hovered ? -5 : 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {/* Box edges */}
            <motion.path
              d="M50 20 L80 35 L50 50 L20 35 Z" // Top face
              stroke="#a855f7"
              strokeWidth="0.8"
              fill={hovered ? "rgba(168,85,247,0.1)" : "none"}
            />
            <motion.path
              d="M20 35 L50 50 L50 80 L20 65 Z" // Left face
              stroke="#c084fc"
              strokeWidth="0.6"
              strokeDasharray="2 2"
              fill="none"
            />
            <motion.path
              d="M80 35 L50 50 L50 80 L80 65 Z" // Right face
              stroke="#c084fc"
              strokeWidth="0.6"
              strokeDasharray="2 2"
              fill="none"
            />
            {/* Inner structural scan lines */}
            <motion.line
              x1="50"
              y1="20"
              x2="50"
              y2="80"
              stroke="#d8b4fe"
              strokeWidth="0.3"
              strokeDasharray="1 1"
            />

            {/* Data packets traveling along edges */}
            <motion.circle
              r="1"
              fill="#e9d5ff"
              animate={{ cx: [20, 50, 80], cy: [35, 50, 35] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              r="1.5"
              fill="#d8b4fe"
              animate={{ cx: [50, 50], cy: [20, 80] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.5,
              }}
            />

            {/* Vertices (Nodes) */}
            {nodes.map((n, i) => (
              <circle key={i} cx={n.x} cy={n.y} r="1.5" fill="#a855f7" />
            ))}
          </motion.g>
        </svg>
      </div>
    </CardBase>
  );
}

// ─────────────────────────────────────────────────────────────────
// LICENSES: 1:1 Reference Replication (Geometric Shield)
// ─────────────────────────────────────────────────────────────────
export function DynamicLicensesCard(props: KpiCardProps) {
  const [hovered, setHovered] = useState(false);

  // Pointy-top hex coordinates. Center is 50,50
  const outerCoords = [
    "50,10",
    "84.6,30",
    "84.6,70",
    "50,90",
    "15.4,70",
    "15.4,30",
  ];
  const midHex = "50,25 71.6,37.5 71.6,62.5 50,75 28.4,62.5 28.4,37.5";
  const innerHex = "50,35 63,42.5 63,57.5 50,65 37,57.5 37,42.5";

  return (
    <CardBase className="h-32" onHover={setHovered}>
      <CardHeader {...props} />
      <div className="absolute right-5 top-0 bottom-0 w-[50%] z-0 pointer-events-none flex items-center justify-end opacity-90">
        <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
          <defs>
            <filter id="shieldGlow">
              <feGaussianBlur stdDeviation="2" />
            </filter>
            <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
            </radialGradient>
          </defs>

          <motion.g
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* 1. Outer dashed boundary circles */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#064e3b"
              strokeWidth="0.5"
              strokeDasharray="1 3"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#047857"
              strokeWidth="0.5"
              strokeDasharray="2 4"
              animate={{ rotate: hovered ? 90 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "50px 50px" }}
            />

            {/* 2. Outer glowing nodes */}
            {outerCoords.map((coord, i) => {
              const [x, y] = coord.split(",");
              return (
                <motion.circle
                  key={`node-${i}`}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill="#6ee7b7"
                  animate={{ r: [2.5, 3.5, 2.5], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              );
            })}

            {/* 3. Connecting radial dashed lines from Nodes to Mid Hexagon */}
            {outerCoords.map((coord, i) => {
              const [x1, y1] = coord.split(",");
              const [x2, y2] = midHex.split(" ")[i].split(",");
              return (
                <line
                  key={`line-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#059669"
                  strokeWidth="0.6"
                  strokeDasharray="2 2"
                />
              );
            })}

            {/* 4. Mid wireframe Hexagon */}
            <polygon
              points={midHex}
              fill="none"
              stroke="#10b981"
              strokeWidth="1"
            />

            {/* 5. Inner solid/glowing Hexagon Core */}
            <motion.polygon
              points={innerHex}
              fill="url(#innerGlow)"
              stroke="#6ee7b7"
              strokeWidth="1.5"
              animate={{
                filter: hovered
                  ? "drop-shadow(0px 0px 8px rgba(110,231,183,0.8))"
                  : "drop-shadow(0px 0px 4px rgba(110,231,183,0.4))",
              }}
            />

            {/* 6. Orbital accent lines around the inner core */}
            <motion.path
              d="M 50 20 A 30 30 0 0 1 76 35"
              fill="none"
              stroke="#34d399"
              strokeWidth="1"
              strokeLinecap="round"
              animate={{ opacity: hovered ? [0.2, 1, 0.2] : 0.5 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path
              d="M 50 80 A 30 30 0 0 1 24 65"
              fill="none"
              stroke="#34d399"
              strokeWidth="1"
              strokeLinecap="round"
              animate={{ opacity: hovered ? [0.2, 1, 0.2] : 0.5 }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />

            {/* Sparkle accents inside the mid layer */}
            <circle cx="35" cy="45" r="0.8" fill="#a7f3d0" />
            <circle cx="65" cy="65" r="1.2" fill="#a7f3d0" />
          </motion.g>
        </svg>
      </div>
    </CardBase>
  );
}

// ─────────────────────────────────────────────────────────────────
// USERS: 1:1 Reference Replication (Geometric Crystal Humans)
// ─────────────────────────────────────────────────────────────────
export function DynamicUsersCard(props: KpiCardProps) {
  const [hovered, setHovered] = useState(false);

  // -- Foreground Person (Yellow) Geometry --
  // Head octahedron
  const p1_neck = { x: 40, y: 50 };
  const p1_hL = { x: 32, y: 40 };
  const p1_hT = { x: 40, y: 30 };
  const p1_hR = { x: 48, y: 40 };

  // Body crystal
  const p1_sL = { x: 25, y: 65 }; // Left shoulder
  const p1_sR = { x: 55, y: 65 }; // Right shoulder
  const p1_bL = { x: 35, y: 85 }; // Bottom left
  const p1_bR = { x: 50, y: 85 }; // Bottom right

  const p1_nodes = [p1_neck, p1_hL, p1_hT, p1_hR, p1_sL, p1_sR, p1_bL, p1_bR];

  // -- Background Person (Orange) Geometry --
  // Head octahedron
  const p2_neck = { x: 75, y: 56 };
  const p2_hL = { x: 69, y: 48 };
  const p2_hT = { x: 75, y: 40 };
  const p2_hR = { x: 81, y: 48 };

  // Body crystal
  const p2_sL = { x: 65, y: 68 };
  const p2_sR = { x: 85, y: 68 };
  const p2_bL = { x: 70, y: 82 };
  const p2_bR = { x: 80, y: 82 };

  const p2_nodes = [p2_neck, p2_hL, p2_hT, p2_hR, p2_sL, p2_sR, p2_bL, p2_bR];

  return (
    <CardBase className="h-32" onHover={setHovered}>
      <CardHeader {...props} />
      <div className="absolute right-5 top-0 bottom-0 w-[50%] z-0 pointer-events-none flex items-center justify-end opacity-90">
        <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
          <defs>
            <filter id="p1glow">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>
          <motion.g
            animate={{ scale: hovered ? 1.05 : 1, y: hovered ? -2 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Base Platforms */}
            <ellipse
              cx="50"
              cy="88"
              rx="35"
              ry="8"
              fill="none"
              stroke="#d97706"
              strokeWidth="0.5"
              strokeDasharray="2 3"
            />
            <ellipse
              cx="42"
              cy="85"
              rx="18"
              ry="4"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="0.5"
            />

            {/* Background Orange Person (P2) */}
            <g opacity="0.8">
              {/* Head */}
              <polygon
                points="75,56 69,48 75,40 81,48"
                fill="none"
                stroke="#ea580c"
                strokeWidth="0.8"
                strokeDasharray="1 1"
              />
              <line
                x1="75"
                y1="56"
                x2="75"
                y2="40"
                stroke="#ea580c"
                strokeWidth="0.8"
                strokeDasharray="1 1"
              />
              <line
                x1="69"
                y1="48"
                x2="81"
                y2="48"
                stroke="#ea580c"
                strokeWidth="0.8"
                strokeDasharray="1 1"
              />
              <circle
                cx="75"
                cy="48"
                r="10"
                fill="none"
                stroke="#ea580c"
                strokeWidth="0.6"
                strokeDasharray="2 2"
              />

              {/* Body */}
              <polygon
                points="75,56 65,68 70,82 80,82 85,68"
                fill="none"
                stroke="#ea580c"
                strokeWidth="0.8"
                strokeDasharray="1 1"
              />
              <line
                x1="75"
                y1="56"
                x2="70"
                y2="82"
                stroke="#ea580c"
                strokeWidth="0.8"
                strokeDasharray="1 1"
              />
              <line
                x1="65"
                y1="68"
                x2="80"
                y2="82"
                stroke="#ea580c"
                strokeWidth="0.8"
                strokeDasharray="1 1"
              />

              {/* Nodes P2 */}
              {p2_nodes.map((n, i) => (
                <circle
                  key={`p2-${i}`}
                  cx={n.x}
                  cy={n.y}
                  r="1.5"
                  fill="#f97316"
                />
              ))}
            </g>

            {/* Foreground Yellow Person (P1) */}
            <g>
              {/* Head */}
              <polygon
                points="40,50 32,40 40,30 48,40"
                fill="rgba(251,191,36,0.15)"
                stroke="#fbbf24"
                strokeWidth="1"
              />
              <line
                x1="40"
                y1="50"
                x2="40"
                y2="30"
                stroke="#fbbf24"
                strokeWidth="1"
              />
              <line
                x1="32"
                y1="40"
                x2="48"
                y2="40"
                stroke="#fbbf24"
                strokeWidth="1"
              />
              <circle
                cx="40"
                cy="40"
                r="14"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="0.5"
                strokeDasharray="2 3"
              />

              {/* Body */}
              <polygon
                points="40,50 25,65 35,85 50,85 55,65"
                fill="rgba(251,191,36,0.15)"
                stroke="#fbbf24"
                strokeWidth="1"
              />
              <line
                x1="40"
                y1="50"
                x2="35"
                y2="85"
                stroke="#fbbf24"
                strokeWidth="1"
              />
              <line
                x1="25"
                y1="65"
                x2="50"
                y2="85"
                stroke="#fbbf24"
                strokeWidth="1"
              />

              {/* Nodes P1 */}
              {p1_nodes.map((n, i) => (
                <motion.circle
                  key={`p1-${i}`}
                  cx={n.x}
                  cy={n.y}
                  r="2"
                  fill="#fcd34d"
                  animate={{ r: [2, 2.5, 2], opacity: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </g>

            {/* Interaction Interaction Arcs */}
            <motion.path
              d="M 40 30 Q 55 15 75 40"
              fill="none"
              stroke="#fef3c7"
              strokeWidth="0.8"
              strokeDasharray="3 3"
              initial={{ pathLength: 0.3 }}
              animate={{ pathLength: hovered ? 1 : 0.6 }}
              transition={{ duration: 1, type: "spring" }}
            />

            {/* Flying arrow/packet on the curve */}
            <motion.polygon
              points="73,36 78,39 74,42"
              fill="#fcd34d"
              animate={{ opacity: hovered ? [0, 1, 1, 0] : 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.g>
        </svg>
      </div>
    </CardBase>
  );
}

// ─────────────────────────────────────────────────────────────────
// SYSTEM HEALTH: Holographic Server Blade Panel
// ─────────────────────────────────────────────────────────────────
import {
  Database,
  CloudCheck,
  WifiHigh,
  SquaresFour,
} from "@phosphor-icons/react";

export function DynamicSystemHealth({
  health,
  dashboard,
  isDark,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  health: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dashboard: any;
  isDark: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  // Generate random data for micro-sparklines once per mount
  const sparklines = [
    "M 0 5 Q 12 2, 25 5 T 50 5 T 75 5 T 100 5",
    "M 0 5 Q 10 8, 20 5 T 40 5 T 60 5 T 80 5 T 100 5",
    "M 0 5 Q 16 8, 33 5 T 66 5 T 100 5",
    "M 0 5 Q 15 2, 30 5 T 60 5 T 90 5 Q 95 8, 100 5",
  ];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative rounded-xl border p-4 flex flex-col gap-4 flex-1 overflow-hidden transition-all duration-500 group",
        isDark
          ? "bg-[#0a0a0c] border-zinc-800/80 shadow-[inset_0_0_40px_transparent] hover:shadow-[inset_0_0_40px_rgba(16,185,129,0.03)] hover:border-emerald-500/20"
          : "bg-white border-gray-200",
      )}
    >
      {/* Background Deep Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
        <svg
          fill="none"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="deep-grid"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 30 0 L 0 0 0 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#deep-grid)" />
        </svg>
      </div>

      {/* ═══ Header ═══ */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: hovered ? 180 : 0, scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-3.5 h-3.5 rounded-sm border border-emerald-500/60 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.3)]"
          >
            <div className="w-1.5 h-1.5 bg-emerald-400" />
          </motion.div>
          <h3
            className={cn(
              "text-xs font-bold uppercase tracking-[0.2em]",
              isDark ? "text-white" : "text-gray-900",
            )}
          >
            Core Topology
          </h3>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-[9px] font-black uppercase tracking-widest",
            health?.status === "healthy"
              ? isDark
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : "text-emerald-700 bg-emerald-50 border-emerald-200"
              : isDark
                ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                : "text-rose-700 bg-rose-50 border-rose-200",
          )}
        >
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full animate-pulse",
              health?.status === "healthy"
                ? "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                : "bg-rose-400",
            )}
          />
          {health?.status === "healthy" ? "SYSTEM ONLINE" : "OFFLINE"}
        </div>
      </div>

      {/* ═══ The Unparalleled SVG Data Flow Map ═══ */}
      <div className="relative h-36 w-full rounded-lg border overflow-hidden mt-1 shrink-0 bg-[#0a0a0c] border-white/5">
        {/* Un-stretched Pixel Perfect Deep Grid (Background) */}
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="perfect-grid"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  strokeWidth="1"
                  className="stroke-white/10 dark:stroke-white/10"
                  strokeDasharray="2 2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#perfect-grid)" />
          </svg>
        </div>

        {/* Clean Base Map (Foreground) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <style>
              {`
                @keyframes pulseData {
                  0% { stroke-dashoffset: 20; }
                  100% { stroke-dashoffset: 0; }
                }
                .anim-data-flow {
                  animation: pulseData linear infinite;
                }
              `}
            </style>
          </defs>

          {/* Static Rails */}
          <path
            d="M 22 35 C 32 35, 32 50, 44 50"
            stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 22 65 C 32 65, 32 50, 44 50"
            stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 56 50 L 78 50"
            stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Animated Clean Data Streams */}
          {health?.status === "healthy" && (
            <>
              {/* DB -> API */}
              <path
                d="M 22 35 C 32 35, 32 50, 44 50"
                stroke={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"}
                strokeWidth="1.5"
                strokeDasharray="1 8"
                className="anim-data-flow"
                style={{ animationDuration: hovered ? "0.8s" : "3s" }}
                strokeLinecap="round"
              />
              {/* Redis -> API */}
              <path
                d="M 22 65 C 32 65, 32 50, 44 50"
                stroke={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"}
                strokeWidth="1.5"
                strokeDasharray="1 8"
                className="anim-data-flow"
                style={{ animationDuration: hovered ? "1s" : "4s" }}
                strokeLinecap="round"
              />
              {/* API -> Network */}
              <path
                d="M 56 50 L 78 50"
                stroke={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"}
                strokeWidth="2"
                strokeDasharray="2 10"
                className="anim-data-flow"
                style={{ animationDuration: hovered ? "0.6s" : "2.5s" }}
                strokeLinecap="round"
              />
            </>
          )}
        </svg>

        {/* DOM Overlays - Ejected text vectors to clear the center channel */}

        {/* DB Node (15, 35) - Text ABOVE */}
        <div
          className="absolute flex flex-col items-center group/node cursor-default z-20"
          style={{
            left: "15%",
            top: "35%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="absolute bottom-full mb-1 flex flex-col items-center whitespace-nowrap scale-90 sm:scale-100 origin-bottom">
            <span className="text-[9px] font-mono font-bold text-white/50 leading-none mb-0.5">DB_NODE_1</span>
            <span className="text-[9px] font-bold text-white/30 leading-none">0.4ms</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-white/2 border border-white/10 flex items-center justify-center transition-all">
            <Database size={12} className="text-white/40" />
          </div>
        </div>

        {/* Redis Node (15, 65) - Text BELOW */}
        <div
          className="absolute flex flex-col items-center group/node cursor-default z-20"
          style={{
            left: "15%",
            top: "65%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-7 h-7 rounded-full bg-white/2 border border-white/10 flex items-center justify-center transition-all">
            <CloudCheck size={12} className="text-white/40" />
          </div>
          <div className="absolute top-full mt-1.5 flex flex-col items-center whitespace-nowrap scale-90 sm:scale-100 origin-top">
            <span className="text-[9px] font-mono font-bold text-white/50 leading-none mb-0.5">CACHE_CTL</span>
            <span className="text-[9px] font-bold text-white/30 leading-none">0.1ms</span>
          </div>
        </div>

        {/* Central API Gateway (50, 50) - Text ABOVE */}
        <div
          className="absolute flex flex-col items-center group/api cursor-default z-20"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="absolute bottom-full mb-1.5 flex justify-center whitespace-nowrap">
            <span className="text-[9px] font-mono font-bold text-white/70 leading-none">API_GATEWAY</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-lg bg-[#050505] border border-white/15 shadow-sm flex items-center justify-center transition-all shrink-0"
          >
            <WifiHigh size={18} className="text-white/70" />
          </motion.div>
        </div>

        {/* Client Network (85, 50) - Text BELOW */}
        <div
          className="absolute flex flex-col items-center cursor-default z-20"
          style={{
            left: "85%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center bg-transparent shrink-0 relative transition-transform duration-300">
            <div className={cn("w-1.5 h-1.5 rounded-full bg-emerald-500 absolute transition-opacity duration-300", hovered ? "animate-ping opacity-100" : "opacity-0")} />
            <div className="w-1.5 h-1.5 rounded-full bg-white/40 absolute z-10" />
          </div>
          <div className="absolute top-full mt-1.5 flex justify-center whitespace-nowrap">
            <span className="text-[9px] font-mono font-bold text-zinc-600 leading-none">NETWORK</span>
          </div>
        </div>
      </div>

      {/* ═══ Business Pulse (Telemetry Readouts) ═══ */}
      <div className="relative z-10 flex-1 flex flex-col gap-2">
        <h4
          className={cn(
            "text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-2",
            isDark ? "text-zinc-500" : "text-gray-400",
          )}
        >
          <SquaresFour size={12} />
          Telemetry Metrics
        </h4>
        <div className="grid grid-cols-2 gap-2 flex-1 relative">
          {[
            {
              label: "SYS.PRODUCTS",
              value: dashboard?.total_products?.toString() ?? "—",
              id: 0,
            },
            {
              label: "SYS.CONV_RATE",
              value:
                dashboard?.conversion_rate != null
                  ? `${dashboard.conversion_rate.toFixed(1)}%`
                  : "—",
              id: 1,
            },
            {
              label: "SYS.AVG_ORD",
              value:
                dashboard != null && dashboard.total_orders > 0
                  ? `$${(dashboard.total_revenue / dashboard.total_orders).toFixed(0)}`
                  : "—",
              id: 2,
            },
            {
              label: "SYS.PERIOD",
              value: dashboard?.period?.toUpperCase() ?? "—",
              id: 3,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={cn(
                "relative flex flex-col justify-center px-3 py-2 rounded-sm border transition-all duration-300 group/pulse",
                isDark
                  ? "bg-[#09090b] border-white/5 hover:border-emerald-500/30"
                  : "bg-white border-gray-200 hover:border-emerald-400",
              )}
            >
              <div className="flex justify-between items-center w-full">
                <span
                  className={cn(
                    "text-[9px] font-mono font-medium tracking-tight",
                    isDark
                      ? "text-zinc-500 group-hover/pulse:text-emerald-500/80"
                      : "text-gray-400",
                  )}
                >
                  {stat.label}
                </span>
                <span className="w-1 h-1 rounded-sm bg-zinc-700 group-hover/pulse:bg-emerald-400 transition-colors" />
              </div>
              <span
                className={cn(
                  "text-base font-black font-mono tabular-nums leading-tight mt-1",
                  isDark
                    ? "text-white group-hover/pulse:text-emerald-50"
                    : "text-gray-900",
                )}
              >
                {stat.value}
              </span>

              {/* Dynamic Sparkline Footer */}
              <svg
                className="w-full h-2 mt-1 opacity-40 group-hover/pulse:opacity-100 transition-opacity"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d={sparklines[stat.id]}
                  stroke={isDark ? "#10b981" : "#059669"}
                  fill="none"
                  strokeWidth="1"
                />
              </svg>

              {/* HUD Target Brackets */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/0 group-hover/pulse:border-emerald-500/50 transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/0 group-hover/pulse:border-emerald-500/50 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Footer Graph ═══ */}
      <div
        className={cn(
          "relative z-10 pt-3 border-t",
          isDark ? "border-zinc-800/80" : "border-gray-200",
        )}
      >
        <div className="flex justify-between items-center mb-1">
          <span
            className={cn(
              "text-[9px] font-mono uppercase tracking-widest",
              isDark ? "text-zinc-500" : "text-gray-400",
            )}
          >
            Uptime: {health?.uptime ?? "—"}
          </span>
          <span
            className={cn(
              "text-[10px] font-bold font-mono tabular-nums",
              isDark ? "text-emerald-400" : "text-emerald-600",
            )}
          >
            {health?.status === "healthy" ? "99.999% SLA" : "0.00%"}
          </span>
        </div>
        <div className="h-4 w-full relative overflow-hidden rounded-sm opacity-50 group-hover:opacity-100 transition-opacity">
          <svg
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="uptmGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 5 L 20 5 L 22 1 L 24 9 L 26 5 L 45 5 L 47 2 L 49 8 L 51 5 L 80 5 L 82 0 L 84 10 L 86 5 L 100 5 M 100 5 L 100 10 L 0 10 Z"
              fill="url(#uptmGrad)"
              animate={{ x: hovered ? [-100, 0] : 0 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M 0 5 L 20 5 L 22 1 L 24 9 L 26 5 L 45 5 L 47 2 L 49 8 L 51 5 L 80 5 L 82 0 L 84 10 L 86 5 L 100 5"
              fill="none"
              stroke="#10b981"
              strokeWidth="0.5"
              animate={{ x: hovered ? [-100, 0] : 0 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
