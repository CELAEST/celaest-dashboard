import React from "react";
import { Shield, Lock, CheckCircle, Award } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface TrustBadgesProps {
  className?: string;
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ className = "" }) => {
  const { theme } = useTheme();

  const badges = [
    { icon: <Shield size={14} />, text: "Cifrado de Grado Militar" },
    { icon: <Lock size={14} />, text: "Pago Seguro SSL" },
    { icon: <CheckCircle size={14} />, text: "Garantía 30 Días" },
    { icon: <Award size={14} />, text: "Soporte Premium 24/7" },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium
            ${
              theme === "dark"
                ? "bg-cyan-500/5 border border-cyan-500/20 text-cyan-400"
                : "bg-cyan-50 border border-cyan-200 text-cyan-700"
            }
          `}
        >
          {badge.icon}
          <span>{badge.text}</span>
        </motion.div>
      ))}
    </div>
  );
};
