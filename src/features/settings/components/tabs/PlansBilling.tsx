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
  const {
    billingCycle,
    setBillingCycle,
    plans,
    activePlan,
    nextBillingDate,
    isLoading,
  } = useBillingSettings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Current Plan & Billing Cycle */}
      <CurrentPlan
        currentPlanName={activePlan?.name || "Free"}
        nextBillingDate={nextBillingDate}
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
