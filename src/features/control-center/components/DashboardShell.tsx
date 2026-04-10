"use client";

import {
  useState,
  useSyncExternalStore,
  useEffect,
  startTransition,
} from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useSearchParams } from "next/navigation";
import { logger } from "@/lib/logger";
import { ConnectionBanner } from "@/components/ui/ConnectionBanner";

// Shared components
import { Header } from "@/features/shared/components/Header";
import { AppSidebar } from "@/features/shared/components/AppSidebar";
import { AuthPage } from "@/features/auth/components/AuthPage";
import { LoginModal } from "@/features/auth/components/LoginModal";

// New Architecture Components
import { FeatureLoader } from "./FeatureLoader";
import { AnimatedSlot } from "./AnimatedSlot";
import { useDashboardRouter } from "../hooks/useDashboardRouter";
import { ValidTabId } from "../config/feature-registry";

const emptySubscribe = () => () => {};

export function DashboardShell() {
  const searchParams = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Landing Guard
  const isRevokedLanding = searchParams.get("revoked") === "true";

  // Custom hooks from new architecture
  const { activeTab, navigateTo } = useDashboardRouter();
  const clearOrgSync = useOrgStore((s) => s.clearSync);
  const currentOrg = useOrgStore((s) => s.currentOrg);

  // wasRevoked tracks recovery in memory so the spinner persists past the
  // URL cleanup (replaceState removes ?revoked=true almost immediately, before
  // fetchOrgs completes). Without this, the shell renders with currentOrg=null
  // → isReady=false → "Preparando sesión" every time.
  const [wasRevoked, setWasRevoked] = useState(false);

  // Circuit Breaker: If we land with ?revoked=true, force a clean state
  useEffect(() => {
    if (searchParams.get("revoked") === "true") {
      console.warn(
        "[DashboardShell] Revoked landing detected. Clearing stale org context. currentOrg before clear:",
        useOrgStore.getState().currentOrg?.slug ?? "null",
      );
      startTransition(() => setWasRevoked(true));
      clearOrgSync();

      // Clean up the URL without re-triggering navigation logic
      const url = new URL(window.location.href);
      url.searchParams.delete("revoked");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, clearOrgSync]);

  // Once org is recovered (or timeout), stop blocking render.
  // Early-exit when wasRevoked=false avoids running on every org switch
  // during normal navigation.
  useEffect(() => {
    if (!wasRevoked) return;
    if (currentOrg) {
      logger.debug("[DashboardShell] Org recovered:", currentOrg.slug);
      startTransition(() => setWasRevoked(false));
      return;
    }
    // Safety: never block more than 5 seconds regardless of fetchOrgs outcome
    const t = setTimeout(() => {
      logger.warn(
        "[DashboardShell] wasRevoked timeout — releasing spinner. currentOrg still null.",
      );
      setWasRevoked(false);
    }, 5000);
    return () => clearTimeout(t);
  }, [wasRevoked, currentOrg]);

  const { theme } = useTheme();
  const { user, isLoading } = useAuth();
  const isDark = theme === "dark";

  const isGuest = !isLoading && !user;
  const authMode = searchParams.get("mode");
  const showAuthPage =
    !user && (authMode === "signin" || authMode === "signup");

  // Fix: Explicit callback for sidebar to match types
  const handleTabChange = (tabId: string) => {
    navigateTo(tabId as ValidTabId);
  };

  // Fix hydration mismatch
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Block render while:
  // 1. Auth is loading
  // 2. URL still has ?revoked=true (isRevokedLanding)
  // 3. wasRevoked=true but currentOrg not yet recovered (fetchOrgs in-flight)
  const isRecoveringOrg = wasRevoked && !currentOrg;
  if (isRevokedLanding || isRecoveringOrg) {
    return null;
  }

  if (showAuthPage) {
    return <AuthPage />;
  }

  return (
    <div
      className="min-h-screen w-full font-sans selection:bg-white/20 selection:text-white overflow-x-hidden transition-colors duration-500 bg-[#F5F7FA] text-gray-900 dark:bg-[#020202] dark:text-white"
    >
      {/* Background with Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* En Light Mode se muestra el gradiente azulado. En Dark Mode se oculta y en su lugar se pinta el fondo negro puro. */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-white dark:hidden z-10" />
        <div className="absolute inset-0 hidden dark:block bg-[#020202] z-10" />
        
        {/* El gradiente radial solo es visible en Dark Mode */}
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white/3 via-transparent to-transparent z-10" />

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
            className="w-full h-full object-cover transition-opacity duration-500 opacity-10 mix-blend-normal dark:mix-blend-screen dark:opacity-40"
            alt="background"
          />
        </motion.div>
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-20 mix-blend-overlay opacity-5 dark:opacity-20" />
      </div>

      <AppSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isGuest={isGuest}
        onShowLogin={() => setShowLoginModal(true)}
      />

      <ConnectionBanner />

      <div className="pl-[80px] w-full min-w-full relative z-10 transition-all duration-300 h-screen flex flex-col">
        <Header onShowLogin={() => setShowLoginModal(true)} />

        <main
          aria-label="Contenido principal del dashboard"
          className="flex-1 w-full min-w-0 overflow-y-auto p-3 scroll-smooth"
        >
          <AnimatedSlot
            activeKey={activeTab}
            render={(key) => (
              <FeatureLoader
                tab={key as ValidTabId}
                onShowLogin={() => setShowLoginModal(true)}
              />
            )}
          />
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
