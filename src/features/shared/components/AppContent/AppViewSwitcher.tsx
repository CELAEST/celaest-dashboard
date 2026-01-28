import React, { memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Server } from "lucide-react";
import { MarketplaceViewNew } from "@/features/marketplace/components/MarketplaceViewNew";
import { LicensingHub } from "@/features/licensing/components/LicensingHub";
import { AnalyticsConsole } from "@/features/analytics/components/AnalyticsConsole";
import { BillingPortal } from "@/features/billing/components/BillingPortal";
import { AssetManager } from "@/features/assets/components/AssetManager";
import { ReleaseManager } from "@/features/releases/components/ReleaseManager";
import { UserManagement } from "@/features/users/components/UserManagement";
import { ROIMetrics } from "@/features/roi/components/ROIMetrics";
import ErrorMonitoring from "@/features/errors/components/ErrorMonitoring";
import { DashboardView } from "@/features/analytics/components/DashboardView";

interface AppViewSwitcherProps {
  activeTab: string;
}

export const AppViewSwitcher: React.FC<AppViewSwitcherProps> = memo(
  ({ activeTab }) => {
    return (
      <AnimatePresence mode="wait">
        {activeTab === "dashboard" && <DashboardView />}

        {activeTab === "marketplace" && (
          <motion.div
            key="marketplace"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full flex-1 flex flex-col min-h-0"
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
            className="h-full w-full flex-1 flex flex-col min-h-0"
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
            className="h-full w-full flex-1 flex flex-col min-h-0"
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
            className="h-full w-full flex-1 flex flex-col min-h-0"
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
            className="h-full w-full flex-1 flex flex-col min-h-0"
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
            className="h-full w-full flex-1 flex flex-col min-h-0"
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
            className="h-full w-full flex-1 flex flex-col min-h-0"
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
            className="h-full w-full flex-1 flex flex-col min-h-0"
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
            className="h-full w-full flex-1 flex flex-col min-h-0"
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
                Target module [{activeTab}] is currently offline or compiling.
              </p>
            </motion.div>
          )}
      </AnimatePresence>
    );
  },
);

AppViewSwitcher.displayName = "AppViewSwitcher";
