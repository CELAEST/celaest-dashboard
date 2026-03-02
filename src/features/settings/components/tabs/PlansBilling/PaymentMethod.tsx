import { logger } from "@/lib/logger";
import React, { memo, useState, useEffect } from "react";
import { CreditCard, Plus } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { billingApi } from "@/features/billing/api/billing.api";
import { PaymentMethod as PaymentMethodType } from "@/features/billing/types";

export const PaymentMethod: React.FC = memo(() => {
  const { isDark } = useTheme();
  const [methods, setMethods] = useState<PaymentMethodType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { session } = useAuthStore();
  const { currentOrg } = useOrgStore();

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
          Payment Method
        </h3>
        <button
          onClick={() => toast.info("Stripe Checkout will open here")}
          className={`flex items-center gap-1 text-xs font-black tracking-widest transition-colors text-cyan-500 hover:text-cyan-400`}
        >
          <Plus size={14} />
          ADD NEW
        </button>
      </div>

      <div className="space-y-3">
        {methods.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 italic text-center">
            No payment methods registered.
          </p>
        ) : (
          methods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                isDark
                  ? "bg-black/20 border-white/5"
                  : "bg-gray-50 border-gray-100 shadow-xs"
              } ${method.is_default || method.isDefault ? "border-cyan-500/50 ring-1 ring-cyan-500/20" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-10 rounded-lg flex items-center justify-center ${
                    isDark
                      ? "bg-white/10"
                      : "bg-white border border-gray-100 shadow-sm"
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p
                    className={`font-bold text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {method.brand?.toUpperCase() || "CARD"} **** {method.last4}
                    {(method.is_default || method.isDefault) && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-500 uppercase font-black">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires {method.expiry_month || method.expiryMonth}/
                    {method.expiry_year || method.expiryYear}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toast.info("Payment method settings")}
                className={`text-xs font-black tracking-widest transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                EDIT
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

PaymentMethod.displayName = "PaymentMethod";
