export interface MarketplaceProduct {
  id: string;
  organization_id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  base_price: number;
  currency: string;
  category_id: string;
  category_name: string;
  rating_avg: number;
  rating_count: number;
  thumbnail_url: string;
  images: string[];
  tags: string[];
  features: string[];
  technical_stack: string[];
  seller_name: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface SellerProfile {
  organization_id: string;
  public_name: string;
  bio: string;
  website_url: string;
  support_email: string;
  logo_url: string;
  banner_url: string;
  rating_avg: number;
  product_count: number;
  price: number;
}

export interface ProductSearchResponse {
  products: MarketplaceProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchFilter {
  q?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  sort?: "price_asc" | "price_desc" | "rating" | "newest";
  page?: number;
  limit?: number;
}

export interface CreateReviewInput {
  product_id: string;
  rating: number;
  comment: string;
}

export interface CheckoutResponse {
  session_id: string;
  checkout_url: string;
}
