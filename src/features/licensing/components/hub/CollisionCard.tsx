import React from "react";
import { ShieldWarning } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import type { IPBinding } from "@/features/licensing/types";
import { useTranslations } from "next-intl";

interface CollisionCardProps {
  collision: IPBinding;
  index: number;
  onRevokeClick: (collision: IPBinding) => void;
}

/**
 * A reusable card for displaying license collision details.
 * Encapsulates the visual logic and hover effects for a single collision.
 */
export const CollisionCard: React.FC<CollisionCardProps> = ({
  collision,
  index,
  onRevokeClick,
}) => {
  const { isDark } = useTheme();
  const t = useTranslations("licensing");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative p-4 sm:p-8 rounded-2xl sm:rounded-3xl border overflow-hidden transition-all duration-500 ${
        isDark
          ? "bg-black/40 border-rose-500/20 hover:border-rose-500/40"
          : "bg-white border-rose-100 shadow-xl shadow-rose-900/5"
      }`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-linear-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-6 min-w-0 w-full md:w-auto">
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${
              isDark
                ? "bg-rose-500/10 text-rose-500"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            <ShieldWarning className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h3
                className={`text-base sm:text-xl font-black uppercase tracking-tighter italic ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("collision_protocol")}
              </h3>
              <span className="px-2 py-0.5 rounded-sm bg-rose-500 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest animate-pulse">
                {t("critical")}
              </span>
            </div>
            <p
              className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {t.rich("ip_detected_on", {
                ip: collision.ip_address,
                license: collision.license_id,
                mono: (chunks) => <span className="font-mono font-bold text-rose-500">{chunks}</span>
              })}
            </p>
            <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 ${isDark ? "border-black bg-gray-800" : "border-white bg-gray-100"}`}
                  />
                ))}
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500">
                {t("requests_from_ip", { count: collision.request_count })}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onRevokeClick(collision)}
          className={`w-full md:w-auto relative px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-black uppercase tracking-widest text-xs overflow-hidden transition-all active:scale-95 ${
            isDark
              ? "bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_30px_rgba(244,63,94,0.2)]"
              : "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/30"
          }`}
        >
          {t("terminate_key")}
        </button>
      </div>
    </motion.div>
  );
};
