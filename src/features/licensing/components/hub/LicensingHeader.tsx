import React from "react";
import { Plus } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { motion } from "motion/react";

interface LicensingHeaderProps {
  onCreateClick: () => void;
}

export const LicensingHeader: React.FC<LicensingHeaderProps> = ({
  onCreateClick,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`sticky top-0 z-30 backdrop-blur-xl border-b transition-all duration-300 ${
        isDark ? "bg-black/50 border-white/5" : "bg-white/70 border-gray-100"
      }`}
    >
      <div className="w-full py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className={`text-3xl font-black tracking-tighter uppercase italic ${
                isDark
                  ? "bg-linear-to-r from-white via-white to-white/40 bg-clip-text text-transparent"
                  : "text-gray-900"
              }`}
            >
              Licensing Hub
            </h1>
            <p
              className={`text-xs font-mono tracking-widest uppercase mt-1 ${
                isDark ? "text-cyan-400/60" : "text-blue-600/60"
              }`}
            >
              Master Repository & Security Control
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={onCreateClick}
              className={`group relative flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 overflow-hidden ${
                isDark
                  ? "bg-white text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-cyan-400/20"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
              }`}
            >
              {/* Shine effect for dark mode */}
              {isDark && (
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12" />
              )}
              <Plus
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              <span className="relative z-10">Generate Key</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Subtle bottom glow for section separation */}
      <div
        className={`h-px w-full bg-linear-to-r from-transparent via-cyan-500/20 to-transparent ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};
