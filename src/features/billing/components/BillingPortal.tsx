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
import { useTranslations } from "next-intl";

type BillingTab = "overview" | "invoices";
type AdminTab = "overview" | "catalog" | "controls";

export const BillingPortal: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refresh } = useBilling();
  const { session } = useAuth();
  const { isSuperAdmin } = useRole();
  const t = useTranslations("billing");

  const [viewMode, setViewMode] = useState<"customer" | "admin">("customer");
  const [activeTab, setActiveTab] = useState<BillingTab>("overview");
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>("overview");

  const effectiveView = isSuperAdmin ? viewMode : "customer";

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
          const toastId = toast.loading(t("verifying_purchase"));
          try {
            const result = await billingApi.verifyPurchase(
              session.accessToken,
              sessionId,
            );
            if (result.status === "completed" || result.has_access) {
              toast.success(t("subscription_activated"), {
                description: t("plan_now_active"),
                id: toastId,
                duration: 5000,
              });
            } else {
              toast.info(t("purchase_pending"), {
                description: t("plan_active_shortly"),
                id: toastId,
              });
            }
          } catch (e: unknown) {
            logger.error("Verification failed", e);
            toast.success(t("purchase_recorded"), {
              description: t("updating_subscription"),
              id: toastId,
            });
          }
        } else {
          toast.success(t("subscription_activated"), {
            id: "stripe-success",
            description: t("plan_now_active"),
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
      toast.error(t("payment_cancelled"), {
        description: t("subscription_unchanged"),
      });
      router.replace(`/?tab=billing`, { scroll: false });
    }
  }, [searchParams, router, refresh, session?.accessToken, t]);

  const billingTabs =
    effectiveView === "customer" ? (
      <div
        className={`inline-flex p-0.5 rounded-lg border ${
          isDark
            ? "bg-white/[0.02] border-white/8"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === "overview"
              ? isDark
                ? "bg-white/10 text-white shadow-xs font-semibold"
                : "bg-white text-gray-900 shadow-xs font-semibold"
              : isDark
                ? "text-white/40 hover:text-white/80"
                : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <SquaresFour size={13} />
          {t("overview")}
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === "invoices"
              ? isDark
                ? "bg-white/10 text-white shadow-xs font-semibold"
                : "bg-white text-gray-900 shadow-xs font-semibold"
              : isDark
                ? "text-white/40 hover:text-white/80"
                : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Receipt size={13} />
          {t("invoices")}
        </button>
      </div>
    ) : (
      <div
        className={`inline-flex p-0.5 rounded-lg border ${
          isDark
            ? "bg-white/[0.02] border-white/8"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        <button
          onClick={() => setActiveAdminTab("overview")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
            activeAdminTab === "overview"
              ? isDark
                ? "bg-white/10 text-white shadow-xs font-semibold"
                : "bg-white text-gray-900 shadow-xs font-semibold"
              : isDark
                ? "text-white/40 hover:text-white/80"
                : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <SquaresFour size={13} />
          {t("financial")}
        </button>
        <button
          onClick={() => setActiveAdminTab("catalog")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
            activeAdminTab === "catalog"
              ? isDark
                ? "bg-white/10 text-white shadow-xs font-semibold"
                : "bg-white text-gray-900 shadow-xs font-semibold"
              : isDark
                ? "text-white/40 hover:text-white/80"
                : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Package size={13} />
          {t("catalog")}
        </button>
        <button
          onClick={() => setActiveAdminTab("controls")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
            activeAdminTab === "controls"
              ? isDark
                ? "bg-white/10 text-white shadow-xs font-semibold"
                : "bg-white text-gray-900 shadow-xs font-semibold"
              : isDark
                ? "text-white/40 hover:text-white/80"
                : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Shield size={13} />
          {t("controls")}
        </button>
      </div>
    );

  const headerActions = (
    <div className="flex items-center gap-2">
      <div
        className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
          isDark
            ? "bg-white/[0.02] border-white/8 text-white/50"
            : "bg-gray-50 border-gray-200 text-gray-600"
        }`}
      >
        <Shield
          size={13}
          className={isDark ? "text-white/60" : "text-gray-500"}
        />
        <span
          className="text-[9px] font-mono uppercase tracking-[0.18em]"
        >
          PCI-DSS
        </span>
      </div>

      {isSuperAdmin && (
        <div
          className={`inline-flex p-0.5 rounded-lg border ${
            isDark
              ? "bg-white/[0.02] border-white/8"
              : "bg-gray-100 border-gray-200"
          }`}
        >
          <button
            onClick={() => setViewMode("customer")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
              effectiveView === "customer"
                ? isDark
                  ? "bg-white/10 text-white shadow-xs font-semibold"
                  : "bg-white text-gray-900 shadow-xs font-semibold"
                : isDark
                  ? "text-white/40 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <User size={12} />
            <span className="hidden sm:inline whitespace-nowrap">{t("customer_view")}</span>
          </button>
          <button
            onClick={() => setViewMode("admin")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
              effectiveView === "admin"
                ? isDark
                  ? "bg-white/10 text-white shadow-xs font-semibold"
                  : "bg-white text-gray-900 shadow-xs font-semibold"
                : isDark
                  ? "text-white/40 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Crown size={12} />
            <span className="hidden sm:inline whitespace-nowrap">{t("admin_view")}</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={`flex-1 flex flex-col min-h-0 h-full ${isDark ? "bg-transparent" : "bg-gray-50"}`}>
      <header
        className={`shrink-0 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b backdrop-blur-xl transition-colors duration-200 ${
          isDark ? "bg-[#09090b]/80 border-white/6" : "bg-white/80 border-gray-200/80"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
              isDark
                ? "bg-white/[0.04] border-white/8 text-white/70"
                : "bg-gray-100 border-gray-200 text-gray-700"
            }`}
          >
            <Receipt size={15} />
          </div>
          <div className="flex items-center gap-3">
            <h1
              className={`text-sm sm:text-base font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-gray-900"
              }`}
            >
              {effectiveView === "admin" ? t("financial_center") : t("billing_portal")}
            </h1>
            <span
              className={`text-[10px] sm:text-[11px] font-mono tracking-wider uppercase border-l pl-3 ${
                isDark ? "border-white/10 text-white/40" : "border-gray-200 text-gray-400"
              }`}
            >
              {effectiveView === "admin" ? t("master_repository") : t("subscription_management")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {billingTabs}
          {headerActions}
        </div>
      </header>

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
