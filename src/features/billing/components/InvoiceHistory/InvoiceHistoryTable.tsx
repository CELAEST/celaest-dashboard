import React from "react";
import { Invoice } from "../../types";
import { InvoiceHistoryItem } from "./InvoiceHistoryItem";

interface InvoiceHistoryTableProps {
  invoices: Invoice[];
  isDark: boolean;
  downloadingId: string | null;
  onDownload: (id: string) => void;
}

export const InvoiceHistoryTable: React.FC<InvoiceHistoryTableProps> = ({
  invoices,
  isDark,
  downloadingId,
  onDownload,
}) => {
  return (
    <div className="overflow-x-auto">
      {/* 
        Refactored: Removed 'table-fixed' and hardcoded widths. 
        Relies on standard table layout with uniform padding for robustness.
      */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr
            className={`border-b border-dashed ${
              isDark ? "border-white/10" : "border-gray-200"
            }`}
          >
            <th
              className={`px-6 py-4 text-[10px] uppercase tracking-wider font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Invoice
            </th>
            <th
              className={`px-6 py-4 text-[10px] uppercase tracking-wider font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Date
            </th>
            <th
              className={`px-6 py-4 text-[10px] uppercase tracking-wider font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Description
            </th>
            <th
              className={`px-6 py-4 text-[10px] uppercase tracking-wider font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Payment Method
            </th>
            <th
              className={`px-6 py-4 text-right text-[10px] uppercase tracking-wider font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Amount
            </th>
            <th
              className={`px-6 py-4 text-center text-[10px] uppercase tracking-wider font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Status
            </th>
            <th
              className={`px-6 py-4 text-center text-[10px] uppercase tracking-wider font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          className={`divide-y ${isDark ? "divide-white/5" : "divide-gray-50"}`}
        >
          {invoices.map((invoice, idx) => (
            <InvoiceHistoryItem
              key={invoice.id}
              invoice={invoice}
              isDark={isDark}
              downloadingId={downloadingId}
              onDownload={onDownload}
              index={idx}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
