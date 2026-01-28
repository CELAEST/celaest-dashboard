"use client";

import React, { useState } from "react";
import { useFinancialDashboard } from "../../hooks/useFinancialDashboard";
import { GatewayControl } from "../dashboard/GatewayControl";
import { AlertsCard } from "../dashboard/AlertsCard";
import { TaxRatesCard } from "../dashboard/TaxRatesCard";
import { ConfigurePaymentGatewaysModal } from "../modals/ConfigurePaymentGatewaysModal";
import { ManageTaxRatesModal } from "../modals/ManageTaxRatesModal";

export const AdminControlsView: React.FC = () => {
  const [isConfigureGatewaysOpen, setIsConfigureGatewaysOpen] = useState(false);
  const [isManageTaxRatesOpen, setIsManageTaxRatesOpen] = useState(false);

  const { pendingRefunds, failedPayments, taxRates } = useFinancialDashboard();

  return (
    <div className="h-full w-full p-4 flex flex-col min-h-0">
      {/* Bento Control Grid - Stack on Mobile, strict Grid on Desktop */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-4 min-h-0">
        <div className="h-full min-h-0">
          <GatewayControl
            onConfigure={() => setIsConfigureGatewaysOpen(true)}
            className="h-full"
          />
        </div>
        <div className="h-full min-h-0">
          <AlertsCard
            pendingRefunds={pendingRefunds}
            failedPayments={failedPayments}
            className="h-full"
          />
        </div>
        <div className="h-full min-h-0">
          <TaxRatesCard
            rates={taxRates}
            onManage={() => setIsManageTaxRatesOpen(true)}
            className="h-full"
          />
        </div>
      </div>

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
