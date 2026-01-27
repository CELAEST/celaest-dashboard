import { useState, useMemo } from "react";
import { Plan } from "../components/tabs/PlansBilling/PlanCards";

export const useBillingSettings = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "annually",
  );

  const plans: Plan[] = useMemo(
    () => [
      {
        name: "Starter",
        price: "0",
        desc: "For individuals and small projects.",
        features: ["Up to 3 projects", "Basic analytics", "Community support"],
        current: false,
      },
      {
        name: "Pro",
        price: billingCycle === "monthly" ? "29" : "24",
        desc: "Perfect for growing businesses.",
        features: [
          "Unlimited projects",
          "Advanced analytics",
          "Priority support",
          "Custom domains",
        ],
        current: true,
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        desc: "For large-scale organizations.",
        features: [
          "SLA guarantee",
          "Dedicated manager",
          "Custom integrations",
          "Advanced security",
        ],
        current: false,
      },
    ],
    [billingCycle],
  );

  return {
    billingCycle,
    setBillingCycle,
    plans,
  };
};
