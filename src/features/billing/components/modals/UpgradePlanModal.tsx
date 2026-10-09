import { logger } from "@/lib/logger";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "@phosphor-icons/react";
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
import type { BillingCycle } from "../../types";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("plan");
  const requestedCycle = searchParams.get("billing_cycle") === "yearly" ? "yearly" : "monthly";
  const autoCheckoutRef = useRef(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(requestedCycle);
  const [activeMobilePlanCode, setActiveMobilePlanCode] = useState<string>("pro");
  const t = useTranslations("billing");

  const handleUpgrade = useCallback(async (plan: Plan) => {
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
          billing_cycle: billingCycle,
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
  }, [billingCycle, currentOrg?.id, onClose, session?.accessToken, session?.user.id, t]);

  const isRestricted = (() => {
    if (!currentOrg) return false;
    const isCelaest = currentOrg.slug === "celaest-official" || currentOrg.slug === "celaest" || currentOrg.slug?.toLowerCase().includes("celaest");
    if (isCelaest) return false;
    return currentOrg.role !== "owner" && currentOrg.role !== "super_admin" && currentOrg.role !== "admin";
  })();

  const displayPlans = useMemo(
    () => {
      const planColorMap: Record<string, "blue" | "purple" | "emerald"> = {
        starter: "blue",
        pro: "purple",
        enterprise: "emerald",
      };
      return plans
        .filter((p: Plan) => p.is_active && p.is_public)
        .sort((a: Plan, b: Plan) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((p: Plan) => ({
          ...p,
          popular: p.code === "pro",
          color: planColorMap[p.code] || "blue",
        }));
    },
    [plans],
  );

  useEffect(() => {
    setBillingCycle(requestedCycle);
  }, [requestedCycle]);

  useEffect(() => {
    if (!isOpen || !requestedPlan || autoCheckoutRef.current || isBillingLoading || isRestricted) return;
    const plan = displayPlans.find((p) => p.code === requestedPlan || p.slug === requestedPlan || p.id === requestedPlan);
    if (plan) {
      autoCheckoutRef.current = true;
      handleUpgrade(plan);
    }
  }, [displayPlans, handleUpgrade, isBillingLoading, isOpen, isRestricted, requestedPlan]);

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="w-[min(96vw,1280px)] max-w-none bg-transparent! rounded-3xl shadow-none! border-0!"
      showCloseButton={false}
    >
      <div
        className={`relative w-full max-h-[94vh] rounded-3xl overflow-hidden flex flex-col font-sans ${
          isDark
            ? "bg-[#09090C] border border-white/[0.08] shadow-[0_32px_96px_-12px_rgba(0,0,0,0.95)]"
            : "bg-white border border-gray-200 shadow-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tokyo Corner Accents */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-white/20 rounded-tl-sm pointer-events-none z-20" />
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-white/20 rounded-tr-sm pointer-events-none z-20" />
        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-white/20 rounded-bl-sm pointer-events-none z-20" />
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-white/20 rounded-br-sm pointer-events-none z-20" />

        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-40 w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10 shadow-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col w-full flex-1 min-h-0 pt-6 pb-6 px-4 sm:px-6 lg:px-8">
          {/* Floating Pill Toggle (Sin cápsula negra, componente sobrepuesto puro) */}
          <div className="flex flex-col items-center justify-center pb-5 shrink-0 z-20">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-transparent">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-black font-bold shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {t("monthly")}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "bg-white text-black font-bold shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span>{t("yearly")}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    billingCycle === "yearly"
                      ? "bg-black/10 text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  -20%
                </span>
              </button>
            </div>
          </div>

        {/* Mobile Plan Tab Switcher */}
        <div className="flex lg:hidden items-center justify-center w-full mb-2 shrink-0">
          <div className="grid grid-cols-3 rounded-xl p-1 w-full max-w-[320px] bg-[#0B0C10]/80 border border-white/15 backdrop-blur-xl">
            {displayPlans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setActiveMobilePlanCode(plan.code)}
                className={`rounded-lg py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeMobilePlanCode === plan.code
                    ? "bg-white text-black shadow-sm"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {plan.name}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid (Tarjetas Obsidian Glass flotando limpias en el espacio con espacio superior completo para el badge) */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar overflow-x-hidden pt-6 sm:pt-7 pb-6 px-2">
          {isBillingLoading ? (
            <CardGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-auto place-items-stretch items-stretch w-full">
              {displayPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`${activeMobilePlanCode === plan.code ? "block" : "hidden"} lg:block w-[min(100%,25rem)] lg:w-full lg:max-w-none h-full relative hover:z-30 transition-all`}
                >
                  <PlanCard
                    plan={plan}
                    index={index}
                    onClose={onClose}
                    onSelect={
                      isRestricted ? undefined : () => handleUpgrade(plan)
                    }
                    isLoading={isUpgrading}
                    activePlanIds={activePlanIds}
                    isReadOnly={isRestricted}
                    billingCycle={billingCycle}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </BillingModal>
  );
}
