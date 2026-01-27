import React from "react";
import { ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { Collision } from "@/features/licensing/constants/mock-data";

interface CollisionCardProps {
  collision: Collision;
  index: number;
  onRevokeClick: (collision: Collision) => void;
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative p-8 rounded-3xl border overflow-hidden transition-all duration-500 ${
        isDark
          ? "bg-black/40 border-rose-500/20 hover:border-rose-500/40"
          : "bg-white border-rose-100 shadow-xl shadow-rose-900/5"
      }`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-linear-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${
              isDark
                ? "bg-rose-500/10 text-rose-500"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            <ShieldAlert size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3
                className={`text-xl font-black uppercase tracking-tighter italic ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Collision Protocol
              </h3>
              <span className="px-2 py-0.5 rounded-sm bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                Critical
              </span>
            </div>
            <p
              className={`text-sm mt-1 font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              License{" "}
              <span className="font-mono font-bold text-rose-500">
                {collision.licenseId}
              </span>{" "}
              detected on
              <span className="font-black px-1.5">
                {collision.ipCount}
              </span>{" "}
              unique IPs.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full border-2 ${isDark ? "border-black bg-gray-800" : "border-white bg-gray-100"}`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Ip Limit Exceeded: {collision.license.maxIpSlots} max
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onRevokeClick(collision)}
          className={`relative px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs overflow-hidden transition-all active:scale-95 ${
            isDark
              ? "bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_30px_rgba(244,63,94,0.2)]"
              : "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/30"
          }`}
        >
          Terminate Key
        </button>
      </div>
    </motion.div>
  );
};
