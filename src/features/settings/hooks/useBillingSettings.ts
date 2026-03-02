import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plan } from "../components/tabs/PlansBilling/PlanCards";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { billingApi } from "@/features/billing/api/billing.api";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

/**
 * useBillingSettings — Dynamic Product Configuration
 *
 * Fetches plans and current subscription from the backend.
 */
export const useBillingSettings = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "annually",
  );

  const { session } = useAuthStore();
  const { currentOrg } = useOrgStore();
  const token = session?.accessToken;
  const orgId = currentOrg?.id;

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.billing.all, "settings", orgId, billingCycle],
    queryFn: async () => {
      if (!token || !orgId) return null;

      const plansRes = await billingApi.getPlans(orgId, token);
      const subsRes = await billingApi.getSubscriptions(orgId, token);
      
      const activeSubs = subsRes.subscriptions.filter(s => s.status === 'active' || s.status === 'trial');
      const activePlanIds = activeSubs.map(s => s.plan_id);
      const activeSub = activeSubs.length > 0 ? activeSubs[0] : null;

      let nextBillingDate = "N/A";
      if (activeSub) {
        const endDate = new Date(activeSub.current_period_end);
        nextBillingDate = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }

      const mappedPlans: Plan[] = plansRes.plans.map(p => {
        const isCurrent = activePlanIds.includes(p.id) || (activeSubs.length === 0 && p.code === 'starter');
        const monthlyPrice = p.price_monthly?.toString() || "0";
        const yearlyPrice = p.price_yearly ? (p.price_yearly / 12).toString() : "0";

        return {
          id: p.id,
          name: p.name,
          price: billingCycle === "monthly" ? monthlyPrice : yearlyPrice,
          desc: p.description || "",
          features: p.features || [],
          current: isCurrent,
          popular: p.code === 'pro',
        };
      });

      const activePlan = activeSub 
        ? mappedPlans.find(p => p.id === activeSub.plan_id) || null 
        : null;

      return { plans: mappedPlans, activePlan, nextBillingDate };
    },
    enabled: !!token && !!orgId,
  });

  return {
    billingCycle,
    setBillingCycle,
    plans: data?.plans || [],
    activePlan: data?.activePlan || null,
    nextBillingDate: data?.nextBillingDate || "N/A",
    isLoading,
  };
};
