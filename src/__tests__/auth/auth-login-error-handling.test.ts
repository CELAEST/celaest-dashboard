/**
 * Tests for auth endpoint exclusion from the global 401 interceptor.
 *
 * Background:
 *   The api-client dispatches `celaest:unauthorized` on any 401 response,
 *   which triggers a global logout flow. Auth endpoints (/auth/login,
 *   /auth/register, /auth/signup) are EXCLUDED from this behavior because
 *   a 401 there means "wrong credentials", not "session expired".
 *
 * Coverage:
 *   1. 401 on /auth/login does NOT dispatch celaest:unauthorized
 *   2. 401 on /auth/register does NOT dispatch celaest:unauthorized
 *   3. 401 on /auth/signup does NOT dispatch celaest:unauthorized
 *   4. 401 on a regular endpoint STILL dispatches celaest:unauthorized
 *   5. 401 on an endpoint containing "auth" in path but NOT login/register
 *      STILL dispatches celaest:unauthorized (no over-broad exclusion)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Setup: fresh module import per test
// ---------------------------------------------------------------------------

let api: typeof import("@/lib/api-client").api;

function makeResponse(
  status: number,
  body: Record<string, unknown> = { success: true, data: {} },
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const TOKEN = "test-jwt-token";

beforeEach(async () => {
  sessionStorage.clear();
  localStorage.clear();
  vi.resetModules();
  const mod = await import("@/lib/api-client");
  api = mod.api;
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("auth endpoint 401 exclusion", () => {
  const authEndpoints = [
    { path: "/auth/login", label: "/auth/login" },
    { path: "/auth/register", label: "/auth/register" },
    { path: "/auth/signup", label: "/auth/signup" },
  ];

  authEndpoints.forEach(({ path, label }) => {
    it(`does NOT dispatch celaest:unauthorized on 401 from ${label}`, async () => {
      const eventSpy = vi.fn();
      window.addEventListener("celaest:unauthorized", eventSpy);

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValueOnce(
          makeResponse(401, {
            success: false,
            error: { message: "Invalid credentials", code: "UNAUTHORIZED" },
          }),
        ),
      );

      await expect(
        api.post(path, { email: "user@test.com", password: "wrong" }, { token: TOKEN }),
      ).rejects.toMatchObject({ status: 401 });

      expect(eventSpy).not.toHaveBeenCalled();
      window.removeEventListener("celaest:unauthorized", eventSpy);
    });
  });

  it("STILL dispatches celaest:unauthorized on 401 from a regular endpoint", async () => {
    const eventSpy = vi.fn();
    window.addEventListener("celaest:unauthorized", eventSpy);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(401, {
          success: false,
          error: { message: "Token expired", code: "UNAUTHORIZED" },
        }),
      ),
    );

    await expect(
      api.get("/user/profile", { token: TOKEN }),
    ).rejects.toMatchObject({ status: 401 });

    expect(eventSpy).toHaveBeenCalledOnce();
    window.removeEventListener("celaest:unauthorized", eventSpy);
  });

  it("dispatches celaest:unauthorized on 401 from /auth/me (not login/register)", async () => {
    const eventSpy = vi.fn();
    window.addEventListener("celaest:unauthorized", eventSpy);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(401, {
          success: false,
          error: { message: "Session invalid" },
        }),
      ),
    );

    await expect(
      api.get("/auth/me", { token: TOKEN }),
    ).rejects.toMatchObject({ status: 401 });

    expect(eventSpy).toHaveBeenCalledOnce();
    window.removeEventListener("celaest:unauthorized", eventSpy);
  });
});
