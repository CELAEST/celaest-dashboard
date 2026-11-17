import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isSaasProduct,
  resolveSaasExternalUrl,
  buildSaasLaunchUrl,
  launchSaasProduct,
} from "../saasLauncher";

describe("saasLauncher", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("identifies SaaS products by product_type, external_url, or lingua slug", () => {
    expect(isSaasProduct({ slug: "lingua", product_type: "saas" })).toBe(true);
    expect(
      isSaasProduct({
        slug: "custom-cloud",
        product_type: "software",
        external_url: "https://app.celaest.com",
      }),
    ).toBe(true);
    expect(
      isSaasProduct({
        slug: "desktop-tool",
        product_type: "software",
        external_url: "",
      }),
    ).toBe(false);
  });

  it("resolves external_url and replaces dead lingua.celaest.com placeholder", () => {
    expect(
      resolveSaasExternalUrl({
        slug: "lingua",
        external_url: "https://celaest-english-front.vercel.app/",
      }),
    ).toBe("https://celaest-english-front.vercel.app");

    expect(
      resolveSaasExternalUrl({
        slug: "lingua",
        external_url: "https://lingua.celaest.com/",
      }),
    ).toBe("http://localhost:3001");

    expect(
      resolveSaasExternalUrl({
        slug: "lingua",
        external_url: "https://app.celaest.com/dashboard/marketplace",
      }),
    ).toBe("http://localhost:3001");

    expect(resolveSaasExternalUrl({ slug: "lingua" })).toBe(
      "http://localhost:3001",
    );
  });

  it("builds SSO handoff hash URL with access_token only (never leaks refresh_token across apps)", () => {
    const url = buildSaasLaunchUrl(
      "https://celaest-english-front.vercel.app/",
      "jwt-access-123",
      "jwt-refresh-456",
    );
    expect(url).toBe(
      "https://celaest-english-front.vercel.app/auth/callback#access_token=jwt-access-123",
    );
    expect(url).not.toContain("refresh_token");
  });

  it("returns base URL without hash when no accessToken is provided", () => {
    expect(buildSaasLaunchUrl("https://celaest-english-front.vercel.app/")).toBe(
      "https://celaest-english-front.vercel.app",
    );
  });

  it("opens SSO handoff URL in a new tab via window.open without forwarding refresh_token", () => {
    const openSpy = vi.fn();
    vi.stubGlobal("window", {
      open: openSpy,
      location: { hostname: "localhost" },
    });

    const launched = launchSaasProduct(
      {
        slug: "lingua",
        product_type: "saas",
        external_url: "https://celaest-english-front.vercel.app",
      },
      "tok-abc",
      "ref-xyz",
    );

    expect(launched).toBe(true);
    expect(openSpy).toHaveBeenCalledWith(
      "https://celaest-english-front.vercel.app/auth/callback#access_token=tok-abc",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("recovers SSO accessToken from persisted celaest-auth-storage when store prop is empty", () => {
    const openSpy = vi.fn();
    vi.stubGlobal("window", {
      open: openSpy,
      location: { hostname: "dashboard.celaest.com" },
      localStorage: {
        getItem: (key: string) =>
          key === "celaest-auth-storage"
            ? JSON.stringify({
                state: {
                  session: {
                    accessToken: "persisted-jwt",
                    refreshToken: "persisted-refresh",
                  },
                },
              })
            : null,
      },
    });

    const launched = launchSaasProduct({
      slug: "lingua",
      product_type: "saas",
      external_url: "https://lingua.celaest.com",
    });

    expect(launched).toBe(true);
    expect(openSpy).toHaveBeenCalledWith(
      "https://lingua.celaest.com/auth/callback#access_token=persisted-jwt",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("falls back to Supabase sb-*-auth-token access_token when celaest-auth-storage is empty", () => {
    const openSpy = vi.fn();
    const store: Record<string, string> = {
      "sb-wcfrqjulnbtmmakirdic-auth-token": JSON.stringify({
        access_token: "sb-jwt-token",
        refresh_token: "sb-refresh-token",
      }),
    };
    const keys = Object.keys(store);
    vi.stubGlobal("window", {
      open: openSpy,
      location: { hostname: "dashboard.celaest.com" },
      localStorage: {
        length: keys.length,
        key: (idx: number) => keys[idx] ?? null,
        getItem: (key: string) => store[key] ?? null,
      },
    });

    const launched = launchSaasProduct({
      slug: "lingua",
      product_type: "saas",
      external_url: "https://lingua.celaest.com",
    });

    expect(launched).toBe(true);
    expect(openSpy).toHaveBeenCalledWith(
      "https://lingua.celaest.com/auth/callback#access_token=sb-jwt-token",
      "_blank",
      "noopener,noreferrer",
    );
  });
});

