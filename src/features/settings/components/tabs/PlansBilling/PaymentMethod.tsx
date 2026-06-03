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
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-base font-bold flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <CreditCard className="w-4 h-4 text-purple-500" />
          {t("payment_method")}
        </h3>
        <button
          onClick={() => toast.info(t("stripe_checkout_info"))}
          className={`flex items-center gap-1 text-xs font-black tracking-widest transition-colors text-cyan-500 hover:text-cyan-400`}
        >
          <Plus size={14} />
          {t("add_new")}
        </button>
      </div>

      <div className="space-y-3">
        {methods.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 italic text-center">
            {t("no_payment_methods")}
          </p>
        ) : (
          methods.map((method) => (
            <div
              key={method.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                isDark
                  ? "bg-black/20 border-white/5"
                  : "bg-gray-50 border-gray-100 shadow-xs"
              } ${method.is_default || method.isDefault ? "border-cyan-500/50 ring-1 ring-cyan-500/20" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isDark
                      ? "bg-white/10"
                      : "bg-white border border-gray-100 shadow-sm"
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p
                    className={`font-bold text-sm flex flex-wrap items-center gap-1.5 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <span>{method.brand?.toUpperCase() || t("card")} **** {method.last4}</span>
                    {(method.is_default || method.isDefault) && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-500 uppercase font-black shrink-0">
                        {t("default")}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
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
          ))
        )}
      </div>
    </div>
  );
});

PaymentMethod.displayName = "PaymentMethod";
