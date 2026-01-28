import React from "react";
import { SubscriptionManager } from "../SubscriptionManager";
import { PaymentMethodsCard } from "../PaymentMethodsCard";

export const BillingOverview = () => {
  return (
    <div className="h-full min-h-0 w-full flex flex-col pt-2">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full min-h-0">
        {/* Left Column: Subscription Plan */}
        <div className="flex flex-col min-h-0 h-full">
          <SubscriptionManager />
        </div>

        {/* Right Column: Payment Methods */}
        <div className="flex flex-col min-h-0 h-full">
          <PaymentMethodsCard />
        </div>
      </div>
    </div>
  );
};
