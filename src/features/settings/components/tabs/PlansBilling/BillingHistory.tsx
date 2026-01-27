import React, { memo } from "react";
import { Receipt, ArrowUpRight, Download } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const BillingHistory: React.FC = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-base font-bold flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
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
                className={`text-sm font-bold ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
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
  );
});

BillingHistory.displayName = "BillingHistory";
