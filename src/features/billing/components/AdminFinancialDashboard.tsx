import React, { useState, useMemo } from "react";
import { AlertsCard } from "./dashboard/AlertsCard";
import { FinancialHeader } from "./dashboard/FinancialHeader";
import { RevenueCard } from "./dashboard/RevenueCard";
import { MrrCard } from "./dashboard/MrrCard";
import { MetricCard } from "./dashboard/MetricCard";
import { GatewayControl } from "./dashboard/GatewayControl";
import { TaxRatesCard } from "./dashboard/TaxRatesCard";
import { useFinancialDashboard } from "../hooks/useFinancialDashboard";
import { usePaymentGateways } from "../hooks/usePaymentGateways";
import { ConfigurePaymentGatewaysModal } from "./modals/ConfigurePaymentGatewaysModal";
import { ManageTaxRatesModal } from "./modals/ManageTaxRatesModal";
import { CriticalAlertsModal } from "./modals/CriticalAlertsModal";
import { TransactionLogsModal } from "./modals/TransactionLogsModal";
import { PaymentGateway } from "../types";
import { useTranslations } from "next-intl";

export const AdminFinancialDashboard: React.FC = () => {
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
    creemGatewayActive,
    mercadoPagoGatewayActive,
    refresh,
  } = useFinancialDashboard();
  const { gateways: liveGateways } = usePaymentGateways();

  // Modal States
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [activeAlertType, setActiveAlertType] = useState<
    "failed" | "refund_requested"
  >("failed");
  const t = useTranslations("billing");

  const gateways: PaymentGateway[] = useMemo(() => {
    if (liveGateways.length > 0) {
      return liveGateways;
    }
    return [
      {
        id: "creem",
        name: t("creem_gateway"),
        logo: "creem",
        status: creemGatewayActive ? "active" : "standby",
        apiKey: "",
        webhookUrl:
          "https://celaest-back.onrender.com/api/v1/public/payments/webhooks/creem",
        testMode: false,
      },
      {
        id: "mercadopago",
        name: t("mercadopago_gateway"),
        logo: "mercadopago",
        status: mercadoPagoGatewayActive ? "active" : "standby",
        apiKey: "",
        webhookUrl:
          "https://celaest-back.onrender.com/api/v1/public/payments/webhooks/mercadopago",
        testMode: false,
      },
      {
        id: "stripe",
        name: t("stripe_gateway"),
        logo: "stripe",
        status: stripeGatewayActive ? "active" : "disabled",
        apiKey: "",
        webhookUrl:
          "https://celaest-back.onrender.com/api/v1/public/payments/webhook",
        testMode: true,
      },
    ];
  }, [
    liveGateways,
    creemGatewayActive,
    mercadoPagoGatewayActive,
    stripeGatewayActive,
    t,
  ]);

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
