import React from "react";
import { Package } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { SettingsSelect } from "../../../../settings/components/SettingsSelect";
import { Order, OrderActivityEvent } from "../../../types";
import { useTranslations } from "next-intl";

const getEventLabels = (t: ReturnType<typeof import("next-intl").useTranslations>): Record<string, string> => ({
  created: t("event_created"),
  paid: t("event_paid"),
  completed: t("event_completed"),
  cancelled: t("event_cancelled"),
  refunded: t("event_refunded"),
});

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
  const t = useTranslations("billing");
  const eventLabels = getEventLabels(t);

  // Events come sorted ASC from backend; show newest first for the timeline
  const sortedEvents = [...events].reverse();

  return (
    <div className="space-y-6">
      {/* Product Section */}
      <div className="space-y-2.5">
        <h3
          className={`text-[10px] font-mono font-semibold uppercase tracking-[0.16em] ${
            isDark ? "text-white/40" : "text-gray-400"
          }`}
        >
          {t("digital_product")}
        </h3>
        <div
          className={`p-3.5 rounded-xl border transition-colors ${
            isDark ? "bg-white/[0.02] border-white/8" : "bg-gray-50 border-gray-200"
          }`}
        >
          {mode === "view" ? (
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isDark ? "bg-white/[0.04] border border-white/8 text-white/60" : "bg-gray-100 text-gray-600"
                }`}
              >
                <Package size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className={`text-xs font-semibold truncate ${
                    isDark ? "text-zinc-100" : "text-gray-900"
                  }`}
                >
                  {formData.product}
                </div>
                <div
                  className={`text-[10px] font-mono uppercase mt-0.5 ${
                    isDark ? "text-white/40" : "text-gray-500"
                  }`}
                >
                  {formData.itemType
                    ? t("type_label", { type: formData.itemType.charAt(0).toUpperCase() + formData.itemType.slice(1) })
                    : t("digital_product")}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label
                className={`text-[10px] font-mono uppercase ${
                  isDark ? "text-white/40" : "text-gray-500"
                }`}
              >
                {t("product_name")}
              </label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => updateField("product", e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg bg-transparent border text-xs outline-none font-semibold ${
                  isDark
                    ? "border-white/10 focus:border-white/30 text-white"
                    : "border-gray-200 focus:border-gray-400 text-gray-900"
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Log / Status Tracker */}
      <div className="space-y-2.5">
        <h3
          className={`text-[10px] font-mono font-semibold uppercase tracking-[0.16em] ${
            isDark ? "text-white/40" : "text-gray-400"
          }`}
        >
          {t("activity_log")}
        </h3>
        {mode === "view" ? (
          <div className="relative">
            {/* Minimal Center Line */}
            <div
              className={`absolute top-2 bottom-2 left-[5px] w-px ${
                isDark ? "bg-white/10" : "bg-gray-200"
              }`}
            />

            <div className="space-y-5">
              {/* Current Status (always first) */}
              <div className="relative pl-6">
                <div
                  className={`absolute left-[1px] top-1 w-2.5 h-2.5 rounded-full z-10 ${
                    isDark
                      ? "bg-white ring-4 ring-white/10"
                      : "bg-gray-900 ring-4 ring-gray-100"
                  }`}
                />
                <div
                  className={`font-semibold text-xs leading-tight ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formData.status}
                </div>
                <div
                  className={`text-[10px] font-mono mt-0.5 ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}
                >
                  {t("current_status")}
                </div>
              </div>

              {/* Real events from DB */}
              {sortedEvents.map((event, idx) => {
                const opacity = idx === 0 ? "opacity-75" : "opacity-40";
                return (
                  <div key={event.id} className={`relative pl-6 ${opacity}`}>
                    <div
                      className={`absolute left-[2px] top-1 w-2 h-2 rounded-full z-10 ${
                        isDark
                          ? "bg-white/40"
                          : "bg-gray-400"
                      }`}
                    />
                    <div
                      className={`font-medium text-xs leading-tight ${
                        isDark ? "text-zinc-300" : "text-gray-800"
                      }`}
                    >
                      {eventLabels[event.type] || event.type}
                    </div>
                    <div
                      className={`text-[10px] font-mono mt-0.5 ${
                        isDark ? "text-white/40" : "text-gray-400"
                      }`}
                    >
                      {formatEventDate(event.createdAt)}
                    </div>
                  </div>
                );
              })}

              {sortedEvents.length === 0 && (
                <div className="relative pl-6 opacity-40">
                  <div
                    className={`absolute left-[2px] top-1 w-2 h-2 rounded-full z-10 ${
                      isDark
                        ? "bg-white/30"
                        : "bg-gray-300"
                    }`}
                  />
                  <div
                    className={`font-medium text-xs leading-tight ${
                      isDark ? "text-zinc-300" : "text-gray-800"
                    }`}
                  >
                    {t("no_events_recorded")}
                  </div>
                  <div
                    className={`text-[10px] font-mono mt-0.5 ${
                      isDark ? "text-white/40" : "text-gray-400"
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
              {t("update_status")}
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
