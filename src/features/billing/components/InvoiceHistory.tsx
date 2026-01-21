'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Check, FileText, Calendar, ExternalLink } from 'lucide-react';
import { useTheme } from '@/features/shared/contexts/ThemeContext';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl?: string;
}

export const InvoiceHistory: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());

  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2026-001',
      date: '2026-01-01',
      description: 'Premium Tier - January 2026',
      amount: 299.00,
      status: 'paid',
    },
    {
      id: '2',
      invoiceNumber: 'INV-2025-012',
      date: '2025-12-01',
      description: 'Premium Tier - December 2025',
      amount: 299.00,
      status: 'paid',
    },
    {
      id: '3',
      invoiceNumber: 'INV-2025-011',
      date: '2025-11-01',
      description: 'Premium Tier - November 2025',
      amount: 299.00,
      status: 'paid',
    },
    {
      id: '4',
      invoiceNumber: 'INV-2025-010',
      date: '2025-10-01',
      description: 'Premium Tier - October 2025',
      amount: 299.00,
      status: 'paid',
    },
    {
      id: '5',
      invoiceNumber: 'INV-2025-009',
      date: '2025-09-01',
      description: 'Standard Tier - September 2025',
      amount: 199.00,
      status: 'paid',
    },
  ];

  const handleDownload = async (invoiceId: string) => {
    setDownloadingId(invoiceId);
    
    // Simulate PDF generation/download
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    setDownloadingId(null);
    setDownloadedIds(new Set([...downloadedIds, invoiceId]));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return isDark
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return isDark
          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
          : 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'failed':
        return isDark
          ? 'bg-red-500/10 text-red-400 border-red-500/20'
          : 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10 backdrop-blur-sm'
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Invoice History
            </h3>
            <p className={`text-xs mt-1 ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Download past invoices and track your payment history
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            isDark
              ? 'bg-white/5 text-gray-400 border border-white/10'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
            <FileText size={14} />
            <span className="text-xs font-medium tabular-nums">{invoices.length} Invoices</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${
              isDark
                ? 'bg-white/[0.02] border-white/5'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Invoice
              </th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Date
              </th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Description
              </th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Amount
              </th>
              <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Status
              </th>
              <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDark ? 'divide-white/5' : 'divide-gray-200'
          }`}>
            {invoices.map((invoice, index) => (
              <motion.tr
                key={invoice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`transition-colors ${
                  isDark
                    ? 'hover:bg-white/[0.02]'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark
                        ? 'bg-cyan-500/10 border border-cyan-500/20'
                        : 'bg-cyan-50 border border-cyan-200'
                    }`}>
                      <FileText 
                        size={18} 
                        className={isDark ? 'text-cyan-400' : 'text-cyan-600'} 
                      />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {invoice.invoiceNumber}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar 
                      size={14} 
                      className={isDark ? 'text-gray-600' : 'text-gray-400'} 
                    />
                    <span className={`text-sm tabular-nums ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {formatDate(invoice.date)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {invoice.description}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-bold tabular-nums ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    ${invoice.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    getStatusColor(invoice.status)
                  }`}>
                    {invoice.status === 'paid' && <Check size={12} />}
                    {invoice.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(invoice.id)}
                    disabled={downloadingId === invoice.id}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      downloadedIds.has(invoice.id)
                        ? isDark
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isDark
                        ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    {downloadingId === invoice.id ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                        />
                        <span>Loading...</span>
                      </>
                    ) : downloadedIds.has(invoice.id) ? (
                      <>
                        <Check size={16} />
                        <span>Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        <span>Download PDF</span>
                      </>
                    )}
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t flex items-center justify-between ${
        isDark
          ? 'bg-white/[0.02] border-white/5'
          : 'bg-gray-50 border-gray-200'
      }`}>
        <p className={`text-xs ${
          isDark ? 'text-gray-500' : 'text-gray-600'
        }`}>
          Showing all {invoices.length} invoices
        </p>
        <button className={`text-xs font-semibold flex items-center gap-1 ${
          isDark
            ? 'text-cyan-400 hover:text-cyan-300'
            : 'text-blue-600 hover:text-blue-700'
        }`}>
          View Transaction Details
          <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
};
