"use client";

import React, { useState, useMemo } from "react";
import {
  MagnifyingGlass,
  Sparkle,
  Chats,
  Database,
  ChartLine,
  ShieldCheck,
  Star,
  X,
  Eye,
  ArrowRight,
  Play,
  Faders,
  Funnel,
  SlidersHorizontal,
  ArrowsOutLineHorizontal,
  ArrowsInLineHorizontal,
  Check,
} from "@phosphor-icons/react";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTOS DEL CATÁLOGO REAL (CARD #2 CONFIRMADA E INTOCABLE)
// ─────────────────────────────────────────────────────────────────────────────
const SIMULATOR_PRODUCTS = [
  {
    id: "p1",
    title: "WhatsApp Multi-Agent Lead Routing Engine",
    description: "Orquestación omnicanal con fallback a agentes humanos y sincronización CRM en tiempo real.",
    category: "Mensajería & Bots",
    categoryId: "messaging",
    tier: "Pro Tier" as const,
    badge: "BESTSELLER",
    price: "$149",
    basePrice: 149,
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
    id: "p2",
    title: "Google Sheets & SQL BI Realtime Pipeline",
    description: "Sincronización continua entre hojas de cálculo corporativas y almacenes analíticos PostgreSQL.",
    category: "Datos & Pipelines",
    categoryId: "data",
    tier: "Enterprise" as const,
    badge: "FEATURED",
    price: "$299",
    basePrice: 299,
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
    id: "p3",
    title: "HubSpot & Stripe Automated Revenue Ops",
    description: "Conciliación de pagos, facturación recurrente y detección predictiva de churn mediante IA Mesh.",
    category: "Ventas & Finanzas",
    categoryId: "sales",
    tier: "Starter+" as const,
    badge: "NUEVO",
    price: "$89",
    basePrice: 89,
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
  {
    id: "p4",
    title: "Slack Internal AI Ops Knowledge Assistant",
    description: "Bot corporativo entrenado en runbooks y documentación privada para resolución de incidentes.",
    category: "Mensajería & Bots",
    categoryId: "messaging",
    tier: "Starter+" as const,
    badge: "POPULAR",
    price: "$45",
    basePrice: 45,
    currency: "USD",
    period: "/ mes",
    rating: 4.7,
    reviews: 45,
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    hasVideo: true,
    features: [
      "Búsqueda semántica sobre Notion, Confluence y GitHub",
      "Generación de reportes post-mortem automáticos",
      "Control de permisos por canal y workspace",
    ],
  },
  {
    id: "p5",
    title: "Multi-Tenant JWT & Postgres RLS Security Hub",
    description: "Plantilla de arquitectura de autenticación empresarial y autorización a nivel de fila.",
    category: "Seguridad & Acceso",
    categoryId: "security",
    tier: "Pro Tier" as const,
    badge: "ESENCIAL",
    price: "$199",
    basePrice: 199,
    currency: "USD",
    period: "/ mes",
    rating: 4.9,
    reviews: 32,
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    hasVideo: false,
    features: [
      "Rotación automática de claves RSA-256",
      "Políticas RLS preconfiguradas para 12 dominios",
      "Mitigación de fugas de sesión con revocación activa",
    ],
  },
  {
    id: "p6",
    title: "Realtime Webhook & Event Mesh Dispatcher",
    description: "Broker de eventos de baja latencia con colas de reintentos exponenciales y dead-letter queue.",
    category: "Datos & Pipelines",
    categoryId: "data",
    tier: "Enterprise" as const,
    badge: "OPEN SOURCE",
    price: "Gratis",
    basePrice: 0,
    currency: "USD",
    period: "/ libre",
    rating: 5.0,
    reviews: 51,
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    hasVideo: false,
    features: [
      "Logs de auditoría inmutables en tiempo real",
      "Reportes automáticos de cumplimiento SOC-2",
      "Rotación periódica de llaves de cifrado",
    ],
  },
];

// Categorías del sistema
const REAL_CATEGORIES = [
  { id: "all", label: "Todas las Categorías", icon: Sparkle, count: "06" },
  { id: "messaging", label: "Mensajería & Bots", icon: Chats, count: "02" },
  { id: "data", label: "Datos & Pipelines", icon: Database, count: "02" },
  { id: "sales", label: "Ventas & Finanzas", icon: ChartLine, count: "01" },
  { id: "security", label: "Seguridad & Acceso", icon: ShieldCheck, count: "01" },
];

// Rangos de precio del sistema real
const REAL_PRICE_RANGES = [
  { id: "all", label: "Todos los precios", code: "ALL" },
  { id: "free", label: "Gratis (Open Source)", code: "FREE" },
  { id: "0-50", label: "$1 – $50 USD / mes", code: "<$50" },
  { id: "50-200", label: "$50 – $200 USD / mes", code: "$50-$200" },
  { id: "200+", label: "$200+ USD / mes", code: ">$200" },
];

// Tiers oficiales de CELAEST
const OFFICIAL_TIERS = [
  {
    id: "all",
    name: "Todos",
    index: "00",
    textColor: "text-white",
    hoverColor: "hover:text-white",
    accentColor: "rgba(255, 255, 255, 0.9)",
  },
  {
    id: "Starter+",
    name: "Starter+",
    index: "01",
    textColor: "text-sky-400",
    hoverColor: "hover:text-sky-300",
    accentColor: "#38BDF8",
  },
  {
    id: "Pro Tier",
    name: "Pro Tier",
    index: "02",
    textColor: "text-violet-400",
    hoverColor: "hover:text-violet-300",
    accentColor: "#A78BFA",
  },
  {
    id: "Enterprise",
    name: "Enterprise",
    index: "03",
    textColor: "text-amber-400",
    hoverColor: "hover:text-amber-300",
    accentColor: "#FBBF24",
  },
];

const TIER_THEMES = {
  "Starter+": {
    textColor: "text-sky-400",
    borderColor: "border-sky-400/30",
  },
  "Pro Tier": {
    textColor: "text-violet-400",
    borderColor: "border-violet-400/30",
  },
  Enterprise: {
    textColor: "text-amber-400",
    borderColor: "border-amber-400/30",
  },
};

type AntiAiSidenavVariant = "linear-matrix" | "tokyo-light-console" | "horizon-glow" | "apple-bento";

export function SidenavStudioShowcase() {
  const [variant, setVariant] = useState<AntiAiSidenavVariant>("tokyo-light-console");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filtros activos
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtrado reactivo en tiempo real
  const filteredProducts = useMemo(() => {
    return SIMULATOR_PRODUCTS.filter((prod) => {
      if (selectedCategory !== "all" && prod.categoryId !== selectedCategory) return false;
      if (selectedTier !== "all" && prod.tier !== selectedTier) return false;
      if (selectedPriceRange !== "all") {
        if (selectedPriceRange === "free" && prod.basePrice > 0) return false;
        if (selectedPriceRange === "0-50" && (prod.basePrice <= 0 || prod.basePrice > 50)) return false;
        if (selectedPriceRange === "50-200" && (prod.basePrice < 50 || prod.basePrice > 200)) return false;
        if (selectedPriceRange === "200+" && prod.basePrice < 200) return false;
      }
      if (selectedRating > 0 && prod.rating < selectedRating) return false;
      if (
        searchQuery.trim() !== "" &&
        !prod.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !prod.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, selectedTier, selectedPriceRange, selectedRating, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedTier("all");
    setSelectedPriceRange("all");
    setSelectedRating(0);
    setSearchQuery("");
    toast.info("Filtros restablecidos");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedTier !== "all" ||
    selectedPriceRange !== "all" ||
    selectedRating > 0 ||
    searchQuery.trim() !== "";

  return (
    <div className="w-full flex flex-col gap-6 font-sans select-none animate-in fade-in duration-200">
      {/* ── 1. BARRA SUPERIOR DE CONTROL: ARQUETIPOS ANTI-IA ── */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400">
              ● PATRONES ANTI-IA · SIMETRÍA MATEMÁTICA
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase">
              ZERO-SLOP · TIPOGRAFÍA PURA DE PRECISIÓN
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <SlidersHorizontal size={22} className="text-white/80" />
            Sidenav Studio: Arquitectura de Filtros
          </h2>
          <p className="text-xs text-[#8C8C8C] mt-0.5 max-w-2xl">
            Diseños estructurados con ritmo espacial estricto, sin cajas genéricas de IA, sin bolitas de estado y con
            alineación óptica sobre el chasis obsidian.
          </p>
        </div>

        {/* Selector de Arquetipos Anti-IA */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-[#0B0B0E] border border-white/[0.06] overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setVariant("linear-matrix")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                variant === "linear-matrix"
                  ? "bg-white text-black shadow-sm font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span>1. Linear Matrix (Rail Horizontal)</span>
            </button>

            <button
              type="button"
              onClick={() => setVariant("tokyo-light-console")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                variant === "tokyo-light-console"
                  ? "bg-white text-black shadow-sm font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span>2. Tokyo Minimal (El Elegido · Centrado)</span>
            </button>

            <button
              type="button"
              onClick={() => setVariant("horizon-glow")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                variant === "horizon-glow"
                  ? "bg-white text-black shadow-sm font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span>3. Horizon Glow (Vercel Accent)</span>
            </button>

            <button
              type="button"
              onClick={() => setVariant("apple-bento")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                variant === "apple-bento"
                  ? "bg-white text-black shadow-sm font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span>4. Apple Bento (2x2 Matrix)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl bg-[#141418] hover:bg-[#1C1C22] border border-white/[0.08] text-white/80 hover:text-white transition-all cursor-pointer shrink-0"
            title={isCollapsed ? "Expandir Sidenav (290px)" : "Colapsar Sidenav (74px)"}
          >
            {isCollapsed ? <ArrowsOutLineHorizontal size={16} /> : <ArrowsInLineHorizontal size={16} />}
          </button>
        </div>
      </header>

      {/* ── 2. CHASIS DE SIMULACIÓN EN VIVO: SIDENAV + CARDS #2 ── */}
      <div className="w-full rounded-2xl border border-white/[0.06] bg-[#040406] overflow-hidden flex flex-col md:flex-row shadow-[0_16px_48px_rgba(0,0,0,0.9)] min-h-[760px]">
        {/* ── COLUMNA IZQUIERDA: SIDENAV DE PRECISIÓN ── */}
        <aside
          className={`shrink-0 transition-all duration-300 ease-out border-b md:border-b-0 md:border-r border-white/[0.06] bg-[#060608] flex flex-col ${
            isCollapsed ? "md:w-[74px] w-full" : "md:w-[290px] w-full"
          }`}
        >
          {variant === "linear-matrix" && (
            <LinearMatrixSidebar
              isCollapsed={isCollapsed}
              totalCount={SIMULATOR_PRODUCTS.length}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedTier={selectedTier}
              onSelectTier={setSelectedTier}
              selectedPriceRange={selectedPriceRange}
              onSelectPriceRange={setSelectedPriceRange}
              selectedRating={selectedRating}
              onSelectRating={setSelectedRating}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}

          {variant === "tokyo-light-console" && (
            <TokyoLightConsoleSidebar
              isCollapsed={isCollapsed}
              totalCount={SIMULATOR_PRODUCTS.length}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedTier={selectedTier}
              onSelectTier={setSelectedTier}
              selectedPriceRange={selectedPriceRange}
              onSelectPriceRange={setSelectedPriceRange}
              selectedRating={selectedRating}
              onSelectRating={setSelectedRating}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}

          {variant === "horizon-glow" && (
            <HorizonGlowSidebar
              isCollapsed={isCollapsed}
              totalCount={SIMULATOR_PRODUCTS.length}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedTier={selectedTier}
              onSelectTier={setSelectedTier}
              selectedPriceRange={selectedPriceRange}
              onSelectPriceRange={setSelectedPriceRange}
              selectedRating={selectedRating}
              onSelectRating={setSelectedRating}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}

          {variant === "apple-bento" && (
            <AppleBentoSidebar
              isCollapsed={isCollapsed}
              totalCount={SIMULATOR_PRODUCTS.length}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedTier={selectedTier}
              onSelectTier={setSelectedTier}
              selectedPriceRange={selectedPriceRange}
              onSelectPriceRange={setSelectedPriceRange}
              selectedRating={selectedRating}
              onSelectRating={setSelectedRating}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}
        </aside>

        {/* ── COLUMNA DERECHA: GRID DE CARDS #2 OFICIALES ── */}
        <main className="flex-1 p-5 sm:p-6 lg:p-7 flex flex-col gap-6 overflow-y-auto no-scrollbar bg-[#020204]">
          {/* Barra de Estatus y Resultados */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <span className="font-jetbrains text-xs font-bold uppercase tracking-wider text-white">
                {filteredProducts.length} SOLUCIONES REGISTRADAS
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/25 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <X size={10} weight="bold" />
                  <span>Restablecer Filtros</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {selectedTier !== "all" && (
                <span className="text-[10px] font-jetbrains uppercase px-2 py-0.5 rounded bg-white/[0.04] text-white/70">
                  Tier: {selectedTier}
                </span>
              )}
              {selectedPriceRange !== "all" && (
                <span className="text-[10px] font-jetbrains uppercase px-2 py-0.5 rounded bg-white/[0.04] text-white/70">
                  Rango: {selectedPriceRange}
                </span>
              )}
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 ml-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Simetría 1:1 Activa</span>
              </span>
            </div>
          </div>

          {/* Renderizado de Tarjetas Oficiales #2 */}
          {filteredProducts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/[0.06] rounded-2xl min-h-[380px]">
              <Faders size={32} className="text-white/20 mb-3" />
              <h4 className="text-sm font-bold text-white tracking-tight">Sin coincidencias con los filtros activos</h4>
              <p className="text-xs text-[#8C8C8C] mt-1 max-w-sm">
                Ajusta el rango de precio, el nivel de servicio o limpia la búsqueda en el Sidenav.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 cursor-pointer"
              >
                Restablecer Todo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 font-jakarta">
              {filteredProducts.map((prod) => {
                const theme = TIER_THEMES[prod.tier];

                return (
                  <article
                    key={prod.id}
                    className="group rounded-2xl overflow-hidden flex flex-col justify-between transition-colors duration-200 bg-[#09090b] border border-white/[0.06] hover:border-white/[0.14]"
                  >
                    {/* Header Visual con Degradado Eased Scrim (Sin Línea) */}
                    <div
                      className="relative w-full aspect-16/10 overflow-hidden bg-[#09090b] cursor-pointer"
                      onClick={() => toast.info(`Detalles: ${prod.title}`)}
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

                      {/* Eased Scrim Inferior (76px): disolución no lineal hacia #09090b que elimina la línea al 100% */}
                      <div
                        className="absolute inset-x-0 -bottom-[1px] h-[76px] pointer-events-none z-[5]"
                        style={{
                          background:
                            "linear-gradient(to top, #09090b 0%, rgba(9, 9, 11, 0.98) 15%, rgba(9, 9, 11, 0.90) 30%, rgba(9, 9, 11, 0.74) 48%, rgba(9, 9, 11, 0.50) 65%, rgba(9, 9, 11, 0.25) 80%, rgba(9, 9, 11, 0.08) 92%, rgba(9, 9, 11, 0) 100%)",
                        }}
                      />

                      {/* Punta 1 (Arriba Izquierda): Categoría en JetBrains Mono */}
                      <div className="absolute top-3 left-4 z-10 font-jetbrains text-[9px] font-bold tracking-widest uppercase text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                        {prod.category}
                      </div>

                      {/* Punta 2 (Arriba Derecha): Plan en JetBrains Mono */}
                      <div
                        className={`absolute top-3 right-4 z-10 font-jetbrains text-[9px] font-bold tracking-widest uppercase ${theme.textColor} drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}
                      >
                        {prod.tier}
                      </div>

                      {/* PRECIO EN LA PARTE INFERIOR DE LA FOTO EN JETBRAINS MONO CON MONEDA USD */}
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
                        {/* Rating con estrella amarilla y conteo súper centrado */}
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

                      {/* Pie Despejado: Botonera Dual Directa */}
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
          )}
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPS COMUNES PARA LOS ARQUETIPOS DE SIDENAV
// ─────────────────────────────────────────────────────────────────────────────
interface SidebarProps {
  isCollapsed: boolean;
  totalCount: number;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedTier: string;
  onSelectTier: (tier: string) => void;
  selectedPriceRange: string;
  onSelectPriceRange: (range: string) => void;
  selectedRating: number;
  onSelectRating: (rating: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// ARQUETIPO 1: LINEAR MATRIX (RAIL HORIZONTAL · APPLE & LINEAR STANDARD)
// ─────────────────────────────────────────────────────────────────────────────
function LinearMatrixSidebar({
  isCollapsed,
  totalCount,
  selectedCategory,
  onSelectCategory,
  selectedTier,
  onSelectTier,
  selectedPriceRange,
  onSelectPriceRange,
  selectedRating,
  onSelectRating,
  searchQuery,
  onSearchChange,
  onClear,
  hasActiveFilters,
}: SidebarProps) {
  if (isCollapsed) {
    return (
      <div className="py-4 px-2 flex flex-col items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/80">
          <Funnel size={15} />
        </div>
        <div className="w-6 h-px bg-white/[0.08]" />
        {REAL_CATEGORIES.map((cat) => {
          const IconComp = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer relative ${
                isSelected
                  ? "bg-white text-black"
                  : "text-white/40 hover:text-white hover:bg-white/[0.04]"
              }`}
              title={cat.label}
            >
              <IconComp size={15} weight={isSelected ? "bold" : "regular"} />
              {isSelected && <span className="absolute -left-1 w-1 h-3 rounded-full bg-white" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-6 text-white text-xs overflow-y-auto no-scrollbar font-sans">
      {/* ── HEADER MONOLÍTICO DE CATÁLOGO ── */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          <span className="font-jetbrains text-[10px] font-bold tracking-[0.2em] uppercase text-white/90">
            CATÁLOGO
          </span>
          <span className="font-jetbrains text-[9px] text-white/30 ml-1">
            [{totalCount}]
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="font-jetbrains text-[9px] text-amber-400 hover:text-amber-300 cursor-pointer uppercase tracking-wider"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* ── 1. BUSCADOR INTEGRADO EN EL CHASIS (SIN BORDES BRUSCOS) ── */}
      <div className="relative">
        <MagnifyingGlass
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar activo..."
          className="w-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.06] rounded-lg py-2 pl-8 pr-10 text-xs text-white placeholder-white/25 outline-none transition-colors border-0"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-jetbrains text-[9px] text-white/30 tracking-widest">
          ⌘K
        </span>
      </div>

      {/* ── 2. EL FILTRO DE TIER SUPREMO: CONSOLA DE 4 CANALES (ANTI-IA) ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-jetbrains text-[9px] font-bold tracking-[0.2em] uppercase text-white/40">
            NIVEL DE SERVICIO
          </span>
          <span className="font-jetbrains text-[8px] text-white/25 uppercase tracking-widest">
            TIER MATRIX
          </span>
        </div>

        {/* Consola segmentada de precisión */}
        <div className="grid grid-cols-4 p-0.5 rounded-lg bg-[#020204] border border-white/[0.04]">
          {OFFICIAL_TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id;

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => onSelectTier(tier.id)}
                className={`py-1.5 text-center transition-all duration-200 cursor-pointer rounded-md relative flex flex-col items-center justify-center ${
                  isSelected
                    ? "bg-[#141418] text-white shadow-xs"
                    : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <span
                  className={`font-jetbrains text-[10px] leading-tight font-bold ${
                    isSelected ? tier.textColor : ""
                  }`}
                >
                  {tier.id === "all" ? "Todos" : tier.id === "Pro Tier" ? "Pro" : tier.id}
                </span>

                {/* Laser Hairline inferior para el Tier activo */}
                {isSelected && (
                  <span
                    className="absolute bottom-0 inset-x-2 h-[1.5px] rounded-full"
                    style={{ backgroundColor: tier.accentColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. CATEGORÍAS TIPOGRÁFICAS (SIMETRÍA FLUSH RIGHT) ── */}
      <div className="space-y-1">
        <div className="flex items-center justify-between pb-1">
          <span className="font-jetbrains text-[9px] font-bold tracking-[0.2em] uppercase text-white/40">
            DISCIPLINA
          </span>
          <span className="font-jetbrains text-[8px] text-white/25 uppercase tracking-widest">
            INDEX
          </span>
        </div>

        <div className="space-y-0.5">
          {REAL_CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full group flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors cursor-pointer text-left ${
                  isSelected
                    ? "bg-white/[0.08] text-white font-medium"
                    : "text-white/60 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IconComp
                    size={14}
                    weight={isSelected ? "bold" : "regular"}
                    className={`shrink-0 ${isSelected ? "text-white" : "text-white/40 group-hover:text-white/80"}`}
                  />
                  <span className="text-xs truncate">{cat.label}</span>
                </div>

                {/* Conteo desnudo sin cápsulas de IA */}
                <span className="font-jetbrains text-[10px] text-white/30 group-hover:text-white/60 shrink-0 ml-2">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. RANGO DE INVERSIÓN (CELAEST OFICIAL) ── */}
      <div className="space-y-1.5 pt-2 border-t border-white/[0.04]">
        <div className="flex items-center justify-between pb-1">
          <span className="font-jetbrains text-[9px] font-bold tracking-[0.2em] uppercase text-white/40">
            INVERSIÓN MENSUAL
          </span>
          <span className="font-jetbrains text-[8px] text-white/25 uppercase tracking-widest">
            USD / MO
          </span>
        </div>

        <div className="space-y-0.5">
          {REAL_PRICE_RANGES.map((pr) => {
            const isSelected = selectedPriceRange === pr.id;

            return (
              <button
                key={pr.id}
                type="button"
                onClick={() => onSelectPriceRange(pr.id)}
                className={`w-full group flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-left ${
                  isSelected
                    ? "bg-white/[0.06] text-white font-medium"
                    : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <span className="text-xs">{pr.label}</span>
                <span className="font-jetbrains text-[9px] text-white/30 group-hover:text-white/60">
                  {isSelected ? "●" : pr.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 5. CALIFICACIÓN AUDITADA ── */}
      <div className="space-y-2 pt-2 border-t border-white/[0.04]">
        <div className="flex items-center justify-between">
          <span className="font-jetbrains text-[9px] font-bold tracking-[0.2em] uppercase text-white/40">
            CALIFICACIÓN MÍNIMA
          </span>
          <span className="font-jetbrains text-[8px] text-white/25 uppercase tracking-widest">
            STARS
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-[#020204] border border-white/[0.04]">
          {[
            { val: 0, label: "Todas" },
            { val: 4.5, label: "4.5★" },
            { val: 4.8, label: "4.8★" },
            { val: 5.0, label: "5.0★" },
          ].map((r) => (
            <button
              key={r.val}
              type="button"
              onClick={() => onSelectRating(r.val)}
              className={`py-1.5 text-center font-jetbrains text-[10px] rounded transition-colors cursor-pointer ${
                selectedRating === r.val
                  ? "bg-[#141418] text-amber-300 font-bold"
                  : "text-white/40 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ARQUETIPO 2: TOKYO LIGHT CONSOLE (GEMELO DE CARD #2 · LUZ & CHUPÓN LASER)
// - Comparte el mismo lenguaje cromático de Card #2.
// - Tiers verticales con hairline reactivo a la izquierda.
// - Micro-detalles en JetBrains Mono y luminancia de cristal profundo.
// ─────────────────────────────────────────────────────────────────────────────
function TokyoLightConsoleSidebar({
  isCollapsed,
  totalCount,
  selectedCategory,
  onSelectCategory,
  selectedTier,
  onSelectTier,
  selectedPriceRange,
  onSelectPriceRange,
  selectedRating,
  onSelectRating,
  searchQuery,
  onSearchChange,
  onClear,
  hasActiveFilters,
}: SidebarProps) {
  if (isCollapsed) {
    return (
      <div className="py-4 px-2 flex flex-col items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/80">
          <Funnel size={16} />
        </div>
        <div className="w-6 h-px bg-white/[0.08]" />
        {OFFICIAL_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => onSelectTier(tier.id)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer relative ${
                isSelected
                  ? "bg-[#121216] text-white shadow-xs font-bold"
                  : "text-white/40 hover:text-white hover:bg-white/[0.03]"
              }`}
              title={tier.name}
            >
              <span className="font-jetbrains text-[10px] uppercase">
                {tier.id === "all" ? "ALL" : tier.id.substring(0, 2)}
              </span>
              {isSelected && (
                <span
                  className="absolute left-0 w-[2px] h-3.5 rounded-full"
                  style={{ backgroundColor: tier.accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-6 text-white text-xs overflow-y-auto no-scrollbar font-sans">
      {/* ── HEADER SIMÉTRICO: TOKYO CONSOLE ── */}
      <div className="flex flex-col items-center justify-center pb-3 border-b border-white/[0.06] text-center">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.22em] uppercase text-white/40 block">
          TOKYO CONSOLE
        </span>
        <span className="text-sm font-extrabold text-white tracking-tight mt-0.5">
          Filtros de Catálogo
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="mt-1.5 font-jetbrains text-[9px] text-amber-400 hover:text-amber-300 uppercase tracking-wider cursor-pointer"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* ── 1. TIER DE SERVICIO OFICIAL (ESTRICTA SIMETRÍA CENTRADA · SIN PALITO) ── */}
      <div className="space-y-2">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.22em] uppercase text-white/40 block text-center">
          TIER DE SERVICIO OFICIAL
        </span>

        <div className="space-y-1">
          {OFFICIAL_TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id;

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => onSelectTier(tier.id)}
                className={`w-full py-2.5 px-3 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#141418] text-white shadow-xs font-semibold"
                    : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`font-jetbrains text-xs tracking-tight transition-colors ${
                    isSelected ? `${tier.textColor} font-bold` : "group-hover:text-white"
                  }`}
                >
                  {tier.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. CATEGORÍAS (CENTRADAS · SIN PALITO) ── */}
      <div className="space-y-2 pt-2 border-t border-white/[0.04]">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.22em] uppercase text-white/40 block text-center">
          CATEGORÍAS
        </span>

        <div className="space-y-1">
          {REAL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full py-2.5 px-3 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#141418] text-white shadow-xs font-semibold"
                    : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`font-jetbrains text-xs tracking-tight transition-colors ${
                    isSelected ? "text-white font-bold" : "group-hover:text-white"
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. RANGOS DE PRECIO (CENTRADOS · SIN PALITO) ── */}
      <div className="space-y-2 pt-2 border-t border-white/[0.04]">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.22em] uppercase text-white/40 block text-center">
          RANGOS DE PRECIO
        </span>

        <div className="space-y-1">
          {REAL_PRICE_RANGES.map((pr) => {
            const isSelected = selectedPriceRange === pr.id;

            return (
              <button
                key={pr.id}
                type="button"
                onClick={() => onSelectPriceRange(pr.id)}
                className={`w-full py-2.5 px-3 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#141418] text-white shadow-xs font-semibold"
                    : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`font-jetbrains text-xs tracking-tight transition-colors ${
                    isSelected ? "text-white font-bold" : "group-hover:text-white"
                  }`}
                >
                  {pr.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. CALIFICACIÓN MÍNIMA (CENTRADOS · SIN PALITO) ── */}
      <div className="space-y-2 pt-2 border-t border-white/[0.04]">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.22em] uppercase text-white/40 block text-center">
          CALIFICACIÓN MÍNIMA
        </span>

        <div className="space-y-1">
          {[
            { val: 0, label: "Todas las calificaciones" },
            { val: 4.5, label: "4.5★ o superior" },
            { val: 4.8, label: "4.8★ o superior" },
            { val: 5.0, label: "5.0★ exclusivo" },
          ].map((r) => {
            const isSelected = selectedRating === r.val;

            return (
              <button
                key={r.val}
                type="button"
                onClick={() => onSelectRating(r.val)}
                className={`w-full py-2.5 px-3 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#141418] text-amber-300 shadow-xs font-bold"
                    : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`font-jetbrains text-xs tracking-tight transition-colors ${
                    isSelected ? "text-amber-300 font-bold" : "group-hover:text-white"
                  }`}
                >
                  {r.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ARQUETIPO 3: CYBER-ARCHITECT (LINEAR & RAYCAST HIGH-DENSITY PROTOCOL)
// - Enfoque de alta densidad y micro-espaciado tipo Raycast / Linear.
// ─────────────────────────────────────────────────────────────────────────────
// ARQUETIPO 3: HORIZON GLOW (VERCEL & STRIPE SHELF ACCENT · 100% SIMÉTRICO)
// - En lugar de palitos verticales asimétricos, usa una línea horizonte inferior
//   luminosa y centrada que actúa como repisa de luz (horizon shelf).
// - Tipografía pura y centrada con transición suave de luminancia.
// ─────────────────────────────────────────────────────────────────────────────
function HorizonGlowSidebar({
  isCollapsed,
  totalCount,
  selectedCategory,
  onSelectCategory,
  selectedTier,
  onSelectTier,
  selectedPriceRange,
  onSelectPriceRange,
  selectedRating,
  onSelectRating,
  searchQuery,
  onSearchChange,
  onClear,
  hasActiveFilters,
}: SidebarProps) {
  if (isCollapsed) {
    return (
      <div className="py-4 px-2 flex flex-col items-center gap-3 font-jetbrains">
        <span className="text-xs text-white/60 font-bold">HZ</span>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-6 text-white text-xs overflow-y-auto no-scrollbar font-sans">
      {/* Header Centrado Horizon */}
      <div className="flex flex-col items-center justify-center pb-3 border-b border-white/[0.06] text-center">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.24em] uppercase text-white/40 block">
          HORIZON GLOW
        </span>
        <span className="text-sm font-extrabold text-white tracking-tight mt-0.5">
          Arquitectura de Filtros
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="mt-1.5 font-jetbrains text-[9px] text-amber-400 hover:text-amber-300 uppercase tracking-wider cursor-pointer"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* 1. Tiers con Repisa de Luz Horizontal Centrada */}
      <div className="space-y-2">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.22em] uppercase text-white/40 block text-center">
          NIVEL DE SERVICIO
        </span>

        <div className="space-y-1">
          {OFFICIAL_TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id;

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => onSelectTier(tier.id)}
                className={`w-full group py-2.5 px-3 rounded-lg text-center transition-all duration-200 cursor-pointer relative flex flex-col items-center justify-center ${
                  isSelected
                    ? "bg-[#121216] text-white shadow-xs font-semibold"
                    : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`font-jetbrains text-xs tracking-tight transition-colors ${
                    isSelected ? `${tier.textColor} font-bold` : "group-hover:text-white"
                  }`}
                >
                  {tier.name}
                </span>

                {/* Horizon Glow: Repisa de luz inferior simétrica */}
                <span
                  className={`h-[1.5px] rounded-full mt-1.5 transition-all duration-300 ${
                    isSelected
                      ? "w-8 opacity-100"
                      : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-40"
                  }`}
                  style={{ backgroundColor: tier.accentColor }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Categorías */}
      <div className="space-y-2 pt-2 border-t border-white/[0.04]">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.22em] uppercase text-white/40 block text-center">
          CATEGORÍAS
        </span>

        <div className="space-y-1">
          {REAL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full group py-2 px-3 rounded-lg text-center transition-all duration-200 cursor-pointer relative flex flex-col items-center justify-center ${
                  isSelected
                    ? "bg-[#121216] text-white shadow-xs font-semibold"
                    : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`font-jetbrains text-xs tracking-tight transition-colors ${
                    isSelected ? "text-white font-bold" : "group-hover:text-white"
                  }`}
                >
                  {cat.label}
                </span>

                <span
                  className={`h-[1.5px] bg-white rounded-full mt-1 transition-all duration-300 ${
                    isSelected
                      ? "w-8 opacity-80"
                      : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-30"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Rangos de Precio */}
      <div className="space-y-2 pt-2 border-t border-white/[0.04]">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.22em] uppercase text-white/40 block text-center">
          INVERSIÓN MENSUAL
        </span>

        <div className="space-y-1">
          {REAL_PRICE_RANGES.map((pr) => {
            const isSelected = selectedPriceRange === pr.id;

            return (
              <button
                key={pr.id}
                type="button"
                onClick={() => onSelectPriceRange(pr.id)}
                className={`w-full group py-2 px-3 rounded-lg text-center transition-all duration-200 cursor-pointer relative flex flex-col items-center justify-center ${
                  isSelected
                    ? "bg-[#121216] text-white shadow-xs font-semibold"
                    : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`font-jetbrains text-xs tracking-tight transition-colors ${
                    isSelected ? "text-white font-bold" : "group-hover:text-white"
                  }`}
                >
                  {pr.label}
                </span>

                <span
                  className={`h-[1.5px] bg-white rounded-full mt-1 transition-all duration-300 ${
                    isSelected
                      ? "w-8 opacity-80"
                      : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-30"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ARQUETIPO 4: APPLE BENTO CONSOLE (MATRIZ MODULAR 2x2 · MÁXIMO CONTROL TÁCTIL)
// - Resuelve el apilamiento vertical largo con una matriz 2x2 táctil de Tiers.
// - Cero cajas genéricas: usa matices cromáticos y elevación sutil.
// ─────────────────────────────────────────────────────────────────────────────
function AppleBentoSidebar({
  isCollapsed,
  totalCount,
  selectedCategory,
  onSelectCategory,
  selectedTier,
  onSelectTier,
  selectedPriceRange,
  onSelectPriceRange,
  selectedRating,
  onSelectRating,
  searchQuery,
  onSearchChange,
  onClear,
  hasActiveFilters,
}: SidebarProps) {
  if (isCollapsed) {
    return (
      <div className="py-4 px-2 flex flex-col items-center gap-3 font-jetbrains">
        <span className="text-xs text-white/60 font-bold">BT</span>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-6 text-white text-xs overflow-y-auto no-scrollbar font-sans">
      {/* Header Centrado Bento */}
      <div className="flex flex-col items-center justify-center pb-3 border-b border-white/[0.06] text-center">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.24em] uppercase text-white/40 block">
          APPLE BENTO
        </span>
        <span className="text-sm font-extrabold text-white tracking-tight mt-0.5">
          Consola Modular
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="mt-1.5 font-jetbrains text-[9px] text-amber-400 hover:text-amber-300 uppercase tracking-wider cursor-pointer"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* 1. MATRIZ BENTO 2x2 DE TIERS (MÁXIMA EFICIENCIA DE ESPACIO) */}
      <div className="space-y-2">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.22em] uppercase text-white/40 block text-center">
          TIER MATRIX (2×2 BENTO)
        </span>

        <div className="grid grid-cols-2 gap-1.5">
          {OFFICIAL_TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id;

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => onSelectTier(tier.id)}
                className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#18181E] border border-white/20 shadow-md font-bold"
                    : "bg-[#0B0B0E] border border-white/[0.04] text-white/50 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`font-jetbrains text-xs tracking-tight ${
                    isSelected ? tier.textColor : ""
                  }`}
                >
                  {tier.name}
                </span>
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                  {tier.id === "all" ? "Catálogo" : "Oficial"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Categorías Modulares */}
      <div className="space-y-2 pt-2 border-t border-white/[0.04]">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.22em] uppercase text-white/40 block text-center">
          CATEGORÍAS
        </span>

        <div className="space-y-1">
          {REAL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full py-2 px-3 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#141418] border border-white/10 text-white font-semibold"
                    : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <span className="font-jetbrains text-xs tracking-tight">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Rangos de Inversión */}
      <div className="space-y-2 pt-2 border-t border-white/[0.04]">
        <span className="font-jetbrains text-[9px] font-bold tracking-[0.22em] uppercase text-white/40 block text-center">
          RANGOS DE INVERSIÓN
        </span>

        <div className="space-y-1">
          {REAL_PRICE_RANGES.map((pr) => {
            const isSelected = selectedPriceRange === pr.id;

            return (
              <button
                key={pr.id}
                type="button"
                onClick={() => onSelectPriceRange(pr.id)}
                className={`w-full py-2 px-3 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#141418] border border-white/10 text-white font-semibold"
                    : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <span className="font-jetbrains text-xs tracking-tight">
                  {pr.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
