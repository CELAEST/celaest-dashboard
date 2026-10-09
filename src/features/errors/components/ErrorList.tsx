import React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Pulse,
  ArrowCounterClockwise,
  Check,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";
import {
  ErrorLog,
  ErrorStatus,
} from "@/features/errors/hooks/useErrorMonitoring";
import { ErrorListItem } from "./ErrorListItem";

interface ErrorListProps {
  errors: ErrorLog[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  expandedError: string | null;
  toggleErrorExpansion: (errorId: string) => void;
  onStatusUpdate: (errorId: string, status: ErrorStatus) => Promise<void>;
  onClearFilters: () => void;
  isAdmin: boolean;
}

// Custom Bespoke Holographic SVG for Clean State (Obsidian Luxury Standard)
const SecureSystemVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[104px] h-[104px] overflow-visible">
    <defs>
      <linearGradient id="celaestObsidianShield" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#71717a" stopOpacity="0.4" />
      </linearGradient>
      <radialGradient id="celaestCenterGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    <motion.g animate={{ y: [-1.5, 1.5, -1.5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
      {/* Ambient Radial Fill with Pure Luminance Aura */}
      <circle cx="50" cy="50" r="46" fill="url(#celaestCenterGlow)" />

      {/* Outer Precision Reticle Ring with Dashed Segments */}
      <motion.circle 
        cx="50" cy="50" r="46" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="6 8"
        animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />

      {/* Inner Fine Calibration Ring */}
      <motion.circle 
        cx="50" cy="50" r="38" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.2" strokeDasharray="60 120"
        animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
        strokeLinecap="round"
      />

      {/* Geometric Reticle Crosshairs */}
      <line x1="50" y1="6" x2="50" y2="14" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" />
      <line x1="50" y1="86" x2="50" y2="94" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" />
      <line x1="6" y1="50" x2="14" y2="50" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" />
      <line x1="86" y1="50" x2="94" y2="50" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" />

      {/* Sleek Obsidian Shield Frame */}
      <motion.g
        animate={{ scale: [1, 1.025, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      >
        <path 
          d="M50 20 L24 28 V48 C24 67 36 82 50 88 C64 82 76 67 76 48 V28 Z" 
          fill="rgba(255, 255, 255, 0.04)" 
          stroke="url(#celaestObsidianShield)" 
          strokeWidth="1.6" 
          strokeLinejoin="round"
        />

        <path 
          d="M50 26 L30 32 V48 C30 63 39 75 50 80 C61 75 70 63 70 48 V32 Z" 
          fill="none" 
          stroke="rgba(255, 255, 255, 0.2)" 
          strokeWidth="1" 
          strokeDasharray="3 3"
          strokeLinejoin="round" 
        />

        {/* Dynamic Razor Checkmark with Pure Luminance */}
        <motion.path 
          d="M40 52 L47 59 L62 44" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      </motion.g>
    </motion.g>
  </svg>
);

// Custom Bespoke Holographic SVG for Filter State (Pure Luminance Reticle)
const FilteredMonitorVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[104px] h-[104px] overflow-visible">
    <motion.g animate={{ y: [-1.5, 1.5, -1.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="3 5" />
      <motion.circle 
        cx="50" cy="50" r="36" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" strokeDasharray="40 20"
        animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }} 
      />
      <motion.g animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "center" }}>
        <circle cx="46" cy="46" r="16" fill="rgba(255, 255, 255, 0.05)" stroke="#ffffff" strokeWidth="2" />
        <line x1="58" y1="58" x2="74" y2="74" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <line x1="36" y1="46" x2="56" y2="46" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="46" y1="36" x2="46" y2="56" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="2 2" />
      </motion.g>
    </motion.g>
  </svg>
);

// Sidebar Icons for Empty State Cards (Obsidian Luminance Standard)
const TechStreamIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/90">
    <motion.path 
      d="M3 12h4l3 -6l4 12l3 -6h4" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);

const SecurityShieldIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/90">
    <path 
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
      fill="rgba(255, 255, 255, 0.05)" 
      stroke="currentColor" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M9 12l2 2 4-4" 
      fill="none" 
      stroke="#ffffff" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

const FilterLensIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/90">
    <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ResetSyncIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/90">
    <path 
      d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path d="M3 3v5h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * ErrorList - Componente para mostrar una lista de registros de errores.
 * Decomprimido para seguir el principio SRP y facilitar el mantenimiento.
 *
 * Cumple con:
 * - SRP: Lógica delegada a sub-componentes.
 * - Accesibilidad: Usa <ul> y <li> para navegación semántica.
 * - UX Invisible: Maneja estados vacíos amigables estilo HUD CELAEST.
 * - Perf: React.memo y AnimatePresence mode="popLayout".
 */
export const ErrorList = React.memo(
  ({
    errors,
    isLoading,
    hasActiveFilters,
    expandedError,
    toggleErrorExpansion,
    onStatusUpdate,
    onClearFilters,
    isAdmin,
  }: ErrorListProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const t = useTranslations("error_monitor");

    const emptyStateCards = hasActiveFilters
      ? [
          {
            icon: <FilterLensIcon />,
            label: t("filtered_view"),
            title: t("active_filters_limiting"),
            description: t("search_conditions_hiding"),
          },
          {
            icon: <ResetSyncIcon />,
            label: t("spectrum_recovery"),
            title: t("restore_full_transmission"),
            description: t("clear_search_params"),
          },
        ]
      : [
          {
            icon: <TechStreamIcon />,
            label: t("live_stream"),
            title: t("active_event_signal"),
            description: t("telemetry_operative"),
          },
          {
            icon: <SecurityShieldIcon />,
            label: t("panel_status"),
            title: t("attack_surface_contained"),
            description: t("no_deviations"),
          },
        ];

    const emptyStateBadgeClass = isDark
      ? "bg-white/[0.08] text-white border border-white/10 font-semibold shadow-xs"
      : "bg-gray-100 text-gray-900 border-gray-300";

    const emptyStateSurfaceClass = isDark
      ? "bg-[#080c14]/90 border-white/8 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      : "bg-white border-gray-200 shadow-xl shadow-gray-200/40";

    if (isLoading) {
      return (
        <div className="h-full w-full p-4 md:p-5">
          <div
            className={`h-full w-full rounded-3xl border p-5 md:p-6 ${
              isDark ? "bg-white/3 border-white/8" : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="mb-5 flex items-center gap-2">
              <Pulse
                size={14}
                className={
                  isDark
                    ? "text-white animate-pulse"
                    : "text-blue-600 animate-pulse"
                }
              />
              <span
                className={`text-[9px] font-black uppercase tracking-[0.24em] ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                {t("intercepting_signal")}
              </span>
            </div>

            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border p-5 ${
                    isDark ? "bg-white/3 border-white/5" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-1.5 rounded-full ${
                        isDark ? "bg-white/10" : "bg-gray-200"
                      }`}
                    />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-5 w-16 rounded-md ${
                            isDark ? "bg-white/8" : "bg-gray-200"
                          }`}
                        />
                        <div
                          className={`h-5 w-24 rounded-md ${
                            isDark ? "bg-white/8" : "bg-gray-200"
                          }`}
                        />
                      </div>
                      <div
                        className={`h-5 w-3/5 rounded-md ${
                          isDark ? "bg-white/8" : "bg-gray-200"
                        }`}
                      />
                      <div
                        className={`h-4 w-2/5 rounded-md ${
                          isDark ? "bg-white/6" : "bg-gray-100"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (errors.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-full w-full min-w-0 p-4 md:p-5"
        >
          <div
            className={`relative h-full w-full overflow-y-auto md:overflow-hidden custom-scrollbar rounded-3xl border p-4 md:p-6 transition-all duration-300 ${
              isDark
                ? "bg-[#040811] border-white/10 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"
                : "bg-gray-50/80 border-gray-200"
            }`}
          >
            {/* Ambient pure luminance aura */}
            <div
              className={`pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full blur-[130px] ${
                isDark ? "bg-white/[0.03]" : "bg-gray-200/40"
              }`}
            />

            <div className="relative mx-auto flex min-h-full w-full max-w-5xl items-center justify-center py-6 md:py-0">
              <div
                className={`w-full min-w-0 overflow-visible lg:overflow-hidden rounded-3xl border p-6 sm:p-8 md:p-10 ${emptyStateSurfaceClass}`}
              >
                <div className="grid gap-8 lg:grid-cols-[1fr_minmax(18rem,22rem)] xl:grid-cols-[1fr_max(22rem,320px)] items-center">
                  <div className="min-w-0 text-center lg:text-left">
                    <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase font-semibold ${emptyStateBadgeClass}`}
                      >
                        <Check size={11} strokeWidth={3} className="text-white/80" />
                        {hasActiveFilters
                          ? "FILTROS ACTIVOS"
                          : "SISTEMA 100% OPERATIVO"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase ${
                          isDark
                            ? "border-white/10 bg-white/[0.03] text-white/60"
                            : "border-gray-200 bg-white text-gray-500"
                        }`}
                      >
                        <Pulse size={12} className="shrink-0 text-white/60" />
                        {hasActiveFilters
                          ? "ANÁLISIS DE FILTRO"
                          : "TELEMETRÍA EN VIVO"}
                      </span>
                    </div>

                    <div className="mt-8 flex justify-center lg:justify-start">
                      <div className="relative flex items-center justify-center p-2 isolate">
                        {hasActiveFilters ? <FilteredMonitorVisual /> : <SecureSystemVisual />}
                      </div>
                    </div>

                    <div className="mt-6 flex w-full max-w-[480px] flex-col gap-2.5">
                      <h3
                        className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {hasActiveFilters
                          ? t("no_params_match")
                          : t("all_clean_now")}
                      </h3>

                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          isDark ? "text-white/50" : "text-gray-500"
                        }`}
                      >
                        {hasActiveFilters
                          ? t("adjust_params")
                          : t("clean_signal")}
                      </p>

                      {/* Telemetry HUD status indicators */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/6 text-[10px] font-mono tracking-wider text-white/50 uppercase">
                          Incidentes: <strong className="text-white font-semibold">0</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/6 text-[10px] font-mono tracking-wider text-white/50 uppercase">
                          Buffer: <strong className="text-white font-semibold">Operativo</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/6 text-[10px] font-mono tracking-wider text-white/50 uppercase">
                          Integridad: <strong className="text-white font-semibold">100%</strong>
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                      {hasActiveFilters ? (
                        <button
                          onClick={onClearFilters}
                          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer"
                        >
                          <ArrowCounterClockwise size={13} weight="bold" />
                          {t("clear_and_scan")}
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase ${
                            isDark
                              ? "border-white/10 bg-white/[0.03] text-white/60 font-medium"
                              : "border-gray-200 bg-white text-gray-600"
                          }`}
                        >
                          <Pulse size={12} className="shrink-0 text-white/60" />
                          {t("waiting_anomalies")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {emptyStateCards.map((card, idx) => (
                      <div
                        key={card.title}
                        className={`group rounded-2xl border p-4.5 text-left transition-all duration-300 ${
                          isDark
                            ? "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                              isDark
                                ? "bg-white/[0.05] border-white/10 text-white"
                                : "bg-white border-gray-200 text-gray-900 shadow-sm"
                            }`}
                          >
                            {card.icon}
                          </div>

                          <div className="min-w-0 mt-0.5">
                            <p
                              className={`text-[9px] font-mono tracking-[0.18em] uppercase ${
                                isDark ? "text-white/40" : "text-gray-400"
                              }`}
                            >
                              {card.label}
                            </p>
                            <h4
                              className={`mt-0.5 font-sans text-sm font-semibold tracking-tight ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {card.title}
                            </h4>
                          </div>
                        </div>

                        <p
                          className={`mt-3 text-xs leading-relaxed ${
                            isDark ? "text-white/50" : "text-gray-500"
                          }`}
                        >
                          {card.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="h-full overflow-y-auto p-4 custom-scrollbar">
        <ul className="m-0 list-none space-y-3 p-0">
          <AnimatePresence mode="popLayout">
            {errors.map((error, index) => (
              <ErrorListItem
                key={error.id}
                error={error}
                index={index}
                expandedError={expandedError}
                toggleErrorExpansion={toggleErrorExpansion}
                onStatusUpdate={onStatusUpdate}
                isAdmin={isAdmin}
                isDark={isDark}
              />
            ))}
          </AnimatePresence>
        </ul>
      </div>
    );
  },
);

ErrorList.displayName = "ErrorList";