import React from "react";
import { Smartphone, Terminal, Lightbulb } from "lucide-react";
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
    return (
      <div className="p-6 space-y-6">
        {/* Environment Section */}
        <section>
          <h4
            className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            <Smartphone size={14} />
            Entorno del Cliente
          </h4>
          <div
            className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50 border border-gray-100"}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <span
                  className={`block text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}
                >
                  Sistema Operativo
                </span>
                <span
                  className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {error.environment.os}
                </span>
              </div>
              {error.environment.excelVersion && (
                <div>
                  <span
                    className={`block text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Versión de Excel
                  </span>
                  <span
                    className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {error.environment.excelVersion}
                  </span>
                </div>
              )}
              <div>
                <span
                  className={`block text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}
                >
                  Plataforma
                </span>
                <span
                  className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {error.environment.platform}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stack Trace (Admin Only) */}
        {isAdmin && error.stackTrace && (
          <section>
            <h4
              className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              <Terminal size={14} />
              Stack Trace
            </h4>
            <div
              className={`p-4 rounded-xl font-mono text-xs overflow-x-auto ${
                isDark
                  ? "bg-black/40 text-cyan-400 border border-white/5"
                  : "bg-gray-900 text-cyan-300 shadow-inner"
              }`}
            >
              <pre className="whitespace-pre-wrap leading-relaxed">
                {error.stackTrace}
              </pre>
            </div>
          </section>
        )}

        {/* Suggestion Section */}
        {error.suggestion && (
          <section
            className={`p-5 rounded-2xl border ${
              isDark
                ? "bg-cyan-500/5 border-cyan-500/10"
                : "bg-blue-50 border-blue-100 shadow-sm"
            }`}
          >
            <h4
              className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            >
              <Lightbulb size={16} />
              Sugerencia de Solución
            </h4>
            <p
              className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {error.suggestion}
            </p>
          </section>
        )}
        {/* Client Success Banner */}
        {!isAdmin && (
          <div
            className={`p-4 rounded-lg flex items-center gap-2 ${
              isDark
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-emerald-50 border border-emerald-100 text-emerald-700"
            }`}
          >
            <div
              className={`p-1 rounded-full ${isDark ? "bg-emerald-500/20" : "bg-emerald-100"}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="text-sm font-medium">
              Este error ha sido reportado automáticamente a nuestro equipo
              técnico. No es necesario que reportes nada adicional.
            </p>
          </div>
        )}

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onStatusUpdate("reviewing")}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                isDark
                  ? "border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  : "border-orange-200 text-orange-600 hover:bg-orange-50"
              }`}
            >
              Marcar En Revisión
            </button>
            <button
              onClick={() => onStatusUpdate("resolved")}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                isDark
                  ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                  : "border-green-200 text-green-600 hover:bg-green-50"
              }`}
            >
              Marcar Resuelto
            </button>
            <button
              onClick={() => onStatusUpdate("ignored")}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                isDark
                  ? "border-white/10 text-gray-400 hover:bg-white/5"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Ignorar
            </button>
          </div>
        )}
      </div>
    );
  },
);

ErrorDetails.displayName = "ErrorDetails";
