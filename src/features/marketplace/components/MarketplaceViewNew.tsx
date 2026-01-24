"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Search, Filter, Play, ChevronDown } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { TrustBadges } from "@/features/marketplace/components/TrustBadges";
import { ProductCardPremium } from "@/features/marketplace/components/ProductCardPremium";
import { PurchaseFlow } from "./PurchaseFlow";
import { ProductSkeleton } from "@/features/marketplace/components/ProductSkeleton";
import { TestimonialsSection } from "@/features/marketplace/components/TestimonialsSection";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { LoginModal } from "@/features/auth/components/LoginModal";
import { ProductDetailModal } from "./ProductDetailModal";

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
    category: "Automatización",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    demoUrl: "#demo",
    stack: ["Python", "FastAPI", "React"],
    tags: ["Automatización", "Empresarial", "No-Code"],
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
    category: "Infraestructura",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    demoUrl: "#demo",
    stack: ["AWS", "Kubernetes", "Terraform"],
    tags: ["Cloud", "Global", "CDN"],
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
    category: "Analytics",
    videoUrl: "https://www.youtube.com/embed/L_LUpnjgPso",
    stack: ["Power BI", "Python", "TensorFlow"],
    tags: ["IA", "Analytics", "Dashboard"],
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
    category: "Seguridad",
    videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
    demoUrl: "#demo",
    stack: ["Firewall", "SIEM", "Zero Trust"],
    tags: ["Ciberseguridad", "Compliance", "Protección"],
  },
  // Duplicated Items for Demo
  {
    id: 5,
    title: "Automatización Financiera Pro",
    description:
      "Gestión contable automática. Conciliación bancaria en tiempo real y reportes fiscales al instante.",
    price: "$3,200",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1080",
    features: ["Conciliación automática", "Reportes fiscales", "Multi-moneda"],
    rating: 4.7,
    reviews: 156,
    category: "Finanzas",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    stack: ["Python", "Django", "PostgreSQL"],
    tags: ["Finanzas", "Contabilidad", "Automatización"],
  },
  {
    id: 6,
    title: "CRM Inteligente Global",
    description:
      "Gestión de clientes potenciada por IA. Predicción de ventas y automatización de seguimiento.",
    price: "$150/mes",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1080",
    features: ["Lead scoring IA", "Email marketing", "Pipeline visual"],
    rating: 4.8,
    reviews: 320,
    category: "Ventas",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    stack: ["React", "Node.js", "MongoDB"],
    tags: ["CRM", "Ventas", "IA"],
  },
  {
    id: 7,
    title: "Motor de Búsqueda Semántico",
    description:
      "Búsqueda interna para tu empresa que entiende el contexto. Encuentra documentos y datos al instante.",
    price: "$5,500",
    image:
      "https://images.unsplash.com/photo-1558494949-ef2a27883bb4?auto=format&fit=crop&q=80&w=1080",
    features: ["Búsqueda vectorial", "Indexación automática", "OCR incluido"],
    rating: 4.9,
    reviews: 89,
    category: "IA",
    videoUrl: "https://www.youtube.com/embed/L_LUpnjgPso",
    stack: ["Elasticsearch", "Python", "Bert"],
    tags: ["Búsqueda", "NLP", "Enterprise"],
  },
  {
    id: 8,
    title: "Plataforma IoT Industrial",
    description:
      "Monitoreo de maquinaria en tiempo real. Mantenimiento predictivo para evitar paradas costosas.",
    price: "$12,000",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1080",
    features: [
      "Sensores en tiempo real",
      "Alertas predictivas",
      "Dashboard 3D",
    ],
    rating: 5.0,
    reviews: 45,
    category: "IoT",
    videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
    stack: ["Go", "MQTT", "InfluxDB"],
    tags: ["IoT", "Industrial", "Mantenimiento"],
  },
  {
    id: 9,
    title: "Blockchain Supply Chain",
    description:
      "Trazabilidad inmutable para tu cadena de suministro. Transparencia total desde el origen hasta el cliente.",
    price: "$8,500",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1080",
    features: [
      "Smart Contracts",
      "Trazabilidad QR",
      "Auditoría en tiempo real",
    ],
    rating: 4.6,
    reviews: 112,
    category: "Blockchain",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    stack: ["Solidity", "Ethereum", "Web3.js"],
    tags: ["Blockchain", "Logística", "Supply Chain"],
  },
  {
    id: 10,
    title: "Generador de Contenido IA",
    description:
      "Crea contenido de marketing de alta calidad en segundos. Blog posts, social media y emails optimizados.",
    price: "$99/mes",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1080",
    features: ["SEO automático", "Multi-idioma", "Generación de imágenes"],
    rating: 4.8,
    reviews: 567,
    category: "Marketing",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    stack: ["GPT-4", "Next.js", "Vercel"],
    tags: ["IA", "Marketing", "Contenido"],
  },
  {
    id: 11,
    title: "Sistema de RRHH Integral",
    description:
      "Gestión de talento, nómina y evaluaciones en una sola plataforma. Mejora la experiencia de tus empleados.",
    price: "$2,500",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1080",
    features: ["Portal del empleado", "Nómina automática", "Evaluaciones 360"],
    rating: 4.7,
    reviews: 203,
    category: "RRHH",
    videoUrl: "https://www.youtube.com/embed/L_LUpnjgPso",
    stack: ["Ruby on Rails", "React", "PostgreSQL"],
    tags: ["RRHH", "Talento", "Nómina"],
  },
  {
    id: 12,
    title: "E-commerce Headless Starter",
    description:
      "La base perfecta para tu tienda online ultra-rápida. Frontend desacoplado listo para escalar.",
    price: "$1,800",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1080",
    features: ["PWA incluida", "SEO optimizado", "Integración Stripe"],
    rating: 4.9,
    reviews: 178,
    category: "E-commerce",
    videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
    stack: ["Next.js", "Shopify API", "Tailwind"],
    tags: ["E-commerce", "Headless", "Starter"],
  },
];

export const MarketplaceViewNew: React.FC = () => {
  const { theme } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[0] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchSticky, setIsSearchSticky] = useState(false);

  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState<
    (typeof products)[0] | null
  >(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Refs for scroll detection
  const heroRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleProductSelect = (product: (typeof products)[0]) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setSelectedProduct(product);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  // Infinite Scroll Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          !isLoadingMore &&
          visibleCount < filteredProducts.length
        ) {
          setIsLoadingMore(true);
          // Simulate network delay for natural feel
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 6, products.length));
            setIsLoadingMore(false);
          }, 800);
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [isLoadingMore, visibleCount, filteredProducts.length]);

  // Get visible products
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for sticky search bar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When hero is not intersecting (scrolled past), make search sticky
        setIsSearchSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" },
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll to catalog indicator
  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`
        min-h-screen rounded-2xl transition-all duration-500
        ${isDark ? "bg-[#000000]" : "bg-white"}
      `}
    >
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .catalog-scroll::-webkit-scrollbar {
          width: 1px;
        }
        .catalog-scroll::-webkit-scrollbar-track {
          background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
          border-radius: 3px;
        }
        .catalog-scroll::-webkit-scrollbar-thumb {
          background: ${isDark ? "rgba(0,255,255,0.3)" : "rgba(0,0,0,0.2)"};
          border-radius: 3px;
        }
        .catalog-scroll::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? "rgba(0,255,255,0.5)" : "rgba(0,0,0,0.3)"};
        }
        .catalog-scroll {
          scrollbar-width: thin;
          scrollbar-color: ${isDark
            ? "rgba(0,255,255,0.3) rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.2) rgba(0,0,0,0.05)"};
        }
      `}</style>

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

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onPurchase={() => {
          if (detailProduct) {
            setDetailProduct(null);
            handleProductSelect(detailProduct);
          }
        }}
      />

      {/* ========== HERO SECTION ========== */}
      <div ref={heroRef} className="relative p-8 pb-0">
        <div className="relative w-full aspect-32/9 overflow-hidden rounded-3xl shadow-2xl">
          <div
            className={`absolute inset-0 z-10 ${
              isDark
                ? "bg-linear-to-r from-black via-black/40 to-transparent"
                : "bg-linear-to-r from-white via-white/70 to-transparent"
            }`}
          />
          <ImageWithFallback
            src={`/images/marketplace_hero_${isDark ? "dark" : "light"}_v7.png`}
            fill
            priority
            className="object-cover"
            alt="Hero Background"
          />

          <div className="absolute inset-0 flex flex-col justify-center px-12 z-20 max-w-3xl">
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
          onClick={scrollToCatalog}
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

      {/* ========== STICKY SEARCH BAR ========== */}
      <div
        ref={catalogRef}
        className={`
          ${isSearchSticky ? "sticky -top-[35px] z-30 py-2" : "relative py-4"}
          transition-all duration-300 px-8
          ${isSearchSticky && isDark ? "bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20" : ""}
          ${isSearchSticky && !isDark ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-md" : ""}
        `}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`
              flex items-center gap-3 p-2 rounded-2xl transition-all
              ${
                isDark
                  ? "bg-[#0a0a0a] border border-white/10 shadow-2xl"
                  : "bg-white border border-gray-200 shadow-2xl"
              }
            `}
          >
            <Search
              className={`ml-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}
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
                  isDark
                    ? "text-white placeholder-gray-500"
                    : "text-gray-900 placeholder-gray-400"
                }
              `}
            />
            <button
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${
                  isDark
                    ? "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }
              `}
            >
              <Filter size={16} />
              Filtros
            </button>
            <button
              className={`
                px-6 py-2.5 rounded-xl font-medium text-sm transition-all
                ${
                  isDark
                    ? "bg-cyan-500 text-black hover:bg-cyan-400"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }
              `}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* ========== PRODUCTS CATALOG (Contained Scroll) ========== */}
      <div className="px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between py-6">
            <div>
              <h2
                className={`text-3xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Soluciones Disponibles
              </h2>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Cada producto incluye garantía de 30 días y soporte premium
              </p>
            </div>
            <div
              className={`text-xs px-3 py-1.5 rounded-full ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "bg-cyan-50 text-cyan-700 border border-cyan-200"
              }`}
            >
              {products.length} productos
            </div>
          </div>

          {/* Product Grid - Global Scroll */}
          <div className="rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6">
              {isLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </>
              ) : (
                visibleProducts.map((product) => (
                  <ProductCardPremium
                    key={product.id}
                    {...product}
                    onSelect={() => handleProductSelect(product)}
                    onViewDetails={() => setDetailProduct(product)}
                  />
                ))
              )}
            </div>

            {/* Infinite Scroll Sentinel & Loader */}
            <div
              ref={loadMoreRef}
              className="h-20 flex items-center justify-center"
            >
              {isLoadingMore && visibleCount < filteredProducts.length && (
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full border-2 border-t-transparent animate-spin ${
                      isDark ? "border-cyan-500" : "border-gray-900"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isDark ? "text-cyan-500" : "text-gray-600"
                    }`}
                  >
                    Cargando más soluciones...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========== VIDEO DEMO SECTION ========== */}
      <div className="px-8 pt-8">
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
                  En este video de 2 minutos, descubra lo fácil que es activar
                  su nueva solución empresarial. Sin jerga técnica, solo
                  claridad total.
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
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwbWVldGluZyUyMG1vZGVybiUyMG9mZmljZXxlbnwxfHx8fDE3Njg1ODE1OTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
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
              text-center py-16 rounded-3xl mb-8
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
              Procesamos cada transacción con el mismo nivel de seguridad que
              los bancos suizos. Su información jamás se comparte. Garantizado.
            </p>
            <TrustBadges />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
