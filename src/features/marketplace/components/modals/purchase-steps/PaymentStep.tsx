import React from "react";
import { motion } from "motion/react";
import {
  CircleNotch,
  ShieldCheck,
  LockSimple,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

interface PaymentStepProps {
  finalPrice: string;
  isProcessing: boolean;
  progress: number;
  onPurchase: () => void;
  onBack?: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  finalPrice,
  isProcessing,
  progress,
  onPurchase,
  onBack,
}) => {
  const t = useTranslations("marketplace");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="py-2 space-y-6 text-center"
    >
      {isProcessing ? (
        /* ── Processing State (Model 01 Lingua Standard) ── */
        <div className="w-full py-8 text-center space-y-4">
          <div className="relative mx-auto w-14 h-14 flex items-center justify-center">
            <CircleNotch
              size={52}
              className="animate-spin text-white"
              weight="bold"
            />
            <LockSimple size={20} className="absolute text-white/80" weight="bold" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">
              {t("processing_secure_payment")}
            </p>
            <p className="text-xs text-white/40 font-mono">
              Generando sesión cifrada ({progress}%)
            </p>
          </div>
          <div className="w-48 h-1 mx-auto bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        /* ── Redirect to Stripe State (Cero Icono Gigante - Máxima Limpieza) ── */
        <>
          <div className="space-y-1.5 text-center pt-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] block font-medium text-white/40">
              {t("secure_payment")}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t("redirecting_to_stripe")}
            </h2>
            <p className="text-xs text-white/50 leading-relaxed max-w-[420px] mx-auto">
              Te transferiremos a la pasarela cifrada de Stripe para completar la transacción de forma segura sin almacenar datos sensibles.
            </p>
          </div>

          {/* Importe Puro */}
          <div className="py-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-white block">
              {finalPrice}
            </span>
            <span className="text-xs text-white/40 font-mono block mt-1">
              Facturación periódica mensual de suscripción
            </span>
          </div>

          {/* Botón de Salto Directo a Stripe (Platino Monocromático Puro) */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={onPurchase}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md bg-white hover:bg-neutral-200 text-black active:scale-[0.99]"
            >
              <span>{t("pay_with_stripe")} ({finalPrice})</span>
              <ArrowSquareOut size={16} weight="bold" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/30 text-center">
              <ShieldCheck size={13} />
              <span>Visa • Mastercard • Amex • Apple Pay • TLS 1.3</span>
            </div>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-full py-1 text-xs text-white/40 hover:text-white transition-colors cursor-pointer text-center"
              >
                ← Volver al resumen
              </button>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};
