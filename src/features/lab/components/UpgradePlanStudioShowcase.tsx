"use client";

import React, { useState } from "react";
import {
  X,
  Check,
  Sparkle,
  ArrowRight,
  ArrowsOutSimple,
  Sun,
  Stack,
  Cube,
  Drop,
  Sparkle as SparkleIcon,
  Columns,
  Eye,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS DE MODELOS DE UPGRADE (ESTRUCTURA IDÉNTICA A LA 1, DIFERENTES SOMBRAS Y DEGRADADOS)
// ─────────────────────────────────────────────────────────────────────────────
export type PricingModel =
  | "linear_platinum"     // Modelo 01: Base original 100% intacta (Referencia aprobada)
  | "ambient_occlusion"   // Modelo 02: Oclusión ambiental multicapa 4-Tier (Linear 2026)
  | "zenith_spotlight"    // Modelo 03: Luz volumétrica cenital Pro (Apple Spatial Studio)
  | "obsidian_glass"      // Modelo 04: Cristal ahumado refractivo (Raycast Glassmorphism)
  | "titanium_chamfer"    // Modelo 05: Titanio aeroespacial & bisel angulado (Swiss Precision)
  | "satin_elevation";    // Modelo 06: Resplandor perimetral & elevación dinámica (Vercel / Stripe)

interface PlanData {
  id: string;
  code: string;
  name: string;
  badge?: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyTotal: number;
  savingsYearly: number;
  metrics: {
    aiRequests: string;
    members: string;
    storage: string;
  };
  features: string[];
  highlight?: boolean;
}

const PLANS_DATA: PlanData[] = [
  {
    id: "plan-starter",
    code: "starter",
    name: "Starter",
    badge: "COMUNITARIO",
    tagline: "Para prototipos, validación ágil y proyectos personales.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyTotal: 0,
    savingsYearly: 0,
    metrics: {
      aiRequests: "100",
      members: "2 Miembros",
      storage: "1 GB NVMe",
    },
    features: [
      "100 solicitudes de IA/mes",
      "2 miembros de equipo con rol básico",
      "1 modelo de IA estándar",
      "Panel de análisis y telemetría básica",
      "Hasta 3 productos en catálogo",
      "Historial de auditoría de 7 días",
      "1 webhook saliente",
      "Soporte comunitario en Discord",
    ],
  },
  {
    id: "plan-pro",
    code: "pro",
    name: "Pro",
    badge: "MÁS POPULAR",
    tagline: "Para empresas, startups y equipos de ingeniería en producción.",
    monthlyPrice: 29,
    yearlyPrice: 24,
    yearlyTotal: 288,
    savingsYearly: 60,
    metrics: {
      aiRequests: "500K",
      members: "15 Miembros",
      storage: "25 GB NVMe",
    },
    features: [
      "500,000 solicitudes de IA/mes (Mesh Enrutamiento)",
      "15 asientos con roles de acceso granulares (RBAC)",
      "Modelos de IA avanzados ilimitados (Claude, GPT, Gemini)",
      "Hasta 10 productos comerciales en marketplace",
      "Análisis avanzado de latencia P99 y costos",
      "Registros de auditoría de 30 días",
      "5 webhooks en tiempo real de baja latencia",
      "25 GB de almacenamiento NVMe distribuido",
      "Soporte prioritario 24/7 con respuesta garantizada < 2h",
    ],
    highlight: true,
  },
  {
    id: "plan-enterprise",
    code: "enterprise",
    name: "Enterprise",
    badge: "ESCALA CORPORATIVA",
    tagline: "Para organizaciones que demandan SLA 99.99%, seguridad y escala global.",
    monthlyPrice: 99,
    yearlyPrice: 82.5,
    yearlyTotal: 990,
    savingsYearly: 198,
    metrics: {
      aiRequests: "1.0M+",
      members: "30+ Miembros",
      storage: "200 GB NVMe",
    },
    features: [
      "1,000,000+ solicitudes de IA con aislamiento dedicado",
      "30+ miembros con SSO / SAML y aprovisionamiento SCIM",
      "Fine-tuning y modelos privados en tenant aislado",
      "Catálogos y productos comerciales ilimitados",
      "Registros de auditoría inmutables de 365 días",
      "Webhooks ilimitados e integración bidireccional GitHub",
      "Marca blanca total y dominio personalizado",
      "Exportación analítica en CSV, JSON y Parquet",
      "Garantía contractual de SLA 99.99%",
      "Gerente de cuenta técnico y canal privado de Slack",
    ],
  },
];

export function UpgradePlanStudioShowcase() {
  const [selectedModel, setSelectedModel] = useState<PricingModel>("ambient_occlusion");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [viewMode, setViewMode] = useState<"single" | "comparison">("single");
  const [isModalOverlayOpen, setIsModalOverlayOpen] = useState(false);

  const isYearly = billingCycle === "yearly";

  const handleSimulateSelect = (plan: PlanData) => {
    toast.success(`Plan ${plan.name} seleccionado (${billingCycle === "yearly" ? "Facturación Anual" : "Facturación Mensual"})`);
  };

  return (
    <div className="w-full flex flex-col gap-8 text-white font-sans pb-16">
      {/* ── BARRA SUPERIOR DE CONTROL DEL ESTUDIO ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-5 rounded-2xl bg-[#090A0E] border border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-white/50 mb-1 font-semibold">
            <span>CELAEST LABS</span>
            <span>•</span>
            <span className="text-white">ESTUDIO DE FÍSICA DE SOMBRAS & DEGRADADOS</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Estructura Original • Nuevas Técnicas de Alta Fidelidad en Sombras y Degradados
          </h2>
          <p className="text-xs text-white/50 mt-0.5 max-w-[760px] leading-relaxed">
            El <strong className="text-white/80">Modelo 01 original está 100% intacto</strong> como punto de referencia. Cada nueva variación conserva exactamente su tipografía, balance y contenido, elevando la iluminación con oclusión multicapa, softbox cenital Apple, micro-biseles refractivos, titanio suizo y elevación perimetral satinada.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Selector de Modo: Individual vs Comparativa Lado a Lado */}
          <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/[0.08] text-xs">
            <button
              type="button"
              onClick={() => setViewMode("single")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === "single" ? "bg-white text-black font-semibold shadow-sm" : "text-white/50 hover:text-white"
              }`}
            >
              <Eye size={13} />
              <span>Vista Principal</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("comparison")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === "comparison" ? "bg-white text-black font-semibold shadow-sm" : "text-white/50 hover:text-white"
              }`}
            >
              <Columns size={13} />
              <span>Comparar con Mod. 01</span>
            </button>
          </div>

          {/* Toggle Mensual / Anual */}
          <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/[0.08] text-xs">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                !isYearly ? "bg-white text-black font-semibold shadow-sm" : "text-white/50 hover:text-white"
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                isYearly ? "bg-white text-black font-semibold shadow-sm" : "text-white/50 hover:text-white"
              }`}
            >
              <span>Anual</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${isYearly ? "bg-black/10 text-black" : "bg-white/10 text-white"}`}>
                -20%
              </span>
            </button>
          </div>

          {/* Botón para probar en modo Modal emergente */}
          <button
            type="button"
            onClick={() => setIsModalOverlayOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowsOutSimple size={13} />
            <span>Ver Flotante</span>
          </button>
        </div>
      </div>

      {/* ── SELECTOR DE TÉCNICAS (CONSERVA LA ESTRUCTURA, CAMBIA LA TÉCNICA DE LUZ) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Modelo 01: Linear Platinum Sovereign (INTACTO) */}
        <div
          onClick={() => setSelectedModel("linear_platinum")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedModel === "linear_platinum"
              ? "bg-[#111219] border-white/60 ring-1 ring-white/20 shadow-[0_4px_24px_rgba(255,255,255,0.1)]"
              : "bg-[#090A0E] border-white/[0.06] hover:border-white/20"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 font-semibold flex items-center gap-1.5">
                <Sparkle size={11} weight="fill" className="text-white/80" />
                Modelo 01 • Platino Original
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/15 text-white font-bold">
                100% Intacto
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Linear Platinum Sovereign (Original)</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Tu modelo base favorito: chasis monocromático sin alteraciones, anillo blanco Pro y botón satinado estándar.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/[0.04] text-xs text-white/80 font-semibold flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40">Sombra: 24px difusa</span>
            <span>{selectedModel === "linear_platinum" ? "Activo" : "Seleccionar"}</span>
          </div>
        </div>

        {/* Modelo 02: Oclusión Ambiental Multicapa 4-Tier */}
        <div
          onClick={() => setSelectedModel("ambient_occlusion")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedModel === "ambient_occlusion"
              ? "bg-[#111219] border-white/60 ring-1 ring-white/20 shadow-[0_4px_24px_rgba(255,255,255,0.1)]"
              : "bg-[#090A0E] border-white/[0.06] hover:border-white/20"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70 font-semibold flex items-center gap-1.5">
                <Stack size={11} weight="fill" className="text-white/80" />
                Modelo 02 • Oclusión 4-Tier
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-white font-semibold">
                Física Linear 2026
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Oclusión Ambiental Multicapa</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              4 estratos de sombra simultáneos (contacto 1px, difusión 8px, penumbra 28px, profundidad 60px) + bisel superior incidente al 40%.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/[0.04] text-xs text-white/80 font-semibold flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40">4 Sombras + Hairline 1px</span>
            <span>{selectedModel === "ambient_occlusion" ? "Activo" : "Seleccionar"}</span>
          </div>
        </div>

        {/* Modelo 03: Luz Volumétrica Cenital Pro */}
        <div
          onClick={() => setSelectedModel("zenith_spotlight")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedModel === "zenith_spotlight"
              ? "bg-[#111219] border-white/60 ring-1 ring-white/20 shadow-[0_4px_24px_rgba(255,255,255,0.1)]"
              : "bg-[#090A0E] border-white/[0.06] hover:border-white/20"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 font-semibold flex items-center gap-1.5">
                <Sun size={11} weight="fill" className="text-white/80" />
                Modelo 03 • Apple Spatial
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-white/80 font-semibold">
                Softbox Cenital
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Luz Volumétrica Cenital Pro</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Aura cenital difusa detrás de la tarjeta Pro, gradiente elíptico de estudio y sombra de penumbra atmosférica de gran radio (120px).
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/[0.04] text-xs text-white/80 font-semibold flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40">Halo 120px + Penumbra</span>
            <span>{selectedModel === "zenith_spotlight" ? "Activo" : "Seleccionar"}</span>
          </div>
        </div>

        {/* Modelo 04: Cristal Ahumado Refractivo */}
        <div
          onClick={() => setSelectedModel("obsidian_glass")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedModel === "obsidian_glass"
              ? "bg-[#111219] border-white/60 ring-1 ring-white/20 shadow-[0_4px_24px_rgba(255,255,255,0.1)]"
              : "bg-[#090A0E] border-white/[0.06] hover:border-white/20"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 font-semibold flex items-center gap-1.5">
                <Drop size={11} weight="fill" className="text-white/80" />
                Modelo 04 • Obsidian Glass
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-white/80 font-semibold">
                Raycast Glass
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Cristal Ahumado Refractivo</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Glassmorphism oscuro de 32px con doble bisel interior de luz (`inset 1.5px`), bahías grabadas en métricas y sombra de refracción óptica.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/[0.04] text-xs text-white/80 font-semibold flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40">Doble Inset + Refracción</span>
            <span>{selectedModel === "obsidian_glass" ? "Activo" : "Seleccionar"}</span>
          </div>
        </div>

        {/* Modelo 05: Titanio Aeroespacial & Bisel Angulado */}
        <div
          onClick={() => setSelectedModel("titanium_chamfer")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedModel === "titanium_chamfer"
              ? "bg-[#111219] border-white/60 ring-1 ring-white/20 shadow-[0_4px_24px_rgba(255,255,255,0.1)]"
              : "bg-[#090A0E] border-white/[0.06] hover:border-white/20"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 font-semibold flex items-center gap-1.5">
                <Cube size={11} weight="fill" className="text-white/80" />
                Modelo 05 • Swiss Chamfer
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-white/80 font-semibold">
                Titanio Precisión
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Titanio Aeroespacial & Bisel</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Gradiente satinado diagonal a 135°, bisel asimétrico de contacto metálico (45% superior, 20% izquierdo) y botón con chasis pulido.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/[0.04] text-xs text-white/80 font-semibold flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40">Bisel 45° + Titanio</span>
            <span>{selectedModel === "titanium_chamfer" ? "Activo" : "Seleccionar"}</span>
          </div>
        </div>

        {/* Modelo 06: Resplandor Perimetral Satinado & Elevación Dinámica */}
        <div
          onClick={() => setSelectedModel("satin_elevation")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedModel === "satin_elevation"
              ? "bg-[#111219] border-white/60 ring-1 ring-white/20 shadow-[0_4px_24px_rgba(255,255,255,0.1)]"
              : "bg-[#090A0E] border-white/[0.06] hover:border-white/20"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 font-semibold flex items-center gap-1.5">
                <SparkleIcon size={11} weight="fill" className="text-white/80" />
                Modelo 06 • Satin Elevation
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-white/80 font-semibold">
                Stripe / Vercel
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Resplandor Perimetral & Elevación</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Física de elevación interactiva con caída fluida, resplandor perimetral reflectivo que reacciona en hover y hairline cenital dinámico.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/[0.04] text-xs text-white/80 font-semibold flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40">Elevación Reactiva</span>
            <span>{selectedModel === "satin_elevation" ? "Activo" : "Seleccionar"}</span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* MODO COMPARATIVA LADO A LADO (MODELO 01 vs TÉCNICA SELECCIONADA)      */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      {viewMode === "comparison" && (
        <div className="flex flex-col gap-6">
          <div className="p-4 rounded-2xl bg-[#0C0D12] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <Columns size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Comparador Visual Directo: Modelo 01 (Original) vs {getModelLabel(selectedModel)}
                </h4>
                <p className="text-xs text-white/50">
                  Compara la tarjeta Pro del diseño base frente al tratamiento de sombra y gradiente seleccionado.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewMode("single")}
              className="text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 cursor-pointer"
            >
              Cerrar Comparativa
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* LADO IZQUIERDO: MODELO 01 INTACTO */}
            <div className="rounded-3xl bg-[#09090C] border border-white/[0.08] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white font-bold">
                    REFERENCIA
                  </span>
                  <span className="text-sm font-bold text-white">Modelo 01 • Platino Original (Intacto)</span>
                </div>
                <span className="text-xs font-mono text-white/40">Sombra estándar</span>
              </div>
              <LinearPlatinumGrid
                plans={PLANS_DATA}
                isYearly={isYearly}
                onSelect={handleSimulateSelect}
              />
            </div>

            {/* LADO DERECHO: MODELO SELECCIONADO */}
            <div className="rounded-3xl bg-[#09090C] border border-white/20 p-6 flex flex-col gap-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white text-black font-extrabold">
                    NUEVA TÉCNICA
                  </span>
                  <span className="text-sm font-bold text-white">{getModelLabel(selectedModel)}</span>
                </div>
                <span className="text-xs font-mono text-white/60">Sombras & degradados avanzados</span>
              </div>
              {renderModelGrid(selectedModel, PLANS_DATA, isYearly, handleSimulateSelect)}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LIENZO COMPLETO INLINE (EXPERIENCIA 100% VISIBLE SIN VENTANA TRAP)     */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      {viewMode === "single" && (
        <div className="w-full relative rounded-3xl bg-[#09090C] border border-white/[0.08] p-6 sm:p-10 shadow-[0_32px_96px_-12px_rgba(0,0,0,0.95)] overflow-hidden">
          {/* Tokyo Corner Accents */}
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-white/20 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-white/20 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-white/20 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-white/20 rounded-br-sm pointer-events-none" />

          {/* ── CONTROL FLOTANTE (SIN HEADER RÍGIDO NI BORDE DIVISOR) ── */}
          <div className="flex justify-center items-center pb-6">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-transparent">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  !isYearly
                    ? "bg-white text-black font-bold shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                Facturación Mensual
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  isYearly
                    ? "bg-white text-black font-bold shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span>Facturación Anual</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isYearly
                      ? "bg-black/10 text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* ── CUERPO CON LA TÉCNICA SELECCIONADA ── */}
          <div className="pt-2">
            {renderModelGrid(selectedModel, PLANS_DATA, isYearly, handleSimulateSelect)}
          </div>

          {/* ── FICHA TÉCNICA DE LUZ APLICADA AL MODELO ACTIVO ── */}
          <div className="mt-8 p-4 rounded-2xl bg-black/50 border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                <SlidersHorizontal size={14} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                  Técnica Activa
                </span>
                <span className="font-semibold text-white">
                  {getModelLabel(selectedModel)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-white/60">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                Superficie: <strong className="text-white">{getModelSurfaceSpec(selectedModel)}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                Sombras: <strong className="text-white">{getModelShadowSpec(selectedModel)}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                Bisel de Luz: <strong className="text-white">{getModelBevelSpec(selectedModel)}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL FLOTANTE (OPCIONAL, SOLO SI EL USUARIO QUIERE VERLO COMO OVERLAY) ── */}
      {isModalOverlayOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOverlayOpen(false);
          }}
        >
          <div
            style={{ width: "100%", maxWidth: "1140px" }}
            className="relative flex flex-col max-h-[92dvh] rounded-3xl bg-[#09090C] border border-white/[0.08] shadow-[0_32px_96px_-12px_rgba(0,0,0,0.95)] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setIsModalOverlayOpen(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="p-6 sm:p-8 overflow-y-auto no-scrollbar">
              {renderModelGrid(selectedModel, PLANS_DATA, isYearly, (p) => {
                handleSimulateSelect(p);
                setIsModalOverlayOpen(false);
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DISPATCHER DE MODELOS
// ─────────────────────────────────────────────────────────────────────────────
function renderModelGrid(
  model: PricingModel,
  plans: PlanData[],
  isYearly: boolean,
  onSelect: (p: PlanData) => void
) {
  switch (model) {
    case "linear_platinum":
      return <LinearPlatinumGrid plans={plans} isYearly={isYearly} onSelect={onSelect} />;
    case "ambient_occlusion":
      return <AmbientOcclusionGrid plans={plans} isYearly={isYearly} onSelect={onSelect} />;
    case "zenith_spotlight":
      return <ZenithSpotlightGrid plans={plans} isYearly={isYearly} onSelect={onSelect} />;
    case "obsidian_glass":
      return <ObsidianGlassGrid plans={plans} isYearly={isYearly} onSelect={onSelect} />;
    case "titanium_chamfer":
      return <TitaniumChamferGrid plans={plans} isYearly={isYearly} onSelect={onSelect} />;
    case "satin_elevation":
      return <SatinElevationGrid plans={plans} isYearly={isYearly} onSelect={onSelect} />;
    default:
      return <LinearPlatinumGrid plans={plans} isYearly={isYearly} onSelect={onSelect} />;
  }
}

function getModelLabel(model: PricingModel): string {
  switch (model) {
    case "linear_platinum":
      return "Modelo 01 • Platino Original (Intacto)";
    case "ambient_occlusion":
      return "Modelo 02 • Oclusión Ambiental Multicapa 4-Tier";
    case "zenith_spotlight":
      return "Modelo 03 • Luz Volumétrica Cenital Pro (Apple)";
    case "obsidian_glass":
      return "Modelo 04 • Cristal Ahumado Refractivo (Raycast)";
    case "titanium_chamfer":
      return "Modelo 05 • Titanio Aeroespacial & Bisel 45°";
    case "satin_elevation":
      return "Modelo 06 • Resplandor Satinado & Elevación";
    default:
      return "Modelo";
  }
}

function getModelSurfaceSpec(model: PricingModel): string {
  switch (model) {
    case "linear_platinum":
      return "Sólido #0E0F14";
    case "ambient_occlusion":
      return "Gradiente 180° #151722 -> #07080B";
    case "zenith_spotlight":
      return "Radial Elíptico de Estudio Softbox";
    case "obsidian_glass":
      return "Cristal Ahumado Translúcido 32px";
    case "titanium_chamfer":
      return "Gradiente Diagonal 135° Titanio";
    case "satin_elevation":
      return "Satinado #141620 -> #060709";
    default:
      return "";
  }
}

function getModelShadowSpec(model: PricingModel): string {
  switch (model) {
    case "linear_platinum":
      return "1 Capa Difusa 24px";
    case "ambient_occlusion":
      return "4 Estratos Físicos (1px/8px/28px/60px)";
    case "zenith_spotlight":
      return "Penumbra Atmosférica 120px + Halo";
    case "obsidian_glass":
      return "Refracción 64px + Inset -1px";
    case "titanium_chamfer":
      return "Contacto Mecánico 36px/80px";
    case "satin_elevation":
      return "Elevación Reactiva (36px -> 80px)";
    default:
      return "";
  }
}

function getModelBevelSpec(model: PricingModel): string {
  switch (model) {
    case "linear_platinum":
      return "Anillo Blanco Simétrico 30%";
    case "ambient_occlusion":
      return "Bisel Cenital 40% + Specular 1px";
    case "zenith_spotlight":
      return "Doble Hairline Transparente 60%";
    case "obsidian_glass":
      return "Doble Inset Óptico 1.5px (Refracción)";
    case "titanium_chamfer":
      return "Bisel Asimétrico 45° Metálico";
    case "satin_elevation":
      return "Hairline Interactivo con Hover Sheen";
    default:
      return "";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MODELO 01: LINEAR PLATINUM SOVEREIGN (100% INTACTO - BASE APROBADA)
// ─────────────────────────────────────────────────────────────────────────────
function LinearPlatinumGrid({
  plans,
  isYearly,
  onSelect,
}: {
  plans: PlanData[];
  isYearly: boolean;
  onSelect: (p: PlanData) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      {plans.map((p) => {
        const isHighlight = p.highlight;
        const displayPrice = isYearly ? p.yearlyPrice : p.monthlyPrice;

        return (
          <div
            key={p.id}
            className={`relative flex flex-col rounded-3xl p-6 lg:p-7 transition-all duration-200 ${
              isHighlight
                ? "bg-[#0E0F14] border border-white/30 ring-1 ring-white/20 shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(255,255,255,0.03)]"
                : "bg-[#0B0C10] border border-white/[0.07] hover:border-white/15"
            }`}
          >
            {/* Badge de recomendación Pro */}
            {isHighlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-white text-black text-[9px] font-mono uppercase tracking-[0.2em] font-extrabold flex items-center gap-1 shadow-md">
                <Sparkle size={10} weight="fill" />
                <span>Recomendado</span>
              </div>
            )}

            {/* Cabecera del Plan */}
            <div className="space-y-1.5 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 font-semibold">
                  {p.badge}
                </span>
                {isYearly && p.savingsYearly > 0 && (
                  <span className="text-[10px] font-mono text-white/90 bg-white/[0.08] px-2 py-0.5 rounded-full font-medium">
                    Ahorras ${p.savingsYearly}/año
                  </span>
                )}
              </div>

              <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                {p.name}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed min-h-[36px]">
                {p.tagline}
              </p>
            </div>

            {/* Precio */}
            <div className="py-4 border-b border-white/[0.06]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight font-mono text-white">
                  ${displayPrice.toFixed(0)}
                </span>
                <span className="text-xs text-white/40 font-mono">
                  {p.monthlyPrice === 0 ? "para siempre" : "/ mes"}
                </span>
              </div>
              {isYearly && p.yearlyTotal > 0 ? (
                <span className="text-[11px] font-mono text-white/40 block mt-1">
                  Facturado anualmente (${p.yearlyTotal}/año)
                </span>
              ) : (
                <span className="text-[11px] font-mono text-white/40 block mt-1">
                  {p.monthlyPrice === 0 ? "Sin tarjeta requerida" : "Facturación mensual recurrente"}
                </span>
              )}
            </div>

            {/* Métricas Compactas de Infraestructura */}
            <div className="grid grid-cols-3 gap-2 py-4 border-b border-white/[0.06] text-center">
              <div className="space-y-0.5">
                <div className="text-sm font-mono font-bold text-white">
                  {p.metrics.aiRequests}
                </div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">
                  Sol. IA
                </div>
              </div>
              <div className="space-y-0.5 border-x border-white/[0.06]">
                <div className="text-sm font-mono font-bold text-white">
                  {p.metrics.members}
                </div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">
                  Asientos
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-mono font-bold text-white">
                  {p.metrics.storage}
                </div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">
                  Storage
                </div>
              </div>
            </div>

            {/* Lista de Features */}
            <div className="flex-1 py-4 space-y-2.5">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 font-semibold mb-2">
                Capacidades incluidas
              </div>
              {p.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                  <Check
                    size={13}
                    weight="bold"
                    className="shrink-0 mt-0.5 text-white/90"
                  />
                  <span className="leading-snug">{f}</span>
                </div>
              ))}
            </div>

            {/* Botón de Acción Principal */}
            <div className="pt-3 mt-auto">
              <button
                type="button"
                onClick={() => onSelect(p)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
                  isHighlight
                    ? "bg-white text-black hover:bg-neutral-200 shadow-md"
                    : p.monthlyPrice === 0
                      ? "bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/[0.08]"
                      : "bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15"
                }`}
              >
                <span>{p.monthlyPrice === 0 ? "Comenzar Gratis" : `Elegir ${p.name}`}</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODELO 02: OCLUSIÓN AMBIENTAL MULTICAPA 4-TIER (LINEAR 2026 LIGHTING ENGINE)
// ─────────────────────────────────────────────────────────────────────────────
function AmbientOcclusionGrid({
  plans,
  isYearly,
  onSelect,
}: {
  plans: PlanData[];
  isYearly: boolean;
  onSelect: (p: PlanData) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      {plans.map((p) => {
        const isHighlight = p.highlight;
        const displayPrice = isYearly ? p.yearlyPrice : p.monthlyPrice;

        return (
          <div
            key={p.id}
            className={`relative flex flex-col rounded-3xl p-6 lg:p-7 transition-all duration-300 ${
              isHighlight
                ? "bg-gradient-to-b from-[#151722] via-[#0D0E15] to-[#07080B] border-t border-t-white/40 border-x border-x-white/10 border-b border-b-white/[0.03] shadow-[0_1px_2px_rgba(0,0,0,0.95),0_8px_20px_-4px_rgba(0,0,0,0.8),0_28px_56px_-12px_rgba(0,0,0,0.95),0_60px_100px_-20px_rgba(0,0,0,0.98),inset_0_1px_0_rgba(255,255,255,0.22)] ring-1 ring-white/10"
                : "bg-gradient-to-b from-[#0E0F15] via-[#090A0E] to-[#050608] border-t border-t-white/15 border-x border-x-white/[0.06] border-b border-b-white/[0.02] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.7)] hover:border-t-white/25"
            }`}
          >
            {/* Specular Hairline Top (1px incidente reflectivo) */}
            {isHighlight && (
              <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
            )}

            {/* Badge de recomendación Pro */}
            {isHighlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-white text-black text-[9px] font-mono uppercase tracking-[0.2em] font-extrabold flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                <Sparkle size={10} weight="fill" />
                <span>Recomendado</span>
              </div>
            )}

            {/* Cabecera del Plan */}
            <div className="space-y-1.5 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 font-semibold">
                  {p.badge}
                </span>
                {isYearly && p.savingsYearly > 0 && (
                  <span className="text-[10px] font-mono text-white/90 bg-white/[0.08] px-2 py-0.5 rounded-full font-medium shadow-inner">
                    Ahorras ${p.savingsYearly}/año
                  </span>
                )}
              </div>

              <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                {p.name}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed min-h-[36px]">
                {p.tagline}
              </p>
            </div>

            {/* Precio */}
            <div className="py-4 border-b border-white/[0.06]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight font-mono text-white">
                  ${displayPrice.toFixed(0)}
                </span>
                <span className="text-xs text-white/40 font-mono">
                  {p.monthlyPrice === 0 ? "para siempre" : "/ mes"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-white/40 block mt-1">
                {isYearly && p.yearlyTotal > 0 ? `Facturado anualmente ($${p.yearlyTotal}/año)` : "Facturación mensual"}
              </span>
            </div>

            {/* Métricas Compactas de Infraestructura */}
            <div className="grid grid-cols-3 gap-2 py-4 border-b border-white/[0.06] text-center">
              <div className="space-y-0.5">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.aiRequests}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">Sol. IA</div>
              </div>
              <div className="space-y-0.5 border-x border-white/[0.06]">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.members}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">Asientos</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.storage}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">Storage</div>
              </div>
            </div>

            {/* Lista de Features */}
            <div className="flex-1 py-4 space-y-2.5">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 font-semibold mb-2">
                Capacidades incluidas
              </div>
              {p.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                  <Check size={13} weight="bold" className="shrink-0 mt-0.5 text-white/90" />
                  <span className="leading-snug">{f}</span>
                </div>
              ))}
            </div>

            {/* Botón con doble bisel y sombra de contacto */}
            <div className="pt-3 mt-auto">
              <button
                type="button"
                onClick={() => onSelect(p)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
                  isHighlight
                    ? "bg-gradient-to-b from-white via-[#F5F5F7] to-[#E3E3E8] text-black hover:to-[#D5D5DC] shadow-[0_2px_4px_rgba(0,0,0,0.5),0_8px_24px_-4px_rgba(255,255,255,0.25),inset_0_1px_0_rgba(255,255,255,1)]"
                    : "bg-white/[0.05] hover:bg-white/[0.09] text-white border-t border-t-white/15 border-x border-x-white/[0.06] border-b border-b-white/[0.02] shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                }`}
              >
                <span>{p.monthlyPrice === 0 ? "Comenzar Gratis" : `Elegir ${p.name}`}</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODELO 03: LUZ VOLUMÉTRICA CENITAL PRO (APPLE PRO SPATIAL SOFTBOX SPOTLIGHT)
// ─────────────────────────────────────────────────────────────────────────────
function ZenithSpotlightGrid({
  plans,
  isYearly,
  onSelect,
}: {
  plans: PlanData[];
  isYearly: boolean;
  onSelect: (p: PlanData) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      {plans.map((p) => {
        const isHighlight = p.highlight;
        const displayPrice = isYearly ? p.yearlyPrice : p.monthlyPrice;

        return (
          <div
            key={p.id}
            className={`relative flex flex-col rounded-3xl p-6 lg:p-7 transition-all duration-300 overflow-hidden ${
              isHighlight
                ? "bg-[radial-gradient(ellipse_120%_80%_at_50%_-15%,rgba(255,255,255,0.09)_0%,rgba(14,16,24,0.98)_45%,rgba(7,8,12,1)_100%)] border border-white/25 shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_20px_50px_-10px_rgba(0,0,0,0.85),0_50px_120px_-20px_rgba(0,0,0,0.95),0_0_80px_-20px_rgba(255,255,255,0.06)]"
                : "bg-[#08090D] border border-white/[0.07] hover:border-white/15 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.7)]"
            }`}
          >
            {/* Halo Suave Cenital (Aura Softbox 120px) */}
            {isHighlight && (
              <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-96 h-40 bg-white/[0.06] rounded-full blur-3xl pointer-events-none" />
            )}

            {/* Doble Hairline Cenital de Cristal */}
            {isHighlight && (
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            )}

            {/* Badge de recomendación Pro */}
            {isHighlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-white text-black text-[9px] font-mono uppercase tracking-[0.2em] font-extrabold flex items-center gap-1 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                <Sparkle size={10} weight="fill" />
                <span>Recomendado</span>
              </div>
            )}

            {/* Cabecera del Plan */}
            <div className="space-y-1.5 pb-4 border-b border-white/[0.06] relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 font-semibold">
                  {p.badge}
                </span>
                {isYearly && p.savingsYearly > 0 && (
                  <span className="text-[10px] font-mono text-white/90 bg-white/[0.08] px-2 py-0.5 rounded-full font-medium">
                    Ahorras ${p.savingsYearly}/año
                  </span>
                )}
              </div>

              <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                {p.name}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed min-h-[36px]">
                {p.tagline}
              </p>
            </div>

            {/* Precio */}
            <div className="py-4 border-b border-white/[0.06] relative z-10">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight font-mono text-white">
                  ${displayPrice.toFixed(0)}
                </span>
                <span className="text-xs text-white/40 font-mono">
                  {p.monthlyPrice === 0 ? "para siempre" : "/ mes"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-white/40 block mt-1">
                {isYearly && p.yearlyTotal > 0 ? `Facturado anualmente ($${p.yearlyTotal}/año)` : "Facturación mensual"}
              </span>
            </div>

            {/* Métricas Compactas de Infraestructura */}
            <div className="grid grid-cols-3 gap-2 py-4 border-b border-white/[0.06] text-center relative z-10">
              <div className="space-y-0.5">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.aiRequests}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">Sol. IA</div>
              </div>
              <div className="space-y-0.5 border-x border-white/[0.06]">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.members}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">Asientos</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.storage}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">Storage</div>
              </div>
            </div>

            {/* Lista de Features */}
            <div className="flex-1 py-4 space-y-2.5 relative z-10">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 font-semibold mb-2">
                Capacidades incluidas
              </div>
              {p.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                  <Check size={13} weight="bold" className="shrink-0 mt-0.5 text-white/90" />
                  <span className="leading-snug">{f}</span>
                </div>
              ))}
            </div>

            {/* Botón con luz cenital pura */}
            <div className="pt-3 mt-auto relative z-10">
              <button
                type="button"
                onClick={() => onSelect(p)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
                  isHighlight
                    ? "bg-white text-black hover:bg-neutral-100 shadow-[0_0_28px_rgba(255,255,255,0.35),0_4px_16px_rgba(0,0,0,0.6)]"
                    : "bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10"
                }`}
              >
                <span>{p.monthlyPrice === 0 ? "Comenzar Gratis" : `Elegir ${p.name}`}</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODELO 04: CRISTAL AHUMADO REFRACTIVO (RAYCAST OBSIDIAN GLASSMORPHISM)
// ─────────────────────────────────────────────────────────────────────────────
function ObsidianGlassGrid({
  plans,
  isYearly,
  onSelect,
}: {
  plans: PlanData[];
  isYearly: boolean;
  onSelect: (p: PlanData) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      {plans.map((p) => {
        const isHighlight = p.highlight;
        const displayPrice = isYearly ? p.yearlyPrice : p.monthlyPrice;

        return (
          <div
            key={p.id}
            className={`relative flex flex-col rounded-3xl p-6 lg:p-7 backdrop-blur-3xl transition-all duration-300 ${
              isHighlight
                ? "bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-black/80 border border-white/25 shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.35),inset_0_-1px_1px_0_rgba(0,0,0,0.8),0_24px_64px_-16px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)]"
                : "bg-gradient-to-b from-white/[0.03] to-black/60 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_16px_40px_rgba(0,0,0,0.7)] hover:border-white/18"
            }`}
          >
            {/* Badge de recomendación Pro */}
            {isHighlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-white text-black text-[9px] font-mono uppercase tracking-[0.2em] font-extrabold flex items-center gap-1 shadow-md">
                <Sparkle size={10} weight="fill" />
                <span>Recomendado</span>
              </div>
            )}

            {/* Cabecera del Plan */}
            <div className="space-y-1.5 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 font-semibold">
                  {p.badge}
                </span>
                {isYearly && p.savingsYearly > 0 && (
                  <span className="text-[10px] font-mono text-white/90 bg-white/[0.08] px-2 py-0.5 rounded-full font-medium border border-white/10">
                    Ahorras ${p.savingsYearly}/año
                  </span>
                )}
              </div>

              <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                {p.name}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed min-h-[36px]">
                {p.tagline}
              </p>
            </div>

            {/* Precio */}
            <div className="py-4 border-b border-white/[0.06]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight font-mono text-white">
                  ${displayPrice.toFixed(0)}
                </span>
                <span className="text-xs text-white/40 font-mono">
                  {p.monthlyPrice === 0 ? "para siempre" : "/ mes"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-white/40 block mt-1">
                {isYearly && p.yearlyTotal > 0 ? `Facturado anualmente ($${p.yearlyTotal}/año)` : "Facturación mensual"}
              </span>
            </div>

            {/* Métricas Compactas de Infraestructura */}
            <div className="grid grid-cols-3 gap-2 py-4 border-b border-white/[0.06] text-center">
              <div className="space-y-0.5">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.aiRequests}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">SOL. IA</div>
              </div>
              <div className="space-y-0.5 border-x border-white/[0.06]">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.members}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">ASIENTOS</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.storage}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">STORAGE</div>
              </div>
            </div>

            {/* Lista de Features */}
            <div className="flex-1 py-2 space-y-2.5">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 font-semibold mb-2">
                Capacidades incluidas
              </div>
              {p.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                  <Check size={13} weight="bold" className="shrink-0 mt-0.5 text-white/90" />
                  <span className="leading-snug">{f}</span>
                </div>
              ))}
            </div>

            {/* Botón */}
            <div className="pt-3 mt-auto">
              <button
                type="button"
                onClick={() => onSelect(p)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
                  isHighlight
                    ? "bg-white text-black hover:bg-neutral-100 shadow-[0_4px_24px_rgba(255,255,255,0.25),inset_0_1px_0_rgba(255,255,255,0.9)]"
                    : "bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10"
                }`}
              >
                <span>{p.monthlyPrice === 0 ? "Comenzar Gratis" : `Elegir ${p.name}`}</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODELO 05: TITANIO AEROESPACIAL & BISEL ANGULADO (SWISS PRECISION CHAMFER)
// ─────────────────────────────────────────────────────────────────────────────
function TitaniumChamferGrid({
  plans,
  isYearly,
  onSelect,
}: {
  plans: PlanData[];
  isYearly: boolean;
  onSelect: (p: PlanData) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      {plans.map((p) => {
        const isHighlight = p.highlight;
        const displayPrice = isYearly ? p.yearlyPrice : p.monthlyPrice;

        return (
          <div
            key={p.id}
            className={`relative flex flex-col rounded-3xl p-6 lg:p-7 transition-all duration-300 ${
              isHighlight
                ? "bg-gradient-to-br from-[#181A26] via-[#0F1017] to-[#06070A] border-t border-t-white/45 border-l border-l-white/20 border-r border-r-white/10 border-b border-b-white/[0.03] shadow-[0_1px_1px_rgba(0,0,0,0.9),0_16px_36px_-6px_rgba(0,0,0,0.85),0_40px_80px_-16px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.35)]"
                : "bg-gradient-to-br from-[#101118] via-[#0A0B0F] to-[#040507] border border-white/[0.08] shadow-[0_12px_28px_rgba(0,0,0,0.75)] hover:border-white/18"
            }`}
          >
            {/* Badge de recomendación Pro */}
            {isHighlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-white text-black text-[9px] font-mono uppercase tracking-[0.2em] font-extrabold flex items-center gap-1 shadow-md">
                <Sparkle size={10} weight="fill" />
                <span>Recomendado</span>
              </div>
            )}

            {/* Cabecera del Plan */}
            <div className="space-y-1.5 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 font-semibold">
                  {p.badge}
                </span>
                {isYearly && p.savingsYearly > 0 && (
                  <span className="text-[10px] font-mono text-white/90 bg-white/[0.08] px-2 py-0.5 rounded-full font-medium border border-white/10">
                    Ahorras ${p.savingsYearly}/año
                  </span>
                )}
              </div>

              <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                {p.name}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed min-h-[36px]">
                {p.tagline}
              </p>
            </div>

            {/* Precio */}
            <div className="py-4 border-b border-white/[0.06]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight font-mono text-white">
                  ${displayPrice.toFixed(0)}
                </span>
                <span className="text-xs text-white/40 font-mono">
                  {p.monthlyPrice === 0 ? "para siempre" : "/ mes"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-white/40 block mt-1">
                {isYearly && p.yearlyTotal > 0 ? `Facturado anualmente ($${p.yearlyTotal}/año)` : "Facturación mensual"}
              </span>
            </div>

            {/* Métricas Compactas de Infraestructura */}
            <div className="grid grid-cols-3 gap-2 py-4 border-b border-white/[0.06] text-center">
              <div className="space-y-0.5">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.aiRequests}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">Sol. IA</div>
              </div>
              <div className="space-y-0.5 border-x border-white/[0.06]">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.members}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">Asientos</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.storage}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">Storage</div>
              </div>
            </div>

            {/* Lista de Features */}
            <div className="flex-1 py-4 space-y-2.5">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 font-semibold mb-2">
                Capacidades incluidas
              </div>
              {p.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                  <Check size={13} weight="bold" className="shrink-0 mt-0.5 text-white/90" />
                  <span className="leading-snug">{f}</span>
                </div>
              ))}
            </div>

            {/* Botón de titanio pulido */}
            <div className="pt-3 mt-auto">
              <button
                type="button"
                onClick={() => onSelect(p)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
                  isHighlight
                    ? "bg-gradient-to-b from-white via-[#EFEFF4] to-[#D5D5DE] text-black shadow-[0_2px_0_0_rgba(255,255,255,0.6),0_6px_20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,1)]"
                    : "bg-[#14151C] hover:bg-[#1A1C24] text-white border border-white/10 shadow-[0_2px_0_0_rgba(0,0,0,0.6)]"
                }`}
              >
                <span>{p.monthlyPrice === 0 ? "Comenzar Gratis" : `Elegir ${p.name}`}</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODELO 06: RESPLANDOR PERIMETRAL & ELEVACIÓN DINÁMICA (STRIPE / VERCEL ELEVATION)
// ─────────────────────────────────────────────────────────────────────────────
function SatinElevationGrid({
  plans,
  isYearly,
  onSelect,
}: {
  plans: PlanData[];
  isYearly: boolean;
  onSelect: (p: PlanData) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      {plans.map((p) => {
        const isHighlight = p.highlight;
        const displayPrice = isYearly ? p.yearlyPrice : p.monthlyPrice;

        return (
          <div
            key={p.id}
            className={`group relative flex flex-col rounded-3xl p-6 lg:p-7 transition-all duration-300 ease-out ${
              isHighlight
                ? "bg-gradient-to-b from-[#141620] via-[#0B0C11] to-[#060709] border border-white/30 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.14)] hover:-translate-y-2 hover:shadow-[0_32px_80px_-16px_rgba(0,0,0,0.98),0_0_48px_-8px_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.35)]"
                : "bg-[#090A0E] border border-white/[0.07] hover:border-white/20 hover:-translate-y-1 hover:shadow-xl"
            }`}
          >
            {/* Specular hairline top interactivo */}
            {isHighlight && (
              <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:via-white transition-all duration-300 pointer-events-none" />
            )}

            {/* Badge de recomendación Pro */}
            {isHighlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-white text-black text-[9px] font-mono uppercase tracking-[0.2em] font-extrabold flex items-center gap-1 shadow-md">
                <Sparkle size={10} weight="fill" />
                <span>Recomendado</span>
              </div>
            )}

            {/* Cabecera del Plan */}
            <div className="space-y-1.5 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 font-semibold">
                  {p.badge}
                </span>
                {isYearly && p.savingsYearly > 0 && (
                  <span className="text-[10px] font-mono text-white/90 bg-white/[0.08] px-2 py-0.5 rounded-full font-medium">
                    Ahorras ${p.savingsYearly}/año
                  </span>
                )}
              </div>

              <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                {p.name}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed min-h-[36px]">
                {p.tagline}
              </p>
            </div>

            {/* Precio */}
            <div className="py-4 border-b border-white/[0.06]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight font-mono text-white">
                  ${displayPrice.toFixed(0)}
                </span>
                <span className="text-xs text-white/40 font-mono">
                  {p.monthlyPrice === 0 ? "para siempre" : "/ mes"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-white/40 block mt-1">
                {isYearly && p.yearlyTotal > 0 ? `Facturado anualmente ($${p.yearlyTotal}/año)` : "Facturación mensual"}
              </span>
            </div>

            {/* Métricas Compactas de Infraestructura */}
            <div className="grid grid-cols-3 gap-2 py-4 border-b border-white/[0.06] text-center">
              <div className="space-y-0.5">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.aiRequests}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">Sol. IA</div>
              </div>
              <div className="space-y-0.5 border-x border-white/[0.06]">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.members}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">Asientos</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-mono font-bold text-white">{p.metrics.storage}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">Storage</div>
              </div>
            </div>

            {/* Lista de Features */}
            <div className="flex-1 py-4 space-y-2.5">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 font-semibold mb-2">
                Capacidades incluidas
              </div>
              {p.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                  <Check size={13} weight="bold" className="shrink-0 mt-0.5 text-white/90" />
                  <span className="leading-snug">{f}</span>
                </div>
              ))}
            </div>

            {/* Botón con micro-sheen satinado */}
            <div className="pt-3 mt-auto">
              <button
                type="button"
                onClick={() => onSelect(p)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
                  isHighlight
                    ? "bg-gradient-to-r from-neutral-100 via-white to-neutral-200 hover:from-white hover:to-white text-black hover:scale-[1.01] shadow-[0_4px_24px_rgba(255,255,255,0.25)]"
                    : "bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10"
                }`}
              >
                <span>{p.monthlyPrice === 0 ? "Comenzar Gratis" : `Elegir ${p.name}`}</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
