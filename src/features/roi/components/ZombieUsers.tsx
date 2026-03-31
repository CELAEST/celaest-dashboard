import React from "react";
import { motion } from "motion/react";
import { BellRinging } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface User {
  email: string;
  templates: string;
  daysAgo: number;
  severity: string;
}

interface ZombieUsersProps {
  users: User[];
}

function getInitials(email: string) {
  const local = email.split("@")[0];
  const parts = local.split(/[._-]/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : local.slice(0, 2).toUpperCase();
}

const SEVERITY_MAP = {
  high: {
    label: "Alto",
    badgeDark: "bg-red-500/8 text-red-400 border-red-500/20",
    badgeLight: "bg-red-50 text-red-600 border-red-200",
    avatarDark: "from-red-500/20 to-red-600/10 border-red-500/15",
    avatarLight: "from-red-50 to-red-100 border-red-200",
  },
  medium: {
    label: "Medio",
    badgeDark: "bg-orange-500/8 text-orange-400 border-orange-500/20",
    badgeLight: "bg-orange-50 text-orange-600 border-orange-200",
    avatarDark: "from-orange-500/20 to-amber-600/10 border-orange-500/15",
    avatarLight: "from-orange-50 to-amber-100 border-orange-200",
  },
  low: {
    label: "Bajo",
    badgeDark: "bg-yellow-500/8 text-yellow-400 border-yellow-500/20",
    badgeLight: "bg-yellow-50 text-yellow-600 border-yellow-200",
    avatarDark: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/15",
    avatarLight: "from-yellow-50 to-yellow-100 border-yellow-200",
  },
};

export const ZombieUsers = React.memo(({ users }: ZombieUsersProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className={`rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/8 hover:border-white/15"
          : "bg-white border border-gray-200 shadow-sm hover:border-gray-300"
      }`}
    >
      <div className="p-6 flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full bg-orange-500"
              style={{ boxShadow: "0 0 6px 2px rgba(249,115,22,0.4)" }}
            />
            <h3 className={`text-sm font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              Usuarios Zombie Detectados
            </h3>
          </div>
          <span
            className={`text-[9px] font-black tabular-nums px-2 py-0.5 rounded-md border ${
              isDark
                ? "bg-orange-500/8 text-orange-400 border-orange-500/20"
                : "bg-orange-50 text-orange-600 border-orange-200"
            }`}
          >
            {users.length}
          </span>
        </div>

        <p className={`text-[10px] font-medium mb-4 shrink-0 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          Compraron pero no ejecutan plantillas · riesgo de churn
        </p>

        {/* List */}
        <div className="flex flex-col gap-2.5 flex-1 min-h-0 overflow-y-auto mb-4">
          {users.map((user, idx) => {
            const sev = SEVERITY_MAP[user.severity as keyof typeof SEVERITY_MAP] ?? SEVERITY_MAP.low;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.08 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  isDark
                    ? "bg-white/3 border border-white/5 hover:border-orange-500/20"
                    : "bg-gray-50 border border-gray-200 hover:border-orange-300"
                }`}
              >
                {/* Glassmorphic avatar box */}
                <div
                  className={`w-8 h-8 rounded-input shrink-0 flex items-center justify-center text-[10px] font-black bg-linear-to-b border ${
                    isDark
                      ? `${sev.avatarDark} shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_4px_rgba(0,0,0,0.2)]`
                      : `${sev.avatarLight} shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.04)]`
                  }`}
                >
                  <span className={isDark ? "text-white/60" : "text-gray-500"}>
                    {getInitials(user.email)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                    {user.email}
                  </div>
                  <div className={`text-[10px] font-medium truncate ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    {user.templates}
                  </div>
                </div>

                {/* Severity badge */}
                <div
                  className={`shrink-0 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                    isDark ? sev.badgeDark : sev.badgeLight
                  }`}
                >
                  {user.daysAgo}d
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <button
          className={`w-full shrink-0 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-2 border ${
            isDark
              ? "bg-linear-to-r from-orange-500/10 to-red-500/10 text-orange-400 border-orange-500/20 hover:border-orange-500/35 hover:from-orange-500/20 hover:to-red-500/20"
              : "bg-linear-to-r from-orange-50 to-red-50 text-orange-600 border-orange-200 hover:border-orange-300"
          }`}
        >
          <BellRinging size={15} weight="duotone" />
          Enviar Recordatorio Automático
        </button>
      </div>
    </motion.div>
  );
});

ZombieUsers.displayName = "ZombieUsers";
