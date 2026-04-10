/**
 * Unit tests for useAccessControl hook.
 *
 * Coverage:
 *   1. Grants access for public features even as guest
 *   2. Returns "loading" while auth is settling
 *   3. Returns "guest" for non-public features when user is null
 *   4. Grants access for "user" features when authenticated
 *   5. Returns "forbidden" for admin features when user is not admin
 *   6. Grants access for admin features when user IS admin
 *   7. Grants access for admin features when user is super_admin
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAccessControl } from "../useAccessControl";
import type { FeatureConfig } from "../../config/feature-registry";

// ---------------------------------------------------------------------------
// Mock useAuth — controllable per-test
// ---------------------------------------------------------------------------

const mockUseAuth = vi.fn();

vi.mock("@/features/auth/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeFeature = (access: "public" | "user" | "admin"): FeatureConfig => ({
  id: "test-feature",
  label: "Test Feature",
  load: () => Promise.resolve({ default: () => null }),
  access,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useAccessControl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("grants access for public features even when guest", () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });
    const { result } = renderHook(() => useAccessControl(makeFeature("public")));
    expect(result.current).toEqual({ granted: true });
  });

  it("returns loading when auth is settling", () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: true });
    const { result } = renderHook(() => useAccessControl(makeFeature("user")));
    expect(result.current).toEqual({ granted: false, reason: "loading" });
  });

  it("returns guest for user features when not authenticated", () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });
    const { result } = renderHook(() => useAccessControl(makeFeature("user")));
    expect(result.current).toEqual({ granted: false, reason: "guest" });
  });

  it("grants access for user features when authenticated", () => {
    mockUseAuth.mockReturnValue({ user: { id: "u1", role: "member" }, isLoading: false });
    const { result } = renderHook(() => useAccessControl(makeFeature("user")));
    expect(result.current).toEqual({ granted: true });
  });

  it("returns forbidden for admin features when user is a regular member", () => {
    mockUseAuth.mockReturnValue({ user: { id: "u1", role: "member" }, isLoading: false });
    const { result } = renderHook(() => useAccessControl(makeFeature("admin")));
    expect(result.current).toEqual({ granted: false, reason: "forbidden" });
  });

  it("grants access for admin features when user has admin role", () => {
    mockUseAuth.mockReturnValue({ user: { id: "u1", role: "admin" }, isLoading: false });
    const { result } = renderHook(() => useAccessControl(makeFeature("admin")));
    expect(result.current).toEqual({ granted: true });
  });

  it("grants access for admin features when user has super_admin role", () => {
    mockUseAuth.mockReturnValue({ user: { id: "u1", role: "super_admin" }, isLoading: false });
    const { result } = renderHook(() => useAccessControl(makeFeature("admin")));
    expect(result.current).toEqual({ granted: true });
  });
});
