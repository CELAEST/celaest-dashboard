import React from "react";
import { Terminal, Lightbulb, Copy, CheckCircle } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  ErrorLog,
  ErrorStatus,
} from "@/features/errors/hooks/useErrorMonitoring";

interface ErrorDetailsProps {
  error: ErrorLog;
  isDark: boolean;
  isAdmin: boolean;
  onStatusUpdate: (status: ErrorStatus) => Promise<void>;
}

export const ErrorDetails = React.memo(
  ({ error, isDark, isAdmin, onStatusUpdate }: ErrorDetailsProps) => {
    const handleCopyStack = () => {
      if (!error.stackTrace) return;
      navigator.clipboard.writeText(error.stackTrace);
      toast.success("Stack trace copiado al portapapeles", {
        description: `${error.errorCode} • ${error.template}`,
      });
    };

    return (
      <div className={`p-5 space-y-5 border-t ${isDark ? "border-white/6 bg-black/40" : "border-gray-200 bg-gray-50/50"}`}>
        {/* Environment Section */}
        <div>
          <span className={`text-[10px] font-mono uppercase tracking-[0.18em] block mb-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>
            Entorno de Cliente & Versiones
          </span>
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl text-xs font-mono border ${
            isDark ? "bg-white/[0.02] border-white/6" : "bg-white border-gray-200"
          }`}>
            <div>
              <span className={`block text-[9px] uppercase tracking-wider mb-0.5 ${isDark ? "text-white/40" : "text-gray-400"}`}>
                Sistema Operativo
              </span>
              <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                {error.environment.os}
              </span>
            </div>
            {error.environment.excelVersion && (
              <div>
                <span className={`block text-[9px] uppercase tracking-wider mb-0.5 ${isDark ? "text-white/40" : "text-gray-400"}`}>
                  Versión de Excel
                </span>
                <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  {error.environment.excelVersion}
                </span>
              </div>
            )}
            <div>
              <span className={`block text-[9px] uppercase tracking-wider mb-0.5 ${isDark ? "text-white/40" : "text-gray-400"}`}>
                Plataforma
              </span>
              <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                {error.environment.platform}
              </span>
            </div>
          </div>
        </div>

        {/* Stack Trace (Admin Only or when present) */}
        {error.stackTrace && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-mono uppercase tracking-[0.18em] flex items-center gap-1.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                <Terminal size={12} />
                Stack Trace de Fallo
              </span>
              <button
                type="button"
                onClick={handleCopyStack}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isDark
                    ? "bg-white/[0.05] border-white/10 text-white/70 hover:text-white hover:bg-white/[0.08]"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                <Copy size={11} />
                <span>Copiar Traza</span>
              </button>
            </div>
            <div
              className={`p-3.5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border ${
                isDark
                  ? "bg-black/70 text-white/80 border-white/8"
                  : "bg-gray-900 text-gray-200 border-gray-800 shadow-inner"
              }`}
            >
              <pre className="whitespace-pre-wrap">{error.stackTrace}</pre>
            </div>
          </div>
        )}

        {/* Suggestion Section */}
        {error.suggestion && (
          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isDark
              ? "bg-white/[0.02] border-white/8"
              : "bg-white border-gray-200"
          }`}>
            <span className={`text-[10px] font-mono uppercase tracking-[0.18em] flex items-center gap-1.5 font-bold ${
              isDark ? "text-white/60" : "text-gray-600"
            }`}>
              <Lightbulb size={13} />
              Recomendación de Solución IA
            </span>
            <p className={`text-xs leading-relaxed font-mono ${isDark ? "text-white/70" : "text-gray-700"}`}>
              {error.suggestion}
            </p>
          </div>
        )}

        {/* Client Success Banner */}
        {!isAdmin && (
          <div
            className={`p-3.5 rounded-xl flex items-center gap-2.5 border text-xs font-mono ${
              isDark
                ? "bg-white/[0.02] border-white/6 text-white/70"
                : "bg-gray-50 border-gray-200 text-gray-700"
            }`}
          >
            <CheckCircle size={16} className={isDark ? "text-white/60" : "text-gray-600"} />
            <p className="font-medium">
              Este incidente ha sido reportado automáticamente a la central de telemetría de CELAEST.
            </p>
          </div>
        )}

        {/* Admin Actions */}
        {isAdmin && (
          <div className={`flex items-center justify-between pt-3 border-t flex-wrap gap-2 ${
            isDark ? "border-white/6" : "border-gray-200"
          }`}>
            <span className={`text-xs font-mono ${isDark ? "text-white/40" : "text-gray-500"}`}>
              Transición de estado:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onStatusUpdate("reviewing")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium tracking-wider border transition-all cursor-pointer ${
                  isDark
                    ? "border-white/10 bg-white/[0.05] text-white/80 hover:bg-white/[0.1]"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-xs"
                }`}
              >
                En Revisión
              </button>
              <button
                type="button"
                onClick={() => onStatusUpdate("resolved")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wider transition-all cursor-pointer ${
                  isDark
                    ? "bg-white text-black hover:bg-zinc-200 shadow-xs"
                    : "bg-gray-900 text-white hover:bg-black shadow-xs"
                }`}
              >
                Marcar Resuelto
              </button>
              <button
                type="button"
                onClick={() => onStatusUpdate("ignored")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium tracking-wider border transition-all cursor-pointer ${
                  isDark
                    ? "border-white/6 text-white/50 hover:text-white"
                    : "border-gray-200 text-gray-500 hover:text-gray-700"
                }`}
              >
                Ignorar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

ErrorDetails.displayName = "ErrorDetails";
