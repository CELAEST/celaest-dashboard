import { useState, useEffect } from "react";
import { Plan } from "../components/tabs/PlansBilling/PlanCards";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { billingApi } from "@/features/billing/api/billing.api";

/**
 * useBillingSettings — Dynamic Product Configuration
 *
 * Fetches plans and current subscription from the backend.
 */
export const useBillingSettings = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "annually",
  );
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [nextBillingDate, setNextBillingDate] = useState<string>("N/A");
  const [isLoading, setIsLoading] = useState(true);

  const { session } = useAuthStore();
  const { currentOrg } = useOrgStore();

  useEffect(() => {
    const fetchBillingData = async () => {
      if (!session?.accessToken || !currentOrg?.id) return;

      try {
        setIsLoading(true);
        const plansRes = await billingApi.getPlans(currentOrg.id, session.accessToken);
        const subsRes = await billingApi.getSubscriptions(currentOrg.id, session.accessToken);
        
        const activeSub = subsRes.subscriptions.find(s => s.status === 'active');
        if (activeSub) {
          const endDate = new Date(activeSub.current_period_end);
          setNextBillingDate(endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
        }

        const mappedPlans: Plan[] = plansRes.plans.map(p => {
          const isCurrent = activeSub ? p.id === activeSub.plan_id : p.code === 'starter';
          const monthlyPrice = p.price_monthly?.toString() || "0";
          const yearlyPrice = p.price_yearly ? (p.price_yearly / 12).toString() : "0";

          const planData = {
            id: p.id,
            name: p.name,
            price: billingCycle === "monthly" ? monthlyPrice : yearlyPrice,
            desc: p.description || "",
            features: p.features || [],
            current: isCurrent,
            popular: p.code === 'pro',
          };
          if (isCurrent) setActivePlan(planData);
          return planData;
        });

        setPlans(mappedPlans);
      } catch (error) {
        console.error("Failed to fetch billing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingData();
  }, [session?.accessToken, currentOrg?.id, billingCycle]);

  return {
    billingCycle,
    setBillingCycle,
    plans,
    activePlan,
    nextBillingDate,
    isLoading,
  };
};
