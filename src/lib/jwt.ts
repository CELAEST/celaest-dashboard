/**
 * Lightweight JWT decoding utility.
 * No dependencies required.
 */

export interface DecodedJWT {
  sub: string;
  email: string;
  role: string;
  session_id?: string;
  exp: number;
  iat: number;
  [key: string]: unknown;
}

export function decodeJWT(token: string): DecodedJWT | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}
