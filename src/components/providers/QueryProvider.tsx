"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
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
            // Retrying these immediately would amplify the exact problem we're trying to avoid.
            retry: (failureCount, error) => {
              if (error instanceof ApiError) {
                if (error.status === 429 || error.status === 401) return false;
              }
              return failureCount < 1;
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

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
