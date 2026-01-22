"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Download, CheckCircle, Calendar } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}

export const InvoiceHistory: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const invoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-2026-001",
      date: "Dec 31, 2025",
      description: "Premium Tier - January 2026",
      amount: 299.0,
      status: "paid",
    },
    {
      id: "2",
      invoiceNumber: "INV-2025-012",
      date: "Nov 30, 2025",
      description: "Premium Tier - December 2025",
      amount: 299.0,
      status: "paid",
    },
    {
      id: "3",
      invoiceNumber: "INV-2025-011",
      date: "Oct 31, 2025",
      description: "Premium Tier - November 2025",
      amount: 299.0,
      status: "paid",
    },
    {
      id: "4",
      invoiceNumber: "INV-2025-010",
      date: "Sep 30, 2025",
      description: "Premium Tier - October 2025",
      amount: 299.0,
      status: "paid",
    },
    {
      id: "5",
      invoiceNumber: "INV-2025-009",
      date: "Aug 31, 2025",
      description: "Standard Tier - September 2025",
      amount: 199.0,
      status: "paid",
    },
  ];

  const handleDownload = async (invoiceId: string) => {
    setDownloadingId(invoiceId);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setDownloadingId(null);
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3
              className={`font-semibold mb-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Invoice History
            </h3>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Download past invoices and track your payment history
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

        {/* Table */}
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
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-b transition-all duration-300 group cursor-pointer ${
                    isDark
                      ? "border-white/5 hover:bg-white/5"
                      : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <td className="py-4">
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
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Calendar
                        className={`w-4 h-4 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {invoice.date}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {invoice.description}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span
                      className={`text-sm font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${invoice.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                          isDark
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-emerald-500/10 text-emerald-600 border border-emerald-200"
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        PAID
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDownload(invoice.id)}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className={`mt-4 text-sm flex items-center justify-between ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <span>Showing all {invoices.length} invoices</span>
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
    </div>
  );
};
