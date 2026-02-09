"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ValidTabId, FEATURE_REGISTRY } from "../config/feature-registry";
import { useCallback } from "react";

export const useDashboardRouter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab from URL, fallback to default (marketplace usually, or dashboard)
  // Logic from DashboardShell: guest defaults to marketplace.
  // We'll let the shell handle the guest redirection enforcement, 
  // here we just read the value.
  const rawTab = searchParams.get("tab");
  const activeTab = (rawTab && FEATURE_REGISTRY[rawTab] ? rawTab : "marketplace") as ValidTabId;

  const navigateTo = useCallback((tab: ValidTabId) => {
    // Updates URL without full page reload (Shallow routing in Next.js App Router happens by default with native browser APIs or specific next/link usage, 
    // but here we use replace to avoid inflating history stack too much for tab switching)
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    
    // Remove query params that might clash or aren't needed (like auth mode)
    params.delete("mode");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  return { activeTab, navigateTo };
};
