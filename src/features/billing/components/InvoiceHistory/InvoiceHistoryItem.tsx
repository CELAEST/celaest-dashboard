import React from "react";
import { motion } from "motion/react";
import { DownloadSimple, FileText, CreditCard, CheckCircle } from "@phosphor-icons/react";
import { Invoice } from "../../types";
import {
  getInvoiceActionId,
  getInvoiceReferenceSuffix,
} from "../../lib/invoice-utils";

interface InvoiceHistoryItemProps {
  invoice: Invoice;
  isDark: boolean;
  downloadingId: string | null;
  onDownload: (id: string) => void;
  index: number;
}

export const InvoiceHistoryItem: React.FC<InvoiceHistoryItemProps> = ({
  invoice,
  isDark,
  downloadingId,
  onDownload,
  index,
}) => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const actionId = getInvoiceActionId(invoice);

  // Wrapper to handle local success state
  const handleDownloadWrapper = async (id: string) => {
    onDownload(id);
  };

  // Watch for end of download to trigger success
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isSuccess) {
      timeout = setTimeout(() => setIsSuccess(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [isSuccess]);

  // Enhanced watcher: If this ID WAS downloading and now ISN'T, set success
  const prevDownloadingId = React.useRef(downloadingId);
  React.useEffect(() => {
    if (prevDownloadingId.current === actionId && downloadingId === null) {
      setIsSuccess(true);
    }
    prevDownloadingId.current = downloadingId;
  }, [downloadingId, actionId]);

  const last4 = getInvoiceReferenceSuffix(invoice);
  const billingPeriod = React.useMemo(() => {
    const date = new Date(invoice.created_at);
    const prevMonth = new Date(date);
    prevMonth.setMonth(date.getMonth() - 1);
    return `${prevMonth.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  }, [invoice.created_at]);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        transition-colors duration-200 group relative
        ${isDark ? "hover:bg-white/2" : "hover:bg-gray-50/50"}
      `}
    >
      {/* Invoice Number */}
      <td className="px-6 py-4 align-middle whitespace-nowrap">
        <div className="flex items-center gap-3">
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
      </td>

      {/* Date */}
      <td className="px-6 py-4 align-middle whitespace-nowrap">
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
      </td>

      {/* Description */}
      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
          >
            {invoice.customer_name || invoice.billing_name || "Premium Subscription"}
          </span>
          <span
            className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}
          >
            {billingPeriod}
          </span>
        </div>
      </td>

      {/* Payment Method */}
      <td className="px-6 py-4 align-middle whitespace-nowrap">
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
      </td>

      {/* Amount */}
      <td className="px-6 py-4 text-right align-middle whitespace-nowrap">
        <span
          className={`text-sm font-bold font-mono ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {invoice.currency === "EUR" ? "€" : "$"}
          {invoice.total.toFixed(2)}
        </span>
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4 align-middle whitespace-nowrap">
        <div className="flex justify-center">
          <span
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
              ${
                invoice.status === "paid"
                  ? isDark
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-emerald-50 text-emerald-700"
                  : isDark
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-amber-50 text-amber-700"
              }
            `}
          >
            {invoice.status}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 align-middle whitespace-nowrap">
        <div className="flex justify-center">
          <motion.button
            onClick={() => actionId && handleDownloadWrapper(actionId)}
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
        </div>
      </td>
    </motion.tr>
  );
};
