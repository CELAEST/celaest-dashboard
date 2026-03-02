import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { useMarketplaceProducts } from "../useMarketplaceProducts";
import { marketplaceApi } from "../../api/marketplace.api";
import { createWrapper } from "@/test/test-utils";

// Mock the API
vi.mock("../../api/marketplace.api", () => ({
  marketplaceApi: {
    search: vi.fn(),
  },
}));

// Mock useApiAuth
vi.mock("@/lib/use-api-auth", () => ({
  useApiAuth: () => ({
    token: "fake-token",
    orgId: "fake-org",
  }),
}));

// Mock the store
vi.mock("../../store", () => ({
  useMarketplaceStore: (fn: (state: unknown) => unknown) =>
    fn({
      filters: { q: "", page: 1, limit: 20 },
      setFilters: vi.fn(),
      reset: vi.fn(),
    }),
}));

describe("useMarketplaceProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch products successfully", async () => {
    const mockProducts = {
      products: [{ id: "1", name: "Product 1" }],
      total: 1,
    };
    (marketplaceApi.search as Mock).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useMarketplaceProducts(), {
      wrapper: createWrapper(),
    });

    // Check loading state
    expect(result.current.loading).toBe(true);

    // Wait for data
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual(mockProducts.products);
    expect(result.current.total).toBe(1);
    expect(marketplaceApi.search).toHaveBeenCalledWith({
      q: "",
      page: 1,
      limit: 20,
    });
  });

  it("should handle error during fetch", async () => {
    const mockError = new Error("Failed to fetch");
    (marketplaceApi.search as Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useMarketplaceProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Failed to fetch");
    expect(result.current.products).toEqual([]);
  });
});
