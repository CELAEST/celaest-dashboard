import React, { useState } from "react";
import { motion } from "motion/react";
import { LockSimple, ArrowRight, Tag } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

interface ConfirmationStepProps {
  product: {
    title: string;
    image?: string;
  };
  originalPrice: string;
  finalPrice: string;
  hasCoupon: boolean;
  couponCode?: string;
  discountAmount?: string;
  discountPercentage?: number;
  onRemoveCoupon?: () => void;
  onApplyCoupon?: (code: string) => void;
  onContinue: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  product,
  originalPrice,
  finalPrice,
  hasCoupon,
  couponCode = "CELAEST-VIP-20",
  discountAmount,
  discountPercentage = 20,
  onRemoveCoupon,
  onApplyCoupon,
  onContinue,
}) => {
  const t = useTranslations("marketplace");
  const [showInput, setShowInput] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !onApplyCoupon) return;
    onApplyCoupon(inputVal.trim().toUpperCase());
    setInputVal("");
    setShowInput(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Encabezado Directo y Limpio (Model 01 Lingua Standard) */}
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {t("confirm_acquisition")}
        </h2>
        <p className="text-xs text-white/40 font-mono truncate max-w-sm mx-auto">
          {product.title} • {t("min_plan")}
        </p>
      </div>

      {/* ── Fila de Cupón (100% Centrada, Simétrica y Limpia) ── */}
      <div className="space-y-3.5 pt-1">
        {hasCoupon ? (
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-mono shadow-sm">
              <Tag size={12} className="text-white/40 shrink-0" />
              <span className="text-[11px] uppercase font-semibold text-white/90 tracking-wider">
                {couponCode}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[11px] text-white/50">
                {discountAmount ? `Ahorro: -${discountAmount} (-${discountPercentage}%)` : `Descuento -${discountPercentage}%`}
              </span>
              {onRemoveCoupon && (
                <>
                  <span className="text-white/20">•</span>
                  <button
                    type="button"
                    onClick={onRemoveCoupon}
                    className="text-[10px] uppercase tracking-wider text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    Remover
                  </button>
                </>
              )}
            </div>
          </div>
        ) : showInput ? (
          <form onSubmit={handleApply} className="flex items-center justify-center gap-2 max-w-[340px] mx-auto">
            <input
              type="text"
              placeholder="CÓDIGO DE CUPÓN"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white uppercase placeholder-white/30 focus:outline-none focus:border-blue-500/50"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors bg-white hover:bg-neutral-200 text-black font-mono shadow-sm"
            >
              Aplicar
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setShowInput(true)}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/40 hover:text-white/80 transition-colors cursor-pointer"
            >
              <Tag size={12} className="text-white/30" />
              <span>+ Aplicar cupón de descuento</span>
            </button>
          </div>
        )}

        {/* ── Tarjeta de Inversión Mensual (Limpia & Simétrica) ── */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="space-y-0.5">
            <span className="text-xs text-white/50 block font-medium">Inversión mensual recurrente</span>
            {hasCoupon ? (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="line-through text-white/30">
                  {originalPrice}
                </span>
                <span className="text-[11px] text-white/40">
                  (-{discountPercentage}% descuento)
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-mono text-white/30">Cancela en cualquier momento</span>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1 font-mono">
              <span className="text-2xl font-bold tracking-tight text-white">
                {finalPrice}
              </span>
            </div>
            <span className="text-[10px] text-white/30 font-mono block">Facturación mensual</span>
          </div>
        </div>
      </div>

      {/* ── Botón de Acción Principal (Platino Monocromático Puro) ── */}
      <div className="pt-1 space-y-2.5">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md bg-white hover:bg-neutral-200 text-black active:scale-[0.99]"
        >
          <span>{t("continue_to_payment")} ({finalPrice})</span>
          <ArrowRight size={15} weight="bold" />
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/30 text-center">
          <LockSimple size={12} />
          <span>Cifrado bancario 256-bit • Facturación mensual flexible</span>
        </div>
      </div>
    </motion.div>
  );
};
