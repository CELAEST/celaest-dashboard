"use client";

import React from "react";
import { BillingModal } from "./shared/BillingModal";
import { useManageSubscription } from "../../hooks/useManageSubscription";
import { useBilling } from "../../hooks/useBilling";
import { ManageSubscriptionHeader } from "./ManageSubscription/ManageSubscriptionHeader";
import { CurrentPlanCard } from "./ManageSubscription/CurrentPlanCard";
import { SubscriptionInfo } from "./ManageSubscription/SubscriptionInfo";
import { AutoRenewToggle } from "./ManageSubscription/AutoRenewToggle";
import { SubscriptionActions } from "./ManageSubscription/SubscriptionActions";
import { ConfirmationAlert } from "./ManageSubscription/ConfirmationAlert";
import { ManageSubscriptionFooter } from "./ManageSubscription/ManageSubscriptionFooter";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";

interface ManageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageSubscriptionModal({
  isOpen,
  onClose,
}: ManageSubscriptionModalProps) {
  const { subscription, plan } = useBilling();
  const { currentOrg } = useOrgStore();

  const canManage =
    currentOrg?.role === "owner" ||
    currentOrg?.role === "super_admin" ||
    currentOrg?.slug === "celaest-official";
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
  } = useManageSubscription(subscription, plan, onClose);

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-3xl max-h-[85vh]"
      showCloseButton={false}
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px z-20 bg-linear-to-r from-transparent via-teal-500/70 to-transparent" />
      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "22rem",
          height: "22rem",
          background: "radial-gradient(circle at top right, rgba(20,184,166,0.06), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <ManageSubscriptionHeader onClose={onClose} />

      <div
        ref={scrollContainerRef}
        className="px-8 py-6 space-y-5 overflow-y-auto flex-1 min-h-0 scroll-smooth"
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
          onToggle={canManage ? handleToggleAutoRenew : undefined}
          disabled={!canManage}
        />

        <SubscriptionActions
          showPauseConfirm={showPauseConfirm}
          showCancelConfirm={showCancelConfirm}
          onTogglePause={canManage ? handleTogglePause : undefined}
          onToggleCancel={canManage ? handleToggleCancel : undefined}
          disabled={!canManage}
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
