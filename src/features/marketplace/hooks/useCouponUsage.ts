"use client";

import { useState, useEffect, useCallback } from "react";
import { settingsApi } from "@/features/settings/api/settings.api";
import { useApiAuth } from "@/lib/use-api-auth";

const STORAGE_KEY = "celaest_coupon_used";
const EVENT_NAME = "celaest:coupon_used";

/**
 * useCouponUsage
 *
 * Tracks whether the user/workspace has already redeemed or used the
 * promotional coupon (e.g. EARLYBIRD). When used, the internal commercial banner
 * automatically disappears across all tabs and views.
 */
export function useCouponUsage() {
  const { token } = useApiAuth();

  const [isUsed, setIsUsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Check DB preferences on mount if authenticated
  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    settingsApi
      .getPreferences(token)
      .then((res) => {
        if (!isMounted || !res.preferences?.raw) return;
        try {
          const prefs = JSON.parse(res.preferences.raw);
          if (prefs.marketplace_coupon_used === true) {
            setIsUsed(true);
            try {
              localStorage.setItem(STORAGE_KEY, "true");
            } catch {}
          }
        } catch {}
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Listen to custom event & storage event for cross-tab sync
  useEffect(() => {
    const handleSync = () => {
      try {
        const val = localStorage.getItem(STORAGE_KEY) === "true";
        setIsUsed(val);
      } catch {}
    };

    window.addEventListener(EVENT_NAME, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(EVENT_NAME, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const markCouponAsUsed = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setIsUsed(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(EVENT_NAME));
    }

    // Persist to user settings preferences if token is available
    if (token) {
      settingsApi
        .updatePreferences({ marketplace_coupon_used: true }, token)
        .catch(console.error);
    }
  }, [token]);

  const resetCouponUsage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setIsUsed(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(EVENT_NAME));
    }

    if (token) {
      settingsApi
        .updatePreferences({ marketplace_coupon_used: false }, token)
        .catch(console.error);
    }
  }, [token]);

  return {
    isUsed,
    markCouponAsUsed,
    resetCouponUsage,
  };
}

