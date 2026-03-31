"use client";

import React, { useState } from "react";
import { TrendUp, TrendDown } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { cn } from "@/lib/utils";

// ─── Crystal Enterprise Design System ───────────────────────────
//
// Glassmorphism 2.0 + Spatial Design — premium card foundation.
//
// Techniques applied:
// 1. Frosted glass: backdrop-blur-xl + <5% opacity bg
// 2. Inner refraction: radial gradient simulating light on glass
// 3. Accent top-edge: 1.5px gradient bar keyed per card
// 4. Crystal highlight: 1px top line simulating refraction edge
// 5. Depth micro-interaction: translate-y(-1px) on hover
// 6. Dense typography: 10px labels → 30px values → 10px delta
// ─────────────────────────────────────────────────────────────────

type Accent = "cyan" | "emerald" | "violet" | "amber" | "rose";

const ACCENT_CONFIG: Record<
  Accent,
  {
    gradient: string;
    iconDark: string;
    iconLight: string;
    bgDark: string;
    bgLight: string;
  }
> = {
  cyan: {
    gradient: "from-cyan-400 via-cyan-500 to-blue-500",
    iconDark: "text-cyan-400",
    iconLight: "text-cyan-600",
    bgDark: "bg-cyan-500/10",
    bgLight: "bg-cyan-50",
  },
  emerald: {
    gradient: "from-emerald-400 via-emerald-500 to-teal-500",
    iconDark: "text-emerald-400",
    iconLight: "text-emerald-600",
    bgDark: "bg-emerald-500/10",
    bgLight: "bg-emerald-50",
  },
  violet: {
    gradient: "from-violet-400 via-violet-500 to-purple-500",
    iconDark: "text-violet-400",
    iconLight: "text-violet-600",
    bgDark: "bg-violet-500/10",
    bgLight: "bg-violet-50",
  },
  amber: {
    gradient: "from-amber-400 via-amber-500 to-orange-500",
    iconDark: "text-amber-400",
    iconLight: "text-amber-600",
    bgDark: "bg-amber-500/10",
    bgLight: "bg-amber-50",
  },
  rose: {
    gradient: "from-rose-400 via-rose-500 to-pink-500",
    iconDark: "text-rose-400",
    iconLight: "text-rose-600",
    bgDark: "bg-rose-500/10",
    bgLight: "bg-rose-50",
  },
};

// ─── GlassPanel ─────────────────────────────────────────────────
// Frosted crystal surface. Foundation for ALL dashboard cards.
// Reusable: metric cards, chart panels, health monitors, etc.

interface GlassPanelProps {
  children: React.ReactNode;
  accent?: Accent;
  className?: string;
  noPadding?: boolean;
}

export function GlassPanel({
  children,
  accent,
  className,
  noPadding = false,
}: GlassPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "group/glass relative overflow-hidden rounded-xl border transition-all duration-300 ease-out",
        // Frosted glass surface
        isDark
          ? "bg-white/[0.03] backdrop-blur-xl border-white/[0.07]"
          : "bg-white/80 backdrop-blur-xl border-gray-200/60 shadow-sm",
        // Depth micro-interaction
        "hover:-translate-y-px",
        isDark
          ? "hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          : "hover:border-gray-300/60 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      {/* Accent top edge — 1.5px gradient bar */}
      {accent && (
        <div
          className={cn(
            "absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r opacity-50 group-hover/glass:opacity-90 transition-opacity duration-300",
            ACCENT_CONFIG[accent].gradient,
          )}
        />
      )}

      {/* Inner refraction — radial light from top-left on hover */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 group-hover/glass:opacity-100 transition-opacity duration-500",
          isDark
            ? "bg-[radial-gradient(ellipse_80%_50%_at_20%_-10%,rgba(255,255,255,0.04),transparent)]"
            : "bg-[radial-gradient(ellipse_80%_50%_at_20%_-10%,rgba(0,100,255,0.02),transparent)]",
        )}
      />

      {/* Crystal edge highlight — 1px refraction line */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 h-px",
          accent ? "top-[1.5px]" : "top-0",
          isDark
            ? "bg-gradient-to-r from-white/[0.06] via-white/[0.02] to-transparent"
            : "bg-gradient-to-r from-white via-white/60 to-transparent",
        )}
      />

      <div
        className={cn("relative z-10", noPadding ? "h-full" : "px-4 py-4")}
      >
        {children}
      </div>
    </div>
  );
}

// ─── MetricCard ─────────────────────────────────────────────────
// Enterprise KPI card. Individual frosted glass panel with
// accent-keyed icon, dense value display, and delta badge.

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  icon?: React.ReactElement;
  accent?: Accent;
  className?: string;
}

export function MetricCard({
  label,
  value,
  delta,
  deltaUp = true,
  icon,
  accent = "cyan",
  className,
}: MetricCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const ac = ACCENT_CONFIG[accent];

  return (
    <GlassPanel accent={accent} className={className}>
      {/* Icon + Label */}
      <div className="flex items-center gap-2 mb-2.5">
        {icon && (
          <div
            className={cn(
              "w-6 h-6 rounded-lg flex items-center justify-center ring-1 ring-inset transition-colors duration-200",
              isDark
                ? `${ac.bgDark} ring-white/[0.06]`
                : `${ac.bgLight} ring-black/[0.04]`,
            )}
          >
            {React.cloneElement(
              icon as React.ReactElement<{
                size?: number;
                className?: string;
                weight?: string;
              }>,
              {
                size: 13,
                className: isDark ? ac.iconDark : ac.iconLight,
                weight: "bold",
              },
            )}
          </div>
        )}
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.12em]",
            isDark ? "text-gray-500" : "text-gray-400",
          )}
        >
          {label}
        </span>
      </div>

      {/* Value — dominant number */}
      <div
        className={cn(
          "text-2xl font-black tracking-tight tabular-nums leading-none",
          isDark ? "text-white" : "text-gray-900",
        )}
      >
        {value}
      </div>

      {/* Delta badge */}
      {delta && (
        <div className="flex items-center gap-2 mt-4">
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tabular-nums ring-1 ring-inset",
              deltaUp
                ? isDark
                  ? "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20"
                  : "text-emerald-600 bg-emerald-50 ring-emerald-200"
                : isDark
                  ? "text-red-400 bg-red-500/10 ring-red-500/20"
                  : "text-red-600 bg-red-50 ring-red-200",
            )}
          >
            {deltaUp ? (
              <TrendUp size={10} weight="bold" />
            ) : (
              <TrendDown size={10} weight="bold" />
            )}
            {delta}
          </div>
          <span
            className={cn(
              "text-[10px] font-medium",
              isDark ? "text-gray-600" : "text-gray-400",
            )}
          >
            vs prev period
          </span>
        </div>
      )}
    </GlassPanel>
  );
}

// ─── PulseCard ──────────────────────────────────────────────────
// A completely unique KPI card design — NOT the same glassmorphism.
// Horizontal layout · Animated ring indicator · Radial pulse dot
// ────────────────────────────────────────────────────────────────

type PulseAccent = "blue" | "emerald" | "violet" | "amber" | "rose";

const PULSE_COLORS: Record<
  PulseAccent,
  {
    dot: string;
    dotGlow: string;
    ring: string;
    ringTrack: string;
    iconDark: string;
    iconLight: string;
    labelDark: string;
    labelLight: string;
  }
> = {
  blue: {
    dot: "bg-blue-400",
    dotGlow: "shadow-[0_0_8px_rgba(96,165,250,0.6)]",
    ring: "stroke-blue-400",
    ringTrack: "stroke-blue-400/10",
    iconDark: "text-blue-400",
    iconLight: "text-blue-600",
    labelDark: "text-blue-400/60",
    labelLight: "text-blue-600/60",
  },
  emerald: {
    dot: "bg-emerald-400",
    dotGlow: "shadow-[0_0_8px_rgba(52,211,153,0.6)]",
    ring: "stroke-emerald-400",
    ringTrack: "stroke-emerald-400/10",
    iconDark: "text-emerald-400",
    iconLight: "text-emerald-600",
    labelDark: "text-emerald-400/60",
    labelLight: "text-emerald-600/60",
  },
  violet: {
    dot: "bg-violet-400",
    dotGlow: "shadow-[0_0_8px_rgba(167,139,250,0.6)]",
    ring: "stroke-violet-400",
    ringTrack: "stroke-violet-400/10",
    iconDark: "text-violet-400",
    iconLight: "text-violet-600",
    labelDark: "text-violet-400/60",
    labelLight: "text-violet-600/60",
  },
  amber: {
    dot: "bg-amber-400",
    dotGlow: "shadow-[0_0_8px_rgba(251,191,36,0.6)]",
    ring: "stroke-amber-400",
    ringTrack: "stroke-amber-400/10",
    iconDark: "text-amber-400",
    iconLight: "text-amber-600",
    labelDark: "text-amber-400/60",
    labelLight: "text-amber-600/60",
  },
  rose: {
    dot: "bg-rose-400",
    dotGlow: "shadow-[0_0_8px_rgba(251,113,133,0.6)]",
    ring: "stroke-rose-400",
    ringTrack: "stroke-rose-400/10",
    iconDark: "text-rose-400",
    iconLight: "text-rose-600",
    labelDark: "text-rose-400/60",
    labelLight: "text-rose-600/60",
  },
};

interface PulseCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  icon?: React.ReactElement;
  accent?: PulseAccent;
  /** 0-100 ring fill percentage (e.g. active/total ratio) */
  ringPercent?: number;
  className?: string;
}

export function PulseCard({
  label,
  value,
  delta,
  deltaUp = true,
  icon,
  accent = "blue",
  ringPercent = 0,
  className,
}: PulseCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const pc = PULSE_COLORS[accent];
  const [isHovered, setIsHovered] = useState(false);

  // SVG ring math
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(ringPercent, 100) / 100) * circumference;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-300 overflow-hidden",
        isDark
          ? "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/80"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm",
        className,
      )}
    >
      {/* Noise texture overlay */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay",
          "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]",
        )}
      />

      {/* Ring indicator with icon */}
      <div className="relative shrink-0 w-11 h-11 flex items-center justify-center">
        {/* SVG ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width="44"
          height="44"
          viewBox="0 0 44 44"
        >
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            className={pc.ringTrack}
            strokeWidth="2"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            className={cn(pc.ring, "transition-all duration-700 ease-out")}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>

        {/* Icon */}
        {icon && (
          <div className="relative z-10">
            {React.cloneElement(
              icon as React.ReactElement<{
                size?: number;
                className?: string;
                weight?: string;
                isHovered?: boolean;
              }>,
              {
                size: 16,
                className: isDark ? pc.iconDark : pc.iconLight,
                weight: "bold",
                isHovered,
              },
            )}
          </div>
        )}

        {/* Pulse dot */}
        <div
          className={cn(
            "absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full",
            pc.dot,
            pc.dotGlow,
            "animate-pulse",
          )}
        />
      </div>

      {/* Center: value + label */}
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            "block text-[10px] font-semibold uppercase tracking-[0.14em]",
            isDark ? "text-zinc-500" : "text-gray-400",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "block text-xl font-black tracking-tight tabular-nums leading-tight mt-0.5",
            isDark ? "text-white" : "text-gray-900",
          )}
        >
          {value}
        </span>
      </div>

      {/* Right: delta */}
      {delta && (
        <div className="shrink-0 flex flex-col items-end">
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tabular-nums ring-1 ring-inset",
              deltaUp
                ? isDark
                  ? "text-emerald-400 bg-emerald-500/8 ring-emerald-500/15"
                  : "text-emerald-600 bg-emerald-50 ring-emerald-200"
                : isDark
                  ? "text-red-400 bg-red-500/8 ring-red-500/15"
                  : "text-red-600 bg-red-50 ring-red-200",
            )}
          >
            {deltaUp ? (
              <TrendUp size={9} weight="bold" />
            ) : (
              <TrendDown size={9} weight="bold" />
            )}
            {delta}
          </div>
        </div>
      )}
    </div>
  );
}
