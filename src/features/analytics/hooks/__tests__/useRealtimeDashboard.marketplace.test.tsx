import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { useRealtimeDashboard } from "../useRealtimeDashboard";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/features/shared/hooks/useSocket";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { createWrapper } from "@/test/test-utils";

/**
 * useRealtimeDashboard - Marketplace Integration Tests
 *
 * ⚠️  The hook uses InvalidationBatcher (debounce 350ms).
 *     Tests must advance fake timers past 350ms before asserting
 *     that invalidateQueries was called.
 */

// Mock Query Client
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<object>();
  return {
    ...actual,
    useQueryClient: vi.fn(),
  };
});

// Mock useSocket — stores callbacks by event name for test-driven invocation
vi.mock("@/features/shared/hooks/useSocket", () => ({
  useSocket: vi.fn(),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe("useRealtimeDashboard - Marketplace Integration", () => {
  const mockInvalidateQueries = vi.fn();
  // Captures all event handlers registered by the hook
  const capturedHandlers = new Map<string, () => void>();

  beforeEach(() => {
    // Install fake timers BEFORE hook renders so batcher's setTimeout uses the fake clock
    vi.useFakeTimers();
    vi.clearAllMocks();
    capturedHandlers.clear();

    (useQueryClient as Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });

    // Capture ALL event handlers in a single pass
    (useSocket as Mock).mockImplementation((event: string, cb: () => void) => {
      capturedHandlers.set(event, cb);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** Triggers an event and flushes the 350ms batcher */
  function triggerAndFlush(event: string) {
    const handler = capturedHandlers.get(event);
    expect(handler, `hook must register a handler for "${event}"`).toBeDefined();
    act(() => {
      handler!();
      vi.advanceTimersByTime(400); // past 350ms debounce
    });
  }

  it("should register a handler for product.created", () => {
    renderHook(() => useRealtimeDashboard(), { wrapper: createWrapper() });
    expect(capturedHandlers.has("product.created")).toBe(true);
  });

  it("should invalidate marketplace queries when product.created is received", () => {
    renderHook(() => useRealtimeDashboard(), { wrapper: createWrapper() });
    triggerAndFlush("product.created");
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: QUERY_KEYS.marketplace.all,
    });
  });

  it("should invalidate marketplace queries when product.updated is received", () => {
    renderHook(() => useRealtimeDashboard(), { wrapper: createWrapper() });
    triggerAndFlush("product.updated");
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: QUERY_KEYS.marketplace.all,
    });
  });

  it("should invalidate marketplace queries when marketplace.review_created is received", () => {
    renderHook(() => useRealtimeDashboard(), { wrapper: createWrapper() });
    triggerAndFlush("marketplace.review_created");
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: QUERY_KEYS.marketplace.all,
    });
  });

  it("should also invalidate assets when product.created is received", () => {
    renderHook(() => useRealtimeDashboard(), { wrapper: createWrapper() });
    triggerAndFlush("product.created");
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: QUERY_KEYS.assets.all,
    });
  });

  it("should deduplicate rapid marketplace invalidations within debounce window", () => {
    renderHook(() => useRealtimeDashboard(), { wrapper: createWrapper() });

    act(() => {
      capturedHandlers.get("product.created")!();
      capturedHandlers.get("product.updated")!();
      capturedHandlers.get("product.created")!(); // duplicate — must be collapsed
      vi.advanceTimersByTime(400);
    });

    // marketplace.all must be invalidated exactly once despite 3 trigger calls
    const marketplaceCalls = (mockInvalidateQueries.mock.calls as Array<[{ queryKey: unknown[] }]>)
      .filter((call) => JSON.stringify(call[0].queryKey) === JSON.stringify(QUERY_KEYS.marketplace.all));

    expect(marketplaceCalls.length).toBe(1);
  });
});
