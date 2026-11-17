export type PoolProviderId =
  | "auto"
  | "gemini"
  | "groq"
  | "openai"
  | "deepseek"
  | "anthropic"
  | "grok"
  | "openrouter";

export interface PrefixDetectionMatch {
  provider?: Exclude<PoolProviderId, "auto">;
  label?: string;
  defaultRpm?: number;
  confident: boolean;
  ambiguous?: boolean;
  suggestedName?: string;
}

const PROVIDER_METADATA: Record<
  Exclude<PoolProviderId, "auto">,
  { label: string; defaultRpm: number }
> = {
  groq: { label: "Groq LPU", defaultRpm: 30 },
  gemini: { label: "Google Gemini", defaultRpm: 15 },
  deepseek: { label: "DeepSeek AI", defaultRpm: 60 },
  openai: { label: "OpenAI", defaultRpm: 60 },
  anthropic: { label: "Anthropic Claude", defaultRpm: 40 },
  grok: { label: "xAI Grok", defaultRpm: 60 },
  openrouter: { label: "OpenRouter", defaultRpm: 60 },
};

export function getPoolProviderMeta(provider: string) {
  return PROVIDER_METADATA[provider as Exclude<PoolProviderId, "auto">];
}

export function detectApiKeyPrefix(apiKey: string): PrefixDetectionMatch {
  const trimmed = apiKey.trim();
  if (!trimmed) {
    return { confident: false };
  }

  const lower = trimmed.toLowerCase();
  const safePrefix = trimmed.slice(0, 8);

  const buildMatch = (
    provider: Exclude<PoolProviderId, "auto">,
  ): PrefixDetectionMatch => {
    const meta = PROVIDER_METADATA[provider];
    return {
      provider,
      label: meta.label,
      defaultRpm: meta.defaultRpm,
      confident: true,
      suggestedName: `${meta.label} (${safePrefix})`,
    };
  };

  if (lower.startsWith("gsk_")) return buildMatch("groq");
  if (trimmed.startsWith("AIza")) return buildMatch("gemini");
  if (lower.startsWith("sk-ant-")) return buildMatch("anthropic");
  if (lower.startsWith("xai-")) return buildMatch("grok");
  if (lower.startsWith("sk-or-")) return buildMatch("openrouter");
  if (lower.startsWith("sk-proj-")) return buildMatch("openai");
  if (lower.startsWith("sk-")) {
    return { confident: false, ambiguous: true };
  }
  return { confident: false };
}
