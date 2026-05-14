/**
 * Production-grade tests for utils/authIntent.
 *
 * Coverage:
 *   1. setAuthIntent persists payload in sessionStorage
 *   2. consumeAuthIntent returns null when nothing is stored
 *   3. consumeAuthIntent returns the intent and removes it (one-shot)
 *   4. consumeAuthIntent ignores corrupted JSON instead of throwing
 *   5. consumeAuthIntent ignores payloads without productId
 *   6. clearAuthIntent removes the entry without consuming
 *   7. Helpers are safe when sessionStorage throws (private mode / quota)
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  setAuthIntent,
  consumeAuthIntent,
  clearAuthIntent,
} from "@/features/marketplace/utils/authIntent";

const STORAGE_KEY = "marketplace_pending_intent";

describe("authIntent", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("setAuthIntent persists the payload in sessionStorage", () => {
    setAuthIntent({ productId: "abc-123", tab: "reviews" });

    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual({ productId: "abc-123", tab: "reviews" });
  });

  it("consumeAuthIntent returns null when nothing is stored", () => {
    expect(consumeAuthIntent()).toBeNull();
  });

  it("consumeAuthIntent returns the intent and removes it (one-shot)", () => {
    setAuthIntent({ productId: "abc-123", tab: "overview" });

    const first = consumeAuthIntent();
    expect(first).toEqual({ productId: "abc-123", tab: "overview" });

    // Second consume must return null — intent is one-shot.
    expect(consumeAuthIntent()).toBeNull();
    expect(window.sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("consumeAuthIntent ignores corrupted JSON instead of throwing", () => {
    window.sessionStorage.setItem(STORAGE_KEY, "{not-json");
    expect(() => consumeAuthIntent()).not.toThrow();
    expect(consumeAuthIntent()).toBeNull();
  });

  it("consumeAuthIntent ignores payloads without productId", () => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ tab: "reviews" }));
    expect(consumeAuthIntent()).toBeNull();
  });

  it("clearAuthIntent removes the entry without returning it", () => {
    setAuthIntent({ productId: "abc-123" });
    clearAuthIntent();
    expect(window.sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("setAuthIntent does not throw if sessionStorage.setItem fails", () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

    expect(() => setAuthIntent({ productId: "abc-123" })).not.toThrow();
    expect(setItemSpy).toHaveBeenCalled();
  });

  it("consumeAuthIntent does not throw if sessionStorage.getItem fails", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    expect(() => consumeAuthIntent()).not.toThrow();
    expect(consumeAuthIntent()).toBeNull();
  });
});
