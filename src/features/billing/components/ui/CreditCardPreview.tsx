import React from "react";
import { motion } from "motion/react";
import { Lock, Sparkle } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface CreditCardPreviewProps {
  cardNumber?: string;
  cardName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardType?: string;
  focusedField?: string | null;
  last4?: string; // For PencilSimple mode
}

export const CreditCardPreview: React.FC<CreditCardPreviewProps> = ({
  cardNumber,
  cardName,
  expiryMonth,
  expiryYear,
  cardType = "VISA",
  focusedField,
  last4,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Determine display values
  const displayCardNumber = last4
    ? `•••• •••• •••• ${last4}`
    : cardNumber || "•••• •••• •••• ••••";

  const displayName = cardName || "YOUR NAME";

  const displayExpiry =
    expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : "MM/YY";

  return (
    <div className="md:w-1/2 md:shrink-0 md:flex md:flex-col md:justify-center md:overflow-hidden p-6">
      {/* Card Preview */}
      <motion.div
        initial={{ opacity: 0, rotateY: -10 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative rounded-2xl p-6 mb-4 overflow-hidden border shadow-2xl transition-all ${
          isDark
            ? "bg-linear-to-b from-[#16181f] via-[#0f1015] to-[#090a0d] border-white/12 text-white"
            : "bg-linear-to-b from-gray-900 via-gray-800 to-black border-gray-700 text-white shadow-xl"
        }`}
        style={{
          aspectRatio: "1.586",
        }}
      >
        {/* Ambient Sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />

        <div className="relative h-full flex flex-col justify-between">
          {/* Card Chip & Network */}
          <div className="flex items-start justify-between">
            {/* Metallic Microchip */}
            <motion.div
              animate={
                focusedField === "cardNumber" ? { scale: [1, 1.05, 1] } : {}
              }
              transition={{
                duration: 0.5,
                repeat: focusedField === "cardNumber" ? Infinity : 0,
                repeatDelay: 0.5,
              }}
              className="w-11 h-8 rounded-md bg-linear-to-br from-amber-200/25 via-amber-300/10 to-amber-500/20 border border-amber-300/30 relative flex items-center justify-center shadow-xs"
            >
              <div className="w-5 h-4 border border-amber-300/25 rounded-xs" />
            </motion.div>

            <motion.div
              animate={cardNumber ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs font-mono font-bold tracking-[0.2em] text-white/80"
            >
              {cardType.toUpperCase()}
            </motion.div>
          </div>

          {/* Card Number */}
          <motion.div
            animate={cardNumber ? { scale: [1, 1.01, 1] } : {}}
            transition={{ duration: 0.3 }}
            className="text-lg sm:text-xl font-mono tracking-[0.18em] text-zinc-100 font-semibold"
          >
            {displayCardNumber}
          </motion.div>

          {/* Card Details */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[9px] font-mono tracking-[0.18em] uppercase text-white/40 mb-0.5">
                CARD HOLDER
              </div>
              <motion.div
                animate={cardName ? { scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="font-mono font-medium text-xs tracking-wider text-zinc-200 truncate max-w-[160px]"
              >
                {displayName}
              </motion.div>
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-[0.18em] uppercase text-white/40 mb-0.5 text-right">
                EXPIRES
              </div>
              <motion.div
                animate={
                  expiryMonth && expiryYear ? { scale: [1, 1.03, 1] } : {}
                }
                transition={{ duration: 0.3 }}
                className="font-mono font-medium text-xs tracking-wider text-zinc-200 text-right"
              >
                {displayExpiry}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security Badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-3.5 rounded-xl flex items-start gap-3 border ${
          isDark
            ? "bg-white/[0.02] border-white/8"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <Lock className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? "text-white/60" : "text-gray-500"}`} />
        <div>
          <div
            className={`text-xs font-mono font-semibold mb-0.5 flex items-center gap-1.5 ${
              isDark ? "text-zinc-200" : "text-gray-800"
            }`}
          >
            <span>256-Bit SSL Encryption</span>
          </div>
          <div
            className={`text-[11px] font-mono ${
              isDark ? "text-white/40" : "text-gray-500"
            }`}
          >
            Your payment information is encrypted and secure. We never store
            full card numbers.
          </div>
        </div>
      </motion.div>
    </div>
  );
};
