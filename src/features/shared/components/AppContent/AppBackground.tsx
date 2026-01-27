import React, { memo } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useTheme } from "@/features/shared/hooks/useTheme";

export const AppBackground = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {isDark && (
        <>
          <div className="absolute inset-0 bg-black/80 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-cyan-900/20 via-[#050505] to-[#050505] z-10" />
        </>
      )}
      {!isDark && (
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-white z-10" />
      )}

      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 1, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1647356161576-4e80c6619a0e?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBibHVlJTIwbmV1cmFsJTIwbmV0d29yayUyMGNvbnN0ZWxsYXRpb24lMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2ODU3Njg3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          className={`w-full h-full object-cover mix-blend-screen transition-opacity duration-500 ${
            isDark ? "opacity-40" : "opacity-1 mix-blend-normal"
          }`}
          alt="background"
        />
      </motion.div>
      {/* Subtle grid overlay */}
      <div
        className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-20 mix-blend-overlay ${
          isDark ? "opacity-20" : "opacity-5"
        }`}
      />
    </div>
  );
});

AppBackground.displayName = "AppBackground";
