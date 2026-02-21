import { useState, useEffect, useCallback } from "react";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { billingApi } from "../api/billing.api";
import { Subscription, SubscriptionUsage, Invoice, Plan } from "../types";
import { toast } from "sonner";

export interface BillingState {
  subscription: Subscription | null;
  plan: Plan | null;
  activePlanIds: string[];
  activePlans: Plan[];
  allSubscriptions: Subscription[]; // All subs including superseded
  usage: {
    licenses: { used: number; total: number; percent: number };
    apiCalls: { used: number; total: number; percent: number };
  };
  invoices: Invoice[];
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
}

export const useBilling = () => {
  const { currentOrg } = useOrgStore();
  const { session } = useAuth();
  const [state, setState] = useState<BillingState>({
    subscription: null,
    plan: null,
    activePlanIds: [],
    activePlans: [],
    allSubscriptions: [],
    usage: {
      licenses: { used: 0, total: 0, percent: 0 },
      apiCalls: { used: 0, total: 0, percent: 0 },
    },
    invoices: [],
    plans: [],
    isLoading: true,
    error: null,
  });

  const fetchBillingData = useCallback(async () => {
    if (!currentOrg?.id || !session?.accessToken) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Parallel fetching
      const [subsResponse, invoicesResponse, plansResponse] = await Promise.all([
        billingApi.getSubscriptions(currentOrg.id, session.accessToken),
        billingApi.getInvoices(currentOrg.id, session.accessToken),
        billingApi.getPlans(currentOrg.id, session.accessToken),
      ]);

      // 1. Process Subscription & Plan
      const allSubs = subsResponse.subscriptions;
      const activeSubs = allSubs.filter(
        (s) => s.status === "active" || s.status === "trial"
      );
      
      // Determine Effective Subscription (Highest Tier)
      const getPlanForSub = (sub: Subscription) => {
          if (sub.plan) return sub.plan;
          return plansResponse.plans.find(p => p.id === sub.plan_id);
      };

      const sortedSubs = [...activeSubs].sort((a, b) => {
          const planA = getPlanForSub(a);
          const planB = getPlanForSub(b);
          
          // Sort by tier (descending: higher is better)
          const tierA = planA?.tier || planA?.sort_order || 0;
          const tierB = planB?.tier || planB?.sort_order || 0;
          if (tierA !== tierB) return tierB - tierA;
          
          // Fallback: Price (descending)
          const priceA = planA?.price_monthly || 0;
          const priceB = planB?.price_monthly || 0;
          return priceB - priceA;
      });

      // The "effective" subscription is the one for the highest tier plan
      const activeSub = sortedSubs.length > 0 ? sortedSubs[0] : null;

      const activePlansList: Plan[] = [];
      const activePlanIdsList: string[] = [];

      // Map all active subs to plans
      activeSubs.forEach(sub => {
          let p: Plan | undefined;
          if (sub.plan) {
              p = sub.plan;
          } else {
              p = plansResponse.plans.find(plan => plan.id === sub.plan_id);
          }
          if (p) {
              activePlansList.push(p);
              activePlanIdsList.push(p.id);
          }
      });

      let currentPlan: Plan | null = null;
      if (activeSub) {
        if (activeSub.plan) {
            currentPlan = activeSub.plan;
        } else {
             currentPlan = plansResponse.plans.find(p => p.id === activeSub.plan_id) || null;
        }
      }
      
      // ... (Usage logic remains similar, maybe sum up usage from all active subs if needed? 
      // For now, let's keep usage tied to the "primary" active sub to avoid complexity, 
      // or sum distinct product usages. As per user request, we just need to SEE the plans as active.)

      // 2. Process Usage (if active sub exists)
      let apiUsageCount = 0;
      if (activeSub) {
        try {
          const usageData = await billingApi.getUsage(currentOrg.id, session.accessToken, activeSub.id);
          // Sum up 'ai_requests' metric
          if (Array.isArray(usageData)) {
            apiUsageCount = usageData
              .filter(u => u.metric_name === 'ai_requests')
              .reduce((acc, curr) => acc + curr.quantity, 0);
          }
        } catch (err) {
            console.warn("Failed to fetch usage:", err);
            // Don't fail the whole view for usage error
        }
      }

      // 3. Calculate Derived Metrics
      
      // Licenses
      const totalLicenses = activeSub?.quantity || 0; 
      const usedLicenses = activeSub?.metadata?.active_users ? Number(activeSub.metadata.active_users) : 0; 
      
      // API Limits (from Plan limits)
      const apiLimit = currentPlan?.limits?.api_calls_monthly ? Number(currentPlan.limits.api_calls_monthly) : 0;
      
      setState({
        subscription: activeSub,
        plan: currentPlan,
        activePlanIds: activePlanIdsList,
        activePlans: activePlansList,
        allSubscriptions: allSubs,
        usage: {
          licenses: {
            used: usedLicenses,
            total: totalLicenses,
            percent: totalLicenses > 0 ? Math.min((usedLicenses / totalLicenses) * 100, 100) : 0,
          },
          apiCalls: {
            used: apiUsageCount,
            total: apiLimit,
            percent: apiLimit > 0 ? Math.min((apiUsageCount / apiLimit) * 100, 100) : 0,
          },
        },
        invoices: invoicesResponse.invoices || [],
        plans: plansResponse.plans || [],
        isLoading: false,
        error: null,
      });

    } catch (err: any) {
      console.error("Billing fetch error:", err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "Failed to load billing information",
      }));
      toast.error("Failed to load billing information");
    }
  }, [currentOrg?.id, session?.accessToken]);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);

  return {
    ...state,
    refresh: fetchBillingData,
  };
};
