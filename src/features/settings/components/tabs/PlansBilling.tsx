"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Zap,
  Check,
  Download,
  Receipt,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

/**
 * Plans & Billing Settings Tab
 */
export function PlansBilling() {
  const { isDark } = useTheme();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "annually",
  );

  const plans = [
    {
      name: "Starter",
      price: billingCycle === "monthly" ? "0" : "0",
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
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Current Plan & Billing Cycle */}
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                isDark ? "bg-cyan-500/10" : "bg-cyan-50"
              }`}
            >
              <Zap
                className={`w-6 h-6 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
              />
            </div>
            <div>
              <h3
                className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Current Plan: <span className="text-cyan-500">Pro</span>
              </h3>
              <p
                className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Your next billing date is January 12, 2024.
              </p>
            </div>
          </div>

          <div
            className={`p-1 rounded-xl flex items-center shadow-sm transition-colors ${
              isDark ? "bg-white/5" : "bg-gray-100"
            }`}
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
              }`}
            >
              MONTHLY
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "annually"
                  ? "bg-white text-gray-900 shadow-sm"
                  : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
              }`}
            >
              ANNUALLY
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
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
                className={`font-bold text-base mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {plan.name}
              </h4>
              <div className="flex items-baseline gap-1 mb-4">
                <span
                  className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {plan.price === "Custom" ? "" : "$"}
                  {plan.price}
                </span>
                {plan.price !== "0" && plan.price !== "Custom" && (
                  <span className="text-xs text-gray-500">/mo</span>
                )}
              </div>
              <p
                className={`text-xs mb-6 min-h-[32px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
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
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  if (!plan.current) {
                    toast.promise(
                      new Promise((resolve) => setTimeout(resolve, 2000)),
                      {
                        loading: "Processing upgrade request...",
                        success: () => {
                          return `${plan.name} plan activated successfully!`;
                        },
                        error: "Failed to upgrade",
                      },
                    );
                  }
                }}
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
      </div>

      {/* Payment Method */}
      <div className="settings-glass-card rounded-2xl p-6">
        <h3
          className={`text-base font-bold mb-6 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          <CreditCard className="w-4 h-4 text-purple-500" />
          Payment Method
        </h3>
        <div
          className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
            isDark
              ? "bg-black/20 border-white/5"
              : "bg-gray-50 border-gray-100 shadow-xs"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-10 rounded-lg flex items-center justify-center ${
                isDark
                  ? "bg-white/10"
                  : "bg-white border border-gray-100 shadow-sm"
              }`}
            >
              <svg className="w-8 h-8" viewBox="0 0 48 48">
                <path
                  fill="#ff9800"
                  d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"
                />
                <path
                  fill="#d50000"
                  d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"
                />
                <path
                  fill="#ff3d00"
                  d="M18 24c0 4.4 2.1 8.3 5.3 10.8c3.2-2.5 5.3-6.4 5.3-10.8s-2.1-8.3-5.3-10.8c-3.2 2.5-5.3 6.4-5.3 10.8z"
                />
              </svg>
            </div>
            <div>
              <p
                className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Mastercard **** 8241
              </p>
              <p className="text-xs text-gray-500">Expires 12/26</p>
            </div>
          </div>
          <button
            onClick={() => toast.success("Payment method updated")}
            className={`text-xs font-black tracking-widest transition-colors ${
              isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            UPDATE
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="settings-glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            <Receipt className="w-4 h-4 text-emerald-500" />
            Billing History
          </h3>
          <button
            className={`flex items-center gap-1.5 text-xs font-black tracking-widest transition-colors ${
              isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            VIEW ALL
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="space-y-1">
          {[
            { date: "Dec 12, 2023", amount: "24.00", status: "Paid" },
            { date: "Nov 12, 2023", amount: "24.00", status: "Paid" },
            { date: "Oct 12, 2023", amount: "24.00", status: "Paid" },
          ].map((invoice, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-4 border-b last:border-0 transition-colors ${
                isDark ? "border-white/5" : "border-gray-100"
              }`}
            >
              <div>
                <p
                  className={`text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Invoice for {invoice.date}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">
                  ${invoice.amount} • {invoice.status}
                </p>
              </div>
              <button
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-white/5 text-gray-500"
                    : "hover:bg-gray-100 text-gray-400"
                }`}
              >
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
