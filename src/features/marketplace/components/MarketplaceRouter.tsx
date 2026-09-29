"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

const MarketplaceDashboardView = dynamic(
  () => import("./MarketplaceDashboardView").then((m) => m.MarketplaceDashboardView),
  {
    loading: () => (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
    ssr: false,
  }
);

const MarketplacePublicView = dynamic(
  () => import("./MarketplacePublicView").then((m) => m.MarketplacePublicView),
  {
    loading: () => (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
    ssr: false,
  }
);

/**
 * Check if the browser has any indicators that an authenticated session
 * or OAuth exchange is currently present or in-flight.
 */
function checkAuthSignals(): boolean {
  if (typeof window === "undefined") return false;

  try {
    // 1. Check zustand persisted auth in localStorage
    const stored = localStorage.getItem("celaest-auth-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.state?.isAuthenticated) return true;
    }

    // 2. Check for OAuth code exchange or tokens in URL
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("code") || searchParams.has("token")) return true;
    if (window.location.hash.includes("access_token")) return true;

    // 3. Check for Supabase session cookies
    if (document.cookie.includes("sb-")) return true;
  } catch {
    // ignore parse errors
  }

  return false;
}

/**
 * Smart Marketplace Router
 *
 * Automatically renders the appropriate Marketplace version based on auth state:
 * - NOT authenticated (Guest) → MarketplacePublicView (Public/Marketing with full scroll)
 * - Authenticated → MarketplaceDashboardView (Operational with zero-scroll)
 *
 * Guarantees zero flash of MarketplacePublicView during login, OAuth redirects,
 * or authenticated reloads.
 */
export function MarketplaceRouter() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const hasAuthSignal = checkAuthSignals();

  // If already confirmed authenticated, render internal store immediately
  if (isAuthenticated) {
    return <MarketplaceDashboardView />;
  }

  // If there are signals that a session exists or OAuth is in-flight, but auth is still loading,
  // do NOT prematurely render MarketplacePublicView (avoids external store flash).
  if (isLoading || hasAuthSignal) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Pure unauthenticated guest: render public external store
  return <MarketplacePublicView />;
}
