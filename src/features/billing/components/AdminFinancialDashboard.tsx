"use client";

import React, { useState } from "react";
import { useFinancialDashboard } from "../hooks/useFinancialDashboard";
import { FinancialHeader } from "./dashboard/FinancialHeader";
import { RevenueCard } from "./dashboard/RevenueCard";
import { MrrCard } from "./dashboard/MrrCard";
import { MetricCard } from "./dashboard/MetricCard";
import { GatewayControl } from "./dashboard/GatewayControl";
import { AlertsCard } from "./dashboard/AlertsCard";
import { TaxRatesCard } from "./dashboard/TaxRatesCard";
import { ConfigurePaymentGatewaysModal } from "./modals/ConfigurePaymentGatewaysModal";
import { ManageTaxRatesModal } from "./modals/ManageTaxRatesModal";

export const AdminFinancialDashboard: React.FC = () => {
  const [isConfigureGatewaysOpen, setIsConfigureGatewaysOpen] = useState(false);
  const [isManageTaxRatesOpen, setIsManageTaxRatesOpen] = useState(false);

  const {
    totalRevenue,
    paidInvoices,
    refundedFunds,
    mrr,
    mrrGrowth,
    pendingRefunds,
    failedPayments,
    metrics,
    taxRates,
  } = useFinancialDashboard();

  return (
    <div className="space-y-6">
      {/* God Mode Banner */}
      <FinancialHeader />

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueCard
          totalRevenue={totalRevenue}
          paidInvoices={paidInvoices}
          refundedFunds={refundedFunds}
        />
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
        <GatewayControl onConfigure={() => setIsConfigureGatewaysOpen(true)} />
        <AlertsCard
          pendingRefunds={pendingRefunds}
          failedPayments={failedPayments}
        />
      </div>

      {/* Tax Rate Configuration */}
      <TaxRatesCard
        rates={taxRates}
        onManage={() => setIsManageTaxRatesOpen(true)}
      />

      <ConfigurePaymentGatewaysModal
        isOpen={isConfigureGatewaysOpen}
        onClose={() => setIsConfigureGatewaysOpen(false)}
      />

      <ManageTaxRatesModal
        isOpen={isManageTaxRatesOpen}
        onClose={() => setIsManageTaxRatesOpen(false)}
      />
    </div>
  );
};
