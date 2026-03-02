import { logger } from "@/lib/logger";
import { useState, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { hapticFeedback } from "@/features/shared/utils/sound-effects";
import { marketplaceService } from "../services/marketplace.service";
import { useApiAuth } from "@/lib/use-api-auth";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { toast } from "sonner";
import { useMarketplaceCouponStore } from "../store";

export const usePurchaseFlow = (onClose: () => void, initialStep = 1, onSuccess?: () => void) => {
  const [step, setStep] = useState(initialStep);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const { token, orgId, isReady, isAuthReady } = useApiAuth();
  const { isLoading: isOrgsLoading } = useOrgStore();
  const { activeCoupon } = useMarketplaceCouponStore();

  // Sync internal step if initialStep changed (important for in-context return)
  useEffect(() => {
    if (initialStep === 3 && step !== 3) {
      setStep(3);
    }
  }, [initialStep, step]);

  // ── Purchase Mutation ───────────────────────────────────────────
  const purchaseMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!token || !orgId) throw new Error("Missing auth");
      return marketplaceService.buyProduct(productId, token, orgId, activeCoupon?.code);
    },
    onMutate: () => {
      setStep(2);
      setProgress(10);
    },
    onSuccess: (response) => {
      setProgress(50);
      hapticFeedback("light");

      if (response.checkout_url) {
        setProgress(100);
        setTimeout(() => {
          window.location.href = response.checkout_url;
        }, 500);
      } else {
        throw new Error("No se recibió la URL de checkout");
      }
    },
    onError: (error: unknown) => {
      logger.error("Checkout error:", error);
      toast.error("Error al iniciar el proceso de pago. Inténtalo de nuevo.");
      setStep(1);
    },
  });

  // ── Verification Polling (step 3 — return from Stripe) ──────────
  useEffect(() => {
    if (step === 3 && !purchaseComplete && !purchaseMutation.isPending) {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (!sessionId || !token || !orgId) {
        logger.error("Missing session_id, auth token, or orgId for verification");
        return;
      }

      let attempts = 0;
      const maxAttempts = 30;
      let cancelled = false;

      setStatusMessage("Iniciando verificación...");

      const pollVerification = async () => {
        if (cancelled) return;
        try {
          const response = await marketplaceService.verifyPurchase(sessionId, token, orgId);

          if (response.has_access) {
            setPurchaseComplete(true);
            setShowConfetti(true);
            setStatusMessage("¡Activación completa!");
            setProgress(100);
            hapticFeedback("heavy");
            if (onSuccess) onSuccess();
            return;
          }

          attempts++;
          setProgress(Math.min(90, (attempts / maxAttempts) * 100));

          if (attempts === 1) setStatusMessage("Verificando con Stripe...");
          if (attempts === 5) setStatusMessage("Procesando pago...");
          if (attempts === 10) setStatusMessage("Activando licencia...");
          if (attempts === 15) setStatusMessage("Sincronizando activos...");
          if (attempts === 20) setStatusMessage("Finalizando segundos...");

          if (attempts < maxAttempts && !cancelled) {
            setTimeout(pollVerification, 2000);
          } else if (!cancelled) {
            setStatusMessage("Tiempo de espera agotado");
            toast.error("La verificación está tardando más de lo esperado. Por favor, revisa tus 'Mis Activos'.");
          }
        } catch (error: unknown) {
          logger.error("Verification error:", error);
          attempts++;
          if (attempts < maxAttempts && !cancelled) {
            setTimeout(pollVerification, 2000);
          } else if (!cancelled) {
            toast.error("Error al verificar la compra.");
          }
        }
      };

      pollVerification();

      return () => { cancelled = true; };
    }
  }, [step, purchaseComplete, purchaseMutation.isPending, onSuccess, token, orgId]);

  const resetFlow = useCallback(() => {
    setStep(1);
    setPurchaseComplete(false);
    setShowConfetti(false);
    setProgress(0);
    onClose();
  }, [onClose]);

  const handlePurchase = useCallback((productId: string) => {
    if (purchaseMutation.isPending) return;

    if (!isAuthReady) {
      toast.info("Inicia sesión para realizar una compra");
      return;
    }

    if (isOrgsLoading) {
      toast.info("Cargando organización, intenta en un momento...");
      return;
    }

    if (!isReady) {
      toast.info("Preparando sesión, intenta de nuevo en un momento...");
      return;
    }

    if (!token || !orgId) {
      toast.error("Debes iniciar sesión y seleccionar una organización para realizar una compra");
      return;
    }

    console.log("[DEBUG] handlePurchase called! activeCoupon =", activeCoupon);
    purchaseMutation.mutate(productId);
  }, [purchaseMutation, isAuthReady, isOrgsLoading, isReady, token, orgId, activeCoupon]);

  return {
    step,
    setStep,
    isProcessing: purchaseMutation.isPending || (step === 3 && !purchaseComplete),
    isSessionReady: isReady,
    isOrgsLoading,
    purchaseComplete,
    showConfetti,
    progress,
    statusMessage,
    handlePurchase,
    resetFlow,
  };
};
