"use client";

import React from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { TrustBadges } from "@/features/marketplace/components/TrustBadges";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const MarketplacePublicHero: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleScrollToCatalog = () => {
    const catalog = document.getElementById("marketplace-catalog");
    if (catalog) {
      catalog.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative p-8 pb-0">
      <div className="relative w-full aspect-32/9 overflow-hidden rounded-3xl shadow-2xl">
        <div
          className={`absolute inset-0 z-10 ${
            isDark
              ? "bg-linear-to-r from-black via-black/40 to-transparent"
              : "bg-linear-to-r from-white via-white/70 to-transparent"
          }`}
        />
        <ImageWithFallback
          src={`/images/marketplace_hero_${isDark ? "dark" : "light"}_v7.webp`}
          fill
          priority
          className="object-cover"
          alt="Hero Background"
        />

        <div className="absolute inset-0 flex flex-col justify-center px-12 z-20 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className={`text-5xl font-bold mb-4 leading-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Tecnología Empresarial
              <br />
              <span className={isDark ? "text-cyan-400" : "text-cyan-600"}>
                Innovación Celestial
              </span>
            </h1>
            <p
              className={`text-lg mb-6 max-w-xl leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Soluciones profesionales listas para usar. Sin complejidad
              técnica, sin configuraciones difíciles. Solo resultados
              garantizados.
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
        <span>Explorar catálogo</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </div>
  );
};
