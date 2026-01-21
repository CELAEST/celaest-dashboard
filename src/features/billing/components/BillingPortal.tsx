'use client'

import React, { useState } from 'react';
import { Shield, Lock, Crown, User } from 'lucide-react';
import { useTheme } from '@/features/shared/contexts/ThemeContext';
import { SubscriptionManager } from './SubscriptionManager';
import { PaymentMethodsCard } from './PaymentMethodsCard';
import { InvoiceHistory } from './InvoiceHistory';
import { AdminFinancialDashboard } from './AdminFinancialDashboard';

export const BillingPortal: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer');

  return (
    <div>
      {/* Header with Trust Badges */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className={`text-4xl font-bold mb-3 tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {viewMode === 'admin' ? 'Financial Command Center' : 'Billing Portal'}
            </h1>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {viewMode === 'admin' 
                ? 'Global financial metrics, payment gateway control, and revenue analytics'
                : 'Manage your subscription, payment methods, and transaction history'
              }
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${
              isDark
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <Shield size={18} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
              <span className={`text-xs font-semibold uppercase tracking-wide ${
                isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                PCI-DSS
              </span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${
              isDark
                ? 'bg-blue-500/10 border-blue-500/20'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <Lock size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              <span className={`text-xs font-semibold uppercase tracking-wide ${
                isDark ? 'text-blue-400' : 'text-blue-700'
              }`}>
                256-bit Encryption
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className={`inline-flex p-1 rounded-xl border ${
          isDark ? 'bg-black/40 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={() => setViewMode('customer')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'customer'
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-lg'
                  : 'bg-blue-600 text-white shadow-lg'
                : isDark
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User size={16} />
            Customer View
          </button>
          <button
            onClick={() => setViewMode('admin')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'admin'
                ? isDark
                  ? 'bg-purple-500/20 text-purple-400 shadow-lg'
                  : 'bg-purple-600 text-white shadow-lg'
                : isDark
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Crown size={16} />
            Admin View
          </button>
        </div>
      </div>

      {/* Conditional Rendering based on View Mode */}
      {viewMode === 'admin' ? (
        <AdminFinancialDashboard />
      ) : (
        <>
          {/* Customer Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Subscription Management */}
            <div className="lg:col-span-1">
              <SubscriptionManager />
            </div>

            {/* Payment Methods */}
            <div className="lg:col-span-1">
              <PaymentMethodsCard />
            </div>
          </div>

          {/* Invoice History - Full Width */}
          <div>
            <InvoiceHistory />
          </div>
        </>
      )}
    </div>
  );
};
