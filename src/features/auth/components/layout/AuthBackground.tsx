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

  const activeMode = isMobile ? "signin" : mode;

  const imageSrc = isDark
    ? activeMode === "signin"
      ? "/images/auth/loguin30.webp"
      : "/images/auth/loguin40.webp"
    : activeMode === "signin"
      ? "/images/auth/loguin3.webp"
      : "/images/auth/loguin4.webp";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isMobile ? "mobile-bg" : mode}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={imageSrc}
          alt="Background"
          fill
          priority
          className="object-cover transition-all duration-700"
          style={{
            objectPosition: activeMode === "signin" ? "70% center" : "30% center",
          }}
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-linear-to-br from-black/60 via-black/50 to-black/70"
              : "bg-linear-to-br from-black/40 via-black/30 to-black/50"
          }`}
        />
      </motion.div>
    </AnimatePresence>
  );
};
