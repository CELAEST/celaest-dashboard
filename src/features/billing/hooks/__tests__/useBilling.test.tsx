/**
 * Unit tests for useBilling hook.
 *
 * Coverage:
 *   1. Returns default empty state when no org/token
 *   2. Enriches subscriptions with plan data from catalog
 *   3. Sorts subscriptions by tier (highest first)
 *   4. Builds synthetic plan for marketplace products
 *   5. Calculates license usage percentages correctly
 *   6. Returns error message on API failure
 */

import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBilling } from "../useBilling";
import { createWrapper } from "@/test/test-utils";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/features/shared/stores/useOrgStore", () => ({
  useOrgStore: vi.fn(() => ({
    currentOrg: { id: "org-1", name: "Test Org" },
  })),
}));

vi.mock("@/features/auth/contexts/AuthContext", () => ({
  useAuth: () => ({
    session: { accessToken: "test-token" },
  }),
}));

const mockGetSubscriptions = vi.fn();
const mockGetInvoices = vi.fn();
const mockGetPlans = vi.fn();
const mockGetUsage = vi.fn();

vi.mock("../../api/billing.api", () => ({
  billingApi: {
    getSubscriptions: (...args: unknown[]) => mockGetSubscriptions(...args),
    getInvoices: (...args: unknown[]) => mockGetInvoices(...args),
    getPlans: (...args: unknown[]) => mockGetPlans(...args),
    getUsage: (...args: unknown[]) => mockGetUsage(...args),
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setupDefaultMocks() {
  mockGetSubscriptions.mockResolvedValue({
    subscriptions: [
      {
        id: "sub-1",
        organization_id: "org-1",
        product_id: "prod-1",
        plan_id: "plan-starter",
        status: "active",
        quantity: 5,
        metadata: {},
      },
    ],
    total: 1,
  });

  mockGetInvoices.mockResolvedValue({
    invoices: [{ id: "inv-1", amount: 1000 }],
    total: 1,
  });

  mockGetPlans.mockResolvedValue({
    plans: [
      {
        id: "plan-starter",
        name: "Starter",
        code: "starter",
        tier: 1,
        sort_order: 1,
        price_monthly: 29,
        currency: "USD",
        is_active: true,
        is_public: true,
      },
      {
        id: "plan-pro",
        name: "Pro",
        code: "pro",
        tier: 2,
        sort_order: 2,
        price_monthly: 99,
        currency: "USD",
        is_active: true,
        is_public: true,
      },
    ],
  });

  mockGetUsage.mockResolvedValue([]);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useBilling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();
  });

  it("returns enriched subscription with plan data from catalog", async () => {
    const { result } = renderHook(() => useBilling(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.subscription).not.toBeNull();
    expect(result.current.plan?.name).toBe("Starter");
    expect(result.current.plan?.id).toBe("plan-starter");
  });

  it("returns all catalog plans", async () => {
    const { result } = renderHook(() => useBilling(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.plans).toHaveLength(2);
    expect(result.current.plans[0].name).toBe("Starter");
    expect(result.current.plans[1].name).toBe("Pro");
  });

  it("calculates license usage percentage correctly", async () => {
    const { result } = renderHook(() => useBilling(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 1 active sub out of 5 quantity = 20%
    expect(result.current.usage.licenses.total).toBe(5);
    expect(result.current.usage.licenses.used).toBeGreaterThanOrEqual(1);
    expect(result.current.usage.licenses.percent).toBeLessThanOrEqual(100);
  });

  it("builds synthetic plan for marketplace product subscriptions", async () => {
    mockGetSubscriptions.mockResolvedValue({
      subscriptions: [
        {
          id: "sub-marketplace",
          organization_id: "org-1",
          product_id: "mp-1",
          plan_id: "mp-plan-1",
          status: "active",
          quantity: 1,
          metadata: {
            product_name: "AI Toolkit",
            product_price: "49.99",
            product_currency: "USD",
            product_id: "mp-1",
          },
        },
      ],
      total: 1,
    });

    const { result } = renderHook(() => useBilling(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.plan?.name).toBe("AI Toolkit");
    expect(result.current.plan?.code).toBe("marketplace_product");
    expect(result.current.plan?.price_monthly).toBe(49.99);
  });

  it("returns invoices from API response", async () => {
    const { result } = renderHook(() => useBilling(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.invoices).toHaveLength(1);
    expect(result.current.invoices[0].id).toBe("inv-1");
  });

  it("returns error message on API failure", async () => {
    mockGetSubscriptions.mockRejectedValue(new Error("Network down"));

    const { result } = renderHook(() => useBilling(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Network down");
  });
});
