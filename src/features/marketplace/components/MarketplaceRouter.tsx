"use client";

import React from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { MarketplaceView } from "./MarketplaceView";
import { MarketplaceDashboardView } from "./MarketplaceDashboardView";

/**
 * Smart Marketplace Router
 *
 * Automatically renders the appropriate Marketplace version based on auth state:
 * - NOT authenticated → MarketplaceView (Public/Marketing with full scroll)
 * - Authenticated → MarketplaceDashboardView (Operational with zero-scroll)
 */
export function MarketplaceRouter() {
  const { user, isLoading } = useAuth();

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → Public/Marketing version
  if (!user) {
    return <MarketplaceView />;
  }

  // Logged in → Operational/Dashboard version
  return <MarketplaceDashboardView />;
}
