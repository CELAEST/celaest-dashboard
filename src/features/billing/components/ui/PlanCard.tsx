import React from "react";
import { Check, Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Plan } from "../../types";

interface PlanCardProps {
  plan: Plan;
  index: number;
  onClose: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, index, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isPopular = plan.popular;

  // Theme Colors Helper
  const getThemeColors = (color: Plan["color"]) => {
    switch (color) {
      case "blue":
        return {
          border: isPopular
            ? "border-blue-500"
            : isDark
              ? "border-blue-500/20"
              : "border-blue-100",
          bg: isDark ? "bg-slate-900/60" : "bg-white",
          title: isDark ? "text-blue-200" : "text-blue-900",
          price: isDark ? "text-white" : "text-slate-900",
          checkBg: isDark ? "bg-blue-500/20" : "bg-blue-50",
          check: "text-blue-500",
          btn: "bg-blue-600 hover:bg-blue-500",
          glow: "shadow-blue-500/20",
        };
      case "purple":
        return {
          border: isPopular
            ? "border-purple-500"
            : isDark
              ? "border-purple-500/20"
              : "border-purple-100",
          bg: isDark ? "bg-slate-900/80" : "bg-white",
          title: isDark ? "text-purple-200" : "text-purple-900",
          price: isDark ? "text-white" : "text-slate-900",
          checkBg: isDark ? "bg-purple-500/20" : "bg-purple-50",
          check: "text-purple-500",
          btn: "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
          glow: "shadow-purple-500/40",
        };
      case "emerald":
        return {
          border: isPopular
            ? "border-emerald-500"
            : isDark
              ? "border-emerald-500/20"
              : "border-emerald-100",
          bg: isDark ? "bg-slate-900/60" : "bg-white",
          title: isDark ? "text-emerald-200" : "text-emerald-900",
          price: isDark ? "text-white" : "text-slate-900",
          checkBg: isDark ? "bg-emerald-500/20" : "bg-emerald-50",
          check: "text-emerald-500",
          btn: "bg-emerald-600 hover:bg-emerald-500",
          glow: "shadow-emerald-500/20",
        };
    }
  };

  const currentTheme = getThemeColors(plan.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.2, type: "spring", bounce: 0.3 }}
      className={`group relative rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 flex flex-col h-full border backdrop-blur-xl transition-all duration-500 ${
        currentTheme.border
      } ${currentTheme.bg} ${
        isPopular
          ? `shadow-2xl ${currentTheme.glow} ring-1 ring-white/10 z-10 sm:scale-[1.02]`
          : "shadow-lg hover:shadow-xl hover:border-opacity-50"
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 sm:-top-4 left-0 right-0 flex justify-center z-20">
          <div className="bg-linear-to-r from-purple-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-lg shadow-purple-500/40 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />
            Most Popular
          </div>
        </div>
      )}

      {/* Content */}
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <h3
          className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 ${currentTheme.title}`}
        >
          {plan.name}
        </h3>
        <div className="flex items-baseline justify-center gap-1 mb-2 sm:mb-3">
          <span
            className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${currentTheme.price}`}
          >
            {plan.price}
          </span>
          {plan.period && (
            <span
              className={`text-xs sm:text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {plan.period}
            </span>
          )}
        </div>
        <p
          className={`text-xs sm:text-sm leading-relaxed ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {plan.description}
        </p>
      </div>

      <div className="flex-1 space-y-2 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-6 lg:mb-8">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-2 sm:gap-3 group/item">
            <div
              className={`mt-0.5 rounded-full p-0.5 sm:p-1 shrink-0 transition-colors ${currentTheme.checkBg}`}
            >
              <Check
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${currentTheme.check}`}
              />
            </div>
            <span
              className={`text-xs sm:text-sm font-medium ${
                isDark
                  ? "text-gray-300 group-hover/item:text-white"
                  : "text-gray-600 group-hover/item:text-gray-900"
              } transition-colors`}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
        className={`w-full py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-white shadow-lg transition-all duration-300 ${currentTheme.btn} relative overflow-hidden group/btn`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isPopular ? "Get Started Now" : "Choose Plan"}
          {isPopular && (
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-white/20" />
          )}
        </span>
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
      </motion.button>
    </motion.div>
  );
};
