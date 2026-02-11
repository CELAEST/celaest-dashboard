import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Percent,
  Zap,
} from "lucide-react";
import { FinancialMetric, TaxRate, GlobalFinancialStats } from "../types";
import { billingApi } from "../api/billing.api";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { toast } from "sonner";

export const useFinancialDashboard = () => {
  const { session } = useAuth();
  const [stats, setStats] = useState<GlobalFinancialStats>({
    totalRevenue: 0,
    paidInvoices: 0,
    refundedFunds: 0,
    mrr: 0,
    mrrGrowth: 0,
    pendingRefunds: 0,
    failedPayments: 0,
    stripeGatewayActive: false,
  });
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!session?.accessToken) return;

    setIsLoading(true);
    try {
      const [statsData, taxData] = await Promise.all([
        billingApi.getAdminStats(session.accessToken),
        billingApi.getAdminTaxRates(session.accessToken),
      ]);

      setStats(statsData);
      setTaxRates(taxData);
    } catch (err: any) {
      console.error("Financial dashboard fetch error:", err);
      toast.error("Failed to load financial dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const metrics: FinancialMetric[] = [
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
  ];

  return {
    ...stats,
    metrics,
    taxRates,
    isLoading,
    refresh: fetchData,
  };
};
