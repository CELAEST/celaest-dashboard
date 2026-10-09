import React from "react";
import { motion } from "motion/react";
import { CircleNotch } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

interface ActivationStepProps {
  purchaseComplete: boolean;
  progress: number;
  statusMessage?: string;
  onReset: () => void;
  onGoToAssets?: () => void;
}

export const ActivationStep: React.FC<ActivationStepProps> = ({
  purchaseComplete,
  progress,
  statusMessage,
  onReset,
  onGoToAssets,
}) => {
  const t = useTranslations("marketplace");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="py-6 sm:py-8 space-y-6 text-center"
    >
      {purchaseComplete ? (
        <>
          {/* Icono Circular de Confirmación (Basado en la referencia aprobada) */}
          <div className="relative flex items-center justify-center pt-2">
            <svg
              width="54"
              height="54"
              viewBox="0 0 54 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-emerald-400 relative z-10"
            >
              <circle cx="27" cy="27" r="23" stroke="currentColor" strokeWidth="3" />
              <path
                d="M17 27.5L24 34.5L37.5 20"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Titular y Descripción Equilibrados */}
          <div className="space-y-2 text-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] block font-medium text-white/40">
              {t("activation_step")}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t("completed_exclamation")}
            </h2>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-[420px] mx-auto">
              Tu suscripción ha sido dada de alta exitosamente y el servicio ya se encuentra disponible en tu entorno de trabajo.
            </p>
          </div>

          {/* Botón de Cierre Proporcionado (Platino Monocromático Puro) */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={onGoToAssets || onReset}
              className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md bg-white hover:bg-neutral-200 text-black active:scale-[0.99]"
            >
              {t("go_to_my_assets")}
            </button>

            <p className="text-[10px] font-mono text-white/30 text-center">
              {t("access_details_sent")}
            </p>
          </div>
        </>
      ) : (
        /* Configurando activo (Spinner fino) */
        <div className="w-full py-8 text-center space-y-4">
          <CircleNotch
            size={48}
            className="mx-auto animate-spin text-white"
            weight="bold"
          />
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {t("configuring_asset")}
            </h2>
            <p className="text-xs text-white/40 font-mono">
              {statusMessage || t("take_a_few_seconds")}
            </p>
          </div>
          <div className="w-48 h-1 mx-auto bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
