import React, { memo } from "react";
import { Check } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

export interface Plan {
  name: string;
  price: string;
  desc: string;
  features: string[];
  current: boolean;
  popular?: boolean;
}

interface PlanCardsProps {
  plans: Plan[];
}

export const PlanCards: React.FC<PlanCardsProps> = memo(({ plans }) => {
  const { isDark } = useTheme();

  const handleUpgrade = (plan: Plan) => {
    if (!plan.current) {
      toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
        loading: "Processing upgrade request...",
        success: () => {
          return `${plan.name} plan activated successfully!`;
        },
        error: "Failed to upgrade",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative p-6 rounded-2xl border transition-all hover:scale-[1.02] ${
            plan.current
              ? "border-cyan-500 bg-cyan-500/5 shadow-xl shadow-cyan-500/10"
              : isDark
                ? "border-white/5 bg-white/5 hover:border-white/10"
                : "border-gray-100 bg-gray-50 hover:border-gray-200"
          }`}
        >
          {plan.popular && (
            <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-cyan-600 text-white text-[10px] font-black tracking-widest">
              POPULAR
            </span>
          )}
          <h4
            className={`font-bold text-base mb-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {plan.name}
          </h4>
          <div className="flex items-baseline gap-1 mb-4">
            <span
              className={`text-2xl font-black ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {plan.price === "Custom" ? "" : "$"}
              {plan.price}
            </span>
            {plan.price !== "0" && plan.price !== "Custom" && (
              <span className="text-xs text-gray-500">/mo</span>
            )}
          </div>
          <p
            className={`text-xs mb-6 min-h-[32px] ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {plan.desc}
          </p>
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check
                  className={`w-3.5 h-3.5 ${
                    plan.current ? "text-cyan-500" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleUpgrade(plan)}
            className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
              plan.current
                ? "bg-transparent border border-cyan-500/30 text-cyan-500 cursor-default"
                : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 active:scale-95"
            }`}
          >
            {plan.current ? "CURRENT PLAN" : "UPGRADE"}
          </button>
        </div>
      ))}
    </div>
  );
});

PlanCards.displayName = "PlanCards";
