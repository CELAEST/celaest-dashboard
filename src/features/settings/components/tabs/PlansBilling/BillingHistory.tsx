import { logger } from "@/lib/logger";
import React, { memo, useState, useEffect } from "react";
import { Receipt, ArrowUpRight, Download } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { billingApi } from "@/features/billing/api/billing.api";
import { Invoice } from "@/features/billing/types";

export const BillingHistory: React.FC = memo(() => {
  const { isDark } = useTheme();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { session } = useAuthStore();
  const { currentOrg } = useOrgStore();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!session?.accessToken || !currentOrg?.id) return;

      try {
        setIsLoading(true);
        const res = await billingApi.getInvoices(
          currentOrg.id,
          session.accessToken,
        );
        setInvoices(res.invoices);
      } catch (error: unknown) {
        logger.error("Failed to fetch invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [session?.accessToken, currentOrg?.id]);

  if (isLoading) {
    return (
      <div className="settings-glass-card rounded-2xl p-6 flex justify-center py-12">
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
          <Receipt className="w-4 h-4 text-emerald-500" />
          Billing History
        </h3>
        <button
          className={`flex items-center gap-1.5 text-xs font-black tracking-widest transition-colors ${
            isDark
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          VIEW ALL
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="space-y-1">
        {invoices.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 italic text-center">
            No invoices found.
          </p>
        ) : (
          invoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`flex items-center justify-between py-4 border-b last:border-0 transition-colors ${
                isDark ? "border-white/5" : "border-gray-100"
              }`}
            >
              <div>
                <p
                  className={`text-sm font-bold ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Invoice {invoice.invoice_number}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">
                  {new Date(invoice.created_at).toLocaleDateString()} • $
                  {invoice.total} • {invoice.status.toUpperCase()}
                </p>
              </div>
              <button
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-white/5 text-gray-500"
                    : "hover:bg-gray-100 text-gray-400"
                }`}
                onClick={() =>
                  invoice.pdf_url && window.open(invoice.pdf_url, "_blank")
                }
              >
                <Download size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

BillingHistory.displayName = "BillingHistory";
