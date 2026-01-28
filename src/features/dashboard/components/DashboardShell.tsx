"use client";

import { useState, useSyncExternalStore } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useSearchParams } from "next/navigation";

// Shared components
import { Header } from "@/features/shared/components/Header";
import { Sidebar } from "@/features/shared/components/Sidebar";
import { AuthPage } from "@/features/auth/components/AuthPage";
import { LoginModal } from "@/features/auth/components/LoginModal";

// New Architecture Components
import { FeatureLoader } from "./FeatureLoader";
import { AnimatedSlot } from "./AnimatedSlot";
import { useDashboardRouter } from "../hooks/useDashboardRouter";

const emptySubscribe = () => () => {};

export function DashboardShell() {
  const searchParams = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Custom hooks from new architecture
  const { activeTab, navigateTo } = useDashboardRouter();

  const { theme } = useTheme();
  const { user, isLoading } = useAuth();
  const isDark = theme === "dark";

  const isGuest = !isLoading && !user;
  const authMode = searchParams.get("mode");
  const showAuthPage =
    !user && (authMode === "signin" || authMode === "signup");

  // Fix hydration mismatch
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

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

  if (showAuthPage) {
    return <AuthPage />;
  }

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
        setActiveTab={navigateTo}
        isGuest={isGuest}
        onShowLogin={() => setShowLoginModal(true)}
      />

      <div className="pl-[80px] relative z-10 transition-all duration-300 h-screen flex flex-col">
        <Header onShowLogin={() => setShowLoginModal(true)} />

        <main className="flex-1 overflow-y-auto p-3 w-full scroll-smooth">
          <AnimatedSlot activeKey={activeTab}>
            <FeatureLoader onShowLogin={() => setShowLoginModal(true)} />
          </AnimatedSlot>
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
