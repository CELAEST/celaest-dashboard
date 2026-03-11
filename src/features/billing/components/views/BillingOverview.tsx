import React from "react";
import { SubscriptionManager } from "../SubscriptionManager";
import { PaymentMethodsCard } from "../PaymentMethodsCard";
import { LicensesList } from "../LicensesList";

export const BillingOverview = () => {
  return (
    <div className="h-full min-h-0 w-full flex flex-col p-4 gap-3 overflow-y-auto lg:overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
      {/* Left column: Subscription + Payment Methods stacked */}
      <div className="flex flex-col gap-3 min-h-0">
        <div className="shrink-0">
          <SubscriptionManager />
        </div>
        <div className="flex-1 min-h-0">
          <PaymentMethodsCard />
        </div>
      </div>

      {/* Right column: Licenses full height */}
      <div className="min-h-0 h-full">
        <LicensesList />
      </div>
    </div>
  );
};
