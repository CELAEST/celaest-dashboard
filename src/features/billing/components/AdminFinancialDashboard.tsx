import React, { useState } from "react";
import { motion } from "motion/react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Globe,
  CheckCircle,
  Settings,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { ConfigurePaymentGatewaysModal } from "./modals/ConfigurePaymentGatewaysModal";
import { ManageTaxRatesModal } from "./modals/ManageTaxRatesModal";
import { CriticalAlertsModal } from "./modals/CriticalAlertsModal";
import { TransactionLogsModal } from "./modals/TransactionLogsModal";
import { AlertsCard } from "./dashboard/AlertsCard";
import { useFinancialDashboard } from "../hooks/useFinancialDashboard";

export const AdminFinancialDashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    metrics,
    totalRevenue,
    paidInvoices,
    refundedFunds,
    mrr,
    mrrGrowth,
    pendingRefunds,
    failedPayments,
    refresh,
  } = useFinancialDashboard();

  // Modal States
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [activeAlertType, setActiveAlertType] = useState<
    "failed" | "refund_requested"
  >("failed");

  const getMetricColor = (color: string) => {
    switch (color) {
      case "blue":
        return isDark
          ? "bg-blue-500/10 text-blue-400"
          : "bg-blue-500/10 text-blue-600";
      case "yellow":
        return isDark
          ? "bg-yellow-500/10 text-yellow-400"
          : "bg-yellow-500/10 text-yellow-600";
      case "purple":
        return isDark
          ? "bg-purple-500/10 text-purple-400"
          : "bg-purple-500/10 text-purple-600";
      default:
        return isDark
          ? "bg-gray-500/10 text-gray-400"
          : "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* God Mode Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl ${
          isDark
            ? "bg-linear-to-br from-purple-500/20 via-cyan-500/10 to-blue-500/20 backdrop-blur-xl border border-purple-500/30"
            : "bg-linear-to-br from-purple-500/10 via-cyan-500/5 to-blue-500/10 border border-purple-500/30 shadow-xl"
        }`}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-32 h-32 rounded-full ${
                isDark ? "bg-cyan-400" : "bg-purple-500"
              }`}
              style={{
                left: `${i * 25}%`,
                top: `${Math.sin(i) * 50 + 25}%`,
                filter: "blur(60px)",
              }}
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2
                className={`text-2xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Global Billing Control Center
              </h2>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Real-time financial metrics and payment gateway administration
              </p>
            </div>
            <div
              className={`px-6 py-2.5 rounded-xl font-bold text-sm ${
                isDark
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "bg-purple-500/20 text-purple-600 border border-purple-500/30"
              }`}
            >
              👑 SUPER ADMIN
            </div>
          </div>
        </div>
      </motion.div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Revenue - Large Featured Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:col-span-2 relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl ${
            isDark
              ? "bg-linear-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-cyan-500/30"
              : "bg-linear-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/30 shadow-xl"
          }`}
        >
          {/* Floating Background Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-48 h-48 rounded-full ${
                  isDark ? "bg-cyan-400/10" : "bg-blue-500/10"
                }`}
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 20}%`,
                  filter: "blur(40px)",
                }}
                animate={{
                  y: [0, -30, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          <div className="relative p-8">
            <div className="flex items-start justify-between mb-6">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  isDark
                    ? "bg-linear-to-br from-cyan-400 to-blue-500"
                    : "bg-linear-to-br from-blue-500 to-indigo-600"
                } shadow-lg`}
              >
                <DollarSign className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div
                className={`px-4 py-2 rounded-xl font-bold text-xs ${
                  isDark
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30"
                }`}
              >
                ALL TIME
              </div>
            </div>

            <div
              className={`text-xs font-semibold tracking-wider mb-3 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              TOTAL REVENUE
            </div>
            <div
              className={`text-6xl font-bold tracking-tight mb-4 ${
                isDark
                  ? "bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                  : "bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              }`}
            >
              ${totalRevenue.toLocaleString()}
            </div>

            {/* Sub-metrics */}
            <div
              className={`pt-6 mt-6 border-t flex items-center gap-8 ${
                isDark ? "border-white/10" : "border-gray-200"
              }`}
            >
              <div>
                <div
                  className={`text-xs mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Paid Invoices
                </div>
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  {paidInvoices}
                </div>
              </div>
              <div>
                <div
                  className={`text-xs mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Refunded Funds
                </div>
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  -${refundedFunds.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* MRR Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
            isDark
              ? "bg-black/40 backdrop-blur-xl border border-white/10"
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDark ? "bg-emerald-500/10" : "bg-emerald-500/10"
                }`}
              >
                <TrendingUp
                  className={`w-6 h-6 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </div>
            </div>

            <div
              className={`text-xs font-semibold tracking-wider mb-2 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              MONTHLY RECURRING REVENUE
            </div>
            <div
              className={`text-4xl font-bold tracking-tight mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              ${mrr.toLocaleString()}
            </div>

            {/* Mini Chart */}
            <div className="h-16 mb-4">
              <svg className="w-full h-full" viewBox="0 0 200 60">
                <defs>
                  <linearGradient
                    id="mrrGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={isDark ? "#10b981" : "#059669"}
                      stopOpacity="0.4"
                    />
                    <stop
                      offset="100%"
                      stopColor={isDark ? "#10b981" : "#059669"}
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0 50 Q20 45, 40 40 T80 35 T120 25 T160 20 T200 10 L200 60 L0 60 Z"
                  fill="url(#mrrGradient)"
                />
                <path
                  d="M0 50 Q20 45, 40 40 T80 35 T120 25 T160 20 T200 10"
                  fill="none"
                  stroke={isDark ? "#10b981" : "#059669"}
                  strokeWidth="2"
                />
              </svg>
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
                className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                vs last month
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer ${
              isDark
                ? "bg-black/40 backdrop-blur-xl border border-white/10"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${getMetricColor(
                    metric.color,
                  )}`}
                >
                  {metric.icon && <metric.icon className="w-6 h-6" />}
                </div>
              </div>

              <div
                className={`text-xs font-semibold tracking-wider mb-2 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {metric.label}
              </div>
              <div
                className={`text-3xl font-bold tracking-tight mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {metric.value}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {metric.change}
                </span>
                <span
                  className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {metric.changeLabel}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Gateway & Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Gateway Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
            isDark
              ? "bg-black/40 backdrop-blur-xl border border-white/10"
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard
                className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
              />
              <h3
                className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Payment Gateway Control
              </h3>
            </div>

            <div className="space-y-4">
              {/* Stripe */}
              <div
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  isDark
                    ? "bg-emerald-500/5 border border-emerald-500/20"
                    : "bg-emerald-500/5 border border-emerald-500/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Stripe Gateway
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      isDark
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-emerald-500/20 text-emerald-600"
                    }`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    ACTIVE
                  </span>
                </div>
                <p
                  className={`text-xs font-mono ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  API Key: sk_live_**********************abc123
                </p>
              </div>

              {/* PayPal */}
              <div
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  isDark
                    ? "bg-white/5 border border-white/10"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    PayPal Gateway
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      isDark
                        ? "bg-gray-500/20 text-gray-400"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    STANDBY
                  </span>
                </div>
                <p
                  className={`text-xs font-mono ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Client ID: **********************xyz789
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsGatewayModalOpen(true)}
              className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                isDark
                  ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
              }`}
            >
              Configure Payment Gateways
            </button>
          </div>
        </motion.div>

        {/* Critical Alerts */}
        <AlertsCard
          pendingRefunds={pendingRefunds}
          failedPayments={failedPayments}
          onAlertClick={(type) => {
            setActiveAlertType(type);
            setIsAlertsModalOpen(true);
          }}
          onViewLogsClick={() => setIsTransactionsModalOpen(true)}
        />
      </div>

      {/* Tax Rate Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/10"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe
              className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            />
            <h3
              className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Tax Rate Configuration by Country
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { country: "United States", rate: "0%", code: "US" },
              { country: "European Union", rate: "21%", code: "EU" },
              { country: "United Kingdom", rate: "20%", code: "UK" },
            ].map((tax, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  isDark
                    ? "bg-white/5 border border-white/10 hover:border-cyan-500/30"
                    : "bg-gray-50 border border-gray-200 hover:border-blue-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {tax.country}
                  </span>
                  <button
                    onClick={() => setIsTaxModalOpen(true)}
                    className={`p-2 rounded-xl transition-all ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                  </button>
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
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-cyan-400" : "text-blue-600"
                  }`}
                >
                  {tax.rate}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  VAT/IVA
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => setIsTaxModalOpen(true)}
            className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
              isDark
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20"
                : "bg-blue-500/10 text-blue-600 border border-blue-500/20 hover:bg-blue-500/20"
            }`}
          >
            Manage Tax Rates
          </button>
        </div>
      </motion.div>

      <ConfigurePaymentGatewaysModal
        isOpen={isGatewayModalOpen}
        onClose={() => setIsGatewayModalOpen(false)}
      />

      <ManageTaxRatesModal
        isOpen={isTaxModalOpen}
        onClose={() => setIsTaxModalOpen(false)}
      />
      <CriticalAlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        type={activeAlertType}
        onResolve={refresh}
      />

      <TransactionLogsModal
        isOpen={isTransactionsModalOpen}
        onClose={() => setIsTransactionsModalOpen(false)}
      />
    </div>
  );
};
