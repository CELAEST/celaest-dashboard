import React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Pulse,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
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

// Custom Bespoke Holographic SVG for Clean State (Main)
// Custom Bespoke Holographic SVG for Clean State (Main)
const SecureSystemVisual = () => (
  <svg viewBox="0 10 100 80" className="w-[85px] h-[85px] overflow-visible drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
        <stop offset="100%" stopColor="#0891b2" stopOpacity="0.8" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
      
      {/* Outer Partial Arc Ring */}
      <motion.circle 
        cx="50" cy="50" r="47" fill="none" stroke="#0891b2" strokeWidth="2" strokeDasharray="70 200"
        animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
        strokeLinecap="round"
      />
      
      {/* Inner Dotted Ring */}
      <motion.circle 
        cx="50" cy="50" r="41" fill="none" stroke="#0e7490" strokeWidth="2.5" strokeDasharray="3 10"
        animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />
      
      {/* Subtle Background Inner Ring */}
      <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(34, 211, 238, 0.08)" strokeWidth="1.5" />

      {/* Futuristic Shield */}
      <motion.g
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      >
        {/* Outer Glowing Shield Boundary */}
        <path 
          d="M50 18 L20 26 V48 C20 70 33 86 50 92 C67 86 80 70 80 48 V26 Z" 
          fill="rgba(34, 211, 238, 0.04)" 
          stroke="url(#shieldGrad)" 
          strokeWidth="3.5" 
          filter="url(#glow)"
          strokeLinejoin="round"
        />
        
        {/* Inner Solid Shield Edge */}
        <path 
          d="M50 25 L27 31 V48 C27 65 37 78 50 83 C63 78 73 65 73 48 V31 Z" 
          fill="rgba(34, 211, 238, 0.08)" 
          stroke="#22d3ee" 
          strokeWidth="1.5"
          strokeLinejoin="round" 
        />
        
        {/* Central Sharp Checkmark */}
        <motion.path 
          d="M38 52 L46 60 L66 40" 
          fill="none" 
          stroke="#cffafe" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
          filter="url(#glow)"
        />
      </motion.g>
    </motion.g>
  </svg>
);

// Custom Bespoke Holographic SVG for Filter State (Main)
const FilteredMonitorVisual = () => (
  <svg viewBox="0 10 100 80" className="w-[85px] h-[85px] overflow-visible drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
    <defs>
      <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#b45309" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(245, 158, 11, 0.1)" strokeWidth="1" strokeDasharray="2 4" />
      <motion.circle 
        cx="50" cy="50" r="32" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="2" strokeDasharray="20 10"
        animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }} 
      />
      <motion.g animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "center" }}>
        <circle cx="44" cy="44" r="16" fill="rgba(245, 158, 11, 0.05)" stroke="url(#searchGrad)" strokeWidth="2.5" />
        <line x1="56" y1="56" x2="72" y2="72" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round" />
        <motion.line x1="28" y1="44" x2="60" y2="44" stroke="#fde68a" strokeWidth="1" strokeDasharray="2 2" animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "44px 44px" }} />
      </motion.g>
    </motion.g>
  </svg>
);

// Sidebar Icons for Empty State Cards
const TechStreamIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400">
    <motion.path 
      d="M3 12h4l3 -6l4 12l3 -6h4" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);

const SecurityShieldIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-400">
    <motion.path 
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
      fill="rgba(16, 185, 129, 0.1)" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <motion.path 
      d="M9 12l2 2 4-4" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
      style={{ transformOrigin: "12px 12px" }}
    />
  </svg>
);

const FilterLensIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400">
    <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <motion.circle 
      cx="11" cy="11" r="2" 
      fill="currentColor" 
      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
      transition={{ duration: 2, repeat: Infinity }} 
    />
  </svg>
);

const ResetSyncIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400">
    <motion.path 
      d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      animate={{ rotate: 360 }} 
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "center" }}
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

    const emptyStateCards = hasActiveFilters
      ? [
          {
            icon: <FilterLensIcon />,
            label: "Vista filtrada",
            title: "Filtros activos limitando el stream",
            description:
              "Condiciones de busqueda estan ocultando incidentes fuera del espectro seleccionado. La telemetria continua oculta.",
          },
          {
            icon: <ResetSyncIcon />,
            label: "Recuperacion de espectro",
            title: "Restaurar transmision total",
            description:
              "Limpiar parametros de busqueda para restablecer el canal completo de monitoreo en tiempo real.",
          },
        ]
      : [
          {
            icon: <TechStreamIcon />,
            label: "Stream en vivo",
            title: "Señal de eventos activa",
            description:
              "El canal de telemetria se encuentra operativo. Recibiendo datos desde todas las fuentes integradas en el hub.",
          },
          {
            icon: <SecurityShieldIcon />,
            label: "Estado del panel",
            title: "Superficie de ataque contenida",
            description:
              "No hay desviaciones en los parametros vitales del sistema. La integridad de las conexiones se mantiene estable.",
          },
        ];

    const emptyStateBadgeClass = hasActiveFilters
      ? isDark
        ? "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
        : "bg-amber-50 border-amber-200 text-amber-700"
      : isDark
        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
        : "bg-cyan-50 border-cyan-200 text-cyan-700";

    const emptyStateSurfaceClass = isDark
      ? "bg-white/3 border-white/8 backdrop-blur-3xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
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
                    ? "text-cyan-400 animate-pulse"
                    : "text-blue-600 animate-pulse"
                }
              />
              <span
                className={`text-[9px] font-black uppercase tracking-[0.24em] ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Interceptando señal
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
            className={`relative h-full w-full overflow-hidden rounded-3xl border p-4 md:p-6 transition-all duration-300 ${
              isDark ? "bg-[#0a0a0a]/60 border-white/10" : "bg-gray-50/80 border-gray-200"
            }`}
          >
            <div
              className={`pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full blur-[100px] ${
                hasActiveFilters
                  ? isDark
                    ? "bg-amber-500/15"
                    : "bg-amber-200/60"
                  : isDark
                    ? "bg-cyan-500/15"
                    : "bg-cyan-200/70"
              }`}
            />

            <div className="relative mx-auto flex h-full w-full max-w-5xl items-center justify-center">
              <div
                className={`w-full min-w-0 overflow-hidden rounded-3xl border p-6 sm:p-8 md:p-10 ${emptyStateSurfaceClass}`}
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_minmax(18rem,22rem)] xl:grid-cols-[1fr_max(22rem,320px)] items-center">
                  <div className="min-w-0 text-center lg:text-left">
                    <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                      <span
                        className={`inline-flex items-center rounded-lg border px-3 py-1 text-[9px] font-black uppercase tracking-[0.24em] ${emptyStateBadgeClass}`}
                      >
                        {hasActiveFilters
                          ? "FILTROS ACTIVOS"
                          : "SISTEMA SEGURO"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-[9px] font-black tracking-[0.2em] font-mono uppercase ${
                          isDark
                            ? "border-white/10 bg-white/5 text-gray-400"
                            : "border-gray-200 bg-white text-gray-500"
                        }`}
                      >
                        <Pulse size={12} className="shrink-0" />
                        {hasActiveFilters
                          ? "ANALISIS SUPERFICIAL"
                          : "TELEMETRIA EN VIVO"}
                      </span>
                    </div>

                    <div className="mt-8 flex justify-center lg:justify-start">
                      <div className="relative flex items-center justify-center p-2 isolate">
                        {/* Immersive Background Glow */}
                        <div className={`absolute inset-0 blur-2xl opacity-40 rounded-full ${
                          hasActiveFilters ? "bg-amber-500/20" : "bg-cyan-500/20"
                        }`} />
                        {hasActiveFilters ? <FilteredMonitorVisual /> : <SecureSystemVisual />}
                      </div>
                    </div>

                    <div className="mt-6 flex w-full max-w-[460px] flex-col gap-3">
                      <h3
                        className={`text-3xl font-black italic tracking-tighter sm:text-4xl ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {hasActiveFilters
                          ? "PARAMETROS SIN COINCIDENCIA"
                          : "TODO LIMPIO POR AHORA"}
                      </h3>

                      <p
                        className={`text-xs sm:text-sm leading-relaxed uppercase tracking-widest ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {hasActiveFilters
                          ? "Ajuste los parametros de busqueda para restaurar la transmision del canal principal de incidentes."
                          : "Cero desviaciones detectadas. El monitor continua analizando vectores en tiempo real desde la ultima inicializacion."}
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                      {hasActiveFilters ? (
                        <button
                          onClick={onClearFilters}
                          className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-[10px] font-black tracking-widest uppercase transition-all duration-200 ${
                            isDark
                              ? "border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/60"
                              : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          }`}
                        >
                          <ArrowCounterClockwise size={16} />
                          Limpiar y escanear
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-[10px] font-black tracking-widest uppercase ${
                            isDark
                              ? "border-white/10 bg-white/5 text-gray-300"
                              : "border-gray-200 bg-white text-gray-600"
                          }`}
                        >
                          <Pulse size={14} className="shrink-0" />
                          Esperando anomalias
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    {emptyStateCards.map((card) => (
                      <div
                        key={card.title}
                        className={`group rounded-2xl border p-5 text-left transition-all duration-300 ${
                          isDark
                            ? "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-input border shadow-sm ${
                              isDark
                                ? "bg-white/10 border-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_4px_rgba(0,0,0,0.2)]"
                                : "bg-white border-gray-200 text-gray-900 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.04)]"
                            }`}
                          >
                            {card.icon}
                          </div>

                          <div className="min-w-0 mt-0.5">
                            <p
                              className={`text-[9px] font-black uppercase tracking-[0.24em] ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              {card.label}
                            </p>
                            <h4
                              className={`mt-1 font-mono text-sm font-bold tracking-tight ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {card.title}
                            </h4>
                          </div>
                        </div>

                        <p
                          className={`mt-4 text-[11px] font-medium leading-5 ${
                            isDark ? "text-gray-400" : "text-gray-500"
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