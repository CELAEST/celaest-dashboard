"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, X } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDemo?: boolean;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDemo = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 800));
    onConfirm();
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-100"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-101 p-4"
          >
            <div className="relative w-full max-w-md">
              {/* Glassmorphic Card */}
              <div
                className={`relative overflow-hidden rounded-3xl backdrop-blur-xl border shadow-2xl transition-all duration-300 ${
                  isDark
                    ? "bg-black/40 border-white/10 shadow-cyan-500/10"
                    : "bg-white/95 border-gray-200/50"
                }`}
              >
                {/* Gradient Glow Effect (only visible in dark mode) */}
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

                <div className="relative p-8">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-xl transition-all duration-200 hover:scale-110 group ${
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

                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      {/* Outer Glow Ring */}
                      <div
                        className={`absolute inset-0 rounded-2xl bg-linear-to-br blur-xl scale-110 ${
                          isDark
                            ? "from-cyan-400 to-blue-400 opacity-60"
                            : "from-blue-600 to-indigo-600 opacity-40"
                        }`}
                      />

                      {/* Icon Container */}
                      <div
                        className={`relative w-16 h-16 rounded-2xl bg-linear-to-br flex items-center justify-center shadow-lg ${
                          isDark
                            ? "from-cyan-400 to-blue-400"
                            : "from-blue-600 to-indigo-600"
                        }`}
                      >
                        <LogOut className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h2
                    className={`text-2xl font-bold text-center mb-3 tracking-tight ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {isDemo ? "Reiniciar Demo" : "Cerrar Sesión"}
                  </h2>

                  {/* Description */}
                  <p
                    className={`text-center mb-8 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {isDemo
                      ? "¿Deseas reiniciar la demostración? Esto recargará la página y reiniciará el estado del demo."
                      : "¿Estás seguro de que deseas cerrar sesión? Necesitarás iniciar sesión nuevamente para acceder a tu dashboard."}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {/* Cancel Button */}
                    <button
                      onClick={onClose}
                      disabled={isLoading}
                      className={`flex-1 px-6 py-3.5 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark
                          ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
                      }`}
                    >
                      Cancelar
                    </button>

                    {/* Sign Out Button */}
                    <button
                      onClick={handleSignOut}
                      disabled={isLoading}
                      className="group relative flex-1 px-6 py-3.5 rounded-xl font-medium text-white overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {/* Gradient Background */}
                      <div
                        className={`absolute inset-0 bg-linear-to-r transition-transform duration-300 group-hover:scale-105 ${
                          isDark
                            ? "from-cyan-400 to-blue-400"
                            : "from-blue-600 to-indigo-600"
                        }`}
                      />

                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      </div>

                      {/* Button Content */}
                      <span className="relative flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
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
                            {isDemo ? "Reiniciando..." : "Cerrando sesión..."}
                          </>
                        ) : isDemo ? (
                          "Reiniciar"
                        ) : (
                          "Cerrar Sesión"
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Footer Info */}
                  <div
                    className={`mt-6 pt-6 border-t ${
                      isDark ? "border-white/10" : "border-gray-200/50"
                    }`}
                  >
                    <p
                      className={`text-xs text-center ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Tu sesión será terminada de forma segura
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
