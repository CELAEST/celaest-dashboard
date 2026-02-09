"use client";

import React from "react";
import { MarketplaceDashboardView } from "./MarketplaceDashboardView";
import { MarketplacePublicView } from "./MarketplacePublicView";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

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
