import { useMemo } from "react";
import {
  Users,
  Percent,
  Zap,
} from "lucide-react";
import { FinancialMetric } from "../types";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useAdminStatsQuery, useTaxRatesQuery } from "./useBillingQuery";

export const useFinancialDashboard = () => {
  const { session } = useAuth();
  const token = session?.accessToken ?? null;

  // Query hooks
  const statsQuery = useAdminStatsQuery(token);
  const taxRatesQuery = useTaxRatesQuery(token);

  const stats = useMemo(() => ({
    totalRevenue: statsQuery.data?.totalRevenue ?? 0,
    paidInvoices: statsQuery.data?.paidInvoices ?? 0,
    refundedFunds: statsQuery.data?.refundedFunds ?? 0,
    mrr: statsQuery.data?.mrr ?? 0,
    mrrGrowth: statsQuery.data?.mrrGrowth ?? 0,
    pendingRefunds: statsQuery.data?.pendingRefunds ?? 0,
    failedPayments: statsQuery.data?.failedPayments ?? 0,
    stripeGatewayActive: statsQuery.data?.stripeGatewayActive ?? false,
  }), [statsQuery.data]);

  const metrics: FinancialMetric[] = useMemo(() => [
    {
      icon: Users,
      label: "ACTIVE SUBSCRIPTIONS",
      value: String(stats.paidInvoices),
      change: "+0",
      changeLabel: "this month",
      color: "blue",
    },
    {
      icon: Percent,
      label: "CHURN RATE",
      value: "0%",
      change: "0%",
      changeLabel: "stable",
      color: "yellow",
    },
    {
      icon: Zap,
      label: "ARPU (AVG REVENUE PER USER)",
      value: `$${stats.paidInvoices > 0 ? (stats.totalRevenue / stats.paidInvoices).toFixed(2) : "0"}`,
      change: "Avg/mo",
      changeLabel: "per user average",
      color: "purple",
    },
  ], [stats]);

  return {
    ...stats,
    metrics,
    taxRates: taxRatesQuery.data ?? [],
    isLoading: statsQuery.isLoading || taxRatesQuery.isLoading,
    refresh: () => {
      statsQuery.refetch();
      taxRatesQuery.refetch();
    },
  };
};
