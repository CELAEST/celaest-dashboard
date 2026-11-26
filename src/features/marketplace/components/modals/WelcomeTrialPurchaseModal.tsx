"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowSquareOut, Check, Sparkle, Tag, X } from "@phosphor-icons/react";
import { SuccessConfetti } from "@/features/shared/components/SuccessConfetti";

interface WelcomeTrialPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLingua?: () => void;
  originalPriceLabel?: string;
}

export const WelcomeTrialPurchaseModal: React.FC<WelcomeTrialPurchaseModalProps> = ({
  isOpen,
  onClose,
  onOpenLingua,
  originalPriceLabel = "$29.99",
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <SuccessConfetti active={true} />
        <div
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full sm:max-w-[430px] rounded-t-[22px] sm:rounded-[18px] bg-[#09090b] border border-white/[0.1] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.8)] space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-emerald-400">
                <Sparkle size={13} weight="fill" />
                <span>Adquisición Completada</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center text-center gap-2.5 pt-1">
              <div className="h-11 w-11 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Check size={20} weight="bold" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                ¡CELAEST Lingua activado!
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-[320px]">
                Tu prueba gratuita de <strong className="text-white">15 días</strong> está lista con
                todas las bases y <strong className="text-white">200 peticiones IA</strong> incluidas.
              </p>
            </div>

            {/* Receipt Summary ($0) */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span>CELAEST Lingua — 15 días</span>
                <span className="line-through font-mono">{originalPriceLabel}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span className="inline-flex items-center gap-1.5 font-mono">
                  <Tag size={13} />
                  <span>WELCOME (-100%)</span>
                </span>
                <span className="font-mono">-{originalPriceLabel}</span>
              </div>
              <div className="h-px bg-white/[0.08]" />
              <div className="flex items-center justify-between text-sm font-bold text-white">
                <span>Total pagado hoy</span>
                <span className="font-mono text-emerald-400">$0.00</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {onOpenLingua && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLingua();
                  }}
                  className="w-full h-11 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Abrir CELAEST Lingua</span>
                  <ArrowSquareOut size={15} weight="bold" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full h-10 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Seguir en el Marketplace
              </button>
            </div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);
