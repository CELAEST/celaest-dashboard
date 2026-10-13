"use client";

import React, { useState } from "react";
import {
  Tag,
  Lightning,
  X,
  Check,
  CheckCircle,
  CircleNotch,
  Sparkle,
  Eye,
  ArrowRight,
  MagnifyingGlass,
  ShieldCheck,
  Crown,
  Gift,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTOS DEL CATÁLOGO REAL (SIMULACIÓN FIEL CON CARD #2 CONFIRMADA)
// ─────────────────────────────────────────────────────────────────────────────
const SIMULATOR_PRODUCTS = [
  {
    id: "p1",
    title: "WhatsApp Multi-Agent Lead Routing Engine",
    description: "Orquestación omnicanal con fallback a agentes humanos y sincronización CRM en tiempo real.",
    category: "Mensajería & Bots",
    tier: "Pro Tier" as const,
    badge: "BESTSELLER",
    price: "$149",
    currency: "USD",
    period: "/ mes",
    rating: 4.9,
    reviews: 38,
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    features: [
      "Enrutamiento dinámico asistido por IA Mesh",
      "Webhooks bidireccionales con 120ms de latencia",
      "Aislamiento multi-tenant con cifrado AES-256",
    ],
  },
  {
    id: "p2",
    title: "Google Sheets & SQL BI Realtime Pipeline",
    description: "Sincronización continua entre hojas de cálculo corporativas y almacenes analíticos PostgreSQL.",
    category: "Datos & Pipelines",
    tier: "Enterprise" as const,
    badge: "FEATURED",
    price: "$299",
    currency: "USD",
    period: "/ mes",
    rating: 5.0,
    reviews: 14,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    features: [
      "Auto-mapeo semántico de esquemas tabulares",
      "Garantía de idempotencia en mutaciones",
      "Conectores Zero-Trust para BigQuery y Snowflake",
    ],
  },
  {
    id: "p3",
    title: "Notion Knowledge Base & Vector Search Sync",
    description: "Indexación semántica ultrarrápida de workspaces masivos de Notion para búsqueda vectorial.",
    category: "Productividad",
    tier: "Starter+" as const,
    badge: "NUEVO",
    price: "$79",
    currency: "USD",
    period: "/ mes",
    rating: 4.8,
    reviews: 52,
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    features: [
      "Generación de embeddings en batch asíncrono",
      "Políticas de expiración y retención granular",
      "Fallback automático a búsqueda por similitud",
    ],
  },
];

// Colores oficiales por Plan (Anti-AI: Tipografía Pura, Cero Bolitas)
const PLAN_THEMES = {
  "Starter+": {
    label: "Starter+",
    color: "#38BDF8",
    textColor: "text-sky-400",
    borderSubtle: "border-sky-400/25",
    bgSubtle: "bg-sky-500/10",
  },
  "Pro Tier": {
    label: "Pro Tier",
    color: "#A78BFA",
    textColor: "text-violet-400",
    borderSubtle: "border-violet-400/25",
    bgSubtle: "bg-violet-500/10",
  },
  Enterprise: {
    label: "Enterprise",
    color: "#FBBF24",
    textColor: "text-amber-400",
    borderSubtle: "border-amber-400/25",
    bgSubtle: "bg-amber-500/10",
  },
};

export type VerticalStackVariation = "independent" | "synchronized" | "totem" | "squircle";

export function ActionUtilityStudioShowcase() {
  const [selectedVariation, setSelectedVariation] = useState<VerticalStackVariation>("independent");
  
  // Estados de interacción para cada botón
  const [isPlanHovered, setIsPlanHovered] = useState(false);
  const [isCouponHovered, setIsCouponHovered] = useState(false);
  const [isStackHovered, setIsStackHovered] = useState(false);

  // Estado de cupón simulado interactivo
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; discount: string } | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Simulación de aplicar cupón
  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) return;
    
    setIsValidatingCoupon(true);
    setCouponError(null);

    setTimeout(() => {
      setIsValidatingCoupon(false);
      if (code === "ERROR") {
        setCouponError("Código inválido o expirado");
        toast.error("Cupón no válido");
      } else {
        const discountText = code.includes("50") ? "50% OFF" : "20% OFF";
        setActiveCoupon({ code, discount: discountText });
        setIsCouponModalOpen(false);
        setCouponCodeInput("");
        toast.success(`¡Cupón ${code} (${discountText}) aplicado al catálogo!`);
      }
    }, 400);
  };

  const handleClearCoupon = () => {
    setActiveCoupon(null);
    toast.info("Cupón removido del catálogo");
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-16 font-sans">
      {/* ── ENCABEZADO Y ANÁLISIS DE LA PROBLEMÁTICA ── */}
      <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[#09090C] border border-white/[0.08]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-violet-400/90 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                UX/UI Architecture Studio
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40">
                Organización Vertical Apilada • CELAEST Obsidian Standard
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Botones Flotantes Apilados (Planes ⚡ & Cupones 🏷️)
            </h1>
            <p className="text-xs sm:text-sm text-white/50 max-w-2xl mt-1 leading-relaxed">
              Conservando exactamente su ubicación y orden vertical original (<strong>Planes arriba, Cupones abajo</strong>), adaptados a la estética Obsidian de CELAEST: colapsados por defecto en reposo (solo ícono) y con expansión fluida al pasar el cursor.
            </p>
          </div>

          {/* Cuadro comparativo rápido de diagnóstico */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
            <div className="flex flex-col gap-0.5 border-r border-white/10 pr-3">
              <span className="text-[10px] text-red-400 font-mono uppercase tracking-wider">Heredado (Antipatrón)</span>
              <span className="text-white/60">Bolitas neón morada y cian</span>
              <span className="text-[11px] text-white/40">Brillos saturados + saltos toscos</span>
            </div>
            <div className="flex flex-col gap-0.5 pl-3">
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Nuevo Obsidian</span>
              <span className="text-white/90 font-medium">Colapsado Elegante (Solo Ícono)</span>
              <span className="text-[11px] text-white/40">Expansión suave al hover + Cero AI Slop</span>
            </div>
          </div>
        </div>

        {/* ── SELECTOR DE LAS 4 VARIANTES DEL STACK VERTICAL ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-4 mt-2 border-t border-white/[0.06]">
          {/* Opción 1: Independent Morph */}
          <button
            type="button"
            onClick={() => setSelectedVariation("independent")}
            className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1.5 border ${
              selectedVariation === "independent"
                ? "bg-white/[0.08] border-white/30 shadow-lg shadow-black/40"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Crown size={14} className="text-amber-400" weight="fill" />
                1. Obsidian Independent
              </span>
              {selectedVariation === "independent" && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              )}
            </div>
            <p className="text-[11px] text-white/50 leading-snug">
              Apilados como están. En reposo solo se ve el ícono; al pasar el mouse por cada uno, se expande suavemente solo ese botón.
            </p>
          </button>

          {/* Opción 2: Synchronized Duo-Expand */}
          <button
            type="button"
            onClick={() => setSelectedVariation("synchronized")}
            className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1.5 border ${
              selectedVariation === "synchronized"
                ? "bg-white/[0.08] border-white/30 shadow-lg shadow-black/40"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-white/90" weight="bold" />
                2. Synchronized Duo
              </span>
              {selectedVariation === "synchronized" && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              )}
            </div>
            <p className="text-[11px] text-white/50 leading-snug">
              Al hacer hover sobre el stack, ambos botones se abren al unísono hacia la izquierda con un ancho simétrico idéntico.
            </p>
          </button>

          {/* Opción 3: Monolithic Pillar Totem */}
          <button
            type="button"
            onClick={() => setSelectedVariation("totem")}
            className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1.5 border ${
              selectedVariation === "totem"
                ? "bg-white/[0.08] border-white/30 shadow-lg shadow-black/40"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkle size={14} className="text-white/90" weight="bold" />
                3. Monolithic Totem
              </span>
              {selectedVariation === "totem" && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              )}
            </div>
            <p className="text-[11px] text-white/50 leading-snug">
              Una única cápsula vertical unificada de 44px con divisor horizontal. Se abre en un panel de control compacto al hover.
            </p>
          </button>

          {/* Opción 4: Squircle Obsidian Pads */}
          <button
            type="button"
            onClick={() => setSelectedVariation("squircle")}
            className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1.5 border ${
              selectedVariation === "squircle"
                ? "bg-white/[0.08] border-white/30 shadow-lg shadow-black/40"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Gift size={14} className="text-white/90" weight="bold" />
                4. Squircle Hardware Pads
              </span>
              {selectedVariation === "squircle" && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              )}
            </div>
            <p className="text-[11px] text-white/50 leading-snug">
              Micro-pads con radio suave (rounded-2xl) a juego con las tarjetas del catálogo. Muestran micro-atajos de teclado al expandir.
            </p>
          </button>
        </div>
      </div>

      {/* ── SIMULADOR EN VIVO CON LA VISTA REAL DEL MARKETPLACE ── */}
      <div className="relative w-full rounded-2xl bg-[#030305] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col min-h-[720px]">
        {/* Barra superior de simulación de navegador/consola */}
        <div className="px-5 py-3 border-b border-white/[0.06] bg-[#070709] flex items-center justify-between text-xs text-white/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="ml-3 font-mono text-[11px] text-white/60">
              simulador://marketplace/vertical-stack/
              <span className="text-white font-semibold">{selectedVariation}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {activeCoupon && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px]">
                <Check size={10} weight="bold" />
                Cupón Activo: {activeCoupon.code} ({activeCoupon.discount})
              </span>
            )}
            <span className="text-[11px] font-mono text-white/40">
              Pasa el cursor por los botones en la esquina inferior derecha
            </span>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: Sidenav Oficial + Grilla de Cards Oficial */}
        <div className="relative flex-1 flex flex-col lg:flex-row bg-[#020204]">
          {/* SIDENAV TOKYO MINIMAL OFICIAL (CONFIRMADO - INTOCABLE) */}
          <aside className="w-full lg:w-64 shrink-0 bg-[#060608] border-r border-white/[0.06] p-4 flex flex-col gap-5">
            {/* Título de Filtros Centrado */}
            <div className="text-center pb-3 border-b border-white/[0.04]">
              <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">
                Catálogo
              </span>
              <h2 className="text-sm font-semibold text-white/90 tracking-wide mt-0.5">
                Filtros & Categorías
              </h2>
            </div>

            {/* Categorías Principales */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/30 px-2 mb-1">
                Explorar
              </span>
              {[
                { name: "Todos los Plugins", count: 24, active: true },
                { name: "Mensajería & Bots", count: 12, active: false },
                { name: "Datos & Pipelines", count: 7, active: false },
                { name: "Productividad", count: 5, active: false },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    item.active
                      ? "bg-white/[0.08] text-white font-medium"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.02]"
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] font-mono text-white/30">{item.count}</span>
                </div>
              ))}
            </div>

            {/* Filtro por Tier Oficial (Tipografía Pura Centrada) */}
            <div className="flex flex-col gap-1.5 pt-3 border-t border-white/[0.04]">
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/30 px-2 mb-0.5">
                Planes Disponibles
              </span>
              {(["Starter+", "Pro Tier", "Enterprise"] as const).map((tierKey) => {
                const theme = PLAN_THEMES[tierKey];
                return (
                  <div
                    key={tierKey}
                    className="w-full px-3 py-1.5 rounded-lg text-xs flex items-center justify-between bg-white/[0.02] border border-white/[0.03]"
                  >
                    <span style={{ color: theme.color }} className="font-medium text-[11px]">
                      {theme.label}
                    </span>
                    <span className="text-[10px] font-mono text-white/30">Activo</span>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ÁREA DE CONTENIDO: Header + Grilla de Productos */}
          <main className="flex-1 flex flex-col p-6 relative">
            {/* BARRA SUPERIOR DEL CATÁLOGO */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Plugins & Automatizaciones Verificadas
                </h3>
                <p className="text-xs text-white/40 mt-0.5">
                  Mostrando 3 de 24 integraciones preparadas para despliegue instantáneo.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/40">
                <div className="relative">
                  <MagnifyingGlass size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    readOnly
                    value="Buscar por nombre o caso de uso..."
                    className="bg-white/[0.03] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white/40 w-56 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* GRILLA DE PRODUCTOS (CARD #2 CONFIRMADA E INTOCABLE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
              {SIMULATOR_PRODUCTS.map((prod) => {
                const theme = PLAN_THEMES[prod.tier];
                return (
                  <div
                    key={prod.id}
                    className="group relative flex flex-col rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all duration-300 shadow-xl overflow-hidden"
                  >
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/20 rounded-tl-sm pointer-events-none z-20 group-hover:border-white/40 transition-colors" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/20 rounded-tr-sm pointer-events-none z-20 group-hover:border-white/40 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/20 rounded-bl-sm pointer-events-none z-20 group-hover:border-white/40 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/20 rounded-br-sm pointer-events-none z-20 group-hover:border-white/40 transition-colors" />

                    {/* Imagen con Eased Scrim (76px) */}
                    <div className="relative w-full h-40 bg-zinc-950 overflow-hidden">
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-80"
                      />
                      {/* Eased Scrim Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent pointer-events-none" />

                      {/* Pill Badge Flotante */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80">
                          {prod.category}
                        </span>
                      </div>

                      {/* Tier Oficial (Tipografía Pura) */}
                      <div className="absolute top-3 right-3 z-10">
                        <span
                          style={{ color: theme.color }}
                          className="text-[11px] font-semibold tracking-wide bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10"
                        >
                          {theme.label}
                        </span>
                      </div>
                    </div>

                    {/* Cuerpo de la Card */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white/95 line-clamp-1 group-hover:text-white transition-colors">
                          {prod.title}
                        </h4>
                        <p className="text-xs text-white/50 line-clamp-2 mt-1 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      {/* 3 Features */}
                      <div className="flex flex-col gap-1 py-2 border-y border-white/[0.04]">
                        {prod.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-white/60">
                            <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer de Precio y Acciones */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-white tracking-tight">
                            {prod.price}
                          </span>
                          <span className="text-[11px] text-white/40">{prod.period}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors border border-white/[0.06]"
                            title="Ver detalles"
                          >
                            <Eye size={13} weight="bold" />
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-white/90 text-xs font-semibold transition-all flex items-center gap-1 shadow-sm"
                          >
                            <span>Adquirir</span>
                            <ArrowRight size={12} weight="bold" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* BOTONES FLOTANTES APILADOS (ORGANIZACIÓN EXACTA ORIGINAL)          */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            <div className="absolute bottom-6 right-6 z-30">
              <div className="relative">
                {/* ── VARIANTE 1: OBSIDIAN INDEPENDENT MORPH ── */}
                {selectedVariation === "independent" && (
                  <div className="flex flex-col items-end gap-2.5">
                    {/* Botón Superior: Planes & Upgrade */}
                    <motion.button
                      layout
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      onMouseEnter={() => setIsPlanHovered(true)}
                      onMouseLeave={() => setIsPlanHovered(false)}
                      onClick={() => setIsPlanModalOpen(true)}
                      className={`h-11 rounded-full bg-[#0B0B0F]/95 backdrop-blur-2xl border border-white/[0.12] hover:border-amber-400/40 shadow-[0_12px_36px_rgba(0,0,0,0.8)] flex items-center overflow-hidden transition-all duration-300 cursor-pointer ${
                        isPlanHovered
                          ? "w-auto pr-4 pl-0 bg-[#0E0E14]"
                          : "w-11 justify-center p-0"
                      }`}
                    >
                      {/* Contenedor de Ícono 100% Centrado (44px x 44px) */}
                      <div className="w-11 h-11 flex items-center justify-center shrink-0">
                        <Lightning size={18} weight="fill" className="text-amber-400" />
                      </div>
                      {isPlanHovered && (
                        <motion.span
                          initial={{ opacity: 0, x: 4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs font-semibold text-white whitespace-nowrap pr-1 -ml-1"
                        >
                          Ver Planes
                        </motion.span>
                      )}
                    </motion.button>

                    {/* Botón Inferior: Canjear Cupón */}
                    <motion.button
                      layout
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      onMouseEnter={() => setIsCouponHovered(true)}
                      onMouseLeave={() => setIsCouponHovered(false)}
                      onClick={() => setIsCouponModalOpen(!isCouponModalOpen)}
                      className={`h-11 rounded-full bg-[#0B0B0F]/95 backdrop-blur-2xl border shadow-[0_12px_36px_rgba(0,0,0,0.8)] flex items-center overflow-hidden transition-all duration-300 cursor-pointer ${
                        activeCoupon
                          ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                          : "border-white/[0.12] hover:border-white/30 text-white"
                      } ${
                        isCouponHovered || isCouponModalOpen
                          ? "w-auto pr-4 pl-0 bg-[#0E0E14]"
                          : "w-11 justify-center p-0"
                      }`}
                    >
                      {/* Contenedor de Ícono 100% Centrado (44px x 44px) */}
                      <div className="w-11 h-11 flex items-center justify-center shrink-0 relative">
                        <Tag
                          size={18}
                          weight="bold"
                          className={activeCoupon ? "text-emerald-400" : "text-white/80"}
                        />
                        {activeCoupon && !(isCouponHovered || isCouponModalOpen) && (
                          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                        )}
                      </div>
                      {(isCouponHovered || isCouponModalOpen) && (
                        <motion.div
                          initial={{ opacity: 0, x: 4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-1.5 whitespace-nowrap pr-1 -ml-1"
                        >
                          <span className="text-xs font-semibold">
                            {activeCoupon ? activeCoupon.code : "Canjear Cupón"}
                          </span>
                          {activeCoupon && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClearCoupon();
                              }}
                              className="hover:text-red-400 p-0.5 transition-colors ml-1"
                              title="Remover cupón"
                            >
                              <X size={11} weight="bold" />
                            </span>
                          )}
                        </motion.div>
                      )}
                    </motion.button>
                  </div>
                )}

                {/* ── VARIANTE 2: SYNCHRONIZED DUO-EXPAND (AMBOS SE ABREN AL UNÍSONO) ── */}
                {selectedVariation === "synchronized" && (
                  <div
                    className="flex flex-col items-end gap-2.5"
                    onMouseEnter={() => setIsStackHovered(true)}
                    onMouseLeave={() => setIsStackHovered(false)}
                  >
                    {/* Botón Superior: Planes */}
                    <motion.button
                      layout
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      onClick={() => setIsPlanModalOpen(true)}
                      className={`h-11 rounded-full bg-[#0B0B0F]/95 backdrop-blur-2xl border border-white/[0.12] hover:border-amber-400/40 shadow-[0_12px_36px_rgba(0,0,0,0.8)] flex items-center overflow-hidden transition-all duration-300 cursor-pointer ${
                        isStackHovered || isCouponModalOpen
                          ? "w-44 pr-4 pl-0 justify-start bg-[#0E0E14]"
                          : "w-11 justify-center p-0"
                      }`}
                    >
                      <div className="w-11 h-11 flex items-center justify-center shrink-0">
                        <Lightning size={18} weight="fill" className="text-amber-400" />
                      </div>
                      {(isStackHovered || isCouponModalOpen) && (
                        <motion.span
                          initial={{ opacity: 0, x: 4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs font-semibold text-white whitespace-nowrap -ml-1"
                        >
                          Planes & Upgrade
                        </motion.span>
                      )}
                    </motion.button>

                    {/* Botón Inferior: Cupones */}
                    <motion.button
                      layout
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      onClick={() => setIsCouponModalOpen(!isCouponModalOpen)}
                      className={`h-11 rounded-full bg-[#0B0B0F]/95 backdrop-blur-2xl border shadow-[0_12px_36px_rgba(0,0,0,0.8)] flex items-center overflow-hidden transition-all duration-300 cursor-pointer ${
                        activeCoupon
                          ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                          : "border-white/[0.12] hover:border-white/30 text-white"
                      } ${
                        isStackHovered || isCouponModalOpen
                          ? "w-44 pr-4 pl-0 justify-start bg-[#0E0E14]"
                          : "w-11 justify-center p-0"
                      }`}
                    >
                      <div className="w-11 h-11 flex items-center justify-center shrink-0 relative">
                        <Tag
                          size={18}
                          weight="bold"
                          className={activeCoupon ? "text-emerald-400" : "text-white/80"}
                        />
                        {activeCoupon && !(isStackHovered || isCouponModalOpen) && (
                          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                        )}
                      </div>
                      {(isStackHovered || isCouponModalOpen) && (
                        <motion.div
                          initial={{ opacity: 0, x: 4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between w-full -ml-1"
                        >
                          <span className="text-xs font-semibold truncate">
                            {activeCoupon ? activeCoupon.code : "Canjear Cupón"}
                          </span>
                          {activeCoupon && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClearCoupon();
                              }}
                              className="hover:text-red-400 p-0.5 ml-1"
                            >
                              <X size={10} weight="bold" />
                            </span>
                          )}
                        </motion.div>
                      )}
                    </motion.button>
                  </div>
                )}

                {/* ── VARIANTE 3: MONOLITHIC TOTEM (CÁPSULA VERTICAL UNIFICADA) ── */}
                {selectedVariation === "totem" && (
                  <div
                    onMouseEnter={() => setIsStackHovered(true)}
                    onMouseLeave={() => setIsStackHovered(false)}
                    className="relative"
                  >
                    <motion.div
                      layout
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      className={`bg-[#0B0B0F]/95 backdrop-blur-2xl border border-white/[0.14] shadow-[0_16px_50px_rgba(0,0,0,0.9)] rounded-3xl flex flex-col items-center overflow-hidden transition-all duration-300 ${
                        isStackHovered || isCouponModalOpen
                          ? "w-48 p-2 gap-1.5 items-stretch bg-[#0E0E14]"
                          : "w-11 py-2 gap-2"
                      }`}
                    >
                      {/* Segmento Planes */}
                      <button
                        type="button"
                        onClick={() => setIsPlanModalOpen(true)}
                        className={`rounded-2xl transition-all flex items-center cursor-pointer ${
                          isStackHovered || isCouponModalOpen
                            ? "h-9 px-3 gap-2 hover:bg-white/[0.08] text-white/80 hover:text-white justify-start"
                            : "w-8 h-8 justify-center text-amber-400 hover:scale-105"
                        }`}
                      >
                        <Lightning size={16} weight="fill" className="text-amber-400 shrink-0" />
                        {(isStackHovered || isCouponModalOpen) && (
                          <span className="text-xs font-semibold whitespace-nowrap">Planes & Upgrade</span>
                        )}
                      </button>

                      {/* Divisor */}
                      <div className={`bg-white/10 ${isStackHovered || isCouponModalOpen ? "w-full h-px" : "w-4 h-px"}`} />

                      {/* Segmento Cupón */}
                      <button
                        type="button"
                        onClick={() => setIsCouponModalOpen(!isCouponModalOpen)}
                        className={`rounded-2xl transition-all flex items-center cursor-pointer ${
                          isStackHovered || isCouponModalOpen
                            ? "h-9 px-3 gap-2 hover:bg-white/[0.08] text-white justify-between"
                            : "w-8 h-8 justify-center hover:scale-105"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Tag
                            size={16}
                            weight="bold"
                            className={`shrink-0 ${activeCoupon ? "text-emerald-400" : "text-white/80"}`}
                          />
                          {(isStackHovered || isCouponModalOpen) && (
                            <span className="text-xs font-semibold truncate">
                              {activeCoupon ? activeCoupon.code : "Canjear Cupón"}
                            </span>
                          )}
                        </div>
                        {activeCoupon && (isStackHovered || isCouponModalOpen) && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearCoupon();
                            }}
                            className="hover:text-red-400 p-0.5 ml-1"
                          >
                            <X size={10} weight="bold" />
                          </span>
                        )}
                      </button>
                    </motion.div>
                  </div>
                )}

                {/* ── VARIANTE 4: SQUIRCLE HARDWARE PADS (RADIO SOFT + ATAJOS) ── */}
                {selectedVariation === "squircle" && (
                  <div className="flex flex-col items-end gap-2.5">
                    {/* Botón Planes */}
                    <motion.button
                      layout
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      onMouseEnter={() => setIsPlanHovered(true)}
                      onMouseLeave={() => setIsPlanHovered(false)}
                      onClick={() => setIsPlanModalOpen(true)}
                      className={`h-11 rounded-2xl bg-[#0B0B0F]/95 backdrop-blur-2xl border border-white/[0.12] hover:border-amber-400/40 shadow-[0_12px_36px_rgba(0,0,0,0.8)] flex items-center overflow-hidden transition-all duration-300 cursor-pointer ${
                        isPlanHovered ? "w-auto pr-3.5 pl-0 bg-[#0E0E14]" : "w-11 justify-center p-0"
                      }`}
                    >
                      <div className="w-11 h-11 flex items-center justify-center shrink-0">
                        <Lightning size={18} weight="fill" className="text-amber-400" />
                      </div>
                      {isPlanHovered && (
                        <div className="flex items-center gap-2 whitespace-nowrap pr-1 -ml-1">
                          <span className="text-xs font-semibold text-white">Planes</span>
                          <span className="text-[10px] font-mono text-white/40 bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/[0.06]">
                            ⌘P
                          </span>
                        </div>
                      )}
                    </motion.button>

                    {/* Botón Cupones */}
                    <motion.button
                      layout
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      onMouseEnter={() => setIsCouponHovered(true)}
                      onMouseLeave={() => setIsCouponHovered(false)}
                      onClick={() => setIsCouponModalOpen(!isCouponModalOpen)}
                      className={`h-11 rounded-2xl bg-[#0B0B0F]/95 backdrop-blur-2xl border shadow-[0_12px_36px_rgba(0,0,0,0.8)] flex items-center overflow-hidden transition-all duration-300 cursor-pointer ${
                        activeCoupon
                          ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                          : "border-white/[0.12] hover:border-white/30 text-white"
                      } ${
                        isCouponHovered || isCouponModalOpen
                          ? "w-auto pr-3.5 pl-0 bg-[#0E0E14]"
                          : "w-11 justify-center p-0"
                      }`}
                    >
                      <div className="w-11 h-11 flex items-center justify-center shrink-0 relative">
                        <Tag
                          size={18}
                          weight="bold"
                          className={activeCoupon ? "text-emerald-400" : "text-white/80"}
                        />
                        {activeCoupon && !(isCouponHovered || isCouponModalOpen) && (
                          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                        )}
                      </div>
                      {(isCouponHovered || isCouponModalOpen) && (
                        <div className="flex items-center gap-2 whitespace-nowrap pr-1 -ml-1">
                          <span className="text-xs font-semibold">
                            {activeCoupon ? activeCoupon.code : "Cupón"}
                          </span>
                          {!activeCoupon && (
                            <span className="text-[10px] font-mono text-white/40 bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/[0.06]">
                              ⌘C
                            </span>
                          )}
                          {activeCoupon && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClearCoupon();
                              }}
                              className="hover:text-red-400 p-0.5 ml-0.5"
                            >
                              <X size={10} weight="bold" />
                            </span>
                          )}
                        </div>
                      )}
                    </motion.button>
                  </div>
                )}

                {/* ── POPOVER FLOTANTE DE CUPÓN (ALINEADO SOBRE LA PILA DE BOTONES) ── */}
                <AnimatePresence>
                  {isCouponModalOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute bottom-28 right-0 w-80 p-4 rounded-2xl bg-[#0C0C10]/98 backdrop-blur-2xl border border-white/[0.14] shadow-2xl z-50 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                        <div className="flex items-center gap-1.5">
                          <Tag size={14} className="text-white/80" weight="bold" />
                          <h4 className="text-xs font-semibold text-white">Canjear Código Promocional</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsCouponModalOpen(false)}
                          className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                        >
                          <X size={12} weight="bold" />
                        </button>
                      </div>

                      {activeCoupon ? (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-emerald-400" weight="fill" />
                            <div>
                              <p className="text-xs font-bold text-white">{activeCoupon.code}</p>
                              <p className="text-[10px] text-emerald-300/80">{activeCoupon.discount} de descuento aplicado</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleClearCoupon}
                            className="text-[11px] text-red-400 hover:text-red-300 font-medium underline cursor-pointer"
                          >
                            Remover
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Ej. CELAEST20"
                              value={couponCodeInput}
                              onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 uppercase font-mono tracking-wider focus:outline-none focus:border-white/30"
                            />
                          </div>
                          {couponError && (
                            <p className="text-[11px] text-red-400">{couponError}</p>
                          )}
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleApplyCoupon("CELAEST20")}
                              className="text-[10px] font-mono text-white/50 hover:text-white bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-md cursor-pointer"
                            >
                              Probar: CELAEST20
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyCoupon()}
                              disabled={isValidatingCoupon || !couponCodeInput.trim()}
                              className="ml-auto px-3 py-1.5 rounded-lg bg-white text-black hover:bg-white/90 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                            >
                              {isValidatingCoupon ? (
                                <CircleNotch size={12} className="animate-spin" />
                              ) : (
                                "Aplicar"
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ── MODAL DE SIMULACIÓN DE PLANES ── */}
      <AnimatePresence>
        {isPlanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-[#0C0C10] border border-white/[0.12] rounded-3xl p-6 shadow-2xl flex flex-col gap-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <Lightning size={16} weight="fill" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Upgrade de Suscripción</h3>
                    <p className="text-xs text-white/40">Desbloquea cuotas ilimitadas y plugins Enterprise</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>

              {/* Comparativa de Planes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400">
                      Plan Pro
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">$49<span className="text-xs text-white/40 font-normal"> /mes</span></h4>
                    <p className="text-xs text-white/50 mt-1">Para creadores y desarrolladores en crecimiento.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toast.success("Plan Pro seleccionado (simulación)");
                      setIsPlanModalOpen(false);
                    }}
                    className="w-full py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold transition-all border border-white/10 cursor-pointer"
                  >
                    Mantener Pro
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/10 to-amber-500/[0.02] border border-amber-500/30 flex flex-col justify-between gap-3 relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded">
                      TOP
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                      Enterprise Suite
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">$199<span className="text-xs text-white/40 font-normal"> /mes</span></h4>
                    <p className="text-xs text-white/50 mt-1">SLA 99.9%, auditoría y agentes IA dedicados.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toast.success("Upgrade a Enterprise solicitado");
                      setIsPlanModalOpen(false);
                    }}
                    className="w-full py-2 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-bold transition-all shadow-lg cursor-pointer"
                  >
                    Mejorar a Enterprise
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-white/30 text-center">
                Facturación procesada a través de Stripe con cifrado bancario de extremo a extremo.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── RESUMEN DE PRINCIPIOS APLICADOS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#09090C] border border-white/[0.06] flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-400">
            Fidelidad a la Organización Original
          </span>
          <h4 className="text-sm font-bold text-white">Disposición Vertical 100% Preservada</h4>
          <p className="text-xs text-white/50 leading-relaxed">
            Se respeta la jerarquía funcional que ya tenías: el botón de <strong className="text-white/80">Planes (⚡) arriba</strong> y el botón de <strong className="text-white/80">Cupones (🏷️) abajo</strong> en la esquina inferior derecha. Al estar colapsados en reposo, reducen drásticamente la huella visual sobre los productos del catálogo.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#09090C] border border-white/[0.06] flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-400">
            Eliminación de AI Slop
          </span>
          <h4 className="text-sm font-bold text-white">De Bolitas Neón a Hardware Obsidian</h4>
          <ul className="text-xs text-white/50 leading-relaxed space-y-1.5">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Fondo Obsidian Puro:</strong> <code className="text-white/40">#0B0B0F</code> con desenfoque de 24px en lugar de gradientes de cian y morado estridentes.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Expansión Suave Spring:</strong> Las etiquetas tipográficas emergen fluidamente hacia la izquierda sin saltos geométricos bruscos.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
