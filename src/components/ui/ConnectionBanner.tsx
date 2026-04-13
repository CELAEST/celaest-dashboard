"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { WifiSlash, ArrowClockwise } from "@phosphor-icons/react";

/**
 * Global connection banner.
 *
 * Shows when:
 *   - Browser reports navigator.onLine === false
 *   - OR the /health ping fails
 *
 * Stays visible until connection is truly restored.
 * "Reintentar" shows a persistent spinner — never hides the banner on failure.
 */
export const ConnectionBanner = React.memo(function ConnectionBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Check both browser connectivity AND backend health */
  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    // 1. Browser-level check
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return false;
    }
    // 2. Backend health check
    try {
      const baseUrl = process.env.NEXT_PUBLIC_CELAEST_API_URL || "http://localhost:3001";
      const res = await fetch(`${baseUrl}/health`, {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  /** Go offline — show the banner and start auto-retrying */
  const goOffline = useCallback(() => {
    setIsOffline(true);
    setIsRetrying(true);

    // Clear any existing auto-retry
    if (retryTimerRef.current) clearInterval(retryTimerRef.current);

    // Auto-retry every 5s until restored
    retryTimerRef.current = setInterval(async () => {
      const ok = await checkConnectivity();
      if (ok) {
        setIsOffline(false);
        setIsRetrying(false);
        if (retryTimerRef.current) clearInterval(retryTimerRef.current);
        retryTimerRef.current = null;
        window.dispatchEvent(new CustomEvent("celaest:connection_restored"));
      }
    }, 5_000);
  }, [checkConnectivity]);

  /** Manual retry — just checks once, keeps spinner going */
  const handleRetry = useCallback(async () => {
    const ok = await checkConnectivity();
    if (ok) {
      setIsOffline(false);
      setIsRetrying(false);
      if (retryTimerRef.current) clearInterval(retryTimerRef.current);
      retryTimerRef.current = null;
      window.dispatchEvent(new CustomEvent("celaest:connection_restored"));
    }
    // If not OK — do nothing. Banner stays. Spinner stays. Auto-retry continues.
  }, [checkConnectivity]);

  useEffect(() => {
    const handleOffline = () => goOffline();
    const handleOnline = async () => {
      // Browser says online — verify with real ping before hiding
      const ok = await checkConnectivity();
      if (ok) {
        setIsOffline(false);
        setIsRetrying(false);
        if (retryTimerRef.current) clearInterval(retryTimerRef.current);
        retryTimerRef.current = null;
        window.dispatchEvent(new CustomEvent("celaest:connection_restored"));
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Check on mount
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      goOffline();
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-200 flex items-center justify-center gap-3 px-4 py-2.5 backdrop-blur-xl border-b text-sm font-medium transition-transform duration-300 ${
        isOffline
          ? "translate-y-0"
          : "-translate-y-full pointer-events-none"
      } bg-black/70 border-white/10 text-white/80`}
      role="alert"
      aria-live="assertive"
    >
      <WifiSlash size={16} className="shrink-0 text-amber-400" />
      <span>Sin conexión — reconectando automáticamente</span>
      <button
        onClick={handleRetry}
        className="ml-2 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-xs font-semibold flex items-center gap-1.5"
        aria-label="Reintentar conexión"
      >
        <ArrowClockwise
          size={13}
          className={isRetrying ? "animate-spin" : ""}
        />
        Reintentar
      </button>
      {isRetrying && (
        <span className="text-[11px] text-amber-400/70 ml-1 animate-pulse">
          Buscando conexión...
        </span>
      )}
    </div>
  );
});
