import React from "react";
import { motion } from "motion/react";
import { Lock, Sparkles } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface CreditCardPreviewProps {
  cardNumber?: string;
  cardName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardType?: string;
  focusedField?: string | null;
  last4?: string; // For Edit mode
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
        initial={{ opacity: 0, rotateY: -20 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
        className={`relative rounded-2xl p-6 mb-4 overflow-hidden ${
          isDark
            ? "bg-linear-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
            : "bg-linear-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 shadow-2xl"
        }`}
        style={{
          aspectRatio: "1.586",
        }}
      >
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className={`absolute inset-0 ${
              isDark ? "bg-cyan-400" : "bg-blue-500"
            }`}
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
            }}
          />
        </div>

        <div className="relative h-full flex flex-col justify-between">
          {/* Card Type & Chip */}
          <div className="flex items-start justify-between">
            <motion.div
              animate={
                focusedField === "cardNumber" ? { scale: [1, 1.05, 1] } : {}
              }
              transition={{
                duration: 0.5,
                repeat: focusedField === "cardNumber" ? Infinity : 0,
                repeatDelay: 0.5,
              }}
              className={`w-12 h-9 rounded-lg ${
                isDark
                  ? "bg-linear-to-br from-yellow-400/40 to-yellow-600/40"
                  : "bg-linear-to-br from-yellow-400/60 to-yellow-600/60"
              }`}
            />
            <motion.div
              animate={cardNumber ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
              className={`text-xs font-bold tracking-wider ${
                isDark ? "text-cyan-300" : "text-blue-700"
              }`}
            >
              {cardType.toUpperCase()}
            </motion.div>
          </div>

          {/* Card Number */}
          <motion.div
            animate={cardNumber ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`text-xl font-mono tracking-widest ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {displayCardNumber}
          </motion.div>

          {/* Card Details */}
          <div className="flex items-end justify-between">
            <div>
              <div
                className={`text-xs mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                CARD HOLDER
              </div>
              <motion.div
                animate={cardName ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`font-semibold text-sm ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {displayName}
              </motion.div>
            </div>
            <div>
              <div
                className={`text-xs mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                EXPIRES
              </div>
              <motion.div
                animate={
                  expiryMonth && expiryYear ? { scale: [1, 1.05, 1] } : {}
                }
                transition={{ duration: 0.3 }}
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {displayExpiry}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`p-4 rounded-xl flex items-start gap-3 ${
          isDark
            ? "bg-emerald-500/5 border border-emerald-500/20"
            : "bg-emerald-500/5 border border-emerald-500/20"
        }`}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        </motion.div>
        <div>
          <div
            className={`text-xs font-semibold mb-1 flex items-center gap-1 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            256-Bit SSL Encryption
          </div>
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Your payment information is encrypted and secure. We never store
            full card numbers.
          </div>
        </div>
      </motion.div>
    </div>
  );
};
