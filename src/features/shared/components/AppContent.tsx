"use client";

import React, { useState } from "react";
import { Sidebar } from "@/features/shared/components/Sidebar";
import { Header } from "@/features/shared/components/Header";
import { StatCard } from "@/features/analytics/components/StatCard";
import { SalesChart } from "@/features/analytics/components/Charts";
import { OrdersTable } from "@/features/billing/components/OrdersTable";
import { MarketplaceViewNew } from "@/features/marketplace/components/MarketplaceViewNew";
import { LicensingHubNew } from "@/features/licensing/components/LicensingHubNew";
import { AnalyticsConsole } from "@/features/analytics/components/AnalyticsConsole";
import { BillingPortal } from "@/features/billing/components/BillingPortal";
import { AssetManager } from "@/features/assets/components/AssetManager";
import { ReleaseManager } from "@/features/releases/components/ReleaseManager";
import { UserManagement } from "@/features/users/components/UserManagement";
import { ROIMetrics } from "@/features/analytics/components/ROIMetrics";
import ErrorMonitoring from "@/features/analytics/components/ErrorMonitoring";
import { InitialSetup } from "@/features/auth/components/InitialSetup";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Zap, Server, Box } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Toaster } from "sonner";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { NotificationShowcase } from "@/features/shared/components/NotificationShowcase";

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { theme } = useTheme();
  const { user, loading } = useAuth();

  const isDark = theme === "dark";

  // Check for setup mode in URL
  const urlParams = new URLSearchParams(window.location.search);
  const setupMode = urlParams.get("setup") === "true";

  // DEMO: Auto-login as Super Admin for demonstration
  const demoUser = {
    id: "demo_superadmin_001",
    email: "admin@celaest.com",
    name: "CELAEST Admin",
    role: "super_admin" as const,
    scopes: {
      "templates:write": true,
      "templates:read": true,
      "billing:read": true,
      "billing:write": true,
      "users:manage": true,
      "analytics:read": true,
      "releases:write": true,
      "releases:read": true,
      "marketplace:purchase": true,
    },
  };

  const currentUser = user || demoUser; // Use demo user if not authenticated

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-[#050505]" : "bg-[#F5F7FA]"
        }`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-12 h-12 border-4 rounded-full ${
            isDark
              ? "border-cyan-500 border-t-transparent"
              : "border-blue-600 border-t-transparent"
          }`}
        />
      </div>
    );
  }

  // Show initial setup if requested
  if (setupMode && !currentUser) {
    return <InitialSetup />;
  }

  // Always show app with demo user for now
  // if (!currentUser) {
  //   return <AuthPage />;
  // }

  return (
    <div
      className={`min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden transition-colors duration-500 ${
        isDark ? "bg-[#050505] text-white" : "bg-[#F5F7FA] text-gray-900"
      }`}
    >
      {/* Background with Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {isDark && (
          <>
            <div className="absolute inset-0 bg-black/80 z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-cyan-900/20 via-[#050505] to-[#050505] z-10" />
          </>
        )}
        {!isDark && (
          <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-white z-10" />
        )}

        <motion.div
          className="absolute inset-0 z-0 will-change-transform"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 1, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1647356161576-4e80c6619a0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBibHVlJTIwbmV1cmFsJTIwbmV0d29yayUyMGNvbnN0ZWxsYXRpb24lMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2ODU3Njg3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            className={`w-full h-full object-cover mix-blend-screen transition-opacity duration-500 ${
              isDark ? "opacity-40" : "opacity-10 mix-blend-normal"
            }`}
            alt="background"
          />
        </motion.div>
        {/* Subtle grid overlay */}
        <div
          className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-20 mix-blend-overlay ${
            isDark ? "opacity-20" : "opacity-5"
          }`}
        ></div>
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="pl-[80px] relative z-10 transition-all duration-300">
        <Header />

        <main className="p-3 mx-auto min-h-[calc(100vh-80px)]">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Dashboard Content */}
                <div className="mb-10 flex justify-between items-end">
                  <div>
                    <h1
                      className={`text-4xl font-bold mb-2 tracking-tight ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Command Center
                    </h1>
                    <p
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } text-sm`}
                    >
                      System Status:{" "}
                      <span className="text-emerald-500 font-semibold">
                        OPTIMAL
                      </span>{" "}
                      • Local Time:{" "}
                      <span className="font-mono opacity-80">14:32:01</span>
                    </p>
                  </div>

                  <button
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                      isDark
                        ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70"
                        : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                    }`}
                  >
                    <Zap size={18} />
                    Run Diagnostics
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="TOTAL REVENUE"
                    value="$128,492"
                    trend="12.5%"
                    trendUp={true}
                    icon={<Activity size={24} />}
                    delay={0.1}
                    gradient="from-cyan-400 to-blue-500"
                  />
                  <StatCard
                    title="GLOBAL ORDERS"
                    value="1,482"
                    trend="3.2%"
                    trendUp={true}
                    icon={<Box size={24} />}
                    delay={0.2}
                    gradient="from-blue-500 to-indigo-500"
                  />
                  <StatCard
                    title="ACTIVE SCRIPTS"
                    value="24/24"
                    trend="Running"
                    trendUp={true}
                    icon={<Server size={24} />}
                    delay={0.3}
                    gradient="from-emerald-400 to-teal-500"
                  />
                  <StatCard
                    title="NET PROFIT"
                    value="$42,300"
                    trend="1.8%"
                    trendUp={false}
                    icon={<Zap size={24} />}
                    delay={0.4}
                    gradient="from-orange-400 to-red-500"
                  />
                </div>

                <div className="mb-8">
                  <NotificationShowcase />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div
                    className={`lg:col-span-2 backdrop-blur-xl border rounded-2xl p-6 min-h-[400px] ${
                      isDark
                        ? "bg-[#0a0a0a]/60 border-white/5"
                        : "bg-white border-gray-200 shadow-sm"
                    }`}
                  >
                    <SalesChart />
                  </div>

                  <div
                    className={`backdrop-blur-xl border rounded-2xl p-6 ${
                      isDark
                        ? "bg-[#0a0a0a]/60 border-white/5"
                        : "bg-white border-gray-200 shadow-sm"
                    }`}
                  >
                    <h3
                      className={`${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium mb-4 flex items-center gap-2`}
                    >
                      <Server size={18} className="text-cyan-400" />
                      System Health
                    </h3>
                    <div className="space-y-6">
                      {[
                        "Main Database",
                        "API Gateway",
                        "CDN Node US-East",
                        "Payment Processor",
                      ].map((item, i) => (
                        <div key={i} className="group">
                          <div className="flex justify-between text-sm mb-1">
                            <span
                              className={`${
                                isDark
                                  ? "text-gray-400 group-hover:text-cyan-400"
                                  : "text-gray-500 group-hover:text-blue-600"
                              } transition-colors`}
                            >
                              {item}
                            </span>
                            <span className="text-green-400 font-mono text-xs">
                              99.{8 + i}%
                            </span>
                          </div>
                          <div
                            className={`h-1.5 w-full rounded-full overflow-hidden ${
                              isDark ? "bg-white/5" : "bg-gray-100"
                            }`}
                          >
                            <div
                              className="h-full bg-linear-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
                              style={{ width: `${95 + i}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`lg:col-span-3 backdrop-blur-xl border rounded-2xl p-6 ${
                      isDark
                        ? "bg-[#0a0a0a]/60 border-white/5"
                        : "bg-white border-gray-200 shadow-sm"
                    }`}
                  >
                    <OrdersTable />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "marketplace" && (
              <motion.div
                key="marketplace"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MarketplaceViewNew />
              </motion.div>
            )}

            {activeTab === "licensing" && (
              <motion.div
                key="licensing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <LicensingHubNew />
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <AnalyticsConsole />
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <BillingPortal />
              </motion.div>
            )}

            {activeTab === "catalog" && (
              <motion.div
                key="catalog"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <AssetManager />
              </motion.div>
            )}

            {activeTab === "releases" && (
              <motion.div
                key="releases"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <ReleaseManager />
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <UserManagement />
              </motion.div>
            )}

            {activeTab === "roi" && (
              <motion.div
                key="roi"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <ROIMetrics />
              </motion.div>
            )}

            {activeTab === "errors" && (
              <motion.div
                key="errors"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <ErrorMonitoring />
              </motion.div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab !== "dashboard" &&
              activeTab !== "marketplace" &&
              activeTab !== "licensing" &&
              activeTab !== "analytics" &&
              activeTab !== "billing" &&
              activeTab !== "catalog" &&
              activeTab !== "releases" &&
              activeTab !== "users" &&
              activeTab !== "roi" &&
              activeTab !== "errors" && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-[50vh] text-gray-500"
                >
                  <Server size={48} className="mb-4 opacity-50" />
                  <h2 className="text-xl font-bold mb-2">Module Not Loaded</h2>
                  <p className="font-mono text-sm">
                    Target module [{activeTab}] is currently offline or
                    compiling.
                  </p>
                </motion.div>
              )}
          </AnimatePresence>
        </main>
      </div>
      <Toaster theme={isDark ? "dark" : "light"} position="bottom-right" />
    </div>
  );
};
