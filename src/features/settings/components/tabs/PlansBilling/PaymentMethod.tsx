import React, { memo } from "react";
import { CreditCard } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

export const PaymentMethod: React.FC = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <h3
        className={`text-base font-bold mb-6 flex items-center gap-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
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
              className={`font-bold text-sm ${
                isDark ? "text-white" : "text-gray-900"
              }`}
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
  );
});

PaymentMethod.displayName = "PaymentMethod";
