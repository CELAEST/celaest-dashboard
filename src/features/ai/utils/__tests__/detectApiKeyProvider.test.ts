import { describe, it, expect } from "vitest";
import { detectApiKeyPrefix } from "../detectApiKeyProvider";

describe("detectApiKeyPrefix", () => {
  it("detects Groq keys accurately", () => {
    const match = detectApiKeyPrefix(
      "gsk_synthetic_groq_test_key_000001",
    );
    expect(match.confident).toBe(true);
    expect(match.provider).toBe("groq");
    expect(match.defaultRpm).toBe(30);
    expect(match.suggestedName).toBe("Groq LPU (gsk_synt)");
  });

  it("detects Gemini, Anthropic, Grok, OpenRouter, OpenAI project keys", () => {
    expect(detectApiKeyPrefix("AIzaSyABC123").provider).toBe("gemini");
    expect(detectApiKeyPrefix("sk-ant-api03-123").provider).toBe("anthropic");
    expect(detectApiKeyPrefix("xai-123456").provider).toBe("grok");
    expect(detectApiKeyPrefix("sk-or-v1-123456").provider).toBe("openrouter");
    expect(detectApiKeyPrefix("sk-proj-123456").provider).toBe("openai");
  });

  it("marks generic sk- keys as ambiguous so live upstream probe disambiguates them", () => {
    const match = detectApiKeyPrefix("sk-1234567890abcdef");
    expect(match.confident).toBe(false);
    expect(match.ambiguous).toBe(true);
    expect(match.provider).toBeUndefined();
  });
});
