import React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  MagnifyingGlass,
  ArrowCounterClockwise,
  Pulse,
  ShieldCheck,
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

/**
 * ErrorList - Componente para mostrar una lista de registros de errores.
 * Decomprimido para seguir el principio SRP y facilitar el mantenimiento.
 *
 * Cumple con:
 * - SRP: Lógica delegada a sub-componentes.
 * - Accesibilidad: Usa <ul> y <li> para navegación semántica.
 * - UX Invisible: Maneja estados vacíos amigables.
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
            icon: <MagnifyingGlass size={16} weight="bold" />,
            label: "Vista filtrada",
            title: "Los filtros estan limitando el stream",
            description:
              "Hay criterios activos que estan ocultando parte de los incidentes disponibles en el monitor.",
          },
          {
            icon: <ArrowCounterClockwise size={16} weight="bold" />,
            label: "Recuperacion inmediata",
            title: "Vuelve al estado completo",
            description:
              "Limpia filtros y busqueda para recuperar la lista completa de errores con un solo clic.",
          },
        ]
      : [
          {
            icon: <Pulse size={16} weight="bold" />,
            label: "Stream en vivo",
            title: "El monitoreo sigue activo",
            description:
              "La lista se reanudara en cuanto llegue un nuevo incidente desde cualquiera de las plataformas observadas.",
          },
          {
            icon: <ShieldCheck size={16} weight="bold" />,
            label: "Estado del panel",
            title: "Todo esta bajo control",
            description:
              "Sin actividad pendiente, el equipo puede enfocarse en prioridad real apenas aparezca un evento nuevo.",
          },
        ];

    const emptyStateBadgeClass = hasActiveFilters
      ? isDark
        ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
        : "bg-amber-50 border-amber-200 text-amber-700"
      : isDark
        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
        : "bg-emerald-50 border-emerald-200 text-emerald-700";

    const emptyStateIconClass = hasActiveFilters
      ? isDark
        ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
        : "border-amber-200 bg-amber-50 text-amber-700"
      : isDark
        ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
        : "border-cyan-200 bg-cyan-50 text-cyan-700";

    const emptyStateSurfaceClass = isDark
      ? "bg-[#05070b]/70 border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      : "bg-white border-gray-200 shadow-xl shadow-gray-200/40";

    if (isLoading) {
      return (
        <div className="h-full w-full p-4 md:p-5">
          <div
            className={`h-full w-full rounded-[1.75rem] border p-5 md:p-6 ${
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
                className={`text-xs font-bold uppercase tracking-[0.24em] ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Cargando incidentes
              </span>
            </div>

            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border p-5 ${
                    isDark ? "bg-black/30 border-white/5" : "bg-white border-gray-200"
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
            className={`relative h-full w-full overflow-hidden rounded-4xl border p-4 md:p-6 ${
              isDark ? "bg-[#030509] border-white/8" : "bg-gray-50/80 border-gray-200"
            }`}
          >
            <div
              className={`pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl ${
                hasActiveFilters
                  ? isDark
                    ? "bg-amber-500/10"
                    : "bg-amber-200/60"
                  : isDark
                    ? "bg-cyan-500/10"
                    : "bg-cyan-200/70"
              }`}
            />

            <div className="relative mx-auto flex h-full w-full max-w-5xl items-center justify-center">
              <div
                className={`w-full min-w-0 overflow-hidden rounded-4xl border p-6 sm:p-8 md:p-10 ${emptyStateSurfaceClass}`}
              >
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(19rem,22rem)] xl:items-center">
                  <div className="min-w-0 text-center xl:text-left">
                    <div className="flex flex-wrap items-center justify-center gap-2 xl:justify-start">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] ${emptyStateBadgeClass}`}
                      >
                        {hasActiveFilters
                          ? "Filtros activos"
                          : "Sin incidentes activos"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium ${
                          isDark
                            ? "border-white/10 bg-white/5 text-gray-400"
                            : "border-gray-200 bg-white text-gray-500"
                        }`}
                      >
                        <Pulse size={12} className="shrink-0" />
                        {hasActiveFilters
                          ? "Refina la consulta"
                          : "Monitoreo en vivo activo"}
                      </span>
                    </div>

                    <div className="mt-6 flex justify-center xl:justify-start">
                      <div
                        className={`flex h-24 w-24 items-center justify-center rounded-4xl border shadow-inner ${emptyStateIconClass}`}
                      >
                        {hasActiveFilters ? (
                          <MagnifyingGlass size={34} weight="duotone" />
                        ) : (
                          <ShieldCheck size={34} weight="duotone" />
                        )}
                      </div>
                    </div>

                    <div className="mt-6 min-w-0 space-y-3">
                      <h3
                        className={`w-full text-3xl font-black tracking-tight sm:text-4xl ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {hasActiveFilters
                          ? "No encontramos coincidencias con la vista actual"
                          : "Todo limpio por ahora"}
                      </h3>

                      <p
                        className={`mx-auto w-full max-w-2xl text-sm leading-7 sm:text-base xl:mx-0 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {hasActiveFilters
                          ? "Ajusta filtros o limpia la busqueda para volver a ver el flujo completo de incidentes activos e historicos del sistema."
                          : "No hay incidentes activos en este momento. El monitor seguira observando en tiempo real y mostrara cualquier error nuevo apenas aparezca."}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 xl:justify-start">
                      {hasActiveFilters ? (
                        <button
                          onClick={onClearFilters}
                          className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                            isDark
                              ? "border-white/10 bg-white/6 text-white hover:bg-white/10 hover:border-white/20"
                              : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                          }`}
                        >
                          <ArrowCounterClockwise size={16} />
                          Limpiar filtros y mostrar todo
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium ${
                            isDark
                              ? "border-white/10 bg-white/5 text-gray-300"
                              : "border-gray-200 bg-white text-gray-600"
                          }`}
                        >
                          <Pulse size={14} className="shrink-0" />
                          Esperando nuevos eventos del sistema
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    {emptyStateCards.map((card) => (
                      <div
                        key={card.title}
                        className={`rounded-[1.75rem] border p-5 text-left ${
                          isDark
                            ? "border-white/10 bg-black/35"
                            : "border-gray-200 bg-white/90"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${emptyStateIconClass}`}
                          >
                            {card.icon}
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`text-[11px] font-bold uppercase tracking-[0.22em] ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              {card.label}
                            </p>
                            <h4
                              className={`mt-2 text-base font-bold tracking-tight ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {card.title}
                            </h4>
                          </div>
                        </div>

                        <p
                          className={`mt-4 text-sm leading-6 ${
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