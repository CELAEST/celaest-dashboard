"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { BillingModal } from "./shared/BillingModal";
import { Plan } from "../../types";
import { PlanCard } from "../ui/PlanCard";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for small businesses just starting out.",
    features: [
      "Up to 5 users",
      "Basic analytics",
      "Email support",
      "5GB storage",
    ],
    popular: false,
    color: "blue",
  },
  {
    name: "Pro",
    price: "$299",
    period: "/month",
    description: "Ideal for growing teams requiring more power.",
    features: [
      "Up to 20 users",
      "Advanced analytics",
      "Priority support",
      "20GB storage",
      "API access",
    ],
    popular: true,
    color: "purple",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with specific needs.",
    features: [
      "Unlimited users",
      "Custom analytics",
      "24/7 Dedicated support",
      "Unlimited storage",
      "SSO & Advanced Security",
    ],
    popular: false,
    color: "emerald",
  },
];

export function UpgradePlanModal({ isOpen, onClose }: UpgradePlanModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-6xl bg-transparent! rounded-4xl shadow-none! border-0!"
      showCloseButton={false}
    >
      <div
        className={`relative w-full h-full rounded-4xl overflow-hidden flex flex-col shadow-2xl ${
          isDark
            ? "bg-[#0f172a] border border-white/10 shadow-purple-900/20"
            : "bg-white border border-gray-200 shadow-xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Glows */}
        {isDark && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen" />
          </div>
        )}

        {/* Header - Compact */}
        <div className="relative px-4 sm:px-6 pt-4 sm:pt-6 pb-2 text-center shrink-0 z-10">
          <button
            onClick={onClose}
            className={`absolute right-3 top-3 sm:right-4 sm:top-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:scale-110 ${
              isDark
                ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5"
                : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900"
            }`}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span
              className={`inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-2 ${
                isDark
                  ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              Pricing Plans
            </span>
            <h2
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-1 sm:mb-2 tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Choose Your Growth Path
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Unlock powerful features and scale your business with flexible
            plans.
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="relative px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 z-10">
          {/* Small top padding for badge */}
          <div className="pt-5 sm:pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto items-stretch">
              {PLANS.map((plan, index) => (
                <PlanCard
                  key={plan.name}
                  plan={plan}
                  index={index}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </BillingModal>
  );
}
