"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  CreditCard,
  Check,
  LockSimple,
  ShieldCheck,
  Tag,
  CircleNotch,
  ArrowSquareOut,
  DownloadSimple,
  CheckCircle,
  ArrowRight,
  Sparkle,
  Cpu,
  Fingerprint,
  Receipt,
  SquaresFour,
  Code,
} from "@phosphor-icons/react";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// MODELOS EN EL LAB (ESTÁNDAR LINGUA: 6 PARADIGMAS INNOVADORES & ANTI-AI-SLOP)
// ─────────────────────────────────────────────────────────────────────────────
export type ShowcaseModel =
  | "lingua_cobalt"
  | "lingua_bento"
  | "lingua_cinematic"
  | "lingua_hardware"
  | "lingua_blueprint"
  | "lingua_editorial";

interface RealProduct {
  id: string;
  title: string;
  seller: string;
  category: string;
  base_price: number;
  currency: string;
  image: string;
  version: string;
}

const SAMPLE_PRODUCT: RealProduct = {
  id: "prod-cloud-mesh",
  title: "Cloud Mesh Microservices Hub",
  seller: "Esteban Perez H.",
  category: "Arquitectura & Backend",
  base_price: 120,
  currency: "USD",
  version: "v2.4.1 Enterprise",
  image:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
};

export function PurchaseFlowStudioShowcase() {
  const [selectedModel, setSelectedModel] = useState<ShowcaseModel>("lingua_cobalt");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [hasCoupon, setHasCoupon] = useState(true);
  const [couponCode, setCouponCode] = useState("CELAEST-VIP-20");
  const [inputCoupon, setInputCoupon] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(45);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Precios
  const basePrice = SAMPLE_PRODUCT.base_price;
  const discountAmount = hasCoupon ? basePrice * 0.2 : 0;
  const finalPrice = basePrice - discountAmount;

  const formattedOriginalPrice = `$${basePrice.toFixed(2)} USD`;
  const formattedFinalPrice = `$${finalPrice.toFixed(2)} USD`;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponCode(inputCoupon.trim().toUpperCase());
    setHasCoupon(true);
    setInputCoupon("");
    setShowCouponInput(false);
    toast.success("Cupón aplicado correctamente (-20%)");
  };

  const handleRemoveCoupon = () => {
    setHasCoupon(false);
    toast.info("Cupón removido");
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setProgress(30);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setIsProcessing(false);
          setStep(3);
          toast.success("¡Pago completado y suscripción activada!");
          return 100;
        }
        return prev + 30;
      });
    }, 350);
  };

  const isCobalt = selectedModel === "lingua_cobalt";
  const isBento = selectedModel === "lingua_bento";
  const isCinematic = selectedModel === "lingua_cinematic";
  const isHardware = selectedModel === "lingua_hardware";
  const isBlueprint = selectedModel === "lingua_blueprint";
  const isEditorial = selectedModel === "lingua_editorial";
  const isStealth = isBlueprint;

  return (
    <div className="w-full flex flex-col gap-6 text-white font-sans">
      {/* ── PANEL DE CONTROL DEL LAB ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[#08090D] border border-white/[0.06]">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#3B66F5] mb-1.5 font-semibold">
            <span>CELAEST Lingua Standard</span>
            <span>•</span>
            <span className="text-white">Proporción Áurea & Calma Cognitiva</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Checkout Enterprise: Redirección Ágil & Éxito Proporcionado
          </h2>
          <p className="text-xs text-white/50 mt-0.5 max-w-2xl leading-relaxed">
            Paso 2 simplificado con resumen visual del producto y redirección a Stripe sin bloques vacíos gigantes. Paso 3 rebalanceado con tarjeta ancla del activo y proporciones equilibradas (cero botones gigantes fuera de escala).
          </p>
        </div>

        {/* Controles Interactivos */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Pasos */}
          <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/[0.06] text-xs">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setIsProcessing(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                step === 1 ? "bg-white text-black font-semibold" : "text-white/50 hover:text-white"
              }`}
            >
              1. Confirmar
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(2);
                setIsProcessing(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                step === 2 && !isProcessing
                  ? "bg-white text-black font-semibold"
                  : "text-white/50 hover:text-white"
              }`}
            >
              2. Stripe
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(2);
                setIsProcessing(true);
                setProgress(65);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                step === 2 && isProcessing
                  ? "bg-white text-black font-semibold"
                  : "text-white/50 hover:text-white"
              }`}
            >
              2. Procesando
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(3);
                setIsProcessing(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                step === 3 ? "bg-white text-black font-semibold" : "text-white/50 hover:text-white"
              }`}
            >
              3. Activación
            </button>
          </div>

          {/* Toggle de Cupón */}
          <button
            type="button"
            onClick={() => setHasCoupon(!hasCoupon)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
              hasCoupon
                ? "bg-[#3B66F5]/10 border-[#3B66F5]/30 text-[#3B66F5]"
                : "bg-white/[0.04] border-white/[0.06] text-white/50 hover:text-white"
            }`}
          >
            <Tag size={13} weight="bold" />
            <span>{hasCoupon ? "Cupón Activo (-20%)" : "Sin Cupón"}</span>
          </button>

          {/* Abrir Modal */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Abrir Modal
          </button>
        </div>
      </div>

      {/* ── SELECTOR DE MODELOS DE CHECKOUT LUXURY (6 PARADIGMAS INNOVADORES) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Modelo 01: Tipografía Pura (Base Reference - INTACTO) */}
        <div
          onClick={() => {
            setSelectedModel("lingua_cobalt");
            setIsModalOpen(true);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedModel === "lingua_cobalt" && isModalOpen
              ? "bg-[#0D0D11] border-[#3B66F5]/60 ring-2 ring-[#3B66F5]/20 shadow-[0_0_24px_rgba(59,102,245,0.2)]"
              : "bg-[#08090D] border-white/[0.06] hover:border-white/20"
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#3B66F5] font-semibold flex items-center gap-1">
                <Sparkle size={11} weight="fill" />
                Modelo 01 • Base
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#3B66F5]/20 text-[#3B66F5]">
                Intacto
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Tipografía Minimalista</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              La referencia base solicitada intacta: cero imágenes, tipografía mono limpia y foco 100% transaccional.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-xs text-[#3B66F5] font-semibold">
            <span>Ver modelo base</span>
            <ArrowRight size={12} />
          </div>
        </div>

        {/* Modelo 02: Bento Studio (Grid Asimétrico Multidimensional) */}
        <div
          onClick={() => {
            setSelectedModel("lingua_bento");
            setIsModalOpen(true);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedModel === "lingua_bento" && isModalOpen
              ? "bg-[#0D0D11] border-blue-400/60 ring-2 ring-blue-400/20 shadow-[0_0_24px_rgba(96,165,250,0.18)]"
              : "bg-[#08090D] border-white/[0.06] hover:border-white/20"
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold flex items-center gap-1">
                <SquaresFour size={11} weight="fill" />
                Modelo 02 • Bento
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-500/15 text-blue-400">
                Modular
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Bento Studio Grid</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Composición asimétrica 7/5: tarjeta visual viva con telemetry + módulos laterales de garantía SLA y tarifa neta.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-xs text-blue-400 font-semibold">
            <span>Ver bento grid</span>
            <ArrowRight size={12} />
          </div>
        </div>

        {/* Modelo 03: Cinematic Lens (Atmósfera Espacial Apple) */}
        <div
          onClick={() => {
            setSelectedModel("lingua_cinematic");
            setIsModalOpen(true);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedModel === "lingua_cinematic" && isModalOpen
              ? "bg-[#0D0D11] border-white/50 ring-2 ring-white/15 shadow-[0_0_24px_rgba(255,255,255,0.1)]"
              : "bg-[#08090D] border-white/[0.06] hover:border-white/20"
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 font-semibold flex items-center gap-1">
                <Fingerprint size={11} weight="fill" />
                Modelo 03 • Cinematic
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-white">
                Espacial
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Cinematic Ambient Lens</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Frame panorámico con desvanecimiento obsidiana, metadatos flotantes en cristal y liquidación integrada.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-xs text-white/80 font-semibold">
            <span>Ver cinematic lens</span>
            <ArrowRight size={12} />
          </div>
        </div>

        {/* Modelo 04: Cyber-Deck Cartridge (Teenage Engineering Hardware) */}
        <div
          onClick={() => {
            setSelectedModel("lingua_hardware");
            setIsModalOpen(true);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedModel === "lingua_hardware" && isModalOpen
              ? "bg-[#090A0E] border-blue-500/60 ring-2 ring-blue-500/20 shadow-[0_0_24px_rgba(59,102,245,0.2)]"
              : "bg-[#08090D] border-white/[0.06] hover:border-white/20"
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold flex items-center gap-1">
                <Cpu size={11} weight="fill" />
                Modelo 04 • Hardware
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-500/15 text-blue-400">
                Sintetizador
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Cyber-Deck Cartridge</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Inspirado en Teenage Engineering: chasis con tornillos +, ventana OLED, ecualizador SVG en vivo y luces LED.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-xs text-blue-400 font-semibold">
            <span>Ver cyber-deck</span>
            <ArrowRight size={12} />
          </div>
        </div>

        {/* Modelo 05: Terminal Blueprint (Raycast Pro / Vercel Spec) */}
        <div
          onClick={() => {
            setSelectedModel("lingua_blueprint");
            setIsModalOpen(true);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedModel === "lingua_blueprint" && isModalOpen
              ? "bg-[#07080B] border-emerald-400/50 ring-2 ring-emerald-400/15 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
              : "bg-[#08090D] border-white/[0.06] hover:border-white/20"
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold flex items-center gap-1">
                <Code size={11} weight="bold" />
                Modelo 05 • Terminal
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/15 text-emerald-400">
                Ingeniería
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Terminal Blueprint</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Manifiesto de ingeniería con marcadores CAD crosshair +, terminal macOS, matriz de infraestructura y recibo neto.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Ver blueprint</span>
            <ArrowRight size={12} />
          </div>
        </div>

        {/* Modelo 06: Swiss Editorial (Leica Proof & Proporción Áurea) */}
        <div
          onClick={() => {
            setSelectedModel("lingua_editorial");
            setIsModalOpen(true);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedModel === "lingua_editorial" && isModalOpen
              ? "bg-[#0A0B0E] border-white/50 ring-2 ring-white/15 shadow-[0_0_24px_rgba(255,255,255,0.1)]"
              : "bg-[#08090D] border-white/[0.06] hover:border-white/20"
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 font-semibold flex items-center gap-1">
                <Receipt size={11} weight="fill" />
                Modelo 06 • Editorial
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-white">
                Suizo
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Swiss Editorial Proof</h3>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Máximo rigor editorial: hoja de contacto fotográfica con marcas de recorte ⌐ ⌙, libro mayor con dot-leaders y total suizo.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-xs text-white/80 font-semibold">
            <span>Ver swiss editorial</span>
            <ArrowRight size={12} />
          </div>
        </div>
      </div>

      {/* ── MODAL ELEVADO RENDERIZADO MEDIANTE PORTAL ── */}
      {mounted &&
        isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            {/* Contenedor del Modal: Proporción Áurea Lingua (520px) */}
            <div
              style={{ width: "100%", maxWidth: "520px" }}
              className="relative flex flex-col max-h-[92dvh] rounded-3xl bg-[#09090B] border border-white/[0.08] shadow-[0_32px_96px_-12px_rgba(0,0,0,0.95)] overflow-hidden"
            >
              {/* Tokyo Corner Accents (Sobrios, cero bordes de colores vibrantes) */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/10 rounded-tl-sm pointer-events-none z-30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/10 rounded-tr-sm pointer-events-none z-30" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/10 rounded-bl-sm pointer-events-none z-30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/10 rounded-br-sm pointer-events-none z-30" />

              {/* Botón de Cierre */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* HEADER DE PROGRESO (100% CENTRADO, MÁS AMPLIO, CERO NEÓN)     */}
              {/* ───────────────────────────────────────────────────────────── */}
              {isStealth ? (
                /* Modelo 03: Segmented Precision Line Header (Máxima Calidad Suizo) */
                <div className="shrink-0 px-8 sm:px-12 pt-7 pb-4.5 border-b border-white/[0.06] bg-[#07080B]">
                  <div className="grid grid-cols-3 gap-3 w-full max-w-[380px] mx-auto">
                    {[
                      { number: 1, label: "01 • Confirmar" },
                      { number: 2, label: "02 • Pasarela" },
                      { number: 3, label: "03 • Activación" },
                    ].map((s) => {
                      const isActive = step === s.number;
                      const isCompleted = step > s.number;
                      return (
                        <button
                          key={s.number}
                          type="button"
                          onClick={() => {
                            setStep(s.number as 1 | 2 | 3);
                            setIsProcessing(false);
                          }}
                          className="flex flex-col gap-2 text-left cursor-pointer group"
                        >
                          <div
                            className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                              isActive
                                ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                                : isCompleted
                                  ? "bg-white/40"
                                  : "bg-white/[0.08] group-hover:bg-white/20"
                            }`}
                          />
                          <span
                            className={`text-[11px] font-mono tracking-wider uppercase transition-colors text-center ${
                              isActive
                                ? "text-white font-semibold"
                                : isCompleted
                                  ? "text-white/60"
                                  : "text-white/30"
                            }`}
                          >
                            {s.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Modelos 01 (Cobalto) y 02 (Platino): Círculos Proporcionados y 100% Centrados */
                <div className="shrink-0 px-8 sm:px-12 pt-7 pb-4.5 border-b border-white/[0.06] bg-[#0D0D11]">
                  <div className="flex items-start justify-between w-full max-w-[380px] mx-auto relative">
                    {/* Conector 1: Entre Paso 1 y Paso 2 (Nunca pasa por debajo de ningún círculo) */}
                    <div
                      className="absolute top-[21px] h-0.5 bg-white/[0.08] z-0 overflow-hidden rounded-full pointer-events-none"
                      style={{
                        left: "calc(46px + 24px)",
                        right: "calc(50% + 24px)",
                      }}
                    >
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: step >= 2 ? "100%" : "0%",
                          backgroundColor: isCobalt ? "#2563EB" : "#FFFFFF",
                        }}
                      />
                    </div>

                    {/* Conector 2: Entre Paso 2 y Paso 3 (Nunca pasa por debajo de ningún círculo) */}
                    <div
                      className="absolute top-[21px] h-0.5 bg-white/[0.08] z-0 overflow-hidden rounded-full pointer-events-none"
                      style={{
                        left: "calc(50% + 24px)",
                        right: "calc(46px + 24px)",
                      }}
                    >
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: step >= 3 ? "100%" : "0%",
                          backgroundColor: isCobalt ? "#2563EB" : "#FFFFFF",
                        }}
                      />
                    </div>

                    {[
                      { number: 1, title: "Confirmación", icon: <CheckCircle size={18} weight="bold" /> },
                      { number: 2, title: "Pago Seguro", icon: <CreditCard size={18} weight="bold" /> },
                      { number: 3, title: "Activación", icon: <DownloadSimple size={18} weight="bold" /> },
                    ].map((s) => {
                      const isCompleted = step > s.number;
                      const isActive = step === s.number;
                      return (
                        <div
                          key={s.number}
                          onClick={() => {
                            setStep(s.number as 1 | 2 | 3);
                            setIsProcessing(false);
                          }}
                          className="flex flex-col items-center gap-2.5 cursor-pointer relative z-10 group"
                          style={{ width: "92px" }}
                        >
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 text-xs font-semibold ${
                              isActive
                                ? isCobalt
                                  ? "bg-blue-600 text-white shadow-md shadow-blue-950/40"
                                  : "bg-white text-black shadow-md"
                                : isCompleted
                                  ? isCobalt
                                    ? "bg-[#0B132B] text-blue-400 border border-blue-500/50"
                                    : "bg-[#1A1C24] text-white border border-white/40"
                                  : "bg-[#121319] text-white/30 border border-white/[0.08] group-hover:border-white/20"
                            }`}
                          >
                            {isCompleted ? <Check size={16} weight="bold" /> : s.icon}
                          </div>

                          <span
                            className={`text-[11px] sm:text-xs transition-colors text-center truncate w-full ${
                              isActive
                                ? "text-white font-semibold"
                                : isCompleted
                                  ? "text-white/60"
                                  : "text-white/30"
                            }`}
                          >
                            {s.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* CUERPO DEL MODAL                                              */}
              {/* ───────────────────────────────────────────────────────────── */}
              <div
                style={{ width: "100%", display: "block" }}
                className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6"
              >
                {/* ── PASO 1: CONFIRMAR (OPCIONES LUXURY ANTI-PATRONES IA SEGÚN EL MODELO) ── */}
                {step === 1 && (
                  <div
                    style={{ width: "100%", display: "block" }}
                    className="space-y-4 animate-in fade-in duration-200"
                  >
                    {/* Encabezado Directo y Limpio */}
                    <div className="text-center space-y-1" style={{ width: "100%", display: "block" }}>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Confirmar Suscripción
                      </h2>
                      {isCobalt && (
                        <p className="text-xs text-white/40 font-mono">
                          {SAMPLE_PRODUCT.title} • Plan Mensual
                        </p>
                      )}
                    </div>

                    {/* ── MODELO 02: BENTO STUDIO (GRID ASIMÉTRICO MULTIDIMENSIONAL) ── */}
                    {isBento && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-12 gap-3">
                          {/* Tile 1: Hero Visual & Identity (7 cols) */}
                          <div className="col-span-7 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.08] p-3 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                            <div className="relative w-full h-24 rounded-xl overflow-hidden ring-1 ring-white/10 bg-black mb-2.5">
                              <img
                                src={SAMPLE_PRODUCT.image}
                                alt={SAMPLE_PRODUCT.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                <span className="text-[8px] font-mono uppercase tracking-wider text-white/80 font-semibold">
                                  v2.4.1 MESH
                                </span>
                              </div>
                              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[8px] font-mono text-emerald-400 border border-emerald-500/20 font-bold">
                                ONLINE
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 block">
                                {SAMPLE_PRODUCT.category}
                              </span>
                              <h3 className="text-xs font-semibold text-white tracking-tight leading-snug line-clamp-1">
                                {SAMPLE_PRODUCT.title}
                              </h3>
                              <p className="text-[10px] text-white/50 truncate">
                                Autor: {SAMPLE_PRODUCT.seller}
                              </p>
                            </div>
                          </div>

                          {/* Right Column: 2 Stacked Tiles (5 cols) */}
                          <div className="col-span-5 flex flex-col gap-3">
                            {/* Tile 2: SLA & Specs */}
                            <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-3 flex flex-col justify-between">
                              <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 block">
                                GARANTÍA B2B
                              </span>
                              <div className="space-y-1.5 py-1">
                                <div className="flex items-center gap-1.5 text-[10px] text-white/80 font-mono">
                                  <ShieldCheck size={12} className="text-blue-400 shrink-0" />
                                  <span>SLA 99.99%</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-white/60 font-mono">
                                  <LockSimple size={12} className="text-white/40 shrink-0" />
                                  <span>1 Asiento Org</span>
                                </div>
                              </div>
                              <span className="text-[8px] font-mono text-white/30 truncate block">
                                EDGE MULTI-REGION
                              </span>
                            </div>

                            {/* Tile 3: Price Box */}
                            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-3 flex flex-col justify-between">
                              <div className="flex items-center justify-between">
                                <span className="text-[8px] font-mono uppercase tracking-wider text-white/40">
                                  INVERSIÓN
                                </span>
                                {hasCoupon && (
                                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20 font-bold">
                                    -20%
                                  </span>
                                )}
                              </div>
                              <div className="mt-1">
                                <div className="flex items-baseline gap-0.5">
                                  <span className="text-lg font-bold font-mono tracking-tight text-white">
                                    ${finalPrice.toFixed(2)}
                                  </span>
                                  <span className="text-[9px] font-mono text-white/40">USD</span>
                                </div>
                                <span className="text-[9px] text-white/40 block font-mono">/ mes</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Coupon Strip for Bento */}
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.015] border border-white/[0.05] text-xs">
                          <div className="flex items-center gap-2">
                            <Tag size={13} className="text-blue-400" />
                            {hasCoupon ? (
                              <span className="text-[11px] font-mono text-white/70">
                                Cupón activo: <strong className="text-emerald-400">{couponCode}</strong> (-${discountAmount.toFixed(2)})
                              </span>
                            ) : (
                              <span className="text-[11px] text-white/40 font-mono">Sin cupón promocional</span>
                            )}
                          </div>
                          {hasCoupon ? (
                            <button
                              type="button"
                              onClick={handleRemoveCoupon}
                              className="text-[10px] font-mono text-white/30 hover:text-white cursor-pointer"
                            >
                              Remover
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setHasCoupon(true);
                                setCouponCode("CELAEST-VIP-20");
                                toast.success("Cupón VIP aplicado");
                              }}
                              className="text-[10px] font-mono text-blue-400 hover:underline cursor-pointer"
                            >
                              Aplicar VIP (-20%)
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── MODELO 03: CINEMATIC LENS (ATMÓSFERA ESPACIAL & GRADIENTE MONOLÍTICO) ── */}
                    {isCinematic && (
                      <div className="space-y-3.5">
                        {/* Frame Panorámico Cinemático */}
                        <div className="relative w-full h-32 rounded-2xl overflow-hidden ring-1 ring-white/15 bg-black shadow-2xl group">
                          <img
                            src={SAMPLE_PRODUCT.image}
                            alt={SAMPLE_PRODUCT.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Gradiente Obsidiana cinematográfico */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-transparent" />

                          {/* Floating Badges */}
                          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                            <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[9px] font-mono tracking-wider text-white/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              <span>CINEMATIC ARCHITECTURE</span>
                            </div>
                            <div className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-mono text-white/90">
                              {SAMPLE_PRODUCT.version}
                            </div>
                          </div>

                          {/* Bottom Title inside Cinematic Frame */}
                          <div className="absolute bottom-2.5 inset-x-3 flex items-end justify-between">
                            <div className="min-w-0 pr-2">
                              <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-white/40 block">
                                {SAMPLE_PRODUCT.category}
                              </span>
                              <h3 className="text-sm font-bold text-white tracking-tight drop-shadow truncate">
                                {SAMPLE_PRODUCT.title}
                              </h3>
                            </div>
                            <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.08] backdrop-blur-md border border-white/10 text-[9px] font-mono text-white/70">
                              <Fingerprint size={11} className="text-blue-400" />
                              <span>SHA-256</span>
                            </div>
                          </div>
                        </div>

                        {/* Barra de Liquidación de Cristal Líquido */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/[0.06] flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white/70 font-medium">Inversión mensual</span>
                              {hasCoupon && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                                  VIP -20%
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-white/30 block mt-0.5">
                              Facturación directa por Stripe • Cancela cuando quieras
                            </span>
                          </div>

                          <div className="text-right font-mono">
                            <div className="flex items-baseline justify-end gap-1">
                              <span className="text-2xl font-bold text-white tracking-tight">
                                ${finalPrice.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-white/40">USD</span>
                            </div>
                            {hasCoupon && (
                              <span className="text-[10px] line-through text-white/30 block">
                                {formattedOriginalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── MODELO 04: CYBER-DECK CARTRIDGE (TEENAGE ENGINEERING HARDWARE) ── */}
                    {isHardware && (
                      <div className="space-y-3.5">
                        {/* Chassis Hardware con tornillos táctiles */}
                        <div className="relative rounded-2xl bg-[#090A0E] border border-white/[0.1] p-3.5 shadow-2xl overflow-hidden">
                          {/* Tornillos de chasis metálicos */}
                          <div className="absolute top-2 left-2 text-[8px] font-mono text-white/20 select-none">+</div>
                          <div className="absolute top-2 right-2 text-[8px] font-mono text-white/20 select-none">+</div>
                          <div className="absolute bottom-2 left-2 text-[8px] font-mono text-white/20 select-none">+</div>
                          <div className="absolute bottom-2 right-2 text-[8px] font-mono text-white/20 select-none">+</div>

                          <div className="flex items-center gap-3.5 px-1 py-0.5 relative z-10">
                            {/* Cassette OLED / Sapphire Window */}
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-1 ring-white/20 bg-black shrink-0 shadow-inner">
                              <img
                                src={SAMPLE_PRODUCT.image}
                                alt={SAMPLE_PRODUCT.title}
                                className="w-full h-full object-cover"
                              />
                              {/* Micro CRT Scanlines */}
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
                              <div className="absolute bottom-1 right-1 flex items-center gap-1 px-1 py-0.2 rounded bg-black/90 border border-white/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[7px] font-mono text-emerald-300 font-bold">NODE</span>
                              </div>
                            </div>

                            {/* Telemetría y Osciloscopio Waveform */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                                  SYS // OP-MESH-01
                                </span>
                                {/* LEDs de estado táctiles */}
                                <div className="flex items-center gap-1.5 text-[8px] font-mono text-white/40">
                                  <span className="flex items-center gap-0.5">
                                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                    PWR
                                  </span>
                                  <span className="flex items-center gap-0.5">
                                    <span className="w-1 h-1 rounded-full bg-cyan-400" />
                                    SYNC
                                  </span>
                                </div>
                              </div>

                              <h3 className="text-xs font-semibold text-white truncate tracking-tight">
                                {SAMPLE_PRODUCT.title}
                              </h3>

                              {/* Equalizer / Audio Waveform Bars animadas */}
                              <div className="flex items-end gap-0.5 h-3 my-1.5 opacity-70">
                                {[40, 70, 30, 90, 50, 80, 60, 100, 45, 75, 90, 35, 65, 85].map((h, i) => (
                                  <div
                                    key={i}
                                    className="w-1 bg-blue-400/80 rounded-t-xs"
                                    style={{
                                      height: `${h}%`,
                                      animation: `pulse 1.2s ease-in-out infinite alternate ${i * 0.08}s`,
                                    }}
                                  />
                                ))}
                              </div>

                              <div className="flex items-center gap-2 text-[9px] font-mono text-white/40">
                                <span>PING: 8ms</span>
                                <span>•</span>
                                <span>BUS: 10Gbps</span>
                                <span>•</span>
                                <span>AES-256</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Odómetro de Hardware Financiero */}
                        <div className="p-3.5 rounded-xl bg-[#090A0E] border border-white/[0.08] flex items-center justify-between">
                          <div>
                            <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 block">
                              TARIFA DE NODO // CICLO RECURRENTE
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-white/70 font-mono">Plan Dedicado</span>
                              {hasCoupon && (
                                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 font-bold">
                                  VIP -20%
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <div className="flex items-baseline justify-end gap-1">
                              <span className="text-2xl font-bold text-white tracking-tight">
                                ${finalPrice.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-white/40">USD</span>
                            </div>
                            {hasCoupon && (
                              <span className="text-[11px] line-through text-white/30 block">
                                {formattedOriginalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── MODELO 05: TERMINAL BLUEPRINT (RAYCAST PRO / VERCEL SPEC) ── */}
                    {isBlueprint && (
                      <div className="space-y-3">
                        {/* Terminal Blueprint Container */}
                        <div className="rounded-2xl bg-[#07080B] border border-white/[0.09] p-3.5 space-y-3 shadow-2xl relative font-mono">
                          {/* Top Bar con macOS dots y Repository URI */}
                          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-red-500/80" />
                              <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                              <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                              <span className="text-white/40 ml-1.5">manifest.spec.json</span>
                            </div>
                            <span className="text-emerald-400 text-[9px]">git://celaest/hub@v2.4.1</span>
                          </div>

                          {/* Blueprint Visual & CAD Crosshair Markers */}
                          <div className="relative rounded-xl overflow-hidden ring-1 ring-white/10 bg-black h-20 flex items-center justify-between p-3">
                            <img
                              src={SAMPLE_PRODUCT.image}
                              alt={SAMPLE_PRODUCT.title}
                              className="absolute inset-0 w-full h-full object-cover opacity-30"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

                            {/* CAD Crosshairs */}
                            <span className="absolute top-1.5 left-1.5 text-[8px] text-emerald-400 font-bold select-none">+</span>
                            <span className="absolute top-1.5 right-1.5 text-[8px] text-emerald-400 font-bold select-none">+</span>
                            <span className="absolute bottom-1.5 left-1.5 text-[8px] text-emerald-400 font-bold select-none">+</span>
                            <span className="absolute bottom-1.5 right-1.5 text-[8px] text-emerald-400 font-bold select-none">+</span>

                            <div className="relative z-10 space-y-0.5">
                              <span className="text-[8px] uppercase tracking-widest text-emerald-400 font-bold block">
                                [BLUEPRINT ARTIFACT]
                              </span>
                              <h3 className="text-xs font-semibold text-white tracking-tight truncate">
                                {SAMPLE_PRODUCT.title}
                              </h3>
                              <span className="text-[9px] text-white/50 block">
                                DIM: 1200x800px • LOSSLESS BINARY MESH
                              </span>
                            </div>

                            <div className="relative z-10 text-right">
                              <span className="text-[9px] text-white/40 block">AUTOR</span>
                              <span className="text-[10px] text-white/90 font-bold">{SAMPLE_PRODUCT.seller}</span>
                            </div>
                          </div>

                          {/* Tabular Spec Matrix */}
                          <div className="space-y-1 text-[10px] text-white/60 pt-0.5">
                            <div className="flex items-center justify-between py-0.5 border-b border-dashed border-white/[0.06]">
                              <span>TARGET INFRASTRUCTURE</span>
                              <span className="text-white/90">Cloudflare Workers / AWS Edge</span>
                            </div>
                            <div className="flex items-center justify-between py-0.5 border-b border-dashed border-white/[0.06]">
                              <span>LICENCIA ASIGNADA</span>
                              <span className="text-white/90">1 Org Seat • Unlimited Invocations</span>
                            </div>
                            {hasCoupon && (
                              <div className="flex items-center justify-between py-0.5 text-emerald-400">
                                <span>&gt; apply {couponCode}</span>
                                <span>-$24.00 USD (-20%)</span>
                              </div>
                            )}
                          </div>

                          {/* Perforated Receipt Total */}
                          <div className="pt-2 border-t border-dashed border-white/20 flex items-baseline justify-between">
                            <div>
                              <span className="text-xs text-white/70 font-bold block">TOTAL MENSUAL NETO</span>
                              <span className="text-[9px] text-white/30">Facturación recurrente mensual</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-bold text-white tracking-tight">
                                ${finalPrice.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-white/40 ml-1">USD</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── MODELO 06: SWISS EDITORIAL (LEICA PROOF & PROPORCIÓN ÁUREA) ── */}
                    {isEditorial && (
                      <div className="space-y-4">
                        {/* Contact Sheet / Museum Proof Layout */}
                        <div className="p-4 rounded-2xl bg-[#09090C] border border-white/[0.08] space-y-3.5">
                          <div className="flex items-start gap-4">
                            {/* Photo Proof con marcas de recorte fotográficas */}
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20 bg-neutral-900 shrink-0">
                              <img
                                src={SAMPLE_PRODUCT.image}
                                alt={SAMPLE_PRODUCT.title}
                                className="w-full h-full object-cover filter contrast-105"
                              />
                              {/* Crop marks fotográficas */}
                              <span className="absolute top-0.5 left-0.5 text-[7px] text-white/60 font-mono select-none">⌐</span>
                              <span className="absolute top-0.5 right-0.5 text-[7px] text-white/60 font-mono select-none">¬</span>
                              <span className="absolute bottom-0.5 left-0.5 text-[7px] text-white/60 font-mono select-none">L</span>
                              <span className="absolute bottom-0.5 right-0.5 text-[7px] text-white/60 font-mono select-none">┙</span>
                            </div>

                            {/* Tipografía Editorial Suiza */}
                            <div className="min-w-0 space-y-1">
                              <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-white/40 block">
                                FIG. 01 — ARCHITECTURE REPOSITORY
                              </span>
                              <h3 className="text-sm font-semibold text-white tracking-tight uppercase leading-snug">
                                {SAMPLE_PRODUCT.title}
                              </h3>
                              <p className="text-[11px] text-white/50">
                                Edición: {SAMPLE_PRODUCT.version} • Por {SAMPLE_PRODUCT.seller}
                              </p>
                            </div>
                          </div>

                          {/* Ledger Tipográfico con Dot-Leaders Suizos */}
                          <div className="pt-2 border-t border-white/[0.06] space-y-1.5 text-xs font-mono">
                            <div className="flex items-baseline justify-between text-white/50">
                              <span>Licencia Base Mensual</span>
                              <span className="flex-1 mx-2 border-b border-dotted border-white/10" />
                              <span>${basePrice.toFixed(2)} USD</span>
                            </div>
                            {hasCoupon && (
                              <div className="flex items-baseline justify-between text-white/80">
                                <span>Descuento Preferencial (-20%)</span>
                                <span className="flex-1 mx-2 border-b border-dotted border-white/20" />
                                <span className="text-emerald-400">-${discountAmount.toFixed(2)} USD</span>
                              </div>
                            )}
                            <div className="flex items-baseline justify-between text-white/30 text-[10px]">
                              <span>Costes de Pasarela & Servidor</span>
                              <span className="flex-1 mx-2 border-b border-dotted border-white/10" />
                              <span>Exento (0.00 USD)</span>
                            </div>
                          </div>

                          {/* Total Suizo de Alta Tipografía */}
                          <div className="pt-2.5 border-t border-white/[0.1] flex items-baseline justify-between">
                            <div>
                              <span className="text-xs uppercase tracking-wider font-semibold text-white/60 block">
                                Inversión Neta
                              </span>
                              <span className="text-[10px] text-white/30 font-mono">Facturación periódica de 30 días</span>
                            </div>
                            <div className="text-right font-mono">
                              <span className="text-2xl font-bold text-white tracking-tight">
                                ${finalPrice.toFixed(2)}
                              </span>
                              <span className="text-xs text-white/40 ml-1">USD</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── MODELO 01: DESGLOSE FINANCIERO BASE (SOLO PARA MODELO 01) ── */}
                    {isCobalt && (
                      <div className="space-y-3.5 pt-1">
                        {/* Fila de Cupón (100% Centrada, Limpia y Sin Pill Boxes Clutter) */}
                        {hasCoupon ? (
                          <div className="flex items-center justify-center">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-mono shadow-sm">
                              <Tag size={12} className="text-white/40 shrink-0" />
                              <span className="text-[11px] uppercase font-semibold text-white/90 tracking-wider">
                                {couponCode}
                              </span>
                              <span className="text-white/20">•</span>
                              <span className="text-[11px] text-white/50">
                                Ahorro: -${discountAmount.toFixed(2)} USD (-20%)
                              </span>
                              <span className="text-white/20">•</span>
                              <button
                                type="button"
                                onClick={handleRemoveCoupon}
                                className="text-[10px] uppercase tracking-wider text-white/40 hover:text-white transition-colors cursor-pointer"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        ) : showCouponInput ? (
                          <form onSubmit={handleApplyCoupon} className="flex items-center justify-center gap-2 max-w-[340px] mx-auto">
                            <input
                              type="text"
                              placeholder="CÓDIGO DE CUPÓN"
                              value={inputCoupon}
                              onChange={(e) => setInputCoupon(e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white uppercase placeholder-white/30 focus:outline-none focus:border-blue-500/50"
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="px-4 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors bg-blue-600 hover:bg-blue-500 text-white font-mono"
                            >
                              Aplicar
                            </button>
                          </form>
                        ) : (
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => setShowCouponInput(true)}
                              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                            >
                              <Tag size={12} className="text-white/30" />
                              <span>+ Aplicar cupón de descuento</span>
                            </button>
                          </div>
                        )}

                        {/* Total Mensual */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                          <div className="space-y-0.5">
                            <span className="text-xs text-white/50 block font-medium">Inversión mensual recurrente</span>
                            {hasCoupon ? (
                              <div className="flex items-center gap-2 text-xs font-mono">
                                <span className="line-through text-white/30">
                                  {formattedOriginalPrice}
                                </span>
                                <span className="text-[11px] text-white/40">
                                  (-20% descuento)
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-mono text-white/30">Cancela en cualquier momento</span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-baseline justify-end gap-1">
                              <span className="text-2xl font-bold font-mono tracking-tight text-white">
                                ${finalPrice.toFixed(2)}
                              </span>
                              <span className="text-xs text-white/40 font-mono">USD</span>
                            </div>
                            <span className="text-[10px] text-white/30 font-mono block">/ mes</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botón de Acción */}
                    <div style={{ width: "100%" }} className="pt-1 space-y-2.5">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                          isCobalt
                            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-950/30"
                            : isHardware
                              ? "bg-[#101422] hover:bg-[#161C30] border border-blue-500/40 text-blue-300 font-mono shadow-[0_0_20px_rgba(59,102,245,0.18)]"
                              : isBlueprint
                                ? "bg-[#07080B] hover:bg-[#0D1016] border border-emerald-500/40 text-emerald-300 font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                                : isEditorial
                                  ? "bg-white text-black hover:bg-neutral-200 uppercase text-xs font-bold tracking-wider shadow-md"
                                  : "bg-white text-black hover:bg-neutral-100 shadow-md font-semibold"
                        }`}
                      >
                        <span>Continuar al Pago Seguro ({formattedFinalPrice})</span>
                        <ArrowRight size={15} weight="bold" />
                      </button>

                      <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/30">
                        <LockSimple size={12} />
                        <span>Cifrado bancario 256-bit • Facturación mensual flexible</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── PASO 2: REDIRECCIÓN STRIPE (CERO ICONO - MÁXIMA LIMPIEZA) ── */}
                {step === 2 && (
                  <div
                    style={{ width: "100%", display: "block" }}
                    className="py-4 space-y-6 animate-in fade-in duration-200 text-center"
                  >
                    {isProcessing ? (
                      <div className="w-full py-8 text-center space-y-4" style={{ width: "100%", display: "block" }}>
                        <div className="relative mx-auto w-14 h-14 flex items-center justify-center">
                          <CircleNotch
                            size={52}
                            className={`animate-spin ${
                              isCobalt ? "text-blue-500" : isStealth ? "text-emerald-400" : "text-white"
                            }`}
                            weight="bold"
                          />
                          <LockSimple size={20} className="absolute text-white/80" weight="bold" />
                        </div>
                        <div className="space-y-1" style={{ width: "100%", display: "block" }}>
                          <p className="text-sm font-semibold text-white">
                            Conectando con Stripe Checkout...
                          </p>
                          <p className="text-xs text-white/40 font-mono">
                            Generando sesión cifrada ({progress}%)
                          </p>
                        </div>
                        <div className="w-48 h-1 mx-auto bg-white/[0.08] rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isCobalt ? "bg-blue-600" : isStealth ? "bg-emerald-400" : "bg-white"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* CERO ICONO: Directo al contenido esencial con máxima pulcritud */}
                        <div
                          className="space-y-1.5 text-center pt-2"
                          style={{ width: "100%", display: "block" }}
                        >
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] block font-medium text-white/40">
                            Pasarela Segura
                          </span>
                          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Redirigiendo a Stripe
                          </h2>
                          <p
                            className="text-xs text-white/50 leading-relaxed"
                            style={{
                              width: "100%",
                              maxWidth: "420px",
                              marginLeft: "auto",
                              marginRight: "auto",
                              display: "block",
                              wordBreak: "normal",
                            }}
                          >
                            Te transferiremos a la pasarela cifrada de Stripe para completar la transacción de forma segura sin almacenar datos sensibles.
                          </p>
                        </div>

                        {/* Importe Puro */}
                        <div className="py-2">
                          <span className="text-3xl font-bold font-mono tracking-tight text-white block">
                            {formattedFinalPrice}
                          </span>
                          <span className="text-xs text-white/40 font-mono block mt-1">
                            Facturación periódica mensual de suscripción
                          </span>
                        </div>

                        {/* Botón de Salto Directo a Stripe */}
                        <div style={{ width: "100%" }} className="space-y-2.5 pt-1">
                          <button
                            type="button"
                            onClick={handleSimulatePayment}
                            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                              isCobalt
                                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-950/30"
                                : isStealth
                                  ? "bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                                  : "bg-white text-black hover:bg-neutral-200"
                            }`}
                          >
                            <span>Ir a Stripe Checkout ({formattedFinalPrice})</span>
                            <ArrowSquareOut size={16} weight="bold" />
                          </button>

                          <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/30 text-center">
                            <ShieldCheck size={13} />
                            <span>Visa • Mastercard • Amex • Apple Pay • TLS 1.3</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full py-1 text-xs text-white/40 hover:text-white transition-colors cursor-pointer text-center"
                          >
                            ← Volver al resumen
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ── PASO 3: ACTIVACIÓN (CHECKMARK CIRCULAR LIMPIO SIN CAJA EXTERIOR) ── */}
                {step === 3 && (
                  <div
                    style={{ width: "100%", display: "block", textAlign: "center" }}
                    className="py-6 sm:py-8 space-y-6 animate-in fade-in duration-200"
                  >
                    {/* Icono Circular de Confirmación (Basado 100% en la referencia del usuario - Imagen 3) */}
                    <div className="relative flex items-center justify-center pt-2">
                      {isStealth && (
                        <div className="absolute w-20 h-20 bg-emerald-500/15 blur-xl rounded-full pointer-events-none" />
                      )}
                      <svg
                        width="54"
                        height="54"
                        viewBox="0 0 54 54"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-emerald-400 relative z-10"
                      >
                        <circle cx="27" cy="27" r="23" stroke="currentColor" strokeWidth="3" />
                        <path
                          d="M17 27.5L24 34.5L37.5 20"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* Titular y Descripción Equilibrados */}
                    <div
                      className="space-y-2 text-center"
                      style={{ width: "100%", display: "block" }}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] block font-medium text-white/40">
                        Activación Inmediata
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        ¡Adquisición Confirmada!
                      </h2>
                      <p
                        className="text-xs sm:text-sm text-white/60 leading-relaxed"
                        style={{
                          width: "100%",
                          maxWidth: "420px",
                          marginLeft: "auto",
                          marginRight: "auto",
                          display: "block",
                          wordBreak: "normal",
                        }}
                      >
                        Tu suscripción ha sido dada de alta exitosamente y el servicio ya se encuentra disponible en tu entorno de trabajo.
                      </p>
                    </div>

                    {/* Botón de Cierre Proporcionado */}
                    <div style={{ width: "100%" }} className="pt-2 space-y-2.5">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className={`w-full py-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-md ${
                          isCobalt
                            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-950/30"
                            : isHardware
                              ? "bg-[#101422] hover:bg-[#161C30] border border-blue-500/40 text-blue-300 font-mono"
                              : isBlueprint
                                ? "bg-[#07080B] hover:bg-[#0D1016] border border-emerald-500/40 text-emerald-300 font-mono"
                                : "bg-white text-black hover:bg-neutral-200"
                        }`}
                      >
                        Ir a Mis Activos en el Catálogo
                      </button>

                      <p className="text-[10px] font-mono text-white/30 text-center">
                        Comprobante fiscal y detalles de acceso enviados a tu correo corporativo
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
