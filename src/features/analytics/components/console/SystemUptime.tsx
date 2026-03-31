import React from "react";
import { motion } from "motion/react";
import { Pulse } from "@phosphor-icons/react";
import type { useAnalytics } from "@/features/analytics/hooks/useAnalytics";

type AnalyticsData = ReturnType<typeof useAnalytics>;

interface SystemUptimeProps {
  className?: string;
  isDark: boolean;
  stats: AnalyticsData["stats"];
}

const UptimeHudVisual = ({
  isDark,
  uptimeRatio,
  loadRatio,
}: {
  isDark: boolean;
  uptimeRatio: number; // 0..1
  loadRatio: number; // 0..1
}) => {
  const cx = 120;
  const cy = 120;

  const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
  const up = clamp01(uptimeRatio);
  const load = clamp01(loadRatio);
  const loss = 1 - up;

  // 2πr orbital math for progress rings
  const rOuter = 88;
  const rMid = 60;
  const rInner = 32;

  const cOuter = 2 * Math.PI * rOuter;
  const cMid = 2 * Math.PI * rMid;
  const cInner = 2 * Math.PI * rInner;

  const dashOuter = cOuter * up;
  const dashMid = cMid * (0.30 + load * 0.70);
  const dashInner = cInner * (1 - loss * 0.85);

  // Sweep geometry (sector points up in base pose; only the sweep group rotates)
  const spreadDeg = 26;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const a1 = -90 - spreadDeg / 2;
  const a2 = -90 + spreadDeg / 2;
  const x1 = cx + Math.cos(toRad(a1)) * rOuter;
  const y1 = cy + Math.sin(toRad(a1)) * rOuter;
  const x2 = cx + Math.cos(toRad(a2)) * rOuter;
  const y2 = cy + Math.sin(toRad(a2)) * rOuter;

  const sweepAngleOffset = (up - 0.5) * 90; // deg

  // Deterministic nodes
  const nodeAngles = [0.2, 1.7, 3.1, 4.8, 6.2].map(
    (a, i) => a + i * up * 0.12 - load * 0.08,
  );
  const nodeOrbitA = 74 + 12 * up;
  const nodeOrbitB = 54 + 14 * load;

  const cyan = isDark ? "#22d3ee" : "#0891b2";
  const cyanSoft = isDark
    ? "rgba(34,211,238,0.35)"
    : "rgba(8,145,178,0.25)";
  const whiteSoft = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden mix-blend-screen">
      <svg viewBox="0 0 240 240" className="w-[180px] h-[180px] opacity-80">
        <defs>
          <filter id="uptimeGlowCyan">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="uptimeSweep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0)" />
            <stop offset="55%" stopColor={cyanSoft} />
            <stop offset="100%" stopColor={cyan} stopOpacity="0.85" />
          </linearGradient>

          <radialGradient id="uptimeCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={cyan} stopOpacity="0.55" />
            <stop offset="60%" stopColor={cyan} stopOpacity="0.12" />
            <stop offset="100%" stopColor={cyan} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Telemetry crosshair */}
        <g strokeDasharray="2 6" stroke={whiteSoft} strokeWidth="1">
          <line x1={cx} y1="16" x2={cx} y2="224" />
          <line x1="16" y1={cy} x2="224" y2={cy} />
          {[0, 45, 90, 135].map((deg) => (
            <line
              key={deg}
              x1={cx}
              y1="18"
              x2={cx}
              y2="30"
              transform={`rotate(${deg} ${cx} ${cy})`}
              opacity="0.8"
            />
          ))}
        </g>

        {/* Static base rings */}
        <g fill="none">
          <circle cx={cx} cy={cy} r={rOuter} stroke={whiteSoft} strokeWidth="1.2" />
          <circle
            cx={cx}
            cy={cy}
            r={rMid}
            stroke={whiteSoft}
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          <circle
            cx={cx}
            cy={cy}
            r={rInner}
            stroke={whiteSoft}
            strokeWidth="1.2"
            strokeDasharray="2 8"
          />
        </g>

        {/* Progress rings (rotisserie via dash offset phase, not transforms) */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={rOuter}
          fill="none"
          stroke={cyanSoft}
          strokeWidth="1.4"
          strokeDasharray={`${dashOuter} ${cOuter - dashOuter}`}
          filter="url(#uptimeGlowCyan)"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: [0, -cOuter * 0.08, -cOuter * 0.16] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={rMid}
          fill="none"
          stroke={cyan}
          strokeWidth="1.1"
          strokeDasharray={`${dashMid} ${cMid - dashMid}`}
          opacity={0.85}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: [0, -cMid * 0.12, -cMid * 0.24] }}
          transition={{ duration: 7.2, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={rInner}
          fill="none"
          stroke={cyan}
          strokeWidth="1.6"
          strokeDasharray={`${dashInner} ${cInner - dashInner}`}
          opacity={0.65}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: [0, -cInner * 0.10, -cInner * 0.20] }}
          transition={{ duration: 8.4, repeat: Infinity, ease: "linear" }}
        />

        {/* Sweep needle: rotate natively around (cx, cy) */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`${sweepAngleOffset} ${cx} ${cy}`}
            to={`${sweepAngleOffset + 360} ${cx} ${cy}`}
            dur={`${6 + (1 - up) * 8}s`}
            repeatCount="indefinite"
          />
          <path
            d={`M ${cx} ${cy} L ${x1} ${y1} L ${x2} ${y2} Z`}
            fill="url(#uptimeSweep)"
            opacity={0.62}
          />
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - rOuter}
            stroke={cyan}
            strokeWidth="2.4"
            filter="url(#uptimeGlowCyan)"
            opacity={0.9}
          />
        </g>

        {/* HUD nodes */}
        {nodeAngles.map((a, i) => {
          const orbit = i % 2 === 0 ? nodeOrbitA : nodeOrbitB;
          const x = cx + Math.cos(a) * orbit;
          const y = cy + Math.sin(a) * orbit;
          const alpha = 0.35 + up * 0.45;

          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={i === 0 ? 4.2 : 2.7}
              fill={cyan}
              opacity={alpha}
              filter="url(#uptimeGlowCyan)"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{
                scale: [0.75, i === 0 ? 1.65 : 1.25, 0.75],
                opacity: [0.05, alpha, 0.05],
              }}
              transition={{
                duration: 2.6 + i * 0.35,
                repeat: Infinity,
                delay: i * 0.22,
              }}
            />
          );
        })}

        {/* Core + telemetry labels */}
        <circle cx={cx} cy={cy} r="10" fill="url(#uptimeCore)" opacity={isDark ? 1 : 0.85} />
        <motion.circle
          cx={cx}
          cy={cy}
          r="4"
          fill={cyan}
          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          filter="url(#uptimeGlowCyan)"
        />

        <g
          fontFamily="monospace"
          fontSize="10"
          opacity={isDark ? 0.75 : 0.6}
          fill={isDark ? "#cffafe" : "#0e7490"}
        >
          <text x="16" y="22">
            [v2.4]
          </text>
          <text x="16" y="224">
            SYS.OP.01
          </text>
          <text x="208" y="46" textAnchor="end">
            X:{Math.round(10 + up * 68)}
          </text>
        </g>
      </svg>
    </div>
  );
};

export const SystemUptime = React.memo(
  ({ className, isDark, stats }: SystemUptimeProps) => {
    const nodesTotal = stats?.total_licenses ?? 0;
    const nodesActive = stats?.active_licenses ?? 0;
    const totalUsers = stats?.total_users ?? 0;
    const activeUsers = stats?.active_users ?? 0;

    // HUD semantics: nodes are licenses; "uptime" is user-health ratio.
    const uptimeRatio =
      totalUsers > 0
        ? activeUsers / totalUsers
        : nodesTotal > 0
          ? nodesActive / nodesTotal
          : 0;
    const loadRatio =
      nodesTotal > 0 ? nodesActive / nodesTotal : uptimeRatio;

    const lossRatio = 1 - uptimeRatio;
    const lossPct = Math.max(0, Math.min(100, lossRatio * 100));

    const latencyMsBase = 14 + loadRatio * 22 + lossRatio * 48; // ~14..84
    const p50 = Math.max(1, latencyMsBase * (0.72 + uptimeRatio * 0.25));
    const _p99 = Math.max(1, latencyMsBase * (1.07 + lossRatio * 0.95));
    const status =
      uptimeRatio >= 0.99
        ? "Excellent"
        : uptimeRatio >= 0.96
          ? "Stable"
          : uptimeRatio >= 0.92
            ? "Degraded"
            : "Critical";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-card overflow-hidden p-6 group flex flex-col relative ${
          isDark
            ? "bg-[#09090b] border border-white/10 hover:border-cyan-500/30"
            : "bg-white border border-gray-100 shadow-lg hover:border-cyan-500/20"
        } ${className}`}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern
              id="grid-pattern"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="flex items-start justify-between relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-7 h-7 flex items-center justify-center rounded-input ${
                isDark 
                  ? "bg-linear-to-b from-white/8 to-transparent border border-white/8 text-cyan-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]" 
                  : "bg-linear-to-b from-white to-gray-50 border border-gray-200 text-cyan-600 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]"
              }`}
            >
              <Pulse className="w-4 h-4" />
            </div>
            <h3
              className={`text-[10px] font-black uppercase tracking-widest ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              System Uptime
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] font-bold uppercase tracking-wider ${
                isDark ? "text-cyan-400" : "text-cyan-700"
              }`}
            >
              {status}
            </span>
            <div
              className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.55)] ${
                lossPct > 8 ? "bg-rose-400" : "bg-cyan-400"
              }`}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center relative z-10 my-4">
          <UptimeHudVisual
            isDark={isDark}
            uptimeRatio={uptimeRatio}
            loadRatio={loadRatio}
          />
          <div className="flex flex-col items-center bg-background/60 backdrop-blur-md px-5 py-3 rounded-full border border-white/5 relative z-10 shadow-lg">
            <div
              className={`text-3xl font-black tracking-tighter tabular-nums leading-none ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {nodesActive}
              <span className="text-xl opacity-40">/{nodesTotal}</span>
            </div>
            <div
              className={`text-[9px] font-black uppercase tracking-widest opacity-60 mt-1 ${
                isDark ? "text-cyan-300" : "text-cyan-700"
              }`}
            >
              Nodes Online · {Math.round(uptimeRatio * 100)}% Uptime
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between relative z-10 shrink-0">
          <div className="flex flex-col gap-1">
            <span
              className={`text-[9px] font-bold uppercase tracking-widest opacity-50 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Latency
            </span>
            <div className="flex items-center gap-2">
              <svg width="24" height="12" viewBox="0 0 24 12" className="opacity-80">
                <motion.polyline 
                  points="0,6 4,6 8,2 12,10 16,6 24,6" 
                  fill="none" stroke={isDark ? "#22d3ee" : "#0891b2"} strokeWidth="1.5" strokeLinejoin="round" 
                  initial={{ strokeDasharray: "40", strokeDashoffset: "40" }}
                  animate={{ strokeDashoffset: ["40", "0", "-40"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </svg>
              <span
                className={`text-[11px] font-mono font-bold tracking-tight ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {nodesTotal
                  ? `${Math.round(p50)}ms`
                  : "—"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <span
              className={`text-[9px] font-bold uppercase tracking-widest opacity-50 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Loss
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-mono font-bold tracking-tight ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {nodesTotal ? `${lossPct.toFixed(1)}%` : "0.0%"}
              </span>
              <svg width="16" height="12" viewBox="0 0 16 12">
                <rect
                  x="0"
                  y="8"
                  width="3"
                  height="4"
                  fill={isDark ? "#22d3ee" : "#0891b2"}
                  rx="1.5"
                  opacity={lossPct > 8 ? 0.95 : 0.55}
                />
                <rect
                  x="6"
                  y="4"
                  width="3"
                  height="8"
                  fill={isDark ? "#22d3ee" : "#0891b2"}
                  opacity={lossPct > 16 ? 0.45 : 0.28}
                  rx="1.5"
                />
                <rect
                  x="12"
                  y="0"
                  width="3"
                  height="12"
                  fill={isDark ? "#22d3ee" : "#0891b2"}
                  opacity={lossPct > 30 ? 0.22 : 0.12}
                  rx="1.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

SystemUptime.displayName = "SystemUptime";
