
"use client";

import React from "react";
import { BillingModal } from "./shared/BillingModal";
import { useManageSubscription } from "../../hooks/useManageSubscription";
import { ManageSubscriptionHeader } from "./ManageSubscription/ManageSubscriptionHeader";
import { CurrentPlanCard } from "./ManageSubscription/CurrentPlanCard";
import { SubscriptionInfo } from "./ManageSubscription/SubscriptionInfo";
import { AutoRenewToggle } from "./ManageSubscription/AutoRenewToggle";
import { SubscriptionActions } from "./ManageSubscription/SubscriptionActions";
import { ConfirmationAlert } from "./ManageSubscription/ConfirmationAlert";
import { ManageSubscriptionFooter } from "./ManageSubscription/ManageSubscriptionFooter";

interface ManageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageSubscriptionModal({
  isOpen,
  onClose,
}: ManageSubscriptionModalProps) {
  const {
    showCancelConfirm,
    setShowCancelConfirm,
    showPauseConfirm,
    setShowPauseConfirm,
    autoRenew,
    scrollContainerRef,
    subscriptionDetails,
    handleToggleCancel,
    handleTogglePause,
    handleCancelSubscription,
    handlePauseSubscription,
    handleToggleAutoRenew,
  } = useManageSubscription(onClose);

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-3xl max-h-[85vh]"
    >
      <ManageSubscriptionHeader />

      <div
        ref={scrollContainerRef}
        className="p-6 space-y-5 overflow-y-auto flex-1 scroll-smooth"
      >
        <CurrentPlanCard
          plan={subscriptionDetails.plan}
          status={subscriptionDetails.status}
          billingCycle={subscriptionDetails.billingCycle}
          price={subscriptionDetails.price}
        />

        <SubscriptionInfo
          nextBillingDate={subscriptionDetails.nextBillingDate}
          activeSince={subscriptionDetails.activeSince}
        />

        <AutoRenewToggle
          autoRenew={autoRenew}
          renewalDate={subscriptionDetails.renewalDate}
          onToggle={handleToggleAutoRenew}
        />

        <SubscriptionActions
          showPauseConfirm={showPauseConfirm}
          showCancelConfirm={showCancelConfirm}
          onTogglePause={handleTogglePause}
          onToggleCancel={handleToggleCancel}
        />

        <ConfirmationAlert
          isVisible={showCancelConfirm}
          type="danger"
          title="Are you sure you want to cancel?"
          message={
            <>
              Your subscription will remain active until{" "}
              <span className="font-bold underline decoration-red-500/50">
                {subscriptionDetails.nextBillingDate}
              </span>
              , after which you&apos;ll lose access to all premium features
              instantly.
            </>
          }
          confirmText="Confirm Cancellation"
          cancelText="Keep Subscription"
          onConfirm={handleCancelSubscription}
          onCancel={() => setShowCancelConfirm(false)}
        />

        <ConfirmationAlert
          isVisible={showPauseConfirm}
          type="warning"
          title="Pause your subscription?"
          message={
            <>
              Your subscription will be paused and billing will stop
              immediately. You can resume anytime within{" "}
              <span className="font-bold underline">90 days</span> without
              losing your data.
            </>
          }
          confirmText="Confirm Pause"
          cancelText="Go Back"
          onConfirm={handlePauseSubscription}
          onCancel={() => setShowPauseConfirm(false)}
        />
      </div>

      <ManageSubscriptionFooter onClose={onClose} />
    </BillingModal>

  );
}
