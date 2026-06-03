import React from "react";
import {
  Check,
  Sparkle,
  Lightning,
  Users,
  HardDrive,
  ArrowRight,
} from "@phosphor-icons/react";
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

/* ─── Palette ─── */

const palettes = {
  blue: {
    border: { dark: "border-[#1E293B]", light: "border-gray-200" },
    bg: { dark: "bg-[#0F172A]/40", light: "bg-white" },
    title: { dark: "text-[#60A5FA]", light: "text-blue-600" },
    accent: { dark: "text-[#60A5FA]", light: "text-blue-500" },
    checkBg: { dark: "bg-transparent", light: "bg-blue-50" },
    check: "text-[#60A5FA]",
    statBg: { dark: "bg-[#0F172A]", light: "bg-blue-50/70" },
    btn: "bg-[#1E293B] hover:bg-[#334155] text-white border border-[#334155]",
    btnLight: "bg-blue-600 hover:bg-blue-500 text-white",
    activeBtn: { dark: "bg-white/[0.03] border-white/10 text-gray-400", light: "bg-gray-50 border-gray-200 text-gray-500" },
    activeDot: { dark: "bg-[#60A5FA]", light: "bg-blue-500" },
    activeRing: { dark: "ring-[#60A5FA]/20", light: "ring-blue-200" },
  },
  purple: {
    border: { dark: "border-[#8B5CF6]/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]", light: "border-purple-200" },
    bg: { dark: "bg-[#1E1B4B]/30", light: "bg-white" },
    title: { dark: "text-[#C084FC]", light: "text-purple-600" },
    accent: { dark: "text-[#C084FC]", light: "text-purple-500" },
    checkBg: { dark: "bg-transparent", light: "bg-purple-50" },
    check: "text-[#C084FC]",
    statBg: { dark: "bg-[#2E1065]", light: "bg-purple-50/70" },
    btn: "bg-linear-to-r from-[#9333EA] to-[#A855F7] hover:from-[#A855F7] hover:to-[#C084FC] text-white shadow-lg shadow-purple-500/25",
    btnLight: "bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/20",
    activeBtn: { dark: "bg-white/[0.03] border-white/10 text-gray-400", light: "bg-gray-50 border-gray-200 text-gray-500" },
    activeDot: { dark: "bg-[#A855F7]", light: "bg-purple-500" },
    activeRing: { dark: "ring-[#A855F7]/20", light: "ring-purple-200" },
  },
  emerald: {
    border: { dark: "border-[#064E3B]", light: "border-gray-200" },
    bg: { dark: "bg-[#022C22]/30", light: "bg-white" },
    title: { dark: "text-[#34D399]", light: "text-emerald-600" },
    accent: { dark: "text-[#34D399]", light: "text-emerald-500" },
    checkBg: { dark: "bg-transparent", light: "bg-emerald-50" },
    check: "text-[#34D399]",
    statBg: { dark: "bg-[#064E3B]/80", light: "bg-emerald-50/70" },
    btn: "bg-[#10B981] hover:bg-[#059669] text-white shadow-lg shadow-emerald-500/15",
    btnLight: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/15",
    activeBtn: { dark: "bg-white/[0.03] border-white/10 text-gray-400", light: "bg-gray-50 border-gray-200 text-gray-500" },
    activeDot: { dark: "bg-[#34D399]", light: "bg-emerald-500" },
    activeRing: { dark: "ring-[#34D399]/20", light: "ring-emerald-200" },
  },
} as const;

/* ─── Component ─── */

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
  
  const mode = isDark ? "dark" : "light";
  const isPopular = plan.popular;
  const isCurrent = activePlanIds?.includes(plan.id);

  const selectedPrice =
    billingCycle === "yearly" && planPrice.yearly.value > 0
      ? planPrice.yearly
      : planPrice.monthly;
  const isFree = selectedPrice.isFree;
  const periodLabel = billingCycle === "yearly" ? `/${t("yr")}` : t("per_mo");
  const p = palettes[plan.color || "blue"];

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
  const storageLabel =
    storageVal === undefined
      ? ""
      : storageVal === -1
        ? t("unlimited")
        : `${fmtLimit(storageVal, t("unlimited"))}GB`;

  const renderFeature = (f: string) => {
    if (!f) return f;
    const key = f.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const tKey = `features.${key}` as string;
    return t.has(tKey) ? t(tKey) : f;
  };

  /* Split features into 2 columns to cut vertical height */
  const features = plan.features || [];
  const mid = Math.ceil(features.length / 2);
  const col1 = features.slice(0, mid);
  const col2 = features.slice(mid);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", bounce: 0.18 }}
      className={[
        "relative flex flex-col h-full min-w-0 w-full overflow-visible rounded-2xl border transition-all duration-300",
        "p-5 sm:p-6 lg:p-5 xl:p-6",
        p.border[mode],
        p.bg[mode],
        isPopular
          ? "shadow-xl shadow-purple-500/10 ring-1 ring-purple-500/20 z-10 lg:scale-[1.02]"
          : "shadow-sm hover:shadow-md",
        isCurrent ? `ring-1 ${p.activeRing[mode]}` : "",
      ].join(" ")}
    >
      {/* ── Popular badge ── */}
      {isPopular && (
        <div className="absolute -top-3 inset-x-0 flex justify-center">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap bg-linear-to-r from-purple-600 to-violet-600 text-white text-xs font-semibold uppercase px-4 py-1.5 rounded-full shadow-md shadow-purple-500/30">
            <Sparkle className="w-3 h-3" />
            {t("most_popular")}
          </span>
        </div>
      )}

      {/* ── Plan name ── */}
      <h3
        className={`text-center text-xs font-semibold uppercase ${p.title[mode]}`}
      >
        {plan.name}
      </h3>

      {/* ── Price ── */}
      <div className="flex items-baseline justify-center gap-1.5 mt-4">
        {isFree ? (
          <span
            className={`text-3xl sm:text-4xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {t("free")}
          </span>
        ) : (
          <>
            <span
              className={`text-3xl sm:text-4xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {selectedPrice.formatted}
            </span>
            <span
              className={`text-xs sm:text-sm xl:text-base font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              {periodLabel}
            </span>
          </>
        )}
      </div>

      {!isFree && planPrice.yearly.value > 0 ? (
        <p
          className={`text-center text-[11px] sm:text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          {billingCycle === "yearly"
            ? `≈ ${planPrice.format(planPrice.yearly.value / 12)}${t("per_mo")}`
            : `${planPrice.yearly.formatted}/${t("yr")}`}{" "}
          <span className="text-green-500 font-semibold">
            Ahorras {planPrice.format(planPrice.monthly.value * 12 - planPrice.yearly.value)}
          </span>
        </p>
      ) : null}

      {/* ── Description ── */}
      <p
        className={`text-center text-xs xl:text-[13px] mt-3 leading-relaxed min-h-[2.5rem] ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        {plan.code && t.has(`desc_${plan.code}` as string) ? t(`desc_${plan.code}` as string) : plan.description}
      </p>

      {/* ── Key metrics row ── */}
      {limits && (
        <div
          className={`grid grid-cols-3 gap-0 rounded-2xl mt-5 overflow-hidden ${p.statBg[mode]}`}
        >
          {aiVal !== undefined && (
            <div className="flex min-w-0 flex-col items-center justify-center gap-1 px-2 py-3">
              <Lightning className={`w-4 h-4 ${p.accent[mode]}`} />
              <span
                className={`text-xs sm:text-sm font-bold truncate w-full text-center ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {fmtLimit(aiVal, t("unlimited"))}
              </span>
              <span
                className={`text-[10px] truncate w-full text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {t("ai_req")}
              </span>
            </div>
          )}
          {teamVal !== undefined && (
            <div className="flex min-w-0 flex-col items-center justify-center gap-1 px-2 py-3 border-l border-white/5">
              <Users className={`w-4 h-4 ${p.accent[mode]}`} />
              <span
                className={`text-xs sm:text-sm font-bold truncate w-full text-center ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {fmtLimit(teamVal, t("unlimited"))}
              </span>
              <span
                className={`text-[10px] truncate w-full text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {t("members")}
              </span>
            </div>
          )}
          {storageVal !== undefined && (
            <div className="flex min-w-0 flex-col items-center justify-center gap-1 px-2 py-3 border-l border-white/5">
              <HardDrive className={`w-4 h-4 ${p.accent[mode]}`} />
              <span
                className={`text-xs sm:text-sm font-bold truncate w-full text-center ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {storageLabel}
              </span>
              <span
                className={`text-[10px] truncate w-full text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {t("storage")}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Divider ── */}
      <div
        className={`h-px mt-4 mb-4 ${isDark ? "bg-white/6" : "bg-gray-100"}`}
      />

      {/* ── Features — 2 columns ── */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-2.5 mb-5">
        <div className="space-y-2 min-w-0">
          {col1.map((f, i) => (
            <div key={i} className="flex items-start gap-2 w-full">
              <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${p.check}`} weight="bold" />
              <span
                className={`flex-1 min-w-0 text-[12px] leading-snug ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                {renderFeature(f)}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-2 min-w-0">
          {col2.map((f, i) => (
            <div key={i} className="flex items-start gap-2 w-full">
              <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${p.check}`} weight="bold" />
              <span
                className={`flex-1 min-w-0 text-[12px] leading-snug ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                {renderFeature(f)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Button ── */}
      <motion.button
        whileHover={
          !isCurrent && !isLoading && !isReadOnly ? { scale: 1.02 } : {}
        }
        whileTap={
          !isCurrent && !isLoading && !isReadOnly ? { scale: 0.98 } : {}
        }
        onClick={handleSelect}
        disabled={isCurrent || isLoading || isReadOnly}
        className={[
          "w-full mt-auto py-3 rounded-xl text-sm font-semibold transition-all duration-300",
          isCurrent
            ? `relative overflow-hidden cursor-default border ${p.activeBtn[mode]}`
            : isReadOnly
              ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed dark:bg-zinc-800/50 dark:text-gray-600 dark:border-zinc-800"
              : isDark
                ? p.btn
                : p.btnLight,
        ].join(" ")}
      >
        <span className="relative z-10 flex items-center justify-center gap-2.5">
          {isCurrent ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${p.activeDot[mode]}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${p.activeDot[mode]}`} />
              </span>
              <span className="tracking-wider text-[11px] sm:text-xs uppercase font-bold">{t("active_plan")}</span>
            </>
          ) : isFree ? (
            t("get_started")
          ) : isPopular ? (
            <>
              {t("get_started")}
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            t("choose_plan")
          )}
          {isLoading && !isCurrent && (
            <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          )}
        </span>
      </motion.button>
    </motion.div>
  );
};
