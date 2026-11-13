"use client";

import React from "react";
import {
  Check,
  CheckCircle,
  CreditCard,
  DownloadSimple,
  CaretRight,
} from "@phosphor-icons/react";

export type StepperVariant =
  | "linear_pills"
  | "stripe_rail"
  | "vercel_segmented"
  | "obsidian_minimal";

export interface StepperVariantMeta {
  id: StepperVariant;
  badge: string;
  title: string;
  description: string;
}

export const STEPPER_VARIANTS: StepperVariantMeta[] = [
  {
    id: "linear_pills",
    badge: "Ejemplo 01 • Linear",
    title: "Cápsulas con Chevrons",
    description:
      "Cada paso vive en su propia cápsula con icono integrado y separadores ›. Cero líneas cruzando círculos.",
  },
  {
    id: "stripe_rail",
    badge: "Ejemplo 02 • Stripe",
    title: "Bloques + Riel Inferior",
    description:
      "Separa los iconos de la barra de progreso (3 segmentos debajo). Lectura inmediata y cero colisiones.",
  },
  {
    id: "vercel_segmented",
    badge: "Ejemplo 03 • Vercel",
    title: "Segmented Control",
    description:
      "Contenedor único tipo pill con 3 estados claros (completado, activo, pendiente). Ultra compacto en móvil.",
  },
  {
    id: "obsidian_minimal",
    badge: "Ejemplo 04 • Clásico Pulido",
    title: "Nodos Flexbox con Aire",
    description:
      "Versión limpia del clásico: conectores flex-1 con 12px de margen real a cada lado para no tocar bordes.",
  },
];

const STEPS = [
  {
    number: 1 as const,
    title: "Confirmación",
    shortTitle: "Confirmar",
    icon: <CheckCircle size={16} weight="bold" />,
  },
  {
    number: 2 as const,
    title: "Pago Seguro",
    shortTitle: "Pago",
    icon: <CreditCard size={16} weight="bold" />,
  },
  {
    number: 3 as const,
    title: "Activación",
    shortTitle: "Activar",
    icon: <DownloadSimple size={16} weight="bold" />,
  },
];

interface PurchaseStepperHeaderProps {
  variant: StepperVariant;
  step: 1 | 2 | 3;
  onSelectStep: (step: 1 | 2 | 3) => void;
  isCobalt?: boolean;
}

export function PurchaseStepperHeader({
  variant,
  step,
  onSelectStep,
  isCobalt = false,
}: PurchaseStepperHeaderProps) {
  const accentBg = isCobalt ? "#2563EB" : "#FFFFFF";

  if (variant === "linear_pills") {
    return (
      <div className="w-full max-w-[420px] mx-auto flex items-center justify-center gap-1.5 sm:gap-2">
        {STEPS.map((s, idx) => {
          const isCompleted = step > s.number;
          const isActive = step === s.number;
          return (
            <React.Fragment key={s.number}>
              <button
                type="button"
                aria-current={isActive ? "step" : undefined}
                onClick={() => onSelectStep(s.number)}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? isCobalt
                      ? "bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.35)] font-semibold"
                      : "bg-white text-[#09090B] shadow-[0_0_16px_rgba(255,255,255,0.18)] font-semibold"
                    : isCompleted
                      ? "bg-white/[0.06] text-white/85 border border-white/[0.12] hover:bg-white/[0.1]"
                      : "bg-transparent text-white/35 border border-white/[0.06] hover:text-white/60"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                    isActive
                      ? isCobalt
                        ? "bg-white/20 text-white"
                        : "bg-black/10 text-[#09090B]"
                      : isCompleted
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/[0.06] text-white/40"
                  }`}
                >
                  {isCompleted ? <Check size={10} weight="bold" /> : s.number}
                </span>
                <span className="hidden xs:inline sm:inline whitespace-nowrap">
                  {s.title}
                </span>
                <span className="inline xs:hidden sm:hidden whitespace-nowrap">
                  {s.shortTitle}
                </span>
              </button>

              {idx < STEPS.length - 1 && (
                <CaretRight
                  size={12}
                  weight="bold"
                  className={`shrink-0 transition-colors ${
                    step > s.number ? "text-white/50" : "text-white/15"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  if (variant === "stripe_rail") {
    return (
      <div className="w-full max-w-[390px] mx-auto space-y-2.5">
        <div className="grid grid-cols-3 gap-2">
          {STEPS.map((s) => {
            const isCompleted = step > s.number;
            const isActive = step === s.number;
            return (
              <button
                key={s.number}
                type="button"
                aria-current={isActive ? "step" : undefined}
                onClick={() => onSelectStep(s.number)}
                className="flex items-center justify-center gap-1.5 py-1 rounded-lg transition-colors cursor-pointer group"
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isActive
                      ? isCobalt
                        ? "bg-blue-600 text-white"
                        : "bg-white text-[#09090B]"
                      : isCompleted
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/[0.05] text-white/30 border border-white/[0.08]"
                  }`}
                >
                  {isCompleted ? <Check size={11} weight="bold" /> : s.icon}
                </span>
                <span
                  className={`text-[11px] sm:text-xs truncate transition-colors ${
                    isActive
                      ? "text-white font-semibold"
                      : isCompleted
                        ? "text-white/65 group-hover:text-white"
                        : "text-white/30 group-hover:text-white/55"
                  }`}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Riel inferior de 3 segmentos independientes (cero choque con iconos) */}
        <div className="grid grid-cols-3 gap-2">
          {STEPS.map((s) => {
            const isCompleted = step > s.number;
            const isActive = step === s.number;
            return (
              <div
                key={s.number}
                className="h-1 rounded-full bg-white/[0.07] overflow-hidden"
              >
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: isCompleted || isActive ? "100%" : "0%",
                    backgroundColor: isActive
                      ? accentBg
                      : isCompleted
                        ? isCobalt
                          ? "rgba(59, 130, 246, 0.45)"
                          : "rgba(255, 255, 255, 0.35)"
                        : "transparent",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === "vercel_segmented") {
    return (
      <div className="w-full max-w-[400px] mx-auto p-1 rounded-2xl bg-[#13141A] border border-white/[0.07] grid grid-cols-3 gap-1">
        {STEPS.map((s) => {
          const isCompleted = step > s.number;
          const isActive = step === s.number;
          return (
            <button
              key={s.number}
              type="button"
              aria-current={isActive ? "step" : undefined}
              onClick={() => onSelectStep(s.number)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-[11px] sm:text-xs transition-all duration-200 cursor-pointer ${
                isActive
                  ? isCobalt
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "bg-white text-[#09090B] font-semibold shadow-sm"
                  : isCompleted
                    ? "text-white/75 hover:bg-white/[0.04]"
                    : "text-white/35 hover:text-white/60"
              }`}
            >
              {isCompleted ? (
                <Check size={12} weight="bold" className="text-emerald-400 shrink-0" />
              ) : (
                <span
                  className={`font-mono text-[10px] shrink-0 ${
                    isActive ? "opacity-75" : "opacity-50"
                  }`}
                >
                  0{s.number}
                </span>
              )}
              <span className="truncate">{s.title}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default: obsidian_minimal (Flexbox puro con aire real entre línea y círculos)
  return (
    <div className="w-full max-w-[380px] mx-auto">
      <div className="flex items-center px-[22px] sm:px-[24px]">
        {STEPS.map((s, idx) => {
          const isCompleted = step > s.number;
          const isActive = step === s.number;
          return (
            <React.Fragment key={s.number}>
              <button
                type="button"
                aria-current={isActive ? "step" : undefined}
                onClick={() => onSelectStep(s.number)}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full shrink-0 flex items-center justify-center transition-all duration-200 text-xs font-semibold cursor-pointer ${
                  isActive
                    ? isCobalt
                      ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] ring-4 ring-blue-500/15"
                      : "bg-white text-[#09090B] shadow-[0_0_20px_rgba(255,255,255,0.22)] ring-4 ring-white/[0.08]"
                    : isCompleted
                      ? isCobalt
                        ? "bg-[#0B132B] text-blue-400 border border-blue-500/50 hover:border-blue-400/80"
                        : "bg-[#161820] text-white/90 border border-white/25 hover:border-white/50"
                      : "bg-[#121319] text-white/30 border border-white/[0.08] hover:border-white/20 hover:text-white/50"
                }`}
              >
                {isCompleted ? <Check size={16} weight="bold" /> : s.icon}
              </button>

              {idx < STEPS.length - 1 && (
                <div className="flex-1 mx-3 h-[2px] rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: step > s.number ? "100%" : "0%",
                      backgroundColor: accentBg,
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-start justify-between mt-2.5">
        {STEPS.map((s) => {
          const isCompleted = step > s.number;
          const isActive = step === s.number;
          return (
            <button
              key={s.number}
              type="button"
              onClick={() => onSelectStep(s.number)}
              className={`w-[84px] sm:w-[92px] text-[11px] sm:text-xs transition-colors text-center truncate cursor-pointer ${
                isActive
                  ? "text-white font-semibold"
                  : isCompleted
                    ? "text-white/60 hover:text-white/80"
                    : "text-white/30 hover:text-white/50"
              }`}
            >
              {s.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface PurchaseStepperLabPreviewProps {
  selectedVariant: StepperVariant;
  step: 1 | 2 | 3;
  isCobalt: boolean;
  onSelectVariant: (variant: StepperVariant) => void;
  onSelectStep: (step: 1 | 2 | 3) => void;
  onOpenModalWithVariant: (variant: StepperVariant) => void;
}

export function PurchaseStepperLabPreview({
  selectedVariant,
  step,
  isCobalt,
  onSelectVariant,
  onSelectStep,
  onOpenModalWithVariant,
}: PurchaseStepperLabPreviewProps) {
  return (
    <div className="p-5 rounded-2xl bg-[#08090D] border border-white/[0.06] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/45 font-semibold">
            Laboratorio de Stepper • Cero Colisiones UX/UI
          </span>
          <h3 className="text-sm font-semibold text-white mt-0.5">
            4 Propuestas Limpias para el Header del Modal (haz clic para probar en vivo)
          </h3>
        </div>
        <span className="text-[11px] text-white/40 font-mono">
          Paso actual: 0{step} / 03
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {STEPPER_VARIANTS.map((v) => {
          const isSelected = selectedVariant === v.id;
          return (
            <div
              key={v.id}
              onClick={() => onSelectVariant(v.id)}
              className={`rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "bg-[#0B0C10] border-white/40 ring-1 ring-white/15"
                  : "bg-[#09090B] border-white/[0.06] hover:border-white/20"
              }`}
            >
              <div className="px-4 pt-3.5 pb-2 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/45">
                    {v.badge}
                  </span>
                  <h4 className="text-xs font-semibold text-white mt-0.5">
                    {v.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModalWithVariant(v.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-white text-black"
                      : "bg-white/[0.06] text-white/80 hover:bg-white/[0.12]"
                  }`}
                >
                  {isSelected ? "Activo en Modal" : "Ver en Modal"}
                </button>
              </div>

              {/* Preview exacto del header del modal */}
              <div className="mx-3 my-2 px-4 py-4 rounded-xl bg-[#0D0D11] border border-white/[0.06]">
                <PurchaseStepperHeader
                  variant={v.id}
                  step={step}
                  onSelectStep={onSelectStep}
                  isCobalt={isCobalt}
                />
              </div>

              <p className="px-4 pb-3.5 pt-1 text-[11px] text-white/45 leading-relaxed">
                {v.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

