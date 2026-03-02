import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { MarketplaceProduct } from "../types";
import { useMarketplaceCouponStore } from "../store";
import { settingsApi } from "@/features/settings/api/settings.api";
import { useApiAuth } from "@/lib/use-api-auth";

export function useCheckoutReturn(
  products: MarketplaceProduct[],
  isLoading: boolean
) {
  const searchParams = useSearchParams();
  const { token } = useApiAuth();
  const { clearCoupon } = useMarketplaceCouponStore();
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [purchaseFlowStep, setPurchaseFlowStep] = useState(1);
  const processedReturn = useRef(false);

  useEffect(() => {
    const isSuccess = searchParams.get("success") === "true";
    const productIdFromUrl = searchParams.get("product_id");

    if (isSuccess && !selectedProduct && !processedReturn.current) {
      // Wait until products have at least finished loading before grabbing them
      if (isLoading && products.length === 0) return;

      processedReturn.current = true;
      // 1. Clear coupon automatically because it was definitely used in the checkout
      clearCoupon();
      if (token) {
        settingsApi.updatePreferences({ marketplace_active_coupon: null }, token).catch(console.error);
      }

      // 2. Try to find the real product
      const foundProduct = products.find((p) => p.id === productIdFromUrl);

      if (foundProduct) {
        // Use setTimeout to avoid synchronous state update within effect
        setTimeout(() => {
          setPurchaseFlowStep(3);
          setSelectedProduct(foundProduct);
          // Clear URL (client-side only trick to clean up without full reload)
          const url = new URL(window.location.href);
          url.searchParams.delete("success");
          url.searchParams.delete("product_id");
          window.history.replaceState({}, "", url.toString());
        }, 0);
      } else if (!isLoading && products.length > 0) {
        // Fallback placeholder
        setTimeout(() => {
          setPurchaseFlowStep(3);
          setSelectedProduct({
            id: productIdFromUrl || "pending",
            organization_id: "",
            slug: "pending-activation",
            name: "Tu Solución Profesional",
            short_description: "Activación en proceso",
            description: "Preparando tu entorno...",
            base_price: 0,
            currency: "USD",
            category_id: "",
            category_name: "Activation",
            min_plan_tier: 0,
            rating_avg: 5,
            rating_count: 0,
            thumbnail_url:
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp",
            images: [],
            tags: [],
            features: [],
            technical_stack: [],
            seller_name: "CELAEST",
            version: "1.0.0",
            created_at: new Date().toISOString(),
          });
        }, 0);
      }
    }
  }, [searchParams, products, isLoading, selectedProduct, clearCoupon, token]);

  return {
    selectedProduct,
    setSelectedProduct,
    purchaseFlowStep,
    setPurchaseFlowStep
  };
}
