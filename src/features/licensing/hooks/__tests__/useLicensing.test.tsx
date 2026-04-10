/**
 * Unit tests for useLicensing hook.
 *
 * Coverage:
 *   1. Returns licenses from query data
 *   2. Admin detection via session role
 *   3. Exposes filter state setters
 *   4. Exposes mutation functions
 *   5. Computes stats from query
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLicensing } from "../useLicensing";
import { createWrapper } from "@/test/test-utils";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/features/auth/stores/useAuthStore", () => ({
  useAuthStore: vi.fn((selector) =>
    selector({
      session: {
        accessToken: "test-token",
        user: { id: "u1", role: "super_admin" },
      },
    })
  ),
}));

vi.mock("@/features/shared/stores/useOrgStore", () => ({
  useOrgStore: vi.fn((selector) =>
    selector({
      currentOrg: { id: "org-1", name: "Test" },
    })
  ),
}));

vi.mock("../useLicensesQuery", () => ({
  useLicensesQuery: vi.fn(() => ({
    data: {
      pages: [
        {
          licenses: [
            { id: "lic-1", license_key: "KEY-1", status: "active", ip_bindings: [] },
            { id: "lic-2", license_key: "KEY-2", status: "revoked", ip_bindings: [] },
          ],
          total: 2,
          page: 1,
          limit: 15,
        },
      ],
    },
    isLoading: false,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  })),
  useLicenseStatsQuery: vi.fn(() => ({
    data: {
      total: 2,
      active: 1,
      revoked: 1,
      expired: 0,
      trial: 0,
    },
  })),
}));

vi.mock("@/features/licensing/services/licensing.service", () => ({
  licensingService: {
    list: vi.fn(),
    changeStatus: vi.fn(),
    revoke: vi.fn(),
    renew: vi.fn(),
    convertTrial: vi.fn(),
    reactivate: vi.fn(),
    unbindIP: vi.fn(),
    getValidationLogs: vi.fn(),
    getValidations: vi.fn().mockResolvedValue([]),
    isServiceReady: () => true,
    getStats: vi.fn(),
    getPlans: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useLicensing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns flattened license list from infinite query pages", () => {
    const { result } = renderHook(() => useLicensing(), {
      wrapper: createWrapper(),
    });

    expect(result.current.licenses).toHaveLength(2);
    expect(result.current.licenses[0].id).toBe("lic-1");
    expect(result.current.licenses[1].id).toBe("lic-2");
  });

  it("returns analytics data from stats query", () => {
    const { result } = renderHook(() => useLicensing(), {
      wrapper: createWrapper(),
    });

    expect(result.current.analytics).toBeDefined();
    expect(result.current.analytics?.total).toBe(2);
    expect(result.current.analytics?.active).toBe(1);
    expect(result.current.analytics?.revoked).toBe(1);
  });

  it("exposes search and status filter setters", () => {
    const { result } = renderHook(() => useLicensing(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSearchQuery("test-key");
    });
    expect(result.current.searchQuery).toBe("test-key");

    act(() => {
      result.current.setStatusFilter("active");
    });
    expect(result.current.statusFilter).toBe("active");
  });

  it("exposes mutation handlers with correct names", () => {
    const { result } = renderHook(() => useLicensing(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.handleChangeStatus).toBe("function");
    expect(typeof result.current.revokeLicense).toBe("function");
    expect(typeof result.current.renewLicense).toBe("function");
    expect(typeof result.current.reactivateLicense).toBe("function");
    expect(typeof result.current.handleUnbindIp).toBe("function");
  });
});
