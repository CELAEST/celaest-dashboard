"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sun, Moon, Search, Filter, Play } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { TrustBadges } from "@/features/marketplace/components/TrustBadges";
import { ProductCardPremium } from "@/features/marketplace/components/ProductCardPremium";
import { PurchaseFlow } from "./PurchaseFlow";
import { ProductSkeleton } from "@/features/marketplace/components/ProductSkeleton";
import { TestimonialsSection } from "@/features/marketplace/components/TestimonialsSection";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { LoginModal } from "@/features/auth/components/LoginModal";

const products = [
  {
    id: 1,
    title: "Sistema de Automatización Empresarial",
    description:
      "Automatiza tus procesos de negocio sin código. Listo para usar en 5 minutos con soporte completo incluido.",
    price: "$4,500",
    image:
      "https://images.unsplash.com/photo-1614064642578-7faacdc6336e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBzZWN1cmUlMjBkaWdpdGFsJTIwdmF1bHQlMjBhY2Nlc3N8ZW58MXx8fHwxNzY4NTc4NDY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Listo para usar en 5 minutos",
      "Configuración automática incluida",
      "Soporte técnico 24/7 premium",
      "Actualizaciones de por vida",
    ],
    badge: "Más Popular",
    rating: 4.9,
    reviews: 234,
  },
  {
    id: 2,
    title: "Infraestructura Global Optimizada",
    description:
      "Red de alta velocidad distribuida globalmente. Sin configuración técnica, activación instantánea.",
    price: "$1,200/mes",
    image:
      "https://images.unsplash.com/photo-1664526936810-ec0856d31b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGFic3RyYWN0JTIwbmV0d29yayUyMGNvbm5lY3Rpdml0eSUyMGJsdWUlMjBub2Rlc3xlbnwxfHx8fDE3Njg1Nzg0NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Cobertura en 150+ países",
      "Velocidad garantizada",
      "Monitoreo en tiempo real",
      "Escalable automáticamente",
    ],
    rating: 4.8,
    reviews: 189,
  },
  {
    id: 3,
    title: "Suite de Análisis Inteligente",
    description:
      "Inteligencia de datos avanzada sin complejidad. Dashboards listos, insights automáticos.",
    price: "$8,900",
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhdGElMjB2aXN1YWxpemF0aW9uJTIwZnV0dXJpc3RpYyUyMGhvbG9ncmFtfGVufDF8fHx8MTc2ODU4MTU5OHww&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Reportes automáticos diarios",
      "Predicciones con IA incluidas",
      "Integración con 100+ plataformas",
      "Garantía de precisión 99.5%",
    ],
    badge: "Nuevo",
    rating: 5.0,
    reviews: 67,
  },
  {
    id: 4,
    title: "Seguridad Empresarial Avanzada",
    description:
      "Protección completa sin mantenimiento. Sistema inteligente que se actualiza automáticamente.",
    price: "$2,100",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwbG9jayUyMHNlY3VyZSUyMHByb3RlY3Rpb258ZW58MXx8fHwxNzY4NTgxNTk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Protección activa 24/7",
      "Detección automática de amenazas",
      "Cumplimiento regulatorio incluido",
      "Auditorías de seguridad mensuales",
    ],
    rating: 4.9,
    reviews: 412,
  },
];

export const MarketplaceViewNew: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[0] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleProductSelect = (product: (typeof products)[0]) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setSelectedProduct(product);
    }
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
      min-h-screen -m-8 p-8 transition-all duration-500
      ${theme === "dark" ? "bg-[#000000]" : "bg-white"}
    `}
    >
      <PurchaseFlow
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Sign in to purchase this enterprise solution."
      />

      {/* Hero Section - Clean & Trust-focused */}
      <div className="relative mb-16">
        {/* Video Background (opcional) */}
        <div className="relative h-[400px] w-full overflow-hidden rounded-3xl">
          <div
            className={`absolute inset-0 z-10 ${
              theme === "dark"
                ? "bg-linear-to-r from-black via-black/80 to-transparent"
                : "bg-linear-to-r from-white via-white/90 to-transparent"
            }`}
          />
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwdGVjaG5vbG9neSUyMHdvcmtzcGFjZSUyMGNsZWFufGVufDF8fHx8MTc2ODU4MTU5OHww&ixlib=rb-4.1.0&q=80&w=1080"
            className={`w-full h-full object-cover ${
              theme === "dark" ? "opacity-30" : "opacity-20"
            }`}
            alt="Hero Background"
          />

          {/* Theme Toggle - Top Right */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`
              absolute top-6 right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all
              ${
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
              }
            `}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <div className="absolute bottom-0 left-0 p-12 z-20 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className={`text-5xl font-bold mb-4 leading-tight ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Tecnología Empresarial
                <br />
                <span
                  className={`${
                    theme === "dark" ? "text-cyan-400" : "text-cyan-600"
                  }`}
                >
                  Simple y Confiable
                </span>
              </h1>
              <p
                className={`text-lg mb-6 max-w-xl leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
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

        {/* Clean Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto -mt-8 relative z-30"
        >
          <div
            className={`
            flex items-center gap-3 p-2 rounded-2xl transition-all
            ${
              theme === "dark"
                ? "bg-[#0a0a0a] border border-white/10 shadow-2xl"
                : "bg-white border border-gray-200 shadow-2xl"
            }
          `}
          >
            <Search
              className={`ml-4 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type="text"
              placeholder="¿Qué necesitas automatizar hoy?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                flex-1 bg-transparent border-none outline-none text-sm
                ${
                  theme === "dark"
                    ? "text-white placeholder-gray-500"
                    : "text-gray-900 placeholder-gray-400"
                }
              `}
            />
            <button
              className={`
                px-6 py-3 rounded-xl font-medium text-sm transition-all
                ${
                  theme === "dark"
                    ? "bg-cyan-500 text-black hover:bg-cyan-400"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }
              `}
            >
              Buscar
            </button>
          </div>
        </motion.div>
      </div>

      {/* Products Grid - Ultra Clean */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className={`text-3xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Soluciones Disponibles
            </h2>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Cada producto incluye garantía de 30 días y soporte premium
            </p>
          </div>
          <button
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                theme === "dark"
                  ? "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
              }
            `}
          >
            <Filter size={16} />
            Filtros
          </button>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </>
          ) : (
            products.map((product) => (
              <ProductCardPremium
                key={product.id}
                {...product}
                onSelect={() => handleProductSelect(product)}
              />
            ))
          )}
        </div>

        {/* Video Explainer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`
            rounded-3xl overflow-hidden mb-16
            ${
              theme === "dark"
                ? "bg-linear-to-br from-cyan-900/20 to-black border border-cyan-500/20"
                : "bg-linear-to-br from-cyan-50 to-white border border-cyan-200"
            }
          `}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-12">
            <div className="flex flex-col justify-center space-y-6">
              <h3
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Vea cómo funciona
              </h3>
              <p
                className={`text-lg leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
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
                      theme === "dark"
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
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  2 minutos
                </span>
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwbWVldGluZyUyMG1vZGVybiUyMG9mZmljZXxlbnwxfHx8fDE3Njg1ODE1OTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                className="w-full h-full object-cover"
                alt="Demo"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-cyan-500" : "bg-white"
                  }`}
                >
                  <Play
                    size={32}
                    className={
                      theme === "dark" ? "text-black" : "text-gray-900"
                    }
                    fill="currentColor"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Final Trust Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={`
            text-center py-16 rounded-3xl mb-8
            ${
              theme === "dark"
                ? "bg-linear-to-b from-black to-cyan-950/20"
                : "bg-linear-to-b from-gray-50 to-cyan-50/30"
            }
          `}
        >
          <h3
            className={`text-2xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Su inversión está protegida
          </h3>
          <p
            className={`text-sm mb-8 max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Procesamos cada transacción con el mismo nivel de seguridad que los
            bancos suizos. Su información jamás se comparte. Garantizado.
          </p>
          <TrustBadges />
        </motion.div>
      </div>
    </div>
  );
};
