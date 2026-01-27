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
      <table className="w-full">
        <thead>
          <tr
            className={`border-b ${
              isDark ? "border-white/10" : "border-gray-200"
            }`}
          >
            <th
              className={`text-left pb-4 text-xs font-semibold tracking-wider ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              INVOICE
            </th>
            <th
              className={`text-left pb-4 text-xs font-semibold tracking-wider ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              DATE
            </th>
            <th
              className={`text-left pb-4 text-xs font-semibold tracking-wider ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              DESCRIPTION
            </th>
            <th
              className={`text-right pb-4 text-xs font-semibold tracking-wider ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              AMOUNT
            </th>
            <th
              className={`text-center pb-4 text-xs font-semibold tracking-wider ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              STATUS
            </th>
            <th
              className={`text-right pb-4 text-xs font-semibold tracking-wider ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
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
