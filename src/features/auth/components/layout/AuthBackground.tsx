"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface AuthBackgroundProps {
  mode: "signin" | "signup";
  isDark: boolean;
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({
  mode,
  isDark,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const imageSrc = isDark
    ? mode === "signin"
      ? "/images/auth/loguin30.webp"
      : "/images/auth/loguin40.webp"
    : mode === "signin"
      ? "/images/auth/loguin3.webp"
      : "/images/auth/loguin4.webp";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${mode}-${isDark}`}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <Image
          src={imageSrc}
          alt="Background"
          fill
          priority
          className="object-cover transition-all duration-700"
          style={{
            objectPosition: isMobile
              ? "center center"
              : mode === "signin"
                ? "70% center"
                : "30% center",
          }}
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-linear-to-b from-black/75 via-black/60 to-black/80 md:bg-linear-to-br md:from-black/60 md:via-black/50 md:to-black/70"
              : "bg-linear-to-b from-white/70 via-white/50 to-white/80 md:bg-linear-to-br md:from-black/40 md:via-black/30 md:to-black/50"
          }`}
        />
      </motion.div>
    </AnimatePresence>
  );
};
