"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface AuthBackgroundProps {
  mode: "signin" | "signup";
  isDark: boolean;
}

const AUTH_MEDIA_MAP = {
  dark: {
    signin: {
      video: "/auth-media/access-login-dark.mp4",
      poster: "/auth-media/access-login-dark.webp",
    },
    signup: {
      video: "/auth-media/access-register-dark.mp4",
      poster: "/auth-media/access-register-dark.webp",
    },
  },
  light: {
    signin: {
      video: "/auth-media/access-login-light.mp4",
      poster: "/auth-media/access-login-light.webp",
    },
    signup: {
      video: "/auth-media/access-register-light.mp4",
      poster: "/auth-media/access-register-light.webp",
    },
  },
} as const;

export const AuthBackground: React.FC<AuthBackgroundProps> = ({
  mode,
  isDark,
}) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const media = isDark ? AUTH_MEDIA_MAP.dark[mode] : AUTH_MEDIA_MAP.light[mode];

  // Subtle spring-damped pointer parallax that idles at zero CPU once settled
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let rafId = 0;

    const tick = () => {
      rafId = 0;
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      current.x += dx * 0.08;
      current.y += dy * 0.08;

      if (layerRef.current) {
        layerRef.current.style.transform = `translate3d(${(-current.x * 10).toFixed(2)}px, ${(-current.y * 7).toFixed(2)}px, 0) scale(1.035)`;
      }

      if (Math.abs(dx) > 0.002 || Math.abs(dy) > 0.002) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (window.innerWidth < 768) return;
      target.x = ((event.clientX / Math.max(window.innerWidth, 1)) - 0.5) * 2;
      target.y = ((event.clientY / Math.max(window.innerHeight, 1)) - 0.5) * 2;
      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-[#06070a]" : "bg-[#f5f6f8]"
      }`}
      aria-hidden="true"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${isDark ? "dark" : "light"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="absolute inset-0"
        >
          <div
            ref={layerRef}
            className="absolute inset-0 will-change-transform scale-[1.035]"
          >
            {/* Immediate first-paint poster image underneath symmetrical looping video */}
            <Image
              src={media.poster}
              alt=""
              fill
              priority
              unoptimized
              draggable={false}
              className={`object-cover object-center select-none ${
                isDark ? "opacity-75" : "opacity-70"
              }`}
            />
            <video
              key={media.video}
              src={media.video}
              poster={media.poster}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className={`absolute inset-0 w-full h-full object-cover object-center ${
                isDark ? "opacity-75" : "opacity-70"
              }`}
            />
          </div>

          {/* Symmetrical Radial Vignette Spotlight protecting center card & twin flanks */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? "radial-gradient(ellipse at 50% 50%, rgba(6, 7, 10, 0.14) 0%, rgba(6, 7, 10, 0.58) 44%, rgba(6, 7, 10, 0.9) 76%, #06070a 100%)"
                : "radial-gradient(ellipse at 50% 50%, rgba(245, 246, 248, 0.12) 0%, rgba(245, 246, 248, 0.72) 50%, rgba(245, 246, 248, 0.93) 78%, #f5f6f8 100%)",
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
