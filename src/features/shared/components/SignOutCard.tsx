import React, { memo } from "react";
import { SignOut, X } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface SignOutCardProps {
  isDemo?: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SignOutCard: React.FC<SignOutCardProps> = memo(
  ({ isDemo, isLoading, onClose, onConfirm }) => {
    const { isDark } = useTheme();

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full overflow-hidden rounded-[2rem] backdrop-blur-xl border shadow-2xl transition-all duration-300 ${
          isDark
            ? "bg-[#07090d] border-white/10 shadow-cyan-950/30"
            : "bg-white/95 border-gray-200/50"
        }`}
      >
        <div
          className={`absolute inset-x-0 top-0 h-px ${
            isDark
              ? "bg-linear-to-r from-transparent via-cyan-400/70 to-transparent"
              : "bg-linear-to-r from-transparent via-blue-500/60 to-transparent"
          }`}
        />

        <div
          className={`absolute -top-24 -right-24 w-48 h-48 bg-linear-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute -bottom-24 -left-24 w-48 h-48 bg-linear-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="relative flex min-w-0 flex-col items-stretch gap-6 p-6 sm:p-8">
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 group ${
              isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
          >
            <X
              className={`w-5 h-5 ${
                isDark
                  ? "text-gray-400 group-hover:text-white"
                  : "text-gray-500 group-hover:text-gray-700"
              }`}
            />
          </button>

          <div className="flex flex-col items-stretch gap-4 text-center">
            <span
              className={`mx-auto inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] ${
                isDark
                  ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
                  : "border-blue-200 bg-blue-50 text-blue-700"
              }`}
            >
              {isDemo ? "Modo demo" : "Sesion segura"}
            </span>

            <div className="mx-auto flex justify-center">
              <div className="relative">
                <div
                  className={`absolute inset-0 rounded-[1.75rem] bg-linear-to-br blur-xl scale-110 ${
                    isDark
                      ? "from-cyan-400 to-blue-400 opacity-60"
                      : "from-blue-600 to-indigo-600 opacity-40"
                  }`}
                />

                <div
                  className={`relative h-[4.5rem] w-[4.5rem] rounded-[1.75rem] bg-linear-to-br flex items-center justify-center shadow-lg ${
                    isDark
                      ? "from-cyan-400 to-blue-400"
                      : "from-blue-600 to-indigo-600"
                  }`}
                >
                  <SignOut className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="min-w-0 space-y-2">
              <h2
                className={`w-full text-2xl font-black text-center tracking-tight sm:text-[2rem] ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {isDemo ? "Reiniciar demo" : "Cerrar sesion"}
              </h2>

              <p
                className={`w-full text-center text-sm leading-6 sm:text-base ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {isDemo
                  ? "Esto recargara la pagina y devolvera la demostracion a su estado inicial."
                  : "Tu sesion actual se cerrara de forma segura y tendras que autenticarte de nuevo para volver al dashboard."}
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`min-w-0 flex-1 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
              }`}
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              autoFocus
              className="group relative min-w-0 flex-1 px-6 py-3.5 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <div
                className={`absolute inset-0 bg-linear-to-r transition-transform duration-300 group-hover:scale-105 ${
                  isDark
                    ? "from-cyan-400 to-blue-400"
                    : "from-blue-600 to-indigo-600"
                }`}
              />

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>

              <div className="relative grid place-items-center">
                <span
                  className={`col-start-1 row-start-1 flex items-center justify-center gap-2 transition-opacity duration-200 ${
                    isLoading ? "opacity-0 invisible" : "opacity-100 visible"
                  }`}
                >
                  {isDemo ? "Reiniciar demo" : "Cerrar sesion"}
                </span>

                <span
                  className={`col-start-1 row-start-1 flex items-center justify-center gap-2 transition-opacity duration-200 ${
                    isLoading ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isDemo ? "Reiniciando..." : "Cerrando..."}
                </span>
              </div>
            </button>
          </div>

          <div
            className={`mt-6 pt-6 border-t ${
              isDark ? "border-white/10" : "border-gray-200/50"
            }`}
          >
            <p
              className={`w-full text-xs text-center leading-5 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {isDemo
                ? "La sesion de demostracion se reiniciara localmente."
                : "Tu sesion se cerrara de forma segura en todos los modulos activos."}
            </p>
          </div>
        </div>
      </div>
    );
  },
);

SignOutCard.displayName = "SignOutCard";
