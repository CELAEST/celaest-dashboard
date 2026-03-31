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

const RANK_ACCENTS = [
  { text: "text-amber-400",  bg: "from-amber-400/15 to-amber-500/5",  border: "border-amber-400/20" },
  { text: "text-gray-400",   bg: "from-gray-400/15 to-gray-500/5",    border: "border-gray-400/20" },
  { text: "text-orange-500", bg: "from-orange-400/15 to-orange-500/5", border: "border-orange-400/20" },
  { text: "text-gray-500",   bg: "from-gray-400/10 to-gray-500/5",    border: "border-gray-400/15" },
  { text: "text-gray-500",   bg: "from-gray-400/10 to-gray-500/5",    border: "border-gray-400/15" },
];

export const TopTemplates = React.memo(({ templates }: TopTemplatesProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const maxExec = Math.max(...templates.map((t) => t.executions), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={`rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/8 hover:border-white/15"
          : "bg-white border border-gray-200 shadow-sm hover:border-gray-300"
      }`}
    >
      <div className="p-6 flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${isDark ? "bg-cyan-400" : "bg-blue-500"}`}
              style={{
                boxShadow: isDark
                  ? "0 0 6px 2px rgba(34,211,238,0.4)"
                  : "0 0 4px 1px rgba(59,130,246,0.3)",
              }}
            />
            <h3 className={`text-sm font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              Plantillas Más Usadas
            </h3>
          </div>
          <span className={`text-[9px] font-mono font-semibold uppercase tracking-widest ${isDark ? "text-gray-600" : "text-gray-400"}`}>
            {templates.length} plantillas
          </span>
        </div>

        <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
          {templates.map((template, idx) => {
            const pct = Math.round((template.executions / maxExec) * 100);
            const rank = RANK_ACCENTS[idx] ?? RANK_ACCENTS[4];
            return (
              <div key={idx} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    {/* Glassmorphic rank badge */}
                    <div
                      className={`w-5 h-5 rounded-[5px] flex items-center justify-center text-[9px] font-black shrink-0 bg-linear-to-b border ${
                        isDark
                          ? `${rank.bg} ${rank.border} ${rank.text} shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`
                          : `from-white to-gray-50 border-gray-200 ${rank.text} shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.04)]`
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className={`text-sm font-medium truncate max-w-40 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      {template.name}
                    </span>
                  </div>
                  <span className={`text-xs font-black tabular-nums tracking-tight shrink-0 ${isDark ? "text-cyan-400" : "text-blue-600"}`}>
                    {template.executions.toLocaleString()}
                  </span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.7 + idx * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${
                      isDark
                        ? "bg-linear-to-r from-cyan-400 to-blue-500"
                        : "bg-linear-to-r from-blue-500 to-indigo-500"
                    }`}
                    style={{ opacity: 1 - idx * 0.1 }}
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
