/**
 * QueryInvalidationBatcher
 *
 * Deduplicates and batches React Query invalidation calls within a debounce window.
 *
 * Problem it solves:
 * ─────────────────
 * The backend can emit multiple related events in rapid succession
 * (e.g. order.deleted + analytics.updated arrive within ~50ms).
 * Each handler calls `invalidateQueries`, which marks queries stale and triggers
 * re-fetches. Without batching, two invalidations on the same key within that
 * window produce two consecutive network requests instead of one.
 *
 * How it works:
 * ─────────────
 * 1. `invalidate(key)` serializes the key and stores it in a pending Map.
 *    Duplicate keys are silently overwritten — already in the batch.
 * 2. A debounce timer (default 350ms) resets on every new call.
 * 3. When the timer fires, all unique pending keys are flushed in a single pass.
 *
 * Usage:
 * ──────
 * const batcher = createInvalidationBatcher(queryClient);
 * batcher.invalidate(["analytics", "dashboard"]);
 * batcher.invalidate(["billing"]);
 * // → single flush after 350ms
 */

import type { QueryClient } from "@tanstack/react-query";

type QueryKeyArray = readonly unknown[];

export interface InvalidationBatcher {
  invalidate: (queryKey: QueryKeyArray) => void;
  flush: () => void;
  destroy: () => void;
}

export function createInvalidationBatcher(
  queryClient: QueryClient,
  debounceMs = 350,
): InvalidationBatcher {
  const pendingKeys = new Map<string, QueryKeyArray>();
  let flushTimer: ReturnType<typeof setTimeout> | null = null;

  function serializeKey(key: QueryKeyArray): string {
    return JSON.stringify(key);
  }

  function flush() {
    flushTimer = null;
    if (pendingKeys.size === 0) return;
    for (const key of pendingKeys.values()) {
      queryClient.invalidateQueries({ queryKey: key });
    }
    pendingKeys.clear();
  }

  function invalidate(queryKey: QueryKeyArray) {
    const serialized = serializeKey(queryKey);
    // Overwrite: same key requested multiple times is deduplicated
    pendingKeys.set(serialized, queryKey);
    if (flushTimer !== null) clearTimeout(flushTimer);
    flushTimer = setTimeout(flush, debounceMs);
  }

  function destroy() {
    if (flushTimer !== null) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    pendingKeys.clear();
  }

  return { invalidate, flush, destroy };
}
