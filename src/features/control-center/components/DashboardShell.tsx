"use client";

import {
  useState,
  useEffect,
  startTransition,
} from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";

import { useOrgStore } from "@/features/shared/stores/useOrgStore";
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



export function DashboardShell() {
  const searchParams = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const { user, isLoading } = useAuth();

  // Redirect guest users to "marketplace" if they try to access any protected tab
  useEffect(() => {
    if (!isLoading && !user && activeTab !== "marketplace") {
      navigateTo("marketplace");
    }
  }, [user, isLoading, activeTab, navigateTo]);

  const isGuest = !isLoading && !user;
  const authMode = searchParams.get("mode");
  const showAuthPage =
    !user && (authMode === "signin" || authMode === "signup");

  // Fix: Explicit callback for sidebar to match types
  const handleTabChange = (tabId: string) => {
    navigateTo(tabId as ValidTabId);
  };


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
      className="min-h-screen w-full font-sans selection:bg-violet-500/25 selection:text-white overflow-x-hidden transition-colors duration-500 bg-[#F5F7FA] text-gray-900 dark:bg-[#020202] dark:text-white"
    >
      {/* Background with Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* En Light Mode se muestra el gradiente sutil. En Dark Mode se pinta el fondo negro obsidiana. */}
        <div className="absolute inset-0 bg-linear-to-br from-violet-50/40 via-white to-white dark:hidden z-10" />
        <div className="absolute inset-0 hidden dark:block bg-[#020202] z-10" />
        
        {/* Sutil aura ambiental violeta idéntica al hero de la Landing */}
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(167,139,250,0.07),transparent_70%)] z-10" />

        <div className="absolute inset-0 z-0 animate-bg-glow opacity-30 dark:opacity-20">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.12),transparent_60%)]" />
        </div>
        {/* Subtle grid overlay - hidden on mobile for rendering performance */}
        <div className="absolute inset-0 hidden md:block bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-20 mix-blend-overlay opacity-5 dark:opacity-15" />
      </div>

      {!isGuest && (
        <AppSidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isGuest={isGuest}
          onShowLogin={() => setShowLoginModal(true)}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
      )}

      <ConnectionBanner />

      <div className={`${!isGuest ? "md:pl-[88px] pl-0" : "pl-0"} w-full min-w-full relative z-10 transition-all duration-300 h-screen flex flex-col`}>
        <Header
          onShowLogin={() => setShowLoginModal(true)}
          onMenuClick={!isGuest ? () => setIsMobileSidebarOpen(true) : undefined}
          isGuest={isGuest}
        />

        <main
          aria-label="Contenido principal del dashboard"
          className={`flex-1 min-h-0 w-full min-w-0 overflow-y-auto ${isGuest || activeTab === "marketplace" ? "p-0" : "p-1.5 sm:p-3"} flex flex-col`}
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
