"use client";

import { useState, useEffect, useCallback } from "react";
import { settingsApi } from "@/features/settings/api/settings.api";
import { useApiAuth } from "@/lib/use-api-auth";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useMarketplaceCouponStore } from "../store";
import { marketplaceService } from "../services/marketplace.service";

const STORAGE_KEY = "celaest_coupon_used";
const EVENT_NAME = "celaest:coupon_used";

function isWelcomeCouponCode(code?: string | null): boolean {
  if (!code) return false;
  const normalized = code.trim().toUpperCase();
  return normalized === "WELCOME" || normalized === "WELCOM";
}

function getScopedStorageKey(userId?: string | null): string | null {
  return userId ? `${STORAGE_KEY}:${userId}` : null;
}

function readCouponUsedFromStorage(userId?: string | null): boolean {
  if (typeof window === "undefined") return false;
  try {
    const scopedKey = getScopedStorageKey(userId);
    if (scopedKey && localStorage.getItem(scopedKey) === "true") {
      return true;
    }
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeCouponUsedToStorage(userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, "true");
    const scopedKey = getScopedStorageKey(userId);
    if (scopedKey) {
      localStorage.setItem(scopedKey, "true");
    }
  } catch {}
}

function removeCouponUsedFromStorage(userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    const scopedKey = getScopedStorageKey(userId);
    if (scopedKey) {
      localStorage.removeItem(scopedKey);
    }
  } catch {}
}

/**
 * useCouponUsage
 *
 * Tracks whether the user/workspace has already redeemed or used the
 * promotional welcome coupon. Keeps `isChecking = true` until localStorage
 * confirms usage OR backend preferences settle, preventing any 0-frame / brief
 * flash of the 25% promo banner when the coupon is already exhausted.
 */
export function useCouponUsage() {
  const { token } = useApiAuth();
  const orgId = useOrgStore((s) => s.currentOrg?.id ?? null);
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const { activeCoupon, clearCoupon } = useMarketplaceCouponStore();

  const [isUsed, setIsUsed] = useState<boolean>(() => readCouponUsedFromStorage(userId));
  const [checkedIdentity, setCheckedIdentity] = useState<string | null>(null);

  const storageUsedNow = readCouponUsedFromStorage(userId);
  const effectiveIsUsed = isUsed || storageUsedNow;
  const activeIdentity = token ? `${userId ?? "anon"}` : null;
  const isChecking =
    !effectiveIsUsed && (!token || checkedIdentity !== activeIdentity);

  // Clear WELCOME coupon immediately whenever we know it's already used
  useEffect(() => {
    if (effectiveIsUsed && isWelcomeCouponCode(activeCoupon?.code)) {
      clearCoupon();
    }
  }, [effectiveIsUsed, activeCoupon?.code, clearCoupon]);

  // Check DB preferences and backend Lingua WELCOME trial eligibility on mount
  useEffect(() => {
    if (!token || storageUsedNow) return;
    let isMounted = true;
    const identity = `${userId ?? "anon"}`;

    const trialStatusPromise =
      typeof marketplaceService.getWelcomeTrialStatus === "function"
        ? marketplaceService.getWelcomeTrialStatus(token, orgId).catch(() => null)
        : Promise.resolve(null);

    Promise.all([
      settingsApi.getPreferences(token).catch(() => null),
      trialStatusPromise,
    ])
      .then(([prefsRes, trialStatus]) => {
        if (!isMounted) return;
        let prefsUsed = false;
        if (prefsRes?.preferences?.raw) {
          try {
            const prefs = JSON.parse(prefsRes.preferences.raw);
            prefsUsed = prefs.marketplace_coupon_used === true;
          } catch {}
        }

        const backendUnavailableOrUsed =
          trialStatus?.already_used === true || trialStatus?.has_active_access === true;

        if (prefsUsed || backendUnavailableOrUsed) {
          setIsUsed(true);
          writeCouponUsedToStorage(userId);
          const activeCode =
            useMarketplaceCouponStore.getState().activeCoupon?.code;
          if (isWelcomeCouponCode(activeCode)) {
            clearCoupon();
          }
        }
      })
      .finally(() => {
        if (isMounted) {
          setCheckedIdentity(identity);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token, userId, orgId, storageUsedNow, clearCoupon]);

  // Listen to custom event & storage event for cross-tab sync
  useEffect(() => {
    const handleSync = () => {
      setIsUsed(readCouponUsedFromStorage(userId));
    };

    window.addEventListener(EVENT_NAME, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(EVENT_NAME, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [userId]);

  const markCouponAsUsed = useCallback(() => {
    writeCouponUsedToStorage(userId);
    setIsUsed(true);
    clearCoupon();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(EVENT_NAME));
    }

    // Persist to user settings preferences if token is available
    if (token) {
      settingsApi
        .updatePreferences(
          { marketplace_coupon_used: true, marketplace_active_coupon: null },
          token,
        )
        .catch(console.error);
    }
  }, [token, userId, clearCoupon]);

  const resetCouponUsage = useCallback(() => {
    removeCouponUsedFromStorage(userId);
    setIsUsed(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(EVENT_NAME));
    }

    if (token) {
      settingsApi
        .updatePreferences({ marketplace_coupon_used: false }, token)
        .catch(console.error);
    }
  }, [token, userId]);

  return {
    isUsed: effectiveIsUsed,
    isChecking,
    markCouponAsUsed,
    resetCouponUsage,
  };
}

