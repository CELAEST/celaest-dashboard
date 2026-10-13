"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 60s cache by default — avoids redundant refetches on component remount
            staleTime: 60 * 1000,

            // Never retry on 429 (rate limited) or 401 (unauthorized — logout handled globally).
            // Allow 2 retries for transient network/preflight disconnects before failing.
            retry: (failureCount, error) => {
              if (error instanceof ApiError) {
                if (error.status === 429 || error.status === 401) return false;
              }
              return failureCount < 2;
            },

            // Respect rate-limit windows: back off 30s on 429, otherwise exponential
            retryDelay: (attemptIndex, error) => {
              if (error instanceof ApiError && error.status === 429) {
                return 30_000; // 30s — respect the rate limit window
              }
              return Math.min(1000 * Math.pow(2, attemptIndex), 10_000);
            },

            // Avoid unnecessary refetch when switching tabs
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  // Auto-recover all queries across the dashboard when network connectivity is restored
  useEffect(() => {
    const handleConnectionRestored = () => {
      queryClient.invalidateQueries();
    };
    window.addEventListener("celaest:connection_restored", handleConnectionRestored);
    window.addEventListener("online", handleConnectionRestored);
    return () => {
      window.removeEventListener("celaest:connection_restored", handleConnectionRestored);
      window.removeEventListener("online", handleConnectionRestored);
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
