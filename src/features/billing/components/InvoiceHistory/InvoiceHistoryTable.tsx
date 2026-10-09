import React, { useMemo, useState, useEffect, useRef } from "react";
import { Invoice } from "../../types";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  DownloadSimple,
  Receipt,
  CreditCard,
  Check,
  Clock,
  X,
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
import { useTranslations } from "next-intl";

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
  hideFooter?: boolean;
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
  t: ReturnType<typeof import("next-intl").useTranslations>;
}> = ({
  invoice,
  isDark,
  downloadingId,
  onDownload,
  onVoid,
  onPay,
  isLoadingAction,
  t,
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
      const timer = setTimeout(() => setIsSuccess(true), 0);
      previousDownloadingIdRef.current = downloadingId;
      return () => clearTimeout(timer);
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
      <button
        onClick={() => actionId && onDownload(actionId)}
        disabled={!actionId || downloadingId === actionId || isSuccess}
        className={`
          relative flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium uppercase tracking-wider border overflow-hidden cursor-pointer transition-colors duration-150
          ${
            isSuccess
              ? isDark
                ? "border-white/20 text-white bg-white/10"
                : "border-gray-900 text-gray-900 bg-gray-100"
              : isDark
                ? "border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/5 hover:border-white/20"
                : "border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50"
          }
        `}
      >
        {downloadingId === actionId ? (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isSuccess ? (
          <div className="flex items-center gap-1">
            <Check size={12} strokeWidth={2.5} />
            <span>{t("done")}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <DownloadSimple size={12} strokeWidth={2} />
            <span>{t("pdf")}</span>
          </div>
        )}
      </button>

      {/* Admin Actions Dropdown */}
      {(onVoid || onPay) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isDark
                  ? "text-white/40 hover:text-white hover:bg-white/10"
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <DotsThreeVertical size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={isDark ? "bg-[#09090b] border-white/10 text-zinc-200 shadow-2xl rounded-xl p-1" : ""}
          >
            {actionId &&
              onPay &&
              invoice.status !== "paid" &&
              invoice.status !== "void" && (
                <DropdownMenuItem
                  onClick={() => onPay(actionId)}
                  disabled={isLoadingAction}
                  className={`gap-2 font-mono text-xs cursor-pointer ${isDark ? "text-zinc-200 focus:bg-white/10 focus:text-white" : "text-gray-700 focus:bg-gray-100"}`}
                >
                  <CheckSquare size={13} /> {t("force_mark_paid")}
                </DropdownMenuItem>
              )}
            {actionId &&
              onVoid &&
              invoice.status !== "void" &&
              invoice.status !== "paid" && (
                <DropdownMenuItem
                  onClick={() => onVoid(actionId)}
                  disabled={isLoadingAction}
                  className={`gap-2 font-mono text-xs cursor-pointer ${isDark ? "text-red-400 focus:bg-red-500/10 focus:text-red-300" : "text-red-600 focus:bg-red-50 focus:text-red-700"}`}
                >
                  <ShieldWarning size={13} /> {t("void_invoice")}
                </DropdownMenuItem>
              )}
            {(!actionId || invoice.status === "paid" || invoice.status === "void") && (
              <DropdownMenuItem
                disabled
                className="text-white/40 text-[11px] font-mono italic"
              >
                {actionId
                  ? t("no_admin_actions")
                  : t("invoice_id_unavailable")}
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
  hideFooter = true,
}) => {
  const t = useTranslations("billing");

  const columns: ColumnDef<Invoice>[] = useMemo(
    () => [
      {
        id: "invoice",
        header: t("invoice_header"),
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <div className="flex items-center gap-2.5 py-1">
              <div
                className={`
                  w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors
                  ${
                    isDark
                      ? "bg-white/[0.04] border-white/8 text-white/60"
                      : "bg-gray-100 border-gray-200 text-gray-600"
                  }
                `}
              >
                <Receipt size={14} />
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className={`font-mono text-xs font-semibold tracking-tight ${
                    isDark ? "text-zinc-100" : "text-gray-900"
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
        header: t("date"),
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <div className="flex flex-col gap-0.5">
              <span
                className={`text-xs font-medium ${isDark ? "text-zinc-200" : "text-gray-700"}`}
              >
                {new Date(invoice.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span
                className={`text-[10px] font-mono ${isDark ? "text-white/40" : "text-gray-400"}`}
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
        header: t("description"),
        cell: ({ row }) => {
          const invoice = row.original;
          const customerName = invoice.billing_name || invoice.customer_name || "";

          return (
            <div className="flex flex-col gap-0.5 min-w-0 max-w-[200px]">
              <span
                className={`text-xs font-medium truncate ${isDark ? "text-zinc-200" : "text-gray-900"}`}
              >
                {invoice.item_name || "Invoice"}
              </span>
              {customerName && (
                <span
                  className={`text-[10px] font-mono truncate ${isDark ? "text-white/40" : "text-gray-400"}`}
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
        header: t("payment_method"),
        cell: ({ row }) => {
          const invoice = row.original;
          const last4 = getInvoiceReferenceSuffix(invoice);
          return (
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono border ${
                isDark
                  ? "bg-white/[0.03] text-white/70 border-white/[0.06]"
                  : "bg-gray-50 text-gray-600 border-gray-200/60"
              }`}
            >
              <CreditCard
                size={12}
                className={isDark ? "text-white/40" : "text-gray-400"}
              />
              <span>•••• {last4}</span>
            </div>
          );
        },
      },
      {
        id: "amount",
        header: () => <div className="text-right">{t("amount")}</div>,
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <div
              className={`text-right text-xs font-bold font-mono tabular-nums ${
                isDark ? "text-zinc-100" : "text-gray-900"
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
        header: () => <div className="text-center">{t("status")}</div>,
        cell: ({ row }) => {
          const invoice = row.original;
          const s = (invoice.status || "").toLowerCase();

          const getStatusStyle = () => {
            if (isDark) {
              switch (s) {
                case "paid":
                  return "bg-white/[0.08] text-white border border-white/10 shadow-xs font-semibold";
                case "pending":
                case "issued":
                  return "bg-white/[0.03] text-white/50 border border-white/[0.05] font-medium";
                case "processing":
                  return "bg-white/[0.04] text-white/70 border border-white/[0.06] font-medium";
                case "void":
                case "cancelled":
                case "failed":
                  return "bg-red-500/10 text-red-300 border border-red-500/20 font-medium";
                default:
                  return "bg-white/[0.03] text-white/50 border border-white/[0.05] font-medium";
              }
            } else {
              switch (s) {
                case "paid":
                  return "bg-gray-900 text-white font-semibold shadow-xs";
                case "pending":
                case "issued":
                  return "bg-amber-50 text-amber-700 border border-amber-200 font-medium";
                case "processing":
                  return "bg-gray-100 text-gray-700 font-medium";
                case "void":
                case "cancelled":
                case "failed":
                  return "bg-red-50 text-red-700 border border-red-200 font-medium";
                default:
                  return "bg-gray-100 text-gray-600 font-medium";
              }
            }
          };

          const getStatusIcon = () => {
            switch (s) {
              case "paid":
                return <Check size={10} strokeWidth={3} className="mr-1 text-white/80" />;
              case "processing":
                return (
                  <Clock
                    size={10}
                    className="mr-1 animate-[spin_3s_linear_infinite] will-change-transform text-white/60"
                  />
                );
              case "void":
              case "cancelled":
              case "failed":
                return <X size={10} strokeWidth={3} className="mr-1 text-red-400" />;
              default:
                return <Clock size={10} className="mr-1 text-white/40" />;
            }
          };

          return (
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider ${getStatusStyle()}`}
              >
                {getStatusIcon()}
                {invoice.status === "void" ? t("void") : invoice.status}
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">{t("actions")}</div>,
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
              t={t}
            />
          );
        },
      },
    ],
    [isDark, downloadingId, onDownload, onVoid, onPay, isLoadingAction, t],
  );

  return (
    <div className="w-full relative flex-1 min-h-0 flex flex-col">
      <DataTable
        columns={columns}
        data={invoices}
        isLoading={isLoading ?? false}
        emptyMessage={t("no_invoices")}
        emptySubmessage={t("no_billing_history")}
        totalItems={totalItems}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
        hideFooter={hideFooter}
      />
    </div>
  );
};
