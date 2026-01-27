import React from "react";
import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface User {
  email: string;
  templates: string;
  daysAgo: number;
  severity: string;
}

interface ZombieUsersProps {
  users: User[];
}

export const ZombieUsers = React.memo(({ users }: ZombieUsersProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <h3
              className={`font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Usuarios Zombie Detectados
            </h3>
          </div>
        </div>

        <p
          className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          Compraron pero no ejecutan las plantillas (riesgo de churn)
        </p>

        <div className="space-y-3 mb-6">
          {users.map((user, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                isDark
                  ? "bg-white/5 border border-white/5 hover:border-orange-500/20"
                  : "bg-gray-50 border border-gray-200 hover:border-orange-500/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div
                    className={`text-sm font-semibold mb-1 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user.email}
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {user.templates}
                  </div>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    user.severity === "high"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : user.severity === "medium"
                        ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  }`}
                >
                  {user.daysAgo} días atrás
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            isDark
              ? "bg-linear-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/20 hover:border-orange-500/40"
              : "bg-linear-to-r from-orange-500/10 to-red-500/10 text-orange-600 border border-orange-500/20 hover:border-orange-500/40"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Enviar Recordatorio Automático
          </div>
        </button>
      </div>
    </motion.div>
  );
});

ZombieUsers.displayName = "ZombieUsers";
