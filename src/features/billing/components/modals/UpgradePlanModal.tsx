import { logger } from "@/lib/logger";
import { useState } from "react";
import { X } from "lucide-react";
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

  const handleUpgrade = async (plan: Plan) => {
    if (!currentOrg?.id || !session?.accessToken) {
      toast.error("Organization or session information missing");
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
        toast.info("Redirecting to Stripe for payment...");
        window.location.href = checkoutUrl;
        return; // Don't close modal yet, we are leaving the page
      }

      toast.success(`Successfully activated ${plan.name} plan!`);
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
        toast.success(`${plan.name} plan is already active!`);
        onClose();
        window.location.reload();
        return;
      }
      logger.error("Upgrade failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upgrade plan",
      );
    } finally {
      setIsUpgrading(false);
    }
  };

  const isRestricted =
    currentOrg?.slug !== "celaest-official" &&
    currentOrg?.role !== "owner" &&
    currentOrg?.role !== "super_admin";

  // Filter and sort plans — map color by plan code
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
        className={`relative w-full rounded-2xl flex flex-col ${
          isDark
            ? "bg-[#0c1221] border border-white/6 shadow-2xl"
            : "bg-white border border-gray-200 shadow-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-5 pt-3 pb-1.5 text-center shrink-0">
          <button
            onClick={onClose}
            className={`absolute right-3 top-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              isDark
                ? "hover:bg-white/10 text-gray-500 hover:text-white"
                : "hover:bg-gray-100 text-gray-400 hover:text-gray-900"
            }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <motion.h2
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Choose Your Plan
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className={`text-xs mt-1 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Scale your business with the right plan for your needs.
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="px-3 sm:px-5 lg:px-6 pb-4 pt-3">
          {isBillingLoading ? (
            <CardGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 mx-auto items-stretch">
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
    </BillingModal>
  );
}
