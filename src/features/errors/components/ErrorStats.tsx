import React from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface ErrorStatsProps {
  stats: {
    criticalCount: number;
    warningCount: number;
    resolvedCount: number;
    totalAffectedUsers: number;
  };
}

export const ErrorStats = React.memo(({ stats }: ErrorStatsProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`backdrop-blur-xl border rounded-2xl p-6 ${
          isDark
            ? "bg-[#0a0a0a]/60 border-white/5"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? "bg-red-500/20" : "bg-red-50"
            }`}
          >
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <span className="text-xs font-medium text-red-400">CRÍTICO</span>
        </div>
        <p
          className={`text-3xl font-bold mb-1 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {stats.criticalCount}
        </p>
        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          Requieren atención inmediata
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`backdrop-blur-xl border rounded-2xl p-6 ${
          isDark
            ? "bg-[#0a0a0a]/60 border-white/5"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? "bg-orange-500/20" : "bg-orange-50"
            }`}
          >
            <AlertCircle size={20} className="text-orange-400" />
          </div>
          <span className="text-xs font-medium text-orange-400">WARNING</span>
        </div>
        <p
          className={`text-3xl font-bold mb-1 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {stats.warningCount}
        </p>
        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          Problemas de rendimiento
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`backdrop-blur-xl border rounded-2xl p-6 ${
          isDark
            ? "bg-[#0a0a0a]/60 border-white/5"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? "bg-green-500/20" : "bg-green-50"
            }`}
          >
            <CheckCircle2 size={20} className="text-green-400" />
          </div>
          <span className="text-xs font-medium text-green-400">RESUELTO</span>
        </div>
        <p
          className={`text-3xl font-bold mb-1 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {stats.resolvedCount}
        </p>
        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          Corregidos este mes
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`backdrop-blur-xl border rounded-2xl p-6 ${
          isDark
            ? "bg-[#0a0a0a]/60 border-white/5"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark ? "bg-cyan-500/20" : "bg-blue-50"
            }`}
          >
            <Activity
              size={20}
              className={isDark ? "text-cyan-400" : "text-blue-600"}
            />
          </div>
          <span
            className={`text-xs font-medium ${
              isDark ? "text-cyan-400" : "text-blue-600"
            }`}
          >
            IMPACTO
          </span>
        </div>
        <p
          className={`text-3xl font-bold mb-1 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {stats.totalAffectedUsers}
        </p>
        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          Usuarios afectados total
        </p>
      </motion.div>
    </div>
  );
});

ErrorStats.displayName = "ErrorStats";
