"use client";

import { useGeoPricing } from "../providers/GeoPricingProvider";
import { formatCurrency } from "@/lib/utils";
import type { ResolvedPricingContext } from "../types";

/**
 * Discriminated price view returned by `useLocalPlanPrice`. `formatted` is
 * the display-ready string in the user's local currency when geo-pricing is
 * available, otherwise it falls back to the plan's native currency.
 */
export interface LocalPlanPriceView {
  /** Numeric value to charge in the resolved currency. */
  value: number;
  /** ISO currency code that `value` is denominated in. */
  currency: string;
  /** Display-ready price string (e.g. "COP 41.480"). */
  formatted: string;
  /** True when there is no real cost (e.g. free tier). */
  isFree: boolean;
}

export interface UseLocalPlanPriceResult {
  monthly: LocalPlanPriceView;
  yearly: LocalPlanPriceView;
  /** True when the resolver returned a plan-specific localized price. */
  isGeoPriced: boolean;
  format: (value: number) => string;
}

export interface PlanPricingInput {
  id: string;
  price_monthly?: number | null;
  price_yearly?: number | null;
  currency?: string | null;
}

/**
 * Single source of truth for displaying subscription plan prices in the
 * user's local currency. Centralizes the "find geo plan, pick local price,
 * pick currency, pick formatter" logic that was duplicated across
 * `SubscriptionManager`, `LicensesList`, `PlanCard` and
 * `useManageSubscription`. Following DRY + SOLID, every consumer depends on
 * this hook (and the `useGeoPricing` provider) instead of replicating the
 * lookup-and-format dance.
 *
 * Behavior:
 * - If the resolver has a matching `ResolvedPlanPricing` for `plan.id`, the
 *   localized monthly/yearly prices are returned and formatted with the
 *   local currency code (via the provider's `formatPrice`).
 * - Otherwise, the plan's `price_monthly`/`price_yearly` are returned with
 *   the plan's native currency, formatted via `formatCurrency`.
 * - Pass `null`/`undefined` to get a stable zero-priced view; callers don't
 *   need to guard the hook call against missing data.
 */
export function useLocalPlanPrice(
  plan: PlanPricingInput | null | undefined,
): UseLocalPlanPriceResult {
  const { getPrice } = useLocalPlanPricing();
  return getPrice(plan);
}

export function useLocalPlanPricing() {
  const { pricing, formatPrice } = useGeoPricing();

  const getPrice = (
    plan: PlanPricingInput | null | undefined,
  ): UseLocalPlanPriceResult => {
    const geoPlan = plan ? pricing?.plans.find((p) => p.plan_id === plan.id) : undefined;
    const isGeoPriced = !!geoPlan;

    const rawMonthly = Number(plan?.price_monthly) || 0;
    const rawYearly = Number(plan?.price_yearly) || 0;

    const localMonthly = geoPlan?.local_price_monthly ?? rawMonthly;
    const localYearly = geoPlan?.local_price_yearly ?? rawYearly;
    const currency = geoPlan?.currency_code || plan?.currency || "USD";

    const format = (value: number): string =>
      isGeoPriced ? formatPrice(value) : formatCurrency(value, currency);

    const buildView = (value: number): LocalPlanPriceView => ({
      value,
      currency,
      formatted: format(value),
      isFree: value === 0,
    });

    return {
      monthly: buildView(localMonthly),
      yearly: buildView(localYearly),
      isGeoPriced,
      format,
    };
  };

  return {
    pricing: pricing as ResolvedPricingContext | null,
    getPrice,
  };
}
