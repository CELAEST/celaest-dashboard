import React from "react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface Template {
  name: string;
  executions: number;
  color: string;
}

interface TopTemplatesProps {
  templates: Template[];
}

const RANK_COLORS = ["text-amber-400", "text-gray-400", "text-orange-600", "text-gray-500", "text-gray-500"];

export const TopTemplates = React.memo(({ templates }: TopTemplatesProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const maxExec = Math.max(...templates.map((t) => t.executions), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={`rounded-2xl overflow-hidden transition-all duration-200 h-full flex flex-col ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20"
          : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="p-6 flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isDark ? "bg-cyan-400" : "bg-blue-500"}`} />
            <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Plantillas Más Usadas
            </h3>
          </div>
          <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            {templates.length} plantillas
          </span>
        </div>

        <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
          {templates.map((template, idx) => {
            const pct = Math.round((template.executions / maxExec) * 100);
            return (
              <div key={idx} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    {/* rank badge */}
                    <span className={`text-[11px] font-black w-5 text-center shrink-0 ${RANK_COLORS[idx] ?? "text-gray-500"}`}>
                      #{idx + 1}
                    </span>
                    <span className={`text-sm font-medium truncate max-w-40 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      {template.name}
                    </span>
                  </div>
                  <span className={`text-xs font-bold tabular-nums shrink-0 ${isDark ? "text-cyan-400" : "text-blue-600"}`}>
                    {template.executions.toLocaleString()}
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.7 + idx * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${
                      isDark
                        ? "bg-linear-to-r from-cyan-400 to-blue-500"
                        : "bg-linear-to-r from-blue-500 to-indigo-500"
                    }`}
                    style={{ opacity: 1 - idx * 0.12 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
});

TopTemplates.displayName = "TopTemplates";
