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
  { ssr: true }
);

/**
 * Smart Marketplace Router
 *
 * Automatically renders the appropriate Marketplace version based on auth state:
 * - NOT authenticated → MarketplacePublicView (Public/Marketing with full scroll)
 * - Authenticated → MarketplaceDashboardView (Operational with zero-scroll)
 */
export function MarketplaceRouter() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <MarketplacePublicView />;
  }

  return <MarketplaceDashboardView />;
}
