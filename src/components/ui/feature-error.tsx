import React from "react";
import { Warning, ArrowClockwise } from "@phosphor-icons/react";

interface FeatureErrorProps {
  title?: string;
  error?: Error;
  resetError?: () => void;
}

/**
 * A lightweight error fallback for individual features/widgets.
 * Prevents a single component crash from breaking the entire layout.
 */
export const FeatureError: React.FC<FeatureErrorProps> = ({ 
  title = "No se pudo cargar este módulo", 
  error, 
  resetError 
}) => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-8 bg-slate-800/10 border border-red-500/10 rounded-xl">
      <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
        <Warning className="w-6 h-6 text-red-400" />
      </div>
      <h3 className="text-sm font-medium text-slate-200 mb-2">{title}</h3>
      <p className="text-xs text-slate-400 text-center max-w-sm mb-4">
        Ocurrió un error inesperado al intentar renderizar esta sección.
      </p>

      {process.env.NODE_ENV === "development" && error && (
        <div className="mb-4 max-w-full overflow-auto p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-[10px] font-mono whitespace-pre-wrap">
            {error.toString()}
          </p>
        </div>
      )}

      {resetError && (
        <button
          onClick={resetError}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-md transition-colors"
        >
          <ArrowClockwise className="w-3.5 h-3.5" />
          Reintentar
        </button>
      )}
    </div>
  );
};
