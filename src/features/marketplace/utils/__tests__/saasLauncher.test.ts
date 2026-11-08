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
    ).toBe("http://localhost:5173");

    expect(resolveSaasExternalUrl({ slug: "lingua" })).toBe(
      "http://localhost:5173",
    );
  });

  it("builds SSO handoff hash URL with access_token and refresh_token", () => {
    const url = buildSaasLaunchUrl(
      "https://celaest-english-front.vercel.app/",
      "jwt-access-123",
      "jwt-refresh-456",
    );
    expect(url).toBe(
      "https://celaest-english-front.vercel.app/auth/callback#access_token=jwt-access-123&refresh_token=jwt-refresh-456",
    );
  });

  it("returns base URL without hash when no accessToken is provided", () => {
    expect(buildSaasLaunchUrl("https://celaest-english-front.vercel.app/")).toBe(
      "https://celaest-english-front.vercel.app",
    );
  });

  it("opens SSO handoff URL in a new tab via window.open", () => {
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
      "https://celaest-english-front.vercel.app/auth/callback#access_token=tok-abc&refresh_token=ref-xyz",
      "_blank",
      "noopener,noreferrer",
    );
  });
});

