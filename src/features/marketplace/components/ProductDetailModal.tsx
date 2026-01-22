"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Star,
  Download,
  Calendar,
  Shield,
  CheckCircle2,
  Code,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  features: string[];
  badge?: string;
  rating?: number;
  reviews?: number;
  category?: string;
  author?: string;
  downloads?: number;
  lastUpdated?: string;
  stack?: string[];
  tags?: string[];
  videoUrl?: string;
  demoUrl?: string;
}

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onPurchase?: () => void;
  relatedProducts?: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onPurchase,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState("overview");

  if (!product) return null;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "compatibility", label: "Compatibilidad" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`
            relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl
            ${
              theme === "dark"
                ? "bg-black/90 backdrop-blur-xl border-white/10"
                : "bg-white border-gray-200"
            }
          `}
        >
          {/* Header */}
          <div
            className={`
            sticky top-0 z-10 p-6 flex items-start justify-between border-b
            ${
              theme === "dark"
                ? "bg-black/90 backdrop-blur-xl border-white/10"
                : "bg-white border-gray-200"
            }
          `}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`
                  px-3 py-1 rounded-lg text-xs font-medium border
                  ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 text-gray-300"
                      : "bg-gray-100 border-gray-200 text-gray-700"
                  }
                `}
                >
                  {product.category || "Excel"}
                </span>
                {product.badge && (
                  <span
                    className={`
                    px-3 py-1 rounded-lg text-xs font-bold border-0
                    ${
                      theme === "dark"
                        ? "bg-linear-to-r from-cyan-400 to-blue-400 text-black"
                        : "bg-linear-to-r from-blue-600 to-indigo-600 text-white"
                    }
                  `}
                  >
                    {product.badge}
                  </span>
                )}
              </div>
              <h2
                className={`text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {product.title}
              </h2>
              <div
                className={`flex items-center gap-4 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating || 4.8}</span>
                  <span>({product.reviews || 127} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="size-4" />
                  <span>
                    {(product.downloads || 1543).toLocaleString()} downloads
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span>Updated {product.lastUpdated || "14/1/2025"}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`
                p-2 rounded-xl transition-colors
                ${
                  theme === "dark"
                    ? "hover:bg-white/10 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }
              `}
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 p-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video/Demo */}
              {product.videoUrl && (
                <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900">
                  <iframe
                    src={product.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={product.title}
                  />
                </div>
              )}

              {/* Tabs */}
              <div>
                <div
                  className={`flex gap-1 p-1 rounded-xl ${
                    theme === "dark" ? "bg-white/5" : "bg-gray-100"
                  }`}
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all
                        ${
                          activeTab === tab.id
                            ? theme === "dark"
                              ? "bg-white/10 text-white"
                              : "bg-white text-gray-900 shadow-sm"
                            : theme === "dark"
                              ? "text-gray-400 hover:text-white"
                              : "text-gray-600 hover:text-gray-900"
                        }
                      `}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div>
                        <h3
                          className={`text-lg font-semibold mb-3 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Descripción
                        </h3>
                        <p
                          className={`leading-relaxed ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {product.description}
                        </p>
                      </div>

                      <div>
                        <h3
                          className={`text-lg font-semibold mb-3 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Technology Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(
                            product.stack || ["Excel", "VBA", "Power Query"]
                          ).map((tech) => (
                            <span
                              key={tech}
                              className={`
                                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border
                                ${
                                  theme === "dark"
                                    ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                                    : "bg-purple-50 border-purple-200 text-purple-700"
                                }
                              `}
                            >
                              <Code className="size-3" />
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3
                          className={`text-lg font-semibold mb-3 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(
                            product.tags || [
                              "Dashboard",
                              "Sales",
                              "Analytics",
                              "VBA",
                              "Automation",
                            ]
                          ).map((tag) => (
                            <span
                              key={tag}
                              className={`
                              px-3 py-1.5 rounded-lg text-xs font-medium border
                              ${
                                theme === "dark"
                                  ? "bg-white/5 border-white/10 text-gray-300"
                                  : "bg-gray-100 border-gray-200 text-gray-700"
                              }
                            `}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "features" && (
                    <div className="space-y-3">
                      {[
                        "Fácil de personalizar e integrar",
                        "Documentación completa incluida",
                        "Actualizaciones regulares y correcciones",
                        "Soporte por email del autor",
                        "Garantía de devolución de 30 días",
                        "Acceso de por vida a actualizaciones",
                        ...product.features,
                      ].map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2
                            className={`size-5 mt-0.5 shrink-0 ${
                              theme === "dark"
                                ? "text-emerald-400"
                                : "text-emerald-500"
                            }`}
                          />
                          <span
                            className={
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "compatibility" && (
                    <div className="space-y-6">
                      <div>
                        <h4
                          className={`text-sm font-semibold mb-3 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Requisitos
                        </h4>
                        <div className="space-y-2">
                          {[
                            "Microsoft Excel 2016 o superior",
                            "Windows 10/11 o macOS",
                            "4GB RAM mínimo",
                          ].map((req, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-2 text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              <Shield className="size-4 text-emerald-500" />
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4
                          className={`text-sm font-semibold mb-3 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Idiomas Disponibles
                        </h4>
                        <div className="flex gap-2">
                          {["Español", "English", "Português"].map((lang) => (
                            <span
                              key={lang}
                              className={`
                              px-3 py-1.5 rounded-lg text-xs font-medium border
                              ${
                                theme === "dark"
                                  ? "bg-white/5 border-white/10 text-gray-300"
                                  : "bg-gray-100 border-gray-200 text-gray-700"
                              }
                            `}
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-4">
                      {[
                        {
                          initials: "JD",
                          name: "Juan Delgado",
                          rating: 5,
                          text: "¡Excelente producto! Me ahorró horas de trabajo. La documentación es clara y el soporte es responsivo.",
                        },
                        {
                          initials: "SM",
                          name: "Sara Martínez",
                          rating: 4,
                          text: "Gran valor por el precio. Funciona exactamente como se describe. Lo recomendaría a cualquiera que busque esta solución.",
                        },
                      ].map((review, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-xl ${
                            theme === "dark" ? "bg-white/5" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`
                              w-10 h-10 rounded-full flex items-center justify-center font-semibold
                              ${
                                i === 0
                                  ? theme === "dark"
                                    ? "bg-linear-to-r from-cyan-400 to-blue-400 text-black"
                                    : "bg-linear-to-r from-blue-600 to-indigo-600 text-white"
                                  : "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                              }
                            `}
                            >
                              {review.initials}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`font-medium ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {review.name}
                                </span>
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, j) => (
                                    <Star
                                      key={j}
                                      className={`size-3 ${
                                        j < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : theme === "dark"
                                            ? "text-gray-600"
                                            : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {review.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Price Card */}
                <div
                  className={`
                  p-6 rounded-2xl border
                  ${
                    theme === "dark"
                      ? "bg-linear-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/20"
                      : "bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200"
                  }
                `}
                >
                  <div className="mb-4">
                    <span
                      className={`
                      text-4xl font-bold bg-linear-to-r bg-clip-text text-transparent
                      ${
                        theme === "dark"
                          ? "from-cyan-400 to-blue-400"
                          : "from-blue-600 to-indigo-600"
                      }
                    `}
                    >
                      {product.price}
                    </span>
                  </div>
                  <button
                    onClick={onPurchase}
                    className={`
                      w-full h-12 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all mb-3
                      ${
                        theme === "dark"
                          ? "bg-linear-to-r from-cyan-400 to-blue-400 text-black hover:shadow-lg hover:scale-[1.02]"
                          : "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]"
                      }
                    `}
                  >
                    <ShoppingCart className="size-5" />
                    Comprar Ahora
                  </button>
                  {product.demoUrl && (
                    <button
                      className={`
                        w-full h-12 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all border
                        ${
                          theme === "dark"
                            ? "bg-transparent border-white/20 text-white hover:bg-white/5"
                            : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                        }
                      `}
                    >
                      <ExternalLink className="size-5" />
                      Probar Demo
                    </button>
                  )}
                </div>

                {/* Info Card */}
                <div
                  className={`
                  p-6 rounded-2xl border
                  ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-gray-200"
                  }
                `}
                >
                  <h4
                    className={`font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Product Info
                  </h4>
                  <div className="space-y-3 text-sm">
                    {[
                      {
                        label: "Author",
                        value: product.author || "CELAEST Team",
                      },
                      { label: "Category", value: product.category || "Excel" },
                      {
                        label: "Downloads",
                        value: (product.downloads || 1543).toLocaleString(),
                      },
                      {
                        label: "Last Update",
                        value: product.lastUpdated || "14/1/2025",
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between">
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {item.label}
                        </span>
                        <span
                          className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guarantee Badge */}
                <div
                  className={`
                  p-4 rounded-2xl border
                  ${
                    theme === "dark"
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-emerald-50 border-emerald-200"
                  }
                `}
                >
                  <div className="flex items-start gap-3">
                    <Shield
                      className={`size-6 shrink-0 ${
                        theme === "dark"
                          ? "text-emerald-400"
                          : "text-emerald-600"
                      }`}
                    />
                    <div>
                      <h4
                        className={`font-semibold text-sm mb-1 ${
                          theme === "dark"
                            ? "text-emerald-400"
                            : "text-emerald-900"
                        }`}
                      >
                        Garantía de 30 Días
                      </h4>
                      <p
                        className={`text-xs ${
                          theme === "dark"
                            ? "text-emerald-400/80"
                            : "text-emerald-700"
                        }`}
                      >
                        Pruébalo sin riesgo. Reembolso completo si no estás
                        satisfecho.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
