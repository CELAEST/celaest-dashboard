import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MarketplaceInternalHero } from "../MarketplaceInternalHero";
import { useMarketplaceCouponStore } from "../../store";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

const mockGetPreferences = vi.fn();
const mockUpdatePreferences = vi.fn().mockResolvedValue({});
const mockGetWelcomeTrialStatus = vi.fn();
const mockClaimWelcomeTrial = vi.fn();

vi.mock("@/features/settings/api/settings.api", () => ({
  settingsApi: {
    getPreferences: (...args: unknown[]) => mockGetPreferences(...args),
    updatePreferences: (...args: unknown[]) => mockUpdatePreferences(...args),
  },
}));

vi.mock("../../services/marketplace.service", () => ({
  marketplaceService: {
    getWelcomeTrialStatus: (...args: unknown[]) => mockGetWelcomeTrialStatus(...args),
    claimWelcomeTrial: (...args: unknown[]) => mockClaimWelcomeTrial(...args),
  },
}));

const mockApiAuthState: { token: string | null; orgId: string | null } = {
  token: "test-token",
  orgId: "org-1",
};

vi.mock("@/lib/use-api-auth", () => ({
  useApiAuth: () => ({
    token: mockApiAuthState.token,
    orgId: mockApiAuthState.orgId,
    isReady: Boolean(mockApiAuthState.token && mockApiAuthState.orgId),
    isAuthReady: Boolean(mockApiAuthState.token),
  }),
}));

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    section: ({
      children,
      ...rest
    }: React.HTMLAttributes<HTMLElement> & Record<string, unknown>) => {
      const { initial: _i, animate: _a, exit: _e, ...domProps } = rest;
      void _i;
      void _a;
      void _e;
      return <section {...domProps}>{children}</section>;
    },
  },
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (err: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("MarketplaceInternalHero Anti-Flash Gate", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
    mockApiAuthState.token = "test-token";
    mockApiAuthState.orgId = "org-1";
    mockGetWelcomeTrialStatus.mockResolvedValue({
      campaign_id: "lingua_welcome_15d",
      coupon_code: "WELCOME",
      trial_days: 15,
      ai_requests_limit: 200,
      product_slug: "celaest-lingua-ai",
      already_used: false,
      has_active_access: false,
      eligible: true,
    });
    mockClaimWelcomeTrial.mockResolvedValue({
      message: "Trial activated",
      product_id: "lingua-1",
      product_slug: "celaest-lingua-ai",
      license_id: "lic-trial-1",
      status: "trial",
      billing_cycle: "monthly",
      access_type: "trial",
      trial_days: 15,
      expires_at: new Date(Date.now() + 15 * 86400 * 1000).toISOString(),
      ai_requests_limit: 200,
      has_access: true,
    });
    useAuthStore.setState({
      user: {
        id: "user-123",
        email: "dev@celaest.com",
        role: "owner",
        name: "Dev",
      },
      session: null,
      isAuthenticated: true,
      isLoading: false,
      isBackendSynced: true,
      error: null,
    });
    useMarketplaceCouponStore.setState({ activeCoupon: null });
  });

  it("never renders the 15-day Lingua trial banner for even a single frame while preferences or catalog are loading", async () => {
    const prefsDeferred = deferred<{ preferences: { raw: string | null } }>();
    mockGetPreferences.mockReturnValueOnce(prefsDeferred.promise);

    const { container, rerender } = render(<MarketplaceInternalHero isLoading={true} />);

    // Frame 0 while both isLoading=true and getPreferences is pending
    expect(container.querySelector(".comm-commercial-strip")).toBeNull();
    expect(screen.queryByRole("region", { name: /15 Días Gratis/i })).toBeNull();
    expect(screen.queryByText("WELCOME")).toBeNull();

    // Catalog finishes loading, but getPreferences is still pending -> STILL hidden (no flash!)
    rerender(<MarketplaceInternalHero isLoading={false} />);
    expect(container.querySelector(".comm-commercial-strip")).toBeNull();
    expect(screen.queryByText("WELCOME")).toBeNull();

    // Even if resolved as eligible only AFTER both settle, no premature render occurred above
    await act(async () => {
      prefsDeferred.resolve({
        preferences: { raw: JSON.stringify({ marketplace_coupon_used: false }) },
      });
    });

    await waitFor(() => {
      expect(container.querySelector(".comm-commercial-strip")).not.toBeNull();
    });
    expect(screen.getByText("WELCOME")).toBeInTheDocument();
  });

  it("stays completely hidden (0ms flash) when localStorage is empty but DB says marketplace_coupon_used: true, and clears stale WELCOME coupon", async () => {
    useMarketplaceCouponStore.setState({
      activeCoupon: { code: "WELCOME", type: "percentage", value: 25 },
    });

    const prefsDeferred = deferred<{ preferences: { raw: string | null } }>();
    mockGetPreferences.mockReturnValueOnce(prefsDeferred.promise);

    const { container } = render(<MarketplaceInternalHero isLoading={false} />);

    // Before API resolves (localStorage empty): hidden!
    expect(container.querySelector(".comm-commercial-strip")).toBeNull();
    expect(screen.queryByText("WELCOME")).toBeNull();

    // API responds that coupon is already used
    await act(async () => {
      prefsDeferred.resolve({
        preferences: { raw: JSON.stringify({ marketplace_coupon_used: true }) },
      });
    });

    await waitFor(() => {
      expect(localStorage.getItem("celaest_coupon_used")).toBe("true");
      expect(localStorage.getItem("celaest_coupon_used:user-123")).toBe("true");
    });

    // Ensure getPreferences was only invoked once (no redundant re-fetch when activeCoupon is cleared)
    expect(mockGetPreferences).toHaveBeenCalledTimes(1);

    // Remains hidden forever and active WELCOME coupon is purged
    expect(container.querySelector(".comm-commercial-strip")).toBeNull();
    expect(screen.queryByRole("region", { name: /15 Días Gratis/i })).toBeNull();
    expect(screen.queryByText("WELCOME")).toBeNull();
    expect(useMarketplaceCouponStore.getState().activeCoupon).toBeNull();
  });

  it("renders the 15-day Lingua trial banner once preferences confirm eligibility and catalog loading finishes", async () => {
    mockGetPreferences.mockResolvedValueOnce({
      preferences: { raw: JSON.stringify({ marketplace_coupon_used: false }) },
    });

    const { container } = render(<MarketplaceInternalHero isLoading={false} />);

    await waitFor(() => {
      expect(screen.getByRole("region", { name: /15 Días Gratis/i })).toBeInTheDocument();
    });
    expect(container.querySelector(".comm-commercial-strip")).not.toBeNull();
    expect(screen.getByText("WELCOME")).toBeInTheDocument();
  });

  it("hides the banner and purges WELCOME when backend trial status reports already_used even if prefs say false", async () => {
    mockGetPreferences.mockResolvedValueOnce({
      preferences: { raw: JSON.stringify({ marketplace_coupon_used: false }) },
    });
    mockGetWelcomeTrialStatus.mockResolvedValueOnce({
      campaign_id: "lingua_welcome_15d",
      coupon_code: "WELCOME",
      trial_days: 15,
      ai_requests_limit: 200,
      product_slug: "celaest-lingua-ai",
      already_used: true,
      has_active_access: false,
      eligible: false,
    });
    useMarketplaceCouponStore.setState({
      activeCoupon: { code: "WELCOME", type: "percentage", value: 100, isTrial: true, trialDays: 15 },
    });

    const { container } = render(<MarketplaceInternalHero isLoading={false} />);

    await waitFor(() => {
      expect(localStorage.getItem("celaest_coupon_used")).toBe("true");
    });
    expect(container.querySelector(".comm-commercial-strip")).toBeNull();
    expect(useMarketplaceCouponStore.getState().activeCoupon).toBeNull();
  });

  it("claims the 15-day WELCOME trial in 1 click, invokes onTrialClaimed, and hides the banner", async () => {
    mockGetPreferences.mockResolvedValueOnce({
      preferences: { raw: JSON.stringify({ marketplace_coupon_used: false }) },
    });
    const onTrialClaimed = vi.fn();

    const { container } = render(
      <MarketplaceInternalHero isLoading={false} onTrialClaimed={onTrialClaimed} />,
    );

    const cta = await waitFor(() =>
      screen.getByRole("button", { name: /WELCOME/i }),
    );
    fireEvent.click(cta);

    await waitFor(() => {
      expect(mockClaimWelcomeTrial).toHaveBeenCalledWith("test-token", null);
      expect(onTrialClaimed).toHaveBeenCalledTimes(1);
    });
    expect(localStorage.getItem("celaest_coupon_used")).toBe("true");
    await waitFor(() => {
      expect(container.querySelector(".comm-commercial-strip")).toBeNull();
    });
  });
});
