import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

const mockGetSession = vi.fn();
const mockRefreshSession = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseBrowserClient: () => ({
    auth: {
      getSession: mockGetSession,
      refreshSession: mockRefreshSession,
    },
  }),
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), log: vi.fn(), debug: vi.fn() },
}));

import api from "../api-client";

function makeJwt(expOffsetSec: number, sub = "u-1"): string {
  const h = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const p = btoa(
    JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + expOffsetSec }),
  );
  return `${h}.${p}.sig`;
}

describe("api-client 401 single-flight session refresh", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().reset();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("refreshes Supabase session once on 401 and retries successfully without logging out", async () => {
    const expiredJwt = makeJwt(60); // still valid by 5s buffer so hits backend and gets 401
    const freshJwt = makeJwt(7200);

    const user = {
      id: "u-1",
      email: "user@celaest.com",
      name: "User",
      role: "member" as const,
      permissions: [],
      emailVerified: true,
      createdAt: "2026-01-01",
    };
    useAuthStore.getState().setAuth({
      user,
      session: { user, accessToken: expiredJwt, expiresAt: Math.floor(Date.now() / 1000) + 60 },
    });

    mockGetSession.mockResolvedValue({
      data: { session: { access_token: expiredJwt, refresh_token: "rt-1", user } },
      error: null,
    });
    mockRefreshSession.mockResolvedValue({
      data: { session: { access_token: freshJwt, refresh_token: "rt-2", user } },
      error: null,
    });

    const unauthSpy = vi.fn();
    window.addEventListener("celaest:unauthorized", unauthSpy);

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: false, error: { message: "Expired" } }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, data: { ok: true } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    try {
      const result = await api.get<{ ok: boolean }>("/api/v1/user/me", {
        token: expiredJwt,
      });

      expect(result).toEqual({ ok: true });
      expect(mockRefreshSession).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledTimes(2);
      const retryHeaders = fetchSpy.mock.calls[1]?.[1]?.headers as Record<string, string>;
      expect(retryHeaders.Authorization).toBe(`Bearer ${freshJwt}`);
      expect(useAuthStore.getState().session?.accessToken).toBe(freshJwt);
      expect(unauthSpy).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("celaest:unauthorized", unauthSpy);
    }
  });

  it("coalesces concurrent 401s into a single refreshSession() call (single-flight)", async () => {
    const staleJwt = makeJwt(60);
    const freshJwt = makeJwt(7200);
    const user = {
      id: "u-1",
      email: "user@celaest.com",
      name: "User",
      role: "member" as const,
      permissions: [],
      emailVerified: true,
      createdAt: "2026-01-01",
    };
    useAuthStore.getState().setAuth({
      user,
      session: { user, accessToken: staleJwt, expiresAt: Math.floor(Date.now() / 1000) + 60 },
    });

    mockGetSession.mockResolvedValue({
      data: { session: { access_token: staleJwt, refresh_token: "rt-1", user } },
      error: null,
    });
    mockRefreshSession.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: { session: { access_token: freshJwt, refresh_token: "rt-2", user } },
                error: null,
              }),
            20,
          ),
        ),
    );

    vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, init) => {
      const auth = (init?.headers as Record<string, string>)?.Authorization;
      if (auth === `Bearer ${freshJwt}`) {
        return new Response(JSON.stringify({ success: true, data: { ok: true } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ success: false, error: { message: "Expired" } }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    });

    const results = await Promise.all([
      api.get<{ ok: boolean }>("/api/v1/user/me", { token: staleJwt }),
      api.get<{ ok: boolean }>("/api/v1/organizations", { token: staleJwt }),
      api.get<{ ok: boolean }>("/api/v1/billing", { token: staleJwt }),
    ]);

    expect(results).toEqual([{ ok: true }, { ok: true }, { ok: true }]);
    expect(mockRefreshSession).toHaveBeenCalledTimes(1);
  });

  it("does NOT trigger celaest:unauthorized on transient network failure during refresh", async () => {
    const staleJwt = makeJwt(60);
    const user = {
      id: "u-1",
      email: "user@celaest.com",
      name: "User",
      role: "member" as const,
      permissions: [],
      emailVerified: true,
      createdAt: "2026-01-01",
    };
    useAuthStore.getState().setAuth({
      user,
      session: { user, accessToken: staleJwt, expiresAt: Math.floor(Date.now() / 1000) + 60 },
    });

    mockGetSession.mockResolvedValue({
      data: { session: { access_token: staleJwt, refresh_token: "rt-1", user } },
      error: null,
    });
    mockRefreshSession.mockRejectedValue(new TypeError("Failed to fetch"));

    const unauthSpy = vi.fn();
    window.addEventListener("celaest:unauthorized", unauthSpy);

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, error: { message: "Unauthorized" } }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );

    try {
      await expect(
        api.get("/api/v1/user/me", { token: staleJwt }),
      ).rejects.toThrow();
      expect(unauthSpy).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("celaest:unauthorized", unauthSpy);
    }
  });

  it("triggers celaest:unauthorized when session is genuinely unrecoverable", async () => {
    const staleJwt = makeJwt(60);
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });

    const unauthSpy = vi.fn();
    window.addEventListener("celaest:unauthorized", unauthSpy);

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, error: { message: "Revoked" } }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );

    try {
      await expect(
        api.get("/api/v1/user/me", { token: staleJwt }),
      ).rejects.toThrow();
      expect(unauthSpy).toHaveBeenCalledTimes(1);
    } finally {
      window.removeEventListener("celaest:unauthorized", unauthSpy);
    }
  });
});
