import { logger } from "@/lib/logger";
import { useQuery } from "@tanstack/react-query";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { billingApi } from "../api/billing.api";
import { Subscription, Plan } from "../types";

import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export const useBilling = () => {
  const { currentOrg } = useOrgStore();
  const { session } = useAuth();
  const token = session?.accessToken;
  const orgId = currentOrg?.id;
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: orgId ? QUERY_KEYS.billing.profile(orgId) : QUERY_KEYS.billing.all,
    queryFn: async () => {
      if (!orgId || !token) throw new Error("Auth required");

      const [subsResponse, invoicesResponse, plansResponse] = await Promise.all([
        billingApi.getSubscriptions(orgId, token),
        billingApi.getInvoices(orgId, token).catch(e => {
          console.error("Failed to fetch invoices (fallback to []):", e);
          return { invoices: [] };
        }),
        billingApi.getPlans(orgId, token),
      ]);

      const allSubs = subsResponse.subscriptions;
      
      const getPlanForSub = (sub: Subscription): Plan | undefined => {
          if (sub.plan) return sub.plan;
          const catalogPlan = plansResponse.plans.find(p => p.id === sub.plan_id);
          if (catalogPlan) return catalogPlan;
          // Marketplace product licenses: build synthetic plan from metadata
          if (sub.metadata?.product_name) {
            return {
              id: sub.plan_id || sub.metadata.product_id as string || '',
              name: sub.metadata.product_name as string,
              code: 'marketplace_product',
              price_monthly: sub.metadata.product_price ? Number(sub.metadata.product_price) : undefined,
              currency: (sub.metadata.product_currency as string) || 'USD',
              tier: 0,
              sort_order: 0,
              is_active: true,
              is_public: false,
            } as Plan;
          }
          return undefined;
      };

      // Enrich every subscription with its plan data
      const enrichedSubs = allSubs.map(sub => ({
        ...sub,
        plan: getPlanForSub(sub) || sub.plan,
      }));

      const activeSubs = enrichedSubs.filter(
        (s) => s.status === "active" || s.status === "trial"
      );

      const sortedSubs = [...activeSubs].sort((a, b) => {
          const planA = getPlanForSub(a);
          const planB = getPlanForSub(b);
          const tierA = planA?.tier || planA?.sort_order || 0;
          const tierB = planB?.tier || planB?.sort_order || 0;
          if (tierA !== tierB) return tierB - tierA;
          const priceA = planA?.price_monthly || 0;
          const priceB = planB?.price_monthly || 0;
          return priceB - priceA;
      });

      const activeSub = sortedSubs.length > 0 ? sortedSubs[0] : null;

      const activePlansList: Plan[] = [];
      const activePlanIdsList: string[] = [];

      activeSubs.forEach(sub => {
          const p = sub.plan || plansResponse.plans.find(plan => plan.id === sub.plan_id);
          if (p) {
              activePlansList.push(p);
              activePlanIdsList.push(p.id);
          }
      });

      const currentPlan = activeSub ? (activeSub.plan || plansResponse.plans.find(p => p.id === activeSub.plan_id) || null) : null;
      


      const totalLicenses = activeSub?.quantity || 0; 
      const metadataUsers = activeSub?.metadata?.active_users ? Number(activeSub.metadata.active_users) : 0;
      // Fallback: if active_users metadata isn't tracked, count active/trial subscriptions as used
      const activeSubCount = allSubs.filter(s => s.status === "active" || s.status === "trial").length;
      const usedLicenses = metadataUsers > 0 ? metadataUsers : Math.min(activeSubCount, totalLicenses || activeSubCount);
      const apiLimit = currentPlan?.limits?.api_calls_monthly ? Number(currentPlan.limits.api_calls_monthly) : 0;
      
      return {
        subscription: activeSub,
        plan: currentPlan,
        activePlanIds: activePlanIdsList,
        activePlans: activePlansList,
        allSubscriptions: enrichedSubs,
        usage: {
          licenses: {
            used: usedLicenses,
            total: totalLicenses,
            percent: totalLicenses > 0 ? Math.min((usedLicenses / totalLicenses) * 100, 100) : 0,
          },
          apiCalls: {
            used: 0,
            total: apiLimit,
            percent: 0,
          },
        },
        invoices: invoicesResponse.invoices || [],
        plans: plansResponse.plans || [],
      };
    },
    enabled: !!orgId && !!token,
  });

  const activeSubId = data?.subscription?.id;

  const usageQuery = useQuery({
    queryKey: ['billing_usage', orgId, activeSubId],
    queryFn: async () => {
      if (!orgId || !token || !activeSubId) return 0;
      try {
        const usageData = await billingApi.getUsage(orgId, token, activeSubId);
        if (Array.isArray(usageData)) {
          return usageData
            .filter(u => u.metric_name === 'ai_requests')
            .reduce((acc, curr) => acc + curr.quantity, 0);
        }
        return 0;
      } catch (err) {
        logger.warn("Failed to fetch usage:", err);
        return 0;
      }
    },
    enabled: !!orgId && !!token && !!activeSubId
  });

  return {
    ...(data || {
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
    }),
    usage: data?.usage ? {
      ...data.usage,
      apiCalls: {
        used: usageQuery.data || 0,
        total: data.usage.apiCalls.total,
        percent: data.usage.apiCalls.total > 0 ? Math.min(((usageQuery.data || 0) / data.usage.apiCalls.total) * 100, 100) : 0,
      }
    } : {
      licenses: { used: 0, total: 0, percent: 0 },
      apiCalls: { used: 0, total: 0, percent: 0 },
    },
    isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    refresh: refetch,
  };
};
