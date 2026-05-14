/**
 * Tests for admin review mutation hooks (super_admin gated by backend).
 *
 * Coverage:
 *   - useAdminUpdateReview happy path → calls API with token + invalidates caches
 *   - useAdminUpdateReview throws when there is no auth session
 *   - useAdminDeleteReview happy path → calls API + invalidates caches
 *   - useAdminDeleteReview throws when there is no auth session
 *
 * We mock the auth context, the marketplace API client, and react-toast so we
 * can assert behaviour purely at the hook boundary.
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ── Mocks ────────────────────────────────────────────────────────────
const adminUpdateReview = vi.fn();
const adminDeleteReview = vi.fn();
const toastSuccess = vi.fn();
const toastError = vi.fn();
let sessionMock: { accessToken: string } | null = {
  accessToken: "test-token",
};

vi.mock("@/features/marketplace/api/marketplace.api", () => ({
  marketplaceApi: {
    adminUpdateReview: (...args: unknown[]) => adminUpdateReview(...args),
    adminDeleteReview: (...args: unknown[]) => adminDeleteReview(...args),
  },
}));

vi.mock("@/features/auth/contexts/AuthContext", () => ({
  useAuth: () => ({ session: sessionMock }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: (msg: string) => toastSuccess(msg),
    error: (msg: string) => toastError(msg),
  },
}));

// Import AFTER mocks so the hooks pick them up.
import {
  useAdminUpdateReview,
  useAdminDeleteReview,
} from "@/features/marketplace/hooks/useAdminReviews";

function wrap() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { Wrapper, client };
}

describe("useAdminUpdateReview", () => {
  beforeEach(() => {
    adminUpdateReview.mockReset();
    toastSuccess.mockReset();
    toastError.mockReset();
    sessionMock = { accessToken: "test-token" };
  });

  it("calls the admin API with token and invalidates caches on success", async () => {
    adminUpdateReview.mockResolvedValue({ id: "r1", rating: 5, comment: "ok" });
    const { Wrapper, client } = wrap();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useAdminUpdateReview(), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      reviewId: "r1",
      input: { rating: 5, comment: "ok" },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(adminUpdateReview).toHaveBeenCalledWith(
      "r1",
      { rating: 5, comment: "ok" },
      "test-token",
    );
    expect(invalidateSpy).toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalled();
    expect(toastError).not.toHaveBeenCalled();
  });

  it("throws when there is no auth session", async () => {
    sessionMock = null;
    const { Wrapper } = wrap();

    const { result } = renderHook(() => useAdminUpdateReview(), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      reviewId: "r1",
      input: { rating: 4, comment: "x" },
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(adminUpdateReview).not.toHaveBeenCalled();
    expect(toastError).toHaveBeenCalled();
  });
});

describe("useAdminDeleteReview", () => {
  beforeEach(() => {
    adminDeleteReview.mockReset();
    toastSuccess.mockReset();
    toastError.mockReset();
    sessionMock = { accessToken: "test-token" };
  });

  it("calls the admin API and invalidates caches on success", async () => {
    adminDeleteReview.mockResolvedValue(undefined);
    const { Wrapper, client } = wrap();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useAdminDeleteReview(), {
      wrapper: Wrapper,
    });

    result.current.mutate("r1");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(adminDeleteReview).toHaveBeenCalledWith("r1", "test-token");
    expect(invalidateSpy).toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalled();
  });

  it("throws when there is no auth session", async () => {
    sessionMock = null;
    const { Wrapper } = wrap();

    const { result } = renderHook(() => useAdminDeleteReview(), {
      wrapper: Wrapper,
    });

    result.current.mutate("r1");
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(adminDeleteReview).not.toHaveBeenCalled();
    expect(toastError).toHaveBeenCalled();
  });
});
