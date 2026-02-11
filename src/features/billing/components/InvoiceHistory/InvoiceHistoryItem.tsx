import React from "react";
import { motion } from "motion/react";
import { Download, CheckCircle, Calendar } from "lucide-react";
import { Invoice } from "../../types";

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
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border-b transition-all duration-300 group cursor-pointer ${
        isDark
          ? "border-white/5 hover:bg-white/5"
          : "border-gray-100 hover:bg-gray-50"
      }`}
    >
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? "bg-cyan-500/10" : "bg-blue-500/10"
            }`}
          >
            <Download
              className={`w-4 h-4 ${
                isDark ? "text-cyan-400" : "text-blue-600"
              }`}
            />
          </div>
          <span
            className={`font-mono text-sm font-semibold ${
              isDark ? "text-cyan-400" : "text-blue-600"
            }`}
          >
            {invoice.invoice_number}
          </span>
        </div>
      </td>
      <td className="py-2">
        <div className="flex items-center gap-2">
          <Calendar
            className={`w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}
          />
          <span
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {new Date(invoice.created_at).toLocaleDateString()}
          </span>
        </div>
      </td>
      <td className="py-2">
        <span
          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          {invoice.billing_name || "Premium Subscription"}
        </span>
      </td>
      <td className="py-2 text-right">
        <span
          className={`text-sm font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {invoice.currency === "EUR" ? "€" : "$"}
          {invoice.total.toFixed(2)}
        </span>
      </td>
      <td className="py-2">
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
              isDark
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-emerald-500/10 text-emerald-600 border border-emerald-200"
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            {invoice.status.toUpperCase()}
          </span>
        </div>
      </td>
      <td className="py-2 text-right">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onDownload(invoice.id)}
          disabled={downloadingId === invoice.id}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            isDark
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20"
              : "bg-blue-500/10 text-blue-600 border border-blue-500/20 hover:bg-blue-500/20"
          }`}
        >
          {downloadingId === invoice.id ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Download PDF
        </motion.button>
      </td>
    </motion.tr>
  );
};
