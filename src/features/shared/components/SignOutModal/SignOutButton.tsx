import React, { memo } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface SignOutButtonProps {
  isLoading: boolean;
  isDemo?: boolean;
  onClick: () => void;
}

export const SignOutButton: React.FC<SignOutButtonProps> = memo(
  ({ isLoading, isDemo, onClick }) => {
    const { isDark } = useTheme();

    return (
      <button
        onClick={onClick}
        disabled={isLoading}
        className="group relative flex-1 px-6 py-3.5 rounded-xl font-medium text-white overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {/* Gradient Background */}
        <div
          className={`absolute inset-0 bg-linear-to-r transition-transform duration-300 group-hover:scale-105 ${
            isDark ? "from-cyan-400 to-blue-400" : "from-blue-600 to-indigo-600"
          }`}
        />

        {/* Shimmer Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>

        {/* Button Content */}
        <div className="relative grid place-items-center">
          {/* Normal State */}
          <span
            className={`col-start-1 row-start-1 flex items-center justify-center gap-2 transition-opacity duration-200 ${
              isLoading ? "opacity-0 invisible" : "opacity-100 visible"
            }`}
          >
            {isDemo ? "Reiniciar" : "Cerrar Sesión"}
          </span>

          {/* Loading State */}
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
    );
  },
);

SignOutButton.displayName = "SignOutButton";
