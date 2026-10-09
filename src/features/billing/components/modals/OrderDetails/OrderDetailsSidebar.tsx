import React from "react";
import { User, CreditCard, Key, Envelope, FileText } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { Order } from "../../../types";
import { useTranslations } from "next-intl";

interface OrderDetailsSidebarProps {
  formData: Order;
  mode: "view" | "edit";
  updateField: (field: keyof Order, value: string) => void;
  onDownload?: () => void;
}

export const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({
  formData,
  mode,
  updateField,
  onDownload,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = useTranslations("billing");
  const tCommon = useTranslations("common");

  return (
    <div
      className={`rounded-2xl p-5 space-y-5 border transition-colors ${
        isDark
          ? "bg-[#09090b] border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Price Card */}
      <div className={`text-center pb-5 border-b ${isDark ? "border-white/6" : "border-gray-200"}`}>
        <div
          className={`text-[10px] font-mono font-semibold uppercase tracking-[0.16em] mb-1 ${
            isDark ? "text-white/40" : "text-gray-500"
          }`}
        >
          {t("total_paid")}
        </div>
        {mode === "view" ? (
          <div
            className={`text-3xl font-mono font-bold tracking-tight tabular-nums ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {formData.amount}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <span className="text-xl mr-1 text-gray-500">$</span>
            <input
              type="number"
              className={`w-28 bg-transparent text-center text-2xl font-mono font-bold outline-none border-b border-dashed ${
                isDark
                  ? "text-white border-white/20"
                  : "text-gray-900 border-gray-300"
              }`}
              value={formData.amount.replace("$", "").replace(",", "")}
              onChange={(e) => updateField("amount", `$${e.target.value}`)}
            />
          </div>
        )}
      </div>

      {/* Customer Info */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isDark ? "bg-white/[0.04] border border-white/8 text-white/50" : "bg-white border border-gray-200 text-gray-500"
            }`}
          >
            <User size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={`text-[10px] font-mono uppercase tracking-[0.14em] ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {tCommon("customer")}
            </div>
            {mode === "view" ? (
              <div
                className={`text-xs font-medium truncate mt-0.5 ${
                  isDark ? "text-zinc-200" : "text-gray-900"
                }`}
              >
                {formData.customer}
              </div>
            ) : (
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => updateField("customer", e.target.value)}
                className={`w-full mt-0.5 bg-transparent border-b outline-none text-xs ${
                  isDark
                    ? "border-white/20 text-white"
                    : "border-gray-300 text-gray-900"
                }`}
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isDark ? "bg-white/[0.04] border border-white/8 text-white/50" : "bg-white border border-gray-200 text-gray-500"
            }`}
          >
            <CreditCard size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={`text-[10px] font-mono uppercase tracking-[0.14em] ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {t("method")}
            </div>
            <div
              className={`text-xs font-mono capitalize mt-0.5 ${
                isDark ? "text-zinc-300" : "text-gray-600"
              }`}
            >
              {formData.paymentProvider || "Stripe"}{" "}
              {formData.paymentMethod === "card" ? "• Card" : ""}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isDark ? "bg-white/[0.04] border border-white/8 text-white/50" : "bg-white border border-gray-200 text-gray-500"
            }`}
          >
            <Key size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={`text-[10px] font-mono uppercase tracking-[0.14em] ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {t("license_key")}
            </div>
            <div
              className={`text-xs font-mono truncate mt-0.5 ${
                isDark ? "text-zinc-300" : "text-gray-600"
              }`}
              title={formData.licenseKey || "N/A"}
            >
              {formData.licenseKey || "N/A"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isDark ? "bg-white/[0.04] border border-white/8 text-white/50" : "bg-white border border-gray-200 text-gray-500"
            }`}
          >
            <Envelope size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={`text-[10px] font-mono uppercase tracking-[0.14em] ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {t("delivery_email")}
            </div>
            <div
              className={`text-xs font-mono truncate mt-0.5 ${
                isDark ? "text-white/60" : "text-gray-600"
              }`}
            >
              {formData.userEmail || "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={() => {
            if (onDownload) {
              onDownload();
            } else {
              toast.success(t("downloading_invoice_for", { id: formData.id }), {
                description: t("check_downloads"),
              });
            }
          }}
          className={`w-full h-9 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            isDark
              ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200"
              : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          <FileText size={14} className={isDark ? "text-white/60" : "text-gray-500"} />
          <span>{t("download_invoice")}</span>
        </button>
      </div>
    </div>
  );
};
