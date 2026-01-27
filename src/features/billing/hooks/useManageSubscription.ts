import { useState, useRef } from "react";

export const useManageSubscription = (onClose: () => void) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const handleCancelSubscription = () => {
    console.log("Cancelling subscription...");
    setShowCancelConfirm(false);
    onClose();
  };

  const handlePauseSubscription = () => {
    console.log("Pausing subscription...");
    setShowPauseConfirm(false);
  };

  const handleToggleAutoRenew = () => {
    setAutoRenew(!autoRenew);
    console.log("Toggling auto-renew...");
  };

  // Mock data
  const subscriptionDetails = {
    plan: "Premium Tier",
    status: "Active",
    price: "$299.00",
    billingCycle: "Monthly",
    nextBillingDate: "February 1, 2026",
    renewalDate: "January 31, 2026",
    autoRenew: autoRenew,
    activeSince: "September 1, 2025",
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
