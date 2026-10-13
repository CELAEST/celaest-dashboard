"use client";

import React, { useState } from "react";
import {
  Sparkle,
  Check,
  Star,
  ArrowRight,
  Sun,
  Moon,
  Copy,
  Lightning,
  Shield,
  DotsThreeCircle,
  Chats,
  FileText,
  TrendUp,
  ArrowsLeftRight,
  Crown,
  SquaresFour,
} from "@phosphor-icons/react";
import { toast } from "sonner";

export interface ColorPaletteDef {
  id:
    | "obsidian"
    | "amethyst"
    | "graphite"
    | "titanium"
    | "emerald"
    | "nordik"
    | "tokyo"
    | "champagne"
    | "kurogane";
  category: "tech" | "luxury";
  name: string;
  tagline: string;
  benchmark: string;
  description: string;
  dark: {
    canvas: string;
    surface: string;
    surfaceElevated: string;
    surfaceHover: string;
    borderGhost: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentText: string;
    buttonBg: string;
    buttonText: string;
    buttonHover: string;
  };
  light: {
    canvas: string;
    surface: string;
    surfaceElevated: string;
    surfaceHover: string;
    borderGhost: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentText: string;
    buttonBg: string;
    buttonText: string;
    buttonHover: string;
  };
}

export const PALETTES: ColorPaletteDef[] = [
  // ─── GRUPO 1: MONOCROMÍA & TECH HIGH-END ──────────────────────────────
  {
    id: "obsidian",
    category: "tech",
    name: "Obsidian & Pure Platinum",
    tagline: "El Estándar Apple Pro & Linear",
    benchmark: "Linear / Apple Pro / Raycast",
    description:
      "Monocromía pura de alto rango dinámico. Cero colores invasivos: el contraste visual se genera por luminancia y no por saturación. La interfaz desaparece para darle protagonismo absoluto al producto.",
    dark: {
      canvas: "#04070D",
      surface: "#090D15",
      surfaceElevated: "#0E1420",
      surfaceHover: "#131C2C",
      borderGhost: "rgba(255, 255, 255, 0.05)",
      textPrimary: "#FFFFFF",
      textSecondary: "#94A3B8",
      textMuted: "#475569",
      accent: "#E2E8F0",
      accentText: "#0F172A",
      buttonBg: "#FFFFFF",
      buttonText: "#04070D",
      buttonHover: "#F1F5F9",
    },
    light: {
      canvas: "#FAFAFB",
      surface: "#FFFFFF",
      surfaceElevated: "#F4F5F7",
      surfaceHover: "#EAECEF",
      borderGhost: "rgba(0, 0, 0, 0.06)",
      textPrimary: "#090D15",
      textSecondary: "#475569",
      textMuted: "#94A3B8",
      accent: "#090D15",
      accentText: "#FFFFFF",
      buttonBg: "#090D15",
      buttonText: "#FFFFFF",
      buttonHover: "#1E293B",
    },
  },
  {
    id: "graphite",
    category: "tech",
    name: "High-Tech Graphite & Steel",
    tagline: "El Estándar Stripe & Vercel Enterprise",
    benchmark: "Stripe / Vercel Enterprise / Supabase",
    description:
      "Ingeniería corporativa sobria para software B2B de misión crítica. Gris carbón neutral que no cansa la vista, con acento cobalto técnico de alto impacto.",
    dark: {
      canvas: "#08090C",
      surface: "#101216",
      surfaceElevated: "#16181F",
      surfaceHover: "#1D2028",
      borderGhost: "rgba(255, 255, 255, 0.05)",
      textPrimary: "#F0F2F5",
      textSecondary: "#8A94A6",
      textMuted: "#525C6A",
      accent: "#3B66F5",
      accentText: "#FFFFFF",
      buttonBg: "#3B66F5",
      buttonText: "#FFFFFF",
      buttonHover: "#2854E8",
    },
    light: {
      canvas: "#F4F5F7",
      surface: "#FFFFFF",
      surfaceElevated: "#EBEDF2",
      surfaceHover: "#E2E5EC",
      borderGhost: "rgba(0, 0, 0, 0.06)",
      textPrimary: "#111318",
      textSecondary: "#4E5766",
      textMuted: "#8A94A6",
      accent: "#2854E8",
      accentText: "#FFFFFF",
      buttonBg: "#111318",
      buttonText: "#FFFFFF",
      buttonHover: "#2B2F38",
    },
  },
  {
    id: "nordik",
    category: "tech",
    name: "Nordik Frost & Glacial Slate",
    tagline: "Minimalismo Glacial Escandinavo & Pureza Extrema",
    benchmark: "Volvo Polestar / B&O / Dieter Rams",
    description:
      "Arquitectura escandinava de máxima reducción. El aire frío de los fiordos: fondos profundos con micro-tinte glacial, acentos en blanco hielo puro y pizarra azulada ultra desaturada. Respirabilidad espacial infinita.",
    dark: {
      canvas: "#04060A",
      surface: "#090E16",
      surfaceElevated: "#0F1622",
      surfaceHover: "#151F2E",
      borderGhost: "rgba(255, 255, 255, 0.05)",
      textPrimary: "#F8FAFC",
      textSecondary: "#90A4BC",
      textMuted: "#4B5E74",
      accent: "#38BDF8",
      accentText: "#04060A",
      buttonBg: "#F8FAFC",
      buttonText: "#04060A",
      buttonHover: "#E2E8F0",
    },
    light: {
      canvas: "#F6F8FB",
      surface: "#FFFFFF",
      surfaceElevated: "#EDF2F7",
      surfaceHover: "#E2E9F2",
      borderGhost: "rgba(56, 189, 248, 0.08)",
      textPrimary: "#070E1A",
      textSecondary: "#455971",
      textMuted: "#839BB7",
      accent: "#0284C7",
      accentText: "#FFFFFF",
      buttonBg: "#070E1A",
      buttonText: "#FFFFFF",
      buttonHover: "#152438",
    },
  },
  {
    id: "tokyo",
    category: "tech",
    name: "Tokyo Monochrome & Vermillion",
    tagline: "Estilo Sony Pro, Leica & Monocle Tokyo",
    benchmark: "Sony Alpha Pro / Leica Camera / Pitch",
    description:
      "La estética del equipo de cámara profesional japonés. Negro azabache riguroso (#020202) con tipografía de alta fidelidad y un micro-acento bermellón de precisión mecánica. Cero adornos, pura contundencia ejecutiva.",
    dark: {
      canvas: "#030303",
      surface: "#0D0D0D",
      surfaceElevated: "#151515",
      surfaceHover: "#1E1E1E",
      borderGhost: "rgba(255, 255, 255, 0.06)",
      textPrimary: "#FAFAFA",
      textSecondary: "#9E9E9E",
      textMuted: "#525252",
      accent: "#EF4444",
      accentText: "#FFFFFF",
      buttonBg: "#FAFAFA",
      buttonText: "#030303",
      buttonHover: "#E5E5E5",
    },
    light: {
      canvas: "#F7F7F7",
      surface: "#FFFFFF",
      surfaceElevated: "#EEEEEE",
      surfaceHover: "#E0E0E0",
      borderGhost: "rgba(0, 0, 0, 0.07)",
      textPrimary: "#111111",
      textSecondary: "#555555",
      textMuted: "#888888",
      accent: "#DC2626",
      accentText: "#FFFFFF",
      buttonBg: "#111111",
      buttonText: "#FFFFFF",
      buttonHover: "#2A2A2A",
    },
  },

  // ─── GRUPO 2: LUJO SILENCIOSO & HERENCIA ──────────────────────────────
  {
    id: "amethyst",
    category: "luxury",
    name: "Midnight Amethyst & Deep Space",
    tagline: "La Conexión Oficial Lingua (Ecosistema CELAEST)",
    benchmark: "Lingua (celaest-english-front) / macOS Sequoia",
    description:
      "Alineación cromática 1:1 con el Design System de Lingua. Utiliza el Deep Space (#04040A) con un velo de cristal índigo ahumado y acentos amatista desaturados de alta gama, transmitiendo inteligencia sin clichés neón.",
    dark: {
      canvas: "#04040A",
      surface: "#0A0A16",
      surfaceElevated: "#101024",
      surfaceHover: "#16162E",
      borderGhost: "rgba(255, 255, 255, 0.06)",
      textPrimary: "#FFFFFF",
      textSecondary: "#94A3B8",
      textMuted: "#64748B",
      accent: "#8B65FA",
      accentText: "#FFFFFF",
      buttonBg: "rgba(139, 101, 250, 0.16)",
      buttonText: "#C4B5FD",
      buttonHover: "rgba(139, 101, 250, 0.28)",
    },
    light: {
      canvas: "#F8F9FE",
      surface: "#FFFFFF",
      surfaceElevated: "#F1F3FB",
      surfaceHover: "#E8EBFA",
      borderGhost: "rgba(112, 72, 232, 0.08)",
      textPrimary: "#0C0C1C",
      textSecondary: "#475569",
      textMuted: "#8896AB",
      accent: "#7048E8",
      accentText: "#FFFFFF",
      buttonBg: "#7048E8",
      buttonText: "#FFFFFF",
      buttonHover: "#5B32D6",
    },
  },
  {
    id: "emerald",
    category: "luxury",
    name: "Emerald Reserve & Private Banking",
    tagline: "Lujo Silencioso Institucional & Banca Suiza",
    benchmark: "Rolex / Private Banking / Bloomberg Luxury",
    description:
      "Inspirada en las suites de gestión de patrimonio más exclusivas. Fondo bosque profundo (#030806) con superficies de malaquita atenuada y un acento verde salvia/esmeralda frío que transmite solvencia y máxima seguridad patrimonial.",
    dark: {
      canvas: "#030806",
      surface: "#08120D",
      surfaceElevated: "#0D1C15",
      surfaceHover: "#12251D",
      borderGhost: "rgba(255, 255, 255, 0.05)",
      textPrimary: "#F2FBF6",
      textSecondary: "#8CAE9E",
      textMuted: "#4F7162",
      accent: "#2DD4BF",
      accentText: "#030806",
      buttonBg: "#10B981",
      buttonText: "#030806",
      buttonHover: "#059669",
    },
    light: {
      canvas: "#F4F9F6",
      surface: "#FFFFFF",
      surfaceElevated: "#EAF3EE",
      surfaceHover: "#DEECE4",
      borderGhost: "rgba(16, 185, 129, 0.08)",
      textPrimary: "#06180F",
      textSecondary: "#406352",
      textMuted: "#749B88",
      accent: "#059669",
      accentText: "#FFFFFF",
      buttonBg: "#06180F",
      buttonText: "#FFFFFF",
      buttonHover: "#0F3222",
    },
  },
  {
    id: "champagne",
    category: "luxury",
    name: "Champagne Bronze & Dark Walnut",
    tagline: "Alta Relojería Suiza & Aviación Privada",
    benchmark: "Audemars Piguet / Gulfstream / Patek Philippe",
    description:
      "Sensación táctil de metales preciosos mate y maderas oscuras nobles. Fondos café-negro profundo con acentos en bronce champagne satinado. Para software donde cada detalle transmite exclusividad insuperable.",
    dark: {
      canvas: "#070605",
      surface: "#110F0D",
      surfaceElevated: "#1A1714",
      surfaceHover: "#24201C",
      borderGhost: "rgba(255, 255, 255, 0.05)",
      textPrimary: "#FAF6F0",
      textSecondary: "#A39788",
      textMuted: "#5C5347",
      accent: "#D4AF37",
      accentText: "#070605",
      buttonBg: "#D4AF37",
      buttonText: "#070605",
      buttonHover: "#C59F2D",
    },
    light: {
      canvas: "#F9F7F4",
      surface: "#FFFFFF",
      surfaceElevated: "#F2ECE3",
      surfaceHover: "#E6DEC0",
      borderGhost: "rgba(212, 175, 55, 0.1)",
      textPrimary: "#18140F",
      textSecondary: "#574E41",
      textMuted: "#968A79",
      accent: "#B88E1C",
      accentText: "#FFFFFF",
      buttonBg: "#18140F",
      buttonText: "#FAF6F0",
      buttonHover: "#2B241C",
    },
  },
  {
    id: "titanium",
    category: "luxury",
    name: "Tactical Titanium & Warm Charcoal",
    tagline: "Estilo Teenage Engineering & Arc",
    benchmark: "Teenage Engineering / Arc Browser / Leica",
    description:
      "Lujo industrial cálido. Combina negro carbón mate con marfil y tonos de titanio anodizado. Ideal para usuarios que aprecian el diseño editorial de precisión.",
    dark: {
      canvas: "#090909",
      surface: "#131313",
      surfaceElevated: "#1C1C1C",
      surfaceHover: "#242424",
      borderGhost: "rgba(255, 255, 255, 0.05)",
      textPrimary: "#F5F3EE",
      textSecondary: "#9A968E",
      textMuted: "#5E5A53",
      accent: "#E5E0D5",
      accentText: "#090909",
      buttonBg: "#E5E0D5",
      buttonText: "#090909",
      buttonHover: "#D6D0C2",
    },
    light: {
      canvas: "#F7F6F2",
      surface: "#FFFFFF",
      surfaceElevated: "#EFECE4",
      surfaceHover: "#E6E2D8",
      borderGhost: "rgba(0, 0, 0, 0.06)",
      textPrimary: "#1A1917",
      textSecondary: "#5E5A53",
      textMuted: "#9A968E",
      accent: "#1A1917",
      accentText: "#F5F3EE",
      buttonBg: "#1A1917",
      buttonText: "#F5F3EE",
      buttonHover: "#2E2D2A",
    },
  },
  {
    id: "kurogane",
    category: "luxury",
    name: "Kurogane (Tokyo Titanium & Leica Red)",
    tagline: "El Híbrido Definitivo: Titanio Oscuro con Punto Leica",
    benchmark: "Leica Camera / Teenage Eng. / Porsche Design",
    description:
      "La fusión maestra: combina el confort táctil del titanio y carbón cálido (#07080A / #111317) con la nitidez óptica del marfil nórdico (#F5F3EE) y un micro-acento bermellón Leica (#E53935) reservado quirúrgicamente para indicadores de precisión extrema.",
    dark: {
      canvas: "#060709",
      surface: "#0E1015",
      surfaceElevated: "#161820",
      surfaceHover: "#1E212A",
      borderGhost: "rgba(255, 255, 255, 0.05)",
      textPrimary: "#F5F3EE",
      textSecondary: "#949BA6",
      textMuted: "#525864",
      accent: "#E53935",
      accentText: "#FFFFFF",
      buttonBg: "#F5F3EE",
      buttonText: "#060709",
      buttonHover: "#E6E2D8",
    },
    light: {
      canvas: "#F8F7F4",
      surface: "#FFFFFF",
      surfaceElevated: "#EFECE5",
      surfaceHover: "#E5E1D8",
      borderGhost: "rgba(0, 0, 0, 0.06)",
      textPrimary: "#121418",
      textSecondary: "#535A66",
      textMuted: "#8E95A1",
      accent: "#DC2626",
      accentText: "#FFFFFF",
      buttonBg: "#121418",
      buttonText: "#F8F7F4",
      buttonHover: "#262A32",
    },
  },
];

const SAMPLE_PRODUCTS = [
  {
    id: "p1",
    title: "WhatsApp Multi-Agent Lead Routing Engine",
    description:
      "Orquestación omnicanal con fallback a agentes humanos, integración con CRM y analítica conversacional en tiempo real.",
    category: "Mensajería & Bots",
    tier: "Pro Tier",
    price: "$149",
    period: "/ mes",
    rating: 4.9,
    reviews: 38,
    features: ["Enrutamiento Dinámico IA", "Webhooks 120ms Latencia", "Multi-Tenant Aislado"],
  },
  {
    id: "p2",
    title: "Google Sheets & SQL BI Realtime Pipeline",
    description:
      "Sincronización bidireccional continua entre hojas de cálculo corporativas y almacenes analíticos PostgreSQL.",
    category: "Datos & Pipelines",
    tier: "Enterprise",
    price: "$299",
    period: "/ mes",
    rating: 5.0,
    reviews: 64,
    features: ["Zero-Data-Loss Queue", "Transformación ETL In-Flight", "Auditoría Criptográfica"],
  },
  {
    id: "p3",
    title: "HubSpot & Stripe Automated Revenue Ops",
    description:
      "Conciliación de pagos, provisionamiento automático de licencias y detección de churn predictivo mediante IA Mesh.",
    category: "Ventas & Finanzas",
    tier: "Starter+",
    price: "$89",
    period: "/ mes",
    rating: 4.8,
    reviews: 21,
    features: ["Facturación Recurrente", "Dunning Automatizado", "Notificaciones Slack"],
  },
];

export function AntiAiColorStudio() {
  const [selectedPaletteId, setSelectedPaletteId] = useState<ColorPaletteDef["id"]>("obsidian");
  const [filterCategory, setFilterCategory] = useState<"all" | "tech" | "luxury">("all");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isAntiAiMode, setIsAntiAiMode] = useState<boolean>(true); // Compare Anti-AI vs Old Cliché
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const currentPalette = PALETTES.find((p) => p.id === selectedPaletteId) || PALETTES[0];
  const t = isDarkMode ? currentPalette.dark : currentPalette.light;

  const filteredPalettes =
    filterCategory === "all"
      ? PALETTES
      : PALETTES.filter((p) => p.category === filterCategory);

  const copyToClipboard = (hex: string, label: string) => {
    navigator.clipboard.writeText(hex);
    toast.success(`Copiado: ${label} (${hex})`);
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-16 font-sans">
      {/* 1. Header & Selector Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/50">
              CELAEST DESIGN STUDIO
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono text-white/70">
              8 Paletas Anti-IA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Paletas Enterprise Anti-IA (Zero-AI-Slop)
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1 max-w-2xl leading-relaxed">
            Explora la colección ampliada de 8 direcciones cromáticas de alta costura digital.
            Cero colores neón, cero bolitas de radio y cero bordes invasivos.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/80 hover:text-white text-xs font-medium flex items-center gap-2 transition-all cursor-pointer border border-white/[0.04]"
          >
            {isDarkMode ? <Moon size={15} weight="fill" /> : <Sun size={15} weight="fill" />}
            <span>{isDarkMode ? "Modo Oscuro" : "Modo Claro"}</span>
          </button>

          {/* Anti-AI Toggle vs Cliché */}
          <button
            type="button"
            onClick={() => setIsAntiAiMode(!isAntiAiMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer border ${
              isAntiAiMode
                ? "bg-white text-black font-semibold border-white"
                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
            }`}
          >
            <ArrowsLeftRight size={15} weight="bold" />
            <span>{isAntiAiMode ? "Estándar Anti-IA (Nuevo)" : "Cliché IA (Antiguo Neón)"}</span>
          </button>
        </div>
      </div>

      {/* 2. Category Filter Tabs for the 8 Palettes */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        <button
          type="button"
          onClick={() => setFilterCategory("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            filterCategory === "all"
              ? "bg-white/10 text-white"
              : "text-white/40 hover:text-white/80"
          }`}
        >
          Todas las Paletas (8)
        </button>
        <button
          type="button"
          onClick={() => setFilterCategory("tech")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterCategory === "tech"
              ? "bg-white/10 text-white"
              : "text-white/40 hover:text-white/80"
          }`}
        >
          <SquaresFour size={13} weight="bold" />
          <span>Monocromía & Tech (4)</span>
        </button>
        <button
          type="button"
          onClick={() => setFilterCategory("luxury")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterCategory === "luxury"
              ? "bg-white/10 text-white"
              : "text-white/40 hover:text-white/80"
          }`}
        >
          <Crown size={13} weight="bold" />
          <span>Lujo Silencioso & Herencia (4)</span>
        </button>
      </div>

      {/* 3. Palette Selector Cards Grid (8 Palettes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredPalettes.map((pal) => {
          const isSelected = pal.id === selectedPaletteId;
          const colors = isDarkMode ? pal.dark : pal.light;

          return (
            <button
              key={pal.id}
              type="button"
              onClick={() => setSelectedPaletteId(pal.id)}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between h-full relative overflow-hidden group ${
                isSelected
                  ? "bg-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-white/20"
                  : "bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04]"
              }`}
            >
              <div>
                {/* Benchmark Tag */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono tracking-[0.18em] uppercase text-white/40 block">
                    {pal.benchmark}
                  </span>
                  <span
                    className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase ${
                      pal.category === "luxury"
                        ? "bg-amber-500/10 text-amber-300"
                        : "bg-blue-500/10 text-blue-300"
                    }`}
                  >
                    {pal.category === "luxury" ? "Luxury" : "Tech"}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white tracking-tight leading-snug">
                  {pal.name}
                </h3>
                <p className="text-[11px] text-white/50 mt-1 line-clamp-2 leading-relaxed">
                  {pal.tagline}
                </p>
              </div>

              {/* Mini Color Swatches Bar */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-1.5">
                <div
                  className="w-4.5 h-4.5 rounded-md border border-white/10 shrink-0"
                  style={{ backgroundColor: colors.canvas }}
                  title={`Canvas: ${colors.canvas}`}
                />
                <div
                  className="w-4.5 h-4.5 rounded-md border border-white/10 shrink-0"
                  style={{ backgroundColor: colors.surface }}
                  title={`Surface: ${colors.surface}`}
                />
                <div
                  className="w-4.5 h-4.5 rounded-md border border-white/10 shrink-0"
                  style={{ backgroundColor: colors.surfaceElevated }}
                  title={`Elevated: ${colors.surfaceElevated}`}
                />
                <div
                  className="w-4.5 h-4.5 rounded-md border border-white/10 shrink-0"
                  style={{ backgroundColor: colors.buttonBg }}
                  title={`Button: ${colors.buttonBg}`}
                />
                <div
                  className="w-4.5 h-4.5 rounded-md border border-white/10 shrink-0"
                  style={{ backgroundColor: colors.accent }}
                  title={`Accent: ${colors.accent}`}
                />
                <span className="ml-auto text-[10px] font-mono text-white/40">
                  {isSelected ? "Activo" : "Elegir"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Live Interactive Showcase Container */}
      <div
        className="rounded-3xl p-6 sm:p-8 transition-colors duration-300 relative overflow-hidden shadow-2xl border"
        style={{
          backgroundColor: isAntiAiMode ? t.canvas : "#040811",
          borderColor: isAntiAiMode ? t.borderGhost : "rgba(6, 182, 212, 0.2)",
          color: isAntiAiMode ? t.textPrimary : "#FFFFFF",
        }}
      >
        {/* Subtle Ambient Background Light */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-25"
          style={{
            backgroundColor: isAntiAiMode ? t.accent : "#06B6D4",
          }}
        />

        {/* Section Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b"
          style={{ borderColor: isAntiAiMode ? t.borderGhost : "rgba(255, 255, 255, 0.08)" }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono tracking-[0.2em] uppercase"
                style={{ color: isAntiAiMode ? t.textMuted : "#06B6D4" }}
              >
                LIVE PREVIEW: TIENDA & FILTROS
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                style={{
                  backgroundColor: isAntiAiMode ? t.surfaceElevated : "rgba(6, 182, 212, 0.1)",
                  color: isAntiAiMode ? t.textSecondary : "#22D3EE",
                }}
              >
                {currentPalette.name} · {isDarkMode ? "Dark" : "Light"}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight mt-1">
              Catálogo de Automatizaciones CELAEST
            </h2>
          </div>
          <p className="text-xs max-w-md leading-relaxed" style={{ color: t.textSecondary }}>
            {currentPalette.description}
          </p>
        </div>

        {/* Layout: Sidebar + Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* A. Sidebar de Filtros Enterprise (Zero Bolitas) */}
          <div
            className="lg:col-span-4 rounded-2xl p-5 flex flex-col gap-5 transition-colors"
            style={{
              backgroundColor: isAntiAiMode ? t.surface : "#080C14",
              border: isAntiAiMode ? `1px solid ${t.borderGhost}` : "1px solid rgba(6, 182, 212, 0.2)",
            }}
          >
            {/* Header del Sidebar */}
            <div>
              <span
                className="text-[9px] font-mono tracking-[0.2em] uppercase block"
                style={{ color: isAntiAiMode ? t.textMuted : "#06B6D4" }}
              >
                CATÁLOGO DE SOLUCIONES
              </span>
              <h3 className="text-base font-bold tracking-tight mt-0.5">
                Automatizaciones
              </h3>
              <p className="text-[11px] mt-1" style={{ color: t.textSecondary }}>
                Infraestructura preconfigurada lista para tu flujo de trabajo.
              </p>
            </div>

            {/* Input de Búsqueda Integrado */}
            <div
              className="flex items-center px-3 py-2 rounded-xl transition-colors"
              style={{
                backgroundColor: isAntiAiMode ? t.surfaceElevated : "#0B101B",
                border: isAntiAiMode ? `1px solid ${t.borderGhost}` : "1px solid rgba(6, 182, 212, 0.3)",
              }}
            >
              <input
                type="text"
                placeholder="Buscar automatizaciones..."
                className="bg-transparent text-xs w-full outline-none"
                style={{ color: t.textPrimary }}
                readOnly
                value="Lead routing & bi..."
              />
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded ml-2"
                style={{
                  backgroundColor: isAntiAiMode ? t.surface : "rgba(6, 182, 212, 0.15)",
                  color: isAntiAiMode ? t.textMuted : "#22D3EE",
                }}
              >
                ⌘K
              </span>
            </div>

            {/* Categorías (Zero Bolitas) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-mono tracking-[0.18em] uppercase" style={{ color: t.textMuted }}>
                  CATEGORÍAS
                </span>
                <span className="text-[10px] cursor-pointer" style={{ color: t.textSecondary }}>
                  Limpiar
                </span>
              </div>

              {[
                { id: "all", name: "Todas las soluciones", count: 34, icon: DotsThreeCircle },
                { id: "messaging", name: "Mensajería & Bots", count: 12, icon: Chats },
                { id: "data", name: "Datos & Pipelines", count: 9, icon: FileText },
                { id: "sales", name: "Ventas & Finanzas", count: 8, icon: TrendUp },
              ].map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-left"
                    style={{
                      // Anti-AI: Fondo translúcido sutil sin bordes ni bolitas
                      backgroundColor: isAntiAiMode
                        ? isSelected
                          ? t.surfaceElevated
                          : "transparent"
                        : isSelected
                        ? "rgba(6, 182, 212, 0.15)"
                        : "transparent",
                      color: isSelected ? t.textPrimary : t.textSecondary,
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Old Cliché: Bolita con glow. Anti-AI: Icono sobrio */}
                      {!isAntiAiMode && isSelected ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
                        </div>
                      ) : (
                        <Icon size={15} style={{ color: isSelected ? t.textPrimary : t.textMuted }} />
                      )}
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-[11px] font-mono" style={{ color: t.textMuted }}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Solution Card (Zero AI Cliché) */}
            <div
              className="rounded-xl p-4 mt-2 transition-colors relative overflow-hidden"
              style={{
                backgroundColor: isAntiAiMode ? t.surfaceElevated : "rgba(6, 182, 212, 0.08)",
                border: isAntiAiMode ? `1px solid ${t.borderGhost}` : "1px solid rgba(6, 182, 212, 0.3)",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Shield size={14} style={{ color: isAntiAiMode ? t.textPrimary : "#22D3EE" }} />
                <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                  SOLUCIÓN A MEDIDA
                </span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: t.textSecondary }}>
                ¿Requieres un pipeline exclusivo para tu empresa? Diseñamos automatizaciones a medida.
              </p>
              <button
                type="button"
                className="text-xs font-semibold mt-3 inline-flex items-center gap-1.5 cursor-pointer group"
                style={{ color: isAntiAiMode ? t.textPrimary : "#22D3EE" }}
              >
                <span>Solicitar desarrollo</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* B. Grid de Tarjetas de Producto Enterprise */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl p-5 flex flex-col justify-between transition-all group relative overflow-hidden"
                style={{
                  backgroundColor: isAntiAiMode ? t.surface : "#0A0F1A",
                  border: isAntiAiMode ? `1px solid ${t.borderGhost}` : "1px solid rgba(6, 182, 212, 0.25)",
                  boxShadow: isAntiAiMode ? "0 4px 20px rgba(0,0,0,0.15)" : "0 8px 30px rgba(6, 182, 212, 0.1)",
                }}
              >
                <div>
                  {/* Top Floating Micro-Typography */}
                  <div className="flex items-center justify-between pb-3">
                    <span
                      className="text-[9px] font-mono tracking-[0.2em] uppercase font-medium"
                      style={{ color: isAntiAiMode ? t.textMuted : "#22D3EE" }}
                    >
                      {prod.category}
                    </span>
                    <span
                      className="text-[9px] font-mono tracking-[0.16em] uppercase px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: isAntiAiMode ? t.surfaceElevated : "rgba(6, 182, 212, 0.15)",
                        color: isAntiAiMode ? t.textSecondary : "#22D3EE",
                      }}
                    >
                      {prod.tier}
                    </span>
                  </div>

                  {/* Title */}
                  <h4
                    className="text-base font-semibold tracking-tight leading-snug group-hover:opacity-90 transition-opacity"
                    style={{ color: t.textPrimary }}
                  >
                    {prod.title}
                  </h4>

                  {/* Rating Subdued (Zero AI Glow) */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} weight="fill" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: t.textMuted }}>
                      {prod.rating} ({prod.reviews} reseñas)
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs mt-2.5 leading-relaxed" style={{ color: t.textSecondary }}>
                    {prod.description}
                  </p>

                  {/* Micro-Features (Zero Checks Verdes/Cianes) */}
                  <div className="mt-4 pt-3 border-t space-y-1.5" style={{ borderColor: t.borderGhost }}>
                    {prod.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        {!isAntiAiMode ? (
                          <div className="w-3.5 h-3.5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                            <Check size={9} weight="bold" />
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: t.textMuted }}>
                            ·
                          </span>
                        )}
                        <span style={{ color: t.textSecondary }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and Action Button */}
                <div
                  className="mt-6 pt-4 border-t flex items-center justify-between gap-3"
                  style={{ borderColor: t.borderGhost }}
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: t.textMuted }}>
                      Inversión
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold tracking-tight" style={{ color: t.textPrimary }}>
                        {prod.price}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: t.textMuted }}>
                        {prod.period}
                      </span>
                    </div>
                  </div>

                  {/* Action Button: Monocromático / Lujo silencioso */}
                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
                    style={{
                      // Old Cliché: Cyan brillante neón. Anti-AI: Botón refinado
                      backgroundColor: isAntiAiMode ? t.buttonBg : "#06B6D4",
                      color: isAntiAiMode ? t.buttonText : "#000000",
                      boxShadow: isAntiAiMode
                        ? "0 2px 8px rgba(0,0,0,0.2)"
                        : "0 0 16px rgba(6, 182, 212, 0.4)",
                    }}
                  >
                    <span>Adquirir</span>
                    <ArrowRight size={13} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Live Color Token Inspector (Valores HEX exactos) */}
      <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkle size={16} className="text-white/70" />
            <h3 className="text-sm font-semibold text-white">
              Tokens Exactos: {currentPalette.name} ({isDarkMode ? "Dark" : "Light"})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-white/40">
            Haz clic en cualquier token para copiar el valor HEX
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {[
            { label: "Canvas", hex: t.canvas, role: "Fondo estructural profundo" },
            { label: "Surface", hex: t.surface, role: "Superficie de paneles y tarjetas" },
            { label: "Elevated", hex: t.surfaceElevated, role: "Hover / Active inputs" },
            { label: "Text Primary", hex: t.textPrimary, role: "Títulos y precios (100% legibilidad)" },
            { label: "Text Muted", hex: t.textMuted, role: "Metadatos y badges (Monospace)" },
            { label: "Button / CTA", hex: t.buttonBg, role: "Acción principal sobria" },
          ].map((tok) => (
            <button
              key={tok.label}
              type="button"
              onClick={() => copyToClipboard(tok.hex, tok.label)}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-4 h-4 rounded border border-white/20 shrink-0"
                  style={{ backgroundColor: tok.hex }}
                />
                <Copy size={12} className="text-white/30 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-mono uppercase text-white/50 block">
                {tok.label}
              </span>
              <span className="text-xs font-mono font-semibold text-white block mt-0.5">
                {tok.hex}
              </span>
              <span className="text-[9px] text-white/40 line-clamp-1 mt-1">
                {tok.role}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
