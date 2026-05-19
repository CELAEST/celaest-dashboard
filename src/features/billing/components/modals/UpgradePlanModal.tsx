import { logger } from "@/lib/logger";
import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { BillingModal } from "./shared/BillingModal";
import { Plan } from "../../types";
import { PlanCard } from "../ui/PlanCard";
import { CardGridSkeleton } from "@/components/ui/skeletons";
import { useBilling } from "../../hooks/useBilling";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { billingApi } from "../../api/billing.api";
import { ApiError } from "@/lib/api-client";
import { useTranslations } from "next-intl";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradePlanModal({ isOpen, onClose }: UpgradePlanModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { plans, activePlanIds, isLoading: isBillingLoading } = useBilling();
  const { currentOrg } = useOrgStore();
  const { session } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const t = useTranslations("billing");

  const handleUpgrade = async (plan: Plan) => {
    if (!currentOrg?.id || !session?.accessToken) {
      toast.error(t("org_session_missing"));
      return;
    }

    setIsUpgrading(true);
    try {
      const response: {
        data?: { checkout_url?: string };
        checkout_url?: string;
      } = await billingApi.createSubscription(
        currentOrg.id,
        session.accessToken,
        {
          organization_id: currentOrg.id,
          user_id: session.user.id,
          plan_id: plan.id,
          ...(plan.productId || plan.product_id
            ? { product_id: plan.productId || plan.product_id }
            : {}),
        },
      );

      // Check for Stripe Checkout URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resAny = response as any;
      const checkoutUrl =
        resAny?.data?.checkout_url ||
        resAny?.checkout_url ||
        resAny?.data?.subscription?.checkout_url ||
        resAny?.subscription?.checkout_url ||
        resAny?.url ||
        resAny?.data?.url;

      if (checkoutUrl && typeof checkoutUrl === "string") {
        toast.info(t("redirecting_to_stripe"));
        window.location.href = checkoutUrl;
        return; // Don't close modal yet, we are leaving the page
      }

      toast.success(t("plan_activated", { name: plan.name }));
      onClose();
      // Optional: force reload to refresh all data
      window.location.reload();
    } catch (error: unknown) {
      // Handle "already exists" as a success case (409 Conflict)
      if (
        error instanceof ApiError &&
        (error.status === 409 ||
          error.code?.toLowerCase().includes("already exists"))
      ) {
        toast.success(t("plan_already_active", { name: plan.name }));
        onClose();
        window.location.reload();
        return;
      }
      logger.error("Upgrade failed:", error);
      toast.error(
        error instanceof Error ? error.message : t("upgrade_failed"),
      );
    } finally {
      setIsUpgrading(false);
    }
  };

  const isRestricted = (() => {
    if (!currentOrg) return false;
    const isCelaest = currentOrg.slug === "celaest-official" || currentOrg.slug === "celaest" || currentOrg.slug?.toLowerCase().includes("celaest");
    if (isCelaest) return false;
    return currentOrg.role !== "owner" && currentOrg.role !== "super_admin" && currentOrg.role !== "admin";
  })();

  // Funnel and sort plans — map color by plan code
  const planColorMap: Record<string, "blue" | "purple" | "emerald"> = {
    starter: "blue",
    pro: "purple",
    enterprise: "emerald",
  };

  const displayPlans = plans
    .filter((p: Plan) => p.is_active && p.is_public)
    .sort((a: Plan, b: Plan) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((p: Plan) => ({
      ...p,
      popular: p.code === "pro",
      color: planColorMap[p.code] || "blue",
    }));

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[95vw] xl:max-w-7xl bg-transparent! rounded-3xl shadow-none! border-0!"
      showCloseButton={false}
    >
      <div
        className={`relative w-full rounded-3xl overflow-hidden flex flex-col ${
          isDark
            ? "bg-[#080a0e] border border-white/10 shadow-2xl"
            : "bg-white border border-gray-200 shadow-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {isDark && (
          <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-50">
            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
                maskImage: "radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 100%)",
              }}
            />
            {/* Subtle glow orbs */}
            <div className="absolute top-[-10%] left-1/4 w-125 h-100 bg-cyan-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-1/4 w-100 h-75 bg-purple-500/15 rounded-full blur-[100px]" />
          </div>
        )}

        {/* Content wrapper with z-index to stay above background */}
        <div className="relative z-10 flex flex-col w-full h-full">
          {/* Header */}
          <div className="relative px-5 pt-8 pb-4 text-center shrink-0">
            <button
              onClick={onClose}
              className={`absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-30 ${
                isDark
                  ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200"
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            <motion.h2
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black italic tracking-tighter uppercase mb-1"
            >
              <span className={isDark ? "text-white" : "text-gray-900"}>{t("choose_your_plan").split(' ')[0]} </span>
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>{t("choose_your_plan").split(' ').slice(1).join(' ')}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className={`text-[8px] sm:text-[10px] lg:text-xs font-mono uppercase tracking-[0.2em] mt-1 sm:mt-2 ${
                isDark ? "text-cyan-400/70" : "text-cyan-600/70"
              }`}
            >
              {t("scale_your_business")}
            </motion.p>
          </div>

          {/* Plans Grid */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-2">
            {isBillingLoading ? (
              <CardGridSkeleton count={3} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mx-auto items-stretch max-w-sm lg:max-w-none">
                {displayPlans.map((plan, index) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    index={index}
                    onClose={onClose}
                    onSelect={
                      isRestricted ? undefined : () => handleUpgrade(plan)
                    }
                    isLoading={isUpgrading}
                    activePlanIds={activePlanIds}
                    isReadOnly={isRestricted}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </BillingModal>
  );
}
