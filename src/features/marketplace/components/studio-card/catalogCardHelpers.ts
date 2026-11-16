import type { ResolvedPricingContext } from "@/features/billing/types";
import type { ActiveCoupon } from "../../store";
import type { MarketplaceProduct } from "../../types";

export interface StudioCapabilityStep {
  num: string;
  name: string;
  tag: string;
  detail: string;
}

export interface StudioPriceLabels {
  freeLabel: string;
  monthUnit: (currency: string) => string;
  monthShort: string;
  onetimeUnit: (currency: string) => string;
  onetimeShort: string;
}

export interface StudioPriceState {
  isGeoPriced: boolean;
  isFree: boolean;
  hasDiscount: boolean;
  originalPriceText?: string;
  discountBadgeText?: string;
  priceValueText: string;
  priceUnitText: string;
  isCompactValue: boolean;
}

/**
 * Formats non-geo USD / fallback currency cleanly (e.g. "$24", "$24.99")
 * without duplicating currency codes next to the unit badge.
 */
export function formatCompactAmount(amount: number, currency: string = "USD"): string {
  const hasDecimals = Math.abs(amount % 1) > 0.001;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Resolves thumbnail respecting backend URL first, falling back to bespoke
 * local Subtle Violet studio art only for matching brand products with no image.
 */
export function resolveStudioThumbnail(product: Pick<MarketplaceProduct, "thumbnail_url" | "slug" | "name">): string | null {
  const raw = product.thumbnail_url?.trim();
  if (raw) return raw;
  const hay = `${product.slug ?? ""} ${product.name ?? ""}`.toLowerCase();
  if (hay.includes("lingua")) {
    return "/images/marketplace/studio-lingua-violet.webp";
  }
  return null;
}

/** Maps min_plan_tier into localized plan badge label. */
export function resolveTierBadgeLabel(
  minPlanTier: number,
  effectiveAccess: "owned" | "plan" | "none",
  labels: {
    starterPlus: string;
    proTier: string;
    enterprise: string;
    includedPrefix: (tier: string) => string;
    activeLicense: string;
  },
): string {
  const tierName =
    minPlanTier >= 3
      ? labels.enterprise
      : minPlanTier === 2
        ? labels.proTier
        : labels.starterPlus;

  if (effectiveAccess === "plan") {
    return labels.includedPrefix(tierName);
  }
  if (effectiveAccess === "owned") {
    return labels.activeLicense;
  }
  return tierName;
}

/** Computes clean pricing display values across geo-pricing, coupons, free plans, and SaaS vs one-time billing. */
export function resolveCardPricingState({
  product,
  pricing,
  formatPrice,
  activeCoupon,
  isSaas,
  labels,
}: {
  product: Pick<MarketplaceProduct, "base_price" | "currency">;
  pricing: ResolvedPricingContext | null;
  formatPrice: (amount: number, forceCurrency?: string) => string;
  activeCoupon: ActiveCoupon | null;
  isSaas: boolean;
  labels: StudioPriceLabels;
}): StudioPriceState {
  const currency = product.currency || "USD";
  const isGeoPriced = Boolean(pricing && pricing.country_code && pricing.country_code !== "US");
  const exchangeRate = pricing?.exchange_rate ?? 1;
  const pppFactor = pricing?.ppp_factor ?? 1;
  const isZeroDecimal = pricing?.currency?.is_zero_decimal ?? false;
  const roundLocal = (v: number) =>
    isZeroDecimal ? Math.round(v) : Math.round(v * 100) / 100;
  const localBasePrice = isGeoPriced
    ? roundLocal(product.base_price * pppFactor * exchangeRate)
    : product.base_price;

  let finalPrice = localBasePrice;
  if (activeCoupon) {
    if (activeCoupon.type === "percentage") {
      finalPrice = isGeoPriced
        ? roundLocal(localBasePrice * (1 - activeCoupon.value / 100))
        : localBasePrice * (1 - activeCoupon.value / 100);
    } else if (activeCoupon.type === "fixed_amount") {
      const localDiscount = isGeoPriced
        ? roundLocal(activeCoupon.value * pppFactor * exchangeRate)
        : activeCoupon.value;
      finalPrice = Math.max(0, localBasePrice - localDiscount);
    }
  }

  const isFree = product.base_price === 0 || finalPrice <= 0;
  const hasDiscount = Boolean(activeCoupon && product.base_price > 0 && finalPrice < localBasePrice);

  const formattedOriginal = isGeoPriced
    ? formatPrice(localBasePrice)
    : formatCompactAmount(product.base_price, currency);

  const formattedFinal = isGeoPriced
    ? formatPrice(finalPrice)
    : formatCompactAmount(finalPrice, currency);

  const discountBadgeText = activeCoupon
    ? activeCoupon.type === "percentage"
      ? `-${activeCoupon.value}%`
      : `-${
          isGeoPriced
            ? formatPrice(activeCoupon.value * exchangeRate)
            : formatCompactAmount(activeCoupon.value, currency)
        }`
    : undefined;

  const priceValueText = isFree ? labels.freeLabel : formattedFinal;

  let priceUnitText = "";
  if (!isFree) {
    if (isGeoPriced) {
      priceUnitText = isSaas ? labels.monthShort : labels.onetimeShort;
    } else {
      priceUnitText = isSaas ? labels.monthUnit(currency) : labels.onetimeUnit(currency);
    }
  }

  return {
    isGeoPriced,
    isFree,
    hasDiscount,
    originalPriceText: hasDiscount ? formattedOriginal : undefined,
    discountBadgeText: hasDiscount ? discountBadgeText : undefined,
    priceValueText,
    priceUnitText,
    isCompactValue: priceValueText.length > 6,
  };
}

const STACK_STOPWORDS = new Set(["de", "del", "la", "el", "los", "las", "y", "con", "en", "a", "of", "for", "and"]);

/** Formats technical stack labels at word boundaries so badges never clip mid-word. */
function formatStepStackTag(raw: unknown, fallbackTag: string): string {
  if (!raw) return fallbackTag;
  const normalized = String(raw).trim().toUpperCase();
  if (!normalized) return fallbackTag;
  if (normalized.length <= 12) return normalized;

  const words = normalized.split(/\s+/).filter((w) => !STACK_STOPWORDS.has(w.toLowerCase()));
  if (words.length === 0) return fallbackTag;

  let acc = "";
  for (const w of words) {
    const candidate = acc ? `${acc} ${w}` : w;
    if (candidate.length <= 12) {
      acc = candidate;
    } else if (!acc) {
      return w.slice(0, 12);
    } else {
      break;
    }
  }
  return acc || fallbackTag;
}

/**
 * Extracts 3 interactive capability rows from backend `features` / `tags` / defaults
 * cleanly so all live cards align rhythmically with upcoming studio cards.
 */
export function parseProductCapabilities(
  product: Pick<MarketplaceProduct, "features" | "tags" | "technical_stack">,
  defaults: [string, string, string],
  fallbackTag: string,
): StudioCapabilityStep[] {
  let rawItems: string[] = [];
  if (Array.isArray(product.features) && product.features.length > 0) {
    rawItems = product.features.slice(0, 3).map(String);
  } else if (typeof product.features === "string" && (product.features as string).trim()) {
    rawItems = (product.features as string)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  } else if (Array.isArray(product.tags) && product.tags.length > 0) {
    rawItems = product.tags.slice(0, 3).map(String);
  } else {
    rawItems = [...defaults];
  }

  const stack = Array.isArray(product.technical_stack) ? product.technical_stack : [];

  return rawItems.map((entry, idx) => {
    const clean = entry.trim();
    const splitMatch =
      clean.match(/^([^:]{3,48}):\s*(.+)$/) ??
      clean.match(/^(.{3,48}?)\s+[—–-]\s+(.+)$/);
    const fullStack = stack[idx] ? String(stack[idx]).trim() : "";
    const stackTag = formatStepStackTag(fullStack, fallbackTag);

    if (splitMatch) {
      return {
        num: `0${idx + 1}`,
        name: splitMatch[1].trim(),
        tag: stackTag,
        detail: splitMatch[2].trim(),
      };
    }

    const contextualDetail =
      fullStack && !clean.toLowerCase().includes(fullStack.toLowerCase())
        ? `${clean} · ${fullStack}`
        : clean;

    return {
      num: `0${idx + 1}`,
      name: clean,
      tag: stackTag,
      detail: contextualDetail,
    };
  });
}
