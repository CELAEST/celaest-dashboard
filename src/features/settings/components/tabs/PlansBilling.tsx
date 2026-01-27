"use client";

import React from "react";
import { useBillingSettings } from "../../hooks/useBillingSettings";
import { CurrentPlan } from "./PlansBilling/CurrentPlan";
import { PlanCards } from "./PlansBilling/PlanCards";
import { PaymentMethod } from "./PlansBilling/PaymentMethod";
import { BillingHistory } from "./PlansBilling/BillingHistory";

/**
 * Plans & Billing Settings Tab
 */
export function PlansBilling() {
  const { billingCycle, setBillingCycle, plans } = useBillingSettings();

  return (
    <div className="space-y-6 pb-8">
      {/* Current Plan & Billing Cycle */}
      <CurrentPlan
        currentPlanName="Pro"
        nextBillingDate="January 12, 2024"
        billingCycle={billingCycle}
        onCycleChange={setBillingCycle}
      />

      <div className="settings-glass-card rounded-2xl p-6">
        <PlanCards plans={plans} />
      </div>

      <PaymentMethod />
      <BillingHistory />
    </div>
  );
}
