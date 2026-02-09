/**
 * Marketplace Feature - Barrel Export
 * Clean Architecture: Single entry point for the marketplace feature
 */

// Types
export * from "./types";

// Store
export { useMarketplaceStore } from "./store";

// API
export { marketplaceApi } from "./api/marketplace.api";

// Services
export { marketplaceService } from "./services/marketplace.service";

// Hooks
export { useMarketplaceProducts } from "./hooks/useMarketplaceProducts";
export { useProductDetail } from "./hooks/useProductDetail";
export { useSellerProfile } from "./hooks/useSellerProfile";
export { useReviews } from "./hooks/useReviews";

// Components
export { ProductCard } from "./components/ProductCard";
export { ProductGrid } from "./components/ProductGrid";
export { MarketplaceHeader } from "./components/MarketplaceHeader";
export { ReviewCard, ReviewList, ReviewForm } from "./components/reviews";
