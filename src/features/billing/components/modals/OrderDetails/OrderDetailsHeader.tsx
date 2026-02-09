import React from "react";
import { X, Package } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface OrderDetailsHeaderProps {
  orderId: string;
  orderDate: string;
  onClose: () => void;
}

export const OrderDetailsHeader: React.FC<OrderDetailsHeaderProps> = ({
  orderId,
  orderDate,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative px-8 py-6 flex justify-between items-start overflow-hidden shrink-0">
      <div
        className={`absolute inset-0 opacity-10 ${
          isDark
            ? "bg-linear-to-r from-purple-500 via-indigo-600 to-blue-600"
            : "bg-linear-to-r from-purple-100 via-indigo-100 to-blue-100"
        }`}
      />

      <div className="relative z-10 flex gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
            isDark
              ? "bg-[#111] text-purple-400 border border-white/10"
              : "bg-white text-purple-600 shadow-purple-200/50"
          }`}
        >
          <Package size={24} />
        </div>
        <div>
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Order {orderId}
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                isDark
                  ? "bg-white/10 text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Purchased: {orderDate}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <button
          onClick={onClose}
          className={`p-2 rounded-full transition-colors ${
            isDark
              ? "hover:bg-white/10 text-gray-400"
              : "hover:bg-black/5 text-gray-500"
          }`}
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};
