import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock the child views
vi.mock("@/features/marketplace/components/MarketplaceDashboardView", () => ({
  MarketplaceDashboardView: () => <div data-testid="internal-store">MarketplaceDashboardView</div>,
}));

vi.mock("@/features/marketplace/components/MarketplacePublicView", () => ({
  MarketplacePublicView: () => <div data-testid="external-store">MarketplacePublicView</div>,
}));

// Mock useAuthStore
const mockUseAuthStore = vi.fn();
vi.mock("@/features/auth/stores/useAuthStore", () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

import { MarketplaceRouter } from "@/features/marketplace/components/MarketplaceRouter";

describe("MarketplaceRouter Anti-Flash", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
    delete (window as unknown as { location?: unknown }).location;
    window.location = new URL("http://localhost:3000/") as unknown as Location;
    document.cookie = "";
  });

  it("renders internal store (MarketplaceDashboardView) immediately when authenticated", async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(<MarketplaceRouter />);

    expect(await screen.findByTestId("internal-store")).toBeDefined();
    expect(screen.queryByTestId("external-store")).toBeNull();
  });

  it("renders external store (MarketplacePublicView) for pure unauthenticated guests", async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(<MarketplaceRouter />);

    expect(await screen.findByTestId("external-store")).toBeDefined();
    expect(screen.queryByTestId("internal-store")).toBeNull();
  });

  it("renders loading spinner and DOES NOT render external store when OAuth code is in URL", () => {
    window.location = new URL("http://localhost:3000/?code=oauth-auth-code-123") as unknown as Location;

    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { container } = render(<MarketplaceRouter />);

    // Must NOT render external store (prevents the glitch)
    expect(screen.queryByTestId("external-store")).toBeNull();
    expect(screen.queryByTestId("internal-store")).toBeNull();
    // Must render the spinner
    expect(container.querySelector(".animate-spin")).not.toBeNull();
  });

  it("renders loading spinner and DOES NOT render external store when localStorage has saved auth and store is loading", () => {
    localStorage.setItem(
      "celaest-auth-storage",
      JSON.stringify({ state: { isAuthenticated: true, user: { id: "123" } } })
    );

    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { container } = render(<MarketplaceRouter />);

    // Must NOT render external store
    expect(screen.queryByTestId("external-store")).toBeNull();
    expect(screen.queryByTestId("internal-store")).toBeNull();
    expect(container.querySelector(".animate-spin")).not.toBeNull();
  });
});
