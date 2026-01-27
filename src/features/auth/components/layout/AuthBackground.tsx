"use client";

import React from "react";
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
        key={mode}
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
            objectPosition: mode === "signin" ? "70% center" : "30% center",
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
