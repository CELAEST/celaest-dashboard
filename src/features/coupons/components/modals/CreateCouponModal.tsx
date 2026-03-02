import { logger } from "@/lib/logger";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateCouponForm } from "../forms/CreateCouponForm";
import { Tag } from "lucide-react";
import { useApiAuth } from "@/lib/use-api-auth";
import { CreateCouponFormValues } from "../../lib/validation";

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCouponModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateCouponModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, orgId } = useApiAuth();

  const handleSubmit = async (values: CreateCouponFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { couponsService } = await import("../../services/coupons.service");
      if (!token || !orgId) throw new Error("Authentication missing");
      await couponsService.createCoupon(values, token, orgId);
      onSuccess();
    } catch (err: unknown) {
      logger.error("Error creating coupon:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ha ocurrido un error inesperado al intentar crear el cupón. Por favor verifica los datos e intenta nuevamente.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[850px] bg-neutral-950 border border-white/5 text-white p-0 overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col h-full">
          <div className="p-8 pb-4">
            <DialogHeader className="mb-0">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-inner">
                  <Tag className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black tracking-tight">
                    Maestro de Cupones
                  </DialogTitle>
                  <DialogDescription className="text-neutral-500 font-medium text-xs mt-1 uppercase tracking-widest text-left">
                    Arquitectura de descuentos de alto rendimiento
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-xs font-bold flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}
          </div>

          <div className="p-8 pt-4 custom-scrollbar overflow-y-auto max-h-[85vh]">
            <CreateCouponForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={onClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
