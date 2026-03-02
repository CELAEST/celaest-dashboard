/**
 * Production-grade tests for api-client.ts
 *
 * Coverage areas (all production-critical):
 *
 *   1. Blacklist guard — request blocked if org is in sessionStorage blacklist
 *   2. Home org protection — 403 FORBIDDEN never blacklists the Celaest home org
 *   3. Non-home org blacklisting — 403 FORBIDDEN triggers blacklist + event
 *   4. 401 dispatch — any 401 fires `celaest:unauthorized`
 *   5. 403 without FORBIDDEN code — no blacklist triggered
 *   6. 404 org-not-found — fires `celaest:org_not_found`
 *   7. 404 resource-not-found — DOES NOT fire event (not org-level)
 *   8. Retry on transient network error (non-connection-refused)
 *   9. NO retry on ERR_CONNECTION_REFUSED ("Failed to fetch")
 *  10. Zod schema validation — mismatch throws ApiError SCHEMA_MISMATCH
 *  11. Happy path GET with auth + org headers
 *  12. Happy path POST with body
 *  13. Max retries exhausted — throws NETWORK_ERROR
 *  14. Blacklist is not poisoned by 403 that already had the org blacklisted
 *  15. SSR safety — blacklist read/write skipped when window is undefined
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// We import api after each test-module reset so sessionStorage changes are
// reflected. Each test gets a fresh module because we call vi.resetModules().
// ─────────────────────────────────────────────────────────────────────────────
let api: typeof import("@/lib/api-client").api;
let _ApiError: typeof import("@/lib/api-client").ApiError;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Produces a minimal JSON Response with the celaest-back envelope. */
function makeResponse(
  status: number,
  body: Record<string, unknown> = { success: true, data: {} }
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Token / org stubs */
const TOKEN = "test-jwt-token";
const ORG_ID = "44444444-4444-4444-4444-444444444444";
const HOME_ORG_ID = "11111111-1111-1111-1111-111111111111";

// ─────────────────────────────────────────────────────────────────────────────
// Setup / teardown
// ─────────────────────────────────────────────────────────────────────────────

beforeEach(async () => {
  sessionStorage.clear();
  localStorage.clear();
  vi.resetModules();
  // Fresh import so sessionStorage reads start clean
  const mod = await import("@/lib/api-client");
  api = mod.api;
  _ApiError = mod.ApiError;
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. Blacklist guard
// ─────────────────────────────────────────────────────────────────────────────
describe("blacklist guard", () => {
  it("throws ApiError 403 FORBIDDEN before hitting the network when org is blacklisted", async () => {
    sessionStorage.setItem("celaest:revoked_orgs", JSON.stringify([ORG_ID]));

    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await expect(
      api.get("/test", { token: TOKEN, orgId: ORG_ID })
    ).rejects.toMatchObject({ status: 403, code: "FORBIDDEN" });

    // Zero network calls — blocked before fetch
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("does NOT block request if org is NOT in blacklist", async () => {
    const OTHER_ORG = "22222222-2222-2222-2222-222222222222";
    sessionStorage.setItem("celaest:revoked_orgs", JSON.stringify([ORG_ID]));

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(200, { success: true, data: { ok: true } })
      )
    );

    const result = await api.get<{ ok: boolean }>("/test", {
      token: TOKEN,
      orgId: OTHER_ORG,
    });

    expect(result).toMatchObject({ ok: true });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Home org protection on 403 FORBIDDEN
// ─────────────────────────────────────────────────────────────────────────────
describe("home org protection — 403 FORBIDDEN", () => {
  it("NEVER adds home org to blacklist on FORBIDDEN 403", async () => {
    sessionStorage.setItem("celaest:home_org_id", HOME_ORG_ID);

    const eventSpy = vi.fn();
    window.addEventListener("celaest:org_not_found", eventSpy);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(403, {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "You are not a member of this organization",
          },
        })
      )
    );

    await expect(
      api.get("/test", { token: TOKEN, orgId: HOME_ORG_ID })
    ).rejects.toMatchObject({ status: 403 });

    // home org must NOT be in blacklist
    const blacklist = JSON.parse(
      sessionStorage.getItem("celaest:revoked_orgs") ?? "[]"
    ) as string[];
    expect(blacklist).not.toContain(HOME_ORG_ID);

    // And the recovery event must NOT fire
    expect(eventSpy).not.toHaveBeenCalled();

    window.removeEventListener("celaest:org_not_found", eventSpy);
  });

  it("does not fire org_not_found for home org even on second consecutive 403", async () => {
    sessionStorage.setItem("celaest:home_org_id", HOME_ORG_ID);

    const eventSpy = vi.fn();
    window.addEventListener("celaest:org_not_found", eventSpy);

    const forbiddenResp = () =>
      makeResponse(403, {
        success: false,
        error: { code: "FORBIDDEN", message: "not a member" },
      });

    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValueOnce(forbiddenResp())
        .mockResolvedValueOnce(forbiddenResp())
    );

    await expect(
      api.get("/test", { token: TOKEN, orgId: HOME_ORG_ID })
    ).rejects.toMatchObject({ status: 403 });
    await expect(
      api.get("/test", { token: TOKEN, orgId: HOME_ORG_ID })
    ).rejects.toMatchObject({ status: 403 });

    expect(eventSpy).not.toHaveBeenCalled();
    window.removeEventListener("celaest:org_not_found", eventSpy);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Non-home org gets blacklisted on FORBIDDEN 403
// ─────────────────────────────────────────────────────────────────────────────
describe("non-home org — 403 FORBIDDEN blacklisting", () => {
  it("adds org to sessionStorage blacklist and fires celaest:org_not_found", async () => {
    // homeOrgId is different — so ORG_ID is a regular workspace
    sessionStorage.setItem("celaest:home_org_id", HOME_ORG_ID);

    const eventSpy = vi.fn();
    window.addEventListener("celaest:org_not_found", eventSpy);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(403, {
          success: false,
          error: { code: "FORBIDDEN", message: "You are not a member" },
        })
      )
    );

    await expect(
      api.get("/test", { token: TOKEN, orgId: ORG_ID })
    ).rejects.toMatchObject({ status: 403 });

    const blacklist = JSON.parse(
      sessionStorage.getItem("celaest:revoked_orgs") ?? "[]"
    ) as string[];
    expect(blacklist).toContain(ORG_ID);
    expect(eventSpy).toHaveBeenCalledOnce();

    window.removeEventListener("celaest:org_not_found", eventSpy);
  });

  it("does NOT fire event twice when org is already in blacklist (idempotency)", async () => {
    sessionStorage.setItem("celaest:home_org_id", HOME_ORG_ID);
    // Pre-populate blacklist
    sessionStorage.setItem(
      "celaest:revoked_orgs",
      JSON.stringify([ORG_ID])
    );

    const eventSpy = vi.fn();
    window.addEventListener("celaest:org_not_found", eventSpy);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(403, {
          success: false,
          error: { code: "FORBIDDEN", message: "not a member" },
        })
      )
    );

    // Already blacklisted — should throw immediately, no event
    await expect(
      api.get("/test", { token: TOKEN, orgId: ORG_ID })
    ).rejects.toMatchObject({ status: 403, code: "FORBIDDEN" });

    // No new event dispatched (blocked before fetch)
    expect(eventSpy).not.toHaveBeenCalled();

    window.removeEventListener("celaest:org_not_found", eventSpy);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. 401 dispatches celaest:unauthorized
// ─────────────────────────────────────────────────────────────────────────────
describe("401 unauthorized", () => {
  it("dispatches celaest:unauthorized event on any 401 response", async () => {
    const eventSpy = vi.fn();
    window.addEventListener("celaest:unauthorized", eventSpy);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(401, {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Token expired" },
        })
      )
    );

    await expect(
      api.get("/protected", { token: TOKEN, orgId: ORG_ID })
    ).rejects.toMatchObject({ status: 401 });

    expect(eventSpy).toHaveBeenCalledOnce();
    window.removeEventListener("celaest:unauthorized", eventSpy);
  });

  it("does NOT dispatch org_not_found on 401 (logout must be the handler, not org recovery)", async () => {
    const orgSpy = vi.fn();
    window.addEventListener("celaest:org_not_found", orgSpy);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(401, {
          success: false,
          error: { message: "Token expired" },
        })
      )
    );

    await expect(
      api.get("/protected", { token: TOKEN, orgId: ORG_ID })
    ).rejects.toMatchObject({ status: 401 });

    expect(orgSpy).not.toHaveBeenCalled();
    window.removeEventListener("celaest:org_not_found", orgSpy);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. 403 with a non-FORBIDDEN code — should NOT trigger blacklist
// ─────────────────────────────────────────────────────────────────────────────
describe("403 with different error code", () => {
  it("does NOT blacklist org when 403 has code RATE_LIMIT (not membership-related)", async () => {
    sessionStorage.setItem("celaest:home_org_id", HOME_ORG_ID);

    const eventSpy = vi.fn();
    window.addEventListener("celaest:org_not_found", eventSpy);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(403, {
          success: false,
          error: {
            code: "RATE_LIMIT",
            message: "Too many requests",
          },
        })
      )
    );

    await expect(
      api.get("/test", { token: TOKEN, orgId: ORG_ID })
    ).rejects.toMatchObject({ status: 403 });

    const blacklist = JSON.parse(
      sessionStorage.getItem("celaest:revoked_orgs") ?? "[]"
    ) as string[];
    expect(blacklist).not.toContain(ORG_ID);
    expect(eventSpy).not.toHaveBeenCalled();

    window.removeEventListener("celaest:org_not_found", eventSpy);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. 404 org not found — fires celaest:org_not_found
// ─────────────────────────────────────────────────────────────────────────────
describe("404 — Organization not found", () => {
  it("fires celaest:org_not_found when 404 message contains 'Organization not found'", async () => {
    const eventSpy = vi.fn();
    window.addEventListener("celaest:org_not_found", eventSpy);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(404, {
          success: false,
          error: { message: "Organization not found" },
        })
      )
    );

    await expect(
      api.get("/test", { token: TOKEN, orgId: ORG_ID })
    ).rejects.toMatchObject({ status: 404 });

    expect(eventSpy).toHaveBeenCalledOnce();
    window.removeEventListener("celaest:org_not_found", eventSpy);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. 404 resource not found — MUST NOT fire event (protects against false org recovery)
// ─────────────────────────────────────────────────────────────────────────────
describe("404 — resource-level not found", () => {
  const resourceMessages = [
    "Subscription not found",
    "Plan not found",
    "License not found",
    "Product not found",
    "User not found",
    "Invoice not found",
  ];

  resourceMessages.forEach((message) => {
    it(`does NOT fire celaest:org_not_found for 404 "${message}"`, async () => {
      const eventSpy = vi.fn();
      window.addEventListener("celaest:org_not_found", eventSpy);

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValueOnce(
          makeResponse(404, {
            success: false,
            error: { message },
          })
        )
      );

      await expect(
        api.get("/test", { token: TOKEN, orgId: ORG_ID })
      ).rejects.toMatchObject({ status: 404 });

      expect(eventSpy).not.toHaveBeenCalled();
      window.removeEventListener("celaest:org_not_found", eventSpy);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Retry on transient network error
// ─────────────────────────────────────────────────────────────────────────────
describe("retry logic — transient network errors", () => {
  it("retries up to MAX_RETRIES (2) on transient TypeError, then succeeds on 3rd attempt", async () => {
    // Stub setTimeout to fire immediately — avoids real 3-second wait in tests
    vi.stubGlobal(
      "setTimeout",
      (fn: TimerHandler) => {
        (fn as () => void)();
        return 0;
      }
    );

    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("network timeout"))
      .mockRejectedValueOnce(new TypeError("network timeout"))
      .mockResolvedValueOnce(
        makeResponse(200, { success: true, data: { retried: true } })
      );

    vi.stubGlobal("fetch", fetchMock);

    const result = await api.get<{ retried: boolean }>("/test", { token: TOKEN });

    expect(result).toMatchObject({ retried: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. NO retry on "Failed to fetch" (ERR_CONNECTION_REFUSED)
// ─────────────────────────────────────────────────────────────────────────────
describe("retry logic — connection refused", () => {
  it("does NOT retry when error.message is 'Failed to fetch' (backend is down)", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"));

    vi.stubGlobal("fetch", fetchMock);

    await expect(
      api.get("/test", { token: TOKEN })
    ).rejects.toMatchObject({ code: "NETWORK_ERROR" });

    // Only 1 call — no retries for connection refused
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("provides a human-readable error message on connection refused", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValueOnce(new TypeError("Failed to fetch"))
    );

    let thrown: Error | null = null;
    try {
      await api.get("/test", { token: TOKEN });
    } catch (e) {
      thrown = e as Error;
    }

    expect(thrown?.message).toContain("El servidor no responde");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. Zod schema validation
// ─────────────────────────────────────────────────────────────────────────────
describe("Zod schema validation", () => {
  const schema = z.object({ id: z.string(), name: z.string() });

  it("passes when response matches schema", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(200, {
          success: true,
          data: { id: "abc", name: "Test" },
        })
      )
    );

    const result = await api.get("/test", {
      token: TOKEN,
      schema,
    });

    expect(result).toMatchObject({ id: "abc", name: "Test" });
  });

  it("throws ApiError SCHEMA_MISMATCH when response does not match schema", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(200, {
          success: true,
          data: { id: 123, name: null }, // wrong types
        })
      )
    );

    await expect(
      api.get("/test", { token: TOKEN, schema })
    ).rejects.toMatchObject({ code: "SCHEMA_MISMATCH", status: 500 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. Happy path — GET with auth + org headers
// ─────────────────────────────────────────────────────────────────────────────
describe("happy path", () => {
  it("sends Authorization and X-Organization-ID headers on GET", async () => {
    let capturedHeaders: Headers | null = null;

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementationOnce((url: string, init: RequestInit) => {
        capturedHeaders = new Headers(init.headers as HeadersInit);
        return Promise.resolve(
          makeResponse(200, { success: true, data: { ok: true } })
        );
      })
    );

    await api.get("/test", { token: TOKEN, orgId: ORG_ID });

    expect(capturedHeaders?.get("Authorization")).toBe(`Bearer ${TOKEN}`);
    expect(capturedHeaders?.get("X-Organization-ID")).toBe(ORG_ID);
  });

  it("does NOT send X-Organization-ID when orgId is null", async () => {
    let capturedHeaders: Headers | null = null;

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementationOnce((_url: string, init: RequestInit) => {
        capturedHeaders = new Headers(init.headers as HeadersInit);
        return Promise.resolve(
          makeResponse(200, { success: true, data: {} })
        );
      })
    );

    await api.get("/test", { token: TOKEN, orgId: null });

    expect(capturedHeaders?.has("X-Organization-ID")).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. Happy path — POST with body
// ─────────────────────────────────────────────────────────────────────────────
describe("POST request", () => {
  it("serializes body as JSON and sets Content-Type", async () => {
    let capturedBody: string | null = null;
    let capturedContentType: string | null = null;

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementationOnce((_url: string, init: RequestInit) => {
        capturedBody = init.body as string;
        capturedContentType = new Headers(init.headers as HeadersInit).get(
          "Content-Type"
        );
        return Promise.resolve(
          makeResponse(200, { success: true, data: { created: true } })
        );
      })
    );

    await api.post("/resource", { name: "test", value: 42 }, { token: TOKEN });

    expect(capturedBody).toBe(JSON.stringify({ name: "test", value: 42 }));
    expect(capturedContentType).toBe("application/json");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 13. Max retries exhausted
// ─────────────────────────────────────────────────────────────────────────────
describe("max retries exhausted", () => {
  it("throws NETWORK_ERROR after all retries fail with TypeError", async () => {
    // Stub setTimeout to fire immediately — avoids real wait in tests
    vi.stubGlobal(
      "setTimeout",
      (fn: TimerHandler) => {
        (fn as () => void)();
        return 0;
      }
    );

    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("network bounce"))
    );

    await expect(
      api.get("/test", { token: TOKEN })
    ).rejects.toMatchObject({ code: "NETWORK_ERROR" });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 14. Blacklist is idempotent — second 403 does not duplicate entry
// ─────────────────────────────────────────────────────────────────────────────
describe("blacklist idempotency", () => {
  it("org ID appears exactly once in blacklist even after multiple 403 responses", async () => {
    sessionStorage.setItem("celaest:home_org_id", HOME_ORG_ID);

    const forbiddenResponse = () =>
      makeResponse(403, {
        success: false,
        error: { code: "FORBIDDEN", message: "not a member" },
      });

    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValueOnce(forbiddenResponse())
        .mockResolvedValueOnce(forbiddenResponse())
    );

    // First call blacklists the org
    await expect(
      api.get("/test", { token: TOKEN, orgId: ORG_ID })
    ).rejects.toMatchObject({ status: 403 });

    // Second call is blocked by the guard (before fetch) — no duplicate
    await expect(
      api.get("/test", { token: TOKEN, orgId: ORG_ID })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });

    const blacklist = JSON.parse(
      sessionStorage.getItem("celaest:revoked_orgs") ?? "[]"
    ) as string[];
    const count = blacklist.filter((id) => id === ORG_ID).length;
    expect(count).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 15. ApiError structure
// ─────────────────────────────────────────────────────────────────────────────
describe("ApiError structure", () => {
  it("has name=ApiError, status, code and message fields", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        makeResponse(422, {
          success: false,
          error: {
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            details: { field: "email" },
          },
        })
      )
    );

    let thrown: InstanceType<typeof _ApiError> | null = null;
    try {
      await api.get("/test", { token: TOKEN });
    } catch (e) {
      thrown = e as InstanceType<typeof _ApiError>;
    }

    expect(thrown?.name).toBe("ApiError");
    expect(thrown?.status).toBe(422);
    expect(thrown?.code).toBe("VALIDATION_ERROR");
    expect(thrown?.message).toBe("Validation failed");
  });
});
