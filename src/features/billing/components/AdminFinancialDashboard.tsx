import React, { useState, useMemo } from "react";
import { AlertsCard } from "./dashboard/AlertsCard";
import { FinancialHeader } from "./dashboard/FinancialHeader";
import { RevenueCard } from "./dashboard/RevenueCard";
import { MrrCard } from "./dashboard/MrrCard";
import { MetricCard } from "./dashboard/MetricCard";
import { GatewayControl } from "./dashboard/GatewayControl";
import { TaxRatesCard } from "./dashboard/TaxRatesCard";
import { useFinancialDashboard } from "../hooks/useFinancialDashboard";
import { useRealtimeDashboard } from "@/features/analytics/hooks/useRealtimeDashboard";
import { ConfigurePaymentGatewaysModal } from "./modals/ConfigurePaymentGatewaysModal";
import { ManageTaxRatesModal } from "./modals/ManageTaxRatesModal";
import { CriticalAlertsModal } from "./modals/CriticalAlertsModal";
import { TransactionLogsModal } from "./modals/TransactionLogsModal";
import { PaymentGateway } from "../types";

export const AdminFinancialDashboard: React.FC = () => {
  useRealtimeDashboard();
  const {
    metrics,
    totalRevenue,
    paidInvoices,
    refundedFunds,
    mrr,
    mrrGrowth,
    pendingRefunds,
    failedPayments,
    taxRates,
    stripeGatewayActive,
    refresh,
  } = useFinancialDashboard();

  // Modal States
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [activeAlertType, setActiveAlertType] = useState<
    "failed" | "refund_requested"
  >("failed");

  const gateways: PaymentGateway[] = useMemo(
    () => [
      {
        id: "stripe",
        name: "Stripe Gateway",
        logo: "/logos/stripe.svg",
        status: stripeGatewayActive ? "active" : "standby",
        apiKey: "sk_live_**********************abc123",
        webhookUrl: "https://api.celaest.com/v1/webhooks/stripe",
        testMode: false,
      },
      {
        id: "paypal",
        name: "PayPal Gateway",
        logo: "/logos/paypal.svg",
        status: "standby",
        apiKey: "client_id_**********************xyz789",
        webhookUrl: "https://api.celaest.com/v1/webhooks/paypal",
        testMode: true,
      },
    ],
    [stripeGatewayActive],
  );

  return (
    <div className="space-y-6">
      <FinancialHeader />

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueCard
            totalRevenue={totalRevenue}
            paidInvoices={paidInvoices}
            refundedFunds={refundedFunds}
          />
        </div>
        <MrrCard mrr={mrr} growth={mrrGrowth} />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} metric={metric} index={idx} />
        ))}
      </div>

      {/* Payment Gateway & Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GatewayControl
          gateways={gateways}
          onConfigure={() => setIsGatewayModalOpen(true)}
        />
        <AlertsCard
          pendingRefunds={pendingRefunds}
          failedPayments={failedPayments}
          onAlertClick={(type) => {
            setActiveAlertType(type);
            setIsAlertsModalOpen(true);
          }}
          onViewLogsClick={() => setIsTransactionsModalOpen(true)}
        />
      </div>

      <TaxRatesCard rates={taxRates} onManage={() => setIsTaxModalOpen(true)} />

      <ConfigurePaymentGatewaysModal
        isOpen={isGatewayModalOpen}
        onClose={() => setIsGatewayModalOpen(false)}
      />

      <ManageTaxRatesModal
        isOpen={isTaxModalOpen}
        onClose={() => setIsTaxModalOpen(false)}
      />
      <CriticalAlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        type={activeAlertType}
        onResolve={refresh}
      />

      <TransactionLogsModal
        isOpen={isTransactionsModalOpen}
        onClose={() => setIsTransactionsModalOpen(false)}
      />
    </div>
  );
};
