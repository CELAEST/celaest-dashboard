import { logger } from "@/lib/logger";
import { parseRole, calculateEffectivePermissions } from "./permissions";
import { useAuthStore } from "../stores/useAuthStore";
import type { AuthSession, AuthUser } from "./types";

export type SessionRecoveryResult =
  | { status: "recovered"; accessToken: string }
  | { status: "transient_error"; error?: string }
  | { status: "expired" };

const getBackendBaseUrl = (): string => {
  const envUrl =
    process.env.NEXT_PUBLIC_CELAEST_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "http://127.0.0.1:3101";
};

function decodeJwtExpSeconds(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2 || !parts[1]) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;

    let jsonStr: string;
    if (typeof atob === "function") {
      jsonStr = decodeURIComponent(
        Array.prototype.map
          .call(atob(padded), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
    } else if (typeof Buffer !== "undefined") {
      jsonStr = Buffer.from(padded, "base64").toString("utf-8");
    } else {
      return null;
    }

    const payload = JSON.parse(jsonStr) as { exp?: unknown };
    return typeof payload?.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/**
 * Returns true ONLY when the token is a structured JWT whose `exp` is within
 * `bufferSeconds` of expiration (or already in the past). Non-JWT tokens return false.
 */
export function isJwtNearOrPastExpiry(
  token: string | null | undefined,
  bufferSeconds = 5,
): boolean {
  if (!token) return false;
  const exp = decodeJwtExpSeconds(token);
  if (exp === null) return false;
  return Date.now() >= (exp - bufferSeconds) * 1000;
}

function isTransientAuthError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { status?: number; message?: string; name?: string };
  if (typeof e.status === "number") {
    if (e.status >= 500 || e.status === 0 || e.status === 429) return true;
    if (e.status >= 400 && e.status < 500) return false;
  }
  const msg = (e.message || "").toLowerCase();
  return (
    msg.includes("fetch") ||
    msg.includes("network") ||
    msg.includes("timeout") ||
    msg.includes("abort") ||
    msg.includes("load failed")
  );
}

function resolveUpdatedUser(
  sbUser: {
    id: string;
    email?: string | null;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
    email_confirmed_at?: string | null;
    created_at?: string;
    last_sign_in_at?: string | null;
  } | null | undefined,
): AuthUser | null {
  const existingUser = useAuthStore.getState().user;
  if (!sbUser) return existingUser;
  if (existingUser && existingUser.id === sbUser.id) {
    return existingUser;
  }
  const metaRole =
    (sbUser.user_metadata?.role as string | undefined) ||
    (sbUser.app_metadata?.role as string | undefined);
  const role = parseRole(metaRole);
  const email = sbUser.email || existingUser?.email || "";
  return {
    id: sbUser.id,
    email,
    name:
      (sbUser.user_metadata?.name as string | undefined) ||
      (sbUser.user_metadata?.full_name as string | undefined) ||
      email.split("@")[0] ||
      "User",
    avatarUrl: sbUser.user_metadata?.avatar_url as string | undefined,
    role,
    permissions: calculateEffectivePermissions(role),
    emailVerified: Boolean(sbUser.email_confirmed_at),
    createdAt: sbUser.created_at || new Date().toISOString(),
    lastSignInAt: sbUser.last_sign_in_at || undefined,
  };
}

function syncStoreWithToken(params: {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  user?: AuthUser | null;
}): void {
  const store = useAuthStore.getState();
  const user = params.user ?? store.user;
  if (!user) return;
  const decodedExp = decodeJwtExpSeconds(params.accessToken);
  const expiresAt =
    params.expiresAt ||
    decodedExp ||
    Math.floor(Date.now() / 1000) + 3600;
  const session: AuthSession = {
    user,
    accessToken: params.accessToken,
    refreshToken: params.refreshToken ?? store.session?.refreshToken,
    expiresAt,
  };
  store.setAuth({ user, session });
}

let inFlightRecovery: Promise<SessionRecoveryResult> | null = null;

async function performRecovery(
  failedToken?: string | null,
): Promise<SessionRecoveryResult> {
  try {
    // 1. Check Zustand store first (in case another call or background timer already rotated)
    const storeState = useAuthStore.getState();
    const storeToken = storeState.session?.accessToken;
    if (
      storeToken &&
      storeToken !== failedToken &&
      !isJwtNearOrPastExpiry(storeToken, 5)
    ) {
      return { status: "recovered", accessToken: storeToken };
    }

    // 2. Check Supabase browser client session before forcing refresh
    let sbSession: {
      access_token?: string;
      refresh_token?: string;
      expires_at?: number;
      user?: Parameters<typeof resolveUpdatedUser>[0];
    } | null = null;
    try {
      const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = getSupabaseBrowserClient();
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError && isTransientAuthError(sessionError)) {
        return { status: "transient_error", error: sessionError.message };
      }

      sbSession = sessionData?.session ?? null;
      if (
        sbSession?.access_token &&
        sbSession.access_token !== failedToken &&
        !isJwtNearOrPastExpiry(sbSession.access_token, 5)
      ) {
        const user = resolveUpdatedUser(sbSession.user);
        syncStoreWithToken({
          accessToken: sbSession.access_token,
          refreshToken: sbSession.refresh_token,
          expiresAt: sbSession.expires_at,
          user,
        });
        return { status: "recovered", accessToken: sbSession.access_token };
      }

      // 3. Refresh via Supabase if Supabase owns a session/refresh token
      if (sbSession) {
        const { data: refreshedData, error: refreshError } =
          await supabase.auth.refreshSession();
        if (refreshedData?.session?.access_token) {
          const refreshed = refreshedData.session;
          const user = resolveUpdatedUser(refreshed.user);
          syncStoreWithToken({
            accessToken: refreshed.access_token,
            refreshToken: refreshed.refresh_token,
            expiresAt: refreshed.expires_at,
            user,
          });
          logger.log(
            "[sessionRefresh] Supabase session refreshed successfully after 401",
          );
          return {
            status: "recovered",
            accessToken: refreshed.access_token,
          };
        }
        if (refreshError && isTransientAuthError(refreshError)) {
          return { status: "transient_error", error: refreshError.message };
        }
      }
    } catch (sbErr) {
      if (isTransientAuthError(sbErr)) {
        return {
          status: "transient_error",
          error: sbErr instanceof Error ? sbErr.message : "Network error",
        };
      }
    }

    // 4. Fallback for OTP / custom HS256 backend-issued sessions in Zustand store
    const storedRefreshToken =
      storeState.session?.refreshToken ||
      (storeState.session?.accessToken
        ? `sso:${storeState.session.accessToken}`
        : undefined);
    if (storedRefreshToken) {
      const res = await fetch(`${getBackendBaseUrl()}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: storedRefreshToken }),
      });

      if (res.status >= 500) {
        return {
          status: "transient_error",
          error: `Auth refresh server error (${res.status})`,
        };
      }

      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        data?: {
          access_token?: string;
          refresh_token?: string;
          expires_in?: number;
        };
      };

      if (res.ok && json?.success && json?.data?.access_token) {
        const expiresAt = json.data.expires_in
          ? Math.floor(Date.now() / 1000) + json.data.expires_in
          : undefined;
        syncStoreWithToken({
          accessToken: json.data.access_token,
          refreshToken: json.data.refresh_token || storedRefreshToken,
          expiresAt,
        });
        logger.log(
          "[sessionRefresh] Backend OTP session refreshed successfully after 401",
        );
        return { status: "recovered", accessToken: json.data.access_token };
      }
    }

    return { status: "expired" };
  } catch (err) {
    if (isTransientAuthError(err)) {
      return {
        status: "transient_error",
        error: err instanceof Error ? err.message : "Network error",
      };
    }
    return { status: "expired" };
  }
}

/**
 * Single-flight session recovery for api-client 401 handling.
 * Prevents concurrent failed requests from racing single-use refresh tokens
 * and avoids spurious logouts on transient network hiccups.
 */
export function recoverDashboardSession(
  failedToken?: string | null,
): Promise<SessionRecoveryResult> {
  if (inFlightRecovery) {
    return inFlightRecovery;
  }
  const promise = performRecovery(failedToken).finally(() => {
    if (inFlightRecovery === promise) {
      inFlightRecovery = null;
    }
  });
  inFlightRecovery = promise;
  return promise;
}
