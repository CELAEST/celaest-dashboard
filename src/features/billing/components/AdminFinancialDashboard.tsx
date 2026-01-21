import React from "react";
import { motion } from "motion/react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  AlertCircle,
  Sparkles,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const AdminFinancialDashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Financial Metrics
  const totalRevenue = 584200;
  const mrr = 47850;
  const mrrGrowth = 12.5;
  const netProfit = 409940; // After gateway fees
  const gatewayFees = 17426; // 3% + $0.30 per transaction
  const churnRate = 2.3;
  const activeSubscriptions = 160;
  const newSubscriptions = 18;
  const pendingRefunds = 3;
  const arpu = 299; // Average Revenue Per User
  const failedPayments = 7;

  return (
    <div className="space-y-6">
      {/* God Mode Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border overflow-hidden ${
          isDark
            ? "bg-linear-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 border-purple-500/20"
            : "bg-linear-to-r from-purple-50 via-cyan-50 to-purple-50 border-purple-200"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles
                size={24}
                className={isDark ? "text-purple-400" : "text-purple-600"}
              />
              <div>
                <h2
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Global Billing Control Center
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Real-time financial metrics and payment gateway administration
                </p>
              </div>
            </div>
            <div
              className={`px-4 py-2 rounded-xl font-bold text-sm border ${
                isDark
                  ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  : "bg-purple-100 text-purple-700 border-purple-300"
              }`}
            >
              👑 SUPER ADMIN
            </div>
          </div>
        </div>
      </motion.div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Revenue - Featured Large Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:col-span-2 rounded-2xl border overflow-hidden ${
            isDark
              ? "bg-linear-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20"
              : "bg-linear-to-br from-cyan-50 to-cyan-100 border-cyan-200"
          }`}
        >
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div
                className={`p-4 rounded-2xl ${
                  isDark ? "bg-cyan-500/20" : "bg-cyan-500/30"
                }`}
              >
                <DollarSign
                  size={32}
                  className={isDark ? "text-cyan-400" : "text-cyan-600"}
                />
              </div>
              <div
                className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  isDark
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                }`}
              >
                ALL TIME
              </div>
            </div>
            <div className="mb-3">
              <p
                className={`text-sm font-semibold mb-3 uppercase tracking-wide ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Revenue
              </p>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`text-6xl font-black tracking-tight mb-2 ${
                  isDark
                    ? "text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-cyan-200"
                    : "text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-cyan-400"
                }`}
                style={{
                  textShadow: isDark
                    ? "0 0 40px rgba(34, 211, 238, 0.4)"
                    : "none",
                }}
              >
                ${totalRevenue.toLocaleString()}
              </motion.div>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                Lifetime platform earnings across all customers
              </p>
            </div>
            {/* Net Profit Breakdown */}
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/10">
              <div>
                <p
                  className={`text-xs mb-1 ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Net Profit
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  ${netProfit.toLocaleString()}
                </p>
              </div>
              <div>
                <p
                  className={`text-xs mb-1 ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Gateway Fees
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  -${gatewayFees.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* MRR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl border p-6 ${
            isDark
              ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div
              className={`p-3 rounded-xl ${
                isDark ? "bg-emerald-500/10" : "bg-emerald-50"
              }`}
            >
              <TrendingUp
                size={24}
                className={isDark ? "text-emerald-400" : "text-emerald-600"}
              />
            </div>
          </div>
          <div>
            <p
              className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                isDark ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Monthly Recurring Revenue
            </p>
            <div
              className={`text-4xl font-bold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              ${mrr.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-bold ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                +{mrrGrowth}%
              </span>
              <span
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                vs last month
              </span>
            </div>
          </div>
        </motion.div>

        {/* Active Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl border p-6 ${
            isDark
              ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div
              className={`p-3 rounded-xl ${
                isDark ? "bg-blue-500/10" : "bg-blue-50"
              }`}
            >
              <Users
                size={24}
                className={isDark ? "text-blue-400" : "text-blue-600"}
              />
            </div>
          </div>
          <div>
            <p
              className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                isDark ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Active Subscriptions
            </p>
            <div
              className={`text-4xl font-bold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {activeSubscriptions}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-bold ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                +{newSubscriptions}
              </span>
              <span
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                this month
              </span>
            </div>
          </div>
        </motion.div>

        {/* Churn Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl border p-6 ${
            isDark
              ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div
              className={`p-3 rounded-xl ${
                isDark ? "bg-yellow-500/10" : "bg-yellow-50"
              }`}
            >
              <TrendingDown
                size={24}
                className={isDark ? "text-yellow-400" : "text-yellow-600"}
              />
            </div>
          </div>
          <div>
            <p
              className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                isDark ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Churn Rate
            </p>
            <div
              className={`text-4xl font-bold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {churnRate}%
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-bold ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                -0.4%
              </span>
              <span
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                improvement
              </span>
            </div>
          </div>
        </motion.div>

        {/* ARPU */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl border p-6 ${
            isDark
              ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div
              className={`p-3 rounded-xl ${
                isDark ? "bg-purple-500/10" : "bg-purple-50"
              }`}
            >
              <Zap
                size={24}
                className={isDark ? "text-purple-400" : "text-purple-600"}
              />
            </div>
          </div>
          <div>
            <p
              className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                isDark ? "text-gray-500" : "text-gray-600"
              }`}
            >
              ARPU (Avg Revenue Per User)
            </p>
            <div
              className={`text-4xl font-bold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              ${arpu}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                Monthly average
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Gateway Control & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gateway Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl border p-6 ${
            isDark
              ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-4 flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <CreditCard
              size={20}
              className={isDark ? "text-cyan-400" : "text-cyan-600"}
            />
            Payment Gateway Control
          </h3>
          <div className="space-y-4">
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Stripe Gateway
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-bold ${
                    isDark
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  ACTIVE
                </span>
              </div>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                API Key: sk_live_**********************abc123
              </p>
            </div>
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  PayPal Gateway
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-bold ${
                    isDark
                      ? "bg-gray-500/20 text-gray-400"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  STANDBY
                </span>
              </div>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                Client ID: **********************xyz789
              </p>
            </div>
            <button
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              Configure Payment Gateways
            </button>
          </div>
        </motion.div>

        {/* Critical Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`rounded-2xl border p-6 ${
            isDark
              ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-4 flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <AlertCircle
              size={20}
              className={isDark ? "text-orange-400" : "text-orange-600"}
            />
            Critical Alerts
          </h3>
          <div className="space-y-3">
            {/* Pending Refunds */}
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-orange-500/5 border-orange-500/20"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p
                    className={`text-sm font-semibold mb-1 ${
                      isDark ? "text-orange-400" : "text-orange-700"
                    }`}
                  >
                    Pending Refunds
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-orange-400/70" : "text-orange-600/70"
                    }`}
                  >
                    {pendingRefunds} requests awaiting approval
                  </p>
                </div>
                <span
                  className={`text-2xl font-bold ${
                    isDark ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  {pendingRefunds}
                </span>
              </div>
              <button
                className={`text-xs font-semibold ${
                  isDark
                    ? "text-orange-400 hover:text-orange-300"
                    : "text-orange-700 hover:text-orange-800"
                }`}
              >
                Review Queue →
              </button>
            </div>

            {/* Failed Payments */}
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p
                    className={`text-sm font-semibold mb-1 ${
                      isDark ? "text-red-400" : "text-red-700"
                    }`}
                  >
                    Failed Recurring Payments
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-red-400/70" : "text-red-600/70"
                    }`}
                  >
                    Customers requiring intervention
                  </p>
                </div>
                <span
                  className={`text-2xl font-bold ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {failedPayments}
                </span>
              </div>
              <button
                className={`text-xs font-semibold ${
                  isDark
                    ? "text-red-400 hover:text-red-300"
                    : "text-red-700 hover:text-red-800"
                }`}
              >
                Contact Customers →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tax Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`lg:col-span-2 rounded-2xl border p-6 ${
            isDark
              ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-4 flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <Globe
              size={20}
              className={isDark ? "text-cyan-400" : "text-cyan-600"}
            />
            Tax Rate Configuration by Country
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { country: "United States", rate: 0, code: "US" },
              { country: "European Union", rate: 21, code: "EU" },
              { country: "United Kingdom", rate: 20, code: "UK" },
            ].map((tax, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {tax.country}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      isDark
                        ? "bg-white/10 text-gray-400"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tax.code}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-2xl font-bold ${
                      isDark ? "text-cyan-400" : "text-cyan-600"
                    }`}
                  >
                    {tax.rate}%
                  </span>
                  <span
                    className={`text-xs ${
                      isDark ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    VAT/IVA
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            className={`w-full mt-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              isDark
                ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
            }`}
          >
            Manage Tax Rates
          </button>
        </motion.div>
      </div>
    </div>
  );
};
