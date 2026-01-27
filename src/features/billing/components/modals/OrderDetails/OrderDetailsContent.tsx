import React from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { SettingsSelect } from "../../../../settings/components/SettingsSelect";
import { Order } from "../../../types";

interface OrderDetailsContentProps {
  formData: Order;
  mode: "view" | "edit";
  updateField: (field: keyof Order, value: string) => void;
}

export const OrderDetailsContent: React.FC<OrderDetailsContentProps> = ({
  formData,
  mode,
  updateField,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-8">
      {/* Product Section */}
      <div className="space-y-4">
        <h3
          className={`text-sm font-bold uppercase tracking-widest ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Digital Product
        </h3>
        <div
          className={`p-4 rounded-xl border transition-colors ${
            isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"
          }`}
        >
          {mode === "view" ? (
            <div className="space-y-1">
              <div
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {formData.product}
              </div>
              <div
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                License Type: Enterprise
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Product Name
              </label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => updateField("product", e.target.value)}
                className={`w-full px-3 py-2 rounded-lg bg-transparent border outline-none font-semibold ${
                  isDark
                    ? "border-white/10 focus:border-purple-500 text-white"
                    : "border-gray-200 focus:border-purple-500 text-gray-900"
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Log / Status Tracker */}
      <div className="space-y-4">
        <h3
          className={`text-sm font-bold uppercase tracking-widest ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Activity Log
        </h3>
        {mode === "view" ? (
          <div className="relative">
            {/* Explicit Center Line */}
            <div
              className={`absolute top-2 bottom-0 left-[7px] w-[2px] border-l-2 border-dashed ${
                isDark ? "border-indigo-500/30" : "border-indigo-300"
              }`}
            />

            {/* Items */}
            <div className="space-y-8">
              {/* Current Status */}
              <div className="relative pl-8">
                <div
                  className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 z-10 ${
                    isDark
                      ? "bg-indigo-500 border-indigo-900 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      : "bg-indigo-600 border-white shadow-md"
                  }`}
                />
                <div
                  className={`font-semibold text-base leading-tight ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                >
                  {formData.status}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Current Status
                </div>
              </div>

              {/* Email Sent (Mock) */}
              <div className="relative pl-8 opacity-70">
                <div
                  className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 z-10 ${
                    isDark
                      ? "bg-gray-800 border-[#0a0a0a]"
                      : "bg-gray-200 border-white"
                  }`}
                />
                <div
                  className={`font-semibold text-base leading-tight ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  License Key Generated
                </div>
                <div
                  className={`text-xs mt-1 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Automated System
                </div>
              </div>

              {/* Order Placed (Mock) */}
              <div className="relative pl-8 opacity-40">
                <div
                  className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 z-10 ${
                    isDark
                      ? "bg-gray-800 border-[#0a0a0a]"
                      : "bg-gray-200 border-white"
                  }`}
                />
                <div
                  className={`font-semibold text-base leading-tight ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Payment Confirmed
                </div>
                <div
                  className={`text-xs mt-1 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {formData.date}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Update Status
            </label>
            <SettingsSelect
              label=""
              value={formData.status}
              onChange={(val) => updateField("status", val as string)}
              options={[
                { value: "Processing", label: "Processing" },
                { value: "Shipped", label: "Active" },
                { value: "Delivered", label: "Completed" },
                { value: "Pending", label: "Pending" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};
