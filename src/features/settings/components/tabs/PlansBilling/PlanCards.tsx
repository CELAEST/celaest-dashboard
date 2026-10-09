import { logger } from "@/lib/logger";
import React, { memo } from "react";
import { Check } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { billingApi } from "@/features/billing/api/billing.api";
import { useTranslations } from "next-intl";
import type { BillingCycle } from "@/features/billing/types";

export interface Plan {
  id: string;
  name: string;
  price: string;
  desc: string;
  features: string[];
  current: boolean;
  popular?: boolean;
}

interface PlanCardsProps {
  plans: Plan[];
  billingCycle: BillingCycle;
}

export const PlanCards: React.FC<PlanCardsProps> = memo(({ plans, billingCycle }) => {
  const { isDark } = useTheme();
  const { session } = useAuthStore();
  const { currentOrg } = useOrgStore();
  const t = useTranslations("settings");

  const handleUpgrade = async (plan: Plan) => {
    if (plan.current) return;

    if (!session?.accessToken || !currentOrg?.id) {
      toast.error(t("auth_required"));
      return;
    }

    try {
      const promise = billingApi.createSubscription(
        currentOrg.id,
        session.accessToken,
        {
          plan_id: plan.id,
          organization_id: currentOrg.id,
          product_id: plan.id, // Backend currently uses plan_id as product_id in some places
          billing_cycle: billingCycle,
        },
      );

      toast.promise(promise, {
        loading: t("preparing_upgrade", { plan: plan.name }),
        success: (res: { checkout_url?: string }) => {
          if (res.checkout_url) {
            window.location.href = res.checkout_url;
            return t("redirecting_stripe");
          }
          return t("plan_activated", { plan: plan.name });
        },
        error: (err: Error) => {
          logger.error("Upgrade failed:", err);
          return t("upgrade_failed");
        },
      });
    } catch (error: unknown) {
      logger.error("Upgrade error:", error);
    }
  };

  const getTierColor = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("enterprise")) return "text-amber-400";
    if (lower.includes("pro")) return "text-violet-400";
    if (lower.includes("starter") || lower.includes("basic")) return "text-sky-400";
    return isDark ? "text-white" : "text-gray-900";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative p-5 sm:p-6 rounded-2xl border transition-colors ${
            plan.current
              ? isDark
                ? "border-white/20 bg-white/[0.04] shadow-xl shadow-black/40"
                : "border-gray-900 bg-gray-50 shadow-md"
              : isDark
                ? "border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl hover:border-white/10"
                : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          {plan.popular && (
            <span className={`absolute -top-2.5 left-5 px-2.5 py-0.5 rounded border text-[9px] font-mono uppercase tracking-[0.18em] ${
              isDark
                ? "bg-white/[0.08] text-white border-white/15 backdrop-blur-md"
                : "bg-gray-900 text-white border-gray-900"
            }`}>
              {t("popular")}
            </span>
          )}
          <h4
            className={`font-bold font-jakarta text-base mb-1 ${getTierColor(plan.name)}`}
          >
            {plan.name}
          </h4>
          <div className="flex items-baseline gap-1 mb-3">
            <span
              className={`text-2xl font-black font-jetbrains tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {plan.price}
            </span>
            {plan.price !== "0" && plan.price !== "Custom" && (
              <span className={`text-xs font-mono ${isDark ? "text-white/40" : "text-gray-500"}`}>
                {t("per_month")}
              </span>
            )}
          </div>
          <p
            className={`text-xs mb-6 min-h-[32px] ${
              isDark ? "text-white/50" : "text-gray-500"
            }`}
          >
            {plan.desc}
          </p>
          <ul className="space-y-2.5 mb-6">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check
                  className={`w-3.5 h-3.5 shrink-0 ${
                    plan.current ? "text-white" : isDark ? "text-white/40" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs ${
                    isDark ? "text-white/70" : "text-gray-700"
                  }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => handleUpgrade(plan)}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              plan.current
                ? isDark
                  ? "bg-white/[0.04] border border-white/10 text-white/50 cursor-default font-mono uppercase tracking-wider text-[11px]"
                  : "bg-gray-100 border border-gray-200 text-gray-400 cursor-default font-mono uppercase tracking-wider text-[11px]"
                : isDark
                  ? "bg-white text-black hover:bg-neutral-200 shadow-xs active:scale-[0.99]"
                  : "bg-gray-900 text-white hover:bg-gray-800 shadow-xs active:scale-[0.99]"
            }`}
          >
            {plan.current ? t("current_plan_btn") : t("upgrade")}
          </button>
        </div>
      ))}
    </div>
  );
});

PlanCards.displayName = "PlanCards";
