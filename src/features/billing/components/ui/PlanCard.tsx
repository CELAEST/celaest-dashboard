"use client";

import React from "react";
import { Check, Sparkle, ArrowRight } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { BillingCycle, Plan } from "../../types";
import { useTranslations } from "next-intl";
import { useLocalPlanPrice } from "../../hooks/useLocalPlanPrice";

/* ─── Types ─── */

interface PlanWithUI extends Plan {
  popular?: boolean;
  color?: "blue" | "purple" | "emerald";
}

interface PlanCardProps {
  plan: PlanWithUI;
  index: number;
  onClose: () => void;
  onSelect?: (plan: Plan) => void;
  onToggle?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  activePlanIds?: string[];
  isReadOnly?: boolean;
  billingCycle?: BillingCycle;
}

/* ─── Helpers ─── */

function fmtLimit(v: number, unlimitedLabel: string): string {
  if (v === -1) return unlimitedLabel;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toString();
}

function getPlanBadge(code?: string): string {
  switch (code) {
    case "starter":
      return "COMUNITARIO";
    case "pro":
      return "MÁS POPULAR";
    case "enterprise":
      return "ESCALA CORPORATIVA";
    default:
      return "NIVEL DE SERVICIO";
  }
}

/* ─── Component: Modelo 04 Cristal Ahumado Refractivo (Raycast Obsidian Glass) ─── */

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  index,
  onClose,
  onSelect,
  isLoading = false,
  activePlanIds,
  isReadOnly = false,
  billingCycle = "monthly",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = useTranslations("billing");
  const planPrice = useLocalPlanPrice(plan);

  const isPopular = plan.popular || plan.code === "pro";
  const isCurrent = activePlanIds?.includes(plan.id);

  const isYearly = billingCycle === "yearly";
  const selectedPrice =
    isYearly && planPrice.yearly.value > 0
      ? planPrice.yearly
      : planPrice.monthly;
  const isFree = selectedPrice.isFree;

  // Monthly display price: if yearly, show equivalent monthly cost
  const displayPriceFormatted =
    isYearly && planPrice.yearly.value > 0
      ? planPrice.format(Math.round(planPrice.yearly.value / 12))
      : selectedPrice.formatted;

  const yearlySavings =
    isYearly && planPrice.yearly.value > 0 && planPrice.monthly.value > 0
      ? planPrice.monthly.value * 12 - planPrice.yearly.value
      : 0;

  const handleSelect = () => {
    if (isCurrent || isReadOnly) return;
    if (onSelect) {
      onSelect(plan);
    } else {
      onClose();
    }
  };

  const limits = plan.limits;
  const aiVal = limits?.max_ai_requests_per_month as number | undefined;
  const teamVal = limits?.max_team_members as number | undefined;
  const storageVal = limits?.max_storage_gb as number | undefined;

  const aiDisplay =
    aiVal !== undefined
      ? fmtLimit(aiVal, t("unlimited"))
      : plan.code === "starter"
        ? "100"
        : plan.code === "pro"
          ? "500K"
          : "1.0M+";

  const teamDisplay =
    teamVal !== undefined
      ? teamVal === -1
        ? t("unlimited")
        : `${teamVal} Miembros`
      : plan.code === "starter"
        ? "2 Miembros"
        : plan.code === "pro"
          ? "15 Miembros"
          : "30+ Miembros";

  const storageDisplay =
    storageVal !== undefined
      ? storageVal === -1
        ? t("unlimited")
        : `${fmtLimit(storageVal, t("unlimited"))} GB NVMe`
      : plan.code === "starter"
        ? "1 GB NVMe"
        : plan.code === "pro"
          ? "25 GB NVMe"
          : "200 GB NVMe";

  const renderFeature = (f: string) => {
    if (!f) return f;
    const key = f.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const tKey = `features.${key}` as string;
    return t.has(tKey) ? t(tKey) : f;
  };

  const features = plan.features || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", bounce: 0.15 }}
      whileHover={{ y: -6 }}
      className={`group relative flex flex-col h-full min-w-0 w-full rounded-3xl p-5 sm:p-6 lg:p-6 backdrop-blur-3xl transition-all duration-300 font-sans cursor-pointer hover:z-30 transform-gpu will-change-transform ${
        isPopular
          ? "bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-black/80 border border-white/25 shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.35),inset_0_-1px_1px_0_rgba(0,0,0,0.8),0_24px_64px_-16px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)] hover:border-white/50 hover:shadow-[0_32px_80px_-16px_rgba(0,0,0,0.98),0_0_40px_rgba(255,255,255,0.1),inset_0_1.5px_1px_0_rgba(255,255,255,0.5)]"
          : "bg-gradient-to-b from-white/[0.03] to-black/60 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_16px_40px_rgba(0,0,0,0.7)] hover:border-white/35 hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.95),0_0_30px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.25)]"
      }`}
    >
      {/* Specular hairline top con destello en hover */}
      <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:via-white transition-all duration-300 pointer-events-none" />

      {/* ── Badge Pro Recomendado ── */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-white text-black text-[9px] font-mono uppercase tracking-[0.2em] font-extrabold flex items-center gap-1 shadow-md z-20">
          <Sparkle size={10} weight="fill" />
          <span>{t("most_popular")}</span>
        </div>
      )}

      {/* ── Cabecera del Plan ── */}
      <div className="space-y-1 pb-3.5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 font-semibold">
            {getPlanBadge(plan.code)}
          </span>
          {yearlySavings > 0 && (
            <span className="text-[10px] font-mono text-white/90 bg-white/[0.08] px-2 py-0.5 rounded-full font-medium border border-white/10">
              Ahorras {planPrice.format(yearlySavings)}/año
            </span>
          )}
        </div>

        <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
          {plan.name}
        </h3>
        <p className="text-xs text-white/50 leading-relaxed min-h-[32px]">
          {plan.code && t.has(`desc_${plan.code}` as string)
            ? t(`desc_${plan.code}` as string)
            : plan.description || "Infraestructura de alta disponibilidad y aislamiento."}
        </p>
      </div>

      {/* ── Precio ── */}
      <div className="py-3 border-b border-white/[0.06]">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl lg:text-4xl font-extrabold tracking-tight font-mono text-white">
            {isFree ? "$0" : displayPriceFormatted}
          </span>
          <span className="text-xs text-white/40 font-mono">
            {isFree ? "para siempre" : "/ mes"}
          </span>
        </div>
        <span className="text-[11px] font-mono text-white/40 block mt-1">
          {isFree
            ? "Sin tarjeta de crédito requerida"
            : isYearly && planPrice.yearly.value > 0
              ? `Facturado anualmente (${planPrice.yearly.formatted}/año)`
              : "Facturación mensual recurrente"}
        </span>
      </div>

      {/* ── Métricas Compactas de Infraestructura ── */}
      <div className="grid grid-cols-3 gap-2 py-3 border-b border-white/[0.06] text-center">
        <div className="space-y-0.5">
          <div className="text-sm font-mono font-bold text-white">
            {aiDisplay}
          </div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">
            SOL. IA
          </div>
        </div>
        <div className="space-y-0.5 border-x border-white/[0.06]">
          <div className="text-sm font-mono font-bold text-white">
            {teamDisplay}
          </div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">
            ASIENTOS
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-sm font-mono font-bold text-white">
            {storageDisplay}
          </div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-white/40">
            STORAGE
          </div>
        </div>
      </div>

      {/* ── Lista de Features ── */}
      <div className="flex-1 py-2 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 font-semibold mb-1.5">
          Capacidades incluidas
        </div>
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs text-white/70">
            <Check size={13} weight="bold" className="shrink-0 mt-0.5 text-white/90" />
            <span className="leading-snug">{renderFeature(f)}</span>
          </div>
        ))}
      </div>

      {/* ── Botón de Acción Principal ── */}
      <div className="pt-3 mt-auto">
        <button
          type="button"
          onClick={handleSelect}
          disabled={isCurrent || isLoading || isReadOnly}
          className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            isCurrent
              ? "bg-white/[0.03] border border-white/10 text-white/40 cursor-default"
              : isReadOnly
                ? "bg-white/[0.02] border border-white/5 text-white/30 cursor-not-allowed"
                : isPopular
                  ? "bg-white text-black hover:bg-neutral-100 shadow-[0_4px_24px_rgba(255,255,255,0.25),inset_0_1px_0_rgba(255,255,255,0.9)] cursor-pointer"
                  : "bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 cursor-pointer"
          }`}
        >
          {isCurrent ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-white" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span>{t("active_plan")}</span>
            </>
          ) : isLoading ? (
            <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          ) : isFree ? (
            <>
              <span>{t("get_started")}</span>
              <ArrowRight size={13} weight="bold" />
            </>
          ) : (
            <>
              <span>Elegir {plan.name}</span>
              <ArrowRight size={13} weight="bold" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
