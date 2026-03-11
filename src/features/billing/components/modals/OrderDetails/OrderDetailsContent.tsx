import React from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { SettingsSelect } from "../../../../settings/components/SettingsSelect";
import { Order, OrderActivityEvent } from "../../../types";

const EVENT_LABELS: Record<string, string> = {
  created: "Order Created",
  paid: "Payment Confirmed",
  completed: "Order Completed",
  cancelled: "Order Cancelled",
  refunded: "Order Refunded",
};

function formatEventDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

interface OrderDetailsContentProps {
  formData: Order;
  mode: "view" | "edit";
  updateField: (field: keyof Order, value: string) => void;
  events?: OrderActivityEvent[];
}

export const OrderDetailsContent: React.FC<OrderDetailsContentProps> = ({
  formData,
  mode,
  updateField,
  events = [],
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Events come sorted ASC from backend; show newest first for the timeline
  const sortedEvents = [...events].reverse();

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
                {formData.itemType
                  ? `Type: ${formData.itemType.charAt(0).toUpperCase() + formData.itemType.slice(1)}`
                  : "Digital Product"}
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

            <div className="space-y-8">
              {/* Current Status (always first) */}
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

              {/* Real events from DB */}
              {sortedEvents.map((event, idx) => {
                const opacity = idx === 0 ? "opacity-70" : "opacity-40";
                return (
                  <div key={event.id} className={`relative pl-8 ${opacity}`}>
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
                      {EVENT_LABELS[event.type] || event.type}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {formatEventDate(event.createdAt)}
                    </div>
                  </div>
                );
              })}

              {sortedEvents.length === 0 && (
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
                    No events recorded
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {formData.date}
                  </div>
                </div>
              )}
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
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "active", label: "Active" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
                { value: "failed", label: "Failed" },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};
