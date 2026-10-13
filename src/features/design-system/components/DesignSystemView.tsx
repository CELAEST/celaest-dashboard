"use client";

import React, { useState } from "react";
import {
  Palette,
  CheckCircle,
  Copy,
  Star,
  Play,
  Eye,
  ArrowRight,
  ShieldCheck,
  BookmarkSimple,
} from "@phosphor-icons/react";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS DE COLOR OFICIALES DE CELAEST (PALETA APROBADA)
// ─────────────────────────────────────────────────────────────────────────────
const COLOR_PALETTES = [
  {
    category: "Tiers Oficiales de Planes",
    description: "Colores de asignación estricta por nivel de suscripción en todo el ecosistema CELAEST.",
    colors: [
      {
        name: "Starter+ (Azul Eléctrico)",
        hex: "#38BDF8",
        rgb: "rgb(56, 189, 248)",
        role: "Tier Base / Acceso Rápido",
        twClass: "bg-sky-400",
        borderClass: "border-sky-400/30",
        textClass: "text-sky-400",
      },
      {
        name: "Pro Tier (Púrpura Lumínico)",
        hex: "#A78BFA",
        rgb: "rgb(167, 139, 250)",
        role: "Tier Profesional / Automatizaciones",
        twClass: "bg-violet-400",
        borderClass: "border-violet-400/30",
        textClass: "text-violet-400",
      },
      {
        name: "Enterprise (Oro Amarillo)",
        hex: "#FBBF24",
        rgb: "rgb(251, 191, 36)",
        role: "Tier Corporativo / SLA Crítico",
        twClass: "bg-amber-400",
        borderClass: "border-amber-400/30",
        textClass: "text-amber-400",
      },
    ],
  },
  {
    category: "Obsidian Foundation (Modo Oscuro de Lujo)",
    description: "Base ultra-oscura obsidian con niveles graduales de luminancia y elevación.",
    colors: [
      {
        name: "Void Pitch",
        hex: "#000000",
        rgb: "rgb(0, 0, 0)",
        role: "Fondo absoluto perimetral",
        twClass: "bg-black",
        borderClass: "border-white/10",
        textClass: "text-white",
      },
      {
        name: "Obsidian Base",
        hex: "#060608",
        rgb: "rgb(6, 6, 8)",
        role: "Lienzo principal de la aplicación",
        twClass: "bg-[#060608]",
        borderClass: "border-white/10",
        textClass: "text-white",
      },
      {
        name: "Obsidian Surface",
        hex: "#09090B",
        rgb: "rgb(9, 9, 11)",
        role: "Superficie de tarjetas y paneles",
        twClass: "bg-[#09090B]",
        borderClass: "border-white/10",
        textClass: "text-white",
      },
      {
        name: "Obsidian Elevated",
        hex: "#141418",
        rgb: "rgb(20, 20, 24)",
        role: "Botones secundarios y controles",
        twClass: "bg-[#141418]",
        borderClass: "border-white/15",
        textClass: "text-white",
      },
      {
        name: "Ivory Solid",
        hex: "#FAFAFA",
        rgb: "rgb(250, 250, 250)",
        role: "Botones principales de acción directa",
        twClass: "bg-[#FAFAFA]",
        borderClass: "border-transparent",
        textClass: "text-black",
      },
    ],
  },
  {
    category: "Acentos Semánticos & UI",
    description: "Tonos para métricas de calidad, estrellas de calificación y estados de contraste.",
    colors: [
      {
        name: "Rating Amber",
        hex: "#F59E0B",
        rgb: "rgb(245, 158, 11)",
        role: "Estrella de calificación dorada",
        twClass: "bg-amber-400",
        borderClass: "border-amber-400/30",
        textClass: "text-amber-400",
      },
      {
        name: "Tokyo Vermillion",
        hex: "#FF3B30",
        rgb: "rgb(255, 59, 48)",
        role: "Acento de innovación CELAEST",
        twClass: "bg-[#FF3B30]",
        borderClass: "border-[#FF3B30]/30",
        textClass: "text-[#FF3B30]",
      },
      {
        name: "Muted Mono Zinc",
        hex: "#A1A1AA",
        rgb: "rgb(161, 161, 170)",
        role: "Especificaciones y etiquetas secundarias",
        twClass: "bg-[#A1A1AA]",
        borderClass: "border-white/10",
        textClass: "text-[#A1A1AA]",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DECISIONES DE DISEÑO ACORDADAS
// ─────────────────────────────────────────────────────────────────────────────
const DESIGN_DECISIONS = [
  {
    id: "DEC-01",
    title: "Cero Bolitas (No Status Dots)",
    category: "Identidad Visual",
    status: "APROBADO",
    desc: "Prohibición permanente de usar puntos o círculos de color ('bolitas') para identificar planes o selección. Toda la distinción cromática se realiza mediante tipografía pura de alta jerarquía.",
  },
  {
    id: "DEC-02",
    title: "Luminosidad Fotográfica al 100%",
    category: "Fotografía & Assets",
    status: "APROBADO",
    desc: "Prohibido opacar la imagen globalmente con filtros opacos tipo opacity-80. La fotografía debe mantenerse nítida, viva y al 100% de luz en el área central visible.",
  },
  {
    id: "DEC-03",
    title: "Degradado Inferior Seamless (Sin Línea de Corte)",
    category: "Contraste Espacial",
    status: "APROBADO",
    desc: "Degradado dedicado en la zona inferior hacia el color exacto de la tarjeta (#09090b) que disuelve 100% la línea horizontal de la imagen, manteniendo el centro al 100% de luz natural.",
  },
  {
    id: "DEC-04",
    title: "Distribución en Esquinas de la Foto",
    category: "Composición",
    status: "APROBADO",
    desc: "Punta superior izquierda para la Categoría, punta superior derecha para el Plan en su color temático, y punta inferior izquierda para el Precio con su frecuencia.",
  },
  {
    id: "DEC-05",
    title: "Tipo de Moneda Explícito ($149 USD / mes)",
    category: "Pricing & Billing",
    status: "APROBADO",
    desc: "El bloque de precio en la foto incorpora la denominación de moneda ('USD') en tipografía mono bold tracking-wider, garantizando claridad en transacciones internacionales.",
  },
  {
    id: "DEC-06",
    title: "Chulitos Reactivos con font-bold",
    category: "Micro-Interacciones",
    status: "APROBADO",
    desc: "Los checks '✓' usan peso font-bold y el color del plan tier. La fila completa de la característica cuenta con hover interactivo que ilumina el texto al pasar el cursor.",
  },
  {
    id: "DEC-07",
    title: "Alineación Óptica Perfecta de Reseñas",
    category: "Tipografía de Precisión",
    status: "APROBADO",
    desc: "Centrado vertical de alta precisión en el conteo de reseñas (64) perfectamente nivelado sobre el eje horizontal de la estrella dorada y la calificación.",
  },
  {
    id: "DEC-08",
    title: "Tipografía Oficial Elegida: Plus Jakarta + JetBrains Mono",
    category: "Sistema Tipográfico",
    status: "APROBADO (CARD #2)",
    desc: "Nombre del asset en Plus Jakarta Sans ExtraBold para máximo impacto visual y kerning compacto; datos, esquinas de foto, precios y métricas en JetBrains Mono de ingeniería de élite.",
  },
  {
    id: "DEC-09",
    title: "Sidenav Oficial Elegido: Tokyo Minimal (Centrado Puro)",
    category: "Navegación & Filtros",
    status: "APROBADO (SIDENAV #2)",
    desc: "Sidenav con 100% de simetría y centrado óptico estricto. Cero barras laterales ('palitos') o códigos artificiales (CH-00). Transición de luminancia pura (#141418 en activo) con tipografía en color de tier y sin ruidos superfluos.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTOS OFICIALES PARA MOSTRAR LA CARD #2 CONFIRMADA
// ─────────────────────────────────────────────────────────────────────────────
const CONFIRMED_CARD_PRODUCTS = [
  {
    id: "c1",
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
    hasVideo: true,
    features: [
      "Enrutamiento dinámico asistido por IA Mesh",
      "Webhooks bidireccionales con 120ms de latencia",
      "Aislamiento multi-tenant con cifrado AES-256",
    ],
  },
  {
    id: "c2",
    title: "Google Sheets & SQL BI Realtime Pipeline",
    description: "Sincronización continua entre hojas de cálculo corporativas y almacenes analíticos PostgreSQL.",
    category: "Datos & Pipelines",
    tier: "Enterprise" as const,
    badge: "FEATURED",
    price: "$299",
    currency: "USD",
    period: "/ mes",
    rating: 5.0,
    reviews: 64,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    hasVideo: true,
    features: [
      "Zero-Data-Loss Queue con failover automático",
      "Transformación ETL in-flight de sub-segundo",
      "Auditoría criptográfica con firmas SHA-256",
    ],
  },
  {
    id: "c3",
    title: "HubSpot & Stripe Automated Revenue Ops",
    description: "Conciliación de pagos, facturación recurrente y detección predictiva de churn mediante IA Mesh.",
    category: "Ventas & Finanzas",
    tier: "Starter+" as const,
    badge: "NUEVO",
    price: "$89",
    currency: "USD",
    period: "/ mes",
    rating: 4.8,
    reviews: 21,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    hasVideo: false,
    features: [
      "Conciliación automática de transacciones Stripe",
      "Dunning inteligente para reintentos de cobro",
      "Notificaciones automáticas en Slack y CRM",
    ],
  },
];

const TIER_THEMES = {
  "Starter+": {
    textColor: "text-sky-400",
    borderColor: "border-sky-400/30",
    bgBadge: "bg-sky-500/10",
  },
  "Pro Tier": {
    textColor: "text-violet-400",
    borderColor: "border-violet-400/30",
    bgBadge: "bg-violet-500/10",
  },
  Enterprise: {
    textColor: "text-amber-400",
    borderColor: "border-amber-400/30",
    bgBadge: "bg-amber-500/10",
  },
};

export function DesignSystemView() {
  const [activeTab, setActiveTab] = useState<"card-chosen" | "palette" | "decisions">("card-chosen");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copiado ${label} (${text})`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#030303] text-white overflow-y-auto no-scrollbar font-sans p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-start gap-8">
        {/* ── 1. HEADER DE IDENTIDAD DEL SISTEMA ── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400">
                ● REGISTRO OFICIAL CONFIRMADO
              </span>
              <span className="text-[10px] font-mono text-[#8C8C8C] uppercase">
                VERSION 1.0 · CELAEST HIGH FIDELITY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Palette size={28} className="text-white/80" />
              Design System & Decisiones Aprobadas
            </h1>
            <p className="text-xs sm:text-sm text-[#8C8C8C] mt-1 max-w-3xl leading-relaxed">
              Repositorio centralizado de especificaciones visuales, paleta oficial de tokens y componente de tarjeta
              seleccionado por el usuario. Registrado para asegurar continuidad y cero amnesia arquitectónica.
            </p>
          </div>

          {/* Selector de pestañas internas */}
          <div className="flex items-center p-1 rounded-xl bg-[#0C0C0E] border border-white/[0.08] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("card-chosen")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "card-chosen"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <CheckCircle size={14} weight="bold" />
              <span>1. Card #2 Elegida (Oficial)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("palette")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "palette"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Palette size={14} weight="bold" />
              <span>2. Paleta de Colores</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("decisions")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "decisions"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <BookmarkSimple size={14} weight="bold" />
              <span>3. Bitácora de Decisiones</span>
            </button>
          </div>
        </header>

        {/* ── 2. CONTENIDO SEGÚN LA PESTAÑA ACTIVA ── */}

        {/* PESTAÑA 1: CARD #2 ELEGIDA Y CONFIRMADA */}
        {activeTab === "card-chosen" && (
          <section className="space-y-6">
            {/* Banner de Estado Oficial */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-[#0B1510] to-[#0A0A0E] border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck size={20} weight="fill" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    Card #2 Confirmada por el Usuario
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                      APPROVED SPEC
                    </span>
                  </h2>
                  <p className="text-xs text-[#8C8C8C]">
                    Tipografía: <strong className="text-white">Plus Jakarta Sans</strong> en el nombre del asset +{" "}
                    <strong className="text-white">JetBrains Mono</strong> en esquinas y precio.
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono text-amber-400/90 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-2">
                <span>⚠️ Estado: En espera de orden para integración al sistema</span>
              </div>
            </div>

            {/* Muestra en vivo de la Card #2 con los 3 Tiers (Starter+, Pro Tier, Enterprise) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 font-jakarta">
              {CONFIRMED_CARD_PRODUCTS.map((prod) => {
                const theme = TIER_THEMES[prod.tier];

                return (
                  <article
                    key={prod.id}
                    className="group rounded-2xl overflow-hidden flex flex-col justify-between transition-colors duration-200 bg-[#09090b] border border-white/[0.06] hover:border-white/[0.14]"
                  >
                    {/* Header Visual con Degradado Executive y Cero Cápsulas */}
                    <div
                      className="relative w-full aspect-16/10 overflow-hidden bg-[#09090b] cursor-pointer"
                      onClick={() => toast.info(`Modal de detalles: ${prod.title}`)}
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-full h-full object-cover opacity-100 group-hover:scale-103 transition-all duration-500 ease-out"
                        loading="lazy"
                      />
                      {/* Sombra sutil superior para legibilidad de Categoría y Tier */}
                      <div
                        className="absolute inset-x-0 top-0 h-14 pointer-events-none z-[2]"
                        style={{
                          background:
                            "linear-gradient(to bottom, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.45) 35%, rgba(0, 0, 0, 0.15) 70%, rgba(0, 0, 0, 0) 100%)",
                        }}
                      />

                      {/* Eased Scrim Inferior: disolución no lineal ultra-premium hacia #09090b que elimina al 100% cualquier línea de corte */}
                      <div
                        className="absolute inset-x-0 -bottom-[1px] h-[76px] pointer-events-none z-[5]"
                        style={{
                          background:
                            "linear-gradient(to top, #09090b 0%, rgba(9, 9, 11, 0.98) 15%, rgba(9, 9, 11, 0.90) 30%, rgba(9, 9, 11, 0.74) 48%, rgba(9, 9, 11, 0.50) 65%, rgba(9, 9, 11, 0.25) 80%, rgba(9, 9, 11, 0.08) 92%, rgba(9, 9, 11, 0) 100%)",
                        }}
                      />

                      {/* Punta 1 (Arriba Izq): Categoría en JetBrains Mono */}
                      <div className="absolute top-3 left-4 z-10 font-jetbrains text-[9px] font-bold tracking-widest uppercase text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                        {prod.category}
                      </div>

                      {/* Punta 2 (Arriba Der): Plan en JetBrains Mono */}
                      <div
                        className={`absolute top-3 right-4 z-10 font-jetbrains text-[9px] font-bold tracking-widest uppercase ${theme.textColor} drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}
                      >
                        {prod.tier}
                      </div>

                      {/* Precio en Esquina Inferior Izquierda en JetBrains Mono con Moneda */}
                      <div className="absolute bottom-2.5 left-4 z-10 flex flex-col">
                        <span className="font-jetbrains text-white/80 text-[8px] font-bold uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                          PRECIO
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-jetbrains text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                            {prod.price}
                          </span>
                          <span className="font-jetbrains text-[10px] font-bold uppercase tracking-wider text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                            {prod.currency}
                          </span>
                          <span className="font-jetbrains text-[10px] text-white/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                            {prod.period}
                          </span>
                        </div>
                      </div>

                      {/* Botón de Video sutil (solo en hover) */}
                      {prod.hasVideo && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info(`Demostración técnica: ${prod.title}`);
                          }}
                          className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-white/95 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xl hover:scale-105 z-20"
                          title="Ver video demo"
                        >
                          <Play size={15} weight="fill" className="translate-x-0.5 text-black" />
                        </button>
                      )}
                    </div>

                    {/* Cuerpo en Plus Jakarta Sans */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        {/* Rating con estrella amarilla y reviews súper centrado */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.03]">
                          <span className="font-jetbrains text-[10px] font-medium text-[#666666] uppercase tracking-wider">
                            {prod.badge ? `★ ${prod.badge}` : "Catálogo Oficial"}
                          </span>
                          <div className="flex items-center gap-1.5 text-amber-400">
                            <Star size={11} weight="fill" className="text-amber-400 shrink-0" />
                            <span className="font-jetbrains text-white font-bold text-[11px] leading-none">
                              {prod.rating}
                            </span>
                            <span className="font-jetbrains text-[#71717A] text-[10px] leading-none">
                              ({prod.reviews})
                            </span>
                          </div>
                        </div>

                        {/* Nombre del Asset en Plus Jakarta Sans ExtraBold */}
                        <h3
                          onClick={() => toast.info(`Modal de detalles: ${prod.title}`)}
                          className="font-jakarta text-[1.05rem] font-extrabold text-white tracking-tight leading-snug mt-2 group-hover:text-white transition-colors cursor-pointer"
                        >
                          {prod.title}
                        </h3>

                        {/* Descripción breve */}
                        <p className="font-jakarta text-xs text-[#8C8C8C] mt-2 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>

                        {/* 3 Líneas de Especificaciones con Check Reactivo Bold */}
                        <div className="mt-4 pt-2 border-t border-white/[0.04] divide-y divide-white/[0.03]">
                          {prod.features.slice(0, 3).map((f, i) => (
                            <div
                              key={i}
                              className="py-2 flex items-center justify-between text-xs text-[#A1A1AA] group-hover:text-white transition-colors font-jakarta"
                            >
                              <span className="truncate pr-2 font-normal">{f}</span>
                              <span className={`font-jetbrains text-xs shrink-0 font-bold ${theme.textColor}`}>✓</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pie Despejado: Botonera Dual */}
                      <div className="pt-3 border-t border-white/[0.04]">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => toast.info(`Abriendo detalles de: ${prod.title}`)}
                            className="py-2.5 rounded-xl text-xs font-semibold text-white/75 hover:text-white bg-[#141418] hover:bg-[#1C1C22] border border-white/[0.06] hover:border-white/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-jakarta"
                          >
                            <Eye size={13} weight="bold" />
                            <span>Detalles</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toast.success(`Adquiriendo: ${prod.title}`)}
                            className="py-2.5 rounded-xl text-xs font-bold bg-[#FAFAFA] text-[#030303] hover:bg-white active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] font-jakarta"
                          >
                            <span>Adquirir</span>
                            <ArrowRight size={13} weight="bold" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* PESTAÑA 2: PALETA DE COLORES OFICIAL */}
        {activeTab === "palette" && (
          <section className="space-y-8">
            {COLOR_PALETTES.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-white/40 font-mono text-xs">0{gIdx + 1}</span>
                    {group.category}
                  </h3>
                  <p className="text-xs text-[#8C8C8C] mt-0.5">{group.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.colors.map((color, cIdx) => (
                    <div
                      key={cIdx}
                      onClick={() => copyToClipboard(color.hex, color.name)}
                      className="p-4 rounded-xl bg-[#09090B] border border-white/[0.07] hover:border-white/20 transition-all flex items-center gap-4 cursor-pointer group"
                      title="Haz clic para copiar el código HEX"
                    >
                      {/* Swatch visual */}
                      <div
                        className={`w-12 h-12 rounded-xl shrink-0 ${color.twClass} border ${color.borderClass} shadow-md group-hover:scale-105 transition-transform flex items-center justify-center`}
                      >
                        <Copy size={16} className="text-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{color.name}</span>
                          <span className="text-[10px] font-mono text-white/50 group-hover:text-white transition-colors">
                            {color.hex}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8C8C8C] truncate mt-0.5">{color.role}</p>
                        <p className="text-[10px] font-mono text-white/40 mt-1">{color.rgb}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* PESTAÑA 3: BITÁCORA DE DECISIONES ARQUITECTÓNICAS */}
        {activeTab === "decisions" && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DESIGN_DECISIONS.map((dec) => (
                <div
                  key={dec.id}
                  className="p-5 rounded-xl bg-[#09090B] border border-white/[0.07] flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">
                        {dec.id} · {dec.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {dec.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{dec.title}</h4>
                    <p className="text-xs text-[#8C8C8C] mt-2 leading-relaxed">{dec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
