"use client";

import React, { useState } from "react";
import { Shield, Crown, User, LayoutGrid, Receipt } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { BillingOverview } from "./views/BillingOverview";
import { InvoicesView } from "./views/InvoicesView";
import { AdminOverviewView } from "./views/AdminOverviewView";
import { AdminControlsView } from "./views/AdminControlsView";
import { AnimatePresence, motion } from "motion/react";

type BillingTab = "overview" | "invoices";
type AdminTab = "overview" | "controls";

export const BillingPortal: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [viewMode, setViewMode] = useState<"customer" | "admin">("customer");
  const [activeTab, setActiveTab] = useState<BillingTab>("overview");
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>("overview");

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      {/* Sticky Header Area (Licensing Style) */}
      <div
        className={`sticky top-0 z-30 backdrop-blur-xl border-b transition-all duration-300 shrink-0 ${
          isDark ? "bg-black/50 border-white/5" : "bg-white/70 border-gray-100"
        }`}
      >
        <div className="w-full py-4 px-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1
                className={`text-2xl sm:text-3xl font-black tracking-tighter uppercase italic ${
                  isDark
                    ? "bg-linear-to-r from-white via-white to-white/40 bg-clip-text text-transparent"
                    : "text-gray-900"
                }`}
              >
                {viewMode === "admin"
                  ? "Financial Command Center"
                  : "Billing Portal"}
              </h1>
              <p
                className={`text-[10px] sm:text-xs font-mono tracking-widest uppercase mt-1 ${
                  isDark ? "text-cyan-400/60" : "text-blue-600/60"
                }`}
              >
                {viewMode === "admin"
                  ? "Master Financial Repository & Controls"
                  : "Subscription & Payment Management"}
              </p>
            </motion.div>

            {/* Trust Badges (Compact) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:flex items-center gap-3"
            >
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                  isDark
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-emerald-50 border-emerald-200"
                }`}
              >
                <Shield
                  size={14}
                  className={isDark ? "text-emerald-400" : "text-emerald-600"}
                />
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    isDark ? "text-emerald-400" : "text-emerald-700"
                  }`}
                >
                  PCI-DSS
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Subtle bottom glow separator */}
        <div
          className={`h-px w-full bg-linear-to-r from-transparent via-cyan-500/20 to-transparent ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Navigation Tabs (Fixed below header) */}
      <div
        className={`shrink-0 px-6 pt-4 pb-2 ${isDark ? "bg-black/20" : "bg-gray-50/50"}`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Domain Tabs (Customer Mode Only) - Now on Left */}
          {viewMode === "customer" ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pt-2.5 pb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b-[3px] transition-all duration-300 ${
                  activeTab === "overview"
                    ? isDark
                      ? "text-cyan-400 border-cyan-400"
                      : "text-blue-600 border-blue-600"
                    : "text-gray-400 border-transparent hover:text-gray-300 mb-[3px]"
                }`}
              >
                <LayoutGrid size={14} className="mb-0.5" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("invoices")}
                className={`pt-2.5 pb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b-[3px] transition-all duration-300 ${
                  activeTab === "invoices"
                    ? isDark
                      ? "text-cyan-400 border-cyan-400"
                      : "text-blue-600 border-blue-600"
                    : "text-gray-400 border-transparent hover:text-gray-300 mb-[3px]"
                }`}
              >
                <Receipt size={14} className="mb-0.5" />
                Invoices
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveAdminTab("overview")}
                className={`pt-2.5 pb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b-[3px] transition-all duration-300 ${
                  activeAdminTab === "overview"
                    ? isDark
                      ? "text-purple-400 border-purple-400"
                      : "text-purple-600 border-purple-600"
                    : "text-gray-400 border-transparent hover:text-gray-300 mb-[3px]"
                }`}
              >
                <LayoutGrid size={14} className="mb-0.5" />
                Financial
              </button>
              <button
                onClick={() => setActiveAdminTab("controls")}
                className={`pt-2.5 pb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b-[3px] transition-all duration-300 ${
                  activeAdminTab === "controls"
                    ? isDark
                      ? "text-purple-400 border-purple-400"
                      : "text-purple-600 border-purple-600"
                    : "text-gray-400 border-transparent hover:text-gray-300 mb-[3px]"
                }`}
              >
                <Shield size={14} className="mb-0.5" />
                Controls
              </button>
            </div>
          )}

          {/* View Mode Toggle - Now on Right */}
          <div className="mb-4 sm:mb-0">
            <div
              className={`inline-flex p-1.5 rounded-2xl border shadow-sm -translate-y-[2px] ${
                isDark
                  ? "bg-black/40 border-white/10 backdrop-blur-md"
                  : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => setViewMode("customer")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                  viewMode === "customer"
                    ? isDark
                      ? "bg-cyan-500 text-white shadow-xl shadow-cyan-500/30"
                      : "bg-blue-600 text-white shadow-xl shadow-blue-500/30"
                    : isDark
                      ? "text-gray-400 hover:text-white hover:bg-white/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <User size={14} />
                Customer
              </button>
              <button
                onClick={() => setViewMode("admin")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                  viewMode === "admin"
                    ? isDark
                      ? "bg-purple-500 text-white shadow-xl shadow-purple-500/30"
                      : "bg-purple-600 text-white shadow-xl shadow-purple-500/30"
                    : isDark
                      ? "text-gray-400 hover:text-white hover:bg-white/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Crown size={14} />
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Strict Zero Scroll (Fits Viewport) */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0 relative">
        <AnimatePresence mode="wait">
          {viewMode === "admin" ? (
            <motion.div
              key={`admin-${activeAdminTab}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full min-h-full lg:h-full flex flex-col"
            >
              {activeAdminTab === "overview" && <AdminOverviewView />}
              {activeAdminTab === "controls" && <AdminControlsView />}
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full min-h-full lg:h-full flex flex-col"
            >
              {activeTab === "overview" && <BillingOverview />}
              {activeTab === "invoices" && <InvoicesView />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
