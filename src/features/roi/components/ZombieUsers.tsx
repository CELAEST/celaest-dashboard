import React from "react";
import { motion } from "motion/react";
import { Warning, BellRinging } from "@phosphor-icons/react";
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
  high:   { label: "Alto",   ring: "ring-red-500/30",    bg: "bg-red-500/10",    text: "text-red-400",    avatar: "from-red-500/30 to-red-600/20" },
  medium: { label: "Medio",  ring: "ring-orange-500/30", bg: "bg-orange-500/10", text: "text-orange-400", avatar: "from-orange-500/30 to-amber-600/20" },
  low:    { label: "Bajo",   ring: "ring-yellow-500/30", bg: "bg-yellow-500/10", text: "text-yellow-400", avatar: "from-yellow-500/30 to-yellow-600/20" },
};

export const ZombieUsers = React.memo(({ users }: ZombieUsersProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className={`rounded-2xl overflow-hidden transition-all duration-200 h-full flex flex-col ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20"
          : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="p-6 flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Usuarios Zombie Detectados
            </h3>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
            {users.length}
          </span>
        </div>

        <p className={`text-xs mb-4 shrink-0 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
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
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.01] ${
                  isDark
                    ? `bg-white/5 border border-white/5 hover:border-orange-500/20 ring-1 ring-inset ${sev.ring}`
                    : `bg-gray-50 border border-gray-200 hover:border-orange-300`
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-[11px] font-black bg-linear-to-br ${sev.avatar} border ${isDark ? "border-white/10" : "border-gray-200"}`}
                >
                  <span className={isDark ? "text-white/70" : "text-gray-600"}>
                    {getInitials(user.email)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                    {user.email}
                  </div>
                  <div className={`text-xs truncate ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    {user.templates}
                  </div>
                </div>

                {/* Badge */}
                <div className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${sev.bg} ${sev.text} ${isDark ? `border-${sev.text.replace("text-", "")}/20` : "border-transparent"}`}>
                  {user.daysAgo}d
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <button
          className={`w-full shrink-0 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2 ${
            isDark
              ? "bg-linear-to-r from-orange-500/15 to-red-500/15 text-orange-400 border border-orange-500/20 hover:border-orange-500/40 hover:from-orange-500/25 hover:to-red-500/25"
              : "bg-linear-to-r from-orange-50 to-red-50 text-orange-600 border border-orange-200 hover:border-orange-300"
          }`}
        >
          <BellRinging size={16} weight="duotone" />
          Enviar Recordatorio Automático
        </button>
      </div>
    </motion.div>
  );
});

ZombieUsers.displayName = "ZombieUsers";
