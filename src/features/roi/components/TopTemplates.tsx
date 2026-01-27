import React from "react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface Template {
  name: string;
  executions: number;
  color: string;
}

interface TopTemplatesProps {
  templates: Template[];
}

export const TopTemplates = React.memo(({ templates }: TopTemplatesProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-2 h-2 rounded-full ${
              isDark ? "bg-cyan-400" : "bg-blue-500"
            }`}
          />
          <h3
            className={`font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Plantillas Más Usadas
          </h3>
        </div>

        <div className="space-y-4">
          {templates.map((template, idx) => (
            <div key={idx} className="group">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {template.name}
                </span>
                <span
                  className={`text-sm font-bold ${
                    isDark ? "text-cyan-400" : "text-blue-600"
                  }`}
                >
                  {template.executions} ejecuciones
                </span>
              </div>
              <div
                className={`h-2.5 rounded-full overflow-hidden ${
                  isDark ? "bg-white/5" : "bg-gray-100"
                }`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(template.executions / 458) * 100}%`,
                  }}
                  transition={{ delay: 0.7 + idx * 0.1, duration: 0.8 }}
                  className={`h-full rounded-full ${
                    isDark
                      ? "bg-linear-to-r from-cyan-400 to-blue-500"
                      : "bg-linear-to-r from-blue-500 to-indigo-500"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

TopTemplates.displayName = "TopTemplates";
