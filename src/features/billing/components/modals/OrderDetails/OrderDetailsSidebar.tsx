import React from "react";
import { User, CreditCard, Key, Mail, FileText } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Order } from "../../../types";

interface OrderDetailsSidebarProps {
  formData: Order;
  mode: "view" | "edit";
  updateField: (field: keyof Order, value: string) => void;
}

export const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({
  formData,
  mode,
  updateField,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-2xl p-6 space-y-6 ${
        isDark
          ? "bg-white/5 border border-white/5"
          : "bg-gray-50 border border-gray-100"
      }`}
    >
      {/* Price Card */}
      <div className="text-center pb-6 border-b border-gray-500/10">
        <div
          className={`text-sm font-medium mb-1 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Total Paid
        </div>
        {mode === "view" ? (
          <div
            className={`text-4xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {formData.amount}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <span className="text-2xl mr-1 text-gray-500">$</span>
            <input
              type="number"
              className={`w-32 bg-transparent text-center text-3xl font-bold outline-none border-b border-dashed ${
                isDark
                  ? "text-white border-gray-700"
                  : "text-gray-900 border-gray-300"
              }`}
              value={formData.amount.replace("$", "").replace(",", "")}
              onChange={(e) => updateField("amount", `$${e.target.value}`)}
            />
          </div>
        )}
      </div>

      {/* Customer Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-white/5" : "bg-white shadow-sm"
            }`}
          >
            <User
              size={16}
              className={isDark ? "text-gray-400" : "text-gray-500"}
            />
          </div>
          <div>
            <div
              className={`text-xs font-bold uppercase ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Customer
            </div>
            {mode === "view" ? (
              <div
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {formData.customer}
              </div>
            ) : (
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => updateField("customer", e.target.value)}
                className={`w-full mt-1 bg-transparent border-b outline-none text-sm ${
                  isDark
                    ? "border-gray-700 text-white"
                    : "border-gray-300 text-gray-900"
                }`}
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-white/5" : "bg-white shadow-sm"
            }`}
          >
            <CreditCard
              size={16}
              className={isDark ? "text-gray-400" : "text-gray-500"}
            />
          </div>
          <div>
            <div
              className={`text-xs font-bold uppercase ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Method
            </div>
            <div
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Stripe •••• 4242
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-white/5" : "bg-white shadow-sm"
            }`}
          >
            <Key
              size={16}
              className={isDark ? "text-gray-400" : "text-gray-500"}
            />
          </div>
          <div>
            <div
              className={`text-xs font-bold uppercase ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              License Key
            </div>
            <div
              className={`text-sm font-mono truncate w-32 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              XXXX-XXXX-XXXX
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-white/5" : "bg-white shadow-sm"
            }`}
          >
            <Mail
              size={16}
              className={isDark ? "text-gray-400" : "text-gray-500"}
            />
          </div>
          <div>
            <div
              className={`text-xs font-bold uppercase ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Delivery Email
            </div>
            <div
              className={`text-sm truncate w-32 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              user@example.com
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={() =>
            toast.success(`Downloading invoice for ${formData.id}...`, {
              description: "Check your downloads folder.",
            })
          }
          className={`w-full py-2.5 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-colors ${
            isDark
              ? "border-white/10 hover:bg-white/5 text-gray-300"
              : "border-gray-200 hover:bg-gray-50 text-gray-600"
          }`}
        >
          <FileText size={16} />
          Download Invoice
        </button>
      </div>
    </div>
  );
};
