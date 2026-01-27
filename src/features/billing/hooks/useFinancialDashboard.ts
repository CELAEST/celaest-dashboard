import {
  Users,
  Percent,
  Zap,
} from "lucide-react";
import { FinancialMetric, TaxRate } from "../types";

export const useFinancialDashboard = () => {
  // Mock data - would typically come from an API
  const stats = {
    totalRevenue: 47850,
    paidInvoices: 148,
    refundedFunds: 2890,
    mrr: 47850,
    mrrGrowth: 12.5,
    pendingRefunds: 3,
    failedPayments: 7,
  };

  const metrics: FinancialMetric[] = [
    {
      icon: Users,
      label: "ACTIVE SUBSCRIPTIONS",
      value: "160",
      change: "+18",
      changeLabel: "this month",
      color: "blue",
    },
    {
      icon: Percent,
      label: "CHURN RATE",
      value: "2.3%",
      change: "-0.4%",
      changeLabel: "improvement",
      color: "yellow",
    },
    {
      icon: Zap,
      label: "ARPU (AVG REVENUE PER USER)",
      value: "$299",
      change: "Avg/mo",
      changeLabel: "per user average",
      color: "purple",
    },
  ];

  const taxRates: TaxRate[] = [
    {
      id: "1",
      country: "United States",
      rate: "0",
      code: "US",
      vatType: "Sales Tax",
      isActive: true,
    },
    {
      id: "2",
      country: "European Union",
      rate: "21",
      code: "EU",
      vatType: "VAT",
      isActive: true,
    },
    {
      id: "3",
      country: "United Kingdom",
      rate: "20",
      code: "UK",
      vatType: "VAT",
      isActive: true,
    },
  ];

  return {
    ...stats,
    metrics,
    taxRates,
  };
};
