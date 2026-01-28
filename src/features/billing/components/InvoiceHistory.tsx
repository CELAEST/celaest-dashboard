"use client";

import React, { useState } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Invoice } from "../types";
import { InvoiceHistoryTable } from "./InvoiceHistory/InvoiceHistoryTable";

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
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
        <InvoiceHistoryTable
          invoices={invoices}
          isDark={isDark}
          downloadingId={downloadingId}
          onDownload={handleDownload}
        />
      </div>

      {/* Footer */}
      <div
        className={`shrink-0 p-4 pt-2 text-sm flex items-center justify-between ${
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
  );
};
