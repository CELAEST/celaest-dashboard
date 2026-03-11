import React, { useMemo, useState, useEffect, useRef } from "react";
import { Invoice } from "../../types";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { motion } from "motion/react";
import {
  DownloadSimple,
  FileText,
  CreditCard,
  CheckCircle,
  DotsThreeVertical,
  ShieldWarning,
  CheckSquare,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getInvoiceActionId,
  getInvoiceReferenceSuffix,
} from "../../lib/invoice-utils";

interface InvoiceHistoryTableProps {
  invoices: Invoice[];
  isDark: boolean;
  downloadingId: string | null;
  onDownload: (id: string) => void;
  onVoid?: (id: string) => void;
  onPay?: (id: string) => void;
  isLoadingAction?: boolean;
  isLoading?: boolean;
  totalItems?: number;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

// Custom Cell component for the Actions column to maintain local state
const DownloadActionCell: React.FC<{
  invoice: Invoice;
  isDark: boolean;
  downloadingId: string | null;
  onDownload: (id: string) => void;
  onVoid?: (id: string) => void;
  onPay?: (id: string) => void;
  isLoadingAction?: boolean;
}> = ({
  invoice,
  isDark,
  downloadingId,
  onDownload,
  onVoid,
  onPay,
  isLoadingAction,
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const actionId = getInvoiceActionId(invoice);
  const previousDownloadingIdRef = useRef<string | null>(downloadingId);

  useEffect(() => {
    if (
      actionId &&
      previousDownloadingIdRef.current === actionId &&
      downloadingId === null
    ) {
      setIsSuccess(true);
    }

    previousDownloadingIdRef.current = downloadingId;
  }, [actionId, downloadingId]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isSuccess) {
      timeout = setTimeout(() => setIsSuccess(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [isSuccess]);

  return (
    <div className="flex justify-center items-center gap-2">
      <motion.button
        onClick={() => actionId && onDownload(actionId)}
        disabled={!actionId || downloadingId === actionId || isSuccess}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-medium uppercase tracking-wider border overflow-hidden
          ${
            isSuccess
              ? isDark
                ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                : "border-emerald-500 text-emerald-600 bg-emerald-50"
              : isDark
                ? "border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5"
                : "border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50"
          }
          transition-colors duration-300
        `}
      >
        {downloadingId === actionId ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5"
          >
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5"
          >
            <CheckCircle size={14} strokeWidth={2.5} />
            <span>Done</span>
          </motion.div>
        ) : (
          <div className="flex items-center gap-1.5">
            <DownloadSimple size={14} strokeWidth={2} />
            <span>PDF</span>
          </div>
        )}
      </motion.button>

      {/* Admin Actions Dropdown */}
      {(onVoid || onPay) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`p-1.5 rounded-md transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/10"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <DotsThreeVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={isDark ? "bg-[#111] border-white/10" : ""}
          >
            {actionId &&
              onPay &&
              invoice.status !== "paid" &&
              invoice.status !== "void" && (
                <DropdownMenuItem
                  onClick={() => onPay(actionId)}
                  disabled={isLoadingAction}
                  className={`gap-2 font-medium cursor-pointer ${isDark ? "text-emerald-400 focus:bg-emerald-500/10" : "text-emerald-600 focus:bg-emerald-50"}`}
                >
                  <CheckSquare size={14} /> Force Mark Paid
                </DropdownMenuItem>
              )}
            {actionId &&
              onVoid &&
              invoice.status !== "void" &&
              invoice.status !== "paid" && (
                <DropdownMenuItem
                  onClick={() => onVoid(actionId)}
                  disabled={isLoadingAction}
                  className={`gap-2 font-medium cursor-pointer ${isDark ? "text-red-400 focus:bg-red-500/10 focus:text-red-300" : "text-red-600 focus:bg-red-50 focus:text-red-700"}`}
                >
                  <ShieldWarning size={14} /> Void Invoice
                </DropdownMenuItem>
              )}
            {(!actionId || invoice.status === "paid" || invoice.status === "void") && (
              <DropdownMenuItem
                disabled
                className="text-gray-500 text-xs italic"
              >
                {actionId
                  ? "No administrative actions available"
                  : "Invoice ID unavailable"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export const InvoiceHistoryTable: React.FC<InvoiceHistoryTableProps> = ({
  invoices,
  isDark,
  downloadingId,
  onDownload,
  onVoid,
  onPay,
  isLoadingAction,
  isLoading,
  totalItems,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}) => {
  const columns: ColumnDef<Invoice>[] = useMemo(
    () => [
      {
        id: "invoice",
        header: "Invoice",
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <div className="flex items-center gap-3 py-2">
              <div
                className={`
                  w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300
                  ${
                    isDark
                      ? "bg-white/5 text-gray-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400"
                      : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }
                `}
              >
                <FileText size={16} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-mono text-sm font-semibold tracking-tight transition-colors ${
                    isDark
                      ? "text-gray-200 group-hover:text-white"
                      : "text-gray-900 group-hover:text-blue-700"
                  }`}
                >
                  {invoice.invoice_number}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: "date",
        header: "Date",
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <div className="flex flex-col gap-0.5">
              <span
                className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {new Date(invoice.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span
                className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}
              >
                {new Date(invoice.created_at).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        },
      },
      {
        id: "description",
        header: "Description",
        cell: ({ row }) => {
          const invoice = row.original;
          const customerName = invoice.billing_name || invoice.customer_name || "";

          return (
            <div className="flex flex-col gap-0.5">
              <span
                className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
              >
                {invoice.item_name || "Invoice"}
              </span>
              {customerName && (
                <span
                  className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}
                >
                  {customerName}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "payment_method",
        header: "Payment Method",
        cell: ({ row }) => {
          const invoice = row.original;
          const last4 = getInvoiceReferenceSuffix(invoice);
          return (
            <div className="flex items-center gap-2">
              <CreditCard
                size={14}
                className={isDark ? "text-gray-500" : "text-gray-400"}
              />
              <span
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                •••• {last4}
              </span>
            </div>
          );
        },
      },
      {
        id: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <div
              className={`text-right text-sm font-bold font-mono ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {invoice.currency === "EUR" ? "€" : "$"}
              {invoice.total.toFixed(2)}
            </div>
          );
        },
      },
      {
        id: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <div className="flex justify-center">
              <span
                className={`
                  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                  ${
                    invoice.status === "paid"
                      ? isDark
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-emerald-50 text-emerald-700"
                      : invoice.status === "void"
                        ? isDark
                          ? "bg-red-500/10 text-red-400 line-through"
                          : "bg-red-50 text-red-600 line-through"
                        : invoice.status === "cancelled"
                          ? isDark
                            ? "bg-gray-500/10 text-gray-400"
                            : "bg-gray-100 text-gray-500"
                          : isDark
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-amber-50 text-amber-700"
                  }
                `}
              >
                {invoice.status === "void" ? "anulada" : invoice.status}
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <DownloadActionCell
              invoice={invoice}
              isDark={isDark}
              downloadingId={downloadingId}
              onDownload={onDownload}
              onVoid={onVoid}
              onPay={onPay}
              isLoadingAction={isLoadingAction}
            />
          );
        },
      },
    ],
    [isDark, downloadingId, onDownload, onVoid, onPay, isLoadingAction],
  );

  return (
    <div className="w-full relative">
      <DataTable
        columns={columns}
        data={invoices}
        isLoading={isLoading ?? false}
        emptyMessage="No invoices found."
        emptySubmessage="You don't have any billing history yet."
        totalItems={totalItems}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
      />
    </div>
  );
};
