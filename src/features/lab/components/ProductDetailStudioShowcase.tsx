"use client";

import React, { useState } from "react";
import {
  X,
  Star,
  Shield,
  Play,
  ArrowRight,
  Eye,
  Check,
  DownloadSimple,
  Key,
  Sparkle,
  CheckCircle,
  ShoppingCart,
  Code,
  Calendar,
  User,
  Tag,
  Clock,
  PaperPlaneTilt,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { MarketplaceProduct } from "../../marketplace/types";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTOS DEL CATÁLOGO REAL (100% CAMPOS NATIVOS, CERO CAMPOS INVENTADOS)
// ─────────────────────────────────────────────────────────────────────────────
const REAL_CATALOG_PRODUCTS: MarketplaceProduct[] = [
  {
    id: "prod-whatsapp-01",
    organization_id: "org-celaest-core",
    slug: "whatsapp-multi-agent",
    name: "WhatsApp Multi-Agent Lead Routing Engine",
    short_description:
      "Orquestación omnicanal de conversaciones corporativas con fallback inteligente a agentes humanos y sincronización con PostgreSQL.",
    description:
      "Motor de mensajería empresarial de alto rendimiento para WhatsApp Cloud API. Diseñado para centralizar la comunicación comercial y de soporte técnico en empresas en crecimiento. Permite enrutar conversaciones entrantes de forma contextual hacia agentes especializados, ejecutar webhooks firmados con HMAC SHA-256 en menos de 120ms y mantener un historial transaccional inmutable con aislamiento Row-Level Security en PostgreSQL.",
    base_price: 149,
    currency: "USD",
    category_id: "cat-messaging",
    category_name: "Mensajería & Bots",
    rating_avg: 4.9,
    rating_count: 38,
    thumbnail_url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
    youtube_video_id: "dQw4w9WgXcQ",
    images: ["https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"],
    tags: ["WHATSAPP", "AUTOMATIZACIÓN", "IA MESH"],
    features: [
      "Enrutamiento dinámico contextual asistido por IA",
      "Webhooks bidireccionales con latencia certificada inferior a 120ms",
      "Aislamiento multi-tenant con cifrado AES-GCM de 256 bits",
      "Sincronización continua de leads con CRM y base de datos",
      "Fallback automático ante saturación de operadores",
      "Historial completo de auditoría y reportes exportables",
    ],
    technical_stack: ["Next.js 16", "Go Fiber", "PostgreSQL", "Redis", "WhatsApp Cloud API", "BullMQ"],
    seller_name: "CELAEST Core",
    version: "v2.4.1",
    min_plan_tier: 2, // Pro Tier
    created_at: "2026-10-02T14:30:00Z",
  },
  {
    id: "prod-sheets-02",
    organization_id: "org-celaest-core",
    slug: "sheets-sql-pipeline",
    name: "Google Sheets & SQL BI Realtime Pipeline",
    short_description:
      "Conector bidireccional de baja latencia entre hojas de cálculo corporativas y data warehouses PostgreSQL o BigQuery.",
    description:
      "Tubería de datos continua diseñada para sincronizar hojas de cálculo de Google Sheets con bases de datos relacionales PostgreSQL o almacenes de datos BigQuery. Implementa garantías de consistencia transaccional con idempotencia estricta, detección y alerta de modificaciones en las columnas (schema drift) y soporte para conexiones privadas seguras sin exponer credenciales en el cliente.",
    base_price: 299,
    currency: "USD",
    category_id: "cat-data",
    category_name: "Datos & Pipelines",
    rating_avg: 5.0,
    rating_count: 14,
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    youtube_video_id: undefined,
    images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"],
    tags: ["GOOGLE SHEETS", "PIPELINES", "POSTGRESQL"],
    features: [
      "Auto-mapeo semántico de tipos de datos tabulares",
      "Garantía estricta de idempotencia en transacciones",
      "Conexión Zero-Trust para PostgreSQL, BigQuery y Snowflake",
      "Detección y alerta de alteraciones en esquemas de columnas",
      "Sincronización bidireccional continua con snapshot diario",
    ],
    technical_stack: ["Node.js 22", "Google Drive API", "DuckDB", "Apache Arrow", "PostgreSQL"],
    seller_name: "DataStream Labs",
    version: "v3.0.0",
    min_plan_tier: 3, // Enterprise
    created_at: "2026-09-28T09:15:00Z",
  },
];

interface ReviewItem {
  id: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Santiago Méndez",
    role: "Head of Engineering",
    company: "Veloce Logistics",
    rating: 5,
    date: "Hace 3 días",
    comment:
      "Redujimos el tiempo de respuesta inicial de 42 minutos a 6 segundos. La integración con nuestro PostgreSQL fue transparente y soporta picos masivos de tráfico.",
    verified: true,
  },
  {
    id: "rev-2",
    author: "Carla Villamizar",
    role: "VP de Operaciones",
    company: "FinTech NeoBank",
    rating: 5,
    date: "Hace 1 semana",
    comment:
      "La seguridad multi-tenant y la verificación de webhooks con HMAC nos permitieron pasar la auditoría ISO 27001 sin observaciones técnicas.",
    verified: true,
  },
];

// Opciones del Studio:
// 1 = tokyo_split (Obsidian Midnight)
// 2 = tokyo_carbon (Réplica exacta de la 1 pero con la paleta Tokyo Card #2: #09090B, #0D0D11, #141418, texto #FAFAFA, #A1A1AA)
// 3 = kyoto_studio (Kyoto Precision Editorial)
type ModalArchetype = "tokyo_split" | "tokyo_carbon" | "kyoto_studio";
type AccessState = "none" | "plan" | "owned";
type ModalTab = "overview" | "features" | "reviews";

// Función de color del plan: SOLO LA LETRA, CERO CAJAS, CERO BORDES
function getPlanTextColor(tier: number): string {
  switch (tier) {
    case 1:
      return "text-sky-400"; // Starter+
    case 2:
      return "text-violet-400"; // Pro Tier
    case 3:
      return "text-amber-400"; // Enterprise
    default:
      return "text-white/60";
  }
}

function getPlanLabel(tier: number): string {
  switch (tier) {
    case 1:
      return "Plan Básico";
    case 2:
      return "Plan Pro";
    case 3:
      return "Plan Enterprise";
    default:
      return "Todos los planes";
  }
}

export function ProductDetailStudioShowcase() {
  const [selectedArchetype, setSelectedArchetype] = useState<ModalArchetype>("tokyo_carbon");
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0);
  const activeProduct = REAL_CATALOG_PRODUCTS[selectedProductIndex];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>("overview");
  const [simulatedAccess, setSimulatedAccess] = useState<AccessState>("none");
  const [hasActiveCoupon, setHasActiveCoupon] = useState<boolean>(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Sistema de reseñas interactivo
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [formRating, setFormRating] = useState<number>(0);
  const [formHoveredRating, setFormHoveredRating] = useState<number>(0);
  const [formComment, setFormComment] = useState<string>("");
  const [myReview, setMyReview] = useState<ReviewItem | null>(null);
  const [isEditingMyReview, setIsEditingMyReview] = useState(false);

  const formattedDate = new Date(activeProduct.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const discountRate = hasActiveCoupon ? 0.2 : 0;
  const finalPriceNumber = Math.round(activeProduct.base_price * (1 - discountRate));
  const formattedBasePrice = `$${activeProduct.base_price}`;
  const formattedFinalPrice = `$${finalPriceNumber}`;
  const savingsAmount = activeProduct.base_price - finalPriceNumber;

  const planLabel = getPlanLabel(activeProduct.min_plan_tier);
  const planColorClass = getPlanTextColor(activeProduct.min_plan_tier);

  const handleOpenModal = (index = 0) => {
    setSelectedProductIndex(index);
    setActiveTab("overview");
    setIsPlayingVideo(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPlayingVideo(false);
  };

  // Envío de reseña
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRating === 0) {
      toast.error("Por favor asigna una calificación de 1 a 5 estrellas.");
      return;
    }

    if (myReview) {
      const updated: ReviewItem = {
        ...myReview,
        rating: formRating,
        comment: formComment,
        date: "Editado hoy",
      };
      setMyReview(updated);
      setReviewsList((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setIsEditingMyReview(false);
      toast.success("Tu reseña ha sido actualizada con éxito.");
    } else {
      const newRev: ReviewItem = {
        id: `rev-user-${Date.now()}`,
        author: "Tú (Usuario Verificado)",
        role: "Miembro del Equipo",
        company: "Tu Organización",
        rating: formRating,
        date: "Ahora mismo",
        comment: formComment,
        verified: true,
      };
      setMyReview(newRev);
      setReviewsList((prev) => [newRev, ...prev]);
      setIsEditingMyReview(false);
      toast.success("¡Reseña y calificación publicadas con éxito!");
    }
  };

  const handleDeleteMyReview = () => {
    if (!myReview) return;
    setReviewsList((prev) => prev.filter((r) => r.id !== myReview.id));
    setMyReview(null);
    setFormRating(0);
    setFormComment("");
    setIsEditingMyReview(false);
    toast.info("Reseña eliminada.");
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-20 font-sans">
      {/* ── BARRA DE CONTROL DEL STUDIO ── */}
      <div className="flex flex-col gap-4 p-6 rounded-3xl bg-[#06080E] border border-white/[0.08] shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40">
                CELAEST DESIGN STUDIO
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/60">
                TOKYO CONSISTENCY ENGINE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Studio: Consistencia Cromática Tokyo & Modal Ultra-Limpio
            </h1>
            <p className="text-xs sm:text-sm text-white/50 max-w-3xl leading-relaxed">
              <strong>&quot;Plan Pro&quot; aparece estrictamente 1 sola vez</strong> en la tarjeta de precio (cero redundancia).
              La <strong>Opción 2</strong> replica fielmente la distribución que te gustó de la Opción 1, pero incorporando la <strong>paleta oficial de Tokyo Card #2</strong> (`#09090B`, `#0D0D11`, `#141418`, texto `#FAFAFA`).
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenModal(selectedProductIndex)}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 active:scale-[0.98] transition-all flex items-center gap-2 shadow-xl shadow-black/50 cursor-pointer"
          >
            <Eye size={16} weight="bold" />
            <span>Abrir Modal Activo</span>
          </button>
        </div>

        {/* ── SELECTOR DE LAS 3 PROPUESTAS DE DISEÑO ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/[0.06]">
          {/* Opción 1: Tokyo Minimal Split (Midnight Tone) */}
          <button
            type="button"
            onClick={() => setSelectedArchetype("tokyo_split")}
            className={`p-4 rounded-2xl text-left transition-all cursor-pointer flex flex-col gap-2 border ${
              selectedArchetype === "tokyo_split"
                ? "bg-white/[0.07] border-white/30 shadow-xl shadow-black/60 ring-1 ring-white/10"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                1. Tokyo Split (Tono Midnight)
              </span>
              {selectedArchetype === "tokyo_split" && (
                <span className="text-[10px] font-mono uppercase text-white/90 bg-white/10 px-2 py-0.5 rounded">
                  Activo
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Base aprobada en matiz obsidiana profundo (#040811). 1 sola mención de Plan Pro en la tarjeta de precio, etiquetas limpias y formulario de reseñas.
            </p>
          </button>

          {/* Opción 2: Tokyo Carbon Console (Réplica exacta de la 1 con Paleta Tokyo Card #2) */}
          <button
            type="button"
            onClick={() => setSelectedArchetype("tokyo_carbon")}
            className={`p-4 rounded-2xl text-left transition-all cursor-pointer flex flex-col gap-2 border ${
              selectedArchetype === "tokyo_carbon"
                ? "bg-white/[0.07] border-white/30 shadow-xl shadow-black/60 ring-1 ring-white/10"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkle size={13} weight="fill" className="text-white/80" />
                2. Tokyo Carbon (Paleta Card #2 ⭐)
              </span>
              {selectedArchetype === "tokyo_carbon" && (
                <span className="text-[10px] font-mono uppercase text-white/90 bg-white/10 px-2 py-0.5 rounded font-bold">
                  Recomendado
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Misma distribución exacta de la 1, pero unificada con la paleta de Card #2: Fondo carbón #09090B, paneles #0D0D11, botones #141418 y CTA en #FAFAFA.
            </p>
          </button>

          {/* Opción 3: Kyoto Precision Studio */}
          <button
            type="button"
            onClick={() => setSelectedArchetype("kyoto_studio")}
            className={`p-4 rounded-2xl text-left transition-all cursor-pointer flex flex-col gap-2 border ${
              selectedArchetype === "kyoto_studio"
                ? "bg-white/[0.07] border-white/30 shadow-xl shadow-black/60 ring-1 ring-white/10"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                3. Kyoto Precision Studio
              </span>
              {selectedArchetype === "kyoto_studio" && (
                <span className="text-[10px] font-mono uppercase text-white/90 bg-white/10 px-2 py-0.5 rounded">
                  Activo
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Alternativa editorial suiza con franja de telemetría y tabs con atajos mono [1], [2], [3].
            </p>
          </button>
        </div>

        {/* ── SELECTOR DE PRODUCTOS REALES Y ESTADOS ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
              Estado de Acceso:
            </span>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setSimulatedAccess("none")}
                className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  simulatedAccess === "none" ? "bg-white text-black font-bold" : "text-white/60 hover:text-white"
                }`}
              >
                1. No Comprado
              </button>
              <button
                type="button"
                onClick={() => setSimulatedAccess("plan")}
                className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  simulatedAccess === "plan" ? "bg-white text-black font-bold" : "text-white/60 hover:text-white"
                }`}
              >
                2. Incluido en tu Plan
              </button>
              <button
                type="button"
                onClick={() => setSimulatedAccess("owned")}
                className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  simulatedAccess === "owned" ? "bg-white text-black font-bold" : "text-white/60 hover:text-white"
                }`}
              >
                3. Adquirido (Owned)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Cupón Activo:</span>
            <button
              type="button"
              onClick={() => setHasActiveCoupon(!hasActiveCoupon)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all border cursor-pointer ${
                hasActiveCoupon
                  ? "bg-white/[0.08] border-white/20 text-white font-bold"
                  : "bg-white/[0.02] border-white/[0.06] text-white/40"
              }`}
            >
              {hasActiveCoupon ? "✓ Cupón Activo (-20%)" : "Sin Cupón"}
            </button>
          </div>
        </div>
      </div>

      {/* ── CATÁLOGO DE TARJETAS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {REAL_CATALOG_PRODUCTS.map((prod, idx) => {
          const isCurrent = selectedProductIndex === idx;

          return (
            <div
              key={prod.id}
              className={`group relative flex flex-col rounded-3xl bg-[#09090b] border transition-all duration-300 shadow-2xl overflow-hidden ${
                isCurrent ? "border-white/30 ring-1 ring-white/10" : "border-white/[0.06] hover:border-white/[0.14]"
              }`}
            >
              {/* 4 Tokyo Corner Accents */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-white/20 rounded-tl-sm pointer-events-none z-20 group-hover:border-white/40 transition-colors" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-white/20 rounded-tr-sm pointer-events-none z-20 group-hover:border-white/40 transition-colors" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-white/20 rounded-bl-sm pointer-events-none z-20 group-hover:border-white/40 transition-colors" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-white/20 rounded-br-sm pointer-events-none z-20 group-hover:border-white/40 transition-colors" />

              <div className="relative w-full h-48 bg-black overflow-hidden">
                <img
                  src={prod.thumbnail_url}
                  alt={prod.name}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />

                {/* Etiquetas limpias: SOLO TEXTO FLOTANTE SIN BORDES NI FONDOS */}
                <div className="absolute top-3.5 left-4 flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-white/70">
                    {prod.category_name}
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="text-[10px] font-mono tracking-wider text-white/50">
                    {prod.version}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/60">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star size={12} weight="fill" />
                    <strong className="text-white">{prod.rating_avg.toFixed(1)}</strong> ({prod.rating_count} reseñas)
                  </span>
                  <span className="text-white/40">{prod.seller_name}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-white group-hover:text-white/90 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                    {prod.short_description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                      Precio Oficial
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-white">${prod.base_price}</span>
                      <span className="text-xs text-white/40">{prod.currency}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenModal(idx)}
                    className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 active:scale-95 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Ver detalles</span>
                    <ArrowRight size={13} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          MODAL OVERLAY
      ───────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
            />

            {/* ══════════════════════════════════════════════════════════════════════
                MODAL (COMPARTE ESTRUCTURA PERO CONMUTANDO PALETAS: 1 MIDNIGHT vs 2 TOKYO CARBON)
            ══════════════════════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 14 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`relative z-10 w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl border shadow-[0_32px_96px_-12px_rgba(0,0,0,0.95)] overflow-hidden ${
                selectedArchetype === "tokyo_carbon"
                  ? "bg-[#09090B] border-white/[0.08]" // Paleta oficial Tokyo Card #2
                  : "bg-[#040811] border-white/[0.12]"  // Paleta Midnight
              }`}
            >
              {/* 4 Tokyo Corner Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/25 rounded-tl-sm pointer-events-none z-30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/25 rounded-tr-sm pointer-events-none z-30" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/25 rounded-bl-sm pointer-events-none z-30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/25 rounded-br-sm pointer-events-none z-30" />

              {/* ── HEADER ULTRA-LIMPIO (PLAN PRO RETIRADO DE AQUÍ PARA EVITAR REDUNDANCIA) ── */}
              <div
                className={`shrink-0 px-6 sm:px-8 py-4.5 border-b flex items-center justify-between ${
                  selectedArchetype === "tokyo_carbon"
                    ? "bg-[#0D0D11] border-white/[0.06]"
                    : "bg-[#060C18] border-white/[0.08]"
                }`}
              >
                <div className="flex flex-col gap-1.5 pr-4 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Categoría */}
                    <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-white/40">
                      {activeProduct.category_name}
                    </span>

                    <span className="text-white/20">•</span>

                    {/* Versión: SIN CAJA, SIN BORDE */}
                    <span className="text-[10px] font-mono tracking-wider text-white/40">
                      {activeProduct.version}
                    </span>

                    {/* Destacado: SIN CAJA, SIN BORDE */}
                    {activeProduct.rating_avg >= 4.5 && (
                      <>
                        <span className="text-white/20">•</span>
                        <span className="text-[10px] font-mono tracking-wider uppercase text-white/40">
                          Destacado
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight truncate">
                    {activeProduct.name}
                  </h2>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-white/50">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star size={13} weight="fill" />
                      <strong className="text-white">{activeProduct.rating_avg.toFixed(1)}</strong>
                    </span>
                    <span>({activeProduct.rating_count} reseñas)</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.1] text-white/60 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
                    title="Cerrar modal (Esc)"
                  >
                    <X size={18} weight="bold" />
                  </button>
                </div>
              </div>

              {/* ── CUERPO SPLIT PANORÁMICO (64% / 36%) ── */}
              <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
                {/* Canvas Izquierdo (64%) */}
                <div
                  className={`lg:col-span-8 p-6 sm:p-8 flex flex-col gap-6 ${
                    selectedArchetype === "tokyo_carbon" ? "bg-[#09090B]" : "bg-[#040811]"
                  }`}
                >
                  {/* Media Display Cinema 16:9 */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/[0.08] shadow-2xl group">
                    {activeProduct.youtube_video_id ? (
                      <>
                        {isPlayingVideo ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-black/95 text-white/60 p-6 text-center">
                            <Play size={36} className="text-white/30 mb-2 animate-pulse" />
                            <span className="font-mono text-xs text-white">
                              Reproduciendo Demostración: {activeProduct.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsPlayingVideo(false)}
                              className="mt-4 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white cursor-pointer"
                            >
                              Pausar Video
                            </button>
                          </div>
                        ) : (
                          <>
                            <img
                              src={activeProduct.thumbnail_url}
                              alt={activeProduct.name}
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                            <button
                              type="button"
                              onClick={() => setIsPlayingVideo(true)}
                              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white hover:bg-white/95 text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-106 active:scale-95 transition-all cursor-pointer"
                              title="Reproducir demostración"
                            >
                              <Play size={22} weight="fill" className="translate-x-0.5 text-black" />
                            </button>

                            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-white/60">
                              Demostración Oficial en Video
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <img
                          src={activeProduct.thumbnail_url}
                          alt={activeProduct.name}
                          className="w-full h-full object-cover opacity-85"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      </>
                    )}
                  </div>

                  {/* Selector de Pestañas */}
                  <div
                    className={`flex items-center gap-1 p-1 rounded-xl border ${
                      selectedArchetype === "tokyo_carbon"
                        ? "bg-[#0D0D11] border-white/[0.06]"
                        : "bg-white/[0.03] border-white/[0.06]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "overview"
                          ? "bg-white text-black shadow-md shadow-black/50"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      Resumen & Stack
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("features")}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "features"
                          ? "bg-white text-black shadow-md shadow-black/50"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      Características ({activeProduct.features.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("reviews")}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "reviews"
                          ? "bg-white text-black shadow-md shadow-black/50"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      Reseñas ({reviewsList.length})
                    </button>
                  </div>

                  {/* ── CONTENIDO DE LAS PESTAÑAS ── */}
                  <div className="flex flex-col gap-6">
                    {/* TAB 1: RESUMEN & STACK */}
                    {activeTab === "overview" && (
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-white/40">
                            Descripción del Producto
                          </h3>
                          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                            {activeProduct.description}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2.5 pt-2 border-t border-white/[0.06]">
                          <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-white/40 flex items-center gap-1.5">
                            <Code size={14} />
                            Stack Tecnológico
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {activeProduct.technical_stack.map((tech, i) => (
                              <span
                                key={i}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono border ${
                                  selectedArchetype === "tokyo_carbon"
                                    ? "bg-[#141418] border-white/[0.06] text-[#A1A1AA]"
                                    : "bg-white/[0.03] border-white/[0.06] text-white/80"
                                }`}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: CARACTERÍSTICAS */}
                    {activeTab === "features" && (
                      <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-white/40">
                          Capacidades Incluidas en la Licencia
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activeProduct.features.map((feat, i) => (
                            <div
                              key={i}
                              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                                selectedArchetype === "tokyo_carbon"
                                  ? "bg-[#0D0D11] border-white/[0.06]"
                                  : "bg-white/[0.02] border-white/[0.06]"
                              }`}
                            >
                              <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white">
                                <Check size={12} weight="bold" />
                              </span>
                              <span className="text-xs text-white/80 leading-relaxed font-sans">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB 3: RESEÑAS CON FORMULARIO INTERACTIVO */}
                    {activeTab === "reviews" && (
                      <div className="flex flex-col gap-6">
                        {/* FORMULARIO DE ASIGNACIÓN DE CALIFICACIÓN Y COMENTARIO */}
                        <div
                          className={`p-5 rounded-2xl border flex flex-col gap-4 ${
                            selectedArchetype === "tokyo_carbon"
                              ? "bg-[#0D0D11] border-white/[0.06]"
                              : "bg-white/[0.02] border-white/[0.08]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-mono uppercase tracking-wider text-white/60 font-semibold flex items-center gap-2">
                              <PencilSimple size={14} />
                              <span>{myReview && !isEditingMyReview ? "Tu Reseña Publicada" : "Escribe una Reseña"}</span>
                            </h4>

                            {myReview && !isEditingMyReview && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormRating(myReview.rating);
                                    setFormComment(myReview.comment);
                                    setIsEditingMyReview(true);
                                  }}
                                  className="text-[11px] font-mono text-white/70 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <PencilSimple size={12} />
                                  <span>Editar</span>
                                </button>
                                <span className="text-white/20">•</span>
                                <button
                                  type="button"
                                  onClick={handleDeleteMyReview}
                                  className="text-[11px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Trash size={12} />
                                  <span>Eliminar</span>
                                </button>
                              </div>
                            )}
                          </div>

                          {myReview && !isEditingMyReview ? (
                            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      weight={i < myReview.rating ? "fill" : "regular"}
                                      className={i < myReview.rating ? "text-amber-400" : "text-white/20"}
                                    />
                                  ))}
                                  <span className="text-xs font-bold text-white ml-2 font-mono">
                                    {myReview.rating}.0 de 5.0
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-white/40">{myReview.date}</span>
                              </div>
                              <p className="text-xs text-white/80 leading-relaxed italic">
                                &ldquo;{myReview.comment}&rdquo;
                              </p>
                            </div>
                          ) : (
                            <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                              {/* 1. ASIGNACIÓN DE ESTRELLAS */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                                  Tu Calificación:
                                </label>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = star <= (formHoveredRating || formRating);
                                    return (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormRating(star)}
                                        onMouseEnter={() => setFormHoveredRating(star)}
                                        onMouseLeave={() => setFormHoveredRating(0)}
                                        className="p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                        title={`${star} estrellas`}
                                      >
                                        <Star
                                          size={22}
                                          weight={isFilled ? "fill" : "regular"}
                                          className={isFilled ? "text-amber-400 transition-colors" : "text-white/20 transition-colors"}
                                        />
                                      </button>
                                    );
                                  })}

                                  <span className="text-xs font-mono text-white/60 ml-2">
                                    {formRating === 1 && "1 estrella — Malo"}
                                    {formRating === 2 && "2 estrellas — Regular"}
                                    {formRating === 3 && "3 estrellas — Bueno"}
                                    {formRating === 4 && "4 estrellas — Muy bueno"}
                                    {formRating === 5 && "5 estrellas — Excelente"}
                                    {formRating === 0 && "(Haz clic en las estrellas para calificar)"}
                                  </span>
                                </div>
                              </div>

                              {/* 2. TEXTO DEL COMENTARIO */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                                  Tu Comentario (opcional):
                                </label>
                                <textarea
                                  value={formComment}
                                  onChange={(e) => setFormComment(e.target.value.slice(0, 2000))}
                                  placeholder="Cuéntanos tu experiencia con este producto, integración y soporte..."
                                  rows={3}
                                  className={`w-full resize-none rounded-xl border focus:border-white/25 focus:outline-none p-3 text-xs text-white placeholder:text-white/30 transition-colors ${
                                    selectedArchetype === "tokyo_carbon"
                                      ? "bg-[#141418] border-white/[0.06]"
                                      : "bg-white/[0.02] border-white/[0.08]"
                                  }`}
                                />
                                <div className="text-[10px] font-mono text-white/30 text-right">
                                  {2000 - formComment.length} caracteres restantes
                                </div>
                              </div>

                              {/* BOTÓN DE PUBLICAR */}
                              <div className="flex items-center justify-end gap-3 pt-1">
                                {isEditingMyReview && (
                                  <button
                                    type="button"
                                    onClick={() => setIsEditingMyReview(false)}
                                    className="px-3.5 py-2 rounded-xl text-xs font-mono text-white/60 hover:text-white transition-colors cursor-pointer"
                                  >
                                    Cancelar
                                  </button>
                                )}

                                <button
                                  type="submit"
                                  disabled={formRating === 0}
                                  className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shadow-md"
                                >
                                  <PaperPlaneTilt size={14} weight="bold" />
                                  <span>{myReview ? "Guardar Cambios" : "Publicar Reseña"}</span>
                                </button>
                              </div>
                            </form>
                          )}
                        </div>

                        {/* RESUMEN Y LISTADO DE RESEÑAS */}
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                            <div>
                              <span className="text-base font-bold text-white">
                                {activeProduct.rating_avg.toFixed(1)} de 5.0
                              </span>
                              <span className="text-xs text-white/40 block">
                                Basado en {reviewsList.length} calificaciones certificadas
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={15} weight="fill" />
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            {reviewsList.map((rev) => (
                              <div
                                key={rev.id}
                                className={`p-4 rounded-xl border flex flex-col gap-2 ${
                                  selectedArchetype === "tokyo_carbon"
                                    ? "bg-[#0D0D11] border-white/[0.06]"
                                    : "bg-white/[0.02] border-white/[0.06]"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-white">{rev.author}</span>
                                      {rev.verified && (
                                        <span className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase font-medium">
                                          Compra Verificada
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[11px] text-[#A1A1AA]">
                                      {rev.role} • {rev.company}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-0.5 text-amber-400">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          size={11}
                                          weight={i < rev.rating ? "fill" : "regular"}
                                          className={i < rev.rating ? "text-amber-400" : "text-white/20"}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-[10px] font-mono text-white/30">{rev.date}</span>
                                  </div>
                                </div>
                                <p className="text-xs text-white/70 italic leading-relaxed">
                                  &ldquo;{rev.comment}&rdquo;
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── COMMAND DECK DERECHO (36% STICKY) ── */}
                <div
                  className={`lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between gap-6 ${
                    selectedArchetype === "tokyo_carbon" ? "bg-[#060608]" : "bg-[#060A14]"
                  }`}
                >
                  <div className="flex flex-col gap-6">
                    {/* ESTADO 1: NO COMPRADO */}
                    {simulatedAccess === "none" && (
                      <div
                        className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-xl ${
                          selectedArchetype === "tokyo_carbon"
                            ? "bg-[#0D0D11] border-white/[0.06]"
                            : "bg-white/[0.02] border-white/[0.08]"
                        }`}
                      >
                        {/* ── AQUÍ Y ÚNICAMENTE AQUÍ SE MUESTRA PLAN PRO (1 SOLA VEZ EN TODO EL MODAL) ── */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                            Licencia Comercial
                          </span>
                          <span className={`text-[10px] font-mono tracking-wider uppercase font-semibold ${planColorClass}`}>
                            {planLabel}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          {hasActiveCoupon && (
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs line-through text-white/30 font-mono">
                                {formattedBasePrice}
                              </span>
                              <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-emerald-400">
                                Cupón aplicado (-20%)
                              </span>
                            </div>
                          )}

                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                              {hasActiveCoupon ? formattedFinalPrice : formattedBasePrice}
                            </span>
                            <span className="text-xs text-white/40">{activeProduct.currency}</span>
                          </div>

                          {hasActiveCoupon && (
                            <span className="text-[10px] text-emerald-400 font-mono mt-0.5">
                              Ahorro de ${savingsAmount} {activeProduct.currency} en esta compra
                            </span>
                          )}
                        </div>

                        {/* Botón Tokyo Card #2 Style (#FAFAFA) */}
                        <button
                          type="button"
                          onClick={() => toast.success(`Iniciando compra de ${activeProduct.name}`)}
                          className="w-full py-3.5 rounded-xl bg-[#FAFAFA] text-[#030303] hover:bg-white font-bold text-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-pointer"
                        >
                          <ShoppingCart size={15} weight="bold" />
                          <span>Comprar Ahora</span>
                        </button>
                      </div>
                    )}

                    {/* ESTADO 2: INCLUIDO EN PLAN PRO */}
                    {simulatedAccess === "plan" && (
                      <div
                        className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-xl ${
                          selectedArchetype === "tokyo_carbon"
                            ? "bg-[#0D0D11] border-white/[0.08]"
                            : "bg-white/[0.03] border-white/[0.1]"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-white">
                          <Sparkle size={18} weight="fill" />
                          <span className="text-xs font-bold uppercase tracking-wider font-mono">
                            Incluido en tu Plan
                          </span>
                        </div>

                        <p className="text-xs text-white/60 leading-relaxed">
                          Este módulo está habilitado sin costo adicional en tu suscripción corporativa activa.
                        </p>

                        <button
                          type="button"
                          onClick={() => toast.success(`Descargando ${activeProduct.name} ${activeProduct.version}`)}
                          className="w-full py-3 rounded-xl bg-[#FAFAFA] text-[#030303] hover:bg-white font-bold text-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-pointer"
                        >
                          <DownloadSimple size={15} weight="bold" />
                          <span>Descargar {activeProduct.version}</span>
                        </button>
                      </div>
                    )}

                    {/* ESTADO 3: YA ADQUIRIDO (OWNED) */}
                    {simulatedAccess === "owned" && (
                      <div
                        className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-xl ${
                          selectedArchetype === "tokyo_carbon"
                            ? "bg-[#0D0D11] border-white/[0.08]"
                            : "bg-white/[0.03] border-white/[0.1]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle size={18} weight="fill" />
                            <span className="text-xs font-bold uppercase tracking-wider font-mono">
                              Adquirido
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase">
                            Licencia Activa
                          </span>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => toast.success(`Descargando ${activeProduct.name} ${activeProduct.version}`)}
                            className="w-full py-3 rounded-xl bg-[#FAFAFA] text-[#030303] hover:bg-white font-bold text-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-pointer"
                          >
                            <DownloadSimple size={15} weight="bold" />
                            <span>Descargar {activeProduct.version}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toast.info("Mostrando clave de licencia activa")}
                            className="w-full py-2.5 rounded-xl bg-[#141418] hover:bg-[#1C1C22] text-white/80 border border-white/[0.06] text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Key size={14} />
                            <span>Ver Licencia</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* INFORMACIÓN DEL PRODUCTO (SIN REPETIR PLAN PRO) */}
                    <div
                      className={`p-4 rounded-xl border flex flex-col gap-3 ${
                        selectedArchetype === "tokyo_carbon"
                          ? "bg-[#0D0D11] border-white/[0.06]"
                          : "bg-white/[0.015] border-white/[0.06]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                        Información del Producto
                      </span>
                      <div className="flex flex-col gap-2 text-xs">
                        <div className="flex items-center justify-between text-white/50">
                          <span className="flex items-center gap-1.5">
                            <User size={13} />
                            Autor
                          </span>
                          <span className="text-white font-medium">{activeProduct.seller_name}</span>
                        </div>
                        <div className="flex items-center justify-between text-white/50">
                          <span className="flex items-center gap-1.5">
                            <Tag size={13} />
                            Categoría
                          </span>
                          <span className="text-white font-medium">{activeProduct.category_name}</span>
                        </div>
                        <div className="flex items-center justify-between text-white/50">
                          <span className="flex items-center gap-1.5">
                            <Code size={13} />
                            Versión
                          </span>
                          <span className="text-white font-mono">{activeProduct.version}</span>
                        </div>
                        <div className="flex items-center justify-between text-white/50">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} />
                            Publicado
                          </span>
                          <span className="text-white font-mono">{formattedDate}</span>
                        </div>
                        <div className="flex items-center justify-between text-white/50">
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} />
                            Licenciamiento
                          </span>
                          <span className="text-white font-mono">Comercial Perpetua</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-white/30 text-center font-mono">
                    Entrega digital inmediata • Soporte directo del autor
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
