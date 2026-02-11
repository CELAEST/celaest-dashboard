import { useState, useRef } from "react";
import { toast } from "sonner";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { billingApi } from "../api/billing.api";
import { Subscription, Plan } from "../types";

export const useManageSubscription = (subscription: Subscription | null, plan: Plan | null, onClose: () => void) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  
  // Initialize state based on subscription
  // If cancelled_at is null, auto-renew is ON (true)
  const [autoRenew, setAutoRenew] = useState(() => {
    if (!subscription) return true;
    return !subscription.cancelled_at;
  });
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { currentOrg } = useOrgStore();
  const { session } = useAuth();

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleToggleCancel = () => {
    const nextState = !showCancelConfirm;
    setShowCancelConfirm(nextState);
    if (nextState) {
      setShowPauseConfirm(false);
      scrollToBottom();
    }
  };

  const handleTogglePause = () => {
    const nextState = !showPauseConfirm;
    setShowPauseConfirm(nextState);
    if (nextState) {
      setShowCancelConfirm(false);
      scrollToBottom();
    }
  };

  const handleToggleAutoRenew = async () => {
    if (!subscription?.id || !currentOrg?.id || !session?.accessToken) return;

    try {
      const newAutoRenewState = !autoRenew;
      
      if (newAutoRenewState) {
        // Turning ON -> Reactivate
        await billingApi.reactivateSubscription(currentOrg.id, session.accessToken, subscription.id);
        toast.success("Auto-renewal enabled. Subscription is active.");
      } else {
        // Turning OFF -> Cancel at period end
        await billingApi.cancelSubscription(currentOrg.id, session.accessToken, subscription.id, false);
        toast.success("Auto-renewal disabled. Subscription will end at the current period.");
      }
      
      setAutoRenew(newAutoRenewState);
    } catch (error: any) {
      console.error("Auto-renew update failed:", error);
      toast.error(error.message || "Failed to update subscription settings");
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.id || !currentOrg?.id || !session?.accessToken) {
      toast.error("Subscription information missing");
      return;
    }

    try {
      // Cancel at period end (immediately=false)
      await billingApi.cancelSubscription(currentOrg.id, session.accessToken, subscription.id, false);
      toast.success("Subscription has been cancelled. It will remain active until the end of the billing period.");
      setShowCancelConfirm(false);
      onClose();
    } catch (error: any) {
      console.error("Cancellation failed:", error);
      toast.error(error.message || "Failed to cancel subscription");
    }
  };

  const handlePauseSubscription = () => {
    // Pause is not yet supported by backend
    toast.info("Subscription pausing is coming soon. Please contact support or use Cancel.");
    setShowPauseConfirm(false);
  };

  const nextBillingDate = subscription?.current_period_end 
    ? new Date(subscription.current_period_end).toLocaleDateString() 
    : "N/A";
    
  const activeSince = subscription?.created_at 
    ? new Date(subscription.created_at).toLocaleDateString() 
    : "N/A";

  const subscriptionDetails = {
    plan: plan?.name || "No Plan",
    status: subscription?.status || "Inactive",
    price: plan?.price_monthly ? `${plan.currency === 'EUR' ? '€' : '$'}${plan.price_monthly}` : "$0.00",
    billingCycle: "Monthly",
    nextBillingDate,
    renewalDate: nextBillingDate,
    autoRenew: autoRenew,
    activeSince,
  };

  return {
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
  };
};
