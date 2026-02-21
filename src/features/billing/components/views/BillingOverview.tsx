import React from "react";
import { SubscriptionManager } from "../SubscriptionManager";
import { PaymentMethodsCard } from "../PaymentMethodsCard";
import { LicensesList } from "../LicensesList";

export const BillingOverview = () => {
  return (
    <div className="h-full min-h-0 w-full flex flex-col pt-2">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full min-h-0">
        {/* Left Column: Subscription Plan */}
        <div className="flex flex-col min-h-0 h-full">
          <SubscriptionManager />
        </div>

        {/* Right Column: Licenses + Payment Methods */}
        <div className="flex flex-col min-h-0 h-full gap-6">
          <div className="flex-1 min-h-0">
            <LicensesList />
          </div>
          <div className="shrink-0">
            <PaymentMethodsCard />
          </div>
        </div>
      </div>
    </div>
  );
};
