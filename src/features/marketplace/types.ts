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
  /**
   * 11-char YouTube id (not a URL). When present, the product detail modal
   * renders a lite-embed facade (thumbnail + play button → iframe on click)
   * instead of the static `thumbnail_url`. Empty/undefined falls back to
   * the image.
   */
  youtube_video_id?: string;
  images: string[];
  tags: string[];
  features: string[];
  technical_stack: string[];
  seller_name: string;
  version: string;
  min_plan_tier: number;
  created_at: string;
}

export type ReviewStatus = "published" | "hidden" | "flagged" | "removed";

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  is_verified_purchase: boolean;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

export interface AdminReview extends Review {
  product_name: string;
  product_slug: string;
  user_email: string;
  thumbnail_url?: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminReviewListResponse {
  reviews: AdminReview[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminReviewFilter {
  status?: ReviewStatus | "";
  rating?: number;
  product_id?: string;
  user_id?: string;
  q?: string;
  page?: number;
  limit?: number;
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

export interface UpdateReviewInput {
  rating: number;
  comment: string;
}

export interface UpdateReviewStatusInput {
  status: ReviewStatus;
}

export interface CheckoutResponse {
  session_id: string;
  checkout_url: string;
}
