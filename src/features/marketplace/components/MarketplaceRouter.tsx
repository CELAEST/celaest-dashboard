"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

const MarketplaceDashboardView = dynamic(
  () => import("./MarketplaceDashboardView").then((m) => m.MarketplaceDashboardView),
  { ssr: false }
);

const MarketplacePublicView = dynamic(
  () => import("./MarketplacePublicView").then((m) => m.MarketplacePublicView),
  { ssr: false }
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
 * - Authenticated OR Auth in progress → MarketplaceDashboardView (renders natural ProductSkeleton)
 * - NOT authenticated (Guest) → MarketplacePublicView
 */
export function MarketplaceRouter() {
  const { isAuthenticated } = useAuthStore();
  const hasAuthSignal = checkAuthSignals();

  // Si está autenticado o hay sesión/OAuth en curso, renderiza directamente la tienda interna.
  // MarketplaceDashboardView ya renderiza directamente su propio ProductSkeleton integrado.
  if (isAuthenticated || hasAuthSignal) {
    return <MarketplaceDashboardView />;
  }

  // Visitante no autenticado (guest)
  return <MarketplacePublicView />;
}
