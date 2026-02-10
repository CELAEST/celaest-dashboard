import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import {
  ErrorLog,
  ErrorStatus,
} from "@/features/errors/hooks/useErrorMonitoring";
import { ErrorListItem } from "./ErrorListItem";

interface ErrorListProps {
  errors: ErrorLog[];
  expandedError: string | null;
  toggleErrorExpansion: (errorId: string) => void;
  onStatusUpdate: (errorId: string, status: ErrorStatus) => Promise<void>;
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
    expandedError,
    toggleErrorExpansion,
    onStatusUpdate,
    isAdmin,
  }: ErrorListProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Estado vacío: Cuando los filtros no devuelven resultados
    if (errors.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex flex-col items-center justify-center p-12 rounded-3xl border border-dashed ${
            isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isDark
                ? "bg-white/5 text-gray-400"
                : "bg-white text-gray-400 shadow-sm"
            }`}
          >
            <Search size={24} />
          </div>
          <h3
            className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            No se encontraron errores
          </h3>
          <p
            className={`text-sm text-center max-w-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
          >
            Intenta ajustar los filtros o el término de búsqueda para encontrar
            lo que necesitas.
          </p>
        </motion.div>
      );
    }

    return (
      <div className="h-full overflow-y-auto p-4 custom-scrollbar space-y-4">
        <ul className="space-y-4 p-0 m-0 list-none">
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
