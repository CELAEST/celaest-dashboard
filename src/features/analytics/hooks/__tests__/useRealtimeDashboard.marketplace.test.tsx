import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { useRealtimeDashboard } from "../useRealtimeDashboard";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/features/shared/hooks/useSocket";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { createWrapper } from "@/test/test-utils";

// Mock Query Client
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<object>();
  return {
    ...actual,
    useQueryClient: vi.fn(),
  };
});

// Mock useSocket
vi.mock("@/features/shared/hooks/useSocket", () => ({
  useSocket: vi.fn(),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useRealtimeDashboard - Marketplace Integration", () => {
  const mockInvalidateQueries = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useQueryClient as Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });
  });

  it("should invalidate marketplace queries when product.created is received", () => {
    // Capture the callback passed to useSocket
    let productCreatedCallback: () => void = () => {};
    (useSocket as Mock).mockImplementation((event: string, cb: () => void) => {
      if (event === "product.created") productCreatedCallback = cb;
    });

    renderHook(() => useRealtimeDashboard(), { wrapper: createWrapper() });

    // Simulate the event
    productCreatedCallback();

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: QUERY_KEYS.marketplace.all,
    });
  });

  it("should invalidate marketplace queries when product.updated is received", () => {
    let productUpdatedCallback: () => void = () => {};
    (useSocket as Mock).mockImplementation((event: string, cb: () => void) => {
      if (event === "product.updated") productUpdatedCallback = cb;
    });

    renderHook(() => useRealtimeDashboard(), { wrapper: createWrapper() });

    productUpdatedCallback();

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: QUERY_KEYS.marketplace.all,
    });
  });

  it("should invalidate marketplace queries when marketplace.review_created is received", () => {
    let reviewCreatedCallback: () => void = () => {};
    (useSocket as Mock).mockImplementation((event: string, cb: () => void) => {
      if (event === "marketplace.review_created") reviewCreatedCallback = cb;
    });

    renderHook(() => useRealtimeDashboard(), { wrapper: createWrapper() });

    reviewCreatedCallback();

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: QUERY_KEYS.marketplace.all,
    });
  });
});
