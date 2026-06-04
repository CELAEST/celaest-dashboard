"use client";

import React from "react";
import { motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { TrustBadges } from "@/features/marketplace/components/TrustBadges";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

export const MarketplacePublicHero: React.FC = () => {
  const t = useTranslations("marketplace");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleScrollToCatalog = () => {
    const catalog = document.getElementById("marketplace-catalog");
    if (catalog) {
      catalog.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative p-4 md:p-8 pb-0">
      <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-zinc-950">
        {/* Responsive Background - Replaces the legacy image for better Mobile UX */}
        <div className="absolute inset-0 z-0">
          {/* Base Desktop Image (Optional, hidden on mobile for cleaner UX) */}
          <div className="hidden md:block absolute inset-0 opacity-40">
            <ImageWithFallback
              src={`/images/marketplace_hero_${isDark ? "dark" : "light"}_v7.webp`}
              fill
              priority
              className="object-cover object-[center_right]"
              alt="Hero Background"
            />
          </div>

          {/* Elegant Gradients & Mesh for Mobile & Desktop */}
          <div className={`absolute inset-0 ${isDark ? "bg-[#050505]/80" : "bg-white/90"}`} />
          
          {/* Animated Glow Blobs */}
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-cyan-500/20 blur-[100px] md:blur-[120px]" />
          <div className="absolute -bottom-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[80px] md:blur-[120px]" />
          
          {/* Subtle Grid Pattern for Tech Feel */}
          <div 
            className="absolute inset-0 opacity-[0.03] md:opacity-[0.05]"
            style={{ 
              backgroundImage: isDark 
                ? "linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)"
                : "linear-gradient(rgba(0, 0, 0, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 1) 1px, transparent 1px)",
              backgroundSize: "32px 32px"
            }} 
          />
          
          {/* Reading Gradient Overlay */}
          <div className={`absolute inset-0 ${isDark ? "bg-linear-to-r from-black/80 via-black/40 to-transparent" : "bg-linear-to-r from-white/90 via-white/50 to-transparent"}`} />
        </div>

        <div className="relative z-20 flex flex-col justify-center px-6 md:px-12 py-12 md:py-20 lg:py-24 w-full min-h-[300px] md:min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[800px]"
          >
            <h1
              className={`text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("enterprise_technology")}
              <br />
              <span className={isDark ? "text-cyan-400" : "text-cyan-600"}>
                {t("celestial_innovation")}
              </span>
            </h1>
            <p
              className={`text-sm md:text-lg mb-4 md:mb-6 w-full max-w-[600px] shrink-0 leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("hero_subtitle")}
            </p>
            <TrustBadges />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={handleScrollToCatalog}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={`
            mx-auto mt-6 flex flex-col items-center gap-1 text-sm transition-colors
            ${isDark ? "text-gray-500 hover:text-cyan-400" : "text-gray-400 hover:text-cyan-600"}
          `}
      >
        <span>{t("explore_catalog")}</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <CaretDown size={20} />
        </motion.div>
      </motion.button>
    </div>
  );
};
