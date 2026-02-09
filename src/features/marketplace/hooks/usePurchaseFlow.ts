import { useState, useCallback, useEffect } from "react";
import { hapticFeedback } from "@/features/shared/utils/sound-effects";
import { marketplaceService } from "../services/marketplace.service";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { toast } from "sonner";

export const usePurchaseFlow = (onClose: () => void, initialStep = 1, onSuccess?: () => void) => {
  const [step, setStep] = useState(initialStep);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  // Sync internal step if initialStep changed (important for in-context return)
  useEffect(() => {
    if (initialStep === 3 && step !== 3) {
      setStep(3);
    }
  }, [initialStep, step]);

  // Activation sequence for in-context return
  useEffect(() => {
    if (step === 3 && !purchaseComplete && !isProcessing) {
      // Get session_id from URL if present
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");
      const session = useAuthStore.getState().session;

      if (!sessionId || !session?.accessToken) {
        // Fallback for simulation or error state
        console.error("Missing session_id or auth token for verification");
        setIsProcessing(false);
        return;
      }

      setIsProcessing(true);
      setStatusMessage("Iniciando verificación...");
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds roughly

      const pollVerification = async () => {
        try {
          const response = await marketplaceService.verifyPurchase(sessionId, session.accessToken);
          
           if (response.has_access) {
              setPurchaseComplete(true);
              setShowConfetti(true);
               setIsProcessing(false);
               setStatusMessage("¡Activación completa!");
               setProgress(100);
              hapticFeedback("heavy");
              
              // Trigger optional callback (e.g., refresh assets)
              if (onSuccess) onSuccess();
              
              return; // Stop polling
           }
          
          // Continue polling if pending
          attempts++;
          setProgress(Math.min(90, (attempts / maxAttempts) * 100)); // Fake progress up to 90%
          
          if (attempts === 1) setStatusMessage("Verificando con Stripe...");
          if (attempts === 5) setStatusMessage("Procesando pago...");
          if (attempts === 10) setStatusMessage("Activando licencia...");
          if (attempts === 15) setStatusMessage("Sincronizando activos...");
          if (attempts === 20) setStatusMessage("Finalizando segundos...");
          
          if (attempts < maxAttempts) {
             setTimeout(pollVerification, 2000);
          } else {
             setIsProcessing(false);
             setStatusMessage("Tiempo de espera agotado");
             toast.error("La verificación está tardando más de lo esperado. Por favor, revisa tus 'Mis Activos'.");
          }
        } catch (error) {
          console.error("Verification error:", error);
          attempts++;
           if (attempts < maxAttempts) {
             setTimeout(pollVerification, 2000);
          } else {
             setIsProcessing(false);
             toast.error("Error al verificar la compra.");
          }
        }
      };

      pollVerification();
    }
  }, [step, purchaseComplete, isProcessing, onSuccess]);

  const resetFlow = useCallback(() => {
    setStep(1);
    setIsProcessing(false);
    setPurchaseComplete(false);
    setShowConfetti(false);
    setProgress(0);
    onClose();
  }, [onClose]);

  const handlePurchase = useCallback(async (productId: string) => {
    if (isProcessing) return;

    const session = useAuthStore.getState().session;
    const token = session?.accessToken;
    if (!token) {
      toast.error("Debes iniciar sesión para realizar una compra");
      return;
    }

    setIsProcessing(true);
    setStep(2); // Mover al paso de pago
    setProgress(10);

    try {
      // 1. Crear sesión de checkout en el backend
      const response = await marketplaceService.buyProduct(productId, token);
      
      setProgress(50);
      
      // Haptic feedback antes de la redirección
      hapticFeedback("light");

      // 2. Redirigir a Stripe
      if (response.checkout_url) {
        setProgress(100);
        
        // Pequeña espera para mostrar el progreso al 100%
        setTimeout(() => {
          window.location.href = response.checkout_url;
        }, 500);
      } else {
        throw new Error("No se recibió la URL de checkout");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error al iniciar el proceso de pago. Inténtalo de nuevo.");
      setIsProcessing(false);
      setStep(1);
    }
  }, [isProcessing]);

  return {
    step,
    setStep,
    isProcessing,
    purchaseComplete,
    showConfetti,
    progress,
    statusMessage,
    handlePurchase,
    resetFlow,
  };
};
