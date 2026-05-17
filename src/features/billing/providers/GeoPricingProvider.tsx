"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ResolvedPricingContext } from "../types";
import { api } from "@/lib/api-client";

interface GeoPricingContextValue {
  pricing: ResolvedPricingContext | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  formatPrice: (amount: number, forceCurrency?: string) => string;
}

const GeoPricingContext = createContext<GeoPricingContextValue | undefined>(undefined);

export const GeoPricingProvider = ({ children }: { children: ReactNode }) => {
  const [pricing, setPricing] = useState<ResolvedPricingContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPricing = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // The backend API auto-detects country via Vercel/CF headers if ?country= is omitted.
      const response = await api.get<ResolvedPricingContext>("/api/v1/public/pricing/resolve");
      setPricing(response);
    } catch (err: unknown) {
      console.error("Failed to load geo-pricing:", err);
      setError(err instanceof Error ? err : new Error("Failed to load pricing"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const formatPrice = (amount: number, forceCurrency?: string) => {
    if (pricing && !forceCurrency) {
      // If we have resolved geo-pricing, format with the local currency and symbol
      const { currency } = pricing;
      // Many zero-decimal currencies use $ as symbol (like COP, CLP)
      // Some need it before, some after. We use standard Intl.NumberFormat
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.code,
        minimumFractionDigits: currency.is_zero_decimal ? 0 : currency.decimals,
        maximumFractionDigits: currency.is_zero_decimal ? 0 : currency.decimals,
      }).format(amount);
    }

    // Fallback: Default USD formatting
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: forceCurrency || "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <GeoPricingContext.Provider value={{ pricing, isLoading, error, refresh: fetchPricing, formatPrice }}>
      {children}
    </GeoPricingContext.Provider>
  );
};

export const useGeoPricing = () => {
  const context = useContext(GeoPricingContext);
  if (context === undefined) {
    throw new Error("useGeoPricing must be used within a GeoPricingProvider");
  }
  return context;
};
