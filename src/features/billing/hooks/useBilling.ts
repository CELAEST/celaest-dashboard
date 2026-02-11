import { useState, useEffect, useCallback } from "react";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { billingApi } from "../api/billing.api";
import { Subscription, SubscriptionUsage, Invoice, Plan } from "../types";
import { toast } from "sonner";

export interface BillingState {
  subscription: Subscription | null;
  plan: Plan | null;
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
      const activeSub = subsResponse.subscriptions.find(
        (s) => s.status === "active" || s.status === "trial"
      ) || null;

      let currentPlan: Plan | null = null;
      if (activeSub) {
        // Find plan details from the plans list or use expanded plan from sub if available
        if (activeSub.plan) {
            currentPlan = activeSub.plan;
        } else {
             // Fallback: match by ID
             currentPlan = plansResponse.plans.find(p => p.id === activeSub.plan_id) || null;
        }
      }

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
      // Assuming 'quantity' in subscription refers to seats/licenses
      const totalLicenses = activeSub?.quantity || 0; 
      const usedLicenses = activeSub?.metadata?.active_users ? Number(activeSub.metadata.active_users) : 0; 
      
      // API Limits (from Plan limits)
      const apiLimit = currentPlan?.limits?.api_calls_monthly ? Number(currentPlan.limits.api_calls_monthly) : 0;
      
      setState({
        subscription: activeSub,
        plan: currentPlan,
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
