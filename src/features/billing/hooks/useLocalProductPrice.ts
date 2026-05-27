"use client";

import { useGeoPricing } from "../providers/GeoPricingProvider";
import { formatCurrency } from "@/lib/utils";

/**
 * useLocalProductPrice formats a USD-denominated product base price using the
 * resolved geo-pricing for the current user. This centralizes the
 * "multiply by exchange_rate, then format with the local currency" logic that
 * was previously duplicated across product cards, modals and asset views.
 *
 * Returns:
 * - `format(usdPrice)`: returns the localized price string (e.g. "COP 41.480").
 *   Falls back to USD formatting when geo-pricing is unavailable.
 * - `localize(usdPrice)`: returns the raw localized number (no formatting).
 * - `isGeoPriced`: true when the user is in a non-US country with a configured
 *   exchange rate. Useful for conditionally rendering original-vs-discounted
 *   prices.
 */
export function useLocalProductPrice() {
  const { pricing, formatPrice } = useGeoPricing();
  const isGeoPriced = !!(
    pricing &&
    pricing.country_code &&
    pricing.country_code !== "US"
  );
  const exchangeRate = pricing?.exchange_rate ?? 1;

  const localize = (usdPrice: number): number =>
    isGeoPriced ? usdPrice * exchangeRate : usdPrice;

  const format = (usdPrice: number, fallbackCurrency = "USD"): string =>
    isGeoPriced
      ? formatPrice(localize(usdPrice))
      : formatCurrency(usdPrice, fallbackCurrency);

  return { isGeoPriced, exchangeRate, localize, format, formatPrice };
}
