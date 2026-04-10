import React from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { InvoiceHistoryTable } from "../InvoiceHistory/InvoiceHistoryTable";
import { useInvoicesQuery } from "../../hooks/useInvoicesQuery";
import { TableSkeleton } from "@/components/ui/skeletons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { billingApi } from "../../api/billing.api";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { TableChrome } from "@/components/layout/TableChrome";
import { useState } from "react";

export const InvoicesView = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { session } = useAuthStore();
  const { currentOrg } = useOrgStore();

  const token = session?.accessToken;
  const orgId = currentOrg?.id;

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
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (invoice?.pdf_url) {
      window.open(invoice.pdf_url, "_blank");
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    setDownloadingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex-1 min-h-0 px-4 pb-4">
        <TableSkeleton rows={6} columns={5} />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 px-4 pb-4 overflow-hidden">
      <TableChrome
        toolbar={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                All Invoices
              </span>
            </div>
            <span className={`text-[11px] tabular-nums ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              {invoices.length > 0 ? `Showing ${invoices.length} of ${totalInvoices} entries` : ""}
            </span>
          </div>
        }
      >
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
      </TableChrome>
    </div>
  );
};
