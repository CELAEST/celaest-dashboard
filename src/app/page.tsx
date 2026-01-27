"use client";

import { useState, useEffect, Suspense, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useTheme } from "@/features/shared/hooks/useTheme";

import { motion, AnimatePresence } from "motion/react";
import { Activity, Zap, Server, Box } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useSearchParams, ReadonlyURLSearchParams } from "next/navigation";

// Shared components (loaded immediately - critical for layout)
import { Header } from "@/features/shared/components/Header";
import { Sidebar } from "@/features/shared/components/Sidebar";
import { AuthPage } from "@/features/auth/components/AuthPage";
import { LoginModal } from "@/features/auth/components/LoginModal";

// Static imports for dashboard main view
import { StatCard } from "@/features/shared/components/StatCard";
import { OrdersTable } from "@/features/billing/components/OrdersTable";
import { NotificationShowcase } from "@/features/shared/components/NotificationShowcase";

// Loading skeleton component
const ChartSkeleton = () => (
  <div className="h-[300px] w-full animate-pulse bg-gray-200/10 dark:bg-white/5 rounded-lg" />
);

const ViewSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 w-48 animate-pulse bg-gray-200/10 dark:bg-white/5 rounded" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-40 animate-pulse bg-gray-200/10 dark:bg-white/5 rounded-lg"
        />
      ))}
    </div>
  </div>
);

// Dynamic imports for heavy chart components (recharts bundle)
const SalesChart = dynamic(
  () =>
    import("@/features/analytics/components/Charts").then((m) => ({
      default: m.SalesChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

// Dynamic imports for feature views (lazy loaded on tab change)
const MarketplaceViewNew = dynamic(
  () =>
    import("@/features/marketplace/components/MarketplaceViewNew").then(
      (m) => ({ default: m.MarketplaceViewNew }),
    ),
  { loading: () => <ViewSkeleton /> },
);

const LicensingHub = dynamic(
  () =>
    import("@/features/licensing/components/LicensingHub").then((m) => ({
      default: m.LicensingHub,
    })),
  { loading: () => <ViewSkeleton /> },
);

const AnalyticsConsole = dynamic(
  () =>
    import("@/features/analytics/components/AnalyticsConsole").then((m) => ({
      default: m.AnalyticsConsole,
    })),
  { ssr: false, loading: () => <ViewSkeleton /> },
);

const BillingPortal = dynamic(
  () =>
    import("@/features/billing/components/BillingPortal").then((m) => ({
      default: m.BillingPortal,
    })),
  { loading: () => <ViewSkeleton /> },
);

const AssetManager = dynamic(
  () =>
    import("@/features/assets/components/AssetManager").then((m) => ({
      default: m.AssetManager,
    })),
  { loading: () => <ViewSkeleton /> },
);

const ReleaseManager = dynamic(
  () =>
    import("@/features/releases/components/ReleaseManager").then((m) => ({
      default: m.ReleaseManager,
    })),
  { loading: () => <ViewSkeleton /> },
);

const UserManagement = dynamic(
  () =>
    import("@/features/users/components/UserManagement").then((m) => ({
      default: m.UserManagement,
    })),
  { loading: () => <ViewSkeleton /> },
);

const ROIMetrics = dynamic(
  () =>
    import("@/features/roi/components/ROIMetrics").then((m) => ({
      default: m.ROIMetrics,
    })),
  { ssr: false, loading: () => <ViewSkeleton /> },
);

const ErrorMonitoring = dynamic(
  () => import("@/features/errors/components/ErrorMonitoring"),
  { ssr: false, loading: () => <ViewSkeleton /> },
);

const SettingsView = dynamic(
  () =>
    import("@/features/settings").then((m) => ({
      default: m.SettingsView,
    })),
  { loading: () => <ViewSkeleton /> },
);

// Main page component wrapped in Suspense for correct useSearchParams handling
// stable subscribe function to avoid re-subscription on every render
const emptySubscribe = () => () => {};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050505]">
          <div className="w-12 h-12 border-4 rounded-full border-cyan-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("marketplace");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { theme } = useTheme();
  const { user, isLoading } = useAuth();
  const isDark = theme === "dark";

  const isGuest = !isLoading && !user;
  const authMode = searchParams.get("mode");
  const showAuthPage =
    !user && (authMode === "signin" || authMode === "signup");

  // Track previous params to detect external URL changes (PopState)
  // We use this pattern to sync state from URL only when URL explicitly changes
  const [prevSearchParams, setPrevSearchParams] =
    useState<ReadonlyURLSearchParams | null>(null);

  // Sync state from URL (Render Phase)
  if (searchParams !== prevSearchParams) {
    setPrevSearchParams(searchParams);
    if (!isLoading && !isGuest) {
      const tab = searchParams.get("tab");
      if (tab && tab !== activeTab) {
        setActiveTab(tab);
      }
    }
  }

  // Enforce Guest restrictions immediately during render to avoid cascading renders
  if (isGuest && !showAuthPage && activeTab !== "marketplace") {
    setActiveTab("marketplace");
  }

  // Sync state from URL on mount and handle Guest restrictions
  useEffect(() => {
    if (isLoading) return;

    if (isGuest) {
      // Force marketplace for guests if not in auth page mode
      if (!showAuthPage) {
        // Update URL if needed
        const currentTab = searchParams.get("tab");
        if (currentTab !== "marketplace") {
          const url = new URL(window.location.href);
          url.searchParams.set("tab", "marketplace");
          url.searchParams.delete("mode");
          window.history.pushState({}, "", url);
        }
      }
    }
  }, [isLoading, isGuest, showAuthPage, searchParams]);

  const handleTabChange = (tab: string) => {
    // Determine if guest is trying to access restricted area
    if (isGuest && tab !== "marketplace") {
      setShowLoginModal(true);
      return;
    }

    setActiveTab(tab);
    // Update URL without reloading or triggering heavy router actions
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url);
  };

  // Fix hydration mismatch by using useSyncExternalStore
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Show loading state (or unmounted state)
  // We force the dark theme loader initially to match the Suspense fallback and avoid hydration mismatch
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 rounded-full border-cyan-500 border-t-transparent"
        />
      </div>
    );
  }

  // Show auth page if strict auth mode is requested and no user
  if (showAuthPage) {
    return <AuthPage />;
  }

  // Otherwise serve Dashboard Layout (Guest or Authenticated)
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
            src="https://images.unsplash.com/photo-1647356161576-4e80c6619a0e?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBibHVlJTIwbmV1cmFsJTIwbmV0d29yayUyMGNvbnN0ZWxsYXRpb24lMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2ODU3Njg3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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

      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isGuest={isGuest}
        onShowLogin={() => setShowLoginModal(true)}
      />

      <div className="pl-[80px] relative z-10 transition-all duration-300 h-screen flex flex-col">
        <Header onShowLogin={() => setShowLoginModal(true)} />

        <main className="flex-1 overflow-y-auto p-3 w-full">
          <AnimatePresence mode="wait">
            {!isGuest && activeTab === "dashboard" && (
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
                      className={`text-3xl font-bold mb-2 tracking-tight ${
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
                      <span className="text-cyan-400 font-mono">OPTIMAL</span> •
                      Local Time:{" "}
                      <span className="font-mono opacity-80">14:32:01</span>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
                        isDark
                          ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                          : "bg-white hover:bg-gray-50 text-blue-600 border-gray-200 shadow-sm"
                      }`}
                    >
                      <Zap size={16} />
                      Run Diagnostics
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="Total Revenue"
                    value="$128,492"
                    trend="12.5%"
                    trendUp={true}
                    icon={<Activity size={24} />}
                    delay={0.1}
                  />
                  <StatCard
                    title="Global Orders"
                    value="1,482"
                    trend="3.2%"
                    trendUp={true}
                    icon={<Box size={24} />}
                    delay={0.2}
                    hologramImage="https://images.unsplash.com/photo-1751475252133-3db30b9814b5?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwM2QlMjBob2xvZ3JhbSUyMGdsb2JlJTIwY3liZXJ8ZW58MXx8fHwxNzY4NTc2ODc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  />
                  <StatCard
                    title="Active Scripts"
                    value="24/24"
                    trend="Running"
                    trendUp={true}
                    icon={<Server size={24} />}
                    delay={0.3}
                    hologramImage="https://images.unsplash.com/photo-1674352889408-52792b1a3b23?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMDNkJTIwbWljcm9jaGlwJTIwZ2xvd2luZyUyMHR1cnF1b2lzZXxlbnwxfHx8fDE3Njg1NzY4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  />
                  <StatCard
                    title="Net Profit"
                    value="$42,300"
                    trend="1.8%"
                    trendUp={false}
                    icon={<Zap size={24} />}
                    delay={0.4}
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

            {/* Other Restricted Tabs */}
            {!isGuest && (
              <>
                {activeTab === "licensing" && (
                  <motion.div
                    key="licensing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LicensingHub />
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

                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SettingsView />
                  </motion.div>
                )}
              </>
            )}

            {/* Empty State / Not Loaded (or Guest Restricted View Fallback) */}
            {activeTab !== "marketplace" &&
              (isGuest ||
                (activeTab !== "dashboard" &&
                  activeTab !== "licensing" &&
                  activeTab !== "analytics" &&
                  activeTab !== "billing" &&
                  activeTab !== "catalog" &&
                  activeTab !== "releases" &&
                  activeTab !== "users" &&
                  activeTab !== "roi" &&
                  activeTab !== "errors" &&
                  activeTab !== "settings")) && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-[50vh] text-gray-500"
                >
                  <Server size={48} className="mb-4 opacity-50" />
                  <h2 className="text-xl font-bold mb-2">
                    {isGuest ? "Access Restricted" : "Module Not Loaded"}
                  </h2>
                  <p className="font-mono text-sm">
                    {isGuest
                      ? "Please sign in to access this module."
                      : `Target module [${activeTab}] is currently offline or compiling.`}
                  </p>
                  {isGuest && (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Sign In
                    </button>
                  )}
                </motion.div>
              )}
          </AnimatePresence>
        </main>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Sign in to access the full Celaest Dashboard experience."
      />
    </div>
  );
}
