"use client";

import React, { useState } from "react";
import {
  Star,
  ArrowRight,
  Play,
  Eye,
} from "@phosphor-icons/react";
import { toast } from "sonner";

interface CleanProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  tier: "Starter+" | "Pro Tier" | "Enterprise";
  badge?: "BESTSELLER" | "FEATURED" | "NUEVO";
  price: string;
  currency: string;
  period: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  hasVideo?: boolean;
  features: string[]; // Exactamente 3 líneas de características
}

// Colores oficiales por Plan: Azul (Starter+), Morado (Pro Tier), Amarillo (Enterprise)
// CERO BOLITAS: Solo tipografía pura de alta fidelidad
export const PLAN_THEMES = {
  "Starter+": {
    label: "Starter+",
    color: "#38BDF8", // Azul
    textColor: "text-sky-400",
    borderSubtle: "border-sky-400/25",
    bgSubtle: "bg-sky-500/10",
  },
  "Pro Tier": {
    label: "Pro Tier",
    color: "#A78BFA", // Morado
    textColor: "text-violet-400",
    borderSubtle: "border-violet-400/25",
    bgSubtle: "bg-violet-500/10",
  },
  Enterprise: {
    label: "Enterprise",
    color: "#FBBF24", // Amarillo / Dorado
    textColor: "text-amber-400",
    borderSubtle: "border-amber-400/25",
    bgSubtle: "bg-amber-500/10",
  },
};

const CLEAN_PRODUCTS: CleanProduct[] = [
  {
    id: "p1",
    title: "WhatsApp Multi-Agent Lead Routing Engine",
    description:
      "Orquestación omnicanal con fallback a agentes humanos y sincronización CRM en tiempo real.",
    category: "Mensajería & Bots",
    tier: "Pro Tier", // MORADO
    badge: "BESTSELLER",
    price: "$149",
    currency: "USD",
    period: "/ mes",
    rating: 4.9,
    reviews: 38,
    imageUrl:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
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
    description:
      "Sincronización continua entre hojas de cálculo corporativas y almacenes analíticos PostgreSQL.",
    category: "Datos & Pipelines",
    tier: "Enterprise", // AMARILLO
    badge: "FEATURED",
    price: "$299",
    currency: "USD",
    period: "/ mes",
    rating: 5.0,
    reviews: 64,
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
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
    description:
      "Conciliación de pagos, facturación recurrente y detección predictiva de churn mediante IA Mesh.",
    category: "Ventas & Finanzas",
    tier: "Starter+", // AZUL
    price: "$89",
    currency: "USD",
    period: "/ mes",
    rating: 4.8,
    reviews: 21,
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    hasVideo: false,
    features: [
      "Conciliación automática de transacciones Stripe",
      "Dunning inteligente para reintentos de cobro",
      "Notificaciones automáticas en Slack y CRM",
    ],
  },
  {
    id: "p4",
    title: "Kubernetes & Cloudflare Edge Traffic Governor",
    description:
      "Protección perimetral inteligente, rate limiting predictivo y balanceo dinámico de carga global.",
    category: "DevOps & Cloud",
    tier: "Enterprise", // AMARILLO
    badge: "NUEVO",
    price: "$349",
    currency: "USD",
    period: "/ mes",
    rating: 4.9,
    reviews: 42,
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    hasVideo: true,
    features: [
      "Mitigación activa contra ataques DDoS L3/L7",
      "Certificados SSL/TLS mutuo Zero-Trust",
      "Telemetría en tiempo real con Prometheus",
    ],
  },
  {
    id: "p5",
    title: "PostgreSQL Vector & RAG Knowledge Mesh",
    description:
      "Indexación semántica ultrarrápida y recuperación aumentada para bases de conocimiento internas.",
    category: "Inteligencia Artificial",
    tier: "Pro Tier", // MORADO
    price: "$199",
    currency: "USD",
    period: "/ mes",
    rating: 4.9,
    reviews: 29,
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    hasVideo: false,
    features: [
      "Indexación con HNSW para búsqueda en <15ms",
      "Fragmentación contextual con IA Mesh",
      "Control de acceso a nivel de fila (RLS)",
    ],
  },
  {
    id: "p6",
    title: "Multi-Tenant Cryptographic Audit Vault",
    description:
      "Registro inmutable de accesos y firmas digitales para cumplimiento normativo estricto.",
    category: "Seguridad & Compliance",
    tier: "Starter+", // AZUL
    price: "$249",
    currency: "USD",
    period: "/ mes",
    rating: 5.0,
    reviews: 51,
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    hasVideo: false,
    features: [
      "Logs de auditoría inmutables en tiempo real",
      "Reportes automáticos de cumplimiento SOC-2",
      "Rotación periódica de llaves de cifrado",
    ],
  },
];

// Mapeo de precios realistas en COP (como en la captura del usuario) y USD
const PRODUCT_PRICES: Record<
  string,
  {
    cop: { original: string; discount: string; percent: string; period: string };
    usd: { original: string; discount: string; percent: string; period: string };
  }
> = {
  p1: {
    cop: { original: "COP 41,500", discount: "COP 4,150", percent: "-90%", period: "/ mes" },
    usd: { original: "$149 USD", discount: "$119.20 USD", percent: "-20%", period: "/ mes" },
  },
  p2: {
    cop: { original: "COP 83,000", discount: "COP 8,300", percent: "-90%", period: "/ mes" },
    usd: { original: "$299 USD", discount: "$239.20 USD", percent: "-20%", period: "/ mes" },
  },
  p3: {
    cop: { original: "COP 25,000", discount: "COP 2,500", percent: "-90%", period: "/ mes" },
    usd: { original: "$89 USD", discount: "$71.20 USD", percent: "-20%", period: "/ mes" },
  },
  p4: {
    cop: { original: "COP 95,000", discount: "COP 9,500", percent: "-90%", period: "/ mes" },
    usd: { original: "$349 USD", discount: "$279.20 USD", percent: "-20%", period: "/ mes" },
  },
  p5: {
    cop: { original: "COP 55,000", discount: "COP 5,500", percent: "-90%", period: "/ mes" },
    usd: { original: "$199 USD", discount: "$159.20 USD", percent: "-20%", period: "/ mes" },
  },
  p6: {
    cop: { original: "COP 69,000", discount: "COP 6,900", percent: "-90%", period: "/ mes" },
    usd: { original: "$249 USD", discount: "$199.20 USD", percent: "-20%", period: "/ mes" },
  },
};

export type DiscountStyle = "stack" | "badge" | "inline";
export type CurrencyType = "COP" | "USD";

interface CardPriceDisplayProps {
  productId: string;
  hasDiscount: boolean;
  currency: CurrencyType;
  discountLayout: DiscountStyle;
  fontFamilyClass?: string;
  defaultPrice: string;
  defaultCurrency: string;
  defaultPeriod: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: BLOQUE DE PRECIO EN LA FOTO (CON LA IDEA DEL USUARIO)
// Línea 1: PRECIO
// Línea 2: ~~COP 41,500~~ (tachado)
// Línea 3: COP 4,150 (en verde esmeralda brillante)
// ─────────────────────────────────────────────────────────────────────────────
function CardPriceDisplay({
  productId,
  hasDiscount,
  currency,
  discountLayout,
  fontFamilyClass = "font-jetbrains",
  defaultPrice,
  defaultCurrency,
  defaultPeriod,
}: CardPriceDisplayProps) {
  const priceData = PRODUCT_PRICES[productId] || {
    cop: { original: "COP 41,500", discount: "COP 4,150", percent: "-90%", period: defaultPeriod },
    usd: {
      original: `${defaultPrice} ${defaultCurrency}`,
      discount: `${defaultPrice} ${defaultCurrency}`,
      percent: "-20%",
      period: defaultPeriod,
    },
  };

  const activePricing = currency === "COP" ? priceData.cop : priceData.usd;

  // 1. SIN DESCUENTO ACTIVO
  if (!hasDiscount) {
    return (
      <div className="absolute bottom-2.5 left-4 z-10 flex flex-col">
        <span
          className={`${fontFamilyClass} text-white/80 text-[8px] font-bold uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}
        >
          PRECIO
        </span>
        <div className="flex items-baseline gap-1.5">
          <span
            className={`${fontFamilyClass} text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]`}
          >
            {activePricing.original}
          </span>
          <span
            className={`${fontFamilyClass} text-[10px] text-white/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}
          >
            {activePricing.period}
          </span>
        </div>
      </div>
    );
  }

  // 2. CON DESCUENTO - ESTILO A: STACK VERTICAL (Fiel a la Captura del Usuario - Imagen 1)
  if (discountLayout === "stack") {
    return (
      <div className="absolute bottom-2.5 left-4 z-10 flex flex-col">
        <span
          className={`${fontFamilyClass} text-white/75 text-[8px] font-bold uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}
        >
          PRECIO
        </span>
        {/* Línea 2: Precio base tachado */}
        <span
          className={`${fontFamilyClass} text-[11px] font-semibold text-white/50 line-through tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] -mb-0.5`}
        >
          {activePricing.original}
        </span>
        {/* Línea 3: Precio con descuento en Verde Esmeralda (#10B981) */}
        <div className="flex items-baseline gap-1.5">
          <span
            className={`${fontFamilyClass} text-2xl font-black tracking-tight text-emerald-400 drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)]`}
          >
            {activePricing.discount}
          </span>
          <span
            className={`${fontFamilyClass} text-[10px] text-emerald-400/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}
          >
            {activePricing.period}
          </span>
        </div>
      </div>
    );
  }

  // 3. CON DESCUENTO - ESTILO B: FLOATING BADGE (Con Porcentaje de Ahorro)
  if (discountLayout === "badge") {
    return (
      <div className="absolute bottom-2.5 left-4 z-10 flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`${fontFamilyClass} text-white/75 text-[8px] font-bold uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}
          >
            PRECIO
          </span>
          <span className="font-mono text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
            {activePricing.percent}
          </span>
        </div>
        <span
          className={`${fontFamilyClass} text-[11px] font-semibold text-white/50 line-through tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] -mb-0.5`}
        >
          {activePricing.original}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span
            className={`${fontFamilyClass} text-2xl font-black tracking-tight text-emerald-400 drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)]`}
          >
            {activePricing.discount}
          </span>
          <span
            className={`${fontFamilyClass} text-[10px] text-emerald-400/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}
          >
            {activePricing.period}
          </span>
        </div>
      </div>
    );
  }

  // 4. CON DESCUENTO - ESTILO C: INLINE COMPACT (Horizontal)
  return (
    <div className="absolute bottom-2.5 left-4 z-10 flex flex-col">
      <span
        className={`${fontFamilyClass} text-white/75 text-[8px] font-bold uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}
      >
        PRECIO
      </span>
      <div className="flex items-baseline gap-2">
        <span
          className={`${fontFamilyClass} text-2xl font-black tracking-tight text-emerald-400 drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)]`}
        >
          {activePricing.discount}
        </span>
        <span
          className={`${fontFamilyClass} text-xs font-semibold text-white/50 line-through tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}
        >
          {activePricing.original}
        </span>
        <span
          className={`${fontFamilyClass} text-[10px] text-emerald-400/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}
        >
          {activePricing.period}
        </span>
      </div>
    </div>
  );
}

type CleanLayoutVariant =
  | "pure-minimal"
  | "floating-luminescence"
  | "kinetic-spec"
  | "obsidian-prism";

export function TokyoMarketplaceShowcase() {
  const [variant, setVariant] = useState<CleanLayoutVariant>("floating-luminescence");
  const [hasDiscount, setHasDiscount] = useState(true);
  const [currency, setCurrency] = useState<CurrencyType>("COP");
  const [discountStyle, setDiscountStyle] = useState<DiscountStyle>("stack");

  return (
    <div className="w-full flex flex-col gap-6 font-sans select-none animate-in fade-in duration-200">
      {/* 1. Header Toolbar Minimalista (1 sola línea) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tracking-widest text-white uppercase">
            CARDS STUDIO · LAYOUT OPTIMIZADO
          </span>
          <a
            href="?tab=design-system"
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
            title="Ir al nuevo feature de Design System y Decisiones Confirmadas"
          >
            <span>● Card #2 Elegida → Ver en Design System</span>
          </a>
        </div>

        {/* Switcher de las 4 Opciones */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0D0D0D] border border-white/[0.06] overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setVariant("pure-minimal")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              variant === "pure-minimal"
                ? "bg-white text-black shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            1. Geist Sans + Mono (Opción 1)
          </button>
          <button
            type="button"
            onClick={() => setVariant("floating-luminescence")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              variant === "floating-luminescence"
                ? "bg-white text-black shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            2. Card #2 (Elegida Oficialmente ⭐)
          </button>
          <button
            type="button"
            onClick={() => setVariant("kinetic-spec")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              variant === "kinetic-spec"
                ? "bg-white text-black shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            3. Título Jakarta + JetBrains Mono (Híbrido)
          </button>
          <button
            type="button"
            onClick={() => setVariant("obsidian-prism")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              variant === "obsidian-prism"
                ? "bg-white text-black shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            4. Syne + Mono (Executive Luxury / High-Impact)
          </button>
        </div>
      </div>

      {/* ── TOOLBAR DE SIMULACIÓN DE DESCUENTO (LABS · PROPUESTA IMAGEN 1) ── */}
      <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#07090E] border border-white/[0.08] shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/90 font-bold">
              LABS · SIMULADOR DE DESCUENTO EN CARDS (PROPUESTA)
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[10px] font-mono text-white/50">
              Prueba y valida la idea sin alterar producción
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Toggle Descuento ON / OFF */}
            <button
              type="button"
              onClick={() => setHasDiscount(!hasDiscount)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                hasDiscount
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold"
                  : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:text-white"
              }`}
            >
              {hasDiscount ? "✓ Descuento Activo" : "Sin Descuento"}
            </button>

            {/* Toggle Moneda COP / USD */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setCurrency("COP")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  currency === "COP"
                    ? "bg-white text-black font-bold shadow"
                    : "text-white/50 hover:text-white"
                }`}
              >
                COP (Captura)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-white text-black font-bold shadow"
                    : "text-white/50 hover:text-white"
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Selector de Estilo de Descuento */}
            {hasDiscount && (
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setDiscountStyle("stack")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    discountStyle === "stack"
                      ? "bg-white text-black font-bold shadow"
                      : "text-white/50 hover:text-white"
                  }`}
                  title="Estilo 1: PRECIO / Tachado / Verde Esmeralda (Idéntico a tu captura)"
                >
                  1. Stack Vertical ⭐
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountStyle("badge")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    discountStyle === "badge"
                      ? "bg-white text-black font-bold shadow"
                      : "text-white/50 hover:text-white"
                  }`}
                  title="Estilo 2: Con porcentaje de ahorro flotante"
                >
                  2. Con Tag %
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountStyle("inline")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    discountStyle === "inline"
                      ? "bg-white text-black font-bold shadow"
                      : "text-white/50 hover:text-white"
                  }`}
                  title="Estilo 3: En línea horizontal compacto"
                >
                  3. En Línea
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Grid de 3 Columnas (2 Filas x 3 Tarjetas) */}
      <div className="w-full">
        {variant === "pure-minimal" && (
          <PureMinimalGrid
            hasDiscount={hasDiscount}
            currency={currency}
            discountStyle={discountStyle}
          />
        )}
        {variant === "floating-luminescence" && (
          <FloatingLuminescenceGrid
            hasDiscount={hasDiscount}
            currency={currency}
            discountStyle={discountStyle}
          />
        )}
        {variant === "kinetic-spec" && (
          <KineticSpecGrid
            hasDiscount={hasDiscount}
            currency={currency}
            discountStyle={discountStyle}
          />
        )}
        {variant === "obsidian-prism" && (
          <ObsidianPrismGrid
            hasDiscount={hasDiscount}
            currency={currency}
            discountStyle={discountStyle}
          />
        )}
      </div>
    </div>
  );
}

interface CardPriceGridProps {
  hasDiscount: boolean;
  currency: CurrencyType;
  discountStyle: DiscountStyle;
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANTE 1: PURE MINIMAL (CON EL NUEVO LAYOUT EXACTO SOLICITADO)
// - 2 Puntas de Arriba en la foto: Categoría (Izquierda) · Plan con su color (Derecha)
// - Precio en la esquina inferior izquierda de la foto (donde estaba la etiqueta)
// - El pie queda limpio y despejado, únicamente con la botonera dual [Detalles] + [Adquirir]
// - Estrella amarilla dorada y 3 líneas con check
// ─────────────────────────────────────────────────────────────────────────────
function PureMinimalGrid({ hasDiscount, currency, discountStyle }: CardPriceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {CLEAN_PRODUCTS.map((prod) => {
        const theme = PLAN_THEMES[prod.tier];

        return (
          <article
            key={prod.id}
            className="group rounded-2xl overflow-hidden flex flex-col justify-between transition-colors duration-200 bg-[#09090b] border border-white/[0.06] hover:border-white/[0.14]"
          >
            {/* ── HEADER VISUAL (FOTO CON 2 PUNTAS ARRIBA + PRECIO ABAJO) ── */}
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
                className="absolute inset-x-0 -bottom-[1px] h-[88px] pointer-events-none z-[5]"
                style={{
                  background:
                    "linear-gradient(to top, #09090b 0%, rgba(9, 9, 11, 0.98) 15%, rgba(9, 9, 11, 0.90) 30%, rgba(9, 9, 11, 0.74) 48%, rgba(9, 9, 11, 0.50) 65%, rgba(9, 9, 11, 0.25) 80%, rgba(9, 9, 11, 0.08) 92%, rgba(9, 9, 11, 0) 100%)",
                }}
              />

              {/* PUNTA 1 (Arriba Izquierda): Categoría limpia flotante sin cápsula */}
              <div className="absolute top-3 left-4 z-10 text-[9px] font-mono tracking-widest uppercase text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                {prod.category}
              </div>

              {/* PUNTA 2 (Arriba Derecha): Plan con su color limpio flotante sin cápsula */}
              <div className={`absolute top-3 right-4 z-10 text-[9px] font-mono tracking-widest uppercase font-bold ${theme.textColor} drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}>
                {prod.tier}
              </div>

              {/* PRECIO EN LA PARTE INFERIOR DE LA FOTO (Donde estaba antes el tag) */}
              <CardPriceDisplay
                productId={prod.id}
                hasDiscount={hasDiscount}
                currency={currency}
                discountLayout={discountStyle}
                fontFamilyClass="font-mono"
                defaultPrice={prod.price}
                defaultCurrency={prod.currency}
                defaultPeriod={prod.period}
              />

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

            {/* ── CUERPO DE CONTENIDO ── */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div>
                {/* Rating con Estrella Amarilla Dorada y reviews súper centrado */}
                <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.03]">
                  <span className="text-[10px] font-mono text-[#666666] uppercase">
                    {prod.badge ? `★ ${prod.badge}` : "Catálogo Oficial"}
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star size={11} weight="fill" className="text-amber-400 shrink-0" />
                    <span className="text-white font-medium text-[11px] font-mono leading-none">{prod.rating}</span>
                    <span className="text-[#71717A] text-[10px] font-mono leading-none">({prod.reviews})</span>
                  </div>
                </div>

                {/* Título de Producto (Clickable para ver detalles) */}
                <h3
                  onClick={() => toast.info(`Modal de detalles: ${prod.title}`)}
                  className="text-base font-bold text-white tracking-tight leading-snug mt-2 group-hover:text-white transition-colors cursor-pointer"
                >
                  {prod.title}
                </h3>

                {/* Descripción breve */}
                <p className="text-xs text-[#8C8C8C] mt-2 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                {/* 3 Líneas de Especificaciones con Check Reactivo (Idéntico a Executive) */}
                <div className="mt-4 pt-2 border-t border-white/[0.04] divide-y divide-white/[0.03]">
                  {prod.features.slice(0, 3).map((f, i) => (
                    <div
                      key={i}
                      className="py-2 flex items-center justify-between text-xs text-[#A1A1AA] group-hover:text-white transition-colors"
                    >
                      <span className="truncate pr-2 font-normal">{f}</span>
                      <span className={`text-xs font-mono shrink-0 font-bold ${theme.textColor}`}>✓</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── PIE DESPEJADO: BOTONERA DUAL DIRECTA (Sin el precio repetido abajo) ── */}
              <div className="pt-3 border-t border-white/[0.04]">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => toast.info(`Abriendo detalles de: ${prod.title}`)}
                    className="py-2.5 rounded-xl text-xs font-semibold text-white/75 hover:text-white bg-[#141418] hover:bg-[#1C1C22] border border-white/[0.06] hover:border-white/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={13} weight="bold" />
                    <span>Detalles</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success(`Adquiriendo: ${prod.title}`)}
                    className="py-2.5 rounded-xl text-xs font-semibold bg-[#FAFAFA] text-[#030303] hover:bg-white active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANTE 2: PLUS JAKARTA SANS + SPACE GROTESK (FINTECH LUXURY / STRIPE STYLE)
// - Estructura, overlay y chulitos idénticos a la Tarjeta 1
// - Tipografía geométrica y moderna de alto impacto para títulos y métricas
// ─────────────────────────────────────────────────────────────────────────────
function FloatingLuminescenceGrid({ hasDiscount, currency, discountStyle }: CardPriceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 font-jakarta">
      {CLEAN_PRODUCTS.map((prod) => {
        const theme = PLAN_THEMES[prod.tier];

        return (
          <article
            key={prod.id}
            className="group rounded-2xl overflow-hidden flex flex-col justify-between transition-colors duration-200 bg-[#09090b] border border-white/[0.06] hover:border-white/[0.14]"
          >
            {/* ── HEADER VISUAL (FOTO CON 2 PUNTAS ARRIBA + PRECIO ABAJO) ── */}
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
                className="absolute inset-x-0 -bottom-[1px] h-[88px] pointer-events-none z-[5]"
                style={{
                  background:
                    "linear-gradient(to top, #09090b 0%, rgba(9, 9, 11, 0.98) 15%, rgba(9, 9, 11, 0.90) 30%, rgba(9, 9, 11, 0.74) 48%, rgba(9, 9, 11, 0.50) 65%, rgba(9, 9, 11, 0.25) 80%, rgba(9, 9, 11, 0.08) 92%, rgba(9, 9, 11, 0) 100%)",
                }}
              />

              {/* PUNTA 1 (Arriba Izquierda): Categoría en JetBrains Mono (de la Opción 3) */}
              <div className="absolute top-3 left-4 z-10 font-jetbrains text-[9px] font-bold tracking-widest uppercase text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                {prod.category}
              </div>

              {/* PUNTA 2 (Arriba Derecha): Plan en JetBrains Mono (de la Opción 3) */}
              <div className={`absolute top-3 right-4 z-10 font-jetbrains text-[9px] font-bold tracking-widest uppercase ${theme.textColor} drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}>
                {prod.tier}
              </div>

              {/* PRECIO EN LA PARTE INFERIOR DE LA FOTO (CON LA IDEA DEL USUARIO) */}
              <CardPriceDisplay
                productId={prod.id}
                hasDiscount={hasDiscount}
                currency={currency}
                discountLayout={discountStyle}
                fontFamilyClass="font-jetbrains"
                defaultPrice={prod.price}
                defaultCurrency={prod.currency}
                defaultPeriod={prod.period}
              />

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

            {/* ── CUERPO DE CONTENIDO EN PLUS JAKARTA SANS ── */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div>
                {/* Rating con Estrella Amarilla Dorada y reviews súper centrado */}
                <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.03]">
                  <span className="font-space text-[10px] font-medium text-[#666666] uppercase tracking-wider">
                    {prod.badge ? `★ ${prod.badge}` : "Catálogo Oficial"}
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star size={11} weight="fill" className="text-amber-400 shrink-0" />
                    <span className="font-space text-white font-bold text-[11px] leading-none">{prod.rating}</span>
                    <span className="font-space text-[#71717A] text-[10px] leading-none">({prod.reviews})</span>
                  </div>
                </div>

                {/* Título de Producto en Plus Jakarta Sans ExtraBold */}
                <h3
                  onClick={() => toast.info(`Modal de detalles: ${prod.title}`)}
                  className="font-jakarta text-[1.05rem] font-extrabold text-white tracking-tight leading-snug mt-2 group-hover:text-white transition-colors cursor-pointer"
                >
                  {prod.title}
                </h3>

                {/* Descripción breve en Plus Jakarta Sans */}
                <p className="font-jakarta text-xs text-[#8C8C8C] mt-2 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                {/* 3 Líneas de Especificaciones con Check Reactivo y Bold en Space Grotesk */}
                <div className="mt-4 pt-2 border-t border-white/[0.04] divide-y divide-white/[0.03]">
                  {prod.features.slice(0, 3).map((f, i) => (
                    <div
                      key={i}
                      className="py-2 flex items-center justify-between text-xs text-[#A1A1AA] group-hover:text-white transition-colors font-jakarta"
                    >
                      <span className="truncate pr-2 font-normal">{f}</span>
                      <span className={`font-space text-xs shrink-0 font-bold ${theme.textColor}`}>✓</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── PIE DESPEJADO: BOTONERA DUAL DIRECTA ── */}
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANTE 3: OUTFIT + JETBRAINS MONO (HIGH-TECH LAB / CYBER-INDUSTRIAL)
// - Estructura, overlay y chulitos idénticos a la Tarjeta 1
// - Tipografía geométrica circular de gran peso + mono de ingeniería de élite
// ─────────────────────────────────────────────────────────────────────────────
function KineticSpecGrid({ hasDiscount, currency, discountStyle }: CardPriceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 font-outfit">
      {CLEAN_PRODUCTS.map((prod) => {
        const theme = PLAN_THEMES[prod.tier];

        return (
          <article
            key={prod.id}
            className="group rounded-2xl overflow-hidden flex flex-col justify-between transition-colors duration-200 bg-[#09090b] border border-white/[0.06] hover:border-white/[0.14]"
          >
            {/* ── HEADER VISUAL (FOTO CON 2 PUNTAS ARRIBA + PRECIO ABAJO) ── */}
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
                className="absolute inset-x-0 -bottom-[1px] h-[88px] pointer-events-none z-[5]"
                style={{
                  background:
                    "linear-gradient(to top, #09090b 0%, rgba(9, 9, 11, 0.98) 15%, rgba(9, 9, 11, 0.90) 30%, rgba(9, 9, 11, 0.74) 48%, rgba(9, 9, 11, 0.50) 65%, rgba(9, 9, 11, 0.25) 80%, rgba(9, 9, 11, 0.08) 92%, rgba(9, 9, 11, 0) 100%)",
                }}
              />

              {/* PUNTA 1 (Arriba Izquierda): Categoría en JetBrains Mono */}
              <div className="absolute top-3 left-4 z-10 font-jetbrains text-[9px] font-bold tracking-widest uppercase text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                {prod.category}
              </div>

              {/* PUNTA 2 (Arriba Derecha): Plan en JetBrains Mono */}
              <div className={`absolute top-3 right-4 z-10 font-jetbrains text-[9px] font-bold tracking-widest uppercase ${theme.textColor} drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}>
                {prod.tier}
              </div>

              {/* PRECIO EN LA PARTE INFERIOR DE LA FOTO (CON LA IDEA DEL USUARIO) */}
              <CardPriceDisplay
                productId={prod.id}
                hasDiscount={hasDiscount}
                currency={currency}
                discountLayout={discountStyle}
                fontFamilyClass="font-jetbrains"
                defaultPrice={prod.price}
                defaultCurrency={prod.currency}
                defaultPeriod={prod.period}
              />

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

            {/* ── CUERPO DE CONTENIDO EN OUTFIT ── */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div>
                {/* Rating con Estrella Amarilla Dorada y reviews súper centrado */}
                <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.03]">
                  <span className="font-jetbrains text-[10px] font-medium text-[#666666] uppercase tracking-wider">
                    {prod.badge ? `★ ${prod.badge}` : "Catálogo Oficial"}
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star size={11} weight="fill" className="text-amber-400 shrink-0" />
                    <span className="font-jetbrains text-white font-bold text-[11px] leading-none">{prod.rating}</span>
                    <span className="font-jetbrains text-[#71717A] text-[10px] leading-none">({prod.reviews})</span>
                  </div>
                </div>

                {/* Título de Producto en Plus Jakarta Sans ExtraBold (como en la Opción 2) */}
                <h3
                  onClick={() => toast.info(`Modal de detalles: ${prod.title}`)}
                  className="font-jakarta text-[1.05rem] font-extrabold text-white tracking-tight leading-snug mt-2 group-hover:text-white transition-colors cursor-pointer"
                >
                  {prod.title}
                </h3>

                {/* Descripción breve en Outfit */}
                <p className="font-outfit text-xs text-[#8C8C8C] mt-2 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                {/* 3 Líneas de Especificaciones con Check Reactivo en JetBrains Mono */}
                <div className="mt-4 pt-2 border-t border-white/[0.04] divide-y divide-white/[0.03]">
                  {prod.features.slice(0, 3).map((f, i) => (
                    <div
                      key={i}
                      className="py-2 flex items-center justify-between text-xs text-[#A1A1AA] group-hover:text-white transition-colors font-outfit"
                    >
                      <span className="truncate pr-2 font-normal">{f}</span>
                      <span className={`font-jetbrains text-xs shrink-0 font-bold ${theme.textColor}`}>✓</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── PIE DESPEJADO: BOTONERA DUAL DIRECTA ── */}
              <div className="pt-3 border-t border-white/[0.04]">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => toast.info(`Abriendo detalles de: ${prod.title}`)}
                    className="py-2.5 rounded-xl text-xs font-semibold text-white/75 hover:text-white bg-[#141418] hover:bg-[#1C1C22] border border-white/[0.06] hover:border-white/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-outfit"
                  >
                    <Eye size={13} weight="bold" />
                    <span>Detalles</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success(`Adquiriendo: ${prod.title}`)}
                    className="py-2.5 rounded-xl text-xs font-bold bg-[#FAFAFA] text-[#030303] hover:bg-white active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] font-outfit"
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANTE 4: SYNE + MONO (EXECUTIVE LUXURY / EDITORIAL AVANT-GARDE)
// - Estructura, overlay y chulitos idénticos a la Tarjeta 1
// - Tipografía editorial distintiva de alta gama (Leica / Sony Pro aesthetic)
// ─────────────────────────────────────────────────────────────────────────────
function ObsidianPrismGrid({ hasDiscount, currency, discountStyle }: CardPriceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {CLEAN_PRODUCTS.map((prod) => {
        const theme = PLAN_THEMES[prod.tier];

        return (
          <article
            key={prod.id}
            className="group rounded-2xl overflow-hidden flex flex-col justify-between transition-colors duration-200 bg-[#09090b] border border-white/[0.06] hover:border-white/[0.14]"
          >
            {/* ── HEADER VISUAL (FOTO CON 2 PUNTAS ARRIBA + PRECIO ABAJO) ── */}
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
                className="absolute inset-x-0 -bottom-[1px] h-[88px] pointer-events-none z-[5]"
                style={{
                  background:
                    "linear-gradient(to top, #09090b 0%, rgba(9, 9, 11, 0.98) 15%, rgba(9, 9, 11, 0.90) 30%, rgba(9, 9, 11, 0.74) 48%, rgba(9, 9, 11, 0.50) 65%, rgba(9, 9, 11, 0.25) 80%, rgba(9, 9, 11, 0.08) 92%, rgba(9, 9, 11, 0) 100%)",
                }}
              />

              {/* PUNTA 1 (Arriba Izquierda): Categoría en Mono Espaciado */}
              <div className="absolute top-3 left-4 z-10 font-mono text-[9px] font-semibold tracking-[0.2em] uppercase text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                {prod.category}
              </div>

              {/* PUNTA 2 (Arriba Derecha): Plan en Mono Espaciado */}
              <div className={`absolute top-3 right-4 z-10 font-mono text-[9px] font-bold tracking-[0.2em] uppercase ${theme.textColor} drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}>
                {prod.tier}
              </div>

              {/* PRECIO EN LA PARTE INFERIOR DE LA FOTO (CON LA IDEA DEL USUARIO) */}
              <CardPriceDisplay
                productId={prod.id}
                hasDiscount={hasDiscount}
                currency={currency}
                discountLayout={discountStyle}
                fontFamilyClass="font-mono"
                defaultPrice={prod.price}
                defaultCurrency={prod.currency}
                defaultPeriod={prod.period}
              />

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

            {/* ── CUERPO DE CONTENIDO CON TÍTULO EN SYNE ── */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div>
                {/* Rating con Estrella Amarilla Dorada y reviews súper centrado */}
                <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.03]">
                  <span className="font-mono text-[10px] text-[#666666] uppercase tracking-wider">
                    {prod.badge ? `★ ${prod.badge}` : "Catálogo Oficial"}
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star size={11} weight="fill" className="text-amber-400 shrink-0" />
                    <span className="font-mono text-white font-medium text-[11px] leading-none">{prod.rating}</span>
                    <span className="font-mono text-[#71717A] text-[10px] leading-none">({prod.reviews})</span>
                  </div>
                </div>

                {/* Título de Producto en Syne Bold de Alto Impacto */}
                <h3
                  onClick={() => toast.info(`Modal de detalles: ${prod.title}`)}
                  className="font-syne text-[1.12rem] font-bold text-white tracking-tight leading-snug mt-2 group-hover:text-white transition-colors cursor-pointer"
                >
                  {prod.title}
                </h3>

                {/* Descripción breve */}
                <p className="text-xs text-[#8C8C8C] mt-2 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                {/* 3 Líneas de Especificaciones con Check Reactivo y Bold */}
                <div className="mt-4 pt-2 border-t border-white/[0.04] divide-y divide-white/[0.03]">
                  {prod.features.slice(0, 3).map((f, i) => (
                    <div
                      key={i}
                      className="py-2 flex items-center justify-between text-xs text-[#A1A1AA] group-hover:text-white transition-colors"
                    >
                      <span className="truncate pr-2 font-normal">{f}</span>
                      <span className={`font-mono text-xs shrink-0 font-bold ${theme.textColor}`}>✓</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── PIE DESPEJADO: BOTONERA DUAL DIRECTA ── */}
              <div className="pt-3 border-t border-white/[0.04]">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => toast.info(`Abriendo detalles de: ${prod.title}`)}
                    className="py-2.5 rounded-xl text-xs font-semibold text-white/75 hover:text-white bg-[#141418] hover:bg-[#1C1C22] border border-white/[0.06] hover:border-white/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-syne"
                  >
                    <Eye size={13} weight="bold" />
                    <span>Detalles</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success(`Adquiriendo: ${prod.title}`)}
                    className="py-2.5 rounded-xl text-xs font-bold bg-[#FAFAFA] text-[#030303] hover:bg-white active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] font-syne tracking-wide"
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
  );
}
