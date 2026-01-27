import { useState, useCallback } from "react";
import { hapticFeedback } from "@/features/shared/utils/sound-effects";

export const usePurchaseFlow = (onClose: () => void) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [progress, setProgress] = useState(0);

  const resetFlow = useCallback(() => {
    setStep(1);
    setIsProcessing(false);
    setPurchaseComplete(false);
    setShowConfetti(false);
    setProgress(0);
    onClose();
  }, [onClose]);

  const handlePurchase = useCallback(() => {
    setIsProcessing(true);
    setProgress(0);

    // Animate progress for payment Step (3000ms target)
    const paymentInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Hold at 90% until complete
        return prev + 1;
      });
    }, 30);

    // Simulate payment processing
    setTimeout(() => {
      clearInterval(paymentInterval);
      setProgress(100);

      setTimeout(() => {
        // Small delay to show 100%
        setIsProcessing(false);
        setStep(3);
        setProgress(0);

        // Animate progress for activation Step (2000ms target)
        const activationInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 95) return prev;
            return prev + 2;
          });
        }, 30);

        // Simulate activation
        setTimeout(() => {
          clearInterval(activationInterval);
          setProgress(100);
          setPurchaseComplete(true);
          setShowConfetti(true);
          // Haptic feedback on success
          hapticFeedback("medium");

          // Hide confetti after animation
          setTimeout(() => setShowConfetti(false), 2000);
        }, 2000);
      }, 200);
    }, 3000);
  }, []);

  return {
    step,
    setStep,
    isProcessing,
    purchaseComplete,
    showConfetti,
    progress,
    handlePurchase,
    resetFlow,
  };
};
