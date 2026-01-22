"use client";

import React from "react";
import { motion } from "motion/react";
import { CheckCircle, AlertTriangle, XCircle, Info, Bell } from "lucide-react";
import { useNotifications } from "@/features/shared/contexts/NotificationContext";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const NotificationShowcase = () => {
  const { addNotification } = useNotifications();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const triggerSuccess = () => {
    addNotification({
      type: "success",
      title: "Operación Exitosa",
      message: "Los cambios se han guardado correctamente en el sistema.",
      timestamp: new Date(),
    });
  };

  const triggerWarning = () => {
    addNotification({
      type: "warning",
      title: "Advertencia de Sistema",
      message: "El uso de CPU está llegando al 85%. Revise los procesos.",
      timestamp: new Date(),
    });
  };

  const triggerError = () => {
    addNotification({
      type: "error",
      title: "Error de Conexión",
      message:
        "No se pudo conectar con el servidor de licencias. Reintentando...",
      timestamp: new Date(),
    });
  };

  const triggerInfo = () => {
    addNotification({
      type: "info",
      title: "Nueva Actualización",
      message: "CELAEST v2.5.0 ya está disponible para descarga.",
      timestamp: new Date(),
    });
  };

  const containerClass = `rounded-2xl border p-6 backdrop-blur-xl ${
    isDark
      ? "bg-[#0a0a0a]/60 border-white/5"
      : "bg-white border-gray-200 shadow-sm"
  }`;

  const headerClass = `font-bold mb-6 flex items-center gap-2 ${
    isDark ? "text-white" : "text-gray-900"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={containerClass}
    >
      <h3 className={headerClass}>
        <Bell className="w-5 h-5 text-cyan-400" />
        Notification Center Demo
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={triggerSuccess}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] text-left group
            ${
              isDark
                ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
                : "bg-emerald-50 border-emerald-100 hover:bg-emerald-100"
            }`}
        >
          <div
            className={`p-2 rounded-lg ${isDark ? "bg-emerald-500/10" : "bg-white"}`}
          >
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div
              className={`font-semibold text-sm ${isDark ? "text-emerald-400" : "text-emerald-700"}`}
            >
              Success
            </div>
            <div
              className={`text-xs ${isDark ? "text-emerald-500/70" : "text-emerald-600/70"}`}
            >
              Trigger success toast
            </div>
          </div>
        </button>

        <button
          onClick={triggerWarning}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] text-left group
            ${
              isDark
                ? "bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10"
                : "bg-orange-50 border-orange-100 hover:bg-orange-100"
            }`}
        >
          <div
            className={`p-2 rounded-lg ${isDark ? "bg-orange-500/10" : "bg-white"}`}
          >
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <div
              className={`font-semibold text-sm ${isDark ? "text-orange-400" : "text-orange-700"}`}
            >
              Warning
            </div>
            <div
              className={`text-xs ${isDark ? "text-orange-500/70" : "text-orange-600/70"}`}
            >
              Trigger warning toast
            </div>
          </div>
        </button>

        <button
          onClick={triggerError}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] text-left group
            ${
              isDark
                ? "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10"
                : "bg-blue-50 border-blue-100 hover:bg-blue-100"
            }`}
        >
          <div
            className={`p-2 rounded-lg ${isDark ? "bg-blue-500/10" : "bg-white"}`}
          >
            <XCircle className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div
              className={`font-semibold text-sm ${isDark ? "text-blue-400" : "text-blue-700"}`}
            >
              Error
            </div>
            <div
              className={`text-xs ${isDark ? "text-blue-500/70" : "text-blue-600/70"}`}
            >
              Trigger error toast
            </div>
          </div>
        </button>

        <button
          onClick={triggerInfo}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] text-left group
            ${
              isDark
                ? "bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10"
                : "bg-blue-50 border-blue-100 hover:bg-blue-100"
            }`}
        >
          <div
            className={`p-2 rounded-lg ${isDark ? "bg-cyan-500/10" : "bg-white"}`}
          >
            <Info
              className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-500"}`}
            />
          </div>
          <div>
            <div
              className={`font-semibold text-sm ${isDark ? "text-cyan-400" : "text-blue-700"}`}
            >
              Info
            </div>
            <div
              className={`text-xs ${isDark ? "text-cyan-500/70" : "text-blue-600/70"}`}
            >
              Trigger info toast
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  );
};
