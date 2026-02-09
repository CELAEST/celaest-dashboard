"use client";

import React from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { TrustBadges } from "@/features/marketplace/components/TrustBadges";
import { TestimonialsSection } from "@/features/marketplace/components/TestimonialsSection";

export const VideoDemoSection = React.memo(function VideoDemoSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="px-8 pt-8 pb-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`
            rounded-3xl overflow-hidden mb-16
            ${
              isDark
                ? "bg-linear-to-br from-cyan-900/20 to-black border border-cyan-500/20"
                : "bg-linear-to-br from-cyan-50 to-white border border-cyan-200"
            }
          `}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-12">
            <div className="flex flex-col justify-center space-y-6">
              <h3
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Vea cómo funciona
              </h3>
              <p
                className={`text-lg leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                En este video de 2 minutos, descubra lo fácil que es activar su
                nueva solución empresarial. Sin jerga técnica, solo claridad
                total.
              </p>
              <div className="flex items-center gap-3">
                <button
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                    ${
                      isDark
                        ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                        : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
                    }
                  `}
                >
                  <Play size={18} fill="currentColor" />
                  Ver Demo
                </button>
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  2 minutos
                </span>
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwbWVldGluZyUyMG1vZGVybiUyMG9mZmljZXxlbnwxfHx8fDE3Njg1Nzg0NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                className="w-full h-full object-cover"
                alt="Demo"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    isDark ? "bg-cyan-500" : "bg-white"
                  }`}
                >
                  <Play
                    size={32}
                    className={isDark ? "text-black" : "text-gray-900"}
                    fill="currentColor"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========== TESTIMONIALS ========== */}
        <TestimonialsSection />

        {/* ========== FINAL TRUST SECTION ========== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={`
            text-center py-16 rounded-3xl mb-8 mt-16
            ${
              isDark
                ? "bg-linear-to-b from-black to-cyan-950/20"
                : "bg-linear-to-b from-gray-50 to-cyan-50/30"
            }
          `}
        >
          <h3
            className={`text-2xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Su inversión está protegida
          </h3>
          <p
            className={`text-sm mb-8 max-w-2xl mx-auto ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Procesamos cada transacción con el mismo nivel de seguridad que los
            bancos suizos. Su información jamás se comparte. Garantizado.
          </p>
          <TrustBadges className="justify-center" />
        </motion.div>
      </div>
    </div>
  );
});
