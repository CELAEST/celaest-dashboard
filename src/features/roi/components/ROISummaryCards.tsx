import React from "react";
import { motion } from "motion/react";
import { TrendUp, TrendDown, Icon } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface Metric {
  icon: Icon;
  label: string;
  value: string;
  subtext: string;
  change: string;
  positive: boolean;
}

interface ROISummaryCardsProps {
  metrics: Metric[];
}

const CARD_ACCENTS = [
  { gradient: "from-cyan-400/20 to-blue-500/20",   text: "text-cyan-400",   shadow: "shadow-cyan-500/20",   glow: "from-cyan-400 to-blue-500"    },
  { gradient: "from-violet-400/20 to-purple-500/20", text: "text-violet-400", shadow: "shadow-violet-500/20", glow: "from-violet-400 to-purple-500" },
  { gradient: "from-emerald-400/20 to-teal-500/20", text: "text-emerald-400", shadow: "shadow-emerald-500/20", glow: "from-emerald-400 to-teal-500"  },
  { gradient: "from-amber-400/20 to-orange-500/20", text: "text-amber-400",   shadow: "shadow-amber-500/20",  glow: "from-amber-400 to-orange-500"  },
];

export const ROISummaryCards = React.memo(
  ({ metrics }: ROISummaryCardsProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length];
          const TrendIcon = metric.positive ? TrendUp : TrendDown;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                isDark
                  ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]"
                  : "bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
              }`}
            >
              {/* Glow accent on hover */}
              <div
                className={`absolute -inset-1 bg-linear-to-br ${accent.glow} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`}
              />

              <div className="relative">
                {/* Icon + badge row */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 bg-linear-to-br ${accent.gradient} ${accent.text} shadow-lg ${accent.shadow}`}
                  >
                    <metric.icon size={22} weight="duotone" />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold ${
                      metric.positive
                        ? isDark
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-emerald-50 text-emerald-600"
                        : isDark
                          ? "bg-red-500/10 text-red-400"
                          : "bg-red-50 text-red-600"
                    }`}
                  >
                    <TrendIcon size={12} weight="bold" />
                    {metric.change}
                  </div>
                </div>

                {/* Label */}
                <div
                  className={`text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {metric.label}
                </div>
                {/* Value */}
                <div
                  className={`text-3xl font-bold tracking-tight mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {metric.value}
                </div>
                {/* Subtext */}
                <div
                  className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {metric.subtext}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  },
);

ROISummaryCards.displayName = "ROISummaryCards";
