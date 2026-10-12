import React from "react";
import { SubscriptionManager } from "../SubscriptionManager";
import { PaymentMethodsCard } from "../PaymentMethodsCard";
import { LicensesList } from "../LicensesList";

export const BillingOverview = () => {
  return (
    <div className="flex-1 h-full min-h-0 w-full flex flex-col px-0 sm:px-6 pt-1 sm:pt-5 pb-2 sm:pb-6 gap-2.5 sm:gap-5 overflow-hidden lg:grid lg:grid-cols-2">
      {/* Left column: Subscription on mobile, Subscription + Payment Methods stacked on desktop */}
      <div className="flex flex-col gap-3 sm:gap-5 min-h-0 lg:flex-1 shrink-0 lg:shrink">
        <div className="shrink-0">
          <SubscriptionManager />
        </div>
        <div className="hidden lg:block min-h-0 lg:flex-1">
          <PaymentMethodsCard />
        </div>
      </div>

      {/* Right column: Licenses (fills remaining mobile viewport with internal scroll) */}
      <div className="flex-1 min-h-0 lg:h-full flex flex-col overflow-hidden">
        <LicensesList />
      </div>
    </div>
  );
};
