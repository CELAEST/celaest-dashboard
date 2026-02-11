import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { BillingModal } from "./shared/BillingModal";
import { Plan } from "../../types";
import { PlanCard } from "../ui/PlanCard";
import { useBilling } from "../../hooks/useBilling";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { billingApi } from "../../api/billing.api";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradePlanModal({ isOpen, onClose }: UpgradePlanModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { plans, subscription, isLoading: isBillingLoading } = useBilling();
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
      let response: any;
      if (subscription?.id) {
        // Upgrade existing subscription
        response = await billingApi.updateSubscription(
          currentOrg.id,
          session.accessToken,
          subscription.id,
          { plan_id: plan.id },
        );
      } else {
        // Create new subscription
        response = await billingApi.createSubscription(
          currentOrg.id,
          session.accessToken,
          {
            organization_id: currentOrg.id,
            plan_id: plan.id,
          },
        );
      }

      // Check for Stripe Checkout URL
      const checkoutUrl =
        response?.data?.checkout_url || response?.checkout_url;
      if (checkoutUrl) {
        toast.info("Redirecting to Stripe for payment...");
        window.location.href = checkoutUrl;
        return; // Don't close modal yet, we are leaving the page
      }

      toast.success(`Successfully activated ${plan.name} plan!`);
      onClose();
      // Optional: force reload to refresh all data
      window.location.reload();
    } catch (error: any) {
      console.error("Upgrade failed:", error);
      toast.error(error.message || "Failed to upgrade plan");
    } finally {
      setIsUpgrading(false);
    }
  };

  // Filter and sort plans if needed
  const displayPlans = plans
    .filter((p: Plan) => p.is_active && p.is_public)
    .sort((a: Plan, b: Plan) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((p: Plan) => ({
      ...p,
      // Frontend helper mappings
      price: p.price_monthly
        ? `${p.currency === "EUR" ? "€" : "$"}${p.price_monthly}`
        : "Custom",
      period: "/month",
      popular: p.code === "premium_seed" || p.code === "pro", // Some logic for popular tag
      color: (p.code === "premium_seed" ? "purple" : "blue") as
        | "blue"
        | "purple"
        | "emerald",
    }));

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-6xl bg-transparent! rounded-4xl shadow-none! border-0!"
      showCloseButton={false}
    >
      <div
        className={`relative w-full h-full rounded-4xl overflow-hidden flex flex-col shadow-2xl ${
          isDark
            ? "bg-[#0f172a] border border-white/10 shadow-purple-900/20"
            : "bg-white border border-gray-200 shadow-xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 inset-x-0 h-96 bg-linear-to-b from-purple-500/10 via-blue-500/5 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header - Compact */}
        <div className="relative px-4 sm:px-6 pt-4 sm:pt-6 pb-2 text-center shrink-0 z-10">
          <button
            onClick={onClose}
            className={`absolute right-3 top-3 sm:right-4 sm:top-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:scale-110 ${
              isDark
                ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5"
                : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900"
            }`}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span
              className={`inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-2 ${
                isDark
                  ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              Pricing Plans
            </span>
            <h2
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-1 sm:mb-2 tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Choose Your Growth Path
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Unlock powerful features and scale your business with flexible
            plans.
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="relative px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 z-10">
          {/* Small top padding for badge */}
          <div className="pt-5 sm:pt-6">
            {isBillingLoading ? (
              <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto items-stretch">
                {(displayPlans.length > 0 ? displayPlans : []).map(
                  (plan, index) => (
                    <PlanCard
                      key={plan.name}
                      plan={plan as any}
                      index={index}
                      onClose={onClose}
                      onSelect={() => handleUpgrade(plan)}
                      isLoading={isUpgrading}
                      currentPlanId={subscription?.plan_id}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </BillingModal>
  );
}
