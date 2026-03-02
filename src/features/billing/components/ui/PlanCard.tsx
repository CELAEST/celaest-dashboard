import React from "react";
import {
  Check,
  Sparkles,
  Zap,
  Users,
  HardDrive,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { Plan } from "../../types";

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
}

/* ─── Helpers ─── */

function fmtLimit(v: number): string {
  if (v === -1) return "Unlimited";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toString();
}

/* ─── Palette ─── */

const palettes = {
  blue: {
    border: { dark: "border-white/[0.08]", light: "border-gray-200" },
    bg: { dark: "bg-white/[0.02]", light: "bg-white" },
    title: { dark: "text-blue-400", light: "text-blue-600" },
    accent: { dark: "text-blue-400", light: "text-blue-500" },
    checkBg: { dark: "bg-blue-500/10", light: "bg-blue-50" },
    check: "text-blue-500",
    statBg: { dark: "bg-blue-500/[0.07]", light: "bg-blue-50/70" },
    btn: "bg-white/[0.07] hover:bg-white/[0.14] text-white border border-white/[0.1]",
    btnLight: "bg-blue-600 hover:bg-blue-500 text-white",
  },
  purple: {
    border: { dark: "border-purple-500/30", light: "border-purple-200" },
    bg: { dark: "bg-purple-500/[0.03]", light: "bg-white" },
    title: { dark: "text-purple-300", light: "text-purple-600" },
    accent: { dark: "text-purple-400", light: "text-purple-500" },
    checkBg: { dark: "bg-purple-500/10", light: "bg-purple-50" },
    check: "text-purple-500",
    statBg: { dark: "bg-purple-500/[0.07]", light: "bg-purple-50/70" },
    btn: "bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/20",
    btnLight:
      "bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/20",
  },
  emerald: {
    border: { dark: "border-white/[0.08]", light: "border-gray-200" },
    bg: { dark: "bg-white/[0.02]", light: "bg-white" },
    title: { dark: "text-emerald-400", light: "text-emerald-600" },
    accent: { dark: "text-emerald-400", light: "text-emerald-500" },
    checkBg: { dark: "bg-emerald-500/10", light: "bg-emerald-50" },
    check: "text-emerald-500",
    statBg: { dark: "bg-emerald-500/[0.07]", light: "bg-emerald-50/70" },
    btn: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/15",
    btnLight:
      "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/15",
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
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const mode = isDark ? "dark" : "light";
  const isPopular = plan.popular;
  const isCurrent = activePlanIds?.includes(plan.id);
  const isFree = !plan.price_monthly || plan.price_monthly === 0;
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
        "relative flex flex-col rounded-2xl border transition-all duration-300",
        "p-4 lg:p-5",
        p.border[mode],
        p.bg[mode],
        isPopular
          ? "shadow-xl shadow-purple-500/10 ring-1 ring-purple-500/20 z-10 md:scale-[1.02]"
          : "shadow-sm hover:shadow-md",
        isCurrent ? "ring-2 ring-green-500/50" : "",
      ].join(" ")}
    >
      {/* ── Popular badge ── */}
      {isPopular && (
        <div className="absolute -top-3 inset-x-0 flex justify-center">
          <span className="inline-flex items-center gap-1.5 bg-linear-to-r from-purple-600 to-violet-600 text-white text-xs font-semibold tracking-wide uppercase px-4 py-1 rounded-full shadow-md shadow-purple-500/30">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}

      {/* ── Plan name ── */}
      <h3
        className={`text-center text-xs font-semibold tracking-[0.15em] uppercase ${p.title[mode]}`}
      >
        {plan.name}
      </h3>

      {/* ── Price ── */}
      <div className="flex items-baseline justify-center gap-1 mt-2">
        {isFree ? (
          <span
            className={`text-3xl lg:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Free
          </span>
        ) : (
          <>
            <span
              className={`text-3xl lg:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
            >
              ${plan.price_monthly}
            </span>
            <span
              className={`text-sm font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              /mo
            </span>
          </>
        )}
      </div>

      {!isFree && plan.price_yearly ? (
        <p
          className={`text-center text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          ${plan.price_yearly}/yr{" "}
          <span className="text-green-500 font-semibold">
            save $
            {((plan.price_monthly ?? 0) * 12 - plan.price_yearly).toFixed(0)}
          </span>
        </p>
      ) : null}

      {/* ── Description ── */}
      <p
        className={`text-center text-[13px] mt-2 leading-snug ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        {plan.description}
      </p>

      {/* ── Key metrics row ── */}
      {limits && (
        <div
          className={`flex items-center justify-around py-2 rounded-xl mt-3 ${p.statBg[mode]}`}
        >
          {aiVal !== undefined && (
            <div className="flex flex-col items-center gap-0.5">
              <Zap className={`w-3.5 h-3.5 ${p.accent[mode]}`} />
              <span
                className={`text-[13px] font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {fmtLimit(aiVal)}
              </span>
              <span
                className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                AI Req
              </span>
            </div>
          )}
          {teamVal !== undefined && (
            <div className="flex flex-col items-center gap-0.5">
              <Users className={`w-3.5 h-3.5 ${p.accent[mode]}`} />
              <span
                className={`text-[13px] font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {fmtLimit(teamVal)}
              </span>
              <span
                className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Members
              </span>
            </div>
          )}
          {storageVal !== undefined && (
            <div className="flex flex-col items-center gap-0.5">
              <HardDrive className={`w-3.5 h-3.5 ${p.accent[mode]}`} />
              <span
                className={`text-[13px] font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {storageVal === -1 ? "\u221E" : `${storageVal}GB`}
              </span>
              <span
                className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Storage
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Divider ── */}
      <div
        className={`h-px mt-3 mb-3 ${isDark ? "bg-white/6" : "bg-gray-100"}`}
      />

      {/* ── Features — 2 columns ── */}
      <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1.5 mb-4">
        <div className="space-y-1.5">
          {col1.map((f, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <div
                className={`mt-[3px] shrink-0 rounded-full p-[2px] ${p.checkBg[mode]}`}
              >
                <Check className={`w-2.5 h-2.5 ${p.check}`} />
              </div>
              <span
                className={`text-[12.5px] leading-snug ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                {f}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {col2.map((f, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <div
                className={`mt-[3px] shrink-0 rounded-full p-[2px] ${p.checkBg[mode]}`}
              >
                <Check className={`w-2.5 h-2.5 ${p.check}`} />
              </div>
              <span
                className={`text-[12.5px] leading-snug ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                {f}
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
          "w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
          isCurrent
            ? `border cursor-default ${isDark ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-green-200 bg-green-50 text-green-700"}`
            : isReadOnly
              ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed dark:bg-zinc-800/50 dark:text-gray-600 dark:border-zinc-800"
              : isDark
                ? p.btn
                : p.btnLight,
        ].join(" ")}
      >
        <span className="flex items-center justify-center gap-2">
          {isCurrent ? (
            <>
              <Check className="w-4 h-4" />
              Active Plan
            </>
          ) : isFree ? (
            "Get Started"
          ) : isPopular ? (
            <>
              Get Started
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            "Choose Plan"
          )}
          {isLoading && !isCurrent && (
            <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          )}
        </span>
      </motion.button>
    </motion.div>
  );
};
