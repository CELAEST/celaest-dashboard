"use client";

import React, { useState } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { InvoiceHistoryTable } from "./InvoiceHistory/InvoiceHistoryTable";
import { useInvoicesQuery } from "../hooks/useInvoicesQuery";
import { CircleNotch } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { billingApi } from "../api/billing.api";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export const InvoiceHistory: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { session } = useAuthStore();
  const { currentOrg } = useOrgStore();

  const token = session?.accessToken;
  const orgId = currentOrg?.id;

  // Use paginated invoices query
  const { invoices, totalInvoices, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInvoicesQuery();

  const voidMutation = useMutation({
    mutationFn: (invoiceId: string) => {
      if (!token || !orgId) throw new Error("Auth required");
      return billingApi.voidInvoice(orgId, token, invoiceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orgId
          ? QUERY_KEYS.billing.profile(orgId)
          : QUERY_KEYS.billing.all,
      });
      toast.success("Invoice has been voided.");
    },
    onError: () => toast.error("Failed to void invoice."),
  });

  const payMutation = useMutation({
    mutationFn: (invoiceId: string) => {
      if (!token || !orgId) throw new Error("Auth required");
      return billingApi.payInvoice(orgId, token, invoiceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orgId
          ? QUERY_KEYS.billing.profile(orgId)
          : QUERY_KEYS.billing.all,
      });
      toast.success("Invoice marked as paid.");
    },
    onError: () => toast.error("Failed to mark invoice as paid."),
  });

  const handleDownload = async (invoiceId: string) => {
    setDownloadingId(invoiceId);
    // Find the invoice to get the URL
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (invoice?.pdf_url) {
      window.open(invoice.pdf_url, "_blank");
    } else {
      // Fallback or mock download delay if no URL
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    setDownloadingId(null);
  };

  if (isLoading) {
    return (
      <div
        className={`flex-1 overflow-hidden flex flex-col rounded-2xl p-8 items-center justify-center ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/10"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <CircleNotch className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div
      className={`flex-1 overflow-hidden flex flex-col rounded-2xl transition-all duration-300 hover:shadow-2xl ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3
              className={`font-semibold mb-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Invoice ClockCounterClockwise
            </h3>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              DownloadSimple past invoices and track your payment history
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-lg text-sm ${
              isDark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-600"
            }`}
          >
          {invoices.length} Invoices
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
        <InvoiceHistoryTable
          invoices={invoices}
          isDark={isDark}
          downloadingId={downloadingId}
          onDownload={handleDownload}
          onVoid={(id) => voidMutation.mutate(id)}
          onPay={(id) => payMutation.mutate(id)}
          isLoadingAction={voidMutation.isPending || payMutation.isPending}
          isLoading={isLoading}
          totalItems={totalInvoices}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      </div>

      {/* Footer */}
      <div
        className={`shrink-0 p-4 pt-2 text-sm flex items-center justify-between ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}
      >
        <span>Showing {invoices.length} of {totalInvoices} invoices</span>
        <button
          className={`font-semibold transition-colors duration-300 ${
            isDark
              ? "text-cyan-400 hover:text-cyan-300"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          View Transaction Details →
        </button>
      </div>
    </div>
  );
};
