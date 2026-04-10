"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Crown,
  User,
  SquaresFour,
  Receipt,
  Package,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { PageBanner } from "@/components/layout/PageLayout";
import { BillingOverview } from "./views/BillingOverview";
import { InvoicesView } from "./views/InvoicesView";
import { AdminOverviewView } from "./views/AdminOverviewView";
import { AdminControlsView } from "./views/AdminControlsView";
import { AdminProductCatalog } from "./AdminProductCatalog";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useBilling } from "../hooks/useBilling";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import { logger } from "@/lib/logger";
import { billingApi } from "../api/billing.api";

type BillingTab = "overview" | "invoices";
type AdminTab = "overview" | "catalog" | "controls";

export const BillingPortal: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refresh } = useBilling();
  const { session } = useAuth();
  const { isAdmin } = useRole();

  const [viewMode, setViewMode] = useState<"customer" | "admin">("customer");
  const [activeTab, setActiveTab] = useState<BillingTab>("overview");
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>("overview");

  const effectiveView = isAdmin ? viewMode : "customer";

  // Guard: run the Stripe redirect handler exactly once per navigation.
  // session?.accessToken stays in deps so we can wait for it to be available
  // when verifying a sessionId, but hasHandledRedirectRef prevents re-fires.
  const hasHandledRedirectRef = useRef(false);

  // Handle Stripe Redirection Success/Cancel & Cleanup Legacy URLs
  useEffect(() => {
    // 1. Defend against legacy/ghost URLs that cause 404
    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/dashboard/billing"
    ) {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set("tab", "billing");
      router.replace(`/?${currentParams.toString()}`, { scroll: false });
      return;
    }

    const success = searchParams.get("success");
    const cancel = searchParams.get("cancel");
    const sessionId = searchParams.get("session_id");

    if (success === "true") {
      // Defer until the token is available so verifyPurchase can be called.
      // On the first render session is null; on the next it's populated.
      if (sessionId && !session?.accessToken) return;
      // Already handled on a previous render cycle — skip.
      if (hasHandledRedirectRef.current) return;
      hasHandledRedirectRef.current = true;

      const handleSuccess = async () => {
        if (sessionId && session?.accessToken) {
          const toastId = toast.loading("Verifying purchase...");
          try {
            const result = await billingApi.verifyPurchase(
              session.accessToken,
              sessionId,
            );
            if (result.status === "completed" || result.has_access) {
              toast.success("Subscription successfully activated!", {
                description: "Your new plan is now active.",
                id: toastId,
                duration: 5000,
              });
            } else {
              toast.info("Purchase pending processing", {
                description: "Your plan will be active shortly.",
                id: toastId,
              });
            }
          } catch (e: unknown) {
            logger.error("Verification failed", e);
            toast.success("Purchase recorded", {
              description: "Updating your subscription details...",
              id: toastId,
            });
          }
        } else {
          toast.success("Subscription successfully activated!", {
            id: "stripe-success",
            description: "Your new plan is now active.",
            duration: 5000,
          });
        }
        await refresh();
        router.replace(`/?tab=billing`, { scroll: false });
      };

      handleSuccess();
    } else if (cancel === "true") {
      if (hasHandledRedirectRef.current) return;
      hasHandledRedirectRef.current = true;
      toast.error("Payment cancelled", {
        description: "Your subscription remains unchanged.",
      });
      router.replace(`/?tab=billing`, { scroll: false });
    }
  }, [searchParams, router, refresh, session?.accessToken]);

  const billingTabs =
    effectiveView === "customer" ? (
      <div
        className={`flex items-center p-0.5 rounded-lg ${
          isDark
            ? "bg-white/5 border border-white/5"
            : "bg-gray-100 border border-gray-200"
        }`}
      >
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
            activeTab === "overview"
              ? isDark
                ? "bg-cyan-500/15 text-cyan-400"
                : "bg-white text-blue-600 shadow-sm"
              : isDark
                ? "text-gray-500 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <SquaresFour size={12} />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
            activeTab === "invoices"
              ? isDark
                ? "bg-amber-500/15 text-amber-400"
                : "bg-white text-amber-600 shadow-sm"
              : isDark
                ? "text-gray-500 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Receipt size={12} />
          Invoices
        </button>
      </div>
    ) : (
      <div
        className={`flex items-center p-0.5 rounded-lg ${
          isDark
            ? "bg-white/5 border border-white/5"
            : "bg-gray-100 border border-gray-200"
        }`}
      >
        <button
          onClick={() => setActiveAdminTab("overview")}
          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
            activeAdminTab === "overview"
              ? isDark
                ? "bg-purple-500/15 text-purple-400"
                : "bg-white text-purple-600 shadow-sm"
              : isDark
                ? "text-gray-500 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <SquaresFour size={12} />
          Financial
        </button>
        <button
          onClick={() => setActiveAdminTab("catalog")}
          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
            activeAdminTab === "catalog"
              ? isDark
                ? "bg-cyan-500/15 text-cyan-400"
                : "bg-white text-cyan-600 shadow-sm"
              : isDark
                ? "text-gray-500 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Package size={12} />
          Catalog
        </button>
        <button
          onClick={() => setActiveAdminTab("controls")}
          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
            activeAdminTab === "controls"
              ? isDark
                ? "bg-amber-500/15 text-amber-400"
                : "bg-white text-amber-600 shadow-sm"
              : isDark
                ? "text-gray-500 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Shield size={12} />
          Controls
        </button>
      </div>
    );

  const headerActions = (
    <div className="flex items-center gap-2">
      {/* Tabs */}
      {billingTabs}

      <div
        className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
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
          className={`text-[9px] font-black uppercase tracking-[0.22em] ${
            isDark ? "text-emerald-400" : "text-emerald-700"
          }`}
        >
          PCI-DSS
        </span>
      </div>

        {isAdmin && <div
          className={`inline-flex p-0.5 rounded-lg border shadow-sm ${
            isDark
              ? "bg-black/40 border-white/10 backdrop-blur-md"
              : "bg-white border-gray-200"
          }`}
        >
          <button
            onClick={() => setViewMode("customer")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[9px] font-black uppercase tracking-[0.18em] transition-all duration-300 ${
              effectiveView === "customer"
                ? isDark
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                : isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <User size={13} />
            Customer
          </button>
          <button
            onClick={() => setViewMode("admin")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[9px] font-black uppercase tracking-[0.18em] transition-all duration-300 ${
              effectiveView === "admin"
                ? isDark
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                : isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Crown size={13} />
            Admin
          </button>
        </div>}
      </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      <PageBanner
        title={effectiveView === "admin" ? "Financial Command Center" : "Billing Portal"}
        subtitle={effectiveView === "admin" ? "Master Financial Repository & Controls" : "Subscription & Payment Management"}
        actions={headerActions}
      />

      <div className="flex-1 overflow-hidden flex flex-col min-h-0 relative">
        <AnimatePresence mode="wait">
          {effectiveView === "admin" ? (
            <motion.div
              key={`admin-${activeAdminTab}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full min-h-full lg:h-full flex flex-col"
            >
              {activeAdminTab === "overview" && <AdminOverviewView />}
              {activeAdminTab === "catalog" && (
                <div className="p-4 sm:p-6 w-full h-full min-h-0 overflow-y-auto">
                  <AdminProductCatalog />
                </div>
              )}
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
