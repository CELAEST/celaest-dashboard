import { logger } from "@/lib/logger";
import React, { memo, useState, useEffect } from "react";
import { CreditCard, Plus } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { billingApi } from "@/features/billing/api/billing.api";
import { PaymentMethod as PaymentMethodType } from "@/features/billing/types";
import { useTranslations } from "next-intl";

export const PaymentMethod: React.FC = memo(() => {
  const { isDark } = useTheme();
  const [methods, setMethods] = useState<PaymentMethodType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { session } = useAuthStore();
  const { currentOrg } = useOrgStore();
  const t = useTranslations("settings");

  useEffect(() => {
    const fetchMethods = async () => {
      if (!session?.accessToken || !currentOrg?.id) return;

      try {
        setIsLoading(true);
        const res = await billingApi.getPaymentMethods(
          currentOrg.id,
          session.accessToken,
        );
        setMethods(res);
      } catch (error: unknown) {
        logger.error("Failed to fetch payment methods:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMethods();
  }, [session?.accessToken, currentOrg?.id]);

  if (isLoading) {
    return (
      <div className="settings-glass-card rounded-2xl p-6 flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white/80"></div>
      </div>
    );
  }

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-base font-bold font-jakarta flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <CreditCard className={`w-4 h-4 ${isDark ? "text-white/70" : "text-gray-700"}`} />
          {t("payment_method")}
        </h3>
        <button
          type="button"
          onClick={() => toast.info(t("stripe_checkout_info"))}
          className={`flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
            isDark ? "text-white/80 hover:text-white" : "text-gray-700 hover:text-gray-900"
          }`}
        >
          <Plus size={14} weight="bold" />
          {t("add_new")}
        </button>
      </div>

      <div>
        {methods.length === 0 ? (
          <p className={`text-xs py-4 text-center ${isDark ? "text-white/40" : "text-gray-500"}`}>
            {t("no_payment_methods")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methods.map((method) => (
            <div
              key={method.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]"
                  : "bg-gray-50 border-gray-100 shadow-xs"
              } ${method.is_default || method.isDefault ? isDark ? "border-white/20 ring-1 ring-white/10" : "border-gray-900" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isDark
                      ? "bg-white/[0.04] border border-white/10"
                      : "bg-white border border-gray-100 shadow-xs"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-white/50" />
                </div>
                <div>
                  <p
                    className={`font-bold text-sm flex flex-wrap items-center gap-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <span className="font-mono">{method.brand?.toUpperCase() || t("card")} **** {method.last4}</span>
                    {(method.is_default || method.isDefault) && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase tracking-wider border ${
                        isDark
                          ? "bg-white/[0.08] text-white border-white/15"
                          : "bg-gray-900 text-white border-gray-900"
                      }`}>
                        {t("default")}
                      </span>
                    )}
                  </p>
                  <p className={`text-xs font-mono mt-0.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                    {t("expires")} {method.expiry_month || method.expiryMonth}/
                    {method.expiry_year || method.expiryYear}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toast.info(t("payment_settings_info"))}
                className={`text-xs font-black tracking-widest transition-colors self-end sm:self-auto ${
                  isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {t("edit")}
              </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

PaymentMethod.displayName = "PaymentMethod";
