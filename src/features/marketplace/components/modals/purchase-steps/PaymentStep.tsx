import React from "react";
import { motion } from "motion/react";
import {
  CircleNotch,
  ShieldCheck,
  LockSimple,
  ArrowSquareOut,
  CreditCard,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { Progress } from "@/components/ui/progress";

interface PaymentStepProps {
  finalPrice: string;
  isProcessing: boolean;
  progress: number;
  onPurchase: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  finalPrice,
  isProcessing,
  progress,
  onPurchase,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {isProcessing ? (
        /* ── Processing state ── */
        <div className="py-10 text-center space-y-5">
          <div className="relative mx-auto w-16 h-16">
            <CircleNotch
              className={`w-16 h-16 animate-spin ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
              weight="bold"
            />
            <LockSimple
              className={`absolute inset-0 m-auto ${isDark ? "text-cyan-300" : "text-cyan-700"}`}
              size={24}
              weight="bold"
            />
          </div>
          <div className="space-y-1.5">
            <p className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Procesando pago seguro...
            </p>
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              Conectando con Stripe
            </p>
          </div>
          <div className="w-56 mx-auto">
            <Progress
              value={progress}
              className={`${isDark ? "bg-white/10" : "bg-gray-200"} h-1.5 rounded-full`}
            />
          </div>
        </div>
      ) : (
        /* ── Redirect to Stripe state ── */
        <>
          <div className="text-center space-y-2">
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Pago Seguro
            </h2>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Serás redirigido a Stripe para completar tu pago
            </p>
          </div>

          {/* Stripe visual card */}
          <div className={`relative overflow-hidden rounded-2xl p-6 ${
            isDark
              ? "bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/[0.08]"
              : "bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
          }`}>
            {/* Decorative glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl ${
              isDark ? "bg-cyan-500/10" : "bg-cyan-400/10"
            }`} />
            <div className={`absolute -bottom-10 -left-10 w-24 h-24 rounded-full blur-2xl ${
              isDark ? "bg-violet-500/10" : "bg-violet-400/10"
            }`} />

            <div className="relative space-y-5">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isDark ? "bg-white/[0.08]" : "bg-white shadow-sm"
                  }`}>
                    <CreditCard size={18} weight="duotone" className={isDark ? "text-cyan-400" : "text-cyan-600"} />
                  </div>
                  <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Stripe Checkout
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isDark
                    ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                    : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                }`}>
                  <ShieldCheck size={12} weight="fill" />
                  Cifrado SSL
                </div>
              </div>

              {/* Amount */}
              <div className="text-center py-3">
                <p className={`text-xs font-medium uppercase tracking-wider mb-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  Total a pagar
                </p>
                <p className={`text-4xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                  {finalPrice}
                </p>
              </div>

              {/* Trust badges */}
              <div className={`flex items-center justify-center gap-4 pt-2 border-t ${
                isDark ? "border-white/[0.06]" : "border-gray-200"
              }`}>
                {["Visa", "Mastercard", "Amex"].map((brand) => (
                  <span
                    key={brand}
                    className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${
                      isDark
                        ? "bg-white/[0.05] text-gray-500"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2">
            <LockSimple size={14} weight="bold" className={isDark ? "text-emerald-500" : "text-emerald-600"} />
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              Transacción cifrada de extremo a extremo por Stripe
            </p>
          </div>

          {/* CTA button */}
          <button
            onClick={onPurchase}
            className={`
              w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-[15px]
              ${isDark
                ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_24px_rgba(0,255,255,0.25)]"
                : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
              }
            `}
          >
            Pagar con Stripe {finalPrice}
            <ArrowSquareOut size={18} weight="bold" />
          </button>
        </>
      )}
    </motion.div>
  );
};
